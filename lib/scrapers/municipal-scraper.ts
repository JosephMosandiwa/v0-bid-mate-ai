import { BaseScraper, type ScraperResult, type ScrapedTender } from "./base-scraper"
import * as cheerio from "cheerio"

// Specialized scraper for Municipal tender portals
export class MunicipalScraper extends BaseScraper {
  private municipality: string

  constructor(sourceId: number, sourceName: string, sourceUrl: string, municipality: string) {
    super(sourceId, sourceName, sourceUrl)
    this.municipality = municipality
  }

  async scrape(): Promise<ScraperResult> {
    try {
      console.log(`[v0] MunicipalScraper: Starting scrape for ${this.municipality}`)

      const scrapingApiKey = process.env.SCRAPING_API_KEY
      let url = this.sourceUrl

      if (scrapingApiKey) {
        url = `http://api.scraperapi.com?api_key=${scrapingApiKey}&url=${encodeURIComponent(this.sourceUrl)}`
      }

      const response = await fetch(url, {
        headers: {
          "User-Agent": "BidMateAI-TenderBot/1.0 (Tender Aggregation Service)",
          Accept: "text/html",
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const html = await response.text()
      const $ = cheerio.load(html)
      const tenders: ScrapedTender[] = []

      // Municipal sites often use simple table or list formats
      $("table tbody tr, div.tender-item, li.tender, div.notice").each((_, element) => {
        const $el = $(element)

        const title = $el.find("td:first-child, .title, a, strong").first().text().trim()
        const link = $el.find("a").first().attr("href")
        const reference = this.extractReference($el.text())

        if (title && title.length > 10) {
          const tender: ScrapedTender = {
            title: this.cleanText(title),
            tender_reference: reference || undefined,
            tender_url: link ? this.makeAbsoluteUrl(link, this.sourceUrl) : undefined,
            source_level: "Municipal",
            raw_data: {
              source: `${this.municipality} Municipality`,
              municipality: this.municipality,
              html: $el.html()?.substring(0, 500),
            },
          }
          tenders.push(tender)
        }
      })

      console.log(`[v0] MunicipalScraper: Successfully extracted ${tenders.length} tenders`)

      return {
        success: true,
        tenders,
        scrapedCount: tenders.length,
      }
    } catch (error) {
      console.error(`[v0] MunicipalScraper: Error:`, error)
      return {
        success: false,
        tenders: [],
        error: error instanceof Error ? error.message : "Unknown error",
        scrapedCount: 0,
      }
    }
  }

  private cleanText(text: string): string {
    return text.trim().replace(/\s+/g, " ")
  }

  private makeAbsoluteUrl(link: string, baseUrl: string): string {
    if (link.startsWith("http")) return link
    try {
      return new URL(link, baseUrl).href
    } catch {
      return link
    }
  }

  private extractReference(text: string): string | null {
    const patterns = [
      /(?:Ref|Reference|Tender|No)[:\s]+([A-Z0-9\-/]+)/i,
      /([A-Z]{2,}\d{4}[-/]\d+)/,
      /BID[\s-]?(\d+[-/]\d+)/i,
    ]

    for (const pattern of patterns) {
      const match = text.match(pattern)
      if (match) {
        return match[1] || match[0]
      }
    }
    return null
  }
}
