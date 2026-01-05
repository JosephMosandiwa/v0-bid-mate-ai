import generateTextViaProvider from "@/lib/providers"
import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const supabase = await createClient()

    // Get user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()
    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get tender analysis
    const { data: analysis, error: analysisError } = await supabase
      .from("user_custom_tender_analysis")
      .select("analysis_data")
      .eq("tender_id", id)
      .single()

    if (analysisError || !analysis) {
      return NextResponse.json({ error: "No analysis found for this tender" }, { status: 404 })
    }

    const analysisData = analysis.analysis_data

    // Extract relevant data for negotiation strategy
    const strategyContext = {
      tender_summary: analysisData.tender_summary || {},
      evaluation: analysisData.evaluation || {},
      financial_requirements: analysisData.financial_requirements || {},
      legal_registration: analysisData.legal_registration || {},
      labour_employment: analysisData.labour_employment || {},
      technical_specs: analysisData.technical_specs || {},
      penalties_payment: analysisData.penalties_payment || {},
      compliance_summary: analysisData.compliance_summary || {},
      risk_assessment: analysisData.risk_assessment || {},
      bbbee_analysis: analysisData.bbbee_analysis || {},
    }

    const systemPrompt = `You are an expert South African tender strategist and negotiation consultant with 20+ years of experience in government and private sector procurement. You specialize in helping businesses maximize their chances of winning tenders while protecting their interests.

Your role is to analyze tender requirements and generate actionable negotiation strategies that:
1. Identify leverage points and areas for clarification
2. Highlight potential risks and how to address them
3. Suggest ways to differentiate from competitors
4. Recommend pricing strategies based on the evaluation criteria
5. Advise on B-BBEE optimization tactics

Be specific, practical, and focused on South African procurement context. Reference specific tender requirements when making recommendations.`

    const userPrompt = `Based on the following tender analysis, generate a comprehensive 5-point negotiation strategy:

## TENDER CONTEXT:
${JSON.stringify(strategyContext, null, 2)}

## REQUIRED OUTPUT FORMAT:
Generate a JSON object with this exact structure:
{
  "strategy_title": "Strategic title for this negotiation approach",
  "overall_approach": "2-3 sentence summary of the recommended negotiation stance",
  "win_probability_assessment": {
    "score": <number 1-100>,
    "reasoning": "Why this score was assigned"
  },
  "negotiation_points": [
    {
      "point_number": 1,
      "title": "Clear, actionable title",
      "category": "Pricing|Technical|Compliance|Risk Mitigation|B-BBEE",
      "priority": "Critical|High|Medium",
      "challenge": "What specific challenge or opportunity this addresses",
      "strategy": "Detailed strategy (2-3 sentences)",
      "talking_points": ["Specific point 1", "Specific point 2", "Specific point 3"],
      "expected_outcome": "What you should achieve"
    }
  ],
  "pricing_recommendations": {
    "approach": "Cost-plus|Competitive|Value-based|Premium",
    "rationale": "Why this approach suits this tender",
    "margin_guidance": "Suggested margin range and reasoning",
    "risk_pricing": "How to price in identified risks"
  },
  "bbbee_optimization": {
    "current_potential": "Assessment of B-BBEE scoring potential",
    "quick_wins": ["Immediate actions to boost B-BBEE score"],
    "subcontracting_strategy": "How to leverage 30% EME/QSE subcontracting if applicable"
  },
  "clarification_questions": [
    "Specific questions to ask during the clarification period"
  ],
  "red_flags": [
    {
      "issue": "Potential problem identified",
      "recommendation": "How to address or protect against this"
    }
  ],
  "timeline_recommendations": {
    "preparation_days_needed": <number>,
    "key_milestones": ["Milestone 1 with date guidance", "Milestone 2"]
  }
}

Return ONLY the JSON object, no markdown formatting or additional text.`

    console.log("[v0] Generating negotiation strategy for tender:", id)

    const { text } = await generateTextViaProvider({
      model: "openai/gpt-4o",
      system: systemPrompt,
      prompt: userPrompt,
      temperature: 0.7,
      maxTokens: 4000,
    })

    // Parse the response
    let strategy
    try {
      // Clean the response - remove markdown code blocks if present
      let cleanedText = text.trim()
      if (cleanedText.startsWith("```json")) {
        cleanedText = cleanedText.slice(7)
      } else if (cleanedText.startsWith("```")) {
        cleanedText = cleanedText.slice(3)
      }
      if (cleanedText.endsWith("```")) {
        cleanedText = cleanedText.slice(0, -3)
      }
      cleanedText = cleanedText.trim()

      strategy = JSON.parse(cleanedText)
    } catch (parseError) {
      console.error("[v0] Failed to parse strategy response:", parseError)
      return NextResponse.json(
        {
          error: "Failed to parse strategy response",
          raw: text,
        },
        { status: 500 },
      )
    }

    // Save strategy to database
    const { error: saveError } = await supabase
      .from("user_custom_tender_analysis")
      .update({
        analysis_data: {
          ...analysisData,
          negotiation_strategy: strategy,
          strategy_generated_at: new Date().toISOString(),
        },
      })
      .eq("tender_id", id)

    if (saveError) {
      console.error("[v0] Failed to save strategy:", saveError)
      // Still return the strategy even if save fails
    }

    return NextResponse.json({
      success: true,
      strategy,
    })
  } catch (error: any) {
    console.error("[v0] Negotiation strategy generation error:", error)
    return NextResponse.json(
      {
        error: "Failed to generate negotiation strategy",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
