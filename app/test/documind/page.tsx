"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Upload, FileText, CheckCircle, XCircle, Eye, Layers, FormInput, Hash } from "lucide-react"

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

export default function DocuMindTestPage() {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ApiResponse | null>(null)
  const [activeTab, setActiveTab] = useState("overview")

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0])
      setResult(null)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
    maxFiles: 1,
    maxSize: 50 * 1024 * 1024,
  })

  const handleParse = async () => {
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
  }

  const handleTestHealth = async () => {
    try {
      const response = await fetch("/api/v1/documind/health")
      const data = await response.json()
      console.log("[v0] Health check:", data)
      alert(JSON.stringify(data, null, 2))
    } catch (error) {
      console.error("[v0] Health check error:", error)
    }
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">DocuMind Engine Test</h1>
            <p className="text-muted-foreground">Upload a PDF to test document parsing and analysis</p>
          </div>
          <Button variant="outline" onClick={handleTestHealth}>
            Test Health Endpoint
          </Button>
        </div>

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
              {file && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setFile(null)
                    setResult(null)
                  }}
                >
                  Clear
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

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
                <Alert variant="destructive">
                  <XCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>{result.error?.code}</strong>: {result.error?.message}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
