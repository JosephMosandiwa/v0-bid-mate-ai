import type { BaseScraper } from "./base-scraper"
import { GenericHtmlScraper } from "./generic-html-scraper"

export interface TenderSource {
  id: number
  name: string
  tender_page_url: string
  scraper_type?: string
  scraper_config?: any
}

export class ScraperFactory {
  static createScraper(source: TenderSource): BaseScraper {
    const { id, name, tender_page_url, scraper_type, scraper_config } = source

    // For now, use generic HTML scraper for all sources
    // In the future, we can add custom scrapers for specific sources
    switch (scraper_type) {
      case "generic":
      default:
        return new GenericHtmlScraper(id, name, tender_page_url, scraper_config)
    }
  }
}
