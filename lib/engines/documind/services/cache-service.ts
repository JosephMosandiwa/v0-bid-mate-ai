// ============================================
// DOCUMIND ENGINE - CACHING SERVICE
// Uses Upstash Redis for caching
// ============================================

import { Redis } from "@upstash/redis"
import type { ParsedDocument, DocumentTemplate, TemplateMatch } from "../types"
import { CACHE_TTL } from "../constants"

let redis: Redis | null = null

function getRedis(): Redis {
  if (!redis) {
    if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
      throw new Error("Redis environment variables not configured")
    }
    redis = new Redis({
      url: process.env.KV_REST_API_URL,
      token: process.env.KV_REST_API_TOKEN,
    })
  }
  return redis
}

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
  const client = getRedis()
  const pipeline = client.pipeline()

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
  const client = getRedis()
  const cached = await client.get<string>(KEYS.document(documentId))
  if (!cached) return null

  try {
    return typeof cached === "string" ? (JSON.parse(cached) as ParsedDocument) : (cached as ParsedDocument)
  } catch {
    return null
  }
}

/**
 * Get document ID by content hash (for deduplication)
 */
export async function getDocumentIdByHash(contentHash: string): Promise<string | null> {
  const client = getRedis()
  return client.get<string>(KEYS.documentByHash(contentHash))
}

/**
 * Delete cached document
 */
export async function deleteCachedDocument(documentId: string, contentHash?: string): Promise<void> {
  const client = getRedis()
  const pipeline = client.pipeline()

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
  const client = getRedis()
  await client.set(KEYS.templateList(category), JSON.stringify(templates), { ex: CACHE_TTL.template_list })
}

/**
 * Get cached template list
 */
export async function getCachedTemplateList(category?: string): Promise<DocumentTemplate[] | null> {
  const client = getRedis()
  const cached = await client.get<string>(KEYS.templateList(category))
  if (!cached) return null

  try {
    return typeof cached === "string" ? (JSON.parse(cached) as DocumentTemplate[]) : (cached as DocumentTemplate[])
  } catch {
    return null
  }
}

/**
 * Invalidate template list cache
 */
export async function invalidateTemplateListCache(): Promise<void> {
  const client = getRedis()
  // Get all template list keys and delete them
  const keys = await client.keys("documind:templates:*")
  if (keys.length > 0) {
    await client.del(...keys)
  }
}

/**
 * Cache template match result
 */
export async function cacheTemplateMatch(documentId: string, matches: TemplateMatch[]): Promise<void> {
  const client = getRedis()
  await client.set(KEYS.templateMatch(documentId), JSON.stringify(matches), { ex: CACHE_TTL.fingerprint_match })
}

/**
 * Get cached template match
 */
export async function getCachedTemplateMatch(documentId: string): Promise<TemplateMatch[] | null> {
  const client = getRedis()
  const cached = await client.get<string>(KEYS.templateMatch(documentId))
  if (!cached) return null

  try {
    return typeof cached === "string" ? (JSON.parse(cached) as TemplateMatch[]) : (cached as TemplateMatch[])
  } catch {
    return null
  }
}

/**
 * Cache processing job status
 */
export async function cacheJobStatus(jobId: string, status: Record<string, any>): Promise<void> {
  const client = getRedis()
  await client.set(KEYS.job(jobId), JSON.stringify(status), {
    ex: 3600, // 1 hour
  })
}

/**
 * Get cached job status
 */
export async function getCachedJobStatus(jobId: string): Promise<Record<string, any> | null> {
  const client = getRedis()
  const cached = await client.get<string>(KEYS.job(jobId))
  if (!cached) return null

  try {
    return typeof cached === "string" ? JSON.parse(cached) : cached
  } catch {
    return null
  }
}

/**
 * Delete job from cache
 */
export async function deleteJobFromCache(jobId: string): Promise<void> {
  const client = getRedis()
  await client.del(KEYS.job(jobId))
}

/**
 * Check if Redis is available
 */
export async function isRedisAvailable(): Promise<boolean> {
  try {
    const client = getRedis()
    await client.ping()
    return true
  } catch {
    return false
  }
}
