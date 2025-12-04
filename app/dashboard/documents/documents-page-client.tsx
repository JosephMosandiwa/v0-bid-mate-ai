"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import {
  Upload,
  FileText,
  Shield,
  AlertTriangle,
  CheckCircle,
  Download,
  Trash2,
  Eye,
  FolderOpen,
  Clock,
  Search,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { toast } from "sonner"
import { createBrowserClient } from "@/lib/supabase/client"

interface Document {
  id: string
  name: string
  type: string
  category: string
  file_url: string
  file_size: number
  expiry_date?: string
  created_at: string
}

interface Profile {
  has_tax_clearance: boolean
  has_coida: boolean
  has_csd: boolean
  bbbee_level?: string
  cidb_grade?: string
}

interface DocumentsPageClientProps {
  initialDocuments: Document[]
  profile: Profile | null
  userId: string
}

const DOCUMENT_CATEGORIES = [
  { id: "compliance", name: "Compliance", icon: Shield },
  { id: "company", name: "Company", icon: FileText },
  { id: "financial", name: "Financial", icon: FolderOpen },
  { id: "tender", name: "Tender Docs", icon: FileText },
]

const REQUIRED_DOCS = [
  { id: "tax_clearance", name: "Tax Clearance Certificate", category: "compliance" },
  { id: "bbbee", name: "B-BBEE Certificate", category: "compliance" },
  { id: "coida", name: "COIDA Letter of Good Standing", category: "compliance" },
  { id: "csd", name: "CSD Registration", category: "compliance" },
  { id: "cidb", name: "CIDB Registration", category: "compliance" },
  { id: "company_reg", name: "Company Registration (CIPC)", category: "company" },
  { id: "directors", name: "Directors ID Documents", category: "company" },
  { id: "bank_letter", name: "Bank Confirmation Letter", category: "financial" },
  { id: "financials", name: "Annual Financial Statements", category: "financial" },
]

export function DocumentsPageClient({ initialDocuments, profile, userId }: DocumentsPageClientProps) {
  const [documents, setDocuments] = useState<Document[]>(initialDocuments)
  const [searchQuery, setSearchQuery] = useState("")
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return

      setUploading(true)
      setUploadProgress(0)

      const supabase = createBrowserClient()

      for (let i = 0; i < acceptedFiles.length; i++) {
        const file = acceptedFiles[i]
        const progress = ((i + 1) / acceptedFiles.length) * 100
        setUploadProgress(progress)

        try {
          const fileExt = file.name.split(".").pop()
          const fileName = `${userId}/${Date.now()}.${fileExt}`

          const { error: uploadError } = await supabase.storage.from("documents").upload(fileName, file)

          if (uploadError) throw uploadError

          const {
            data: { publicUrl },
          } = supabase.storage.from("documents").getPublicUrl(fileName)

          const { data: docData, error: dbError } = await supabase
            .from("user_documents")
            .insert({
              user_id: userId,
              name: file.name,
              type: file.type,
              category: "company",
              file_url: publicUrl,
              file_size: file.size,
            })
            .select()
            .single()

          if (dbError) throw dbError

          setDocuments((prev) => [docData, ...prev])
          toast.success(`Uploaded ${file.name}`)
        } catch (error) {
          console.error("Upload error:", error)
          toast.error(`Failed to upload ${file.name}`)
        }
      }

      setUploading(false)
      setUploadProgress(0)
    },
    [userId],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "image/*": [".png", ".jpg", ".jpeg"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
  })

  const deleteDocument = async (docId: string) => {
    const supabase = createBrowserClient()
    const { error } = await supabase.from("user_documents").delete().eq("id", docId)

    if (error) {
      toast.error("Failed to delete document")
      return
    }

    setDocuments((prev) => prev.filter((d) => d.id !== docId))
    toast.success("Document deleted")
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const getComplianceScore = () => {
    let score = 0
    if (profile?.has_tax_clearance) score += 25
    if (profile?.has_coida) score += 25
    if (profile?.has_csd) score += 25
    if (profile?.bbbee_level) score += 25
    return score
  }

  const filteredDocs = documents.filter((doc) => doc.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const isExpiringSoon = (date?: string) => {
    if (!date) return false
    const expiry = new Date(date)
    const thirtyDaysFromNow = new Date()
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)
    return expiry <= thirtyDaysFromNow
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl md:text-3xl font-bold">Documents</h1>
          <p className="text-muted-foreground">Manage your company and compliance documents</p>
        </div>
      </div>

      {/* Compliance Score */}
      <Card className="rounded-xl bg-gradient-to-r from-primary/5 to-accent/5">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="font-heading text-lg font-semibold mb-1">Compliance Score</h3>
              <p className="text-sm text-muted-foreground">
                Complete your document checklist to improve tender eligibility
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-32">
                <Progress value={getComplianceScore()} className="h-3" />
              </div>
              <span className="text-2xl font-bold">{getComplianceScore()}%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upload Area */}
      <Card className="rounded-xl">
        <CardContent className="p-6">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
              isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50"
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-4" />
            {isDragActive ? (
              <p className="text-primary font-medium">Drop files here...</p>
            ) : (
              <>
                <p className="font-medium mb-1">Drag and drop files here, or click to browse</p>
                <p className="text-sm text-muted-foreground">PDF, DOC, DOCX, PNG, JPG up to 10MB</p>
              </>
            )}
          </div>
          {uploading && (
            <div className="mt-4">
              <Progress value={uploadProgress} className="h-2" />
              <p className="text-sm text-muted-foreground mt-2">Uploading... {Math.round(uploadProgress)}%</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Document Checklist & Files */}
      <Tabs defaultValue="files" className="space-y-4">
        <TabsList>
          <TabsTrigger value="files">My Files ({documents.length})</TabsTrigger>
          <TabsTrigger value="checklist">Checklist</TabsTrigger>
        </TabsList>

        <TabsContent value="files">
          <Card className="rounded-xl">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <CardTitle>Uploaded Documents</CardTitle>
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search documents..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {filteredDocs.length === 0 ? (
                <div className="text-center py-8">
                  <FolderOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No documents uploaded yet</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredDocs.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <FileText className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{doc.name}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{formatFileSize(doc.file_size)}</span>
                            <span>•</span>
                            <span>{new Date(doc.created_at).toLocaleDateString()}</span>
                            {doc.expiry_date && (
                              <>
                                <span>•</span>
                                <span className={isExpiringSoon(doc.expiry_date) ? "text-destructive" : ""}>
                                  Expires: {new Date(doc.expiry_date).toLocaleDateString()}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {isExpiringSoon(doc.expiry_date) && (
                          <Badge variant="destructive" className="mr-2">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            Expiring
                          </Badge>
                        )}
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" asChild>
                          <a href={doc.file_url} target="_blank" rel="noopener noreferrer">
                            <Eye className="w-4 h-4" />
                          </a>
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" asChild>
                          <a href={doc.file_url} download>
                            <Download className="w-4 h-4" />
                          </a>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-destructive"
                          onClick={() => deleteDocument(doc.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="checklist">
          <Card className="rounded-xl">
            <CardHeader>
              <CardTitle>Document Checklist</CardTitle>
              <CardDescription>Required documents for South African government tenders</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {DOCUMENT_CATEGORIES.map((category) => (
                  <div key={category.id}>
                    <h4 className="font-medium text-sm text-muted-foreground mb-2 flex items-center gap-2">
                      <category.icon className="w-4 h-4" />
                      {category.name}
                    </h4>
                    <div className="space-y-2">
                      {REQUIRED_DOCS.filter((d) => d.category === category.id).map((doc) => {
                        const hasDoc = documents.some((d) => d.name.toLowerCase().includes(doc.id.replace("_", " ")))
                        return (
                          <div key={doc.id} className="flex items-center justify-between p-3 rounded-lg border">
                            <div className="flex items-center gap-3">
                              {hasDoc ? (
                                <CheckCircle className="w-5 h-5 text-green-500" />
                              ) : (
                                <Clock className="w-5 h-5 text-muted-foreground" />
                              )}
                              <span className={hasDoc ? "" : "text-muted-foreground"}>{doc.name}</span>
                            </div>
                            {!hasDoc && (
                              <Button variant="outline" size="sm">
                                Upload
                              </Button>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
