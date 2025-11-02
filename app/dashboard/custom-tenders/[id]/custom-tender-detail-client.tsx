"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  AlertCircle,
  ClipboardList,
  FileText,
  Sparkles,
  CheckCircle2,
  Clock,
  Download,
  Upload,
  Loader2,
  Save,
  ArrowLeft,
} from "lucide-react"
import Link from "next/link"
import { DynamicTenderForm } from "@/components/dynamic-tender-form"
import { useToast } from "@/hooks/use-toast"

interface CustomTenderDetailClientProps {
  tender: any
  documents: any[]
  analysis: any
}

export function CustomTenderDetailClient({
  tender,
  documents: initialDocuments,
  analysis: initialAnalysis,
}: CustomTenderDetailClientProps) {
  console.log("[v0] CustomTenderDetailClient RENDER START")
  console.log("[v0] Tender prop:", JSON.stringify(tender, null, 2))
  console.log("[v0] Documents prop:", initialDocuments?.length || 0, initialDocuments)
  console.log("[v0] Analysis prop:", initialAnalysis ? "EXISTS" : "NULL", initialAnalysis)

  const router = useRouter()
  const { toast } = useToast()
  const tenderId = tender.id

  console.log("[v0] Tender ID extracted:", tenderId)

  const [documents, setDocuments] = useState(initialDocuments)
  const [analysis, setAnalysis] = useState(initialAnalysis)
  const [analyzing, setAnalyzing] = useState(false)
  const [analysisError, setAnalysisError] = useState<string | null>(null)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)

  const [formData, setFormData] = useState({
    title: tender.title || "",
    organization: tender.organization || "",
    close_date: tender.close_date || "",
    value: tender.value || "",
    description: tender.description || "",
  })
  const [saving, setSaving] = useState(false)

  console.log("[v0] Form data initialized:", formData)
  console.log("[v0] Has analysis?", !!analysis)
  console.log("[v0] Has form fields?", analysis?.formFields?.length || 0)
  console.log("[v0] Documents count:", documents?.length || 0)

  useEffect(() => {
    console.log("[v0] CustomTenderDetailClient mounted - useEffect")
    console.log("[v0] Tender in useEffect:", tender)
    console.log("[v0] Documents in useEffect:", documents)
    console.log("[v0] Analysis in useEffect:", analysis)
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch(`/api/custom-tenders/${tenderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error("Failed to save")

      toast({
        title: "Saved",
        description: "Tender details updated successfully",
      })
    } catch (error) {
      console.error("[v0] Error saving tender details:", error)
      toast({
        title: "Error",
        description: "Failed to save tender details",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.type !== "application/pdf") {
      setAnalysisError("Please upload a PDF file")
      return
    }

    setUploadedFile(file)
    setAnalyzing(true)
    setAnalysisError(null)

    try {
      // Extract text from PDF
      const formData = new FormData()
      formData.append("file", file)

      const extractResponse = await fetch("/api/extract-pdf", {
        method: "POST",
        body: formData,
      })

      if (!extractResponse.ok) {
        throw new Error("Failed to extract text from PDF")
      }

      const { text } = await extractResponse.json()

      // Analyze the document
      const analyzeResponse = await fetch("/api/analyze-tender", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentText: text }),
      })

      if (!analyzeResponse.ok) {
        const errorData = await analyzeResponse.json()
        throw new Error(errorData.error || "Failed to analyze document")
      }

      const analysisResult = await analyzeResponse.json()
      setAnalysis(analysisResult)

      // Upload file to blob storage
      const uploadFormData = new FormData()
      uploadFormData.append("file", file)

      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: uploadFormData,
      })

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload file")
      }

      const { url: blobUrl } = await uploadResponse.json()

      // Add document to list
      const newDoc = {
        id: `temp-${Date.now()}`,
        tender_id: tenderId,
        document_name: file.name,
        document_type: file.type,
        blob_url: blobUrl,
        file_size: file.size,
        created_at: new Date().toISOString(),
      }

      setDocuments([...documents, newDoc])

      toast({
        title: "Success",
        description: "Document uploaded and analyzed successfully",
      })
    } catch (error) {
      console.error("[v0] Error uploading document:", error)
      setAnalysisError(error instanceof Error ? error.message : "Failed to process document")
      toast({
        title: "Error",
        description: "Failed to upload and analyze document",
        variant: "destructive",
      })
    } finally {
      setAnalyzing(false)
    }
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-4 md:space-y-6">
      <div>
        <div className="flex items-center gap-4 mb-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/tenders">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">{tender.title || "Custom Tender"}</h1>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge className="bg-primary/10 text-primary">Custom</Badge>
          {tender.category && <Badge variant="outline">{tender.category}</Badge>}
          {analysis && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              AI Analyzed
            </Badge>
          )}
        </div>
        {tender.description && <p className="text-muted-foreground mb-4">{tender.description}</p>}
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          {tender.organization && (
            <span className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              {tender.organization}
            </span>
          )}
          {tender.close_date && (
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              Closes: {new Date(tender.close_date).toLocaleDateString()}
            </span>
          )}
          {tender.value && (
            <span className="flex items-center gap-1">
              <span>Value: {tender.value}</span>
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

      {analysisError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{analysisError}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="details" className="space-y-4 md:space-y-6">
        <TabsList>
          <TabsTrigger value="details">
            <FileText className="h-4 w-4 mr-2" />
            Tender Details
          </TabsTrigger>
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

        <TabsContent value="details" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tender Information</CardTitle>
              <CardDescription>
                {analysis
                  ? "These fields were automatically filled from your uploaded document. Review and edit as needed."
                  : "Basic information about the tender"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Tender Title</Label>
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
                  placeholder="e.g., Department of Health"
                  value={formData.organization}
                  onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="close_date">Deadline</Label>
                  <Input
                    id="close_date"
                    type="date"
                    value={formData.close_date}
                    onChange={(e) => setFormData({ ...formData, close_date: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="value">Tender Value</Label>
                  <Input
                    id="value"
                    placeholder="e.g., R 2,500,000"
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <Button onClick={handleSave} disabled={saving}>
                <Save className="h-4 w-4 mr-2" />
                {saving ? "Saving..." : "Save Details"}
              </Button>
            </CardContent>
          </Card>

          {documents.length === 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Upload Tender Document</CardTitle>
                <CardDescription>Upload a PDF document to generate the response form automatically</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <Label
                    htmlFor="pdf-upload"
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md cursor-pointer hover:bg-primary/90 transition-colors"
                  >
                    <Upload className="h-4 w-4" />
                    {uploadedFile ? "Change Document" : "Upload PDF"}
                  </Label>
                  <Input
                    id="pdf-upload"
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  {uploadedFile && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <FileText className="h-4 w-4" />
                      {uploadedFile.name}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {analysis && (
          <TabsContent value="analysis" className="space-y-4">
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
                    {analysis.keyRequirements.map((req: string, idx: number) => (
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
                    {analysis.deadlines.map((deadline: string, idx: number) => (
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
                    {analysis.actionableTasks.map((task: any, idx: number) => (
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
                    {analysis.recommendations.map((rec: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Sparkles className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        )}

        <TabsContent value="documents" className="space-y-4">
          {documents.length > 0 ? (
            <div className="grid gap-4">
              {documents.map((doc: any) => (
                <Card key={doc.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{doc.document_name || doc.file_name}</CardTitle>
                        <CardDescription className="mt-1">
                          {doc.document_type || doc.file_type} • {((doc.file_size || 0) / 1024 / 1024).toFixed(2)} MB
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" asChild>
                          <a href={doc.blob_url || doc.storage_path} download>
                            <Download className="h-4 w-4 mr-2" />
                            Download
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
                <p className="text-muted-foreground mb-4">No documents uploaded yet</p>
                <Label
                  htmlFor="pdf-upload-docs"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md cursor-pointer hover:bg-primary/90 transition-colors"
                >
                  <Upload className="h-4 w-4" />
                  Upload PDF
                </Label>
                <Input
                  id="pdf-upload-docs"
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {analysis?.formFields && analysis.formFields.length > 0 && (
          <TabsContent value="form" className="space-y-4 md:space-y-6">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                This form was automatically generated from the tender documents. Fill in all required fields and save
                your progress as you go.
              </AlertDescription>
            </Alert>
            <DynamicTenderForm
              tenderId={tenderId}
              formFields={analysis.formFields}
              documents={documents}
              tenderData={{
                id: tenderId,
                title: tender.title,
                source_name: tender.organization,
                description: tender.description,
                close_date: tender.close_date,
                estimated_value: tender.value,
                category: tender.category,
              }}
            />
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}
