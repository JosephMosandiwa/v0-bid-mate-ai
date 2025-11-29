// ============================================
// DOCUMIND ENGINE - CACHING SERVICE
// Uses Upstash Redis for caching
// ============================================

import { Redis } from "@upstash/redis"
import type { ParsedDocument, DocumentTemplate, TemplateMatch } from "../types"
import { CACHE_TTL } from "../constants"

// Initialize Redis client
const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
})

// Cache key prefixes
const KEYS = {
  document: (id: string) => `documind:doc:${id}`,
  documentByHash: (hash: string) => `documind:hash:${hash}`,
  template: (id: string) => `documind:template:${id}`,
  templateList: (category?: string) => `documind:templates:${category || "all"}`,
  templateMatch: (docId: string) => `documind:match:${docId}`,
  job: (id: string) => `documind:job:${id}`,
}

/**
 * Cache a parsed document
 */
export async function cacheDocument(documentId: string, document: ParsedDocument, contentHash: string): Promise<void> {
  const pipeline = redis.pipeline()

  // Cache by document ID
  pipeline.set(KEYS.document(documentId), JSON.stringify(document), {
    ex: CACHE_TTL.parsed_document,
  })

  // Also cache by content hash for deduplication
  pipeline.set(KEYS.documentByHash(contentHash), documentId, {
    ex: CACHE_TTL.parsed_document,
  })

  await pipeline.exec()
}

/**
 * Get cached document by ID
 */
export async function getCachedDocument(documentId: string): Promise<ParsedDocument | null> {
  const cached = await redis.get<string>(KEYS.document(documentId))
  if (!cached) return null

  try {
    return JSON.parse(cached) as ParsedDocument
  } catch {
    return null
  }
}

/**
 * Get document ID by content hash (for deduplication)
 */
export async function getDocumentIdByHash(contentHash: string): Promise<string | null> {
  return redis.get<string>(KEYS.documentByHash(contentHash))
}

/**
 * Delete cached document
 */
export async function deleteCachedDocument(documentId: string, contentHash?: string): Promise<void> {
  const pipeline = redis.pipeline()

  pipeline.del(KEYS.document(documentId))
  pipeline.del(KEYS.templateMatch(documentId))

  if (contentHash) {
    pipeline.del(KEYS.documentByHash(contentHash))
  }

  await pipeline.exec()
}

/**
 * Cache template list
 */
export async function cacheTemplateList(templates: DocumentTemplate[], category?: string): Promise<void> {
  await redis.set(KEYS.templateList(category), JSON.stringify(templates), { ex: CACHE_TTL.template_list })
}

/**
 * Get cached template list
 */
export async function getCachedTemplateList(category?: string): Promise<DocumentTemplate[] | null> {
  const cached = await redis.get<string>(KEYS.templateList(category))
  if (!cached) return null

  try {
    return JSON.parse(cached) as DocumentTemplate[]
  } catch {
    return null
  }
}

/**
 * Invalidate template list cache
 */
export async function invalidateTemplateListCache(): Promise<void> {
  // Get all template list keys and delete them
  const keys = await redis.keys("documind:templates:*")
  if (keys.length > 0) {
    await redis.del(...keys)
  }
}

/**
 * Cache template match result
 */
export async function cacheTemplateMatch(documentId: string, matches: TemplateMatch[]): Promise<void> {
  await redis.set(KEYS.templateMatch(documentId), JSON.stringify(matches), { ex: CACHE_TTL.fingerprint_match })
}

/**
 * Get cached template match
 */
export async function getCachedTemplateMatch(documentId: string): Promise<TemplateMatch[] | null> {
  const cached = await redis.get<string>(KEYS.templateMatch(documentId))
  if (!cached) return null

  try {
    return JSON.parse(cached) as TemplateMatch[]
  } catch {
    return null
  }
}

/**
 * Cache processing job status
 */
export async function cacheJobStatus(jobId: string, status: Record<string, any>): Promise<void> {
  await redis.set(KEYS.job(jobId), JSON.stringify(status), {
    ex: 3600, // 1 hour
  })
}

/**
 * Get cached job status
 */
export async function getCachedJobStatus(jobId: string): Promise<Record<string, any> | null> {
  const cached = await redis.get<string>(KEYS.job(jobId))
  if (!cached) return null

  try {
    return JSON.parse(cached)
  } catch {
    return null
  }
}

/**
 * Delete job from cache
 */
export async function deleteJobFromCache(jobId: string): Promise<void> {
  await redis.del(KEYS.job(jobId))
}
