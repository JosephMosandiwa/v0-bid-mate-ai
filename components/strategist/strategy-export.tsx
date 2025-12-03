"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Download, FileText, Save, Loader2, Check } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Strategy {
  id?: string
  title: string
  content: any
  summary?: string
  tender_id?: string
}

interface StrategyExportProps {
  strategy: Strategy
  onSaved?: (savedStrategy: any) => void
}

export function StrategyExport({ strategy, onSaved }: StrategyExportProps) {
  const [saving, setSaving] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [strategyTitle, setStrategyTitle] = useState(strategy.title || "Untitled Strategy")
  const { toast } = useToast()

  const handleSaveStrategy = async () => {
    setSaving(true)
    try {
      const response = await fetch("/api/strategist/strategy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "save",
          title: strategyTitle,
          content: strategy.content,
          summary: strategy.summary,
          tenderId: strategy.tender_id,
        }),
      })

      if (response.ok) {
        const savedStrategy = await response.json()
        toast({
          title: "Strategy Saved",
          description: "Your strategy has been saved to your library.",
        })
        setShowSaveDialog(false)
        onSaved?.(savedStrategy)
      } else {
        throw new Error("Failed to save strategy")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save strategy. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleExportPDF = async () => {
    setExporting(true)
    try {
      const response = await fetch("/api/strategist/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          format: "pdf",
          strategy: strategy,
        }),
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `${strategyTitle.replace(/\s+/g, "_")}_Strategy.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)

        toast({
          title: "Export Complete",
          description: "Your strategy has been downloaded as PDF.",
        })
      } else {
        throw new Error("Failed to export")
      }
    } catch (error) {
      // Fallback: Generate simple text export
      const content = generateTextContent(strategy)
      const blob = new Blob([content], { type: "text/plain" })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${strategyTitle.replace(/\s+/g, "_")}_Strategy.txt`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast({
        title: "Export Complete",
        description: "Your strategy has been downloaded as text file.",
      })
    } finally {
      setExporting(false)
    }
  }

  const handleExportWord = async () => {
    setExporting(true)
    try {
      const response = await fetch("/api/strategist/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          format: "docx",
          strategy: strategy,
        }),
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `${strategyTitle.replace(/\s+/g, "_")}_Strategy.docx`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)

        toast({
          title: "Export Complete",
          description: "Your strategy has been downloaded as Word document.",
        })
      } else {
        throw new Error("Failed to export")
      }
    } catch (error) {
      // Fallback to HTML
      const content = generateHTMLContent(strategy)
      const blob = new Blob([content], { type: "text/html" })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${strategyTitle.replace(/\s+/g, "_")}_Strategy.html`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast({
        title: "Export Complete",
        description: "Your strategy has been downloaded as HTML file.",
      })
    } finally {
      setExporting(false)
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
            {exporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            Export
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setShowSaveDialog(true)}>
            <Save className="h-4 w-4 mr-2" />
            Save to Library
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleExportPDF} disabled={exporting}>
            <FileText className="h-4 w-4 mr-2" />
            Export as PDF
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleExportWord} disabled={exporting}>
            <FileText className="h-4 w-4 mr-2" />
            Export as Word
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Strategy</DialogTitle>
            <DialogDescription>Save this strategy to your library for future reference.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Strategy Name</Label>
              <Input
                id="title"
                value={strategyTitle}
                onChange={(e) => setStrategyTitle(e.target.value)}
                placeholder="Enter a name for this strategy"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveStrategy} disabled={saving || !strategyTitle.trim()}>
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Save
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

function generateTextContent(strategy: Strategy): string {
  const content = strategy.content || {}
  let text = `TENDER BID STRATEGY\n${"=".repeat(50)}\n\n`
  text += `Title: ${strategy.title}\n\n`

  if (strategy.summary) {
    text += `SUMMARY\n${"-".repeat(30)}\n${strategy.summary}\n\n`
  }

  if (content.viability) {
    text += `BID VIABILITY ANALYSIS\n${"-".repeat(30)}\n${content.viability}\n\n`
  }

  if (content.strengths) {
    text += `STRENGTHS\n${"-".repeat(30)}\n${content.strengths}\n\n`
  }

  if (content.weaknesses) {
    text += `WEAKNESSES\n${"-".repeat(30)}\n${content.weaknesses}\n\n`
  }

  if (content.complianceStrategy) {
    text += `COMPLIANCE STRATEGY\n${"-".repeat(30)}\n${content.complianceStrategy}\n\n`
  }

  if (content.pricingStrategy) {
    text += `PRICING STRATEGY\n${"-".repeat(30)}\n${content.pricingStrategy}\n\n`
  }

  if (content.risks) {
    text += `RISKS & MITIGATION\n${"-".repeat(30)}\n${content.risks}\n\n`
  }

  if (content.submissionChecklist) {
    text += `SUBMISSION CHECKLIST\n${"-".repeat(30)}\n${content.submissionChecklist}\n\n`
  }

  text += `\nGenerated by BidMate AI Strategist\nDate: ${new Date().toLocaleDateString()}`
  return text
}

function generateHTMLContent(strategy: Strategy): string {
  const content = strategy.content || {}
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${strategy.title} - Bid Strategy</title>
  <style>
    body { font-family: 'Inter', Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; color: #111827; }
    h1 { color: #005B8F; border-bottom: 2px solid #19A7CE; padding-bottom: 10px; }
    h2 { color: #005B8F; margin-top: 30px; }
    .summary { background: #F7F9FC; padding: 20px; border-radius: 8px; margin: 20px 0; }
    .section { margin-bottom: 30px; }
    .footer { margin-top: 50px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
  </style>
</head>
<body>
  <h1>${strategy.title}</h1>
  ${strategy.summary ? `<div class="summary"><strong>Summary:</strong> ${strategy.summary}</div>` : ""}
  ${content.viability ? `<div class="section"><h2>Bid Viability Analysis</h2><p>${content.viability}</p></div>` : ""}
  ${content.strengths ? `<div class="section"><h2>Strengths</h2><p>${content.strengths}</p></div>` : ""}
  ${content.weaknesses ? `<div class="section"><h2>Weaknesses</h2><p>${content.weaknesses}</p></div>` : ""}
  ${content.complianceStrategy ? `<div class="section"><h2>Compliance Strategy</h2><p>${content.complianceStrategy}</p></div>` : ""}
  ${content.pricingStrategy ? `<div class="section"><h2>Pricing Strategy</h2><p>${content.pricingStrategy}</p></div>` : ""}
  ${content.risks ? `<div class="section"><h2>Risks & Mitigation</h2><p>${content.risks}</p></div>` : ""}
  ${content.submissionChecklist ? `<div class="section"><h2>Submission Checklist</h2><p>${content.submissionChecklist}</p></div>` : ""}
  <div class="footer">Generated by BidMate AI Strategist | ${new Date().toLocaleDateString()}</div>
</body>
</html>`
}
