import { generateObject } from "ai"
import { z } from "zod"

const tenderAnalysisSchema = z.object({
  tenderMetadata: z
    .object({
      title: z.string().optional(),
      organization: z.string().optional(),
      deadline: z.string().optional(),
      value: z.string().optional(),
      category: z.string().optional(),
      location: z.string().optional(),
    })
    .optional(),
  summary: z.string().default("No summary available"),
  keyRequirements: z.array(z.string()).default([]),
  deadlines: z.array(z.string()).default([]),
  evaluationCriteria: z.array(z.string()).default([]),
  recommendations: z.array(z.string()).default([]),
  complianceChecklist: z.array(z.string()).default([]),
  actionableTasks: z
    .array(
      z.object({
        task: z.string(),
        priority: z.enum(["high", "medium", "low"]).catch("medium"),
        category: z.enum(["documentation", "technical", "financial", "compliance", "other"]).catch("other"),
        deadline: z.string().nullable().optional(),
      }),
    )
    .default([]),
  formFields: z
    .array(
      z.object({
        id: z.string(),
        label: z.string(),
        type: z
          .enum(["text", "email", "tel", "number", "date", "textarea", "select", "checkbox", "radio", "file"])
          .catch("text"),
        required: z.boolean().default(false),
        placeholder: z.string().optional(),
        description: z.string().optional(),
        section: z.string().default("General Information"),
        options: z.array(z.string()).optional(),
      }),
    )
    .default([]),
})

export async function POST(request: Request) {
  try {
    const { documentText, pdfFields } = await request.json()

    console.log("[v0] ========================================")
    console.log("[v0] TENDER ANALYSIS REQUEST")
    console.log("[v0] ========================================")
    console.log("[v0] Document text length:", documentText?.length, "characters")
    console.log("[v0] PDF fields provided:", pdfFields?.length || 0)

    if (documentText) {
      console.log("[v0] First 1000 characters of document text:")
      console.log(documentText.substring(0, 1000))
      console.log("[v0] ...")
      console.log("[v0] Last 500 characters of document text:")
      console.log(documentText.substring(Math.max(0, documentText.length - 500)))
    }

    if (!documentText) {
      return Response.json({ error: "Document text is required" }, { status: 400 })
    }

    const truncatedText = documentText.substring(0, 100000)
    console.log("[v0] Using truncated text length:", truncatedText.length, "characters")
    console.log("[v0] Truncation applied:", documentText.length > 100000 ? "YES" : "NO")

    const formFieldsInstruction =
      pdfFields && pdfFields.length > 0
        ? `
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
        : `
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

    console.log("[v0] Calling AI Gateway with generateObject for structured analysis...")
    console.log("[v0] Model: gpt-4o-mini")

    let analysis
    try {
      const result = await generateObject({
        model: "gpt-4o-mini",
        schema: tenderAnalysisSchema,
        prompt: `You are an elite tender analyst with 20+ years of experience helping companies win government and corporate tenders. Your analysis must be thorough, actionable, and strategically valuable.

===========================================
CRITICAL METADATA EXTRACTION RULES
===========================================

Extract the following with ABSOLUTE PRECISION:

1. TENDER TITLE:
   - Extract the EXACT official title word-for-word
   - Look in: Document header, "Tender Name/Title", "Project Name", "RFP/RFQ/RFB Title", "Bid Number"
   - Common locations: First page header, title page, section 1
   - DO NOT paraphrase, summarize, or interpret
   - If multiple titles, use the most prominent/official one
   - Example: "Supply and Delivery of Medical Equipment to Provincial Hospitals"

2. ISSUING ORGANIZATION:
   - Extract FULL official name including all hierarchy levels
   - Look for: "Issued by", "Procuring Entity", "Department", "Ministry", "Tender Authority"
   - Include: Department, Division, Province/Region, Country if specified
   - Example: "Department of Health, Western Cape Provincial Government, South Africa"
   - DO NOT abbreviate official names

3. SUBMISSION DEADLINE:
   - Extract FINAL submission date and time with timezone if specified
   - Look for: "Closing Date", "Submission Deadline", "Due Date", "Closing Time", "Tender Closes"
   - Format: YYYY-MM-DD HH:MM (e.g., "2024-03-15 11:00")
   - If only date given, assume end of business day
   - If unclear, note "See deadlines section for details"

4. TENDER VALUE/BUDGET:
   - Extract estimated contract value, budget range, or ceiling price
   - Look for: "Tender Value", "Estimated Budget", "Contract Value", "Price Range", "Maximum Price"
   - Include currency and amount: "R 2,500,000" or "ZAR 2.5M" or "R 1M - R 3M"
   - If range, include both min and max
   - If not stated: "Not specified" (never guess)

5. CATEGORY:
   - Classify accurately based on primary deliverable
   - Categories: Construction, IT Services, Medical Supplies, Consulting, Professional Services, 
     Goods Supply, Maintenance, Security Services, Catering, Transport, Training, etc.
   - Be specific: "Medical Equipment Supply" not just "Supplies"

6. LOCATION:
   - Extract project location, service area, or delivery address
   - Look for: "Location", "Project Site", "Delivery Address", "Service Area", "Province"
   - Include: City, Province/State, Country
   - Example: "Cape Town, Western Cape, South Africa"

===========================================
COMPREHENSIVE ANALYSIS REQUIREMENTS
===========================================

SUMMARY (5-7 sentences, highly informative):
Write a compelling executive summary that covers:
- What is being procured (specific goods/services/works with quantities if mentioned)
- Who is procuring it (organization, department, context)
- Why it's being procured (background, problem being solved, objectives)
- Key scope elements and main deliverables
- Contract duration and key dates
- Estimated value and budget considerations
- Any unique or notable aspects of this tender

Make it detailed enough that someone can understand the tender without reading the full document.

KEY REQUIREMENTS (Extract ALL, be exhaustively specific):
List EVERY requirement mentioned in the document, organized by category:

Mandatory Qualifications:
- Professional registrations (e.g., "Must be registered with Engineering Council of SA")
- Industry certifications (e.g., "ISO 9001:2015 certification required")
- Licenses and permits
- Minimum years in business
- Minimum staff numbers

Technical Specifications:
- Exact product specifications, models, standards
- Technical standards to comply with (e.g., "SANS 10142-1:2012")
- Performance requirements and KPIs
- Quality standards
- Testing and inspection requirements

Experience Requirements:
- Minimum years of relevant experience
- Number of similar projects required (e.g., "Minimum 3 similar projects in last 5 years")
- Specific industry experience
- Geographic experience requirements
- Project size/value experience

Financial Requirements:
- Minimum annual turnover (e.g., "R 5M annual turnover for last 3 years")
- Bank guarantees or bonds required
- Insurance requirements (amounts and types)
- Financial statements required
- Credit rating requirements

Registration & Compliance:
- Tax compliance (e.g., "Valid tax clearance certificate")
- BBBEE requirements (level, points, certificates)
- Industry body registrations
- Labor compliance
- Environmental compliance

Staffing & Resources:
- Key personnel requirements (qualifications, experience)
- Minimum team size
- Equipment and facilities required
- Subcontracting limitations
- Local content requirements

DEADLINES (Extract ALL dates with full context):
Create a comprehensive timeline with:
- Briefing session: Date, time, venue, RSVP requirements
- Site visits: Dates, times, meeting points, mandatory/optional
- Clarification questions deadline: Date, time, submission method
- Addendum release dates
- Document submission deadline: Date, time, location/method
- Presentation/interview dates (if scheduled)
- Contract award date (estimated)
- Contract start date
- Project milestones and completion dates
- Payment schedule dates

Format each as: "Action - Date/Time - Details"
Example: "Compulsory site visit - 2024-02-15 10:00 - Meet at main gate, RSVP by 2024-02-13"

EVALUATION CRITERIA (Extract exact scoring methodology):
Provide the complete evaluation breakdown:

Price/Cost Component:
- Points allocated (e.g., "Price: 80 points")
- Calculation method (e.g., "Lowest price gets 80 points, others pro-rata")

Technical Component:
- Technical capability points
- Methodology and approach points
- Project plan and timeline points
- Quality assurance points

Experience & Track Record:
- Relevant experience points
- Similar projects points
- References points

BBBEE/Transformation:
- BBBEE points breakdown by level
- Local content points
- Subcontracting to SMMEs points

Other Factors:
- Presentation/interview points
- Financial stability points
- Health & safety record points

Minimum Requirements:
- Minimum qualifying scores
- Threshold requirements
- Disqualification criteria

Evaluation Process:
- Two-stage vs single-stage
- Evaluation committee composition
- Evaluation timeline

RECOMMENDATIONS (Strategic, actionable advice):
Provide expert strategic guidance:

Critical Success Factors:
- Top 3-5 factors that will determine bid success
- Must-have vs nice-to-have elements
- Common pitfalls to avoid

Competitive Positioning:
- How to differentiate from competitors
- Key value propositions to emphasize
- Unique selling points to highlight

Risk Mitigation:
- Potential challenges and how to address them
- Risk areas requiring special attention
- Contingency planning needs

Resource Allocation:
- Where to focus time and effort
- Which sections need most attention
- Team composition recommendations

Partnership Strategy:
- Whether partnerships/JVs are advisable
- Types of partners to consider
- Subcontracting opportunities

Pricing Strategy:
- Pricing considerations and approach
- Value engineering opportunities
- Cost optimization areas

COMPLIANCE CHECKLIST (Comprehensive list):
Create a detailed checklist of ALL mandatory requirements:
- Documents to submit (with quantities, e.g., "3 original copies + 1 electronic")
- Certificates and licenses needed
- Forms to complete (list each form)
- Declarations to sign
- Samples or prototypes required
- Formatting requirements (page limits, binding, etc.)
- Submission method and location
- Packaging and labeling requirements

ACTIONABLE TASKS (Detailed, prioritized, time-bound):
Create a comprehensive task list with:

HIGH PRIORITY (Critical path, early deadlines):
- Tasks that must be done first
- Tasks with imminent deadlines
- Mandatory requirements
- Long lead-time items
Example: "Obtain tax clearance certificate - Due: 2024-02-20 - Category: compliance"

MEDIUM PRIORITY (Important but not urgent):
- Important preparation tasks
- Standard requirements
- Supporting documentation
Example: "Prepare company profile and credentials - Due: 2024-03-01 - Category: documentation"

LOW PRIORITY (Optional or later-stage):
- Nice-to-have elements
- Final touches
- Post-submission tasks
Example: "Prepare presentation materials for interview - Due: TBD - Category: other"

For each task include:
- Specific action required
- Deadline (if mentioned)
- Category (documentation/technical/financial/compliance/other)
- Priority level

${formFieldsInstruction}

===========================================
EXTRACTION PRINCIPLES
===========================================

1. ACCURACY: Extract exact information, never paraphrase official terms
2. COMPLETENESS: Include ALL requirements, even minor ones
3. SPECIFICITY: Provide specific details, numbers, dates, amounts
4. CLARITY: Use clear, unambiguous language
5. STRUCTURE: Organize information logically
6. CONTEXT: Provide context for requirements
7. HONESTY: If information is not found, state "Not specified" - never guess
8. ACTIONABILITY: Make recommendations practical and implementable

===========================================
TENDER DOCUMENT TEXT
===========================================

${truncatedText}

===========================================
ANALYSIS OUTPUT
===========================================

Provide your comprehensive analysis following all the rules above.`,
      })

      analysis = result.object
    } catch (aiError: any) {
      console.error("[v0] ========================================")
      console.error("[v0] AI GATEWAY ERROR")
      console.error("[v0] ========================================")
      console.error("[v0] AI Error:", aiError)
      console.error("[v0] AI Error message:", aiError?.message)
      console.error("[v0] AI Error cause:", aiError?.cause)
      console.error("[v0] ========================================")

      if (
        aiError?.message?.includes("credit card") ||
        aiError?.message?.includes("payment") ||
        aiError?.message?.includes("billing")
      ) {
        return Response.json(
          {
            error: "AI Gateway requires a valid payment method. Please add a credit card to your Vercel account.",
            errorType: "payment_required",
            details: aiError?.message,
          },
          { status: 402 },
        )
      }

      if (aiError?.message?.includes("API key") || aiError?.message?.includes("authentication")) {
        return Response.json(
          {
            error: "OpenAI API key is missing or invalid. Please check your environment variables.",
            errorType: "authentication_error",
            details: aiError?.message,
          },
          { status: 401 },
        )
      }

      if (aiError?.message?.includes("timeout") || aiError?.message?.includes("timed out")) {
        return Response.json(
          {
            error: "AI analysis timed out. The document might be too large. Please try with a smaller document.",
            errorType: "timeout_error",
            details: aiError?.message,
          },
          { status: 504 },
        )
      }

      throw aiError
    }

    console.log("[v0] ========================================")
    console.log("[v0] ANALYSIS RESULTS")
    console.log("[v0] ========================================")
    console.log("[v0] Successfully generated structured analysis")
    console.log("[v0] Extracted metadata:", JSON.stringify(analysis.tenderMetadata, null, 2))
    console.log("[v0] Summary length:", analysis.summary?.length, "characters")
    console.log("[v0] Summary:", analysis.summary)
    console.log("[v0] Key requirements count:", analysis.keyRequirements?.length)
    console.log("[v0] Deadlines count:", analysis.deadlines?.length)
    console.log("[v0] Evaluation criteria count:", analysis.evaluationCriteria?.length)
    console.log("[v0] Recommendations count:", analysis.recommendations?.length)
    console.log("[v0] Compliance checklist count:", analysis.complianceChecklist?.length)
    console.log("[v0] Actionable tasks count:", analysis.actionableTasks?.length)
    console.log("[v0] Form fields count:", analysis.formFields?.length)
    console.log("[v0] ========================================")

    return Response.json(analysis)
  } catch (error: any) {
    console.error("[v0] ========================================")
    console.error("[v0] TENDER ANALYSIS ERROR")
    console.error("[v0] ========================================")
    console.error("[v0] Error:", error)
    console.error("[v0] Error details:", {
      message: error?.message,
      name: error?.name,
      stack: error?.stack?.substring(0, 500),
    })
    console.error("[v0] ========================================")

    return Response.json(
      {
        error: "Failed to analyze tender document",
        details: error?.message || "Unknown error",
        errorType: "server_error",
      },
      { status: 500 },
    )
  }
}
