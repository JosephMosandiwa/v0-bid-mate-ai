// Base scraper class that all specific scrapers will extend
import { TenderService, TenderValidator } from "@/lib/engines/tenders"
import type { TenderField } from "@/lib/engines/tenders/types"

export interface ScrapedTender {
  tender_reference?: string
  title: string
  description?: string
  category?: string
  publish_date?: string
  close_date?: string
  opening_date?: string
  estimated_value?: string
  contact_person?: string
  contact_email?: string
  contact_phone?: string
  tender_url?: string
  document_urls?: Array<{ title: string; url: string }>
  raw_data?: any
  // Additional fields for comprehensive data capture
  organization?: string
  location?: string
  deadline?: string
  value?: string
  requirements?: string[]
  eligibility_criteria?: string[]
  submission_method?: string
  payment_terms?: string
  contract_duration?: string
  validity_period?: string
  compulsory_briefing?: string
  tender_type?: string
  procurement_category?: string
}

export interface ScraperResult {
  success: boolean
  tenders: ScrapedTender[]
  error?: string
  scrapedCount: number
}

export abstract class BaseScraper {
  protected sourceId: number
  protected sourceName: string
  protected sourceUrl: string
  protected tenderSchema: TenderField[]

  constructor(sourceId: number, sourceName: string, sourceUrl: string) {
    this.sourceId = sourceId
    this.sourceName = sourceName
    this.sourceUrl = sourceUrl
    this.tenderSchema = TenderService.getTenderSchema().fields
    console.log(`[v0] ${sourceName} scraper initialized with ${this.tenderSchema.length} field definitions`)
  }

  // Abstract method that each scraper must implement
  abstract scrape(): Promise<ScraperResult>

  // Helper method to clean text
  protected cleanText(text: string | null | undefined): string {
    if (!text) return ""
    return text.trim().replace(/\s+/g, " ")
  }

  // Helper method to extract dates
  protected parseDate(dateStr: string | null | undefined): string | undefined {
    if (!dateStr) return undefined

    try {
      const date = new Date(dateStr)
      if (isNaN(date.getTime())) return undefined
      return date.toISOString()
    } catch {
      return undefined
    }
  }

  // Helper method to validate URL
  protected isValidUrl(url: string): boolean {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  // Helper method to make absolute URLs
  protected makeAbsoluteUrl(url: string, baseUrl: string): string {
    if (this.isValidUrl(url)) return url

    try {
      const base = new URL(baseUrl)
      return new URL(url, base.origin).toString()
    } catch {
      return url
    }
  }

  protected getFieldExtractionHints(fieldName: string): TenderField | undefined {
    return this.tenderSchema.find((f) => f.name === fieldName)
  }

  protected validateExtractedTender(tenderData: any): {
    isValid: boolean
    score: number
    quality: string
  } {
    const validation = TenderValidator.validate(tenderData)
    const quality = TenderValidator.getQualityScore(tenderData)

    console.log(
      `[v0] Tender validation: ${quality.grade} (${quality.score}%) - ${validation.isValid ? "Valid" : "Invalid"}`,
    )
    console.log(`[v0] Missing fields: ${validation.missingFields.join(", ") || "None"}`)

    return {
      isValid: validation.isValid,
      score: quality.score,
      quality: quality.grade,
    }
  }

  protected normalizeTenderData(rawData: any): ScrapedTender {
    const normalized = TenderService.normalizeScrapedData(rawData)
    const validation = this.validateExtractedTender(normalized)

    return {
      ...normalized,
      raw_data: {
        ...rawData,
        quality_score: validation.score,
        quality_grade: validation.quality,
      },
    }
  }
}
