import { BaseScraper, type ScraperResult, type ScrapedTender } from "./base-scraper"
import * as cheerio from "cheerio"

// Generic HTML scraper for websites with standard HTML structure
export class GenericHtmlScraper extends BaseScraper {
  private config: {
    tenderListSelector?: string
    titleSelector?: string
    dateSelector?: string
    linkSelector?: string
    descriptionSelector?: string
  }

  constructor(sourceId: number, sourceName: string, sourceUrl: string, config?: any) {
    super(sourceId, sourceName, sourceUrl)
    this.config = config || {}
  }

  async scrape(): Promise<ScraperResult> {
    try {
      console.log(`[Scraper] Starting scrape for ${this.sourceName}`)

      const scrapingApiKey = process.env.SCRAPING_API_KEY
      let url = this.sourceUrl

      if (scrapingApiKey) {
        // Use ScraperAPI service (or similar) to handle the request
        url = `http://api.scraperapi.com?api_key=${scrapingApiKey}&url=${encodeURIComponent(this.sourceUrl)}`
        console.log(`[Scraper] Using ScraperAPI service for ${this.sourceName}`)
      }

      const response = await fetch(url, {
        headers: {
          "User-Agent": "BidMateAI-TenderBot/1.0 (Tender Aggregation Service)",
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const html = await response.text()
      const $ = cheerio.load(html)
      const tenders: ScrapedTender[] = []

      // Look for common tender patterns
      const tenderElements = this.findTenderElements($)

      console.log(`[Scraper] Found ${tenderElements.length} potential tender elements`)

      for (const element of tenderElements) {
        const tender = this.extractTenderData($, element)
        if (tender && tender.title) {
          tenders.push(tender)
        }
      }

      return {
        success: true,
        tenders,
        scrapedCount: tenders.length,
      }
    } catch (error) {
      console.error(`[Scraper] Error scraping ${this.sourceName}:`, error)
      return {
        success: false,
        tenders: [],
        error: error instanceof Error ? error.message : "Unknown error",
        scrapedCount: 0,
      }
    }
  }

  private findTenderElements($: cheerio.CheerioAPI): cheerio.Cheerio<cheerio.Element>[] {
    const selectors = [
      "table.tenders tr",
      "div.tender-item",
      "div.tender",
      "article.tender",
      ".tender-list .item",
      "table tbody tr",
      "ul.tenders li",
    ]

    for (const selector of selectors) {
      const elements = $(selector)
      if (elements.length > 0) {
        console.log(`[Scraper] Using selector: ${selector}`)
        return elements.toArray().map((el) => $(el))
      }
    }

    return []
  }

  private extractTenderData($: cheerio.CheerioAPI, element: cheerio.Cheerio<cheerio.Element>): ScrapedTender | null {
    try {
      // Try to find title
      const title = this.extractTitle($, element)
      if (!title) return null

      // Try to find link
      const link = this.extractLink($, element)

      // Try to find dates
      const dates = this.extractDates($, element)

      // Try to find description
      const description = this.extractDescription($, element)

      // Try to find reference number
      const reference = this.extractReference($, element)

      return {
        title: this.cleanText(title),
        description: description ? this.cleanText(description) : undefined,
        tender_reference: reference ? this.cleanText(reference) : undefined,
        tender_url: link ? this.makeAbsoluteUrl(link, this.sourceUrl) : undefined,
        publish_date: dates.publishDate,
        close_date: dates.closeDate,
        raw_data: {
          html: element.html()?.substring(0, 500), // Store first 500 chars for debugging
        },
      }
    } catch (error) {
      console.error("[Scraper] Error extracting tender data:", error)
      return null
    }
  }

  private extractTitle($: cheerio.CheerioAPI, element: cheerio.Cheerio<cheerio.Element>): string | null {
    const selectors = ["td.title", "td:first-child", ".tender-title", "h3", "h4", "a", "strong"]

    for (const selector of selectors) {
      const text = element.find(selector).first().text()
      if (text && text.trim().length > 10) {
        return text
      }
    }

    return null
  }

  private extractLink($: cheerio.CheerioAPI, element: cheerio.Cheerio<cheerio.Element>): string | null {
    const link = element.find("a").first().attr("href")
    return link || null
  }

  private extractDates(
    $: cheerio.CheerioAPI,
    element: cheerio.Cheerio<cheerio.Element>,
  ): {
    publishDate?: string
    closeDate?: string
  } {
    const datePatterns = [/(\d{4}[-/]\d{2}[-/]\d{2})/g, /(\d{2}[-/]\d{2}[-/]\d{4})/g]

    const text = element.text()
    const dates: string[] = []

    for (const pattern of datePatterns) {
      const matches = text.match(pattern)
      if (matches) {
        dates.push(...matches)
      }
    }

    return {
      publishDate: dates[0] ? this.parseDate(dates[0]) : undefined,
      closeDate: dates[1] ? this.parseDate(dates[1]) : undefined,
    }
  }

  private extractDescription($: cheerio.CheerioAPI, element: cheerio.Cheerio<cheerio.Element>): string | null {
    const selectors = [".description", "td:nth-child(2)", "p"]

    for (const selector of selectors) {
      const text = element.find(selector).first().text()
      if (text && text.trim().length > 20) {
        return text
      }
    }

    return null
  }

  private extractReference($: cheerio.CheerioAPI, element: cheerio.Cheerio<cheerio.Element>): string | null {
    const text = element.text()
    const patterns = [/(?:Ref|Reference|Tender|No)[:\s]+([A-Z0-9\-/]+)/i, /([A-Z]{2,}\d{4}[-/]\d+)/]

    for (const pattern of patterns) {
      const match = text.match(pattern)
      if (match) {
        return match[1] || match[0]
      }
    }

    return null
  }

  private cleanText(text: string): string {
    return text.trim().replace(/\s+/g, " ")
  }

  private makeAbsoluteUrl(link: string, baseUrl: string): string {
    if (link.startsWith("http")) {
      return link
    }
    return new URL(link, baseUrl).href
  }

  private parseDate(date: string): string {
    return new Date(date).toISOString()
  }
}
