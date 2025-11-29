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
    const fontSizeMap = new Map<string, number>()
    let defaultFontSize = 10 // Default fallback

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

          // Calculate font size based on field height (typically 70-80% of field height)
          const calculatedFontSize = Math.max(8, Math.min(14, rect.height * 0.7))
          fontSizeMap.set(fieldName.toLowerCase(), calculatedFontSize)

          // Try to extract font size from default appearance if available
          try {
            const da = widget.getDefaultAppearance()
            if (da) {
              // Default appearance string format: "/FontName fontSize Tf"
              const fontSizeMatch = da.match(/(\d+(?:\.\d+)?)\s+Tf/)
              if (fontSizeMatch) {
                const extractedSize = Number.parseFloat(fontSizeMatch[1])
                if (extractedSize > 0 && extractedSize < 72) {
                  fontSizeMap.set(fieldName.toLowerCase(), extractedSize)
                  defaultFontSize = extractedSize // Use this as a reference
                }
              }
            }
          } catch (daError) {
            // Use calculated size if DA extraction fails
          }
        }
      } catch (e) {
        // Skip fields that can't be read
      }
    }

    console.log("[v0] Position map has", positionMap.size, "entries from source PDF")
    console.log("[v0] Font size map has", fontSizeMap.size, "entries, default size:", defaultFontSize)

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
              const fontSize = fontSizeMap.get(fieldName.toLowerCase()) || defaultFontSize
              try {
                field.setFontSize(fontSize)
              } catch (fontError) {
                // Some fields may not support setFontSize
              }

              field.setText(String(matchingResponse.value))
              fieldsFilled++
              filledFieldNames.add(fieldName.toLowerCase())
              console.log("[v0] Filled existing field:", fieldName, "with font size:", fontSize)
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

      // Try to find exact position from the source PDF
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

      // We only create overlay fields when we have actual coordinates from the source PDF
      if (!position) {
        console.log(`[v0] Skipping field "${fieldId}" - no position available from source PDF`)
        continue
      }

      const pageIndex = Math.min(position.page, pageCount - 1)
      const page = pages[pageIndex]

      try {
        const uniqueFieldName = `overlay_${fieldId}_${Date.now()}_${fieldsCreated}`

        if (formField.type === "checkbox" || formField.type === "boolean") {
          const checkbox = form.createCheckBox(uniqueFieldName)
          checkbox.addToPage(page, {
            x: position.x,
            y: position.y,
            width: position.width || 14,
            height: position.height || 14,
            borderColor: rgb(0.4, 0.4, 0.4),
            backgroundColor: rgb(1, 1, 1),
          })

          if (response === true || response === "true" || response === "yes") {
            checkbox.check()
          }
          fieldsCreated++
          fieldsFilled++
          console.log(`[v0] Created checkbox at (${position.x}, ${position.y}) on page ${pageIndex + 1}`)
        } else {
          const textField = form.createTextField(uniqueFieldName)
          textField.addToPage(page, {
            x: position.x,
            y: position.y,
            width: position.width || 200,
            height: position.height || 20,
            borderColor: rgb(0.6, 0.6, 0.6),
            backgroundColor: rgb(1, 1, 1),
            borderWidth: 0.5,
          })

          let fontSize = defaultFontSize

          // Try to find a matching font size from position map
          for (const [pdfFieldName, size] of fontSizeMap.entries()) {
            const normalizedPdfName = pdfFieldName.replace(/[_\-\s]+/g, "")
            if (normalizedPdfName.includes(normalizedId) || normalizedId.includes(normalizedPdfName)) {
              fontSize = size
              break
            }
          }

          // If no match found, calculate based on field height
          if (fontSize === defaultFontSize && position.height) {
            fontSize = Math.max(8, Math.min(14, position.height * 0.7))
          }

          try {
            textField.setFontSize(fontSize)
          } catch (fontError) {
            // Fallback if setFontSize fails
          }

          textField.setText(String(response))
          fieldsCreated++
          fieldsFilled++

          console.log(
            `[v0] Created text field "${fieldId}" at (${position.x}, ${position.y}) on page ${pageIndex + 1} with font size ${fontSize}`,
          )
        }
      } catch (error: any) {
        console.log("[v0] Error creating overlay field:", fieldId, error.message)
      }
    }

    if (fieldsCreated === 0 && fieldsFilled === 0 && Object.keys(formResponses).length > 0) {
      console.log("[v0] No PDF form fields found - responses will be saved but not overlaid on PDF")
      console.log("[v0] The original document may not have editable form fields")
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
