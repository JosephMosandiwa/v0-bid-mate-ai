import { createClient } from "@/lib/supabase/server"
import { PDFDocument } from "pdf-lib"
import type { NextRequest } from "next/server"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const { documentId } = await request.json()
    const supabase = await createClient()

    console.log("[v0] ========================================")
    console.log("[v0] FILL PDF REQUEST")
    console.log("[v0] ========================================")
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
    console.log("[v0] Response field IDs:", Object.keys(formResponses))

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

    console.log("[v0] ========================================")
    console.log("[v0] PDF FORM ANALYSIS")
    console.log("[v0] ========================================")
    console.log("[v0] PDF has", fields.length, "form fields")
    const pdfFieldNames = fields.map((f) => f.getName())
    console.log("[v0] PDF field names:", pdfFieldNames)
    console.log("[v0] ========================================")

    let filledCount = 0
    const matchLog: Array<{ responseField: string; pdfField: string | null; success: boolean }> = []

    if (Object.keys(formResponses).length > 0) {
      console.log("[v0] Attempting to fill fields with responses...")

      for (const [fieldId, value] of Object.entries(formResponses)) {
        try {
          const possibleNames = [
            fieldId, // Exact match
            fieldId.toLowerCase(), // Lowercase
            fieldId.toUpperCase(), // Uppercase
            fieldId.replace(/_/g, " "), // Underscores to spaces
            fieldId.replace(/-/g, " "), // Hyphens to spaces
            fieldId.replace(/_/g, ""), // Remove underscores
            fieldId.replace(/-/g, ""), // Remove hyphens
            fieldId
              .replace(/([A-Z])/g, " $1")
              .trim(), // CamelCase to spaces
            fieldId
              .replace(/([A-Z])/g, "_$1")
              .toLowerCase()
              .substring(1), // CamelCase to snake_case
            fieldId.replace(/\s+/g, ""), // Remove all spaces
            fieldId.replace(/\s+/g, "_"), // Spaces to underscores
            fieldId.replace(/\s+/g, "-"), // Spaces to hyphens
          ]

          console.log("[v0] ----------------------------------------")
          console.log("[v0] Trying to fill field:", fieldId)
          console.log("[v0] Value:", value)
          console.log("[v0] Value type:", typeof value)
          console.log("[v0] Possible field name variations:", possibleNames)

          let fieldFound = false
          let matchedFieldName: string | null = null

          for (const name of possibleNames) {
            try {
              const field = form.getField(name)
              if (field) {
                const fieldType = field.constructor.name
                console.log("[v0] ✓ Found matching PDF field:", name)
                console.log("[v0] Field type:", fieldType)

                if (fieldType === "PDFTextField") {
                  const textValue = String(value || "")
                  field.setText(textValue)
                  console.log("[v0] ✓ Successfully filled text field with:", textValue)
                  filledCount++
                  fieldFound = true
                  matchedFieldName = name
                  break
                } else if (fieldType === "PDFCheckBox") {
                  if (value === true || value === "true" || value === "yes" || value === "Yes") {
                    field.check()
                    console.log("[v0] ✓ Successfully checked checkbox")
                    filledCount++
                    fieldFound = true
                    matchedFieldName = name
                    break
                  } else {
                    field.uncheck()
                    console.log("[v0] ✓ Successfully unchecked checkbox")
                    filledCount++
                    fieldFound = true
                    matchedFieldName = name
                    break
                  }
                } else if (fieldType === "PDFRadioGroup") {
                  field.select(String(value))
                  console.log("[v0] ✓ Successfully selected radio option:", value)
                  filledCount++
                  fieldFound = true
                  matchedFieldName = name
                  break
                } else if (fieldType === "PDFDropdown") {
                  field.select(String(value))
                  console.log("[v0] ✓ Successfully selected dropdown option:", value)
                  filledCount++
                  fieldFound = true
                  matchedFieldName = name
                  break
                } else {
                  console.log("[v0] ⚠ Unsupported field type:", fieldType)
                }
              }
            } catch (fieldError) {
              // Field doesn't exist with this name, try next variation
              continue
            }
          }

          matchLog.push({
            responseField: fieldId,
            pdfField: matchedFieldName,
            success: fieldFound,
          })

          if (!fieldFound) {
            console.log("[v0] ✗ Could not find matching PDF field for:", fieldId)
            console.log("[v0] Available PDF fields:", pdfFieldNames.slice(0, 10), "...")
          }
        } catch (error) {
          console.error("[v0] ✗ Error filling field:", fieldId, error)
          matchLog.push({
            responseField: fieldId,
            pdfField: null,
            success: false,
          })
        }
      }
    } else {
      console.log("[v0] ⚠ No form responses to fill - formResponses is empty")
    }

    console.log("[v0] ========================================")
    console.log("[v0] FILL SUMMARY")
    console.log("[v0] ========================================")
    console.log("[v0] Total responses:", Object.keys(formResponses).length)
    console.log("[v0] Successfully filled:", filledCount)
    console.log("[v0] Failed to fill:", Object.keys(formResponses).length - filledCount)
    console.log(
      "[v0] Success rate:",
      `${((filledCount / Math.max(Object.keys(formResponses).length, 1)) * 100).toFixed(1)}%`,
    )
    console.log("[v0] ========================================")
    console.log("[v0] FIELD MATCHING LOG:")
    matchLog.forEach((log) => {
      const status = log.success ? "✓" : "✗"
      console.log(`[v0] ${status} ${log.responseField} → ${log.pdfField || "NO MATCH"}`)
    })
    console.log("[v0] ========================================")

    if (filledCount === 0 && Object.keys(formResponses).length > 0) {
      console.log("[v0] ⚠⚠⚠ WARNING: No fields were filled! ⚠⚠⚠")
      console.log("[v0] This likely means:")
      console.log("[v0] 1. The PDF has no interactive form fields, OR")
      console.log("[v0] 2. The form field IDs don't match the PDF field names")
      console.log("[v0] ========================================")
    }

    const filledPdfBytes = await pdfDoc.save()

    return new Response(filledPdfBytes, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="filled_${docData.file_name}"`,
        "X-PDF-Fields-Total": String(fields.length),
        "X-Fields-Filled": String(filledCount),
        "X-Responses-Total": String(Object.keys(formResponses).length),
        "X-Fill-Success-Rate": String(
          ((filledCount / Math.max(Object.keys(formResponses).length, 1)) * 100).toFixed(1),
        ),
      },
    })
  } catch (error: any) {
    console.error("[v0] ========================================")
    console.error("[v0] ERROR IN FILL PDF")
    console.error("[v0] ========================================")
    console.error("[v0] Error:", error)
    console.error("[v0] Error message:", error?.message)
    console.error("[v0] Error stack:", error?.stack)
    console.error("[v0] ========================================")
    return Response.json({ error: error.message || "Failed to fill PDF" }, { status: 500 })
  }
}
