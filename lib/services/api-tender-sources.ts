import { createAdminClient } from "@/lib/supabase/admin"

export interface TenderAPISource {
  name: string
  baseUrl: string
  apiType: "rest" | "ocds" | "graphql"
  requiresAuth: boolean
  apiKey?: string
  fetchFunction: () => Promise<any[]>
}

export const API_TENDER_SOURCES: TenderAPISource[] = [
  {
    name: "National Treasury eTender (OCDS)",
    baseUrl: "https://ocds-api.etenders.gov.za",
    apiType: "ocds",
    requiresAuth: false,
    apiKey: undefined,
    fetchFunction: async () => {
      try {
        const dateTo = new Date()
        const dateFrom = new Date()
        dateFrom.setDate(dateFrom.getDate() - 30)

        const dateToStr = dateTo.toISOString().split("T")[0]
        const dateFromStr = dateFrom.toISOString().split("T")[0]

        const url = `https://ocds-api.etenders.gov.za/api/OCDSReleases?PageNumber=1&PageSize=50&dateFrom=${dateFromStr}&dateTo=${dateToStr}`

        console.log(`[v0] eTender API URL: ${url}`)

        const response = await fetch(url, {
          headers: {
            Accept: "application/json",
            "User-Agent": "BidMateAI/1.0",
          },
          signal: AbortSignal.timeout(30000),
        })

        console.log(`[v0] eTender API Response Status: ${response.status}`)

        if (!response.ok) {
          const errorText = await response.text()
          console.error(`[v0] eTender API Error: ${errorText.substring(0, 500)}`)
          return []
        }

        const data = await response.json()

        console.log(`[v0] eTender API Response Type: ${typeof data}`)
        console.log(`[v0] eTender API Has releases: ${data?.releases ? "Yes" : "No"}`)

        if (!data || !Array.isArray(data.releases)) {
          console.log("[v0] ERROR: No releases array in response")
          console.log(`[v0] Response keys: ${Object.keys(data || {}).join(", ")}`)
          return []
        }

        const releases = data.releases
        console.log(`[v0] eTender API Total Releases: ${releases.length}`)

        const tenders = releases
          .filter((release: any) => {
            const hasData = release && release.tender && release.tender.id
            if (!hasData) {
              console.log(`[v0] Skipping empty release`)
            }
            return hasData
          })
          .map((release: any) => {
            const t = release.tender
            console.log(`[v0] Processing tender: ${t.id} - ${t.title}`)

            return {
              tender_reference: t.id,
              title: t.title || "Untitled Tender",
              description: t.description || "",
              organization: t.procuringEntity?.name || "Unknown Organization",
              estimated_value: t.value?.amount ? `R ${t.value.amount.toLocaleString()}` : null,
              category: t.category || "General",
              close_date: t.tenderPeriod?.endDate || null,
              publish_date: t.tenderPeriod?.startDate || release.date || new Date().toISOString(),
              source_url: `https://www.etenders.gov.za/tender/${t.id}`,
              contact_email: t.contactPerson?.email || null,
              contact_phone: t.contactPerson?.telephoneNumber || null,
              contact_person: t.contactPerson?.name || null,
              document_urls: (t.documents || []).map((doc: any) => doc.url).filter(Boolean),
              source_province: t.province || "National",
              delivery_location: t.deliveryLocation || null,
              raw_data: release,
            }
          })

        console.log(`[v0] eTender API Successfully Mapped: ${tenders.length} tenders`)

        if (tenders.length > 0) {
          console.log(`[v0] First tender sample:`, {
            ref: tenders[0].tender_reference,
            title: tenders[0].title,
            org: tenders[0].organization,
          })
        }

        return tenders
      } catch (error: any) {
        console.error(`[v0] eTender API Exception:`, error.message)
        console.error(`[v0] Stack:`, error.stack)
        return []
      }
    },
  },
]

export async function fetchFromAllAPISources(): Promise<{
  success: boolean
  totalFetched: number
  totalSaved: number
  sources: Array<{
    name: string
    fetched: number
    saved: number
    error?: string
  }>
}> {
  const results = {
    success: false,
    totalFetched: 0,
    totalSaved: 0,
    sources: [] as Array<{ name: string; fetched: number; saved: number; error?: string }>,
  }

  const supabase = createAdminClient()

  for (const source of API_TENDER_SOURCES) {
    console.log(`[v0] === Fetching from ${source.name} ===`)

    try {
      const tenders = await source.fetchFunction()

      console.log(`[v0] ${source.name} Returned: ${tenders.length} tenders`)

      if (tenders.length === 0) {
        results.sources.push({
          name: source.name,
          fetched: 0,
          saved: 0,
          error: "No tenders returned from API",
        })
        continue
      }

      let sourceId: number | null = null

      // First, try to find existing source
      const { data: existingSource } = await supabase
        .from("tender_sources")
        .select("id")
        .eq("name", source.name)
        .maybeSingle()

      if (existingSource) {
        sourceId = existingSource.id
        console.log(`[v0] Using Existing Source ID: ${sourceId}`)
      } else {
        // Create new source without chaining .select()
        console.log(`[v0] Creating New Source...`)
        const { error: insertError } = await supabase.from("tender_sources").insert({
          name: source.name,
          level: "National",
          province: "All Provinces",
          tender_page_url: source.baseUrl,
          scraper_type: "api",
          is_active: true,
          scraping_enabled: true,
          last_scraped_at: null,
          notes: `API integration for ${source.name}`,
        })

        if (insertError) {
          console.error(`[v0] Failed to Insert Source:`, insertError)
          results.sources.push({
            name: source.name,
            fetched: tenders.length,
            saved: 0,
            error: `Failed to create source: ${insertError.message}`,
          })
          continue
        }

        // Now select it back to get the ID
        const { data: newSource, error: selectError } = await supabase
          .from("tender_sources")
          .select("id")
          .eq("name", source.name)
          .single()

        if (selectError || !newSource) {
          console.error(`[v0] Failed to Retrieve New Source:`, selectError)
          results.sources.push({
            name: source.name,
            fetched: tenders.length,
            saved: 0,
            error: `Failed to retrieve source ID: ${selectError?.message || "Unknown"}`,
          })
          continue
        }

        sourceId = newSource.id
        console.log(`[v0] Created New Source ID: ${sourceId}`)
      }

      if (!sourceId) {
        console.error(`[v0] ERROR: No Source ID Available`)
        results.sources.push({
          name: source.name,
          fetched: tenders.length,
          saved: 0,
          error: "No source ID",
        })
        continue
      }

      let savedCount = 0
      for (const tender of tenders) {
        try {
          const tenderData = {
            source_id: sourceId,
            tender_reference: tender.tender_reference,
            title: tender.title,
            description: tender.description || "",
            source_name: tender.organization,
            category: tender.category,
            estimated_value: tender.estimated_value,
            close_date: tender.close_date,
            publish_date: tender.publish_date,
            source_url: tender.source_url,
            tender_url: tender.source_url,
            contact_email: tender.contact_email || null,
            contact_phone: tender.contact_phone || null,
            contact_person: tender.contact_person || null,
            document_urls: tender.document_urls || [],
            raw_data: tender.raw_data || tender,
            source_level: "National",
            source_province: tender.source_province || "All",
            is_active: true,
            scraped_at: new Date().toISOString(),
          }

          const { error } = await supabase
            .from("scraped_tenders")
            .upsert(tenderData, { onConflict: "source_id,tender_reference" })

          if (!error) {
            savedCount++
            console.log(`[v0] ✓ Saved: ${tenderData.tender_reference}`)
          } else {
            console.error(`[v0] ✗ Error saving ${tenderData.tender_reference}:`, error.message)
          }
        } catch (err: any) {
          console.error(`[v0] Exception saving tender:`, err.message)
        }
      }

      results.totalFetched += tenders.length
      results.totalSaved += savedCount
      results.sources.push({
        name: source.name,
        fetched: tenders.length,
        saved: savedCount,
      })

      console.log(`[v0] === ${source.name} Complete: Saved ${savedCount}/${tenders.length} ===`)
    } catch (error: any) {
      console.error(`[v0] ERROR fetching from ${source.name}:`, error.message)
      results.sources.push({
        name: source.name,
        fetched: 0,
        saved: 0,
        error: error.message || "Unknown error",
      })
    }
  }

  results.success = results.totalSaved > 0

  return results
}
