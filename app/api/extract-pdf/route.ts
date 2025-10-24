import type { NextRequest } from "next/server"

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

    // Extract text from PDF
    const text = await extractTextFromPDF(buffer, file.name)

    console.log("[v0] Extracted text length:", text.length)

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

    return Response.json({ text })
  } catch (error) {
    console.error("[v0] PDF extraction error:", error)
    return Response.json(
      { error: error instanceof Error ? error.message : "Failed to extract text from PDF" },
      { status: 500 },
    )
  }
}

async function extractTextFromPDF(buffer: Buffer, filename: string): Promise<string> {
  try {
    console.log("[v0] Starting PDF text extraction for:", filename)

    // Convert buffer to string and look for text content
    const pdfString = buffer.toString("binary")

    // Extract text between stream objects in PDF
    const textMatches = pdfString.match(/stream\s*([\s\S]*?)\s*endstream/g)

    if (!textMatches || textMatches.length === 0) {
      console.warn("[v0] No text streams found in PDF")
      throw new Error("No readable text found in PDF. The document might be scanned or image-based.")
    }

    let extractedText = ""

    // Process each text stream
    for (const match of textMatches) {
      // Remove stream markers
      const content = match.replace(/stream\s*/, "").replace(/\s*endstream/, "")

      // Try to extract readable text
      // This is a simplified approach - in production, use a proper PDF library
      const readableText = content
        .replace(/[^\x20-\x7E\n\r]/g, " ") // Keep only printable ASCII and newlines
        .replace(/\s+/g, " ") // Normalize whitespace
        .trim()

      if (readableText.length > 10) {
        extractedText += readableText + "\n"
      }
    }

    // Also try to extract text from the raw PDF content
    const rawText = pdfString
      .replace(/[^\x20-\x7E\n\r]/g, " ")
      .replace(/\s+/g, " ")
      .split(" ")
      .filter((word) => word.length > 2 && /[a-zA-Z]/.test(word))
      .join(" ")

    if (rawText.length > extractedText.length) {
      extractedText = rawText
    }

    console.log("[v0] Extracted text preview:", extractedText.substring(0, 200))

    if (extractedText.length < 100) {
      throw new Error("Insufficient text extracted from PDF. The document might be scanned, image-based, or encrypted.")
    }

    return extractedText
  } catch (error) {
    console.error("[v0] Text extraction error:", error)
    throw error instanceof Error ? error : new Error("Failed to extract text from PDF")
  }
}
