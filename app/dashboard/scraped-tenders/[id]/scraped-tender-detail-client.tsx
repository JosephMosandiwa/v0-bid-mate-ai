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
  DollarSign,
  Building2,
  MapPin,
  Calendar,
  Target,
  TrendingUp,
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
      <div className="container mx-auto p-6 space-y-6">
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    )
  }

  if (!tender) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Tender not found</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{tender.title}</h1>
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="secondary">Scraped Tender</Badge>
              {tender.category && <Badge>{tender.category}</Badge>}
              {tender.source_level && <Badge variant="outline">{tender.source_level}</Badge>}
              {tender.source_province && <Badge variant="outline">{tender.source_province}</Badge>}
            </div>
          </div>
          {tender.tender_url && (
            <Button variant="outline" asChild>
              <a href={tender.tender_url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" />
                View Source
              </a>
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Building2 className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Organization</p>
                  <p className="text-sm font-medium">{tender.source_name || "N/A"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Closing Date</p>
                  <p className="text-sm font-medium">
                    {tender.close_date ? new Date(tender.close_date).toLocaleDateString() : "Not specified"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <DollarSign className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Estimated Value</p>
                  <p className="text-sm font-medium">{tender.estimated_value || "Not specified"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Province</p>
                  <p className="text-sm font-medium">{tender.source_province || "National"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {tender.description && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">{tender.description}</p>
            </CardContent>
          </Card>
        )}
      </div>

      {analyzing && (
        <Alert className="mb-6">
          <Loader2 className="h-4 w-4 animate-spin" />
          <AlertDescription>Analyzing tender documents with AI... This may take a minute.</AlertDescription>
        </Alert>
      )}

      {analysisError && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{analysisError}</AlertDescription>
        </Alert>
      )}

      <div className="grid lg:grid-cols-[1fr_400px] gap-6">
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">
              <Sparkles className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="requirements">
              <Target className="h-4 w-4 mr-2" />
              Requirements
            </TabsTrigger>
            <TabsTrigger value="documents">
              <FileText className="h-4 w-4 mr-2" />
              Documents
            </TabsTrigger>
            <TabsTrigger value="respond">
              <ClipboardList className="h-4 w-4 mr-2" />
              Respond
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {analysis ? (
              <>
                {analysisCached && (
                  <Alert>
                    <CheckCircle2 className="h-4 w-4" />
                    <AlertDescription>Analysis cached for faster loading</AlertDescription>
                  </Alert>
                )}

                <Card>
                  <CardHeader>
                    <CardTitle>AI Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">{analysis.summary}</p>
                  </CardContent>
                </Card>

                {analysis.actionableTasks && analysis.actionableTasks.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Action Plan</CardTitle>
                      <CardDescription>Prioritized tasks to complete</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {analysis.actionableTasks.slice(0, 5).map((task, idx) => (
                          <div key={idx} className="flex items-start gap-3 p-3 rounded-lg border">
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
                                  {task.priority.toUpperCase()}
                                </Badge>
                                <span className="text-xs text-muted-foreground">{task.category}</span>
                              </div>
                              <p className="text-sm">{task.task}</p>
                              {task.deadline && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  <Clock className="h-3 w-3 inline mr-1" />
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

                {analysis.deadlines && analysis.deadlines.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Important Deadlines</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {analysis.deadlines.map((deadline, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <Clock className="h-4 w-4 text-orange-500 mt-0.5" />
                            <span className="text-sm">{deadline}</span>
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
                      <div className="space-y-2">
                        {analysis.recommendations.map((rec, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <Sparkles className="h-4 w-4 text-primary mt-0.5" />
                            <span className="text-sm">{rec}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            ) : analyzing ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Loader2 className="h-12 w-12 mx-auto mb-4 text-primary animate-spin" />
                  <p className="text-muted-foreground">Analyzing tender...</p>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground">No analysis available</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="requirements" className="space-y-4">
            {analysis ? (
              <>
                {analysis.keyRequirements && analysis.keyRequirements.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                        Mandatory Requirements
                      </CardTitle>
                      <CardDescription>You must meet these to qualify</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {analysis.keyRequirements.map((req, idx) => (
                          <li key={idx} className="flex items-start gap-2 pl-6 relative">
                            <span className="absolute left-0 top-1 w-4 h-4 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center text-xs font-medium text-green-700 dark:text-green-300">
                              {idx + 1}
                            </span>
                            <span className="text-sm">{req}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {analysis.complianceChecklist && analysis.complianceChecklist.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <ClipboardList className="h-5 w-5" />
                        Compliance Checklist
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {analysis.complianceChecklist.map((item, idx) => (
                          <div key={idx} className="flex items-start gap-2 p-2 rounded hover:bg-accent">
                            <div className="mt-0.5 h-4 w-4 rounded border-2 border-muted-foreground" />
                            <span className="text-sm">{item}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {analysis.evaluationCriteria && analysis.evaluationCriteria.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Target className="h-5 w-5" />
                        Evaluation Criteria
                      </CardTitle>
                      <CardDescription>How your proposal will be scored</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {analysis.evaluationCriteria.map((criterion, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <TrendingUp className="h-4 w-4 text-blue-500 mt-0.5" />
                            <span className="text-sm">{criterion}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <Target className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground">
                    {analyzing ? "Extracting requirements..." : "No requirements available"}
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="documents" className="space-y-4">
            {documents.length > 0 ? (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">{documents.length} Document(s)</h3>
                  {documents.length > 1 && (
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download All
                    </Button>
                  )}
                </div>
                <div className="grid gap-3">
                  {documents.map((doc) => (
                    <Card key={doc.id} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-3 flex-1">
                            <FileText className="h-5 w-5 text-primary mt-0.5" />
                            <div>
                              <CardTitle className="text-base">{doc.document_name}</CardTitle>
                              <CardDescription className="text-xs mt-1">
                                {doc.document_type} • {(doc.file_size / 1024 / 1024).toFixed(2)} MB •{" "}
                                {new Date(doc.created_at).toLocaleDateString()}
                              </CardDescription>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" asChild>
                              <a href={doc.blob_url} download>
                                <Download className="h-4 w-4" />
                              </a>
                            </Button>
                            <Button size="sm" variant="outline" asChild>
                              <a href={doc.original_url} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-4 w-4" />
                              </a>
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              </>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground">No documents available</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="respond" className="space-y-4">
            {analysis?.formFields && analysis.formFields.length > 0 ? (
              <>
                <Alert>
                  <Sparkles className="h-4 w-4" />
                  <AlertDescription>
                    This form was auto-generated from tender documents. Complete all required fields.
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
                <CardContent className="py-12 text-center">
                  <ClipboardList className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground">
                    {analyzing ? "Generating response form..." : "No form fields available"}
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

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
  )
}
