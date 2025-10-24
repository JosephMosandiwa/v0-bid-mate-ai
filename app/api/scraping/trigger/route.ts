import { ScrapingService } from "@/lib/services/scraping-service"
import type { NextRequest } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { sourceId, scrapeAll } = await request.json()

    // Verify authorization (you should add proper auth here)
    const authHeader = request.headers.get("authorization")
    if (!authHeader || authHeader !== `Bearer ${process.env.SCRAPING_API_KEY}`) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const scrapingService = new ScrapingService()

    if (scrapeAll) {
      console.log("[API] Triggering scrape for all active sources")
      const result = await scrapingService.scrapeAllActiveSources()
      return Response.json(result)
    } else if (sourceId) {
      console.log(`[API] Triggering scrape for source ${sourceId}`)
      const result = await scrapingService.scrapeSource(sourceId)
      return Response.json(result)
    } else {
      return Response.json({ error: "sourceId or scrapeAll required" }, { status: 400 })
    }
  } catch (error) {
    console.error("[API] Scraping trigger error:", error)
    return Response.json({ error: "Failed to trigger scraping" }, { status: 500 })
  }
}
