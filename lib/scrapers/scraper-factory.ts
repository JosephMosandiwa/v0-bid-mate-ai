import type { BaseScraper } from "./base-scraper"
import { GenericHtmlScraper } from "./generic-html-scraper"
import { ETenderScraper } from "./etender-scraper"
import { CIDBScraper } from "./cidb-scraper"
import { ProvincialScraper } from "./provincial-scraper"
import { MunicipalScraper } from "./municipal-scraper"
import { PrivateSectorScraper } from "./private-sector-scraper"

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

    switch (scraper_type) {
      case "etender":
        return new ETenderScraper(id, name, tender_page_url)

      case "cidb":
        return new CIDBScraper(id, name, tender_page_url)

      case "provincial":
        return new ProvincialScraper(id, name, tender_page_url, scraper_config?.province || "Unknown")

      case "municipal":
        return new MunicipalScraper(id, name, tender_page_url, scraper_config?.municipality || "Unknown")

      case "private_sector":
        return new PrivateSectorScraper(id, name, tender_page_url)

      case "generic":
      default:
        return new GenericHtmlScraper(id, name, tender_page_url, scraper_config)
    }
  }
}
