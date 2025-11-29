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
export async function findMatchingTemplates(structureHash: string, threshold = 0.8): Promise<TemplateMatch[]> {
  const supabase = await createClient()

  // First try exact match
  const { data: exactMatch } = await supabase
    .from("documind_templates")
    .select("*")
    .eq("fingerprint_structure", structureHash)

  if (exactMatch && exactMatch.length > 0) {
    return exactMatch.map((t) => ({
      template_id: t.id,
      template_name: t.name,
      template_code: t.code,
      match_score: 1.0,
      matched_fields: t.field_mappings?.length || 0,
      total_fields: t.field_mappings?.length || 0,
      field_matches: [],
    }))
  }

  // If no exact match, we'd need a more sophisticated matching algorithm
  // For now, return empty array
  return []
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
