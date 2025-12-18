"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import {
  AlertCircle,
  FileText,
  Download,
  Loader2,
  Save,
  Calendar,
  Building2,
  DollarSign,
  Sparkles,
  CheckCircle2,
  XCircle,
  MapPin,
  LayoutDashboard,
  ClipboardCheck,
  FolderOpen,
  Edit3,
  Calculator,
  Award,
  MessageSquare,
  ChevronRight,
  PanelRightClose,
  PanelRightOpen,
} from "lucide-react"
import { TenderContextPanel } from "@/components/strategist/tender-context-panel"
import { useToast } from "@/hooks/use-toast"
import { TenderProgressTracker } from "@/components/tender/progress-tracker"
import { DynamicTenderForm } from "@/components/dynamic-tender-form"
import { BOQManager } from "@/components/tender/boq-manager"
import { ComprehensivePlanView } from "@/components/tender/comprehensive-plan-view"
import { cn } from "@/lib/utils"

interface CustomTenderDetailClientProps {
  tender: any
  documents: any[]
  analysis: any
}

export default function CustomTenderDetailClient({
  tender: initialTender,
  documents: initialDocuments,
  analysis: initialAnalysis,
}: CustomTenderDetailClientProps) {
  const router = useRouter()
  const { toast } = useToast()

  const [tender, setTender] = useState(initialTender)
  const [documents, setDocuments] = useState(initialDocuments)
  const [analysis, setAnalysis] = useState(initialAnalysis)
  const [analyzing, setAnalyzing] = useState(false)
  const [analysisError, setAnalysisError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const analysisInitiated = useRef(false)
  const [isUploading, setIsUploading] = useState(false)
  const [progressPercent, setProgressPercent] = useState(tender.progress_percent || 0)
  const [progressStatus, setProgressStatus] = useState(tender.progress_status || "reviewing")
  const [formProgress, setFormProgress] = useState(0)
  const [activeSection, setActiveSection] = useState<string>("overview")
  const [strategistOpen, setStrategistOpen] = useState(true)
  const [projectPlan, setProjectPlan] = useState<any>(null)
  const [boqData, setBoqData] = useState<any>(null)

  const formData = {
    title: String(tender.title || ""),
    organization: String(tender.organization || ""),
    close_date: tender.close_date ? String(tender.close_date).split("T")[0] : "",
    value: String(tender.value || ""),
    description: String(tender.description || ""),
  }

  useEffect(() => {
    if (!documents.length || analysisInitiated.current || analyzing || analysis) {
      return
    }

    const checkAndTriggerAnalysis = async () => {
      try {
        analysisInitiated.current = true
        console.log("[v0] Auto-triggering analysis for custom tender...")

        setAnalyzing(true)
        setAnalysisError(null)

        const firstDoc = documents[0]
        const documentUrl = firstDoc.blob_url || firstDoc.storage_path

        const analyzeResponse = await fetch(`/api/analyze-tender`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            documentUrl,
            fileName: firstDoc.original_filename,
          }),
        })

        if (!analyzeResponse.ok) {
          throw new Error("Analysis failed")
        }

        const analysisResult = await analyzeResponse.json()
        setAnalysis(analysisResult)

        const saveResponse = await fetch(`/api/custom-tenders/${tender.id}/analysis`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ analysis: analysisResult }),
        })

        if (!saveResponse.ok) {
          console.error("Failed to save analysis to database")
        }

        toast({
          title: "Analysis Complete",
          description: "Tender document has been analyzed successfully",
        })
      } catch (error) {
        console.error("[v0] Analysis error:", error)
        setAnalysisError("Failed to analyze document. Please try again.")
        toast({
          title: "Analysis Failed",
          description: "Failed to analyze tender document",
          variant: "destructive",
        })
      } finally {
        setAnalyzing(false)
      }
    }

    checkAndTriggerAnalysis()
  }, [documents, analyzing, analysis, tender.id, toast])

  useEffect(() => {
    const loadProjectPlan = async () => {
      try {
        const response = await fetch(`/api/strategist/plan?tenderId=${tender.id}&tenderType=custom`)
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

    loadProjectPlan()
  }, [tender.id])

  const handleSave = async () => {
    try {
      setIsSaving(true)

      const response = await fetch(`/api/custom-tenders/${tender.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Failed to save tender")
      }

      const data = await response.json()
      setTender(data.tender)

      toast({
        title: "Success",
        description: "Tender details saved successfully",
      })
    } catch (error) {
      console.error("[v0] Error saving tender:", error)
      toast({
        title: "Error",
        description: "Failed to save tender details",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDownload = (doc: any) => {
    const url = doc.blob_url || doc.storage_path
    if (url) {
      window.open(url, "_blank")
    }
  }

  const handleProgressChange = async (percent: number, status: string) => {
    setProgressPercent(percent)
    setProgressStatus(status)

    // Update database
    try {
      await fetch(`/api/strategist/progress`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tenderId: tender.id,
          tenderType: "custom",
          status,
          progressPercent: percent,
          milestone: `Response form ${percent}% complete`,
          notes: `User is filling out response form`,
        }),
      })
    } catch (error) {
      console.error("[v0] Error updating progress:", error)
    }
  }

  const sections = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "requirements", label: "Requirements", icon: ClipboardCheck },
    { id: "documents", label: "Documents", icon: FolderOpen },
    { id: "financial", label: "Financial & BOQ", icon: Calculator },
    { id: "planning", label: "Planning", icon: Award },
    { id: "respond", label: "Response Form", icon: Edit3 },
  ]

  if (!tender) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Tender Not Found</h2>
          <p className="text-muted-foreground mb-4">This tender could not be loaded.</p>
          <Button onClick={() => router.push("/dashboard/tenders")}>Back to Tenders</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="border-b bg-background p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">{String(tender.title || "Untitled Tender")}</h1>
            <p className="text-muted-foreground">{String(tender.organization || "No organization")}</p>
          </div>
          <Button variant="outline" size="sm" onClick={handleSave} disabled={isSaving}>
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Save
          </Button>
        </div>

        <TenderProgressTracker tenderId={tender.id} tenderType="custom" progress={formProgress} />

        {/* Key info cards */}
        <div className="grid gap-3 md:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Building2 className="h-5 w-5 text-muted-foreground" />
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Organization</p>
                  <p className="text-sm font-medium">{String(tender.organization || "N/A")}</p>
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
                  <p className="text-xs text-muted-foreground">Value</p>
                  <p className="text-sm font-medium">{String(tender.value || "N/A")}</p>
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
                  <p className="text-sm font-medium">{String(tender.location || "N/A")}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
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
            {/* Overview Section */}
            {activeSection === "overview" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Tender Overview</h2>
                  <p className="text-muted-foreground">AI-powered analysis and insights for this tender</p>
                </div>

                {/* AI Summary */}
                {analysis?.tender_summary && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-primary" />
                        Tender Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <Label className="text-muted-foreground">Tender Number</Label>
                          <p className="text-lg font-semibold mt-1">
                            {String(analysis.tender_summary.tender_number || "N/A")}
                          </p>
                        </div>
                        <div>
                          <Label className="text-muted-foreground">Entity</Label>
                          <p className="text-lg font-semibold mt-1">
                            {String(analysis.tender_summary.entity || "N/A")}
                          </p>
                        </div>
                        <div>
                          <Label className="text-muted-foreground">Contact Email</Label>
                          <p className="text-lg font-semibold mt-1">
                            {String(analysis.tender_summary.contact_email || "N/A")}
                          </p>
                        </div>
                        <div>
                          <Label className="text-muted-foreground">Contract Duration</Label>
                          <p className="text-lg font-semibold mt-1">
                            {String(analysis.tender_summary.contract_duration || "N/A")}
                          </p>
                        </div>
                        <div>
                          <Label className="text-muted-foreground">Validity Period</Label>
                          <p className="text-lg font-semibold mt-1">
                            {String(analysis.tender_summary.validity_period || "N/A")}
                          </p>
                        </div>
                        <div>
                          <Label className="text-muted-foreground">Submission Method</Label>
                          <p className="text-lg font-semibold mt-1">
                            {String(analysis.tender_summary.submission_method || "N/A")}
                          </p>
                        </div>
                      </div>
                      {analysis.tender_summary.description && (
                        <>
                          <Separator className="my-4" />
                          <div>
                            <Label className="text-muted-foreground">Description</Label>
                            <p className="text-sm leading-relaxed mt-2">
                              {String(analysis.tender_summary.description)}
                            </p>
                          </div>
                        </>
                      )}
                      {analysis.tender_summary.compulsory_briefing && (
                        <>
                          <Separator className="my-4" />
                          <Alert>
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Compulsory Briefing</AlertTitle>
                            <AlertDescription>{String(analysis.tender_summary.compulsory_briefing)}</AlertDescription>
                          </Alert>
                        </>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Action Plan */}
                {analysis?.actionable_tasks && analysis.actionable_tasks.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Action Plan</CardTitle>
                      <CardDescription>Prioritized tasks to win this tender</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {analysis.actionable_tasks.map((task: any, index: number) => (
                          <div
                            key={index}
                            className="flex items-start gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                          >
                            <div className="flex-shrink-0 mt-1">
                              <Badge
                                variant={
                                  task.priority === "high"
                                    ? "destructive"
                                    : task.priority === "medium"
                                      ? "default"
                                      : "secondary"
                                }
                              >
                                {task.priority}
                              </Badge>
                            </div>
                            <div className="flex-1 space-y-1">
                              <p className="font-medium">{task.task}</p>
                              <p className="text-sm text-muted-foreground">{task.rationale}</p>
                            </div>
                            <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-1" />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Strategic Recommendations */}
                {analysis?.strategic_recommendations && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Strategic Recommendations</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {String(analysis.strategic_recommendations)}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {/* Requirements Section */}
            {activeSection === "requirements" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Requirements & Compliance</h2>
                  <p className="text-muted-foreground">
                    Mandatory requirements, disqualifiers, and strengthening factors
                  </p>
                </div>

                {analysis?.compliance_summary && (
                  <div className="space-y-4">
                    {/* Requirements */}
                    {analysis.compliance_summary.requirements &&
                      analysis.compliance_summary.requirements.length > 0 && (
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <CheckCircle2 className="h-5 w-5 text-green-600" />
                              Mandatory Requirements
                            </CardTitle>
                            <CardDescription>You must meet all of these to qualify</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <ul className="space-y-2">
                              {analysis.compliance_summary.requirements.map((req: string, index: number) => (
                                <li key={index} className="flex items-start gap-2 text-sm">
                                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                                  <span>{req}</span>
                                </li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>
                      )}

                    {/* Disqualifiers */}
                    {analysis.compliance_summary.disqualifiers &&
                      analysis.compliance_summary.disqualifiers.length > 0 && (
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <XCircle className="h-5 w-5 text-red-600" />
                              Disqualifying Factors
                            </CardTitle>
                            <CardDescription>Avoid these or risk being disqualified</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <ul className="space-y-2">
                              {analysis.compliance_summary.disqualifiers.map((dis: string, index: number) => (
                                <li key={index} className="flex items-start gap-2 text-sm text-red-600">
                                  <XCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                  <span>{dis}</span>
                                </li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>
                      )}

                    {/* Strengtheners */}
                    {analysis.compliance_summary.strengtheners &&
                      analysis.compliance_summary.strengtheners.length > 0 && (
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <Sparkles className="h-5 w-5 text-blue-600" />
                              Competitive Advantages
                            </CardTitle>
                            <CardDescription>These factors will strengthen your bid</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <ul className="space-y-2">
                              {analysis.compliance_summary.strengtheners.map((str: string, index: number) => (
                                <li key={index} className="flex items-start gap-2 text-sm text-blue-600">
                                  <Sparkles className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                  <span>{str}</span>
                                </li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>
                      )}
                  </div>
                )}

                {/* Form Fields Detection */}
                {analysis?.form_fields && analysis.form_fields.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Detected Form Fields</CardTitle>
                      <CardDescription>{analysis.form_fields.length} fields identified from documents</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
                        {analysis.form_fields.slice(0, 12).map((field: any, index: number) => (
                          <div key={index} className="flex items-center gap-2 p-2 border rounded">
                            <Badge variant="outline" className="text-xs">
                              {field.type}
                            </Badge>
                            <span className="text-sm truncate">{field.label}</span>
                          </div>
                        ))}
                        {analysis.form_fields.length > 12 && (
                          <div className="flex items-center justify-center p-2 border rounded bg-muted">
                            <span className="text-sm text-muted-foreground">
                              +{analysis.form_fields.length - 12} more
                            </span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {/* Documents Section */}
            {activeSection === "documents" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Tender Documents</h2>
                  <p className="text-muted-foreground">{documents.length} document(s) uploaded</p>
                </div>

                {documents.length > 0 ? (
                  <div className="grid gap-4">
                    {documents.map((doc: any) => (
                      <Card key={doc.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-4 flex-1">
                              <div className="p-3 bg-primary/10 rounded-lg">
                                <FileText className="h-6 w-6 text-primary" />
                              </div>
                              <div className="flex-1">
                                <h3 className="font-semibold text-lg">{doc.original_filename}</h3>
                                <p className="text-sm text-muted-foreground mt-1">
                                  Uploaded {new Date(doc.created_at).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <Button variant="outline" size="sm" onClick={() => handleDownload(doc)}>
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="py-16 text-center">
                      <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                      <p className="text-lg font-medium mb-2">No documents uploaded</p>
                      <p className="text-sm text-muted-foreground">Upload tender documents to enable analysis</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {/* Financial & BOQ Section */}
            {activeSection === "financial" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Financial Planning & BOQ</h2>
                  <p className="text-muted-foreground">Comprehensive cost analysis and pricing strategy</p>
                </div>

                <BOQManager
                  tenderId={tender.id}
                  tenderType="custom"
                  tenderTitle={String(tender.title || "")}
                  tenderDescription={String(tender.description || "")}
                  analysisData={analysis}
                  projectPlan={projectPlan}
                  onBoqUpdate={(newBoq) => setBoqData(newBoq)}
                />

                {!projectPlan && (
                  <Alert>
                    <Sparkles className="h-4 w-4" />
                    <AlertDescription>
                      <p className="font-medium">Generate a project plan first</p>
                      <p className="text-sm mt-1">
                        Use the AI Strategist to create a comprehensive project plan. The BOQ will be more accurate with
                        cost estimates from your project plan.
                      </p>
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}

            {/* Planning Section */}
            {activeSection === "planning" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Comprehensive Planning</h2>
                  <p className="text-muted-foreground">
                    Certifications, insurance, compliance, financial readiness, and capacity requirements
                  </p>
                </div>

                {!projectPlan ? (
                  <Card>
                    <CardHeader>
                      <CardTitle>Generate Comprehensive Project Plan</CardTitle>
                      <CardDescription>
                        Create a detailed plan with budget breakdowns, certifications, insurance, compliance
                        requirements, and risk assessment
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        The AI will analyze your tender and generate a complete project plan tailored to South African
                        tender requirements including B-BBEE, CIDB, PFMA/MFMA compliance, and more.
                      </p>
                      <div className="text-center">
                        <p className="text-sm font-medium mb-2">
                          👉 Use the AI Strategist panel on the right to generate your plan
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Click "Generate Project Plan" button in the strategist panel
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <ComprehensivePlanView plan={projectPlan} />
                )}
              </div>
            )}

            {/* Response Form Section */}
            {activeSection === "respond" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Response Form</h2>
                  <p className="text-muted-foreground">
                    Fill in your tender response. Progress is automatically tracked and saved.
                  </p>
                </div>

                {analysis?.form_fields && analysis.form_fields.length > 0 ? (
                  <DynamicTenderForm
                    tenderId={tender.id}
                    formFields={analysis.form_fields}
                    documents={documents}
                    onProgressChange={handleProgressChange}
                  />
                ) : (
                  <Card>
                    <CardContent className="py-16 text-center">
                      <Edit3 className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                      <p className="text-lg font-medium mb-2">No Form Fields Detected</p>
                      <p className="text-sm text-muted-foreground">
                        Upload tender documents to automatically detect and generate form fields
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>
        </div>

        {strategistOpen && (
          <div className="w-96 border-l bg-muted/20 flex flex-col">
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">AI Strategist</h3>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setStrategistOpen(false)}>
                <PanelRightClose className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex-1 overflow-hidden">
              <TenderContextPanel
                tenderId={tender.id}
                tenderTitle={String(tender.title || "")}
                tenderDescription={String(tender.description || "")}
                documents={documents}
                analysis={analysis}
                onPlanGenerated={(plan) => {
                  setProjectPlan(plan)
                  setActiveSection("planning") // Auto-switch to planning section
                }}
              />
            </div>
          </div>
        )}

        {/* Collapsed strategist toggle */}
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

export { CustomTenderDetailClient }
