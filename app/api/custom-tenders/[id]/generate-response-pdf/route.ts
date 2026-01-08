import { createClient } from "@/lib/supabase/server"
import { PDFDocument, rgb, StandardFonts } from "pdf-lib"
import type { NextRequest } from "next/server"

export async function POST(request: NextRequest, context: any) {
  try {
    const paramsObj = context?.params ? await context.params : context?.params ?? context
    const { id } = paramsObj as { id?: string }
    const supabase = await createClient()

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

    // Fetch form responses
    const { data: responseData, error: responseError } = await supabase
      .from("user_custom_tender_responses")
      .select("*")
      .eq("tender_id", id)
      .eq("user_id", user.id)
      .single()

    if (responseError && responseError.code !== "PGRST116") {
      return Response.json({ error: "Failed to fetch form responses" }, { status: 500 })
    }

    const formResponses = responseData?.response_data || {}
    const formFields = tenderData.form_fields || []

    let pdfDoc: PDFDocument

    if (tenderData.document_url) {
      try {
        // Fetch the original PDF from blob storage
        const pdfResponse = await fetch(tenderData.document_url)
        if (!pdfResponse.ok) {
          throw new Error("Failed to fetch original PDF")
        }
        const originalPdfBytes = await pdfResponse.arrayBuffer()

        // Load the original PDF
        pdfDoc = await PDFDocument.load(originalPdfBytes)
        console.log("[v0] Loaded original PDF with", pdfDoc.getPageCount(), "pages")
      } catch (error) {
        console.error("[v0] Error loading original PDF, creating new document:", error)
        // Fallback to creating a new PDF if loading fails
        pdfDoc = await PDFDocument.create()
      }
    } else {
      // No original PDF, create a new one
      pdfDoc = await PDFDocument.create()
    }

    const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman)
    const timesRomanBoldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold)

    let page = pdfDoc.addPage([595, 842]) // A4 size
    const { width, height } = page.getSize()
    const margin = 50
    let yPosition = height - margin

    // Helper function to add text with word wrapping
    const addText = (text: string, fontSize: number, font: any, maxWidth: number, isBold = false) => {
      const words = text.split(" ")
      let line = ""
      const lineHeight = fontSize * 1.2

      for (const word of words) {
        const testLine = line + word + " "
        const testWidth = font.widthOfTextAtSize(testLine, fontSize)

        if (testWidth > maxWidth && line !== "") {
          // Check if we need a new page
          if (yPosition - lineHeight < margin) {
            page = pdfDoc.addPage([595, 842])
            yPosition = height - margin
          }

          page.drawText(line.trim(), {
            x: margin,
            y: yPosition,
            size: fontSize,
            font: font,
            color: rgb(0, 0, 0),
          })
          yPosition -= lineHeight
          line = word + " "
        } else {
          line = testLine
        }
      }

      // Draw remaining text
      if (line.trim() !== "") {
        if (yPosition - lineHeight < margin) {
          page = pdfDoc.addPage([595, 842])
          yPosition = height - margin
        }

        page.drawText(line.trim(), {
          x: margin,
          y: yPosition,
          size: fontSize,
          font: font,
          color: rgb(0, 0, 0),
        })
        yPosition -= lineHeight
      }

      return yPosition
    }

    // Add title
    addText("TENDER RESPONSE DOCUMENT", 20, timesRomanBoldFont, width - 2 * margin, true)
    yPosition -= 20

    // Add tender information
    addText(`Tender: ${tenderData.title || "Untitled Tender"}`, 14, timesRomanBoldFont, width - 2 * margin, true)
    yPosition -= 10

    if (tenderData.description) {
      addText(`Description: ${tenderData.description}`, 10, timesRomanFont, width - 2 * margin)
      yPosition -= 10
    }

    if (tenderData.close_date) {
      addText(
        `Closing Date: ${new Date(tenderData.close_date).toLocaleDateString()}`,
        10,
        timesRomanFont,
        width - 2 * margin,
      )
      yPosition -= 10
    }

    yPosition -= 20

    // Add horizontal line
    page.drawLine({
      start: { x: margin, y: yPosition },
      end: { x: width - margin, y: yPosition },
      thickness: 1,
      color: rgb(0, 0, 0),
    })
    yPosition -= 30

    // Group fields by section
    const sections = new Map<string, any[]>()
    formFields.forEach((field: any) => {
      const section = field.section || "General Information"
      if (!sections.has(section)) {
        sections.set(section, [])
      }
      sections.get(section)?.push(field)
    })

    // Add form responses by section
    for (const [sectionName, sectionFields] of sections.entries()) {
      // Add section header
      if (yPosition - 40 < margin) {
        page = pdfDoc.addPage([595, 842])
        yPosition = height - margin
      }

      addText(sectionName.toUpperCase(), 14, timesRomanBoldFont, width - 2 * margin, true)
      yPosition -= 20

      // Add fields in this section
      for (const field of sectionFields) {
        const value = formResponses[field.id]

        if (yPosition - 60 < margin) {
          page = pdfDoc.addPage([595, 842])
          yPosition = height - margin
        }

        // Add field label
        addText(`${field.label}${field.required ? " *" : ""}`, 11, timesRomanBoldFont, width - 2 * margin, true)
        yPosition -= 5

        // Add field value or "Not provided"
        const displayValue = value ? (Array.isArray(value) ? value.join(", ") : String(value)) : "[Not provided]"

        addText(displayValue, 10, timesRomanFont, width - 2 * margin)
        yPosition -= 15
      }

      yPosition -= 10
    }

    // Add footer
    if (yPosition - 40 < margin) {
      page = pdfDoc.addPage([595, 842])
      yPosition = height - margin
    }

    yPosition = margin + 20
    page.drawLine({
      start: { x: margin, y: yPosition },
      end: { x: width - margin, y: yPosition },
      thickness: 1,
      color: rgb(0, 0, 0),
    })
    yPosition -= 15

    addText(
      `Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`,
      8,
      timesRomanFont,
      width - 2 * margin,
    )

    // Save the PDF
    const pdfBytes = await pdfDoc.save()

    return new Response(pdfBytes as unknown as BodyInit, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="tender_response_${tenderData.title?.replace(/[^a-z0-9]/gi, "_").toLowerCase() || "document"}.pdf"`,
      },
    })
  } catch (error: any) {
    console.error("[v0] Error generating response PDF:", error)
    return Response.json({ error: error.message || "Failed to generate PDF" }, { status: 500 })
  }
}
