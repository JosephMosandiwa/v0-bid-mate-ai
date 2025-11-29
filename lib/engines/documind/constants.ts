// ============================================
// DOCUMIND ENGINE - CONSTANTS
// ============================================

// File size limits
export const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB
export const MAX_PAGES = 500
export const MAX_FILE_SIZE_FOR_SYNC = 10 * 1024 * 1024 // 10MB - larger files go async

// Supported MIME types
export const SUPPORTED_MIME_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
  "application/msword", // .doc
  "image/png",
  "image/jpeg",
  "image/tiff",
  "image/webp",
] as const

export type SupportedMimeType = (typeof SUPPORTED_MIME_TYPES)[number]

// File extensions mapping
export const MIME_TO_EXTENSION: Record<SupportedMimeType, string> = {
  "application/pdf": ".pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": ".docx",
  "application/msword": ".doc",
  "image/png": ".png",
  "image/jpeg": ".jpg",
  "image/tiff": ".tiff",
  "image/webp": ".webp",
}

// Processing timeouts (ms)
export const TIMEOUTS = {
  parse: 60000, // 60 seconds
  ocr_per_page: 10000, // 10 seconds per page
  layout_analysis: 30000, // 30 seconds
  total: 300000, // 5 minutes total
}

// Cache TTLs (seconds)
export const CACHE_TTL = {
  parsed_document: 86400, // 24 hours
  template_list: 3600, // 1 hour
  fingerprint_match: 86400, // 24 hours
}

// OCR settings
export const OCR_CONFIG = {
  default_language: "eng",
  confidence_threshold: 0.6, // Below this, mark as low confidence
  min_text_density: 0.01, // Below this, consider page as image/scanned
}

// Field detection settings
export const FIELD_DETECTION = {
  min_line_length: 20, // Minimum pixels for a line to be considered
  max_label_distance: 50, // Max pixels between label and field
  min_confidence: 0.5, // Minimum confidence to include a field
}

// PDF coordinate system
export const PDF_POINTS_PER_INCH = 72

// Common SA tender form codes
export const SA_TENDER_FORMS = {
  SBD1: "Invitation to Bid",
  SBD2: "Tax Clearance Certificate Requirements",
  SBD3_1: "Pricing Schedule - Firm Prices",
  SBD3_2: "Pricing Schedule - Non-Firm Prices",
  SBD3_3: "Pricing Schedule - Professional Services",
  SBD4: "Declaration of Interest",
  SBD5: "National Industrial Participation Programme",
  SBD6_1: "Preference Points Claim Form - Procurement",
  SBD6_2: "Declaration for Local Production and Content",
  SBD7_1: "Contract Form - Purchase of Goods",
  SBD7_2: "Contract Form - Lease of Goods",
  SBD7_3: "Contract Form - Rendering of Services",
  SBD8: "Declaration of Bidders Past SCM Practices",
  SBD9: "Certificate of Independent Bid Determination",
  MBD1: "Municipal Invitation to Bid",
  MBD2: "Tax Clearance Requirements",
  MBD4: "Declaration of Interest",
  MBD5: "Declaration for Procurement",
  MBD6_1: "Preference Points Claim Form",
  MBD7_1: "Contract Form - Purchase",
  MBD8: "Declaration of Bidders Past SCM Practices",
  MBD9: "Certificate of Independent Bid Determination",
  CSD: "Central Supplier Database",
  CIDB: "Construction Industry Development Board",
} as const

// Document type detection patterns
export const DOCUMENT_TYPE_PATTERNS = {
  tender: [/tender/i, /bid/i, /rfq/i, /request for quotation/i, /invitation to/i, /procurement/i],
  boq: [/bill of quantities/i, /boq/i, /schedule of quantities/i, /pricing schedule/i],
  contract: [/contract/i, /agreement/i, /terms and conditions/i],
  specification: [/specification/i, /technical requirements/i, /scope of work/i],
  certificate: [/certificate/i, /certification/i, /clearance/i],
  invoice: [/invoice/i, /tax invoice/i, /receipt/i],
  form: [/form/i, /application/i, /declaration/i],
}

// Rate limits per tier
export const RATE_LIMITS = {
  free: {
    requests_per_minute: 10,
    requests_per_day: 100,
    max_pages_per_request: 50,
  },
  basic: {
    requests_per_minute: 30,
    requests_per_day: 500,
    max_pages_per_request: 100,
  },
  professional: {
    requests_per_minute: 60,
    requests_per_day: 2000,
    max_pages_per_request: 300,
  },
  enterprise: {
    requests_per_minute: 200,
    requests_per_day: 10000,
    max_pages_per_request: 500,
  },
}

// API version
export const API_VERSION = "v1"
