import { type NextRequest, NextResponse } from "next/server"
import { processDocument } from "@/lib/engines/documind"
import type { DetectedField, FormField } from "@/lib/engines/documind/types"

export async function POST(request: NextRequest) {
  try {
    const { documentUrl, tenderId, tenderType } = await request.json()

    console.log("[v0] Extracting form fields from document:", documentUrl)

    // Fetch the document
    const response = await fetch(documentUrl)
    if (!response.ok) {
      throw new Error(`Failed to fetch document: ${response.statusText}`)
    }

    const arrayBuffer = await response.arrayBuffer()
    const mimeType = response.headers.get("content-type") || "application/pdf"

    // Process document with Documind
    const result = await processDocument(arrayBuffer, mimeType, {
      extract_forms: true,
      extract_tables: false,
      extract_images: false,
      ocr_enabled: true,
    })

    if (!result.success || !result.document) {
      throw new Error(result.error?.message || "Failed to process document")
    }

    const doc = result.document

    // Combine detected fields and native form fields
    const allFields: any[] = []

    // Add detected fields from form regions
    doc.layout.form_regions.forEach((region) => {
      region.detected_fields.forEach((field: DetectedField) => {
        allFields.push({
          id: field.id,
          label: field.label.text,
          type: mapFieldType(field.input.type, field.suggested_type),
          required: false, // Will be inferred
          placeholder: generatePlaceholder(field.label.text, field.suggested_type),
          description: "",
          section: inferSection(field.label.text),
          validation: buildValidation(field.suggested_type),
          position: {
            page: region.page,
            ...field.input.position,
          },
        })
      })
    })

    // Add native PDF form fields
    doc.form_fields.forEach((field: FormField) => {
      allFields.push({
        id: field.name || field.id,
        label: formatFieldName(field.name),
        type: mapNativeFieldType(field.type),
        required: field.is_required,
        placeholder: generatePlaceholder(field.name, "text"),
        description: "",
        section: inferSection(field.name),
        validation: buildValidationFromNative(field),
        options: field.options.map((opt) => opt.label),
        position: {
          page: field.page,
          ...field.position,
        },
      })
    })

    // Remove duplicates and sort by position
    const uniqueFields = removeDuplicateFields(allFields)
    const sortedFields = sortFieldsByPosition(uniqueFields)

    // Group by sections
    const sections = Array.from(new Set(sortedFields.map((f) => f.section)))
    const groupedFields = sections.map((section) => ({
      section,
      fields: sortedFields.filter((f) => f.section === section),
    }))

    console.log(`[v0] Extracted ${sortedFields.length} fields from ${sections.length} sections`)

    return NextResponse.json({
      success: true,
      formFields: sortedFields,
      sections: groupedFields,
      document: {
        id: doc.document_id,
        pageCount: doc.metadata.page_count,
        detectedType: doc.metadata.detected_type,
      },
      metadata: {
        totalFields: sortedFields.length,
        requiredFields: sortedFields.filter((f) => f.required).length,
        sections: sections.length,
        nativeFields: doc.form_fields.length,
        detectedFields: doc.layout.form_regions.reduce((sum, r) => sum + r.detected_fields.length, 0),
      },
    })
  } catch (error: any) {
    console.error("[v0] Error extracting form fields:", error)
    return NextResponse.json({ error: "Failed to extract form fields", details: error.message }, { status: 500 })
  }
}

function mapFieldType(inputType: string, dataType: string): string {
  if (inputType === "checkbox") return "checkbox"
  if (inputType === "radio") return "radio"
  if (inputType === "signature") return "file"
  if (inputType === "date") return "date"

  if (dataType === "email") return "email"
  if (dataType === "phone") return "tel"
  if (dataType === "number" || dataType === "currency") return "number"
  if (dataType === "date") return "date"

  if (inputType === "text_box") return "textarea"

  return "text"
}

function mapNativeFieldType(fieldType: string): string {
  switch (fieldType) {
    case "textarea":
      return "textarea"
    case "checkbox":
      return "checkbox"
    case "radio":
      return "radio"
    case "select":
      return "select"
    case "date":
      return "date"
    case "signature":
      return "file"
    default:
      return "text"
  }
}

function formatFieldName(name: string): string {
  return name
    .replace(/_/g, " ")
    .replace(/([A-Z])/g, " $1")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ")
    .trim()
}

function generatePlaceholder(label: string, dataType: string): string {
  if (dataType === "date") return "YYYY-MM-DD"
  if (dataType === "email") return "example@company.com"
  if (dataType === "phone") return "+27 00 000 0000"
  if (dataType === "currency") return "R 0.00"
  if (dataType === "number") return "0"

  const lowerLabel = label.toLowerCase()
  if (lowerLabel.includes("name")) return "Enter full name"
  if (lowerLabel.includes("address")) return "Enter complete address"
  if (lowerLabel.includes("id") || lowerLabel.includes("number")) return "Enter ID/reference number"

  return `Enter ${label.toLowerCase()}`
}

function inferSection(label: string): string {
  const lower = label.toLowerCase()

  if (lower.includes("company") || lower.includes("business") || lower.includes("organization")) {
    return "Company Information"
  }
  if (lower.includes("contact") || lower.includes("email") || lower.includes("phone") || lower.includes("address")) {
    return "Contact Details"
  }
  if (lower.includes("price") || lower.includes("cost") || lower.includes("value") || lower.includes("amount")) {
    return "Pricing Information"
  }
  if (lower.includes("experience") || lower.includes("qualification") || lower.includes("reference")) {
    return "Experience & Qualifications"
  }
  if (lower.includes("compliance") || lower.includes("certificate") || lower.includes("registration")) {
    return "Compliance & Certifications"
  }
  if (lower.includes("technical") || lower.includes("specification")) {
    return "Technical Requirements"
  }

  return "General Information"
}

function buildValidation(dataType: string): any {
  const validation: any = {}

  if (dataType === "email") {
    validation.pattern = "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$"
  }
  if (dataType === "phone") {
    validation.pattern = "^[+]?[(]?[0-9]{1,4}[)]?[-\\s\\.]?[(]?[0-9]{1,4}[)]?[-\\s\\.]?[0-9]{1,9}$"
  }
  if (dataType === "number" || dataType === "currency") {
    validation.min = 0
  }

  return Object.keys(validation).length > 0 ? validation : undefined
}

function buildValidationFromNative(field: FormField): any {
  const validation: any = {}

  if (field.max_length) {
    validation.maxLength = field.max_length
  }
  if (field.format) {
    validation.pattern = field.format
  }

  return Object.keys(validation).length > 0 ? validation : undefined
}

function removeDuplicateFields(fields: any[]): any[] {
  const seen = new Map<string, any>()

  fields.forEach((field) => {
    const key = field.label.toLowerCase().replace(/\s+/g, "")
    if (!seen.has(key) || field.required) {
      seen.set(key, field)
    }
  })

  return Array.from(seen.values())
}

function sortFieldsByPosition(fields: any[]): any[] {
  return fields.sort((a, b) => {
    if (a.position.page !== b.position.page) {
      return a.position.page - b.position.page
    }
    if (Math.abs(a.position.y - b.position.y) > 20) {
      return a.position.y - b.position.y
    }
    return a.position.x - b.position.x
  })
}
