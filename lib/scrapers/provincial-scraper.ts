import { BaseScraper, type ScraperResult, type ScrapedTender } from "./base-scraper"
import * as cheerio from "cheerio"

// Specialized scraper for Provincial Government tender portals
export class ProvincialScraper extends BaseScraper {
  private province: string

  constructor(sourceId: number, sourceName: string, sourceUrl: string, province: string) {
    super(sourceId, sourceName, sourceUrl)
    this.province = province
  }

  async scrape(): Promise<ScraperResult> {
    try {
      console.log(`[v0] ProvincialScraper: Starting scrape for ${this.province} - ${this.sourceName}`)

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

      // Provincial portals vary, use generic patterns
      $("table tbody tr, div.tender, div.notice, article.tender").each((_, element) => {
        const $el = $(element)

        const title = $el.find("td:first-child, .title, h3, h4, a").first().text().trim()
        const link = $el.find("a").first().attr("href")
        const dateText = $el.find("td.date, .date, .closing-date").text().trim()

        if (title && title.length > 10) {
          const tender: ScrapedTender = {
            title: this.cleanText(title),
            tender_url: link ? this.makeAbsoluteUrl(link, this.sourceUrl) : undefined,
            close_date: dateText ? this.parseDate(dateText) : undefined,
            source_province: this.province,
            source_level: "Provincial",
            raw_data: {
              source: `${this.province} Provincial Government`,
              html: $el.html()?.substring(0, 500),
            },
          }
          tenders.push(tender)
        }
      })

      console.log(`[v0] ProvincialScraper: Successfully extracted ${tenders.length} tenders`)

      return {
        success: true,
        tenders,
        scrapedCount: tenders.length,
      }
    } catch (error) {
      console.error(`[v0] ProvincialScraper: Error:`, error)
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

  private parseDate(dateStr: string): string {
    try {
      const date = new Date(dateStr)
      if (!isNaN(date.getTime())) {
        return date.toISOString()
      }
    } catch (error) {
      console.error(`[v0] ProvincialScraper: Error parsing date: ${dateStr}`)
    }
    return new Date().toISOString()
  }
}
