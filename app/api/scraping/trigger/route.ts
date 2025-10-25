import { ScrapingService } from "@/lib/services/scraping-service"
import { createClient } from "@supabase/supabase-js"
import type { NextRequest } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

    const authHeader = request.headers.get("authorization")
    if (!authHeader) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.replace("Bearer ", "")
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token)

    if (authError || !user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { sourceId, scrapeAll } = await request.json()

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
