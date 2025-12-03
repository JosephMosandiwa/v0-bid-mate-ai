"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  Target,
  TrendingUp,
  TrendingDown,
  ChevronDown,
  ChevronUp,
  Info,
  AlertTriangle,
  CheckCircle,
  Loader2,
  RefreshCw,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface WinFactor {
  name: string
  score: number
  weight: number
  impact: "positive" | "negative" | "neutral"
  description: string
}

interface WinProbabilityProps {
  tenderId?: string
  className?: string
}

export function WinProbabilityIndicator({ tenderId, className }: WinProbabilityProps) {
  const [probability, setProbability] = useState<number | null>(null)
  const [factors, setFactors] = useState<WinFactor[]>([])
  const [loading, setLoading] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [trend, setTrend] = useState<"up" | "down" | "stable">("stable")

  useEffect(() => {
    if (tenderId) {
      calculateProbability()
    }
  }, [tenderId])

  const calculateProbability = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/strategist/readiness${tenderId ? `?tenderId=${tenderId}` : ""}`)
      if (response.ok) {
        const data = await response.json()

        // Calculate win probability from various factors
        const factorsList: WinFactor[] = [
          {
            name: "Documentation Completeness",
            score: data.documentation_score || data.document_score || 0,
            weight: 0.2,
            impact: (data.documentation_score || data.document_score || 0) >= 0.7 ? "positive" : "negative",
            description: "Having all required documents ready",
          },
          {
            name: "Compliance Status",
            score: data.compliance_score || 0,
            weight: 0.25,
            impact: (data.compliance_score || 0) >= 0.8 ? "positive" : "negative",
            description: "Tax clearance, COIDA, CSD registration",
          },
          {
            name: "Experience & Track Record",
            score: data.experience_score || 0,
            weight: 0.2,
            impact: (data.experience_score || 0) >= 0.6 ? "positive" : "neutral",
            description: "Past tender wins and relevant experience",
          },
          {
            name: "Capacity Fit",
            score: data.capacity_score || 0.5,
            weight: 0.15,
            impact: (data.capacity_score || 0.5) >= 0.7 ? "positive" : "neutral",
            description: "Company size and capability match",
          },
          {
            name: "B-BBEE Status",
            score: data.bbbee_score || 0.5,
            weight: 0.2,
            impact: (data.bbbee_score || 0.5) >= 0.7 ? "positive" : "neutral",
            description: "Preferential points from B-BBEE level",
          },
        ]

        setFactors(factorsList)

        // Calculate weighted probability
        const weightedSum = factorsList.reduce((acc, f) => acc + f.score * f.weight, 0)
        const calculatedProbability = weightedSum * 100

        setProbability(calculatedProbability)

        // Determine trend (mock for now - would compare to previous calculation)
        if (calculatedProbability > 60) {
          setTrend("up")
        } else if (calculatedProbability < 40) {
          setTrend("down")
        } else {
          setTrend("stable")
        }
      }
    } catch (error) {
      console.error("Error calculating win probability:", error)
    } finally {
      setLoading(false)
    }
  }

  const getProbabilityColor = (prob: number) => {
    if (prob >= 70) return "text-green-500"
    if (prob >= 50) return "text-yellow-500"
    if (prob >= 30) return "text-orange-500"
    return "text-red-500"
  }

  const getProbabilityBg = (prob: number) => {
    if (prob >= 70) return "bg-green-500"
    if (prob >= 50) return "bg-yellow-500"
    if (prob >= 30) return "bg-orange-500"
    return "bg-red-500"
  }

  const getProbabilityLabel = (prob: number) => {
    if (prob >= 70) return "Strong"
    if (prob >= 50) return "Moderate"
    if (prob >= 30) return "Fair"
    return "Low"
  }

  const getImpactIcon = (impact: string) => {
    if (impact === "positive") return <CheckCircle className="h-4 w-4 text-green-500" />
    if (impact === "negative") return <AlertTriangle className="h-4 w-4 text-red-500" />
    return <Info className="h-4 w-4 text-muted-foreground" />
  }

  const getTrendIcon = () => {
    if (trend === "up") return <TrendingUp className="h-4 w-4 text-green-500" />
    if (trend === "down") return <TrendingDown className="h-4 w-4 text-red-500" />
    return null
  }

  if (loading) {
    return (
      <Card className={cn(className)}>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn(className)}>
      <Collapsible open={expanded} onOpenChange={setExpanded}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Win Probability
              </CardTitle>
              <CardDescription>Estimated chance of winning this bid</CardDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={calculateProbability} disabled={loading}>
              <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Main Probability Display */}
          <div className="flex items-center gap-6">
            <div
              className={cn(
                "h-24 w-24 rounded-full flex items-center justify-center border-4",
                probability !== null && getProbabilityBg(probability).replace("bg-", "border-"),
              )}
            >
              <div className="text-center">
                <span className={cn("text-3xl font-bold", probability !== null && getProbabilityColor(probability))}>
                  {probability !== null ? Math.round(probability) : "--"}%
                </span>
              </div>
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary" className={cn(probability !== null && getProbabilityColor(probability))}>
                  {probability !== null ? getProbabilityLabel(probability) : "Unknown"}
                </Badge>
                {getTrendIcon()}
              </div>

              {probability !== null && (
                <div className="space-y-1.5">
                  <Progress value={probability} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    {probability >= 70
                      ? "You're well-positioned for this tender"
                      : probability >= 50
                        ? "Good potential with room for improvement"
                        : probability >= 30
                          ? "Consider addressing gaps before bidding"
                          : "Significant improvements needed"}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Expand to see factors */}
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="w-full justify-center gap-2">
              {expanded ? (
                <>
                  Hide Factors
                  <ChevronUp className="h-4 w-4" />
                </>
              ) : (
                <>
                  See Contributing Factors
                  <ChevronDown className="h-4 w-4" />
                </>
              )}
            </Button>
          </CollapsibleTrigger>

          <CollapsibleContent>
            <div className="space-y-3 pt-2">
              {factors.map((factor, index) => (
                <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  {getImpactIcon(factor.impact)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{factor.name}</span>
                      <span
                        className={cn(
                          "text-sm font-bold",
                          factor.score >= 0.7
                            ? "text-green-500"
                            : factor.score >= 0.5
                              ? "text-yellow-500"
                              : "text-red-500",
                        )}
                      >
                        {Math.round(factor.score * 100)}%
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{factor.description}</p>
                    <Progress value={factor.score * 100} className="h-1.5 mt-2" />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 p-3 rounded-lg bg-primary/5 border border-primary/20">
              <p className="text-xs text-muted-foreground">
                <strong className="text-foreground">Note:</strong> This probability is an estimate based on your profile
                data and typical tender evaluation criteria. Actual results depend on competition, pricing, and
                evaluator discretion.
              </p>
            </div>
          </CollapsibleContent>
        </CardContent>
      </Collapsible>
    </Card>
  )
}
