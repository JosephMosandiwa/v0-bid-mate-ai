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
  financial_requirements: z
    .object({
      bank_guarantee: z.string().optional().default("Not specified"),
      performance_bond: z.string().optional().default("Not specified"),
      insurance_requirements: z.array(z.string()).default([]),
      financial_turnover: z.string().optional().default("Not specified"),
      audited_financials: z.string().optional().default("Not specified"),
      payment_terms: z.string().optional().default("Not specified"),
    })
    .optional()
    .default({
      bank_guarantee: "Not specified",
      performance_bond: "Not specified",
      insurance_requirements: [],
      financial_turnover: "Not specified",
      audited_financials: "Not specified",
      payment_terms: "Not specified",
    }),
  legal_registration: z
    .object({
      cidb_grading: z.string().optional().default("Not specified"),
      cipc_registration: z.string().optional().default("Not specified"),
      professional_registration: z.array(z.string()).default([]),
      joint_venture_requirements: z.string().optional().default("Not specified"),
      subcontracting_limitations: z.string().optional().default("Not specified"),
    })
    .optional()
    .default({
      cidb_grading: "Not specified",
      cipc_registration: "Not specified",
      professional_registration: [],
      joint_venture_requirements: "Not specified",
      subcontracting_limitations: "Not specified",
    }),
  labour_employment: z
    .object({
      local_content: z.string().optional().default("Not specified"),
      subcontracting_limit: z.string().optional().default("Not specified"),
      labour_composition: z.string().optional().default("Not specified"),
      skills_development: z.string().optional().default("Not specified"),
      employment_equity: z.string().optional().default("Not specified"),
    })
    .optional()
    .default({
      local_content: "Not specified",
      subcontracting_limit: "Not specified",
      labour_composition: "Not specified",
      skills_development: "Not specified",
      employment_equity: "Not specified",
    }),
  technical_specs: z
    .object({
      minimum_experience: z.string().optional().default("Not specified"),
      project_references: z.string().optional().default("Not specified"),
      key_personnel: z.array(z.string()).default([]),
      equipment_resources: z.array(z.string()).default([]),
      methodology_requirements: z.string().optional().default("Not specified"),
    })
    .optional()
    .default({
      minimum_experience: "Not specified",
      project_references: "Not specified",
      key_personnel: [],
      equipment_resources: [],
      methodology_requirements: "Not specified",
    }),
  submission_requirements: z
    .object({
      number_of_copies: z.string().optional().default("Not specified"),
      formatting_requirements: z.string().optional().default("Not specified"),
      submission_address: z.string().optional().default("Not specified"),
      query_deadline: z.string().optional().default("Not specified"),
      late_submission_policy: z.string().optional().default("Not specified"),
    })
    .optional()
    .default({
      number_of_copies: "Not specified",
      formatting_requirements: "Not specified",
      submission_address: "Not specified",
      query_deadline: "Not specified",
      late_submission_policy: "Not specified",
    }),
  penalties_payment: z
    .object({
      late_completion_penalty: z.string().optional().default("Not specified"),
      non_performance_penalty: z.string().optional().default("Not specified"),
      warranty_period: z.string().optional().default("Not specified"),
      payment_schedule: z.string().optional().default("Not specified"),
      retention_amount: z.string().optional().default("Not specified"),
      payment_timeframe: z.string().optional().default("Not specified"),
    })
    .optional()
    .default({
      late_completion_penalty: "Not specified",
      non_performance_penalty: "Not specified",
      warranty_period: "Not specified",
      payment_schedule: "Not specified",
      retention_amount: "Not specified",
      payment_timeframe: "Not specified",
    }),
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
      console.log("[v0] Starting AI generation...")
      const startTime = Date.now()

      const result = await generateObject({
        model: "gpt-4o-mini",
        schema: tenderAnalysisSchema,
        prompt: `${basePrompt}

===========================================
TENDER DOCUMENT TEXT
===========================================

${truncatedText}

===========================================
END OF DOCUMENT
===========================================

Now analyze the above tender document and provide your comprehensive analysis in the exact JSON format specified.`,
      })

      const endTime = Date.now()
      console.log("[v0] AI generation completed in", (endTime - startTime) / 1000, "seconds")

      analysis = result.object

      console.log("[v0] Raw AI response received successfully")
      console.log("[v0] Response structure:", Object.keys(analysis))

      console.log(
        "[v0] tender_summary keys:",
        analysis.tender_summary ? Object.keys(analysis.tender_summary) : "MISSING",
      )
      console.log(
        "[v0] compliance_summary keys:",
        analysis.compliance_summary ? Object.keys(analysis.compliance_summary) : "MISSING",
      )
      console.log("[v0] evaluation keys:", analysis.evaluation ? Object.keys(analysis.evaluation) : "MISSING")
      console.log("[v0] action_plan keys:", analysis.action_plan ? Object.keys(analysis.action_plan) : "MISSING")
      console.log(
        "[v0] financial_requirements keys:",
        analysis.financial_requirements ? Object.keys(analysis.financial_requirements) : "MISSING",
      )
      console.log(
        "[v0] legal_registration keys:",
        analysis.legal_registration ? Object.keys(analysis.legal_registration) : "MISSING",
      )
      console.log(
        "[v0] labour_employment keys:",
        analysis.labour_employment ? Object.keys(analysis.labour_employment) : "MISSING",
      )
      console.log(
        "[v0] technical_specs keys:",
        analysis.technical_specs ? Object.keys(analysis.technical_specs) : "MISSING",
      )
      console.log(
        "[v0] submission_requirements keys:",
        analysis.submission_requirements ? Object.keys(analysis.submission_requirements) : "MISSING",
      )
      console.log(
        "[v0] penalties_payment keys:",
        analysis.penalties_payment ? Object.keys(analysis.penalties_payment) : "MISSING",
      )
      console.log("[v0] formFields present:", Array.isArray(analysis.formFields) ? "YES" : "NO")
    } catch (aiError: any) {
      console.error("[v0] ========================================")
      console.error("[v0] AI GENERATION ERROR")
      console.error("[v0] ========================================")
      console.error("[v0] Error type:", aiError?.constructor?.name)
      console.error("[v0] Error message:", aiError?.message)
      console.error("[v0] Error stack:", aiError?.stack?.substring(0, 1000))

      if (aiError?.cause) {
        console.error("[v0] Error cause:", aiError.cause)
      }
      if (aiError?.response) {
        console.error("[v0] Error response:", aiError.response)
      }

      if (aiError?.message?.includes("schema")) {
        console.error("[v0] Schema validation failed - AI response doesn't match expected structure")
        console.error("[v0] This usually means the AI returned data in a different format than expected")
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

      return Response.json(
        {
          error: "AI generation failed",
          errorType: "ai_generation_error",
          details: aiError?.message || "Unknown AI error",
          hint: "Check the server logs for more details",
        },
        { status: 500 },
      )
    }

    if (!analysis.action_plan) {
      console.log("[v0] action_plan missing, adding defaults")
      analysis.action_plan = { critical_dates: [], preparation_tasks: [] }
    }
    if (!analysis.formFields) {
      console.log("[v0] formFields missing, adding empty array")
      analysis.formFields = []
    }
    if (!analysis.tender_summary) {
      console.log("[v0] WARNING: tender_summary is missing!")
      analysis.tender_summary = {
        tender_number: "Not specified",
        title: "Not specified",
        entity: "Not specified",
        description: "Not specified",
        contract_duration: "Not specified",
        closing_date: "Not specified",
        submission_method: "Not specified",
        compulsory_briefing: "Not specified",
        validity_period: "Not specified",
        contact_email: "Not specified",
      }
    }
    if (!analysis.compliance_summary) {
      console.log("[v0] WARNING: compliance_summary is missing!")
      analysis.compliance_summary = {
        requirements: [],
        disqualifiers: [],
        strengtheners: [],
      }
    }
    if (!analysis.evaluation) {
      console.log("[v0] WARNING: evaluation is missing!")
      analysis.evaluation = {
        criteria: [],
        threshold: "Not specified",
        pricing_system: "Not specified",
      }
    }
    if (!analysis.financial_requirements) {
      console.log("[v0] WARNING: financial_requirements is missing!")
      analysis.financial_requirements = {
        bank_guarantee: "Not specified",
        performance_bond: "Not specified",
        insurance_requirements: [],
        financial_turnover: "Not specified",
        audited_financials: "Not specified",
        payment_terms: "Not specified",
      }
    }
    if (!analysis.legal_registration) {
      console.log("[v0] WARNING: legal_registration is missing!")
      analysis.legal_registration = {
        cidb_grading: "Not specified",
        cipc_registration: "Not specified",
        professional_registration: [],
        joint_venture_requirements: "Not specified",
        subcontracting_limitations: "Not specified",
      }
    }
    if (!analysis.labour_employment) {
      console.log("[v0] WARNING: labour_employment is missing!")
      analysis.labour_employment = {
        local_content: "Not specified",
        subcontracting_limit: "Not specified",
        labour_composition: "Not specified",
        skills_development: "Not specified",
        employment_equity: "Not specified",
      }
    }
    if (!analysis.technical_specs) {
      console.log("[v0] WARNING: technical_specs is missing!")
      analysis.technical_specs = {
        minimum_experience: "Not specified",
        project_references: "Not specified",
        key_personnel: [],
        equipment_resources: [],
        methodology_requirements: "Not specified",
      }
    }
    if (!analysis.submission_requirements) {
      console.log("[v0] WARNING: submission_requirements is missing!")
      analysis.submission_requirements = {
        number_of_copies: "Not specified",
        formatting_requirements: "Not specified",
        submission_address: "Not specified",
        query_deadline: "Not specified",
        late_submission_policy: "Not specified",
      }
    }
    if (!analysis.penalties_payment) {
      console.log("[v0] WARNING: penalties_payment is missing!")
      analysis.penalties_payment = {
        late_completion_penalty: "Not specified",
        non_performance_penalty: "Not specified",
        warranty_period: "Not specified",
        payment_schedule: "Not specified",
        retention_amount: "Not specified",
        payment_timeframe: "Not specified",
      }
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
    console.log("[v0] Financial requirements:", analysis.financial_requirements ? "YES" : "NO")
    console.log("[v0] Legal registration:", analysis.legal_registration ? "YES" : "NO")
    console.log("[v0] Labour employment:", analysis.labour_employment ? "YES" : "NO")
    console.log("[v0] Technical specs:", analysis.technical_specs ? "YES" : "NO")
    console.log("[v0] Submission requirements:", analysis.submission_requirements ? "YES" : "NO")
    console.log("[v0] Penalties payment:", analysis.penalties_payment ? "YES" : "NO")
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
