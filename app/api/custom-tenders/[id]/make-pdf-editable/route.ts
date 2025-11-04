import { createClient } from "@/lib/supabase/server"
import { PDFDocument, PDFTextField, PDFCheckBox, rgb } from "pdf-lib"
import type { NextRequest } from "next/server"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const supabase = await createClient()

    console.log("[v0] ========================================")
    console.log("[v0] MAKE PDF EDITABLE REQUEST")
    console.log("[v0] ========================================")
    console.log("[v0] Tender ID:", id)

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      console.log("[v0] Unauthorized - no user")
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log("[v0] User ID:", user.id)

    // Fetch tender data
    const { data: tenderData, error: tenderError } = await supabase
      .from("user_custom_tenders")
      .select("*")
      .eq("id", id)
      .single()

    if (tenderError || !tenderData) {
      console.log("[v0] Tender not found:", tenderError)
      return Response.json({ error: "Tender not found" }, { status: 404 })
    }

    console.log("[v0] Tender found:", tenderData.title)

    // Fetch form responses
    const { data: responseData } = await supabase
      .from("user_custom_tender_responses")
      .select("*")
      .eq("tender_id", id)
      .eq("user_id", user.id)
      .single()

    const formResponses = responseData?.response_data || {}
    const formFields = tenderData.form_fields || []

    console.log("[v0] Form responses:", Object.keys(formResponses).length)
    console.log("[v0] Form fields:", formFields.length)

    if (!tenderData.document_url) {
      console.log("[v0] No document URL found")
      return Response.json({ error: "No document URL found" }, { status: 404 })
    }

    console.log("[v0] Fetching original PDF from:", tenderData.document_url)
    const pdfResponse = await fetch(tenderData.document_url)
    if (!pdfResponse.ok) {
      console.log("[v0] Failed to fetch PDF, status:", pdfResponse.status)
      throw new Error("Failed to fetch original PDF")
    }
    const originalPdfBytes = await pdfResponse.arrayBuffer()

    // Load the original PDF
    const pdfDoc = await PDFDocument.load(originalPdfBytes)
    console.log("[v0] Loaded PDF with", pdfDoc.getPageCount(), "pages")

    // Get the form from the PDF
    const form = pdfDoc.getForm()
    const existingFields = form.getFields()
    console.log("[v0] PDF has", existingFields.length, "existing form fields")

    // If PDF already has form fields, just fill them
    if (existingFields.length > 0) {
      console.log("[v0] PDF already has form fields, filling them...")
      let fieldsFilled = 0

      for (const field of existingFields) {
        const fieldName = field.getName()
        console.log("[v0] Processing field:", fieldName)

        // Try to match with form responses
        const matchingResponse = Object.entries(formResponses).find(([key, value]) => {
          const variations = [
            key,
            key.toLowerCase(),
            key.replace(/_/g, " "),
            key.replace(/-/g, " "),
            key.replace(/([A-Z])/g, " $1").trim(),
          ]
          return variations.some((v) => fieldName.toLowerCase().includes(v.toLowerCase()))
        })

        if (matchingResponse) {
          const [, value] = matchingResponse
          try {
            if (field instanceof PDFTextField) {
              field.setText(String(value))
              fieldsFilled++
              console.log("[v0] ✓ Filled text field:", fieldName, "with:", value)
            } else if (field instanceof PDFCheckBox) {
              field.check()
              fieldsFilled++
              console.log("[v0] ✓ Checked checkbox:", fieldName)
            }
          } catch (error) {
            console.error("[v0] Error filling field:", fieldName, error)
          }
        }
      }

      console.log("[v0] Filled", fieldsFilled, "out of", existingFields.length, "fields")

      const filledPdfBytes = await pdfDoc.save()
      return new Response(filledPdfBytes, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="editable_tender_${tenderData.title?.replace(/[^a-z0-9]/gi, "_").toLowerCase() || "document"}.pdf"`,
          "X-Fields-Added": String(existingFields.length),
          "X-Fields-Filled": String(fieldsFilled),
        },
      })
    }

    // PDF has no form fields - we need to analyze it and add fields
    console.log("[v0] PDF has no form fields, analyzing document to add fields...")

    // Use AI to analyze the PDF text and suggest where fields should be placed
    const pdfText = tenderData.extracted_text || ""
    if (!pdfText) {
      console.log("[v0] No extracted text available")
      return Response.json({ error: "No text extracted from PDF. Cannot identify field positions." }, { status: 400 })
    }

    console.log("[v0] Analyzing PDF text to identify field positions...")
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a PDF form field detector. Analyze the tender document text and identify where form fields should be placed.
          
For each field you identify, provide:
1. The field label/name (what the field is for)
2. The approximate page number (if you can infer it)
3. The type of field (text, checkbox, date, etc.)
4. A brief description

Return a JSON array of field suggestions. Each suggestion should have:
{
  "label": "Company Name",
  "type": "text",
  "page": 1,
  "description": "Company or organization name"
}

Focus on identifying actual form fields that need to be filled, not just any text in the document.`,
        },
        {
          role: "user",
          content: `Analyze this tender document and identify where form fields should be placed:\n\n${pdfText.slice(0, 50000)}`,
        },
      ],
      response_format: { type: "json_object" },
    })

    const aiResponse = JSON.parse(completion.choices[0].message.content || "{}")
    const suggestedFields = aiResponse.fields || []
    console.log("[v0] AI suggested", suggestedFields.length, "fields")

    // Add form fields to the PDF
    // Since we don't have exact coordinates, we'll add them at standard positions
    let fieldsAdded = 0
    const pages = pdfDoc.getPages()

    for (let i = 0; i < Math.min(suggestedFields.length, formFields.length); i++) {
      const suggestedField = suggestedFields[i]
      const formField = formFields[i]
      const pageIndex = Math.min((suggestedField.page || 1) - 1, pages.length - 1)
      const page = pages[pageIndex]
      const { height } = page.getSize()

      // Calculate position (stacking fields vertically)
      const yPosition = height - 100 - i * 30

      try {
        const textField = form.createTextField(`field_${i}_${formField.id}`)
        textField.addToPage(page, {
          x: 50,
          y: yPosition,
          width: 200,
          height: 20,
          borderColor: rgb(0, 0, 0),
          backgroundColor: rgb(1, 1, 1),
        })

        // Fill the field if we have a response
        const value = formResponses[formField.id]
        if (value) {
          textField.setText(String(value))
        }

        fieldsAdded++
        console.log("[v0] ✓ Added field:", formField.label, "at page", pageIndex + 1)
      } catch (error) {
        console.error("[v0] Error adding field:", formField.label, error)
      }
    }

    console.log("[v0] Added", fieldsAdded, "form fields to the PDF")

    const editablePdfBytes = await pdfDoc.save()

    return new Response(editablePdfBytes, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="editable_tender_${tenderData.title?.replace(/[^a-z0-9]/gi, "_").toLowerCase() || "document"}.pdf"`,
        "X-Fields-Added": String(fieldsAdded),
        "X-Fields-Filled": String(fieldsAdded),
      },
    })
  } catch (error: any) {
    console.error("[v0] Error making PDF editable:", error)
    return Response.json({ error: error.message || "Failed to make PDF editable" }, { status: 500 })
  }
}
