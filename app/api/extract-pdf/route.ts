import type { NextRequest } from "next/server"
import pdf from "pdf-parse"

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] Extract PDF route called - using pdf-parse for server-side extraction")

    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      console.error("[v0] No file provided in request")
      return Response.json({ error: "No file provided" }, { status: 400 })
    }

    if (file.type !== "application/pdf") {
      console.error("[v0] Invalid file type:", file.type)
      return Response.json({ error: "File must be a PDF" }, { status: 400 })
    }

    console.log("[v0] Processing PDF:", file.name, "Size:", file.size, "bytes")

    // Convert File to Buffer for pdf-parse
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    console.log("[v0] Extracting text with pdf-parse...")

    // Extract text using pdf-parse
    const data = await pdf(buffer)

    console.log("[v0] PDF extraction complete:")
    console.log("[v0] - Total pages:", data.numpages)
    console.log("[v0] - Text length:", data.text.length, "characters")
    console.log("[v0] - First 500 characters:", data.text.substring(0, 500))

    // Check if we got meaningful text
    if (!data.text || data.text.trim().length < 50) {
      console.error("[v0] Insufficient text extracted from PDF")
      return Response.json(
        {
          error: "Could not extract sufficient text from PDF. The document might be scanned or image-based.",
          text: data.text || "",
          pages: data.numpages,
        },
        { status: 400 },
      )
    }

    const wordCount = data.text.trim().split(/\s+/).length
    console.log("[v0] Text quality metrics:")
    console.log("[v0] - Word count:", wordCount)
    console.log("[v0] - Average words per page:", Math.round(wordCount / data.numpages))

    return Response.json({
      text: data.text,
      pages: data.numpages,
      info: data.info,
    })
  } catch (error) {
    console.error("[v0] PDF extraction error:", error)
    console.error("[v0] Error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    })
    return Response.json(
      { error: error instanceof Error ? error.message : "Failed to extract text from PDF" },
      { status: 500 },
    )
  }
}
