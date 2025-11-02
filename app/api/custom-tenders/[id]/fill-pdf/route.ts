import { createClient } from "@/lib/supabase/server"
import { PDFDocument } from "pdf-lib"
import type { NextRequest } from "next/server"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const { documentId } = await request.json()
    const supabase = await createClient()

    console.log("[v0] Filling PDF for custom tender:", id, "document:", documentId)

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Fetch form responses
    const { data: responseData, error: responseError } = await supabase
      .from("user_custom_tender_responses")
      .select("*")
      .eq("tender_id", id)
      .eq("user_id", user.id)
      .single()

    if (responseError && responseError.code !== "PGRST116") {
      console.error("[v0] Error fetching responses:", responseError)
      return Response.json({ error: "Failed to fetch form responses" }, { status: 500 })
    }

    const formResponses = responseData?.response_data || {}

    // Fetch document
    const { data: docData, error: docError } = await supabase
      .from("user_custom_tender_documents")
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

    // Download PDF from blob storage
    const pdfResponse = await fetch(docData.blob_url)
    if (!pdfResponse.ok) {
      console.error("[v0] Error downloading PDF from blob")
      return Response.json({ error: "Failed to download PDF" }, { status: 500 })
    }

    const pdfBytes = await pdfResponse.arrayBuffer()
    const pdfDoc = await PDFDocument.load(pdfBytes)
    const form = pdfDoc.getForm()
    const fields = form.getFields()

    console.log("[v0] PDF has", fields.length, "form fields")

    let filledCount = 0
    if (Object.keys(formResponses).length > 0) {
      for (const [fieldId, value] of Object.entries(formResponses)) {
        try {
          // Try to find a matching field in the PDF
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

    const filledPdfBytes = await pdfDoc.save()

    return new Response(filledPdfBytes, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="filled_${docData.file_name}"`,
      },
    })
  } catch (error: any) {
    console.error("[v0] Error in POST /api/custom-tenders/[id]/fill-pdf:", error)
    return Response.json({ error: error.message || "Failed to fill PDF" }, { status: 500 })
  }
}
