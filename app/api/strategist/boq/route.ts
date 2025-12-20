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

Generate a detailed, realistic BOQ specifically for "${tenderTitle}" with the following structure:

1. **BOQ Items** (15-30 line items SPECIFIC TO THIS TENDER):
   - Item number (format: "1.1", "1.2", etc.)
   - Description (detailed description of work/material REQUIRED FOR THIS TENDER)
   - Category (Labor, Materials, Equipment, Subcontractors, Professional Services, etc.)
   - Unit (e.g., m², hours, kg, each, lot)
   - Quantity (realistic for THIS TENDER's scope)
   - Unit rate in ZAR (realistic South African market rates for 2025)
   - Amount (quantity × unit rate)
   - Notes (any special considerations FOR THIS TENDER)

2. **Pricing Strategy FOR THIS TENDER:**
   - strategy_type: "competitive", "value_based", "cost_plus", or "strategic_loss_leader"
   - competitive_analysis: Analysis of competition FOR THIS SPECIFIC tender
   - risk_premium_percent: Risk premium for THIS tender (0-10%)
   - discount_offered_percent: Discount to win THIS tender (0-5%)
   - payment_terms: e.g., "30/60/90 days" or "Monthly progress payments"
   - pricing_rationale: Why this pricing approach FOR THIS tender

3. **Direct Costs Breakdown FOR THIS TENDER:**
   - labor: Total labor costs FOR THIS PROJECT
   - materials: Total material costs FOR THIS PROJECT
   - equipment: Total equipment costs FOR THIS PROJECT
   - subcontractors: Total subcontractor costs FOR THIS PROJECT

4. **Indirect Costs Breakdown FOR THIS TENDER:**
   - overhead: Office overhead (10-15% of direct)
   - admin: Admin costs (3-5% of direct)
   - transport: Transport/logistics costs FOR THIS PROJECT
   - insurance: Insurance premiums FOR THIS PROJECT
   - certifications: Certification costs required FOR THIS TENDER (CIDB, ISO, etc.)
   - compliance: Compliance costs FOR THIS TENDER (B-BBEE, H&S, etc.)

5. **Financial Calculations:**
   - contingency_percent: 10
   - profit_margin_percent: 15
   - vat_percent: 15
   - Calculate all amounts correctly

6. **Break-Even Analysis FOR THIS TENDER:**
   - break_even_value: ZAR amount to break even ON THIS PROJECT
   - break_even_timeline: "X months" FOR THIS PROJECT
   - profitability_threshold: Description FOR THIS PROJECT

7. **Cash Flow Projection FOR THIS TENDER:**
   - months: Array of 6-12 months with inflow, outflow, net_cash_flow, cumulative_cash_flow BASED ON THIS TENDER

8. **Profitability Analysis FOR THIS TENDER:**
   - gross_profit_margin: percentage FOR THIS PROJECT
   - net_profit_margin: percentage FOR THIS PROJECT
   - return_on_investment: percentage FOR THIS PROJECT
   - payback_period_months: number FOR THIS PROJECT

Remember: EVERY item must be justified by THIS tender's specific requirements. Reference "${tenderTitle}" throughout.

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
        const { data, error } = await supabase
          .from("tender_boq")
          .update({
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
          })
          .eq("id", existingBoq.id)
          .select()
          .single()

        if (error) {
          console.error("[Strategist] Error updating BOQ:", error)
          return Response.json({ error: "Failed to update BOQ", details: error.message }, { status: 500 })
        }
        savedBoq = data
      } else {
        // Insert new
        const { data, error } = await supabase
          .from("tender_boq")
          .insert({
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
          })
          .select()
          .single()

        if (error) {
          console.error("[Strategist] Error inserting BOQ:", error)
          return Response.json({ error: "Failed to create BOQ", details: error.message }, { status: 500 })
        }
        savedBoq = data
      }

      console.log("[Strategist] BOQ saved successfully")
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
