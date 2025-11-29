// ============================================
// DOCUMIND ENGINE - INPUT VALIDATION
// ============================================

import type { ParseRequest, ParseOptions, DocuMindError } from "../types"
import { Errors } from "../errors"
import { MAX_FILE_SIZE, MAX_PAGES, SUPPORTED_MIME_TYPES, type SupportedMimeType } from "../constants"

export interface ValidationResult {
  valid: boolean
  error?: DocuMindError
}

/**
 * Validate a parse request
 */
export function validateParseRequest(request: ParseRequest): ValidationResult {
  // Must have at least one input source
  if (!request.file && !request.url && !request.base64) {
    return {
      valid: false,
      error: Errors.invalidRequest("Must provide one of: file, url, or base64"),
    }
  }

  // Only one input source allowed
  const inputCount = [request.file, request.url, request.base64].filter(Boolean).length
  if (inputCount > 1) {
    return {
      valid: false,
      error: Errors.invalidRequest("Only one input source allowed (file, url, or base64)"),
    }
  }

  // Validate app_id
  if (!request.app_id || request.app_id.trim() === "") {
    return {
      valid: false,
      error: Errors.missingRequiredField("app_id"),
    }
  }

  // Validate options if provided
  if (request.options) {
    const optionsResult = validateParseOptions(request.options)
    if (!optionsResult.valid) {
      return optionsResult
    }
  }

  // Validate webhook URL if provided
  if (request.webhook_url) {
    try {
      new URL(request.webhook_url)
    } catch {
      return {
        valid: false,
        error: Errors.invalidOptions("webhook_url", "Invalid URL format"),
      }
    }
  }

  return { valid: true }
}

/**
 * Validate parse options
 */
export function validateParseOptions(options: ParseOptions): ValidationResult {
  // Validate max_pages
  if (options.max_pages !== undefined) {
    if (options.max_pages < 1 || options.max_pages > MAX_PAGES) {
      return {
        valid: false,
        error: Errors.invalidOptions("max_pages", `Must be between 1 and ${MAX_PAGES}`),
      }
    }
  }

  // Validate priority
  if (options.priority !== undefined) {
    if (!["low", "normal", "high"].includes(options.priority)) {
      return {
        valid: false,
        error: Errors.invalidOptions("priority", "Must be 'low', 'normal', or 'high'"),
      }
    }
  }

  // Validate OCR language
  if (options.ocr_language !== undefined) {
    const validLanguages = ["en", "eng", "afr", "zul", "xho", "sot", "tsn"]
    if (!validLanguages.includes(options.ocr_language)) {
      return {
        valid: false,
        error: Errors.invalidOptions("ocr_language", `Supported languages: ${validLanguages.join(", ")}`),
      }
    }
  }

  return { valid: true }
}

/**
 * Validate file metadata
 */
export function validateFile(mimeType: string, size: number): ValidationResult {
  // Check file size
  if (size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: Errors.fileTooLarge(MAX_FILE_SIZE, size),
    }
  }

  // Check MIME type
  if (!SUPPORTED_MIME_TYPES.includes(mimeType as SupportedMimeType)) {
    return {
      valid: false,
      error: Errors.unsupportedFormat(mimeType),
    }
  }

  return { valid: true }
}

/**
 * Detect MIME type from file header (magic bytes)
 */
export function detectMimeType(buffer: Buffer): string | null {
  // Check first bytes for magic numbers
  const header = buffer.slice(0, 8)

  // PDF: %PDF
  if (header[0] === 0x25 && header[1] === 0x50 && header[2] === 0x44 && header[3] === 0x46) {
    return "application/pdf"
  }

  // PNG: 89 50 4E 47
  if (header[0] === 0x89 && header[1] === 0x50 && header[2] === 0x4e && header[3] === 0x47) {
    return "image/png"
  }

  // JPEG: FF D8 FF
  if (header[0] === 0xff && header[1] === 0xd8 && header[2] === 0xff) {
    return "image/jpeg"
  }

  // TIFF: 49 49 2A 00 (little-endian) or 4D 4D 00 2A (big-endian)
  if (
    (header[0] === 0x49 && header[1] === 0x49 && header[2] === 0x2a && header[3] === 0x00) ||
    (header[0] === 0x4d && header[1] === 0x4d && header[2] === 0x00 && header[3] === 0x2a)
  ) {
    return "image/tiff"
  }

  // DOCX: PK (ZIP archive) - need additional check
  if (header[0] === 0x50 && header[1] === 0x4b) {
    // Could be docx, xlsx, etc. - needs content inspection
    return "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  }

  // DOC: D0 CF 11 E0 (OLE compound)
  if (header[0] === 0xd0 && header[1] === 0xcf && header[2] === 0x11 && header[3] === 0xe0) {
    return "application/msword"
  }

  return null
}

/**
 * Sanitize filename for storage
 */
export function sanitizeFilename(filename: string): string {
  // Remove path separators and dangerous characters
  return filename
    .replace(/[/\\:*?"<>|]/g, "_")
    .replace(/\.\./g, "_")
    .replace(/^\./, "_")
    .substring(0, 255)
}

/**
 * Generate a unique document ID
 */
export function generateDocumentId(): string {
  return crypto.randomUUID()
}

/**
 * Validate UUID format
 */
export function isValidUUID(str: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  return uuidRegex.test(str)
}
