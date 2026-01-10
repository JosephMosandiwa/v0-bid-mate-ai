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
    const normalized: any = {}

    // Map each field from the schema
    for (const field of TENDER_SCHEMA.fields) {
      // Try to find the field using its name or aliases
      let value = rawData[field.name]

      if (!value) {
        // Try aliases
        for (const alias of field.extractionHints.aliases) {
          const aliasKey = Object.keys(rawData).find((key) => key.toLowerCase() === alias.toLowerCase())
          if (aliasKey) {
            value = rawData[aliasKey]
            break
          }
        }
      }

      if (value) {
        normalized[field.name] = value
      }
    }

    return normalized
  }

  static async extractTenderFromDocument(document: ParsedDocument): Promise<any | null> {
    console.log("[v0] TenderService: Extracting tender data from document")

    const extractedData: any = {}
    const allText = document.pages.map((p) => p.content.full_text).join("\n")

    // Use extraction hints to find tender fields in document
    for (const field of TENDER_SCHEMA.fields) {
      const hints = field.extractionHints

      // Try regex patterns
      for (const pattern of hints.patterns || []) {
        let regex: RegExp | null = null
        try {
          regex = new RegExp(pattern, "i")
        } catch (err) {
          // If the configured pattern is invalid, escape it and try as a literal
          try {
            const escaped = pattern.replace(/[-\\/\\^$*+?.()|[\]{}]/g, "\\$&")
            regex = new RegExp(escaped, "i")
            console.warn(`[v0] TenderService: Invalid pattern '${pattern}', using escaped literal match.`)
          } catch (err2) {
            console.error(`[v0] TenderService: Skipping invalid pattern for ${field.name}:`, pattern, err2)
            regex = null
          }
        }

        if (!regex) continue
        const match = allText.match(regex)
        if (match && match[1]) {
          extractedData[field.name] = match[1].trim()
          console.log(`[v0] TenderService: Found ${field.name}: ${extractedData[field.name]}`)
          break
        }
      }

      // If not found, try context-based extraction
      if (!extractedData[field.name]) {
        for (const contextWord of hints.context || []) {
          // Escape context words to avoid invalid regexes
          const safeWord = (contextWord || "").replace(/[-\\/\\^$*+?.()|[\]{}]/g, "\\$&")
          const contextRegex = new RegExp(`${safeWord}[:\\s]+(.*?)(?:\\n|$)`, "i")
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

  /**
   * Map document-detected fields (native PDF form fields and layout-detected fields)
   * to the tender schema. Returns a mapping object keyed by schema field name with
   * position and confidence info to enable form rendering in the UI.
   */
  static mapDocumentFieldsToSchema(document: ParsedDocument) {
    const mappings: Record<string, any> = {}
    const hints = getAllExtractionHints()

    // Index native form fields by normalized label/name
    const nativeIndex = new Map<string, any>()
    for (const ff of document.form_fields || []) {
      nativeIndex.set((ff.name || ff.id || "").toLowerCase(), ff)
    }

    // Helper to try to match a schema field to a native or detected field
    for (const h of hints) {
      const key = h.field
      // Try native form fields first
      const matchKey = [h.displayName, ...(h.aliases || [])].map((s) => (s || "").toLowerCase())
      let found: any = null

      for (const k of matchKey) {
        if (nativeIndex.has(k)) {
          found = nativeIndex.get(k)
          break
        }
      }

      if (found) {
        mappings[key] = {
          source: "pdf_native",
          field: key,
          label: found.name || found.id,
          page: found.page,
          position: found.position,
          position_normalized: found.position_normalized,
          value: found.value,
          confidence: 0.95,
        }
        continue
      }

      // Fallback: search detected form regions/fields in layout
      const detected = (document.layout?.form_regions || [])
        .flatMap((r) => r.detected_fields || [])
        .find((df: any) => {
          const label = (df.label?.text || "").toLowerCase()
          return matchKey.some((k) => k && label.includes(k))
        })

      if (detected) {
        mappings[key] = {
          source: "detected_layout",
          field: key,
          label: detected.label?.text,
          page: detected.label?.position ? document.pages.find((p) => p.page_number === detected.label.position.page)?.page_number || detected.label?.position.page : null,
          position: detected.input?.position,
          position_normalized: detected.input?.position_normalized,
          value: null,
          confidence: detected.confidence || 0.7,
        }
      }
    }

    return mappings
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
