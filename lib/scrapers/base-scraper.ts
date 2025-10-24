// Base scraper class that all specific scrapers will extend
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

  constructor(sourceId: number, sourceName: string, sourceUrl: string) {
    this.sourceId = sourceId
    this.sourceName = sourceName
    this.sourceUrl = sourceUrl
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
}
