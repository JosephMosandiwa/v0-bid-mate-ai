import { generateObject } from "ai"
import { z } from "zod"
import { getAnalysisPrompt } from "@/lib/prompts"

const tenderAnalysisSchema = z.object({
  tender_summary: z.object({
    tender_number: z.string().optional().default("Not specified"),
    title: z.string().optional().default("Not specified"),
    entity: z.string().optional().default("Not specified"),
    description: z.string().optional().default("Not specified"),
    contract_duration: z.string().optional().default("Not specified"),
    closing_date: z.string().optional().default("Not specified"),
    submission_method: z.string().optional().default("Not specified"),
    compulsory_briefing: z.string().optional().default("Not specified"),
    validity_period: z.string().optional().default("Not specified"),
    contact_email: z.string().optional().default("Not specified"),
  }),
  compliance_summary: z.object({
    requirements: z.array(z.string()).default([]),
    disqualifiers: z.array(z.string()).default([]),
    strengtheners: z.array(z.string()).default([]),
  }),
  evaluation: z.object({
    criteria: z
      .array(
        z.object({
          criterion: z.string(),
          weight: z.number(),
        }),
      )
      .default([]),
    threshold: z.string().optional().default("Not specified"),
    pricing_system: z.string().optional().default("Not specified"),
  }),
  action_plan: z
    .object({
      critical_dates: z
        .array(
          z.object({
            date: z.string(),
            event: z.string(),
            time: z.string().optional(),
            location: z.string().optional(),
          }),
        )
        .default([]),
      preparation_tasks: z
        .array(
          z.object({
            task: z.string(),
            priority: z.enum(["High", "Medium", "Low"]),
            deadline: z.string(),
            category: z.string(),
          }),
        )
        .default([]),
    })
    .optional()
    .default({ critical_dates: [], preparation_tasks: [] }),
  formFields: z
    .array(
      z.object({
        id: z.string(),
        label: z.string(),
        type: z.enum(["text", "textarea", "number", "date", "select", "checkbox", "file", "email", "tel"]),
        required: z.boolean(),
        section: z.string(),
        placeholder: z.string().optional(),
        description: z.string().optional(),
        options: z.array(z.string()).optional(),
      }),
    )
    .optional()
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

    const basePrompt = getAnalysisPrompt()

    console.log("[v0] Calling AI with model: gpt-4o-mini")
    console.log("[v0] Using custom prompt:", process.env.USE_CUSTOM_PROMPT === "true" ? "YES" : "NO")

    let analysis
    try {
      const result = await generateObject({
        model: "gpt-4o-mini",
        schema: tenderAnalysisSchema,
        prompt: `${basePrompt}

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

      console.log("[v0] Raw AI response received successfully")
      console.log("[v0] Response structure:", Object.keys(analysis))
    } catch (aiError: any) {
      console.error("[v0] ========================================")
      console.error("[v0] AI GENERATION ERROR")
      console.error("[v0] ========================================")
      console.error("[v0] Error type:", aiError?.constructor?.name)
      console.error("[v0] Error message:", aiError?.message)
      console.error("[v0] Error stack:", aiError?.stack?.substring(0, 1000))

      if (aiError?.message?.includes("schema")) {
        console.error("[v0] Schema validation failed - AI response doesn't match expected structure")
      }

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

    if (!analysis.action_plan) {
      analysis.action_plan = { critical_dates: [], preparation_tasks: [] }
    }
    if (!analysis.formFields) {
      analysis.formFields = []
    }

    if (analysis.tender_summary?.closing_date) {
      analysis.tender_summary.closing_date = analysis.tender_summary.closing_date.split(" ")[0]
      console.log("[v0] Formatted closing_date:", analysis.tender_summary.closing_date)
    }

    console.log("[v0] ========================================")
    console.log("[v0] ANALYSIS RESULTS")
    console.log("[v0] ========================================")
    console.log("[v0] Successfully generated structured analysis")
    console.log("[v0] Tender title:", analysis.tender_summary?.title)
    console.log("[v0] Requirements count:", analysis.compliance_summary?.requirements?.length || 0)
    console.log("[v0] Disqualifiers count:", analysis.compliance_summary?.disqualifiers?.length || 0)
    console.log("[v0] Criteria count:", analysis.evaluation?.criteria?.length || 0)
    console.log("[v0] Critical dates count:", analysis.action_plan?.critical_dates?.length || 0)
    console.log("[v0] Tasks count:", analysis.action_plan?.preparation_tasks?.length || 0)
    console.log("[v0] Form fields count:", analysis.formFields?.length || 0)
    console.log("[v0] ========================================")

    return Response.json(analysis)
  } catch (error: any) {
    console.error("[v0] ========================================")
    console.error("[v0] TENDER ANALYSIS ERROR")
    console.error("[v0] ========================================")
    console.error("[v0] Error type:", error?.constructor?.name)
    console.error("[v0] Error message:", error?.message)
    console.error("[v0] Error stack:", error?.stack)
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
