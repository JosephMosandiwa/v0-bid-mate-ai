"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  ArrowLeft,
  Building2,
  Calendar,
  DollarSign,
  FileText,
  Sparkles,
  Download,
  Upload,
  Trash2,
  Loader2,
  Send,
  Bot,
  CheckCircle2,
  AlertCircle,
  Clock,
} from "lucide-react"
import Link from "next/link"
import {
  uploadTenderDocument,
  getTenderDocuments,
  downloadTenderDocument,
  deleteTenderDocument,
  analyzeDocument,
} from "@/app/actions/document-actions"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"

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
  const [documents, setDocuments] = useState<any[]>([])
  const [uploading, setUploading] = useState(false)
  const [analyzing, setAnalyzing] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [chatInput, setChatInput] = useState("")

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/ai-assistant",
      body: {
        tenderContext: {
          title: "Medical Supplies Procurement",
          organization: "Department of Health",
          description:
            "Procurement of medical supplies including surgical equipment, pharmaceuticals, and protective gear for provincial hospitals.",
        },
      },
    }),
  })

  useEffect(() => {
    loadDocuments()
  }, [id])

  const loadDocuments = async () => {
    const result = await getTenderDocuments(id)
    if (result.success) {
      setDocuments(result.documents)
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
        const errorData = await extractResponse.json()
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

      if (!analyzeResponse.ok) {
        const errorData = await analyzeResponse.json()
        console.error("[v0] Analysis API failed:", errorData)
        throw new Error(errorData.error || "Failed to analyze document")
      }

      const analysis = await analyzeResponse.json()
      console.log("[v0] Analysis received:", analysis)

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

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/tenders">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-3xl font-bold text-foreground">Medical Supplies Procurement</h1>
            <Badge className="bg-accent/10 text-accent">In Progress</Badge>
          </div>
          <div className="flex items-center gap-4 text-muted-foreground flex-wrap">
            <span className="flex items-center gap-1">
              <Building2 className="h-4 w-4" />
              Department of Health
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              Deadline: Feb 15, 2025
            </span>
            <span className="flex items-center gap-1">
              <DollarSign className="h-4 w-4" />R 2,500,000
            </span>
          </div>
        </div>
        <Button>Edit Tender</Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="ai-insights">AI Insights</TabsTrigger>
          <TabsTrigger value="ai-assistant">AI Assistant</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                Procurement of medical supplies including surgical equipment, pharmaceuticals, and protective gear for
                provincial hospitals.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <CardTitle>Requirements</CardTitle>
              <CardDescription>Key requirements for this tender</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {mockTender.requirements.map((req, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2" />
                    <span className="text-muted-foreground">{req}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-6">
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Tender Documents</CardTitle>
              <CardDescription>Upload and manage documents for this tender</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {documents.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No documents uploaded yet</p>
                  </div>
                ) : (
                  documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-4 rounded-lg border border-border hover:border-primary transition-colors"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-foreground">{doc.file_name}</p>
                          <p className="text-sm text-muted-foreground">
                            {(doc.file_size / 1024 / 1024).toFixed(2)} MB •{" "}
                            {new Date(doc.created_at).toLocaleDateString()}
                            {doc.ai_analysis && (
                              <span className="ml-2 text-primary">
                                <Sparkles className="h-3 w-3 inline mr-1" />
                                Analyzed
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {!doc.ai_analysis && doc.file_type === "application/pdf" && (
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={async () => {
                              setAnalyzing(doc.id)
                              try {
                                // Download the file first
                                const downloadResult = await downloadTenderDocument(doc.id)
                                if (!downloadResult.success || !downloadResult.url) {
                                  throw new Error("Failed to download document")
                                }

                                // Fetch the file from the signed URL
                                const fileResponse = await fetch(downloadResult.url)
                                const blob = await fileResponse.blob()
                                const file = new File([blob], doc.file_name, { type: doc.file_type })

                                // Analyze the file
                                await handleAnalyzeDocument(doc.id, file)
                              } catch (error: any) {
                                console.error("[v0] Error:", error)
                                alert(error.message || "Failed to analyze document")
                                setAnalyzing(null)
                              }
                            }}
                            disabled={analyzing === doc.id}
                          >
                            {analyzing === doc.id ? (
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            ) : (
                              <Sparkles className="h-4 w-4" />
                            )}
                          </Button>
                        )}
                        <Button variant="outline" size="icon" onClick={() => handleDownload(doc.id)}>
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => handleDelete(doc.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="mt-4">
                <Input
                  type="file"
                  accept=".pdf,.doc,.docx,.xls,.xlsx"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  className="hidden"
                  id="file-upload"
                />
                <Button asChild className="w-full bg-transparent" variant="outline" disabled={uploading}>
                  <label htmlFor="file-upload" className="cursor-pointer">
                    {uploading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Document
                      </>
                    )}
                  </label>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai-insights" className="space-y-6">
          <Card className="border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    AI Document Analysis
                  </CardTitle>
                  <CardDescription>
                    Analyze tender documents to extract requirements, deadlines, and actionable tasks
                  </CardDescription>
                </div>
                <Badge variant="outline">
                  {documents.filter((doc) => doc.ai_analysis).length} / {documents.length} Analyzed
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {documents.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No Documents Yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Upload or add tender documents to get AI-powered insights
                  </p>
                  <Button asChild>
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Document
                    </label>
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {documents.map((doc) => (
                    <div key={doc.id} className="space-y-4">
                      {/* Document Header */}
                      <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-muted/30">
                        <div className="flex items-center gap-3 flex-1">
                          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <FileText className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-foreground">{doc.file_name}</p>
                            <p className="text-sm text-muted-foreground">
                              {(doc.file_size / 1024 / 1024).toFixed(2)} MB •{" "}
                              {new Date(doc.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {doc.ai_analysis ? (
                            <Badge className="bg-primary/10 text-primary">
                              <Sparkles className="h-3 w-3 mr-1" />
                              Analyzed
                            </Badge>
                          ) : (
                            <Button
                              onClick={() => handleAnalyzeFromInsights(doc)}
                              disabled={analyzing === doc.id}
                              size="sm"
                            >
                              {analyzing === doc.id ? (
                                <>
                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                  Analyzing...
                                </>
                              ) : (
                                <>
                                  <Sparkles className="h-4 w-4 mr-2" />
                                  Analyze Document
                                </>
                              )}
                            </Button>
                          )}
                        </div>
                      </div>

                      {/* Analysis Results */}
                      {doc.ai_analysis && (
                        <div className="space-y-4 pl-4 border-l-2 border-primary/20">
                          {/* Summary */}
                          <Card className="border-border bg-primary/5">
                            <CardHeader>
                              <CardTitle className="text-base">Summary</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="text-muted-foreground leading-relaxed">{doc.ai_analysis.summary}</p>
                            </CardContent>
                          </Card>

                          {/* Actionable Tasks */}
                          {doc.ai_analysis.actionableTasks && doc.ai_analysis.actionableTasks.length > 0 && (
                            <Card className="border-border">
                              <CardHeader>
                                <CardTitle className="text-base flex items-center gap-2">
                                  <CheckCircle2 className="h-5 w-5 text-primary" />
                                  Actionable Tasks
                                </CardTitle>
                                <CardDescription>
                                  Tasks extracted from the document that need to be completed
                                </CardDescription>
                              </CardHeader>
                              <CardContent>
                                <div className="space-y-3">
                                  {doc.ai_analysis.actionableTasks.map((task: any, idx: number) => (
                                    <div
                                      key={idx}
                                      className="flex items-start gap-3 p-3 rounded-lg border border-border hover:border-primary/50 transition-colors"
                                    >
                                      <div className="mt-0.5">{getPriorityIcon(task.priority)}</div>
                                      <div className="flex-1 space-y-1">
                                        <p className="font-medium text-foreground">{task.task}</p>
                                        <div className="flex items-center gap-2 flex-wrap">
                                          <Badge variant="outline" className={getPriorityColor(task.priority)}>
                                            {task.priority} priority
                                          </Badge>
                                          <Badge variant="outline" className="text-xs">
                                            {task.category}
                                          </Badge>
                                          {task.deadline && (
                                            <Badge variant="outline" className="text-xs">
                                              <Calendar className="h-3 w-3 mr-1" />
                                              {task.deadline}
                                            </Badge>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </CardContent>
                            </Card>
                          )}

                          {/* Key Requirements */}
                          {doc.ai_analysis.keyRequirements && doc.ai_analysis.keyRequirements.length > 0 && (
                            <Card className="border-border">
                              <CardHeader>
                                <CardTitle className="text-base">Key Requirements</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <ul className="space-y-2">
                                  {doc.ai_analysis.keyRequirements.map((req: string, idx: number) => (
                                    <li key={idx} className="flex items-start gap-2">
                                      <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                                      <span className="text-muted-foreground">{req}</span>
                                    </li>
                                  ))}
                                </ul>
                              </CardContent>
                            </Card>
                          )}

                          {/* Deadlines */}
                          {doc.ai_analysis.deadlines && doc.ai_analysis.deadlines.length > 0 && (
                            <Card className="border-border">
                              <CardHeader>
                                <CardTitle className="text-base flex items-center gap-2">
                                  <Calendar className="h-5 w-5" />
                                  Important Deadlines
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <ul className="space-y-2">
                                  {doc.ai_analysis.deadlines.map((deadline: string, idx: number) => (
                                    <li key={idx} className="flex items-start gap-2">
                                      <Clock className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                                      <span className="text-muted-foreground">{deadline}</span>
                                    </li>
                                  ))}
                                </ul>
                              </CardContent>
                            </Card>
                          )}

                          {/* Recommendations */}
                          {doc.ai_analysis.recommendations && doc.ai_analysis.recommendations.length > 0 && (
                            <Card className="border-border">
                              <CardHeader>
                                <CardTitle className="text-base">Recommendations</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <ul className="space-y-2">
                                  {doc.ai_analysis.recommendations.map((rec: string, idx: number) => (
                                    <li key={idx} className="flex items-start gap-2">
                                      <Sparkles className="h-4 w-4 text-secondary mt-0.5 flex-shrink-0" />
                                      <span className="text-muted-foreground">{rec}</span>
                                    </li>
                                  ))}
                                </ul>
                              </CardContent>
                            </Card>
                          )}

                          {/* Compliance Checklist */}
                          {doc.ai_analysis.complianceChecklist && doc.ai_analysis.complianceChecklist.length > 0 && (
                            <Card className="border-border">
                              <CardHeader>
                                <CardTitle className="text-base">Compliance Checklist</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <ul className="space-y-2">
                                  {doc.ai_analysis.complianceChecklist.map((item: string, idx: number) => (
                                    <li key={idx} className="flex items-start gap-2">
                                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                      <span className="text-muted-foreground">{item}</span>
                                    </li>
                                  ))}
                                </ul>
                              </CardContent>
                            </Card>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai-assistant" className="space-y-6">
          <Card className="border-border">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-primary" />
                <CardTitle>AI Tender Assistant</CardTitle>
              </div>
              <CardDescription>Ask questions about the tender or get help filling it out</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-4">
                    {messages.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <Bot className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p>Ask me anything about this tender!</p>
                        <p className="text-sm mt-2">
                          I can help you understand requirements, suggest improvements, and guide you through the
                          process.
                        </p>
                      </div>
                    ) : (
                      messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[80%] rounded-lg p-4 ${
                              message.role === "user"
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-foreground"
                            }`}
                          >
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">
                              {message.parts?.map((part: any) => (part.type === "text" ? part.text : "")).join("") ||
                                message.content}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                    {status === "in_progress" && (
                      <div className="flex gap-3 justify-start">
                        <div className="bg-muted text-foreground rounded-lg p-4">
                          <Loader2 className="h-4 w-4 animate-spin" />
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>

                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    if (chatInput.trim()) {
                      sendMessage({ text: chatInput })
                      setChatInput("")
                    }
                  }}
                  className="flex gap-2"
                >
                  <Textarea
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Ask about requirements, deadlines, or how to fill out sections..."
                    className="min-h-[60px] resize-none"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        if (chatInput.trim()) {
                          sendMessage({ text: chatInput })
                          setChatInput("")
                        }
                      }
                    }}
                  />
                  <Button type="submit" size="icon" disabled={status === "in_progress" || !chatInput.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
