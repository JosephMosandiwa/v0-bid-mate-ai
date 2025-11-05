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

  const router = useRouter()
  const { toast } = useToast()
  const tenderId = tender.id

  console.log("[v0] Tender ID extracted:", tenderId)

  const [documents, setDocuments] = useState(initialDocuments)
  const [analysis, setAnalysis] = useState(initialAnalysis)
  const [analyzing, setAnalyzing] = useState(false)
  const [analysisError, setAnalysisError] = useState<string | null>(null)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)

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

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-4 md:space-y-6">
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
            {analysis.action_plan?.critical_dates && analysis.action_plan.critical_dates.length > 0 && (
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
            {analysis.action_plan?.preparation_tasks && analysis.action_plan.preparation_tasks.length > 0 && (
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
                {analysis.compliance_summary?.requirements && analysis.compliance_summary.requirements.length > 0 && (
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

                {analysis.compliance_summary?.disqualifiers && analysis.compliance_summary.disqualifiers.length > 0 && (
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

                {analysis.compliance_summary?.strengtheners && analysis.compliance_summary.strengtheners.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-blue-600" />
                        Bid Strengtheners
                      </CardTitle>
                      <CardDescription>Factors that will improve your bid quality and competitiveness</CardDescription>
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
                  {analysis.evaluation?.criteria && analysis.evaluation.criteria.length > 0 && (
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
