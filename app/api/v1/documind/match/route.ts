// ============================================
// DOCUMIND API - MATCH TEMPLATE
// POST /api/v1/documind/match
// ============================================

import { type NextRequest, NextResponse } from "next/server"
import { type ApiResponse, type TemplateMatch, Errors } from "@/lib/engines/documind"
import {
  getCachedDocument,
  getCachedTemplateMatch,
  cacheTemplateMatch,
} from "@/lib/engines/documind/services/cache-service"
import {
  getDocument,
  findMatchingTemplates,
  saveTemplateMatch,
  incrementTemplateUsage,
} from "@/lib/engines/documind/services/database-service"

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  const requestId = crypto.randomUUID()

  try {
    const body = await request.json()
    const { document_id, fingerprint } = body

    if (!document_id && !fingerprint) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: Errors.invalidRequest("Must provide document_id or fingerprint"),
          meta: { request_id: requestId, processing_time_ms: Date.now() - startTime },
        },
        { status: 400 },
      )
    }

    let structureHash: string

    if (document_id) {
      // Check cache for existing match
      const cachedMatch = await getCachedTemplateMatch(document_id)
      if (cachedMatch) {
        return NextResponse.json<ApiResponse<{ matches: TemplateMatch[]; best_match: TemplateMatch | null }>>(
          {
            success: true,
            data: {
              matches: cachedMatch,
              best_match: cachedMatch.length > 0 ? cachedMatch[0] : null,
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

      // Get document to extract fingerprint
      let document = await getCachedDocument(document_id)
      if (!document) {
        document = await getDocument(document_id)
      }

      if (!document) {
        return NextResponse.json<ApiResponse<null>>(
          {
            success: false,
            error: Errors.documentNotFound(document_id),
            meta: { request_id: requestId, processing_time_ms: Date.now() - startTime },
          },
          { status: 404 },
        )
      }

      structureHash = document.fingerprints.structure_hash
    } else {
      structureHash = fingerprint
    }

    // Find matching templates
    const matches = await findMatchingTemplates(structureHash)

    // Cache the result
    if (document_id) {
      await cacheTemplateMatch(document_id, matches)

      // Save to database and update usage
      for (const match of matches) {
        await saveTemplateMatch(
          document_id,
          match.template_id,
          match.match_score,
          match.matched_fields,
          match.total_fields,
        )
        if (match.match_score > 0.9) {
          await incrementTemplateUsage(match.template_id)
        }
      }
    }

    return NextResponse.json<ApiResponse<{ matches: TemplateMatch[]; best_match: TemplateMatch | null }>>(
      {
        success: true,
        data: {
          matches,
          best_match: matches.length > 0 ? matches[0] : null,
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
    console.error("Match error:", error)

    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: Errors.parseFailed("match", error instanceof Error ? error.message : "Unknown error"),
        meta: { request_id: requestId, processing_time_ms: Date.now() - startTime },
      },
      { status: 500 },
    )
  }
}
