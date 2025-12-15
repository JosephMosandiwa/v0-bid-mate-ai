"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { FileSearch, Brain, CheckSquare, FileEdit, Send, Clock, CheckCircle2, AlertCircle, XCircle } from "lucide-react"

interface TenderProgressTrackerProps {
  status: string
  progressPercent: number
  lastUpdate?: string
  submissionDate?: string
  outcome?: string
  className?: string
}

const PROGRESS_STEPS = [
  { key: "reviewing", label: "Reviewing", icon: FileSearch, percent: 20 },
  { key: "analyzing", label: "Analyzing", icon: Brain, percent: 40 },
  { key: "planning", label: "Planning", icon: CheckSquare, percent: 60 },
  { key: "preparing", label: "Preparing Response", icon: FileEdit, percent: 80 },
  { key: "ready", label: "Ready to Submit", icon: Send, percent: 95 },
  { key: "submitted", label: "Submitted", icon: CheckCircle2, percent: 100 },
]

const STATUS_CONFIG: Record<string, { color: string; icon: any; label: string }> = {
  reviewing: { color: "bg-blue-500", icon: FileSearch, label: "Under Review" },
  analyzing: { color: "bg-purple-500", icon: Brain, label: "Analyzing" },
  planning: { color: "bg-indigo-500", icon: CheckSquare, label: "Planning" },
  preparing: { color: "bg-orange-500", icon: FileEdit, label: "Preparing" },
  ready: { color: "bg-green-500", icon: Send, label: "Ready" },
  submitted: { color: "bg-emerald-500", icon: CheckCircle2, label: "Submitted" },
  awarded: { color: "bg-green-600", icon: CheckCircle2, label: "Awarded" },
  rejected: { color: "bg-red-500", icon: XCircle, label: "Not Awarded" },
  withdrawn: { color: "bg-gray-500", icon: AlertCircle, label: "Withdrawn" },
}

export function TenderProgressTracker({
  status = "reviewing",
  progressPercent = 0,
  lastUpdate,
  submissionDate,
  outcome,
  className,
}: TenderProgressTrackerProps) {
  const currentStatus = STATUS_CONFIG[status] || STATUS_CONFIG.reviewing
  const StatusIcon = currentStatus.icon

  return (
    <Card className={cn("border-primary/20", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">Tender Progress</CardTitle>
          <Badge variant="secondary" className="gap-1">
            <StatusIcon className="h-3 w-3" />
            {currentStatus.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Completion</span>
            <span className="font-medium">{progressPercent}%</span>
          </div>
          <Progress value={progressPercent} className="h-2" />
        </div>

        {/* Progress Steps */}
        <div className="space-y-2">
          {PROGRESS_STEPS.map((step) => {
            const StepIcon = step.icon
            const isActive = status === step.key
            const isCompleted = progressPercent >= step.percent
            const isPending = progressPercent < step.percent

            return (
              <div
                key={step.key}
                className={cn(
                  "flex items-center gap-3 p-2 rounded-lg transition-colors",
                  isActive && "bg-primary/10",
                  isCompleted && !isActive && "opacity-60",
                  isPending && "opacity-40",
                )}
              >
                <div
                  className={cn(
                    "h-8 w-8 rounded-full flex items-center justify-center transition-colors",
                    isCompleted ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                  )}
                >
                  {isCompleted ? <CheckCircle2 className="h-4 w-4" /> : <StepIcon className="h-4 w-4" />}
                </div>
                <div className="flex-1">
                  <p className={cn("text-sm font-medium", isActive && "text-primary")}>{step.label}</p>
                </div>
                {isActive && (
                  <Badge variant="outline" className="text-xs">
                    Current
                  </Badge>
                )}
              </div>
            )
          })}
        </div>

        {/* Timeline Info */}
        <div className="pt-2 space-y-2 text-xs text-muted-foreground border-t">
          {lastUpdate && (
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Last Updated
              </span>
              <span>{new Date(lastUpdate).toLocaleDateString()}</span>
            </div>
          )}
          {submissionDate && (
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Send className="h-3 w-3" />
                Submitted
              </span>
              <span>{new Date(submissionDate).toLocaleDateString()}</span>
            </div>
          )}
          {outcome && (
            <div className="flex items-center justify-between font-medium">
              <span>Outcome</span>
              <Badge variant={outcome === "awarded" ? "default" : "destructive"}>
                {outcome === "awarded" ? "Awarded" : "Not Awarded"}
              </Badge>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
