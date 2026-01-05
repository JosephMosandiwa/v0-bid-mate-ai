"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  ArrowLeft,
  Building2,
  Calendar,
  FileText,
  Sparkles,
  Download,
  Upload,
  Trash2,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Clock,
  ClipboardList,
} from "lucide-react"
import Link from "next/link"
import {
  uploadTenderDocument,
  getTenderDocuments,
  downloadTenderDocument,
  deleteTenderDocument,
  analyzeDocument,
} from "@/app/actions/document-actions"
import { DynamicTenderForm } from "@/components/dynamic-tender-form"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "@/lib/providers"
import { Input } from "@/components/ui/input"
import { TenderContextStrategistPanel } from "@/components/strategist/tender-context-panel"

// Mock data - will be replaced with database queries
const mockTender = {
  id: "1",
  title: "Medical Supplies Procurement",
  organization: "Department of Health",
  status: "in-progress",
  deadline: "2025-02-15",
  value: "R 2,500,000",
  analyzed: true,
  createdAt: "2025-01-05",
  description:
    "Procurement of medical supplies including surgical equipment, pharmaceuticals, and protective gear for provincial hospitals.",
  requirements: [
    "Valid tax clearance certificate",
    "BEE Level 2 or higher",
    "Minimum 5 years experience in medical supply",
    "ISO 9001 certification",
  ],
  documents: [
    {
      id: "1",
      file_name: "Tender Document.pdf",
      file_size: 2500000,
      file_type: "application/pdf",
      created_at: "2025-01-05",
      ai_analysis: {
        summary: "AI Analysis Summary",
        keyRequirements: ["Key Requirement 1", "Key Requirement 2"],
        recommendations: ["Recommendation 1", "Recommendation 2"],
        actionableTasks: [
          { task: "Task 1", priority: "high", category: "Category 1", deadline: "2025-01-10" },
          { task: "Task 2", priority: "medium", category: "Category 2", deadline: "2025-01-15" },
        ],
        deadlines: ["Deadline 1", "Deadline 2"],
        complianceChecklist: ["Item 1", "Item 2"],
      },
    },
    {
      id: "2",
      file_name: "Company Profile.pdf",
      file_size: 1200000,
      file_type: "application/pdf",
      created_at: "2025-01-06",
      ai_analysis: null,
    },
    {
      id: "3",
      file_name: "Tax Clearance.pdf",
      file_size: 800000,
      file_type: "application/pdf",
      created_at: "2025-01-06",
      ai_analysis: null,
    },
  ],
}

export default function TenderDetailPage() {
  const params = useParams()
  const id = params.id as string
  const router = useRouter()

  const [tender, setTender] = useState<any>(null)
  const [documents, setDocuments] = useState<any[]>([])
  const [analysis, setAnalysis] = useState<any>(null)
  const [uploading, setUploading] = useState(false)
  const [analyzing, setAnalyzing] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [chatInput, setChatInput] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null) // Declare setSelectedFile variable

  useEffect(() => {
    loadTenderData()
    loadDocuments()
  }, [id])

  const loadTenderData = async () => {
    try {
      // Fetch tender and analysis from database
      const response = await fetch(`/api/tenders/scraped/${id}`)
      if (response.ok) {
        const data = await response.json()
        setTender(data.tender)
        setAnalysis(data.analysis)
      }
    } catch (error) {
      console.error("[v0] Error loading tender:", error)
    } finally {
      setLoading(false)
    }
  }

  const loadDocuments = async () => {
    const result = await getTenderDocuments(id)
    if (result.success) {
      setDocuments(result.documents || [])
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setSelectedFile(file)
    setUploading(true)

    const formData = new FormData()
    formData.append("file", file)
    formData.append("userTenderId", id)

    const result = await uploadTenderDocument(formData)

    if (result.success) {
      await loadDocuments()
      setSelectedFile(null)
      e.target.value = ""

      // Auto-analyze PDF documents
      if (file.type === "application/pdf") {
        await handleAnalyzeDocument(result.data.id, file)
      }
    } else {
      alert(result.error || "Failed to upload document")
    }

    setUploading(false)
  }

  const handleDownload = async (documentId: string) => {
    const result = await downloadTenderDocument(documentId)
    if (result.success && result.url) {
      window.open(result.url, "_blank")
    } else {
      alert(result.error || "Failed to download document")
    }
  }

  const handleDelete = async (documentId: string) => {
    if (!confirm("Are you sure you want to delete this document?")) return

    const result = await deleteTenderDocument(documentId)
    if (result.success) {
      await loadDocuments()
    } else {
      alert(result.error || "Failed to delete document")
    }
  }

  const handleAnalyzeDocument = async (documentId: string, file: File) => {
    setAnalyzing(documentId)

    try {
      console.log("[v0] Starting document analysis for:", file.name, "Type:", file.type, "Size:", file.size)

      // Extract text from PDF using the API
      const formData = new FormData()
      formData.append("file", file)

      console.log("[v0] Sending PDF to extraction API...")
      const extractResponse = await fetch("/api/extract-pdf", {
        method: "POST",
        body: formData,
      })

      console.log("[v0] Extract API response status:", extractResponse.status)

      if (!extractResponse.ok) {
        let errorData
        try {
          errorData = await extractResponse.json()
        } catch {
          errorData = { error: `HTTP ${extractResponse.status}: ${extractResponse.statusText}` }
        }
        console.error("[v0] PDF extraction failed:", errorData)
        throw new Error(errorData.error || "Failed to extract text from PDF")
      }

      const { text } = await extractResponse.json()
      console.log("[v0] Extracted text length:", text.length)
      console.log("[v0] Text preview:", text.substring(0, 200))

      if (!text || text.length < 50) {
        throw new Error("Could not extract sufficient text from PDF. Please ensure the PDF contains searchable text.")
      }

      console.log("[v0] Sending text to analysis API...")
      const analyzeResponse = await fetch("/api/analyze-tender", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ documentText: text }),
      })

      console.log("[v0] Analyze API response status:", analyzeResponse.status)
      console.log("[v0] Analyze API response headers:", Object.fromEntries(analyzeResponse.headers.entries()))

      const responseClone = analyzeResponse.clone()

      if (!analyzeResponse.ok) {
        let errorData
        try {
          errorData = await analyzeResponse.json()
        } catch (jsonError) {
          console.error("[v0] Failed to parse error response as JSON:", jsonError)
          const responseText = await responseClone.text()
          console.error("[v0] Error response body:", responseText)
          errorData = { error: `HTTP ${analyzeResponse.status}: ${analyzeResponse.statusText}` }
        }
        console.error("[v0] Analysis API failed:", errorData)
        throw new Error(errorData.error || "Failed to analyze document")
      }

      let analysis
      try {
        const contentType = analyzeResponse.headers.get("content-type")
        console.log("[v0] Response content-type:", contentType)

        if (!contentType || !contentType.includes("application/json")) {
          const responseText = await responseClone.text()
          console.error("[v0] Response is not JSON. Content-Type:", contentType)
          console.error("[v0] Response body:", responseText)
          throw new Error("Server returned non-JSON response. Expected JSON but got: " + contentType)
        }

        analysis = await analyzeResponse.json()
        console.log("[v0] Analysis received:", analysis)
      } catch (jsonError) {
        console.error("[v0] Failed to parse analysis response as JSON:", jsonError)
        try {
          const responseText = await responseClone.text()
          console.error("[v0] Response body was:", responseText)
        } catch (textError) {
          console.error("[v0] Could not read response body:", textError)
        }
        throw new Error("Failed to parse analysis response. The server returned invalid JSON.")
      }

      const result = await analyzeDocument(documentId, analysis)
      console.log("[v0] Save result:", result)

      if (result.success) {
        await loadDocuments()
        alert("Document analyzed successfully!")
      } else {
        console.error("[v0] Failed to save analysis:", result.error)
        throw new Error(result.error || "Failed to save analysis")
      }
    } catch (error: any) {
      console.error("[v0] Error analyzing document:", error)
      alert(error.message || "Failed to analyze document")
    } finally {
      setAnalyzing(null)
    }
  }

  const handleAnalyzeFromInsights = async (doc: any) => {
    setAnalyzing(doc.id)
    try {
      console.log("[v0] Analyzing document from insights:", doc.file_name)
      console.log("[v0] Storage path:", doc.storage_path)
      console.log("[v0] File type:", doc.file_type)

      // Check if it's an external document or uploaded document
      const isExternalUrl = doc.storage_path.startsWith("http://") || doc.storage_path.startsWith("https://")

      if (isExternalUrl) {
        console.log("[v0] Fetching external document via proxy:", doc.storage_path)

        const proxyResponse = await fetch("/api/proxy-document", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ url: doc.storage_path }),
        })

        console.log("[v0] Proxy response status:", proxyResponse.status)

        if (!proxyResponse.ok) {
          const error = await proxyResponse.json()
          console.error("[v0] Proxy failed:", error)
          throw new Error(error.error || "Failed to fetch external document")
        }

        const { data, type } = await proxyResponse.json()
        console.log("[v0] Received document from proxy, type:", type, "data length:", data.length)

        // Convert base64 back to blob
        const binaryString = atob(data)
        const bytes = new Uint8Array(binaryString.length)
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i)
        }
        const blob = new Blob([bytes], { type })
        const file = new File([blob], doc.file_name, { type })

        console.log("[v0] Created file from blob:", file.name, file.size, file.type)
        await handleAnalyzeDocument(doc.id, file)
      } else {
        // For uploaded documents, download from Supabase Storage
        console.log("[v0] Downloading uploaded document from Supabase")
        const downloadResult = await downloadTenderDocument(doc.id)

        if (!downloadResult.success || !downloadResult.url) {
          console.error("[v0] Download failed:", downloadResult.error)
          throw new Error(downloadResult.error || "Failed to download document")
        }

        console.log("[v0] Download URL obtained, fetching file...")
        const fileResponse = await fetch(downloadResult.url)

        if (!fileResponse.ok) {
          throw new Error(`Failed to fetch file: ${fileResponse.statusText}`)
        }

        const blob = await fileResponse.blob()
        const file = new File([blob], doc.file_name, { type: doc.file_type })

        console.log("[v0] File downloaded:", file.name, file.size, file.type)
        await handleAnalyzeDocument(doc.id, file)
      }
    } catch (error: any) {
      console.error("[v0] Error in handleAnalyzeFromInsights:", error)
      alert(error.message || "Failed to analyze document")
      setAnalyzing(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-muted text-muted-foreground"
      case "in-progress":
        return "bg-accent/10 text-accent"
      case "submitted":
        return "bg-secondary/10 text-secondary"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500/10 text-red-500 border-red-500/20"
      case "medium":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
      case "low":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high":
        return <AlertCircle className="h-4 w-4" />
      case "medium":
        return <Clock className="h-4 w-4" />
      case "low":
        return <CheckCircle2 className="h-4 w-4" />
      default:
        return null
    }
  }

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/ai-assistant",
      body: {
        tenderContext: {
          title: tender?.title || "Tender",
          organization: tender?.source_name,
          description: tender?.description,
        },
      },
    }),
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!tender) {
    return (
      <div className="p-6 md:p-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Tender not found</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-4 md:space-y-6">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Content */}
        <div className="flex-1 space-y-4 md:space-y-6">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <Button variant="ghost" size="icon" asChild>
                <Link href="/dashboard/tenders">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                {analysis?.tender_summary?.title || tender.title || "Tender"}
              </h1>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge className="bg-primary/10 text-primary">Scraped</Badge>
              {tender.category && <Badge variant="outline">{tender.category}</Badge>}
              {analysis && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  AI Analyzed
                </Badge>
              )}
            </div>
            {(analysis?.tender_summary?.description || tender.description) && (
              <p className="text-muted-foreground mb-4">
                {analysis?.tender_summary?.description || tender.description}
              </p>
            )}
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              {(analysis?.tender_summary?.entity || tender.source_name) && (
                <span className="flex items-center gap-1">
                  <Building2 className="h-4 w-4" />
                  {analysis?.tender_summary?.entity || tender.source_name}
                </span>
              )}
              {(analysis?.tender_summary?.closing_date || tender.close_date) && (
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  Closes: {new Date(analysis?.tender_summary?.closing_date || tender.close_date).toLocaleDateString()}
                </span>
              )}
              {tender.estimated_value && (
                <span className="flex items-center gap-1">
                  <span>Value: {tender.estimated_value}</span>
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

          <Tabs defaultValue="overview" className="space-y-4 md:space-y-6">
            <TabsList>
              <TabsTrigger value="overview">
                <FileText className="h-4 w-4 mr-2" />
                Overview
              </TabsTrigger>
              {analysis?.action_plan && (
                <TabsTrigger value="action-plan">
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Action Plan
                </TabsTrigger>
              )}
              {analysis && (
                <TabsTrigger value="analysis">
                  <Sparkles className="h-4 w-4 mr-2" />
                  AI Insights
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

            <TabsContent value="overview" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Tender Information</CardTitle>
                  <CardDescription>
                    {analysis ? "Information extracted from tender document" : "Basic tender information"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {analysis?.tender_summary?.tender_number && (
                    <div className="grid grid-cols-[140px_1fr] gap-2 items-start">
                      <span className="text-sm font-medium text-muted-foreground">Tender Number:</span>
                      <span className="text-sm font-mono bg-muted px-2 py-1 rounded">
                        {analysis.tender_summary.tender_number}
                      </span>
                    </div>
                  )}
                  {(analysis?.tender_summary?.title || tender.title) && (
                    <div className="grid grid-cols-[140px_1fr] gap-2 items-start">
                      <span className="text-sm font-medium text-muted-foreground">Title:</span>
                      <span className="text-sm">{analysis?.tender_summary?.title || tender.title}</span>
                    </div>
                  )}
                  {(analysis?.tender_summary?.entity || tender.source_name) && (
                    <div className="grid grid-cols-[140px_1fr] gap-2 items-start">
                      <span className="text-sm font-medium text-muted-foreground">Organization:</span>
                      <span className="text-sm">{analysis?.tender_summary?.entity || tender.source_name}</span>
                    </div>
                  )}
                  {(analysis?.tender_summary?.closing_date || tender.close_date) && (
                    <div className="grid grid-cols-[140px_1fr] gap-2 items-start">
                      <span className="text-sm font-medium text-muted-foreground">Closing Date:</span>
                      <span className="text-sm font-semibold text-orange-600 dark:text-orange-400">
                        {new Date(analysis?.tender_summary?.closing_date || tender.close_date).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  {analysis?.tender_summary?.category && (
                    <div className="grid grid-cols-[140px_1fr] gap-2 items-start">
                      <span className="text-sm font-medium text-muted-foreground">Category:</span>
                      <Badge variant="outline">{analysis.tender_summary.category}</Badge>
                    </div>
                  )}
                  {tender.source_url && (
                    <div className="grid grid-cols-[140px_1fr] gap-2 items-start">
                      <span className="text-sm font-medium text-muted-foreground">Source:</span>
                      <a
                        href={tender.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline truncate"
                      >
                        {tender.source_url}
                      </a>
                    </div>
                  )}
                </CardContent>
              </Card>

              {analysis?.eligibility_requirements && analysis.eligibility_requirements.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                      Eligibility Requirements
                    </CardTitle>
                    <CardDescription>Requirements you must meet to qualify</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {analysis.eligibility_requirements.map((req: string, i: number) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {analysis?.required_documents && analysis.required_documents.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary" />
                      Required Documents
                    </CardTitle>
                    <CardDescription>Documents you need to submit</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="grid gap-2 sm:grid-cols-2">
                      {analysis.required_documents.map((doc: string, i: number) => (
                        <li key={i} className="flex items-start gap-2 text-sm p-2 rounded-lg bg-muted/50">
                          <FileText className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                          <span>{doc}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {analysis?.action_plan && (
              <TabsContent value="action-plan" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>AI-Generated Action Plan</CardTitle>
                    <CardDescription>Step-by-step tasks to complete your bid</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {analysis.action_plan.map((item: any, i: number) => (
                        <div key={i} className="flex items-start gap-3 p-3 rounded-lg border">
                          <div className={`p-1 rounded ${getPriorityColor(item.priority)}`}>
                            {getPriorityIcon(item.priority)}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-sm">{item.task}</p>
                            <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                              <Badge variant="outline" className="text-xs">
                                {item.category}
                              </Badge>
                              {item.deadline && (
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {item.deadline}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            )}

            {analysis && (
              <TabsContent value="analysis" className="space-y-4">
                {analysis.summary && (
                  <Card>
                    <CardHeader>
                      <CardTitle>AI Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{analysis.summary}</p>
                    </CardContent>
                  </Card>
                )}
                {analysis.recommendations && analysis.recommendations.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Recommendations</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {analysis.recommendations.map((rec: string, i: number) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <Sparkles className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            )}

            <TabsContent value="documents" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Tender Documents</CardTitle>
                  <CardDescription>Upload and manage your tender documents</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border-2 border-dashed rounded-lg p-6 text-center">
                    <Input
                      type="file"
                      accept=".pdf,.doc,.docx,.xls,.xlsx"
                      onChange={handleFileUpload}
                      disabled={uploading}
                      className="hidden"
                      id="file-upload"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground mb-1">
                        {uploading ? "Uploading..." : "Click to upload or drag and drop"}
                      </p>
                      <p className="text-xs text-muted-foreground">PDF, DOC, DOCX, XLS, XLSX</p>
                    </label>
                  </div>

                  {documents.length > 0 && (
                    <div className="space-y-2">
                      {documents.map((doc) => (
                        <div key={doc.id} className="flex items-center justify-between p-3 rounded-lg border">
                          <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium">{doc.file_name}</p>
                              <p className="text-xs text-muted-foreground">
                                {(doc.file_size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {doc.ai_analysis && (
                              <Badge variant="secondary" className="text-xs">
                                <Sparkles className="h-3 w-3 mr-1" />
                                Analyzed
                              </Badge>
                            )}
                            {!doc.ai_analysis && doc.file_type === "application/pdf" && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleAnalyzeFromInsights(doc)}
                                disabled={analyzing === doc.id}
                              >
                                {analyzing === doc.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <>
                                    <Sparkles className="h-4 w-4 mr-1" />
                                    Analyze
                                  </>
                                )}
                              </Button>
                            )}
                            <Button size="icon" variant="ghost" onClick={() => handleDownload(doc.id)}>
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button size="icon" variant="ghost" onClick={() => handleDelete(doc.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {analysis?.formFields && analysis.formFields.length > 0 && (
              <TabsContent value="form">
                <DynamicTenderForm formFields={analysis.formFields} tenderId={id} />
              </TabsContent>
            )}
          </Tabs>
        </div>

        <div className="lg:w-80 xl:w-96 flex-shrink-0">
          <div className="lg:sticky lg:top-4">
            <TenderContextStrategistPanel
              tender={{
                id: id,
                title: analysis?.tender_summary?.title || tender.title || "Tender",
                organization: analysis?.tender_summary?.entity || tender.source_name,
                description: analysis?.tender_summary?.description || tender.description,
                deadline: analysis?.tender_summary?.closing_date || tender.close_date,
                value: tender.estimated_value,
                requirements: analysis?.eligibility_requirements || [],
                analysis: analysis,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
