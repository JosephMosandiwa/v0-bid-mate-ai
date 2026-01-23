import { BaseScraper, type ScraperResult, type ScrapedTender } from "./base-scraper"

/**
 * OCDS Bulk Data Scraper
 * Downloads bulk tender data from National Treasury's Transparency Portal
 * Data available at: https://data.etenders.gov.za
 * Formats: JSON, CSV, Excel
 */
export class OCDSBulkScraper extends BaseScraper {
  private readonly DATA_PORTAL_URL = "https://data.etenders.gov.za"

  async scrape(): Promise<ScraperResult> {
    console.log("[OCDSBulkScraper] Starting bulk data download for", this.sourceName)

    try {
      // Fetch the latest monthly data package
      const currentDate = new Date()
      const year = currentDate.getFullYear()
      const month = String(currentDate.getMonth() + 1).padStart(2, "0")
      
      // Try current month first, then previous month
      const urls = [
        `${this.DATA_PORTAL_URL}/api/data/releases/${year}-${month}`,
        `${this.DATA_PORTAL_URL}/api/data/releases/${year}-${String(currentDate.getMonth()).padStart(2, "0")}`,
      ]

      let tenders: ScrapedTender[] = []

      for (const url of urls) {
        console.log("[OCDSBulkScraper] Attempting to fetch from:", url)
        
        try {
          const response = await fetch(url, {
            headers: {
              Accept: "application/json",
              "User-Agent": "BidMateAI/1.0",
            },
            signal: AbortSignal.timeout(60000), // 60 second timeout for bulk data
          })

          if (!response.ok) {
            console.log("[OCDSBulkScraper] URL not available:", url, response.status)
            continue
          }

          const data = await response.json()
          
          if (data.releases && Array.isArray(data.releases)) {
            console.log("[OCDSBulkScraper] Found", data.releases.length, "releases")
            
            for (const release of data.releases) {
              if (release.tender) {
                const normalized = this.normalizeOCDSRelease(release)
                if (normalized) {
                  tenders.push(normalized)
                }
              }
            }
            
            console.log("[OCDSBulkScraper] Normalized", tenders.length, "tenders")
            break // Got data, exit loop
          }
        } catch (fetchError) {
          console.error("[OCDSBulkScraper] Fetch error for", url, ":", fetchError)
          continue
        }
      }

      return {
        success: true,
        tenders,
        scrapedCount: tenders.length,
      }
    } catch (error) {
      console.error("[OCDSBulkScraper] Error:", error)
      return {
        success: false,
        tenders: [],
        scrapedCount: 0,
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }

  private normalizeOCDSRelease(release: any): ScrapedTender | null {
    try {
      const tender = release.tender
      if (!tender || !tender.title) return null

      const normalized: ScrapedTender = {
        tender_reference: tender.id || release.ocid,
        title: this.cleanText(tender.title),
        description: this.cleanText(tender.description || tender.title),
        organization: tender.procuringEntity?.name || release.buyer?.name || "Unknown",
        category: tender.category || tender.mainProcurementCategory || "General",
        province: tender.province,
        location: tender.deliveryLocation || tender.province || "South Africa",
        publish_date: tender.tenderPeriod?.startDate || release.date,
        close_date: tender.tenderPeriod?.endDate,
        estimated_value: tender.value?.amount ? `R ${tender.value.amount.toLocaleString()}` : undefined,
        contact_person: tender.contactPerson?.name,
        contact_email: tender.contactPerson?.email,
        contact_phone: tender.contactPerson?.telephoneNumber,
        tender_url: `https://etenders.gov.za/tender/${tender.id}`,
        tender_type: tender.procurementMethodDetails || tender.procurementMethod,
        procurement_method: tender.procurementMethod,
        procurement_category: tender.mainProcurementCategory,
        status: tender.status,
        delivery_location: tender.deliveryLocation,
        special_conditions: tender.specialConditions !== "N/A" ? tender.specialConditions : undefined,
        document_urls: tender.documents?.map((doc: any) => ({
          title: doc.title,
          url: doc.url,
          type: doc.documentType,
          format: doc.format,
        })),
        raw_data: {
          ocid: release.ocid,
          source: "OCDS Bulk Data",
          release_date: release.date,
        },
      }

      return this.normalizeTenderData(normalized)
    } catch (error) {
      console.error("[OCDSBulkScraper] Error normalizing release:", error)
      return null
    }
  }
}
