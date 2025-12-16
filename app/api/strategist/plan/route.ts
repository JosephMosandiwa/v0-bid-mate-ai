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
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { tenderId, tenderType = "custom", tenderTitle, tenderDescription, analysisData } = body

    if (!tenderId || !tenderTitle) {
      return NextResponse.json({ error: "Tender ID and title required" }, { status: 400 })
    }

    const { object: plan } = await generateObject({
      model: "openai/gpt-4o-mini",
      schema: PROJECT_PLAN_SCHEMA,
      prompt: `Generate a comprehensive project plan for this South African tender bid:

Title: ${tenderTitle}
Description: ${tenderDescription || "No description provided"}
${analysisData ? `Analysis: ${JSON.stringify(analysisData)}` : ""}

Create a detailed, implementable project plan including:

1. **Budget Breakdown** - Include all costs:
   - Labor (personnel costs)
   - Materials and supplies
   - Equipment (purchase or rental)
   - Overhead and admin
   - Insurance premiums
   - Certification and licensing costs
   - Compliance and legal costs

2. **Timeline** - Realistic phases with tasks

3. **Resource Requirements** - Personnel, equipment, materials

4. **Certifications Required** - List ALL certifications needed such as:
   - CIDB grading (if construction)
   - Professional registrations (engineers, architects, etc.)
   - ISO certifications (9001, 14001, 45001)
   - Industry-specific licenses
   - B-BBEE certificate
   - Tax clearance certificate
   - Company registration documents
   Include: name, issuing authority, validity period, cost, processing time, and priority

5. **Insurance Requirements** - Specify ALL insurance policies needed:
   - Professional indemnity insurance
   - Public liability insurance
   - Employer's liability (COIDA)
   - All-risk insurance
   - Performance bonds
   - Plant and equipment insurance
   Include: type, coverage amount, provider suggestions, annual cost, priority

6. **Compliance Checklist** - South African regulatory requirements:
   - B-BBEE compliance
   - PFMA/MFMA compliance (if government)
   - Tax compliance (SARS)
   - Labour law compliance (BCEA, LRA)
   - Health & Safety (OHS Act)
   - Environmental regulations
   - Municipal by-laws
   - Industry-specific regulations
   For each: requirement, current status, deadline, evidence needed, notes

7. **Regulatory Requirements** - Specific regulations to comply with:
   - Relevant Acts and regulations
   - Reporting obligations
   - Inspection requirements
   - Penalties for non-compliance

8. **Financial Requirements** - Financial readiness:
   - Bank guarantee amount (if required)
   - Cash flow requirements (monthly breakdown)
   - Working capital needed
   - Credit facilities recommendations

9. **Capacity Requirements** - Demonstrate capacity:
   - Past similar projects (description)
   - Number of references needed
   - Equipment that must be owned
   - Personnel qualifications required

10. **Risk Assessment** - Identify and mitigate risks

11. **Success Criteria & Deliverables**

Be specific, practical, and aligned with South African procurement practices.`,
    })

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

    if (error) throw error

    return NextResponse.json({ plan: savedPlan })
  } catch (error) {
    console.error("[Strategist] Plan generation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
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
