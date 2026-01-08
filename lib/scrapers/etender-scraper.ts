import { BaseScraper, type ScraperResult, type ScrapedTender } from "./base-scraper"
import * as cheerio from "cheerio"

// Specialized scraper for National Treasury eTenders Portal (etenders.gov.za)
export class ETenderScraper extends BaseScraper {
  async scrape(): Promise<ScraperResult> {
    try {
      console.log(`[v0] ETenderScraper: Starting scrape for ${this.sourceName}`)

      const scrapingApiKey = process.env.SCRAPING_API_KEY
      let url = this.sourceUrl

      if (scrapingApiKey) {
        url = `http://api.scraperapi.com?api_key=${scrapingApiKey}&url=${encodeURIComponent(this.sourceUrl)}&render=true`
        console.log(`[v0] ETenderScraper: Using ScraperAPI with JavaScript rendering`)
      }

      const response = await fetch(url, {
        headers: {
          "User-Agent": "BidMateAI-TenderBot/1.0 (Tender Aggregation Service)",
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.8,*/*;q=0.8",
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const html = await response.text()
      const $ = cheerio.load(html)
      const tenders: ScrapedTender[] = []

      // eTenders uses a table structure with specific classes
      $("table.table tbody tr, div.tender-row, div.opportunity-item").each((_: any, element: any) => {
        const $el = $(element)

        // Extract tender information
        const title = $el.find("td:first-child, .tender-title, .opportunity-title").text().trim()
        const reference = $el.find("td.reference, .tender-reference, .opportunity-reference").text().trim()
        const closeDate = $el.find("td.closing-date, .closing-date, .close-date").text().trim()
        const link = $el.find("a").first().attr("href")
        const description = $el.find("td.description, .tender-description, .opportunity-description").text().trim()

        if (title && title.length > 10) {
          const tender: ScrapedTender = {
            title: this.cleanText(title),
            description: description ? this.cleanText(description) : undefined,
            tender_reference: reference || undefined,
            tender_url: link ? this.makeAbsoluteUrl(link, "https://www.etenders.gov.za") : undefined,
            close_date: closeDate ? this.parseDate(closeDate) : undefined,
            raw_data: {
              source: "eTenders Portal",
              html: $el.html()?.substring(0, 500),
            },
          }
          tenders.push(tender)
        }
      })

      console.log(`[v0] ETenderScraper: Successfully extracted ${tenders.length} tenders`)

      return {
        success: true,
        tenders,
        scrapedCount: tenders.length,
      }
    } catch (error) {
      console.error(`[v0] ETenderScraper: Error:`, error)
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
