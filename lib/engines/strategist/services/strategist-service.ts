// ============================================
// AI TENDER STRATEGIST - MAIN SERVICE
// ============================================

import { createClient } from "@/lib/supabase/server"
import type {
  StrategistContext,
  StrategistConversation,
  StrategistMessage,
  StrategistUserPreferences,
  ConversationContextType,
} from "../types"

export class StrategistService {
  /**
   * Get or create user preferences
   */
  static async getUserPreferences(userId: string): Promise<StrategistUserPreferences | null> {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("strategist_user_preferences")
      .select("*")
      .eq("user_id", userId)
      .single()

    if (error && error.code !== "PGRST116") {
      console.error("[Strategist] Error fetching preferences:", error)
      return null
    }

    return data
  }

  /**
   * Update user preferences
   */
  static async updateUserPreferences(
    userId: string,
    preferences: Partial<StrategistUserPreferences>,
  ): Promise<StrategistUserPreferences | null> {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("strategist_user_preferences")
      .upsert(
        {
          user_id: userId,
          ...preferences,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" },
      )
      .select()
      .single()

    if (error) {
      console.error("[Strategist] Error updating preferences:", error)
      return null
    }

    return data
  }

  /**
   * Get user's company profile
   */
  static async getCompanyProfile(userId: string) {
    const supabase = await createClient()

    const { data, error } = await supabase.from("companies").select("*").eq("user_id", userId).single()

    if (error && error.code !== "PGRST116") {
      console.error("[Strategist] Error fetching company:", error)
      return null
    }

    return data
  }

  /**
   * Build full context for AI
   */
  static async buildContext(
    userId: string,
    tenderId?: string,
    contextType?: ConversationContextType,
  ): Promise<StrategistContext> {
    const [preferences, company] = await Promise.all([this.getUserPreferences(userId), this.getCompanyProfile(userId)])

    const context: StrategistContext = {
      user_preferences: preferences,
      company_profile: company
        ? {
            company_name: company.company_name,
            industry: company.industry,
            company_size: company.company_size,
            bee_status: company.bee_status,
            province: company.province,
          }
        : null,
    }

    // Add tender context if provided
    if (tenderId) {
      const tenderContext = await this.getTenderContext(tenderId)
      if (tenderContext) {
        context.tender_context = tenderContext
      }
    }

    return context
  }

  /**
   * Get tender context for AI
   */
  static async getTenderContext(tenderId: string) {
    const supabase = await createClient()

    // Try custom tender first
    const { data: customTender } = await supabase
      .from("user_custom_tenders")
      .select("id, title, organization, description, close_date")
      .eq("id", tenderId)
      .single()

    if (customTender) {
      // Get analysis if available
      const { data: analysis } = await supabase
        .from("user_custom_tender_analysis")
        .select("analysis_data")
        .eq("tender_id", tenderId)
        .single()

      return {
        id: customTender.id,
        title: customTender.title || "Untitled",
        organization: customTender.organization || "Unknown",
        description: customTender.description,
        close_date: customTender.close_date,
        analysis: analysis?.analysis_data,
      }
    }

    // Try scraped tender
    const { data: scrapedTender } = await supabase
      .from("scraped_tenders")
      .select("id, title, source_name, description, close_date")
      .eq("id", tenderId)
      .single()

    if (scrapedTender) {
      return {
        id: scrapedTender.id,
        title: scrapedTender.title || "Untitled",
        organization: scrapedTender.source_name || "Unknown",
        description: scrapedTender.description,
        close_date: scrapedTender.close_date,
      }
    }

    return null
  }

  /**
   * Create a new conversation
   */
  static async createConversation(
    userId: string,
    contextType: ConversationContextType = "general",
    tenderId?: string,
    title?: string,
  ): Promise<StrategistConversation | null> {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("strategist_conversations")
      .insert({
        user_id: userId,
        context_type: contextType,
        tender_id: tenderId,
        title: title || this.generateConversationTitle(contextType),
      })
      .select()
      .single()

    if (error) {
      console.error("[Strategist] Error creating conversation:", error)
      return null
    }

    return data
  }

  /**
   * Get conversation by ID
   */
  static async getConversation(conversationId: string): Promise<StrategistConversation | null> {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("strategist_conversations")
      .select("*")
      .eq("id", conversationId)
      .single()

    if (error) {
      console.error("[Strategist] Error fetching conversation:", error)
      return null
    }

    return data
  }

  /**
   * Get user's conversations
   */
  static async getUserConversations(userId: string, limit = 20): Promise<StrategistConversation[]> {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("strategist_conversations")
      .select("*")
      .eq("user_id", userId)
      .eq("status", "active")
      .order("last_message_at", { ascending: false, nullsFirst: false })
      .limit(limit)

    if (error) {
      console.error("[Strategist] Error fetching conversations:", error)
      return []
    }

    return data || []
  }

  /**
   * Get messages for a conversation
   */
  static async getConversationMessages(conversationId: string, limit = 50): Promise<StrategistMessage[]> {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("strategist_messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true })
      .limit(limit)

    if (error) {
      console.error("[Strategist] Error fetching messages:", error)
      return []
    }

    return data || []
  }

  /**
   * Add message to conversation
   */
  static async addMessage(
    conversationId: string,
    role: "user" | "assistant" | "system",
    content: string,
    options?: {
      message_type?: StrategistMessage["message_type"]
      structured_data?: Record<string, any>
      model_used?: string
      tokens_used?: number
    },
  ): Promise<StrategistMessage | null> {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("strategist_messages")
      .insert({
        conversation_id: conversationId,
        role,
        content,
        message_type: options?.message_type || "text",
        structured_data: options?.structured_data,
        model_used: options?.model_used,
        tokens_used: options?.tokens_used,
      })
      .select()
      .single()

    if (error) {
      console.error("[Strategist] Error adding message:", error)
      return null
    }

    // Update conversation metadata with separate query
    const { data: conversation } = await supabase
      .from("strategist_conversations")
      .select("message_count")
      .eq("id", conversationId)
      .single()

    await supabase
      .from("strategist_conversations")
      .update({
        message_count: (conversation?.message_count || 0) + 1,
        last_message_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", conversationId)

    return data
  }

  /**
   * Generate conversation title
   */
  private static generateConversationTitle(contextType: ConversationContextType): string {
    const titles: Record<ConversationContextType, string> = {
      general: "General Consultation",
      tender: "Tender Discussion",
      boq: "Pricing & BOQ Review",
      strategy: "Strategy Session",
      learning: "Learning Session",
    }
    return titles[contextType] || "New Conversation"
  }

  /**
   * Check if user has completed onboarding
   */
  static async hasCompletedOnboarding(userId: string): Promise<boolean> {
    const preferences = await this.getUserPreferences(userId)
    return preferences?.onboarding_completed || false
  }

  /**
   * Mark onboarding as complete
   */
  static async completeOnboarding(userId: string): Promise<boolean> {
    const supabase = await createClient()

    const { error } = await supabase
      .from("strategist_user_preferences")
      .update({
        onboarding_completed: true,
        onboarding_completed_at: new Date().toISOString(),
      })
      .eq("user_id", userId)

    return !error
  }

  /**
   * Generate strategic recommendations for a tender
   */
  static async generateRecommendations(params: {
    userId: string
    tenderId: string
    tenderType: "custom" | "scraped"
    competitiveness?: any
  }): Promise<string[]> {
    const recommendations: string[] = []

    try {
      const supabase = await createClient()

      // Get tender data
      const table = params.tenderType === "custom" ? "user_custom_tenders" : "scraped_tenders"
      const { data: tender } = await supabase.from(table).select("*").eq("id", params.tenderId).single()

      if (!tender) {
        return ["Unable to generate recommendations: Tender not found"]
      }

      // Get user preferences
      const preferences = await this.getUserPreferences(params.userId)

      // Generate recommendations based on competitiveness score
      if (params.competitiveness) {
        if (params.competitiveness.documentation_score < 0.7) {
          recommendations.push("Complete all required documentation before submitting your bid")
        }
        if (params.competitiveness.compliance_score < 0.8) {
          recommendations.push("Ensure tax clearance and CSD registration are up to date")
        }
        if (params.competitiveness.win_probability < 0.5) {
          recommendations.push("Consider partnering with experienced companies to strengthen your bid")
        }
      }

      // Time-based recommendations
      if (tender.close_date) {
        const daysUntilClose = Math.ceil((new Date(tender.close_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
        if (daysUntilClose < 7) {
          recommendations.push("Urgent: Prioritize this tender due to approaching deadline")
        } else if (daysUntilClose > 30) {
          recommendations.push("You have time to prepare a comprehensive bid - use it wisely")
        }
      }

      // Experience-based recommendations
      if (preferences?.experience_level === "beginner") {
        recommendations.push("Consider seeking mentorship or guidance from experienced bidders")
        recommendations.push("Start with smaller value tenders to build your track record")
      }

      // Default recommendation
      if (recommendations.length === 0) {
        recommendations.push("Review tender requirements carefully and ensure full compliance")
        recommendations.push("Conduct thorough cost analysis before submitting your pricing")
      }

      return recommendations
    } catch (error) {
      console.error("[Strategist] Error generating recommendations:", error)
      return ["Unable to generate recommendations at this time"]
    }
  }
}
