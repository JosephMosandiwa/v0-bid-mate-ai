import { generateText } from "ai"

export async function POST(request: Request) {
  try {
    const { documentText } = await request.json()

    if (!documentText) {
      console.error("[v0] No document text provided")
      return Response.json({ error: "Document text is required" }, { status: 400 })
    }

    console.log("[v0] Starting tender analysis, text length:", documentText.length)

    const { text } = await generateText({
      model: "openai/gpt-4-turbo",
      prompt: `You are an expert tender analyst. Analyze the following tender document and provide a comprehensive analysis in JSON format with the following structure:

{
  "summary": "A brief executive summary of the tender (2-3 sentences)",
  "keyRequirements": ["List of key requirements and eligibility criteria"],
  "deadlines": ["Important dates and deadlines"],
  "evaluationCriteria": ["How the tender will be evaluated and scored"],
  "recommendations": ["Strategic recommendations for the bidder"],
  "complianceChecklist": ["Mandatory documents and compliance items needed"],
  "actionableTasks": [
    {
      "task": "Task description",
      "priority": "high|medium|low",
      "category": "documentation|compliance|preparation|submission",
      "deadline": "Deadline if mentioned, or null"
    }
  ]
}

Extract specific actionable tasks that the bidder needs to complete. These should be concrete, measurable actions like:
- "Obtain tax clearance certificate"
- "Prepare company profile document"
- "Complete BEE verification"
- "Submit financial statements for last 3 years"

Prioritize tasks based on complexity and importance. Include deadlines if mentioned in the document.

IMPORTANT: You MUST respond with ONLY valid JSON. Do not include any explanatory text before or after the JSON. Start your response with { and end with }.

Tender Document:
${documentText}`,
    })

    console.log("[v0] AI response received, length:", text.length)
    console.log("[v0] AI response preview:", text.substring(0, 500))

    let analysis
    try {
      // Try to extract JSON if there's extra text
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      const jsonText = jsonMatch ? jsonMatch[0] : text

      console.log("[v0] Attempting to parse JSON...")
      analysis = JSON.parse(jsonText)
      console.log("[v0] JSON parsed successfully")
    } catch (parseError) {
      console.error("[v0] JSON parsing failed:", parseError)
      console.error("[v0] Raw AI response:", text)

      return Response.json(
        {
          error: "Failed to parse AI response as JSON. The AI returned invalid JSON format.",
          details: parseError instanceof Error ? parseError.message : "Unknown parsing error",
          rawResponse: text.substring(0, 1000), // Include first 1000 chars for debugging
        },
        { status: 500 },
      )
    }

    if (!analysis.summary || !analysis.keyRequirements || !analysis.actionableTasks) {
      console.error("[v0] Analysis missing required fields:", analysis)
      return Response.json(
        {
          error: "AI analysis is missing required fields",
          receivedFields: Object.keys(analysis),
        },
        { status: 500 },
      )
    }

    console.log("[v0] Analysis completed successfully")
    return Response.json(analysis)
  } catch (error: any) {
    console.error("[v0] Tender analysis error:", error)
    console.error("[v0] Error stack:", error?.stack)

    if (error?.message?.includes("API key") || error?.message?.includes("authentication")) {
      return Response.json(
        {
          error:
            "OpenAI API key is missing or invalid. Please add your OPENAI_API_KEY environment variable in the Vercel dashboard.",
          errorType: "api_key_required",
          dashboardUrl: "https://vercel.com/dashboard/stores",
        },
        { status: 403 },
      )
    }

    if (error?.message?.includes("model")) {
      return Response.json(
        {
          error: "AI model error. The specified model may not be available.",
          details: error.message,
        },
        { status: 500 },
      )
    }

    return Response.json(
      {
        error: "Failed to analyze tender document",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
