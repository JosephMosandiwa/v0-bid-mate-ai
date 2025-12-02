"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Sparkles,
  MessageSquare,
  Target,
  Search,
  Calculator,
  Bell,
  ChevronRight,
  TrendingUp,
  AlertTriangle,
  Shield,
} from "lucide-react"
import Link from "next/link"
import { useStrategistAlerts, useCompetitivenessScore } from "@/hooks/use-strategist"

export function StrategistDashboardWidget() {
  const { alerts, unreadCount, isLoading: alertsLoading } = useStrategistAlerts({ limit: 3 })
  const { score, isLoading: scoreLoading } = useCompetitivenessScore()

  const quickActions = [
    { label: "Ask a Question", icon: MessageSquare, href: "/dashboard/strategist" },
    { label: "Build a Strategy", icon: Target, href: "/dashboard/strategist?action=strategy" },
    { label: "Find Opportunities", icon: Search, href: "/dashboard/strategist?action=opportunities" },
    { label: "Pricing Advice", icon: Calculator, href: "/dashboard/strategist?action=pricing" },
  ]

  return (
    <Card className="border-border overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Your AI Tender Strategist</CardTitle>
              <CardDescription className="text-xs">Personalized guidance and strategy</CardDescription>
            </div>
          </div>
          {unreadCount > 0 && (
            <Badge variant="destructive" className="gap-1">
              <Bell className="h-3 w-3" />
              {unreadCount}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Readiness Score */}
        {!scoreLoading && score && (
          <div className="p-3 rounded-lg bg-muted/50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">Tender Readiness</span>
              <span className="text-lg font-bold text-primary">{Math.round(score.overall_score * 100)}%</span>
            </div>
            <Progress value={score.overall_score * 100} className="h-2" />
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="flex items-center gap-1">
                <Shield className="h-3 w-3 text-muted-foreground" />
                <span className="text-muted-foreground">Compliance</span>
                <span className="ml-auto font-medium">{Math.round(score.compliance_score * 100)}%</span>
              </div>
              <div className="flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-muted-foreground" />
                <span className="text-muted-foreground">Experience</span>
                <span className="ml-auto font-medium">{Math.round(score.experience_score * 100)}%</span>
              </div>
              <div className="flex items-center gap-1">
                <Target className="h-3 w-3 text-muted-foreground" />
                <span className="text-muted-foreground">Win Prob</span>
                <span className="ml-auto font-medium">{Math.round((score.win_probability || 0) * 100)}%</span>
              </div>
            </div>
          </div>
        )}

        {/* Alerts Preview */}
        {!alertsLoading && alerts.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">Recent Alerts</span>
              <Link href="/dashboard/strategist?tab=alerts" className="text-xs text-primary hover:underline">
                View all
              </Link>
            </div>
            {alerts.slice(0, 2).map((alert) => (
              <div
                key={alert.id}
                className="flex items-start gap-2 p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <AlertTriangle
                  className={`h-4 w-4 flex-shrink-0 mt-0.5 ${
                    alert.priority === "urgent"
                      ? "text-destructive"
                      : alert.priority === "high"
                        ? "text-orange-500"
                        : "text-muted-foreground"
                  }`}
                />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-foreground line-clamp-1">{alert.title}</p>
                  <p className="text-xs text-muted-foreground line-clamp-1">{alert.message}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-2">
          {quickActions.map((action) => (
            <Link key={action.label} href={action.href}>
              <Button variant="outline" className="w-full h-auto py-3 px-3 justify-start gap-2 bg-transparent">
                <action.icon className="h-4 w-4 text-primary" />
                <span className="text-xs">{action.label}</span>
              </Button>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <Link href="/dashboard/strategist">
          <Button className="w-full gap-2">
            <Sparkles className="h-4 w-4" />
            Open AI Strategist
            <ChevronRight className="h-4 w-4 ml-auto" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
