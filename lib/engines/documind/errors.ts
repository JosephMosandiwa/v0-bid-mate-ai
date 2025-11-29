// ============================================
// DOCUMIND ENGINE - ERROR HANDLING
// ============================================

import type { DocuMindError, ErrorCode } from "./types"

// Error factory functions
export function createError(
  code: ErrorCode,
  message: string,
  details?: Record<string, any>,
  recoverable = false,
): DocuMindError {
  return {
    code,
    message,
    details,
    recoverable,
  }
}

// Pre-defined errors
export const Errors = {
  // File errors
  fileTooLarge: (maxSize: number, actualSize: number) =>
    createError(
      "FILE_TOO_LARGE",
      `File size ${actualSize} bytes exceeds maximum ${maxSize} bytes`,
      { max_size: maxSize, actual_size: actualSize },
      false,
    ),

  unsupportedFormat: (format: string) =>
    createError("UNSUPPORTED_FORMAT", `File format '${format}' is not supported`, { format }, false),

  corruptedFile: (reason?: string) =>
    createError("CORRUPTED_FILE", reason || "The file appears to be corrupted or invalid", { reason }, false),

  passwordProtected: () =>
    createError("PASSWORD_PROTECTED", "The PDF is password protected. Please provide the password.", undefined, true),

  invalidPassword: () => createError("INVALID_PASSWORD", "The provided password is incorrect", undefined, true),

  // Processing errors
  parseFailed: (stage: string, reason: string) =>
    createError("PARSE_FAILED", `Failed to parse document at stage '${stage}': ${reason}`, { stage, reason }, false),

  ocrFailed: (reason: string) => createError("OCR_FAILED", `OCR processing failed: ${reason}`, { reason }, true),

  timeout: (stage: string, timeoutMs: number) =>
    createError(
      "TIMEOUT",
      `Processing timed out at stage '${stage}' after ${timeoutMs}ms`,
      { stage, timeout_ms: timeoutMs },
      true,
    ),

  outOfMemory: () =>
    createError("OUT_OF_MEMORY", "Document is too complex to process. Try reducing page count.", undefined, false),

  // Service errors
  serviceUnavailable: (service: string) =>
    createError("SERVICE_UNAVAILABLE", `Service '${service}' is currently unavailable`, { service }, true),

  rateLimited: (retryAfter: number) =>
    createError(
      "RATE_LIMITED",
      `Rate limit exceeded. Please retry after ${retryAfter} seconds`,
      { retry_after: retryAfter },
      true,
    ),

  quotaExceeded: (quota: string) =>
    createError("QUOTA_EXCEEDED", `Quota '${quota}' has been exceeded`, { quota }, false),

  // Validation errors
  invalidRequest: (reason: string) => createError("INVALID_REQUEST", `Invalid request: ${reason}`, { reason }, false),

  missingRequiredField: (field: string) =>
    createError("MISSING_REQUIRED_FIELD", `Required field '${field}' is missing`, { field }, false),

  invalidOptions: (option: string, reason: string) =>
    createError("INVALID_OPTIONS", `Invalid option '${option}': ${reason}`, { option, reason }, false),

  // Not found errors
  documentNotFound: (documentId: string) =>
    createError("DOCUMENT_NOT_FOUND", `Document '${documentId}' not found`, { document_id: documentId }, false),

  templateNotFound: (templateId: string) =>
    createError("TEMPLATE_NOT_FOUND", `Template '${templateId}' not found`, { template_id: templateId }, false),

  jobNotFound: (jobId: string) => createError("JOB_NOT_FOUND", `Job '${jobId}' not found`, { job_id: jobId }, false),
}

// Error logging
export interface ErrorLogEntry {
  document_id?: string
  job_id?: string
  app_id: string
  request_id?: string
  error_code: ErrorCode
  error_message: string
  stack_trace?: string
  processing_stage?: string
  file_info?: {
    filename?: string
    mime_type?: string
    size?: number
  }
  occurred_at: string
}

export function formatErrorLog(
  error: DocuMindError,
  context: {
    document_id?: string
    job_id?: string
    app_id: string
    request_id?: string
    processing_stage?: string
    file_info?: Record<string, any>
  },
): ErrorLogEntry {
  return {
    document_id: context.document_id,
    job_id: context.job_id,
    app_id: context.app_id,
    request_id: context.request_id,
    error_code: error.code,
    error_message: error.message,
    processing_stage: context.processing_stage,
    file_info: context.file_info,
    occurred_at: new Date().toISOString(),
  }
}
