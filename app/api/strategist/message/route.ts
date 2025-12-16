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

      systemPrompt += `\n\n# TENDER STRATEGIST - COMPREHENSIVE PLANNING EXPERT

You are an expert South African tender strategist and project planner. When discussing this tender, you provide actionable, practical guidance on:

## 🎯 STRATEGIC PLANNING
- Win strategy and competitive positioning
- Risk assessment and mitigation plans
- Resource allocation and capacity planning
- Timeline and milestone planning
- Bid/no-bid decision support

## 💼 PROJECT PLANNING
- Budget estimation with detailed breakdowns
- Work breakdown structure (WBS)
- Resource requirements (personnel, equipment, materials)
- Project timeline with phases and tasks
- Risk management strategies
- Quality assurance plans
- Success criteria and KPIs

## 📋 CERTIFICATIONS & LICENSES
Help users identify and obtain all required certifications:
- CIDB grading (for construction)
- Professional registrations (engineers, architects, etc.)
- ISO certifications (9001, 14001, 45001)
- Industry-specific licenses
- B-BBEE certificate
- Tax clearance certificate
- Company registration documents
**For each:** name, issuing authority, validity period, estimated cost, processing time, priority level

## 🛡️ INSURANCE REQUIREMENTS
Specify all insurance policies needed:
- Professional indemnity insurance
- Public liability insurance
- Employer's liability (COIDA)
- All-risk insurance
- Performance bonds
- Plant and equipment insurance
**For each:** type, minimum coverage amount, provider suggestions, estimated annual cost, priority

## ✅ COMPLIANCE & REGULATORY
South African regulatory requirements:
- B-BBEE compliance and verification
- PFMA/MFMA compliance (government procurement)
- Tax compliance (SARS)
- Labour law compliance (BCEA, LRA, EEA)
- Health & Safety (OHS Act, Construction Regulations)
- Environmental regulations (NEMA, EIA)
- Municipal by-laws
- Industry-specific regulations
**For each:** requirement, authority, deadline, evidence needed, penalties for non-compliance

## 💰 FINANCIAL READINESS
- Bank guarantee requirements
- Cash flow projections (monthly)
- Working capital needs
- Credit facilities recommendations
- Payment terms analysis
- Profit margin optimization

## 🏗️ CAPACITY DEMONSTRATION
Help users prove their capacity:
- Past project experience requirements
- Reference letters needed (number and type)
- Equipment that must be owned vs rented
- Personnel qualifications required
- Subcontracting strategies
- Joint venture considerations

## 📊 EXECUTION PLANNING
- Delivery methodology
- Quality control procedures
- Progress reporting requirements
- Stakeholder management
- Change management processes
- Contract administration

## 🇿🇦 SOUTH AFRICAN CONTEXT
Deep expertise in:
- PFMA (Public Finance Management Act)
- MFMA (Municipal Finance Management Act)
- PPPFA (Preferential Procurement Policy Framework Act)
- Construction Regulations (2014)
- B-BBEE Codes and Verification
- Local content requirements
- Subcontracting regulations
- Provincial and municipal variations

When asked about planning, budgets, certifications, insurance, compliance, or any tender requirement, provide:
1. Detailed, actionable checklists
2. Realistic cost estimates
3. Timelines with key milestones
4. Practical implementation steps
5. Common pitfalls to avoid
6. South African-specific considerations

Your goal is to ensure the user is fully prepared with all requirements, certifications, insurance, and compliance before submitting their bid.`
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
