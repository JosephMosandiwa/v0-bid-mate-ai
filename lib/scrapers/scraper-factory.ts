import type { BaseScraper } from "./base-scraper"
import { IntelligentScraper } from "./intelligent-scraper"
import { ETenderApiScraper } from "./etender-api-scraper"
import { getSourceConfig } from "./source-configs"

// Legacy scrapers (kept for backwards compatibility but not preferred)
import { GenericHtmlScraper } from "./generic-html-scraper"
import { ETenderScraper } from "./etender-scraper"
import { CIDBScraper } from "./cidb-scraper"
import { ProvincialScraper } from "./provincial-scraper"
import { MunicipalScraper } from "./municipal-scraper"
import { PrivateSectorScraper } from "./private-sector-scraper"
import { OCDSBulkScraper } from "./ocds-bulk-scraper"
import { TreasuryDataScraper } from "./treasury-data-scraper"

export interface TenderSource {
  id: number
  name: string
  tender_page_url: string
  scraper_type?: string
  scraper_config?: any
}

/**
 * Scraper Factory
 * 
 * Creates the appropriate scraper for each tender source.
 * Prioritizes the new IntelligentScraper which uses source-specific configurations
 * for comprehensive data extraction.
 */
export class ScraperFactory {
  static createScraper(source: TenderSource): BaseScraper {
    const { id, name, tender_page_url, scraper_type, scraper_config } = source

    console.log(`[ScraperFactory] Creating scraper for ${name}`)
    console.log(`[ScraperFactory] Scraper type: ${scraper_type || "auto-detect"}`)

    // Check if we have a specific configuration for this source
    const sourceConfig = getSourceConfig(scraper_type || '')
    
    if (sourceConfig) {
      console.log(`[ScraperFactory] Found source config: ${sourceConfig.name} (${sourceConfig.type})`)
      
      // Use IntelligentScraper with the source configuration
      return new IntelligentScraper(id, name, tender_page_url, scraper_type || '')
    }

    // Special case for eTender API - optimized OCDS scraper
    if (scraper_type === "etender_api") {
      console.log(`[ScraperFactory] Using optimized eTender API scraper (OCDS format)`)
      return new ETenderApiScraper(id, name, tender_page_url)
    }

    // For other types, use IntelligentScraper with generic fallback
    console.log(`[ScraperFactory] Using IntelligentScraper with generic fallback`)
    return new IntelligentScraper(id, name, tender_page_url, scraper_type || 'generic')
  }

  /**
   * Get list of all supported scraper types
   */
  static getSupportedTypes(): string[] {
    return [
      'etender_api',      // National Treasury eTender API (OCDS)
      'cidb',             // CIDB Register of Projects
      'gtac',             // Government Technical Advisory Centre
      'provincial',       // Provincial government portals
      'municipal',        // Municipal tender portals
      'soe',              // State-Owned Enterprises
      'private_sector',   // Private sector tenders
      'generic',          // Generic HTML scraper
    ]
  }

  /**
   * Legacy method - kept for backwards compatibility
   */
  static createLegacyScraper(source: TenderSource): BaseScraper {
    const { id, name, tender_page_url, scraper_type, scraper_config } = source

    switch (scraper_type) {
      case "etender_api":
        return new ETenderApiScraper(id, name, tender_page_url)
      case "ocds_bulk":
        return new OCDSBulkScraper(id, name, tender_page_url)
      case "treasury_data":
        return new TreasuryDataScraper(id, name, tender_page_url)
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
      default:
        return new GenericHtmlScraper(id, name, tender_page_url, scraper_config)
    }
  }
}
