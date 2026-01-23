"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Upload, FileText, CheckCircle2, Loader2, FileSearch, Brain, Database, Sparkles } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { createCustomTender } from "@/app/actions/tender-actions"
import { useToast } from "@/hooks/use-toast"

export default function NewTenderPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([])
  const [analysis, setAnalysis] = useState<any>(null)
  const [uploadProgress, setUploadProgress] = useState<string>("")
  const [currentStep, setCurrentStep] = useState<number>(0)
  const [processingSteps, setProcessingSteps] = useState<{
    upload: "pending" | "processing" | "complete" | "error"
    extract: "pending" | "processing" | "complete" | "error"
    analyze: "pending" | "processing" | "complete" | "error"
    save: "pending" | "processing" | "complete" | "error"
  }>({
    upload: "pending",
    extract: "pending",
    analyze: "pending",
    save: "pending",
  })

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    // Validate all files are PDFs
    const invalidFiles = files.filter(f => f.type !== "application/pdf")
    if (invalidFiles.length > 0) {
      toast({
        title: "Invalid File Type",
        description: "All files must be PDFs",
        variant: "destructive",
      })
      return
    }

    setUploadedFiles(files)
    setLoading(true)
    setCurrentStep(1)
    setProcessingSteps({
      upload: "processing",
      extract: "pending",
      analyze: "pending",
      save: "pending",
    })
    setUploadProgress(`Uploading ${files.length} document(s)...`)

    try {
      console.log("[v0] ================================================")
      console.log("[v0] STARTING CUSTOM TENDER UPLOAD PROCESS")
      console.log("[v0] ================================================")
      files.forEach(file => {
        console.log("[v0] File name:", file.name)
        console.log("[v0] File size:", (file.size / 1024 / 1024).toFixed(2), "MB")
      })

      console.log("[v0] Step 1: Uploading PDFs to blob storage...")
      const uploadedDocUrls: string[] = []
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        setUploadProgress(`Uploading document ${i + 1} of ${files.length}: ${file.name}`)
        
        const uploadFormData = new FormData()
        uploadFormData.append("file", file)

        const blobResponse = await fetch("/api/upload-to-blob", {
          method: "POST",
          body: uploadFormData,
        })

        if (!blobResponse.ok) {
          const errorText = await blobResponse.text()
          console.error("[v0] Blob upload error:", errorText)
          throw new Error(`Failed to upload file: ${file.name}`)
        }

        const { url } = await blobResponse.json()
        console.log(`[v0] ✓ File ${i + 1} uploaded:`, file.name)
        uploadedDocUrls.push(url)
      }
      
      console.log("[v0] ✓ All files uploaded to blob successfully")
      setUploadedUrls(uploadedDocUrls)
      setProcessingSteps(prev => ({ ...prev, upload: "complete", extract: "processing" }))
      setCurrentStep(2)
      
      // Use the first document for analysis (main tender document)
      const primaryDocUrl = uploadedDocUrls[0]

      setUploadProgress("Extracting text from document...")
      toast({
        title: "Reading Document",
        description: "Extracting text and identifying document structure...",
      })

      console.log("[v0] Step 2: Sending primary PDF to AI for analysis...")
      console.log("[v0] Primary document URL:", primaryDocUrl)

      const analysisResponse = await fetch("/api/analyze-tender", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          documentUrl: primaryDocUrl,
          documentText: "",
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

      // Update to analyzing step
      setProcessingSteps(prev => ({ ...prev, extract: "complete", analyze: "processing" }))
      setCurrentStep(3)
      setUploadProgress("AI is analyzing tender requirements...")
      toast({
        title: "Analyzing Tender",
        description: "AI is extracting requirements, BOQ, and compliance details...",
      })

      const analysisData = await analysisResponse.json()
      console.log("[v0] ✓ Analysis complete successfully")
      console.log("[v0] Analysis keys:", Object.keys(analysisData))
      setAnalysis(analysisData)

      // Update to saving step
      setProcessingSteps(prev => ({ ...prev, analyze: "complete", save: "processing" }))
      setCurrentStep(4)
      setUploadProgress("Saving tender to your workspace...")
      console.log("[v0] Step 3: Creating tender record with analysis...")

const result = await createCustomTender({
        title: analysisData.tender_summary?.title || files[0].name.replace(".pdf", ""),
        organization: analysisData.tender_summary?.entity || "Unknown Organization",
        deadline: analysisData.tender_summary?.closing_date || "",
        value: analysisData.tender_summary?.contract_duration || "",
        description: analysisData.tender_summary?.description || "",
        category: "Custom",
        uploadedFiles: files,
        uploadedUrls: uploadedDocUrls,
        analysis: analysisData,
      })

      console.log("[v0] createCustomTender result:", result)

      if (result.success) {
        console.log("[v0] ✓ Tender created successfully")
        console.log("[v0] Tender ID:", result.tenderId)
        
        setProcessingSteps(prev => ({ ...prev, save: "complete" }))
        setCurrentStep(5)
        setUploadProgress("Complete! Redirecting to tender details...")

        toast({
          title: "Tender Created Successfully",
          description: "AI has analyzed your document and extracted all details.",
        })

        // Brief delay to show completion state
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        console.log("[v0] Redirecting to:", `/dashboard/tenders/${result.tenderId}?type=custom`)
        router.push(`/dashboard/tenders/${result.tenderId}?type=custom`)
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

      // Mark current step as error
      setProcessingSteps(prev => {
        const newSteps = { ...prev }
        if (prev.upload === "processing") newSteps.upload = "error"
        if (prev.extract === "processing") newSteps.extract = "error"
        if (prev.analyze === "processing") newSteps.analyze = "error"
        if (prev.save === "processing") newSteps.save = "error"
        return newSteps
      })

      setUploadedFiles([])
      setUploadedUrls([])
      setAnalysis(null)
      setUploadProgress(error.message || "An error occurred")
    } finally {
      setLoading(false)
      // Reset step state after a delay if there was an error
      setTimeout(() => {
        setProcessingSteps({
          upload: "pending",
          extract: "pending",
          analyze: "pending",
          save: "pending",
        })
        setCurrentStep(0)
      }, 5000)
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
                {loading ? "Processing..." : uploadedFiles.length > 0 ? "Change Documents" : "Upload PDFs"}
              </Label>
              <Input
                id="pdf-upload"
                type="file"
                accept="application/pdf"
                multiple
                onChange={handleFileUpload}
                className="hidden"
                disabled={loading}
              />
              {uploadedFiles.length > 0 && !loading && (
                <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                  {uploadedFiles.map((file, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      {file.name}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {loading && (
              <div className="space-y-6 p-6 border rounded-lg bg-muted/30">
                {/* Progress bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{uploadProgress}</span>
                    <span className="text-muted-foreground">{Math.min(currentStep * 25, 100)}%</span>
                  </div>
                  <Progress value={Math.min(currentStep * 25, 100)} className="h-2" />
                </div>

                {/* Step indicators */}
                <div className="grid grid-cols-4 gap-4">
                  {/* Step 1: Upload */}
                  <div className={`flex flex-col items-center gap-2 p-3 rounded-lg transition-colors ${
                    processingSteps.upload === "complete" ? "bg-green-500/10" :
                    processingSteps.upload === "processing" ? "bg-blue-500/10" : "bg-muted/50"
                  }`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      processingSteps.upload === "complete" ? "bg-green-500 text-white" :
                      processingSteps.upload === "processing" ? "bg-blue-500 text-white" : "bg-muted"
                    }`}>
                      {processingSteps.upload === "complete" ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : processingSteps.upload === "processing" ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <Upload className="h-5 w-5" />
                      )}
                    </div>
                    <span className="text-xs font-medium text-center">Upload</span>
                  </div>

                  {/* Step 2: Extract */}
                  <div className={`flex flex-col items-center gap-2 p-3 rounded-lg transition-colors ${
                    processingSteps.extract === "complete" ? "bg-green-500/10" :
                    processingSteps.extract === "processing" ? "bg-blue-500/10" : "bg-muted/50"
                  }`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      processingSteps.extract === "complete" ? "bg-green-500 text-white" :
                      processingSteps.extract === "processing" ? "bg-blue-500 text-white" : "bg-muted"
                    }`}>
                      {processingSteps.extract === "complete" ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : processingSteps.extract === "processing" ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <FileSearch className="h-5 w-5" />
                      )}
                    </div>
                    <span className="text-xs font-medium text-center">Extract Text</span>
                  </div>

                  {/* Step 3: Analyze */}
                  <div className={`flex flex-col items-center gap-2 p-3 rounded-lg transition-colors ${
                    processingSteps.analyze === "complete" ? "bg-green-500/10" :
                    processingSteps.analyze === "processing" ? "bg-blue-500/10" : "bg-muted/50"
                  }`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      processingSteps.analyze === "complete" ? "bg-green-500 text-white" :
                      processingSteps.analyze === "processing" ? "bg-blue-500 text-white" : "bg-muted"
                    }`}>
                      {processingSteps.analyze === "complete" ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : processingSteps.analyze === "processing" ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <Brain className="h-5 w-5" />
                      )}
                    </div>
                    <span className="text-xs font-medium text-center">AI Analysis</span>
                  </div>

                  {/* Step 4: Save */}
                  <div className={`flex flex-col items-center gap-2 p-3 rounded-lg transition-colors ${
                    processingSteps.save === "complete" ? "bg-green-500/10" :
                    processingSteps.save === "processing" ? "bg-blue-500/10" : "bg-muted/50"
                  }`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      processingSteps.save === "complete" ? "bg-green-500 text-white" :
                      processingSteps.save === "processing" ? "bg-blue-500 text-white" : "bg-muted"
                    }`}>
                      {processingSteps.save === "complete" ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : processingSteps.save === "processing" ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <Database className="h-5 w-5" />
                      )}
                    </div>
                    <span className="text-xs font-medium text-center">Save Tender</span>
                  </div>
                </div>

                {/* What's happening description */}
                <div className="flex items-start gap-3 p-4 rounded-lg bg-blue-500/5 border border-blue-500/20">
                  <Sparkles className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    {processingSteps.upload === "processing" && (
                      <p>Securely uploading your tender document to cloud storage...</p>
                    )}
                    {processingSteps.extract === "processing" && (
                      <p>Reading the PDF and extracting all text content, including from images and tables...</p>
                    )}
                    {processingSteps.analyze === "processing" && (
                      <p>AI is analyzing the tender to extract requirements, evaluation criteria, BOQ, compliance needs, and creating a project plan...</p>
                    )}
                    {processingSteps.save === "processing" && (
                      <p>Saving the tender and all extracted information to your workspace...</p>
                    )}
                    {processingSteps.save === "complete" && (
                      <p className="text-green-600">All done! Redirecting you to the tender details page...</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {uploadedFiles.length > 0 && !loading && analysis && (
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
