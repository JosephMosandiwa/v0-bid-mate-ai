import { NextResponse } from "next/server"
import { fetchFromAllAPISources } from "@/lib/services/api-tender-sources"
import { createAdminClient } from "@/lib/supabase/admin"

export async function POST() {
  try {
    console.log("[v0] Starting multi-source API tender fetch...")

    const supabase = createAdminClient()
    const { count: beforeCount } = await supabase.from("scraped_tenders").select("*", { count: "exact", head: true })

    const results = await fetchFromAllAPISources()

    const { count: afterCount } = await supabase.from("scraped_tenders").select("*", { count: "exact", head: true })

    const newTenders = (afterCount || 0) - (beforeCount || 0)

    console.log("[v0] Multi-source fetch complete:", results)

    return NextResponse.json({
      success: results.success,
      message: `Fetched ${results.totalFetched} tenders from APIs, saved ${results.totalSaved} (${newTenders} new, ${results.totalSaved - newTenders} updated)`,
      totalFetched: results.totalFetched,
      totalSaved: results.totalSaved,
      beforeCount: beforeCount || 0,
      afterCount: afterCount || 0,
      newTenders,
      sources: results.sources,
    })
  } catch (error: any) {
    console.error("[v0] Multi-source API fetch error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        sources: [],
      },
      { status: 200 },
    )
  }
}
