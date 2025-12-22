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
    console.log("[v0] [Admin] Starting eTender API scrape request")

    const supabase = createAdminClient()

    console.log("[v0] [Admin] Looking up eTender API source in database...")
    const { data: source, error } = await supabase
      .from("tender_sources")
      .select("id, name, scraper_type, is_active, scraping_enabled")
      .eq("scraper_type", "etender_api")
      .single()

    if (error || !source) {
      console.error("[v0] [Admin] eTender API source not found:", error)
      return NextResponse.json(
        {
          success: false,
          error: "eTender API source not found in database",
          instructions: "Run this SQL script first: scripts/add-etender-api-source.sql",
          dbError: error?.message,
        },
        { status: 404 },
      )
    }

    console.log("[v0] [Admin] Found source:", { id: source.id, name: source.name, type: source.scraper_type })

    if (!source.is_active || !source.scraping_enabled) {
      console.log("[v0] [Admin] Source is disabled")
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

    console.log(`[v0] [Admin] Initializing ScrapingService...`)
    const scrapingService = new ScrapingService()

    console.log(`[v0] [Admin] Triggering scrape for source ID ${source.id}: ${source.name}`)
    const result = await scrapingService.scrapeSource(source.id)

    console.log(`[v0] [Admin] Scrape result:`, {
      success: result.success,
      scrapedCount: result.scrapedCount,
      savedCount: result.savedCount,
      error: result.error,
    })

    if (result.success) {
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
      console.error("[v0] [Admin] Scrape failed with error:", result.error)

      return NextResponse.json(
        {
          success: false,
          error: result.error || "Scrape failed",
          message: "Failed to fetch tenders from eTender API",
          details: {
            scrapedCount: result.scrapedCount,
            savedCount: result.savedCount,
          },
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("[v0] [Admin] Exception in trigger endpoint:", error)
    if (error instanceof Error) {
      console.error("[v0] [Admin] Error stack:", error.stack)
    }
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        errorType: error instanceof Error ? error.constructor.name : typeof error,
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  return NextResponse.json(
    {
      success: false,
      error: "This endpoint only accepts POST requests",
      instructions: "Use the 'Engine-Integrated eTender Scrape' button on the admin page at /admin/etender-fetch",
      endpoint: "/api/admin/trigger-etender-api-scrape",
      method: "POST",
    },
    { status: 405 },
  )
}
