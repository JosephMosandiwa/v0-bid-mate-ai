"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  AlertTriangle,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Clock,
  FileText,
  Shield,
  Building2,
  ExternalLink,
  Loader2,
  RefreshCw,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useStrategistPreferences, useCompetitivenessScore } from "@/hooks/use-strategist"

interface GapItem {
  id: string
  category: "compliance" | "documentation" | "capacity" | "experience"
  name: string
  status: "missing" | "expiring" | "incomplete" | "complete"
  priority: "critical" | "high" | "medium" | "low"
  description: string
  actionSteps: string[]
  expiryDate?: string
  actionUrl?: string
}

const categoryConfig = {
  compliance: { icon: Shield, label: "Compliance", color: "text-red-500" },
  documentation: { icon: FileText, label: "Documentation", color: "text-orange-500" },
  capacity: { icon: Building2, label: "Capacity", color: "text-blue-500" },
  experience: { icon: Clock, label: "Experience", color: "text-purple-500" },
}

const priorityConfig = {
  critical: { label: "Critical", color: "destructive" },
  high: { label: "High", color: "default" },
  medium: { label: "Medium", color: "secondary" },
  low: { label: "Low", color: "outline" },
}

export function CapabilityGapAnalysis() {
  const { preferences, isLoading: prefsLoading } = useStrategistPreferences()
  const { score, isLoading: scoreLoading } = useCompetitivenessScore()
  const [gaps, setGaps] = useState<GapItem[]>([])
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (preferences && score) {
      analyzeGaps()
    }
  }, [preferences, score])

  const analyzeGaps = () => {
    const identifiedGaps: GapItem[] = []

    // Tax Clearance
    if (!preferences?.has_tax_clearance) {
      identifiedGaps.push({
        id: "tax_clearance",
        category: "compliance",
        name: "Tax Clearance Certificate",
        status: "missing",
        priority: "critical",
        description: "Required for all government tenders. Without this, your bid will be disqualified.",
        actionSteps: [
          "Register on SARS eFiling if not already",
          "Submit Tax Compliance Status (TCS) request",
          "Wait for verification (usually 24-48 hours)",
          "Download your Tax Clearance Certificate",
        ],
        actionUrl: "https://www.sarsefiling.co.za",
      })
    } else if (preferences?.tax_clearance_expiry) {
      const expiryDate = new Date(preferences.tax_clearance_expiry)
      const daysUntilExpiry = Math.ceil((expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
      if (daysUntilExpiry <= 30) {
        identifiedGaps.push({
          id: "tax_clearance_expiry",
          category: "compliance",
          name: "Tax Clearance Certificate",
          status: "expiring",
          priority: daysUntilExpiry <= 7 ? "critical" : "high",
          description: `Your tax clearance expires in ${daysUntilExpiry} days. Renew before bidding on new tenders.`,
          actionSteps: ["Log into SARS eFiling", "Request new Tax Compliance Status", "Download updated certificate"],
          expiryDate: preferences.tax_clearance_expiry,
          actionUrl: "https://www.sarsefiling.co.za",
        })
      }
    }

    // COIDA
    if (!preferences?.has_coida) {
      identifiedGaps.push({
        id: "coida",
        category: "compliance",
        name: "COIDA Letter of Good Standing",
        status: "missing",
        priority: "high",
        description: "Required for tenders involving workers. Shows you're registered for employee compensation.",
        actionSteps: [
          "Register with the Compensation Fund",
          "Pay outstanding assessments if any",
          "Request Letter of Good Standing",
          "Wait for processing (usually 7-14 days)",
        ],
        actionUrl: "https://www.labour.gov.za",
      })
    }

    // CSD Registration
    if (!preferences?.has_csd_registration) {
      identifiedGaps.push({
        id: "csd",
        category: "documentation",
        name: "CSD Registration",
        status: "missing",
        priority: "critical",
        description: "Central Supplier Database registration is mandatory for all government suppliers.",
        actionSteps: [
          "Go to CSD website",
          "Create account and submit application",
          "Upload required documents (company registration, tax, B-BBEE)",
          "Complete verification process",
        ],
        actionUrl: "https://secure.csd.gov.za",
      })
    }

    // CIDB (if in construction)
    if (
      preferences?.industries?.includes("construction") &&
      (!preferences?.cidb_grading || preferences.cidb_grading === "none")
    ) {
      identifiedGaps.push({
        id: "cidb",
        category: "capacity",
        name: "CIDB Registration",
        status: "missing",
        priority: "critical",
        description: "Required for construction-related government tenders.",
        actionSteps: [
          "Register on CIDB website",
          "Submit grading application with required documents",
          "Pay registration fees",
          "Wait for assessment and grading",
        ],
        actionUrl: "https://www.cidb.org.za",
      })
    }

    // B-BBEE
    if (!preferences?.bee_level || preferences.bee_level === "non-compliant") {
      identifiedGaps.push({
        id: "bbbee",
        category: "compliance",
        name: "B-BBEE Certificate",
        status: "missing",
        priority: "high",
        description: "B-BBEE status affects your preferential points. Without it, you lose competitive advantage.",
        actionSteps: [
          "Determine if you qualify for EME/QSE affidavit or need verification",
          "Contact a SANAS-accredited verification agency if needed",
          "Gather required documentation",
          "Complete verification process",
        ],
      })
    }

    // Experience/Track Record
    if ((preferences?.past_tender_wins || 0) < 3) {
      identifiedGaps.push({
        id: "experience",
        category: "experience",
        name: "Track Record / References",
        status: "incomplete",
        priority: "medium",
        description: "Limited track record may affect scoring on functionality criteria.",
        actionSteps: [
          "Document all completed projects with details",
          "Request reference letters from past clients",
          "Build portfolio of successful work",
          "Consider joint ventures with experienced partners",
        ],
      })
    }

    setGaps(identifiedGaps)
    setLoading(false)
  }

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedItems(newExpanded)
  }

  const completedCount = gaps.filter((g) => g.status === "complete").length
  const criticalCount = gaps.filter((g) => g.priority === "critical" && g.status !== "complete").length
  const overallProgress = gaps.length > 0 ? (completedCount / gaps.length) * 100 : 100

  if (prefsLoading || scoreLoading || loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Capability Gap Analysis</CardTitle>
            <CardDescription>What you need to improve your bid readiness</CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={() => analyzeGaps()}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Summary */}
        <div className="p-4 rounded-xl bg-muted/50 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Overall Readiness</span>
            <span className="text-lg font-bold text-primary">{Math.round(overallProgress)}%</span>
          </div>
          <Progress value={overallProgress} className="h-2" />
          <div className="flex items-center gap-4 text-xs">
            {criticalCount > 0 && (
              <span className="flex items-center gap-1 text-destructive">
                <AlertTriangle className="h-3 w-3" />
                {criticalCount} critical item{criticalCount !== 1 ? "s" : ""}
              </span>
            )}
            <span className="flex items-center gap-1 text-muted-foreground">
              <CheckCircle className="h-3 w-3" />
              {completedCount} of {gaps.length} complete
            </span>
          </div>
        </div>

        {/* Gap Items */}
        {gaps.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-3" />
            <p className="font-medium text-foreground">Looking good!</p>
            <p className="text-sm text-muted-foreground">No capability gaps identified</p>
          </div>
        ) : (
          <div className="space-y-2">
            {gaps.map((gap) => {
              const catConfig = categoryConfig[gap.category]
              const CatIcon = catConfig.icon
              const isExpanded = expandedItems.has(gap.id)

              return (
                <Collapsible key={gap.id} open={isExpanded} onOpenChange={() => toggleExpand(gap.id)}>
                  <CollapsibleTrigger asChild>
                    <div
                      className={cn(
                        "p-4 rounded-xl border cursor-pointer transition-colors hover:bg-muted/50",
                        gap.status === "missing" &&
                          gap.priority === "critical" &&
                          "border-destructive/50 bg-destructive/5",
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "h-10 w-10 rounded-lg flex items-center justify-center",
                            `bg-${gap.category}/10`,
                          )}
                        >
                          <CatIcon className={cn("h-5 w-5", catConfig.color)} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-sm text-foreground">{gap.name}</h4>
                            <Badge variant={priorityConfig[gap.priority].color as any} className="text-xs">
                              {priorityConfig[gap.priority].label}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{gap.description}</p>
                        </div>
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="px-4 pb-4 pt-2 space-y-3 border-x border-b rounded-b-xl">
                      <p className="text-sm text-foreground">{gap.description}</p>

                      {gap.expiryDate && (
                        <div className="flex items-center gap-2 text-sm text-orange-500">
                          <Clock className="h-4 w-4" />
                          Expires: {new Date(gap.expiryDate).toLocaleDateString()}
                        </div>
                      )}

                      <div className="space-y-2">
                        <p className="text-xs font-medium text-muted-foreground">Steps to resolve:</p>
                        <ol className="space-y-1">
                          {gap.actionSteps.map((step, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm">
                              <span className="flex-shrink-0 h-5 w-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center">
                                {i + 1}
                              </span>
                              <span>{step}</span>
                            </li>
                          ))}
                        </ol>
                      </div>

                      {gap.actionUrl && (
                        <Button variant="outline" size="sm" className="w-full bg-transparent" asChild>
                          <a href={gap.actionUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Go to Website
                          </a>
                        </Button>
                      )}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
