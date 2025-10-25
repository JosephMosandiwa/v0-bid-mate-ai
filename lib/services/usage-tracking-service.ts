import { createClient } from "@/lib/supabase/server"

export interface UsageStats {
  aiAnalyses: {
    count: number
    totalCost: number
    avgCostPerAnalysis: number
  }
  scraping: {
    count: number
    creditsUsed: number
    successRate: number
  }
  storage: {
    totalFiles: number
    totalSizeGB: number
    estimatedCost: number
  }
  monthlyTotal: number
}

export class UsageTrackingService {
  // Log AI analysis usage
  static async logAIUsage(params: {
    userId?: string
    tenderId?: string
    modelUsed: string
    inputTokens: number
    outputTokens: number
  }) {
    const supabase = await createClient()

    // Calculate cost based on GPT-4o pricing
    // Input: $2.50 per 1M tokens, Output: $10 per 1M tokens
    const inputCost = (params.inputTokens / 1_000_000) * 2.5
    const outputCost = (params.outputTokens / 1_000_000) * 10.0
    const totalCost = inputCost + outputCost

    const { error } = await supabase.from("ai_usage_logs").insert({
      user_id: params.userId,
      tender_id: params.tenderId,
      model_used: params.modelUsed,
      input_tokens: params.inputTokens,
      output_tokens: params.outputTokens,
      estimated_cost_usd: totalCost,
    })

    if (error) {
      console.error("[v0] Error logging AI usage:", error)
    }

    return { cost: totalCost }
  }

  // Log scraping usage
  static async logScrapingUsage(params: {
    sourceId?: number
    scrapeType: "manual" | "cron" | "bulk"
    tendersFound: number
    apiCreditsUsed: number
    success: boolean
    errorMessage?: string
  }) {
    const supabase = await createClient()

    const { error } = await supabase.from("scraping_usage_logs").insert({
      source_id: params.sourceId,
      scrape_type: params.scrapeType,
      tenders_found: params.tendersFound,
      api_credits_used: params.apiCreditsUsed,
      success: params.success,
      error_message: params.errorMessage,
    })

    if (error) {
      console.error("[v0] Error logging scraping usage:", error)
    }
  }

  // Get current month usage stats
  static async getCurrentMonthUsage(): Promise<UsageStats> {
    const supabase = await createClient()
    const now = new Date()
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)

    // Get AI usage
    const { data: aiData, error: aiError } = await supabase
      .from("ai_usage_logs")
      .select("input_tokens, output_tokens, estimated_cost_usd")
      .gte("created_at", monthStart.toISOString())

    // If table doesn't exist, return default values
    if (aiError && aiError.code === "42P01") {
      console.log("[v0] Usage tracking tables not found. Please run script 017 to create them.")
      return this.getDefaultStats()
    }

    const aiCount = aiData?.length || 0
    const aiTotalCost = aiData?.reduce((sum, log) => sum + Number(log.estimated_cost_usd), 0) || 0
    const aiAvgCost = aiCount > 0 ? aiTotalCost / aiCount : 0

    // Get scraping usage
    const { data: scrapingData } = await supabase
      .from("scraping_usage_logs")
      .select("api_credits_used, success")
      .gte("created_at", monthStart.toISOString())

    const scrapingCount = scrapingData?.length || 0
    const scrapingCredits = scrapingData?.reduce((sum, log) => sum + log.api_credits_used, 0) || 0
    const scrapingSuccess = scrapingData?.filter((log) => log.success).length || 0
    const scrapingSuccessRate = scrapingCount > 0 ? (scrapingSuccess / scrapingCount) * 100 : 0

    // Get storage usage
    const { data: storageData } = await supabase
      .from("storage_usage_snapshots")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1)
      .single()

    const storageSizeGB = storageData?.total_size_gb || 0
    const storageCost = storageSizeGB * 0.023 // $0.023 per GB

    // Calculate total monthly cost
    const monthlyTotal = aiTotalCost + storageCost

    return {
      aiAnalyses: {
        count: aiCount,
        totalCost: aiTotalCost,
        avgCostPerAnalysis: aiAvgCost,
      },
      scraping: {
        count: scrapingCount,
        creditsUsed: scrapingCredits,
        successRate: scrapingSuccessRate,
      },
      storage: {
        totalFiles: storageData?.total_files || 0,
        totalSizeGB: storageSizeGB,
        estimatedCost: storageCost,
      },
      monthlyTotal,
    }
  }

  // Update storage snapshot
  static async updateStorageSnapshot() {
    const supabase = await createClient()

    // Get total document count and size
    const { data: documents } = await supabase.from("tender_documents").select("file_size")

    const totalFiles = documents?.length || 0
    const totalSizeBytes = documents?.reduce((sum, doc) => sum + (doc.file_size || 0), 0) || 0
    const totalSizeGB = totalSizeBytes / (1024 * 1024 * 1024)
    const estimatedCost = totalSizeGB * 0.023

    const { error } = await supabase.from("storage_usage_snapshots").insert({
      total_files: totalFiles,
      total_size_bytes: totalSizeBytes,
      total_size_gb: totalSizeGB,
      estimated_cost_usd: estimatedCost,
    })

    if (error) {
      console.error("[v0] Error updating storage snapshot:", error)
    }
  }

  // Helper method to return default stats
  private static getDefaultStats(): UsageStats {
    return {
      aiAnalyses: {
        count: 0,
        totalCost: 0,
        avgCostPerAnalysis: 0,
      },
      scraping: {
        count: 0,
        creditsUsed: 0,
        successRate: 0,
      },
      storage: {
        totalFiles: 0,
        totalSizeGB: 0,
        estimatedCost: 0,
      },
      monthlyTotal: 0,
    }
  }
}
