import type { NextRequest } from "next/server"
import * as pdfjsLib from "pdfjs-dist"

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] Extract PDF route called")

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

    console.log("[v0] Extracting text from PDF:", file.name, "Size:", file.size, "bytes")

    const arrayBuffer = await file.arrayBuffer()
    const uint8Array = new Uint8Array(arrayBuffer)

    console.log("[v0] Loading PDF document with pdfjs-dist...")
    const loadingTask = pdfjsLib.getDocument({ data: uint8Array })
    const pdfDocument = await loadingTask.promise
    console.log("[v0] PDF document loaded successfully, pages:", pdfDocument.numPages)

    // Extract text from all pages
    const textParts: string[] = []
    for (let pageNum = 1; pageNum <= pdfDocument.numPages; pageNum++) {
      console.log(`[v0] Extracting text from page ${pageNum}/${pdfDocument.numPages}`)
      const page = await pdfDocument.getPage(pageNum)
      const textContent = await page.getTextContent()
      const pageText = textContent.items.map((item: any) => item.str).join(" ")
      textParts.push(pageText)
    }

    const text = textParts.join("\n\n").trim()

    console.log("[v0] PDF extraction complete:")
    console.log("[v0] - Total pages:", pdfDocument.numPages)
    console.log("[v0] - Text length:", text.length, "characters")
    console.log("[v0] - First 500 characters:", text.substring(0, 500))
    console.log("[v0] - Last 500 characters:", text.substring(Math.max(0, text.length - 500)))

    if (text.length < 100) {
      console.warn("[v0] Extracted text is very short, might be a scanned PDF or image-based")
      return Response.json(
        {
          error:
            "Could not extract sufficient text from PDF. The document might be scanned or image-based. Please ensure the PDF contains searchable text.",
        },
        { status: 400 },
      )
    }

    const wordCount = text.split(/\s+/).length
    const lineCount = text.split("\n").length
    console.log("[v0] Text quality metrics:")
    console.log("[v0] - Word count:", wordCount)
    console.log("[v0] - Line count:", lineCount)
    console.log("[v0] - Average words per line:", (wordCount / lineCount).toFixed(2))

    return Response.json({ text })
  } catch (error) {
    console.error("[v0] PDF extraction error:", error)
    console.error("[v0] Error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined,
    })
    return Response.json(
      { error: error instanceof Error ? error.message : "Failed to extract text from PDF" },
      { status: 500 },
    )
  }
}
