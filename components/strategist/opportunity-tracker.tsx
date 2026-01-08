"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Eye,
  Bookmark,
  BookmarkCheck,
  X,
  TrendingUp,
  Shield,
  Zap,
  Target,
  Calendar,
  Building2,
  Loader2,
  RefreshCw,
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { useStrategistOpportunities } from "@/hooks/use-strategist"

interface Opportunity {
  id: string
  scraped_tender_id?: string | null
  custom_tender_id?: string | null
  match_score: number
  match_reasons: string[]
  opportunity_type: "low_risk" | "high_margin" | "quick_win" | "strategic" | "growth"
  is_viewed: boolean
  is_saved: boolean
  is_dismissed: boolean
  ai_insights: any
  estimated_margin?: number | null
  estimated_effort?: string | null
    tender?: {
    id: string
    title: string
    organization: string
    close_date?: string | null
    estimated_value?: string | null
  }
}

const opportunityTypeConfig = {
  low_risk: { icon: Shield, label: "Low Risk", color: "text-green-500", bg: "bg-green-500/10" },
  high_margin: { icon: TrendingUp, label: "High Margin", color: "text-blue-500", bg: "bg-blue-500/10" },
  quick_win: { icon: Zap, label: "Quick Win", color: "text-yellow-500", bg: "bg-yellow-500/10" },
  strategic: { icon: Target, label: "Strategic", color: "text-purple-500", bg: "bg-purple-500/10" },
  growth: { icon: TrendingUp, label: "Growth", color: "text-primary", bg: "bg-primary/10" },
}

export function OpportunityTracker() {
  const { opportunities, isLoading, refresh, saveOpportunity, dismissOpportunity, markViewed } =
    useStrategistOpportunities()

  const [activeTab, setActiveTab] = useState<string>("all")

  const filteredOpportunities = opportunities.filter((opp) => {
    if (activeTab === "all") return !opp.is_dismissed
    if (activeTab === "saved") return opp.is_saved
    if (activeTab === "new") return !opp.is_viewed && !opp.is_dismissed
    return opp.opportunity_type === activeTab && !opp.is_dismissed
  })

  const handleView = async (opportunity: Opportunity) => {
    if (!opportunity.is_viewed) {
      await markViewed(opportunity.id)
    }
  }

  const handleSave = async (opportunity: Opportunity) => {
    await saveOpportunity(opportunity.id, !opportunity.is_saved)
  }

  const handleDismiss = async (opportunity: Opportunity) => {
    await dismissOpportunity(opportunity.id)
  }

  const getMatchScoreColor = (score: number) => {
    if (score >= 0.8) return "text-green-500"
    if (score >= 0.6) return "text-yellow-500"
    return "text-orange-500"
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Opportunity Tracker</CardTitle>
            <CardDescription>Tenders matched to your profile</CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={() => refresh?.()} disabled={isLoading}>
            <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full grid grid-cols-4">
            <TabsTrigger value="all" className="text-xs">
              All
            </TabsTrigger>
            <TabsTrigger value="new" className="text-xs">
              New
            </TabsTrigger>
            <TabsTrigger value="saved" className="text-xs">
              Saved
            </TabsTrigger>
            <TabsTrigger value="quick_win" className="text-xs">
              Quick Wins
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : filteredOpportunities.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Target className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No opportunities found</p>
                <p className="text-xs mt-1">Check back later for new matches</p>
              </div>
            ) : (
              <ScrollArea className="h-[400px]">
                <div className="space-y-3">
                  {filteredOpportunities.map((opportunity) => {
                    const typeConfig = opportunityTypeConfig[opportunity.opportunity_type]
                    const TypeIcon = typeConfig.icon

                    return (
                      <div
                        key={opportunity.id}
                        className={cn(
                          "p-4 rounded-xl border transition-colors",
                          !opportunity.is_viewed && "border-primary/50 bg-primary/5",
                          opportunity.is_viewed && "border-border",
                        )}
                        onClick={() => handleView(opportunity)}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="secondary" className={cn("text-xs", typeConfig.bg, typeConfig.color)}>
                                <TypeIcon className="h-3 w-3 mr-1" />
                                {typeConfig.label}
                              </Badge>
                              {!opportunity.is_viewed && (
                                <Badge variant="default" className="text-xs">
                                  New
                                </Badge>
                              )}
                            </div>

                            <h4 className="font-medium text-sm text-foreground line-clamp-2">
                              {opportunity.tender?.title || "Untitled Tender"}
                            </h4>

                            <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Building2 className="h-3 w-3" />
                                {opportunity.tender?.organization || "Unknown"}
                              </span>
                              {opportunity.tender?.close_date && (
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {new Date(opportunity.tender.close_date as string).toLocaleDateString()}
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-xs text-muted-foreground">Match:</span>
                              <span className={cn("text-sm font-bold", getMatchScoreColor(opportunity.match_score))}>
                                {Math.round(opportunity.match_score * 100)}%
                              </span>
                              {opportunity.estimated_margin && (
                                <>
                                  <span className="text-xs text-muted-foreground ml-2">Est. Margin:</span>
                                  <span className="text-sm font-medium text-green-500">
                                    {opportunity.estimated_margin}%
                                  </span>
                                </>
                              )}
                            </div>
                          </div>

                          <div className="flex flex-col gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleSave(opportunity)}
                            >
                              {opportunity.is_saved ? (
                                <BookmarkCheck className="h-4 w-4 text-primary" />
                              ) : (
                                <Bookmark className="h-4 w-4" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-destructive"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDismiss(opportunity)
                              }}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        {opportunity.match_reasons && opportunity.match_reasons.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-border">
                            <p className="text-xs text-muted-foreground mb-1">Why this matches you:</p>
                            <div className="flex flex-wrap gap-1">
                              {opportunity.match_reasons.slice(0, 3).map((reason, i) => (
                                <Badge key={i} variant="outline" className="text-xs">
                                  {reason}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="mt-3 flex gap-2">
                          <Button variant="outline" size="sm" className="flex-1 text-xs bg-transparent" asChild>
                            <Link
                              href={`/dashboard/tenders/${opportunity.scraped_tender_id || opportunity.custom_tender_id}`}
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              View Tender
                            </Link>
                          </Button>
                          <Button variant="default" size="sm" className="flex-1 text-xs" asChild>
                            <Link
                              href={`/dashboard/strategist?tenderId=${opportunity.scraped_tender_id || opportunity.custom_tender_id}`}
                            >
                              <Target className="h-3 w-3 mr-1" />
                              Get Strategy
                            </Link>
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </ScrollArea>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
