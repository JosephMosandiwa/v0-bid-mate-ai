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

type AnalysisResult = {
  tenderMetadata?: {
    title?: string
    organization?: string
    deadline?: string
    value?: string
    category?: string
    location?: string
  }
  summary: string
  keyRequirements: string[]
  deadlines: string[]
  evaluationCriteria: string[]
  recommendations: string[]
  complianceChecklist: string[]
}

type ErrorResponse = {
  error: string
  errorType?: string
  dashboardUrl?: string
}

export default function NewTenderPage() {
  const router = useRouter()
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

    try {
      const formData = new FormData()
      formData.append("file", file)

      const extractResponse = await fetch("/api/extract-pdf", {
        method: "POST",
        body: formData,
      })

      if (!extractResponse.ok) {
        throw new Error("Failed to extract text from PDF")
      }

      const { text } = await extractResponse.json()

      const analyzeResponse = await fetch("/api/analyze-tender", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentText: text }),
      })

      if (!analyzeResponse.ok) {
        const errorData: ErrorResponse = await analyzeResponse.json()

        if (errorData.errorType === "payment_required") {
          setPaymentRequired(true)
          setDashboardUrl(errorData.dashboardUrl || "https://vercel.com/dashboard/ai")
          setAnalysisError(errorData.error)
        } else {
          setAnalysisError(errorData.error || "Failed to analyze document")
        }
        return
      }

      const analysisResult = await analyzeResponse.json()
      setAnalysis(analysisResult)

      console.log("[v0] Analysis result:", analysisResult)
      console.log("[v0] Tender metadata:", analysisResult.tenderMetadata)

      if (analysisResult.tenderMetadata) {
        const metadata = analysisResult.tenderMetadata

        setFormData((prev) => ({
          ...prev,
          title: metadata.title || prev.title,
          organization: metadata.organization || prev.organization,
          deadline: metadata.deadline || prev.deadline,
          value: metadata.value || prev.value,
          description: analysisResult.summary || prev.description,
        }))

        console.log("[v0] Form auto-filled with metadata:", {
          title: metadata.title,
          organization: metadata.organization,
          deadline: metadata.deadline,
          value: metadata.value,
        })
      } else {
        // Fallback to old behavior if no metadata
        if (analysisResult.deadlines.length > 0) {
          const deadlineText = analysisResult.deadlines[0]
          const dateMatch = deadlineText.match(/\d{4}-\d{2}-\d{2}/)
          if (dateMatch) {
            setFormData((prev) => ({ ...prev, deadline: dateMatch[0] }))
          }
        }

        // Use summary as description
        if (analysisResult.summary) {
          setFormData((prev) => ({ ...prev, description: analysisResult.summary }))
        }
      }
    } catch (error) {
      console.error("[v0] PDF analysis error:", error)
      setAnalysisError("Failed to analyze the document. Please try again.")
    } finally {
      setAnalyzing(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    setTimeout(() => {
      router.push("/dashboard/tenders")
    }, 1000)
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
                  <p className="text-sm text-muted-foreground">{analysis.summary}</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Important Deadlines</h3>
                  <ul className="space-y-1">
                    {analysis.deadlines.map((deadline, i) => (
                      <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        {deadline}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Evaluation Criteria</h3>
                  <ul className="space-y-1">
                    {analysis.evaluationCriteria.map((criteria, i) => (
                      <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        {criteria}
                      </li>
                    ))}
                  </ul>
                </div>
              </TabsContent>

              <TabsContent value="requirements" className="space-y-4 mt-4">
                <div>
                  <h3 className="font-semibold mb-2">Key Requirements</h3>
                  <ul className="space-y-2">
                    {analysis.keyRequirements.map((req, i) => (
                      <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Compliance Checklist</h3>
                  <ul className="space-y-2">
                    {analysis.complianceChecklist.map((item, i) => (
                      <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </TabsContent>

              <TabsContent value="tips" className="space-y-4 mt-4">
                <div>
                  <h3 className="font-semibold mb-2">Strategic Recommendations</h3>
                  <ul className="space-y-3">
                    {analysis.recommendations.map((rec, i) => (
                      <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-primary font-bold mt-0.5 flex-shrink-0">{i + 1}.</span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
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
