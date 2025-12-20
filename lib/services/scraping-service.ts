import { createClient } from "@supabase/supabase-js"
import { ScraperFactory } from "../scrapers/scraper-factory"
import type { ScrapedTender } from "../scrapers/base-scraper"
import { DocumentService } from "./document-service"
import { engineOrchestrator } from "../engines/orchestrator"

interface PostScrapeHook {
  name: string
  execute: (tenders: any[], supabase: any) => Promise<void>
}

export class ScrapingService {
  private supabase
  private documentService
  private postScrapeHooks: PostScrapeHook[] = []

  constructor() {
    this.supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
    this.documentService = new DocumentService()

    this.registerHooks()
  }

  private registerHooks() {
    // Hook 1: Generate opportunities for users based on new tenders
    this.postScrapeHooks.push({
      name: "opportunity_matcher",
      execute: async (tenders, supabase) => {
        if (tenders.length === 0) return

        console.log(`[ScrapingService] Running opportunity matcher for ${tenders.length} tenders`)

        // Get all users with preferences
        const { data: users } = await supabase
          .from("strategist_user_preferences")
          .select("user_id, provinces, industries, experience_level, annual_turnover")
          .eq("onboarding_completed", true)

        if (!users || users.length === 0) return

        for (const user of users) {
          for (const tender of tenders) {
            const matchScore = this.calculateMatchScore(tender, user)

            if (matchScore >= 0.3) {
              // Create opportunity record
              await supabase.from("strategist_opportunities").upsert(
                {
                  user_id: user.user_id,
                  scraped_tender_id: tender.id,
                  match_score: matchScore,
                  match_reasons: this.getMatchReasons(tender, user),
                  opportunity_type: matchScore >= 0.7 ? "high_margin" : matchScore >= 0.5 ? "strategic" : "growth",
                  is_viewed: false,
                  is_saved: false,
                  is_dismissed: false,
                  expires_at: tender.close_date,
                },
                { onConflict: "user_id, scraped_tender_id" },
              )
            }
          }
        }

        console.log(`[ScrapingService] Opportunity matching complete`)
      },
    })

    // Hook 2: Create alerts for high-match opportunities
    this.postScrapeHooks.push({
      name: "alert_generator",
      execute: async (tenders, supabase) => {
        if (tenders.length === 0) return

        console.log(`[ScrapingService] Checking for alert-worthy tenders`)

        // Get users with notification preferences enabled
        const { data: users } = await supabase
          .from("strategist_user_preferences")
          .select("user_id, notification_preferences")
          .eq("onboarding_completed", true)

        if (!users) return

        for (const user of users) {
          const prefs = user.notification_preferences || {}
          if (!prefs.new_opportunities) continue

          // Get high-match opportunities created in this batch
          const { data: opportunities } = await supabase
            .from("strategist_opportunities")
            .select("id, match_score, scraped_tender_id")
            .eq("user_id", user.user_id)
            .gte("match_score", 0.6)
            .in(
              "scraped_tender_id",
              tenders.map((t) => t.id),
            )

          if (opportunities && opportunities.length > 0) {
            await supabase.from("strategist_alerts").insert({
              user_id: user.user_id,
              alert_type: "new_opportunity",
              title: `${opportunities.length} New Matching Tenders`,
              message: `We found ${opportunities.length} new tender${opportunities.length > 1 ? "s" : ""} that match your profile. Check them out!`,
              priority: opportunities.some((o) => o.match_score >= 0.8) ? "high" : "medium",
              action_url: "/dashboard/strategist?tab=opportunities",
              action_label: "View Opportunities",
            })
          }
        }
      },
    })

    // Hook 3: Log scraping stats for analytics
    this.postScrapeHooks.push({
      name: "stats_logger",
      execute: async (tenders, supabase) => {
        await supabase.from("scraping_usage_logs").insert({
          tenders_found: tenders.length,
          success: true,
          scrape_type: "batch",
          api_credits_used: 1,
        })
      },
    })
  }

  private calculateMatchScore(tender: any, userPrefs: any): number {
    let score = 0

    // Province match (25%)
    if (userPrefs.provinces?.length && tender.source_province) {
      const provinceMatch = userPrefs.provinces.some((p: string) =>
        tender.source_province?.toLowerCase().includes(p.toLowerCase()),
      )
      if (provinceMatch) score += 0.25
    }

    // Industry match (30%)
    if (userPrefs.industries?.length && tender.category) {
      const categoryLower = tender.category.toLowerCase()
      const industryMatch = userPrefs.industries.some(
        (ind: string) => categoryLower.includes(ind.toLowerCase()) || ind.toLowerCase().includes(categoryLower),
      )
      if (industryMatch) score += 0.3
    }

    // Value match (20%)
    if (userPrefs.annual_turnover && tender.estimated_value) {
      score += 0.2
    }

    // Deadline proximity (25%)
    if (tender.close_date) {
      const daysUntilClose = Math.ceil((new Date(tender.close_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
      if (daysUntilClose > 14) score += 0.25
      else if (daysUntilClose > 7) score += 0.15
      else score += 0.05
    }

    return Math.min(score, 1)
  }

  private getMatchReasons(tender: any, userPrefs: any): string[] {
    const reasons: string[] = []

    if (userPrefs.provinces?.some((p: string) => tender.source_province?.toLowerCase().includes(p.toLowerCase()))) {
      reasons.push("Matches your preferred province")
    }

    if (userPrefs.industries?.some((ind: string) => tender.category?.toLowerCase().includes(ind.toLowerCase()))) {
      reasons.push("Matches your industry focus")
    }

    if (tender.close_date) {
      const daysUntilClose = Math.ceil((new Date(tender.close_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
      if (daysUntilClose > 14) reasons.push("Good preparation time available")
      else if (daysUntilClose > 7) reasons.push("Adequate preparation time")
    }

    return reasons
  }

  async scrapeSource(sourceId: number) {
    try {
      console.log(`[ScrapingService] Starting scrape for source ${sourceId}`)

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

      const scraper = ScraperFactory.createScraper(source)
      const result = await scraper.scrape()

      let savedTenders: any[] = []
      if (result.success && result.tenders.length > 0) {
        console.log(`[ScrapingService] Saving ${result.tenders.length} tenders to database`)
        savedTenders = await this.saveTenders(sourceId, source, result.tenders)

        if (savedTenders && savedTenders.length > 0) {
          console.log(`[ScrapingService] Starting document download for ${savedTenders.length} tenders`)
          await this.downloadTenderDocuments(savedTenders)
        }

        console.log(`[ScrapingService] Running ${this.postScrapeHooks.length} post-scrape hooks`)
        for (const hook of this.postScrapeHooks) {
          try {
            await hook.execute(savedTenders, this.supabase)
          } catch (hookError) {
            console.error(`[ScrapingService] Hook ${hook.name} failed:`, hookError)
          }
        }
      }

      await this.updateSourceStats(sourceId, result)

      return {
        success: result.success,
        scrapedCount: result.scrapedCount,
        savedCount: savedTenders.length,
        error: result.error,
      }
    } catch (error) {
      console.error(`[ScrapingService] Error scraping source ${sourceId}:`, error)

      await this.supabase
        .from("tender_sources")
        .update({
          last_scrape_status: "failed",
          last_scrape_error: error instanceof Error ? error.message : "Unknown error",
        })
        .eq("id", sourceId)

      // Log failed scrape
      await this.supabase.from("scraping_usage_logs").insert({
        source_id: sourceId,
        tenders_found: 0,
        success: false,
        scrape_type: "single",
        error_message: error instanceof Error ? error.message : "Unknown error",
      })

      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }

  private async saveTenders(sourceId: number, source: any, tenders: ScrapedTender[]) {
    console.log(`[v0] ScrapingService: Processing ${tenders.length} tenders through engine orchestrator`)

    const validatedTenders: any[] = []

    for (const tender of tenders) {
      const result = await engineOrchestrator.processScrapedTender(tender)

      if (result.success && result.tender) {
        console.log(`[v0] ScrapingService: Tender validated - ${result.tender.title} (${result.validation?.grade})`)
        validatedTenders.push({
          source_id: sourceId,
          source_name: source.name,
          source_url: source.tender_page_url,
          source_level: source.level,
          source_province: source.province,
          ...result.tender,
          is_active: true,
          quality_score: result.validation?.completeness || 0,
          quality_grade: result.validation?.grade || "F",
        })
      } else {
        console.warn(`[v0] ScrapingService: Tender rejected - ${tender.title}: ${result.error}`)
      }
    }

    if (validatedTenders.length === 0) {
      console.log("[v0] ScrapingService: No tenders passed validation")
      return []
    }

    console.log(`[v0] ScrapingService: Saving ${validatedTenders.length} validated tenders to database`)

    const { data, error } = await this.supabase
      .from("scraped_tenders")
      .upsert(validatedTenders, {
        onConflict: "source_id,title",
        ignoreDuplicates: false,
      })
      .select()

    if (error) {
      console.error("[v0] ScrapingService: Error saving tenders:", error)
      throw error
    }

    console.log(`[v0] ScrapingService: Successfully saved ${validatedTenders.length} tenders`)
    return data || []
  }

  private async downloadTenderDocuments(tenders: any[]) {
    const scraperApiKey = process.env.SCRAPING_API_KEY

    for (const tender of tenders) {
      if (tender.document_urls && Array.isArray(tender.document_urls) && tender.document_urls.length > 0) {
        console.log(
          `[ScrapingService] Downloading ${tender.document_urls.length} documents for tender: ${tender.title}`,
        )

        try {
          // Handle both formats: string[] and {title: string, url: string}[]
          const urls = tender.document_urls.map((doc: any) => (typeof doc === "string" ? doc : doc.url)).filter(Boolean)

          if (urls.length > 0) {
            await this.documentService.downloadTenderDocuments(urls, tender.id, scraperApiKey)
          }
        } catch (error) {
          console.error(`[ScrapingService] Error downloading documents for tender ${tender.id}:`, error)
        }
      }
    }
  }

  private async updateSourceStats(sourceId: number, result: any) {
    const { data: currentSource } = await this.supabase
      .from("tender_sources")
      .select("total_tenders_scraped")
      .eq("id", sourceId)
      .single()

    const newCount = (currentSource?.total_tenders_scraped || 0) + (result.scrapedCount || 0)

    await this.supabase
      .from("tender_sources")
      .update({
        last_scraped_at: new Date().toISOString(),
        last_scrape_status: result.success ? "success" : "failed",
        last_scrape_error: result.error || null,
        total_tenders_scraped: result.success ? newCount : currentSource?.total_tenders_scraped || 0,
      })
      .eq("id", sourceId)
  }

  async scrapeAllActiveSources(progressId?: string) {
    console.log("[v0] ScrapingService: Starting scrape for all active sources")

    const { data: sources, error } = await this.supabase
      .from("tender_sources")
      .select("id, name, tender_page_url, scraping_enabled, is_active")
      .eq("is_active", true)
      .eq("scraping_enabled", true)

    if (error || !sources) {
      console.error("[v0] ScrapingService: Error fetching active sources:", error)
      if (progressId) {
        await this.supabase
          .from("scraping_progress")
          .update({ status: "failed", error_message: "Failed to fetch active sources" })
          .eq("id", progressId)
      }
      return { success: false, error: "Failed to fetch active sources" }
    }

    console.log(`[v0] ScrapingService: Found ${sources.length} active sources to scrape`)

    if (sources.length === 0) {
      console.warn("[v0] ScrapingService: ⚠️ WARNING - NO ACTIVE SOURCES FOUND!")
      console.warn("[v0] ScrapingService: Please check the tender_sources table:")
      console.warn("[v0] ScrapingService: - Ensure rows exist in the table")
      console.warn("[v0] ScrapingService: - Ensure is_active = true")
      console.warn("[v0] ScrapingService: - Ensure scraping_enabled = true")

      if (progressId) {
        await this.supabase
          .from("scraping_progress")
          .update({ status: "completed", completed_sources: 0, total_sources: 0 })
          .eq("id", progressId)
      }
    } else {
      sources.forEach((source, index) => {
        console.log(`[v0] ScrapingService: Source ${index + 1}: ${source.name} - ${source.tender_page_url}`)
      })

      if (progressId) {
        await this.supabase.from("scraping_progress").update({ total_sources: sources.length }).eq("id", progressId)
      }
    }

    if (sources.length === 0) {
      return {
        success: true,
        results: [],
        totalScraped: 0,
        sourcesScraped: 0,
        successfulSources: 0,
        message: "No active sources available to scrape",
      }
    }

    const results = []
    for (let i = 0; i < sources.length; i++) {
      const source = sources[i]
      console.log(`[v0] ScrapingService: Scraping source ${i + 1}/${sources.length}: ${source.name}`)

      if (progressId) {
        await this.supabase
          .from("scraping_progress")
          .update({
            current_source: source.name,
            current_source_id: source.id,
            completed_sources: i,
          })
          .eq("id", progressId)
      }

      const result = await this.scrapeSource(source.id)
      results.push({ sourceId: source.id, sourceName: source.name, ...result })

      if (progressId && result.scrapedCount) {
        const { data: currentProgress } = await this.supabase
          .from("scraping_progress")
          .select("total_tenders")
          .eq("id", progressId)
          .single()

        await this.supabase
          .from("scraping_progress")
          .update({
            total_tenders: (currentProgress?.total_tenders || 0) + result.scrapedCount,
          })
          .eq("id", progressId)
      }

      // Add delay between scrapes to be respectful
      await new Promise((resolve) => setTimeout(resolve, 2000))
    }

    const totalScraped = results.reduce((sum, r) => sum + (r.scrapedCount || 0), 0)
    const successCount = results.filter((r) => r.success).length

    if (progressId) {
      await this.supabase
        .from("scraping_progress")
        .update({
          status: "completed",
          completed_sources: sources.length,
          current_source: null,
        })
        .eq("id", progressId)
    }

    console.log(`[v0] ScrapingService: Completed scraping ${sources.length} sources, total tenders: ${totalScraped}`)

    return {
      success: true,
      results,
      totalScraped,
      sourcesScraped: sources.length,
      successfulSources: successCount,
    }
  }
}
