// ============================================
// DOCUMIND ENGINE - DATABASE SERVICE
// Handles all database operations
// ============================================

import { createClient } from "@/lib/supabase/server"
import type { ParsedDocument, DocumentTemplate, TemplateMatch, DocuMindError } from "../types"
import { Errors } from "../errors"

/**
 * Save a parsed document to database
 */
export async function saveDocument(
  document: ParsedDocument,
  storageUrl: string,
  appId = "bidmate-ai",
): Promise<{ success: boolean; error?: DocuMindError }> {
  const supabase = await createClient()

  try {
    // Insert main document record
    const { data: docData, error: docError } = await supabase
      .from("documind_documents")
      .insert({
        id: document.document_id,
        app_id: appId,
        original_filename: document.metadata.title || "unknown",
        mime_type: "application/pdf",
        file_size: 0, // Would need to be passed in
        storage_url: storageUrl,
        content_hash: document.fingerprints.content_hash,
        fingerprint_structure: document.fingerprints.structure_hash,
        fingerprint_layout: document.fingerprints.layout_hash,
        fingerprint_form: document.fingerprints.form_hash,
        fingerprint_table: document.fingerprints.table_hash,
        metadata: document.metadata,
        page_count: document.metadata.page_count,
        is_scanned: document.metadata.is_scanned,
        detected_type: document.metadata.detected_type,
        status: document.status,
        processing_duration_ms: document.processing.duration_ms,
        ocr_used: document.processing.ocr_used,
        ocr_engine: document.processing.ocr_engine,
        ocr_confidence: document.processing.ocr_confidence,
        parsed_content: document,
        layout: document.layout,
      })
      .select()
      .single()

    if (docError) {
      console.error("Error saving document:", docError)
      return {
        success: false,
        error: Errors.parseFailed("database", docError.message),
      }
    }

    // Insert pages
    const pageInserts = document.pages.map((page) => ({
      document_id: document.document_id,
      page_number: page.page_number,
      width: page.width,
      height: page.height,
      rotation: page.rotation,
      full_text: page.content.full_text,
      text_blocks: page.content.text_blocks,
      lines: page.content.lines,
      rectangles: page.content.rectangles,
      images: page.content.images,
      is_scanned: page.is_scanned,
      ocr_confidence: page.ocr_confidence,
    }))

    if (pageInserts.length > 0) {
      const { error: pagesError } = await supabase.from("documind_pages").insert(pageInserts)

      if (pagesError) {
        console.error("Error saving pages:", pagesError)
        // Don't fail - document is saved
      }
    }

    // Insert detected fields
    const allFields: any[] = []
    document.layout.form_regions.forEach((region) => {
      region.detected_fields.forEach((field) => {
        allFields.push({
          document_id: document.document_id,
          page_number: region.page,
          field_name: field.id,
          label_text: field.label.text,
          field_type: field.suggested_type,
          input_type: field.input.type,
          suggested_data_type: field.suggested_type,
          position_x: field.input.position.x,
          position_y: field.input.position.y,
          position_width: field.input.position.width,
          position_height: field.input.position.height,
          position_norm_x: field.input.position_normalized.x,
          position_norm_y: field.input.position_normalized.y,
          position_norm_width: field.input.position_normalized.width,
          position_norm_height: field.input.position_normalized.height,
          label_position: field.label,
          detection_method: field.detection_method,
          confidence: field.confidence,
          is_native_field: field.input.native_field_id !== null,
          native_field_name: field.input.native_field_id,
        })
      })
    })

    // Also add native form fields
    document.form_fields.forEach((field) => {
      allFields.push({
        document_id: document.document_id,
        page_number: field.page,
        field_name: field.name,
        label_text: field.name,
        field_type: field.type,
        input_type: "native_field",
        suggested_data_type: field.type,
        position_x: field.position.x,
        position_y: field.position.y,
        position_width: field.position.width,
        position_height: field.position.height,
        position_norm_x: field.position_normalized.x,
        position_norm_y: field.position_normalized.y,
        position_norm_width: field.position_normalized.width,
        position_norm_height: field.position_normalized.height,
        font_name: field.font?.name,
        font_size: field.font?.size,
        detection_method: "pdf_native",
        confidence: 1.0,
        is_native_field: true,
        native_field_name: field.name,
        native_field_value: field.value?.toString(),
      })
    })

    if (allFields.length > 0) {
      const { error: fieldsError } = await supabase.from("documind_fields").insert(allFields)

      if (fieldsError) {
        console.error("Error saving fields:", fieldsError)
        // Don't fail - document is saved
      }
    }

    return { success: true }
  } catch (error) {
    console.error("Database error:", error)
    return {
      success: false,
      error: Errors.parseFailed("database", error instanceof Error ? error.message : "Unknown error"),
    }
  }
}

/**
 * Get document from database
 */
export async function getDocument(documentId: string): Promise<ParsedDocument | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("documind_documents")
    .select("parsed_content")
    .eq("id", documentId)
    .single()

  if (error || !data) {
    return null
  }

  return data.parsed_content as ParsedDocument
}

/**
 * Delete document from database
 */
export async function deleteDocument(documentId: string): Promise<{ success: boolean; error?: DocuMindError }> {
  const supabase = await createClient()

  const { error } = await supabase.from("documind_documents").delete().eq("id", documentId)

  if (error) {
    return {
      success: false,
      error: Errors.parseFailed("database", error.message),
    }
  }

  return { success: true }
}

/**
 * Get templates from database
 */
export async function getTemplates(
  category?: string,
  limit = 20,
  offset = 0,
): Promise<{
  templates: DocumentTemplate[]
  total: number
}> {
  const supabase = await createClient()

  let query = supabase.from("documind_templates").select("*", { count: "exact" })

  if (category) {
    query = query.eq("category", category)
  }

  const { data, error, count } = await query
    .order("usage_count", { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) {
    console.error("Error fetching templates:", error)
    return { templates: [], total: 0 }
  }

  return {
    templates: (data || []) as DocumentTemplate[],
    total: count || 0,
  }
}

/**
 * Get template by ID
 */
export async function getTemplate(templateId: string): Promise<DocumentTemplate | null> {
  const supabase = await createClient()

  const { data, error } = await supabase.from("documind_templates").select("*").eq("id", templateId).single()

  if (error || !data) {
    return null
  }

  return data as DocumentTemplate
}

/**
 * Find templates matching a fingerprint
 */
export async function findMatchingTemplates(
  structureHash: string,
  threshold = 0.5,
  documentText?: string,
): Promise<TemplateMatch[]> {
  const supabase = await createClient()

  // Get all templates
  const { data: templates } = await supabase
    .from("documind_templates")
    .select("*")
    .order("usage_count", { ascending: false })

  if (!templates || templates.length === 0) {
    return []
  }

  const matches: TemplateMatch[] = []

  for (const template of templates) {
    let matchScore = 0
    let matchedFields = 0
    const fieldMappings =
      (template.field_mappings as Array<{
        field_id: string
        field_name: string
        label_pattern: string
        is_required: boolean
      }>) || []

    // 1. Check for exact fingerprint match (highest priority)
    if (template.fingerprint_structure === structureHash) {
      matchScore = 1.0
      matchedFields = fieldMappings.length
    }
    // 2. If document text provided, use content-based matching
    else if (documentText) {
      const upperText = documentText.toUpperCase()

      // Check for template identifiers in text
      const templateIdentifiers: Record<string, string[]> = {
        SBD1: ["SBD 1", "SBD1", "INVITATION TO BID", "PART A: INVITATION TO BID"],
        SBD2: ["SBD 2", "SBD2", "TAX CLEARANCE", "TAX COMPLIANCE"],
        "SBD3.1": ["SBD 3.1", "SBD3.1", "PRICING SCHEDULE", "FIRM PRICES"],
        "SBD3.2": ["SBD 3.2", "SBD3.2", "PRICING SCHEDULE", "NON-FIRM PRICES"],
        "SBD3.3": ["SBD 3.3", "SBD3.3", "PRICING SCHEDULE", "PROFESSIONAL SERVICES"],
        SBD4: ["SBD 4", "SBD4", "DECLARATION OF INTEREST"],
        SBD5: ["SBD 5", "SBD5", "NATIONAL INDUSTRIAL PARTICIPATION"],
        "SBD6.1": ["SBD 6.1", "SBD6.1", "PREFERENCE POINTS CLAIM", "B-BBEE STATUS"],
        "SBD6.2": ["SBD 6.2", "SBD6.2", "LOCAL PRODUCTION AND CONTENT"],
        "SBD7.1": ["SBD 7.1", "SBD7.1", "CONTRACT FORM", "PURCHASE OF GOODS"],
        "SBD7.2": ["SBD 7.2", "SBD7.2", "CONTRACT FORM", "RENDERING OF SERVICES"],
        SBD8: ["SBD 8", "SBD8", "DECLARATION OF PAST", "SCM PRACTICES"],
        SBD9: ["SBD 9", "SBD9", "CERTIFICATE OF INDEPENDENT BID", "INDEPENDENT BID DETERMINATION"],
        MBD1: ["MBD 1", "MBD1", "MUNICIPAL BID", "INVITATION TO BID"],
        MBD4: ["MBD 4", "MBD4", "MUNICIPAL DECLARATION", "DECLARATION OF INTEREST"],
        MBD5: ["MBD 5", "MBD5", "NATIONAL INDUSTRIAL"],
        "MBD6.1": ["MBD 6.1", "MBD6.1", "PREFERENCE POINTS"],
        MBD8: ["MBD 8", "MBD8", "DECLARATION OF PAST"],
        MBD9: ["MBD 9", "MBD9", "CERTIFICATE OF INDEPENDENT"],
        CSD: ["CSD", "CENTRAL SUPPLIER DATABASE", "MAAA", "SUPPLIER NUMBER"],
        BOQ: ["BILL OF QUANTITIES", "BOQ", "SCHEDULE OF QUANTITIES"],
        GCC: ["GENERAL CONDITIONS OF CONTRACT", "GCC"],
        CIDB: ["CIDB", "CONSTRUCTION INDUSTRY"],
        NEC: ["NEC CONTRACT", "NEW ENGINEERING CONTRACT"],
        JBCC: ["JBCC", "JOINT BUILDING CONTRACTS"],
        FIDIC: ["FIDIC"],
      }

      // Check if template code matches identifiers in text
      const templateCode = template.code?.toUpperCase() || ""
      const identifiers = templateIdentifiers[templateCode] || []

      let identifierMatches = 0
      for (const identifier of identifiers) {
        if (upperText.includes(identifier)) {
          identifierMatches++
        }
      }

      // If any identifier found, boost score significantly
      if (identifierMatches > 0) {
        matchScore += 0.4 * Math.min(identifierMatches / 2, 1)
      }

      // Check field label patterns
      for (const field of fieldMappings) {
        if (field.label_pattern) {
          try {
            const regex = new RegExp(field.label_pattern, "i")
            if (regex.test(documentText)) {
              matchedFields++
            }
          } catch {
            // Invalid regex, skip
            if (upperText.includes(field.label_pattern.toUpperCase())) {
              matchedFields++
            }
          }
        }
      }

      // Calculate score based on matched fields
      if (fieldMappings.length > 0) {
        const fieldMatchRatio = matchedFields / fieldMappings.length
        matchScore += 0.6 * fieldMatchRatio
      }
    }

    // Only include if above threshold
    if (matchScore >= threshold) {
      matches.push({
        template_id: template.id,
        template_name: template.name,
        template_code: template.code,
        match_score: Math.min(matchScore, 1.0),
        matched_fields: matchedFields,
        total_fields: fieldMappings.length,
        field_matches: [],
      })
    }
  }

  // Sort by score descending
  return matches.sort((a, b) => b.match_score - a.match_score)
}

/**
 * Save template match
 */
export async function saveTemplateMatch(
  documentId: string,
  templateId: string,
  matchScore: number,
  matchedFields: number,
  totalFields: number,
): Promise<void> {
  const supabase = await createClient()

  await supabase.from("documind_template_matches").upsert({
    document_id: documentId,
    template_id: templateId,
    match_score: matchScore,
    matched_fields: matchedFields,
    total_fields: totalFields,
  })
}

/**
 * Increment template usage count
 */
export async function incrementTemplateUsage(templateId: string): Promise<void> {
  const supabase = await createClient()

  await supabase.rpc("increment_template_usage", { template_id: templateId })
}

/**
 * Log error to database
 */
export async function logError(
  error: DocuMindError,
  context: {
    document_id?: string
    job_id?: string
    app_id: string
    request_id?: string
    processing_stage?: string
    file_info?: Record<string, any>
  },
): Promise<void> {
  const supabase = await createClient()

  await supabase.from("documind_error_logs").insert({
    document_id: context.document_id,
    job_id: context.job_id,
    app_id: context.app_id,
    request_id: context.request_id,
    error_code: error.code,
    error_message: error.message,
    processing_stage: context.processing_stage,
    file_info: context.file_info,
  })
}
