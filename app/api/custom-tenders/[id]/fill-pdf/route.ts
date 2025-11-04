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
      console.log("[v0] No user found - unauthorized")
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log("[v0] User ID:", user.id)

    // Fetch form responses
    const { data: responseData, error: responseError } = await supabase
      .from("user_custom_tender_responses")
      .select("*")
      .eq("tender_id", id)
      .eq("user_id", user.id)
      .single()

    console.log("[v0] Response query result:", { responseData, responseError })

    if (responseError && responseError.code !== "PGRST116") {
      console.error("[v0] Error fetching responses:", responseError)
      return Response.json({ error: "Failed to fetch form responses" }, { status: 500 })
    }

    const formResponses = responseData?.response_data || {}
    console.log("[v0] Form responses:", formResponses)
    console.log("[v0] Number of saved responses:", Object.keys(formResponses).length)

    // Fetch document
    const { data: docData, error: docError } = await supabase
      .from("user_custom_tender_documents")
      .select("*")
      .eq("id", documentId)
      .single()

    console.log("[v0] Document query result:", { docData, docError })

    if (docError || !docData) {
      console.error("[v0] Error fetching document:", docError)
      return Response.json({ error: "Document not found" }, { status: 404 })
    }

    console.log("[v0] Document file type:", docData.file_type)

    if (docData.file_type !== "application/pdf") {
      return Response.json({ error: "Only PDF documents can be filled" }, { status: 400 })
    }

    // Download PDF from blob storage
    console.log("[v0] Downloading PDF from:", docData.blob_url)
    const pdfResponse = await fetch(docData.blob_url)
    if (!pdfResponse.ok) {
      console.error("[v0] Error downloading PDF from blob, status:", pdfResponse.status)
      return Response.json({ error: "Failed to download PDF" }, { status: 500 })
    }

    const pdfBytes = await pdfResponse.arrayBuffer()
    console.log("[v0] PDF downloaded, size:", pdfBytes.byteLength, "bytes")

    const pdfDoc = await PDFDocument.load(pdfBytes)
    const form = pdfDoc.getForm()
    const fields = form.getFields()

    console.log("[v0] PDF has", fields.length, "form fields")
    console.log(
      "[v0] PDF field names:",
      fields.map((f) => f.getName()),
    )

    let filledCount = 0
    if (Object.keys(formResponses).length > 0) {
      console.log("[v0] Attempting to fill fields with responses:", Object.keys(formResponses))

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

          console.log("[v0] Trying to fill field:", fieldId, "with value:", value)
          console.log("[v0] Possible field names:", possibleNames)

          let fieldFound = false
          for (const name of possibleNames) {
            try {
              const field = form.getField(name)
              if (field) {
                const fieldType = field.constructor.name
                console.log("[v0] ✓ Found field:", name, "Type:", fieldType, "Value:", value)

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
            console.log("[v0] ✗ Could not find PDF field for:", fieldId)
          }
        } catch (error) {
          console.error("[v0] Error filling field:", fieldId, error)
        }
      }
    } else {
      console.log("[v0] No form responses to fill - formResponses is empty")
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
