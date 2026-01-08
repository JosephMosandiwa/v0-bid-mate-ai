import { createClient } from "@supabase/supabase-js"
import { PDFDocument } from "pdf-lib"
import type { NextRequest } from "next/server"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(request: NextRequest, context: any) {
  try {
    const paramsObj = context?.params ? await context.params : context?.params ?? context
    const { id } = paramsObj as { id?: string }
    const { documentId } = await request.json()

    console.log("[v0] Filling PDF for tender:", id, "document:", documentId)

    const { data: responseData, error: responseError } = await supabase
      .from("tender_responses")
      .select("*")
      .eq("tender_id", id)
      .single()

    if (responseError && responseError.code !== "PGRST116") {
      console.error("[v0] Error fetching responses:", responseError)
      return Response.json({ error: "Failed to fetch form responses" }, { status: 500 })
    }

    const formResponses = responseData?.response_data || {}

    const { data: docData, error: docError } = await supabase
      .from("tender_documents")
      .select("*")
      .eq("id", documentId)
      .single()

    if (docError || !docData) {
      console.error("[v0] Error fetching document:", docError)
      return Response.json({ error: "Document not found" }, { status: 404 })
    }

    if (docData.file_type !== "application/pdf") {
      return Response.json({ error: "Only PDF documents can be filled" }, { status: 400 })
    }

    const { data: fileData, error: downloadError } = await supabase.storage
      .from("tender-documents")
      .download(docData.storage_path)

    if (downloadError || !fileData) {
      console.error("[v0] Error downloading PDF:", downloadError)
      return Response.json({ error: "Failed to download PDF" }, { status: 500 })
    }

    const pdfBytes = await fileData.arrayBuffer()
    const pdfDoc = await PDFDocument.load(pdfBytes)
    const form = pdfDoc.getForm()
    const fields = form.getFields()

    console.log("[v0] PDF has", fields.length, "form fields")

    let filledCount = 0
    if (Object.keys(formResponses).length > 0) {
      for (const [fieldId, value] of Object.entries(formResponses)) {
        try {
          // Try to find a matching field in the PDF
          // We'll try multiple strategies to match field names
          const possibleNames = [
            fieldId,
            fieldId.toLowerCase(),
            fieldId.replace(/_/g, " "),
            fieldId.replace(/-/g, " "),
            fieldId.replace(/([A-Z])/g, " $1").trim(),
          ]

          let fieldFound = false
          for (const name of possibleNames) {
            try {
              const field = form.getField(name)
              if (field) {
                // Handle different field types
                const fieldType = field.constructor.name
                console.log("[v0] Found field:", name, "Type:", fieldType, "Value:", value)

                if (fieldType === "PDFTextField") {
                  field.setText(String(value || ""))
                  filledCount++
                  fieldFound = true
                  break
                } else if (fieldType === "PDFCheckBox") {
                  if (value === true || value === "true" || value === "yes") {
                    field.check()
                    filledCount++
                    fieldFound = true
                    break
                  }
                } else if (fieldType === "PDFRadioGroup") {
                  field.select(String(value))
                  filledCount++
                  fieldFound = true
                  break
                } else if (fieldType === "PDFDropdown") {
                  field.select(String(value))
                  filledCount++
                  fieldFound = true
                  break
                }
              }
            } catch (fieldError) {
              // Field not found with this name, try next
              continue
            }
          }

          if (!fieldFound) {
            console.log("[v0] Could not find PDF field for:", fieldId)
          }
        } catch (error) {
          console.error("[v0] Error filling field:", fieldId, error)
        }
      }
    }

    console.log("[v0] Filled", filledCount, "fields out of", Object.keys(formResponses).length, "responses")

    // form.flatten()

    const filledPdfBytes = await pdfDoc.save()

    return new Response(filledPdfBytes as unknown as BodyInit, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="filled_${docData.file_name}"`,
      },
    })
  } catch (error: any) {
    console.error("[v0] Error in POST /api/tenders/scraped/[id]/fill-pdf:", error)
    return Response.json({ error: error.message || "Failed to fill PDF" }, { status: 500 })
  }
}
