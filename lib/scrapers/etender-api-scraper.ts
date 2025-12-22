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
    console.log("[v0] ETenderApiScraper: Starting API-based scraping for", this.sourceName)

    try {
      const tenders = await this.fetchRecentTenders()

      console.log(`[v0] ETenderApiScraper: Found ${tenders.length} tenders from API`)

      const results: ScrapedTender[] = []

      for (const ocdsRelease of tenders) {
        const normalized = this.normalizeOCDSToTender(ocdsRelease)

        if (normalized) {
          results.push(normalized)
        }
      }

      console.log(`[v0] ETenderApiScraper: Converted ${results.length} OCDS releases to tender format`)

      return {
        success: true,
        tenders: results,
        scrapedCount: results.length,
      }
    } catch (error) {
      console.error("[v0] ETenderApiScraper: Error scraping eTender API:", error)
      return {
        success: false,
        tenders: [],
        scrapedCount: 0,
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }

  /**
   * Fetch recent tenders from eTender API
   * Uses the OCDSReleases endpoint (not /releases)
   */
  private async fetchRecentTenders(): Promise<OCDSTender[]> {
    try {
      const endDate = new Date()
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - 30)

      const startDateStr = startDate.toISOString().split("T")[0]
      const endDateStr = endDate.toISOString().split("T")[0]

      // Official endpoint from Swagger docs
      const url = `${this.API_BASE_URL}/OCDSReleases?PageNumber=1&PageSize=100&dateFrom=${startDateStr}&dateTo=${endDateStr}`

      console.log("[ETenderApiScraper] Fetching from:", url)

      const response = await fetch(url, {
        headers: {
          Accept: "application/json",
          "User-Agent": "BidMateAI/1.0",
        },
        signal: AbortSignal.timeout(30000), // 30 second timeout
      })

      if (!response.ok) {
        console.error("[ETenderApiScraper] API returned", response.status, response.statusText)
        return []
      }

      const data = await response.json()
      console.log("[ETenderApiScraper] Response keys:", Object.keys(data || {}))

      // Response is an object with a "releases" array property
      if (data && Array.isArray(data.releases)) {
        console.log("[ETenderApiScraper] Found", data.releases.length, "releases")
        // Filter out empty releases
        const validReleases = data.releases.filter((r: any) => r && r.tender && r.tender.id)
        console.log("[ETenderApiScraper] Valid releases with tender data:", validReleases.length)
        return validReleases
      }

      console.log("[ETenderApiScraper] No releases array in response")
      return []
    } catch (error) {
      console.error("[ETenderApiScraper] Error fetching from API:", error)
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
        console.log("[ETenderApiScraper] Skipping release without tender or title")
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
      console.error("[ETenderApiScraper] Error normalizing OCDS release:", error)
      return null
    }
  }
}
