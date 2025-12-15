// ============================================
// AI STRATEGIST - CHAT MESSAGE ENDPOINT
// ============================================

import { streamText } from "ai"
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

    const body = await request.json()

    let userMessage: string
    if (body.messages && Array.isArray(body.messages)) {
      // useChat sends messages array - get the last user message
      const lastUserMessage = body.messages.filter((m: any) => m.role === "user").pop()
      userMessage = lastUserMessage?.content || ""
    } else {
      userMessage = body.message || ""
    }

    const { conversation_id, context_type = "general", tender_id, include_context = true, tenderContext } = body

    if (!userMessage || typeof userMessage !== "string") {
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
    await StrategistService.addMessage(conversationId, "user", userMessage)

    // Get conversation history
    const messages = await StrategistService.getConversationMessages(conversationId)

    // Build context for AI
    let systemPrompt = ""
    if (include_context) {
      const context = await StrategistService.buildContext(user.id, tender_id, context_type as ConversationContextType)

      if (tenderContext) {
        context.tender_context = tenderContext
      }

      systemPrompt = buildStrategistPrompt(context)

      // Add tender planning expertise
      systemPrompt += `\n\nYou are an expert South African tender strategist and project planner. When discussing this tender, you can help with:

**Strategic Planning:**
- Win strategy and competitive positioning
- Risk assessment and mitigation plans
- Resource allocation and capacity planning
- Timeline and milestone planning

**Project Planning:**
- Budget estimation and cost breakdown
- Work breakdown structure (WBS)
- Resource requirements (personnel, equipment, materials)
- Project timeline with phases and tasks
- Risk management strategies
- Quality assurance plans
- Success criteria and KPIs

**Compliance & Delivery:**
- B-BBEE, CIDB, and regulatory compliance
- Mandatory requirements checklist
- Document preparation guidance
- Submission best practices

**Contextual Expertise:**
- South African procurement regulations (PFMA, MFMA, PPPFA)
- Local market conditions and pricing
- Subcontracting and JV strategies
- Local content and preferential procurement

When asked about planning, budgets, timelines, or resources, provide detailed, actionable guidance based on the tender requirements and South African context.`
    } else {
      systemPrompt = buildStrategistPrompt({
        user_preferences: null,
        company_profile: null,
      })
    }

    const aiMessages = [
      { role: "system" as const, content: systemPrompt },
      ...messages.map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    ]

    console.log("[Strategist] Calling AI with", aiMessages.length, "messages")

    // Stream response
    const result = streamText({
      model: "openai/gpt-4o-mini",
      messages: aiMessages,
      temperature: 0.7,
      maxTokens: 2000,
      abortSignal: request.signal,
      onFinish: async ({ text }) => {
        // Save assistant response
        await StrategistService.addMessage(conversationId, "assistant", text, {
          model_used: "gpt-4o-mini",
        })
      },
    })

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
