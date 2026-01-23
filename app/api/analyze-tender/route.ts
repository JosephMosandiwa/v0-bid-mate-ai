import { generateText } from "ai"
import { google } from "@ai-sdk/google"
import { xai } from "@ai-sdk/xai"
import { extractText, getDocumentProxy } from "unpdf"
import { PDFDocument } from "pdf-lib"
import { getAnalysisPrompt } from "@/lib/prompts"

// Minimum characters per page to consider it "text-based" vs "scanned/image"
const MIN_CHARS_PER_PAGE = 100

/**
 * Extract text from scanned/image-based PDF pages using Gemini 2.5 Pro
 * Gemini 2.5 Pro has the best OCR accuracy for complex documents with tables, images, and mixed content
 */
async function extractTextWithVision(pdfUrl: string, pageNumbers: number[]): Promise<string> {
  console.log("[v0] ========== GEMINI 2.5 PRO OCR PROCESSING ==========")
  console.log(`[v0] PDF URL: ${pdfUrl}`)
  console.log(`[v0] Pages flagged for OCR: ${pageNumbers.length > 0 ? pageNumbers.join(", ") : "ALL pages"}`)
  console.log(`[v0] Model: google/gemini-2.5-pro`)
  
  try {
    // First, fetch the PDF and convert to base64 for Gemini
    console.log("[v0] Fetching PDF for Gemini 2.5 Pro processing...")
    const pdfResponse = await fetch(pdfUrl)
    if (!pdfResponse.ok) {
      throw new Error(`Failed to fetch PDF: ${pdfResponse.status}`)
    }
    const pdfBuffer = await pdfResponse.arrayBuffer()
    const pdfBase64 = Buffer.from(pdfBuffer).toString("base64")
    console.log(`[v0] PDF size: ${(pdfBuffer.byteLength / 1024).toFixed(2)} KB`)
    
    console.log("[v0] Calling Gemini 2.5 Pro for maximum OCR accuracy...")
    const startTime = Date.now()
    
    // Use Gemini 2.5 Pro for best-in-class document OCR accuracy
    const { text: extractedText } = await generateText({
      model: google("gemini-2.5-pro"),
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `You are an expert document OCR assistant specializing in South African tender documents. Extract ALL text from this PDF document with perfect accuracy.

CRITICAL INSTRUCTIONS:
1. Extract EVERY piece of text, including:
   - All headings, subheadings, and body text
   - Table contents (preserve structure with | separators)
   - Form field labels and any pre-filled values
   - Text in images, screenshots, or scanned sections
   - Headers, footers, and page numbers
   - Fine print and footnotes

2. Document Structure to Identify:
   - SBD Forms (SBD 1, SBD 2, SBD 3.1, SBD 4, SBD 6.1, SBD 6.2, SBD 8, SBD 9)
   - Bill of Quantities / Pricing Schedules / Annexures
   - Terms of Reference / Specifications
   - General Conditions of Contract (GCC)
   - Special Conditions of Contract (SCC)

3. For Tables and BOQ:
   - Preserve column alignment
   - Include all line items, quantities, units
   - Keep item numbers and descriptions together

4. Output Format:
   - Pure text only, no markdown formatting
   - Preserve paragraph breaks
   - Use | for table column separators
   - Indicate page breaks with "--- Page X ---"

Extract the complete document text now:`,
            },
            {
              type: "file",
              data: pdfBase64,
              mimeType: "application/pdf",
            },
          ],
        },
      ],
    })

    const duration = ((Date.now() - startTime) / 1000).toFixed(2)
    console.log("[v0] ----------------------------------------")
    console.log(`[v0] Gemini OCR completed in ${duration}s`)
    console.log(`[v0] Extracted text length: ${extractedText?.length || 0} characters`)
    console.log(`[v0] Word count: ${extractedText?.split(/\s+/).length || 0} words`)
    
    if (extractedText && extractedText.length > 0) {
      console.log("[v0] -------- GEMINI OCR OUTPUT (first 2000 chars) --------")
      console.log(extractedText.substring(0, 2000))
      console.log("[v0] -------- END OF PREVIEW --------")
    } else {
      console.log("[v0] WARNING: Gemini OCR returned empty or null text")
    }
    console.log("[v0] ================================================")
    
    return extractedText || ""
  } catch (error: any) {
    console.error("[v0] ========== GEMINI OCR ERROR ==========")
    console.error("[v0] Error message:", error?.message || error)
    console.error("[v0] Full error:", JSON.stringify(error, null, 2))
    console.error("[v0] =======================================")
    return ""
  }
}

/**
 * Check if PDF pages are scanned/image-based by analyzing text density
 */
async function analyzePdfTextDensity(pdfBytes: ArrayBuffer): Promise<{
  isScanned: boolean
  totalPages: number
  scannedPages: number[]
  textPerPage: number[]
  pageTexts: string[]
}> {
  try {
    console.log("[v0] ========== PDF TEXT DENSITY ANALYSIS ==========")
    const pdf = await getDocumentProxy(new Uint8Array(pdfBytes))
    const result = await extractText(pdf, { mergePages: false })
    const pageTexts = Array.isArray(result.text) ? result.text : [result.text]
    
    const textPerPage = pageTexts.map(t => (t || "").length)
    const scannedPages: number[] = []
    
    console.log("[v0] Page-by-page text extraction results:")
    textPerPage.forEach((charCount, index) => {
      const pageNum = index + 1
      const isLowText = charCount < MIN_CHARS_PER_PAGE
      console.log(`[v0]   Page ${pageNum}: ${charCount} chars ${isLowText ? "(LOW - likely scanned/image)" : "(OK)"}`)
      
      // Log first 200 chars of each page for debugging
      const pagePreview = (pageTexts[index] || "").substring(0, 200).replace(/\n/g, " ")
      console.log(`[v0]   Page ${pageNum} preview: "${pagePreview}..."`)
      
      if (isLowText) {
        scannedPages.push(pageNum)
      }
    })
    
    const avgCharsPerPage = textPerPage.reduce((a, b) => a + b, 0) / textPerPage.length
    const isScanned = avgCharsPerPage < MIN_CHARS_PER_PAGE || scannedPages.length > textPerPage.length / 2
    
    console.log("[v0] ----------------------------------------")
    console.log(`[v0] SUMMARY: ${textPerPage.length} pages total`)
    console.log(`[v0] Average chars/page: ${Math.round(avgCharsPerPage)}`)
    console.log(`[v0] Scanned/image pages: ${scannedPages.length} (pages: ${scannedPages.join(", ") || "none"})`)
    console.log(`[v0] Document classification: ${isScanned ? "SCANNED/IMAGE-BASED" : "TEXT-BASED"}`)
    console.log("[v0] ================================================")
    
    return {
      isScanned,
      totalPages: textPerPage.length,
      scannedPages,
      textPerPage,
      pageTexts,
    }
  } catch (error) {
    console.error("[v0] PDF density analysis failed:", error)
    return { isScanned: true, totalPages: 0, scannedPages: [], textPerPage: [], pageTexts: [] }
  }
}

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
      console.log("[v0] No text provided - extracting from PDF URL...")
      console.log("[v0] PDF URL:", documentUrl)

      try {
        console.log("[v0] Step 1: Fetching PDF from blob storage...")

        const pdfResponse = await fetch(documentUrl)
        if (!pdfResponse.ok) {
          throw new Error(`Failed to fetch PDF: ${pdfResponse.status} ${pdfResponse.statusText}`)
        }

        const pdfArrayBuffer = await pdfResponse.arrayBuffer()
        console.log("[v0] PDF fetched successfully, size:", (pdfArrayBuffer.byteLength / 1024).toFixed(2), "KB")

        console.log("[v0] Step 2: Analyzing PDF text density...")
        const densityAnalysis = await analyzePdfTextDensity(pdfArrayBuffer)

        console.log("[v0] Step 3: Extracting text...")
        
        if (densityAnalysis.isScanned || densityAnalysis.scannedPages.length > 0) {
          // PDF has scanned/image content - use GPT-4o vision
          console.log("[v0] PDF contains scanned/image pages - using GPT-4o vision for OCR...")
          
          const visionText = await extractTextWithVision(documentUrl, densityAnalysis.scannedPages)
          
          if (visionText && visionText.length > 100) {
            // Also get any text-based content
            const { text: regularText } = await extractText(pdfArrayBuffer, { mergePages: true })
            
            // Combine vision OCR with regular text extraction
            if (regularText && regularText.length > visionText.length) {
              textToAnalyze = regularText
              console.log("[v0] Using regular text extraction (more content):", regularText.length, "chars")
            } else {
              textToAnalyze = visionText
              console.log("[v0] Using vision OCR text:", visionText.length, "chars")
            }
          } else {
            // Vision failed, try regular extraction as fallback
            const { text } = await extractText(pdfArrayBuffer, { mergePages: true })
            textToAnalyze = text
          }
        } else {
          // Standard text-based PDF - use unpdf
          console.log("[v0] PDF is text-based - using unpdf...")
          const { text, totalPages } = await extractText(pdfArrayBuffer, { mergePages: true })
          textToAnalyze = text
          console.log("[v0] Text extracted from", totalPages, "pages")
        }

        // Log extraction results
        console.log("[v0] ========== TEXT EXTRACTION COMPLETE ==========")
        console.log("[v0] Total extracted text length:", textToAnalyze?.length || 0, "characters")
        console.log("[v0] Word count:", textToAnalyze?.trim().split(/\s+/).length || 0)
        console.log("[v0] -------- EXTRACTED TEXT OUTPUT (first 3000 chars) --------")
        console.log(textToAnalyze?.substring(0, 3000) || "(empty)")
        console.log("[v0] -------- END OF PREVIEW --------")
        console.log("[v0] ================================================")

        if (!textToAnalyze || textToAnalyze.trim().length < 50) {
          // Last resort - try vision on entire document
          console.log("[v0] WARNING: Insufficient text extracted (< 50 chars)")
          console.log("[v0] Attempting full document vision OCR as last resort...")
          const visionText = await extractTextWithVision(documentUrl, [])
          
          if (visionText && visionText.length > 50) {
            textToAnalyze = visionText
            console.log("[v0] SUCCESS: Vision OCR extracted:", visionText.length, "characters")
            console.log("[v0] -------- VISION OCR FULL OUTPUT (first 3000 chars) --------")
            console.log(visionText.substring(0, 3000))
            console.log("[v0] -------- END OF PREVIEW --------")
          } else {
            console.log("[v0] FAILURE: Vision OCR also failed or returned insufficient text")
            throw new Error(
              `Insufficient text extracted from PDF - only got ${textToAnalyze?.length || 0} characters. Vision OCR also failed.`,
            )
          }
        }

        const wordCount = textToAnalyze.trim().split(/\s+/).length
        console.log("[v0] FINAL: Using", textToAnalyze.length, "chars /", wordCount, "words for analysis")
      } catch (extractError: any) {
        console.error("[v0] PDF TEXT EXTRACTION FAILED")
        console.error("[v0] Error message:", extractError?.message)

        return Response.json(
          {
            error: "Failed to extract text from PDF",
            errorType: "pdf_extraction_error",
            details: extractError?.message || "Could not read PDF content",
            hint: "The PDF might be corrupted or password-protected.",
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

    console.log("[v0] Step 3: Calling Vercel AI Gateway with generateText...")

    try {
      const startTime = Date.now()

      // Use Grok 3 (full model) for deep, thorough tender analysis
      console.log("[v0] Using xAI Grok 3 (full) for deep tender analysis...")
      const { text: aiResponse } = await generateText({
        model: xai("grok-3"),
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
  "documents_identified": [
    {
      "document_name": "Name of document",
      "document_type": "SBD1|SBD2|SBD3|SBD4|SBD6.1|SBD6.2|SBD8|SBD9|TOR|BOQ|GCC|SCC|Specifications|Other",
      "page_range": "e.g., Pages 1-5",
      "is_returnable": true/false,
      "has_fillable_fields": true/false,
      "description": "Brief description"
    }
  ],
  "boq": {
    "found": true/false,
    "document_name": "Name of BOQ document if found",
    "page_location": "Page numbers",
    "structure": "itemized|schedule_of_rates|lump_sum|mixed",
    "currency": "ZAR",
    "vat_treatment": "exclusive|inclusive",
    "sections": [
      {
        "section_number": "1",
        "section_name": "Section name",
        "items": [
          {
            "item_number": "1.1",
            "description": "Item description",
            "unit": "each|m2|m3|hours|lump sum",
            "quantity": 0,
            "rate": null,
            "amount": null,
            "notes": ""
          }
        ],
        "section_subtotal": null
      }
    ],
    "summary": {
      "subtotal": null,
      "contingency_percent": 5,
      "contingency_amount": null,
      "vat_percent": 15,
      "vat_amount": null,
      "total_inclusive": null
    },
    "pricing_instructions": ""
  },
  "project_plan": {
    "project_overview": {
      "title": "Project title",
      "objective": "Project objective",
      "scope_summary": "Brief scope",
      "contract_type": "Fixed price|Time & Materials",
      "contract_duration_months": 0
    },
    "phases": [
      {
        "phase_number": 1,
        "phase_name": "Phase name",
        "duration_weeks": 0,
        "key_activities": ["Activity 1"],
        "deliverables": ["Deliverable 1"],
        "milestones": [
          {
            "name": "Milestone name",
            "target_date": "Week X",
            "payment_linked": false,
            "payment_percent": 0
          }
        ],
        "resources_required": ["Resource 1"],
        "risks": [
          {
            "risk": "Risk description",
            "mitigation": "Mitigation strategy"
          }
        ]
      }
    ],
    "resource_requirements": {
      "key_personnel": [
        {
          "role": "Role name",
          "qualifications_required": "Qualifications",
          "quantity": 1,
          "duration": "Full project"
        }
      ],
      "equipment": [],
      "materials": [],
      "subcontractors": []
    },
    "budget_breakdown": {
      "labour_percent": 40,
      "materials_percent": 35,
      "equipment_percent": 10,
      "overheads_percent": 10,
      "profit_percent": 5
    },
    "quality_management": {
      "standards_applicable": [],
      "inspections": [],
      "testing_requirements": [],
      "documentation_required": []
    },
    "health_safety_environment": {
      "hse_plan_required": false,
      "certifications_required": [],
      "specific_hazards": [],
      "environmental_requirements": []
    }
  },
  "fillable_fields": [
    {
      "id": "unique_field_id",
      "document_source": "SBD 1",
      "page_number": 1,
      "field_label": "Field Label",
      "field_type": "text|number|date|currency|checkbox|signature|dropdown|textarea",
      "is_required": true,
      "validation_hint": "Validation hint",
      "example_value": "Example",
      "section": "Company Information|Financial|Technical|Declaration|Pricing",
      "auto_fill_source": "company_name|registration_number|vat_number|etc"
    }
  ],
  "forms_summary": {
    "total_fields": 0,
    "required_fields": 0,
    "by_document": {}
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
        documents_identified: [],
        boq: {
          found: false,
          document_name: null,
          page_location: null,
          structure: null,
          currency: "ZAR",
          vat_treatment: "exclusive",
          sections: [],
          summary: null,
          pricing_instructions: null,
        },
        project_plan: null,
        fillable_fields: [],
        forms_summary: {
          total_fields: 0,
          required_fields: 0,
          by_document: {},
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
      console.log("[v0] Documents identified:", analysis.documents_identified?.length || 0)
      console.log("[v0] BOQ found:", analysis.boq?.found || false)
      console.log("[v0] BOQ sections:", analysis.boq?.sections?.length || 0)
      console.log("[v0] Project plan phases:", analysis.project_plan?.phases?.length || 0)
      console.log("[v0] Fillable fields count:", analysis.fillable_fields?.length || 0)
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
