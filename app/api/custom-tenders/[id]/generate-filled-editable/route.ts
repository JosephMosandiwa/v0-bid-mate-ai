import { createClient } from "@/lib/supabase/server"
import { PDFDocument, PDFTextField, PDFCheckBox, rgb, StandardFonts } from "pdf-lib"
import { put } from "@vercel/blob"
import type { NextRequest } from "next/server"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await request.json()
    const { documentId, saveToBlob = true } = body

    const supabase = await createClient()

    console.log("[v0] ========================================")
    console.log("[v0] GENERATE FILLED EDITABLE PDF")
    console.log("[v0] ========================================")
    console.log("[v0] Tender ID:", id)
    console.log("[v0] Document ID:", documentId)
    console.log("[v0] Save to blob:", saveToBlob)

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      console.log("[v0] Unauthorized - no user")
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

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

    // Fetch analysis data with formFields
    const { data: analysisData } = await supabase
      .from("user_custom_tender_analysis")
      .select("*")
      .eq("tender_id", id)
      .single()

    const formFields = analysisData?.analysis_data?.formFields || []
    console.log("[v0] Form fields from analysis:", formFields.length)

    // Fetch form responses
    const { data: responseData } = await supabase
      .from("user_custom_tender_responses")
      .select("*")
      .eq("tender_id", id)
      .eq("user_id", user.id)
      .single()

    const formResponses = responseData?.response_data || {}
    console.log("[v0] Form responses:", Object.keys(formResponses).length)

    // Get document URL
    let documentUrl = tenderData.document_url

    if (documentId) {
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
    }

    if (!documentUrl) {
      return Response.json({ error: "No document URL found" }, { status: 404 })
    }

    console.log("[v0] Fetching original PDF...")
    const pdfResponse = await fetch(documentUrl)
    if (!pdfResponse.ok) {
      throw new Error("Failed to fetch original PDF")
    }
    const originalPdfBytes = await pdfResponse.arrayBuffer()

    // Try to load the PDF - handle read-only/encrypted PDFs
    let pdfDoc: PDFDocument
    let isReadOnly = false

    try {
      pdfDoc = await PDFDocument.load(originalPdfBytes, { ignoreEncryption: true })
      console.log("[v0] Loaded PDF with", pdfDoc.getPageCount(), "pages")
    } catch (loadError: any) {
      console.log("[v0] Failed to load PDF directly, creating new document...")
      isReadOnly = true

      // Create a new PDF and copy pages from original
      pdfDoc = await PDFDocument.create()
      const sourcePdf = await PDFDocument.load(originalPdfBytes, {
        ignoreEncryption: true,
        updateMetadata: false,
      })
      const pages = await pdfDoc.copyPages(sourcePdf, sourcePdf.getPageIndices())
      pages.forEach((page) => pdfDoc.addPage(page))
      console.log("[v0] Created new PDF with copied pages")
    }

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
    const form = pdfDoc.getForm()
    const existingFields = form.getFields()
    console.log("[v0] Existing PDF form fields:", existingFields.length)

    let fieldsFilled = 0
    let fieldsCreated = 0

    // If PDF has existing form fields, try to fill them
    if (existingFields.length > 0) {
      console.log("[v0] PDF has existing form fields, filling them...")

      for (const field of existingFields) {
        const fieldName = field.getName()

        // Find matching response using fuzzy matching
        const matchingResponse = findBestMatch(fieldName, formResponses)

        if (matchingResponse) {
          try {
            if (field instanceof PDFTextField) {
              field.setText(String(matchingResponse.value))
              fieldsFilled++
              console.log("[v0] ✓ Filled:", fieldName)
            } else if (field instanceof PDFCheckBox) {
              if (
                matchingResponse.value === true ||
                matchingResponse.value === "true" ||
                matchingResponse.value === "yes"
              ) {
                field.check()
                fieldsFilled++
              }
            }
          } catch (error) {
            console.log("[v0] Could not fill field:", fieldName)
          }
        }
      }
    }

    // If PDF has no fields OR is read-only, create new fields based on formFields from analysis
    if (existingFields.length === 0 || isReadOnly) {
      console.log("[v0] Creating new form fields based on analysis...")

      // Group fields by section
      const fieldsBySection = formFields.reduce((acc: Record<string, any[]>, field: any) => {
        const section = field.section || "General"
        if (!acc[section]) acc[section] = []
        acc[section].push(field)
        return acc
      }, {})

      let currentPageIndex = pdfDoc.getPageCount() - 1
      let currentPage = pdfDoc.getPage(currentPageIndex)
      const { width, height } = currentPage.getSize()

      // Add a new page for the response form
      const responsePage = pdfDoc.addPage([width, height])
      currentPageIndex = pdfDoc.getPageCount() - 1
      currentPage = responsePage

      let currentY = height - 50
      const lineHeight = 28
      const fieldHeight = 18
      const fieldWidth = Math.min(350, width - 150)
      const leftMargin = 50
      const labelWidth = Math.min(180, width / 3)

      // Draw header
      currentPage.drawText("TENDER RESPONSE FORM", {
        x: leftMargin,
        y: currentY,
        size: 16,
        font,
        color: rgb(0, 0, 0),
      })
      currentY -= 35

      currentPage.drawText(`Tender: ${tenderData.title || "Untitled"}`, {
        x: leftMargin,
        y: currentY,
        size: 10,
        font,
        color: rgb(0.3, 0.3, 0.3),
      })
      currentY -= 25

      for (const [section, fields] of Object.entries(fieldsBySection)) {
        // Check if we need a new page
        if (currentY < 100) {
          const newPage = pdfDoc.addPage([width, height])
          currentPageIndex = pdfDoc.getPageCount() - 1
          currentPage = newPage
          currentY = height - 50
        }

        // Draw section header
        currentPage.drawText(section.toUpperCase(), {
          x: leftMargin,
          y: currentY,
          size: 11,
          font,
          color: rgb(0.2, 0.2, 0.6),
        })
        currentY -= lineHeight

        for (const formField of fields as any[]) {
          // Check if we need a new page
          if (currentY < 80) {
            const newPage = pdfDoc.addPage([width, height])
            currentPageIndex = pdfDoc.getPageCount() - 1
            currentPage = newPage
            currentY = height - 50
          }

          try {
            // Draw field label
            const label = formField.label || formField.id
            const displayLabel = label.length > 30 ? label.substring(0, 30) + "..." : label

            currentPage.drawText(displayLabel + ":", {
              x: leftMargin,
              y: currentY + 3,
              size: 9,
              font,
              color: rgb(0, 0, 0),
            })

            // Create unique field name
            const uniqueFieldName = `response_${formField.id}_${Date.now()}_${fieldsCreated}`

            // Create text field
            const textField = form.createTextField(uniqueFieldName)
            textField.addToPage(currentPage, {
              x: leftMargin + labelWidth,
              y: currentY - 2,
              width: fieldWidth,
              height: fieldHeight,
              borderColor: rgb(0.7, 0.7, 0.7),
              backgroundColor: rgb(0.98, 0.98, 0.98),
            })

            // Fill the field if we have a response
            const value = formResponses[formField.id]
            if (value !== undefined && value !== null && value !== "") {
              textField.setText(String(value))
              fieldsFilled++
              console.log("[v0] ✓ Created and filled:", formField.id)
            } else {
              console.log("[v0] Created empty field:", formField.id)
            }

            fieldsCreated++
            currentY -= lineHeight
          } catch (error) {
            console.log("[v0] Error creating field:", formField.id, error)
          }
        }

        // Add spacing between sections
        currentY -= 10
      }

      // Add signature section at the end
      if (currentY < 150) {
        const newPage = pdfDoc.addPage([width, height])
        currentPage = newPage
        currentY = height - 50
      }

      currentY -= 20
      currentPage.drawText("DECLARATION & SIGNATURE", {
        x: leftMargin,
        y: currentY,
        size: 11,
        font,
        color: rgb(0.2, 0.2, 0.6),
      })
      currentY -= 25

      currentPage.drawText("I hereby declare that the information provided above is true and accurate.", {
        x: leftMargin,
        y: currentY,
        size: 9,
        font,
        color: rgb(0.3, 0.3, 0.3),
      })
      currentY -= 35

      // Signature field
      currentPage.drawText("Signature:", {
        x: leftMargin,
        y: currentY + 3,
        size: 9,
        font,
        color: rgb(0, 0, 0),
      })
      currentPage.drawLine({
        start: { x: leftMargin + 80, y: currentY },
        end: { x: leftMargin + 280, y: currentY },
        thickness: 1,
        color: rgb(0, 0, 0),
      })
      currentY -= 25

      // Date field
      currentPage.drawText("Date:", {
        x: leftMargin,
        y: currentY + 3,
        size: 9,
        font,
        color: rgb(0, 0, 0),
      })
      currentPage.drawLine({
        start: { x: leftMargin + 80, y: currentY },
        end: { x: leftMargin + 280, y: currentY },
        thickness: 1,
        color: rgb(0, 0, 0),
      })
    }

    console.log("[v0] Fields created:", fieldsCreated)
    console.log("[v0] Fields filled:", fieldsFilled)
    console.log("[v0] Total pages:", pdfDoc.getPageCount())

    // Save the PDF
    const filledPdfBytes = await pdfDoc.save()
    console.log("[v0] PDF saved, size:", filledPdfBytes.byteLength, "bytes")

    // Optionally save to blob storage
    let savedBlobUrl = null
    if (saveToBlob) {
      try {
        const timestamp = new Date().toISOString().replace(/[:.]/g, "-")
        const filename = `filled_${tenderData.title?.replace(/[^a-z0-9]/gi, "_").toLowerCase() || "tender"}_${timestamp}.pdf`

        const blob = await put(filename, filledPdfBytes, {
          access: "public",
          contentType: "application/pdf",
        })

        savedBlobUrl = blob.url
        console.log("[v0] Saved to blob storage:", savedBlobUrl)

        // Save reference in database
        await supabase.from("user_custom_tender_documents").insert({
          tender_id: id,
          user_id: user.id,
          file_name: filename,
          blob_url: savedBlobUrl,
          file_type: "application/pdf",
          is_filled: true,
          created_at: new Date().toISOString(),
        })
        console.log("[v0] Saved document reference to database")
      } catch (blobError) {
        console.log("[v0] Could not save to blob storage:", blobError)
        // Continue anyway - we'll still return the PDF
      }
    }

    return new Response(filledPdfBytes, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="filled_tender_${tenderData.title?.replace(/[^a-z0-9]/gi, "_").toLowerCase() || "document"}.pdf"`,
        "X-Fields-Created": String(fieldsCreated),
        "X-Fields-Filled": String(fieldsFilled),
        "X-Total-Pages": String(pdfDoc.getPageCount()),
        "X-Is-Read-Only": String(isReadOnly),
        "X-Saved-Blob-Url": savedBlobUrl || "",
      },
    })
  } catch (error: any) {
    console.error("[v0] Error generating filled editable PDF:", error)
    return Response.json({ error: error.message || "Failed to generate filled editable PDF" }, { status: 500 })
  }
}

// Helper function for fuzzy matching field names
function findBestMatch(
  fieldName: string,
  responses: Record<string, any>,
): { key: string; value: any; score: number } | null {
  const normalizedFieldName = fieldName.toLowerCase().replace(/[_\-\s]+/g, "")
  let bestMatch: { key: string; value: any; score: number } | null = null

  for (const [key, value] of Object.entries(responses)) {
    const normalizedKey = key.toLowerCase().replace(/[_\-\s]+/g, "")
    let score = 0

    // Exact match
    if (normalizedFieldName === normalizedKey) {
      score = 100
    }
    // Contains match
    else if (normalizedFieldName.includes(normalizedKey) || normalizedKey.includes(normalizedFieldName)) {
      score = 80
    }
    // Word overlap
    else {
      const fieldWords = normalizedFieldName.split(/(?=[A-Z])/).map((w) => w.toLowerCase())
      const keyWords = normalizedKey.split(/(?=[A-Z])/).map((w) => w.toLowerCase())
      const overlap = fieldWords.filter((w) => keyWords.some((kw) => kw.includes(w) || w.includes(kw))).length
      score = overlap * 20
    }

    if (score > 0 && (!bestMatch || score > bestMatch.score)) {
      bestMatch = { key, value, score }
    }
  }

  return bestMatch && bestMatch.score >= 40 ? bestMatch : null
}
