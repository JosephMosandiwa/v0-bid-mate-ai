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

    // Generate project plan using AI
    const { object: plan } = await generateObject({
      model: "openai/gpt-4o-mini",
      schema: PROJECT_PLAN_SCHEMA,
      prompt: `Generate a detailed project plan for this South African tender:

Title: ${tenderTitle}
Description: ${tenderDescription || "No description provided"}
${analysisData ? `Analysis: ${JSON.stringify(analysisData)}` : ""}

Create a realistic, implementable project plan including:
1. Budget breakdown (labor, materials, equipment, overhead)
2. Phased timeline with specific tasks
3. Resource requirements (personnel with skills, equipment, materials)
4. Risk assessment with mitigation strategies
5. Success criteria and key deliverables

Consider South African context (B-BBEE, CIDB requirements, local regulations).`,
    })

    // Save to database
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
