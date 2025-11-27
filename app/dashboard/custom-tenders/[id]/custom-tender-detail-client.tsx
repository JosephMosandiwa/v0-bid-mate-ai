"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  AlertCircle,
  ClipboardList,
  FileText,
  Sparkles,
  CheckCircle2,
  Clock,
  Download,
  Upload,
  Loader2,
  Save,
  ArrowLeft,
  Target,
  DollarSign,
  Award,
  HelpCircle,
  RefreshCw,
} from "lucide-react"
import Link from "next/link"
import { DynamicTenderForm } from "@/components/dynamic-tender-form"
import { useToast } from "@/hooks/use-toast"

interface CustomTenderDetailClientProps {
  tender: any
  documents: any[]
  analysis: any
}

export function CustomTenderDetailClient({
  tender,
  documents: initialDocuments,
  analysis: initialAnalysis,
}: CustomTenderDetailClientProps) {
  console.log("[v0] CustomTenderDetailClient RENDER START")
  console.log("[v0] Tender prop:", JSON.stringify(tender, null, 2))
  console.log("[v0] Documents prop:", initialDocuments?.length || 0, initialDocuments)
  console.log("[v0] Analysis prop:", initialAnalysis ? "EXISTS" : "NULL", initialAnalysis)

  console.log("[v0] ===========================================")
  console.log("[v0] ANALYZE BUTTON VISIBILITY CHECK:")
  console.log("[v0] documents.length > 0:", initialDocuments?.length > 0)
  console.log("[v0] !initialAnalysis:", !initialAnalysis)
  console.log("[v0] Should show button:", initialDocuments?.length > 0 && !initialAnalysis)
  console.log("[v0] ===========================================")

  const router = useRouter()
  const { toast } = useToast()
  const tenderId = tender.id

  console.log("[v0] Tender ID extracted:", tenderId)

  const [documents, setDocuments] = useState(initialDocuments)
  const [analysis, setAnalysis] = useState(initialAnalysis)
  const [analyzing, setAnalyzing] = useState(false)
  const [analysisError, setAnalysisError] = useState<string | null>(null)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)

  const [generatingStrategy, setGeneratingStrategy] = useState(false)
  const [strategyError, setStrategyError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    title: tender.title || "",
    organization: tender.organization || "",
    close_date: tender.close_date || "",
    value: tender.value || "",
    description: tender.description || "",
  })
  const [saving, setSaving] = useState(false)

  console.log("[v0] Form data initialized:", formData)
  console.log("[v0] Has analysis?", !!analysis)
  console.log("[v0] Has form fields?", analysis?.formFields?.length || 0)
  console.log("[v0] FormFields array:", analysis?.formFields)
  console.log("[v0] Should show Response Form tab?", !!(analysis?.formFields && analysis.formFields.length > 0))
  console.log("[v0] Documents count:", documents?.length || 0)

  useEffect(() => {
    console.log("[v0] CustomTenderDetailClient mounted - useEffect")
    console.log("[v0] Tender in useEffect:", tender)
    console.log("[v0] Documents in useEffect:", documents)
    console.log("[v0] Analysis in useEffect:", analysis)
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch(`/api/custom-tenders/${tenderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error("Failed to save")

      toast({
        title: "Saved",
        description: "Tender details updated successfully",
      })
    } catch (error) {
      console.error("[v0] Error saving tender details:", error)
      toast({
        title: "Error",
        description: "Failed to save tender details",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.type !== "application/pdf") {
      setAnalysisError("Please upload a PDF file")
      return
    }

    setUploadedFile(file)
    setAnalyzing(true)
    setAnalysisError(null)

    try {
      console.log("[v0] ========================================")
      console.log("[v0] STARTING PDF UPLOAD AND ANALYSIS")
      console.log("[v0] ========================================")
      console.log("[v0] File name:", file.name)
      console.log("[v0] File size:", (file.size / 1024 / 1024).toFixed(2), "MB")
      console.log("[v0] File type:", file.type)

      // Extract text from PDF
      const formData = new FormData()
      formData.append("file", file)

      console.log("[v0] Step 1: Extracting text from PDF...")
      const extractResponse = await fetch("/api/extract-pdf", {
        method: "POST",
        body: formData,
      })

      if (!extractResponse.ok) {
        const extractError = await extractResponse.json().catch(() => ({}))
        console.error("[v0] PDF extraction failed:", extractError)
        throw new Error(extractError.error || "Failed to extract text from PDF")
      }

      const { text } = await extractResponse.json()
      console.log("[v0] ✓ PDF text extracted successfully")
      console.log("[v0] Extracted text length:", text?.length, "characters")

      console.log("[v0] Step 2: Analyzing document with AI...")
      const analyzeResponse = await fetch("/api/analyze-tender", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentText: text }),
      })

      console.log("[v0] Analyze response status:", analyzeResponse.status, analyzeResponse.statusText)

      if (!analyzeResponse.ok) {
        let errorData
        try {
          errorData = await analyzeResponse.json()
          console.error("[v0] ========================================")
          console.error("[v0] ANALYZE-TENDER API ERROR")
          console.error("[v0] ========================================")
          console.error("[v0] Status:", analyzeResponse.status)
          console.error("[v0] Error type:", errorData.errorType)
          console.error("[v0] Error message:", errorData.error)
          console.error("[v0] Error details:", errorData.details)
          console.error("[v0] ========================================")
        } catch (parseError) {
          console.error("[v0] Failed to parse error response:", parseError)
          errorData = { error: "Failed to analyze document" }
        }
        throw new Error(errorData.error || "Failed to analyze document")
      }

      const analysisResult = await analyzeResponse.json()
      console.log("[v0] ✓ Document analyzed successfully")
      console.log("[v0] Analysis result keys:", Object.keys(analysisResult))
      setAnalysis(analysisResult)

      console.log("[v0] Step 3: Uploading file to blob storage...")
      // Upload file to blob storage
      const uploadFormData = new FormData()
      uploadFormData.append("file", file)

      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: uploadFormData,
      })

      if (!uploadResponse.ok) {
        const uploadError = await uploadResponse.json().catch(() => ({}))
        console.error("[v0] File upload failed:", uploadError)
        throw new Error(uploadError.error || "Failed to upload file")
      }

      const { url: blobUrl } = await uploadResponse.json()
      console.log("[v0] ✓ File uploaded successfully")
      console.log("[v0] Blob URL:", blobUrl)

      // Add document to list
      const newDoc = {
        id: `temp-${Date.now()}`,
        tender_id: tenderId,
        document_name: file.name,
        document_type: file.type,
        blob_url: blobUrl,
        file_size: file.size,
        created_at: new Date().toISOString(),
      }

      setDocuments([...documents, newDoc])

      console.log("[v0] ========================================")
      console.log("[v0] UPLOAD AND ANALYSIS COMPLETE")
      console.log("[v0] ========================================")

      toast({
        title: "Success",
        description: "Document uploaded and analyzed successfully",
      })
    } catch (error) {
      console.error("[v0] ========================================")
      console.error("[v0] UPLOAD AND ANALYSIS ERROR")
      console.error("[v0] ========================================")
      console.error("[v0] Error:", error)
      console.error("[v0] Error message:", error instanceof Error ? error.message : "Unknown error")
      console.error("[v0] ========================================")

      setAnalysisError(error instanceof Error ? error.message : "Failed to process document")
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to upload and analyze document",
        variant: "destructive",
      })
    } finally {
      setAnalyzing(false)
    }
  }

  const handleManualAnalysis = async (documentUrl: string) => {
    setAnalyzing(true)
    setAnalysisError(null)

    try {
      console.log("[v0] ========================================")
      console.log("[v0] MANUAL ANALYSIS TRIGGERED")
      console.log("[v0] Document URL:", documentUrl)
      console.log("[v0] ========================================")

      const response = await fetch("/api/analyze-tender", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentUrl,
          documentText: "", // Let the API extract text from URL
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Failed to analyze" }))
        console.error("[v0] Analysis failed:", errorData)
        throw new Error(errorData.error || "Failed to analyze document")
      }

      const analysisResult = await response.json()
      console.log("[v0] ✓ Analysis complete!")

      // Save analysis to database
      const saveResponse = await fetch(`/api/custom-tenders/${tenderId}/analysis`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ analysis: analysisResult }),
      })

      if (!saveResponse.ok) {
        throw new Error("Failed to save analysis")
      }

      setAnalysis(analysisResult)

      toast({
        title: "Success",
        description: "Document analyzed successfully",
      })

      // Refresh the page to show new analysis
      router.refresh()
    } catch (error) {
      console.error("[v0] Manual analysis error:", error)
      setAnalysisError(error instanceof Error ? error.message : "Failed to analyze document")
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to analyze document",
        variant: "destructive",
      })
    } finally {
      setAnalyzing(false)
    }
  }

  const handleGenerateStrategy = async () => {
    setGeneratingStrategy(true)
    setStrategyError(null)

    try {
      const response = await fetch(`/api/custom-tenders/${tenderId}/negotiation-strategy`, {
        method: "POST",
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate strategy")
      }

      // Refresh the page to show the new strategy
      window.location.reload()
    } catch (error: any) {
      console.error("[v0] Strategy generation error:", error)
      setStrategyError(error.message)
    } finally {
      setGeneratingStrategy(false)
    }
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-4 md:space-y-6">
      <div className="bg-purple-100 dark:bg-purple-900/20 border-2 border-purple-500 rounded-lg p-4 text-sm font-mono">
        <div className="font-bold text-lg mb-2">🔍 Debug Info</div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            Documents: <strong>{documents.length}</strong>
          </div>
          <div>
            Analysis: <strong>{analysis ? "✅ EXISTS" : "❌ NULL"}</strong>
          </div>
          <div>
            Analyzing: <strong>{analyzing ? "YES" : "NO"}</strong>
          </div>
          <div>
            Show Button:{" "}
            <strong className="text-lg">{documents.length > 0 && !analysis && !analyzing ? "✅ YES" : "❌ NO"}</strong>
          </div>
        </div>
        {analysis && (
          <div className="mt-2 p-2 bg-green-100 dark:bg-green-900/20 rounded">✅ Analysis exists - button hidden</div>
        )}
        {!analysis && documents.length === 0 && (
          <div className="mt-2 p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded">
            ⚠️ No documents - upload a document first
          </div>
        )}
        {!analysis && documents.length > 0 && (
          <div className="mt-2 p-2 bg-red-100 dark:bg-red-900/20 rounded">🚨 Button SHOULD be visible below!</div>
        )}
      </div>

      <div>
        <div className="flex items-center gap-4 mb-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/tenders">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">{tender.title || "Custom Tender"}</h1>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge className="bg-primary/10 text-primary">Custom</Badge>
          {tender.category && <Badge variant="outline">{tender.category}</Badge>}
          {analysis && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              AI Analyzed
            </Badge>
          )}
        </div>
        {tender.description && <p className="text-muted-foreground mb-4">{tender.description}</p>}
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          {tender.organization && (
            <span className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              {tender.organization}
            </span>
          )}
          {tender.close_date && (
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              Closes: {new Date(tender.close_date).toLocaleDateString()}
            </span>
          )}
          {tender.value && (
            <span className="flex items-center gap-1">
              <span>Value: {tender.value}</span>
            </span>
          )}
        </div>
      </div>

      {analyzing && (
        <Alert>
          <Loader2 className="h-4 w-4 animate-spin" />
          <AlertDescription>Analyzing tender documents with AI... This may take a minute.</AlertDescription>
        </Alert>
      )}

      {analysisError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{analysisError}</AlertDescription>
        </Alert>
      )}

      <div className="border-4 border-yellow-500 rounded-xl p-1">
        <Alert className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20 border-yellow-300 dark:border-yellow-800 border-2">
          <AlertCircle className="h-6 w-6 text-yellow-600 animate-pulse" />
          <AlertDescription className="flex flex-col gap-4">
            <div className="flex-1">
              <div className="font-bold text-lg text-yellow-900 dark:text-yellow-100 mb-2">🎯 Analysis Required</div>
              <span className="text-yellow-900 dark:text-yellow-100 text-base">
                This tender has {documents.length} document(s) but hasn't been analyzed yet. Click below to generate AI
                insights, compliance checks, and the response form.
              </span>
            </div>
            <Button
              size="lg"
              onClick={() => handleManualAnalysis(documents[0].blob_url || documents[0].storage_path)}
              disabled={analyzing}
              className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white text-lg py-6 font-bold shadow-lg"
            >
              {analyzing ? (
                <>
                  <Loader2 className="h-6 w-6 mr-3 animate-spin" />
                  Analyzing Document...
                </>
              ) : (
                <>
                  <Sparkles className="h-6 w-6 mr-3" />🚀 Analyze Document Now
                </>
              )}
            </Button>
          </AlertDescription>
        </Alert>
      </div>

      <Tabs defaultValue="details" className="space-y-4 md:space-y-6">
        <TabsList>
          <TabsTrigger value="details">
            <FileText className="h-4 w-4 mr-2" />
            Tender Details
          </TabsTrigger>
          {analysis && (
            <>
              <TabsTrigger value="action-plan">
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Action Plan
              </TabsTrigger>
              <TabsTrigger value="analysis">
                <Sparkles className="h-4 w-4 mr-2" />
                AI Insights
              </TabsTrigger>
            </>
          )}
          {/* Add new tab for Negotiation Strategy */}
          {analysis && (
            <TabsTrigger value="strategy">
              <Target className="h-4 w-4 mr-2" />
              Strategy
            </TabsTrigger>
          )}
          <TabsTrigger value="documents">
            <FileText className="h-4 w-4 mr-2" />
            Documents ({documents.length})
          </TabsTrigger>
          {analysis?.formFields && analysis.formFields.length > 0 && (
            <TabsTrigger value="form">
              <ClipboardList className="h-4 w-4 mr-2" />
              Response Form
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="details" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tender Information</CardTitle>
              <CardDescription>
                {analysis
                  ? "These fields were automatically filled from your uploaded document. Review and edit as needed."
                  : "Basic information about the tender"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Tender Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="organization">Organization</Label>
                <Input
                  id="organization"
                  placeholder="e.g., Department of Health"
                  value={formData.organization}
                  onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="close_date">Deadline</Label>
                  <Input
                    id="close_date"
                    type="date"
                    value={formData.close_date}
                    onChange={(e) => setFormData({ ...formData, close_date: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="value">Tender Value</Label>
                  <Input
                    id="value"
                    placeholder="e.g., R 2,500,000"
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <Button onClick={handleSave} disabled={saving}>
                <Save className="h-4 w-4 mr-2" />
                {saving ? "Saving..." : "Save Details"}
              </Button>
            </CardContent>
          </Card>

          {documents.length === 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Upload Tender Document</CardTitle>
                <CardDescription>Upload a PDF document to generate the response form automatically</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <Label
                    htmlFor="pdf-upload"
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md cursor-pointer hover:bg-primary/90 transition-colors"
                  >
                    <Upload className="h-4 w-4" />
                    {uploadedFile ? "Change Document" : "Upload PDF"}
                  </Label>
                  <Input
                    id="pdf-upload"
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  {uploadedFile && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <FileText className="h-4 w-4" />
                      {uploadedFile.name}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {analysis && analysis.action_plan && (
          <TabsContent value="action-plan" className="space-y-4">
            <Alert className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900">
              <AlertCircle className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-900 dark:text-blue-100">
                Follow this action plan to ensure you meet all requirements and deadlines for this tender.
              </AlertDescription>
            </Alert>

            {/* Critical Dates Timeline */}
            {analysis.action_plan?.critical_dates &&
              Array.isArray(analysis.action_plan.critical_dates) &&
              analysis.action_plan.critical_dates.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-orange-600" />
                      Critical Dates & Events
                    </CardTitle>
                    <CardDescription>
                      Mark these dates in your calendar - missing them may disqualify your bid
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analysis.action_plan.critical_dates.map((item: any, idx: number) => (
                        <div
                          key={idx}
                          className="flex items-start gap-4 p-4 rounded-lg border-l-4 border-orange-500 bg-orange-50 dark:bg-orange-950/20"
                        >
                          <div className="flex-shrink-0 w-20 text-center">
                            <div className="text-2xl font-bold text-orange-600">{new Date(item.date).getDate()}</div>
                            <div className="text-xs text-muted-foreground uppercase">
                              {new Date(item.date).toLocaleDateString("en-US", { month: "short" })}
                            </div>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-foreground mb-1">{item.event}</h4>
                            <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                              {item.time && (
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {item.time}
                                </span>
                              )}
                              {item.location && (
                                <span className="flex items-center gap-1">
                                  <span>📍</span>
                                  {item.location}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

            {/* Preparation Tasks Checklist */}
            {analysis.action_plan?.preparation_tasks &&
              Array.isArray(analysis.action_plan.preparation_tasks) &&
              analysis.action_plan.preparation_tasks.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ClipboardList className="h-5 w-5 text-primary" />
                      Preparation Checklist
                    </CardTitle>
                    <CardDescription>Complete these tasks before the tender closing date</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {analysis.action_plan.preparation_tasks
                        .sort((a: any, b: any) => {
                          const priorityOrder = { High: 0, Medium: 1, Low: 2 }
                          return (
                            priorityOrder[a.priority as keyof typeof priorityOrder] -
                            priorityOrder[b.priority as keyof typeof priorityOrder]
                          )
                        })
                        .map((task: any, idx: number) => (
                          <div
                            key={idx}
                            className="flex items-start gap-3 p-4 rounded-lg border border-border hover:border-primary/50 transition-colors"
                          >
                            <input
                              type="checkbox"
                              className="mt-1 h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
                            />
                            <div className="flex-1">
                              <div className="flex items-start justify-between gap-2 mb-2">
                                <h4 className="font-medium text-foreground">{task.task}</h4>
                                <Badge
                                  variant={
                                    task.priority === "High"
                                      ? "destructive"
                                      : task.priority === "Medium"
                                        ? "default"
                                        : "secondary"
                                  }
                                  className="flex-shrink-0"
                                >
                                  {task.priority}
                                </Badge>
                              </div>
                              <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  Due: {new Date(task.deadline).toLocaleDateString()}
                                </span>
                                <Badge variant="outline" className="text-xs">
                                  {task.category}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              )}
          </TabsContent>
        )}

        {analysis && (
          <TabsContent value="analysis" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Tender Overview</CardTitle>
                <CardDescription>Key information about this tender opportunity</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {analysis.tender_summary?.tender_number && (
                  <div className="grid grid-cols-[140px_1fr] gap-2 items-start">
                    <span className="text-sm font-medium text-muted-foreground">Tender Number:</span>
                    <span className="text-sm font-mono bg-muted px-2 py-1 rounded">
                      {analysis.tender_summary.tender_number}
                    </span>
                  </div>
                )}

                {analysis.tender_summary?.title && (
                  <div className="grid grid-cols-[140px_1fr] gap-2 items-start">
                    <span className="text-sm font-medium text-muted-foreground">Title:</span>
                    <span className="text-sm">{analysis.tender_summary.title}</span>
                  </div>
                )}

                {analysis.tender_summary?.entity && (
                  <div className="grid grid-cols-[140px_1fr] gap-2 items-start">
                    <span className="text-sm font-medium text-muted-foreground">Issuing Entity:</span>
                    <span className="text-sm">{analysis.tender_summary.entity}</span>
                  </div>
                )}

                {analysis.tender_summary?.description && (
                  <div className="grid grid-cols-[140px_1fr] gap-2 items-start">
                    <span className="text-sm font-medium text-muted-foreground">Description:</span>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {analysis.tender_summary.description}
                    </p>
                  </div>
                )}

                {analysis.tender_summary?.contract_duration && (
                  <div className="grid grid-cols-[140px_1fr] gap-2 items-start">
                    <span className="text-sm font-medium text-muted-foreground">Contract Duration:</span>
                    <span className="text-sm">{analysis.tender_summary.contract_duration}</span>
                  </div>
                )}

                {analysis.tender_summary?.closing_date && (
                  <div className="grid grid-cols-[140px_1fr] gap-2 items-start">
                    <span className="text-sm font-medium text-muted-foreground">Closing Date:</span>
                    <span className="text-sm font-semibold text-orange-600 dark:text-orange-400">
                      {analysis.tender_summary.closing_date}
                    </span>
                  </div>
                )}

                {analysis.tender_summary?.submission_method && (
                  <div className="grid grid-cols-[140px_1fr] gap-2 items-start">
                    <span className="text-sm font-medium text-muted-foreground">Submission Method:</span>
                    <span className="text-sm">{analysis.tender_summary.submission_method}</span>
                  </div>
                )}

                {analysis.tender_summary?.compulsory_briefing && (
                  <div className="grid grid-cols-[140px_1fr] gap-2 items-start">
                    <span className="text-sm font-medium text-muted-foreground">Compulsory Briefing:</span>
                    <span className="text-sm font-semibold text-red-600 dark:text-red-400">
                      {analysis.tender_summary.compulsory_briefing}
                    </span>
                  </div>
                )}

                {analysis.tender_summary?.validity_period && (
                  <div className="grid grid-cols-[140px_1fr] gap-2 items-start">
                    <span className="text-sm font-medium text-muted-foreground">Validity Period:</span>
                    <span className="text-sm">{analysis.tender_summary.validity_period}</span>
                  </div>
                )}

                {analysis.tender_summary?.contact_email && (
                  <div className="grid grid-cols-[140px_1fr] gap-2 items-start">
                    <span className="text-sm font-medium text-muted-foreground">Contact Email:</span>
                    <a
                      href={`mailto:${analysis.tender_summary.contact_email}`}
                      className="text-sm text-primary hover:underline"
                    >
                      {analysis.tender_summary.contact_email}
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>

            {analysis.compliance_summary && (
              <>
                {analysis.compliance_summary?.requirements &&
                  Array.isArray(analysis.compliance_summary.requirements) &&
                  analysis.compliance_summary.requirements.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                          Compliance Requirements
                        </CardTitle>
                        <CardDescription>Mandatory requirements you must fulfill</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-3">
                          {analysis.compliance_summary.requirements.map((req: string, idx: number) => (
                            <li
                              key={idx}
                              className="flex items-start gap-3 p-3 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900"
                            >
                              <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-foreground">{req}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}

                {analysis.compliance_summary?.disqualifiers &&
                  Array.isArray(analysis.compliance_summary.disqualifiers) &&
                  analysis.compliance_summary.disqualifiers.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <AlertCircle className="h-5 w-5 text-red-600" />
                          Disqualifiers
                        </CardTitle>
                        <CardDescription>Actions or omissions that will eliminate your bid</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-3">
                          {analysis.compliance_summary.disqualifiers.map((disq: string, idx: number) => (
                            <li
                              key={idx}
                              className="flex items-start gap-3 p-3 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900"
                            >
                              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-foreground font-medium">{disq}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}

                {analysis.compliance_summary?.strengtheners &&
                  Array.isArray(analysis.compliance_summary.strengtheners) &&
                  analysis.compliance_summary.strengtheners.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Sparkles className="h-5 w-5 text-blue-600" />
                          Bid Strengtheners
                        </CardTitle>
                        <CardDescription>
                          Factors that will improve your bid quality and competitiveness
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-3">
                          {analysis.compliance_summary.strengtheners.map((str: string, idx: number) => (
                            <li
                              key={idx}
                              className="flex items-start gap-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900"
                            >
                              <Sparkles className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-foreground">{str}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}
              </>
            )}

            {analysis.evaluation && (
              <Card>
                <CardHeader>
                  <CardTitle>Evaluation Criteria</CardTitle>
                  <CardDescription>
                    How your tender submission will be scored
                    {analysis.evaluation.threshold && ` • Minimum threshold: ${analysis.evaluation.threshold}`}
                    {analysis.evaluation.pricing_system && ` • Pricing system: ${analysis.evaluation.pricing_system}`}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {analysis.evaluation?.criteria &&
                    Array.isArray(analysis.evaluation.criteria) &&
                    analysis.evaluation.criteria.length > 0 && (
                      <div className="space-y-3">
                        {analysis.evaluation.criteria.map((item: any, idx: number) => (
                          <div key={idx} className="flex items-center gap-4 p-3 rounded-lg border border-border">
                            <div className="flex-1">
                              <p className="text-sm font-medium text-foreground">{item.criterion}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary" className="text-base font-semibold">
                                {item.weight}%
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                  <div className="pt-4 border-t border-border space-y-2">
                    {analysis.evaluation.threshold && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Minimum Qualifying Score:</span>
                        <span className="font-semibold text-orange-600 dark:text-orange-400">
                          {analysis.evaluation.threshold}
                        </span>
                      </div>
                    )}
                    {analysis.evaluation.pricing_system && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Pricing System:</span>
                        <span className="font-semibold">{analysis.evaluation.pricing_system}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {analysis.financial_requirements && (
              <Card>
                <CardHeader>
                  <CardTitle>Financial Requirements</CardTitle>
                  <CardDescription>Financial obligations and proof required for this tender</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {analysis.financial_requirements.bank_guarantee &&
                    analysis.financial_requirements.bank_guarantee !== "Not specified" && (
                      <div className="flex items-start gap-3 p-3 rounded-lg border">
                        <div className="font-medium text-sm w-40 text-muted-foreground">Bank Guarantee:</div>
                        <div className="text-sm flex-1">{analysis.financial_requirements.bank_guarantee}</div>
                      </div>
                    )}
                  {analysis.financial_requirements.performance_bond &&
                    analysis.financial_requirements.performance_bond !== "Not specified" && (
                      <div className="flex items-start gap-3 p-3 rounded-lg border">
                        <div className="font-medium text-sm w-40 text-muted-foreground">Performance Bond:</div>
                        <div className="text-sm flex-1">{analysis.financial_requirements.performance_bond}</div>
                      </div>
                    )}
                  {analysis.financial_requirements.insurance_requirements?.length > 0 && (
                    <div className="flex items-start gap-3 p-3 rounded-lg border">
                      <div className="font-medium text-sm w-40 text-muted-foreground">Insurance:</div>
                      <ul className="text-sm flex-1 space-y-1">
                        {analysis.financial_requirements.insurance_requirements.map((ins: string, idx: number) => (
                          <li key={idx}>• {ins}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {analysis.financial_requirements.financial_turnover &&
                    analysis.financial_requirements.financial_turnover !== "Not specified" && (
                      <div className="flex items-start gap-3 p-3 rounded-lg border">
                        <div className="font-medium text-sm w-40 text-muted-foreground">Min. Turnover:</div>
                        <div className="text-sm flex-1">{analysis.financial_requirements.financial_turnover}</div>
                      </div>
                    )}
                  {analysis.financial_requirements.audited_financials &&
                    analysis.financial_requirements.audited_financials !== "Not specified" && (
                      <div className="flex items-start gap-3 p-3 rounded-lg border">
                        <div className="font-medium text-sm w-40 text-muted-foreground">Financial Statements:</div>
                        <div className="text-sm flex-1">{analysis.financial_requirements.audited_financials}</div>
                      </div>
                    )}
                  {analysis.financial_requirements.payment_terms &&
                    analysis.financial_requirements.payment_terms !== "Not specified" && (
                      <div className="flex items-start gap-3 p-3 rounded-lg border">
                        <div className="font-medium text-sm w-40 text-muted-foreground">Payment Terms:</div>
                        <div className="text-sm flex-1">{analysis.financial_requirements.payment_terms}</div>
                      </div>
                    )}
                </CardContent>
              </Card>
            )}

            {analysis.legal_registration && (
              <Card>
                <CardHeader>
                  <CardTitle>Legal & Registration Requirements</CardTitle>
                  <CardDescription>Mandatory registrations and legal compliance</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {analysis.legal_registration.cidb_grading &&
                    analysis.legal_registration.cidb_grading !== "Not specified" && (
                      <div className="flex items-start gap-3 p-3 rounded-lg border bg-orange-50 dark:bg-orange-950/20">
                        <div className="font-medium text-sm w-40 text-muted-foreground">CIDB Grading:</div>
                        <div className="text-sm flex-1 font-semibold text-orange-600">
                          {analysis.legal_registration.cidb_grading}
                        </div>
                      </div>
                    )}
                  {analysis.legal_registration.cipc_registration &&
                    analysis.legal_registration.cipc_registration !== "Not specified" && (
                      <div className="flex items-start gap-3 p-3 rounded-lg border">
                        <div className="font-medium text-sm w-40 text-muted-foreground">CIPC Registration:</div>
                        <div className="text-sm flex-1">{analysis.legal_registration.cipc_registration}</div>
                      </div>
                    )}
                  {analysis.legal_registration.professional_registration?.length > 0 && (
                    <div className="flex items-start gap-3 p-3 rounded-lg border">
                      <div className="font-medium text-sm w-40 text-muted-foreground">Professional Bodies:</div>
                      <ul className="text-sm flex-1 space-y-1">
                        {analysis.legal_registration.professional_registration.map((reg: string, idx: number) => (
                          <li key={idx}>• {reg}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {analysis.legal_registration.joint_venture_requirements &&
                    analysis.legal_registration.joint_venture_requirements !== "Not specified" && (
                      <div className="flex items-start gap-3 p-3 rounded-lg border">
                        <div className="font-medium text-sm w-40 text-muted-foreground">JV Requirements:</div>
                        <div className="text-sm flex-1">{analysis.legal_registration.joint_venture_requirements}</div>
                      </div>
                    )}
                  {analysis.legal_registration.subcontracting_limitations &&
                    analysis.legal_registration.subcontracting_limitations !== "Not specified" && (
                      <div className="flex items-start gap-3 p-3 rounded-lg border">
                        <div className="font-medium text-sm w-40 text-muted-foreground">Subcontracting Limit:</div>
                        <div className="text-sm flex-1">{analysis.legal_registration.subcontracting_limitations}</div>
                      </div>
                    )}
                </CardContent>
              </Card>
            )}

            {analysis.labour_employment && (
              <Card>
                <CardHeader>
                  <CardTitle>Labour & Local Content</CardTitle>
                  <CardDescription>Workforce and transformation requirements</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {analysis.labour_employment.local_content &&
                    analysis.labour_employment.local_content !== "Not specified" && (
                      <div className="flex items-start gap-3 p-3 rounded-lg border bg-green-50 dark:bg-green-950/20">
                        <div className="font-medium text-sm w-40 text-muted-foreground">Local Content:</div>
                        <div className="text-sm flex-1 font-semibold text-green-600">
                          {analysis.labour_employment.local_content}
                        </div>
                      </div>
                    )}
                  {analysis.labour_employment.subcontracting_limit &&
                    analysis.labour_employment.subcontracting_limit !== "Not specified" && (
                      <div className="flex items-start gap-3 p-3 rounded-lg border">
                        <div className="font-medium text-sm w-40 text-muted-foreground">Subcontracting Limit:</div>
                        <div className="text-sm flex-1">{analysis.labour_employment.subcontracting_limit}</div>
                      </div>
                    )}
                  {analysis.labour_employment.labour_composition &&
                    analysis.labour_employment.labour_composition !== "Not specified" && (
                      <div className="flex items-start gap-3 p-3 rounded-lg border">
                        <div className="font-medium text-sm w-40 text-muted-foreground">Labour Composition:</div>
                        <div className="text-sm flex-1">{analysis.labour_employment.labour_composition}</div>
                      </div>
                    )}
                  {analysis.labour_employment.skills_development &&
                    analysis.labour_employment.skills_development !== "Not specified" && (
                      <div className="flex items-start gap-3 p-3 rounded-lg border">
                        <div className="font-medium text-sm w-40 text-muted-foreground">Skills Development:</div>
                        <div className="text-sm flex-1">{analysis.labour_employment.skills_development}</div>
                      </div>
                    )}
                  {analysis.labour_employment.employment_equity &&
                    analysis.labour_employment.employment_equity !== "Not specified" && (
                      <div className="flex items-start gap-3 p-3 rounded-lg border">
                        <div className="font-medium text-sm w-40 text-muted-foreground">Employment Equity:</div>
                        <div className="text-sm flex-1">{analysis.labour_employment.employment_equity}</div>
                      </div>
                    )}
                </CardContent>
              </Card>
            )}

            {analysis.technical_specs && (
              <Card>
                <CardHeader>
                  <CardTitle>Technical Requirements</CardTitle>
                  <CardDescription>Experience, resources, and capabilities required</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {analysis.technical_specs.minimum_experience &&
                    analysis.technical_specs.minimum_experience !== "Not specified" && (
                      <div className="flex items-start gap-3 p-3 rounded-lg border">
                        <div className="font-medium text-sm w-40 text-muted-foreground">Min. Experience:</div>
                        <div className="text-sm flex-1">{analysis.technical_specs.minimum_experience}</div>
                      </div>
                    )}
                  {analysis.technical_specs.project_references &&
                    analysis.technical_specs.project_references !== "Not specified" && (
                      <div className="flex items-start gap-3 p-3 rounded-lg border">
                        <div className="font-medium text-sm w-40 text-muted-foreground">Project References:</div>
                        <div className="text-sm flex-1">{analysis.technical_specs.project_references}</div>
                      </div>
                    )}
                  {analysis.technical_specs.key_personnel?.length > 0 && (
                    <div className="flex items-start gap-3 p-3 rounded-lg border">
                      <div className="font-medium text-sm w-40 text-muted-foreground">Key Personnel:</div>
                      <ul className="text-sm flex-1 space-y-1">
                        {analysis.technical_specs.key_personnel.map((person: string, idx: number) => (
                          <li key={idx}>• {person}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {analysis.technical_specs.equipment_resources?.length > 0 && (
                    <div className="flex items-start gap-3 p-3 rounded-lg border">
                      <div className="font-medium text-sm w-40 text-muted-foreground">Equipment/Resources:</div>
                      <ul className="text-sm flex-1 space-y-1">
                        {analysis.technical_specs.equipment_resources.map((equip: string, idx: number) => (
                          <li key={idx}>• {equip}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {analysis.technical_specs.methodology_requirements &&
                    analysis.technical_specs.methodology_requirements !== "Not specified" && (
                      <div className="flex items-start gap-3 p-3 rounded-lg border">
                        <div className="font-medium text-sm w-40 text-muted-foreground">Methodology:</div>
                        <div className="text-sm flex-1">{analysis.technical_specs.methodology_requirements}</div>
                      </div>
                    )}
                </CardContent>
              </Card>
            )}

            {analysis.submission_requirements && (
              <Card>
                <CardHeader>
                  <CardTitle>Submission Requirements</CardTitle>
                  <CardDescription>How to submit your tender proposal</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {analysis.submission_requirements.number_of_copies &&
                    analysis.submission_requirements.number_of_copies !== "Not specified" && (
                      <div className="flex items-start gap-3 p-3 rounded-lg border">
                        <div className="font-medium text-sm w-40 text-muted-foreground">Copies Required:</div>
                        <div className="text-sm flex-1">{analysis.submission_requirements.number_of_copies}</div>
                      </div>
                    )}
                  {analysis.submission_requirements.formatting_requirements &&
                    analysis.submission_requirements.formatting_requirements !== "Not specified" && (
                      <div className="flex items-start gap-3 p-3 rounded-lg border">
                        <div className="font-medium text-sm w-40 text-muted-foreground">Formatting:</div>
                        <div className="text-sm flex-1">{analysis.submission_requirements.formatting_requirements}</div>
                      </div>
                    )}
                  {analysis.submission_requirements.submission_address &&
                    analysis.submission_requirements.submission_address !== "Not specified" && (
                      <div className="flex items-start gap-3 p-3 rounded-lg border">
                        <div className="font-medium text-sm w-40 text-muted-foreground">Submit To:</div>
                        <div className="text-sm flex-1">{analysis.submission_requirements.submission_address}</div>
                      </div>
                    )}
                  {analysis.submission_requirements.query_deadline &&
                    analysis.submission_requirements.query_deadline !== "Not specified" && (
                      <div className="flex items-start gap-3 p-3 rounded-lg border">
                        <div className="font-medium text-sm w-40 text-muted-foreground">Query Deadline:</div>
                        <div className="text-sm flex-1">{analysis.submission_requirements.query_deadline}</div>
                      </div>
                    )}
                  {analysis.submission_requirements.late_submission_policy &&
                    analysis.submission_requirements.late_submission_policy !== "Not specified" && (
                      <div className="flex items-start gap-3 p-3 rounded-lg border">
                        <div className="font-medium text-sm w-40 text-muted-foreground">Late Submissions:</div>
                        <div className="text-sm flex-1">{analysis.submission_requirements.late_submission_policy}</div>
                      </div>
                    )}
                </CardContent>
              </Card>
            )}

            {analysis.penalties_payment && (
              <Card>
                <CardHeader>
                  <CardTitle>Penalties & Payment Terms</CardTitle>
                  <CardDescription>Contract penalties and payment structure</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {analysis.penalties_payment.late_completion_penalty &&
                    analysis.penalties_payment.late_completion_penalty !== "Not specified" && (
                      <div className="flex items-start gap-3 p-3 rounded-lg border bg-red-50 dark:bg-red-950/20">
                        <div className="font-medium text-sm w-40 text-muted-foreground">Late Completion:</div>
                        <div className="text-sm flex-1 font-semibold text-red-600">
                          {analysis.penalties_payment.late_completion_penalty}
                        </div>
                      </div>
                    )}
                  {analysis.penalties_payment.non_performance_penalty &&
                    analysis.penalties_payment.non_performance_penalty !== "Not specified" && (
                      <div className="flex items-start gap-3 p-3 rounded-lg border bg-red-50 dark:bg-red-950/20">
                        <div className="font-medium text-sm w-40 text-muted-foreground">Non-Performance:</div>
                        <div className="text-sm flex-1 font-semibold text-red-600">
                          {analysis.penalties_payment.non_performance_penalty}
                        </div>
                      </div>
                    )}
                  {analysis.penalties_payment.warranty_period &&
                    analysis.penalties_payment.warranty_period !== "Not specified" && (
                      <div className="flex items-start gap-3 p-3 rounded-lg border">
                        <div className="font-medium text-sm w-40 text-muted-foreground">Warranty Period:</div>
                        <div className="text-sm flex-1">{analysis.penalties_payment.warranty_period}</div>
                      </div>
                    )}
                  {analysis.penalties_payment.payment_schedule &&
                    analysis.penalties_payment.payment_schedule !== "Not specified" && (
                      <div className="flex items-start gap-3 p-3 rounded-lg border bg-green-50 dark:bg-green-950/20">
                        <div className="font-medium text-sm w-40 text-muted-foreground">Payment Schedule:</div>
                        <div className="text-sm flex-1">{analysis.penalties_payment.payment_schedule}</div>
                      </div>
                    )}
                  {analysis.penalties_payment.retention_amount &&
                    analysis.penalties_payment.retention_amount !== "Not specified" && (
                      <div className="flex items-start gap-3 p-3 rounded-lg border">
                        <div className="font-medium text-sm w-40 text-muted-foreground">Retention:</div>
                        <div className="text-sm flex-1">{analysis.penalties_payment.retention_amount}</div>
                      </div>
                    )}
                  {analysis.penalties_payment.payment_timeframe &&
                    analysis.penalties_payment.payment_timeframe !== "Not specified" && (
                      <div className="flex items-start gap-3 p-3 rounded-lg border">
                        <div className="font-medium text-sm w-40 text-muted-foreground">Payment Timeframe:</div>
                        <div className="text-sm flex-1">{analysis.penalties_payment.payment_timeframe}</div>
                      </div>
                    )}
                </CardContent>
              </Card>
            )}
          </TabsContent>
        )}

        {/* Add TabsContent for negotiation strategy */}
        {analysis && (
          <TabsContent value="strategy" className="space-y-4">
            {!analysis.negotiation_strategy ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    Negotiation Strategy Generator
                  </CardTitle>
                  <CardDescription>
                    Generate an AI-powered negotiation strategy based on the tender analysis, including pricing
                    recommendations, B-BBEE optimization, and risk mitigation tactics.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {strategyError && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{strategyError}</AlertDescription>
                    </Alert>
                  )}

                  <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                    <h4 className="font-medium">What you'll get:</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        5-point actionable negotiation plan with talking points
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        Win probability assessment with reasoning
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        Pricing strategy and margin guidance
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        B-BBEE optimization tactics
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        Red flags and risk mitigation strategies
                      </li>
                    </ul>
                  </div>

                  <Button onClick={handleGenerateStrategy} disabled={generatingStrategy} className="w-full" size="lg">
                    {generatingStrategy ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Generating Strategy...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        Generate Negotiation Strategy
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <>
                {/* Strategy Overview */}
                <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl">{analysis.negotiation_strategy.strategy_title}</CardTitle>
                        <CardDescription className="mt-2 text-base">
                          {analysis.negotiation_strategy.overall_approach}
                        </CardDescription>
                      </div>
                      {analysis.negotiation_strategy.win_probability_assessment && (
                        <div className="text-center px-4 py-2 rounded-lg bg-background border">
                          <div className="text-3xl font-bold text-primary">
                            {analysis.negotiation_strategy.win_probability_assessment.score}%
                          </div>
                          <div className="text-xs text-muted-foreground">Win Probability</div>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  {analysis.negotiation_strategy.win_probability_assessment?.reasoning && (
                    <CardContent>
                      <p className="text-sm text-muted-foreground italic">
                        {analysis.negotiation_strategy.win_probability_assessment.reasoning}
                      </p>
                    </CardContent>
                  )}
                </Card>

                {/* 5-Point Negotiation Plan */}
                {analysis.negotiation_strategy.negotiation_points && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <ClipboardList className="h-5 w-5 text-primary" />
                        5-Point Negotiation Plan
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {analysis.negotiation_strategy.negotiation_points.map((point: any, idx: number) => (
                        <div
                          key={idx}
                          className="p-4 rounded-lg border border-border hover:border-primary/50 transition-colors"
                        >
                          <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                              {point.point_number || idx + 1}
                            </div>
                            <div className="flex-1 space-y-3">
                              <div className="flex items-start justify-between gap-2">
                                <h4 className="font-semibold text-foreground">{point.title}</h4>
                                <div className="flex gap-2 flex-shrink-0">
                                  <Badge variant="outline">{point.category}</Badge>
                                  <Badge
                                    variant={
                                      point.priority === "Critical"
                                        ? "destructive"
                                        : point.priority === "High"
                                          ? "default"
                                          : "secondary"
                                    }
                                  >
                                    {point.priority}
                                  </Badge>
                                </div>
                              </div>

                              {point.challenge && (
                                <p className="text-sm text-muted-foreground">
                                  <span className="font-medium text-foreground">Challenge:</span> {point.challenge}
                                </p>
                              )}

                              <p className="text-sm">{point.strategy}</p>

                              {point.talking_points && point.talking_points.length > 0 && (
                                <div className="bg-muted/50 rounded-lg p-3">
                                  <div className="text-xs font-medium text-muted-foreground mb-2">TALKING POINTS:</div>
                                  <ul className="space-y-1">
                                    {point.talking_points.map((tp: string, tpIdx: number) => (
                                      <li key={tpIdx} className="text-sm flex items-start gap-2">
                                        <span className="text-primary">•</span>
                                        {tp}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {point.expected_outcome && (
                                <p className="text-sm text-green-600 dark:text-green-400">
                                  <span className="font-medium">Expected Outcome:</span> {point.expected_outcome}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}

                {/* Pricing Recommendations */}
                {analysis.negotiation_strategy.pricing_recommendations && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5 text-green-600" />
                        Pricing Strategy
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900">
                          <div className="text-sm font-medium text-muted-foreground mb-1">Recommended Approach</div>
                          <div className="text-lg font-semibold text-green-700 dark:text-green-400">
                            {analysis.negotiation_strategy.pricing_recommendations.approach}
                          </div>
                        </div>
                        {analysis.negotiation_strategy.pricing_recommendations.margin_guidance && (
                          <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900">
                            <div className="text-sm font-medium text-muted-foreground mb-1">Margin Guidance</div>
                            <div className="text-sm">
                              {analysis.negotiation_strategy.pricing_recommendations.margin_guidance}
                            </div>
                          </div>
                        )}
                      </div>
                      {analysis.negotiation_strategy.pricing_recommendations.rationale && (
                        <p className="text-sm text-muted-foreground">
                          {analysis.negotiation_strategy.pricing_recommendations.rationale}
                        </p>
                      )}
                      {analysis.negotiation_strategy.pricing_recommendations.risk_pricing && (
                        <div className="p-3 rounded-lg border bg-muted/50">
                          <div className="text-sm font-medium mb-1">Risk Pricing Advice:</div>
                          <p className="text-sm text-muted-foreground">
                            {analysis.negotiation_strategy.pricing_recommendations.risk_pricing}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* B-BBEE Optimization */}
                {analysis.negotiation_strategy.bbbee_optimization && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Award className="h-5 w-5 text-orange-600" />
                        B-BBEE Optimization
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {analysis.negotiation_strategy.bbbee_optimization.current_potential && (
                        <p className="text-sm">{analysis.negotiation_strategy.bbbee_optimization.current_potential}</p>
                      )}

                      {analysis.negotiation_strategy.bbbee_optimization.quick_wins &&
                        analysis.negotiation_strategy.bbbee_optimization.quick_wins.length > 0 && (
                          <div>
                            <div className="text-sm font-medium mb-2">Quick Wins:</div>
                            <ul className="space-y-2">
                              {analysis.negotiation_strategy.bbbee_optimization.quick_wins.map(
                                (win: string, idx: number) => (
                                  <li key={idx} className="flex items-start gap-2 text-sm">
                                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                                    {win}
                                  </li>
                                ),
                              )}
                            </ul>
                          </div>
                        )}

                      {analysis.negotiation_strategy.bbbee_optimization.subcontracting_strategy && (
                        <div className="p-3 rounded-lg border bg-orange-50 dark:bg-orange-950/20">
                          <div className="text-sm font-medium mb-1">Subcontracting Strategy:</div>
                          <p className="text-sm">
                            {analysis.negotiation_strategy.bbbee_optimization.subcontracting_strategy}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Red Flags */}
                {analysis.negotiation_strategy.red_flags && analysis.negotiation_strategy.red_flags.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-red-600" />
                        Red Flags & Mitigation
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {analysis.negotiation_strategy.red_flags.map((flag: any, idx: number) => (
                          <div
                            key={idx}
                            className="p-3 rounded-lg border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/20"
                          >
                            <div className="font-medium text-red-700 dark:text-red-400 mb-1">{flag.issue}</div>
                            <p className="text-sm text-muted-foreground">{flag.recommendation}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Clarification Questions */}
                {analysis.negotiation_strategy.clarification_questions &&
                  analysis.negotiation_strategy.clarification_questions.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <HelpCircle className="h-5 w-5 text-blue-600" />
                          Clarification Questions
                        </CardTitle>
                        <CardDescription>Ask these during the tender clarification period</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {analysis.negotiation_strategy.clarification_questions.map((q: string, idx: number) => (
                            <li key={idx} className="flex items-start gap-3 p-2 rounded hover:bg-muted/50">
                              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 flex items-center justify-center text-xs font-medium">
                                {idx + 1}
                              </span>
                              <span className="text-sm">{q}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}

                {/* Regenerate Button */}
                <div className="flex justify-center pt-4">
                  <Button variant="outline" onClick={handleGenerateStrategy} disabled={generatingStrategy}>
                    {generatingStrategy ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Regenerating...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Regenerate Strategy
                      </>
                    )}
                  </Button>
                </div>
              </>
            )}
          </TabsContent>
        )}

        <TabsContent value="documents" className="space-y-4">
          {documents.length > 0 ? (
            <div className="grid gap-4">
              {documents.map((doc: any) => (
                <Card key={doc.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{doc.document_name || doc.file_name}</CardTitle>
                        <CardDescription className="mt-1">
                          {doc.document_type || doc.file_type} • {((doc.file_size || 0) / 1024 / 1024).toFixed(2)} MB
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" asChild>
                          <a href={doc.blob_url || doc.storage_path} download>
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </a>
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground mb-4">No documents uploaded yet</p>
                <Label
                  htmlFor="pdf-upload-docs"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md cursor-pointer hover:bg-primary/90 transition-colors"
                >
                  <Upload className="h-4 w-4" />
                  Upload PDF
                </Label>
                <Input
                  id="pdf-upload-docs"
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {analysis?.formFields && analysis.formFields.length > 0 && (
          <TabsContent value="form" className="space-y-4 md:space-y-6">
            {console.log("[v0] 🟢 Response Form Tab Content IS RENDERING")}
            {console.log("[v0] Passing formFields to DynamicTenderForm:", analysis.formFields.length, "fields")}
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                This form was automatically generated from the tender documents. Fill in all required fields and save
                your progress as you go.
              </AlertDescription>
            </Alert>
            <DynamicTenderForm
              tenderId={tenderId}
              formFields={analysis.formFields}
              documents={documents}
              tenderData={{
                id: tenderId,
                title: tender.title,
                source_name: tender.organization,
                description: tender.description,
                close_date: tender.close_date,
                estimated_value: tender.value,
                category: tender.category,
              }}
            />
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}
