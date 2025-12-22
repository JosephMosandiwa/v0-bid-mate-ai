import { BaseScraper, type ScraperResult, type ScrapedTender } from "./base-scraper"

interface OCDSTender {
  ocid: string
  id: string
  date: string
  tag: string[]
  initiationType: string
  parties?: Array<{
    name: string
    id: string
    roles: string[]
    contactPoint?: {
      name?: string
      email?: string
      telephone?: string
    }
    address?: {
      streetAddress?: string
      locality?: string
      region?: string
      postalCode?: string
      countryName?: string
    }
  }>
  buyer?: {
    name: string
    id: string
  }
  tender?: {
    id: string
    title: string
    description?: string
    status: string
    value?: {
      amount: number
      currency: string
    }
    procurementMethod?: string
    procurementMethodDetails?: string
    mainProcurementCategory?: string
    tenderPeriod?: {
      startDate?: string
      endDate?: string
    }
    enquiryPeriod?: {
      startDate?: string
      endDate?: string
    }
    items?: Array<{
      id: string
      description: string
      classification?: {
        scheme: string
        id: string
        description: string
      }
    }>
    documents?: Array<{
      id: string
      documentType: string
      title: string
      description?: string
      url: string
      datePublished?: string
      format?: string
      language?: string
    }>
  }
  awards?: Array<{
    id: string
    title: string
    status: string
    date: string
    value?: {
      amount: number
      currency: string
    }
  }>
}

/**
 * eTender API Scraper - Uses official South African National Treasury API
 * API Documentation: https://ocds-api.etenders.gov.za/swagger/
 * Data Format: Open Contracting Data Standard (OCDS) compliant JSON
 */
export class ETenderApiScraper extends BaseScraper {
  private readonly API_BASE_URL = "https://ocds-api.etenders.gov.za/api"

  async scrape(): Promise<ScraperResult> {
    console.log("[v0] [ETenderApiScraper] Starting API-based scraping for", this.sourceName)
    console.log("[v0] [ETenderApiScraper] Source ID:", this.sourceId)
    console.log("[v0] [ETenderApiScraper] API Base URL:", this.API_BASE_URL)

    try {
      console.log("[v0] [ETenderApiScraper] Fetching recent tenders from API...")
      const tenders = await this.fetchRecentTenders()

      console.log(`[v0] [ETenderApiScraper] Found ${tenders.length} tenders from API`)

      if (tenders.length === 0) {
        console.log("[v0] [ETenderApiScraper] No tenders returned from API")
        return {
          success: true,
          tenders: [],
          scrapedCount: 0,
        }
      }

      const results: ScrapedTender[] = []

      for (const ocdsRelease of tenders) {
        console.log("[v0] [ETenderApiScraper] Processing OCDS release:", ocdsRelease.ocid || ocdsRelease.id)
        const normalized = this.normalizeOCDSToTender(ocdsRelease)

        if (normalized) {
          console.log("[v0] [ETenderApiScraper] Successfully normalized tender:", normalized.tender_reference)
          results.push(normalized)
        } else {
          console.log("[v0] [ETenderApiScraper] Skipped release (no valid tender data)")
        }
      }

      console.log(`[v0] [ETenderApiScraper] Converted ${results.length} OCDS releases to tender format`)

      return {
        success: true,
        tenders: results,
        scrapedCount: results.length,
      }
    } catch (error) {
      console.error("[v0] [ETenderApiScraper] Error scraping eTender API:", error)
      if (error instanceof Error) {
        console.error("[v0] [ETenderApiScraper] Error stack:", error.stack)
      }
      return {
        success: false,
        tenders: [],
        scrapedCount: 0,
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }

  private async fetchRecentTenders(): Promise<OCDSTender[]> {
    try {
      const endDate = new Date()
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - 30)

      const startDateStr = startDate.toISOString().split("T")[0]
      const endDateStr = endDate.toISOString().split("T")[0]

      const url = `${this.API_BASE_URL}/OCDSReleases?PageNumber=1&PageSize=100&dateFrom=${startDateStr}&dateTo=${endDateStr}`

      console.log("[v0] [ETenderApiScraper] Fetching from:", url)
      console.log("[v0] [ETenderApiScraper] Date range:", startDateStr, "to", endDateStr)

      const response = await fetch(url, {
        headers: {
          Accept: "application/json",
          "User-Agent": "BidMateAI/1.0",
        },
        signal: AbortSignal.timeout(30000),
      })

      console.log("[v0] [ETenderApiScraper] Response status:", response.status, response.statusText)

      if (!response.ok) {
        console.error("[v0] [ETenderApiScraper] API returned error status:", response.status)
        const errorText = await response.text()
        console.error("[v0] [ETenderApiScraper] Error response:", errorText)
        return []
      }

      const data = await response.json()
      console.log("[v0] [ETenderApiScraper] Response received, parsing...")
      console.log("[v0] [ETenderApiScraper] Response structure:", {
        hasReleases: "releases" in (data || {}),
        dataType: typeof data,
        keys: Object.keys(data || {}),
      })

      if (data && Array.isArray(data.releases)) {
        console.log("[v0] [ETenderApiScraper] Found", data.releases.length, "releases in response")
        const validReleases = data.releases.filter((r: any) => r && r.tender && r.tender.id)
        console.log("[v0] [ETenderApiScraper] Valid releases with tender data:", validReleases.length)
        return validReleases
      }

      console.log("[v0] [ETenderApiScraper] No releases array in response")
      return []
    } catch (error) {
      console.error("[v0] [ETenderApiScraper] Error fetching from API:", error)
      if (error instanceof Error) {
        console.error("[v0] [ETenderApiScraper] Error name:", error.name)
        console.error("[v0] [ETenderApiScraper] Error message:", error.message)
        console.error("[v0] [ETenderApiScraper] Error stack:", error.stack)
      }
      return []
    }
  }

  /**
   * Convert OCDS format to our tender format
   * Maps from the actual eTender API structure
   */
  private normalizeOCDSToTender(ocds: OCDSTender): ScrapedTender | null {
    try {
      const tender = ocds.tender

      if (!tender || !tender.title) {
        console.log("[v0] [ETenderApiScraper] Skipping release without tender or title")
        return null
      }

      // Find procuring entity (buyer)
      const procuringEntity = ocds.parties?.find((p) => p.roles.includes("procuringEntity")) || ocds.parties?.[0]
      const buyerName = procuringEntity?.name || "Unknown Organization"

      // Extract contact information
      const contactPoint = procuringEntity?.contactPoint
      const address = procuringEntity?.address

      // Build location from address fields
      const location = address
        ? [address.locality, address.region || address.countryName].filter(Boolean).join(", ")
        : "South Africa"

      // Extract category from items or mainProcurementCategory
      const category = tender.mainProcurementCategory || tender.items?.[0]?.classification?.description || "General"

      // Extract documents
      const documents =
        tender.documents?.map((doc) => ({
          title: doc.title || doc.documentType,
          url: doc.url,
        })) || []

      // Build normalized tender object using TenderEngine field hints
      const normalized: ScrapedTender = {
        tender_reference: tender.id || ocds.ocid,
        title: this.cleanText(tender.title),
        description: this.cleanText(tender.description || ""),
        organization: this.cleanText(buyerName),
        category,

        // Dates
        publish_date: tender.tenderPeriod?.startDate || ocds.date || undefined,
        close_date: tender.tenderPeriod?.endDate || undefined,

        // Value
        estimated_value: tender.value ? `R ${tender.value.amount.toLocaleString()}` : undefined,

        // Contact information
        contact_person: contactPoint?.name || undefined,
        contact_email: contactPoint?.email || undefined,
        contact_phone: contactPoint?.telephone || undefined,

        // Location
        location,

        // URLs
        tender_url: `https://etenders.gov.za/tender/${tender.id}`,

        // Documents
        document_urls: documents.length > 0 ? documents : undefined,

        // Additional fields
        tender_type: tender.procurementMethod || "Open",
        procurement_category: tender.mainProcurementCategory || undefined,

        // Raw OCDS data for debugging and compliance
        raw_data: {
          ocid: ocds.ocid,
          release_date: ocds.date,
          procurement_method: tender.procurementMethod,
          status: tender.status,
          tag: ocds.tag,
          source: "eTender API (OCDS)",
          api_version: "v1",
        },
      }

      // Validate and normalize through TenderEngine
      return this.normalizeTenderData(normalized)
    } catch (error) {
      console.error("[v0] [ETenderApiScraper] Error normalizing OCDS release:", error)
      return null
    }
  }
}
