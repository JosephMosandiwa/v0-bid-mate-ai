// ============================================
// AI STRATEGIST - CHAT MESSAGE ENDPOINT
// ============================================

import { streamText, convertToModelMessages } from "ai"
import { createClient } from "@/lib/supabase/server"
import { StrategistService, buildStrategistPrompt } from "@/lib/engines/strategist"
import type { ConversationContextType } from "@/lib/engines/strategist"

export const maxDuration = 60

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    // Verify authentication
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const {
      message,
      conversation_id,
      context_type = "general",
      tender_id,
      include_context = true,
    } = await request.json()

    if (!message || typeof message !== "string") {
      return Response.json({ error: "Message is required" }, { status: 400 })
    }

    console.log("[Strategist] Chat request from user:", user.id)
    console.log("[Strategist] Context type:", context_type)
    console.log("[Strategist] Tender ID:", tender_id || "none")

    // Get or create conversation
    let conversationId = conversation_id
    if (!conversationId) {
      const conversation = await StrategistService.createConversation(
        user.id,
        context_type as ConversationContextType,
        tender_id,
      )
      if (!conversation) {
        return Response.json({ error: "Failed to create conversation" }, { status: 500 })
      }
      conversationId = conversation.id
    }

    // Save user message
    await StrategistService.addMessage(conversationId, "user", message)

    // Get conversation history
    const messages = await StrategistService.getConversationMessages(conversationId)

    // Build context for AI
    let systemPrompt = ""
    if (include_context) {
      const context = await StrategistService.buildContext(user.id, tender_id, context_type as ConversationContextType)
      systemPrompt = buildStrategistPrompt(context)
    } else {
      systemPrompt = buildStrategistPrompt({
        user_preferences: null,
        company_profile: null,
      })
    }

    // Convert messages to AI format
    const aiMessages = convertToModelMessages([
      { role: "system", content: systemPrompt },
      ...messages.map((m) => ({
        role: m.role as "user" | "assistant" | "system",
        content: m.content,
      })),
    ])

    console.log("[Strategist] Calling AI with", aiMessages.length, "messages")

    // Stream response
    const result = streamText({
      model: "openai/gpt-4-turbo",
      messages: aiMessages,
      temperature: 0.7,
      maxTokens: 2000,
      abortSignal: request.signal,
      onFinish: async ({ text }) => {
        // Save assistant response
        await StrategistService.addMessage(conversationId, "assistant", text, {
          model_used: "gpt-4-turbo",
        })
      },
    })

    // Return response with conversation ID header
    const response = result.toUIMessageStreamResponse()
    response.headers.set("X-Conversation-Id", conversationId)

    return response
  } catch (error: any) {
    console.error("[Strategist] Chat error:", error)

    if (error?.message?.includes("API key")) {
      return Response.json({ error: "AI service configuration error" }, { status: 503 })
    }

    return Response.json({ error: "Failed to process chat message" }, { status: 500 })
  }
}

// Get conversation messages
export async function GET(request: Request) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const conversationId = searchParams.get("conversation_id")

    if (conversationId) {
      // Get specific conversation messages
      const messages = await StrategistService.getConversationMessages(conversationId)
      return Response.json({ messages })
    } else {
      // Get user's conversations
      const conversations = await StrategistService.getUserConversations(user.id)
      return Response.json({ conversations })
    }
  } catch (error: any) {
    console.error("[Strategist] GET error:", error)
    return Response.json({ error: "Failed to fetch data" }, { status: 500 })
  }
}
