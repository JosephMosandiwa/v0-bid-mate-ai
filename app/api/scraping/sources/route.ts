import { createClient } from "@/lib/supabase/server"
import type { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const level = searchParams.get("level")
    const province = searchParams.get("province")
    const active = searchParams.get("active")

    const supabase = await createClient()

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

    const { data: sources, error } = await query

    if (error) {
      console.error("[API] Error fetching sources:", error)
      return Response.json({ error: "Failed to fetch sources" }, { status: 500 })
    }

    return Response.json({ sources: sources || [] })
  } catch (error) {
    console.error("[API] Sources fetch error:", error)
    return Response.json({ error: "Failed to fetch sources" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { sourceId, updates } = await request.json()

    if (!sourceId) {
      return Response.json({ error: "sourceId required" }, { status: 400 })
    }

    const supabase = await createClient()

    const { data, error } = await supabase.from("tender_sources").update(updates).eq("id", sourceId).select().single()

    if (error) {
      console.error("[API] Error updating source:", error)
      return Response.json({ error: "Failed to update source" }, { status: 500 })
    }

    return Response.json({ source: data })
  } catch (error) {
    console.error("[API] Source update error:", error)
    return Response.json({ error: "Failed to update source" }, { status: 500 })
  }
}
