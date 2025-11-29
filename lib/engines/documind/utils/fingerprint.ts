// ============================================
// DOCUMIND ENGINE - DOCUMENT FINGERPRINTING
// Creates unique identifiers for template matching
// ============================================

import crypto from "crypto"
import type { ParsedPage, FormField, TableRegion, DocumentFingerprints } from "../types"

/**
 * Generate document fingerprints for template matching
 * Fingerprints are based on structure, not content
 */
export function generateFingerprints(
  pages: ParsedPage[],
  formFields: FormField[],
  tableRegions: TableRegion[],
  contentHash: string,
): DocumentFingerprints {
  return {
    structure_hash: generateStructureHash(pages),
    layout_hash: generateLayoutHash(pages),
    form_hash: formFields.length > 0 ? generateFormHash(formFields) : null,
    table_hash: tableRegions.length > 0 ? generateTableHash(tableRegions) : null,
    content_hash: contentHash,
  }
}

/**
 * Generate structure hash based on overall document structure
 * - Page count and dimensions
 * - Text block distribution per page
 * - Section structure
 */
function generateStructureHash(pages: ParsedPage[]): string {
  const features: string[] = []

  // Page count
  features.push(`pages:${pages.length}`)

  // Page dimensions (normalized to common sizes)
  pages.forEach((page, idx) => {
    const sizeClass = classifyPageSize(page.width, page.height)
    const orientation = page.width > page.height ? "landscape" : "portrait"
    features.push(`p${idx}:${sizeClass}:${orientation}`)
  })

  // Text density per page (binned)
  pages.forEach((page, idx) => {
    const blockCount = page.content.text_blocks.length
    const densityBin = Math.floor(blockCount / 10) * 10 // Bin by 10s
    features.push(`p${idx}:blocks:${densityBin}`)
  })

  // Heading structure
  pages.forEach((page, idx) => {
    const headings = page.content.text_blocks.filter((b) => b.block_type.startsWith("heading")).length
    features.push(`p${idx}:headings:${headings}`)
  })

  return hashString(features.join("|"))
}

/**
 * Generate layout hash based on visual layout
 * - Margins and whitespace
 * - Column structure
 * - Visual regions
 */
function generateLayoutHash(pages: ParsedPage[]): string {
  const features: string[] = []

  pages.forEach((page, idx) => {
    // Estimate margins from text block positions
    const blocks = page.content.text_blocks
    if (blocks.length === 0) {
      features.push(`p${idx}:empty`)
      return
    }

    const leftMargin = Math.min(...blocks.map((b) => b.position_normalized.x))
    const rightMargin = 1 - Math.max(...blocks.map((b) => b.position_normalized.x + b.position_normalized.width))
    const topMargin = Math.min(...blocks.map((b) => b.position_normalized.y))

    // Bin margins (0-10%, 10-20%, etc.)
    const leftBin = Math.floor(leftMargin * 10)
    const rightBin = Math.floor(rightMargin * 10)
    const topBin = Math.floor(topMargin * 10)

    features.push(`p${idx}:margins:${leftBin}:${rightBin}:${topBin}`)

    // Detect columns (simple heuristic based on x-position clustering)
    const xPositions = blocks.map((b) => b.position_normalized.x)
    const columnCount = estimateColumnCount(xPositions)
    features.push(`p${idx}:cols:${columnCount}`)
  })

  return hashString(features.join("|"))
}

/**
 * Generate form hash based on form field positions
 */
function generateFormHash(fields: FormField[]): string {
  const features: string[] = []

  // Field count by type
  const typeCounts: Record<string, number> = {}
  fields.forEach((f) => {
    typeCounts[f.type] = (typeCounts[f.type] || 0) + 1
  })
  Object.entries(typeCounts)
    .sort()
    .forEach(([type, count]) => {
      features.push(`type:${type}:${count}`)
    })

  // Field positions (binned to grid)
  fields.forEach((field, idx) => {
    const xBin = Math.floor(field.position_normalized.x * 10)
    const yBin = Math.floor(field.position_normalized.y * 10)
    features.push(`f${idx}:${field.page}:${xBin}:${yBin}`)
  })

  return hashString(features.join("|"))
}

/**
 * Generate table hash based on table structures
 */
function generateTableHash(tables: TableRegion[]): string {
  const features: string[] = []

  // Table count
  features.push(`count:${tables.length}`)

  // Table structures
  tables.forEach((table, idx) => {
    features.push(`t${idx}:${table.page}:${table.row_count_estimate}x${table.column_count_estimate}`)
    const xBin = Math.floor(table.position_normalized.x * 10)
    const yBin = Math.floor(table.position_normalized.y * 10)
    features.push(`t${idx}:pos:${xBin}:${yBin}`)
  })

  return hashString(features.join("|"))
}

/**
 * Generate content hash (for detecting identical documents)
 */
export function generateContentHash(text: string): string {
  return hashString(text.toLowerCase().replace(/\s+/g, " ").trim())
}

/**
 * Calculate similarity score between two fingerprints
 * Returns 0-1 where 1 is identical
 */
export function calculateFingerprintSimilarity(a: DocumentFingerprints, b: DocumentFingerprints): number {
  let totalWeight = 0
  let weightedScore = 0

  // Structure hash - most important (weight: 40%)
  if (a.structure_hash === b.structure_hash) {
    weightedScore += 0.4
  }
  totalWeight += 0.4

  // Layout hash (weight: 25%)
  if (a.layout_hash === b.layout_hash) {
    weightedScore += 0.25
  }
  totalWeight += 0.25

  // Form hash (weight: 25%) - only if both have forms
  if (a.form_hash && b.form_hash) {
    if (a.form_hash === b.form_hash) {
      weightedScore += 0.25
    }
    totalWeight += 0.25
  }

  // Table hash (weight: 10%) - only if both have tables
  if (a.table_hash && b.table_hash) {
    if (a.table_hash === b.table_hash) {
      weightedScore += 0.1
    }
    totalWeight += 0.1
  }

  return weightedScore / totalWeight
}

// Helper functions

function hashString(str: string): string {
  return crypto.createHash("sha256").update(str).digest("hex").substring(0, 16)
}

function classifyPageSize(width: number, height: number): string {
  // Common page sizes in points
  const sizes = {
    a4: { w: 595, h: 842 },
    letter: { w: 612, h: 792 },
    legal: { w: 612, h: 1008 },
    a3: { w: 842, h: 1191 },
  }

  const tolerance = 20 // Points tolerance

  for (const [name, size] of Object.entries(sizes)) {
    if (
      (Math.abs(width - size.w) < tolerance && Math.abs(height - size.h) < tolerance) ||
      (Math.abs(width - size.h) < tolerance && Math.abs(height - size.w) < tolerance)
    ) {
      return name
    }
  }

  return "custom"
}

function estimateColumnCount(xPositions: number[]): number {
  if (xPositions.length === 0) return 0

  // Simple clustering based on x-position gaps
  const sorted = [...xPositions].sort((a, b) => a - b)
  const gaps: number[] = []

  for (let i = 1; i < sorted.length; i++) {
    gaps.push(sorted[i] - sorted[i - 1])
  }

  // Count significant gaps (> 0.2 of page width)
  const significantGaps = gaps.filter((g) => g > 0.2).length

  return Math.min(significantGaps + 1, 4) // Cap at 4 columns
}
