import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { engineOrchestrator } from "@/lib/engines/orchestrator"

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] Documind API: Processing uploaded document")

    const supabase = await createServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer()

    const result = await engineOrchestrator.processUploadedDocument(arrayBuffer, file.type, user.id)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      document: result.document,
      extractedTender: result.extractedTenderData,
      validation: result.validation,
    })
  } catch (error) {
    console.error("[v0] Documind API: Error processing upload:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 })
  }
}
