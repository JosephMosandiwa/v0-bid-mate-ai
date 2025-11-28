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

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Fetch tender data
    const { data: tenderData, error: tenderError } = await supabase
      .from("user_custom_tenders")
      .select("*")
      .eq("id", id)
      .single()

    if (tenderError || !tenderData) {
      return Response.json({ error: "Tender not found" }, { status: 404 })
    }

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

    let pdfDoc: PDFDocument
    let sourcePdf: PDFDocument

    try {
      // Load the source PDF
      sourcePdf = await PDFDocument.load(originalPdfBytes, {
        ignoreEncryption: true,
        updateMetadata: false,
      })

      // Create a new PDF document (ensures it's fully editable)
      pdfDoc = await PDFDocument.create()

      // Copy ALL pages from the original document
      const pageIndices = sourcePdf.getPageIndices()
      const copiedPages = await pdfDoc.copyPages(sourcePdf, pageIndices)

      copiedPages.forEach((page) => {
        pdfDoc.addPage(page)
      })

      console.log("[v0] Created editable copy with", pdfDoc.getPageCount(), "pages")
    } catch (loadError: any) {
      console.error("[v0] Failed to copy PDF:", loadError)
      throw new Error("Could not create editable copy of the PDF")
    }

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
    const form = pdfDoc.getForm()

    let existingFieldNames: string[] = []
    try {
      const sourceForm = sourcePdf.getForm()
      existingFieldNames = sourceForm.getFields().map((f) => f.getName())
      console.log("[v0] Source PDF has", existingFieldNames.length, "form fields")
    } catch (e) {
      console.log("[v0] Could not read source form fields")
    }

    let fieldsFilled = 0
    let fieldsCreated = 0

    const existingFields = form.getFields()

    if (existingFields.length > 0) {
      // PDF already has form fields from the copy - fill them
      console.log("[v0] Filling", existingFields.length, "existing form fields...")

      for (const field of existingFields) {
        const fieldName = field.getName()
        const matchingResponse = findBestMatch(fieldName, formResponses, formFields)

        if (matchingResponse) {
          try {
            if (field instanceof PDFTextField) {
              field.setText(String(matchingResponse.value))
              fieldsFilled++
              console.log("[v0] Filled existing field:", fieldName)
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

    // create overlay fields on the document pages
    if (formFields.length > 0 && fieldsFilled < formFields.length / 2) {
      console.log("[v0] Creating overlay form fields on original pages...")

      // Get page dimensions
      const pages = pdfDoc.getPages()
      const pageCount = pages.length

      // Group fields by page number if available, otherwise distribute across pages
      const fieldsWithPosition = formFields.map((field: any, index: number) => {
        // If field has page info from analysis, use it
        const pageNum = field.pageNumber ? Math.min(field.pageNumber - 1, pageCount - 1) : 0
        return { ...field, pageIndex: pageNum, originalIndex: index }
      })

      // Group by page
      const fieldsByPage: Record<number, any[]> = {}
      fieldsWithPosition.forEach((field: any) => {
        const pageIdx = field.pageIndex || 0
        if (!fieldsByPage[pageIdx]) fieldsByPage[pageIdx] = []
        fieldsByPage[pageIdx].push(field)
      })

      // Process each page
      for (const [pageIndexStr, pageFields] of Object.entries(fieldsByPage)) {
        const pageIndex = Number.parseInt(pageIndexStr)
        if (pageIndex >= pageCount) continue

        const page = pages[pageIndex]
        const { width, height } = page.getSize()

        // Calculate field positions - start from top of page, work down
        let currentY = height - 80 // Start below typical header area
        const fieldHeight = 16
        const fieldSpacing = 8
        const leftMargin = 50
        const labelWidth = 150
        const fieldWidth = Math.min(300, width - leftMargin - labelWidth - 50)

        for (const formField of pageFields as any[]) {
          // Skip if we already filled this field
          if (formResponses[formField.id] === undefined) continue

          // Check if field has explicit position from analysis
          let fieldX = leftMargin + labelWidth + 10
          let fieldY = currentY

          if (formField.position) {
            // Use position from analysis if available
            fieldX = formField.position.x || fieldX
            fieldY = formField.position.y ? height - formField.position.y : fieldY
          }

          // Skip if we'd go off the page
          if (fieldY < 50) continue

          try {
            const uniqueFieldName = `field_${formField.id}_${pageIndex}_${fieldsCreated}`
            const value = formResponses[formField.id]

            if (formField.type === "checkbox" || formField.type === "boolean") {
              // Create checkbox
              const checkbox = form.createCheckBox(uniqueFieldName)
              checkbox.addToPage(page, {
                x: fieldX,
                y: fieldY - fieldHeight / 2,
                width: fieldHeight,
                height: fieldHeight,
                borderColor: rgb(0.4, 0.4, 0.4),
                backgroundColor: rgb(1, 1, 1),
              })

              if (value === true || value === "true" || value === "yes") {
                checkbox.check()
              }
              fieldsCreated++
              fieldsFilled++
            } else {
              // Create text field
              const textField = form.createTextField(uniqueFieldName)
              const actualFieldWidth = formField.type === "textarea" ? fieldWidth : Math.min(fieldWidth, 250)
              const actualFieldHeight = formField.type === "textarea" ? fieldHeight * 3 : fieldHeight

              textField.addToPage(page, {
                x: fieldX,
                y: fieldY - actualFieldHeight,
                width: actualFieldWidth,
                height: actualFieldHeight,
                borderColor: rgb(0.6, 0.6, 0.6),
                backgroundColor: rgb(1, 1, 1),
                borderWidth: 0.5,
              })

              if (value !== undefined && value !== null && value !== "") {
                textField.setText(String(value))
                fieldsFilled++
              }
              fieldsCreated++
            }

            currentY -= fieldHeight + fieldSpacing
            if (formField.type === "textarea") {
              currentY -= fieldHeight * 2 // Extra space for textareas
            }
          } catch (error) {
            console.log("[v0] Error creating overlay field:", formField.id, error)
          }
        }
      }
    }

    if (fieldsCreated === 0 && fieldsFilled === 0 && Object.keys(formResponses).length > 0) {
      console.log("[v0] Creating response annotations on first page...")

      const firstPage = pdfDoc.getPage(0)
      const { width, height } = firstPage.getSize()

      // Add a small annotation box in the corner with response summary
      const boxX = width - 220
      const boxY = height - 120
      const boxWidth = 200
      const boxHeight = 100

      // Draw semi-transparent background
      firstPage.drawRectangle({
        x: boxX,
        y: boxY,
        width: boxWidth,
        height: boxHeight,
        color: rgb(1, 1, 0.9),
        borderColor: rgb(0.8, 0.8, 0.8),
        borderWidth: 1,
        opacity: 0.95,
      })

      // Add title
      firstPage.drawText("Form Responses Attached", {
        x: boxX + 10,
        y: boxY + boxHeight - 20,
        size: 10,
        font: boldFont,
        color: rgb(0.2, 0.2, 0.2),
      })

      // Add count
      firstPage.drawText(`${Object.keys(formResponses).length} fields completed`, {
        x: boxX + 10,
        y: boxY + boxHeight - 35,
        size: 8,
        font: font,
        color: rgb(0.4, 0.4, 0.4),
      })

      firstPage.drawText("See response summary for details", {
        x: boxX + 10,
        y: boxY + boxHeight - 50,
        size: 8,
        font: font,
        color: rgb(0.4, 0.4, 0.4),
      })
    }

    console.log("[v0] Fields created:", fieldsCreated)
    console.log("[v0] Fields filled:", fieldsFilled)
    console.log("[v0] Total pages:", pdfDoc.getPageCount())

    // Save the PDF
    const filledPdfBytes = await pdfDoc.save()
    console.log("[v0] PDF saved, size:", filledPdfBytes.byteLength, "bytes")

    // Save to blob storage
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
      } catch (blobError) {
        console.log("[v0] Could not save to blob storage:", blobError)
      }
    }

    return new Response(filledPdfBytes, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="filled_tender_${tenderData.title?.replace(/[^a-z0-9]/gi, "_").toLowerCase() || "document"}.pdf"`,
        "X-Fields-Created": String(fieldsCreated),
        "X-Fields-Filled": String(fieldsFilled),
        "X-Total-Pages": String(pdfDoc.getPageCount()),
        "X-Saved-Blob-Url": savedBlobUrl || "",
      },
    })
  } catch (error: any) {
    console.error("[v0] Error generating filled editable PDF:", error)
    return Response.json({ error: error.message || "Failed to generate filled editable PDF" }, { status: 500 })
  }
}

function findBestMatch(
  pdfFieldName: string,
  responses: Record<string, any>,
  formFields: any[],
): { key: string; value: any; score: number } | null {
  const normalizedFieldName = pdfFieldName.toLowerCase().replace(/[_\-\s]+/g, "")
  let bestMatch: { key: string; value: any; score: number } | null = null

  // First, try to match against our analyzed formFields to find the corresponding response
  for (const formField of formFields) {
    const fieldId = formField.id
    const fieldLabel = formField.label || ""
    const pdfFieldId = formField.pdfFieldName || ""

    const normalizedId = fieldId.toLowerCase().replace(/[_\-\s]+/g, "")
    const normalizedLabel = fieldLabel.toLowerCase().replace(/[_\-\s]+/g, "")
    const normalizedPdfField = pdfFieldId.toLowerCase().replace(/[_\-\s]+/g, "")

    let score = 0

    // Exact match on PDF field name
    if (normalizedPdfField && normalizedFieldName === normalizedPdfField) {
      score = 100
    }
    // Exact match on field ID
    else if (normalizedFieldName === normalizedId) {
      score = 95
    }
    // Exact match on label
    else if (normalizedFieldName === normalizedLabel) {
      score = 90
    }
    // Contains match
    else if (
      normalizedFieldName.includes(normalizedId) ||
      normalizedId.includes(normalizedFieldName) ||
      normalizedFieldName.includes(normalizedLabel) ||
      normalizedLabel.includes(normalizedFieldName)
    ) {
      score = 70
    }
    // Word overlap
    else {
      const fieldWords = normalizedFieldName.split(/(?=[A-Z])/).map((w) => w.toLowerCase())
      const idWords = normalizedId.split(/(?=[A-Z])/).map((w) => w.toLowerCase())
      const labelWords = normalizedLabel.split(/[^a-z]/).filter(Boolean)

      const allTargetWords = [...idWords, ...labelWords]
      const overlap = fieldWords.filter((w) => allTargetWords.some((tw) => tw.includes(w) || w.includes(tw))).length

      score = overlap * 15
    }

    if (score > 0 && responses[fieldId] !== undefined) {
      if (!bestMatch || score > bestMatch.score) {
        bestMatch = { key: fieldId, value: responses[fieldId], score }
      }
    }
  }

  // If no match found via formFields, try direct response matching
  if (!bestMatch) {
    for (const [key, value] of Object.entries(responses)) {
      const normalizedKey = key.toLowerCase().replace(/[_\-\s]+/g, "")
      let score = 0

      if (normalizedFieldName === normalizedKey) {
        score = 100
      } else if (normalizedFieldName.includes(normalizedKey) || normalizedKey.includes(normalizedFieldName)) {
        score = 80
      } else {
        const fieldWords = normalizedFieldName.split(/(?=[A-Z])/).map((w) => w.toLowerCase())
        const keyWords = normalizedKey.split(/(?=[A-Z])/).map((w) => w.toLowerCase())
        const overlap = fieldWords.filter((w) => keyWords.some((kw) => kw.includes(w) || w.includes(kw))).length
        score = overlap * 20
      }

      if (score > 0 && (!bestMatch || score > bestMatch.score)) {
        bestMatch = { key, value, score }
      }
    }
  }

  return bestMatch && bestMatch.score >= 40 ? bestMatch : null
}
