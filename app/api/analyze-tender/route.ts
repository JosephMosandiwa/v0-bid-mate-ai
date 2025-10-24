import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"

export async function POST(request: Request) {
  try {
    const { documentText } = await request.json()

    if (!documentText) {
      return Response.json({ error: "Document text is required" }, { status: 400 })
    }

    const { text } = await generateText({
      model: openai("gpt-4-turbo"),
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

Provide only the JSON response, no additional text.`,
    })

    // Parse the AI response
    const analysis = JSON.parse(text)

    return Response.json(analysis)
  } catch (error: any) {
    console.error("[v0] Tender analysis error:", error)

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

    return Response.json({ error: "Failed to analyze tender document" }, { status: 500 })
  }
}
