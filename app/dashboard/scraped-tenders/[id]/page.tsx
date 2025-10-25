"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  ArrowLeft,
  Building2,
  Calendar,
  DollarSign,
  FileText,
  Sparkles,
  Download,
  Loader2,
  ExternalLink,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Clock,
  ClipboardList,
} from "lucide-react"
import Link from "next/link"
import { DynamicTenderForm } from "@/components/dynamic-tender-form"

interface ScrapedTender {
  id: string
  title: string
  description: string
  source_name: string
  source_level: string
  source_province?: string
  tender_url: string
  publish_date?: string
  close_date?: string
  estimated_value?: string
  category?: string
  requirements?: string[]
}

interface TenderDocument {
  id: string
  tender_id: string
  document_name: string
  document_type: string
  original_url: string
  blob_url: string
  file_size: number
  created_at: string
}

interface TenderAnalysis {
  summary: string
  keyRequirements: string[]
  deadlines: string[]
  evaluationCriteria: string[]
  recommendations: string[]
  complianceChecklist: string[]
  actionableTasks: {
    task: string
    priority: "high" | "medium" | "low"
    category: string
    deadline: string | null
  }[]
  formFields?: {
    id: string
    label: string
    type: string
    required: boolean
    placeholder?: string
    description?: string
    options?: string[]
    validation?: any
    section?: string
  }[]
}

export default function ScrapedTenderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [tender, setTender] = useState<ScrapedTender | null>(null)
  const [documents, setDocuments] = useState<TenderDocument[]>([])
  const [loading, setLoading] = useState(true)
  const [analyzing, setAnalyzing] = useState<string | null>(null)
  const [analysis, setAnalysis] = useState<TenderAnalysis | null>(null)
  const [analysisLoading, setAnalysisLoading] = useState(false)
  const [analysisError, setAnalysisError] = useState<string | null>(null)
  const [analysisCached, setAnalysisCached] = useState(false)

  const analysisInitiated = useRef(false)

  useEffect(() => {
    loadTenderDetails()
  }, [id])

  useEffect(() => {
    if (documents.length > 0 && !analysis && !analysisLoading && !analysisInitiated.current) {
      analysisInitiated.current = true
      checkAndLoadAnalysis()
    }
  }, [documents, analysis, analysisLoading])

  const loadTenderDetails = async () => {
    try {
      console.log("[v0] Loading tender details for:", id)
      const response = await fetch(`/api/tenders/scraped/${id}`)

      if (!response.ok) {
        throw new Error("Failed to load tender")
      }

      const data = await response.json()
      console.log("[v0] Loaded tender:", data)

      setTender(data.tender)
      setDocuments(data.documents || [])
    } catch (error) {
      console.error("[v0] Error loading tender:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = (doc: TenderDocument) => {
    window.open(doc.blob_url, "_blank")
  }

  const handleAnalyze = async (doc: TenderDocument) => {
    setAnalyzing(doc.id)

    try {
      console.log("[v0] Analyzing document:", doc.document_name)

      const response = await fetch(doc.blob_url)
      if (!response.ok) {
        throw new Error("Failed to fetch document")
      }

      const blob = await response.blob()
      const file = new File([blob], doc.document_name, { type: `application/${doc.document_type}` })

      const formData = new FormData()
      formData.append("file", file)

      const extractResponse = await fetch("/api/extract-pdf", {
        method: "POST",
        body: formData,
      })

      if (!extractResponse.ok) {
        throw new Error("Failed to extract text from document")
      }

      const { text } = await extractResponse.json()

      const analyzeResponse = await fetch("/api/analyze-tender", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentText: text }),
      })

      if (!analyzeResponse.ok) {
        throw new Error("Failed to analyze document")
      }

      const analysis = await analyzeResponse.json()
      console.log("[v0] Analysis complete:", analysis)

      alert("Document analyzed successfully! Analysis: " + JSON.stringify(analysis, null, 2))
    } catch (error: any) {
      console.error("[v0] Error analyzing document:", error)
      alert(error.message || "Failed to analyze document")
    } finally {
      setAnalyzing(null)
    }
  }

  const analyzeAllDocuments = async () => {
    setAnalysisLoading(true)
    setAnalysisError(null)

    try {
      console.log("[v0] Starting automatic analysis of", documents.length, "documents")

      const pdfDocuments = documents.filter((doc) => doc.document_type === "pdf")

      if (pdfDocuments.length === 0) {
        setAnalysisError("No PDF documents available for analysis")
        setAnalysisLoading(false)
        return
      }

      console.log("[v0] Analyzing", pdfDocuments.length, "PDF documents")

      const extractedTexts: string[] = []

      for (const doc of pdfDocuments) {
        try {
          console.log("[v0] Extracting text from:", doc.document_name)

          const response = await fetch(doc.blob_url)
          if (!response.ok) {
            console.warn("[v0] Failed to fetch document:", doc.document_name, response.status)
            continue
          }

          const blob = await response.blob()
          const file = new File([blob], doc.document_name, { type: "application/pdf" })

          const formData = new FormData()
          formData.append("file", file)

          const extractResponse = await fetch("/api/extract-pdf", {
            method: "POST",
            body: formData,
          })

          if (extractResponse.ok) {
            const { text } = await extractResponse.json()
            extractedTexts.push(text)
            console.log("[v0] Extracted", text.length, "characters from", doc.document_name)
          } else {
            const errorData = await extractResponse.json().catch(() => ({ error: "Unknown error" }))
            console.warn("[v0] Failed to extract text from:", doc.document_name, errorData.error)
          }
        } catch (error) {
          console.error("[v0] Error extracting text from", doc.document_name, error)
        }
      }

      if (extractedTexts.length === 0) {
        setAnalysisError("Could not extract text from any documents. The PDFs might be scanned images or encrypted.")
        setAnalysisLoading(false)
        return
      }

      const combinedText = extractedTexts.join("\n\n--- NEXT DOCUMENT ---\n\n")
      console.log("[v0] Combined text length:", combinedText.length, "characters")

      console.log("[v0] Sending combined text to AI for analysis")
      const analyzeResponse = await fetch("/api/analyze-tender", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentText: combinedText }),
      })

      if (!analyzeResponse.ok) {
        const errorData = await analyzeResponse.json().catch(() => ({ error: "Unknown error" }))
        console.error("[v0] Analysis API error:", errorData)

        if (errorData.errorType === "api_key_required") {
          throw new Error(
            "OpenAI API key is missing. Please add your OPENAI_API_KEY in the environment variables (Vars section in the sidebar).",
          )
        } else if (errorData.details) {
          throw new Error(`Analysis failed: ${errorData.details}`)
        } else {
          throw new Error(errorData.error || "Failed to analyze documents")
        }
      }

      const analysisResult = await analyzeResponse.json()
      console.log("[v0] Analysis complete:", analysisResult)

      setAnalysis(analysisResult)
      setAnalysisCached(false)

      console.log("[v0] Saving analysis to database")
      try {
        await fetch(`/api/tenders/scraped/${id}/analysis`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ analysis: analysisResult }),
        })
        console.log("[v0] Analysis saved successfully")
      } catch (saveError) {
        console.error("[v0] Failed to save analysis:", saveError)
      }
    } catch (error: any) {
      console.error("[v0] Error analyzing documents:", error)
      setAnalysisError(error.message || "Failed to analyze documents. Please try again.")
    } finally {
      setAnalysisLoading(false)
    }
  }

  const checkAndLoadAnalysis = async () => {
    setAnalysisLoading(true)
    setAnalysisError(null)

    try {
      console.log("[v0] Checking for cached analysis")

      const checkResponse = await fetch(`/api/tenders/scraped/${id}/analysis`)

      if (checkResponse.ok) {
        const { analysis: cachedAnalysis, cached } = await checkResponse.json()

        if (cachedAnalysis) {
          console.log("[v0] Found cached analysis, using it")
          setAnalysis(cachedAnalysis)
          setAnalysisCached(true)
          setAnalysisLoading(false)
          return
        }
      }

      console.log("[v0] No cached analysis found, analyzing documents")
      await analyzeAllDocuments()
    } catch (error) {
      console.error("[v0] Error checking cached analysis:", error)
      await analyzeAllDocuments()
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
        return "bg-gray-500/10 text-gray-500 border-gray-500/20"
    }
  }

  if (loading) {
    return (
      <div className="p-6 md:p-8 flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!tender) {
    return (
      <div className="p-6 md:p-8">
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground">Tender not found</p>
            <Button asChild className="mt-4">
              <Link href="/dashboard/search">Back to Search</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/search">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <h1 className="text-3xl font-bold text-foreground">{tender.title}</h1>
            {tender.category && <Badge className="bg-primary/10 text-primary">{tender.category}</Badge>}
            {tender.source_level && <Badge variant="outline">{tender.source_level}</Badge>}
          </div>
          <div className="flex items-center gap-4 text-muted-foreground flex-wrap">
            <span className="flex items-center gap-1">
              <Building2 className="h-4 w-4" />
              {tender.source_name}
            </span>
            {tender.source_province && (
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {tender.source_province}
              </span>
            )}
            {tender.close_date && (
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Closes: {new Date(tender.close_date).toLocaleDateString()}
              </span>
            )}
            {tender.estimated_value && (
              <span className="flex items-center gap-1">
                <DollarSign className="h-4 w-4" />
                {tender.estimated_value}
              </span>
            )}
          </div>
        </div>
        {tender.tender_url && (
          <Button asChild>
            <a href={tender.tender_url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4 mr-2" />
              View Original
            </a>
          </Button>
        )}
      </div>

      <Tabs defaultValue="analysis" className="space-y-6">
        <TabsList>
          <TabsTrigger value="analysis">
            <Sparkles className="h-4 w-4 mr-2" />
            AI Analysis
            {analysisLoading && <Loader2 className="h-3 w-3 ml-2 animate-spin" />}
            {analysisCached && (
              <Badge variant="secondary" className="ml-2 text-xs">
                Cached
              </Badge>
            )}
          </TabsTrigger>
          {analysis?.formFields && analysis.formFields.length > 0 && (
            <TabsTrigger value="form">
              <ClipboardList className="h-4 w-4 mr-2" />
              Application Form
              <Badge variant="secondary" className="ml-2">
                {analysis.formFields.length}
              </Badge>
            </TabsTrigger>
          )}
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="documents">
            Documents
            {documents.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {documents.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="analysis" className="space-y-6">
          {analysisLoading && (
            <Card className="border-border">
              <CardContent className="p-12 text-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
                <p className="text-muted-foreground">
                  {analysisCached ? "Loading cached analysis..." : "Analyzing tender documents with AI..."}
                </p>
                {!analysisCached && (
                  <p className="text-sm text-muted-foreground mt-2">This may take a minute for large documents</p>
                )}
              </CardContent>
            </Card>
          )}

          {analysisError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{analysisError}</AlertDescription>
            </Alert>
          )}

          {!analysisLoading && !analysisError && !analysis && (
            <Card className="border-border">
              <CardContent className="p-12 text-center">
                <Sparkles className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground">No analysis available yet</p>
                <Button onClick={analyzeAllDocuments} className="mt-4">
                  Analyze Documents
                </Button>
              </CardContent>
            </Card>
          )}

          {analysis && (
            <>
              <Card className="border-border bg-primary/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    Executive Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground leading-relaxed">{analysis.summary}</p>
                </CardContent>
              </Card>

              {analysis.actionableTasks && analysis.actionableTasks.length > 0 && (
                <Card className="border-border">
                  <CardHeader>
                    <CardTitle>Action Items</CardTitle>
                    <CardDescription>Tasks you need to complete for this tender</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {analysis.actionableTasks.map((task, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-3 p-4 rounded-lg border border-border hover:border-primary transition-colors"
                        >
                          <div className="mt-1">
                            <CheckCircle2 className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <p className="font-medium text-foreground">{task.task}</p>
                              <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
                              <Badge variant="outline">{task.category}</Badge>
                            </div>
                            {task.deadline && (
                              <p className="text-sm text-muted-foreground flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {task.deadline}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {analysis.keyRequirements && analysis.keyRequirements.length > 0 && (
                <Card className="border-border">
                  <CardHeader>
                    <CardTitle>Key Requirements</CardTitle>
                    <CardDescription>Eligibility criteria and mandatory requirements</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {analysis.keyRequirements.map((req, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2" />
                          <span className="text-muted-foreground">{req}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {analysis.deadlines && analysis.deadlines.length > 0 && (
                <Card className="border-border">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Important Deadlines
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {analysis.deadlines.map((deadline, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-red-500 mt-2" />
                          <span className="text-muted-foreground">{deadline}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {analysis.evaluationCriteria && analysis.evaluationCriteria.length > 0 && (
                <Card className="border-border">
                  <CardHeader>
                    <CardTitle>Evaluation Criteria</CardTitle>
                    <CardDescription>How your bid will be assessed</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {analysis.evaluationCriteria.map((criteria, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2" />
                          <span className="text-muted-foreground">{criteria}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {analysis.complianceChecklist && analysis.complianceChecklist.length > 0 && (
                <Card className="border-border">
                  <CardHeader>
                    <CardTitle>Compliance Checklist</CardTitle>
                    <CardDescription>Mandatory documents and compliance items</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {analysis.complianceChecklist.map((item, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-muted-foreground mt-0.5" />
                          <span className="text-muted-foreground">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {analysis.recommendations && analysis.recommendations.length > 0 && (
                <Card className="border-border">
                  <CardHeader>
                    <CardTitle>Strategic Recommendations</CardTitle>
                    <CardDescription>AI-powered insights to improve your bid</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {analysis.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2" />
                          <span className="text-muted-foreground">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </TabsContent>

        <TabsContent value="form" className="space-y-6">
          {analysis?.formFields && analysis.formFields.length > 0 ? (
            <>
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  This form was automatically generated from the tender documents. Fill in all required fields and save
                  your progress as you go.
                </AlertDescription>
              </Alert>
              <DynamicTenderForm tenderId={id} formFields={analysis.formFields} />
            </>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <ClipboardList className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground">No form fields extracted from documents</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="overview" className="space-y-6">
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{tender.description}</p>
            </CardContent>
          </Card>

          {tender.requirements && tender.requirements.length > 0 && (
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Requirements</CardTitle>
                <CardDescription>Key requirements for this tender</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {tender.requirements.map((req, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2" />
                      <span className="text-muted-foreground">{req}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="documents" className="space-y-6">
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Tender Documents</CardTitle>
              <CardDescription>Documents scraped from the tender website - download or analyze with AI</CardDescription>
            </CardHeader>
            <CardContent>
              {documents.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No documents available for this tender</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-4 rounded-lg border border-border hover:border-primary transition-colors"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-foreground">{doc.document_name}</p>
                          <p className="text-sm text-muted-foreground">
                            {(doc.file_size / 1024 / 1024).toFixed(2)} MB • {doc.document_type.toUpperCase()} •{" "}
                            {new Date(doc.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {doc.document_type === "pdf" && (
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleAnalyze(doc)}
                            disabled={analyzing === doc.id}
                            title="Analyze with AI"
                          >
                            {analyzing === doc.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Sparkles className="h-4 w-4" />
                            )}
                          </Button>
                        )}
                        <Button variant="outline" size="icon" onClick={() => handleDownload(doc)} title="Download">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
