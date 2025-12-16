# DocuMind Engine - Technical Specification

## 1. Overview

| Attribute | Value |
|-----------|-------|
| Name | DocuMind |
| Type | Core Processing Engine |
| Purpose | Parse, extract, and understand document structure and content |
| Consumers | FormFlow, TableSense, ThinkEngine, DataHarvest |
| Status | 30% Complete |

---

## 2. Position in Architecture

DocuMind is the foundation engine. All document-based operations start here.

```
Documents ──▶ DocuMind ──▶ FormFlow (fields)
                      ──▶ TableSense (tables)
                      ──▶ ThinkEngine (analysis)
```

---

## 3. Core Capabilities

| Capability | Priority | Description |
|------------|----------|-------------|
| PDF Parsing | Critical | Extract text, structure, metadata, fonts, positions |
| Layout Analysis | Critical | Understand headers, sections, paragraphs, tables |
| Position Mapping | Critical | Track exact x/y coordinates of all elements |
| OCR Processing | High | Convert scanned/image documents to text |
| Document Fingerprinting | High | Create unique hash to identify document types |
| Multi-format Support | Medium | Handle PDF, Word, images, scanned documents |
| Metadata Extraction | Low | Author, creation date, modification date |

---

## 4. Supported Formats

| Format | Extensions | Support Level | Max Size |
|--------|------------|---------------|----------|
| PDF (native) | .pdf | Full | 50MB |
| PDF (scanned) | .pdf | OCR + parsing | 50MB |
| Word | .docx, .doc | Full | 25MB |
| Images | .png, .jpg, .tiff | OCR only | 10MB |
| Excel | .xlsx, .xls | Table extraction | 25MB |
| Text | .txt, .rtf | Basic | 5MB |

---

## 5. Technology Stack

| Component | Technology | Reason |
|-----------|------------|--------|
| Runtime | Node.js | Consistency with app |
| PDF Parsing | pdfjs-dist | Full parsing with positions |
| PDF Modification | pdf-lib | Form filling |
| OCR Primary | Google Vision API | Best accuracy |
| OCR Fallback | Tesseract.js | Free, offline |
| Word Parsing | mammoth.js | .docx support |
| Image Processing | sharp | Optimize for OCR |
| Database | PostgreSQL (Supabase) | Existing infrastructure |
| Cache | Upstash Redis | Fast caching |
| Storage | Vercel Blob | File storage |
| Queue | Upstash QStash | Async processing |

---

## 6. Processing Pipeline

```
INPUT
  │
  ▼
Format Detection ──▶ Is PDF? ──▶ Is Scanned? ──▶ YES ──▶ OCR Engine
  │                    │              │                      │
  │                    │              NO                     │
  │                    │              │                      │
  │                    │              ▼                      │
  │                    │         PDF Parser ◀────────────────┘
  │                    │              │
  │                    NO             │
  │                    │              │
  │                    ▼              │
  │               Word/Image         │
  │               Parser             │
  │                    │              │
  │                    └──────┬───────┘
  │                           │
  │                           ▼
  │                    Layout Analyzer
  │                           │
  │                           ▼
  │                    Position Mapper
  │                           │
  │                           ▼
  │                    Fingerprinter
  │                           │
  │                           ▼
  └──────────────────▶ OUTPUT (JSON)
```

---

## 7. Data Type Definitions

### 7.1 Input Types

```typescript
// Main parse request
interface ParseRequest {
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

interface ParseOptions {
  ocr_enabled?: boolean          // Default: true
  ocr_language?: string          // Default: 'en'
  extract_tables?: boolean       // Default: true
  extract_forms?: boolean        // Default: true
  extract_images?: boolean       // Default: false
  max_pages?: number             // Default: unlimited
  password?: string              // For encrypted PDFs
  priority?: 'low' | 'normal' | 'high'  // Queue priority
}

// File metadata after upload
interface FileMetadata {
  file_id: string
  original_name: string
  mime_type: string
  size_bytes: number
  storage_url: string
  uploaded_at: string
}
```

### 7.2 Output Types

```typescript
// Main parsed document response
interface ParsedDocument {
  document_id: string
  status: DocumentStatus
  
  // File info
  file: {
    original_name: string
    mime_type: string
    size_bytes: number
    storage_url: string
  }
  
  // Document metadata
  metadata: DocumentMetadata
  
  // Fingerprints for template matching
  fingerprints: DocumentFingerprints
  
  // Content
  pages: ParsedPage[]
  
  // Detected structure
  layout: DocumentLayout
  
  // Native form fields (if PDF has them)
  form_fields: FormField[]
  
  // Processing info
  processing: ProcessingInfo
  
  // Timestamps
  created_at: string
  parsed_at: string
}

type DocumentStatus = 
  | 'pending'      // In queue
  | 'processing'   // Being processed
  | 'complete'     // Successfully parsed
  | 'partial'      // Parsed with warnings
  | 'failed'       // Failed to parse

interface DocumentMetadata {
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

type DocumentType = 
  | 'form'
  | 'contract'
  | 'tender'
  | 'boq'
  | 'specification'
  | 'letter'
  | 'report'
  | 'invoice'
  | 'certificate'
  | 'unknown'

interface DocumentFingerprints {
  structure_hash: string    // Overall structure
  layout_hash: string       // Page layouts
  form_hash: string | null  // Form fields (if any)
  table_hash: string | null // Tables (if any)
  content_hash: string      // Content checksum
}

interface ProcessingInfo {
  duration_ms: number
  ocr_used: boolean
  ocr_engine: string | null
  ocr_confidence: number | null
  warnings: string[]
  pages_processed: number
  pages_skipped: number
}
```

### 7.3 Page Types

```typescript
interface ParsedPage {
  page_number: number
  
  // Dimensions in points (72 points = 1 inch)
  width: number
  height: number
  rotation: 0 | 90 | 180 | 270
  
  // Content elements
  text_blocks: TextBlock[]
  lines: LineElement[]
  rectangles: RectElement[]
  images: ImageElement[]
  
  // Full text (concatenated)
  full_text: string
  
  // OCR specific
  ocr_confidence: number | null
}

interface TextBlock {
  id: string
  text: string
  
  // Position (PDF coordinates - origin bottom-left)
  position: BoundingBox
  
  // Normalized position (0-1 scale - origin top-left)
  position_normalized: NormalizedBox
  
  // Typography
  font: FontInfo
  
  // Classification
  block_type: TextBlockType
  
  // Grouping
  line_index: number
  paragraph_index: number
  
  // OCR specific
  confidence: number | null
  words: WordInfo[] | null
}

type TextBlockType = 
  | 'heading_1'
  | 'heading_2'
  | 'heading_3'
  | 'paragraph'
  | 'label'
  | 'value'
  | 'table_header'
  | 'table_cell'
  | 'list_item'
  | 'footer'
  | 'header'
  | 'page_number'
  | 'unknown'

interface BoundingBox {
  x: number      // Left edge
  y: number      // Bottom edge (PDF) or Top edge (normalized)
  width: number
  height: number
}

interface NormalizedBox {
  x: number      // 0-1 (left to right)
  y: number      // 0-1 (top to bottom)
  width: number  // 0-1
  height: number // 0-1
}

interface FontInfo {
  name: string
  family: string | null
  size: number
  weight: 'normal' | 'bold'
  style: 'normal' | 'italic'
  color: string    // Hex color
}

interface WordInfo {
  text: string
  position: BoundingBox
  confidence: number
}

interface LineElement {
  id: string
  type: 'horizontal' | 'vertical' | 'diagonal'
  start: { x: number; y: number }
  end: { x: number; y: number }
  thickness: number
  color: string
  style: 'solid' | 'dashed' | 'dotted'
  
  // For field detection
  is_form_line: boolean
  associated_label_id: string | null
}

interface RectElement {
  id: string
  position: BoundingBox
  fill_color: string | null
  stroke_color: string | null
  stroke_width: number
  
  // Classification
  rect_type: RectType
}

type RectType = 
  | 'checkbox'
  | 'text_box'
  | 'table_cell'
  | 'border'
  | 'highlight'
  | 'unknown'

interface ImageElement {
  id: string
  position: BoundingBox
  width_px: number
  height_px: number
  format: string
  storage_url: string | null  // If extracted
}
```

### 7.4 Layout Types

```typescript
interface DocumentLayout {
  document_type: DocumentType
  confidence: number
  
  // Structure
  title: TextBlock | null
  sections: DocumentSection[]
  
  // Detected regions
  table_regions: TableRegion[]
  form_regions: FormRegion[]
  
  // Reading order
  reading_order: string[]  // Block IDs in order
}

interface DocumentSection {
  id: string
  title: string
  level: number  // 1 = main, 2 = sub, etc.
  page_start: number
  page_end: number
  block_ids: string[]
  subsections: DocumentSection[]
}

interface TableRegion {
  id: string
  page: number
  position: BoundingBox
  position_normalized: NormalizedBox
  
  // Structure hints
  row_count_estimate: number
  column_count_estimate: number
  has_header: boolean
  
  // For TableSense
  extraction_status: 'pending' | 'complete'
  table_data: any | null  // Populated by TableSense
}

interface FormRegion {
  id: string
  page: number
  position: BoundingBox
  position_normalized: NormalizedBox
  
  // Detected fields
  detected_fields: DetectedField[]
}

interface DetectedField {
  id: string
  
  // Label
  label: {
    text: string
    block_id: string
    position: BoundingBox
    position_normalized: NormalizedBox
  }
  
  // Input area
  input: {
    type: InputType
    position: BoundingBox
    position_normalized: NormalizedBox
    
    // For native fields
    native_field_id: string | null
  }
  
  // Detection quality
  detection_method: DetectionMethod
  confidence: number
  
  // Suggested data type
  suggested_type: FieldDataType
}

type InputType = 
  | 'text_line'      // Underline for text
  | 'text_box'       // Rectangle for text
  | 'checkbox'       // Checkbox
  | 'radio'          // Radio button
  | 'signature'      // Signature area
  | 'date'           // Date field
  | 'native_field'   // PDF native form field

type DetectionMethod = 
  | 'pdf_native'         // Existing PDF form field
  | 'line_detection'     // Detected from underlines
  | 'box_detection'      // Detected from rectangles
  | 'pattern_matching'   // Label: ___ pattern
  | 'ai_vision'          // AI-detected
  | 'template_match'     // From known template

type FieldDataType = 
  | 'text'
  | 'number'
  | 'currency'
  | 'date'
  | 'email'
  | 'phone'
  | 'checkbox'
  | 'signature'
  | 'address'
  | 'name'
  | 'company'
  | 'id_number'    // SA ID, registration, etc.
  | 'unknown'
```

### 7.5 Form Field Types (Native PDF)

```typescript
interface FormField {
  id: string
  name: string
  type: FormFieldType
  
  // Location
  page: number
  position: BoundingBox
  position_normalized: NormalizedBox
  
  // Current state
  value: string | boolean | string[] | null
  default_value: string | boolean | string[] | null
  
  // Constraints
  is_required: boolean
  is_readonly: boolean
  max_length: number | null
  
  // Options (for select/radio)
  options: FormFieldOption[]
  
  // Appearance
  font: FontInfo | null
  text_alignment: 'left' | 'center' | 'right'
  
  // Validation
  format: string | null  // Date format, number format, etc.
}

type FormFieldType = 
  | 'text'
  | 'textarea'
  | 'checkbox'
  | 'radio'
  | 'select'
  | 'signature'
  | 'date'
  | 'button'

interface FormFieldOption {
  value: string
  label: string
  is_default: boolean
}
```

### 7.6 Template Types

```typescript
interface DocumentTemplate {
  id: string
  
  // Identification
  name: string
  code: string | null        // e.g., 'SBD1', 'MBD4'
  category: string
  subcategory: string | null
  
  // Matching
  fingerprint_structure: string
  fingerprint_layout: string
  match_threshold: number    // Minimum score to match
  
  // Field definitions
  fields: TemplateField[]
  
  // Metadata
  description: string | null
  version: string | null
  source: string | null
  
  // Stats
  usage_count: number
  last_used_at: string | null
  accuracy_score: number | null
  
  // Timestamps
  created_at: string
  updated_at: string
}

interface TemplateField {
  id: string
  name: string
  label: string
  
  // Position on page
  page: number
  position_normalized: NormalizedBox
  
  // Field characteristics
  type: FieldDataType
  input_type: InputType
  
  // Auto-fill mapping
  profile_mapping: string | null  // e.g., 'company.name', 'contact.email'
  
  // Validation
  is_required: boolean
  validation_regex: string | null
  
  // Font for filling
  font: FontInfo
}

interface TemplateMatch {
  template_id: string
  template_name: string
  template_code: string | null
  score: number
  matched_fields: number
  total_fields: number
}
```

---

## 8. Error Handling

### 8.1 Error Response Format

```typescript
interface ErrorResponse {
  error: {
    code: ErrorCode
    message: string
    details: Record<string, any> | null
    request_id: string
    timestamp: string
  }
  
  // Partial result if available
  partial_result: Partial<ParsedDocument> | null
}

type ErrorCode = 
  // Input errors (4xx)
  | 'INVALID_FILE'
  | 'UNSUPPORTED_FORMAT'
  | 'FILE_TOO_LARGE'
  | 'FILE_EMPTY'
  | 'FILE_CORRUPTED'
  | 'PASSWORD_REQUIRED'
  | 'PASSWORD_INCORRECT'
  | 'URL_UNREACHABLE'
  | 'INVALID_OPTIONS'
  | 'RATE_LIMIT_EXCEEDED'
  | 'QUOTA_EXCEEDED'
  
  // Processing errors (5xx)
  | 'PARSE_FAILED'
  | 'OCR_FAILED'
  | 'LAYOUT_ANALYSIS_FAILED'
  | 'TIMEOUT'
  | 'INTERNAL_ERROR'
  | 'SERVICE_UNAVAILABLE'
  | 'DEPENDENCY_ERROR'
```

### 8.2 Error Handling Strategy

| Error Type | Strategy | Retry | User Message |
|------------|----------|-------|--------------|
| INVALID_FILE | Reject immediately | No | "The uploaded file is invalid" |
| UNSUPPORTED_FORMAT | Reject immediately | No | "File format not supported" |
| FILE_TOO_LARGE | Reject immediately | No | "File exceeds maximum size of X MB" |
| FILE_CORRUPTED | Reject immediately | No | "File appears to be corrupted" |
| PASSWORD_REQUIRED | Request password | No | "This PDF is password protected" |
| OCR_FAILED | Fallback to Tesseract | Yes (1x) | "Processing scanned document..." |
| TIMEOUT | Retry with lower priority | Yes (2x) | "Processing taking longer than expected" |
| INTERNAL_ERROR | Log and alert | Yes (1x) | "Temporary error, please retry" |

### 8.3 Error Logging

```typescript
interface ErrorLog {
  error_id: string
  request_id: string
  app_id: string
  
  // Error details
  error_code: ErrorCode
  error_message: string
  stack_trace: string | null
  
  // Context
  file_name: string | null
  file_size: number | null
  file_type: string | null
  
  // Processing state
  processing_stage: string
  duration_ms: number
  
  // Timestamp
  occurred_at: string
}
```

---

## 9. Edge Cases

### 9.1 Edge Case Handling Matrix

| Edge Case | Detection | Handling | Fallback |
|-----------|-----------|----------|----------|
| Password-protected PDF | pdf-lib check | Request password via API | Reject if not provided |
| Scanned PDF (no text layer) | Check text extraction result | Auto-trigger OCR | Return OCR result |
| Mixed PDF (some scanned pages) | Per-page text check | OCR only scanned pages | Combine results |
| Very large PDF (100+ pages) | Page count check | Process in batches | Return partial with warning |
| Rotated pages | Rotation metadata | Normalize coordinates | Apply rotation transform |
| Multi-column layout | Layout analysis | Detect and order correctly | Single-column fallback |
| Forms within tables | Nested structure detection | Handle hierarchically | Flatten if needed |
| Handwritten text | OCR confidence check | Flag low confidence | Return partial result |
| Non-English text | Language detection | Use appropriate OCR model | Default to English |
| Corrupted PDF | Exception catch | Return specific error | No fallback |
| Zero-byte file | Size check | Reject immediately | No fallback |
| Image-only PDF (no structure) | Structure analysis | OCR + basic layout | Return raw text |
| Fillable form with values | Form field extraction | Extract existing values | Return as populated |
| Digital signatures | Signature detection | Flag but don't extract | Note in metadata |
| Embedded files | Attachment detection | Ignore or extract separately | Document in response |
| Malicious PDF (JS, links) | Security scan | Strip active content | Log and alert |

### 9.2 Special Document Handling

**Multi-language Documents:**
```typescript
interface MultiLanguageResult {
  primary_language: string
  secondary_languages: string[]
  per_page_languages: {
    page: number
    language: string
    confidence: number
  }[]
}
```

**Document Packages (ZIP with multiple files):**
```typescript
interface DocumentPackage {
  package_id: string
  files: {
    file_name: string
    document_id: string
    status: DocumentStatus
  }[]
  combined_result: ParsedDocument | null
}
```

---

## 10. Integration Points

### 10.1 FormFlow Integration

**Purpose:** FormFlow consumes DocuMind output to generate fillable forms and fill documents.

**Data Flow:**
```
DocuMind ──▶ FormFlow

Provides:
├── detected_fields (from layout analysis)
├── form_fields (native PDF fields)
├── positions (for placing filled values)
└── font_info (for matching typography)
```

**Integration Contract:**
```typescript
// What FormFlow expects from DocuMind
interface FormFlowInput {
  document_id: string
  
  // All detected fields
  fields: Array<{
    id: string
    label: string
    position_normalized: NormalizedBox
    input_type: InputType
    page: number
    font: FontInfo
    is_native: boolean
    native_field_name?: string
  }>
  
  // Template match (if any)
  template_match: TemplateMatch | null
  
  // For filling
  page_dimensions: Array<{
    page: number
    width: number
    height: number
  }>
}
```

### 10.2 TableSense Integration

**Purpose:** TableSense extracts and structures data from tables detected by DocuMind.

**Data Flow:**
```
DocuMind ──▶ TableSense

Provides:
├── table_regions (locations of tables)
├── page_images (for visual table extraction)
└── surrounding_text (context for headers)
```

**Integration Contract:**
```typescript
// What TableSense expects from DocuMind
interface TableSenseInput {
  document_id: string
  
  tables: Array<{
    region_id: string
    page: number
    position: BoundingBox
    position_normalized: NormalizedBox
    
    // Hints from DocuMind
    row_count_estimate: number
    column_count_estimate: number
    has_header: boolean
    
    // Raw content in region
    text_blocks: TextBlock[]
    lines: LineElement[]
  }>
}
```

### 10.3 ThinkEngine Integration

**Purpose:** ThinkEngine performs AI analysis on document content.

**Data Flow:**
```
DocuMind ──▶ ThinkEngine

Provides:
├── full_text (for NLP analysis)
├── sections (structured content)
├── metadata (context)
└── document_type (processing hints)
```

**Integration Contract:**
```typescript
// What ThinkEngine expects from DocuMind
interface ThinkEngineInput {
  document_id: string
  document_type: DocumentType
  
  // Text content
  full_text: string
  sections: Array<{
    title: string
    content: string
    level: number
  }>
  
  // Structure
  has_tables: boolean
  has_forms: boolean
  page_count: number
  
  // Metadata
  metadata: DocumentMetadata
}
```

### 10.4 DataHarvest Integration

**Purpose:** DataHarvest stores tender documents; DocuMind parses them.

**Data Flow:**
```
DataHarvest ──▶ DocuMind ──▶ DataHarvest

DataHarvest provides:
├── document URLs
└── tender context

DocuMind returns:
├── parsed content
├── document type
└── fingerprints
```

**Integration Contract:**
```typescript
// Webhook callback to DataHarvest
interface DataHarvestCallback {
  tender_id: string
  document_id: string
  
  // Summary for indexing
  summary: {
    type: DocumentType
    page_count: number
    has_forms: boolean
    has_tables: boolean
    detected_language: string
  }
  
  // For search indexing
  full_text: string
  
  // Status
  status: DocumentStatus
  error_message?: string
}
```

---

## 11. Caching Strategy

### 11.1 Cache Layers

| Layer | Storage | TTL | Purpose |
|-------|---------|-----|---------|
| Request Cache | Memory | 5 min | Deduplicate in-flight requests |
| Result Cache | Redis | 24 hours | Cache parsed results |
| Template Cache | Redis | 7 days | Cache template definitions |
| File Cache | Blob | 30 days | Cache uploaded files |

### 11.2 Cache Keys

```typescript
// Result cache key
const resultCacheKey = (contentHash: string, options: ParseOptions) => 
  `documind:result:${contentHash}:${hashOptions(options)}`

// Template cache key
const templateCacheKey = (fingerprint: string) =>
  `documind:template:${fingerprint}`

// In-flight request key
const requestCacheKey = (contentHash: string) =>
  `documind:processing:${contentHash}`
```

### 11.3 Cache Invalidation Rules

| Event | Invalidation |
|-------|--------------|
| Template updated | Clear template cache for that fingerprint |
| Processing options changed | Version in cache key handles this |
| Document re-uploaded | Content hash changes, new cache entry |
| Manual purge | Admin API to clear specific document |
| Error during processing | Don't cache failed results |

### 11.4 Cache Hit Scenarios

```typescript
interface CacheResult {
  hit: boolean
  source: 'memory' | 'redis' | 'none'
  age_seconds: number | null
  document_id: string | null
}

// Decision flow
async function checkCache(contentHash: string, options: ParseOptions): Promise<CacheResult> {
  // 1. Check if already processing
  const processing = await checkProcessingLock(contentHash)
  if (processing) {
    return waitForProcessing(contentHash)
  }
  
  // 2. Check result cache
  const cached = await redis.get(resultCacheKey(contentHash, options))
  if (cached) {
    return { hit: true, source: 'redis', age_seconds: cached.age, document_id: cached.id }
  }
  
  // 3. No cache hit
  return { hit: false, source: 'none', age_seconds: null, document_id: null }
}
```

---

## 12. Processing Queue

### 12.1 Queue Architecture

```
                     ┌─────────────────┐
                     │   API Gateway   │
                     └────────┬────────┘
                              │
                              ▼
                     ┌─────────────────┐
                     │  Queue Router   │
                     └────────┬────────┘
                              │
          ┌───────────────────┼───────────────────┐
          │                   │                   │
          ▼                   ▼                   ▼
    ┌──────────┐        ┌──────────┐        ┌──────────┐
    │   HIGH   │        │  NORMAL  │        │   LOW    │
    │  Queue   │        │  Queue   │        │  Queue   │
    │ (<2 sec) │        │ (<10 sec)│        │ (<60 sec)│
    └────┬─────┘        └────┬─────┘        └────┬─────┘
          │                   │                   │
          └───────────────────┼───────────────────┘
                              │
                              ▼
                     ┌─────────────────┐
                     │    Workers      │
                     │  (Auto-scaled)  │
                     └─────────────────┘
```

### 12.2 Queue Priority Rules

| Priority | Criteria | Timeout | Retries |
|----------|----------|---------|---------|
| HIGH | Small file (<1MB), paying customer | 30 sec | 2 |
| NORMAL | Standard request | 60 sec | 3 |
| LOW | Large file (>10MB), batch processing | 300 sec | 3 |

### 12.3 Job Schema

```typescript
interface ProcessingJob {
  job_id: string
  document_id: string
  
  // Input
  file_url: string
  options: ParseOptions
  
  // Caller
  app_id: string
  request_id: string
  webhook_url: string | null
  
  // Queue management
  priority: 'high' | 'normal' | 'low'
  created_at: string
  started_at: string | null
  completed_at: string | null
  
  // Retry handling
  attempt: number
  max_attempts: number
  last_error: string | null
  
  // Progress tracking
  progress: {
    stage: ProcessingStage
    percent: number
    message: string
  }
}

type ProcessingStage = 
  | 'queued'
  | 'downloading'
  | 'detecting_format'
  | 'parsing'
  | 'ocr'
  | 'analyzing_layout'
  | 'detecting_fields'
  | 'fingerprinting'
  | 'matching_templates'
  | 'storing'
  | 'complete'
  | 'failed'
```

### 12.4 Progress Updates (WebSocket/SSE)

```typescript
interface ProgressUpdate {
  document_id: string
  job_id: string
  stage: ProcessingStage
  percent: number
  message: string
  estimated_remaining_seconds: number | null
}

// Client subscription
// GET /api/documind/progress/{document_id}
// Returns: Server-Sent Events stream
```

---

## 13. Rate Limiting

### 13.1 Rate Limit Tiers

| Tier | Requests/min | Requests/day | Max Concurrent | Max File Size |
|------|--------------|--------------|----------------|---------------|
| Free | 10 | 100 | 2 | 10MB |
| Basic | 60 | 1,000 | 5 | 25MB |
| Pro | 300 | 10,000 | 20 | 50MB |
| Enterprise | Custom | Custom | Custom | Custom |

### 13.2 Rate Limit Headers

```typescript
interface RateLimitHeaders {
  'X-RateLimit-Limit': number        // Max requests per window
  'X-RateLimit-Remaining': number    // Remaining requests
  'X-RateLimit-Reset': number        // Unix timestamp when window resets
  'X-RateLimit-RetryAfter'?: number  // Seconds to wait (if limited)
}
```

### 13.3 Rate Limit Response

```typescript
// HTTP 429 Too Many Requests
interface RateLimitError {
  error: {
    code: 'RATE_LIMIT_EXCEEDED'
    message: 'Rate limit exceeded. Please retry after X seconds.'
    details: {
      limit: number
      remaining: 0
      reset_at: string
      retry_after_seconds: number
    }
  }
}
```

### 13.4 Rate Limiting Implementation

```typescript
interface RateLimiter {
  // Check if request is allowed
  checkLimit(appId: string, tier: RateTier): Promise<RateLimitResult>
  
  // Record a request
  recordRequest(appId: string): Promise<void>
  
  // Get current usage
  getUsage(appId: string): Promise<RateUsage>
}

interface RateLimitResult {
  allowed: boolean
  limit: number
  remaining: number
  reset_at: Date
  retry_after_seconds: number | null
}

interface RateUsage {
  requests_this_minute: number
  requests_today: number
  concurrent_active: number
  storage_used_bytes: number
}
```

---

## 14. API Versioning

### 14.1 Versioning Strategy

| Approach | Implementation |
|----------|----------------|
| URL Path Versioning | `/api/v1/documind/parse` |
| Version Header | `X-API-Version: 2024-01-01` |
| Default Version | Latest stable |
| Deprecation Notice | 6 months before removal |

### 14.2 Version History

| Version | Release Date | Status | Notes |
|---------|--------------|--------|-------|
| v1 | 2024-03-01 | Current | Initial release |
| v2 | (Planned) | Future | Enhanced field detection |

### 14.3 Breaking Change Policy

| Change Type | Breaking? | Versioning |
|-------------|-----------|------------|
| New endpoint | No | Same version |
| New optional field in response | No | Same version |
| New required field in request | Yes | New version |
| Remove field from response | Yes | New version |
| Change field type | Yes | New version |
| Change endpoint URL | Yes | New version |

### 14.4 Deprecation Headers

```typescript
interface DeprecationHeaders {
  'Deprecation': string           // 'true' or date
  'Sunset': string                // Date when version will be removed
  'Link': string                  // Link to migration docs
}
```

---

## 15. Testing Strategy

### 15.1 Test Categories

| Category | Purpose | Tools | Coverage Target |
|----------|---------|-------|-----------------|
| Unit Tests | Individual functions | Jest | 80% |
| Integration Tests | Module interactions | Jest + Supertest | 70% |
| E2E Tests | Full pipeline | Playwright | Critical paths |
| Accuracy Tests | Parsing quality | Custom framework | 95% accuracy |
| Load Tests | Performance | k6 | Meet SLAs |
| Security Tests | Vulnerability scan | OWASP ZAP | No critical issues |

### 15.2 Test Document Library

| Document Type | Count | Purpose |
|---------------|-------|---------|
| SA Tender Forms (SBD/MBD) | 20 | Template matching accuracy |
| Generic PDFs | 50 | General parsing |
| Scanned Documents | 20 | OCR accuracy |
| Complex Tables | 30 | Table detection |
| Edge Cases | 25 | Error handling |

### 15.3 Accuracy Metrics

```typescript
interface AccuracyReport {
  // Text extraction
  text_accuracy: {
    character_accuracy: number    // % correct characters
    word_accuracy: number         // % correct words
    line_accuracy: number         // % correct lines
  }
  
  // Position accuracy
  position_accuracy: {
    average_deviation_px: number
    max_deviation_px: number
    within_5px_percent: number
  }
  
  // Field detection
  field_detection: {
    precision: number             // True positives / (True + False positives)
    recall: number                // True positives / (True + False negatives)
    f1_score: number
  }
  
  // Template matching
  template_matching: {
    correct_matches: number
    false_positives: number
    false_negatives: number
    accuracy: number
  }
  
  // OCR specific
  ocr_accuracy: {
    character_error_rate: number
    word_error_rate: number
    confidence_correlation: number
  }
}
```

### 15.4 Continuous Accuracy Monitoring

```typescript
// Run nightly against test document library
interface AccuracyTestRun {
  run_id: string
  timestamp: string
  version: string
  
  results: {
    documents_tested: number
    passed: number
    failed: number
    accuracy_score: number
  }
  
  comparison: {
    previous_score: number
    change: number
    regression_detected: boolean
  }
}
```

---

## 16. Security

### 16.1 File Validation

| Check | Implementation | Action on Fail |
|-------|----------------|----------------|
| File size | Check Content-Length and actual size | Reject |
| MIME type | Validate against allowed list | Reject |
| Magic bytes | Verify file signature matches extension | Reject |
| Malware scan | ClamAV or cloud scanner | Reject + Alert |
| JavaScript in PDF | pdf-lib inspection | Strip or Reject |
| External links | URL extraction check | Flag or Strip |
| Embedded files | Attachment detection | Ignore or Extract separately |

### 16.2 Input Sanitization

```typescript
interface SanitizationRules {
  // File names
  filename: {
    max_length: 255
    allowed_chars: /^[a-zA-Z0-9._-]+$/
    strip_path: true
  }
  
  // URL inputs
  url: {
    allowed_protocols: ['https']
    max_length: 2048
    validate_domain: true
    blocklist: ['localhost', '127.0.0.1', '0.0.0.0']
  }
  
  // Text outputs
  extracted_text: {
    strip_null_bytes: true
    normalize_unicode: true
    max_length_per_block: 10000
  }
}
```

### 16.3 Authentication & Authorization

| Method | Use Case | Implementation |
|--------|----------|----------------|
| API Key | Server-to-server | `X-API-Key` header |
| JWT | User context | `Authorization: Bearer` |
| OAuth2 | Third-party apps | Authorization code flow |

```typescript
interface AuthContext {
  app_id: string
  app_name: string
  tier: RateTier
  permissions: Permission[]
  
  // Optional user context
  user_id?: string
  tenant_id?: string
}

type Permission = 
  | 'parse'
  | 'ocr'
  | 'template_read'
  | 'template_write'
  | 'admin'
```

### 16.4 Data Privacy

| Data Type | Retention | Encryption | Access |
|-----------|-----------|------------|--------|
| Uploaded files | 30 days | At rest (AES-256) | App owner only |
| Parsed results | 90 days | At rest | App owner only |
| Extracted text | 90 days | At rest | App owner only |
| Error logs | 30 days | At rest | Internal + App owner |
| Usage metrics | 1 year | None | Aggregated only |

### 16.5 Security Headers

```typescript
interface SecurityHeaders {
  'Content-Security-Policy': "default-src 'self'"
  'X-Content-Type-Options': 'nosniff'
  'X-Frame-Options': 'DENY'
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
  'X-Request-Id': string  // For tracing
}
```

---

## 17. API Endpoints (Complete)

### 17.1 Document Parsing

**POST /api/v1/documind/parse**

Parse a document.

Request:
```typescript
{
  // One of these required
  file?: File,              // Multipart upload
  url?: string,             // URL to fetch
  base64?: string,          // Base64 encoded
  
  // Options
  options?: {
    ocr_enabled?: boolean,
    ocr_language?: string,
    extract_tables?: boolean,
    extract_forms?: boolean,
    extract_images?: boolean,
    max_pages?: number,
    password?: string,
    priority?: 'low' | 'normal' | 'high'
  },
  
  // Async processing
  webhook_url?: string,     // Callback when complete
  async?: boolean           // Return immediately with job_id
}
```

Response (sync):
```typescript
{
  document_id: string,
  status: 'complete' | 'partial',
  result: ParsedDocument,
  processing: ProcessingInfo
}
```

Response (async):
```typescript
{
  document_id: string,
  job_id: string,
  status: 'queued',
  status_url: string,       // Poll this for status
  webhook_url: string       // Will POST result here
}
```

---

**GET /api/v1/documind/document/{document_id}**

Get parsed document.

Response:
```typescript
{
  document: ParsedDocument,
  cached: boolean,
  cached_at?: string
}
```

---

**GET /api/v1/documind/document/{document_id}/pages/{page_number}**

Get specific page.

Response:
```typescript
{
  page: ParsedPage,
  document_id: string
}
```

---

**DELETE /api/v1/documind/document/{document_id}**

Delete document and all cached data.

Response:
```typescript
{
  deleted: true,
  document_id: string
}
```

---

### 17.2 OCR

**POST /api/v1/documind/ocr**

OCR only (no full parsing).

Request:
```typescript
{
  file?: File,
  url?: string,
  base64?: string,
  options?: {
    language?: string,
    engine?: 'google_vision' | 'tesseract'
  }
}
```

Response:
```typescript
{
  ocr_id: string,
  confidence: number,
  pages: Array<{
    page_number: number,
    text: string,
    blocks: OCRBlock[]
  }>,
  engine_used: string,
  processing_time_ms: number
}
```

---

### 17.3 Templates

**GET /api/v1/documind/templates**

List available templates.

Query params:
- `category`: Filter by category
- `search`: Search by name
- `limit`: Max results (default 20)
- `offset`: Pagination offset

Response:
```typescript
{
  templates: DocumentTemplate[],
  total: number,
  limit: number,
  offset: number
}
```

---

**GET /api/v1/documind/templates/{template_id}**

Get template details.

Response:
```typescript
{
  template: DocumentTemplate
}
```

---

**POST /api/v1/documind/templates**

Create new template.

Request:
```typescript
{
  name: string,
  code?: string,
  category: string,
  description?: string,
  
  // Source document to create template from
  document_id: string,
  
  // Field definitions
  fields: Array<{
    name: string,
    label: string,
    page: number,
    position_normalized: NormalizedBox,
    type: FieldDataType,
    is_required: boolean,
    profile_mapping?: string
  }>
}
```

Response:
```typescript
{
  template: DocumentTemplate
}
```

---

**POST /api/v1/documind/match**

Match document to templates.

Request:
```typescript
{
  document_id?: string,
  fingerprint?: string
}
```

Response:
```typescript
{
  matches: TemplateMatch[],
  best_match: TemplateMatch | null
}
```

---

### 17.4 Processing Status

**GET /api/v1/documind/jobs/{job_id}**

Get job status.

Response:
```typescript
{
  job: ProcessingJob
}
```

---

**GET /api/v1/documind/jobs/{job_id}/progress**

Stream progress updates (SSE).

Response: Server-Sent Events
```
event: progress
data: {"stage": "parsing", "percent": 45, "message": "Extracting text..."}

event: progress
data: {"stage": "analyzing_layout", "percent": 70, "message": "Analyzing structure..."}

event: complete
data: {"document_id": "...", "status": "complete"}
```

---

### 17.5 Admin

**GET /api/v1/documind/health**

Health check.

Response:
```typescript
{
  status: 'healthy' | 'degraded' | 'unhealthy',
  version: string,
  components: Array<{
    name: string,
    status: 'healthy' | 'unhealthy',
    latency_ms: number,
    message?: string
  }>
}
```

---

**GET /api/v1/documind/stats**

Usage statistics.

Response:
```typescript
{
  period: '24h' | '7d' | '30d',
  documents_processed: number,
  pages_processed: number,
  ocr_pages: number,
  templates_matched: number,
  average_processing_time_ms: number,
  error_rate: number,
  cache_hit_rate: number
}
```

---

## 18. Database Schema (Complete)

```sql
-- ============================================
-- DOCUMIND ENGINE DATABASE SCHEMA
-- ============================================

-- Documents table
CREATE TABLE documind_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Source tracking
  app_id VARCHAR(50) NOT NULL,
  request_id VARCHAR(100),
  source_reference VARCHAR(255),
  
  -- File information
  original_filename VARCHAR(255),
  mime_type VARCHAR(100) NOT NULL,
  file_size INTEGER NOT NULL,
  storage_url TEXT NOT NULL,
  content_hash VARCHAR(64) NOT NULL,
  
  -- Fingerprints
  fingerprint_structure VARCHAR(64),
  fingerprint_layout VARCHAR(64),
  fingerprint_form VARCHAR(64),
  fingerprint_table VARCHAR(64),
  
  -- Document metadata
  metadata JSONB NOT NULL DEFAULT '{}',
  page_count INTEGER,
  is_scanned BOOLEAN DEFAULT FALSE,
  is_encrypted BOOLEAN DEFAULT FALSE,
  detected_language VARCHAR(10) DEFAULT 'en',
  detected_type VARCHAR(50),
  
  -- Processing status
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  error_code VARCHAR(50),
  error_message TEXT,
  
  -- Processing info
  processing_started_at TIMESTAMPTZ,
  processing_completed_at TIMESTAMPTZ,
  processing_duration_ms INTEGER,
  ocr_used BOOLEAN DEFAULT FALSE,
  ocr_engine VARCHAR(50),
  ocr_confidence NUMERIC(5,4),
  
  -- Full parsed content (compressed JSONB)
  parsed_content JSONB,
  
  -- Layout analysis result
  layout JSONB,
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  
  -- Indexes
  CONSTRAINT documind_documents_content_hash_idx UNIQUE (content_hash, app_id)
);

CREATE INDEX idx_documind_documents_app ON documind_documents(app_id);
CREATE INDEX idx_documind_documents_status ON documind_documents(status);
CREATE INDEX idx_documind_documents_fingerprint ON documind_documents(fingerprint_structure);
CREATE INDEX idx_documind_documents_created ON documind_documents(created_at);
CREATE INDEX idx_documind_documents_type ON documind_documents(detected_type);


-- Document pages (for large documents)
CREATE TABLE documind_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NOT NULL REFERENCES documind_documents(id) ON DELETE CASCADE,
  page_number INTEGER NOT NULL,
  
  -- Dimensions
  width NUMERIC(10,2) NOT NULL,
  height NUMERIC(10,2) NOT NULL,
  rotation INTEGER DEFAULT 0,
  
  -- Content
  full_text TEXT,
  text_blocks JSONB,
  lines JSONB,
  rectangles JSONB,
  images JSONB,
  
  -- OCR specific
  is_scanned BOOLEAN DEFAULT FALSE,
  ocr_confidence NUMERIC(5,4),
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  CONSTRAINT documind_pages_unique UNIQUE (document_id, page_number)
);

CREATE INDEX idx_documind_pages_document ON documind_pages(document_id);


-- Detected fields (for FormFlow)
CREATE TABLE documind_fields (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NOT NULL REFERENCES documind_documents(id) ON DELETE CASCADE,
  page_number INTEGER NOT NULL,
  
  -- Field identification
  field_name VARCHAR(255),
  label_text VARCHAR(500),
  
  -- Type and classification
  field_type VARCHAR(50) NOT NULL,
  input_type VARCHAR(50) NOT NULL,
  suggested_data_type VARCHAR(50),
  
  -- Position (PDF coordinates)
  position_x NUMERIC(10,4) NOT NULL,
  position_y NUMERIC(10,4) NOT NULL,
  position_width NUMERIC(10,4) NOT NULL,
  position_height NUMERIC(10,4) NOT NULL,
  
  -- Position (normalized 0-1)
  position_norm_x NUMERIC(10,6) NOT NULL,
  position_norm_y NUMERIC(10,6) NOT NULL,
  position_norm_width NUMERIC(10,6) NOT NULL,
  position_norm_height NUMERIC(10,6) NOT NULL,
  
  -- Label position
  label_position JSONB,
  
  -- Typography
  font_name VARCHAR(100),
  font_size NUMERIC(6,2),
  font_weight VARCHAR(20),
  font_color VARCHAR(20),
  
  -- Detection info
  detection_method VARCHAR(50) NOT NULL,
  confidence NUMERIC(5,4),
  
  -- For native PDF fields
  is_native_field BOOLEAN DEFAULT FALSE,
  native_field_name VARCHAR(255),
  native_field_value TEXT,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_documind_fields_document ON documind_fields(document_id);
CREATE INDEX idx_documind_fields_page ON documind_fields(document_id, page_number);


-- Document templates
CREATE TABLE documind_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Identification
  name VARCHAR(255) NOT NULL,
  code VARCHAR(50),
  category VARCHAR(100) NOT NULL,
  subcategory VARCHAR(100),
  
  -- Matching
  fingerprint_structure VARCHAR(64) NOT NULL,
  fingerprint_layout VARCHAR(64),
  match_threshold NUMERIC(5,4) DEFAULT 0.80,
  
  -- Template definition
  field_mappings JSONB NOT NULL,
  page_count INTEGER,
  
  -- Metadata
  description TEXT,
  version VARCHAR(20),
  source VARCHAR(255),
  
  -- Statistics
  usage_count INTEGER DEFAULT 0,
  last_used_at TIMESTAMPTZ,
  accuracy_score NUMERIC(5,4),
  
  -- Ownership
  created_by VARCHAR(50),
  is_system BOOLEAN DEFAULT FALSE,
  is_public BOOLEAN DEFAULT TRUE,
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_documind_templates_fingerprint ON documind_templates(fingerprint_structure);
CREATE INDEX idx_documind_templates_category ON documind_templates(category);
CREATE INDEX idx_documind_templates_code ON documind_templates(code);


-- Template matches
CREATE TABLE documind_template_matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NOT NULL REFERENCES documind_documents(id) ON DELETE CASCADE,
  template_id UUID NOT NULL REFERENCES documind_templates(id) ON DELETE CASCADE,
  
  match_score NUMERIC(5,4) NOT NULL,
  matched_fields INTEGER,
  total_fields INTEGER,
  
  matched_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  CONSTRAINT documind_matches_unique UNIQUE (document_id, template_id)
);

CREATE INDEX idx_documind_matches_document ON documind_template_matches(document_id);
CREATE INDEX idx_documind_matches_template ON documind_template_matches(template_id);


-- Processing jobs (queue)
CREATE TABLE documind_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID REFERENCES documind_documents(id) ON DELETE SET NULL,
  
  -- Input
  file_url TEXT NOT NULL,
  options JSONB NOT NULL DEFAULT '{}',
  
  -- Caller
  app_id VARCHAR(50) NOT NULL,
  request_id VARCHAR(100),
  webhook_url TEXT,
  
  -- Queue management
  priority VARCHAR(20) NOT NULL DEFAULT 'normal',
  status VARCHAR(20) NOT NULL DEFAULT 'queued',
  
  -- Progress
  current_stage VARCHAR(50),
  progress_percent INTEGER DEFAULT 0,
  progress_message TEXT,
  
  -- Retry handling
  attempt INTEGER DEFAULT 1,
  max_attempts INTEGER DEFAULT 3,
  last_error TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  
  -- Timeout
  timeout_at TIMESTAMPTZ
);

CREATE INDEX idx_documind_jobs_status ON documind_jobs(status, priority, created_at);
CREATE INDEX idx_documind_jobs_app ON documind_jobs(app_id);


-- Error logs
CREATE TABLE documind_error_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Context
  document_id UUID,
  job_id UUID,
  app_id VARCHAR(50),
  request_id VARCHAR(100),
  
  -- Error details
  error_code VARCHAR(50) NOT NULL,
  error_message TEXT NOT NULL,
  stack_trace TEXT,
  
  -- Processing context
  processing_stage VARCHAR(50),
  file_info JSONB,
  
  -- Timestamps
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_documind_errors_time ON documind_error_logs(occurred_at);
CREATE INDEX idx_documind_errors_code ON documind_error_logs(error_code);


-- Usage metrics (for billing and monitoring)
CREATE TABLE documind_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  app_id VARCHAR(50) NOT NULL,
  
  -- Period
  period_start TIMESTAMPTZ NOT NULL,
  period_end TIMESTAMPTZ NOT NULL,
  
  -- Counts
  documents_processed INTEGER DEFAULT 0,
  pages_processed INTEGER DEFAULT 0,
  ocr_pages INTEGER DEFAULT 0,
  storage_bytes BIGINT DEFAULT 0,
  
  -- Performance
  total_processing_ms BIGINT DEFAULT 0,
  
  -- Costs
  ocr_cost_cents INTEGER DEFAULT 0,
  storage_cost_cents INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  CONSTRAINT documind_usage_unique UNIQUE (app_id, period_start)
);

CREATE INDEX idx_documind_usage_app ON documind_usage(app_id, period_start);


-- Feedback for learning (from LearnLoop)
CREATE TABLE documind_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  document_id UUID REFERENCES documind_documents(id) ON DELETE SET NULL,
  field_id UUID REFERENCES documind_fields(id) ON DELETE SET NULL,
  template_id UUID REFERENCES documind_templates(id) ON DELETE SET NULL,
  
  -- Feedback type
  feedback_type VARCHAR(50) NOT NULL,
  
  -- Original vs corrected
  original_value JSONB,
  corrected_value JSONB,
  
  -- Source
  app_id VARCHAR(50) NOT NULL,
  user_id VARCHAR(100),
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_documind_feedback_type ON documind_feedback(feedback_type);
CREATE INDEX idx_documind_feedback_template ON documind_feedback(template_id);
```

---

## 19. Webhook Events (Complete)

### 19.1 Event Schema

```typescript
interface WebhookEvent {
  event_id: string
  event_type: string
  timestamp: string
  
  // Target
  document_id: string
  app_id: string
  request_id?: string
  
  // Payload
  data: Record<string, any>
}
```

### 19.2 Event Types

**document.parsing.started**
```typescript
{
  event_type: 'document.parsing.started',
  data: {
    job_id: string,
    file_name: string,
    file_size: number,
    options: ParseOptions
  }
}
```

**document.parsing.progress**
```typescript
{
  event_type: 'document.parsing.progress',
  data: {
    job_id: string,
    stage: ProcessingStage,
    percent: number,
    message: string
  }
}
```

**document.parsing.completed**
```typescript
{
  event_type: 'document.parsing.completed',
  data: {
    result: ParsedDocument,
    processing_time_ms: number
  }
}
```

**document.parsing.failed**
```typescript
{
  event_type: 'document.parsing.failed',
  data: {
    error_code: ErrorCode,
    error_message: string,
    partial_result?: Partial<ParsedDocument>
  }
}
```

**template.matched**
```typescript
{
  event_type: 'template.matched',
  data: {
    template_id: string,
    template_name: string,
    match_score: number
  }
}
```

### 19.3 Webhook Security

```typescript
interface WebhookSecurity {
  // Request headers
  'X-DocuMind-Signature': string     // HMAC-SHA256 signature
  'X-DocuMind-Timestamp': string     // Request timestamp
  'X-DocuMind-Event': string         // Event type
  
  // Signature verification
  // signature = HMAC-SHA256(timestamp + '.' + body, webhook_secret)
}
```

---

## 20. Implementation Phases (Detailed)

### Phase 1: Core PDF Parser (Week 1)

**Deliverables:**
- PDF text extraction with pdfjs-dist
- Position extraction for all text blocks
- Font detection
- Native form field extraction
- Basic metadata extraction

**Files to create:**
```
lib/engines/documind/
├── index.ts                 # Main exports
├── parser/
│   ├── pdf-parser.ts        # Main PDF parser
│   ├── text-extractor.ts    # Text extraction
│   ├── font-detector.ts     # Font detection
│   └── form-field-extractor.ts
├── types/
│   └── index.ts             # All TypeScript types
└── utils/
    ├── position-mapper.ts   # Coordinate conversion
    └── file-utils.ts        # File handling
```

**Success criteria:**
- Extract text with >95% accuracy
- Position deviation <5px
- Process 10-page PDF in <3 seconds

---

### Phase 2: Layout Analysis (Week 2)

**Deliverables:**
- Document structure detection
- Section/header identification
- Form region detection
- Field detection (lines, boxes)
- Table region detection
- Reading order determination

**Files to create:**
```
lib/engines/documind/
├── analyzer/
│   ├── layout-analyzer.ts   # Main layout analysis
│   ├── section-detector.ts  # Sections and headers
│   ├── field-detector.ts    # Form field detection
│   ├── table-detector.ts    # Table region detection
│   └── reading-order.ts     # Reading sequence
```

**Success criteria:**
- Detect >80% of form fields
- Correctly identify document type >70%
- Table detection precision >85%

---

### Phase 3: OCR Integration (Days 15-17)

**Deliverables:**
- Google Vision API integration
- Tesseract.js fallback
- Scanned PDF detection
- Per-page OCR decision
- Result merging

**Files to create:**
```
lib/engines/documind/
├── ocr/
│   ├── ocr-router.ts        # OCR engine selection
│   ├── google-vision.ts     # Google Vision integration
│   ├── tesseract.ts         # Tesseract fallback
│   └── result-merger.ts     # Merge OCR with parsed content
```

**Success criteria:**
- OCR accuracy >90%
- Fallback works when Vision unavailable
- Correctly detect scanned vs native

---

### Phase 4: Fingerprinting & Templates (Days 18-21)

**Deliverables:**
- Document fingerprinting algorithm
- Template database schema
- Template creation from document
- Template matching
- Pre-built SA tender templates (SBD/MBD)

**Files to create:**
```
lib/engines/documind/
├── templates/
│   ├── fingerprinter.ts     # Fingerprint generation
│   ├── matcher.ts           # Template matching
│   └── sa-templates/        # Pre-built templates
│       ├── sbd1.ts
│       ├── sbd2.ts
│       └── ...
```

**Success criteria:**
- Match known templates >80%
- False positive rate <5%
- 20+ SA templates pre-built

---

### Phase 5: API Layer (Days 22-24)

**Deliverables:**
- REST API endpoints
- Request validation
- Response formatting
- Error handling
- Rate limiting
- API versioning

**Files to create:**
```
app/api/v1/documind/
├── parse/route.ts
├── document/[id]/route.ts
├── document/[id]/pages/[page]/route.ts
├── ocr/route.ts
├── templates/route.ts
├── templates/[id]/route.ts
├── match/route.ts
├── jobs/[id]/route.ts
├── jobs/[id]/progress/route.ts
├── health/route.ts
└── stats/route.ts

lib/engines/documind/
├── api/
│   ├── middleware.ts        # Auth, rate limiting
│   ├── validation.ts        # Request validation
│   └── responses.ts         # Response formatting
```

**Success criteria:**
- All endpoints functional
- Rate limiting working
- Error responses consistent

---

### Phase 6: Infrastructure (Days 25-26)

**Deliverables:**
- Database tables created
- Redis caching
- Blob storage integration
- Queue setup (QStash)
- Webhook delivery

**Files to create:**
```
scripts/
├── documind-schema.sql      # Database schema

lib/engines/documind/
├── infrastructure/
│   ├── database.ts          # DB operations
│   ├── cache.ts             # Redis caching
│   ├── storage.ts           # Blob storage
│   ├── queue.ts             # Job queue
│   └── webhooks.ts          # Webhook delivery
```

**Success criteria:**
- All tables created
- Caching reduces repeat processing
- Async processing working

---

## 21. Success Metrics (Complete)

| Category | Metric | Target | Measurement |
|----------|--------|--------|-------------|
| **Accuracy** | Text extraction | >95% | Character comparison |
| | Position accuracy | <5px | Overlay comparison |
| | OCR accuracy | >90% | Character error rate |
| | Field detection F1 | >0.80 | Precision/Recall |
| | Template matching | >80% | Correct matches |
| **Performance** | Avg processing time | <10s | P50 latency |
| | 95th percentile | <30s | P95 latency |
| | Throughput | >100/hour | Docs per hour |
| **Reliability** | Uptime | 99.5% | Monitoring |
| | Error rate | <2% | Failed / Total |
| | Queue depth | <100 | Pending jobs |
| **Efficiency** | Cache hit rate | >30% | Hits / Requests |
| | OCR usage | <40% | OCR / Total pages |

---

## 22. Monthly Cost Estimates (Detailed)

### Cost Breakdown

| Component | Unit Cost | 1K docs | 10K docs | 100K docs |
|-----------|-----------|---------|----------|-----------|
| **OCR (Google Vision)** | $1.50/1K pages | $6 | $60 | $600 |
| **Storage (Vercel Blob)** | $0.15/GB | $2 | $15 | $100 |
| **Database (Supabase)** | $25/mo base | $25 | $25 | $50 |
| **Redis (Upstash)** | $0.20/100K | $1 | $5 | $40 |
| **Queue (QStash)** | $1/100K | $1 | $5 | $50 |
| **Compute (Vercel)** | Usage based | $5 | $30 | $200 |
| **Total** | | **~$40** | **~$140** | **~$1,040** |

### Cost per Document

| Volume | Cost/Document |
|--------|---------------|
| 1,000 | $0.040 |
| 10,000 | $0.014 |
| 100,000 | $0.010 |

### Cost Optimization Strategies

1. **Caching** - Cache parsed results to avoid reprocessing
2. **Smart OCR** - Only OCR pages that need it
3. **Template matching** - Skip full analysis for known templates
4. **Compression** - Compress stored results
5. **Tiered storage** - Move old documents to cheaper storage
