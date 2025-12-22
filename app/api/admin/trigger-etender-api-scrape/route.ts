// ============================================
// ADMIN: Trigger eTender API Scrape
// ============================================
// Manually trigger a scrape from the eTender OCDS API
// Uses the existing ScrapingService infrastructure

import { NextResponse } from "next/server"
import { ScrapingService } from "@/lib/services/scraping-service"
import { createAdminClient } from "@/lib/supabase/admin"

export async function POST() {
  try {
    console.log("[Admin] Starting eTender API scrape request")

    const supabase = createAdminClient()

    // Find the eTender API source
    const { data: source, error } = await supabase
      .from("tender_sources")
      .select("id, name, scraper_type, is_active, scraping_enabled")
      .eq("scraper_type", "etender_api")
      .single()

    if (error || !source) {
      console.error("[Admin] eTender API source not found:", error)
      return NextResponse.json(
        {
          success: false,
          error: "eTender API source not found in database",
          instructions: "Run this SQL script first: scripts/add-etender-api-source.sql",
        },
        { status: 404 },
      )
    }

    if (!source.is_active || !source.scraping_enabled) {
      return NextResponse.json(
        {
          success: false,
          error: "eTender API source is disabled",
          source: {
            id: source.id,
            name: source.name,
            is_active: source.is_active,
            scraping_enabled: source.scraping_enabled,
          },
        },
        { status: 400 },
      )
    }

    console.log(`[Admin] Triggering scrape for source ID ${source.id}: ${source.name}`)

    // Use ScrapingService to scrape this specific source
    // This will automatically flow through the engine pipeline
    const scrapingService = new ScrapingService()
    const result = await scrapingService.scrapeSource(source.id)

    if (result.success) {
      console.log(`[Admin] Scrape completed: ${result.scrapedCount} fetched, ${result.savedCount} saved`)

      return NextResponse.json({
        success: true,
        message: `Successfully processed ${result.scrapedCount} tenders from ${source.name}`,
        data: {
          scrapedCount: result.scrapedCount,
          savedCount: result.savedCount,
          sourceName: source.name,
          sourceId: source.id,
        },
      })
    } else {
      console.error("[Admin] Scrape failed:", result.error)

      return NextResponse.json(
        {
          success: false,
          error: result.error || "Scrape failed",
          message: "Failed to fetch tenders from eTender API",
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("[Admin] Error triggering eTender API scrape:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
