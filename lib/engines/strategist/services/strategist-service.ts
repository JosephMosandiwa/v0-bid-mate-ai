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

    // Update conversation metadata
    await supabase
      .from("strategist_conversations")
      .update({
        message_count: supabase.sql`message_count + 1`,
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
}
