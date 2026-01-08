"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Send,
  Target,
  AlertTriangle,
  Loader2,
  Sparkles,
  Lightbulb,
  DollarSign,
  ArrowRight,
  CheckCircle2,
  FileSpreadsheet,
  Calculator,
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

interface TenderContext {
  id: string
  title: string | null
  organization?: string | null
  description?: string | null
  deadline?: string | null
  value?: string | null
  requirements?: any
  analysis?: any
}

interface Message {
  role: "user" | "assistant"
  content: string
}

interface Props {
  tender: TenderContext
  className?: string
  onPlanGenerated?: (plan: any) => void // Added callback for when plan is generated
  onBoqGenerated?: (boq: any) => void // Added callback for BOQ generation
  onReadinessGenerated?: (readiness: any) => void // Added callback for readiness check
}

export function TenderContextStrategistPanel({
  tender,
  className,
  onPlanGenerated,
  onBoqGenerated,
  onReadinessGenerated,
}: Props) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [readiness, setReadiness] = useState<any>(null)
  const [loadingReadiness, setLoadingReadiness] = useState(false)
  const [isExpanded, setIsExpanded] = useState(true)
  const [generatingPlan, setGeneratingPlan] = useState(false)
  const [projectPlan, setProjectPlan] = useState<any>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (tender.id) {
      loadReadiness()
      loadProjectPlan()
    }
  }, [tender.id])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const loadReadiness = async () => {
    setLoadingReadiness(true)
    try {
      const response = await fetch(`/api/strategist/readiness?tenderId=${tender.id}`)
      if (response.ok) {
        const data = await response.json()
        setReadiness(data)
        if (onReadinessGenerated) {
          onReadinessGenerated(data)
        }
      }
    } catch (error) {
      console.error("[v0] Error loading readiness:", error)
    } finally {
      setLoadingReadiness(false)
    }
  }

  const handleSend = async () => {
    if (!input.trim() || loading) return

    const userMessage = input.trim()
    setInput("")
    setMessages((prev) => [...prev, { role: "user", content: userMessage }])
    setLoading(true)

    try {
      const response = await fetch("/api/strategist/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          tender_id: tender.id,
          context_type: "tender",
          include_context: true,
          tenderContext: {
            id: tender.id,
            title: tender.title,
            organization: tender.organization,
            description: tender.description,
            deadline: tender.deadline,
            value: tender.value,
            requirements: tender.requirements,
            analysis: tender.analysis,
          },
        }),
      })

      if (response.ok) {
        const reader = response.body?.getReader()
        const decoder = new TextDecoder()
        let assistantMessage = ""

        setMessages((prev) => [...prev, { role: "assistant", content: "" }])

        if (reader) {
          while (true) {
            const { done, value } = await reader.read()
            if (done) break

            const chunk = decoder.decode(value)
            const lines = chunk.split("\n")

            for (const line of lines) {
              if (line.startsWith("0:")) {
                try {
                  const text = JSON.parse(line.slice(2))
                  assistantMessage += text
                  setMessages((prev) => {
                    const newMessages = [...prev]
                    newMessages[newMessages.length - 1] = {
                      role: "assistant",
                      content: assistantMessage,
                    }
                    return newMessages
                  })
                } catch (e) {
                  // Skip parse errors
                }
              }
            }
          }
        }
      }
    } catch (error) {
      console.error("[v0] Error sending message:", error)
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleQuickAction = (action: string) => {
    let question = ""
    switch (action) {
      case "strategy":
        question = `Create a winning bid strategy for "${tender.title}". What are the key success factors?`
        break
      case "risks":
        question = `What are the potential risks and compliance gaps I should be aware of for this tender?`
        break
      case "pricing":
        question = `Help me develop a competitive pricing strategy for this bid.`
        break
      case "strengths":
        question = `Analyze my strengths and weaknesses for this specific tender based on typical requirements.`
        break
    }
    setInput(question)
  }

  const loadProjectPlan = async () => {
    try {
      const response = await fetch(`/api/strategist/plan?tenderId=${tender.id}&tenderType=custom`)
      if (response.ok) {
        const data = await response.json()
        if (data.plan) {
          setProjectPlan(data.plan)
          if (onPlanGenerated) {
            onPlanGenerated(data.plan)
          }
        }
      }
    } catch (error) {
      console.error("[v0] Error loading project plan:", error)
    }
  }

  const generateProjectPlan = async () => {
    if (generatingPlan) return

    try {
      setGeneratingPlan(true)
      console.log("[v0] Generating project plan for tender:", tender.id)

      const response = await fetch("/api/strategist/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tenderId: tender.id,
          tenderType: "custom",
          tenderTitle: tender.title,
          tenderDescription: tender.description,
          analysisData: tender.analysis,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.details || error.error || "Failed to generate project plan")
      }

      const { plan } = await response.json()
      console.log("[v0] Project plan generated successfully")

      if (onPlanGenerated) {
        onPlanGenerated(plan)
      }

      toast.success("Project Plan Generated", {
        description: "Your comprehensive project plan is now available in the Planning section",
      })
    } catch (error) {
      console.error("[v0] Plan generation error:", error)
      toast.error("Error", {
        description: error instanceof Error ? error.message : "Failed to generate project plan",
      })
    } finally {
      setGeneratingPlan(false)
    }
  }

  const generateBoq = async () => {
    try {
      console.log("[v0] Generating BOQ for tender:", tender.id)

      const response = await fetch("/api/strategist/boq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tenderId: tender.id,
          tenderType: "custom",
          tenderTitle: tender.title,
          tenderDescription: tender.description,
          analysisData: tender.analysis,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.details || error.error || "Failed to generate BOQ")
      }

      const { boq } = await response.json()
      console.log("[v0] BOQ generated successfully")

      if (onBoqGenerated) {
        onBoqGenerated(boq)
      }

      toast.success("BOQ Generated", {
        description: "Your Bill of Quantities is now available in the Financial section",
      })
    } catch (error) {
      console.error("[v0] BOQ generation error:", error)
      toast.error("Error", {
        description: error instanceof Error ? error.message : "Failed to generate BOQ",
      })
    }
  }

  const checkReadiness = async () => {
    try {
      console.log("[v0] Checking readiness for tender:", tender.id)

      const response = await fetch(`/api/strategist/readiness?tender_id=${tender.id}&tender_type=custom`)

      if (!response.ok) {
        throw new Error("Failed to check readiness")
      }

      const readiness = await response.json()
      console.log("[v0] Readiness check complete")

      if (onReadinessGenerated) {
        onReadinessGenerated(readiness)
      }

      toast.success("Readiness Check Complete", {
        description: "Your bid readiness assessment is now available in the Overview section",
      })
    } catch (error) {
      console.error("[v0] Readiness check error:", error)
      toast.error("Error", {
        description: "Failed to check readiness",
      })
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500"
    if (score >= 60) return "text-yellow-500"
    return "text-red-500"
  }

  const getScoreBg = (score: number) => {
    if (score >= 80) return "bg-green-500/10"
    if (score >= 60) return "bg-yellow-500/10"
    return "bg-red-500/10"
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b bg-muted/30">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            AI Strategist
          </h3>
          <Badge variant="outline" className="text-xs">
            Tender-Specific
          </Badge>
        </div>

        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">Generate strategic plans and analysis</p>
          <div className="grid grid-cols-1 gap-2">
            <Button
              onClick={generateProjectPlan}
              disabled={generatingPlan}
              variant="default"
              size="sm"
              className="w-full justify-start h-auto py-3"
            >
              {generatingPlan ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin flex-shrink-0" />
              ) : (
                <FileSpreadsheet className="mr-2 h-4 w-4 flex-shrink-0" />
              )}
              <div className="text-left flex-1">
                <div className="font-medium">Generate Project Plan</div>
                <div className="text-xs opacity-80 font-normal">Opens in Planning section</div>
              </div>
            </Button>

            <Button
              onClick={generateBoq}
              variant="outline"
              size="sm"
              className="w-full justify-start h-auto py-3 bg-transparent"
            >
              <Calculator className="mr-2 h-4 w-4 flex-shrink-0" />
              <div className="text-left flex-1">
                <div className="font-medium">Generate BOQ</div>
                <div className="text-xs opacity-80 font-normal">Opens in Financial section</div>
              </div>
            </Button>

            <Button
              onClick={checkReadiness}
              variant="outline"
              size="sm"
              className="w-full justify-start h-auto py-3 bg-transparent"
            >
              <CheckCircle2 className="mr-2 h-4 w-4 flex-shrink-0" />
              <div className="text-left flex-1">
                <div className="font-medium">Check Readiness</div>
                <div className="text-xs opacity-80 font-normal">Score your bid readiness</div>
              </div>
            </Button>
          </div>
        </div>
      </div>

      <div className="p-3 border-b bg-muted/20">
        <p className="text-xs font-medium mb-2 text-muted-foreground">Conversation Starters</p>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            className="text-xs h-auto py-2 justify-start bg-transparent"
            onClick={() => handleQuickAction("strategy")}
          >
            <Target className="h-3 w-3 mr-2 flex-shrink-0" />
            <span className="truncate">Bid Strategy</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-xs h-auto py-2 justify-start bg-transparent"
            onClick={() => handleQuickAction("risks")}
          >
            <AlertTriangle className="h-3 w-3 mr-2 flex-shrink-0" />
            <span className="truncate">Risk Analysis</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-xs h-auto py-2 justify-start bg-transparent"
            onClick={() => handleQuickAction("pricing")}
          >
            <DollarSign className="h-3 w-3 mr-2 flex-shrink-0" />
            <span className="truncate">Pricing Help</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-xs h-auto py-2 justify-start bg-transparent"
            onClick={() => handleQuickAction("strengths")}
          >
            <Lightbulb className="h-3 w-3 mr-2 flex-shrink-0" />
            <span className="truncate">SWOT Analysis</span>
          </Button>
        </div>
      </div>

      {/* Chat Messages */}
      {messages.length > 0 && (
        <ScrollArea className="h-48 rounded-lg border p-3" ref={scrollRef}>
          <div className="space-y-3">
            {messages.map((message, i) => (
              <div
                key={i}
                className={cn(
                  "p-3 rounded-lg text-sm whitespace-pre-wrap",
                  message.role === "user" ? "bg-primary text-primary-foreground ml-8" : "bg-muted mr-8",
                )}
              >
                {message.content || (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Thinking...
                  </span>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      )}

      {/* Chat Input */}
      <div className="flex gap-2">
        <Input
          placeholder="Ask about this tender..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
          disabled={loading}
          className="text-sm"
        />
        <Button size="icon" onClick={handleSend} disabled={loading || !input.trim()}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </Button>
      </div>

      {/* Full Strategist Link */}
      <Button variant="ghost" size="sm" className="w-full text-xs" asChild>
        <Link href={`/dashboard/strategist?tenderId=${tender.id}`}>
          Open Full Strategist
          <ArrowRight className="h-3 w-3 ml-2" />
        </Link>
      </Button>
    </div>
  )
}

export { TenderContextStrategistPanel as TenderContextPanel }
