"use client"

import { useState, useCallback, useEffect } from "react"
import { useDropzone } from "react-dropzone"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Loader2,
  Upload,
  FileText,
  CheckCircle,
  XCircle,
  Eye,
  Layers,
  FormInput,
  Hash,
  FileSearch,
  ListChecks,
} from "lucide-react"

interface ParsedDocument {
  document_id: string
  status: string
  metadata: {
    title: string | null
    author: string | null
    page_count: number
    is_scanned: boolean
    detected_type: string
  }
  fingerprints: {
    content_hash: string
    structure_hash: string
  }
  pages: Array<{
    page_number: number
    width: number
    height: number
    content: {
      full_text: string
      text_blocks: Array<{
        id: string
        text: string
        block_type: string
        position: { x: number; y: number; width: number; height: number }
        font: { name: string; size: number; weight: string }
      }>
      lines: Array<{
        id: string
        type: string
        is_form_line: boolean
      }>
      rectangles: Array<{
        id: string
        rect_type: string
      }>
    }
  }>
  layout: {
    document_type: string
    has_forms: boolean
    sections: Array<{ id: string; title: string; level: number }>
    form_regions: Array<{
      id: string
      page: number
      detected_fields: Array<{
        id: string
        label: { text: string }
        input: { type: string }
        confidence: number
      }>
    }>
  }
  form_fields: Array<{
    id: string
    name: string
    type: string
    page: number
    value: string | boolean | null
  }>
  processing: {
    duration_ms: number
    ocr_used: boolean
    warnings: string[]
    pages_processed: number
  }
}

interface ApiResponse {
  success: boolean
  data?: ParsedDocument
  error?: { code: string; message: string }
  meta: { request_id: string; processing_time_ms: number }
}

interface Template {
  id: string
  name: string
  code: string
  category: string
  subcategory: string | null
  description: string | null
  field_mappings: Array<{
    field_id: string
    field_name: string
    label_pattern: string
    data_type: string
    is_required: boolean
    profile_mapping: string | null
  }>
  usage_count: number
  accuracy_score: number | null
}

interface TemplateMatch {
  template_id: string
  template_name: string
  template_code: string
  category: string
  match_score: number
  matched_fields: number
  total_fields: number
  field_mappings: Template["field_mappings"]
}

interface TemplatesResponse {
  success: boolean
  data?: {
    items: Template[]
    total: number
  }
  error?: { code: string; message: string }
}

interface MatchResponse {
  success: boolean
  data?: {
    matches: TemplateMatch[]
    best_match: TemplateMatch | null
  }
  error?: { code: string; message: string }
}

export default function DocuMindTestPage() {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ApiResponse | null>(null)
  const [activeTab, setActiveTab] = useState("overview")

  const [templates, setTemplates] = useState<Template[]>([])
  const [templatesLoading, setTemplatesLoading] = useState(false)
  const [matchResult, setMatchResult] = useState<MatchResponse | null>(null)
  const [matchLoading, setMatchLoading] = useState(false)

  useEffect(() => {
    loadTemplates()
  }, [])

  const loadTemplates = async () => {
    setTemplatesLoading(true)
    try {
      const response = await fetch("/api/v1/documind/templates")
      const data: TemplatesResponse = await response.json()
      if (data.success && data.data) {
        setTemplates(data.data.items)
      }
    } catch (error) {
      console.error("[v0] Failed to load templates:", error)
    } finally {
      setTemplatesLoading(false)
    }
  }

  const handleParse = useCallback(async () => {
    if (!file) return

    setLoading(true)
    setResult(null)

    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("app_id", "documind-test")
      formData.append(
        "options",
        JSON.stringify({
          ocr_enabled: true,
          extract_tables: true,
          extract_forms: true,
        }),
      )

      console.log("[v0] Sending parse request for:", file.name)

      const response = await fetch("/api/v1/documind/parse", {
        method: "POST",
        body: formData,
      })

      const data: ApiResponse = await response.json()
      console.log("[v0] Parse response:", data)

      setResult(data)
    } catch (error) {
      console.error("[v0] Parse error:", error)
      setResult({
        success: false,
        error: { code: "NETWORK_ERROR", message: error instanceof Error ? error.message : "Unknown error" },
        meta: { request_id: "local", processing_time_ms: 0 },
      })
    } finally {
      setLoading(false)
    }
  }, [file])

  const handleTestHealth = useCallback(async () => {
    try {
      const response = await fetch("/api/v1/documind/health")
      const data = await response.json()
      console.log("[v0] Health check:", data)
      alert(JSON.stringify(data, null, 2))
    } catch (error) {
      console.error("[v0] Health check error:", error)
    }
  }, [])

  const handleMatchTemplate = useCallback(async () => {
    if (!result?.data?.document_id) return

    setMatchLoading(true)
    setMatchResult(null)

    try {
      const response = await fetch("/api/v1/documind/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          document_id: result.data.document_id,
        }),
      })

      const data: MatchResponse = await response.json()
      console.log("[v0] Match response:", data)
      setMatchResult(data)
    } catch (error) {
      console.error("[v0] Match error:", error)
      setMatchResult({
        success: false,
        error: { code: "NETWORK_ERROR", message: error instanceof Error ? error.message : "Unknown error" },
      })
    } finally {
      setMatchLoading(false)
    }
  }, [result])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        setFile(acceptedFiles[0])
        setResult(null)
        setMatchResult(null)
      }
    },
    accept: {
      "application/pdf": [".pdf"],
    },
    maxFiles: 1,
    maxSize: 50 * 1024 * 1024,
  })

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">DocuMind Engine Test</h1>
            <p className="text-muted-foreground">Upload a PDF to test document parsing and analysis</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={loadTemplates} disabled={templatesLoading}>
              {templatesLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <ListChecks className="mr-2 h-4 w-4" />
              )}
              Reload Templates
            </Button>
            <Button variant="outline" onClick={handleTestHealth}>
              Test Health Endpoint
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ListChecks className="h-5 w-5" />
              Available Templates ({templates.length})
            </CardTitle>
            <CardDescription>SA Government and Municipal tender form templates for matching</CardDescription>
          </CardHeader>
          <CardContent>
            {templatesLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : templates.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                No templates found. Templates may not be seeded yet.
              </div>
            ) : (
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {templates.map((template) => (
                  <Card key={template.id} className="bg-muted/30">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="shrink-0">
                              {template.code}
                            </Badge>
                            <span className="truncate text-sm font-medium">{template.name}</span>
                          </div>
                          <p className="mt-1 text-xs text-muted-foreground">{template.category}</p>
                        </div>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1">
                        <Badge variant="outline" className="text-xs">
                          {template.field_mappings.length} fields
                        </Badge>
                        {template.usage_count > 0 && (
                          <Badge variant="outline" className="text-xs">
                            Used {template.usage_count}x
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload Document
            </CardTitle>
            <CardDescription>Drag and drop a PDF file or click to browse</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div
              {...getRootProps()}
              className={`cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
                isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50"
              }`}
            >
              <input {...getInputProps()} />
              {file ? (
                <div className="flex items-center justify-center gap-3">
                  <FileText className="h-8 w-8 text-primary" />
                  <div className="text-left">
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="mx-auto h-10 w-10 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    {isDragActive ? "Drop the file here" : "Drag & drop a PDF, or click to select"}
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <Button onClick={handleParse} disabled={!file || loading} className="flex-1">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Parsing...
                  </>
                ) : (
                  <>
                    <Eye className="mr-2 h-4 w-4" />
                    Parse Document
                  </>
                )}
              </Button>
              {result?.success && result.data && (
                <Button onClick={handleMatchTemplate} disabled={matchLoading} variant="secondary">
                  {matchLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Matching...
                    </>
                  ) : (
                    <>
                      <FileSearch className="mr-2 h-4 w-4" />
                      Match Template
                    </>
                  )}
                </Button>
              )}
              {file && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setFile(null)
                    setResult(null)
                    setMatchResult(null)
                  }}
                >
                  Clear
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {matchResult && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FileSearch className="h-5 w-5" />
                  Template Match Results
                </CardTitle>
                {matchResult.success && matchResult.data?.best_match && (
                  <Badge className="bg-green-600">
                    Best: {matchResult.data.best_match.template_code} (
                    {(matchResult.data.best_match.match_score * 100).toFixed(0)}%)
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {matchResult.success ? (
                matchResult.data?.matches && matchResult.data.matches.length > 0 ? (
                  <div className="space-y-3">
                    {matchResult.data.matches.map((match, index) => (
                      <Card key={match.template_id} className={index === 0 ? "border-green-500 bg-green-500/5" : ""}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center gap-2">
                                {index === 0 && <Badge className="bg-green-600">Best Match</Badge>}
                                <Badge variant="secondary">{match.template_code}</Badge>
                                <span className="font-medium">{match.template_name}</span>
                              </div>
                              <p className="mt-1 text-sm text-muted-foreground">{match.category}</p>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold">{(match.match_score * 100).toFixed(0)}%</div>
                              <p className="text-xs text-muted-foreground">
                                {match.matched_fields}/{match.total_fields} fields
                              </p>
                            </div>
                          </div>
                          {match.field_mappings && match.field_mappings.length > 0 && (
                            <div className="mt-3">
                              <p className="mb-2 text-xs font-medium text-muted-foreground">Expected Fields:</p>
                              <div className="flex flex-wrap gap-1">
                                {match.field_mappings.slice(0, 6).map((field) => (
                                  <Badge key={field.field_id} variant="outline" className="text-xs">
                                    {field.field_name}
                                    {field.is_required && <span className="ml-1 text-red-500">*</span>}
                                  </Badge>
                                ))}
                                {match.field_mappings.length > 6 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{match.field_mappings.length - 6} more
                                  </Badge>
                                )}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center text-muted-foreground">
                    No matching templates found. The document structure doesn't match any known SA tender forms.
                  </div>
                )
              ) : (
                <div className="py-4 text-center text-red-500">Error: {matchResult.error?.message}</div>
              )}
            </CardContent>
          </Card>
        )}

        {result && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  {result.success ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                  Parse Results
                </CardTitle>
                <Badge variant={result.success ? "default" : "destructive"}>{result.meta.processing_time_ms}ms</Badge>
              </div>
            </CardHeader>
            <CardContent>
              {result.success && result.data ? (
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="pages">Pages</TabsTrigger>
                    <TabsTrigger value="layout">Layout</TabsTrigger>
                    <TabsTrigger value="fields">Fields</TabsTrigger>
                    <TabsTrigger value="raw">Raw JSON</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-3">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">Document ID</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="truncate font-mono text-xs">{result.data.document_id}</p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">Status</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <Badge variant={result.data.status === "complete" ? "default" : "secondary"}>
                            {result.data.status}
                          </Badge>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">Document Type</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <Badge variant="outline">{result.data.metadata.detected_type}</Badge>
                        </CardContent>
                      </Card>
                    </div>

                    <Separator />

                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <h4 className="mb-2 font-semibold">Metadata</h4>
                        <dl className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <dt className="text-muted-foreground">Title:</dt>
                            <dd>{result.data.metadata.title || "N/A"}</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-muted-foreground">Author:</dt>
                            <dd>{result.data.metadata.author || "N/A"}</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-muted-foreground">Pages:</dt>
                            <dd>{result.data.metadata.page_count}</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-muted-foreground">Scanned:</dt>
                            <dd>{result.data.metadata.is_scanned ? "Yes" : "No"}</dd>
                          </div>
                        </dl>
                      </div>

                      <div>
                        <h4 className="mb-2 font-semibold">Processing</h4>
                        <dl className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <dt className="text-muted-foreground">Duration:</dt>
                            <dd>{result.data.processing.duration_ms}ms</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-muted-foreground">OCR Used:</dt>
                            <dd>{result.data.processing.ocr_used ? "Yes" : "No"}</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-muted-foreground">Pages Processed:</dt>
                            <dd>{result.data.processing.pages_processed}</dd>
                          </div>
                        </dl>
                        {result.data.processing.warnings.length > 0 && (
                          <div className="mt-2">
                            <p className="text-xs font-medium text-amber-600">Warnings:</p>
                            <ul className="text-xs text-muted-foreground">
                              {result.data.processing.warnings.map((w, i) => (
                                <li key={i}>- {w}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="mb-2 flex items-center gap-2 font-semibold">
                        <Hash className="h-4 w-4" />
                        Fingerprints
                      </h4>
                      <div className="space-y-1 font-mono text-xs">
                        <p>
                          <span className="text-muted-foreground">Content:</span>{" "}
                          {result.data.fingerprints.content_hash}
                        </p>
                        <p>
                          <span className="text-muted-foreground">Structure:</span>{" "}
                          {result.data.fingerprints.structure_hash}
                        </p>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="pages">
                    <ScrollArea className="h-[500px]">
                      <div className="space-y-4">
                        {result.data.pages.map((page) => (
                          <Card key={page.page_number}>
                            <CardHeader className="pb-2">
                              <div className="flex items-center justify-between">
                                <CardTitle className="flex items-center gap-2 text-sm">
                                  <Layers className="h-4 w-4" />
                                  Page {page.page_number}
                                </CardTitle>
                                <span className="text-xs text-muted-foreground">
                                  {page.width.toFixed(0)} x {page.height.toFixed(0)} pts
                                </span>
                              </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                              <div className="flex flex-wrap gap-2">
                                <Badge variant="outline">{page.content.text_blocks.length} text blocks</Badge>
                                <Badge variant="outline">{page.content.lines.length} lines</Badge>
                                <Badge variant="outline">{page.content.rectangles.length} rectangles</Badge>
                                <Badge variant="outline">
                                  {page.content.lines.filter((l) => l.is_form_line).length} form lines
                                </Badge>
                              </div>

                              <div>
                                <p className="mb-1 text-xs font-medium text-muted-foreground">Text Content Preview:</p>
                                <p className="max-h-24 overflow-hidden text-ellipsis rounded bg-muted p-2 text-xs">
                                  {page.content.full_text.substring(0, 500)}
                                  {page.content.full_text.length > 500 && "..."}
                                </p>
                              </div>

                              {page.content.text_blocks.slice(0, 5).map((block) => (
                                <div key={block.id} className="rounded border p-2 text-xs">
                                  <div className="flex items-center gap-2">
                                    <Badge variant="secondary" className="text-xs">
                                      {block.block_type}
                                    </Badge>
                                    <span className="text-muted-foreground">
                                      {block.font.name} {block.font.size}pt {block.font.weight}
                                    </span>
                                  </div>
                                  <p className="mt-1 truncate">{block.text}</p>
                                </div>
                              ))}
                              {page.content.text_blocks.length > 5 && (
                                <p className="text-xs text-muted-foreground">
                                  ... and {page.content.text_blocks.length - 5} more blocks
                                </p>
                              )}
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </ScrollArea>
                  </TabsContent>

                  <TabsContent value="layout">
                    <ScrollArea className="h-[500px]">
                      <div className="space-y-4">
                        <div className="flex gap-2">
                          <Badge>{result.data.layout.document_type}</Badge>
                          <Badge variant={result.data.layout.has_forms ? "default" : "secondary"}>
                            {result.data.layout.has_forms ? "Has Forms" : "No Forms"}
                          </Badge>
                        </div>

                        {result.data.layout.sections.length > 0 && (
                          <div>
                            <h4 className="mb-2 font-semibold">Sections</h4>
                            <div className="space-y-1">
                              {result.data.layout.sections.map((section) => (
                                <div
                                  key={section.id}
                                  className="flex items-center gap-2 rounded border p-2"
                                  style={{ marginLeft: (section.level - 1) * 16 }}
                                >
                                  <Badge variant="outline" className="text-xs">
                                    H{section.level}
                                  </Badge>
                                  <span className="text-sm">{section.title}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {result.data.layout.form_regions.length > 0 && (
                          <div>
                            <h4 className="mb-2 flex items-center gap-2 font-semibold">
                              <FormInput className="h-4 w-4" />
                              Detected Form Regions
                            </h4>
                            {result.data.layout.form_regions.map((region) => (
                              <Card key={region.id} className="mb-2">
                                <CardHeader className="pb-2">
                                  <CardTitle className="text-sm">Page {region.page}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <div className="space-y-1">
                                    {region.detected_fields.map((field) => (
                                      <div key={field.id} className="flex items-center justify-between text-sm">
                                        <span>{field.label.text}</span>
                                        <div className="flex items-center gap-2">
                                          <Badge variant="outline" className="text-xs">
                                            {field.input.type}
                                          </Badge>
                                          <span className="text-xs text-muted-foreground">
                                            {(field.confidence * 100).toFixed(0)}%
                                          </span>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                  </TabsContent>

                  <TabsContent value="fields">
                    <ScrollArea className="h-[500px]">
                      {result.data.form_fields.length > 0 ? (
                        <div className="space-y-2">
                          {result.data.form_fields.map((field) => (
                            <Card key={field.id}>
                              <CardContent className="flex items-center justify-between p-3">
                                <div>
                                  <p className="font-medium">{field.name}</p>
                                  <p className="text-xs text-muted-foreground">Page {field.page}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline">{field.type}</Badge>
                                  {field.value !== null && (
                                    <span className="max-w-32 truncate text-sm">
                                      {typeof field.value === "boolean"
                                        ? field.value
                                          ? "Checked"
                                          : "Unchecked"
                                        : field.value}
                                    </span>
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      ) : (
                        <Alert>
                          <AlertDescription>No native PDF form fields found in this document.</AlertDescription>
                        </Alert>
                      )}
                    </ScrollArea>
                  </TabsContent>

                  <TabsContent value="raw">
                    <ScrollArea className="h-[500px]">
                      <pre className="rounded bg-muted p-4 text-xs">{JSON.stringify(result.data, null, 2)}</pre>
                    </ScrollArea>
                  </TabsContent>
                </Tabs>
              ) : (
                <div className="py-4 text-center text-red-500">
                  {result.error?.code}: {result.error?.message}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
