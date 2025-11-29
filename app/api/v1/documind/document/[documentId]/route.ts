// ============================================
// DOCUMIND API - GET/DELETE DOCUMENT
// GET/DELETE /api/v1/documind/document/[documentId]
// ============================================

import { type NextRequest, NextResponse } from "next/server"
import { type ApiResponse, type ParsedDocument, Errors } from "@/lib/engines/documind"
import { getCachedDocument, deleteCachedDocument } from "@/lib/engines/documind/services/cache-service"
import { getDocument, deleteDocument } from "@/lib/engines/documind/services/database-service"

export async function GET(request: NextRequest, { params }: { params: Promise<{ documentId: string }> }) {
  const startTime = Date.now()
  const requestId = crypto.randomUUID()
  const { documentId } = await params

  try {
    // Try cache first
    let document = await getCachedDocument(documentId)
    let cached = true

    if (!document) {
      // Fall back to database
      document = await getDocument(documentId)
      cached = false
    }

    if (!document) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: Errors.documentNotFound(documentId),
          meta: { request_id: requestId, processing_time_ms: Date.now() - startTime },
        },
        { status: 404 },
      )
    }

    return NextResponse.json<ApiResponse<{ document: ParsedDocument; cached: boolean }>>(
      {
        success: true,
        data: { document, cached },
        meta: {
          request_id: requestId,
          processing_time_ms: Date.now() - startTime,
        },
      },
      {
        headers: {
          "X-Cache": cached ? "HIT" : "MISS",
        },
      },
    )
  } catch (error) {
    console.error("Get document error:", error)

    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: Errors.parseFailed("get", error instanceof Error ? error.message : "Unknown error"),
        meta: { request_id: requestId, processing_time_ms: Date.now() - startTime },
      },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ documentId: string }> }) {
  const startTime = Date.now()
  const requestId = crypto.randomUUID()
  const { documentId } = await params

  try {
    // Delete from database
    const result = await deleteDocument(documentId)

    if (!result.success) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: result.error,
          meta: { request_id: requestId, processing_time_ms: Date.now() - startTime },
        },
        { status: 500 },
      )
    }

    // Delete from cache
    await deleteCachedDocument(documentId)

    return NextResponse.json<ApiResponse<{ deleted: true; document_id: string }>>({
      success: true,
      data: { deleted: true, document_id: documentId },
      meta: {
        request_id: requestId,
        processing_time_ms: Date.now() - startTime,
      },
    })
  } catch (error) {
    console.error("Delete document error:", error)

    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: Errors.parseFailed("delete", error instanceof Error ? error.message : "Unknown error"),
        meta: { request_id: requestId, processing_time_ms: Date.now() - startTime },
      },
      { status: 500 },
    )
  }
}
