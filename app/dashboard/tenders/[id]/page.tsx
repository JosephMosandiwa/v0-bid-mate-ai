"use client"

import React from "react"
import { Suspense } from "react"
import { RefreshCw } from "lucide-react"; // Import RefreshCw here

import { useState, useEffect, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import {
  ArrowLeft,
  Building2,
  Calendar,
  FileText,
  Sparkles,
  Download,
  Upload,
  Trash2,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Clock,
  Calculator,
  Target,
  FormInput,
  LayoutDashboard,
  ClipboardCheck,
  FolderOpen,
  Award,
  Edit3,
  Save,
  MapPin,
  DollarSign,
  Phone,
  Mail,
  ExternalLink,
  ChevronRight,
} from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { TenderAnalysisDisplay } from "@/components/tender-analysis-display"
import { TenderBOQDisplay } from "@/components/tender-boq-display"
import { TenderProjectPlanDisplay } from "@/components/tender-project-plan-display"
import { TenderFillableForms } from "@/components/tender-fillable-forms"
import { TenderContextStrategistPanel } from "@/components/strategist/tender-context-panel"
import { TenderProgressTracker } from "@/components/tender/progress-tracker"

interface TenderDocument {
  id: string
  file_name?: string
  document_name?: string
  file_type?: string
  document_type?: string
  file_size?: number
  blob_url?: string
  original_url?: string
  storage_path?: string
  created_at?: string
  downloaded_at?: string
}

const Loading = () => null;

export default function UnifiedTenderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  
  const id = params.id as string
  const [tenderType, setTenderType] = useState<"scraped" | "custom" | null>(null);
  
  const [tender, setTender] = useState<any>(null)
  const [documents, setDocuments] = useState<TenderDocument[]>([])
  const [analysis, setAnalysis] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [analyzing, setAnalyzing] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [activeSection, setActiveSection] = useState("overview")
  const [detectedType, setDetectedType] = useState<"scraped" | "custom" | null>(null)
  const [formProgress, setFormProgress] = useState(0)
  
  const analysisInitiated = useRef(false)

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const type = searchParams.get("type") as "scraped" | "custom" | null;
    setTenderType(type);
  }, []);

  // Load tender data based on type
  useEffect(() => {
    loadTenderData()
  }, [id, tenderType])

  const loadTenderData = async () => {
    setLoading(true)
    try {
      // Try scraped tender first if no type specified or type is scraped
      if (!tenderType || tenderType === "scraped") {
        const scrapedResponse = await fetch(`/api/tenders/scraped/${id}`)
        if (scrapedResponse.ok) {
          const data = await scrapedResponse.json()
          if (data.tender) {
            setTender({ ...data.tender, tender_type: "scraped" })
            setAnalysis(data.analysis?.analysis_data || data.analysis || null)
            setDetectedType("scraped")
            await loadScrapedDocuments()
            setLoading(false)
            return
          }
        }
      }

      // Try custom tender
      if (!tenderType || tenderType === "custom") {
        const customResponse = await fetch(`/api/custom-tenders/${id}`)
        if (customResponse.ok) {
          const data = await customResponse.json()
          if (data.tender) {
            setTender({ ...data.tender, tender_type: "custom" })
            setAnalysis(data.analysis?.analysis_data || data.analysis || null)
            setDocuments(data.documents || [])
            setDetectedType("custom")
            setLoading(false)
            return
          }
        }
      }

      // Tender not found
      toast({
        title: "Tender Not Found",
        description: "The requested tender could not be found.",
        variant: "destructive",
      })
      router.push("/dashboard/tenders")
    } catch (error) {
      console.error("[v0] Error loading tender:", error)
      toast({
        title: "Error",
        description: "Failed to load tender details.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const loadScrapedDocuments = async () => {
    try {
      const response = await fetch(`/api/tenders/${id}/documents`)
      if (response.ok) {
        const data = await response.json()
        setDocuments(data.documents || [])
      }
    } catch (error) {
      console.error("[v0] Error loading documents:", error)
    }
  }

  // Auto-analyze if no analysis exists
  // For scraped tenders, we can analyze even without documents (from metadata)
  // For custom tenders, we need at least one document
  useEffect(() => {
    if (!loading && tender && !analysis && !analysisInitiated.current && !analyzing) {
      const canAnalyze = detectedType === "scraped" || documents.length > 0
      if (canAnalyze) {
        triggerAnalysis()
      }
    }
  }, [loading, tender, analysis, documents, detectedType])

  const triggerAnalysis = async (force = false) => {
    if (analysisInitiated.current || analyzing) return
    analysisInitiated.current = true
    setAnalyzing(true)

    try {
      let response: Response

      if (detectedType === "scraped") {
        // First, try to download any documents from source URLs if not already downloaded
        console.log("[v0] Checking for downloadable documents...")
        try {
          const downloadResponse = await fetch(`/api/tenders/scraped/${id}/download-documents`, {
            method: "POST",
          })
          if (downloadResponse.ok) {
            const downloadResult = await downloadResponse.json()
            if (downloadResult.downloaded > 0) {
              console.log("[v0] Downloaded", downloadResult.downloaded, "new documents")
              // Refresh documents list
              await loadScrapedDocuments()
            }
          }
        } catch (downloadError) {
          console.log("[v0] Document download skipped:", downloadError)
        }

        // Use the scraped tender analyze endpoint which handles OCR + AI analysis
        console.log("[v0] Triggering analysis for scraped tender:", id)
        response = await fetch(`/api/tenders/scraped/${id}/analyze`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ force }),
        })
      } else {
        // Custom tender - use document URL directly
        const firstDoc = documents[0]
        const documentUrl = firstDoc?.blob_url || firstDoc?.storage_path || firstDoc?.original_url
        
        if (!documentUrl) {
          console.error("[v0] No document URL available for analysis")
          setAnalyzing(false)
          return
        }

        console.log("[v0] Triggering analysis for custom tender:", id)
        response = await fetch("/api/analyze-tender", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ documentUrl }),
        })
      }

      if (response.ok) {
        const result = await response.json()
        const analysisResult = result.analysis || result
        setAnalysis(analysisResult)

        // Save analysis to database for custom tenders (scraped already saves)
        if (detectedType === "custom") {
          await fetch(`/api/custom-tenders/${id}/analysis`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ analysis: analysisResult }),
          })
        }

        toast({
          title: "Analysis Complete",
          description: result.fromMetadata 
            ? "Basic analysis created from tender metadata. Upload documents for full analysis."
            : "Tender document has been analyzed successfully.",
        })
      } else {
        const error = await response.json()
        throw new Error(error.error || "Analysis failed")
      }
    } catch (error) {
      console.error("[v0] Analysis error:", error)
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Failed to analyze tender document.",
        variant: "destructive",
      })
    } finally {
      setAnalyzing(false)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    setUploading(true)
    try {
      for (const file of files) {
        const formData = new FormData()
        formData.append("file", file)
        formData.append("tenderId", id)
        formData.append("tenderType", detectedType || "scraped")

        const response = await fetch("/api/upload-to-blob", {
          method: "POST",
          body: formData,
        })

        if (response.ok) {
          toast({
            title: "Document Uploaded",
            description: `${file.name} has been uploaded successfully.`,
          })
        }
      }
      
      // Reload documents
      if (detectedType === "scraped") {
        await loadScrapedDocuments()
      } else {
        await loadTenderData()
      }
    } catch (error) {
      console.error("[v0] Upload error:", error)
      toast({
        title: "Upload Failed",
        description: "Failed to upload document.",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
      e.target.value = ""
    }
  }

  const handleDownload = (doc: TenderDocument) => {
    const url = doc.blob_url || doc.storage_path || doc.original_url
    if (url) {
      window.open(url, "_blank")
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const endpoint = detectedType === "custom" 
        ? `/api/custom-tenders/${id}`
        : `/api/tenders/scraped/${id}`
      
      const response = await fetch(endpoint, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tender),
      })

      if (response.ok) {
        toast({
          title: "Saved",
          description: "Tender details saved successfully.",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save tender details.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  // Navigation sections
  const sections = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "analysis", label: "AI Analysis", icon: Sparkles },
    { id: "requirements", label: "Requirements", icon: ClipboardCheck },
    { id: "documents", label: "Documents", icon: FolderOpen },
    { id: "boq", label: "BOQ & Pricing", icon: Calculator, show: analysis?.boq?.found },
    { id: "project-plan", label: "Project Plan", icon: Target, show: analysis?.project_plan },
    { id: "forms", label: "Response Forms", icon: FormInput, show: analysis?.fillable_fields?.length > 0 },
  ].filter(s => s.show !== false)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Loading tender details...</p>
        </div>
      </div>
    )
  }

  if (!tender) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
          <h2 className="text-2xl font-semibold">Tender Not Found</h2>
          <p className="text-muted-foreground">This tender could not be loaded.</p>
          <Button asChild>
            <Link href="/dashboard/tenders">Back to Tenders</Link>
          </Button>
        </div>
      </div>
    )
  }

  // Extract key info from tender or analysis
  const tenderInfo = {
    title: tender.title || analysis?.tender_summary?.title || "Untitled Tender",
    organization: tender.organization || tender.source_name || analysis?.tender_summary?.entity || "Unknown Organization",
    reference: tender.tender_reference || analysis?.tender_summary?.tender_number || tender.id,
    closeDate: tender.close_date || tender.closing_date || analysis?.tender_summary?.closing_date,
    value: tender.estimated_value || tender.value || analysis?.tender_summary?.estimated_value,
    province: tender.province || tender.source_province || analysis?.tender_summary?.province,
    location: tender.location || tender.delivery_location,
    status: tender.status || "active",
    contactEmail: tender.contact_email || analysis?.tender_summary?.contact_email,
    contactPhone: tender.contact_phone || analysis?.tender_summary?.contact_phone,
    contactPerson: tender.contact_person || analysis?.tender_summary?.contact_person,
    description: tender.description || analysis?.tender_summary?.description,
    tenderUrl: tender.tender_url || tender.source_url,
  }

  const daysUntilClose = tenderInfo.closeDate 
    ? Math.ceil((new Date(tenderInfo.closeDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container max-w-7xl mx-auto p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
            <div className="space-y-1 min-w-0 flex-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <Button variant="ghost" size="sm" asChild className="h-auto p-0 hover:bg-transparent">
                  <Link href="/dashboard/tenders" className="flex items-center gap-1 hover:text-foreground">
                    <ArrowLeft className="h-4 w-4" />
                    <span className="hidden xs:inline">Back to Tenders</span>
                    <span className="xs:hidden">Back</span>
                  </Link>
                </Button>
                <span>/</span>
                <Badge variant="outline" className="capitalize">
                  {detectedType || "tender"}
                </Badge>
              </div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight line-clamp-2">{tenderInfo.title}</h1>
              <p className="text-sm sm:text-base text-muted-foreground truncate">{tenderInfo.organization}</p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  analysisInitiated.current = false
                  triggerAnalysis(true)
                }} 
                disabled={analyzing} 
                className="flex-1 sm:flex-none bg-transparent"
              >
                {analyzing ? <Loader2 className="h-4 w-4 animate-spin sm:mr-2" /> : <RefreshCw className="h-4 w-4 sm:mr-2" />}
                <span className="hidden sm:inline">{analyzing ? "Analyzing..." : "Analyze"}</span>
              </Button>
              <Button variant="outline" size="sm" onClick={handleSave} disabled={saving} className="flex-1 sm:flex-none bg-transparent">
                {saving ? <Loader2 className="h-4 w-4 animate-spin sm:mr-2" /> : <Save className="h-4 w-4 sm:mr-2" />}
                <span className="hidden sm:inline">Save</span>
              </Button>
              {tenderInfo.tenderUrl && (
                <Button variant="outline" size="sm" asChild className="flex-1 sm:flex-none bg-transparent">
                  <a href={tenderInfo.tenderUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 sm:mr-2" />
                    <span className="hidden sm:inline">Source</span>
                  </a>
                </Button>
              )}
            </div>
          </div>

          {/* Key Info Cards */}
          <div className="grid gap-2 sm:gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            <Card className="bg-background">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">Closing Date</p>
                    <p className="text-sm font-medium truncate">
                      {tenderInfo.closeDate ? new Date(tenderInfo.closeDate).toLocaleDateString() : "N/A"}
                    </p>
                    {daysUntilClose !== null && daysUntilClose > 0 && (
                      <p className={cn(
                        "text-xs",
                        daysUntilClose <= 7 ? "text-destructive" : daysUntilClose <= 14 ? "text-orange-500" : "text-muted-foreground"
                      )}>
                        {daysUntilClose} days left
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-background">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <DollarSign className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">Estimated Value</p>
                    <p className="text-sm font-medium truncate">{tenderInfo.value || "Not specified"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-background">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">Location</p>
                    <p className="text-sm font-medium truncate">{tenderInfo.province || tenderInfo.location || "N/A"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-background">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">Reference</p>
                    <p className="text-sm font-medium font-mono truncate">{tenderInfo.reference}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-background">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">Status</p>
                    <Badge variant="outline" className="capitalize mt-1">{tenderInfo.status}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Progress Tracker */}
          <div className="mt-4">
            <TenderProgressTracker 
              tenderId={id} 
              tenderType={detectedType || "scraped"} 
              progress={formProgress} 
            />
          </div>
        </div>
      </div>

      {/* Main Content with Sidebar */}
      <div className="flex flex-col md:flex-row">
        {/* Mobile Navigation - Horizontal scrollable tabs */}
        <div className="md:hidden border-b bg-muted/20 sticky top-0 z-10">
          <div className="p-2 flex gap-1 overflow-x-auto scrollbar-hide">
            {sections.map((section) => {
              const Icon = section.icon
              return (
                <Button
                  key={section.id}
                  variant={activeSection === section.id ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveSection(section.id)}
                  className="flex-shrink-0 text-xs px-2 py-1 h-8"
                >
                  <Icon className="h-3.5 w-3.5 mr-1" />
                  <span className="whitespace-nowrap">{section.label}</span>
                </Button>
              )
            })}
          </div>
        </div>

        {/* Desktop Sidebar Navigation */}
        <div className="w-56 border-r bg-muted/20 min-h-[calc(100vh-300px)] hidden md:block flex-shrink-0">
          <nav className="p-4 space-y-1 sticky top-0">
            {sections.map((section) => {
              const Icon = section.icon
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors",
                    activeSection === section.id
                      ? "bg-primary text-primary-foreground font-medium"
                      : "hover:bg-muted text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {section.label}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Content Area */}
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto min-w-0">
          <div className="max-w-5xl mx-auto space-y-4 sm:space-y-6">
            
            {/* Analyzing Alert */}
            {analyzing && (
              <Alert className="border-primary/50 bg-primary/5">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                <AlertTitle>Analyzing Tender Document</AlertTitle>
                <AlertDescription>
                  AI is reading and extracting all information from your tender documents. This may take a moment...
                </AlertDescription>
              </Alert>
            )}

            {/* Overview Section */}
            {activeSection === "overview" && (
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2">Tender Overview</h2>
                  <p className="text-sm sm:text-base text-muted-foreground">Key information and AI-powered insights</p>
                </div>

                {/* Description */}
                {tenderInfo.description && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Description</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{tenderInfo.description}</p>
                    </CardContent>
                  </Card>
                )}

                {/* Contact Information */}
                {(tenderInfo.contactPerson || tenderInfo.contactEmail || tenderInfo.contactPhone) && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Contact Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {tenderInfo.contactPerson && (
                        <div className="flex items-center gap-3">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{tenderInfo.contactPerson}</span>
                        </div>
                      )}
                      {tenderInfo.contactEmail && (
                        <div className="flex items-center gap-3">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <a href={`mailto:${tenderInfo.contactEmail}`} className="text-sm text-primary hover:underline">
                            {tenderInfo.contactEmail}
                          </a>
                        </div>
                      )}
                      {tenderInfo.contactPhone && (
                        <div className="flex items-center gap-3">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <a href={`tel:${tenderInfo.contactPhone}`} className="text-sm text-primary hover:underline">
                            {tenderInfo.contactPhone}
                          </a>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Quick Actions */}
                {analysis?.actionable_tasks && analysis.actionable_tasks.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Priority Actions</CardTitle>
                      <CardDescription>AI-recommended tasks to win this tender</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {analysis.actionable_tasks.slice(0, 5).map((task: any, index: number) => (
                          <div
                            key={index}
                            className="flex items-start gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                          >
                            <Badge
                              variant={
                                task.priority === "high" ? "destructive" :
                                task.priority === "medium" ? "default" : "secondary"
                              }
                              className="mt-0.5"
                            >
                              {task.priority}
                            </Badge>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm">{task.task}</p>
                              {task.rationale && (
                                <p className="text-xs text-muted-foreground mt-1">{task.rationale}</p>
                              )}
                            </div>
                            <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Tender Strategist Panel */}
                <TenderContextStrategistPanel
                  tender={{
                    id: id,
                    title: tenderInfo.title,
                    organization: tenderInfo.organization,
                    description: tenderInfo.description,
                    deadline: tenderInfo.closeDate,
                    value: tenderInfo.value,
                    requirements: analysis?.compliance_summary?.requirements,
                    analysis: analysis,
                  }}
                />
              </div>
            )}

            {/* AI Analysis Section */}
            {activeSection === "analysis" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">AI Analysis</h2>
                  <p className="text-muted-foreground">Comprehensive breakdown of tender requirements and opportunities</p>
                </div>
                
                {analysis ? (
                  <TenderAnalysisDisplay analysis={analysis} tender={tender} />
                ) : (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No Analysis Available</h3>
                      <p className="text-muted-foreground mb-4">
                        Upload a tender document to get AI-powered analysis
                      </p>
                      <Button onClick={triggerAnalysis} disabled={analyzing || documents.length === 0}>
                        {analyzing ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Analyzing...
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-4 w-4 mr-2" />
                            Analyze Documents
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {/* Requirements Section */}
            {activeSection === "requirements" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Compliance Requirements</h2>
                  <p className="text-muted-foreground">Mandatory requirements and evaluation criteria</p>
                </div>
                
                {analysis?.compliance_summary ? (
                  <>
                    {/* Mandatory Requirements */}
                    {analysis.compliance_summary.requirements?.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                            Mandatory Requirements
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            {analysis.compliance_summary.requirements.map((req: string, i: number) => (
                              <div key={i} className="flex items-start gap-3 p-2 rounded hover:bg-muted/50">
                                <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                <span className="text-sm">{req}</span>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Disqualifiers */}
                    {analysis.compliance_summary.disqualifiers?.length > 0 && (
                      <Card className="border-destructive/50">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-destructive">
                            <AlertCircle className="h-5 w-5" />
                            Disqualification Criteria
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            {analysis.compliance_summary.disqualifiers.map((item: string, i: number) => (
                              <div key={i} className="flex items-start gap-3 p-2 rounded bg-destructive/5">
                                <AlertCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                                <span className="text-sm">{item}</span>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Evaluation Criteria */}
                    {analysis.evaluation?.criteria?.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle>Evaluation Criteria</CardTitle>
                          <CardDescription>How your bid will be scored</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {analysis.evaluation.criteria.map((criterion: any, i: number) => (
                              <div key={i} className="space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span className="font-medium">{criterion.name || criterion.category}</span>
                                  <span className="text-muted-foreground">{criterion.points || criterion.weight} points</span>
                                </div>
                                <Progress 
                                  value={(criterion.points || criterion.weight) / (analysis.evaluation.total_points || 100) * 100} 
                                  className="h-2"
                                />
                                {criterion.description && (
                                  <p className="text-xs text-muted-foreground">{criterion.description}</p>
                                )}
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </>
                ) : (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <ClipboardCheck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Requirements Not Extracted</h3>
                      <p className="text-muted-foreground">
                        Upload and analyze a tender document to see requirements
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {/* Documents Section */}
            {activeSection === "documents" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Documents</h2>
                    <p className="text-muted-foreground">Tender documents and supporting files</p>
                  </div>
                  <div>
                    <Label htmlFor="doc-upload" className="cursor-pointer">
                      <div className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
                        {uploading ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Upload className="h-4 w-4 mr-2" />
                        )}
                        Upload Document
                      </div>
                    </Label>
                    <Input
                      id="doc-upload"
                      type="file"
                      accept=".pdf,.doc,.docx,.xls,.xlsx"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                      disabled={uploading}
                    />
                  </div>
                </div>

                {documents.length > 0 ? (
                  <div className="space-y-3">
                    {documents.map((doc) => (
                      <Card key={doc.id}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3 min-w-0">
                              <FileText className="h-8 w-8 text-primary flex-shrink-0" />
                              <div className="min-w-0">
                                <p className="font-medium truncate">
                                  {doc.file_name || doc.document_name || "Untitled Document"}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {doc.file_type || doc.document_type || "Document"}
                                  {doc.file_size && ` - ${(doc.file_size / 1024).toFixed(1)} KB`}
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDownload(doc)}
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No Documents</h3>
                      <p className="text-muted-foreground mb-4">
                        Upload tender documents to get started
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {/* BOQ Section */}
            {activeSection === "boq" && analysis?.boq && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Bill of Quantities</h2>
                  <p className="text-muted-foreground">Pricing schedule extracted from tender documents</p>
                </div>
                <TenderBOQDisplay 
                  boq={analysis.boq} 
                  tenderId={id}
                  onSave={(data) => console.log("BOQ saved:", data)}
                />
              </div>
            )}

            {/* Project Plan Section */}
            {activeSection === "project-plan" && analysis?.project_plan && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Project Plan</h2>
                  <p className="text-muted-foreground">AI-generated implementation plan for this tender</p>
                </div>
                <TenderProjectPlanDisplay projectPlan={analysis.project_plan} />
              </div>
            )}

            {/* Forms Section */}
            {activeSection === "forms" && analysis?.fillable_fields?.length > 0 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Response Forms</h2>
                  <p className="text-muted-foreground">Fill in the required tender response fields</p>
                </div>
                <TenderFillableForms
                  fillableFields={analysis.fillable_fields}
                  formsSummary={analysis.forms_summary}
                  documentsIdentified={analysis.documents_identified}
                  tenderId={id}
                  onSave={(data) => {
                    const completed = Object.keys(data).filter(k => data[k]).length
                    setFormProgress(Math.round((completed / analysis.fillable_fields.length) * 100))
                  }}
                />
              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  )
}

export { Loading };
