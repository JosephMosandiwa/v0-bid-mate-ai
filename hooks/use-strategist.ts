// ============================================
// AI STRATEGIST - REACT HOOKS
// ============================================

"use client"

import { useState, useCallback } from "react"
import { useChat as useAIChat } from "ai/react"
import useSWR from "swr"
import type {
  StrategistConversation,
  StrategistUserPreferences,
  StrategistAlert,
  StrategistOpportunity,
  StrategistCompetitivenessScore,
  ConversationContextType,
} from "@/lib/engines/strategist"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

/**
 * Hook for strategist chat functionality
 */
export function useStrategistChat(options?: {
  conversationId?: string
  contextType?: ConversationContextType
  tenderId?: string
}) {
  const [conversationId, setConversationId] = useState(options?.conversationId)

  const chat = useAIChat({
    api: "/api/strategist/message",
    body: {
      conversation_id: conversationId,
      context_type: options?.contextType || "general",
      tender_id: options?.tenderId,
      include_context: true,
    },
    onResponse: (response) => {
      const newConversationId = response.headers.get("X-Conversation-Id")
      if (newConversationId && newConversationId !== conversationId) {
        setConversationId(newConversationId)
      }
    },
  })

  return {
    ...chat,
    conversationId,
  }
}

/**
 * Hook for strategist preferences
 */
export function useStrategistPreferences() {
  const { data, error, isLoading, mutate } = useSWR<{
    preferences: StrategistUserPreferences | null
    onboarding_completed: boolean
  }>("/api/strategist/preferences", fetcher)

  const updatePreferences = useCallback(
    async (updates: Partial<StrategistUserPreferences>) => {
      const response = await fetch("/api/strategist/preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      })

      if (response.ok) {
        mutate()
      }

      return response.ok
    },
    [mutate],
  )

  const completeOnboarding = useCallback(async () => {
    const response = await fetch("/api/strategist/preferences", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "complete_onboarding" }),
    })

    if (response.ok) {
      mutate()
    }

    return response.ok
  }, [mutate])

  return {
    preferences: data?.preferences,
    onboardingCompleted: data?.onboarding_completed,
    isLoading,
    error,
    updatePreferences,
    completeOnboarding,
    refresh: mutate,
  }
}

/**
 * Hook for strategist alerts
 */
export function useStrategistAlerts(options?: { unreadOnly?: boolean; limit?: number }) {
  const params = new URLSearchParams()
  if (options?.unreadOnly) params.set("unread", "true")
  if (options?.limit) params.set("limit", options.limit.toString())

  const { data, error, isLoading, mutate } = useSWR<{
    alerts: StrategistAlert[]
    unreadCount: number
  }>(`/api/strategist/alerts?${params.toString()}`, fetcher)

  const markAsRead = useCallback(
    async (alertId: string) => {
      const response = await fetch("/api/strategist/alerts", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ alert_id: alertId, action: "read" }),
      })

      if (response.ok) {
        mutate()
      }

      return response.ok
    },
    [mutate],
  )

  const dismissAlert = useCallback(
    async (alertId: string) => {
      const response = await fetch("/api/strategist/alerts", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ alert_id: alertId, action: "dismiss" }),
      })

      if (response.ok) {
        mutate()
      }

      return response.ok
    },
    [mutate],
  )

  return {
    alerts: data?.alerts || [],
    unreadCount: data?.unreadCount || 0,
    isLoading,
    error,
    markAsRead,
    dismissAlert,
    refresh: mutate,
  }
}

/**
 * Hook for opportunities
 */
export function useStrategistOpportunities(options?: { saved?: boolean }) {
  const params = new URLSearchParams()
  if (options?.saved) params.set("saved", "true")

  const { data, error, isLoading, mutate } = useSWR<{
    opportunities: StrategistOpportunity[]
  }>(`/api/strategist/opportunities?${params.toString()}`, fetcher)

  const discoverOpportunities = useCallback(async () => {
    const response = await fetch("/api/strategist/opportunities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "discover" }),
    })

    if (response.ok) {
      mutate()
    }

    return response.json()
  }, [mutate])

  const saveOpportunity = useCallback(
    async (opportunityId: string) => {
      const response = await fetch("/api/strategist/opportunities", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          opportunity_id: opportunityId,
          updates: { is_saved: true },
        }),
      })

      if (response.ok) {
        mutate()
      }

      return response.ok
    },
    [mutate],
  )

  return {
    opportunities: data?.opportunities || [],
    isLoading,
    error,
    discoverOpportunities,
    saveOpportunity,
    refresh: mutate,
  }
}

/**
 * Hook for competitiveness score
 */
export function useCompetitivenessScore(tenderId?: string) {
  const params = tenderId ? `?tender_id=${tenderId}` : ""

  const { data, error, isLoading, mutate } = useSWR<{
    score: StrategistCompetitivenessScore
  }>(`/api/strategist/readiness${params}`, fetcher)

  const recalculate = useCallback(async () => {
    const response = await fetch("/api/strategist/readiness", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tender_id: tenderId, force_recalculate: true }),
    })

    if (response.ok) {
      mutate()
    }

    return response.json()
  }, [mutate, tenderId])

  return {
    score: data?.score,
    isLoading,
    error,
    recalculate,
    refresh: mutate,
  }
}

/**
 * Hook for conversations list
 */
export function useStrategistConversations() {
  const { data, error, isLoading, mutate } = useSWR<{
    conversations: StrategistConversation[]
  }>("/api/strategist/message", fetcher)

  return {
    conversations: data?.conversations || [],
    isLoading,
    error,
    refresh: mutate,
  }
}

/**
 * Hook for strategies
 */
export function useStrategistStrategies(tenderId?: string) {
  const params = tenderId ? `?tender_id=${tenderId}` : ""

  const { data, error, isLoading, mutate } = useSWR<{
    strategies: any[]
  }>(`/api/strategist/strategy${params}`, fetcher)

  const generateStrategy = useCallback(
    async (options: { tender_id: string; strategy_type: string; title?: string }) => {
      const response = await fetch("/api/strategist/strategy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(options),
      })

      if (response.ok) {
        mutate()
      }

      return response.json()
    },
    [mutate],
  )

  return {
    strategies: data?.strategies || [],
    isLoading,
    error,
    generateStrategy,
    refresh: mutate,
  }
}
