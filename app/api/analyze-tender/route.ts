import { generateObject } from "ai"
import { z } from "zod"

const tenderAnalysisSchema = z.object({
  summary: z.string().describe("Brief executive summary of the tender (2-3 sentences)"),
  keyRequirements: z.array(z.string()).describe("List of key requirements from the tender document"),
  deadlines: z.array(z.string()).describe("Important deadlines and submission dates"),
  evaluationCriteria: z.array(z.string()).describe("Criteria used to evaluate bids"),
  recommendations: z.array(z.string()).describe("Strategic recommendations for bidding"),
  complianceChecklist: z.array(z.string()).describe("Compliance items that must be met"),
  actionableTasks: z
    .array(
      z.object({
        task: z.string().describe("Task description"),
        priority: z.enum(["high", "medium", "low"]).describe("Task priority"),
        category: z.enum(["documentation", "technical", "financial", "compliance", "other"]).describe("Task category"),
        deadline: z.string().nullable().describe("Task deadline if specified"),
      }),
    )
    .describe("Actionable tasks with priorities"),
  formFields: z
    .array(
      z.object({
        id: z.string().describe("Unique field identifier"),
        label: z.string().describe("Field label"),
        type: z
          .enum(["text", "email", "tel", "number", "date", "textarea", "select", "checkbox", "radio", "file"])
          .describe("Input type"),
        required: z.boolean().describe("Whether field is required"),
        placeholder: z.string().optional().describe("Placeholder text"),
        description: z.string().optional().describe("Field description or help text"),
        section: z.string().describe("Form section this field belongs to"),
        options: z.array(z.string()).optional().describe("Options for select/radio fields"),
      }),
    )
    .describe("Form fields extracted from the tender"),
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
1. Executive summary of what the tender is about
2. Key requirements and qualifications needed
3. Important deadlines and dates
4. How bids will be evaluated
5. Strategic recommendations for bidding
6. Compliance requirements
7. Actionable tasks with priorities
8. ALL form fields that need to be filled (company info, financial details, technical specs, certifications, etc.)

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
