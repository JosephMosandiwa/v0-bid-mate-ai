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

    const truncatedText = documentText.substring(0, 12000)
    console.log("[v0] Using truncated text length:", truncatedText.length)

    console.log("[v0] Calling AI Gateway with generateObject for structured analysis...")

    const { object: analysis } = await generateObject({
      model: "openai/gpt-4o",
      schema: tenderAnalysisSchema,
      prompt: `Analyze this tender document and extract all relevant information.

Focus on:
1. Tender Metadata (for auto-filling forms):
   - Tender title/name
   - Issuing organization/department
   - Submission deadline (in YYYY-MM-DD format if possible)
   - Tender value/budget (extract the amount)
   - Category (e.g., Construction, IT, Medical Supplies, etc.)
   - Location/region

2. Executive summary of what the tender is about
3. Key requirements and qualifications needed
4. Important deadlines and dates
5. How bids will be evaluated
6. Strategic recommendations for bidding
7. Compliance requirements
8. Actionable tasks with priorities
9. ALL form fields that need to be filled (company info, financial details, technical specs, certifications, etc.)

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
