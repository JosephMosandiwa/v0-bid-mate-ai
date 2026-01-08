import { NextResponse } from "next/server"
import { engineOrchestrator } from "@/lib/engines/orchestrator"

export async function GET() {
  try {
    console.log("[v0] Test Orchestrator: running smoke test")

    const mockTender = {
      tender_reference: `TEST-${Date.now()}`,
      title: "Test Tender for Orchestrator",
      description: "This is a synthetic tender used for smoke testing the orchestrator",
    }

    const result = await engineOrchestrator.processScrapedTender(mockTender as any)

    return NextResponse.json({ success: true, result })
  } catch (error) {
    console.error("[v0] Test Orchestrator: error", error)
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : String(error) }, { status: 500 })
  }
}
