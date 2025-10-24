import type { NextRequest } from "next/server"
import pdf from "pdf-parse"

export async function POST(request: NextRequest) {
  try {
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

    console.log("[v0] Extracting text from PDF:", file.name, "Size:", file.size)

    // Read the PDF file
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const data = await pdf(buffer)
    const text = data.text

    console.log("[v0] Extracted text length:", text.length)
    console.log("[v0] Number of pages:", data.numpages)
    console.log("[v0] Text preview:", text.substring(0, 300))

    if (text.length < 100) {
      console.warn("[v0] Extracted text is very short, might be a scanned PDF")
      return Response.json(
        {
          error:
            "Could not extract sufficient text from PDF. The document might be scanned or image-based. Please ensure the PDF contains searchable text.",
        },
        { status: 400 },
      )
    }

    return Response.json({ text, pages: data.numpages })
  } catch (error) {
    console.error("[v0] PDF extraction error:", error)
    return Response.json(
      { error: error instanceof Error ? error.message : "Failed to extract text from PDF" },
      { status: 500 },
    )
  }
}
