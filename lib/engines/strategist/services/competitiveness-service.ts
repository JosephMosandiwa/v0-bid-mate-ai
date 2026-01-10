// ============================================
// AI TENDER STRATEGIST - COMPETITIVENESS SERVICE
// ============================================

import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import type { StrategistCompetitivenessScore } from "../types"

export class CompetitivenessService {
  /**
   * Calculate competitiveness score for a user
   */
  static async calculateScore(params: {
    userId: string
    tenderId?: string
    tenderType?: "custom" | "scraped"
  }): Promise<StrategistCompetitivenessScore | null> {
    const supabase = await createClient()

    // Get user data
    const [preferencesResult, companyResult, profileResult] = await Promise.all([
      supabase.from("strategist_user_preferences").select("*").eq("user_id", params.userId).single(),
      supabase.from("companies").select("*").eq("user_id", params.userId).single(),
      supabase.from("profiles").select("*").eq("id", params.userId).single(),
    ])

    const preferences = preferencesResult.data
    const company = companyResult.data
    const profile = profileResult.data

    // Calculate component scores
    const documentationScore = this.calculateDocumentationScore(preferences, company)
    const pricingScore = this.calculatePricingScore(preferences)
    const complianceScore = this.calculateComplianceScore(preferences)
    const experienceScore = this.calculateExperienceScore(preferences)
    const capacityScore = this.calculateCapacityScore(preferences, company)

    // Calculate overall and win probability
    const overallScore = (documentationScore + pricingScore + complianceScore + experienceScore + capacityScore) / 5

    const winProbability = this.estimateWinProbability(overallScore, preferences, params.tenderId)

    // Build score breakdown
    const scoreBreakdown = {
      documentation: {
        score: documentationScore,
        factors: this.getDocumentationFactors(preferences, company),
      },
      pricing: {
        score: pricingScore,
        factors: this.getPricingFactors(preferences),
      },
      compliance: {
        score: complianceScore,
        factors: this.getComplianceFactors(preferences),
      },
      experience: {
        score: experienceScore,
        factors: this.getExperienceFactors(preferences),
      },
      capacity: {
        score: capacityScore,
        factors: this.getCapacityFactors(preferences, company),
      },
    }

    // Generate improvement suggestions
    const improvementSuggestions = this.generateImprovementSuggestions(scoreBreakdown)

    // Save score
    // Use both user_id and tender_id as the conflict target so the
    // upsert matches a composite unique constraint (if present).
    // Fall back to user_id alone if tenderId is not provided.
    const conflictTarget = params.tenderId ? "user_id,tender_id" : "user_id"

    // Attempt upsert using ON CONFLICT when possible, but fall back to select+insert/update
    const admin = createAdminClient()

    try {
      const { data, error } = await admin
        .from("strategist_competitiveness_scores")
        .upsert(
          {
            user_id: params.userId,
            tender_id: params.tenderId,
            documentation_score: documentationScore,
            pricing_score: pricingScore,
            compliance_score: complianceScore,
            experience_score: experienceScore,
            capacity_score: capacityScore,
            score_breakdown: scoreBreakdown,
            improvement_suggestions: improvementSuggestions,
            win_probability: winProbability,
            win_probability_factors: {
              base_score: overallScore,
              experience_bonus: preferences?.experience_level === "advanced" ? 0.1 : 0,
              compliance_penalty: complianceScore < 0.5 ? -0.2 : 0,
            },
            calculated_at: new Date().toISOString(),
            valid_until: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // Valid for 7 days
          },
          { onConflict: conflictTarget },
        )
        .select()
        .single()

      if (error) {
        // If ON CONFLICT target doesn't match a unique constraint, fall back
        if (error.code === "42P10") {
          console.warn("[Competitiveness] ON CONFLICT failed (no matching unique constraint), falling back to manual upsert")
        } else {
          console.error("[Competitiveness] Error saving score:", error)
          return null
        }
      } else {
        return data
      }
    } catch (e: any) {
      console.warn("[Competitiveness] Exception during upsert attempt with admin client, falling back:", e?.message || e)
    }

    // Fallback: try to find an existing row then update or insert
    try {
      const { data: existing } = await admin
        .from("strategist_competitiveness_scores")
        .select("*")
        .eq("user_id", params.userId)
        .eq("tender_id", params.tenderId)
        .maybeSingle()

      if (existing) {
        const { data: updated, error: updErr } = await admin
          .from("strategist_competitiveness_scores")
          .update({
            documentation_score: documentationScore,
            pricing_score: pricingScore,
            compliance_score: complianceScore,
            experience_score: experienceScore,
            capacity_score: capacityScore,
            score_breakdown: scoreBreakdown,
            improvement_suggestions: improvementSuggestions,
            win_probability: winProbability,
            win_probability_factors: {
              base_score: overallScore,
              experience_bonus: preferences?.experience_level === "advanced" ? 0.1 : 0,
              compliance_penalty: complianceScore < 0.5 ? -0.2 : 0,
            },
            calculated_at: new Date().toISOString(),
            valid_until: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          })
          .eq("id", existing.id)
          .select()
          .single()

        if (updErr) {
          console.error("[Competitiveness] Error updating existing score:", updErr)
          return null
        }

        return updated
      } else {
        const { data: inserted, error: insErr } = await admin
          .from("strategist_competitiveness_scores")
          .insert({
            user_id: params.userId,
            tender_id: params.tenderId,
            documentation_score: documentationScore,
            pricing_score: pricingScore,
            compliance_score: complianceScore,
            experience_score: experienceScore,
            capacity_score: capacityScore,
            score_breakdown: scoreBreakdown,
            improvement_suggestions: improvementSuggestions,
            win_probability: winProbability,
            win_probability_factors: {
              base_score: overallScore,
              experience_bonus: preferences?.experience_level === "advanced" ? 0.1 : 0,
              compliance_penalty: complianceScore < 0.5 ? -0.2 : 0,
            },
            calculated_at: new Date().toISOString(),
            valid_until: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          })
          .select()
          .single()

        if (insErr) {
          console.error("[Competitiveness] Error inserting score:", insErr)
          return null
        }

        return inserted
      }
    } catch (finalErr) {
      console.error("[Competitiveness] Final fallback failed:", finalErr)
      return null
    }
  }

  /**
   * Get cached score or calculate new one
   */
  static async getScore(userId: string, tenderId?: string): Promise<StrategistCompetitivenessScore | null> {
    const supabase = await createClient()

    // Check for valid cached score
    const { data: cached } = await supabase
      .from("strategist_competitiveness_scores")
      .select("*")
      .eq("user_id", userId)
      .gte("valid_until", new Date().toISOString())
      .single()

    if (cached) {
      return cached
    }

    // Calculate new score
    return this.calculateScore({ userId, tenderId })
  }

  // Score calculation helpers
  private static calculateDocumentationScore(preferences: any, company: any): number {
    let score = 0
    let total = 0

    // Check various documentation
    if (company?.company_name) {
      score += 1
      total += 1
    }
    if (company?.registration_number) {
      score += 1
      total += 1
    }
    if (company?.tax_number) {
      score += 1
      total += 1
    }
    if (preferences?.has_tax_clearance) {
      score += 2
      total += 2
    }
    if (preferences?.has_coida) {
      score += 1
      total += 1
    }
    if (preferences?.has_csd_registration) {
      score += 2
      total += 2
    }
    if (preferences?.cidb_grading) {
      score += 1
      total += 1
    }
    if (preferences?.bee_level) {
      score += 1
      total += 1
    }

    return total > 0 ? score / total : 0
  }

  private static calculatePricingScore(preferences: any): number {
    // Based on past performance
    const wins = preferences?.past_tender_wins || 0
    const losses = preferences?.past_tender_losses || 0
    const total = wins + losses

    if (total === 0) return 0.5 // Neutral for new users

    const winRate = wins / total
    return Math.min(winRate * 1.2, 1) // Slight bonus for good win rate
  }

  private static calculateComplianceScore(preferences: any): number {
    let score = 0

    if (preferences?.has_tax_clearance) score += 0.35
    if (preferences?.has_coida) score += 0.25
    if (preferences?.has_csd_registration) score += 0.4

    return score
  }

  private static calculateExperienceScore(preferences: any): number {
    const levelScores: Record<string, number> = {
      beginner: 0.3,
      intermediate: 0.6,
      advanced: 0.9,
    }

    const baseScore = levelScores[preferences?.experience_level] || 0.3

    // Bonus for past wins
    const wins = preferences?.past_tender_wins || 0
    const winBonus = Math.min(wins * 0.02, 0.1)

    return Math.min(baseScore + winBonus, 1)
  }

  private static calculateCapacityScore(preferences: any, company: any): number {
    let score = 0.5 // Base score

    // Company size factor
    const sizeScores: Record<string, number> = {
      micro: 0.1,
      small: 0.2,
      medium: 0.3,
      large: 0.4,
      enterprise: 0.5,
    }
    score += sizeScores[company?.company_size] || 0

    // CIDB grading factor (for construction)
    if (preferences?.cidb_grading) {
      const grading = Number.parseInt(preferences.cidb_grading)
      if (!isNaN(grading)) {
        score += grading * 0.02
      }
    }

    return Math.min(score, 1)
  }

  // Factor breakdown helpers
  private static getDocumentationFactors(preferences: any, company: any): string[] {
    const factors: string[] = []
    if (company?.company_name) factors.push("Company profile complete")
    if (preferences?.has_tax_clearance) factors.push("Tax clearance valid")
    if (preferences?.has_csd_registration) factors.push("CSD registered")
    if (preferences?.bee_level) factors.push("B-BBEE certificate")
    if (!preferences?.has_tax_clearance) factors.push("Missing: Tax clearance")
    if (!preferences?.has_csd_registration) factors.push("Missing: CSD registration")
    return factors
  }

  private static getPricingFactors(preferences: any): string[] {
    const factors: string[] = []
    const wins = preferences?.past_tender_wins || 0
    const losses = preferences?.past_tender_losses || 0
    if (wins > 0) factors.push(`${wins} past tender wins`)
    if (losses > 0) factors.push(`${losses} past tender losses`)
    if (wins === 0 && losses === 0) factors.push("No historical pricing data")
    return factors
  }

  private static getComplianceFactors(preferences: any): string[] {
    const factors: string[] = []
    if (preferences?.has_tax_clearance) factors.push("Tax clearance: Valid")
    else factors.push("Tax clearance: Missing")
    if (preferences?.has_coida) factors.push("COIDA: Valid")
    else factors.push("COIDA: Missing")
    if (preferences?.has_csd_registration) factors.push("CSD: Registered")
    else factors.push("CSD: Not registered")
    return factors
  }

  private static getExperienceFactors(preferences: any): string[] {
    const factors: string[] = []
    factors.push(`Experience level: ${preferences?.experience_level || "Unknown"}`)
    const wins = preferences?.past_tender_wins || 0
    if (wins > 0) factors.push(`${wins} successful tenders`)
    return factors
  }

  private static getCapacityFactors(preferences: any, company: any): string[] {
    const factors: string[] = []
    if (company?.company_size) factors.push(`Company size: ${company.company_size}`)
    if (preferences?.cidb_grading) factors.push(`CIDB grading: ${preferences.cidb_grading}`)
    if (preferences?.annual_turnover) factors.push(`Annual turnover: ${preferences.annual_turnover}`)
    return factors
  }

  private static estimateWinProbability(overallScore: number, preferences: any, tenderId?: string): number {
    let probability = overallScore * 0.7 // Base from overall score

    // Adjustments
    if (preferences?.experience_level === "advanced") probability += 0.1
    if (preferences?.experience_level === "beginner") probability -= 0.1
    if (preferences?.has_tax_clearance && preferences?.has_csd_registration) probability += 0.1

    // Cap between 0.1 and 0.9
    return Math.max(0.1, Math.min(0.9, probability))
  }

  private static generateImprovementSuggestions(breakdown: Record<string, any>): string[] {
    const suggestions: string[] = []

    if (breakdown.documentation.score < 0.7) {
      suggestions.push("Complete your company profile with all required documentation")
    }
    if (breakdown.compliance.score < 0.8) {
      if (!breakdown.compliance.factors.includes("Tax clearance: Valid")) {
        suggestions.push("Obtain a valid tax clearance certificate from SARS")
      }
      if (!breakdown.compliance.factors.includes("CSD: Registered")) {
        suggestions.push("Register on the Central Supplier Database (CSD)")
      }
    }
    if (breakdown.experience.score < 0.5) {
      suggestions.push("Start with smaller tenders to build your track record")
    }
    if (breakdown.capacity.score < 0.5) {
      suggestions.push("Consider joint ventures to increase your capacity for larger tenders")
    }

    return suggestions
  }
}
