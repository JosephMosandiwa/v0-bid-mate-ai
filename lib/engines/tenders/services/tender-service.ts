import { TENDER_SCHEMA, getAllExtractionHints } from "../schema"
import { TenderValidator } from "../validator"
import type { ParsedDocument } from "../../documind/types"

export class TenderService {
  // Get the complete tender schema for scrapers to use
  static getTenderSchema() {
    return TENDER_SCHEMA
  }

  // Get extraction hints for intelligent scraping
  static getExtractionHints() {
    return getAllExtractionHints()
  }

  // Validate a scraped tender
  static validateTender(tenderData: any) {
    return TenderValidator.validate(tenderData)
  }

  // Get quality metrics for a tender
  static getTenderQuality(tenderData: any) {
    return TenderValidator.getQualityScore(tenderData)
  }

  // Map scraped data to standard tender format
  static normalizeScrapedData(rawData: any): any {
    // Start with all original fields preserved
    const normalized: any = { ...rawData }

    // Map schema fields using aliases if the main field is missing
    for (const field of TENDER_SCHEMA.fields) {
      // If field already has a value, skip
      if (normalized[field.name]) continue

      // Try aliases
      for (const alias of field.extractionHints.aliases) {
        const aliasKey = Object.keys(rawData).find((key) => key.toLowerCase() === alias.toLowerCase())
        if (aliasKey && rawData[aliasKey]) {
          normalized[field.name] = rawData[aliasKey]
          break
        }
      }
    }

    // Ensure required fields have values (even if empty string)
    if (!normalized.title) {
      normalized.title = rawData.title || rawData.name || rawData.subject || 'Untitled Tender'
    }
    if (!normalized.organization) {
      normalized.organization = rawData.organization || rawData.entity || rawData.department || rawData.buyer || 'Unknown Organization'
    }

    return normalized
  }

  static async extractTenderFromDocument(document: ParsedDocument): Promise<any | null> {
    console.log("[v0] TenderService: Extracting tender data from document")

    const extractedData: any = {}
    const allText = document.pages.map((p) => p.text).join("\n")

    // Use extraction hints to find tender fields in document
    for (const field of TENDER_SCHEMA.fields) {
      const hints = field.extractionHints

      // Try regex patterns
      for (const pattern of hints.patterns) {
        const regex = new RegExp(pattern, "i")
        const match = allText.match(regex)
        if (match && match[1]) {
          extractedData[field.name] = match[1].trim()
          console.log(`[v0] TenderService: Found ${field.name}: ${extractedData[field.name]}`)
          break
        }
      }

      // If not found, try context-based extraction
      if (!extractedData[field.name]) {
        for (const contextWord of hints.contextWords) {
          const contextRegex = new RegExp(`${contextWord}[:\\s]+(.*?)(?:\\n|$)`, "i")
          const match = allText.match(contextRegex)
          if (match && match[1]) {
            extractedData[field.name] = match[1].trim()
            console.log(`[v0] TenderService: Found ${field.name} via context: ${extractedData[field.name]}`)
            break
          }
        }
      }
    }

    // Check if we found enough data to be useful
    const validation = this.validateTender(extractedData)
    if (validation.score < 20) {
      console.warn("[v0] TenderService: Not enough tender data found in document")
      return null
    }

    console.log(`[v0] TenderService: Extracted tender data with ${validation.score}% completeness`)
    return this.normalizeScrapedData(extractedData)
  }

  // Enrich tender data with AI analysis context
  static getTenderAnalysisContext(tenderData: any): string {
    const validation = this.validateTender(tenderData)
    const quality = this.getTenderQuality(tenderData)

    return `
Tender Data Quality: ${quality.grade} (${quality.score}%)

Available Fields:
${TENDER_SCHEMA.fields.map((f) => `- ${f.displayName}: ${tenderData[f.name] ? "✓" : "✗"}`).join("\n")}

Data Completeness:
${quality.feedback.join("\n")}

This context helps you understand what information is available for analysis.
    `.trim()
  }
}
