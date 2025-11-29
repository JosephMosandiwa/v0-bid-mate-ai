// ============================================
// DOCUMIND ENGINE - LAYOUT ANALYZER MODULE
// Analyzes document structure and detects regions
// ============================================

import type {
  ParsedPage,
  TextBlock,
  LineElement,
  RectElement,
  DocumentLayout,
  DocumentSection,
  TableRegion,
  FormRegion,
  DetectedField,
  DocumentType,
  InputType,
  DetectionMethod,
  FieldDataType,
  BoundingBox,
} from "../types"
import { boxDistance, boxesOverlap, mergeBoxes, pdfToNormalized } from "../utils/position-mapper"
import { FIELD_DETECTION } from "../constants"

export interface LayoutAnalysisResult {
  layout: DocumentLayout
  detectedFields: DetectedField[]
  tableRegions: TableRegion[]
}

/**
 * Main layout analysis function
 */
export function analyzeLayout(pages: ParsedPage[], documentType: DocumentType): LayoutAnalysisResult {
  // Extract sections from headings
  const sections = extractSections(pages)

  // Find title
  const title = findDocumentTitle(pages)

  // Detect table regions
  const tableRegions = detectTableRegions(pages)

  // Detect form regions and fields
  const { formRegions, detectedFields } = detectFormRegions(pages)

  // Build reading order
  const readingOrder = buildReadingOrder(pages)

  return {
    layout: {
      document_type: documentType,
      title,
      sections,
      table_regions: tableRegions,
      form_regions: formRegions,
      reading_order: readingOrder,
    },
    detectedFields,
    tableRegions,
  }
}

/**
 * Extract document sections from headings
 */
function extractSections(pages: ParsedPage[]): DocumentSection[] {
  const sections: DocumentSection[] = []
  let currentSection: DocumentSection | null = null
  let sectionId = 0

  pages.forEach((page) => {
    page.content.text_blocks.forEach((block) => {
      if (block.block_type.startsWith("heading")) {
        const level = Number.parseInt(block.block_type.split("_")[1]) || 1

        const newSection: DocumentSection = {
          id: `section-${sectionId++}`,
          title: block.text,
          level,
          page_start: page.page_number,
          page_end: page.page_number,
          block_ids: [block.id],
          subsections: [],
        }

        if (level === 1) {
          // Top-level section
          if (currentSection) {
            sections.push(currentSection)
          }
          currentSection = newSection
        } else if (currentSection) {
          // Subsection
          if (level === 2) {
            currentSection.subsections.push(newSection)
          } else if (level === 3 && currentSection.subsections.length > 0) {
            const lastSubsection = currentSection.subsections[currentSection.subsections.length - 1]
            lastSubsection.subsections.push(newSection)
          }
        } else {
          currentSection = newSection
        }
      } else if (currentSection) {
        // Add content blocks to current section
        currentSection.block_ids.push(block.id)
        currentSection.page_end = page.page_number
      }
    })
  })

  if (currentSection) {
    sections.push(currentSection)
  }

  return sections
}

/**
 * Find document title (first prominent heading or first large text)
 */
function findDocumentTitle(pages: ParsedPage[]): TextBlock | null {
  if (pages.length === 0) return null

  const firstPage = pages[0]

  // Look for heading_1
  const h1 = firstPage.content.text_blocks.find((b) => b.block_type === "heading_1")
  if (h1) return h1

  // Look for largest text in top half of page
  const topHalfBlocks = firstPage.content.text_blocks.filter((b) => b.position_normalized.y < 0.5)

  if (topHalfBlocks.length === 0) return null

  return topHalfBlocks.reduce((largest, block) => (block.font.size > largest.font.size ? block : largest))
}

/**
 * Detect table regions
 */
function detectTableRegions(pages: ParsedPage[]): TableRegion[] {
  const tableRegions: TableRegion[] = []
  let tableId = 0

  pages.forEach((page) => {
    const pageDimensions = { width: page.width, height: page.height }

    // Method 1: Find grid patterns from lines
    const gridRegions = findGridPatterns(page.content.lines, pageDimensions)

    // Method 2: Find aligned text patterns (columns of data)
    const textTableRegions = findTextTablePatterns(page.content.text_blocks, pageDimensions)

    // Merge detected regions
    const mergedRegions = mergeOverlappingRegions([...gridRegions, ...textTableRegions])

    mergedRegions.forEach((region) => {
      tableRegions.push({
        id: `table-${tableId++}`,
        page: page.page_number,
        position: region.position,
        position_normalized: pdfToNormalized(region.position, pageDimensions),
        row_count_estimate: region.rows,
        column_count_estimate: region.cols,
        has_header: region.hasHeader,
        extraction_status: "pending",
        table_data: null,
      })
    })
  })

  return tableRegions
}

/**
 * Find grid patterns from horizontal and vertical lines
 */
function findGridPatterns(
  lines: LineElement[],
  pageDimensions: { width: number; height: number },
): Array<{
  position: BoundingBox
  rows: number
  cols: number
  hasHeader: boolean
}> {
  const horizontalLines = lines.filter((l) => l.type === "horizontal")
  const verticalLines = lines.filter((l) => l.type === "vertical")

  if (horizontalLines.length < 2 || verticalLines.length < 2) {
    return []
  }

  // Group lines by proximity
  const hGroups = groupLinesByPosition(horizontalLines, "y")
  const vGroups = groupLinesByPosition(verticalLines, "x")

  const grids: Array<{
    position: BoundingBox
    rows: number
    cols: number
    hasHeader: boolean
  }> = []

  // Find intersecting line groups that form grids
  if (hGroups.length >= 2 && vGroups.length >= 2) {
    const minX = Math.min(...verticalLines.map((l) => l.start.x))
    const maxX = Math.max(...verticalLines.map((l) => l.start.x))
    const minY = Math.min(...horizontalLines.map((l) => l.start.y))
    const maxY = Math.max(...horizontalLines.map((l) => l.start.y))

    grids.push({
      position: {
        x: minX,
        y: minY,
        width: maxX - minX,
        height: maxY - minY,
      },
      rows: hGroups.length - 1,
      cols: vGroups.length - 1,
      hasHeader: true, // Assume first row is header
    })
  }

  return grids
}

/**
 * Group lines by their position
 */
function groupLinesByPosition(lines: LineElement[], axis: "x" | "y"): number[][] {
  const tolerance = 5
  const positions = lines.map((l) => l.start[axis])
  const groups: number[][] = []

  positions.sort((a, b) => a - b)

  let currentGroup: number[] = []
  let lastPos = Number.NEGATIVE_INFINITY

  positions.forEach((pos) => {
    if (pos - lastPos > tolerance) {
      if (currentGroup.length > 0) {
        groups.push(currentGroup)
      }
      currentGroup = [pos]
    } else {
      currentGroup.push(pos)
    }
    lastPos = pos
  })

  if (currentGroup.length > 0) {
    groups.push(currentGroup)
  }

  return groups
}

/**
 * Find table patterns from aligned text blocks
 */
function findTextTablePatterns(
  blocks: TextBlock[],
  pageDimensions: { width: number; height: number },
): Array<{
  position: BoundingBox
  rows: number
  cols: number
  hasHeader: boolean
}> {
  // Group blocks by similar Y positions (rows)
  const rowGroups = groupBlocksByRow(blocks)

  // Find sequences of rows with similar column structure
  const tables: Array<{
    position: BoundingBox
    rows: number
    cols: number
    hasHeader: boolean
  }> = []

  let tableStart = -1
  let lastColCount = 0
  let tableBlocks: TextBlock[] = []

  rowGroups.forEach((row, idx) => {
    const colCount = estimateColumnCount(row)

    if (colCount >= 2) {
      if (tableStart === -1) {
        tableStart = idx
        lastColCount = colCount
        tableBlocks = [...row]
      } else if (Math.abs(colCount - lastColCount) <= 1) {
        tableBlocks.push(...row)
      } else {
        // End current table, start new
        if (tableBlocks.length >= 4) {
          tables.push(createTableFromBlocks(tableBlocks, lastColCount))
        }
        tableStart = idx
        lastColCount = colCount
        tableBlocks = [...row]
      }
    } else {
      if (tableBlocks.length >= 4) {
        tables.push(createTableFromBlocks(tableBlocks, lastColCount))
      }
      tableStart = -1
      tableBlocks = []
    }
  })

  if (tableBlocks.length >= 4) {
    tables.push(createTableFromBlocks(tableBlocks, lastColCount))
  }

  return tables
}

/**
 * Group text blocks by row (similar Y position)
 */
function groupBlocksByRow(blocks: TextBlock[]): TextBlock[][] {
  const tolerance = 10
  const sorted = [...blocks].sort((a, b) => b.position.y - a.position.y) // Top to bottom in PDF coords

  const rows: TextBlock[][] = []
  let currentRow: TextBlock[] = []
  let lastY = Number.POSITIVE_INFINITY

  sorted.forEach((block) => {
    if (Math.abs(block.position.y - lastY) > tolerance) {
      if (currentRow.length > 0) {
        rows.push(currentRow.sort((a, b) => a.position.x - b.position.x))
      }
      currentRow = [block]
    } else {
      currentRow.push(block)
    }
    lastY = block.position.y
  })

  if (currentRow.length > 0) {
    rows.push(currentRow.sort((a, b) => a.position.x - b.position.x))
  }

  return rows
}

/**
 * Estimate column count from a row of blocks
 */
function estimateColumnCount(row: TextBlock[]): number {
  if (row.length <= 1) return row.length

  // Count significant gaps between blocks
  const gaps: number[] = []
  for (let i = 1; i < row.length; i++) {
    const gap = row[i].position.x - (row[i - 1].position.x + row[i - 1].position.width)
    gaps.push(gap)
  }

  // Average gap
  const avgGap = gaps.reduce((a, b) => a + b, 0) / gaps.length

  // Count gaps larger than average (column separators)
  const significantGaps = gaps.filter((g) => g > avgGap * 1.5).length

  return significantGaps + 1
}

/**
 * Create table region from blocks
 */
function createTableFromBlocks(
  blocks: TextBlock[],
  cols: number,
): {
  position: BoundingBox
  rows: number
  cols: number
  hasHeader: boolean
} {
  const position = mergeBoxes(blocks.map((b) => b.position))
  const rowGroups = groupBlocksByRow(blocks)

  return {
    position,
    rows: rowGroups.length,
    cols,
    hasHeader: true,
  }
}

/**
 * Merge overlapping regions
 */
function mergeOverlappingRegions(
  regions: Array<{
    position: BoundingBox
    rows: number
    cols: number
    hasHeader: boolean
  }>,
): Array<{
  position: BoundingBox
  rows: number
  cols: number
  hasHeader: boolean
}> {
  if (regions.length <= 1) return regions

  const merged: typeof regions = []

  regions.forEach((region) => {
    const overlapping = merged.findIndex((m) => boxesOverlap(m.position, region.position))

    if (overlapping >= 0) {
      // Merge with existing
      merged[overlapping] = {
        position: mergeBoxes([merged[overlapping].position, region.position]),
        rows: Math.max(merged[overlapping].rows, region.rows),
        cols: Math.max(merged[overlapping].cols, region.cols),
        hasHeader: merged[overlapping].hasHeader || region.hasHeader,
      }
    } else {
      merged.push(region)
    }
  })

  return merged
}

/**
 * Detect form regions and fields
 */
function detectFormRegions(pages: ParsedPage[]): {
  formRegions: FormRegion[]
  detectedFields: DetectedField[]
} {
  const formRegions: FormRegion[] = []
  const detectedFields: DetectedField[] = []
  let regionId = 0
  let fieldId = 0

  pages.forEach((page) => {
    const pageDimensions = { width: page.width, height: page.height }

    // Find labels (text ending with colon)
    const labels = page.content.text_blocks.filter((b) => b.block_type === "label" || b.text.trim().endsWith(":"))

    // Find form lines (horizontal lines that could be underlines)
    const formLines = page.content.lines.filter((l) => l.is_form_line)

    // Find text boxes (rectangles)
    const textBoxes = page.content.rectangles.filter((r) => r.rect_type === "text_box")

    // Find checkboxes
    const checkboxes = page.content.rectangles.filter((r) => r.rect_type === "checkbox")

    // Match labels to input areas
    const pageFields: DetectedField[] = []

    labels.forEach((label) => {
      // Look for line to the right or below
      const nearbyLine = findNearbyInputLine(label, formLines)
      const nearbyBox = findNearbyInputBox(label, textBoxes)
      const nearbyCheckbox = findNearbyCheckbox(label, checkboxes)

      if (nearbyLine) {
        pageFields.push(
          createDetectedField(
            `field-${fieldId++}`,
            label,
            {
              type: "text_line",
              position: lineToBox(nearbyLine),
            },
            pageDimensions,
            "line_detection",
          ),
        )
      } else if (nearbyBox) {
        pageFields.push(
          createDetectedField(
            `field-${fieldId++}`,
            label,
            {
              type: "text_box",
              position: nearbyBox.position,
            },
            pageDimensions,
            "box_detection",
          ),
        )
      } else if (nearbyCheckbox) {
        pageFields.push(
          createDetectedField(
            `field-${fieldId++}`,
            label,
            {
              type: "checkbox",
              position: nearbyCheckbox.position,
            },
            pageDimensions,
            "box_detection",
          ),
        )
      } else {
        // Look for pattern-based detection (Label: _____)
        const patternInput = detectPatternInput(label, page.content.text_blocks)
        if (patternInput) {
          pageFields.push(
            createDetectedField(`field-${fieldId++}`, label, patternInput, pageDimensions, "pattern_matching"),
          )
        }
      }
    })

    if (pageFields.length > 0) {
      // Create form region encompassing all fields
      const allPositions = pageFields.flatMap((f) => [f.label.position, f.input.position])
      const regionPosition = mergeBoxes(allPositions)

      formRegions.push({
        id: `form-region-${regionId++}`,
        page: page.page_number,
        position: regionPosition,
        position_normalized: pdfToNormalized(regionPosition, pageDimensions),
        detected_fields: pageFields,
      })

      detectedFields.push(...pageFields)
    }
  })

  return { formRegions, detectedFields }
}

/**
 * Find nearby input line for a label
 */
function findNearbyInputLine(label: TextBlock, lines: LineElement[]): LineElement | null {
  const maxDistance = FIELD_DETECTION.max_label_distance

  // Look for line to the right (same line) or below
  const candidates = lines.filter((line) => {
    // Line should be to the right or below the label
    const labelRight = label.position.x + label.position.width
    const labelBottom = label.position.y

    // Right of label
    if (
      line.start.x >= labelRight - 10 &&
      line.start.x <= labelRight + maxDistance &&
      Math.abs(line.start.y - label.position.y) < label.position.height
    ) {
      return true
    }

    // Below label
    if (
      line.start.y <= labelBottom &&
      line.start.y >= labelBottom - maxDistance &&
      Math.abs(line.start.x - label.position.x) < maxDistance
    ) {
      return true
    }

    return false
  })

  if (candidates.length === 0) return null

  // Return closest
  return candidates.reduce((closest, line) => {
    const closestDist = boxDistance(label.position, lineToBox(closest))
    const lineDist = boxDistance(label.position, lineToBox(line))
    return lineDist < closestDist ? line : closest
  })
}

/**
 * Find nearby input box for a label
 */
function findNearbyInputBox(label: TextBlock, boxes: RectElement[]): RectElement | null {
  const maxDistance = FIELD_DETECTION.max_label_distance

  const candidates = boxes.filter((box) => {
    const dist = boxDistance(label.position, box.position)
    return dist < maxDistance
  })

  if (candidates.length === 0) return null

  return candidates.reduce((closest, box) => {
    const closestDist = boxDistance(label.position, closest.position)
    const boxDist = boxDistance(label.position, box.position)
    return boxDist < closestDist ? box : closest
  })
}

/**
 * Find nearby checkbox for a label
 */
function findNearbyCheckbox(label: TextBlock, checkboxes: RectElement[]): RectElement | null {
  const maxDistance = FIELD_DETECTION.max_label_distance * 2 // Checkboxes can be further

  const candidates = checkboxes.filter((cb) => {
    const dist = boxDistance(label.position, cb.position)
    return dist < maxDistance
  })

  if (candidates.length === 0) return null

  return candidates.reduce((closest, cb) => {
    const closestDist = boxDistance(label.position, closest.position)
    const cbDist = boxDistance(label.position, cb.position)
    return cbDist < closestDist ? cb : closest
  })
}

/**
 * Detect input from text patterns (Label: _____)
 */
function detectPatternInput(label: TextBlock, blocks: TextBlock[]): { type: InputType; position: BoundingBox } | null {
  // Look for underscores or blank space after label
  const labelText = label.text.trim()

  // Check if there's a block with underscores nearby
  const underscoreBlock = blocks.find((b) => {
    if (b.id === label.id) return false
    if (b.position.y !== label.position.y) return false

    const afterLabel = b.position.x > label.position.x + label.position.width
    const hasUnderscores = /_{3,}/.test(b.text)

    return afterLabel && hasUnderscores
  })

  if (underscoreBlock) {
    return {
      type: "text_line",
      position: underscoreBlock.position,
    }
  }

  return null
}

/**
 * Create a detected field
 */
function createDetectedField(
  id: string,
  label: TextBlock,
  input: { type: InputType; position: BoundingBox },
  pageDimensions: { width: number; height: number },
  method: DetectionMethod,
): DetectedField {
  return {
    id,
    label: {
      text: label.text.replace(/:$/, "").trim(),
      block_id: label.id,
      position: label.position,
      position_normalized: pdfToNormalized(label.position, pageDimensions),
    },
    input: {
      type: input.type,
      position: input.position,
      position_normalized: pdfToNormalized(input.position, pageDimensions),
      native_field_id: null,
    },
    detection_method: method,
    confidence: calculateConfidence(method, label, input),
    suggested_type: suggestFieldType(label.text),
  }
}

/**
 * Convert line element to bounding box
 */
function lineToBox(line: LineElement): BoundingBox {
  return {
    x: Math.min(line.start.x, line.end.x),
    y: Math.min(line.start.y, line.end.y),
    width: Math.abs(line.end.x - line.start.x) || 2,
    height: Math.abs(line.end.y - line.start.y) || line.thickness,
  }
}

/**
 * Calculate detection confidence
 */
function calculateConfidence(
  method: DetectionMethod,
  label: TextBlock,
  input: { type: InputType; position: BoundingBox },
): number {
  let base = 0.5

  // Method-based adjustment
  switch (method) {
    case "pdf_native":
      base = 0.95
      break
    case "line_detection":
      base = 0.8
      break
    case "box_detection":
      base = 0.85
      break
    case "pattern_matching":
      base = 0.7
      break
    case "ai_vision":
      base = 0.75
      break
    case "template_match":
      base = 0.9
      break
  }

  // Distance penalty
  const distance = boxDistance(label.position, input.position)
  if (distance > 30) base -= 0.1
  if (distance > 50) base -= 0.1

  return Math.max(0.3, Math.min(1.0, base))
}

/**
 * Suggest field data type from label
 */
function suggestFieldType(labelText: string): FieldDataType {
  const lower = labelText.toLowerCase()

  if (/email/i.test(lower)) return "email"
  if (/phone|tel|mobile|cell/i.test(lower)) return "phone"
  if (/date|dob|birth/i.test(lower)) return "date"
  if (/amount|price|cost|value|total|r\s?\d/i.test(lower)) return "currency"
  if (/number|no\.?|#/i.test(lower)) return "number"
  if (/signature/i.test(lower)) return "signature"
  if (/address/i.test(lower)) return "address"
  if (/name/i.test(lower)) return "name"
  if (/company|business|organization/i.test(lower)) return "company"
  if (/id|identity|registration|vat/i.test(lower)) return "id_number"

  return "text"
}

/**
 * Build reading order from text blocks
 */
function buildReadingOrder(pages: ParsedPage[]): string[] {
  const order: string[] = []

  pages.forEach((page) => {
    // Sort blocks by position (top to bottom, left to right)
    const sorted = [...page.content.text_blocks].sort((a, b) => {
      // First by Y (top to bottom in normalized coords)
      const yDiff = a.position_normalized.y - b.position_normalized.y
      if (Math.abs(yDiff) > 0.02) return yDiff

      // Then by X (left to right)
      return a.position_normalized.x - b.position_normalized.x
    })

    sorted.forEach((block) => order.push(block.id))
  })

  return order
}
