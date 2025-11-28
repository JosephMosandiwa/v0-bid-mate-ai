import { createClient } from "@/lib/supabase/server"
import { PDFDocument, PDFTextField, PDFCheckBox, rgb, StandardFonts } from "pdf-lib"
import { put } from "@vercel/blob"
import type { NextRequest } from "next/server"
import { findBestMatch } from "@/lib/utils"

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

    const sourceForm = sourcePdf.getForm()
    const sourceFields = sourceForm.getFields()
    const positionMap = new Map<string, { x: number; y: number; width: number; height: number; page: number }>()

    console.log("[v0] Source PDF has", sourceFields.length, "form fields")

    for (const field of sourceFields) {
      try {
        const fieldName = field.getName()
        const widgets = field.acroField.getWidgets()

        if (widgets.length > 0) {
          const widget = widgets[0]
          const rect = widget.getRectangle()

          // Find which page this widget is on
          let pageIndex = 0
          const widgetPage = widget.P()
          if (widgetPage) {
            const pages = sourcePdf.getPages()
            for (let i = 0; i < pages.length; i++) {
              if (pages[i].ref === widgetPage) {
                pageIndex = i
                break
              }
            }
          }

          positionMap.set(fieldName.toLowerCase(), {
            x: rect.x,
            y: rect.y,
            width: rect.width,
            height: rect.height,
            page: pageIndex,
          })

          console.log(`[v0] Mapped field "${fieldName}" at (${rect.x}, ${rect.y}) on page ${pageIndex + 1}`)
        }
      } catch (e) {
        // Skip fields that can't be read
      }
    }

    console.log("[v0] Position map has", positionMap.size, "entries from source PDF")

    // Also add positions from analysis data
    for (const pdfField of pdfFormFields) {
      if (pdfField.position && !positionMap.has(pdfField.name.toLowerCase())) {
        positionMap.set(pdfField.name.toLowerCase(), pdfField.position)
      }
    }

    // Fill existing form fields in the new document
    const existingFields = form.getFields()
    const filledFieldNames = new Set<string>()

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
              filledFieldNames.add(fieldName.toLowerCase())
              console.log("[v0] Filled existing field:", fieldName)
            } else if (field instanceof PDFCheckBox) {
              if (
                matchingResponse.value === true ||
                matchingResponse.value === "true" ||
                matchingResponse.value === "yes"
              ) {
                field.check()
                fieldsFilled++
                filledFieldNames.add(fieldName.toLowerCase())
              }
            }
          } catch (error) {
            console.log("[v0] Could not fill field:", fieldName)
          }
        }
      }
    }

    const pages = pdfDoc.getPages()
    const pageCount = pages.length

    // Map sections to approximate page numbers
    const sectionPageMap: Record<string, number> = {
      sbd1: 0,
      sbd2: 1,
      sbd3: 2,
      sbd4: 3,
      sbd6: 4,
      sbd8: 5,
      sbd9: 6,
      company: 0,
      contact: 0,
      registration: 1,
      tax: 1,
      banking: 2,
      pricing: 3,
      experience: 4,
      references: 5,
      declaration: Math.max(0, pageCount - 2),
      signature: Math.max(0, pageCount - 1),
    }

    // Track field positions per page to avoid overlapping
    const pageFieldCounts: number[] = new Array(pageCount).fill(0)

    // Create overlay fields for responses that don't have existing PDF fields
    for (const formField of formFields) {
      const fieldId = formField.id
      const response = formResponses[fieldId]

      if (response === undefined || response === null || response === "") continue

      // Check if this field was already filled
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

      let position: { x: number; y: number; width: number; height: number; page: number } | null = null

      // First try exact match
      if (positionMap.has(normalizedId)) {
        position = positionMap.get(normalizedId)!
      } else {
        // Try fuzzy matching with position map
        for (const [pdfFieldName, pos] of positionMap.entries()) {
          const normalizedPdfName = pdfFieldName.replace(/[_\-\s]+/g, "")
          if (normalizedPdfName.includes(normalizedId) || normalizedId.includes(normalizedPdfName)) {
            position = pos
            break
          }
        }
      }

      let pageIndex = 0
      if (position?.page !== undefined) {
        pageIndex = Math.min(position.page, pageCount - 1)
      } else if (formField.pageNumber) {
        pageIndex = Math.min(formField.pageNumber - 1, pageCount - 1)
      } else if (formField.section) {
        // Use section to determine page
        const sectionLower = formField.section.toLowerCase()
        for (const [key, page] of Object.entries(sectionPageMap)) {
          if (sectionLower.includes(key)) {
            pageIndex = Math.min(page, pageCount - 1)
            break
          }
        }
      } else {
        // Distribute fields evenly across pages
        pageIndex = Math.min(Math.floor((fieldsCreated / Math.max(1, formFields.length)) * pageCount), pageCount - 1)
      }

      const page = pages[pageIndex]
      const { width, height } = page.getSize()

      const fieldIndexOnPage = pageFieldCounts[pageIndex]
      const margin = 50
      const fieldHeight = formField.type === "textarea" ? 60 : 20
      const fieldSpacing = 30
      const maxFieldsPerColumn = Math.floor((height - 2 * margin) / (fieldHeight + fieldSpacing))

      // Calculate column and row
      const column = Math.floor(fieldIndexOnPage / maxFieldsPerColumn)
      const row = fieldIndexOnPage % maxFieldsPerColumn

      // Calculate x and y position
      const columnWidth = (width - 2 * margin) / 2
      const defaultX = margin + column * columnWidth + 100 // Offset for label space
      const defaultY = height - margin - row * (fieldHeight + fieldSpacing) - fieldHeight

      try {
        const uniqueFieldName = `overlay_${fieldId}_${Date.now()}_${fieldsCreated}`

        if (formField.type === "checkbox" || formField.type === "boolean") {
          const fieldX = position?.x ?? defaultX
          const fieldY = position?.y ?? defaultY
          const fieldWidth = position?.width ?? 14
          const fHeight = position?.height ?? 14

          const checkbox = form.createCheckBox(uniqueFieldName)
          checkbox.addToPage(page, {
            x: fieldX,
            y: fieldY,
            width: fieldWidth,
            height: fHeight,
            borderColor: rgb(0.4, 0.4, 0.4),
            backgroundColor: rgb(1, 1, 1),
          })

          if (response === true || response === "true" || response === "yes") {
            checkbox.check()
          }
          fieldsCreated++
          fieldsFilled++
          pageFieldCounts[pageIndex]++
          console.log(`[v0] Created checkbox at (${fieldX}, ${fieldY}) on page ${pageIndex + 1}`)
        } else {
          const fieldX = position?.x ?? defaultX
          const fieldY = position?.y ?? defaultY
          const fieldWidth = position?.width ?? (formField.type === "textarea" ? 300 : 200)
          const fHeight = position?.height ?? fieldHeight

          const textField = form.createTextField(uniqueFieldName)
          textField.addToPage(page, {
            x: fieldX,
            y: fieldY,
            width: fieldWidth,
            height: fHeight,
            borderColor: rgb(0.6, 0.6, 0.6),
            backgroundColor: rgb(1, 1, 1),
            borderWidth: 0.5,
          })

          textField.setText(String(response))
          fieldsCreated++
          fieldsFilled++
          pageFieldCounts[pageIndex]++

          // Also draw the label next to the field
          page.drawText(formField.label?.substring(0, 30) + ":" || fieldId + ":", {
            x: Math.max(margin, fieldX - 95),
            y: fieldY + 4,
            size: 8,
            font: font,
            color: rgb(0.3, 0.3, 0.3),
          })

          console.log(`[v0] Created text field "${fieldId}" at (${fieldX}, ${fieldY}) on page ${pageIndex + 1}`)
        }
      } catch (error: any) {
        console.log("[v0] Error creating overlay field:", fieldId, error.message)
      }
    }

    if (fieldsCreated === 0 && fieldsFilled === 0 && Object.keys(formResponses).length > 0) {
      console.log("[v0] No field positions available, creating response summary pages...")

      // Add new pages with form responses
      const responsesPerPage = 15
      const responseEntries = Object.entries(formResponses).filter(([_, v]) => v !== null && v !== "")
      const totalResponsePages = Math.ceil(responseEntries.length / responsesPerPage)

      for (let pageNum = 0; pageNum < totalResponsePages; pageNum++) {
        const newPage = pdfDoc.addPage([612, 792]) // Letter size
        const { width, height } = newPage.getSize()

        // Header
        newPage.drawText("TENDER RESPONSE - FORM DATA", {
          x: 50,
          y: height - 50,
          size: 16,
          font: boldFont,
          color: rgb(0.1, 0.1, 0.4),
        })

        newPage.drawText(`Page ${pageNum + 1} of ${totalResponsePages}`, {
          x: width - 120,
          y: height - 50,
          size: 10,
          font: font,
          color: rgb(0.5, 0.5, 0.5),
        })

        // Draw responses
        const startIdx = pageNum * responsesPerPage
        const endIdx = Math.min(startIdx + responsesPerPage, responseEntries.length)
        let yPos = height - 90

        for (let i = startIdx; i < endIdx; i++) {
          const [fieldId, value] = responseEntries[i]
          const formField = formFields.find((f: any) => f.id === fieldId)
          const label = formField?.label || fieldId

          // Draw label
          newPage.drawText(label.substring(0, 50) + ":", {
            x: 50,
            y: yPos,
            size: 10,
            font: boldFont,
            color: rgb(0.2, 0.2, 0.2),
          })

          // Draw value
          const valueStr = String(value).substring(0, 80)
          newPage.drawText(valueStr, {
            x: 50,
            y: yPos - 15,
            size: 10,
            font: font,
            color: rgb(0.3, 0.3, 0.3),
          })

          yPos -= 45
        }
      }
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
