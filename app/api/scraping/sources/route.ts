import { createClient } from "@supabase/supabase-js"
import type { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  try {
    console.log("[v0] Fetching tender sources...")
    const searchParams = request.nextUrl.searchParams
    const level = searchParams.get("level")
    const province = searchParams.get("province")
    const active = searchParams.get("active")

    console.log("[v0] Query params:", { level, province, active })

    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
    console.log("[v0] Supabase client created")

    let query = supabase.from("tender_sources").select("*").order("name")

    if (level) {
      query = query.eq("level", level)
    }

    if (province) {
      query = query.eq("province", province)
    }

    if (active !== null) {
      query = query.eq("is_active", active === "true")
    }

    console.log("[v0] Executing query...")
    const { data: sources, error } = await query

    if (error) {
      console.error("[v0] Error fetching sources:", error)
      console.error("[v0] Error details:", JSON.stringify(error, null, 2))
      return Response.json({ error: "Failed to fetch sources", details: error.message }, { status: 500 })
    }

    console.log("[v0] Sources fetched successfully:", sources?.length || 0, "sources")
    return Response.json({ sources: sources || [] })
  } catch (error) {
    console.error("[v0] Sources fetch error:", error)
    console.error("[v0] Error stack:", error instanceof Error ? error.stack : "No stack trace")
    return Response.json(
      {
        error: "Failed to fetch sources",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { sourceId, updates } = await request.json()

    if (!sourceId) {
      return Response.json({ error: "sourceId required" }, { status: 400 })
    }

    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

    const { data, error } = await supabase.from("tender_sources").update(updates).eq("id", sourceId).select().single()

    if (error) {
      console.error("[v0] Error updating source:", error)
      return Response.json({ error: "Failed to update source" }, { status: 500 })
    }

    return Response.json({ source: data })
  } catch (error) {
    console.error("[v0] Source update error:", error)
    return Response.json({ error: "Failed to update source" }, { status: 500 })
  }
}
