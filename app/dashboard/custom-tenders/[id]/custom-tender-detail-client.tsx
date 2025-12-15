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
import { Alert, AlertDescription } from "@/components/ui/alert"
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
import { useToast } from "@/components/ui/use-toast"

interface CustomTenderDetailClientProps {
  tender: any
  documents: any[]
  analysis: any
}

export function CustomTenderDetailClient({
  tender: initialTender,
  documents: initialDocuments,
  analysis: initialAnalysis,
}: CustomTenderDetailClientProps) {
  const router = useRouter()
  const { toast } = useToast()

  const safeTender = {
    ...initialTender,
    title: String(initialTender?.title || ""),
    organization: String(initialTender?.organization || ""),
    description: String(initialTender?.description || ""),
    value: String(initialTender?.value || ""),
    close_date: initialTender?.close_date || null,
    location: String(initialTender?.location || ""),
    category: String(initialTender?.category || ""),
  }

  const [tender, setTender] = useState(safeTender)
  const [documents, setDocuments] = useState(initialDocuments)
  const [analysis, setAnalysis] = useState(initialAnalysis)
  const [loading, setLoading] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [analysisError, setAnalysisError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const analysisInitiated = useRef(false)

  const [formData, setFormData] = useState({
    title: String(safeTender.title || ""),
    organization: String(safeTender.organization || ""),
    close_date: safeTender.close_date ? String(safeTender.close_date).split("T")[0] : "",
    value: String(safeTender.value || ""),
    description: String(safeTender.description || ""),
  })

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
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => router.push("/dashboard/tenders")} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Tenders
        </Button>

        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{tender.title}</h1>
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="secondary">Custom Tender</Badge>
              {tender.category && <Badge>{tender.category}</Badge>}
            </div>
          </div>
          <Button onClick={handleSave} disabled={isSaving}>
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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
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

        {tender.description && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">{String(tender.description)}</p>
            </CardContent>
          </Card>
        )}
      </div>

      {analyzing && (
        <Alert className="mb-6">
          <Loader2 className="h-4 w-4 animate-spin" />
          <AlertDescription>Analyzing tender document...</AlertDescription>
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
            <TabsTrigger value="edit">
              <ClipboardList className="h-4 w-4 mr-2" />
              Edit Details
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
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="organization">Organization</Label>
                  <Input
                    id="organization"
                    value={formData.organization}
                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="close_date">Closing Date</Label>
                    <Input
                      id="close_date"
                      type="date"
                      value={formData.close_date}
                      onChange={(e) => setFormData({ ...formData, close_date: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="value">Value</Label>
                    <Input
                      id="value"
                      value={formData.value}
                      onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    rows={6}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
        </Tabs>

        <div className="space-y-4">
          <TenderContextPanel
            tenderId={tender.id}
            tenderTitle={String(tender.title)}
            tenderDescription={String(tender.description || "")}
            documents={documents}
            analysis={analysis}
          />
        </div>
      </div>
    </div>
  )
}
