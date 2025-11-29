// ============================================
// DOCUMIND ENGINE - TYPE DEFINITIONS
// Version 1.0.0
// ============================================

// ============================================
// INPUT TYPES
// ============================================

export interface ParseRequest {
  // One of these is required
  file?: File | Buffer
  url?: string
  base64?: string

  // Options
  options?: ParseOptions

  // Caller identification
  app_id: string
  request_id?: string
  webhook_url?: string
}

export interface ParseOptions {
  ocr_enabled?: boolean // Default: true
  ocr_language?: string // Default: 'en'
  extract_tables?: boolean // Default: true
  extract_forms?: boolean // Default: true
  extract_images?: boolean // Default: false
  max_pages?: number // Default: unlimited
  password?: string // For encrypted PDFs
  priority?: "low" | "normal" | "high" // Queue priority
}

export interface FileMetadata {
  file_id: string
  original_name: string
  mime_type: string
  size_bytes: number
  storage_url: string
  uploaded_at: string
}

// ============================================
// OUTPUT TYPES
// ============================================

export interface ParsedDocument {
  document_id: string
  status: DocumentStatus
  metadata: DocumentMetadata
  fingerprints: DocumentFingerprints
  pages: ParsedPage[]
  layout: DocumentLayout
  form_fields: FormField[]
  processing: ProcessingInfo
}

export type DocumentStatus = "pending" | "processing" | "complete" | "partial" | "failed"

export interface DocumentMetadata {
  title: string | null
  author: string | null
  subject: string | null
  creator: string | null
  producer: string | null
  creation_date: string | null
  modification_date: string | null
  page_count: number
  pdf_version: string | null
  is_encrypted: boolean
  is_scanned: boolean
  detected_language: string
  detected_type: DocumentType
}

export type DocumentType =
  | "form"
  | "contract"
  | "tender"
  | "boq"
  | "specification"
  | "letter"
  | "report"
  | "invoice"
  | "certificate"
  | "unknown"

export interface DocumentFingerprints {
  structure_hash: string
  layout_hash: string
  form_hash: string | null
  table_hash: string | null
  content_hash: string
}

export interface ProcessingInfo {
  duration_ms: number
  ocr_used: boolean
  ocr_engine: string | null
  ocr_confidence: number | null
  warnings: string[]
  pages_processed: number
  pages_skipped: number
}

// ============================================
// PAGE TYPES
// ============================================

export interface ParsedPage {
  page_number: number
  width: number
  height: number
  rotation: number
  content: PageContent
  is_scanned: boolean
  ocr_confidence: number | null
}

export interface PageContent {
  full_text: string
  text_blocks: TextBlock[]
  lines: LineElement[]
  rectangles: RectElement[]
  images: ImageElement[]
}

export interface TextBlock {
  id: string
  text: string
  position: BoundingBox
  position_normalized: NormalizedBox
  font: FontInfo
  block_type: TextBlockType
  line_index: number
  paragraph_index: number
  confidence: number | null
  words: WordInfo[] | null
}

export type TextBlockType =
  | "heading_1"
  | "heading_2"
  | "heading_3"
  | "paragraph"
  | "label"
  | "value"
  | "table_header"
  | "table_cell"
  | "list_item"
  | "footer"
  | "header"
  | "page_number"
  | "unknown"

export interface BoundingBox {
  x: number
  y: number
  width: number
  height: number
}

export interface NormalizedBox {
  x: number // 0-1 (left to right)
  y: number // 0-1 (top to bottom)
  width: number // 0-1
  height: number // 0-1
}

export interface FontInfo {
  name: string
  family: string | null
  size: number
  weight: "normal" | "bold"
  style: "normal" | "italic"
  color: string
}

export interface WordInfo {
  text: string
  position: BoundingBox
  confidence: number
}

export interface LineElement {
  id: string
  type: "horizontal" | "vertical" | "diagonal"
  start: { x: number; y: number }
  end: { x: number; y: number }
  thickness: number
  color: string
  style: "solid" | "dashed" | "dotted"
  is_form_line: boolean
  associated_label_id: string | null
}

export interface RectElement {
  id: string
  position: BoundingBox
  fill_color: string | null
  stroke_color: string | null
  stroke_width: number
  rect_type: RectType
}

export type RectType = "checkbox" | "text_box" | "table_cell" | "border" | "highlight" | "unknown"

export interface ImageElement {
  id: string
  position: BoundingBox
  position_normalized: NormalizedBox
  width_px: number
  height_px: number
  format: string
  data_url?: string
}

// ============================================
// LAYOUT TYPES
// ============================================

export interface DocumentLayout {
  document_type: DocumentType
  title: TextBlock | null
  sections: DocumentSection[]
  table_regions: TableRegion[]
  form_regions: FormRegion[]
  reading_order: string[]
}

export interface DocumentSection {
  id: string
  title: string
  level: number
  page_start: number
  page_end: number
  block_ids: string[]
  subsections: DocumentSection[]
}

export interface TableRegion {
  id: string
  page: number
  position: BoundingBox
  position_normalized: NormalizedBox
  row_count_estimate: number
  column_count_estimate: number
  has_header: boolean
  extraction_status: "pending" | "complete"
  table_data: any | null
}

export interface FormRegion {
  id: string
  page: number
  position: BoundingBox
  position_normalized: NormalizedBox
  detected_fields: DetectedField[]
}

export interface DetectedField {
  id: string
  label: {
    text: string
    block_id: string
    position: BoundingBox
    position_normalized: NormalizedBox
  }
  input: {
    type: InputType
    position: BoundingBox
    position_normalized: NormalizedBox
    native_field_id: string | null
  }
  detection_method: DetectionMethod
  confidence: number
  suggested_type: FieldDataType
}

export type InputType = "text_line" | "text_box" | "checkbox" | "radio" | "signature" | "date" | "native_field"

export type DetectionMethod =
  | "pdf_native"
  | "line_detection"
  | "box_detection"
  | "pattern_matching"
  | "ai_vision"
  | "template_match"

export type FieldDataType =
  | "text"
  | "number"
  | "currency"
  | "date"
  | "email"
  | "phone"
  | "checkbox"
  | "signature"
  | "address"
  | "name"
  | "company"
  | "id_number"
  | "unknown"

// ============================================
// FORM FIELD TYPES (Native PDF Fields)
// ============================================

export interface FormField {
  id: string
  name: string
  type: FormFieldType
  page: number
  position: BoundingBox
  position_normalized: NormalizedBox
  value: string | boolean | string[] | null
  default_value: string | boolean | string[] | null
  is_required: boolean
  is_readonly: boolean
  max_length: number | null
  options: FormFieldOption[]
  font: FontInfo | null
  text_alignment: "left" | "center" | "right"
  format: string | null
}

export type FormFieldType = "text" | "textarea" | "checkbox" | "radio" | "select" | "signature" | "date" | "button"

export interface FormFieldOption {
  value: string
  label: string
  is_default: boolean
}

// ============================================
// TEMPLATE TYPES
// ============================================

export interface DocumentTemplate {
  id: string
  name: string
  code: string | null
  category: string
  subcategory: string | null
  fingerprint_structure: string
  fingerprint_layout: string | null
  match_threshold: number
  field_mappings: TemplateFieldMapping[]
  page_count: number | null
  description: string | null
  version: string | null
  usage_count: number
  accuracy_score: number | null
  is_system: boolean
  is_public: boolean
  created_at: string
  updated_at: string
}

export interface TemplateFieldMapping {
  field_id: string
  field_name: string
  label_pattern: string
  page: number
  position_normalized: NormalizedBox
  data_type: FieldDataType
  is_required: boolean
  validation_regex?: string
  profile_mapping?: string // Maps to company profile field
}

export interface TemplateMatch {
  template_id: string
  template_name: string
  template_code: string | null
  match_score: number
  matched_fields: number
  total_fields: number
  field_matches: TemplateFieldMatch[]
}

export interface TemplateFieldMatch {
  template_field_id: string
  template_field_name: string
  detected_field_id: string | null
  match_confidence: number
}

// ============================================
// JOB/QUEUE TYPES
// ============================================

export interface ProcessingJob {
  id: string
  document_id: string | null
  file_url: string
  options: ParseOptions
  app_id: string
  request_id: string | null
  webhook_url: string | null
  priority: "low" | "normal" | "high"
  status: JobStatus
  current_stage: ProcessingStage | null
  progress_percent: number
  progress_message: string | null
  attempt: number
  max_attempts: number
  last_error: string | null
  created_at: string
  started_at: string | null
  completed_at: string | null
}

export type JobStatus = "queued" | "processing" | "complete" | "failed" | "cancelled"

export type ProcessingStage =
  | "uploading"
  | "validating"
  | "parsing"
  | "ocr"
  | "analyzing_layout"
  | "detecting_fields"
  | "fingerprinting"
  | "matching_templates"
  | "finalizing"

// ============================================
// ERROR TYPES
// ============================================

export interface DocuMindError {
  code: ErrorCode
  message: string
  details?: Record<string, any>
  recoverable: boolean
}

export type ErrorCode =
  // File errors
  | "FILE_TOO_LARGE"
  | "UNSUPPORTED_FORMAT"
  | "CORRUPTED_FILE"
  | "PASSWORD_PROTECTED"
  | "INVALID_PASSWORD"
  // Processing errors
  | "PARSE_FAILED"
  | "OCR_FAILED"
  | "TIMEOUT"
  | "OUT_OF_MEMORY"
  // Service errors
  | "SERVICE_UNAVAILABLE"
  | "RATE_LIMITED"
  | "QUOTA_EXCEEDED"
  // Validation errors
  | "INVALID_REQUEST"
  | "MISSING_REQUIRED_FIELD"
  | "INVALID_OPTIONS"
  // Not found errors
  | "DOCUMENT_NOT_FOUND"
  | "TEMPLATE_NOT_FOUND"
  | "JOB_NOT_FOUND"

// ============================================
// API RESPONSE TYPES
// ============================================

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: DocuMindError
  meta?: {
    request_id: string
    processing_time_ms: number
  }
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  limit: number
  offset: number
  has_more: boolean
}

// ============================================
// INTEGRATION CONTRACTS (for other engines)
// ============================================

// What DocuMind provides to FormFlow
export interface FormFlowContract {
  document_id: string
  pages: Array<{
    page_number: number
    width: number
    height: number
  }>
  detected_fields: DetectedField[]
  form_fields: FormField[]
  template_match: TemplateMatch | null
}

// What DocuMind provides to TableSense
export interface TableSenseContract {
  document_id: string
  table_regions: TableRegion[]
  page_dimensions: Array<{
    page_number: number
    width: number
    height: number
  }>
}

// What DocuMind provides to ThinkEngine
export interface ThinkEngineContract {
  document_id: string
  full_text: string
  sections: DocumentSection[]
  metadata: DocumentMetadata
  detected_type: DocumentType
}
