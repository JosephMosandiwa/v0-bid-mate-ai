import { createClient } from "@/lib/supabase/server"
import { PDFDocument, PDFTextField, PDFCheckBox, rgb, StandardFonts } from "pdf-lib"
import { put } from "@vercel/blob"
import type { NextRequest } from "next/server"
import { findBestMatch } from "@/lib/utils" // Declare the findBestMatch function

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
    const pdfFormFields = analysisData?.analysis_data?.pdfFormFields || []
    console.log("[v0] Form fields from analysis:", formFields.length)
    console.log("[v0] PDF form fields with positions:", pdfFormFields.length)

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
      sourcePdf = await PDFDocument.load(originalPdfBytes, {
        ignoreEncryption: true,
        updateMetadata: false,
      })

      pdfDoc = await PDFDocument.create()

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

    let fieldsFilled = 0
    let fieldsCreated = 0

    const existingFields = form.getFields()

    if (existingFields.length > 0) {
      console.log("[v0] Filling", existingFields.length, "existing form fields...")

      for (const field of existingFields) {
        const fieldName = field.getName()
        const matchingResponse = findBestMatch(fieldName, formResponses, formFields)

        if (matchingResponse) {
          try {
            if (field instanceof PDFTextField) {
              field.setText(String(matchingResponse.value))
              fieldsFilled++
              console.log("[v0] Filled existing field:", fieldName, "with value:", matchingResponse.value)
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

    // Build a position map from the extracted PDF form fields
    const positionMap = new Map<string, { x: number; y: number; width: number; height: number; page: number }>()

    for (const pdfField of pdfFormFields) {
      if (pdfField.position) {
        positionMap.set(pdfField.name.toLowerCase(), pdfField.position)
      }
    }

    console.log("[v0] Position map has", positionMap.size, "entries")

    // Create overlay fields for responses that don't have existing PDF fields
    const pages = pdfDoc.getPages()
    const pageCount = pages.length
    const filledFieldNames = new Set<string>()

    // Track which responses already have fields
    for (const field of existingFields) {
      const fieldName = field.getName().toLowerCase()
      filledFieldNames.add(fieldName)
    }

    for (const formField of formFields) {
      const fieldId = formField.id
      const response = formResponses[fieldId]

      if (response === undefined || response === null || response === "") continue

      // Check if this field already exists
      const normalizedId = fieldId.toLowerCase().replace(/[_\-\s]+/g, "")
      let alreadyFilled = false

      for (const filledName of filledFieldNames) {
        const normalizedFilled = filledName.toLowerCase().replace(/[_\-\s]+/g, "")
        if (normalizedFilled.includes(normalizedId) || normalizedId.includes(normalizedFilled)) {
          alreadyFilled = true
          break
        }
      }

      if (alreadyFilled) continue

      let position = formField.position

      if (!position) {
        // Try to match with PDF form field positions
        for (const [pdfFieldName, pos] of positionMap.entries()) {
          if (pdfFieldName.includes(normalizedId) || normalizedId.includes(pdfFieldName)) {
            position = pos
            console.log(`[v0] Found position match for ${fieldId} from PDF field`)
            break
          }
        }
      }

      // Determine page index
      let pageIndex = 0
      if (position?.page) {
        pageIndex = Math.min(position.page - 1, pageCount - 1)
      } else if (formField.pageNumber) {
        pageIndex = Math.min(formField.pageNumber - 1, pageCount - 1)
      }

      const page = pages[pageIndex]
      const { width, height } = page.getSize()

      try {
        const uniqueFieldName = `overlay_${fieldId}_${Date.now()}_${fieldsCreated}`

        if (formField.type === "checkbox" || formField.type === "boolean") {
          const fieldX = position?.x ?? 50
          const fieldY = position?.y ?? height - 100 - fieldsCreated * 25
          const fieldWidth = position?.width ?? 14
          const fieldHeight = position?.height ?? 14

          const checkbox = form.createCheckBox(uniqueFieldName)
          checkbox.addToPage(page, {
            x: fieldX,
            y: fieldY,
            width: fieldWidth,
            height: fieldHeight,
            borderColor: rgb(0.4, 0.4, 0.4),
            backgroundColor: rgb(1, 1, 1),
          })

          if (response === true || response === "true" || response === "yes") {
            checkbox.check()
          }
          fieldsCreated++
          fieldsFilled++
          console.log(`[v0] Created checkbox at (${fieldX}, ${fieldY}) on page ${pageIndex + 1}`)
        } else {
          const fieldX = position?.x ?? 200
          const fieldY = position?.y ?? height - 100 - fieldsCreated * 25
          const fieldWidth = position?.width ?? (formField.type === "textarea" ? 350 : 200)
          const fieldHeight = position?.height ?? (formField.type === "textarea" ? 60 : 18)

          const textField = form.createTextField(uniqueFieldName)
          textField.addToPage(page, {
            x: fieldX,
            y: fieldY,
            width: fieldWidth,
            height: fieldHeight,
            borderColor: rgb(0.6, 0.6, 0.6),
            backgroundColor: rgb(1, 1, 1),
            borderWidth: 0.5,
          })

          textField.setText(String(response))
          fieldsCreated++
          fieldsFilled++
          console.log(`[v0] Created text field "${fieldId}" at (${fieldX}, ${fieldY}) on page ${pageIndex + 1}`)
        }
      } catch (error: any) {
        console.log("[v0] Error creating overlay field:", fieldId, error.message)
      }
    }

    if (fieldsCreated === 0 && fieldsFilled === 0 && Object.keys(formResponses).length > 0) {
      console.log("[v0] No field positions available, creating response annotation...")

      const firstPage = pdfDoc.getPage(0)
      const { width, height } = firstPage.getSize()

      const boxX = width - 220
      const boxY = height - 120
      const boxWidth = 200
      const boxHeight = 100

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

      firstPage.drawText("Form Responses Attached", {
        x: boxX + 10,
        y: boxY + boxHeight - 20,
        size: 10,
        font: boldFont,
        color: rgb(0.2, 0.2, 0.2),
      })

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

    const filledPdfBytes = await pdfDoc.save()
    console.log("[v0] PDF saved, size:", filledPdfBytes.byteLength, "bytes")

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
