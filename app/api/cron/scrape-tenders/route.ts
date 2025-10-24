import { ScrapingService } from "@/lib/services/scraping-service"
import type { NextRequest } from "next/server"

// This endpoint can be called by Vercel Cron or external schedulers
export async function GET(request: NextRequest) {
  try {
    // Verify cron secret for security
    const authHeader = request.headers.get("authorization")
    const cronSecret = process.env.CRON_SECRET || process.env.SCRAPING_API_KEY

    if (!authHeader || authHeader !== `Bearer ${cronSecret}`) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log("[Cron] Starting scheduled tender scraping")

    const scrapingService = new ScrapingService()
    const result = await scrapingService.scrapeAllActiveSources()

    console.log("[Cron] Scraping completed:", result)

    return Response.json({
      success: true,
      message: "Scraping completed",
      ...result,
    })
  } catch (error) {
    console.error("[Cron] Scraping error:", error)
    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
