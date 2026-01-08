import { ScrapingService } from "@/lib/services/scraping-service"
import { createClient } from "@supabase/supabase-js"
import type { NextRequest } from "next/server"

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] Scraping trigger API called")

    const scrapingApiKey = process.env.SCRAPING_API_KEY
    if (!scrapingApiKey) {
      console.warn(
        "[v0] WARNING: SCRAPING_API_KEY environment variable is not set! Scraping will use direct requests which may be blocked.",
      )
      console.warn(
        "[v0] To fix this, set the SCRAPING_API_KEY environment variable with a key from https://www.scraperapi.com",
      )
    } else {
      console.log("[v0] SCRAPING_API_KEY is configured (length:", scrapingApiKey.length, "chars)")
    }

    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

    console.log("[v0] Using service role key for scraping operations")

    const { sourceId, scrapeAll } = await request.json()
    console.log("[v0] Request params:", { sourceId, scrapeAll })

    const scrapingService = new ScrapingService()

    if (scrapeAll) {
      console.log("[v0] Triggering scrape for all active sources")

      console.log("[v0] Checking if scraping_progress table exists...")
      const { data: tableCheck, error: tableError } = await supabase.from("scraping_progress").select("id").limit(1)

      let progressId = null
      if (tableError) {
        console.error("[v0] WARNING: scraping_progress table does not exist or is inaccessible:", tableError.message)
        console.log("[v0] Continuing scraping without progress tracking")
      } else {
        console.log("[v0] scraping_progress table exists, creating progress record")
        const { data: progressData, error: insertError } = await supabase
          .from("scraping_progress")
          .insert({
            status: "in_progress",
            total_sources: 0,
            completed_sources: 0,
            current_source: "Initializing...",
            total_tenders: 0,
            started_at: new Date().toISOString(),
          })
          .select()
          .single()

        if (insertError) {
          console.error("[v0] Error creating progress record:", insertError)
        } else {
          progressId = progressData?.id
          console.log("[v0] Created progress record with ID:", progressId)
        }
      }

      console.log("[v0] Starting background scraping with progressId:", progressId)

      // Run scraping in background without blocking the response
      scrapingService
        .scrapeAllActiveSources(progressId)
        .then((result) => {
          console.log("[v0] Background scraping completed:", result)

          // Update progress as completed
          if (progressId) {
            (supabase
              .from("scraping_progress")
              .update({
                status: "completed",
                completed_at: new Date().toISOString(),
                total_tenders: result.totalScraped || 0,
              })
              .eq("id", progressId) as any)
              .then(() => console.log("[v0] Progress marked as completed"))
              .catch((err: any) => console.error("[v0] Error updating progress:", err))
          }
        })
        .catch((error) => {
          console.error("[v0] Background scraping error:", error)

          // Mark progress as failed
          if (progressId) {
            (supabase
              .from("scraping_progress")
              .update({
                status: "failed",
                completed_at: new Date().toISOString(),
                error_message: error instanceof Error ? error.message : "Unknown error",
              })
              .eq("id", progressId) as any)
              .then(() => console.log("[v0] Progress marked as failed"))
              .catch((err: any) => console.error("[v0] Error updating failed progress:", err))
          }
        })

      // Return immediately with progressId for tracking
      console.log("[v0] Returning immediately with progressId for polling")
      return Response.json({
        success: true,
        message: "Scraping started in background",
        progressId,
        polling: true,
      })
    } else if (sourceId) {
      console.log(`[v0] Triggering scrape for source ${sourceId}`)
      const result = await scrapingService.scrapeSource(sourceId)
      console.log("[v0] Scrape result:", JSON.stringify(result, null, 2))
      return Response.json(result)
    } else {
      console.log("[v0] Missing sourceId or scrapeAll parameter")
      return Response.json({ error: "sourceId or scrapeAll required" }, { status: 400 })
    }
  } catch (error) {
    console.error("[v0] Scraping trigger error:", error)
    return Response.json(
      {
        error: "Failed to trigger scraping",
        details: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}
