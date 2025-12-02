// ============================================
// AI TENDER STRATEGIST - ALERT SERVICE
// ============================================

import { createClient } from "@/lib/supabase/server"
import type { StrategistAlert, AlertType, AlertPriority } from "../types"

export class AlertService {
  /**
   * Create a new alert
   */
  static async createAlert(
    userId: string,
    alert: {
      alert_type: AlertType
      title: string
      message: string
      priority?: AlertPriority
      related_tender_id?: string
      related_document_type?: string
      action_url?: string
      action_label?: string
      trigger_date?: string
      expiry_date?: string
    },
  ): Promise<StrategistAlert | null> {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("strategist_alerts")
      .insert({
        user_id: userId,
        ...alert,
        priority: alert.priority || "medium",
        trigger_date: alert.trigger_date || new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error("[Alert] Error creating alert:", error)
      return null
    }

    return data
  }

  /**
   * Get user's alerts
   */
  static async getUserAlerts(
    userId: string,
    options?: {
      unreadOnly?: boolean
      priority?: AlertPriority
      limit?: number
    },
  ): Promise<StrategistAlert[]> {
    const supabase = await createClient()

    let query = supabase
      .from("strategist_alerts")
      .select("*")
      .eq("user_id", userId)
      .eq("is_dismissed", false)
      .order("priority", { ascending: false })
      .order("created_at", { ascending: false })

    if (options?.unreadOnly) {
      query = query.eq("is_read", false)
    }

    if (options?.priority) {
      query = query.eq("priority", options.priority)
    }

    if (options?.limit) {
      query = query.limit(options.limit)
    }

    const { data, error } = await query

    if (error) {
      console.error("[Alert] Error fetching alerts:", error)
      return []
    }

    return data || []
  }

  /**
   * Mark alert as read
   */
  static async markAsRead(alertId: string): Promise<boolean> {
    const supabase = await createClient()

    const { error } = await supabase.from("strategist_alerts").update({ is_read: true }).eq("id", alertId)

    return !error
  }

  /**
   * Dismiss alert
   */
  static async dismissAlert(alertId: string): Promise<boolean> {
    const supabase = await createClient()

    const { error } = await supabase.from("strategist_alerts").update({ is_dismissed: true }).eq("id", alertId)

    return !error
  }

  /**
   * Mark alert as actioned
   */
  static async markAsActioned(alertId: string): Promise<boolean> {
    const supabase = await createClient()

    const { error } = await supabase
      .from("strategist_alerts")
      .update({ is_actioned: true, is_read: true })
      .eq("id", alertId)

    return !error
  }

  /**
   * Generate compliance alerts for user
   */
  static async generateComplianceAlerts(userId: string): Promise<void> {
    const supabase = await createClient()

    // Get user preferences
    const { data: preferences } = await supabase
      .from("strategist_user_preferences")
      .select("*")
      .eq("user_id", userId)
      .single()

    if (!preferences) return

    const now = new Date()
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)

    // Check tax clearance expiry
    if (preferences.has_tax_clearance && preferences.tax_clearance_expiry) {
      const expiryDate = new Date(preferences.tax_clearance_expiry)
      if (expiryDate <= thirtyDaysFromNow) {
        const daysUntilExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

        await this.createAlert(userId, {
          alert_type: "document_expiry",
          title: "Tax Clearance Expiring Soon",
          message: `Your tax clearance certificate expires in ${daysUntilExpiry} days. Renew it to maintain tender eligibility.`,
          priority: daysUntilExpiry <= 14 ? "urgent" : "high",
          related_document_type: "tax_clearance",
          action_url: "/dashboard/profile",
          action_label: "Update Documents",
          expiry_date: preferences.tax_clearance_expiry,
        })
      }
    }

    // Check COIDA expiry
    if (preferences.has_coida && preferences.coida_expiry) {
      const expiryDate = new Date(preferences.coida_expiry)
      if (expiryDate <= thirtyDaysFromNow) {
        const daysUntilExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

        await this.createAlert(userId, {
          alert_type: "document_expiry",
          title: "COIDA Letter Expiring Soon",
          message: `Your COIDA letter of good standing expires in ${daysUntilExpiry} days. Renew it to maintain compliance.`,
          priority: daysUntilExpiry <= 14 ? "high" : "medium",
          related_document_type: "coida",
          action_url: "/dashboard/profile",
          action_label: "Update Documents",
          expiry_date: preferences.coida_expiry,
        })
      }
    }

    // Check for missing CSD registration
    if (!preferences.has_csd_registration) {
      await this.createAlert(userId, {
        alert_type: "compliance_gap",
        title: "CSD Registration Missing",
        message:
          "You need to register on the Central Supplier Database (CSD) to bid on government tenders. This is a mandatory requirement.",
        priority: "high",
        action_url: "https://secure.csd.gov.za/",
        action_label: "Register on CSD",
      })
    }

    // Check for missing tax clearance
    if (!preferences.has_tax_clearance) {
      await this.createAlert(userId, {
        alert_type: "compliance_gap",
        title: "Tax Clearance Missing",
        message: "A valid tax clearance certificate is required for all government tenders.",
        priority: "urgent",
        related_document_type: "tax_clearance",
        action_url: "https://www.sars.gov.za/",
        action_label: "Get Tax Clearance",
      })
    }
  }

  /**
   * Get unread alert count
   */
  static async getUnreadCount(userId: string): Promise<number> {
    const supabase = await createClient()

    const { count, error } = await supabase
      .from("strategist_alerts")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("is_read", false)
      .eq("is_dismissed", false)

    if (error) {
      console.error("[Alert] Error counting alerts:", error)
      return 0
    }

    return count || 0
  }
}
