"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  Brain,
  Send,
  Target,
  FileText,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Loader2,
  Sparkles,
  Lightbulb,
  DollarSign,
  Shield,
  ArrowRight,
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface TenderContext {
  id: string
  title: string
  organization?: string
  description?: string
  deadline?: string
  value?: string
  requirements?: string[]
  analysis?: any
}

interface Message {
  role: "user" | "assistant"
  content: string
}

interface Props {
  tender: TenderContext
  className?: string
}

interface TenderContextPanelProps {
  tenderId: string
  tenderTitle: string
  tenderDescription?: string
  documents?: any[]
  analysis?: any
  className?: string
}

export function TenderContextStrategistPanel({ tender, className }: Props) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [readiness, setReadiness] = useState<any>(null)
  const [loadingReadiness, setLoadingReadiness] = useState(false)
  const [isExpanded, setIsExpanded] = useState(true)
  const [quickAnalysis, setQuickAnalysis] = useState<any>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (tender.id) {
      loadReadiness()
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
    <Card className={cn("border-primary/20", className)}>
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Brain className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-sm flex items-center gap-2">
                    AI Strategist
                    <Badge variant="secondary" className="text-xs">
                      <Sparkles className="h-3 w-3 mr-1" />
                      Beta
                    </Badge>
                  </CardTitle>
                  <CardDescription className="text-xs">Get bid advice for this tender</CardDescription>
                </div>
              </div>
              {isExpanded ? (
                <ChevronUp className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="space-y-4 pt-0">
            {/* Readiness Score */}
            {loadingReadiness ? (
              <div className="p-4 rounded-lg bg-muted/50 flex items-center justify-center">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                <span className="text-sm text-muted-foreground">Calculating readiness...</span>
              </div>
            ) : readiness ? (
              <div className="p-4 rounded-lg bg-muted/50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Bid Readiness</span>
                  <span className={cn("text-lg font-bold", getScoreColor(readiness.overall_score || 0))}>
                    {readiness.overall_score || 0}%
                  </span>
                </div>
                <Progress value={readiness.overall_score || 0} className="h-2" />

                <div className="grid grid-cols-3 gap-2 pt-2">
                  <div className={cn("p-2 rounded text-center", getScoreBg(readiness.document_score || 0))}>
                    <FileText className={cn("h-4 w-4 mx-auto mb-1", getScoreColor(readiness.document_score || 0))} />
                    <p className="text-xs font-medium">{readiness.document_score || 0}%</p>
                    <p className="text-[10px] text-muted-foreground">Docs</p>
                  </div>
                  <div className={cn("p-2 rounded text-center", getScoreBg(readiness.compliance_score || 0))}>
                    <Shield className={cn("h-4 w-4 mx-auto mb-1", getScoreColor(readiness.compliance_score || 0))} />
                    <p className="text-xs font-medium">{readiness.compliance_score || 0}%</p>
                    <p className="text-[10px] text-muted-foreground">Compliance</p>
                  </div>
                  <div className={cn("p-2 rounded text-center", getScoreBg(readiness.experience_score || 0))}>
                    <Target className={cn("h-4 w-4 mx-auto mb-1", getScoreColor(readiness.experience_score || 0))} />
                    <p className="text-xs font-medium">{readiness.experience_score || 0}%</p>
                    <p className="text-[10px] text-muted-foreground">Experience</p>
                  </div>
                </div>

                {readiness.improvement_areas?.length > 0 && (
                  <div className="pt-2 space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">Areas to Improve:</p>
                    {readiness.improvement_areas.slice(0, 2).map((area: string, i: number) => (
                      <div key={i} className="flex items-start gap-2 text-xs">
                        <AlertTriangle className="h-3 w-3 text-yellow-500 mt-0.5 flex-shrink-0" />
                        <span>{area}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : null}

            {/* Quick Actions */}
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">Quick Actions</p>
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
                        "p-3 rounded-lg text-sm",
                        message.role === "user" ? "bg-primary text-primary-foreground ml-8" : "bg-muted mr-8",
                      )}
                    >
                      {message.content || (
                        <span className="flex items-center gap-2">
                          <Loader2 className="h-3 w-3 animate-spin" />
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
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  )
}

export function TenderContextPanel({
  tenderId,
  tenderTitle,
  tenderDescription,
  documents,
  analysis,
  className,
}: TenderContextPanelProps) {
  // Sanitize analysis to ensure no nested objects are passed
  const sanitizedAnalysis = analysis
    ? {
        ...analysis,
        tender_summary:
          typeof analysis.tender_summary === "object"
            ? JSON.stringify(analysis.tender_summary)
            : String(analysis.tender_summary || ""),
      }
    : undefined

  const tender: TenderContext = {
    id: String(tenderId || ""),
    title: String(tenderTitle || ""),
    description: String(tenderDescription || ""),
    analysis: sanitizedAnalysis,
  }

  return <TenderContextStrategistPanel tender={tender} className={className} />
}
