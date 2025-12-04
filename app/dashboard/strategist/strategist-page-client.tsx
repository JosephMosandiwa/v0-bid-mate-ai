"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Send,
  Sparkles,
  Target,
  Search,
  FileText,
  Calculator,
  Shield,
  GraduationCap,
  CheckCircle,
  Bell,
  TrendingUp,
  Loader2,
  Lightbulb,
  Menu,
  Plus,
  AlertTriangle,
  FolderOpen,
} from "lucide-react"
import {
  useStrategistChat,
  useStrategistAlerts,
  useStrategistPreferences,
  useCompetitivenessScore,
  useStrategistConversations,
} from "@/hooks/use-strategist"
import { QUICK_ACTION_PROMPTS } from "@/lib/engines/strategist/constants"
import { StrategistOnboardingDialog } from "@/components/strategist/onboarding-dialog"
import { StrategistSidebar } from "@/components/strategist/sidebar"
import { OpportunityTracker } from "@/components/strategist/opportunity-tracker"
import { CapabilityGapAnalysis } from "@/components/strategist/capability-gap-analysis"
import { StrategyLibrary } from "@/components/strategist/strategy-library"
import { WinProbabilityIndicator } from "@/components/strategist/win-probability-indicator"
import { HighlightProcurementTerms } from "@/components/strategist/procurement-tooltip"
import { cn } from "@/lib/utils"

interface StrategistPageClientProps {
  showOnboarding: boolean
}

export function StrategistPageClient({ showOnboarding }: StrategistPageClientProps) {
  const [showOnboardingDialog, setShowOnboardingDialog] = useState(showOnboarding)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeView, setActiveView] = useState<"chat" | "opportunities" | "strategies" | "gaps">("chat")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { messages, input, handleInputChange, handleSubmit, isLoading, conversationId, setInput } = useStrategistChat()

  const { alerts, unreadCount } = useStrategistAlerts({ limit: 5 })
  const { preferences } = useStrategistPreferences()
  const { score } = useCompetitivenessScore()
  const { conversations } = useStrategistConversations()

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleQuickAction = (prompt: string) => {
    setInput(prompt)
  }

  const getIconForAction = (iconName: string) => {
    const icons: Record<string, any> = {
      target: Target,
      "clipboard-check": CheckCircle,
      search: Search,
      "file-text": FileText,
      calculator: Calculator,
      shield: Shield,
      "graduation-cap": GraduationCap,
      "check-circle": CheckCircle,
    }
    const Icon = icons[iconName] || Lightbulb
    return <Icon className="h-4 w-4" />
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
      {/* Mobile Sidebar Toggle */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-80 p-0">
          <StrategistSidebar
            conversations={conversations}
            alerts={alerts}
            unreadCount={unreadCount}
            score={score}
            onClose={() => setSidebarOpen(false)}
          />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-80 border-r border-border flex-col">
        <StrategistSidebar conversations={conversations} alerts={alerts} unreadCount={unreadCount} score={score} />
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="border-b border-border p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-foreground">AI Tender Strategist</h1>
                <p className="text-xs text-muted-foreground">Your personal assistant for winning tenders</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" className="gap-2">
                <Bell className="h-4 w-4" />
                <Badge variant="destructive" className="text-xs">
                  {unreadCount}
                </Badge>
              </Button>
            )}
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">New Chat</span>
            </Button>
          </div>
        </header>

        <div className="border-b border-border px-4">
          <Tabs value={activeView} onValueChange={(v) => setActiveView(v as any)}>
            <TabsList className="bg-transparent h-12 p-0 gap-4">
              <TabsTrigger
                value="chat"
                className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 pb-3"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Chat
              </TabsTrigger>
              <TabsTrigger
                value="opportunities"
                className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 pb-3"
              >
                <Target className="h-4 w-4 mr-2" />
                Opportunities
              </TabsTrigger>
              <TabsTrigger
                value="strategies"
                className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 pb-3"
              >
                <FolderOpen className="h-4 w-4 mr-2" />
                My Strategies
              </TabsTrigger>
              <TabsTrigger
                value="gaps"
                className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 pb-3"
              >
                <AlertTriangle className="h-4 w-4 mr-2" />
                Gap Analysis
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Content based on active view */}
        <div className="flex-1 overflow-hidden">
          {activeView === "chat" && (
            <div className="flex flex-col h-full">
              {messages.length === 0 ? (
                /* Empty State with Quick Actions */
                <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 overflow-auto">
                  <div className="max-w-2xl w-full space-y-8">
                    {/* Welcome */}
                    <div className="text-center space-y-2">
                      <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                        <Sparkles className="h-8 w-8 text-primary" />
                      </div>
                      <h2 className="text-2xl font-bold text-foreground">Welcome to AI Tender Strategist</h2>
                      <p className="text-muted-foreground max-w-md mx-auto">
                        I'm here to help you understand tendering, build winning strategies, and discover opportunities
                        tailored to your profile.
                      </p>
                    </div>

                    {/* Quick Actions Grid */}
                    <div className="grid gap-3 sm:grid-cols-2">
                      {QUICK_ACTION_PROMPTS.slice(0, 6).map((action) => (
                        <Button
                          key={action.id}
                          variant="outline"
                          className="h-auto p-4 justify-start text-left bg-transparent hover:bg-accent"
                          onClick={() => handleQuickAction(action.prompt)}
                        >
                          <div className="flex items-start gap-3">
                            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                              {getIconForAction(action.icon)}
                            </div>
                            <div>
                              <div className="font-medium text-foreground">{action.label}</div>
                              <div className="text-xs text-muted-foreground line-clamp-1">
                                {action.prompt.substring(0, 50)}...
                              </div>
                            </div>
                          </div>
                        </Button>
                      ))}
                    </div>

                    {/* Stats Cards */}
                    {score && (
                      <div className="grid gap-4 sm:grid-cols-3">
                        <Card className="border-border">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="text-xs text-muted-foreground">Readiness Score</div>
                              <TrendingUp className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <div className="text-2xl font-bold text-foreground mt-1">
                              {Math.round(score.overall_score * 100)}%
                            </div>
                          </CardContent>
                        </Card>
                        <Card className="border-border">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="text-xs text-muted-foreground">Win Probability</div>
                              <Target className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <div className="text-2xl font-bold text-foreground mt-1">
                              {Math.round((score.win_probability || 0) * 100)}%
                            </div>
                          </CardContent>
                        </Card>
                        <Card className="border-border">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="text-xs text-muted-foreground">Compliance</div>
                              <Shield className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <div className="text-2xl font-bold text-foreground mt-1">
                              {Math.round(score.compliance_score * 100)}%
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* Chat Messages */
                <ScrollArea className="flex-1 p-4">
                  <div className="max-w-3xl mx-auto space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={cn("flex gap-3", message.role === "user" ? "justify-end" : "justify-start")}
                      >
                        {message.role === "assistant" && (
                          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Sparkles className="h-4 w-4 text-primary" />
                          </div>
                        )}
                        <div
                          className={cn(
                            "rounded-2xl px-4 py-3 max-w-[80%]",
                            message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground",
                          )}
                        >
                          <div className="whitespace-pre-wrap text-sm">
                            {message.role === "assistant" ? (
                              <HighlightProcurementTerms text={message.content || ""} />
                            ) : (
                              message.content || ""
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex gap-3">
                        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Sparkles className="h-4 w-4 text-primary" />
                        </div>
                        <div className="bg-muted rounded-2xl px-4 py-3">
                          <div className="flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span className="text-sm text-muted-foreground">Thinking...</span>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>
              )}

              {/* Input Area */}
              <div className="border-t border-border p-4">
                <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
                  <div className="relative">
                    <Textarea
                      value={input}
                      onChange={handleInputChange}
                      placeholder="Ask me anything about tendering..."
                      className="min-h-[60px] max-h-[200px] pr-12 resize-none rounded-xl"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault()
                          handleSubmit(e)
                        }
                      }}
                    />
                    <Button
                      type="submit"
                      size="icon"
                      disabled={!input.trim() || isLoading}
                      className="absolute right-2 bottom-2 h-8 w-8 rounded-lg"
                    >
                      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground text-center mt-2">
                    Press Enter to send, Shift+Enter for new line
                  </p>
                </form>
              </div>
            </div>
          )}

          {activeView === "opportunities" && (
            <div className="p-6 overflow-auto h-full">
              <div className="max-w-4xl mx-auto grid gap-6 lg:grid-cols-2">
                <OpportunityTracker />
                <WinProbabilityIndicator />
              </div>
            </div>
          )}

          {activeView === "strategies" && (
            <div className="p-6 overflow-auto h-full">
              <div className="max-w-4xl mx-auto">
                <StrategyLibrary />
              </div>
            </div>
          )}

          {activeView === "gaps" && (
            <div className="p-6 overflow-auto h-full">
              <div className="max-w-4xl mx-auto">
                <CapabilityGapAnalysis />
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Onboarding Dialog */}
      <StrategistOnboardingDialog open={showOnboardingDialog} onOpenChange={setShowOnboardingDialog} />
    </div>
  )
}
