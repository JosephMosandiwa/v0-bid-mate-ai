"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Upload, FileText, CheckCircle2, AlertCircle, Loader2, CreditCard } from "lucide-react"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { createCustomTender } from "@/app/actions/tender-actions"
import { useToast } from "@/hooks/use-toast"

type AnalysisResult = {
  tender_summary?: {
    tender_number?: string
    title?: string
    entity?: string
    description?: string
    contract_duration?: string
    closing_date?: string
    submission_method?: string
    compulsory_briefing?: string
    validity_period?: string
    contact_email?: string
  }
  compliance_summary?: {
    requirements?: string[]
    disqualifiers?: string[]
    strengtheners?: string[]
  }
  evaluation?: {
    criteria?: Array<{ criterion: string; weight: string }>
    threshold?: string
    pricing_system?: string
  }
  action_plan?: {
    critical_dates?: Array<{
      date: string
      event: string
      time?: string
      location?: string
    }>
    preparation_tasks?: Array<{
      task: string
      priority: string
      category: string
      deadline?: string
    }>
  }
  formFields?: Array<{
    id: string
    label: string
    type: string
    required: boolean
    section: string
  }>
}

export default function NewTenderPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)
  const [analysisError, setAnalysisError] = useState<string | null>(null)
  const [paymentRequired, setPaymentRequired] = useState(false)
  const [dashboardUrl, setDashboardUrl] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    title: "",
    organization: "",
    deadline: "",
    value: "",
    description: "",
  })

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
    setAnalysis(null)
    setPaymentRequired(false)
    setDashboardUrl(null)

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < 768

    console.log("[v0] Device detection:", {
      userAgent: navigator.userAgent,
      isMobile,
      screenWidth: window.innerWidth,
    })

    if (isMobile) {
      console.log("[v0] Mobile device detected - skipping automatic text extraction")
      setAnalyzing(false)
      toast({
        title: "✅ PDF Uploaded Successfully",
        description: "Fill in the details below and submit. We'll analyze the document when you create the tender.",
      })
      return
    }

    try {
      console.log("[v0] Starting PDF processing on desktop...")
      console.log("[v0] File:", file.name, "Size:", file.size, "bytes")

      // Step 1: Extract text using PDF.js on client
      console.log("[v0] Step 1: Extracting text from PDF using PDF.js...")

      let fullText = ""
      let pdf = null

      try {
        const arrayBuffer = await file.arrayBuffer()
        console.log("[v0] ArrayBuffer created, size:", arrayBuffer.byteLength)

        const pdfjsLib = await import("pdfjs-dist")
        console.log("[v0] PDF.js library loaded, version:", pdfjsLib.version)

        pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`
        console.log("[v0] Worker source set:", pdfjsLib.GlobalWorkerOptions.workerSrc)

        pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
        console.log("[v0] PDF loaded successfully. Pages:", pdf.numPages)

        for (let i = 1; i <= pdf.numPages; i++) {
          console.log("[v0] Processing page", i, "of", pdf.numPages)
          const page = await pdf.getPage(i)
          const textContent = await page.getTextContent()
          const pageText = textContent.items.map((item: any) => item.str).join(" ")
          fullText += pageText + "\n\n"
          console.log("[v0] Page", i, "text length:", pageText.length, "characters")
        }

        console.log("[v0] Text extraction successful:")
        console.log("[v0] - Total text length:", fullText.length, "characters")
        console.log("[v0] - Total pages:", pdf.numPages)
        console.log("[v0] - First 200 chars:", fullText.substring(0, 200))
      } catch (pdfError) {
        console.error("[v0] PDF.js error:", pdfError)
        console.error("[v0] Error type:", pdfError instanceof Error ? pdfError.name : typeof pdfError)
        console.error("[v0] Error message:", pdfError instanceof Error ? pdfError.message : String(pdfError))
        console.error("[v0] Error stack:", pdfError instanceof Error ? pdfError.stack : "No stack trace")

        throw new Error(`PDF processing failed: ${pdfError instanceof Error ? pdfError.message : String(pdfError)}`)
      }

      if (fullText.length < 100) {
        console.error("[v0] Insufficient text extracted. Length:", fullText.length)
        setAnalysisError("The PDF appears to be scanned or image-based. Please fill in the details manually.")
        setAnalyzing(false)
        toast({
          title: "Scanned Document Detected",
          description: "Fill in the tender details below. Your PDF is uploaded and will be saved with your submission.",
        })
        return
      }

      // Step 2: Analyze with AI (AI will generate form fields intelligently)
      console.log("[v0] Step 2: Analyzing with AI...")
      const analyzeResponse = await fetch("/api/analyze-tender", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentText: fullText,
        }),
      })

      console.log("[v0] AI analysis response status:", analyzeResponse.status)

      if (!analyzeResponse.ok) {
        const errorData: any = await analyzeResponse.json()
        console.error("[v0] AI analysis failed:", errorData)

        if (errorData.errorType === "payment_required") {
          setPaymentRequired(true)
          setDashboardUrl(errorData.dashboardUrl || "https://vercel.com/dashboard/ai")
          setAnalysisError(errorData.error)
        } else {
          setAnalysisError(errorData.error || "Failed to analyze document")
        }
        toast({
          title: "Analysis Failed",
          description: "Fill in the tender details manually. Your PDF is uploaded and will be saved.",
          variant: "destructive",
        })
        return
      }

      const analysisResult = await analyzeResponse.json()
      console.log("[v0] Analysis complete. Result keys:", Object.keys(analysisResult))
      console.log("[v0] AI-generated form fields:", analysisResult.formFields?.length || 0)
      setAnalysis(analysisResult)

      if (analysisResult.tender_summary) {
        const summary = analysisResult.tender_summary

        setFormData((prev) => ({
          ...prev,
          title: summary.title || prev.title,
          organization: summary.entity || prev.organization,
          deadline: summary.closing_date || prev.deadline,
          value: prev.value,
          description: summary.description || prev.description,
        }))
        console.log("[v0] Form auto-filled from AI analysis")
        toast({
          title: "✅ Analysis Complete",
          description: "Tender details have been automatically extracted. Review and edit as needed.",
        })
      }
    } catch (error) {
      console.error("[v0] PDF processing error:", error)
      console.error("[v0] Error details:", {
        name: error instanceof Error ? error.name : "Unknown",
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : "No stack",
      })

      const errorMessage = error instanceof Error ? error.message : String(error)
      if (errorMessage.includes("Worker") || errorMessage.includes("worker")) {
        setAnalysisError(
          "PDF processing library failed to load. Please try refreshing the page or fill in details manually.",
        )
      } else if (errorMessage.includes("Invalid PDF")) {
        setAnalysisError("Invalid or corrupted PDF file. Please try a different file or fill in details manually.")
      } else {
        setAnalysisError("Could not extract text from PDF. The document might be scanned or image-based.")
      }

      toast({
        title: "Extraction Failed",
        description: "Fill in the tender details manually. Your PDF is uploaded and will be saved.",
        variant: "destructive",
      })
    } finally {
      setAnalyzing(false)
      console.log("[v0] PDF processing completed")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] Form submitted")
    console.log("[v0] Form data:", formData)
    console.log("[v0] Uploaded file:", uploadedFile?.name)
    console.log("[v0] Analysis:", analysis ? "exists" : "null")

    setLoading(true)

    try {
      console.log("[v0] Calling createCustomTender...")

      const result = await createCustomTender({
        title: formData.title,
        organization: formData.organization,
        deadline: formData.deadline,
        value: formData.value,
        description: formData.description,
        uploadedFile: uploadedFile || undefined,
        analysis: analysis || undefined,
      })

      console.log("[v0] createCustomTender result:", result)

      if (result.success) {
        let description = "Your custom tender has been added to My Tenders with status 'in-progress'"

        if (result.documentError) {
          description += `\n\nDocument Error: ${result.documentError}`
        } else if (result.documentSaved) {
          description += "\n\nDocument uploaded successfully"
        }

        if (result.analysisError) {
          description += `\n\nAnalysis Error: ${result.analysisError}`
        } else if (result.analysisSaved) {
          description += "\n\nAnalysis saved successfully"
        }

        toast({
          title: "Tender Created",
          description,
        })

        console.log("[v0] Tender created with ID:", result.tenderId)
        console.log("[v0] Document saved:", result.documentSaved)
        console.log("[v0] Analysis saved:", result.analysisSaved)

        router.push(`/dashboard/custom-tenders/${result.tenderId}`)
      } else {
        console.error("[v0] Tender creation failed:", result.error)
        toast({
          title: "Error",
          description: result.error || "Failed to create tender",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("[v0] Exception in handleSubmit:", error)
      toast({
        title: "Error",
        description: "Failed to create tender: " + (error as Error).message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
      console.log("[v0] Form submission completed")
    }
  }

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/tenders">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Create New Tender</h1>
          <p className="text-muted-foreground">Add a new tender to track and manage</p>
        </div>
      </div>

      <Card className="border-border max-w-3xl">
        <CardHeader>
          <CardTitle>Upload Tender Document</CardTitle>
          <CardDescription>Upload a PDF tender document for automatic analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
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

            {analyzing && (
              <Alert>
                <Loader2 className="h-4 w-4 animate-spin" />
                <AlertDescription>Analyzing tender document...</AlertDescription>
              </Alert>
            )}

            {analysisError && !paymentRequired && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{analysisError}</AlertDescription>
              </Alert>
            )}

            {paymentRequired && (
              <Alert variant="destructive" className="border-orange-500/50 bg-orange-500/10">
                <CreditCard className="h-4 w-4 text-orange-500" />
                <AlertDescription className="text-orange-500">
                  <div className="space-y-2">
                    <p className="font-semibold">Payment Method Required</p>
                    <p className="text-sm">{analysisError}</p>
                    {dashboardUrl && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="mt-2 border-orange-500 text-orange-500 hover:bg-orange-500/10 bg-transparent"
                        asChild
                      >
                        <a href={dashboardUrl} target="_blank" rel="noopener noreferrer">
                          Add Payment Method
                        </a>
                      </Button>
                    )}
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {analysis && (
              <Alert className="border-green-500/50 bg-green-500/10">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <AlertDescription className="text-green-500">
                  Document analyzed successfully! Review the insights below.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>

      {analysis && (
        <Card className="border-border max-w-3xl">
          <CardHeader>
            <CardTitle>AI Analysis Results</CardTitle>
            <CardDescription>Review the extracted information from your tender document</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="summary" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="summary">Summary</TabsTrigger>
                <TabsTrigger value="requirements">Requirements</TabsTrigger>
                <TabsTrigger value="tips">Tips</TabsTrigger>
              </TabsList>

              <TabsContent value="summary" className="space-y-4 mt-4">
                <div>
                  <h3 className="font-semibold mb-2">Executive Summary</h3>
                  <p className="text-sm text-muted-foreground">
                    {analysis.tender_summary?.description || "No summary available"}
                  </p>
                </div>

                {analysis.action_plan?.critical_dates && analysis.action_plan.critical_dates.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2">Important Deadlines</h3>
                    <ul className="space-y-1">
                      {analysis.action_plan.critical_dates.map((deadline, i) => (
                        <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          {deadline.date} - {deadline.event}
                          {deadline.time && ` at ${deadline.time}`}
                          {deadline.location && ` (${deadline.location})`}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {analysis.evaluation?.criteria && analysis.evaluation.criteria.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2">Evaluation Criteria</h3>
                    <ul className="space-y-1">
                      {analysis.evaluation.criteria.map((criteria, i) => (
                        <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          {criteria.criterion} ({criteria.weight})
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="requirements" className="space-y-4 mt-4">
                {analysis.compliance_summary?.requirements && analysis.compliance_summary.requirements.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2">Key Requirements</h3>
                    <ul className="space-y-2">
                      {analysis.compliance_summary.requirements.map((req, i) => (
                        <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {analysis.compliance_summary?.disqualifiers && analysis.compliance_summary.disqualifiers.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2 text-red-500">Disqualifiers (Must Avoid)</h3>
                    <ul className="space-y-2">
                      {analysis.compliance_summary.disqualifiers.map((item, i) => (
                        <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                          <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="tips" className="space-y-4 mt-4">
                {analysis.compliance_summary?.strengtheners && analysis.compliance_summary.strengtheners.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2">Strategic Recommendations</h3>
                    <ul className="space-y-3">
                      {analysis.compliance_summary.strengtheners.map((rec, i) => (
                        <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-primary font-bold mt-0.5 flex-shrink-0">{i + 1}.</span>
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {analysis.action_plan?.preparation_tasks && analysis.action_plan.preparation_tasks.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2 mt-4">Preparation Tasks</h3>
                    <ul className="space-y-3">
                      {analysis.action_plan.preparation_tasks
                        .sort((a, b) => {
                          const priorityOrder = { high: 0, medium: 1, low: 2 }
                          return (
                            priorityOrder[a.priority.toLowerCase() as keyof typeof priorityOrder] -
                            priorityOrder[b.priority.toLowerCase() as keyof typeof priorityOrder]
                          )
                        })
                        .map((task, i) => (
                          <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                            <span
                              className={`text-xs font-bold mt-0.5 flex-shrink-0 px-2 py-0.5 rounded ${
                                task.priority.toLowerCase() === "high"
                                  ? "bg-red-500/20 text-red-500"
                                  : task.priority.toLowerCase() === "medium"
                                    ? "bg-yellow-500/20 text-yellow-500"
                                    : "bg-blue-500/20 text-blue-500"
                              }`}
                            >
                              {task.priority}
                            </span>
                            <span>
                              {task.task}
                              {task.deadline && ` (Due: ${task.deadline})`}
                            </span>
                          </li>
                        ))}
                    </ul>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      <Card className="border-border max-w-3xl">
        <CardHeader>
          <CardTitle>Tender Details</CardTitle>
          <CardDescription>Enter the basic information about the tender</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Tender Title</Label>
              <Input
                id="title"
                placeholder="e.g., Medical Supplies Procurement"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="organization">Organization</Label>
              <Input
                id="organization"
                placeholder="e.g., Department of Health"
                value={formData.organization}
                onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="deadline">Deadline</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="value">Tender Value (ZAR)</Label>
                <Input
                  id="value"
                  placeholder="e.g., R 2,500,000 or 2500000"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Provide a brief description of the tender..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={5}
                required
              />
            </div>

            <div className="flex gap-3">
              <Button type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create Tender"}
              </Button>
              <Button type="button" variant="outline" asChild className="bg-transparent">
                <Link href="/dashboard/tenders">Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
