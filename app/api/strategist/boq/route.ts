// ============================================
// AI STRATEGIST - BOQ PRICING ENDPOINT
// ============================================

import generateTextViaProvider from "@/lib/providers"
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

    const body = await request.json()
    const {
      tender_id,
      tenderId,
      tenderType,
      tenderTitle,
      tenderDescription,
      analysisData,
      projectPlan,
      boq_items,
      question,
    } = body

    const finalTenderId = tender_id || tenderId
    const finalTenderType = tenderType || "custom"

    if (!finalTenderId) {
      return Response.json({ error: "Tender ID required" }, { status: 400 })
    }

    console.log("[v0] BOQ generation request for tender:", finalTenderId, "Type:", finalTenderType)
    console.log("[v0] Tender title:", tenderTitle)

    // If this is a BOQ generation request (has tenderTitle)
    if (tenderTitle) {
      console.log("[Strategist] Generating comprehensive BOQ for THIS SPECIFIC TENDER:", tenderTitle)

      const prompt = `You are generating a Bill of Quantities specifically for THIS tender:

**🎯 THIS TENDER: "${tenderTitle}"**
Organization: ${analysisData?.organization || "Not specified"}
Deadline: ${analysisData?.deadline || "Not specified"}
Estimated Value: ${analysisData?.value || "Not specified"}

**Description:**
${tenderDescription || "Not provided"}

**THIS TENDER'S Specific Requirements:**
${analysisData?.requirements ? JSON.stringify(analysisData.requirements, null, 2) : "Standard requirements"}

**Analysis of THIS TENDER:**
${analysisData ? JSON.stringify(analysisData, null, 2) : "Not available"}

**Project Plan for THIS TENDER:**
${projectPlan ? JSON.stringify(projectPlan, null, 2) : "Not available"}

🚨 CRITICAL: Every line item MUST be directly relevant to delivering THIS SPECIFIC tender ("${tenderTitle}").
Do NOT provide generic BOQ templates - tailor EVERYTHING to what THIS tender actually requires.

Generate a detailed, realistic BOQ specifically for "${tenderTitle}" with the following structure.

YOU MUST RETURN ONLY VALID JSON - NO MARKDOWN, NO EXPLANATIONS, JUST THE JSON OBJECT.

{
  "boq_items": [
    {
      "item_number": "1.1",
      "description": "Detailed description of work/material",
      "category": "Labor|Materials|Equipment|Subcontractors|Professional Services",
      "unit": "m²|hours|kg|each|lot",
      "quantity": 100,
      "unit_rate": 500,
      "amount": 50000,
      "notes": "Special considerations"
    }
  ],
  "pricing_strategy": {
    "strategy_type": "competitive|value_based|cost_plus|strategic_loss_leader",
    "competitive_analysis": "Analysis text",
    "risk_premium_percent": 5,
    "discount_offered_percent": 2,
    "payment_terms": "30/60/90 days",
    "pricing_rationale": "Why this approach"
  },
  "direct_costs": {
    "labor": 100000,
    "materials": 50000,
    "equipment": 20000,
    "subcontractors": 30000
  },
  "indirect_costs": {
    "overhead": 20000,
    "admin": 8000,
    "transport": 5000,
    "insurance": 3000,
    "certifications": 2000,
    "compliance": 2000
  },
  "contingency_percent": 10,
  "profit_margin_percent": 15,
  "vat_percent": 15,
  "break_even_analysis": {
    "break_even_value": 180000,
    "break_even_timeline": "4 months",
    "profitability_threshold": "Description"
  },
  "cash_flow_projection": {
    "months": [
      {
        "month": 1,
        "inflow": 50000,
        "outflow": 40000,
        "net_cash_flow": 10000,
        "cumulative_cash_flow": 10000
      }
    ]
  },
  "profitability_analysis": {
    "gross_profit_margin": 25,
    "net_profit_margin": 15,
    "return_on_investment": 20,
    "payback_period_months": 6
  }
}

REMEMBER: Return ONLY the JSON object, no markdown code blocks, no explanations.`

      console.log("[v0] Calling AI to generate BOQ...")
      const { text } = await generateTextViaProvider({
        model: "openai/gpt-4o",
        prompt,
        temperature: 0.7,
        maxTokens: 4000,
      })

      console.log("[v0] AI response received, length:", text.length)
      console.log("[v0] First 500 chars:", text.substring(0, 500))

      // Parse the generated BOQ
      let boqData
      try {
        // Extract JSON from markdown if present
        const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) || text.match(/```\s*([\s\S]*?)\s*```/)
        const jsonText = jsonMatch ? jsonMatch[1] : text.trim()

        console.log("[v0] Attempting to parse JSON, first 200 chars:", jsonText.substring(0, 200))
        boqData = JSON.parse(jsonText)
        console.log("[v0] JSON parsed successfully")
      } catch (parseError: any) {
        console.error("[v0] Failed to parse BOQ JSON:", parseError.message)
        console.error("[v0] Raw text that failed to parse:", text)
        return Response.json(
          {
            error: "Failed to generate valid BOQ",
            details: `JSON parse error: ${parseError.message}`,
            raw_response: text.substring(0, 500),
          },
          { status: 500 },
        )
      }

      if (!boqData.boq_items || !Array.isArray(boqData.boq_items) || boqData.boq_items.length === 0) {
        console.error("[v0] BOQ data missing required boq_items array")
        return Response.json(
          {
            error: "Invalid BOQ structure",
            details: "Missing or empty boq_items array",
          },
          { status: 500 },
        )
      }

      console.log("[v0] BOQ has", boqData.boq_items.length, "items")

      // Calculate totals
      const subtotal = boqData.boq_items.reduce((sum: number, item: any) => sum + (item.amount || 0), 0)
      const contingency_amount = subtotal * ((boqData.contingency_percent || 10) / 100)
      const subtotal_with_contingency = subtotal + contingency_amount
      const profit_amount = subtotal_with_contingency * ((boqData.profit_margin_percent || 15) / 100)
      const subtotal_with_profit = subtotal_with_contingency + profit_amount
      const vat_amount = subtotal_with_profit * ((boqData.vat_percent || 15) / 100)
      const total_amount = subtotal_with_profit + vat_amount

      console.log("[v0] Calculated totals - Subtotal:", subtotal, "Total:", total_amount)

      // First, check if BOQ already exists
      const { data: existingBoq } = await supabase
        .from("tender_boq")
        .select("id")
        .eq("tender_id", finalTenderId)
        .eq("tender_type", finalTenderType)
        .eq("user_id", user.id)
        .maybeSingle()

      let savedBoq
      if (existingBoq) {
        // Update existing
        console.log("[v0] Updating existing BOQ:", existingBoq.id)
        const { data, error } = await supabase
          .from("tender_boq")
          .update({
            boq_items: boqData.boq_items,
            subtotal,
            contingency_percent: boqData.contingency_percent || 10,
            contingency_amount,
            profit_margin_percent: boqData.profit_margin_percent || 15,
            profit_amount,
            vat_percent: boqData.vat_percent || 15,
            vat_amount,
            total_amount,
            pricing_strategy: boqData.pricing_strategy || {},
            direct_costs: boqData.direct_costs || {},
            indirect_costs: boqData.indirect_costs || {},
            break_even_analysis: boqData.break_even_analysis || {},
            cash_flow_projection: boqData.cash_flow_projection || {},
            profitability_analysis: boqData.profitability_analysis || {},
            updated_at: new Date().toISOString(),
          })
          .eq("id", existingBoq.id)
          .select()
          .single()

        if (error) {
          console.error("[v0] Error updating BOQ:", error)
          return Response.json({ error: "Failed to update BOQ", details: error.message }, { status: 500 })
        }
        savedBoq = data
      } else {
        // Insert new
        console.log("[v0] Inserting new BOQ")
        const { data, error } = await supabase
          .from("tender_boq")
          .insert({
            tender_id: finalTenderId,
            tender_type: finalTenderType,
            user_id: user.id,
            boq_items: boqData.boq_items,
            subtotal,
            contingency_percent: boqData.contingency_percent || 10,
            contingency_amount,
            profit_margin_percent: boqData.profit_margin_percent || 15,
            profit_amount,
            vat_percent: boqData.vat_percent || 15,
            vat_amount,
            total_amount,
            pricing_strategy: boqData.pricing_strategy || {},
            direct_costs: boqData.direct_costs || {},
            indirect_costs: boqData.indirect_costs || {},
            break_even_analysis: boqData.break_even_analysis || {},
            cash_flow_projection: boqData.cash_flow_projection || {},
            profitability_analysis: boqData.profitability_analysis || {},
          })
          .select()
          .single()

        if (error) {
          console.error("[v0] Error inserting BOQ:", error)
          return Response.json({ error: "Failed to create BOQ", details: error.message }, { status: 500 })
        }
        savedBoq = data
      }

      console.log("[v0] BOQ saved successfully, id:", savedBoq.id)
      return Response.json({ boq: savedBoq })
    }

    // Otherwise, provide pricing advice (existing functionality)
    const context = await StrategistService.buildContext(user.id, finalTenderId, "boq")

    // Get tender analysis if available
    const { data: analysis } = await supabase
      .from("user_custom_tender_analysis")
      .select("analysis_data")
      .eq("tender_id", finalTenderId)
      .single()

    const { data: tenderData } = await supabase.from("user_tenders").select("*").eq("id", finalTenderId).single()

    const systemPrompt = `You are an expert pricing strategist focused EXCLUSIVELY on helping the user win THIS SPECIFIC tender.

🎯 **YOU ARE WORKING ON THIS TENDER:**
Title: "${tenderData?.title || "Tender"}"
Organization: ${tenderData?.organization || "Not specified"}
Deadline: ${tenderData?.deadline || "Not specified"}
Value: ${tenderData?.value || "Not specified"}
Description: ${tenderData?.description || "No description"}

🚨 **CRITICAL**: Every piece of advice MUST be specific to THIS tender. Do NOT give generic pricing advice.

## Your Role FOR THIS TENDER
- Analyze BOQ (Bill of Quantities) structures FOR THIS SPECIFIC tender
- Provide pricing guidance and margin recommendations FOR THIS tender
- Identify pricing risks and opportunities SPECIFIC TO THIS tender
- Suggest competitive positioning strategies FOR THIS tender

## User Context
${context.company_profile?.company_name ? `Company: ${context.company_profile.company_name}` : ""}
${context.company_profile?.industry ? `Industry: ${context.company_profile.industry}` : ""}
${context.user_preferences?.experience_level ? `Experience: ${context.user_preferences.experience_level}` : ""}

## THIS TENDER's Analysis
${analysis?.analysis_data ? JSON.stringify(analysis.analysis_data, null, 2) : "Not available"}

## Guidelines FOR THIS TENDER
- Reference "${tenderData?.title}" in your responses
- Be specific with percentage ranges and ZAR amounts FOR THIS tender
- Consider South African market conditions relevant TO THIS tender
- Factor in B-BBEE requirements and local content FOR THIS tender
- Warn about underpricing risks SPECIFIC TO THIS tender
- Suggest areas for cost optimization IN THIS tender`

    const userPrompt =
      question ||
      `Analyze this BOQ for "${tenderData?.title || "this tender"}" and provide pricing strategy recommendations specifically tailored to winning this tender:

${boq_items ? JSON.stringify(boq_items, null, 2) : "No BOQ items provided - provide general pricing guidance for THIS specific tender based on the tender details above."}`

    console.log("[Strategist] BOQ analysis for THIS SPECIFIC tender:", finalTenderId, tenderData?.title)

    const { text } = await generateTextViaProvider({
      model: "openai/gpt-4-turbo",
      system: systemPrompt,
      prompt: userPrompt,
      temperature: 0.6,
      maxTokens: 2000,
    })

    return Response.json({
      advice: text,
      tender_id: finalTenderId,
    })
  } catch (error: any) {
    console.error("[Strategist] BOQ error:", error)
    return Response.json({ error: "Failed to analyze BOQ", details: error.message }, { status: 500 })
  }
}

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
    const tenderId = searchParams.get("tenderId")
    const tenderType = searchParams.get("tenderType") || "custom"

    if (!tenderId) {
      return Response.json({ error: "Tender ID required" }, { status: 400 })
    }

    const { data: boq, error } = await supabase
      .from("tender_boq")
      .select("*")
      .eq("tender_id", tenderId)
      .eq("tender_type", tenderType)
      .eq("user_id", user.id)
      .single()

    if (error && error.code !== "PGRST116") {
      console.error("[Strategist] Error fetching BOQ:", error)
      throw error
    }

    return Response.json({ boq: boq || null })
  } catch (error: any) {
    console.error("[Strategist] BOQ GET error:", error)
    return Response.json({ error: "Failed to fetch BOQ", details: error.message }, { status: 500 })
  }
}
