// ============================================
// AI TENDER STRATEGIST - OPPORTUNITY SERVICE
// ============================================

import { createClient } from "@/lib/supabase/server"
import type { StrategistOpportunity, StrategistUserPreferences, OpportunityType } from "../types"

export class OpportunityService {
  /**
   * Discover opportunities matching user profile
   */
  static async discoverOpportunities(
    userId: string,
    options?: {
      limit?: number
      types?: OpportunityType[]
      minScore?: number
    },
  ): Promise<StrategistOpportunity[]> {
    const supabase = await createClient()

    // Get user preferences
    const { data: preferences } = await supabase
      .from("strategist_user_preferences")
      .select("*")
      .eq("user_id", userId)
      .single()

    if (!preferences) {
      return []
    }

    // Get available tenders
    const { data: tenders } = await supabase
      .from("scraped_tenders")
      .select("id, title, source_name, description, close_date, category, estimated_value, source_province")
      .eq("is_active", true)
      .gte("close_date", new Date().toISOString())
      .order("close_date", { ascending: true })
      .limit(100)

    if (!tenders || tenders.length === 0) {
      return []
    }

    // Score and categorize opportunities
    const opportunities = tenders
      .map((tender) => this.scoreTenderMatch(tender, preferences))
      .filter((opp) => opp.match_score >= (options?.minScore || 0.3))
      .sort((a, b) => b.match_score - a.match_score)
      .slice(0, options?.limit || 10)

    // Save opportunities
    for (const opp of opportunities) {
      await supabase.from("strategist_opportunities").upsert(
        {
          user_id: userId,
          scraped_tender_id: opp.tender_id,
          match_score: opp.match_score,
          match_reasons: opp.match_reasons,
          opportunity_type: opp.opportunity_type,
          ai_insights: opp.ai_insights,
          expires_at: opp.expires_at,
        },
        { onConflict: "user_id, scraped_tender_id" },
      )
    }

    return opportunities.map((opp) => ({
      ...opp,
      id: crypto.randomUUID(),
      user_id: userId,
      scraped_tender_id: opp.tender_id,
      custom_tender_id: null,
      is_viewed: false,
      is_saved: false,
      is_dismissed: false,
      user_notes: null,
      estimated_margin: null,
      estimated_effort: null,
      created_at: new Date().toISOString(),
    }))
  }

  /**
   * Score a tender match against user preferences
   */
  private static scoreTenderMatch(
    tender: any,
    preferences: StrategistUserPreferences,
  ): {
    tender_id: string
    match_score: number
    match_reasons: string[]
    opportunity_type: OpportunityType
    ai_insights: Record<string, any>
    expires_at: string | null
  } {
    let score = 0
    const reasons: string[] = []
    const insights: Record<string, any> = {}

    // Province match (20 points)
    if (preferences.provinces?.length && tender.source_province) {
      const provinceMatch = preferences.provinces.some(
        (p: string) =>
          tender.source_province.toLowerCase().includes(p.toLowerCase()) ||
          p.toLowerCase().includes(tender.source_province.toLowerCase()),
      )
      if (provinceMatch) {
        score += 0.2
        reasons.push("Matches your preferred province")
      }
    }

    // Industry/Category match (25 points)
    if (preferences.industries?.length && tender.category) {
      const categoryLower = tender.category.toLowerCase()
      const industryMatch = preferences.industries.some(
        (ind: string) => categoryLower.includes(ind.toLowerCase()) || ind.toLowerCase().includes(categoryLower),
      )
      if (industryMatch) {
        score += 0.25
        reasons.push("Matches your industry focus")
      }
    }

    // Value match based on company size (20 points)
    if (preferences.annual_turnover && tender.estimated_value) {
      score += 0.15
      reasons.push("Contract value within your range")
    }

    // Deadline proximity (15 points - more time = better)
    if (tender.close_date) {
      const daysUntilClose = Math.ceil((new Date(tender.close_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
      if (daysUntilClose > 14) {
        score += 0.15
        reasons.push("Good preparation time available")
      } else if (daysUntilClose > 7) {
        score += 0.1
        reasons.push("Adequate preparation time")
      } else {
        score += 0.05
        insights.warning = "Limited preparation time"
      }
    }

    // Experience level consideration (20 points)
    if (preferences.experience_level === "beginner") {
      if (!tender.estimated_value || tender.estimated_value.includes("R") === false) {
        score += 0.2
        reasons.push("Good entry-level opportunity")
      }
    } else if (preferences.experience_level === "advanced") {
      score += 0.1
      reasons.push("Matches your experience level")
    }

    // Determine opportunity type
    let opportunityType: OpportunityType = "strategic"
    if (score >= 0.7) {
      opportunityType = "high_margin"
    } else if (score >= 0.5 && reasons.includes("Good preparation time available")) {
      opportunityType = "low_risk"
    } else if (preferences.experience_level === "beginner" && score >= 0.4) {
      opportunityType = "quick_win"
    } else if (score >= 0.4) {
      opportunityType = "growth"
    }

    return {
      tender_id: tender.id,
      match_score: Math.min(score, 1),
      match_reasons: reasons,
      opportunity_type: opportunityType,
      ai_insights: {
        ...insights,
        tender_title: tender.title,
        organization: tender.source_name,
        close_date: tender.close_date,
        category: tender.category,
      },
      expires_at: tender.close_date,
    }
  }

  /**
   * Get user's saved opportunities
   * Removed join with scraped_tenders - fetch tender data separately
   */
  static async getSavedOpportunities(userId: string): Promise<StrategistOpportunity[]> {
    const supabase = await createClient()

    // First get opportunities without join
    const { data: opportunities, error } = await supabase
      .from("strategist_opportunities")
      .select("*")
      .eq("user_id", userId)
      .eq("is_saved", true)
      .eq("is_dismissed", false)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("[Opportunity] Error fetching saved opportunities:", error)
      return []
    }

    if (!opportunities || opportunities.length === 0) {
      return []
    }

    // Get tender IDs and fetch tender data separately
    const tenderIds = opportunities.map((opp) => opp.scraped_tender_id).filter((id): id is string => id !== null)

    let tendersMap: Record<string, any> = {}

    if (tenderIds.length > 0) {
      const { data: tenders } = await supabase
        .from("scraped_tenders")
        .select("id, title, source_name, close_date, category, estimated_value")
        .in("id", tenderIds)

      if (tenders) {
        tendersMap = tenders.reduce(
          (acc, tender) => {
            acc[tender.id] = tender
            return acc
          },
          {} as Record<string, any>,
        )
      }
    }

    // Combine opportunities with tender data
    return opportunities.map((opp) => ({
      ...opp,
      tender: opp.scraped_tender_id ? tendersMap[opp.scraped_tender_id] || null : null,
    }))
  }

  /**
   * Update opportunity status
   */
  static async updateOpportunityStatus(
    opportunityId: string,
    updates: {
      is_viewed?: boolean
      is_saved?: boolean
      is_dismissed?: boolean
      user_notes?: string
    },
  ): Promise<boolean> {
    const supabase = await createClient()

    const { error } = await supabase.from("strategist_opportunities").update(updates).eq("id", opportunityId)

    return !error
  }

  /**
   * Create an opportunity from tender data
   */
  static async createOpportunity(params: {
    userId: string
    tenderId: string
    tenderType: "custom" | "scraped"
    tenderTitle: string
    tenderData: any
  }): Promise<any> {
    try {
      const supabase = await createClient()

      // Get user preferences for scoring
      const { data: preferences } = await supabase
        .from("strategist_user_preferences")
        .select("*")
        .eq("user_id", params.userId)
        .single()

      if (!preferences) {
        console.warn("[Opportunity] User preferences not found, skipping opportunity creation")
        return null
      }

      // Calculate match score
      const matchScore = this.calculateMatchScoreForTender(params.tenderData, preferences)

      if (matchScore < 0.3) {
        console.log("[Opportunity] Match score too low, skipping opportunity creation")
        return null
      }

      // Determine opportunity type
      let opportunityType: "high_margin" | "strategic" | "quick_win" | "low_risk" | "growth" = "strategic"
      if (matchScore >= 0.7) opportunityType = "high_margin"
      else if (matchScore >= 0.5) opportunityType = "low_risk"
      else if (matchScore >= 0.4) opportunityType = "growth"

      // Create opportunity
      const { data, error } = await supabase
        .from("strategist_opportunities")
        .upsert(
          {
            user_id: params.userId,
            scraped_tender_id: params.tenderType === "scraped" ? params.tenderId : null,
            custom_tender_id: params.tenderType === "custom" ? params.tenderId : null,
            match_score: matchScore,
            match_reasons: this.getMatchReasonsForTender(params.tenderData, preferences),
            opportunity_type: opportunityType,
            ai_insights: {
              tender_title: params.tenderTitle,
              analysis: "Automatically generated from tender data",
            },
            expires_at: params.tenderData.close_date || params.tenderData.deadline,
          },
          {
            onConflict: params.tenderType === "scraped" ? "user_id,scraped_tender_id" : "user_id,custom_tender_id",
          },
        )
        .select()
        .single()

      if (error) {
        console.error("[Opportunity] Error creating opportunity:", error)
        return null
      }

      return data
    } catch (error) {
      console.error("[Opportunity] Error in createOpportunity:", error)
      return null
    }
  }

  /**
   * Find similar opportunities for a tender
   */
  static async findSimilar(params: {
    userId: string
    tenderId: string
    tenderType: "custom" | "scraped"
  }): Promise<any[]> {
    try {
      const supabase = await createClient()

      // Get the source tender
      const table = params.tenderType === "custom" ? "user_custom_tenders" : "scraped_tenders"
      const { data: sourceTender } = await supabase.from(table).select("*").eq("id", params.tenderId).single()

      if (!sourceTender) {
        return []
      }

      // Find similar tenders based on category and location
      const { data: similarTenders } = await supabase
        .from("scraped_tenders")
        .select("id, title, source_name, category, source_province, close_date")
        .eq("is_active", true)
        .gte("close_date", new Date().toISOString())
        .neq("id", params.tenderType === "scraped" ? params.tenderId : "")
        .limit(5)

      if (!similarTenders || similarTenders.length === 0) {
        return []
      }

      // Filter by similarity (category or province match)
      const similar = similarTenders.filter((tender) => {
        const categoryMatch =
          sourceTender.category &&
          tender.category &&
          (tender.category.toLowerCase().includes(sourceTender.category.toLowerCase()) ||
            sourceTender.category.toLowerCase().includes(tender.category.toLowerCase()))

        const provinceMatch =
          sourceTender.source_province &&
          tender.source_province &&
          tender.source_province.toLowerCase() === sourceTender.source_province.toLowerCase()

        return categoryMatch || provinceMatch
      })

      return similar
    } catch (error) {
      console.error("[Opportunity] Error finding similar opportunities:", error)
      return []
    }
  }

  /**
   * Calculate match score for a tender
   */
  private static calculateMatchScoreForTender(tender: any, preferences: any): number {
    let score = 0

    // Category/Industry match
    if (preferences.industries?.length && tender.category) {
      const categoryMatch = preferences.industries.some((ind: string) =>
        tender.category.toLowerCase().includes(ind.toLowerCase()),
      )
      if (categoryMatch) score += 0.3
    }

    // Province match
    if (preferences.provinces?.length && (tender.source_province || tender.location)) {
      const province = tender.source_province || tender.location
      const provinceMatch = preferences.provinces.some((p: string) => province?.toLowerCase().includes(p.toLowerCase()))
      if (provinceMatch) score += 0.25
    }

    // Deadline consideration
    const deadline = tender.close_date || tender.deadline
    if (deadline) {
      const daysUntilClose = Math.ceil((new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
      if (daysUntilClose > 14) score += 0.2
      else if (daysUntilClose > 7) score += 0.15
      else score += 0.05
    }

    // Base score for any tender
    score += 0.25

    return Math.min(score, 1)
  }

  /**
   * Get match reasons for a tender
   */
  private static getMatchReasonsForTender(tender: any, preferences: any): string[] {
    const reasons: string[] = []

    if (preferences.industries?.length && tender.category) {
      const categoryMatch = preferences.industries.some((ind: string) =>
        tender.category.toLowerCase().includes(ind.toLowerCase()),
      )
      if (categoryMatch) reasons.push("Matches your industry expertise")
    }

    if (preferences.provinces?.length) {
      const province = tender.source_province || tender.location
      const provinceMatch = preferences.provinces.some((p: string) => province?.toLowerCase().includes(p.toLowerCase()))
      if (provinceMatch) reasons.push("Located in your preferred province")
    }

    const deadline = tender.close_date || tender.deadline
    if (deadline) {
      const daysUntilClose = Math.ceil((new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
      if (daysUntilClose > 14) reasons.push("Sufficient time to prepare quality bid")
    }

    if (reasons.length === 0) {
      reasons.push("General opportunity match")
    }

    return reasons
  }
}
