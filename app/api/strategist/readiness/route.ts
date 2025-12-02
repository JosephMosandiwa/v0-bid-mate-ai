// ============================================
// AI STRATEGIST - READINESS SCORE ENDPOINT
// ============================================

import { createClient } from "@/lib/supabase/server"
import { CompetitivenessService, AlertService } from "@/lib/engines/strategist"

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
    const tenderId = searchParams.get("tender_id") || undefined

    // Get or calculate score
    const score = await CompetitivenessService.getScore(user.id, tenderId)

    if (!score) {
      return Response.json({ error: "Failed to calculate readiness score" }, { status: 500 })
    }

    return Response.json({ score })
  } catch (error: any) {
    console.error("[Strategist] Readiness error:", error)
    return Response.json({ error: "Failed to get readiness score" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { tender_id, force_recalculate } = await request.json()

    // Force recalculate
    const score = await CompetitivenessService.calculateScore(user.id, tender_id)

    if (!score) {
      return Response.json({ error: "Failed to calculate readiness score" }, { status: 500 })
    }

    // Generate compliance alerts
    await AlertService.generateComplianceAlerts(user.id)

    return Response.json({
      score,
      message: "Readiness score calculated successfully",
    })
  } catch (error: any) {
    console.error("[Strategist] Readiness POST error:", error)
    return Response.json({ error: "Failed to calculate readiness" }, { status: 500 })
  }
}
