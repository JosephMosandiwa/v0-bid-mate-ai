"use client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import {
  MessageSquare,
  Bell,
  Shield,
  FileText,
  AlertTriangle,
  ChevronRight,
  History,
  BookOpen,
  Target,
  Settings,
} from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import type { StrategistConversation, StrategistAlert, StrategistCompetitivenessScore } from "@/lib/engines/strategist"

interface StrategistSidebarProps {
  conversations: StrategistConversation[]
  alerts: StrategistAlert[]
  unreadCount: number
  score: StrategistCompetitivenessScore | undefined
  onClose?: () => void
}

export function StrategistSidebar({ conversations, alerts, unreadCount, score, onClose }: StrategistSidebarProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Score Overview */}
      {score && (
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-foreground">Your Readiness</span>
            <Badge variant="outline" className="text-xs">
              {Math.round(score.overall_score * 100)}%
            </Badge>
          </div>
          <Progress value={score.overall_score * 100} className="h-2 mb-3" />
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-1.5">
              <Shield className="h-3 w-3 text-muted-foreground" />
              <span className="text-muted-foreground">Compliance</span>
              <span className="ml-auto font-medium">{Math.round(score.compliance_score * 100)}%</span>
            </div>
            <div className="flex items-center gap-1.5">
              <FileText className="h-3 w-3 text-muted-foreground" />
              <span className="text-muted-foreground">Docs</span>
              <span className="ml-auto font-medium">{Math.round(score.documentation_score * 100)}%</span>
            </div>
          </div>
        </div>
      )}

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">Alerts</span>
            </div>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="text-xs">
                {unreadCount}
              </Badge>
            )}
          </div>
          <div className="space-y-2">
            {alerts.slice(0, 3).map((alert) => (
              <div
                key={alert.id}
                className="flex items-start gap-2 p-2 rounded-lg bg-muted/50 cursor-pointer hover:bg-muted transition-colors"
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
        </div>
      )}

      {/* Recent Conversations */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="p-4 pb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Recent Chats</span>
          </div>
        </div>
        <ScrollArea className="flex-1 px-4">
          <div className="space-y-1 pb-4">
            {conversations.length > 0 ? (
              conversations.slice(0, 10).map((conv) => (
                <button
                  key={conv.id}
                  className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors text-left"
                  onClick={onClose}
                >
                  <MessageSquare className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground truncate">{conv.title || "New Conversation"}</p>
                    <p className="text-xs text-muted-foreground">
                      {conv.last_message_at
                        ? formatDistanceToNow(new Date(conv.last_message_at), { addSuffix: true })
                        : "No messages"}
                    </p>
                  </div>
                </button>
              ))
            ) : (
              <p className="text-xs text-muted-foreground text-center py-4">No conversations yet. Start chatting!</p>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Quick Links */}
      <div className="p-4 border-t border-border space-y-1">
        <Link href="/dashboard/strategist/learning" onClick={onClose}>
          <Button variant="ghost" className="w-full justify-start gap-2 h-9">
            <BookOpen className="h-4 w-4" />
            <span className="text-sm">Learning Center</span>
            <ChevronRight className="h-4 w-4 ml-auto" />
          </Button>
        </Link>
        <Link href="/dashboard/strategist/opportunities" onClick={onClose}>
          <Button variant="ghost" className="w-full justify-start gap-2 h-9">
            <Target className="h-4 w-4" />
            <span className="text-sm">Opportunities</span>
            <ChevronRight className="h-4 w-4 ml-auto" />
          </Button>
        </Link>
        <Link href="/dashboard/profile" onClick={onClose}>
          <Button variant="ghost" className="w-full justify-start gap-2 h-9">
            <Settings className="h-4 w-4" />
            <span className="text-sm">Preferences</span>
            <ChevronRight className="h-4 w-4 ml-auto" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
