"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  FileText,
  Download,
  ExternalLink,
  Loader2,
  AlertCircle,
  Calendar,
  Building2,
  DollarSign,
  MapPin,
  CheckCircle2,
  Sparkles,
  LayoutDashboard,
  ClipboardCheck,
  FolderOpen,
  Edit3,
  Calculator,
  Award,
  PanelRightOpen,
  Globe,
  Clock,
  AlertTriangle,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { TenderProgressTracker } from "@/components/tender/progress-tracker"
import { DynamicTenderForm } from "@/components/dynamic-tender-form"
import { TenderContextPanel } from "@/components/strategist/tender-context-panel"
import { BOQManager } from "@/components/tender/boq-manager"
import { ComprehensivePlanView } from "@/components/tender/comprehensive-plan-view"
import { cn } from "@/lib/utils"

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
  tender_type?: string
  procurement_category?: string
  submission_method?: string
  contract_duration?: string
  payment_terms?: string
  validity_period?: string
  compulsory_briefing?: string
  contact_person?: string
  contact_email?: string
  contact_phone?: string
  location?: string
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

function ScrapedTenderDetailClient(props: any) {
  const { id } = props
  const [tender, setTender] = useState<any>(null)
  const [documents, setDocuments] = useState<any[]>([])
  const [analysis, setAnalysis] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [analyzing, setAnalyzing] = useState(false)
  const [formProgress, setFormProgress] = useState(0)
  const [activeSection, setActiveSection] = useState<string>("overview")
  const [strategistOpen, setStrategistOpen] = useState(true)
  const [projectPlan, setProjectPlan] = useState<any>(null)
  const [boqData, setBoqData] = useState<any>(null)
  const [readinessScore, setReadinessScore] = useState<any>(null)
  const { toast } = useToast()

  useEffect(() => {
    const loadTenderData = async () => {
      try {
        setLoading(true)
        console.log("[v0] Loading tender data for:", id)

        const response = await fetch(`/api/tenders/scraped/${id}`)
        if (!response.ok) {
          throw new Error("Failed to load tender")
        }

        const { tender: tenderData, documents: docsData, analysis: existingAnalysis } = await response.json()
        console.log("[v0] Loaded tender with", docsData.length, "documents")

        setTender(tenderData)
        setDocuments(docsData)

        if (existingAnalysis) {
          console.log("[v0] Found existing analysis")
          setAnalysis(existingAnalysis)
        }
      } catch (error) {
        console.error("[v0] Error loading tender:", error)
        toast({
          title: "Error",
          description: "Failed to load tender data",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadTenderData()
  }, [id, toast])

  useEffect(() => {
    if (!tender || !documents.length || analyzing || analysis) {
      return
    }

    const triggerAnalysis = async () => {
      try {
        setAnalyzing(true)
        console.log("[v0] Triggering automatic analysis for scraped tender...")

        const analyzeResponse = await fetch(`/api/tenders/scraped/${id}/analyze`, {
          method: "POST",
        })

        if (!analyzeResponse.ok) {
          const error = await analyzeResponse.json()
          throw new Error(error.error || "Failed to analyze tender")
        }

        const { analysis: newAnalysis } = await analyzeResponse.json()
        console.log("[v0] Analysis completed successfully")

        setAnalysis(newAnalysis)

        toast({
          title: "Analysis Complete",
          description: "Tender documents have been analyzed",
        })
      } catch (error) {
        console.error("[v0] Error during analysis:", error)
        toast({
          title: "Analysis Failed",
          description: error instanceof Error ? error.message : "Failed to analyze tender",
          variant: "destructive",
        })
      } finally {
        setAnalyzing(false)
      }
    }

    triggerAnalysis()
  }, [tender, documents, id, analyzing, analysis, toast])

  useEffect(() => {
    const loadProjectPlan = async () => {
      try {
        const response = await fetch(`/api/strategist/plan?tenderId=${tender.id}&tenderType=scraped`)
        if (response.ok) {
          const { plan } = await response.json()
          if (plan) {
            setProjectPlan(plan)
          }
        }
      } catch (error) {
        console.error("[v0] Error loading project plan:", error)
      }
    }

    if (tender) {
      loadProjectPlan()
    }
  }, [tender])

  const handleProgressChange = (progress: number) => {
    setFormProgress(progress)
  }

  const handlePlanGenerated = (plan: any) => {
    setProjectPlan(plan)
    setActiveSection("planning") // Automatically switch to planning section
  }

  const handleBoqGenerated = (boq: any) => {
    setBoqData(boq)
    setActiveSection("financial") // Automatically switch to financial section
  }

  const handleReadinessGenerated = (readiness: any) => {
    setReadinessScore(readiness)
    setActiveSection("overview") // Show in overview section
  }

  const sections = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "requirements", label: "Requirements", icon: ClipboardCheck },
    { id: "documents", label: "Documents", icon: FolderOpen },
    { id: "financial", label: "Financial & BOQ", icon: Calculator },
    { id: "planning", label: "Planning", icon: Award },
    { id: "respond", label: "Response Form", icon: Edit3 },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!tender) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>Tender not found</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="border-b bg-background p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">{tender.title}</h1>
            <div className="flex items-center gap-2">
              <p className="text-muted-foreground">{tender.source_name}</p>
              <Badge variant="outline">{tender.source_province}</Badge>
              <Badge variant="secondary">{tender.source_level}</Badge>
            </div>
          </div>
          {tender.tender_url && (
            <Button variant="outline" size="sm" asChild>
              <a href={tender.tender_url} target="_blank" rel="noopener noreferrer">
                <Globe className="mr-2 h-4 w-4" />
                View Source
              </a>
            </Button>
          )}
        </div>

        <TenderProgressTracker {...({ tenderId: tender.id, tenderType: "scraped", progress: formProgress } as any)} />

        <div className="grid gap-3 md:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Building2 className="h-5 w-5 text-muted-foreground" />
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Source</p>
                  <p className="text-sm font-medium">{tender.source_name}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Closing Date</p>
                  <p className="text-sm font-medium">
                    {tender.close_date ? new Date(tender.close_date).toLocaleDateString() : "N/A"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <DollarSign className="h-5 w-5 text-muted-foreground" />
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Est. Value</p>
                  <p className="text-sm font-medium">{tender.estimated_value || "N/A"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Location</p>
                  <p className="text-sm font-medium">{tender.location || tender.source_province || "N/A"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {(tender.tender_type ||
          tender.procurement_category ||
          tender.submission_method ||
          tender.contract_duration) && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Procurement Details</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-2 gap-4 text-sm">
                {tender.tender_type && (
                  <>
                    <dt className="text-muted-foreground">Tender Type:</dt>
                    <dd className="font-medium">{tender.tender_type}</dd>
                  </>
                )}
                {tender.procurement_category && (
                  <>
                    <dt className="text-muted-foreground">Procurement Category:</dt>
                    <dd className="font-medium">{tender.procurement_category}</dd>
                  </>
                )}
                {tender.submission_method && (
                  <>
                    <dt className="text-muted-foreground">Submission Method:</dt>
                    <dd className="font-medium">{tender.submission_method}</dd>
                  </>
                )}
                {tender.contract_duration && (
                  <>
                    <dt className="text-muted-foreground">Contract Duration:</dt>
                    <dd className="font-medium">{tender.contract_duration}</dd>
                  </>
                )}
                {tender.payment_terms && (
                  <>
                    <dt className="text-muted-foreground">Payment Terms:</dt>
                    <dd className="font-medium">{tender.payment_terms}</dd>
                  </>
                )}
                {tender.validity_period && (
                  <>
                    <dt className="text-muted-foreground">Validity Period:</dt>
                    <dd className="font-medium">{tender.validity_period}</dd>
                  </>
                )}
              </dl>
            </CardContent>
          </Card>
        )}

        {tender.compulsory_briefing && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Compulsory Briefing</AlertTitle>
            <AlertDescription>{tender.compulsory_briefing}</AlertDescription>
          </Alert>
        )}

        {(tender.contact_person || tender.contact_email || tender.contact_phone) && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-2 text-sm">
                {tender.contact_person && (
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Contact Person:</dt>
                    <dd className="font-medium">{tender.contact_person}</dd>
                  </div>
                )}
                {tender.contact_email && (
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Email:</dt>
                    <dd className="font-medium">
                      <a href={`mailto:${tender.contact_email}`} className="text-primary hover:underline">
                        {tender.contact_email}
                      </a>
                    </dd>
                  </div>
                )}
                {tender.contact_phone && (
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Phone:</dt>
                    <dd className="font-medium">
                      <a href={`tel:${tender.contact_phone}`} className="text-primary hover:underline">
                        {tender.contact_phone}
                      </a>
                    </dd>
                  </div>
                )}
              </dl>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-56 border-r bg-muted/20 p-4">
          <nav className="space-y-1">
            {sections.map((section) => {
              const Icon = section.icon
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors",
                    activeSection === section.id
                      ? "bg-primary text-primary-foreground font-medium"
                      : "hover:bg-muted text-muted-foreground hover:text-foreground",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {section.label}
                </button>
              )
            })}
          </nav>
        </div>

        <div className={cn("flex-1 overflow-auto", strategistOpen ? "" : "")}>
          <div className="p-6 space-y-6 max-w-7xl mx-auto">
            {activeSection === "overview" && (
              <div className="space-y-4">
                {analysis ? (
                  <>
                    {analysis.cached && (
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
                            {analysis.actionableTasks.slice(0, 5).map((task: any, idx: number) => (
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
                            {analysis.deadlines.map((deadline: any, idx: number) => (
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
                            {analysis.recommendations.map((rec: any, idx: number) => (
                              <div key={idx} className="flex items-start gap-2">
                                <Sparkles className="h-4 w-4 text-primary mt-0.5" />
                                <span className="text-sm">{rec}</span>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {readinessScore && (
                      <Card>
                        <CardHeader>
                          <CardTitle>Readiness Score</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="flex items-start gap-2">
                              <Sparkles className="h-4 w-4 text-primary mt-0.5" />
                              <span className="text-sm">{readinessScore}</span>
                            </div>
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
              </div>
            )}

            {activeSection === "requirements" && (
              <div className="space-y-4">
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
                            {analysis.keyRequirements.map((req: any, idx: number) => (
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
                            <ClipboardCheck className="h-5 w-5" />
                            Compliance Checklist
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            {analysis.complianceChecklist.map((item: any, idx: number) => (
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
                            <Award className="h-5 w-5" />
                            Evaluation Criteria
                          </CardTitle>
                          <CardDescription>How your proposal will be scored</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            {analysis.evaluationCriteria.map((criterion: any, idx: number) => (
                              <div key={idx} className="flex items-start gap-2">
                                <Calculator className="h-4 w-4 text-blue-500 mt-0.5" />
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
                      <Award className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                      <p className="text-muted-foreground">
                        {analyzing ? "Extracting requirements..." : "No requirements available"}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {activeSection === "documents" && (
              <div className="space-y-4">
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
                      {documents.map((doc: any) => (
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
              </div>
            )}

            {activeSection === "financial" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Financial Planning & BOQ</h2>
                  <p className="text-muted-foreground">Comprehensive cost analysis and pricing strategy</p>
                </div>

                <BOQManager
                  tenderId={tender.id}
                  tenderType="scraped"
                  tenderTitle={tender.title}
                  tenderDescription={tender.description}
                  analysisData={analysis}
                  projectPlan={projectPlan}
                  onBoqUpdate={(newBoq) => setBoqData(newBoq)}
                />
              </div>
            )}

            {activeSection === "planning" && (
              <div className="space-y-6">
                {!projectPlan ? (
                  <Card>
                    <CardHeader>
                      <CardTitle>Generate Comprehensive Project Plan</CardTitle>
                      <CardDescription>
                        Create a detailed plan with budget breakdowns, certifications, insurance, compliance
                        requirements
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center">
                        <p className="text-sm font-medium mb-2">👉 Use the AI Strategist panel to generate your plan</p>
                        <p className="text-xs text-muted-foreground">
                          Click "Generate Project Plan" in the strategist panel on the right
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <ComprehensivePlanView plan={projectPlan} />
                )}
              </div>
            )}

            {activeSection === "respond" && (
              <div className="space-y-4">
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
                      documents={documents}
                      tenderData={tender}
                      onProgressChange={handleProgressChange}
                    />
                  </>
                ) : (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <Edit3 className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                      <p className="text-muted-foreground">
                        {analyzing ? "Generating response form..." : "No form fields available"}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>
        </div>
        {strategistOpen && (
          <aside className="w-96 border-l bg-muted/30 overflow-hidden flex flex-col">
            <TenderContextPanel
              tender={{
                id: tender.id,
                title: tender.title,
                organization: tender.source_name,
                description: tender.description,
                deadline: tender.close_date,
                value: tender.estimated_value,
                requirements: tender.requirements,
                analysis: analysis,
              }}
              onPlanGenerated={handlePlanGenerated}
              onBoqGenerated={handleBoqGenerated}
              onReadinessGenerated={handleReadinessGenerated}
            />
          </aside>
        )}

        {!strategistOpen && (
          <Button
            variant="outline"
            size="sm"
            className="fixed bottom-6 right-6 shadow-lg bg-transparent"
            onClick={() => setStrategistOpen(true)}
          >
            <PanelRightOpen className="h-4 w-4 mr-2" />
            AI Strategist
          </Button>
        )}
      </div>
    </div>
  )
}

export { ScrapedTenderDetailClient }
export default ScrapedTenderDetailClient
