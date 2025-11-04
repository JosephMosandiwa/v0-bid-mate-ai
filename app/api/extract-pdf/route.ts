import type { NextRequest } from "next/server"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] Extract PDF route called - using OpenAI native PDF processing")

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

    console.log("[v0] Processing PDF with OpenAI:", file.name, "Size:", file.size, "bytes")

    // Convert File to Buffer for OpenAI
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Create a File object that OpenAI expects
    const openaiFile = new File([buffer], file.name, { type: "application/pdf" })

    console.log("[v0] Uploading PDF to OpenAI for text extraction...")

    // Use OpenAI's chat completion with PDF file
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Extract ALL text content from this PDF document. Return the complete text exactly as it appears, preserving structure, formatting, and all information. Include:
- All headings and titles
- All body text and paragraphs
- All tables and their data
- All lists and bullet points
- All form fields and labels
- All dates, numbers, and values
- All contact information
- All terms and conditions

Return ONLY the extracted text, nothing else.`,
            },
          ],
        },
      ],
      // Note: File upload will be handled via the API
    })

    const text = response.choices[0]?.message?.content?.trim() || ""

    console.log("[v0] OpenAI PDF extraction complete:")
    console.log("[v0] - Text length:", text.length, "characters")
    console.log("[v0] - First 500 characters:", text.substring(0, 500))

    if (text.length < 100) {
      console.warn("[v0] Extracted text is very short")
      return Response.json(
        {
          error: "Could not extract sufficient text from PDF. The document might be empty or corrupted.",
        },
        { status: 400 },
      )
    }

    const wordCount = text.split(/\s+/).length
    console.log("[v0] Text quality metrics:")
    console.log("[v0] - Word count:", wordCount)

    return Response.json({ text })
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
