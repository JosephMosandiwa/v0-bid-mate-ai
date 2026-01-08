import { BaseScraper, type ScraperResult, type ScrapedTender } from "./base-scraper"
import * as cheerio from "cheerio"

// Specialized scraper for CIDB Tenders (cidb.org.za)
export class CIDBScraper extends BaseScraper {
  async scrape(): Promise<ScraperResult> {
    try {
      console.log(`[v0] CIDBScraper: Starting scrape for ${this.sourceName}`)

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

      // CIDB has construction-specific tenders
      $("div.tender-item, table.cidb-tenders tr, div.construction-tender").each((_: any, element: any) => {
        const $el = $(element)

        const title = $el.find(".tender-title, td:first-child, h3, h4").text().trim()
        const reference = $el.find(".tender-ref, .reference-number").text().trim()
        const closeDate = $el.find(".closing-date, .close-date, td.date").text().trim()
        const link = $el.find("a").first().attr("href")
        const category = $el.find(".category, .tender-category").text().trim()
        const cidbGrade = $el.find(".cidb-grade, .grade").text().trim()

        if (title && title.length > 10) {
          const tender: ScrapedTender = {
            title: this.cleanText(title),
            tender_reference: reference || undefined,
            tender_url: link ? this.makeAbsoluteUrl(link, "https://www.cidb.org.za") : undefined,
            close_date: closeDate ? this.parseDate(closeDate) : undefined,
            categories: category ? [category] : ["Construction"],
            raw_data: {
              source: "CIDB",
              cidb_grade: cidbGrade || undefined,
              html: $el.html()?.substring(0, 500),
            },
          }
          tenders.push(tender)
        }
      })

      console.log(`[v0] CIDBScraper: Successfully extracted ${tenders.length} tenders`)

      return {
        success: true,
        tenders,
        scrapedCount: tenders.length,
      }
    } catch (error) {
      console.error(`[v0] CIDBScraper: Error:`, error)
      return {
        success: false,
        tenders: [],
        error: error instanceof Error ? error.message : "Unknown error",
        scrapedCount: 0,
      }
    }
  }

  // Use helper methods from BaseScraper: `cleanText`, `makeAbsoluteUrl`, `parseDate`
}
