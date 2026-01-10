// ============================================
// DOCUMIND ENGINE - MAIN ENTRY POINT
// ============================================

export * from "./types"
export * from "./errors"
export * from "./constants"

// Modules
export { parsePDF, type PDFParseResult, type PDFParseOptions } from "./modules/pdf-parser"
export { analyzeLayout, type LayoutAnalysisResult } from "./modules/layout-analyzer"
export { performOCR, mergeOCRWithPage, pageNeedsOCR, type OCRResult, type OCRPage } from "./modules/ocr-engine"

// Utils
export * from "./utils/position-mapper"
export * from "./utils/fingerprint"
export * from "./utils/validation"

// Main processing function
import { parsePDF } from "./modules/pdf-parser"
import { analyzeLayout } from "./modules/layout-analyzer"
import { pageNeedsOCR } from "./modules/ocr-engine"
import { generateFingerprints, generateContentHash } from "./utils/fingerprint"
import { validateFile } from "./utils/validation"
import { Errors } from "./errors"
import type { ParsedDocument, ParseOptions, DocuMindError, ProcessingInfo } from "./types"

export interface ProcessDocumentResult {
  success: boolean
  document?: ParsedDocument
  error?: DocuMindError
}

/**
 * Main document processing function
 * Orchestrates parsing, OCR, layout analysis, and fingerprinting
 */
export async function processDocument(
  data: ArrayBuffer | Uint8Array,
  mimeType: string,
  options: ParseOptions = {},
): Promise<ProcessDocumentResult> {
  const startTime = Date.now()
  try {
    const { incr } = await import("./utils/metrics")
    incr("documind.parse.started")
  } catch {}
  const warnings: string[] = []

  try {
    // Validate file
    const fileValidation = validateFile(mimeType, data.byteLength)
    if (!fileValidation.valid) {
      return { success: false, error: fileValidation.error }
    }

    // Currently only supporting PDF
    if (mimeType !== "application/pdf") {
      return {
        success: false,
        error: Errors.unsupportedFormat(mimeType),
      }
    }

    // Parse PDF
    const parseResult = await parsePDF(data, {
      extractImages: options.extract_images,
      maxPages: options.max_pages,
      password: options.password,
    })

    const pages = parseResult.pages
    let ocrUsed = false
    let ocrConfidence: number | null = null

    // Perform OCR on scanned pages if enabled
    if (options.ocr_enabled !== false) {
      for (let i = 0; i < pages.length; i++) {
        if (pageNeedsOCR(pages[i])) {
          warnings.push(`Page ${i + 1} appears to be scanned, OCR required`)
          // Note: Full OCR implementation would render page to image first
          // For now, mark as needing OCR
          ocrUsed = true
        }
      }
    }

    // If OCR is required and available, perform OCR per-page and merge
    if (options.ocr_enabled !== false && ocrUsed) {
      try {
        const { performOCR, mergeOCRWithPage } = await import("./modules/ocr-engine")
        for (let i = 0; i < pages.length; i++) {
          if (pageNeedsOCR(pages[i])) {
            try {
              // render page to image using pdf-lib is non-trivial; parsePDF provides raw pages without images
              // Some environments support rendering via pdfjs; here we attempt a best-effort approach:
              // If parseResult provided pageImages, prefer those; otherwise skip heavy OCR.
              const pageInfo = pages[i]
              if ((parseResult as any).pageImages && (parseResult as any).pageImages[i]) {
                const img = (parseResult as any).pageImages[i]
                const ocrPage = await performOCR(img, i + 1, { width: pageInfo.width, height: pageInfo.height }, options.ocr_language)
                pages[i] = mergeOCRWithPage(pages[i], ocrPage)
                ocrConfidence = ocrPage.confidence
              } else if ((parseResult as any).rawPdf) {
                // Try server-side rendering via puppeteer (best-effort)
                try {
                  const { renderPdfPageToPng } = await import("./utils/page-renderer")
                  const png = await renderPdfPageToPng((parseResult as any).rawPdf, i + 1)
                  const ocrPage = await performOCR(png as Buffer, i + 1, { width: pageInfo.width, height: pageInfo.height }, options.ocr_language)
                  pages[i] = mergeOCRWithPage(pages[i], ocrPage)
                  ocrConfidence = ocrPage.confidence
                } catch (renderErr) {
                  console.warn("Documind: server-side rendering for OCR failed", renderErr)
                }
              } else {
                console.warn("Documind: No page image available for OCR; skipping OCR for page", i + 1)
              }
            } catch (ocrErr) {
              console.error("Documind: OCR failed for page", i + 1, ocrErr)
            }
          }
        }
      } catch (e) {
        console.warn("Documind: OCR module unavailable or failed to load", e)
      }
    }

    try {
      const { incr } = await import("./utils/metrics")
      incr("documind.parse.completed")
      if (ocrUsed) incr("documind.ocr.used")
    } catch {}

    // Analyze layout
    const layoutResult = analyzeLayout(pages, parseResult.metadata.detected_type)

    // Generate fingerprints
    const contentHash = generateContentHash(parseResult.rawText)
    const fingerprints = generateFingerprints(pages, parseResult.formFields, layoutResult.tableRegions, contentHash)

    // Build processing info
    const processingInfo: ProcessingInfo = {
      duration_ms: Date.now() - startTime,
      ocr_used: ocrUsed,
      ocr_engine: ocrUsed ? "tesseract" : null,
      ocr_confidence: ocrConfidence,
      warnings,
      pages_processed: pages.length,
      pages_skipped: (options.max_pages || 0) > 0 ? Math.max(0, parseResult.metadata.page_count - pages.length) : 0,
    }

    // Build final document
    const document: ParsedDocument = {
      document_id: crypto.randomUUID(),
      status: warnings.length > 0 ? "partial" : "complete",
      metadata: parseResult.metadata,
      fingerprints,
      pages,
      layout: layoutResult.layout,
      form_fields: parseResult.formFields,
      processing: processingInfo,
    }

    return { success: true, document }
  } catch (error) {
    console.error("Document processing error:", error)
    return {
      success: false,
      error: Errors.parseFailed("unknown", error instanceof Error ? error.message : "Unknown error"),
    }
  }
}
