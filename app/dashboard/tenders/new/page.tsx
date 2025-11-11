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
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [blobUrl, setBlobUrl] = useState<string | null>(null)
  const [analysis, setAnalysis] = useState<any>(null)

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
    setLoading(true)

    try {
      console.log("[v0] Step 1: Uploading PDF to blob storage...")

      const uploadFormData = new FormData()
      uploadFormData.append("file", file)

      const blobResponse = await fetch("/api/upload-to-blob", {
        method: "POST",
        body: uploadFormData,
      })

      if (!blobResponse.ok) {
        const errorText = await blobResponse.text()
        console.error("[v0] Blob upload error:", errorText)
        throw new Error("Failed to upload file")
      }

      const { url } = await blobResponse.json()
      console.log("[v0] File uploaded to blob:", url)
      setBlobUrl(url)

      console.log("[v0] Step 1.5: Extracting text from PDF with PDF.js...")
      let extractedText = ""

      try {
        const pdfjsLib = await import("pdfjs-dist")
        // Use a stable, known-working version of the worker
        pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`

        const fileBuffer = await file.arrayBuffer()
        const pdf = await pdfjsLib.getDocument({ data: fileBuffer }).promise

        console.log("[v0] PDF loaded successfully, pages:", pdf.numPages)

        // Extract text from all pages
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i)
          const textContent = await page.getTextContent()
          const pageText = textContent.items.map((item: any) => item.str).join(" ")
          extractedText += `\n--- Page ${i} ---\n${pageText}`
        }

        console.log("[v0] Successfully extracted text, length:", extractedText.length, "characters")
      } catch (extractError: any) {
        console.warn("[v0] PDF text extraction failed:", extractError.message)
        console.warn("[v0] Continuing with document URL only...")
        // Continue without text - API will handle it
      }

      toast({
        title: "Analyzing Document",
        description: "AI is extracting tender details...",
      })

      console.log("[v0] Step 2: Analyzing document with AI...")
      const analysisResponse = await fetch("/api/analyze-tender", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          documentUrl: url,
          documentText: extractedText, // Send extracted text instead of empty string
        }),
      })

      if (!analysisResponse.ok) {
        const errorData = await analysisResponse.json().catch(() => ({ error: "Unknown error" }))
        console.error("[v0] Analysis error:", errorData)
        throw new Error(errorData.error || `Analysis failed with status ${analysisResponse.status}`)
      }

      const analysisData = await analysisResponse.json()
      console.log("[v0] Analysis complete")
      setAnalysis(analysisData)

      console.log("[v0] Step 3: Creating tender record...")

      const result = await createCustomTender({
        title: analysisData.tender_summary?.title || file.name.replace(".pdf", ""),
        organization: analysisData.tender_summary?.entity || "Unknown Organization",
        deadline: analysisData.tender_summary?.closing_date || "",
        value: analysisData.tender_summary?.contract_duration || "",
        description: analysisData.tender_summary?.description || "",
        category: "Custom",
        uploadedFile: file,
        analysis: analysisData,
      })

      if (result.success) {
        toast({
          title: "Tender Created Successfully",
          description: "AI has analyzed your document and extracted all details.",
        })

        router.push(`/dashboard/custom-tenders/${result.tenderId}`)
      } else {
        throw new Error(result.error || "Failed to create tender")
      }
    } catch (error: any) {
      console.error("[v0] Error during upload/analysis:", error)

      toast({
        title: "Upload Failed",
        description: error.message || "Could not process the document. Please try again.",
        variant: "destructive",
      })

      setUploadedFile(null)
      setBlobUrl(null)
      setAnalysis(null)
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
                  loading
                    ? "bg-muted text-muted-foreground cursor-not-allowed"
                    : "bg-primary text-primary-foreground hover:bg-primary/90"
                }`}
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                {loading ? "Processing..." : uploadedFile ? "Change Document" : "Upload PDF"}
              </Label>
              <Input
                id="pdf-upload"
                type="file"
                accept="application/pdf"
                onChange={handleFileUpload}
                className="hidden"
                disabled={loading}
              />
              {uploadedFile && !loading && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <FileText className="h-4 w-4" />
                  {uploadedFile.name}
                </div>
              )}
            </div>

            {loading && (
              <Alert className="border-blue-500/50 bg-blue-500/10">
                <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
                <AlertDescription className="text-blue-500">
                  Processing your tender document... This may take a moment.
                </AlertDescription>
              </Alert>
            )}

            {uploadedFile && !loading && analysis && (
              <Alert className="border-green-500/50 bg-green-500/10">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <AlertDescription className="text-green-500">
                  Document analyzed successfully! Redirecting to tender details...
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
