import { createClient } from "@supabase/supabase-js"
import { type NextRequest, NextResponse } from "next/server"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const tenderId = params.id

    console.log("[v0] Starting automatic analysis for tender:", tenderId)

    // Check if analysis already exists
    const { data: existingAnalysis } = await supabase
      .from("tender_analysis")
      .select("*")
      .eq("tender_id", tenderId)
      .single()

    if (existingAnalysis) {
      console.log("[v0] Analysis already exists, returning cached version")
      return NextResponse.json({
        success: true,
        analysis: existingAnalysis.analysis_data,
        cached: true,
      })
    }

    // Fetch tender documents
    const { data: documents, error: docsError } = await supabase
      .from("tender_documents")
      .select("*")
      .eq("tender_id", tenderId)

    if (docsError || !documents || documents.length === 0) {
      console.log("[v0] No documents found for tender")
      return NextResponse.json({ error: "No documents found for this tender" }, { status: 404 })
    }

    console.log("[v0] Found", documents.length, "documents to analyze")

    // Extract text from all PDF documents
    let combinedText = ""

    for (const doc of documents) {
      if (doc.document_type?.toLowerCase().includes("pdf")) {
        try {
          console.log("[v0] Extracting text from:", doc.document_name)

          // Fetch the PDF from blob storage
          const blobResponse = await fetch(doc.blob_url)
          const blobData = await blobResponse.blob()

          // Convert blob to base64
          const buffer = await blobData.arrayBuffer()
          const base64 = Buffer.from(buffer).toString("base64")

          // Extract text using the existing API
          const extractResponse = await fetch(
            `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/extract-pdf`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ fileData: base64 }),
            },
          )

          if (extractResponse.ok) {
            const { text } = await extractResponse.json()
            combinedText += `\n\n--- ${doc.document_name} ---\n\n${text}`
            console.log("[v0] Extracted", text.length, "characters from", doc.document_name)
          }
        } catch (error) {
          console.error("[v0] Error extracting text from", doc.document_name, error)
        }
      }
    }

    if (!combinedText.trim()) {
      return NextResponse.json({ error: "Could not extract text from documents" }, { status: 400 })
    }

    console.log("[v0] Total extracted text length:", combinedText.length)

    // Analyze the combined text
    const analyzeResponse = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/analyze-tender`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentText: combinedText }),
      },
    )

    if (!analyzeResponse.ok) {
      const error = await analyzeResponse.json()
      throw new Error(error.error || "Failed to analyze tender")
    }

    const analysis = await analyzeResponse.json()
    console.log("[v0] Analysis completed successfully")

    // Save analysis to database
    const { data: savedAnalysis, error: saveError } = await supabase
      .from("tender_analysis")
      .insert({
        tender_id: tenderId,
        analysis_data: analysis,
        analyzed_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (saveError) {
      console.error("[v0] Error saving analysis:", saveError)
      // Return analysis anyway even if save fails
      return NextResponse.json({
        success: true,
        analysis,
        cached: false,
        saveError: saveError.message,
      })
    }

    console.log("[v0] Analysis saved to database")

    return NextResponse.json({
      success: true,
      analysis,
      cached: false,
    })
  } catch (error) {
    console.error("[v0] Error in analyze route:", error)
    return NextResponse.json(
      {
        error: "Failed to analyze tender",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
