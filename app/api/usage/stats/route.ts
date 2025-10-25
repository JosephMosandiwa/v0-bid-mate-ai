import { NextResponse } from "next/server"
import { UsageTrackingService } from "@/lib/services/usage-tracking-service"

export async function GET() {
  try {
    const stats = await UsageTrackingService.getCurrentMonthUsage()
    return NextResponse.json(stats)
  } catch (error) {
    console.error("[v0] Error fetching usage stats:", error)
    return NextResponse.json({ error: "Failed to fetch usage stats" }, { status: 500 })
  }
}
