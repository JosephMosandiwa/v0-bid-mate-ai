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
import { uploadTemporaryDocument } from "@/app/actions/document-actions"
import { useToast } from "@/hooks/use-toast"
import { MultiEngineProgress } from "@/components/engines/multi-engine-progress"

export default function NewTenderPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [blobUrl, setBlobUrl] = useState<string | null>(null)
  const [analysis, setAnalysis] = useState<any>(null)
  const [orchestrationId, setOrchestrationId] = useState<string | null>(null)
  const [tenderId, setTenderId] = useState<string | null>(null)

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

      console.log("[v0] Step 1: Uploading PDF to Supabase storage...")
      const uploadFormData = new FormData()
      uploadFormData.append("file", file)

      // Use the existing action or a new one? 
      // I'll assume I'm creating 'uploadTemporaryDocument' in document-actions.ts correctly next.
      // But verify I can import it.
      // For now, I'll keep the logic here but call a new API route /api/tenders/upload-temp to be safe/consistent with fetch?
      // No, server actions are better.
      // Let's import { uploadTemporaryDocument } from "@/app/actions/document-actions"

      const uploadResult = await uploadTemporaryDocument(uploadFormData)

      if (!uploadResult.success || !uploadResult.url) {
        throw new Error(uploadResult.error || "Failed to upload file")
      }

      console.log("[v0] ✓ File uploaded successfully")
      console.log("[v0] URL:", uploadResult.url)
      setBlobUrl(uploadResult.url)
      const url = uploadResult.url // local var for next steps

      toast({
        title: "Analyzing Document",
        description: "AI is reading and analyzing your tender document...",
      })

      console.log("[v0] Step 2: Sending PDF to AI for direct analysis...")
      console.log("[v0] Requesting analysis via API...")

      const analysisResponse = await fetch("/api/analyze-tender", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          documentUrl: url,
          documentText: "", // Let the API handle PDF reading
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
      console.log("[v0] Analysis keys:", Object.keys(analysisData))
      console.log("[v0] Full analysis structure:", JSON.stringify(analysisData, null, 2))
      console.log("[v0] Analysis has tender_summary:", !!analysisData.tender_summary)
      console.log("[v0] Analysis has formFields:", analysisData.formFields?.length || 0)
      setAnalysis(analysisData)

      console.log("[v0] Step 3: Creating tender record with analysis...")

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

      console.log("[v0] createCustomTender result:", result)

      if (result.success) {
        console.log("[v0] ✓ Tender created successfully")
        console.log("[v0] Tender ID:", result.tenderId)
        console.log("[v0] Orchestration ID:", result.orchestrationId)
        console.log("[v0] Document saved:", result.documentSaved)
        console.log("[v0] Analysis saved:", result.analysisSaved)

        if (result.documentError) {
          console.warn("[v0] Document error:", result.documentError)
        }
        if (result.analysisError) {
          console.warn("[v0] Analysis error:", result.analysisError)
        }

        // Save tender and orchestration IDs to show progress
        setTenderId(result.tenderId)
        if (result.orchestrationId) {
          setOrchestrationId(result.orchestrationId)
          toast({
            title: "Tender Created Successfully",
            description: "Multi-engine analysis is running in the background...",
          })
        } else {
          toast({
            title: "Tender Created Successfully",
            description: "AI has analyzed your document and extracted all details.",
          })
          // No orchestration - redirect immediately
          console.log("[v0] Redirecting to:", `/dashboard/tenders/${result.tenderId}`)
          router.push(`/dashboard/tenders/${result.tenderId}`)
        }
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
                className={`flex items-center gap-2 px-4 py-2 rounded-md cursor-pointer transition-colors ${loading
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

            {uploadedFile && !loading && analysis && !orchestrationId && (
              <Alert className="border-green-500/50 bg-green-500/10">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <AlertDescription className="text-green-500">
                  Document analyzed successfully! AI has extracted all tender details.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Multi-Engine Progress Tracker */}
      {orchestrationId && tenderId && (
        <div className="max-w-3xl space-y-4">
          <MultiEngineProgress
            orchestrationId={orchestrationId}
            onComplete={() => {
              toast({
                title: "Analysis Complete",
                description: "All AI engines have finished processing your tender.",
              })
              // Redirect to tender detail page after a short delay
              setTimeout(() => {
                router.push(`/dashboard/tenders/${tenderId}`)
              }, 2000)
            }}
          />

          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              You can navigate away - analysis will continue in the background
            </p>
            <Button
              variant="outline"
              onClick={() => router.push(`/dashboard/tenders/${tenderId}`)}
            >
              View Tender Details
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
