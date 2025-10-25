import { ScrapingService } from "@/lib/services/scraping-service"
import { createClient } from "@supabase/supabase-js"
import type { NextRequest } from "next/server"

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] Scraping trigger API called")

    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

    // For now, allow scraping without strict user auth since we're using service role key
    // In production, you'd want to add proper admin role checking
    console.log("[v0] Using service role key for scraping operations")

    const { sourceId, scrapeAll } = await request.json()
    console.log("[v0] Request params:", { sourceId, scrapeAll })

    const scrapingService = new ScrapingService()

    if (scrapeAll) {
      console.log("[v0] Triggering scrape for all active sources")
      const result = await scrapingService.scrapeAllActiveSources()
      console.log("[v0] Scrape all result:", result)
      return Response.json(result)
    } else if (sourceId) {
      console.log(`[v0] Triggering scrape for source ${sourceId}`)
      const result = await scrapingService.scrapeSource(sourceId)
      console.log("[v0] Scrape result:", result)
      return Response.json(result)
    } else {
      console.log("[v0] Missing sourceId or scrapeAll parameter")
      return Response.json({ error: "sourceId or scrapeAll required" }, { status: 400 })
    }
  } catch (error) {
    console.error("[v0] Scraping trigger error:", error)
    return Response.json(
      { error: "Failed to trigger scraping", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
