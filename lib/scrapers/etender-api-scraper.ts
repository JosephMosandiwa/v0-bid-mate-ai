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
    category?: string
    province?: string
    deliveryLocation?: string
    specialConditions?: string
    contactPerson?: {
      name?: string
      email?: string
      telephoneNumber?: string
    }
  }
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
   * Maps from the ACTUAL eTender API structure shown in sample data
   */
  private normalizeOCDSToTender(ocds: OCDSTender): ScrapedTender | null {
    try {
      const tender = ocds.tender

      if (!tender || !tender.title) {
        console.log("[v0] [ETenderApiScraper] Skipping release without tender or title")
        return null
      }

      const {
        id: tenderId,
        title,
        description,
        category, // Direct field in API response
        province, // Direct field in API response
        deliveryLocation, // Direct field in API response
        specialConditions,
        status,
        value,
        tenderPeriod,
        procurementMethod,
        procurementMethodDetails,
        contactPerson, // Direct nested object in API response
        documents,
        mainProcurementCategory,
      } = tender

      // Build location from deliveryLocation (actual field) and province
      const location = deliveryLocation || province || "South Africa"

      // Extract contact information directly from contactPerson object
      const contactName = contactPerson?.name
      const contactEmail = contactPerson?.email
      const contactPhone = contactPerson?.telephoneNumber

      // Extract organization name from OCDS buyer
      const organizationName = ocds.buyer?.name || "Unknown Organization"

      // Format estimated value
      const estimatedValue = value?.amount ? `R ${value.amount.toLocaleString()} ${value.currency}` : undefined

      // Format documents array
      const documentUrls = documents?.map((doc) => ({
        title: doc.title,
        url: doc.url,
        type: doc.documentType,
        format: doc.format,
      }))

      // Build comprehensive description using all available fields
      const fullDescription = [
        description,
        deliveryLocation ? `Delivery Location: ${deliveryLocation}` : null,
        specialConditions && specialConditions !== "N/A" ? `Special Conditions: ${specialConditions}` : null,
      ]
        .filter(Boolean)
        .join("\n\n")

      // Build normalized tender object with ALL fields properly mapped
      const normalized: ScrapedTender = {
        // Core required fields - all from actual API response
        tender_reference: tenderId,
        title: this.cleanText(title),
        description: this.cleanText(fullDescription || title),
        organization: this.cleanText(organizationName),
        category: this.cleanText(category || mainProcurementCategory || "General"),

        // Dates from tenderPeriod
        publish_date: tenderPeriod?.startDate || ocds.date,
        close_date: tenderPeriod?.endDate,

        // Value
        estimated_value: estimatedValue,

        // Contact information - directly from API
        contact_person: contactName,
        contact_email: contactEmail,
        contact_phone: contactPhone,

        // Location - using actual deliveryLocation field
        location: this.cleanText(location),

        // Source province - direct field from API
        source_province: province,

        // URLs
        tender_url: `https://etenders.gov.za/tender/${tenderId}`,

        // Documents - all available from API
        document_urls: documentUrls && documentUrls.length > 0 ? documentUrls : undefined,

        // Additional enrichment fields from actual API
        tender_type: procurementMethodDetails || procurementMethod || "Open Tender",
        procurement_category: mainProcurementCategory,

        // (special_conditions moved to raw_data only) - avoid top-level field not in ScrapedTender

        // delivery location handled via `location` and kept in raw_data; omit top-level field not in ScrapedTender

        // Raw OCDS data for full traceability
        raw_data: {
          ocid: ocds.ocid,
          release_date: ocds.date,
          tender_id: tenderId,
          procurement_method_details: procurementMethodDetails,
          tender_status: status,
          category: category,
          province: province,
          buyer_id: ocds.buyer?.id,
          buyer_name: organizationName,
          special_conditions: specialConditions,
          delivery_location: deliveryLocation,
          source: "eTender API (OCDS)",
          api_version: "v1",
          documents_count: documents?.length || 0,
        },
      }

      console.log("[v0] [ETenderApiScraper] Normalized tender with ALL fields:", {
        reference: normalized.tender_reference,
        title: normalized.title?.substring(0, 50),
        hasDescription: !!normalized.description && normalized.description.length > 50,
        organization: normalized.organization,
        category: normalized.category,
        source_province: normalized.source_province,
        hasPublishDate: !!normalized.publish_date,
        hasCloseDate: !!normalized.close_date,
        hasValue: !!normalized.estimated_value,
        hasContactPerson: !!normalized.contact_person,
        hasContactEmail: !!normalized.contact_email,
        hasContactPhone: !!normalized.contact_phone,
        location: normalized.location,
        hasDocuments: !!normalized.document_urls && normalized.document_urls.length > 0,
        documentsCount: normalized.document_urls?.length || 0,
        totalFieldsPopulated: Object.keys(normalized).filter(
          (k) => (normalized as any)[k] !== undefined && (normalized as any)[k] !== null && (normalized as any)[k] !== "",
        ).length,
      })

      // Normalize through TenderEngine for final validation
      const finalTender = this.normalizeTenderData(normalized)

      return finalTender
    } catch (error) {
      console.error("[v0] [ETenderApiScraper] Error normalizing OCDS release:", error)
      return null
    }
  }
}
