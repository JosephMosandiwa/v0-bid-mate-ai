// ============================================
// DOCUMIND ENGINE - PDF PARSER MODULE
// Uses unpdf for text extraction (server-compatible)
// Uses pdf-lib for form field extraction
// ============================================

import type {
  ParsedPage,
  TextBlock,
  FormField,
  FormFieldType,
  FormFieldOption,
  FontInfo,
  BoundingBox,
  TextBlockType,
  DocumentMetadata,
  DocumentType,
} from "../types"
import { pdfToNormalized } from "../utils/position-mapper"
import { DOCUMENT_TYPE_PATTERNS, OCR_CONFIG } from "../constants"

let PDFDocumentModule: typeof import("pdf-lib").PDFDocument | null = null

async function getPdfLib() {
  if (!PDFDocumentModule) {
    const pdfLib = await import("pdf-lib")
    PDFDocumentModule = pdfLib.PDFDocument
  }
  return PDFDocumentModule
}

export interface PDFParseResult {
  metadata: DocumentMetadata
  pages: ParsedPage[]
  formFields: FormField[]
  rawText: string
  isScanned: boolean
}

export interface PDFParseOptions {
  extractImages?: boolean
  maxPages?: number
  password?: string
}

/**
 * Main PDF parsing function
 * Now uses unpdf for server-compatible text extraction
 */
export async function parsePDF(data: ArrayBuffer | Uint8Array, options: PDFParseOptions = {}): Promise<PDFParseResult> {
  const { maxPages } = options

  const { getDocumentProxy, extractText } = await import("unpdf")

  // Convert to Uint8Array if needed
  const uint8Data = data instanceof ArrayBuffer ? new Uint8Array(data) : data

  // Load PDF with unpdf
  const pdf = await getDocumentProxy(uint8Data)
  const pageCount = pdf.numPages

  // Determine page range
  const pagesToProcess = maxPages ? Math.min(pageCount, maxPages) : pageCount

  const mergedResult = await extractText(pdf, { mergePages: true })
  const fullText =
    typeof mergedResult.text === "string" ? mergedResult.text : (mergedResult.text as string[]).join("\n\n")

  // Extract text per page - returns array when mergePages: false
  const perPageResult = await extractText(pdf, { mergePages: false })
  const pageTexts: string[] = Array.isArray(perPageResult.text) ? perPageResult.text : [perPageResult.text as string]

  // Get page dimensions from pdf-lib
  const PDFDocument = await getPdfLib()
  const pdfDoc = await PDFDocument.load(uint8Data, { ignoreEncryption: true })

  // Build pages
  const pages: ParsedPage[] = []
  let totalTextLength = 0

  for (let i = 0; i < pagesToProcess; i++) {
    const pageText = pageTexts[i] || ""
    const page = pdfDoc.getPage(i)
    const { width, height } = page.getSize()

    const parsedPage = createParsedPage(pageText, i + 1, width, height)
    pages.push(parsedPage)
    totalTextLength += pageText.length
  }

  // Detect if document is scanned (low text density)
  const avgTextPerPage = totalTextLength / pagesToProcess
  const isScanned = avgTextPerPage < OCR_CONFIG.min_text_density * 1000

  // Extract form fields using pdf-lib
  const formFields = await extractFormFields(uint8Data)

  // Extract metadata using pdf-lib
  const metadata = await extractMetadataFromPdfLib(uint8Data, pageCount, isScanned, fullText)

  return {
    metadata,
    pages,
    formFields,
    rawText: fullText,
    isScanned,
  }
}

/**
 * Create a parsed page from text content
 * Simplified page creation without pdfjs position data
 */
function createParsedPage(pageText: string, pageNumber: number, width: number, height: number): ParsedPage {
  const textBlocks = createTextBlocks(pageText, pageNumber, width, height)
  const isScanned = pageText.length < OCR_CONFIG.min_text_density * 1000

  return {
    page_number: pageNumber,
    width,
    height,
    rotation: 0,
    content: {
      full_text: pageText,
      text_blocks: textBlocks,
      lines: [], // Line detection requires visual analysis - will be enhanced later
      rectangles: [], // Rectangle detection requires visual analysis
      images: [],
    },
    is_scanned: isScanned,
    ocr_confidence: null,
  }
}

/**
 * Create text blocks from page text
 * Creates logical text blocks from extracted text
 */
function createTextBlocks(pageText: string, pageNumber: number, pageWidth: number, pageHeight: number): TextBlock[] {
  const blocks: TextBlock[] = []
  const lines = pageText.split("\n").filter((line) => line.trim())

  let yPosition = pageHeight - 50 // Start from top
  const lineHeight = 14

  lines.forEach((line, index) => {
    const trimmedLine = line.trim()
    if (!trimmedLine) return

    // Estimate position based on line index
    const position: BoundingBox = {
      x: 50,
      y: yPosition,
      width: Math.min(trimmedLine.length * 7, pageWidth - 100),
      height: lineHeight,
    }

    // Classify the block type
    const blockType = classifyTextBlockFromContent(trimmedLine)
    const font = estimateFontFromBlockType(blockType)

    blocks.push({
      id: `tb-${pageNumber}-${index}`,
      text: trimmedLine,
      position,
      position_normalized: pdfToNormalized(position, { width: pageWidth, height: pageHeight }),
      font,
      block_type: blockType,
      line_index: index,
      paragraph_index: Math.floor(index / 5),
      confidence: 0.8, // Estimated confidence
      words: null,
    })

    yPosition -= lineHeight * 1.5
  })

  return blocks
}

/**
 * Classify text block type from content
 */
function classifyTextBlockFromContent(text: string): TextBlockType {
  const trimmed = text.trim()

  // Check for headings (all caps, short, or numbered sections)
  if (trimmed === trimmed.toUpperCase() && trimmed.length < 100 && trimmed.length > 2) {
    return "heading_1"
  }

  // Check for section numbers like "1.", "1.1", "Section 1"
  if (/^(\d+\.?\d*\.?\d*|\w+\s+\d+)[.:]\s/.test(trimmed)) {
    if (trimmed.length < 80) return "heading_2"
  }

  // Check for labels (ends with colon)
  if (trimmed.endsWith(":") && trimmed.length < 50) {
    return "label"
  }

  // Check for list items
  if (/^[\u2022\u2023\u25E6\u2043\u2219•\-*]\s/.test(trimmed)) {
    return "list_item"
  }
  if (/^\d+[.)]\s/.test(trimmed)) {
    return "list_item"
  }

  // Check for page numbers
  if (/^(Page\s*)?\d+(\s*of\s*\d+)?$/i.test(trimmed)) {
    return "page_number"
  }

  return "paragraph"
}

/**
 * Estimate font info from block type
 */
function estimateFontFromBlockType(blockType: TextBlockType): FontInfo {
  const baseFontSize = 12

  switch (blockType) {
    case "heading_1":
      return {
        name: "Helvetica-Bold",
        family: "Helvetica",
        size: 18,
        weight: "bold",
        style: "normal",
        color: "#000000",
      }
    case "heading_2":
      return {
        name: "Helvetica-Bold",
        family: "Helvetica",
        size: 14,
        weight: "bold",
        style: "normal",
        color: "#000000",
      }
    case "heading_3":
      return {
        name: "Helvetica-Bold",
        family: "Helvetica",
        size: 12,
        weight: "bold",
        style: "normal",
        color: "#000000",
      }
    case "label":
      return {
        name: "Helvetica-Bold",
        family: "Helvetica",
        size: 11,
        weight: "bold",
        style: "normal",
        color: "#000000",
      }
    default:
      return {
        name: "Helvetica",
        family: "Helvetica",
        size: baseFontSize,
        weight: "normal",
        style: "normal",
        color: "#000000",
      }
  }
}

/**
 * Extract metadata using pdf-lib
 * New function to get metadata from pdf-lib instead of pdfjs
 */
async function extractMetadataFromPdfLib(
  data: Uint8Array,
  pageCount: number,
  isScanned: boolean,
  fullText: string,
): Promise<DocumentMetadata> {
  try {
    const PDFDocument = await getPdfLib()
    const pdfDoc = await PDFDocument.load(data, { ignoreEncryption: true })

    return {
      title: pdfDoc.getTitle() || null,
      author: pdfDoc.getAuthor() || null,
      subject: pdfDoc.getSubject() || null,
      creator: pdfDoc.getCreator() || null,
      producer: pdfDoc.getProducer() || null,
      creation_date: pdfDoc.getCreationDate()?.toISOString() || null,
      modification_date: pdfDoc.getModificationDate()?.toISOString() || null,
      page_count: pageCount,
      pdf_version: null,
      is_encrypted: false,
      is_scanned: isScanned,
      detected_language: "en",
      detected_type: detectDocumentType(fullText),
    }
  } catch (error) {
    console.error("Error extracting metadata:", error)
    return {
      title: null,
      author: null,
      subject: null,
      creator: null,
      producer: null,
      creation_date: null,
      modification_date: null,
      page_count: pageCount,
      pdf_version: null,
      is_encrypted: false,
      is_scanned: isScanned,
      detected_language: "en",
      detected_type: detectDocumentType(fullText),
    }
  }
}

/**
 * Extract form fields using pdf-lib
 */
async function extractFormFields(data: Uint8Array): Promise<FormField[]> {
  try {
    const PDFDocument = await getPdfLib()
    const pdfDoc = await PDFDocument.load(data, { ignoreEncryption: true })
    const form = pdfDoc.getForm()
    const fields = form.getFields()
    const formFields: FormField[] = []

    for (const field of fields) {
      const widgets = field.acroField.getWidgets()
      if (widgets.length === 0) continue

      const widget = widgets[0]
      const rect = widget.getRectangle()
      const page = pdfDoc.getPages().findIndex((p) => {
        const pageRef = p.ref
        const widgetPage = widget.P()
        return widgetPage && pageRef.toString() === widgetPage.toString()
      })

      const pageObj = pdfDoc.getPage(Math.max(0, page))
      const { width: pageWidth, height: pageHeight } = pageObj.getSize()

      const position: BoundingBox = {
        x: rect.x,
        y: rect.y,
        width: rect.width,
        height: rect.height,
      }

      const fieldType = getFieldType(field)
      const fieldValue = getFieldValue(field, fieldType)
      const options = getFieldOptions(field, fieldType)

      formFields.push({
        id: field.getName(),
        name: field.getName(),
        type: fieldType,
        page: Math.max(1, page + 1),
        position,
        position_normalized: pdfToNormalized(position, {
          width: pageWidth,
          height: pageHeight,
        }),
        value: fieldValue,
        default_value: null,
        is_required: field.isRequired(),
        is_readonly: field.isReadOnly(),
        max_length: null,
        options,
        font: null,
        text_alignment: "left",
        format: null,
      })
    }

    return formFields
  } catch (error) {
    console.error("Error extracting form fields:", error)
    return []
  }
}

/**
 * Determine field type from pdf-lib field
 */
function getFieldType(field: any): FormFieldType {
  const constructor = field.constructor.name

  switch (constructor) {
    case "PDFTextField":
      return "text"
    case "PDFCheckBox":
      return "checkbox"
    case "PDFRadioGroup":
      return "radio"
    case "PDFDropdown":
      return "select"
    case "PDFSignature":
      return "signature"
    case "PDFButton":
      return "button"
    default:
      return "text"
  }
}

/**
 * Get field value based on type
 */
function getFieldValue(field: any, type: FormFieldType): string | boolean | string[] | null {
  try {
    switch (type) {
      case "checkbox":
        return field.isChecked()
      case "radio":
        return field.getSelected() || null
      case "select":
        return field.getSelected() || []
      case "text":
        return field.getText() || null
      default:
        return null
    }
  } catch {
    return null
  }
}

/**
 * Get field options for select/radio
 */
function getFieldOptions(field: any, type: FormFieldType): FormFieldOption[] {
  if (type !== "select" && type !== "radio") return []

  try {
    const options = field.getOptions?.() || []
    return options.map((opt: string, idx: number) => ({
      value: opt,
      label: opt,
      is_default: idx === 0,
    }))
  } catch {
    return []
  }
}

/**
 * Detect document type from content
 */
function detectDocumentType(text: string): DocumentType {
  const lowerText = text.toLowerCase()

  for (const [type, patterns] of Object.entries(DOCUMENT_TYPE_PATTERNS)) {
    for (const pattern of patterns) {
      if (pattern.test(lowerText)) {
        return type as DocumentType
      }
    }
  }

  return "unknown"
}
