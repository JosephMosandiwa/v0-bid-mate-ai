// ============================================
// DOCUMIND API - LIST TEMPLATES
// GET /api/v1/documind/templates
// ============================================

import { type NextRequest, NextResponse } from "next/server"
import { type ApiResponse, type PaginatedResponse, type DocumentTemplate, Errors } from "@/lib/engines/documind"
import { getCachedTemplateList, cacheTemplateList } from "@/lib/engines/documind/services/cache-service"
import { getTemplates } from "@/lib/engines/documind/services/database-service"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  const startTime = Date.now()
  const requestId = crypto.randomUUID()

  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category") || undefined
    const limit = Number.parseInt(searchParams.get("limit") || "20", 10)
    const offset = Number.parseInt(searchParams.get("offset") || "0", 10)

    // Try cache first (only for first page without filters)
    if (offset === 0 && limit === 20) {
      const cached = await getCachedTemplateList(category)
      if (cached) {
        return NextResponse.json<ApiResponse<PaginatedResponse<DocumentTemplate>>>(
          {
            success: true,
            data: {
              items: cached,
              total: cached.length,
              limit,
              offset,
              has_more: false,
            },
            meta: {
              request_id: requestId,
              processing_time_ms: Date.now() - startTime,
            },
          },
          {
            headers: { "X-Cache": "HIT" },
          },
        )
      }
    }

    // Fetch from database
    const { templates, total } = await getTemplates(category, limit, offset)

    // Cache if first page
    if (offset === 0 && limit === 20) {
      await cacheTemplateList(templates, category)
    }

    return NextResponse.json<ApiResponse<PaginatedResponse<DocumentTemplate>>>(
      {
        success: true,
        data: {
          items: templates,
          total,
          limit,
          offset,
          has_more: offset + templates.length < total,
        },
        meta: {
          request_id: requestId,
          processing_time_ms: Date.now() - startTime,
        },
      },
      {
        headers: { "X-Cache": "MISS" },
      },
    )
  } catch (error) {
    console.error("Get templates error:", error)

    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: Errors.parseFailed("templates", error instanceof Error ? error.message : "Unknown error"),
        meta: { request_id: requestId, processing_time_ms: Date.now() - startTime },
      },
      { status: 500 },
    )
  }
}
