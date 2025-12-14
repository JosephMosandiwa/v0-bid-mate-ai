"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
} from "lucide-react"
// Imported TenderContextPanel from the updates
import { TenderContextPanel } from "@/components/strategist/tender-context-panel"
import { useToast } from "@/components/ui/use-toast" // Declared useToast import

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
  }

  const [tender, setTender] = useState(safeTender)
  const [documents, setDocuments] = useState(initialDocuments)
  const [analysis, setAnalysis] = useState(initialAnalysis)
  const [loading, setLoading] = useState(false) // Removed initial loading state, as data comes from props
  const [analyzing, setAnalyzing] = useState(false)
  const [analysisError, setAnalysisError] = useState<string | null>(null)
  // Renamed saving to isSaving for clarity
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
            // Added fileName to the analyze request
            fileName: firstDoc.original_filename,
            // Removed tenderId and tenderType as they are no longer needed in this context
          }),
        })

        if (!analyzeResponse.ok) {
          // Simplified error message
          throw new Error("Analysis failed")
        }

        const analysisResult = await analyzeResponse.json()
        setAnalysis(analysisResult)

        // Save analysis to database
        const saveResponse = await fetch(`/api/custom-tenders/${tender.id}/analysis`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ analysis: analysisResult }),
        })

        if (!saveResponse.ok) {
          // Handle error saving analysis if necessary
          console.error("Failed to save analysis to database")
        }

        toast({
          title: "Analysis Complete",
          description: "Tender document has been analyzed successfully",
        })
      } catch (error) {
        console.error("[v0] Analysis error:", error)
        // Simplified error message for toast
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
  }, [documents, analyzing, analysis, tender.id, toast]) // Added toast to dependency array

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

      // Update the local tender state with the saved data
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

  // Added handleDownload function
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
      {/* Header */}
      <div className="mb-6">
        {/* Added Back to Tenders button */}
        <Button variant="ghost" onClick={() => router.push("/dashboard/tenders")} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Tenders
        </Button>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">{tender.title}</h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Building2 className="h-4 w-4" />
                {String(tender.organization || "N/A")}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {tender.close_date ? new Date(tender.close_date).toLocaleDateString() : "No deadline"}
              </span>
              {tender.value && (
                <span className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4" />
                  {String(tender.value)}
                </span>
              )}
            </div>
          </div>
          {/* Changed Badge to reflect "Custom Tender" */}
          <Badge variant="secondary">Custom Tender</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - 2 columns */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="analysis" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="analysis">Analysis</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
            </TabsList>

            {/* Analysis Tab */}
            <TabsContent value="analysis" className="space-y-4">
              {analyzing && (
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
                      <span className="text-lg">Analyzing tender document...</span>
                    </div>
                  </CardContent>
                </Card>
              )}

              {analysisError && (
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2 text-destructive">
                      <AlertCircle className="h-5 w-5" />
                      <span>{analysisError}</span>
                    </div>
                  </CardContent>
                </Card>
              )}

              {!analyzing && !analysisError && analysis && (
                <>
                  {/* Summary */}
                  {analysis.tender_summary && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Tender Summary</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">{analysis.tender_summary}</p>
                      </CardContent>
                    </Card>
                  )}

                  {/* Form Fields */}
                  {analysis.formFields && analysis.formFields.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Form Fields Detected</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {analysis.formFields.map((field: any, index: number) => (
                            <div key={index} className="border-b pb-3 last:border-0">
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-medium text-sm">{field.fieldName}</span>
                                <Badge variant="outline" className="text-xs">
                                  {field.fieldType}
                                </Badge>
                              </div>
                              {field.currentValue && (
                                <p className="text-sm text-muted-foreground">Current: {field.currentValue}</p>
                              )}
                              {field.suggestedValue && (
                                <p className="text-sm text-primary">Suggested: {field.suggestedValue}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Compliance Summary */}
                  {analysis.compliance_summary && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Compliance Requirements</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                          {analysis.compliance_summary}
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </>
              )}

              {!analyzing && !analysisError && !analysis && (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No analysis available yet</p>
                      <p className="text-sm text-muted-foreground mt-2">Upload a document to start analysis</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Documents Tab */}
            <TabsContent value="documents" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Documents</CardTitle>
                </CardHeader>
                <CardContent>
                  {documents.length > 0 ? (
                    <div className="space-y-2">
                      {documents.map((doc: any) => (
                        <div
                          key={doc.id}
                          className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent"
                        >
                          <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-primary" />
                            <div>
                              <p className="font-medium text-sm">{doc.original_filename}</p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(doc.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => handleDownload(doc)}>
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No documents uploaded</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Details Tab */}
            <TabsContent value="details" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Tender Details</CardTitle>
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

                  <div className="space-y-2">
                    <Label htmlFor="close_date">Close Date</Label>
                    <Input
                      id="close_date"
                      type="date"
                      value={formData.close_date}
                      onChange={(e) => setFormData({ ...formData, close_date: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="value">Estimated Value</Label>
                    <Input
                      id="value"
                      value={formData.value}
                      onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                      placeholder="e.g., R 1,000,000"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={5}
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
        </div>

        {/* AI Strategist Panel - 1 column */}
        <div className="lg:col-span-1">
          {/* Replaced TenderContextStrategistPanel with TenderContextPanel */}
          <TenderContextPanel
            // Passed tender.id, tender.title, tender.description, documents, and analysis as props
            tenderId={String(tender.id)}
            tenderTitle={String(tender.title || "")}
            tenderDescription={String(tender.description || "")}
            documents={documents}
            analysis={analysis}
          />
        </div>
      </div>
    </div>
  )
}
