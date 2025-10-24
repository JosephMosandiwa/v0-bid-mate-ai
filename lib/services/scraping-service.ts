import { createClient } from "@supabase/supabase-js"
import { ScraperFactory } from "../scrapers/scraper-factory"
import type { ScrapedTender } from "../scrapers/base-scraper"

export class ScrapingService {
  private supabase

  constructor() {
    // Use service role key for server-side operations
    this.supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
  }

  async scrapeSource(sourceId: number) {
    try {
      console.log(`[ScrapingService] Starting scrape for source ${sourceId}`)

      // Get source details
      const { data: source, error: sourceError } = await this.supabase
        .from("tender_sources")
        .select("*")
        .eq("id", sourceId)
        .single()

      if (sourceError || !source) {
        throw new Error(`Source not found: ${sourceId}`)
      }

      if (!source.is_active || !source.scraping_enabled) {
        console.log(`[ScrapingService] Source ${sourceId} is not active or scraping is disabled`)
        return {
          success: false,
          message: "Source is not active or scraping is disabled",
        }
      }

      // Create scraper
      const scraper = ScraperFactory.createScraper(source)

      // Scrape tenders
      const result = await scraper.scrape()

      // Save tenders to database
      if (result.success && result.tenders.length > 0) {
        await this.saveTenders(sourceId, source, result.tenders)
      }

      // Update source statistics
      await this.updateSourceStats(sourceId, result)

      console.log(`[ScrapingService] Completed scrape for source ${sourceId}: ${result.scrapedCount} tenders`)

      return {
        success: result.success,
        scrapedCount: result.scrapedCount,
        error: result.error,
      }
    } catch (error) {
      console.error(`[ScrapingService] Error scraping source ${sourceId}:`, error)

      // Update source with error
      await this.supabase
        .from("tender_sources")
        .update({
          last_scrape_status: "failed",
          last_scrape_error: error instanceof Error ? error.message : "Unknown error",
        })
        .eq("id", sourceId)

      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }

  private async saveTenders(sourceId: number, source: any, tenders: ScrapedTender[]) {
    const tendersToInsert = tenders.map((tender) => ({
      source_id: sourceId,
      source_name: source.name,
      source_url: source.tender_page_url,
      source_level: source.level,
      source_province: source.province,
      tender_reference: tender.tender_reference,
      title: tender.title,
      description: tender.description,
      category: tender.category,
      publish_date: tender.publish_date,
      close_date: tender.close_date,
      opening_date: tender.opening_date,
      estimated_value: tender.estimated_value,
      contact_person: tender.contact_person,
      contact_email: tender.contact_email,
      contact_phone: tender.contact_phone,
      tender_url: tender.tender_url,
      document_urls: tender.document_urls,
      raw_data: tender.raw_data,
      is_active: true,
    }))

    // Insert tenders (upsert based on source_id + tender_reference or title)
    const { error } = await this.supabase.from("scraped_tenders").upsert(tendersToInsert, {
      onConflict: "source_id,title",
      ignoreDuplicates: false,
    })

    if (error) {
      console.error("[ScrapingService] Error saving tenders:", error)
      throw error
    }
  }

  private async updateSourceStats(sourceId: number, result: any) {
    const { error } = await this.supabase
      .from("tender_sources")
      .update({
        last_scraped_at: new Date().toISOString(),
        last_scrape_status: result.success ? "success" : "failed",
        last_scrape_error: result.error || null,
        total_tenders_scraped: result.success
          ? this.supabase.raw(`total_tenders_scraped + ${result.scrapedCount}`)
          : this.supabase.raw("total_tenders_scraped"),
      })
      .eq("id", sourceId)

    if (error) {
      console.error("[ScrapingService] Error updating source stats:", error)
    }
  }

  async scrapeAllActiveSources() {
    console.log("[ScrapingService] Starting scrape for all active sources")

    const { data: sources, error } = await this.supabase
      .from("tender_sources")
      .select("id")
      .eq("is_active", true)
      .eq("scraping_enabled", true)

    if (error || !sources) {
      console.error("[ScrapingService] Error fetching active sources:", error)
      return { success: false, error: "Failed to fetch active sources" }
    }

    const results = []
    for (const source of sources) {
      const result = await this.scrapeSource(source.id)
      results.push({ sourceId: source.id, ...result })

      // Add delay between scrapes to be respectful
      await new Promise((resolve) => setTimeout(resolve, 2000))
    }

    return {
      success: true,
      results,
      totalScraped: results.reduce((sum, r) => sum + (r.scrapedCount || 0), 0),
    }
  }
}
