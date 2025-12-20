import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { engineOrchestrator } from "@/lib/engines/orchestrator"

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] Strategist API: Enriching tender with strategy")

    const supabase = await createServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { tenderId, tenderType } = await request.json()

    if (!tenderId || !tenderType) {
      return NextResponse.json({ error: "Missing tenderId or tenderType" }, { status: 400 })
    }

    const result = await engineOrchestrator.enrichTenderWithStrategy(tenderId, tenderType, user.id)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      competitiveness: result.competitiveness,
      opportunities: result.opportunities,
      recommendations: result.recommendations,
    })
  } catch (error) {
    console.error("[v0] Strategist API: Error enriching tender:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 })
  }
}
