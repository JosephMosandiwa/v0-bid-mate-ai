import { generateText } from "ai"

export async function POST(request: Request) {
  try {
    const { documentText } = await request.json()

    console.log("[v0] Analyze tender API called, text length:", documentText?.length)

    if (!documentText) {
      return Response.json({ error: "Document text is required" }, { status: 400 })
    }

    console.log("[v0] Calling AI Gateway for analysis...")

    const { text } = await generateText({
      model: "openai/gpt-4o",
      system:
        "You are a JSON API that analyzes tender documents. You MUST respond with ONLY valid JSON. Never include explanations, apologies, or any text outside the JSON object. If you cannot analyze the document, return a JSON object with an error field.",
      prompt: `Analyze this tender document and return a JSON object with this exact structure:

{
  "summary": "Brief executive summary (2-3 sentences)",
  "keyRequirements": ["requirement 1", "requirement 2"],
  "deadlines": ["deadline 1", "deadline 2"],
  "evaluationCriteria": ["criteria 1", "criteria 2"],
  "recommendations": ["recommendation 1", "recommendation 2"],
  "complianceChecklist": ["item 1", "item 2"],
  "actionableTasks": [
    {
      "task": "Task description",
      "priority": "high",
      "category": "documentation",
      "deadline": "2024-01-01 or null"
    }
  ],
  "formFields": [
    {
      "id": "company_name",
      "label": "Company Name",
      "type": "text",
      "required": true,
      "placeholder": "Enter company name",
      "description": "Legal registered company name",
      "section": "Company Information"
    }
  ]
}

Extract ALL fields from the tender that need to be filled:
- Company info (name, registration, address, contacts)
- Financial info (turnover, bank details, tax numbers)
- Technical specifications
- Pricing breakdowns
- Certifications and compliance
- Experience and qualifications
- References and past projects

For formFields, use these types: text, email, tel, number, date, textarea, select, checkbox, radio, file

Tender Document:
${documentText.substring(0, 15000)}

Return ONLY the JSON object, no other text.`,
    })

    console.log("[v0] AI response received, length:", text.length)
    console.log("[v0] AI response preview:", text.substring(0, 200))

    let cleanedText = text.trim()

    // Remove markdown code blocks
    if (cleanedText.includes("```")) {
      const jsonMatch = cleanedText.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/)
      if (jsonMatch) {
        cleanedText = jsonMatch[1]
      } else {
        cleanedText = cleanedText.replace(/```(?:json)?\s*/g, "").replace(/```/g, "")
      }
    }

    // Remove any text before the first { or after the last }
    const firstBrace = cleanedText.indexOf("{")
    const lastBrace = cleanedText.lastIndexOf("}")

    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      cleanedText = cleanedText.substring(firstBrace, lastBrace + 1)
    }

    cleanedText = cleanedText.trim()

    console.log("[v0] Cleaned text preview:", cleanedText.substring(0, 200))

    let analysis
    try {
      analysis = JSON.parse(cleanedText)
      console.log("[v0] Successfully parsed JSON analysis")

      if (!analysis.summary || !analysis.formFields) {
        console.warn("[v0] Missing required fields in analysis, using defaults")
        analysis = {
          summary: analysis.summary || "Unable to generate summary",
          keyRequirements: analysis.keyRequirements || [],
          deadlines: analysis.deadlines || [],
          evaluationCriteria: analysis.evaluationCriteria || [],
          recommendations: analysis.recommendations || [],
          complianceChecklist: analysis.complianceChecklist || [],
          actionableTasks: analysis.actionableTasks || [],
          formFields: analysis.formFields || [],
        }
      }
    } catch (parseError) {
      console.error("[v0] JSON parse error:", parseError)
      console.error("[v0] Failed to parse text:", cleanedText.substring(0, 500))

      return Response.json({
        summary: "Unable to analyze document. The AI response was not in the expected format.",
        keyRequirements: ["Please review the document manually"],
        deadlines: [],
        evaluationCriteria: [],
        recommendations: ["Manual review recommended"],
        complianceChecklist: [],
        actionableTasks: [],
        formFields: [],
        error: "AI returned invalid JSON format",
      })
    }

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
