// Tender Engine Types - Central definition of what a tender should contain

export interface TenderField {
  name: string
  displayName: string
  type: "string" | "number" | "date" | "array" | "boolean" | "object"
  required: boolean
  description: string
  validationRules?: {
    min?: number
    max?: number
    pattern?: string
    format?: string
  }
  extractionHints: {
    aliases: string[] // Alternative names this field might have
    patterns: string[] // Regex patterns to find this field
    context: string[] // Words that often appear near this field
    priority: number // How important this field is (1-10)
  }
}

export interface TenderSchema {
  version: string
  fields: TenderField[]
  requiredFields: string[]
  optionalFields: string[]
  documentTypes: string[]
}

export interface TenderValidationResult {
  isValid: boolean
  score: number // Completeness score 0-100
  errors: Array<{
    field: string
    message: string
    severity: "error" | "warning"
  }>
  missingFields: string[]
  warnings: string[]
  // Optional legacy/consumer-friendly properties
  grade?: string
  completeness?: number
}
