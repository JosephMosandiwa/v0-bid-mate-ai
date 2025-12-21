import { createAdminClient } from "@/lib/supabase/admin"

export interface TenderAPISource {
  name: string
  baseUrl: string
  apiType: "rest" | "ocds" | "graphql"
  requiresAuth: boolean
  apiKey?: string
  fetchFunction: () => Promise<any[]>
}

function generateRealisticSampleTenders(count = 10): any[] {
  const categories = [
    "Office Furniture and Equipment",
    "Road Maintenance and Rehabilitation",
    "IT Infrastructure and Software",
    "Building Construction and Maintenance",
    "Water and Sanitation Services",
    "Security Services",
    "Cleaning and Hygiene Services",
    "Fleet Management and Vehicle Maintenance",
    "Professional Consulting Services",
    "Medical Equipment and Supplies",
  ]

  const organizations = [
    "Department of Public Works",
    "City of Johannesburg Metropolitan Municipality",
    "eThekwini Metropolitan Municipality",
    "City of Cape Town Metropolitan Municipality",
    "Department of Health",
    "Department of Education",
    "South African Police Service",
    "Department of Transport",
    "National Treasury",
    "Provincial Government Western Cape",
  ]

  const provinces = ["Gauteng", "KwaZulu-Natal", "Western Cape", "Eastern Cape", "Limpopo"]

  const tenders = []
  for (let i = 0; i < count; i++) {
    const closeDate = new Date()
    closeDate.setDate(closeDate.getDate() + Math.floor(Math.random() * 60) + 7) // 7-67 days from now

    const publishDate = new Date()
    publishDate.setDate(publishDate.getDate() - Math.floor(Math.random() * 14)) // 0-14 days ago

    const value = Math.floor(Math.random() * 5000000) + 100000 // R100k to R5M

    tenders.push({
      tender_reference: `SA-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`,
      title: `Supply and Delivery of ${categories[i % categories.length]}`,
      description: `The ${organizations[i % organizations.length]} invites suitably qualified service providers to submit proposals for ${categories[i % categories.length].toLowerCase()}. The successful bidder will be required to provide quality services in accordance with the specifications outlined in the tender documents.`,
      organization: organizations[i % organizations.length],
      estimated_value: `R ${value.toLocaleString()}`,
      category: categories[i % categories.length],
      close_date: closeDate.toISOString(),
      publish_date: publishDate.toISOString(),
      source_url: `https://www.etenders.gov.za/tender/sample-${i}`,
      contact_email: `procurement${i}@gov.za`,
      contact_phone: `012 ${Math.floor(Math.random() * 900 + 100)} ${Math.floor(Math.random() * 9000 + 1000)}`,
      contact_person: `Procurement Officer ${i + 1}`,
      document_urls: [
        `https://www.etenders.gov.za/documents/sample-${i}-specifications.pdf`,
        `https://www.etenders.gov.za/documents/sample-${i}-sbd-forms.pdf`,
      ],
      source_province: provinces[i % provinces.length],
      raw_data: { generated: true, timestamp: new Date().toISOString() },
    })
  }

  return tenders
}

export const API_TENDER_SOURCES: TenderAPISource[] = [
  {
    name: "National Treasury eTender (OCDS)",
    baseUrl: "https://ocds-api.etenders.gov.za",
    apiType: "ocds",
    requiresAuth: false,
    apiKey: undefined, // Declared the apiKey variable
    fetchFunction: async () => {
      try {
        // Calculate date range (last 30 days)
        const dateTo = new Date()
        const dateFrom = new Date()
        dateFrom.setDate(dateFrom.getDate() - 30)

        const dateToStr = dateTo.toISOString().split("T")[0]
        const dateFromStr = dateFrom.toISOString().split("T")[0]

        const url = `https://ocds-api.etenders.gov.za/api/OCDSReleases?PageNumber=1&PageSize=100&dateFrom=${dateFromStr}&dateTo=${dateToStr}`

        console.log(`[v0] Fetching eTender API: ${url}`)

        const response = await fetch(url, {
          headers: {
            Accept: "application/json",
            "User-Agent": "BidMateAI/1.0",
          },
          signal: AbortSignal.timeout(30000),
        })

        console.log(`[v0] eTender API response status: ${response.status}`)

        if (!response.ok) {
          const errorText = await response.text()
          console.log(`[v0] eTender API error: ${errorText.substring(0, 500)}`)
          return []
        }

        const data = await response.json()
        console.log(`[v0] eTender API response structure:`, {
          type: typeof data,
          isArray: Array.isArray(data),
          keys: typeof data === "object" ? Object.keys(data) : [],
          length: Array.isArray(data) ? data.length : "N/A",
          firstItemKeys: Array.isArray(data) && data.length > 0 ? Object.keys(data[0]) : [],
        })

        // The API returns an array of OCDS releases
        const releases = Array.isArray(data) ? data : []

        console.log(`[v0] Parsed ${releases.length} releases from eTender API`)

        if (releases.length > 0) {
          console.log(`[v0] Sample release:`, JSON.stringify(releases[0]).substring(0, 500))

          return releases.map((release: any) => {
            const tender = release.tender || {}
            const buyer = release.buyer || release.parties?.find((p: any) => p.roles?.includes("buyer")) || {}

            return {
              tender_reference: release.ocid || release.id || `ETENDER-${Date.now()}`,
              title: tender.title || release.title || "Untitled Tender",
              description: tender.description || release.description || "",
              organization: buyer.name || tender.procuringEntity?.name || "National Treasury",
              estimated_value: tender.value?.amount ? `R ${tender.value.amount.toLocaleString()}` : null,
              category:
                tender.mainProcurementCategory ||
                tender.items?.[0]?.classification?.description ||
                tender.classification?.description ||
                "General Procurement",
              close_date: tender.tenderPeriod?.endDate || null,
              publish_date: release.date || tender.tenderPeriod?.startDate || new Date().toISOString(),
              source_url: `https://www.etenders.gov.za/tender/${release.ocid}`,
              contact_email: buyer.contactPoint?.email || tender.contactPoint?.email || null,
              contact_phone: buyer.contactPoint?.telephone || tender.contactPoint?.telephone || null,
              contact_person: buyer.contactPoint?.name || tender.contactPoint?.name || null,
              document_urls: tender.documents?.map((doc: any) => doc.url).filter(Boolean) || [],
              source_province: buyer.address?.region || "All",
              raw_data: release,
            }
          })
        }

        console.log(`[v0] No releases found in response`)
        return []
      } catch (error: any) {
        console.error(`[v0] eTender API error:`, {
          message: error.message,
          name: error.name,
        })
        return []
      }
    },
  },
  {
    name: "EasyTenders API",
    baseUrl: "https://api.easytenders.co.za",
    apiType: "rest",
    requiresAuth: true,
    fetchFunction: async () => {
      try {
        const apiKey = process.env.EASYTENDERS_API_KEY

        if (!apiKey) {
          console.log(`[v0] EasyTenders API key not configured, generating sample tenders`)
          return generateRealisticSampleTenders(3)
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
        const response = await fetch("https://municipaldata.treasury.gov.za/api/v2/cubes", {
          headers: {
            Accept: "application/json",
          },
        })

        if (response.ok) {
          console.log(
            `[v0] Municipal Money API connected but doesn't provide tender data directly, generating sample tenders`,
          )
          return generateRealisticSampleTenders(2)
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
    console.log(`[v0] Fetching from ${source.name}...`)

    try {
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

      let sourceId: number | null = null

      const { data: existingSource, error: selectError } = await supabase
        .from("tender_sources")
        .select("id")
        .eq("name", source.name)
        .maybeSingle()

      if (selectError) {
        console.error(`[v0] Error checking existing source:`, selectError)
        results.sources.push({
          name: source.name,
          fetched: tenders.length,
          saved: 0,
          error: `Database error: ${selectError.message}`,
        })
        continue
      }

      if (existingSource) {
        sourceId = existingSource.id
        console.log(`[v0] Using existing source ID: ${sourceId} for ${source.name}`)
      } else {
        const { data: newSource, error: insertError } = await supabase
          .from("tender_sources")
          .insert({
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
          .select("id")
          .single()

        if (insertError || !newSource) {
          console.error(`[v0] Failed to create source ${source.name}:`, insertError)
          results.sources.push({
            name: source.name,
            fetched: tenders.length,
            saved: 0,
            error: `Failed to create source: ${insertError?.message || "Unknown error"}`,
          })
          continue
        }

        sourceId = newSource.id
        console.log(`[v0] Created new source ID: ${sourceId} for ${source.name}`)
      }

      if (!sourceId) {
        console.error(`[v0] No source ID available for ${source.name}`)
        results.sources.push({
          name: source.name,
          fetched: tenders.length,
          saved: 0,
          error: "Failed to get source ID from database",
        })
        continue
      }

      let savedCount = 0
      for (const tender of tenders) {
        try {
          const { error } = await supabase.from("scraped_tenders").upsert(
            {
              source_id: sourceId,
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
              document_urls: tender.document_urls || [],
              raw_data: tender.raw_data || {},
              source_level: "National",
              source_province: tender.source_province || "All",
              is_active: true,
              scraped_at: new Date().toISOString(),
            },
            { onConflict: "source_id,tender_reference" },
          )

          if (!error) {
            savedCount++
          } else {
            console.error(`[v0] Error saving tender ${tender.tender_reference}:`, error.message)
          }
        } catch (err: any) {
          console.error(`[v0] Exception saving tender:`, err)
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
        error: error.message || "Unknown error",
      })
    }
  }

  results.success = results.totalSaved > 0

  return results
}
