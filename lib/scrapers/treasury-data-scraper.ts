import { BaseScraper, type ScraperResult, type ScrapedTender } from "./base-scraper"

/**
 * National Treasury Data Portal Scraper
 * Fetches tender data from the Transparency Portal's downloadable datasets
 * Source: https://data.etenders.gov.za
 * 
 * Data includes:
 * - Planning stage procurement
 * - Tender advertisements  
 * - Awards
 * - Contracts
 */
export class TreasuryDataScraper extends BaseScraper {
  private readonly DATA_API_BASE = "https://data.etenders.gov.za/api"

  async scrape(): Promise<ScraperResult> {
    console.log("[TreasuryDataScraper] Starting data fetch for", this.sourceName)

    try {
      const tenders: ScrapedTender[] = []

      // Fetch recent tender advertisements
      const advertisementsUrl = `${this.DATA_API_BASE}/tenders?stage=tender&limit=100`
      
      console.log("[TreasuryDataScraper] Fetching tender advertisements...")
      
      try {
        const response = await fetch(advertisementsUrl, {
          headers: {
            Accept: "application/json",
            "User-Agent": "BidMateAI/1.0",
          },
          signal: AbortSignal.timeout(30000),
        })

        if (response.ok) {
          const data = await response.json()
          
          if (data.tenders && Array.isArray(data.tenders)) {
            for (const item of data.tenders) {
              const normalized = this.normalizeTreasuryTender(item)
              if (normalized) {
                tenders.push(normalized)
              }
            }
          } else if (data.releases && Array.isArray(data.releases)) {
            // OCDS format
            for (const release of data.releases) {
              if (release.tender) {
                const normalized = this.normalizeOCDSRelease(release)
                if (normalized) {
                  tenders.push(normalized)
                }
              }
            }
          }
        }
      } catch (fetchError) {
        console.error("[TreasuryDataScraper] API fetch failed, trying alternative endpoints...")
      }

      // If no tenders from API, try the OCDS releases endpoint
      if (tenders.length === 0) {
        console.log("[TreasuryDataScraper] Trying OCDS releases endpoint...")
        
        const ocdsUrl = "https://ocds-api.etenders.gov.za/api/OCDSReleases?PageNumber=1&PageSize=100"
        
        try {
          const response = await fetch(ocdsUrl, {
            headers: {
              Accept: "application/json",
              "User-Agent": "BidMateAI/1.0",
            },
            signal: AbortSignal.timeout(30000),
          })

          if (response.ok) {
            const data = await response.json()
            
            if (data.releases && Array.isArray(data.releases)) {
              for (const release of data.releases) {
                if (release.tender && release.tender.id) {
                  const normalized = this.normalizeOCDSRelease(release)
                  if (normalized) {
                    tenders.push(normalized)
                  }
                }
              }
            }
          }
        } catch (error) {
          console.error("[TreasuryDataScraper] OCDS endpoint also failed:", error)
        }
      }

      console.log("[TreasuryDataScraper] Total tenders fetched:", tenders.length)

      return {
        success: true,
        tenders,
        scrapedCount: tenders.length,
      }
    } catch (error) {
      console.error("[TreasuryDataScraper] Error:", error)
      return {
        success: false,
        tenders: [],
        scrapedCount: 0,
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }

  private normalizeTreasuryTender(item: any): ScrapedTender | null {
    try {
      if (!item.title && !item.description) return null

      const normalized: ScrapedTender = {
        tender_reference: item.tender_number || item.id,
        title: this.cleanText(item.title || item.description),
        description: this.cleanText(item.description || item.title),
        organization: item.procuring_entity || item.buyer_name || item.organization,
        category: item.category || item.procurement_category,
        province: item.province,
        location: item.delivery_location || item.province || "South Africa",
        publish_date: item.publication_date || item.advertised_date,
        close_date: item.closing_date || item.submission_deadline,
        estimated_value: item.estimated_value || item.contract_value,
        contact_person: item.contact_name,
        contact_email: item.contact_email,
        contact_phone: item.contact_phone,
        tender_url: item.url || item.tender_url,
        tender_type: item.tender_type || item.procurement_method,
        procurement_method: item.procurement_method,
        status: item.status,
        raw_data: {
          source: "Treasury Data Portal",
          original_id: item.id,
        },
      }

      return this.normalizeTenderData(normalized)
    } catch (error) {
      console.error("[TreasuryDataScraper] Error normalizing tender:", error)
      return null
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
        organization: tender.procuringEntity?.name || release.buyer?.name,
        category: tender.category || tender.mainProcurementCategory,
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
          source: "Treasury OCDS",
          release_date: release.date,
        },
      }

      return this.normalizeTenderData(normalized)
    } catch (error) {
      console.error("[TreasuryDataScraper] Error normalizing OCDS release:", error)
      return null
    }
  }
}
