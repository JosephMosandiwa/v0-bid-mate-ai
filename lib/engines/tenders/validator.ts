import { TENDER_SCHEMA } from "./schema"
import type { TenderValidationResult } from "./types"

export class TenderValidator {
  static validate(tenderData: any): TenderValidationResult {
    const errors: TenderValidationResult["errors"] = []
    const warnings: string[] = []
    const missingFields: string[] = []

    // Check required fields
    for (const fieldName of TENDER_SCHEMA.requiredFields) {
      if (!tenderData[fieldName] || tenderData[fieldName] === "") {
        errors.push({
          field: fieldName,
          message: `Required field '${fieldName}' is missing or empty`,
          severity: "error",
        })
        missingFields.push(fieldName)
      }
    }

    // Check optional fields for completeness
    for (const fieldName of TENDER_SCHEMA.optionalFields) {
      if (!tenderData[fieldName] || tenderData[fieldName] === "") {
        warnings.push(`Optional field '${fieldName}' is missing - tender may be incomplete`)
        missingFields.push(fieldName)
      }
    }

    // Validate field formats
    const emailField = tenderData.contact_email
    if (emailField && !this.isValidEmail(emailField)) {
      errors.push({
        field: "contact_email",
        message: "Invalid email format",
        severity: "warning",
      })
    }

    // Calculate completeness score
    const totalFields = TENDER_SCHEMA.requiredFields.length + TENDER_SCHEMA.optionalFields.length
    const filledFields = totalFields - missingFields.length
    const score = Math.round((filledFields / totalFields) * 100)

    return {
      isValid: errors.filter((e) => e.severity === "error").length === 0,
      score,
      errors,
      missingFields,
      warnings,
    }
  }

  private static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // Get a quality score for a tender based on completeness
  static getQualityScore(tenderData: any): {
    score: number
    grade: string
    feedback: string[]
  } {
    const validation = this.validate(tenderData)
    const feedback: string[] = []

    if (validation.score === 100) {
      feedback.push("✓ All fields populated")
    } else if (validation.score >= 80) {
      feedback.push("✓ Most important fields populated")
    } else if (validation.score >= 60) {
      feedback.push("⚠ Missing some important information")
    } else {
      feedback.push("✗ Tender data is incomplete")
    }

    if (validation.missingFields.includes("tender_reference")) {
      feedback.push("✗ Missing tender reference number")
    }
    if (validation.missingFields.includes("close_date")) {
      feedback.push("✗ Missing closing date")
    }
    if (validation.missingFields.includes("contact_email")) {
      feedback.push("⚠ No contact email found")
    }
    if (validation.missingFields.includes("estimated_value")) {
      feedback.push("⚠ No tender value information")
    }

    const grade =
      validation.score >= 90
        ? "A"
        : validation.score >= 80
          ? "B"
          : validation.score >= 70
            ? "C"
            : validation.score >= 60
              ? "D"
              : "F"

    return {
      score: validation.score,
      grade,
      feedback,
    }
  }
}
