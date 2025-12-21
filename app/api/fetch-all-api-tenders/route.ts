import { NextResponse } from "next/server"
import { fetchFromAllAPISources } from "@/lib/services/api-tender-sources"

export async function POST() {
  try {
    console.log("[v0] Starting multi-source API tender fetch...")

    const results = await fetchFromAllAPISources()

    console.log("[v0] Multi-source fetch complete:", results)

    return NextResponse.json({
      success: results.success,
      message: `Fetched ${results.totalFetched} tenders, saved ${results.totalSaved}`,
      totalFetched: results.totalFetched,
      totalSaved: results.totalSaved,
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
    ) // Return 200 so client can see the error details
  }
}
