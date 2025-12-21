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
   * Uses the OCDS releases endpoint
   */
  private async fetchRecentTenders(): Promise<OCDSTender[]> {
    try {
      // Calculate date range (last 30 days)
      const endDate = new Date()
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - 30)

      const startDateStr = startDate.toISOString().split("T")[0]
      const endDateStr = endDate.toISOString().split("T")[0]

      // Fetch from API with date range
      const url = `${this.API_BASE_URL}/releases?dateFrom=${startDateStr}&dateTo=${endDateStr}&limit=100`

      console.log("[v0] ETenderApiScraper: Fetching from", url)

      const response = await fetch(url, {
        headers: {
          Accept: "application/json",
          "User-Agent": "BidMateAI/1.0",
        },
      })

      if (!response.ok) {
        console.error("[v0] ETenderApiScraper: API returned", response.status, response.statusText)
        return []
      }

      const data = await response.json()

      // OCDS format returns releases array
      if (data.releases && Array.isArray(data.releases)) {
        console.log("[v0] ETenderApiScraper: Successfully fetched", data.releases.length, "releases")
        return data.releases
      }

      console.log("[v0] ETenderApiScraper: No releases found in API response")
      return []
    } catch (error) {
      console.error("[v0] ETenderApiScraper: Error fetching from API:", error)
      return []
    }
  }

  /**
   * Convert OCDS format to our tender format
   */
  private normalizeOCDSToTender(ocds: OCDSTender): ScrapedTender | null {
    try {
      const tender = ocds.tender

      if (!tender || !tender.title) {
        return null
      }

      // Find buyer/procuring entity
      const buyer = ocds.buyer || ocds.parties?.find((p) => p.roles.includes("buyer"))

      // Extract contact info
      const contact = buyer?.contactPoint || ocds.parties?.find((p) => p.contactPoint)?.contactPoint

      // Extract location from buyer address
      const buyerParty = ocds.parties?.find((p) => p.id === buyer?.id)
      const location = buyerParty?.address
        ? [buyerParty.address.locality, buyerParty.address.region, "South Africa"].filter(Boolean).join(", ")
        : "South Africa"

      // Extract documents
      const documents =
        tender.documents?.map((doc) => ({
          title: doc.title || doc.documentType,
          url: doc.url,
        })) || []

      // Build tender object
      const normalized: ScrapedTender = {
        title: this.cleanText(tender.title),
        description: this.cleanText(tender.description || ""),
        organization: this.cleanText(buyer?.name || "Unknown Organization"),
        tender_reference: tender.id || ocds.ocid,
        category: tender.mainProcurementCategory || tender.items?.[0]?.classification?.description || "General",

        // Dates
        publish_date: tender.tenderPeriod?.startDate || undefined,
        close_date: tender.tenderPeriod?.endDate || undefined,

        // Value
        estimated_value: tender.value
          ? `R ${tender.value.amount.toLocaleString()} ${tender.value.currency}`
          : undefined,

        // Contact
        contact_person: contact?.name || undefined,
        contact_email: contact?.email || undefined,
        contact_phone: contact?.telephone || undefined,

        // Location
        location,

        // URLs
        tender_url: `https://etenders.gov.za/tender/${tender.id}`,

        // Documents
        document_urls: documents,

        // Additional fields
        tender_type: tender.procurementMethod || "Open",
        procurement_category: tender.mainProcurementCategory || undefined,

        // Raw data for debugging
        raw_data: {
          ocid: ocds.ocid,
          procurement_method: tender.procurementMethod,
          status: tender.status,
          tag: ocds.tag,
          source: "eTender API (OCDS)",
        },
      }

      return normalized
    } catch (error) {
      console.error("[v0] ETenderApiScraper: Error normalizing OCDS:", error)
      return null
    }
  }
}
