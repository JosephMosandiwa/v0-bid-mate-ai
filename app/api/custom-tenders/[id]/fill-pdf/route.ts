import { createClient } from "@/lib/supabase/server"
import { PDFDocument } from "pdf-lib"
import type { NextRequest } from "next/server"

function normalizeFieldName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "") // Remove all non-alphanumeric
    .trim()
}

function findBestFieldMatch(
  targetName: string,
  availableFields: string[],
): { fieldName: string; confidence: number } | null {
  const normalizedTarget = normalizeFieldName(targetName)

  // Try exact match first
  const exactMatch = availableFields.find((f) => f === targetName)
  if (exactMatch) {
    return { fieldName: exactMatch, confidence: 1.0 }
  }

  // Try normalized exact match
  const normalizedMatch = availableFields.find((f) => normalizeFieldName(f) === normalizedTarget)
  if (normalizedMatch) {
    return { fieldName: normalizedMatch, confidence: 0.95 }
  }

  // Try contains match (target contains field name or vice versa)
  for (const field of availableFields) {
    const normalizedField = normalizeFieldName(field)
    if (normalizedTarget.includes(normalizedField) || normalizedField.includes(normalizedTarget)) {
      return { fieldName: field, confidence: 0.8 }
    }
  }

  // Try partial word match
  const targetWords = normalizedTarget.match(/[a-z]+/g) || []
  let bestMatch: { fieldName: string; confidence: number } | null = null

  for (const field of availableFields) {
    const fieldWords = normalizeFieldName(field).match(/[a-z]+/g) || []
    const matchingWords = targetWords.filter((tw) => fieldWords.some((fw) => fw.includes(tw) || tw.includes(fw)))

    if (matchingWords.length > 0) {
      const confidence = (matchingWords.length / Math.max(targetWords.length, fieldWords.length)) * 0.7
      if (!bestMatch || confidence > bestMatch.confidence) {
        bestMatch = { fieldName: field, confidence }
      }
    }
  }

  return bestMatch && bestMatch.confidence >= 0.3 ? bestMatch : null
}

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

    const pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true })
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
    const matchLog: Array<{ responseField: string; pdfField: string | null; success: boolean; confidence?: number }> =
      []

    if (Object.keys(formResponses).length > 0) {
      console.log("[v0] Attempting to fill fields with improved fuzzy matching...")

      for (const [fieldId, value] of Object.entries(formResponses)) {
        try {
          console.log("[v0] ----------------------------------------")
          console.log("[v0] Trying to fill field:", fieldId)
          console.log("[v0] Value:", value)
          console.log("[v0] Value type:", typeof value)

          const match = findBestFieldMatch(fieldId, pdfFieldNames)

          if (match) {
            console.log("[v0] ✓ Found matching PDF field:", match.fieldName, "confidence:", match.confidence.toFixed(2))

            try {
              const field = form.getField(match.fieldName)
              const fieldType = field.constructor.name
              console.log("[v0] Field type:", fieldType)

              let filled = false

              if (fieldType === "PDFTextField") {
                const textField = field as any
                const textValue = String(value || "")
                textField.setText(textValue)
                console.log("[v0] ✓ Successfully filled text field with:", textValue.substring(0, 50))
                filled = true
              } else if (fieldType === "PDFCheckBox") {
                const checkBox = field as any
                if (value === true || value === "true" || value === "yes" || value === "Yes" || value === "1") {
                  checkBox.check()
                  console.log("[v0] ✓ Successfully checked checkbox")
                } else {
                  checkBox.uncheck()
                  console.log("[v0] ✓ Successfully unchecked checkbox")
                }
                filled = true
              } else if (fieldType === "PDFRadioGroup") {
                const radioGroup = field as any
                radioGroup.select(String(value))
                console.log("[v0] ✓ Successfully selected radio option:", value)
                filled = true
              } else if (fieldType === "PDFDropdown") {
                const dropdown = field as any
                dropdown.select(String(value))
                console.log("[v0] ✓ Successfully selected dropdown option:", value)
                filled = true
              } else {
                console.log("[v0] ⚠ Unsupported field type:", fieldType)
              }

              if (filled) {
                filledCount++
                matchLog.push({
                  responseField: fieldId,
                  pdfField: match.fieldName,
                  success: true,
                  confidence: match.confidence,
                })
              } else {
                matchLog.push({
                  responseField: fieldId,
                  pdfField: match.fieldName,
                  success: false,
                  confidence: match.confidence,
                })
              }
            } catch (fieldError: any) {
              console.error("[v0] Error setting field value:", fieldError.message)
              matchLog.push({
                responseField: fieldId,
                pdfField: match.fieldName,
                success: false,
                confidence: match.confidence,
              })
            }
          } else {
            console.log("[v0] ✗ No matching PDF field found for:", fieldId)
            matchLog.push({
              responseField: fieldId,
              pdfField: null,
              success: false,
            })
          }
        } catch (error: any) {
          console.error("[v0] ✗ Error processing field:", fieldId, error.message)
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
      const confidence = log.confidence ? ` (${(log.confidence * 100).toFixed(0)}% match)` : ""
      console.log(`[v0] ${status} ${log.responseField} → ${log.pdfField || "NO MATCH"}${confidence}`)
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
