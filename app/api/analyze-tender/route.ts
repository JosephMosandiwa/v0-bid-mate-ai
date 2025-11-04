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

    console.log("[v0] Analyze tender API called, text length:", documentText?.length)
    console.log("[v0] PDF fields provided:", pdfFields?.length || 0)

    if (!documentText) {
      return Response.json({ error: "Document text is required" }, { status: 400 })
    }

    const truncatedText = documentText.substring(0, 50000)
    console.log("[v0] Using truncated text length:", truncatedText.length)

    console.log("[v0] Calling AI Gateway with generateObject for structured analysis...")

    const formFieldsInstruction =
      pdfFields && pdfFields.length > 0
        ? `
IMPORTANT: The PDF has the following form fields that MUST be used exactly as named:
${pdfFields.map((f: any) => `- ${f.name} (${f.type})`).join("\n")}

For the formFields array, use these EXACT field names as the 'id' property. Create appropriate labels based on the field names.
For example, if the PDF has a field named "CompanyName", use:
{
  "id": "CompanyName",
  "label": "Company Name",
  "type": "${pdfFields.find((f: any) => f.name === "CompanyName")?.type || "text"}",
  ...
}
`
        : `
For form fields, extract every piece of information requested in the tender and create appropriate field IDs:
- Company details (name, registration, address, contacts)
- Financial information (turnover, bank details, tax numbers)
- Technical specifications and requirements
- Pricing and cost breakdowns
- Certifications and compliance documents
- Experience and qualifications
- References and past projects
- Any other information requested
`

    const { object: analysis } = await generateObject({
      model: "openai/gpt-4o",
      schema: tenderAnalysisSchema,
      prompt: `You are an expert tender analyst. Your task is to extract accurate, comprehensive information from this tender document to help bidders understand requirements and prepare winning proposals.

CRITICAL METADATA EXTRACTION RULES:

1. TENDER TITLE:
   - Extract the EXACT official title as written in the document
   - Look in: document header, "Tender Name/Title", "Project Name", "RFP/RFQ Title"
   - DO NOT summarize or paraphrase - use exact wording
   - If multiple titles exist, use the most prominent one

2. ISSUING ORGANIZATION:
   - Extract the FULL official name of the issuing entity
   - Look for: "Issued by", "Procuring Entity", "Department", "Ministry", "Organization"
   - Include full hierarchy if given (e.g., "Department of Health, Western Cape Provincial Government")
   - DO NOT abbreviate official names

3. SUBMISSION DEADLINE:
   - Extract the FINAL submission date and time
   - Look for: "Closing Date", "Submission Deadline", "Due Date", "Closing Time"
   - Format as YYYY-MM-DD (e.g., "2024-03-15")
   - If time is specified, note it in the deadlines array
   - If only month/year, use last day of month

4. TENDER VALUE/BUDGET:
   - Extract the estimated contract value or budget
   - Look for: "Tender Value", "Estimated Budget", "Contract Value", "Price Range"
   - Include currency symbol and amount (e.g., "R 2,500,000" or "ZAR 2.5M")
   - If range given, note both min and max
   - If not explicitly stated, mark as "Not specified"

5. CATEGORY:
   - Classify the tender type accurately
   - Common categories: Construction, IT Services, Medical Supplies, Consulting, Professional Services, Goods Supply, Maintenance, Security Services
   - Base on tender content and requirements

6. LOCATION:
   - Extract project location, service area, or delivery address
   - Look for: "Location", "Project Site", "Delivery Address", "Service Area"
   - Include city, province/state, and country if specified

COMPREHENSIVE ANALYSIS REQUIREMENTS:

SUMMARY (3-5 sentences):
- What is being procured (goods/services/works)
- Who is procuring it (organization and context)
- Key scope and objectives
- Main deliverables expected
- Overall contract duration if specified

KEY REQUIREMENTS (extract ALL, be specific):
- Mandatory qualifications and certifications
- Technical specifications and standards
- Experience requirements (years, similar projects)
- Financial requirements (turnover, bank guarantees)
- Registration requirements (tax, industry bodies)
- Insurance and bonding requirements
- Staffing and resource requirements
- Quality standards and compliance needs
- Any pre-qualification criteria

DEADLINES (extract ALL dates with context):
- Briefing session dates and venues
- Site visit dates (if applicable)
- Clarification question deadlines
- Document submission deadlines
- Presentation/interview dates
- Contract start and end dates
- Milestone dates
- Payment schedule dates

EVALUATION CRITERIA (extract exact scoring breakdown):
- Price/cost weighting (e.g., "Price: 80 points")
- Technical capability scoring
- Experience and track record points
- BBBEE or local content requirements
- Presentation/interview scoring
- Any other evaluation factors
- Minimum qualifying scores
- Evaluation methodology

RECOMMENDATIONS (strategic advice):
- Critical success factors for this bid
- Potential challenges and how to address them
- Key differentiators to emphasize
- Risk mitigation strategies
- Partnership or subcontracting suggestions
- Resource allocation priorities

ACTIONABLE TASKS (prioritized checklist):
- HIGH priority: Critical path items, mandatory requirements, early deadlines
- MEDIUM priority: Important but not urgent items
- LOW priority: Optional or later-stage items
- Include specific deadlines where mentioned
- Categorize by: documentation, technical, financial, compliance, other

${formFieldsInstruction}

IMPORTANT EXTRACTION PRINCIPLES:
- Extract EXACT information, do not paraphrase or summarize
- If information is not found, explicitly state "Not specified" rather than guessing
- Include ALL requirements, even if they seem minor
- Preserve numerical values, dates, and amounts exactly as written
- Note any ambiguities or unclear requirements
- Extract contact information for queries
- Identify mandatory vs optional requirements

Tender Document:
${truncatedText}`,
    })

    console.log("[v0] Successfully generated structured analysis")
    console.log("[v0] Extracted metadata:", analysis.tenderMetadata)
    console.log("[v0] Analysis summary:", analysis.summary?.substring(0, 100))
    console.log("[v0] Form fields count:", analysis.formFields?.length)

    return Response.json(analysis)
  } catch (error: any) {
    console.error("[v0] Tender analysis error:", error)
    console.error("[v0] Error details:", {
      message: error?.message,
      name: error?.name,
      stack: error?.stack?.substring(0, 500),
    })

    if (error?.message?.includes("credit card") || error?.message?.includes("payment")) {
      return Response.json(
        {
          error:
            "AI Gateway requires a valid credit card. Please add a payment method to your Vercel account at: vercel.com/account/billing",
          errorType: "payment_required",
        },
        { status: 402 },
      )
    }

    return Response.json(
      {
        error: "Failed to analyze tender document",
        details: error?.message || "Unknown error",
      },
      { status: 500 },
    )
  }
}
