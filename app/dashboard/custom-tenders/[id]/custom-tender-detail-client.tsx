"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  AlertCircle,
  FileText,
  Download,
  Loader2,
  Save,
  ArrowLeft,
  Calendar,
  Building2,
  DollarSign,
  Sparkles,
  Target,
  ClipboardList,
  CheckCircle2,
  XCircle,
  TrendingUp,
  MapPin,
} from "lucide-react"
import { TenderContextPanel } from "@/components/strategist/tender-context-panel"
import { useToast } from "@/hooks/use-toast"
import { TenderProgressTracker } from "@/components/tender/progress-tracker"
import { DynamicTenderForm } from "@/components/dynamic-tender-form"

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
    <div className="flex gap-6 h-[calc(100vh-120px)]">
      <div className="flex-1 overflow-y-auto pr-4 space-y-6">
        {/* Header with progress tracker */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-balance">{String(tender.title || "Untitled Tender")}</h1>
            <div className="flex items-center gap-4 mt-3 flex-wrap">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Building2 className="h-4 w-4" />
                <span>{String(tender.organization || "N/A")}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>
                  Closes: {tender.close_date ? new Date(String(tender.close_date)).toLocaleDateString() : "N/A"}
                </span>
              </div>
              {tender.value && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <DollarSign className="h-4 w-4" />
                  <span>{String(tender.value)}</span>
                </div>
              )}
            </div>
          </div>
          <Button variant="ghost" onClick={() => router.push("/dashboard/tenders")} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Tenders
          </Button>
        </div>

        <TenderProgressTracker
          status={progressStatus}
          progressPercent={progressPercent}
          lastUpdate={tender.last_progress_update ? String(tender.last_progress_update) : undefined}
          submissionDate={tender.submission_date ? String(tender.submission_date) : undefined}
          outcome={tender.outcome ? String(tender.outcome) : undefined}
        />

        {/* Info Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Building2 className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Organization</p>
                  <p className="text-sm font-medium">{String(tender.organization || "N/A")}</p>
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
                    {tender.close_date ? new Date(String(tender.close_date)).toLocaleDateString() : "Not specified"}
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
                  <p className="text-xs text-muted-foreground">Value</p>
                  <p className="text-sm font-medium">{String(tender.value || "Not specified")}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Location</p>
                  <p className="text-sm font-medium">{String(tender.location || "Not specified")}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="w-full">
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
            <TabsTrigger value="edit">
              <ClipboardList className="h-4 w-4 mr-2" />
              Edit Details
            </TabsTrigger>
            <TabsTrigger value="respond">
              <ClipboardList className="h-4 w-4 mr-2" />
              Respond
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {!analyzing && !analysisError && analysis ? (
              <>
                {analysis.tender_summary && typeof analysis.tender_summary === "object" && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Tender Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Tender Number</p>
                          <p className="text-sm">{String(analysis.tender_summary.tender_number || "Not specified")}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Entity</p>
                          <p className="text-sm">{String(analysis.tender_summary.entity || "Not specified")}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Closing Date</p>
                          <p className="text-sm">{String(analysis.tender_summary.closing_date || "Not specified")}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Contact Email</p>
                          <p className="text-sm">{String(analysis.tender_summary.contact_email || "Not specified")}</p>
                        </div>
                      </div>
                      {analysis.tender_summary.description && (
                        <div className="mt-4">
                          <p className="text-sm font-medium text-muted-foreground mb-2">Description</p>
                          <p className="text-sm whitespace-pre-wrap">{String(analysis.tender_summary.description)}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {analysis.formFields && analysis.formFields.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Form Fields Detected</CardTitle>
                      <CardDescription>Fields identified in the tender documents</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {analysis.formFields.slice(0, 5).map((field: any, index: number) => (
                          <div key={index} className="border-b pb-3 last:border-0">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium text-sm">{field.fieldName}</span>
                              <Badge variant="outline" className="text-xs">
                                {field.fieldType}
                              </Badge>
                            </div>
                            {field.suggestedValue && (
                              <p className="text-sm text-muted-foreground">Suggested: {field.suggestedValue}</p>
                            )}
                          </div>
                        ))}
                        {analysis.formFields.length > 5 && (
                          <p className="text-xs text-muted-foreground text-center pt-2">
                            + {analysis.formFields.length - 5} more fields
                          </p>
                        )}
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
                  <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground">No analysis available yet</p>
                  <p className="text-sm text-muted-foreground mt-2">Upload a document to start analysis</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="requirements" className="space-y-4">
            {analysis?.compliance_summary && typeof analysis.compliance_summary === "object" ? (
              <>
                {analysis.compliance_summary.requirements && analysis.compliance_summary.requirements.length > 0 && (
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
                        {analysis.compliance_summary.requirements.map((req: string, idx: number) => (
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
                {analysis.compliance_summary.disqualifiers && analysis.compliance_summary.disqualifiers.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-destructive">
                        <XCircle className="h-5 w-5" />
                        Disqualifiers
                      </CardTitle>
                      <CardDescription>These will eliminate your bid</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {analysis.compliance_summary.disqualifiers.map((dis: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-2">
                            <AlertCircle className="h-4 w-4 text-destructive mt-0.5" />
                            <span className="text-sm text-destructive">{dis}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
                {analysis.compliance_summary.strengtheners && analysis.compliance_summary.strengtheners.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-green-600">
                        <TrendingUp className="h-5 w-5" />
                        Strengtheners
                      </CardTitle>
                      <CardDescription>These will improve your chances</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {analysis.compliance_summary.strengtheners.map((str: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                            <span className="text-sm text-green-600">{str}</span>
                          </li>
                        ))}
                      </ul>
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
                </div>
                <div className="grid gap-3">
                  {documents.map((doc: any) => (
                    <Card key={doc.id} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-3 flex-1">
                            <FileText className="h-5 w-5 text-primary mt-0.5" />
                            <div>
                              <CardTitle className="text-base">{doc.original_filename}</CardTitle>
                              <CardDescription className="text-xs mt-1">
                                {new Date(doc.created_at).toLocaleDateString()}
                              </CardDescription>
                            </div>
                          </div>
                          <Button variant="outline" size="sm" onClick={() => handleDownload(doc)}>
                            <Download className="h-4 w-4" />
                          </Button>
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
                  <p className="text-muted-foreground">No documents uploaded</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="edit" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Edit Tender Details</CardTitle>
                <CardDescription>Update tender information and save changes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setTender({ ...tender, title: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="organization">Organization</Label>
                  <Input
                    id="organization"
                    value={formData.organization}
                    onChange={(e) => setTender({ ...tender, organization: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="close_date">Closing Date</Label>
                    <Input
                      id="close_date"
                      type="date"
                      value={formData.close_date}
                      onChange={(e) => setTender({ ...tender, close_date: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="value">Value</Label>
                    <Input
                      id="value"
                      value={formData.value}
                      onChange={(e) => setTender({ ...tender, value: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    rows={6}
                    value={formData.description}
                    onChange={(e) => setTender({ ...tender, description: e.target.value })}
                  />
                </div>

                <Button onClick={handleSave} disabled={isSaving} className="w-full">
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="respond" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Response Form</CardTitle>
                <CardDescription>
                  Fill in your tender response. Your progress is automatically saved and tracked.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {analysis?.form_fields && analysis.form_fields.length > 0 ? (
                  <DynamicTenderForm
                    tenderId={tender.id}
                    formFields={analysis.form_fields}
                    documents={documents}
                    onProgressChange={handleProgressChange}
                  />
                ) : (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>No Form Fields Detected</AlertTitle>
                    <AlertDescription>
                      Upload tender documents to automatically detect and generate form fields, or manually add response
                      information.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* AI Strategist Sidebar */}
      <div className="w-[400px] flex-shrink-0">
        <TenderContextPanel
          tenderId={tender.id}
          tenderTitle={String(tender.title || "")}
          tenderDescription={String(tender.description || "")}
          documents={documents}
          analysis={analysis}
        />
      </div>
    </div>
  )
}

export { CustomTenderDetailClient }
