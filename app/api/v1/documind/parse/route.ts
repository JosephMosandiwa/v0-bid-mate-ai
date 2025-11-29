// ============================================
// DOCUMIND API - PARSE DOCUMENT
// POST /api/v1/documind/parse
// ============================================

import { type NextRequest, NextResponse } from "next/server"
import { put } from "@vercel/blob"
import {
  processDocument,
  validateFile,
  detectMimeType,
  Errors,
  type ParseOptions,
  type ApiResponse,
  type ParsedDocument,
} from "@/lib/engines/documind"
import { cacheDocument, getDocumentIdByHash, getCachedDocument } from "@/lib/engines/documind/services/cache-service"
import { saveDocument, logError } from "@/lib/engines/documind/services/database-service"
import { generateContentHash } from "@/lib/engines/documind/utils/fingerprint"

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  const requestId = crypto.randomUUID()

  try {
    // Parse form data
    const formData = await request.formData()
    const file = formData.get("file") as File | null
    const url = formData.get("url") as string | null
    const base64 = formData.get("base64") as string | null
    const optionsStr = formData.get("options") as string | null
    const appId = (formData.get("app_id") as string) || "bidmate-ai"
    const webhookUrl = formData.get("webhook_url") as string | null

    // Parse options
    let options: ParseOptions = {}
    if (optionsStr) {
      try {
        options = JSON.parse(optionsStr)
      } catch {
        return NextResponse.json<ApiResponse<null>>(
          {
            success: false,
            error: Errors.invalidOptions("options", "Invalid JSON"),
            meta: { request_id: requestId, processing_time_ms: Date.now() - startTime },
          },
          { status: 400 },
        )
      }
    }

    // Get document data
    let documentData: ArrayBuffer
    let mimeType: string
    let filename: string

    if (file) {
      documentData = await file.arrayBuffer()
      mimeType = file.type || detectMimeType(Buffer.from(documentData)) || "application/pdf"
      filename = file.name
    } else if (url) {
      // Fetch from URL
      const response = await fetch(url)
      if (!response.ok) {
        return NextResponse.json<ApiResponse<null>>(
          {
            success: false,
            error: Errors.invalidRequest(`Failed to fetch URL: ${response.statusText}`),
            meta: { request_id: requestId, processing_time_ms: Date.now() - startTime },
          },
          { status: 400 },
        )
      }
      documentData = await response.arrayBuffer()
      mimeType = response.headers.get("content-type") || "application/pdf"
      filename = url.split("/").pop() || "document.pdf"
    } else if (base64) {
      // Decode base64
      const buffer = Buffer.from(base64, "base64")
      documentData = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength)
      mimeType = detectMimeType(buffer) || "application/pdf"
      filename = "document.pdf"
    } else {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: Errors.invalidRequest("Must provide file, url, or base64"),
          meta: { request_id: requestId, processing_time_ms: Date.now() - startTime },
        },
        { status: 400 },
      )
    }

    // Validate file
    const validation = validateFile(mimeType, documentData.byteLength)
    if (!validation.valid) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: validation.error,
          meta: { request_id: requestId, processing_time_ms: Date.now() - startTime },
        },
        { status: 400 },
      )
    }

    // Check for duplicate by content hash
    const contentHash = generateContentHash(Buffer.from(documentData).toString("utf-8").substring(0, 10000))
    const existingDocId = await getDocumentIdByHash(contentHash)

    if (existingDocId) {
      const cachedDoc = await getCachedDocument(existingDocId)
      if (cachedDoc) {
        return NextResponse.json<ApiResponse<ParsedDocument>>(
          {
            success: true,
            data: cachedDoc,
            meta: {
              request_id: requestId,
              processing_time_ms: Date.now() - startTime,
            },
          },
          {
            headers: {
              "X-Cache": "HIT",
              "X-Document-Id": existingDocId,
            },
          },
        )
      }
    }

    // Process document
    const result = await processDocument(new Uint8Array(documentData), mimeType, options)

    if (!result.success || !result.document) {
      await logError(result.error!, {
        app_id: appId,
        request_id: requestId,
        processing_stage: "parse",
        file_info: { filename, mime_type: mimeType, size: documentData.byteLength },
      })

      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: result.error,
          meta: { request_id: requestId, processing_time_ms: Date.now() - startTime },
        },
        { status: 500 },
      )
    }

    // Upload original file to blob storage
    const blob = await put(`documind/${result.document.document_id}/${filename}`, Buffer.from(documentData), {
      access: "public",
    })

    // Save to database
    await saveDocument(result.document, blob.url, appId)

    // Cache the result
    await cacheDocument(result.document.document_id, result.document, result.document.fingerprints.content_hash)

    return NextResponse.json<ApiResponse<ParsedDocument>>(
      {
        success: true,
        data: result.document,
        meta: {
          request_id: requestId,
          processing_time_ms: Date.now() - startTime,
        },
      },
      {
        headers: {
          "X-Cache": "MISS",
          "X-Document-Id": result.document.document_id,
        },
      },
    )
  } catch (error) {
    console.error("Parse error:", error)

    const docError = Errors.parseFailed("unknown", error instanceof Error ? error.message : "Unknown error")

    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: docError,
        meta: { request_id: requestId, processing_time_ms: Date.now() - startTime },
      },
      { status: 500 },
    )
  }
}
