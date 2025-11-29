// ============================================
// DOCUMIND ENGINE - POSITION MAPPER
// Handles coordinate system conversions
// ============================================

import type { BoundingBox, NormalizedBox } from "../types"

/**
 * PDF coordinate system: Origin at bottom-left, measured in points (72 pts = 1 inch)
 * Browser/Canvas coordinate system: Origin at top-left, measured in pixels
 * Normalized coordinate system: Origin at top-left, values 0-1 (percentage of page)
 */

export interface PageDimensions {
  width: number
  height: number
}

/**
 * Convert PDF coordinates to normalized (0-1) coordinates
 * PDF origin is bottom-left, normalized origin is top-left
 */
export function pdfToNormalized(box: BoundingBox, page: PageDimensions): NormalizedBox {
  return {
    x: box.x / page.width,
    // Flip Y axis: PDF bottom-left to normalized top-left
    y: 1 - (box.y + box.height) / page.height,
    width: box.width / page.width,
    height: box.height / page.height,
  }
}

/**
 * Convert normalized coordinates back to PDF coordinates
 */
export function normalizedToPdf(box: NormalizedBox, page: PageDimensions): BoundingBox {
  return {
    x: box.x * page.width,
    // Flip Y axis back: normalized top-left to PDF bottom-left
    y: page.height - (box.y + box.height) * page.height,
    width: box.width * page.width,
    height: box.height * page.height,
  }
}

/**
 * Convert PDF coordinates to pixel coordinates for canvas rendering
 */
export function pdfToPixel(box: BoundingBox, page: PageDimensions, scale = 1): BoundingBox {
  return {
    x: box.x * scale,
    // Flip Y axis for canvas (top-left origin)
    y: (page.height - box.y - box.height) * scale,
    width: box.width * scale,
    height: box.height * scale,
  }
}

/**
 * Convert pixel coordinates (from canvas) to PDF coordinates
 */
export function pixelToPdf(box: BoundingBox, page: PageDimensions, scale = 1): BoundingBox {
  return {
    x: box.x / scale,
    // Flip Y axis back to PDF
    y: page.height - box.y / scale - box.height / scale,
    width: box.width / scale,
    height: box.height / scale,
  }
}

/**
 * Convert normalized coordinates to pixel coordinates
 */
export function normalizedToPixel(box: NormalizedBox, page: PageDimensions, scale = 1): BoundingBox {
  return {
    x: box.x * page.width * scale,
    y: box.y * page.height * scale,
    width: box.width * page.width * scale,
    height: box.height * page.height * scale,
  }
}

/**
 * Convert pixel coordinates to normalized coordinates
 */
export function pixelToNormalized(box: BoundingBox, page: PageDimensions, scale = 1): NormalizedBox {
  return {
    x: box.x / scale / page.width,
    y: box.y / scale / page.height,
    width: box.width / scale / page.width,
    height: box.height / scale / page.height,
  }
}

/**
 * Check if two boxes overlap
 */
export function boxesOverlap(a: BoundingBox, b: BoundingBox): boolean {
  return !(a.x + a.width < b.x || b.x + b.width < a.x || a.y + a.height < b.y || b.y + b.height < a.y)
}

/**
 * Check if box A contains box B
 */
export function boxContains(container: BoundingBox, inner: BoundingBox): boolean {
  return (
    inner.x >= container.x &&
    inner.y >= container.y &&
    inner.x + inner.width <= container.x + container.width &&
    inner.y + inner.height <= container.y + container.height
  )
}

/**
 * Calculate distance between two boxes (edge to edge)
 */
export function boxDistance(a: BoundingBox, b: BoundingBox): number {
  const dx = Math.max(0, Math.max(a.x, b.x) - Math.min(a.x + a.width, b.x + b.width))
  const dy = Math.max(0, Math.max(a.y, b.y) - Math.min(a.y + a.height, b.y + b.height))
  return Math.sqrt(dx * dx + dy * dy)
}

/**
 * Get center point of a box
 */
export function boxCenter(box: BoundingBox): { x: number; y: number } {
  return {
    x: box.x + box.width / 2,
    y: box.y + box.height / 2,
  }
}

/**
 * Merge multiple boxes into one bounding box
 */
export function mergeBoxes(boxes: BoundingBox[]): BoundingBox {
  if (boxes.length === 0) {
    return { x: 0, y: 0, width: 0, height: 0 }
  }

  const minX = Math.min(...boxes.map((b) => b.x))
  const minY = Math.min(...boxes.map((b) => b.y))
  const maxX = Math.max(...boxes.map((b) => b.x + b.width))
  const maxY = Math.max(...boxes.map((b) => b.y + b.height))

  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY,
  }
}

/**
 * Expand a box by a given margin
 */
export function expandBox(box: BoundingBox, margin: number): BoundingBox {
  return {
    x: box.x - margin,
    y: box.y - margin,
    width: box.width + margin * 2,
    height: box.height + margin * 2,
  }
}

/**
 * Check if a point is inside a box
 */
export function pointInBox(point: { x: number; y: number }, box: BoundingBox): boolean {
  return point.x >= box.x && point.x <= box.x + box.width && point.y >= box.y && point.y <= box.y + box.height
}

/**
 * Calculate intersection over union (IoU) for two boxes
 * Used for comparing detected fields with template fields
 */
export function calculateIoU(a: BoundingBox, b: BoundingBox): number {
  const intersectX = Math.max(a.x, b.x)
  const intersectY = Math.max(a.y, b.y)
  const intersectW = Math.min(a.x + a.width, b.x + b.width) - intersectX
  const intersectH = Math.min(a.y + a.height, b.y + b.height) - intersectY

  if (intersectW <= 0 || intersectH <= 0) {
    return 0
  }

  const intersectionArea = intersectW * intersectH
  const aArea = a.width * a.height
  const bArea = b.width * b.height
  const unionArea = aArea + bArea - intersectionArea

  return intersectionArea / unionArea
}
