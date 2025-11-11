import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { put } from "@vercel/blob"
import type { NextRequest } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookies) => {
          cookies.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options)
          })
        },
      },
    })

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return Response.json({ error: "No file provided" }, { status: 400 })
    }

    if (file.type !== "application/pdf") {
      return Response.json({ error: "File must be a PDF" }, { status: 400 })
    }

    console.log("[v0] Uploading custom tender. File:", file.name, "Size:", file.size)

    const blob = await put(`custom-tenders/${user.id}/${Date.now()}-${file.name}`, file, {
      access: "public",
      addRandomSuffix: true,
    })

    console.log("[v0] PDF uploaded to blob:", blob.url)

    const analyzeResponse = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL || "https://bidmateai.vercel.app"}/api/analyze-tender`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentUrl: blob.url,
          documentText: "", // AI will fetch and read the PDF from the URL
        }),
      },
    )

    if (!analyzeResponse.ok) {
      const errorText = await analyzeResponse.text()
      console.error("[v0] Analysis failed:", errorText)
      throw new Error("Failed to analyze tender")
    }

    const analysis = await analyzeResponse.json()
    console.log("[v0] Analysis completed successfully")

    const tenderSummary = analysis.tender_summary || {}
    const extractedTitle = tenderSummary.title || file.name.replace(".pdf", "")
    const extractedDescription = tenderSummary.entity
      ? `${tenderSummary.description || ""}\n\nIssued by: ${tenderSummary.entity}`
      : tenderSummary.description || ""

    // Create custom tender record
    const { data: tender, error: tenderError } = await supabase
      .from("user_custom_tenders")
      .insert({
        user_id: user.id,
        title: extractedTitle,
        description: extractedDescription,
        category: "Custom Upload",
        status: "draft",
        organization: tenderSummary.entity || null,
        deadline: tenderSummary.closing_date || null,
        value: null,
        location: null,
      })
      .select()
      .single()

    if (tenderError) {
      console.error("[v0] Error creating tender:", tenderError)
      throw new Error("Failed to create tender record")
    }

    console.log("[v0] Created tender:", tender.id)

    // Store document
    const { error: docError } = await supabase.from("user_custom_tender_documents").insert({
      tender_id: tender.id,
      file_name: file.name,
      file_type: file.type,
      file_size: file.size,
      blob_url: blob.url,
      storage_path: blob.pathname,
    })

    if (docError) {
      console.error("[v0] Error storing document:", docError)
    }

    // Store analysis
    const { error: analysisError } = await supabase.from("user_custom_tender_analysis").insert({
      tender_id: tender.id,
      analysis_data: analysis,
    })

    if (analysisError) {
      console.error("[v0] Error storing analysis:", analysisError)
    }

    return Response.json({
      success: true,
      tender: {
        id: tender.id,
        title: tender.title,
        description: tender.description,
      },
      analysis,
    })
  } catch (error: any) {
    console.error("[v0] Error uploading custom tender:", error)
    return Response.json({ error: error.message || "Failed to upload tender" }, { status: 500 })
  }
}
