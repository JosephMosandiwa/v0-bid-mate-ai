"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Upload, FileText, CheckCircle2, Loader2 } from "lucide-react"
import Link from "next/link"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { createCustomTender } from "@/app/actions/tender-actions"
import { useToast } from "@/hooks/use-toast"

export default function NewTenderPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [analysis, setAnalysis] = useState<any>(null)

  const [formData, setFormData] = useState({
    title: "",
    organization: "",
    deadline: "",
    value: "",
    description: "",
  })

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.type !== "application/pdf") {
      toast({
        title: "Invalid File Type",
        description: "Please upload a PDF file",
        variant: "destructive",
      })
      return
    }

    setUploadedFile(file)
    setAnalyzing(true)

    toast({
      title: "Analyzing Document",
      description: "AI is extracting tender details from your PDF...",
    })

    try {
      console.log("[v0] Starting PDF upload and analysis...")

      // Upload to /api/custom-tenders/upload which handles everything
      const uploadFormData = new FormData()
      uploadFormData.append("file", file)
      uploadFormData.append("title", file.name.replace(".pdf", ""))
      uploadFormData.append("description", "Uploaded tender document")

      const uploadResponse = await fetch("/api/custom-tenders/upload", {
        method: "POST",
        body: uploadFormData,
      })

      if (!uploadResponse.ok) {
        const error = await uploadResponse.json()
        throw new Error(error.error || "Upload failed")
      }

      const result = await uploadResponse.json()
      console.log("[v0] Upload and analysis complete:", result)

      // Redirect to the created tender
      toast({
        title: "Tender Created Successfully",
        description: "AI has analyzed your document and extracted all details.",
      })

      router.push(`/dashboard/custom-tenders/${result.tender.id}`)
    } catch (error: any) {
      console.error("[v0] Upload/analysis error:", error)

      toast({
        title: "Analysis Failed",
        description: error.message || "Could not analyze the document. Please try again.",
        variant: "destructive",
      })

      // Reset file so user can try again
      setUploadedFile(null)
      setAnalyzing(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const result = await createCustomTender({
        title: formData.title,
        organization: formData.organization,
        deadline: formData.deadline,
        value: formData.value,
        description: formData.description,
        uploadedFile: uploadedFile || undefined,
        analysis: analysis || undefined,
      })

      if (result.success) {
        let description = "Your custom tender has been added to My Tenders with status 'in-progress'"

        if (result.documentError) {
          description += `\n\nDocument Error: ${result.documentError}`
        } else if (result.documentSaved) {
          description += "\n\nDocument uploaded successfully"
        }

        if (result.analysisError) {
          description += `\n\nAnalysis Error: ${result.analysisError}`
        } else if (result.analysisSaved) {
          description += "\n\nAnalysis saved successfully"
        }

        toast({
          title: "Tender Created",
          description,
        })

        router.push(`/dashboard/custom-tenders/${result.tenderId}`)
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to create tender",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create tender: " + (error as Error).message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/tenders">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Create New Tender</h1>
          <p className="text-muted-foreground">Upload a tender document for automatic AI analysis</p>
        </div>
      </div>

      <Card className="border-border max-w-3xl">
        <CardHeader>
          <CardTitle>Upload Tender Document</CardTitle>
          <CardDescription>
            Upload a PDF tender document - AI will automatically analyze and extract all details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Label
                htmlFor="pdf-upload"
                className={`flex items-center gap-2 px-4 py-2 rounded-md cursor-pointer transition-colors ${
                  analyzing
                    ? "bg-muted text-muted-foreground cursor-not-allowed"
                    : "bg-primary text-primary-foreground hover:bg-primary/90"
                }`}
              >
                {analyzing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                {analyzing ? "Analyzing..." : uploadedFile ? "Change Document" : "Upload PDF"}
              </Label>
              <Input
                id="pdf-upload"
                type="file"
                accept="application/pdf"
                onChange={handleFileUpload}
                className="hidden"
                disabled={analyzing}
              />
              {uploadedFile && !analyzing && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <FileText className="h-4 w-4" />
                  {uploadedFile.name}
                </div>
              )}
            </div>

            {analyzing && (
              <Alert className="border-blue-500/50 bg-blue-500/10">
                <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
                <AlertDescription className="text-blue-500">
                  Analyzing your tender document with AI... This may take a moment.
                </AlertDescription>
              </Alert>
            )}

            {uploadedFile && !analyzing && (
              <Alert className="border-green-500/50 bg-green-500/10">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <AlertDescription className="text-green-500">
                  PDF uploaded and analyzed successfully! You'll be redirected to the tender details page.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
