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
      console.log("[v0] ================================================")
      console.log("[v0] STARTING CUSTOM TENDER UPLOAD PROCESS")
      console.log("[v0] ================================================")
      console.log("[v0] File name:", file.name)
      console.log("[v0] File size:", (file.size / 1024 / 1024).toFixed(2), "MB")

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
        throw new Error("Failed to upload file to storage")
      }

      const { url } = await blobResponse.json()
      console.log("[v0] ✓ File uploaded to blob successfully")
      console.log("[v0] Blob URL:", url)
      setBlobUrl(url)

      console.log("[v0] Step 2: Extracting text from PDF with PDF.js...")
      let extractedText = ""
      let textExtractionSuccess = false

      try {
        const pdfjsLib = await import("pdfjs-dist")
        // Use the npm package version worker
        pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.379/pdf.worker.min.js`

        const fileBuffer = await file.arrayBuffer()
        console.log("[v0] Loading PDF document...")
        const pdf = await pdfjsLib.getDocument({ data: fileBuffer }).promise

        console.log("[v0] ✓ PDF loaded, total pages:", pdf.numPages)

        // Extract text from all pages
        for (let i = 1; i <= pdf.numPages; i++) {
          console.log("[v0] Extracting text from page", i, "/", pdf.numPages)
          const page = await pdf.getPage(i)
          const textContent = await page.getTextContent()
          const pageText = textContent.items.map((item: any) => item.str).join(" ")
          extractedText += `\n${pageText}\n`
        }

        console.log("[v0] ✓ Text extraction complete")
        console.log("[v0] Extracted text length:", extractedText.length, "characters")

        if (extractedText.trim().length > 100) {
          textExtractionSuccess = true
          console.log("[v0] ✓ Sufficient text extracted")
        } else {
          console.warn("[v0] ⚠ Very little text extracted - PDF might be scanned")
        }
      } catch (extractError: any) {
        console.error("[v0] ❌ PDF text extraction failed:")
        console.error("[v0] Error type:", extractError.name)
        console.error("[v0] Error message:", extractError.message)
        console.error("[v0] This might be a scanned PDF or image-based document")
      }

      toast({
        title: "Analyzing Document",
        description: "AI is extracting tender details...",
      })

      console.log("[v0] Step 3: Analyzing document with AI...")
      console.log("[v0] Sending to analyze-tender API:")
      console.log("[v0] - Has blob URL:", !!url)
      console.log("[v0] - Has extracted text:", textExtractionSuccess)
      console.log("[v0] - Text length:", extractedText.length)

      const analysisResponse = await fetch("/api/analyze-tender", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          documentText: extractedText,
          documentUrl: url, // Send as fallback
        }),
      })

      console.log("[v0] Analyze API response status:", analysisResponse.status)

      if (!analysisResponse.ok) {
        const errorData = await analysisResponse.json().catch(() => ({ error: "Unknown error" }))
        console.error("[v0] ❌ Analysis API error:")
        console.error("[v0] Status:", analysisResponse.status)
        console.error("[v0] Error:", errorData)
        throw new Error(
          errorData.error || errorData.details || `Analysis failed with status ${analysisResponse.status}`,
        )
      }

      const analysisData = await analysisResponse.json()
      console.log("[v0] ✓ Analysis complete successfully")
      console.log("[v0] Analysis has tender_summary:", !!analysisData.tender_summary)
      console.log("[v0] Analysis has formFields:", analysisData.formFields?.length || 0)
      setAnalysis(analysisData)

      console.log("[v0] Step 4: Creating tender record with analysis...")

      const result = await createCustomTender({
        title: analysisData.tender_summary?.title || file.name.replace(".pdf", ""),
        organization: analysisData.tender_summary?.entity || "Unknown Organization",
        deadline: analysisData.tender_summary?.closing_date || "",
        value: analysisData.tender_summary?.contract_duration || "",
        description: analysisData.tender_summary?.description || "",
        category: "Custom",
        uploadedFile: file,
        analysis: analysisData, // Pass the full analysis
      })

      console.log("[v0] createCustomTender result:", result)

      if (result.success) {
        console.log("[v0] ✓ Tender created successfully")
        console.log("[v0] Tender ID:", result.tenderId)
        console.log("[v0] Document saved:", result.documentSaved)
        console.log("[v0] Analysis saved:", result.analysisSaved)

        if (result.documentError) {
          console.warn("[v0] Document error:", result.documentError)
        }
        if (result.analysisError) {
          console.warn("[v0] Analysis error:", result.analysisError)
        }

        toast({
          title: "Tender Created Successfully",
          description: "AI has analyzed your document and extracted all details.",
        })

        console.log("[v0] Redirecting to:", `/dashboard/custom-tenders/${result.tenderId}`)
        router.push(`/dashboard/custom-tenders/${result.tenderId}`)
      } else {
        console.error("[v0] ❌ Tender creation failed:", result.error)
        throw new Error(result.error || "Failed to create tender")
      }
    } catch (error: any) {
      console.error("[v0] ================================================")
      console.error("[v0] ❌ UPLOAD PROCESS FAILED")
      console.error("[v0] ================================================")
      console.error("[v0] Error:", error)
      console.error("[v0] Error message:", error.message)
      console.error("[v0] Error stack:", error.stack)

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
