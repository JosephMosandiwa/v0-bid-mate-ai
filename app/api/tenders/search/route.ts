import { createClient } from "@/lib/supabase/server"
import type { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get("q") || ""
    const level = searchParams.get("level")
    const province = searchParams.get("province")
    const category = searchParams.get("category")
    const isActive = searchParams.get("active") !== "false"
    const limit = Number.parseInt(searchParams.get("limit") || "50")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    const supabase = await createClient()

    // Build query
    let dbQuery = supabase
      .from("scraped_tenders")
      .select("*", { count: "exact" })
      .eq("is_active", isActive)
      .order("scraped_at", { ascending: false })
      .range(offset, offset + limit - 1)

    // Apply filters
    if (level) {
      dbQuery = dbQuery.eq("source_level", level)
    }

    if (province) {
      dbQuery = dbQuery.eq("source_province", province)
    }

    if (category) {
      dbQuery = dbQuery.eq("category", category)
    }

    // Apply full-text search if query provided
    if (query) {
      dbQuery = dbQuery.textSearch("search_vector", query, {
        type: "websearch",
        config: "english",
      })
    }

    const { data: tenders, error, count } = await dbQuery

    if (error) {
      console.error("[API] Error searching tenders:", error)
      return Response.json({ error: "Failed to search tenders" }, { status: 500 })
    }

    return Response.json({
      tenders: tenders || [],
      total: count || 0,
      limit,
      offset,
    })
  } catch (error) {
    console.error("[API] Tender search error:", error)
    return Response.json({ error: "Failed to search tenders" }, { status: 500 })
  }
}
