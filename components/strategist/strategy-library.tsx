"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Search,
  MoreVertical,
  Download,
  Trash2,
  Eye,
  Calendar,
  Target,
  TrendingUp,
  Loader2,
  FolderOpen,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { StrategyExport } from "./strategy-export"

interface SavedStrategy {
  id: string
  title: string
  strategy_type: string
  content: any
  summary?: string
  viability_score?: number
  risk_level?: string
  win_probability?: number
  status: string
  created_at: string
  updated_at: string
  tender?: {
    title: string
  }
}

export function StrategyLibrary() {
  const [strategies, setStrategies] = useState<SavedStrategy[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStrategy, setSelectedStrategy] = useState<SavedStrategy | null>(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    loadStrategies()
  }, [])

  const loadStrategies = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/strategist/strategy?action=list")
      if (response.ok) {
        const data = await response.json()
        setStrategies(data.strategies || [])
      }
    } catch (error) {
      console.error("Error loading strategies:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (strategyId: string) => {
    try {
      const response = await fetch(`/api/strategist/strategy?id=${strategyId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setStrategies((prev) => prev.filter((s) => s.id !== strategyId))
        toast({
          title: "Strategy Deleted",
          description: "The strategy has been removed from your library.",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete strategy.",
        variant: "destructive",
      })
    }
  }

  const handleView = (strategy: SavedStrategy) => {
    setSelectedStrategy(strategy)
    setViewDialogOpen(true)
  }

  const filteredStrategies = strategies.filter(
    (s) =>
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.summary?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "won":
        return "bg-green-500/10 text-green-500"
      case "lost":
        return "bg-red-500/10 text-red-500"
      case "submitted":
        return "bg-blue-500/10 text-blue-500"
      case "active":
        return "bg-primary/10 text-primary"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low":
        return "text-green-500"
      case "medium":
        return "text-yellow-500"
      case "high":
        return "text-orange-500"
      case "critical":
        return "text-red-500"
      default:
        return "text-muted-foreground"
    }
  }

  return (
    <>
      <Card className="h-full">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Strategy Library</CardTitle>
          <CardDescription>Your saved bid strategies</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search strategies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : filteredStrategies.length === 0 ? (
            <div className="text-center py-12">
              <FolderOpen className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
              <p className="font-medium text-foreground">No strategies yet</p>
              <p className="text-sm text-muted-foreground mt-1">
                {searchQuery ? "No matching strategies found" : "Your saved strategies will appear here"}
              </p>
            </div>
          ) : (
            <ScrollArea className="h-[400px]">
              <div className="space-y-3">
                {filteredStrategies.map((strategy) => (
                  <div
                    key={strategy.id}
                    className="p-4 rounded-xl border border-border hover:border-primary/50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className={cn("text-xs", getStatusColor(strategy.status))}>
                            {strategy.status}
                          </Badge>
                          {strategy.strategy_type && (
                            <Badge variant="secondary" className="text-xs">
                              {strategy.strategy_type}
                            </Badge>
                          )}
                        </div>

                        <h4 className="font-medium text-sm text-foreground line-clamp-1">{strategy.title}</h4>

                        {strategy.summary && (
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{strategy.summary}</p>
                        )}

                        <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(strategy.created_at).toLocaleDateString()}
                          </span>
                          {strategy.win_probability !== undefined && (
                            <span className="flex items-center gap-1">
                              <Target className="h-3 w-3" />
                              Win: {Math.round(strategy.win_probability * 100)}%
                            </span>
                          )}
                          {strategy.risk_level && (
                            <span className={cn("flex items-center gap-1", getRiskColor(strategy.risk_level))}>
                              <TrendingUp className="h-3 w-3" />
                              {strategy.risk_level} risk
                            </span>
                          )}
                        </div>
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleView(strategy)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="h-4 w-4 mr-2" />
                            Export
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(strategy.id)}>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      {/* View Strategy Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedStrategy?.title}</DialogTitle>
            <DialogDescription>
              Created on {selectedStrategy && new Date(selectedStrategy.created_at).toLocaleDateString()}
            </DialogDescription>
          </DialogHeader>

          {selectedStrategy && (
            <div className="space-y-4">
              {/* Scores */}
              <div className="grid grid-cols-3 gap-3">
                {selectedStrategy.viability_score !== undefined && (
                  <div className="p-3 rounded-lg bg-muted/50 text-center">
                    <p className="text-xs text-muted-foreground">Viability</p>
                    <p className="text-lg font-bold text-primary">
                      {Math.round(selectedStrategy.viability_score * 100)}%
                    </p>
                  </div>
                )}
                {selectedStrategy.win_probability !== undefined && (
                  <div className="p-3 rounded-lg bg-muted/50 text-center">
                    <p className="text-xs text-muted-foreground">Win Probability</p>
                    <p className="text-lg font-bold text-green-500">
                      {Math.round(selectedStrategy.win_probability * 100)}%
                    </p>
                  </div>
                )}
                {selectedStrategy.risk_level && (
                  <div className="p-3 rounded-lg bg-muted/50 text-center">
                    <p className="text-xs text-muted-foreground">Risk Level</p>
                    <p className={cn("text-lg font-bold capitalize", getRiskColor(selectedStrategy.risk_level))}>
                      {selectedStrategy.risk_level}
                    </p>
                  </div>
                )}
              </div>

              {/* Summary */}
              {selectedStrategy.summary && (
                <div className="p-4 rounded-lg bg-muted/50">
                  <h4 className="text-sm font-medium mb-2">Summary</h4>
                  <p className="text-sm text-muted-foreground">{selectedStrategy.summary}</p>
                </div>
              )}

              {/* Content Sections */}
              {selectedStrategy.content && (
                <div className="space-y-3">
                  {Object.entries(selectedStrategy.content).map(([key, value]) => {
                    if (!value || key === "raw") return null
                    return (
                      <div key={key} className="p-4 rounded-lg border">
                        <h4 className="text-sm font-medium capitalize mb-2">{key.replace(/_/g, " ")}</h4>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">{value as string}</p>
                      </div>
                    )
                  })}
                </div>
              )}

              {/* Export Actions */}
              <div className="flex justify-end gap-2 pt-4 border-t">
                <StrategyExport
                  strategy={{
                    title: selectedStrategy.title,
                    content: selectedStrategy.content,
                    summary: selectedStrategy.summary,
                  }}
                />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
