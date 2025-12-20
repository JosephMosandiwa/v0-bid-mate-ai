import { generateText } from "ai"
import { z } from "zod"
import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

const PROJECT_PLAN_SCHEMA = z.object({
  project_title: z.string(),
  project_summary: z.string(),
  estimated_budget: z.object({
    total: z.number(),
    breakdown: z.object({
      labor: z.number(),
      materials: z.number(),
      equipment: z.number(),
      overhead: z.number(),
      insurance: z.number(),
      certifications: z.number(),
      compliance: z.number(),
    }),
  }),
  estimated_timeline: z.object({
    total_weeks: z.number(),
    phases: z.array(
      z.object({
        name: z.string(),
        duration_weeks: z.number(),
        tasks: z.array(z.string()),
      }),
    ),
  }),
  resource_requirements: z.object({
    personnel: z.array(z.object({ role: z.string(), count: z.number(), skills: z.array(z.string()) })),
    equipment: z.array(z.string()),
    materials: z.array(z.string()),
  }),
  risk_assessment: z.object({
    risks: z.array(
      z.object({
        risk: z.string(),
        impact: z.enum(["low", "medium", "high"]),
        likelihood: z.enum(["low", "medium", "high"]),
        mitigation: z.string(),
      }),
    ),
  }),
  certifications_required: z.array(
    z.object({
      name: z.string(),
      issuer: z.string(),
      validity_period: z.string(),
      cost: z.number(),
      processing_time: z.string(),
      priority: z.enum(["critical", "high", "medium", "low"]),
    }),
  ),
  insurance_requirements: z.array(
    z.object({
      type: z.string(),
      coverage_amount: z.number(),
      provider_suggestions: z.array(z.string()),
      annual_cost: z.number(),
      priority: z.enum(["critical", "high", "medium", "low"]),
    }),
  ),
  compliance_checklist: z.array(
    z.object({
      requirement: z.string(),
      status: z.enum(["pending", "in_progress", "completed", "not_required"]),
      deadline: z.string(),
      evidence_needed: z.string(),
      notes: z.string(),
    }),
  ),
  regulatory_requirements: z.array(
    z.object({
      regulation: z.string(),
      description: z.string(),
      authority: z.string(),
      deadline: z.string(),
      penalties: z.string(),
    }),
  ),
  financial_requirements: z.object({
    bank_guarantee: z.number().optional(),
    cash_flow_requirements: z.string(),
    working_capital: z.number(),
    credit_facilities: z.string(),
  }),
  capacity_requirements: z.object({
    past_projects: z.string(),
    references: z.number(),
    equipment_owned: z.array(z.string()),
    personnel_qualifications: z.array(z.string()),
  }),
  success_criteria: z.array(z.string()),
  key_deliverables: z.array(z.string()),
})

export async function POST(request: Request) {
  try {
    console.log("[v0] Plan generation started")
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      console.log("[v0] Unauthorized - no user")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log("[v0] User authenticated:", user.id)

    const body = await request.json()
    const { tenderId, tenderType = "custom", tenderTitle, tenderDescription, analysisData } = body

    console.log("[v0] Request body:", { tenderId, tenderType, tenderTitle })

    if (!tenderId || !tenderTitle) {
      console.log("[v0] Missing required fields")
      return NextResponse.json({ error: "Tender ID and title required" }, { status: 400 })
    }

    console.log("[v0] Generating project plan with AI...")

    let plan
    try {
      const promptText = `Generate a comprehensive, practical project plan for this South African tender:

**Tender**: ${tenderTitle}
**Description**: ${tenderDescription || "No description provided"}
${analysisData ? `**Analysis Summary**: ${JSON.stringify(analysisData).slice(0, 800)}` : ""}

Return ONLY valid JSON (no markdown, no extra text) with this exact structure:

{
  "project_title": "string - Project name based on tender",
  "project_summary": "string - Executive summary (2-3 paragraphs)",
  "estimated_budget": {
    "total": number,
    "breakdown": {
      "labor": number,
      "materials": number,
      "equipment": number,
      "overhead": number,
      "insurance": number,
      "certifications": number,
      "compliance": number
    }
  },
  "estimated_timeline": {
    "total_weeks": number,
    "phases": [
      {"name": "string", "duration_weeks": number, "tasks": ["string"]}
    ]
  },
  "resource_requirements": {
    "personnel": [
      {"role": "string", "count": number, "skills": ["string"]}
    ],
    "equipment": ["string"],
    "materials": ["string"]
  },
  "certifications_required": [
    {"name": "string", "issuer": "string", "validity_period": "string", "cost": number, "processing_time": "string", "priority": "critical|high|medium|low"}
  ],
  "insurance_requirements": [
    {"type": "string", "coverage_amount": number, "provider_suggestions": ["string"], "annual_cost": number, "priority": "critical|high|medium|low"}
  ],
  "compliance_checklist": [
    {"requirement": "string", "status": "pending", "deadline": "string", "evidence_needed": "string", "notes": "string"}
  ],
  "regulatory_requirements": [
    {"regulation": "string", "description": "string", "authority": "string", "deadline": "string", "penalties": "string"}
  ],
  "financial_requirements": {
    "bank_guarantee": number,
    "cash_flow_requirements": "string",
    "working_capital": number,
    "credit_facilities": "string"
  },
  "capacity_requirements": {
    "past_projects": "string",
    "references": number,
    "equipment_owned": ["string"],
    "personnel_qualifications": ["string"]
  },
  "risk_assessment": {
    "risks": [
      {"risk": "string", "impact": "high|medium|low", "likelihood": "high|medium|low", "mitigation": "string"}
    ]
  },
  "success_criteria": ["string"],
  "key_deliverables": ["string"]
}

Use realistic South African values (ZAR currency). Include at least:
- 3 certifications (CIDB, ISO, B-BBEE)
- 3 insurance policies
- 5 compliance items
- 3 regulatory requirements
- 5 risks
- 3 timeline phases`

      const { text } = await generateText({
        model: "openai/gpt-4o-mini",
        prompt: promptText,
      })

      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error("No JSON found in response")
      }
      plan = JSON.parse(jsonMatch[0])
      console.log("[v0] AI plan generated successfully")
    } catch (error) {
      console.error("[v0] Failed to parse AI response:", error)
      throw error
    }

    console.log("[v0] Saving plan to database...")

    let savedPlan
    let error

    // Try upsert with conflict resolution (requires unique constraint)
    const upsertResult = await supabase
      .from("tender_project_plans")
      .upsert(
        {
          tender_id: tenderId,
          tender_type: tenderType,
          user_id: user.id,
          project_title: plan.project_title,
          project_summary: plan.project_summary,
          estimated_budget: plan.estimated_budget,
          estimated_timeline: plan.estimated_timeline,
          resource_requirements: plan.resource_requirements,
          risk_assessment: plan.risk_assessment,
          certifications_required: plan.certifications_required,
          insurance_requirements: plan.insurance_requirements,
          compliance_checklist: plan.compliance_checklist,
          regulatory_requirements: plan.regulatory_requirements,
          financial_requirements: plan.financial_requirements,
          capacity_requirements: plan.capacity_requirements,
          success_criteria: plan.success_criteria,
          key_deliverables: plan.key_deliverables,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "tender_id,tender_type,user_id" },
      )
      .select()
      .single()

    if (upsertResult.error && upsertResult.error.message.includes("unique or exclusion constraint")) {
      console.log("[v0] Unique constraint missing, trying manual upsert...")

      // Check if record exists
      const { data: existing } = await supabase
        .from("tender_project_plans")
        .select("id")
        .eq("tender_id", tenderId)
        .eq("tender_type", tenderType)
        .eq("user_id", user.id)
        .single()

      if (existing) {
        // Update existing record
        const updateResult = await supabase
          .from("tender_project_plans")
          .update({
            project_title: plan.project_title,
            project_summary: plan.project_summary,
            estimated_budget: plan.estimated_budget,
            estimated_timeline: plan.estimated_timeline,
            resource_requirements: plan.resource_requirements,
            risk_assessment: plan.risk_assessment,
            certifications_required: plan.certifications_required,
            insurance_requirements: plan.insurance_requirements,
            compliance_checklist: plan.compliance_checklist,
            regulatory_requirements: plan.regulatory_requirements,
            financial_requirements: plan.financial_requirements,
            capacity_requirements: plan.capacity_requirements,
            success_criteria: plan.success_criteria,
            key_deliverables: plan.key_deliverables,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existing.id)
          .select()
          .single()

        savedPlan = updateResult.data
        error = updateResult.error
      } else {
        // Insert new record
        const insertResult = await supabase
          .from("tender_project_plans")
          .insert({
            tender_id: tenderId,
            tender_type: tenderType,
            user_id: user.id,
            project_title: plan.project_title,
            project_summary: plan.project_summary,
            estimated_budget: plan.estimated_budget,
            estimated_timeline: plan.estimated_timeline,
            resource_requirements: plan.resource_requirements,
            risk_assessment: plan.risk_assessment,
            certifications_required: plan.certifications_required,
            insurance_requirements: plan.insurance_requirements,
            compliance_checklist: plan.compliance_checklist,
            regulatory_requirements: plan.regulatory_requirements,
            financial_requirements: plan.financial_requirements,
            capacity_requirements: plan.capacity_requirements,
            success_criteria: plan.success_criteria,
            key_deliverables: plan.key_deliverables,
          })
          .select()
          .single()

        savedPlan = insertResult.data
        error = insertResult.error
      }
    } else {
      savedPlan = upsertResult.data
      error = upsertResult.error
    }

    if (error) {
      console.error("[v0] Database save error:", error)
      throw error
    }

    console.log("[v0] Plan saved successfully")

    await supabase.from("tender_progress_logs").insert({
      tender_id: tenderId,
      tender_type: tenderType,
      user_id: user.id,
      status: "planning",
      milestone: "Project plan generated",
      progress_percent: 50,
      notes: "AI-generated comprehensive project plan created",
      created_by_system: true,
    })

    return NextResponse.json({ plan: savedPlan, success: true })
  } catch (error: any) {
    console.error("[v0] Plan generation error:", error)
    return NextResponse.json(
      {
        error: "Failed to generate project plan",
        details: error.message,
      },
      { status: 500 },
    )
  }
}

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const tenderId = searchParams.get("tenderId")
    const tenderType = searchParams.get("tenderType") || "custom"

    if (!tenderId) {
      return NextResponse.json({ error: "Tender ID required" }, { status: 400 })
    }

    const { data: plan, error } = await supabase
      .from("tender_project_plans")
      .select("*")
      .eq("tender_id", tenderId)
      .eq("tender_type", tenderType)
      .eq("user_id", user.id)
      .single()

    if (error && error.code !== "PGRST116") throw error

    return NextResponse.json({ plan: plan || null })
  } catch (error) {
    console.error("[Strategist] Plan fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
