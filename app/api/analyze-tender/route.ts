import generateTextViaProvider from "@/lib/providers"
import { extractText } from "unpdf"
import { PDFDocument } from "pdf-lib"
import { getAnalysisPrompt } from "@/lib/prompts"

async function extractPdfFormFields(pdfUrl: string): Promise<{
  fields: Array<{
    name: string
    type: string
    options?: string[]
    position?: { x: number; y: number; width: number; height: number; page: number }
  }>
  hasFormFields: boolean
}> {
  try {
    console.log("[v0] Extracting PDF form fields from:", pdfUrl)
    const pdfResponse = await fetch(pdfUrl)
    if (!pdfResponse.ok) {
      throw new Error(`Failed to fetch PDF: ${pdfResponse.status}`)
    }

    const pdfBytes = await pdfResponse.arrayBuffer()
    const pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true })
    const form = pdfDoc.getForm()
    const fields = form.getFields()
    const pages = pdfDoc.getPages()

    const extractedFields = fields.map((field) => {
      const name = field.getName()
      const typeName = field.constructor.name

      let type = "text"
      let options: string[] | undefined
      let position: { x: number; y: number; width: number; height: number; page: number } | undefined

      if (typeName === "PDFTextField") {
        type = "text"
      } else if (typeName === "PDFCheckBox") {
        type = "checkbox"
      } else if (typeName === "PDFRadioGroup") {
        type = "radio"
        try {
          options = (field as any).getOptions?.() || []
        } catch {
          options = []
        }
      } else if (typeName === "PDFDropdown") {
        type = "select"
        try {
          options = (field as any).getOptions?.() || []
        } catch {
          options = []
        }
      }

      try {
        const widgets = field.acroField.getWidgets()
        if (widgets.length > 0) {
          const widget = widgets[0]
          const rect = widget.getRectangle()

          // Find which page this widget is on
          let pageIndex = 0
          for (let i = 0; i < pages.length; i++) {
            const pageRef = pages[i].ref
            const widgetPage = widget.P()
            if (widgetPage && pageRef.toString() === widgetPage.toString()) {
              pageIndex = i
              break
            }
          }

          position = {
            x: rect.x,
            y: rect.y,
            width: rect.width,
            height: rect.height,
            page: pageIndex + 1, // 1-based page number
          }
          console.log(`[v0] Field "${name}" position:`, position)
        }
      } catch (posError) {
        console.log(`[v0] Could not extract position for field "${name}"`)
      }

      return { name, type, options, position }
    })

    console.log("[v0] Found", extractedFields.length, "PDF form fields with positions")

    return {
      fields: extractedFields,
      hasFormFields: extractedFields.length > 0,
    }
  } catch (error: any) {
    console.log("[v0] Could not extract PDF form fields:", error.message)
    return { fields: [], hasFormFields: false }
  }
}

export async function POST(request: Request) {
  try {
    const { documentText, documentUrl, pdfFields } = await request.json()

    console.log("[v0] ========================================")
    console.log("[v0] TENDER ANALYSIS REQUEST")
    console.log("[v0] ========================================")
    console.log("[v0] Document text length:", documentText?.length || 0, "characters")
    console.log("[v0] Document URL provided:", documentUrl ? "YES" : "NO")
    console.log("[v0] PDF fields provided:", pdfFields?.length || 0)

    if (!documentText && !documentUrl) {
      return Response.json({ error: "Either document text or document URL is required" }, { status: 400 })
    }

    let pdfFormFields: Array<{
      name: string
      type: string
      options?: string[]
      position?: { x: number; y: number; width: number; height: number; page: number }
    }> = []
    let hasPdfFormFields = false

    if (documentUrl) {
      const pdfFieldsResult = await extractPdfFormFields(documentUrl)
      pdfFormFields = pdfFieldsResult.fields
      hasPdfFormFields = pdfFieldsResult.hasFormFields
      console.log("[v0] PDF has interactive form fields:", hasPdfFormFields)
    }

    let textToAnalyze = documentText

    if (documentUrl && (!documentText || documentText === "")) {
      console.log("[v0] No text provided - extracting from PDF URL using unpdf...")
      console.log("[v0] PDF URL:", documentUrl)

      try {
        console.log("[v0] Step 1: Fetching PDF from blob storage...")

        const pdfResponse = await fetch(documentUrl)
        if (!pdfResponse.ok) {
          throw new Error(`Failed to fetch PDF: ${pdfResponse.status} ${pdfResponse.statusText}`)
        }

        const pdfArrayBuffer = await pdfResponse.arrayBuffer()
        console.log("[v0] PDF fetched successfully, size:", (pdfArrayBuffer.byteLength / 1024).toFixed(2), "KB")

        console.log("[v0] Step 2: Extracting text using unpdf library...")

        const { text, totalPages } = await extractText(pdfArrayBuffer, { mergePages: true })

        textToAnalyze = text
        console.log("[v0] ✓ Text extracted successfully using unpdf")
        console.log("[v0] Total pages:", totalPages)
        console.log("[v0] Extracted text length:", textToAnalyze.length, "characters")
        console.log("[v0] First 500 characters:", textToAnalyze.substring(0, 500))

        if (!textToAnalyze || textToAnalyze.trim().length < 50) {
          throw new Error(
            `Insufficient text extracted from PDF - only got ${textToAnalyze?.length || 0} characters. The PDF might be scanned/image-based.`,
          )
        }

        const wordCount = textToAnalyze.trim().split(/\s+/).length
        const avgWordsPerPage = Math.round(wordCount / totalPages)
        console.log("[v0] Word count:", wordCount)
        console.log("[v0] Average words per page:", avgWordsPerPage)

        if (avgWordsPerPage < 50) {
          console.warn("[v0] ⚠️ WARNING: Low word density - PDF might be partially scanned")
        }
      } catch (extractError: any) {
        console.error("[v0] PDF TEXT EXTRACTION FAILED")
        console.error("[v0] Error message:", extractError?.message)

        return Response.json(
          {
            error: "Failed to extract text from PDF",
            errorType: "pdf_extraction_error",
            details: extractError?.message || "Could not read PDF content",
            hint: "The PDF might be scanned/image-based, corrupted, or password-protected. Try converting it to a text-based PDF first.",
          },
          { status: 500 },
        )
      }
    }

    if (!textToAnalyze || textToAnalyze.length < 50) {
      return Response.json(
        {
          error: "Document text is too short to analyze",
          errorType: "insufficient_content",
          details: `Only ${textToAnalyze?.length || 0} characters available.`,
        },
        { status: 400 },
      )
    }

    const truncatedText = textToAnalyze!.substring(0, 100000)
    console.log("[v0] Using text for analysis, length:", truncatedText.length, "characters")

    const basePrompt = getAnalysisPrompt()

    let pdfFieldsInstruction = ""
    if (hasPdfFormFields && pdfFormFields.length > 0) {
      pdfFieldsInstruction = `
IMPORTANT - PDF FORM FIELDS DETECTED:
This PDF document has ${pdfFormFields.length} interactive form fields. You MUST use these EXACT field names as the "id" for your formFields output so they can be auto-filled in the PDF.

Here are the actual PDF form field names and their types:
${pdfFormFields
  .map((f) => {
    let info = `- "${f.name}" (type: ${f.type})`
    if (f.options && f.options.length > 0) {
      info += ` [options: ${f.options.join(", ")}]`
    }
    if (f.position) {
      info += ` [position: page ${f.position.page}, x ${f.position.x}, y ${f.position.y}, width ${f.position.width}, height ${f.position.height}]`
    }
    return info
  })
  .join("\n")}

For each PDF field above, create a corresponding formField entry with:
- id: Use the EXACT field name from the PDF (e.g., "${pdfFormFields[0]?.name || "Text1"}")
- label: A human-readable label describing what the field is for
- type: Match the PDF field type (text, checkbox, select, etc.)
- section: Group related fields together
- required: true if the field appears mandatory
- description: Help text for the user

If the PDF has fewer than 20 form fields, also add additional formFields for any information requested in the document text that doesn't have a corresponding PDF field.
`
    } else {
      pdfFieldsInstruction = `
NOTE: This PDF does not have interactive form fields. Generate formFields based on ALL fillable information requested in the document text. Create 25-50 fields covering company details, pricing, declarations, technical responses, and all SBD/MBD forms referenced in the document.
`
    }

    console.log("[v0] Step 3: Calling configured AI provider via wrapper for analysis...")

    try {
      const startTime = Date.now()

      const { text: aiResponse } = await generateTextViaProvider({
        model: "openai/gpt-4o-mini",
        prompt: `${basePrompt}

${pdfFieldsInstruction}

IMPORTANT: You MUST respond with ONLY valid JSON. No markdown, no explanations, no code blocks. Just pure JSON.

===========================================
TENDER DOCUMENT TEXT
===========================================

${truncatedText}

===========================================
END OF DOCUMENT
===========================================

Respond with ONLY the following JSON structure (no markdown, no code blocks, just raw JSON):

{
  "tender_summary": {
    "tender_number": "string or Not specified",
    "title": "string or Not specified",
    "entity": "string or Not specified",
    "description": "string or Not specified",
    "contract_duration": "string or Not specified",
    "closing_date": "YYYY-MM-DD format or Not specified",
    "submission_method": "string or Not specified",
    "compulsory_briefing": "string or Not specified",
    "validity_period": "string or Not specified",
    "contact_email": "string or Not specified"
  },
  "compliance_summary": {
    "requirements": ["array of requirement strings"],
    "disqualifiers": ["array of disqualifier strings"],
    "strengtheners": ["array of strengthener strings"]
  },
  "evaluation": {
    "criteria": [{"criterion": "string", "weight": number}],
    "threshold": "string or Not specified",
    "pricing_system": "string or Not specified"
  },
  "action_plan": {
    "critical_dates": [{"date": "YYYY-MM-DD", "event": "string", "time": "string", "location": "string"}],
    "preparation_tasks": [{"task": "string", "priority": "High/Medium/Low", "deadline": "string", "category": "string"}]
  },
  "financial_requirements": {
    "bank_guarantee": "string or Not specified",
    "performance_bond": "string or Not specified",
    "insurance_requirements": ["array of strings"],
    "financial_turnover": "string or Not specified",
    "audited_financials": "string or Not specified",
    "payment_terms": "string or Not specified"
  },
  "legal_registration": {
    "cidb_grading": "string or Not specified",
    "cipc_registration": "string or Not specified",
    "professional_registration": ["array of strings"],
    "joint_venture_requirements": "string or Not specified",
    "subcontracting_limitations": "string or Not specified"
  },
  "labour_employment": {
    "local_content": "string or Not specified",
    "subcontracting_limit": "string or Not specified",
    "labour_composition": "string or Not specified",
    "skills_development": "string or Not specified",
    "employment_equity": "string or Not specified"
  },
  "technical_specs": {
    "minimum_experience": "string or Not specified",
    "project_references": "string or Not specified",
    "key_personnel": ["array of strings"],
    "equipment_resources": ["array of strings"],
    "methodology_requirements": "string or Not specified"
  },
  "submission_requirements": {
    "number_of_copies": "string or Not specified",
    "formatting_requirements": "string or Not specified",
    "submission_address": "string or Not specified",
    "query_deadline": "string or Not specified",
    "late_submission_policy": "string or Not specified"
  },
  "penalties_payment": {
    "late_completion_penalty": "string or Not specified",
    "non_performance_penalty": "string or Not specified",
    "warranty_period": "string or Not specified",
    "payment_schedule": "string or Not specified",
    "retention_amount": "string or Not specified",
    "payment_timeframe": "string or Not specified"
  },
  "formFields": [
    {
      "id": "unique_field_id_or_pdf_field_name",
      "label": "Field Label",
      "type": "text|textarea|number|date|select|checkbox|file|email|tel",
      "required": true/false,
      "section": "Section Name",
      "placeholder": "optional placeholder",
      "description": "optional description",
      "options": ["for select fields only"],
      "pdfFieldName": "original PDF field name if applicable"
    }
  ],
  "pdfFormFieldsDetected": ${hasPdfFormFields},
  "pdfFormFieldCount": ${pdfFormFields.length}
}`,
      })

      const endTime = Date.now()
      console.log("[v0] AI generation completed in", (endTime - startTime) / 1000, "seconds")
      console.log("[v0] Raw AI response length:", aiResponse.length, "characters")
      console.log("[v0] First 500 chars of response:", aiResponse.substring(0, 500))

      let analysis
      try {
        let cleanedResponse = aiResponse.trim()
        if (cleanedResponse.startsWith("```json")) {
          cleanedResponse = cleanedResponse.slice(7)
        }
        if (cleanedResponse.startsWith("```")) {
          cleanedResponse = cleanedResponse.slice(3)
        }
        if (cleanedResponse.endsWith("```")) {
          cleanedResponse = cleanedResponse.slice(0, -3)
        }
        cleanedResponse = cleanedResponse.trim()

        analysis = JSON.parse(cleanedResponse)
        console.log("[v0] ✓ JSON parsed successfully")
      } catch (parseError: any) {
        console.error("[v0] JSON parse error:", parseError.message)
        console.error("[v0] Response that failed to parse:", aiResponse.substring(0, 1000))

        return Response.json(
          {
            error: "Failed to parse AI response as JSON",
            errorType: "json_parse_error",
            details: parseError.message,
          },
          { status: 500 },
        )
      }

      analysis.pdfFormFieldsDetected = hasPdfFormFields
      analysis.pdfFormFieldCount = pdfFormFields.length
      analysis.pdfFormFields = pdfFormFields

      const defaults = {
        tender_summary: {
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
        },
        compliance_summary: {
          requirements: [],
          disqualifiers: [],
          strengtheners: [],
        },
        evaluation: {
          criteria: [],
          threshold: "Not specified",
          pricing_system: "Not specified",
        },
        action_plan: {
          critical_dates: [],
          preparation_tasks: [],
        },
        financial_requirements: {
          bank_guarantee: "Not specified",
          performance_bond: "Not specified",
          insurance_requirements: [],
          financial_turnover: "Not specified",
          audited_financials: "Not specified",
          payment_terms: "Not specified",
        },
        legal_registration: {
          cidb_grading: "Not specified",
          cipc_registration: "Not specified",
          professional_registration: [],
          joint_venture_requirements: "Not specified",
          subcontracting_limitations: "Not specified",
        },
        labour_employment: {
          local_content: "Not specified",
          subcontracting_limit: "Not specified",
          labour_composition: "Not specified",
          skills_development: "Not specified",
          employment_equity: "Not specified",
        },
        technical_specs: {
          minimum_experience: "Not specified",
          project_references: "Not specified",
          key_personnel: [],
          equipment_resources: [],
          methodology_requirements: "Not specified",
        },
        submission_requirements: {
          number_of_copies: "Not specified",
          formatting_requirements: "Not specified",
          submission_address: "Not specified",
          query_deadline: "Not specified",
          late_submission_policy: "Not specified",
        },
        penalties_payment: {
          late_completion_penalty: "Not specified",
          non_performance_penalty: "Not specified",
          warranty_period: "Not specified",
          payment_schedule: "Not specified",
          retention_amount: "Not specified",
          payment_timeframe: "Not specified",
        },
        formFields: [],
      }

      for (const key of Object.keys(defaults)) {
        if (!analysis[key]) {
          console.log(`[v0] Adding default for missing: ${key}`)
          analysis[key] = defaults[key as keyof typeof defaults]
        } else if (
          typeof defaults[key as keyof typeof defaults] === "object" &&
          !Array.isArray(defaults[key as keyof typeof defaults])
        ) {
          analysis[key] = { ...defaults[key as keyof typeof defaults], ...analysis[key] }
        }
      }

      console.log("[v0] ========================================")
      console.log("[v0] ANALYSIS RESULTS")
      console.log("[v0] ========================================")
      console.log("[v0] Tender title:", analysis.tender_summary?.title)
      console.log("[v0] Requirements count:", analysis.compliance_summary?.requirements?.length || 0)
      console.log("[v0] Disqualifiers count:", analysis.compliance_summary?.disqualifiers?.length || 0)
      console.log("[v0] Criteria count:", analysis.evaluation?.criteria?.length || 0)
      console.log("[v0] Form fields count:", analysis.formFields?.length || 0)
      console.log("[v0] PDF form fields detected:", hasPdfFormFields)
      console.log("[v0] PDF form field count:", pdfFormFields.length)
      console.log("[v0] ========================================")

      return Response.json(analysis)
    } catch (aiError: any) {
      console.error("[v0] AI GENERATION ERROR")
      console.error("[v0] Error message:", aiError?.message)
      console.error("[v0] Error stack:", aiError?.stack?.substring(0, 500))

      return Response.json(
        {
          error: "AI generation failed",
          errorType: "ai_generation_error",
          details: aiError?.message || "Unknown AI error",
        },
        { status: 500 },
      )
    }
  } catch (error: any) {
    console.error("[v0] ========================================")
    console.error("[v0] TENDER ANALYSIS ERROR")
    console.error("[v0] ========================================")
    console.error("[v0] Error type:", error?.constructor?.name)
    console.error("[v0] Error message:", error?.message)

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
