import { generateObject } from "ai"
import { z } from "zod"
import { getAnalysisPrompt } from "@/lib/prompts"

const tenderAnalysisSchema = z.object({
  tender_summary: z.object({
    tender_number: z.string().optional(),
    title: z.string().optional(),
    entity: z.string().optional(),
    description: z.string().optional(),
    contract_duration: z.string().optional(),
    closing_date: z.string().optional(),
    submission_method: z.string().optional(),
    compulsory_briefing: z.string().optional(),
    validity_period: z.string().optional(),
    contact_email: z.string().optional(),
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
    threshold: z.string().optional(),
    pricing_system: z.string().optional(),
  }),
  action_plan: z
    .object({
      critical_dates: z.array(
        z.object({
          date: z.string(),
          event: z.string(),
          time: z.string().optional(),
          location: z.string().optional(),
        }),
      ),
      preparation_tasks: z.array(
        z.object({
          task: z.string(),
          priority: z.enum(["High", "Medium", "Low"]),
          deadline: z.string(),
          category: z.string(),
        }),
      ),
    })
    .optional(),
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
    .optional(),
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

    console.log("[v0] Calling AI Gateway with generateObject for structured analysis...")
    console.log("[v0] Model: gpt-4o-mini")

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

    if (analysis.tender_summary?.closing_date) {
      analysis.tender_summary.closing_date = analysis.tender_summary.closing_date.split(" ")[0]
      console.log("[v0] Formatted closing_date:", analysis.tender_summary.closing_date)
    }

    console.log("[v0] ========================================")
    console.log("[v0] ANALYSIS RESULTS")
    console.log("[v0] ========================================")
    console.log("[v0] Successfully generated structured analysis")
    console.log("[v0] Tender summary:", JSON.stringify(analysis.tender_summary, null, 2))
    console.log("[v0] Compliance requirements count:", analysis.compliance_summary?.requirements?.length)
    console.log("[v0] Compliance disqualifiers count:", analysis.compliance_summary?.disqualifiers?.length)
    console.log("[v0] Compliance strengtheners count:", analysis.compliance_summary?.strengtheners?.length)
    console.log("[v0] Evaluation criteria count:", analysis.evaluation?.criteria?.length)
    console.log("[v0] Evaluation threshold:", analysis.evaluation?.threshold)
    console.log("[v0] Evaluation pricing system:", analysis.evaluation?.pricing_system)
    console.log("[v0] Action plan critical dates count:", analysis.action_plan?.critical_dates?.length || 0)
    console.log("[v0] Action plan preparation tasks count:", analysis.action_plan?.preparation_tasks?.length || 0)
    console.log("[v0] Form fields count:", analysis.formFields?.length || 0)
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
