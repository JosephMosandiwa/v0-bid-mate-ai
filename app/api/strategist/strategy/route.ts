// ============================================
// AI STRATEGIST - STRATEGY GENERATION ENDPOINT
// ============================================

import generateTextViaProvider from "@/lib/providers"
import { createClient } from "@/lib/supabase/server"
import { StrategistService, buildStrategyGenerationPrompt } from "@/lib/engines/strategist"
import type { StrategyType, StrategyContent } from "@/lib/engines/strategist"

export const maxDuration = 60

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { tender_id, strategy_type = "bid", title } = await request.json()

    if (!tender_id) {
      return Response.json({ error: "Tender ID is required" }, { status: 400 })
    }

    const { data: tenderData } = await supabase.from("user_tenders").select("*").eq("id", tender_id).single()

    if (!tenderData) {
      return Response.json({ error: "Tender not found" }, { status: 404 })
    }

    console.log("[Strategist] Generating strategy for THIS SPECIFIC TENDER:", tender_id, tenderData.title)
    console.log("[Strategist] Strategy type:", strategy_type)

    // Get tender analysis
    const { data: tenderAnalysis } = await supabase
      .from("user_custom_tender_analysis")
      .select("analysis_data")
      .eq("tender_id", tender_id)
      .single()

    if (!tenderAnalysis?.analysis_data) {
      return Response.json({ error: "Tender analysis not found. Please analyze the tender first." }, { status: 404 })
    }

    // Build user context
    const context = await StrategistService.buildContext(user.id, tender_id, "strategy")

    const enhancedPrompt = `🎯 **YOU ARE CREATING A STRATEGY FOR THIS SPECIFIC TENDER:**

**Tender Title:** "${tenderData.title}"
**Organization:** ${tenderData.organization || "Not specified"}
**Deadline:** ${tenderData.deadline || "Not specified"}
**Value:** ${tenderData.value || "Not specified"}
**Description:** ${tenderData.description || "No description provided"}

🚨 **CRITICAL INSTRUCTION:**
- EVERY piece of strategy MUST reference THIS specific tender: "${tenderData.title}"
- Do NOT provide generic tender strategies
- Tailor EVERYTHING to winning THIS particular opportunity
- Reference the organization (${tenderData.organization || "this client"}) throughout
- Consider THIS tender's deadline: ${tenderData.deadline || "upcoming"}
- Focus on THIS tender's value: ${tenderData.value || "the tender value"}

${buildStrategyGenerationPrompt(strategy_type as StrategyType, tenderAnalysis.analysis_data, context)}

Remember: You are NOT creating a general strategy template. You are creating a specific, actionable strategy to win "${tenderData.title}" from ${tenderData.organization || "this organization"}.`

    console.log("[Strategist] Generating tender-specific strategy with AI...")

    const { text: aiResponse } = await generateTextViaProvider({
      model: "openai/gpt-4-turbo",
      prompt: enhancedPrompt,
      temperature: 0.6,
      maxTokens: 4000,
    })

    // Parse AI response
    let strategyContent: StrategyContent
    try {
      let cleanedResponse = aiResponse.trim()
      if (cleanedResponse.startsWith("```json")) {
        cleanedResponse = cleanedResponse.slice(7)
      }
      if (cleanedResponse.startsWith("```")) {
        cleanedResponse = cleanedResponse.slice(3)
      }
      if (cleanedResponse.endsWith("```")) {
        cleanedResponse = cleanedResponse.slice(0, -3)
      }
      strategyContent = JSON.parse(cleanedResponse.trim())
    } catch (parseError) {
      console.error("[Strategist] Failed to parse strategy:", parseError)
      return Response.json({ error: "Failed to generate strategy" }, { status: 500 })
    }

    // Calculate viability score from strategy content
    const viabilityScore = calculateViabilityScore(strategyContent)
    const riskLevel = determineRiskLevel(strategyContent)
    const winProbability = estimateWinProbability(strategyContent, context)

    // Generate summary
    const summary = generateStrategySummary(strategyContent)

    // Save strategy
    const { data: strategy, error } = await supabase
      .from("strategist_strategies")
      .insert({
        user_id: user.id,
        tender_id,
        title: title || `${strategy_type.charAt(0).toUpperCase() + strategy_type.slice(1)} Strategy`,
        strategy_type,
        content: strategyContent,
        summary,
        viability_score: viabilityScore,
        risk_level: riskLevel,
        win_probability: winProbability,
        status: "draft",
      })
      .select()
      .single()

    if (error) {
      console.error("[Strategist] Error saving strategy:", error)
      return Response.json({ error: "Failed to save strategy" }, { status: 500 })
    }

    console.log("[Strategist] Strategy generated and saved:", strategy.id)

    return Response.json({
      strategy,
      message: "Strategy generated successfully",
    })
  } catch (error: any) {
    console.error("[Strategist] Strategy generation error:", error)
    return Response.json({ error: "Failed to generate strategy" }, { status: 500 })
  }
}

// Get user's strategies
export async function GET(request: Request) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const tenderId = searchParams.get("tender_id")
    const status = searchParams.get("status")

    let query = supabase
      .from("strategist_strategies")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (tenderId) {
      query = query.eq("tender_id", tenderId)
    }

    if (status) {
      query = query.eq("status", status)
    }

    const { data, error } = await query

    if (error) {
      console.error("[Strategist] Error fetching strategies:", error)
      return Response.json({ error: "Failed to fetch strategies" }, { status: 500 })
    }

    return Response.json({ strategies: data || [] })
  } catch (error: any) {
    console.error("[Strategist] GET strategies error:", error)
    return Response.json({ error: "Failed to fetch strategies" }, { status: 500 })
  }
}

// Delete a strategy
export async function DELETE(request: Request) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const strategyId = searchParams.get("id")

    if (!strategyId) {
      return Response.json({ error: "Strategy ID is required" }, { status: 400 })
    }

    // Verify ownership before deleting
    const { data: existingStrategy } = await supabase
      .from("strategist_strategies")
      .select("id")
      .eq("id", strategyId)
      .eq("user_id", user.id)
      .single()

    if (!existingStrategy) {
      return Response.json({ error: "Strategy not found" }, { status: 404 })
    }

    const { error } = await supabase.from("strategist_strategies").delete().eq("id", strategyId).eq("user_id", user.id)

    if (error) {
      console.error("[Strategist] Error deleting strategy:", error)
      return Response.json({ error: "Failed to delete strategy" }, { status: 500 })
    }

    return Response.json({ success: true, message: "Strategy deleted" })
  } catch (error: any) {
    console.error("[Strategist] DELETE strategy error:", error)
    return Response.json({ error: "Failed to delete strategy" }, { status: 500 })
  }
}

// Update strategy status
export async function PATCH(request: Request) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { strategy_id, updates } = await request.json()

    if (!strategy_id) {
      return Response.json({ error: "Strategy ID is required" }, { status: 400 })
    }

    // Allowed update fields
    const allowedFields = ["title", "status", "summary"]
    const sanitizedUpdates: Record<string, any> = {}

    for (const field of allowedFields) {
      if (updates[field] !== undefined) {
        sanitizedUpdates[field] = updates[field]
      }
    }

    if (Object.keys(sanitizedUpdates).length === 0) {
      return Response.json({ error: "No valid updates provided" }, { status: 400 })
    }

    sanitizedUpdates.updated_at = new Date().toISOString()

    const { data, error } = await supabase
      .from("strategist_strategies")
      .update(sanitizedUpdates)
      .eq("id", strategy_id)
      .eq("user_id", user.id)
      .select()
      .single()

    if (error) {
      console.error("[Strategist] Error updating strategy:", error)
      return Response.json({ error: "Failed to update strategy" }, { status: 500 })
    }

    return Response.json({ strategy: data })
  } catch (error: any) {
    console.error("[Strategist] PATCH strategy error:", error)
    return Response.json({ error: "Failed to update strategy" }, { status: 500 })
  }
}

// Helper functions
function calculateViabilityScore(content: StrategyContent): number {
  let score = 0.5 // Base score

  // Adjust based on strengths vs weaknesses
  const strengths = content.strengths_weaknesses?.strengths?.length || 0
  const weaknesses = content.strengths_weaknesses?.weaknesses?.length || 0
  if (strengths > weaknesses) score += 0.15
  else if (weaknesses > strengths) score -= 0.1

  // Adjust based on compliance status
  const complianceReqs = content.compliance_strategy?.requirements || []
  const metReqs = complianceReqs.filter((r) => r.status === "met").length
  if (complianceReqs.length > 0) {
    score += (metReqs / complianceReqs.length) * 0.2
  }

  // Adjust based on risks
  const risks = content.risk_mitigation_plan?.length || 0
  if (risks > 5) score -= 0.1
  else if (risks < 3) score += 0.1

  return Math.max(0.1, Math.min(0.95, score))
}

function determineRiskLevel(content: StrategyContent): "low" | "medium" | "high" | "critical" {
  const risks = content.risk_mitigation_plan?.length || 0
  const gaps = content.compliance_strategy?.gaps?.length || 0
  const weaknesses = content.strengths_weaknesses?.weaknesses?.length || 0

  const totalRiskFactors = risks + gaps + weaknesses

  if (totalRiskFactors > 10) return "critical"
  if (totalRiskFactors > 6) return "high"
  if (totalRiskFactors > 3) return "medium"
  return "low"
}

function estimateWinProbability(content: StrategyContent, context: any): number {
  let probability = 0.3 // Base

  // Viability adds to probability
  const viability = calculateViabilityScore(content)
  probability += viability * 0.3

  // User experience adds
  if (context.user_preferences?.experience_level === "advanced") {
    probability += 0.15
  } else if (context.user_preferences?.experience_level === "intermediate") {
    probability += 0.1
  }

  // Compliance adds
  if (context.user_preferences?.has_tax_clearance && context.user_preferences?.has_csd_registration) {
    probability += 0.1
  }

  return Math.max(0.1, Math.min(0.85, probability))
}

function generateStrategySummary(content: StrategyContent): string {
  const strengths = content.strengths_weaknesses?.strengths?.length || 0
  const weaknesses = content.strengths_weaknesses?.weaknesses?.length || 0
  const risks = content.risk_mitigation_plan?.length || 0

  return `Strategy analysis complete with ${strengths} strengths identified, ${weaknesses} areas for improvement, and ${risks} risks with mitigation plans.`
}
