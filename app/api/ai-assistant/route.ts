import { openai } from "@ai-sdk/openai"
import { streamText, convertToModelMessages } from "ai"

export const maxDuration = 30

export async function POST(request: Request) {
  try {
    const { messages, tenderContext } = await request.json()

    if (!messages || messages.length === 0) {
      return Response.json({ error: "Messages are required" }, { status: 400 })
    }

    console.log("[v0] AI Assistant request received with", messages.length, "messages")

    const systemPrompt = `You are an expert tender assistant helping users understand and fill out tender documents. 

${tenderContext ? `Current Tender Context:\nTitle: ${tenderContext.title}\nOrganization: ${tenderContext.organization}\nDescription: ${tenderContext.description}\n\n` : ""}

Your role is to:
1. Help users understand tender requirements and evaluation criteria
2. Provide guidance on how to fill out specific sections
3. Suggest improvements to their responses
4. Clarify any confusing terminology or requirements
5. Ensure compliance with tender specifications

Be concise, practical, and specific in your advice. Always reference the tender requirements when providing guidance.`

    const modelMessages = convertToModelMessages([{ role: "system", content: systemPrompt }, ...messages])

    console.log("[v0] Calling OpenAI GPT-4 with", modelMessages.length, "messages")

    const result = streamText({
      model: openai("gpt-4-turbo"),
      messages: modelMessages,
      temperature: 0.7,
      maxTokens: 2000,
      abortSignal: request.signal,
    })

    return result.toUIMessageStreamResponse({
      onFinish: async ({ isAborted }) => {
        if (isAborted) {
          console.log("[v0] AI Assistant request aborted")
        } else {
          console.log("[v0] AI Assistant response completed")
        }
      },
    })
  } catch (error: any) {
    console.error("[v0] AI assistant error:", error)

    if (error?.message?.includes("API key") || error?.message?.includes("authentication")) {
      return Response.json(
        {
          error:
            "OpenAI API key is missing or invalid. Please add your OPENAI_API_KEY environment variable in the Vercel dashboard.",
        },
        { status: 403 },
      )
    }

    return Response.json({ error: "Failed to process request: " + error.message }, { status: 500 })
  }
}
