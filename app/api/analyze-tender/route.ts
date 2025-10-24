import { generateText } from "ai"

export async function POST(request: Request) {
  try {
    const { documentText } = await request.json()

    console.log("[v0] Analyze tender API called, text length:", documentText?.length)

    if (!documentText) {
      return Response.json({ error: "Document text is required" }, { status: 400 })
    }

    console.log("[v0] Calling AI model for analysis...")

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

Tender Document:
${documentText}

IMPORTANT: Respond with ONLY valid JSON. Do not include markdown code blocks, explanations, or any text outside the JSON object.`,
    })

    console.log("[v0] AI response received, length:", text.length)
    console.log("[v0] AI response preview:", text.substring(0, 200))

    let cleanedText = text.trim()

    // Remove markdown code blocks if present
    if (cleanedText.startsWith("```json")) {
      cleanedText = cleanedText.replace(/^```json\s*/, "").replace(/\s*```$/, "")
    } else if (cleanedText.startsWith("```")) {
      cleanedText = cleanedText.replace(/^```\s*/, "").replace(/\s*```$/, "")
    }

    cleanedText = cleanedText.trim()

    console.log("[v0] Cleaned text preview:", cleanedText.substring(0, 200))

    let analysis
    try {
      analysis = JSON.parse(cleanedText)
      console.log("[v0] Successfully parsed JSON analysis")
    } catch (parseError) {
      console.error("[v0] JSON parse error:", parseError)
      console.error("[v0] Failed to parse text:", cleanedText.substring(0, 500))

      return Response.json(
        {
          error: "Failed to parse AI response as JSON. The AI returned invalid JSON format.",
          details: parseError instanceof Error ? parseError.message : "Unknown parse error",
        },
        { status: 500 },
      )
    }

    return Response.json(analysis)
  } catch (error: any) {
    console.error("[v0] Tender analysis error:", error)
    console.error("[v0] Error details:", {
      message: error?.message,
      name: error?.name,
      stack: error?.stack?.substring(0, 500),
    })

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

    return Response.json(
      {
        error: "Failed to analyze tender document",
        details: error?.message || "Unknown error",
      },
      { status: 500 },
    )
  }
}
