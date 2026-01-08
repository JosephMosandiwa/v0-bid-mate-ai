import { createClient } from "@/lib/supabase/server"
import { PDFDocument, PDFTextField, PDFCheckBox, rgb } from "pdf-lib"
import type { NextRequest } from "next/server"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Instead, we'll require that the tender already has extracted_text in the database
// or we'll skip the AI analysis and just add fields at standard positions

export async function POST(request: NextRequest, context: any) {
  try {
    const paramsObj = context?.params ? await context.params : context?.params ?? context
    const { id } = paramsObj as { id?: string }
    const body = await request.json()
    const { documentId } = body

    const supabase = await createClient()

    console.log("[v0] ========================================")
    console.log("[v0] MAKE PDF EDITABLE REQUEST")
    console.log("[v0] ========================================")
    console.log("[v0] Tender ID:", id)
    console.log("[v0] Document ID:", documentId)

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

    let fieldsToUse = formFields
    if (fieldsToUse.length === 0 && Object.keys(formResponses).length > 0) {
      console.log("[v0] No form fields defined, generating from responses...")
      fieldsToUse = Object.entries(formResponses).map(([key, value], index) => ({
        id: key,
        label: key
          .replace(/_/g, " ")
          .replace(/-/g, " ")
          .replace(/([A-Z])/g, " $1")
          .trim(),
        type: "text",
        section: "Responses",
        required: false,
        order: index,
      }))
      console.log("[v0] Generated", fieldsToUse.length, "fields from responses")
    }

    let documentUrl = tenderData.document_url

    if (documentId) {
      console.log("[v0] Fetching document by ID:", documentId)
      const { data: document, error: docError } = await supabase
        .from("user_custom_tender_documents")
        .select("blob_url")
        .eq("id", documentId)
        .eq("tender_id", id)
        .single()

      if (docError || !document) {
        console.log("[v0] Document not found:", docError)
        return Response.json({ error: "Document not found" }, { status: 404 })
      }

      documentUrl = document.blob_url
      console.log("[v0] Found document URL from document ID")
    }

    if (!documentUrl) {
      console.log("[v0] No document URL found")
      return Response.json({ error: "No document URL found" }, { status: 404 })
    }

    console.log("[v0] Fetching original PDF from:", documentUrl)
    const pdfResponse = await fetch(documentUrl)
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
      return new Response(filledPdfBytes as unknown as BodyInit, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="editable_tender_${tenderData.title?.replace(/[^a-z0-9]/gi, "_").toLowerCase() || "document"}.pdf"`,
          "X-Fields-Added": String(existingFields.length),
          "X-Fields-Filled": String(fieldsFilled),
        },
      })
    }

    console.log("[v0] PDF has no form fields, adding fields at standard positions...")

    if (fieldsToUse.length === 0) {
      console.log("[v0] No form fields or responses available")
      return Response.json(
        { error: "No form fields or responses available. Please fill out the tender form first." },
        { status: 400 },
      )
    }

    // Add form fields to the PDF at standard positions
    let fieldsAdded = 0
    let currentPageIndex = 0
    let currentPage = pdfDoc.getPage(currentPageIndex)
    const { height } = currentPage.getSize()

    // Group fields by section for better organization
    const fieldsBySection = fieldsToUse.reduce(
      (acc: any, field: any) => {
        const section = field.section || "General"
        if (!acc[section]) acc[section] = []
        acc[section].push(field)
        return acc
      },
      {} as Record<string, any[]>,
    )

    let currentY = height - 100
    const lineHeight = 30
    const fieldHeight = 20
    const fieldWidth = 300
    const leftMargin = 50
    const labelWidth = 200

    for (const [section, fields] of Object.entries(fieldsBySection)) {
      // Add section header
      if (currentY < 100) {
        // Need a new page
        const newPage = pdfDoc.addPage()
        currentPageIndex = pdfDoc.getPageCount() - 1
        currentPage = pdfDoc.getPage(currentPageIndex)
        currentY = currentPage.getSize().height - 100
      }

      console.log("[v0] Adding section:", section, "with", (fields as any).length, "fields")

      // Draw section header
      currentPage.drawText(section, {
        x: leftMargin,
        y: currentY + 5,
        size: 12,
        color: rgb(0, 0, 0),
      })
      currentY -= lineHeight

      for (const formField of (fields as any[])) {
        if (currentY < 100) {
          // Need a new page
          const newPage = pdfDoc.addPage()
          currentPageIndex = pdfDoc.getPageCount() - 1
          currentPage = pdfDoc.getPage(currentPageIndex)
          currentY = currentPage.getSize().height - 100
        }

        try {
          // Draw field label
          currentPage.drawText(formField.label + ":", {
            x: leftMargin,
            y: currentY + 5,
            size: 10,
            color: rgb(0, 0, 0),
          })

          // Create text field
          const textField = form.createTextField(`field_${formField.id}`)
          textField.addToPage(currentPage, {
            x: leftMargin + labelWidth,
            y: currentY,
            width: fieldWidth,
            height: fieldHeight,
            borderColor: rgb(0, 0, 0),
            backgroundColor: rgb(1, 1, 1),
          })

          // Set field properties
          textField.enableMultiline()
          textField.setFontSize(10)

          // Fill the field if we have a response
          const value = formResponses[formField.id]
          if (value) {
            textField.setText(String(value))
            console.log("[v0] ✓ Added and filled field:", formField.label, "with:", String(value).substring(0, 50))
          } else {
            console.log("[v0] ✓ Added empty field:", formField.label)
          }

          fieldsAdded++
          currentY -= lineHeight
        } catch (error) {
          console.error("[v0] Error adding field:", formField.label, error)
        }
      }

      // Add spacing between sections
      currentY -= lineHeight
    }

    console.log("[v0] Added", fieldsAdded, "form fields to the PDF")
    console.log("[v0] Total pages:", pdfDoc.getPageCount())

    const editablePdfBytes = await pdfDoc.save()

    return new Response(editablePdfBytes as unknown as BodyInit, {
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
