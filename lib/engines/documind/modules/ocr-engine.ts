// ============================================
// DOCUMIND ENGINE - OCR MODULE
// Handles OCR for scanned documents
// ============================================

import type { ParsedPage, TextBlock, WordInfo, BoundingBox, FontInfo } from "../types"
import { pdfToNormalized } from "../utils/position-mapper"
import { OCR_CONFIG } from "../constants"

let TesseractModule: typeof import("tesseract.js") | null = null

async function getTesseract() {
  if (!TesseractModule) {
    TesseractModule = await import("tesseract.js")
  }
  return TesseractModule.default
}

export interface OCRResult {
  pages: OCRPage[]
  confidence: number
  engine: "tesseract" | "google_vision"
  processingTimeMs: number
}

export interface OCRPage {
  pageNumber: number
  text: string
  blocks: OCRBlock[]
  confidence: number
}

export interface OCRBlock {
  text: string
  confidence: number
  bounds: BoundingBox
  words: WordInfo[]
}

/**
 * Perform OCR on a page image
 */
export async function performOCR(
  imageData: Buffer | string, // Can be buffer or base64
  pageNumber: number,
  pageDimensions: { width: number; height: number },
  language: string = OCR_CONFIG.default_language,
): Promise<OCRPage> {
  const startTime = Date.now()

  try {
    const Tesseract = await getTesseract()

    // Use Tesseract.js for OCR
    const result = await Tesseract.recognize(imageData, language, {
      logger: () => {}, // Suppress logs
    })

    const blocks: OCRBlock[] = []

    // Process paragraphs/blocks
    result.data.paragraphs?.forEach((para) => {
      const words: WordInfo[] = []

      para.words?.forEach((word) => {
        words.push({
          text: word.text,
          position: {
            x: word.bbox.x0,
            y: pageDimensions.height - word.bbox.y1, // Convert to PDF coords
            width: word.bbox.x1 - word.bbox.x0,
            height: word.bbox.y1 - word.bbox.y0,
          },
          confidence: word.confidence / 100,
        })
      })

      blocks.push({
        text: para.text,
        confidence: para.confidence / 100,
        bounds: {
          x: para.bbox.x0,
          y: pageDimensions.height - para.bbox.y1,
          width: para.bbox.x1 - para.bbox.x0,
          height: para.bbox.y1 - para.bbox.y0,
        },
        words,
      })
    })

    return {
      pageNumber,
      text: result.data.text,
      blocks,
      confidence: result.data.confidence / 100,
    }
  } catch (error) {
    console.error("OCR failed:", error)
    return {
      pageNumber,
      text: "",
      blocks: [],
      confidence: 0,
    }
  }
}

/**
 * Convert OCR result to TextBlocks
 */
export function ocrToTextBlocks(ocrPage: OCRPage, pageDimensions: { width: number; height: number }): TextBlock[] {
  const textBlocks: TextBlock[] = []
  let lineIndex = 0
  let paragraphIndex = 0

  ocrPage.blocks.forEach((block, blockIdx) => {
    // Split block into lines
    const lines = block.text.split("\n").filter((l) => l.trim())

    lines.forEach((lineText, lineIdx) => {
      // Find words for this line
      const lineWords = block.words.filter((w) => lineText.includes(w.text))

      const position =
        lineWords.length > 0
          ? {
              x: Math.min(...lineWords.map((w) => w.position.x)),
              y: Math.min(...lineWords.map((w) => w.position.y)),
              width:
                Math.max(...lineWords.map((w) => w.position.x + w.position.width)) -
                Math.min(...lineWords.map((w) => w.position.x)),
              height: Math.max(...lineWords.map((w) => w.position.height)),
            }
          : block.bounds

      textBlocks.push({
        id: `ocr-${ocrPage.pageNumber}-${blockIdx}-${lineIdx}`,
        text: lineText,
        position,
        position_normalized: pdfToNormalized(position, pageDimensions),
        font: defaultOCRFont(),
        block_type: classifyOCRBlock(lineText, position, pageDimensions),
        line_index: lineIndex++,
        paragraph_index: paragraphIndex,
        confidence: block.confidence,
        words: lineWords.length > 0 ? lineWords : null,
      })
    })

    paragraphIndex++
  })

  return textBlocks
}

/**
 * Default font for OCR text (we can't detect actual font)
 */
function defaultOCRFont(): FontInfo {
  return {
    name: "unknown",
    family: null,
    size: 12,
    weight: "normal",
    style: "normal",
    color: "#000000",
  }
}

/**
 * Classify OCR text block type
 */
function classifyOCRBlock(
  text: string,
  position: BoundingBox,
  pageDimensions: { width: number; height: number },
): TextBlock["block_type"] {
  const normalizedY = position.y / pageDimensions.height

  // Headers/footers by position
  if (normalizedY > 0.9) return "header"
  if (normalizedY < 0.1) return "footer"

  // Page numbers
  if (text.match(/^\d+$/) && (normalizedY < 0.1 || normalizedY > 0.9)) {
    return "page_number"
  }

  // Labels
  if (text.trim().endsWith(":")) return "label"

  // List items
  if (text.match(/^[\u2022\u2023\u25E6\u2043\u2219•-]\s/)) return "list_item"
  if (text.match(/^\d+[.)]\s/)) return "list_item"

  // All caps might be heading
  if (text === text.toUpperCase() && text.length > 3 && text.length < 100) {
    return "heading_2"
  }

  return "paragraph"
}

/**
 * Merge OCR results with existing parsed page
 */
export function mergeOCRWithPage(page: ParsedPage, ocrPage: OCRPage): ParsedPage {
  const ocrBlocks = ocrToTextBlocks(ocrPage, {
    width: page.width,
    height: page.height,
  })

  return {
    ...page,
    content: {
      ...page.content,
      full_text: ocrPage.text,
      text_blocks: ocrBlocks,
    },
    is_scanned: true,
    ocr_confidence: ocrPage.confidence,
  }
}

/**
 * Render PDF page to image for OCR
 * This function creates an image from a PDF page for OCR processing
 */
export async function renderPageToImage(
  pdfPage: any, // pdfjsLib.PDFPageProxy
  scale = 2.0,
): Promise<Buffer> {
  // This requires a canvas implementation
  // In Node.js, we'd use node-canvas or similar
  // For now, return a placeholder - actual implementation depends on environment

  const viewport = pdfPage.getViewport({ scale })

  // In browser, we could use canvas:
  // const canvas = document.createElement('canvas')
  // canvas.width = viewport.width
  // canvas.height = viewport.height
  // const context = canvas.getContext('2d')
  // await pdfPage.render({ canvasContext: context, viewport }).promise
  // return canvas.toDataURL('image/png')

  // In Node.js with node-canvas:
  // const { createCanvas } = require('canvas')
  // const canvas = createCanvas(viewport.width, viewport.height)
  // ...

  throw new Error("Page rendering requires canvas implementation - use in browser or with node-canvas")
}

/**
 * Check if a page needs OCR
 */
export function pageNeedsOCR(page: ParsedPage): boolean {
  // If page has very little text, it's likely scanned
  const textLength = page.content.full_text.length
  const pageArea = page.width * page.height

  // Less than 100 characters per 100,000 square points
  const textDensity = textLength / (pageArea / 100000)

  return textDensity < OCR_CONFIG.min_text_density || page.is_scanned
}
