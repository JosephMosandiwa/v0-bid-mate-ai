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

    // If this is a BOQ generation request (has tenderTitle)
    if (tenderTitle) {
      console.log("[Strategist] Generating comprehensive BOQ for:", tenderTitle)

      const prompt = `Generate a comprehensive Bill of Quantities (BOQ) for this South African tender:

**Tender Details:**
Title: ${tenderTitle}
Description: ${tenderDescription || "Not provided"}

**Analysis Data:**
${analysisData ? JSON.stringify(analysisData, null, 2) : "Not available"}

**Project Plan:**
${projectPlan ? JSON.stringify(projectPlan, null, 2) : "Not available"}

Generate a detailed, realistic BOQ with the following structure:

1. **BOQ Items** (15-30 line items):
   - Item number (format: "1.1", "1.2", etc.)
   - Description (detailed description of work/material)
   - Category (Labor, Materials, Equipment, Subcontractors, Professional Services, etc.)
   - Unit (e.g., m², hours, kg, each, lot)
   - Quantity
   - Unit rate in ZAR (realistic South African market rates for 2025)
   - Amount (quantity × unit rate)
   - Notes (any special considerations)

2. **Pricing Strategy:**
   - strategy_type: "competitive", "value_based", "cost_plus", or "strategic_loss_leader"
   - competitive_analysis: Brief analysis of likely competition
   - risk_premium_percent: Risk premium (0-10%)
   - discount_offered_percent: Any discount to win (0-5%)
   - payment_terms: e.g., "30/60/90 days" or "Monthly progress payments"
   - pricing_rationale: Why this pricing approach

3. **Direct Costs Breakdown:**
   - labor: Total labor costs
   - materials: Total material costs
   - equipment: Total equipment costs
   - subcontractors: Total subcontractor costs

4. **Indirect Costs Breakdown:**
   - overhead: Office overhead (10-15% of direct)
   - admin: Admin costs (3-5% of direct)
   - transport: Transport/logistics costs
   - insurance: Insurance premiums
   - certifications: Certification costs (CIDB, ISO, etc.)
   - compliance: Compliance costs (B-BBEE, H&S, etc.)

5. **Financial Calculations:**
   - contingency_percent: 10
   - profit_margin_percent: 15
   - vat_percent: 15
   - Calculate all amounts correctly

6. **Break-Even Analysis:**
   - break_even_value: ZAR amount to break even
   - break_even_timeline: "X months"
   - profitability_threshold: Description

7. **Cash Flow Projection:**
   - months: Array of 6-12 months with inflow, outflow, net_cash_flow, cumulative_cash_flow

8. **Profitability Analysis:**
   - gross_profit_margin: percentage
   - net_profit_margin: percentage
   - return_on_investment: percentage
   - payback_period_months: number

Return ONLY valid JSON with this exact structure.`

      const { text } = await generateText({
        model: "openai/gpt-4o",
        prompt,
        temperature: 0.7,
        maxTokens: 4000,
      })

      // Parse the generated BOQ
      let boqData
      try {
        // Extract JSON from markdown if present
        const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) || text.match(/```\s*([\s\S]*?)\s*```/)
        const jsonText = jsonMatch ? jsonMatch[1] : text
        boqData = JSON.parse(jsonText)
      } catch (parseError) {
        console.error("[Strategist] Failed to parse BOQ JSON:", parseError)
        return Response.json({ error: "Failed to generate valid BOQ" }, { status: 500 })
      }

      // Calculate totals
      const subtotal = boqData.boq_items.reduce((sum: number, item: any) => sum + item.amount, 0)
      const contingency_amount = subtotal * (boqData.contingency_percent / 100)
      const subtotal_with_contingency = subtotal + contingency_amount
      const profit_amount = subtotal_with_contingency * (boqData.profit_margin_percent / 100)
      const subtotal_with_profit = subtotal_with_contingency + profit_amount
      const vat_amount = subtotal_with_profit * (boqData.vat_percent / 100)
      const total_amount = subtotal_with_profit + vat_amount

      // Save to database
      const { data: savedBoq, error } = await supabase
        .from("tender_boq")
        .upsert(
          {
            tender_id: finalTenderId,
            tender_type: finalTenderType,
            user_id: user.id,
            boq_items: boqData.boq_items,
            subtotal,
            contingency_percent: boqData.contingency_percent,
            contingency_amount,
            profit_margin_percent: boqData.profit_margin_percent,
            profit_amount,
            vat_percent: boqData.vat_percent,
            vat_amount,
            total_amount,
            pricing_strategy: boqData.pricing_strategy,
            direct_costs: boqData.direct_costs,
            indirect_costs: boqData.indirect_costs,
            break_even_analysis: boqData.break_even_analysis,
            cash_flow_projection: boqData.cash_flow_projection,
            profitability_analysis: boqData.profitability_analysis,
            updated_at: new Date().toISOString(),
          },
          {
            onConflict: "tender_id,tender_type,user_id",
          },
        )
        .select()
        .single()

      if (error) {
        console.error("[Strategist] Error saving BOQ:", error)
        throw error
      }

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

    console.log("[Strategist] BOQ analysis for tender:", finalTenderId)

    const { text } = await generateText({
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
    return Response.json({ error: "Failed to analyze BOQ" }, { status: 500 })
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
    return Response.json({ error: "Failed to fetch BOQ" }, { status: 500 })
  }
}
