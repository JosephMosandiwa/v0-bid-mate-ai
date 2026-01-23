import { BaseScraper, type ScraperResult, type ScrapedTender } from "./base-scraper"
import * as cheerio from "cheerio"

// Scraper for private sector RFPs and tenders
export class PrivateSectorScraper extends BaseScraper {
  async scrape(): Promise<ScraperResult> {
    try {
      console.log(`[v0] PrivateSectorScraper: Starting scrape for ${this.sourceName}`)

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

      // Private sector often uses RFP, RFQ, RFI terminology
      $("div.rfp, div.rfq, div.opportunity, table tbody tr, div.procurement").each((_, element) => {
        const $el = $(element)

        const title = $el.find(".title, h3, h4, td:first-child, a").first().text().trim()
        const link = $el.find("a").first().attr("href")
        const description = $el.find(".description, p").text().trim()
        const type = this.extractTenderType($el.text())

        if (title && title.length > 10) {
          const tender: ScrapedTender = {
            title: this.cleanText(title),
            description: description ? this.cleanText(description) : undefined,
            tender_url: link ? this.makeAbsoluteUrl(link, this.sourceUrl) : undefined,
            tender_type: type,
            source_level: "Private Sector",
            raw_data: {
              source: "Private Sector",
              sector: "private",
              html: $el.html()?.substring(0, 500),
            },
          }
          tenders.push(tender)
        }
      })

      console.log(`[v0] PrivateSectorScraper: Successfully extracted ${tenders.length} tenders`)

      return {
        success: true,
        tenders,
        scrapedCount: tenders.length,
      }
    } catch (error) {
      console.error(`[v0] PrivateSectorScraper: Error:`, error)
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

  private extractTenderType(text: string): string {
    const upperText = text.toUpperCase()
    if (upperText.includes("RFP")) return "Request for Proposal"
    if (upperText.includes("RFQ")) return "Request for Quotation"
    if (upperText.includes("RFI")) return "Request for Information"
    if (upperText.includes("EOI")) return "Expression of Interest"
    return "Open Tender"
  }
}
