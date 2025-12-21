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
    fetchFunction: async () => {
      // Try multiple endpoint variations
      const endpoints = [
        "https://ocds-api.etenders.gov.za/api/releases",
        "https://ocds-api.etenders.gov.za/releases",
        "https://data.etenders.gov.za/api/v1/releases",
      ]

      for (const endpoint of endpoints) {
        try {
          const thirtyDaysAgo = new Date()
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

          const url = `${endpoint}?releaseDate=${thirtyDaysAgo.toISOString().split("T")[0]}`

          console.log(`[v0] Trying eTender API: ${url}`)
          const response = await fetch(url, {
            headers: {
              Accept: "application/json",
              "User-Agent": "BidMateAI/1.0",
            },
          })

          if (response.ok) {
            const data = await response.json()
            console.log(`[v0] eTender API success:`, data)

            // Parse OCDS format
            const releases = data.releases || data.data || []
            return releases.map((release: any) => ({
              tender_reference: release.ocid || release.id || `ETENDER-${Date.now()}`,
              title: release.tender?.title || release.title || "Untitled Tender",
              description: release.tender?.description || release.description || "",
              organization: release.buyer?.name || release.tender?.procuringEntity?.name || "National Treasury",
              estimated_value: release.tender?.value?.amount ? `R ${release.tender.value.amount}` : null,
              category: release.tender?.items?.[0]?.classification?.description || "General Procurement",
              close_date: release.tender?.tenderPeriod?.endDate || null,
              publish_date: release.date || new Date().toISOString(),
              source_url: `https://www.etenders.gov.za/tender/${release.ocid}`,
              contact_email: release.buyer?.contactPoint?.email || null,
              contact_phone: release.buyer?.contactPoint?.telephone || null,
              contact_person: release.buyer?.contactPoint?.name || null,
              document_urls: release.tender?.documents?.map((doc: any) => doc.url) || [],
              raw_data: release,
            }))
          }
        } catch (error) {
          console.log(`[v0] eTender endpoint ${endpoint} failed:`, error)
          continue
        }
      }

      console.log(`[v0] All eTender API endpoints failed`)
      return []
    },
  },
  {
    name: "EasyTenders API",
    baseUrl: "https://api.easytenders.co.za",
    apiType: "rest",
    requiresAuth: true,
    fetchFunction: async () => {
      try {
        // Check if user has EasyTenders API key in env vars
        const apiKey = process.env.EASYTENDERS_API_KEY

        if (!apiKey) {
          console.log(`[v0] EasyTenders API key not configured`)
          return []
        }

        const response = await fetch("https://api.easytenders.co.za/v1/tenders", {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            Accept: "application/json",
          },
        })

        if (response.ok) {
          const data = await response.json()
          console.log(`[v0] EasyTenders API success:`, data)

          const tenders = data.tenders || data.data || []
          return tenders.map((tender: any) => ({
            tender_reference: tender.reference || tender.tender_id || `EASY-${Date.now()}`,
            title: tender.title || tender.name,
            description: tender.description || tender.details || "",
            organization: tender.organization || tender.buyer || "Unknown",
            estimated_value: tender.value || tender.estimated_value,
            category: tender.category || tender.classification,
            close_date: tender.closing_date || tender.deadline,
            publish_date: tender.published_date || new Date().toISOString(),
            source_url: tender.url || `https://easytenders.co.za/tender/${tender.reference}`,
            contact_email: tender.contact_email,
            contact_phone: tender.contact_phone,
            contact_person: tender.contact_person,
            document_urls: tender.documents || [],
            raw_data: tender,
          }))
        } else {
          console.log(`[v0] EasyTenders API failed: ${response.status}`)
          return []
        }
      } catch (error) {
        console.log(`[v0] EasyTenders API error:`, error)
        return []
      }
    },
  },
  {
    name: "Municipal Money API",
    baseUrl: "https://municipaldata.treasury.gov.za/api",
    apiType: "rest",
    requiresAuth: false,
    fetchFunction: async () => {
      try {
        // Note: Municipal Money API provides financial data, not tenders directly
        // But we can check for procurement-related datasets
        const response = await fetch("https://municipaldata.treasury.gov.za/api/v2/cubes", {
          headers: {
            Accept: "application/json",
          },
        })

        if (response.ok) {
          console.log(`[v0] Municipal Money API connected but doesn't provide tender data directly`)
          return []
        }

        return []
      } catch (error) {
        console.log(`[v0] Municipal Money API error:`, error)
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
    try {
      console.log(`[v0] Fetching from ${source.name}...`)

      // Fetch tenders from the API
      const tenders = await source.fetchFunction()

      console.log(`[v0] ${source.name} returned ${tenders.length} tenders`)

      if (tenders.length === 0) {
        results.sources.push({
          name: source.name,
          fetched: 0,
          saved: 0,
          error: "No tenders returned",
        })
        continue
      }

      // Get or create tender source in database
      let { data: dbSource } = await supabase.from("tender_sources").select("id").eq("name", source.name).single()

      if (!dbSource) {
        const { data: newSource, error: sourceError } = await supabase
          .from("tender_sources")
          .insert({
            name: source.name,
            level: "National",
            province: "All",
            tender_page_url: source.baseUrl,
            scraper_type: "api",
            is_active: true,
            scraping_enabled: true,
            notes: `API-based tender source - ${source.apiType.toUpperCase()}`,
          })
          .select("id")
          .single()

        if (sourceError) {
          console.error(`[v0] Error creating source:`, sourceError)
          results.sources.push({
            name: source.name,
            fetched: tenders.length,
            saved: 0,
            error: `Failed to create source: ${sourceError.message}`,
          })
          continue
        }

        dbSource = newSource
      }

      // Save tenders to database
      let savedCount = 0
      for (const tender of tenders) {
        try {
          const { error: insertError } = await supabase.from("scraped_tenders").upsert(
            {
              source_id: dbSource!.id,
              tender_reference: tender.tender_reference,
              title: tender.title,
              description: tender.description,
              source_name: tender.organization,
              category: tender.category,
              estimated_value: tender.estimated_value,
              close_date: tender.close_date,
              publish_date: tender.publish_date,
              source_url: tender.source_url,
              tender_url: tender.source_url,
              contact_email: tender.contact_email,
              contact_phone: tender.contact_phone,
              contact_person: tender.contact_person,
              document_urls: tender.document_urls,
              raw_data: tender.raw_data,
              source_level: "National",
              source_province: "All",
              is_active: true,
              scraped_at: new Date().toISOString(),
            },
            {
              onConflict: "source_id,tender_reference",
              ignoreDuplicates: false,
            },
          )

          if (!insertError) {
            savedCount++
          } else {
            console.error(`[v0] Error saving tender:`, insertError)
          }
        } catch (error) {
          console.error(`[v0] Error processing tender:`, error)
        }
      }

      results.totalFetched += tenders.length
      results.totalSaved += savedCount
      results.sources.push({
        name: source.name,
        fetched: tenders.length,
        saved: savedCount,
      })

      console.log(`[v0] ${source.name}: Saved ${savedCount}/${tenders.length} tenders`)
    } catch (error: any) {
      console.error(`[v0] Error fetching from ${source.name}:`, error)
      results.sources.push({
        name: source.name,
        fetched: 0,
        saved: 0,
        error: error.message,
      })
    }
  }

  results.success = results.totalSaved > 0
  return results
}
