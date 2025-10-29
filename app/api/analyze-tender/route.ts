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
    const { documentText } = await request.json()

    console.log("[v0] Analyze tender API called, text length:", documentText?.length)

    if (!documentText) {
      return Response.json({ error: "Document text is required" }, { status: 400 })
    }

    const truncatedText = documentText.substring(0, 20000)
    console.log("[v0] Using truncated text length:", truncatedText.length)

    console.log("[v0] Calling AI Gateway with generateObject for structured analysis...")

    const { object: analysis } = await generateObject({
      model: "openai/gpt-4o",
      schema: tenderAnalysisSchema,
      prompt: `You are analyzing a tender document. Your primary task is to accurately extract the tender metadata for auto-filling a form.

CRITICAL: Extract the following metadata with high accuracy:

1. TENDER TITLE:
   - Look for the main heading, title, or "Tender Name" field
   - Usually appears at the top of the document or in the first few paragraphs
   - May be labeled as: "Tender Title", "Project Name", "Bid Title", "RFP Title", etc.
   - Extract the EXACT title as written, do not summarize

2. ISSUING ORGANIZATION:
   - Look for the department, ministry, or company issuing the tender
   - Usually appears near the top or in a "Issued by" section
   - May be labeled as: "Issuing Authority", "Procuring Entity", "Department", "Ministry", etc.
   - Extract the FULL official name

3. SUBMISSION DEADLINE:
   - Look for the final date and time for submission
   - May be labeled as: "Closing Date", "Submission Deadline", "Due Date", "Closing Time", etc.
   - Convert to YYYY-MM-DD format (e.g., "2024-03-15")
   - If only month/year given, use the last day of that month

4. TENDER VALUE/BUDGET:
   - Look for the estimated value, budget, or contract amount
   - May be labeled as: "Tender Value", "Estimated Budget", "Contract Value", "Price Range", etc.
   - Extract the amount with currency (e.g., "R 2,500,000" or "ZAR 2.5M")
   - If a range is given, use the maximum value

5. CATEGORY:
   - Determine the type of tender (e.g., Construction, IT Services, Medical Supplies, Consulting, etc.)
   - Infer from the title and description if not explicitly stated

6. LOCATION:
   - Look for the project location, delivery location, or service area
   - May be labeled as: "Location", "Project Site", "Delivery Address", "Service Area", etc.
   - Extract city, province, or region

After extracting metadata, provide:
- Executive summary of the tender (2-3 sentences)
- Key requirements and qualifications needed
- All important deadlines and dates
- How bids will be evaluated
- Strategic recommendations for bidding
- Compliance requirements
- Actionable tasks with priorities
- ALL form fields that need to be filled (company info, financial details, technical specs, certifications, etc.)

For form fields, extract every piece of information requested in the tender:
- Company details (name, registration, address, contacts)
- Financial information (turnover, bank details, tax numbers)
- Technical specifications and requirements
- Pricing and cost breakdowns
- Certifications and compliance documents
- Experience and qualifications
- References and past projects
- Any other information requested

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
