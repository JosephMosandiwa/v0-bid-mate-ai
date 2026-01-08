import { ScrapingService } from "@/lib/services/scraping-service"
import type { NextRequest } from "next/server"

// Run scraping 3 times daily at 6am, 12pm, and 6pm
export const maxDuration = 60

export async function GET(request: NextRequest) {
  try {
    // Verify cron secret for security
    const authHeader = request.headers.get("authorization")
    const cronSecret = process.env.CRON_SECRET || process.env.SCRAPING_API_KEY

    if (!authHeader || authHeader !== `Bearer ${cronSecret}`) {
      console.log("[Cron] Unauthorized request - invalid or missing auth header")
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log("[Cron] Starting scheduled tender scraping at", new Date().toISOString())

    const scrapingService = new ScrapingService()
    const result = await scrapingService.scrapeAllActiveSources()

    console.log("[Cron] Scraping completed:", {
      totalScraped: result.totalScraped,
      sourcesScraped: result.sourcesScraped,
      successfulSources: result.successfulSources,
    })

    return Response.json({
      ...result,
      success: result?.success ?? true,
      message: "Scraping completed",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("[Cron] Scraping error:", error)
    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
