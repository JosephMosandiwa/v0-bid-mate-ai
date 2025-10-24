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

    console.log("[v0] Search params:", { query, level, province, category, isActive, limit, offset })

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

    if (query && query.trim()) {
      console.log("[v0] Applying full-text search for query:", query)
      dbQuery = dbQuery.textSearch("search_vector", query, {
        type: "websearch",
        config: "english",
      })
    }

    const { data: tenders, error, count } = await dbQuery

    console.log("[v0] Search results:", {
      tendersCount: tenders?.length || 0,
      totalCount: count,
      hasError: !!error,
    })

    if (error) {
      console.error("[v0] Error searching tenders:", error)
      return Response.json({ error: "Failed to search tenders", details: error.message }, { status: 500 })
    }

    if (count === 0) {
      console.log("[v0] No tenders found in database. The scraped_tenders table may be empty.")
    }

    return Response.json({
      tenders: tenders || [],
      total: count || 0,
      limit,
      offset,
    })
  } catch (error) {
    console.error("[v0] Tender search error:", error)
    return Response.json(
      {
        error: "Failed to search tenders",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
