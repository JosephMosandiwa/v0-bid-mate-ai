// ============================================
// AI STRATEGIST - BOQ PRICING ENDPOINT
// ============================================

import { generateText } from "ai"
import { createClient } from "@/lib/supabase/server"
import { StrategistService } from "@/lib/engines/strategist"

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

    const { tender_id, boq_items, question } = await request.json()

    if (!tender_id) {
      return Response.json({ error: "Tender ID required" }, { status: 400 })
    }

    // Build context
    const context = await StrategistService.buildContext(user.id, tender_id, "boq")

    // Get tender analysis if available
    const { data: analysis } = await supabase
      .from("user_custom_tender_analysis")
      .select("analysis_data")
      .eq("tender_id", tender_id)
      .single()

    const systemPrompt = `You are an expert pricing strategist for South African government tenders.

## Your Role
- Analyze BOQ (Bill of Quantities) structures
- Provide pricing guidance and margin recommendations
- Identify pricing risks and opportunities
- Suggest competitive positioning strategies

## User Context
${context.company_profile?.company_name ? `Company: ${context.company_profile.company_name}` : ""}
${context.company_profile?.industry ? `Industry: ${context.company_profile.industry}` : ""}
${context.user_preferences?.experience_level ? `Experience: ${context.user_preferences.experience_level}` : ""}

## Tender Context
${analysis?.analysis_data?.tender_summary ? JSON.stringify(analysis.analysis_data.tender_summary, null, 2) : "Not available"}

## Guidelines
- Be specific with percentage ranges and ZAR amounts
- Consider South African market conditions
- Factor in B-BBEE requirements and local content
- Warn about underpricing risks
- Suggest areas for cost optimization`

    const userPrompt =
      question ||
      `Analyze this BOQ and provide pricing strategy recommendations:

${boq_items ? JSON.stringify(boq_items, null, 2) : "No BOQ items provided - provide general pricing guidance for this tender."}`

    console.log("[Strategist] BOQ analysis for tender:", tender_id)

    const { text } = await generateText({
      model: "openai/gpt-4-turbo",
      system: systemPrompt,
      prompt: userPrompt,
      temperature: 0.6,
      maxTokens: 2000,
    })

    return Response.json({
      advice: text,
      tender_id,
    })
  } catch (error: any) {
    console.error("[Strategist] BOQ error:", error)
    return Response.json({ error: "Failed to analyze BOQ" }, { status: 500 })
  }
}
