import { createAdminClient } from "@/lib/supabase/admin"

/**
 * Fetches live tender data from the National Treasury eTenders OCDS API
 * @param options Configuration options for the fetch
 * @returns Promise with fetch results including fetched and saved counts
 */
export async function fetchFromETenderAPI(
  options: {
    daysBack?: number
    pageSize?: number
    pageNumber?: number
  } = {},
) {
  const { daysBack = 30, pageSize = 100, pageNumber = 1 } = options

  const supabase = createAdminClient()

  // Calculate date range
  const dateFrom = new Date()
  dateFrom.setDate(dateFrom.getDate() - daysBack)
  const dateTo = new Date()

  const dateFromStr = dateFrom.toISOString().split("T")[0]
  const dateToStr = dateTo.toISOString().split("T")[0]

  // Build API URL with proper query parameters
  const apiUrl = `https://ocds-api.etenders.gov.za/api/OCDSReleases?PageNumber=${pageNumber}&PageSize=${pageSize}&dateFrom=${dateFromStr}&dateTo=${dateToStr}`

  try {
    // Fetch from eTenders API
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "User-Agent": "BidMateAI/1.0",
      },
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error(`eTenders API returned status ${response.status}`)
    }

    const data = await response.json()

    // Validate response structure
    if (!data.releases || !Array.isArray(data.releases)) {
      throw new Error("Invalid API response structure - missing releases array")
    }

    // Get or create the tender source
    const sourceId = await getOrCreateETenderSource(supabase)

    // Parse and transform tenders from OCDS format
    const tenders = data.releases
      .filter((release: any) => release && release.tender && release.tender.id)
      .map((release: any) => ({
        // Required fields
        tender_reference: release.tender.id,
        title: release.tender.title || "Untitled Tender",
        description: release.tender.description || "",
        category: release.tender.category || "Uncategorized",
        source_id: sourceId,
        source_name: "National Treasury eTender (OCDS)",
        is_active: release.tender.status === "active",
        scraped_at: new Date().toISOString(),

        // Dates
        publish_date: release.date || new Date().toISOString(),
        close_date: release.tender.tenderPeriod?.endDate || null,

        // Location and value
        source_province: release.tender.province || null,
        estimated_value: release.tender.value?.amount ? `R ${release.tender.value.amount.toLocaleString()}` : null,

        // Contact information
        contact_person: release.tender.contactPerson?.name || null,
        contact_email: release.tender.contactPerson?.email || null,
        contact_phone: release.tender.contactPerson?.telephoneNumber || null,

        // URLs
        tender_url: `https://www.etenders.gov.za/`,
        source_url: `https://www.etenders.gov.za/`,

        // Store complete API response for reference
        raw_data: release,

        // Documents
        document_urls:
          release.tender.documents?.map((doc: any) => ({
            title: doc.title,
            url: doc.url,
            type: doc.documentType,
          })) || [],
      }))

    if (tenders.length === 0) {
      return {
        success: true,
        message: `No tenders found in date range ${dateFromStr} to ${dateToStr}`,
        fetched: 0,
        saved: 0,
        newTenders: 0,
        updatedTenders: 0,
      }
    }

    // Save to database with upsert to handle duplicates
    const { data: savedTenders, error: saveError } = await supabase
      .from("scraped_tenders")
      .upsert(tenders, {
        onConflict: "tender_reference,source_id",
        ignoreDuplicates: false,
      })
      .select("id, tender_reference")

    if (saveError) {
      throw new Error(`Database save failed: ${saveError.message}`)
    }

    return {
      success: true,
      message: `Successfully fetched ${tenders.length} tenders and saved ${savedTenders?.length || 0} to database`,
      fetched: tenders.length,
      saved: savedTenders?.length || 0,
      newTenders: savedTenders?.length || 0,
      updatedTenders: 0,
      nextPage: data.links?.next || null,
    }
  } catch (error: any) {
    console.error("[eTender API] Fetch failed:", error)
    throw error
  }
}

/**
 * Gets the existing eTender source or creates it if it doesn't exist
 */
async function getOrCreateETenderSource(supabase: any): Promise<number> {
  // First, try to find existing source
  const { data: existingSource } = await supabase
    .from("tender_sources")
    .select("id")
    .eq("name", "National Treasury eTender (OCDS)")
    .maybeSingle()

  if (existingSource) {
    return existingSource.id
  }

  // If not found, create it
  const { data: newSource, error: createError } = await supabase
    .from("tender_sources")
    .insert({
      name: "National Treasury eTender (OCDS)",
      level: "National",
      province: "National",
      tender_page_url: "https://www.etenders.gov.za/",
      scraper_type: "api",
      is_active: true,
      scraping_enabled: true,
    })
    .select("id")
    .single()

  if (createError || !newSource) {
    throw new Error(`Failed to create tender source: ${createError?.message || "Unknown error"}`)
  }

  return newSource.id
}
