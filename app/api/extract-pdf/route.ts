import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] Extract PDF route called")
    console.log("[v0] Request method:", request.method)
    console.log("[v0] Request URL:", request.url)

    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      console.error("[v0] No file provided in request")
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    console.log("[v0] File details:", {
      name: file.name,
      type: file.type,
      size: file.size,
    })

    if (file.type !== "application/pdf") {
      console.error("[v0] Invalid file type:", file.type)
      return NextResponse.json({ error: "File must be a PDF" }, { status: 400 })
    }

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    console.log("[v0] Buffer created, size:", buffer.length, "bytes")
    console.log("[v0] Attempting dynamic pdf-parse import...")

    let pdf
    try {
      pdf = (await import("pdf-parse")).default
      console.log("[v0] pdf-parse imported successfully")
    } catch (importError) {
      console.error("[v0] Failed to import pdf-parse:", importError)
      return NextResponse.json(
        {
          error: "PDF parsing library not available",
          details: importError instanceof Error ? importError.message : "Unknown error",
        },
        { status: 500 },
      )
    }

    // Extract text using pdf-parse
    let data
    try {
      data = await pdf(buffer, {
        max: 0, // Parse all pages
      })
      console.log("[v0] pdf-parse completed successfully")
    } catch (parseError) {
      console.error("[v0] pdf-parse failed:", parseError)
      console.error("[v0] Parse error details:", {
        message: parseError instanceof Error ? parseError.message : "Unknown",
        name: parseError instanceof Error ? parseError.name : "Unknown",
      })

      return NextResponse.json(
        {
          error: "Failed to parse PDF. The document might be corrupted, password-protected, or scanned.",
          details: parseError instanceof Error ? parseError.message : "Unknown error",
        },
        { status: 400 },
      )
    }

    console.log("[v0] PDF extraction results:")
    console.log("[v0] - Total pages:", data.numpages)
    console.log("[v0] - Text length:", data.text?.length || 0, "characters")

    if (data.text && data.text.length > 0) {
      console.log("[v0] - First 200 chars:", data.text.substring(0, 200))
    }

    // Check if we got meaningful text
    if (!data.text || data.text.trim().length < 50) {
      console.error("[v0] Insufficient text extracted")
      return NextResponse.json(
        {
          error:
            "Could not extract sufficient text from PDF. The document might be scanned, image-based, or contain only graphics. Please try OCR or manual entry.",
          text: data.text || "",
          pages: data.numpages,
          isScanned: true,
        },
        { status: 400 },
      )
    }

    const wordCount = data.text.trim().split(/\s+/).length
    const avgWordsPerPage = Math.round(wordCount / data.numpages)

    console.log("[v0] Text quality metrics:")
    console.log("[v0] - Word count:", wordCount)
    console.log("[v0] - Average words per page:", avgWordsPerPage)
    console.log("[v0] - Quality: " + (avgWordsPerPage > 50 ? "Good" : "Poor (possibly scanned)"))

    return NextResponse.json({
      text: data.text,
      pages: data.numpages,
      info: data.info,
      wordCount,
      avgWordsPerPage,
    })
  } catch (error) {
    console.error("[v0] Unexpected error in PDF extraction:")
    console.error("[v0] Error type:", error instanceof Error ? error.constructor.name : typeof error)
    console.error("[v0] Error message:", error instanceof Error ? error.message : String(error))
    console.error("[v0] Error stack:", error instanceof Error ? error.stack : "No stack trace")

    return NextResponse.json(
      {
        error: "An unexpected error occurred while processing the PDF",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
