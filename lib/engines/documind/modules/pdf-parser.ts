// ============================================
// DOCUMIND ENGINE - PDF PARSER MODULE
// Uses pdfjs-dist for parsing and pdf-lib for form fields
// ============================================

import * as pdfjsLib from "pdfjs-dist"
import { PDFDocument } from "pdf-lib"
import type {
  ParsedPage,
  TextBlock,
  LineElement,
  RectElement,
  ImageElement,
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

// Configure PDF.js worker
if (typeof window === "undefined") {
  // Server-side: use node worker
  pdfjsLib.GlobalWorkerOptions.workerSrc = ""
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
 */
export async function parsePDF(data: ArrayBuffer | Uint8Array, options: PDFParseOptions = {}): Promise<PDFParseResult> {
  const { extractImages = false, maxPages, password } = options

  // Load with pdfjs-dist for text extraction
  const loadingTask = pdfjsLib.getDocument({
    data,
    password,
    useSystemFonts: true,
  })

  const pdfDoc = await loadingTask.promise

  // Extract metadata
  const metadata = await extractMetadata(pdfDoc)

  // Determine page range
  const pageCount = pdfDoc.numPages
  const pagesToProcess = maxPages ? Math.min(pageCount, maxPages) : pageCount

  // Parse each page
  const pages: ParsedPage[] = []
  let fullText = ""
  let totalTextLength = 0

  for (let i = 1; i <= pagesToProcess; i++) {
    const page = await pdfDoc.getPage(i)
    const parsedPage = await parsePage(page, i, extractImages)
    pages.push(parsedPage)
    fullText += parsedPage.content.full_text + "\n\n"
    totalTextLength += parsedPage.content.full_text.length
  }

  // Detect if document is scanned (low text density)
  const avgTextPerPage = totalTextLength / pagesToProcess
  const isScanned = avgTextPerPage < OCR_CONFIG.min_text_density * 1000

  // Extract form fields using pdf-lib
  const formFields = await extractFormFields(data)

  // Detect document type from content
  metadata.detected_type = detectDocumentType(fullText)
  metadata.is_scanned = isScanned
  metadata.page_count = pageCount

  return {
    metadata,
    pages,
    formFields,
    rawText: fullText,
    isScanned,
  }
}

/**
 * Extract PDF metadata
 */
async function extractMetadata(pdfDoc: pdfjsLib.PDFDocumentProxy): Promise<DocumentMetadata> {
  const info = await pdfDoc.getMetadata()
  const pdfInfo = info.info as Record<string, any>

  return {
    title: pdfInfo?.Title || null,
    author: pdfInfo?.Author || null,
    subject: pdfInfo?.Subject || null,
    creator: pdfInfo?.Creator || null,
    producer: pdfInfo?.Producer || null,
    creation_date: pdfInfo?.CreationDate ? parsePDFDate(pdfInfo.CreationDate) : null,
    modification_date: pdfInfo?.ModDate ? parsePDFDate(pdfInfo.ModDate) : null,
    page_count: pdfDoc.numPages,
    pdf_version: pdfInfo?.PDFFormatVersion || null,
    is_encrypted: false, // Would have failed earlier if encrypted without password
    is_scanned: false, // Will be updated after parsing
    detected_language: "en", // Default, can be updated by OCR
    detected_type: "unknown",
  }
}

/**
 * Parse a single page
 */
async function parsePage(page: pdfjsLib.PDFPageProxy, pageNumber: number, extractImages: boolean): Promise<ParsedPage> {
  const viewport = page.getViewport({ scale: 1.0 })
  const pageDimensions = { width: viewport.width, height: viewport.height }

  // Get text content with positions
  const textContent = await page.getTextContent()
  const textBlocks = processTextContent(textContent, pageDimensions, pageNumber)

  // Get operator list for lines and rectangles
  const operatorList = await page.getOperatorList()
  const { lines, rectangles } = processOperatorList(operatorList, pageDimensions)

  // Extract images if requested
  const images: ImageElement[] = extractImages ? await extractPageImages(page, pageDimensions) : []

  // Build full text from blocks
  const fullText = textBlocks.map((b) => b.text).join(" ")

  // Detect if page is scanned
  const isScanned = fullText.length < OCR_CONFIG.min_text_density * 1000

  return {
    page_number: pageNumber,
    width: viewport.width,
    height: viewport.height,
    rotation: viewport.rotation,
    content: {
      full_text: fullText,
      text_blocks: textBlocks,
      lines,
      rectangles,
      images,
    },
    is_scanned: isScanned,
    ocr_confidence: null,
  }
}

/**
 * Process text content from PDF.js
 */
function processTextContent(
  textContent: pdfjsLib.TextContent,
  pageDimensions: { width: number; height: number },
  pageNumber: number,
): TextBlock[] {
  const blocks: TextBlock[] = []
  let lineIndex = 0
  let paragraphIndex = 0
  let lastY = -1

  textContent.items.forEach((item, index) => {
    if (!("str" in item) || !item.str.trim()) return

    const textItem = item as pdfjsLib.TextItem

    // Get transform matrix for position
    const [, , , , x, y] = textItem.transform

    // Create bounding box
    const position: BoundingBox = {
      x,
      y,
      width: textItem.width,
      height: textItem.height,
    }

    // Detect line/paragraph changes
    if (lastY !== -1 && Math.abs(y - lastY) > textItem.height * 0.5) {
      lineIndex++
      if (Math.abs(y - lastY) > textItem.height * 2) {
        paragraphIndex++
      }
    }
    lastY = y

    // Extract font info
    const font = extractFontInfo(textItem)

    // Classify block type
    const blockType = classifyTextBlock(textItem.str, font, position, pageDimensions)

    blocks.push({
      id: `tb-${pageNumber}-${index}`,
      text: textItem.str,
      position,
      position_normalized: pdfToNormalized(position, pageDimensions),
      font,
      block_type: blockType,
      line_index: lineIndex,
      paragraph_index: paragraphIndex,
      confidence: null,
      words: null,
    })
  })

  return blocks
}

/**
 * Extract font information from text item
 */
function extractFontInfo(textItem: pdfjsLib.TextItem): FontInfo {
  const fontName = textItem.fontName || "unknown"
  const isBold = fontName.toLowerCase().includes("bold") || fontName.toLowerCase().includes("black")
  const isItalic = fontName.toLowerCase().includes("italic") || fontName.toLowerCase().includes("oblique")

  return {
    name: fontName,
    family: fontName.split("-")[0] || null,
    size: textItem.height || 12,
    weight: isBold ? "bold" : "normal",
    style: isItalic ? "italic" : "normal",
    color: "#000000", // PDF.js doesn't easily expose color
  }
}

/**
 * Classify text block type based on characteristics
 */
function classifyTextBlock(
  text: string,
  font: FontInfo,
  position: BoundingBox,
  pageDimensions: { width: number; height: number },
): TextBlockType {
  const normalizedY = position.y / pageDimensions.height
  const normalizedX = position.x / pageDimensions.width

  // Headers are typically at top of page
  if (normalizedY > 0.9) {
    return "header"
  }

  // Footers at bottom
  if (normalizedY < 0.1) {
    return "footer"
  }

  // Page numbers are small and at edges
  if (text.match(/^\d+$/) && (normalizedY < 0.1 || normalizedY > 0.9)) {
    return "page_number"
  }

  // Headings are typically bold and larger
  if (font.weight === "bold" && font.size > 14) {
    if (font.size > 18) return "heading_1"
    if (font.size > 16) return "heading_2"
    return "heading_3"
  }

  // Labels often end with colon
  if (text.trim().endsWith(":")) {
    return "label"
  }

  // List items start with bullets or numbers
  if (text.match(/^[\u2022\u2023\u25E6\u2043\u2219•-]\s/)) {
    return "list_item"
  }
  if (text.match(/^\d+[.)]\s/)) {
    return "list_item"
  }

  return "paragraph"
}

/**
 * Process operator list for lines and rectangles
 */
function processOperatorList(
  operatorList: pdfjsLib.PDFOperatorList,
  pageDimensions: { width: number; height: number },
): { lines: LineElement[]; rectangles: RectElement[] } {
  const lines: LineElement[] = []
  const rectangles: RectElement[] = []

  // PDF operators for drawing
  const OPS = pdfjsLib.OPS

  let lineId = 0
  let rectId = 0
  let currentPath: { x: number; y: number }[] = []
  let currentColor = "#000000"
  let lineWidth = 1

  for (let i = 0; i < operatorList.fnArray.length; i++) {
    const op = operatorList.fnArray[i]
    const args = operatorList.argsArray[i]

    switch (op) {
      case OPS.setLineWidth:
        lineWidth = args[0]
        break

      case OPS.setStrokeRGBColor:
        currentColor = rgbToHex(args[0], args[1], args[2])
        break

      case OPS.moveTo:
        currentPath = [{ x: args[0], y: args[1] }]
        break

      case OPS.lineTo:
        if (currentPath.length > 0) {
          currentPath.push({ x: args[0], y: args[1] })
        }
        break

      case OPS.stroke:
        if (currentPath.length >= 2) {
          for (let j = 0; j < currentPath.length - 1; j++) {
            const start = currentPath[j]
            const end = currentPath[j + 1]

            // Determine line type
            const isHorizontal = Math.abs(start.y - end.y) < 2
            const isVertical = Math.abs(start.x - end.x) < 2

            if (isHorizontal || isVertical) {
              const lineLength = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2))

              // Only include significant lines (> 20 points)
              if (lineLength > 20) {
                const isFormLine =
                  isHorizontal && lineWidth <= 1.5 && lineLength > 50 && lineLength < pageDimensions.width * 0.8

                lines.push({
                  id: `line-${lineId++}`,
                  type: isHorizontal ? "horizontal" : isVertical ? "vertical" : "diagonal",
                  start,
                  end,
                  thickness: lineWidth,
                  color: currentColor,
                  style: "solid",
                  is_form_line: isFormLine,
                  associated_label_id: null,
                })
              }
            }
          }
        }
        currentPath = []
        break

      case OPS.rectangle:
        const [x, y, w, h] = args
        if (Math.abs(w) > 5 && Math.abs(h) > 5) {
          // Classify rectangle type
          const aspectRatio = Math.abs(w) / Math.abs(h)
          const isSquare = aspectRatio > 0.8 && aspectRatio < 1.2
          const isSmall = Math.abs(w) < 20 && Math.abs(h) < 20

          let rectType: RectElement["rect_type"] = "unknown"
          if (isSquare && isSmall) {
            rectType = "checkbox"
          } else if (Math.abs(h) < 30 && Math.abs(w) > 50) {
            rectType = "text_box"
          } else if (Math.abs(w) > pageDimensions.width * 0.9) {
            rectType = "border"
          }

          rectangles.push({
            id: `rect-${rectId++}`,
            position: {
              x: Math.min(x, x + w),
              y: Math.min(y, y + h),
              width: Math.abs(w),
              height: Math.abs(h),
            },
            fill_color: null,
            stroke_color: currentColor,
            stroke_width: lineWidth,
            rect_type: rectType,
          })
        }
        break
    }
  }

  return { lines, rectangles }
}

/**
 * Extract images from page (placeholder - full implementation needs more work)
 */
async function extractPageImages(
  page: pdfjsLib.PDFPageProxy,
  pageDimensions: { width: number; height: number },
): Promise<ImageElement[]> {
  // Image extraction is complex and requires rendering
  // For now, return empty array - can be enhanced later
  return []
}

/**
 * Extract form fields using pdf-lib
 */
async function extractFormFields(data: ArrayBuffer | Uint8Array): Promise<FormField[]> {
  try {
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

/**
 * Parse PDF date string to ISO format
 */
function parsePDFDate(dateStr: string): string | null {
  // PDF date format: D:YYYYMMDDHHmmSSOHH'mm'
  const match = dateStr.match(/D:(\d{4})(\d{2})(\d{2})(\d{2})?(\d{2})?(\d{2})?/)
  if (!match) return null

  const [, year, month, day, hour = "00", minute = "00", second = "00"] = match
  return new Date(
    Number.parseInt(year),
    Number.parseInt(month) - 1,
    Number.parseInt(day),
    Number.parseInt(hour),
    Number.parseInt(minute),
    Number.parseInt(second),
  ).toISOString()
}

/**
 * Convert RGB to hex
 */
function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) =>
    Math.round(n * 255)
      .toString(16)
      .padStart(2, "0")
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}
