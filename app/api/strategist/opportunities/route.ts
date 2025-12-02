// ============================================
// AI STRATEGIST - OPPORTUNITIES ENDPOINT
// ============================================

import { createClient } from "@/lib/supabase/server"
import { OpportunityService } from "@/lib/engines/strategist"
import type { OpportunityType } from "@/lib/engines/strategist"

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
    const saved = searchParams.get("saved") === "true"
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const types = searchParams.get("types")?.split(",") as OpportunityType[] | undefined

    if (saved) {
      const opportunities = await OpportunityService.getSavedOpportunities(user.id)
      return Response.json({ opportunities })
    }

    const opportunities = await OpportunityService.discoverOpportunities(user.id, {
      limit,
      types,
      minScore: 0.3,
    })

    return Response.json({ opportunities })
  } catch (error: any) {
    console.error("[Strategist] Opportunities error:", error)
    return Response.json({ error: "Failed to fetch opportunities" }, { status: 500 })
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

    const { action } = await request.json()

    if (action === "discover") {
      const opportunities = await OpportunityService.discoverOpportunities(user.id, {
        limit: 20,
        minScore: 0.25,
      })

      return Response.json({
        opportunities,
        message: `Found ${opportunities.length} matching opportunities`,
      })
    }

    return Response.json({ error: "Invalid action" }, { status: 400 })
  } catch (error: any) {
    console.error("[Strategist] Opportunities POST error:", error)
    return Response.json({ error: "Failed to process request" }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { opportunity_id, updates } = await request.json()

    if (!opportunity_id) {
      return Response.json({ error: "Opportunity ID required" }, { status: 400 })
    }

    const success = await OpportunityService.updateOpportunityStatus(opportunity_id, updates)

    if (!success) {
      return Response.json({ error: "Failed to update opportunity" }, { status: 500 })
    }

    return Response.json({ success: true })
  } catch (error: any) {
    console.error("[Strategist] Opportunities PATCH error:", error)
    return Response.json({ error: "Failed to update opportunity" }, { status: 500 })
  }
}
