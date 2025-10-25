"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Building2,
  Calendar,
  DollarSign,
  FileText,
  Sparkles,
  Download,
  Loader2,
  ExternalLink,
  MapPin,
} from "lucide-react"
import Link from "next/link"

interface ScrapedTender {
  id: string
  title: string
  description: string
  source_name: string
  source_level: string
  source_province?: string
  tender_url: string
  publish_date?: string
  close_date?: string
  estimated_value?: string
  category?: string
  requirements?: string[]
}

interface TenderDocument {
  id: string
  tender_id: string
  document_name: string
  document_type: string
  original_url: string
  blob_url: string
  file_size: number
  created_at: string
}

export default function ScrapedTenderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [tender, setTender] = useState<ScrapedTender | null>(null)
  const [documents, setDocuments] = useState<TenderDocument[]>([])
  const [loading, setLoading] = useState(true)
  const [analyzing, setAnalyzing] = useState<string | null>(null)

  useEffect(() => {
    loadTenderDetails()
  }, [id])

  const loadTenderDetails = async () => {
    try {
      console.log("[v0] Loading tender details for:", id)
      const response = await fetch(`/api/tenders/scraped/${id}`)

      if (!response.ok) {
        throw new Error("Failed to load tender")
      }

      const data = await response.json()
      console.log("[v0] Loaded tender:", data)

      setTender(data.tender)
      setDocuments(data.documents || [])
    } catch (error) {
      console.error("[v0] Error loading tender:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = (doc: TenderDocument) => {
    window.open(doc.blob_url, "_blank")
  }

  const handleAnalyze = async (doc: TenderDocument) => {
    setAnalyzing(doc.id)

    try {
      console.log("[v0] Analyzing document:", doc.document_name)

      // Fetch the document from Blob storage
      const response = await fetch(doc.blob_url)
      if (!response.ok) {
        throw new Error("Failed to fetch document")
      }

      const blob = await response.blob()
      const file = new File([blob], doc.document_name, { type: `application/${doc.document_type}` })

      // Extract text from PDF
      const formData = new FormData()
      formData.append("file", file)

      const extractResponse = await fetch("/api/extract-pdf", {
        method: "POST",
        body: formData,
      })

      if (!extractResponse.ok) {
        throw new Error("Failed to extract text from document")
      }

      const { text } = await extractResponse.json()

      // Analyze the text
      const analyzeResponse = await fetch("/api/analyze-tender", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentText: text }),
      })

      if (!analyzeResponse.ok) {
        throw new Error("Failed to analyze document")
      }

      const analysis = await analyzeResponse.json()
      console.log("[v0] Analysis complete:", analysis)

      alert("Document analyzed successfully! Analysis: " + JSON.stringify(analysis, null, 2))
    } catch (error: any) {
      console.error("[v0] Error analyzing document:", error)
      alert(error.message || "Failed to analyze document")
    } finally {
      setAnalyzing(null)
    }
  }

  if (loading) {
    return (
      <div className="p-6 md:p-8 flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!tender) {
    return (
      <div className="p-6 md:p-8">
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground">Tender not found</p>
            <Button asChild className="mt-4">
              <Link href="/dashboard/search">Back to Search</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/search">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <h1 className="text-3xl font-bold text-foreground">{tender.title}</h1>
            {tender.category && <Badge className="bg-primary/10 text-primary">{tender.category}</Badge>}
            {tender.source_level && <Badge variant="outline">{tender.source_level}</Badge>}
          </div>
          <div className="flex items-center gap-4 text-muted-foreground flex-wrap">
            <span className="flex items-center gap-1">
              <Building2 className="h-4 w-4" />
              {tender.source_name}
            </span>
            {tender.source_province && (
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {tender.source_province}
              </span>
            )}
            {tender.close_date && (
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Closes: {new Date(tender.close_date).toLocaleDateString()}
              </span>
            )}
            {tender.estimated_value && (
              <span className="flex items-center gap-1">
                <DollarSign className="h-4 w-4" />
                {tender.estimated_value}
              </span>
            )}
          </div>
        </div>
        {tender.tender_url && (
          <Button asChild>
            <a href={tender.tender_url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4 mr-2" />
              View Original
            </a>
          </Button>
        )}
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="documents">
            Documents
            {documents.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {documents.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{tender.description}</p>
            </CardContent>
          </Card>

          {tender.requirements && tender.requirements.length > 0 && (
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Requirements</CardTitle>
                <CardDescription>Key requirements for this tender</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {tender.requirements.map((req, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2" />
                      <span className="text-muted-foreground">{req}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="documents" className="space-y-6">
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Tender Documents</CardTitle>
              <CardDescription>Documents scraped from the tender website - download or analyze with AI</CardDescription>
            </CardHeader>
            <CardContent>
              {documents.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No documents available for this tender</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-4 rounded-lg border border-border hover:border-primary transition-colors"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-foreground">{doc.document_name}</p>
                          <p className="text-sm text-muted-foreground">
                            {(doc.file_size / 1024 / 1024).toFixed(2)} MB • {doc.document_type.toUpperCase()} •{" "}
                            {new Date(doc.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {doc.document_type === "pdf" && (
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleAnalyze(doc)}
                            disabled={analyzing === doc.id}
                            title="Analyze with AI"
                          >
                            {analyzing === doc.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Sparkles className="h-4 w-4" />
                            )}
                          </Button>
                        )}
                        <Button variant="outline" size="icon" onClick={() => handleDownload(doc)} title="Download">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
