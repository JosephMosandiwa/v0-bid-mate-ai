import { generateObject } from "ai"
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
      const result = await generateObject({
        model: "openai/gpt-4o-mini",
        schema: PROJECT_PLAN_SCHEMA,
        prompt: `Generate a comprehensive project plan for this South African tender bid:

Title: ${tenderTitle}
Description: ${tenderDescription || "No description provided"}
${analysisData ? `Analysis: ${JSON.stringify(analysisData).slice(0, 500)}...` : ""}

Create a detailed, implementable project plan including:

1. **Budget Breakdown** - Include all costs:
   - Labor (personnel costs)
   - Materials and supplies
   - Equipment (purchase or rental)
   - Overhead and admin
   - Insurance premiums
   - Certification and licensing costs
   - Compliance and legal costs

2. **Timeline** - Realistic phases with tasks (minimum 3 phases)

3. **Resource Requirements** - Personnel (minimum 3 roles), equipment, materials

4. **Certifications Required** - List certifications needed (minimum 3):
   - CIDB grading, ISO certifications, professional registrations, B-BBEE, tax clearance, etc.
   - Include: name, issuer, validity period, cost (in ZAR), processing time, and priority

5. **Insurance Requirements** - Specify insurance policies (minimum 3):
   - Professional indemnity, public liability, COIDA, all-risk, performance bonds
   - Include: type, coverage amount (in ZAR), provider suggestions, annual cost, priority

6. **Compliance Checklist** - South African regulatory requirements (minimum 5):
   - B-BBEE, PFMA/MFMA, tax compliance, labour law, health & safety, environmental
   - For each: requirement, status ("pending"), deadline, evidence needed, notes

7. **Regulatory Requirements** - Specific regulations (minimum 3)

8. **Financial Requirements** - bank guarantee, cash flow, working capital, credit facilities

9. **Capacity Requirements** - past projects, references, equipment, personnel qualifications

10. **Risk Assessment** - Identify risks (minimum 5 risks)

11. **Success Criteria & Deliverables** (minimum 3 each)

Be specific with South African context (ZAR currency, local regulations, B-BBEE requirements).`,
      })
      plan = result.object
      console.log("[v0] AI plan generated successfully")
    } catch (aiError: any) {
      console.error("[v0] AI generation error:", aiError)
      return NextResponse.json(
        {
          error: "Failed to generate plan with AI",
          details: aiError.message,
        },
        { status: 500 },
      )
    }

    console.log("[v0] Saving plan to database...")

    const { data: savedPlan, error } = await supabase
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

    if (error) {
      console.error("[v0] Database error:", error)
      throw error
    }

    console.log("[v0] Plan saved successfully")
    return NextResponse.json({ plan: savedPlan })
  } catch (error: any) {
    console.error("[v0] Plan generation error:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
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
