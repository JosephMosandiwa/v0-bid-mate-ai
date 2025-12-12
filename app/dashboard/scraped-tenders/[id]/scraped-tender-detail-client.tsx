"use client"

import { useState, useRef, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { TenderContextStrategistPanel } from "@/components/strategist/tender-context-panel"
import {
  AlertCircle,
  ClipboardList,
  FileText,
  Sparkles,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Download,
  ExternalLink,
  Loader2,
} from "lucide-react"
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

interface ScrapedTenderDetailClientProps {
  googleMapsApiKey?: string
}

export function ScrapedTenderDetailClient({ googleMapsApiKey }: ScrapedTenderDetailClientProps) {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [tender, setTender] = useState<ScrapedTender | null>(null)
  const [documents, setDocuments] = useState<TenderDocument[]>([])
  const [loading, setLoading] = useState(true)
  const [analyzing, setAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<TenderAnalysis | null>(null)
  const [analysisError, setAnalysisError] = useState<string | null>(null)
  const [analysisCached, setAnalysisCached] = useState(false)

  const analysisInitiated = useRef(false)

  useEffect(() => {
    const loadTenderData = async () => {
      try {
        setLoading(true)
        console.log("[v0] Loading tender data for:", id)

        const response = await fetch(`/api/tenders/scraped/${id}`)
        if (!response.ok) {
          throw new Error("Failed to load tender")
        }

        const { tender: tenderData, documents: docsData } = await response.json()
        console.log("[v0] Loaded tender with", docsData.length, "documents")

        setTender(tenderData)
        setDocuments(docsData)
      } catch (error) {
        console.error("[v0] Error loading tender:", error)
        setAnalysisError("Failed to load tender data")
      } finally {
        setLoading(false)
      }
    }

    loadTenderData()
  }, [id])

  useEffect(() => {
    if (!documents.length || analysisInitiated.current || analyzing) {
      return
    }

    const checkAndTriggerAnalysis = async () => {
      try {
        analysisInitiated.current = true
        console.log("[v0] Checking for existing analysis...")

        const checkResponse = await fetch(`/api/tenders/scraped/${id}/analysis`)
        if (checkResponse.ok) {
          const { analysis: existingAnalysis, cached } = await checkResponse.json()

          if (existingAnalysis) {
            console.log("[v0] Found existing analysis")
            setAnalysis(existingAnalysis)
            setAnalysisCached(cached)
            return
          }
        }

        console.log("[v0] No analysis found, triggering automatic analysis...")
        setAnalyzing(true)
        setAnalysisError(null)

        const analyzeResponse = await fetch(`/api/tenders/scraped/${id}/analyze`, {
          method: "POST",
        })

        if (!analyzeResponse.ok) {
          const error = await analyzeResponse.json()
          throw new Error(error.error || "Failed to analyze tender")
        }

        const { analysis: newAnalysis, cached } = await analyzeResponse.json()
        console.log("[v0] Analysis completed successfully")

        setAnalysis(newAnalysis)
        setAnalysisCached(cached)
      } catch (error) {
        console.error("[v0] Error during analysis:", error)
        setAnalysisError(error instanceof Error ? error.message : "Failed to analyze tender")
      } finally {
        setAnalyzing(false)
      }
    }

    checkAndTriggerAnalysis()
  }, [documents, id, analyzing])

  if (loading) {
    return (
      <div className="p-4 md:p-6 lg:p-8 space-y-4 md:space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    )
  }

  if (!tender) {
    return (
      <div className="p-4 md:p-6 lg:p-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Tender not found</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">{tender.title}</h1>
          <div className="flex flex-wrap gap-2 mb-4">
            {tender.category && <Badge className="bg-primary/10 text-primary">{tender.category}</Badge>}
            {tender.source_level && <Badge variant="outline">{tender.source_level}</Badge>}
            {tender.source_province && <Badge variant="secondary">{tender.source_province}</Badge>}
          </div>
          <p className="text-muted-foreground mb-4">{tender.description}</p>
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            {tender.source_name && (
              <span className="flex items-center gap-1">
                <FileText className="h-4 w-4" />
                {tender.source_name}
              </span>
            )}
            {tender.close_date && (
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                Closes: {new Date(tender.close_date).toLocaleDateString()}
              </span>
            )}
            {tender.estimated_value && (
              <span className="flex items-center gap-1">
                <span>Value: {tender.estimated_value}</span>
              </span>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-[1fr_360px] gap-6">
          {/* Main Content */}
          <div className="space-y-4">
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

            <Tabs defaultValue="analysis" className="space-y-4 md:space-y-6">
              <TabsList>
                <TabsTrigger value="analysis">
                  <Sparkles className="h-4 w-4 mr-2" />
                  AI Insights
                </TabsTrigger>
                <TabsTrigger value="documents">
                  <FileText className="h-4 w-4 mr-2" />
                  Documents ({documents.length})
                </TabsTrigger>
                <TabsTrigger value="form">
                  <ClipboardList className="h-4 w-4 mr-2" />
                  Response Form
                </TabsTrigger>
              </TabsList>

              <TabsContent value="analysis" className="space-y-4">
                {analysis ? (
                  <>
                    {analysisCached && (
                      <Alert>
                        <CheckCircle2 className="h-4 w-4" />
                        <AlertDescription>
                          This analysis was previously generated and cached for faster loading.
                        </AlertDescription>
                      </Alert>
                    )}

                    <Card>
                      <CardHeader>
                        <CardTitle>Summary</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground leading-relaxed">{analysis.summary}</p>
                      </CardContent>
                    </Card>

                    {analysis.keyRequirements && analysis.keyRequirements.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle>Key Requirements</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {analysis.keyRequirements.map((req, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                                <span className="text-muted-foreground">{req}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    )}

                    {analysis.deadlines && analysis.deadlines.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle>Important Deadlines</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {analysis.deadlines.map((deadline, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <Clock className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
                                <span className="text-muted-foreground">{deadline}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    )}

                    {analysis.actionableTasks && analysis.actionableTasks.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle>Actionable Tasks</CardTitle>
                          <CardDescription>Prioritized tasks to complete for this tender</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {analysis.actionableTasks.map((task, idx) => (
                              <div key={idx} className="flex items-start gap-3 p-3 rounded-lg border border-border">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <Badge
                                      variant={
                                        task.priority === "high"
                                          ? "destructive"
                                          : task.priority === "medium"
                                            ? "default"
                                            : "secondary"
                                      }
                                      className="text-xs"
                                    >
                                      {task.priority}
                                    </Badge>
                                    <Badge variant="outline" className="text-xs">
                                      {task.category}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-foreground">{task.task}</p>
                                  {task.deadline && (
                                    <p className="text-xs text-muted-foreground mt-1">Deadline: {task.deadline}</p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {analysis.recommendations && analysis.recommendations.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle>Strategic Recommendations</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {analysis.recommendations.map((rec, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <Sparkles className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                                <span className="text-muted-foreground">{rec}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    )}
                  </>
                ) : analyzing ? (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <Loader2 className="h-12 w-12 mx-auto mb-4 text-primary animate-spin" />
                      <p className="text-muted-foreground">Analyzing tender documents...</p>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                      <p className="text-muted-foreground">No analysis available</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="documents" className="space-y-4">
                {documents.length > 0 ? (
                  <div className="grid gap-4">
                    {documents.map((doc) => (
                      <Card key={doc.id}>
                        <CardHeader>
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <CardTitle className="text-lg">{doc.document_name}</CardTitle>
                              <CardDescription className="mt-1">
                                {doc.document_type} • {(doc.file_size / 1024 / 1024).toFixed(2)} MB
                              </CardDescription>
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" asChild>
                                <a href={doc.blob_url} download>
                                  <Download className="h-4 w-4 mr-2" />
                                  Download
                                </a>
                              </Button>
                              <Button size="sm" variant="outline" asChild>
                                <a href={doc.original_url} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="h-4 w-4 mr-2" />
                                  Original
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
                      <p className="text-muted-foreground">No documents available</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="form" className="space-y-4 md:space-y-6">
                {analysis?.formFields && analysis.formFields.length > 0 ? (
                  <>
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        This form was automatically generated from the tender documents. Fill in all required fields and
                        save your progress as you go.
                      </AlertDescription>
                    </Alert>
                    <DynamicTenderForm
                      tenderId={id}
                      formFields={analysis.formFields}
                      googleMapsApiKey={googleMapsApiKey}
                      documents={documents}
                      tenderData={
                        tender
                          ? {
                              id: tender.id,
                              title: tender.title,
                              source_name: tender.source_name,
                              description: tender.description,
                              publish_date: tender.publish_date,
                              close_date: tender.close_date,
                              estimated_value: tender.estimated_value,
                              category: tender.category,
                              tender_url: tender.tender_url,
                            }
                          : undefined
                      }
                    />
                  </>
                ) : (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <ClipboardList className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                      <p className="text-muted-foreground">
                        {analyzing ? "Generating form fields..." : "No form fields extracted from documents"}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-4">
            <TenderContextStrategistPanel
              tender={{
                id: tender.id,
                title: tender.title,
                organization: tender.source_name,
                description: tender.description,
                deadline: tender.close_date,
                value: tender.estimated_value,
                requirements: analysis?.keyRequirements,
                analysis: analysis,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
