/**
 * Prompt Management System
 *
 * This module manages AI analysis prompts and allows switching between
 * the original production prompt and custom test prompts.
 *
 * Usage:
 * - Set USE_CUSTOM_PROMPT=true in environment variables to use custom prompt
 * - Set USE_CUSTOM_PROMPT=false (or omit) to use original prompt
 * - Edit custom-analysis-prompt.ts to test new prompts
 * - Original prompt is always preserved in original-analysis-prompt.ts
 */

import { ORIGINAL_ANALYSIS_PROMPT } from "./original-analysis-prompt"
import { CUSTOM_ANALYSIS_PROMPT } from "./custom-analysis-prompt"

export function getAnalysisPrompt(): string {
  const useCustomPrompt = process.env.USE_CUSTOM_PROMPT === "true"

  if (useCustomPrompt) {
    console.log("[v0] Using CUSTOM analysis prompt")
    return CUSTOM_ANALYSIS_PROMPT
  }

  console.log("[v0] Using ORIGINAL analysis prompt")
  return ORIGINAL_ANALYSIS_PROMPT
}

export function getFormFieldsInstruction(pdfFields?: any[]): string {
  if (pdfFields && pdfFields.length > 0) {
    return `
CRITICAL: The PDF has ${pdfFields.length} interactive form fields. You MUST use these EXACT field names as the 'id' property.

PDF Form Fields:
${pdfFields.map((f: any, idx: number) => `${idx + 1}. "${f.name}" (${f.type})`).join("\n")}

FORM FIELD GENERATION RULES:
1. For EACH PDF field above, create a corresponding form field entry
2. Use the EXACT field name from the PDF as the 'id' (case-sensitive)
3. Create a human-readable label by:
   - Converting CamelCase to spaces (e.g., "CompanyName" → "Company Name")
   - Converting snake_case to spaces (e.g., "company_name" → "Company Name")
   - Capitalizing appropriately
4. Map the PDF field type to the appropriate form field type:
   - PDFTextField → "text" or "textarea" (use textarea for long text fields)
   - PDFCheckBox → "checkbox"
   - PDFRadioGroup → "radio"
   - PDFDropdown → "select"
5. Mark fields as required if they appear mandatory in the document
6. Add helpful descriptions based on the document context
7. Group fields into logical sections (Company Info, Financial, Technical, etc.)

Example:
PDF Field: "CompanyRegistrationNumber" (PDFTextField)
Form Field:
{
  "id": "CompanyRegistrationNumber",
  "label": "Company Registration Number",
  "type": "text",
  "required": true,
  "placeholder": "e.g., 2021/123456/07",
  "description": "Your company's official registration number",
  "section": "Company Information"
}
`
  }

  return `
FORM FIELD GENERATION (No PDF fields detected - create comprehensive form):

Extract EVERY piece of information requested in the tender document and create appropriate form fields.
Be thorough and detailed - include ALL information requirements mentioned.

REQUIRED SECTIONS TO COVER:
1. Company Information:
   - Company name, registration number, VAT number
   - Physical and postal addresses
   - Contact person details (name, email, phone)
   - Company type, years in business
   - Website, social media

2. Financial Information:
   - Annual turnover (last 3 years)
   - Bank details (name, branch, account)
   - Tax clearance certificate
   - Financial statements
   - Credit references

3. Technical Capabilities:
   - Relevant experience (years)
   - Similar projects completed
   - Technical staff qualifications
   - Equipment and resources
   - Quality certifications (ISO, etc.)

4. Compliance & Legal:
   - BBBEE certificate and level
   - Professional indemnity insurance
   - Public liability insurance
   - Health and safety compliance
   - Industry-specific licenses

5. Project-Specific:
   - Methodology and approach
   - Project timeline
   - Resource allocation
   - Risk management plan
   - Quality assurance procedures

6. Pricing:
   - Detailed cost breakdown
   - Payment terms
   - Validity period
   - Assumptions and exclusions

7. References:
   - Client references (minimum 3)
   - Contact details for references
   - Project descriptions

8. Supporting Documents:
   - Company profile
   - Certificates and licenses
   - Previous work samples
   - CVs of key personnel

For each field, provide:
- Unique, descriptive ID (use snake_case)
- Clear, concise label
- Appropriate type (text, email, tel, number, date, textarea, select, checkbox, file)
- Whether it's required
- Helpful placeholder text
- Detailed description of what's needed
- Logical section grouping
- Options array for select/checkbox/radio fields
`
}

// Export both prompts for reference
export { ORIGINAL_ANALYSIS_PROMPT, CUSTOM_ANALYSIS_PROMPT }
