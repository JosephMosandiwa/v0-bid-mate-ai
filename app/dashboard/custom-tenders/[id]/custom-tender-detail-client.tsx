"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Save, FileText, Sparkles, Upload, Loader2, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { DynamicTenderForm } from "@/components/dynamic-tender-form"

interface CustomTenderDetailClientProps {
  tender: any
  documents: any[]
  analysis: any
}

export function CustomTenderDetailClient({ tender, documents, analysis }: CustomTenderDetailClientProps) {
  const { toast } = useToast()
  const tenderId = tender.tender_id

  const [formData, setFormData] = useState({
    title: tender.title || "",
    organization: tender.organization || "",
    deadline: tender.deadline || "",
    value: tender.value || "",
    description: tender.description || "",
    location: tender.location || "",
  })
  const [saving, setSaving] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [localAnalysis, setLocalAnalysis] = useState(analysis)
  const [localDocuments, setLocalDocuments] = useState(documents)
  const [analysisError, setAnalysisError] = useState<string | null>(null)

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
      setLocalAnalysis(analysisResult)

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

      const docData = {
        tender_id: tenderId,
        file_name: file.name,
        file_type: file.type,
        file_size: file.size,
        blob_url: blobUrl,
      }

      setLocalDocuments([...localDocuments, docData])

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
    <div className="p-6 md:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/tenders">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Custom Tender</h1>
            <p className="text-muted-foreground">Review details and fill in the tender form</p>
          </div>
        </div>
        {localAnalysis && (
          <Badge variant="secondary" className="flex items-center gap-1">
            <Sparkles className="h-3 w-3" />
            AI Analyzed
          </Badge>
        )}
      </div>

      <Card className="border-border">
        <CardHeader>
          <CardTitle>Tender Details</CardTitle>
          <CardDescription>
            {localAnalysis
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
              <Label htmlFor="deadline">Deadline</Label>
              <Input
                id="deadline"
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
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
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              placeholder="e.g., Gauteng, South Africa"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
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

      {localDocuments.length === 0 && (
        <Card className="border-border">
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

            {analyzing && (
              <Alert>
                <Loader2 className="h-4 w-4 animate-spin" />
                <AlertDescription>Analyzing tender document...</AlertDescription>
              </Alert>
            )}

            {analysisError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{analysisError}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}

      {localDocuments.length > 0 && (
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Documents</CardTitle>
            <CardDescription>Uploaded tender documents</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {localDocuments.map((doc, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{doc.file_name}</p>
                      <p className="text-sm text-muted-foreground">{(doc.file_size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" asChild className="bg-transparent">
                    <a href={doc.blob_url} target="_blank" rel="noopener noreferrer">
                      View
                    </a>
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {localAnalysis && localAnalysis.formFields && localAnalysis.formFields.length > 0 && (
        <DynamicTenderForm
          tenderId={tenderId}
          tenderTitle={tender.title}
          analysis={localAnalysis}
          documents={localDocuments}
        />
      )}

      {!localAnalysis && !analyzing && (
        <Card className="border-border">
          <CardContent className="p-12 text-center">
            <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground mb-4">Upload a tender document to generate the response form</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
