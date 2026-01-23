import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: tenderId } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { dataType, data } = body

    if (!dataType || !data) {
      return NextResponse.json({ error: "dataType and data are required" }, { status: 400 })
    }

    let result

    switch (dataType) {
      case "boq":
        // Save BOQ data to tender_boq table
        result = await saveBoqData(supabase, tenderId, user.id, data)
        break

      case "project_plan":
        // Save project plan to tender_project_plans table
        result = await saveProjectPlan(supabase, tenderId, user.id, data)
        break

      case "form_responses":
        // Save form responses to tender_responses table
        result = await saveFormResponses(supabase, tenderId, user.id, data)
        break

      case "analysis":
        // Update tender_analysis with new data
        result = await updateAnalysis(supabase, tenderId, data)
        break

      default:
        return NextResponse.json({ error: `Unknown dataType: ${dataType}` }, { status: 400 })
    }

    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    console.error("[v0] Error saving tender data:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to save data" },
      { status: 500 }
    )
  }
}

async function saveBoqData(supabase: any, tenderId: string, userId: string, boqData: any) {
  // Check if BOQ already exists for this tender
  const { data: existing } = await supabase
    .from("tender_boq")
    .select("id")
    .eq("tender_id", tenderId)
    .eq("user_id", userId)
    .maybeSingle()

  // Match actual table schema: tender_boq columns
  const boqRecord = {
    tender_id: tenderId,
    user_id: userId,
    tender_type: boqData.tender_type || "scraped",
    boq_items: boqData.sections || boqData.boq_items || [],
    subtotal: boqData.summary?.subtotal || null,
    contingency_percent: boqData.summary?.contingency_percent || 5,
    contingency_amount: boqData.summary?.contingency_amount || null,
    profit_margin_percent: boqData.summary?.profit_percent || 10,
    profit_amount: boqData.summary?.profit_amount || null,
    vat_percent: boqData.summary?.vat_percent || 15,
    vat_amount: boqData.summary?.vat_amount || null,
    total_amount: boqData.summary?.total_inclusive || null,
    pricing_strategy: boqData.pricing_strategy || null,
    direct_costs: boqData.direct_costs || null,
    indirect_costs: boqData.indirect_costs || null,
    updated_at: new Date().toISOString(),
  }

  if (existing) {
    const { data, error } = await supabase
      .from("tender_boq")
      .update(boqRecord)
      .eq("id", existing.id)
      .select()
      .single()

    if (error) throw error
    return data
  } else {
    const { data, error } = await supabase
      .from("tender_boq")
      .insert(boqRecord)
      .select()
      .single()

    if (error) throw error
    return data
  }
}

async function saveProjectPlan(supabase: any, tenderId: string, userId: string, planData: any) {
  // Check if project plan exists
  const { data: existing } = await supabase
    .from("tender_project_plans")
    .select("id")
    .eq("tender_id", tenderId)
    .eq("user_id", userId)
    .maybeSingle()

  // Match actual table schema: tender_project_plans columns
  const planRecord = {
    tender_id: tenderId,
    user_id: userId,
    tender_type: planData.tender_type || "scraped",
    project_title: planData.project_overview?.title || planData.title || "Untitled Project",
    project_summary: planData.project_overview?.objective || planData.summary || "",
    key_deliverables: planData.phases?.flatMap((p: any) => p.deliverables || []) || [],
    success_criteria: planData.quality_management?.standards_applicable || [],
    risk_assessment: planData.phases?.flatMap((p: any) => p.risks || []) || [],
    resource_requirements: planData.resource_requirements || {},
    estimated_timeline: planData.phases || [],
    estimated_budget: planData.budget_breakdown || {},
    capacity_requirements: planData.resource_requirements?.equipment || [],
    financial_requirements: planData.budget_breakdown || {},
    regulatory_requirements: planData.health_safety_environment?.certifications_required || [],
    compliance_checklist: planData.quality_management?.documentation_required || [],
    insurance_requirements: planData.health_safety_environment?.certifications_required || [],
    certifications_required: planData.resource_requirements?.key_personnel?.map((p: any) => p.qualifications_required) || [],
    updated_at: new Date().toISOString(),
  }

  if (existing) {
    const { data, error } = await supabase
      .from("tender_project_plans")
      .update(planRecord)
      .eq("id", existing.id)
      .select()
      .single()

    if (error) throw error
    return data
  } else {
    const { data, error } = await supabase
      .from("tender_project_plans")
      .insert(planRecord)
      .select()
      .single()

    if (error) throw error
    return data
  }
}

async function saveFormResponses(supabase: any, tenderId: string, userId: string, formData: any) {
  // tender_responses table schema: tender_id, response_data (jsonb)
  // Note: This table doesn't have user_id column - it's per tender, not per user
  const { data: existing } = await supabase
    .from("tender_responses")
    .select("id")
    .eq("tender_id", tenderId)
    .maybeSingle()

  // Store all form data in the response_data JSONB column
  const responseRecord = {
    tender_id: tenderId,
    response_data: {
      responses: formData.responses || {},
      completion_percent: formData.completion_percent || 0,
      is_complete: formData.is_complete || false,
      last_updated_by: userId,
    },
    updated_at: new Date().toISOString(),
  }

  if (existing) {
    const { data, error } = await supabase
      .from("tender_responses")
      .update(responseRecord)
      .eq("id", existing.id)
      .select()
      .single()

    if (error) throw error
    return data
  } else {
    const { data, error } = await supabase
      .from("tender_responses")
      .insert(responseRecord)
      .select()
      .single()

    if (error) throw error
    return data
  }
}

async function updateAnalysis(supabase: any, tenderId: string, analysisData: any) {
  // Update the tender_analysis table with new data
  const { data: existing } = await supabase
    .from("tender_analysis")
    .select("id, analysis_data")
    .eq("tender_id", tenderId)
    .maybeSingle()

  if (existing) {
    // Merge with existing analysis data
    const mergedData = {
      ...existing.analysis_data,
      ...analysisData,
    }

    const { data, error } = await supabase
      .from("tender_analysis")
      .update({
        analysis_data: mergedData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existing.id)
      .select()
      .single()

    if (error) throw error
    return data
  } else {
    const { data, error } = await supabase
      .from("tender_analysis")
      .insert({
        tender_id: tenderId,
        analysis_data: analysisData,
      })
      .select()
      .single()

    if (error) throw error
    return data
  }
}

// GET endpoint to retrieve saved data
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: tenderId } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const url = new URL(request.url)
  const dataType = url.searchParams.get("type")

  try {
    let data

    switch (dataType) {
      case "boq":
        const { data: boqData } = await supabase
          .from("tender_boq")
          .select("*")
          .eq("tender_id", tenderId)
          .eq("user_id", user.id)
          .maybeSingle()
        data = boqData
        break

      case "project_plan":
        const { data: planData } = await supabase
          .from("tender_project_plans")
          .select("*")
          .eq("tender_id", tenderId)
          .eq("user_id", user.id)
          .maybeSingle()
        data = planData
        break

      case "form_responses":
        const { data: formData } = await supabase
          .from("tender_responses")
          .select("*")
          .eq("tender_id", tenderId)
          .maybeSingle()
        data = formData
        break

      case "all":
      default:
        // Get all saved data for this tender
        const [boq, plan, responses] = await Promise.all([
          supabase
            .from("tender_boq")
            .select("*")
            .eq("tender_id", tenderId)
            .eq("user_id", user.id)
            .maybeSingle(),
          supabase
            .from("tender_project_plans")
            .select("*")
            .eq("tender_id", tenderId)
            .eq("user_id", user.id)
            .maybeSingle(),
          supabase
            .from("tender_responses")
            .select("*")
            .eq("tender_id", tenderId)
            .maybeSingle(),
        ])
        
        data = {
          boq: boq.data,
          project_plan: plan.data,
          form_responses: responses.data,
        }
        break
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("[v0] Error fetching tender data:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch data" },
      { status: 500 }
    )
  }
}
