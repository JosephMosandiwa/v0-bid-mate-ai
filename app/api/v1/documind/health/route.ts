// ============================================
// DOCUMIND API - HEALTH CHECK
// GET /api/v1/documind/health
// ============================================

import { NextResponse } from "next/server"
import { Redis } from "@upstash/redis"
import { createClient } from "@/lib/supabase/server"
import { type ApiResponse, API_VERSION } from "@/lib/engines/documind"

interface HealthStatus {
  status: "healthy" | "degraded" | "unhealthy"
  version: string
  components: {
    name: string
    status: "healthy" | "unhealthy"
    latency_ms: number
    message?: string
  }[]
}

export async function GET() {
  const components: HealthStatus["components"] = []
  let overallStatus: HealthStatus["status"] = "healthy"

  // Check Redis
  try {
    const redisStart = Date.now()
    const redis = new Redis({
      url: process.env.KV_REST_API_URL!,
      token: process.env.KV_REST_API_TOKEN!,
    })
    await redis.ping()
    components.push({
      name: "redis",
      status: "healthy",
      latency_ms: Date.now() - redisStart,
    })
  } catch (error) {
    components.push({
      name: "redis",
      status: "unhealthy",
      latency_ms: 0,
      message: error instanceof Error ? error.message : "Connection failed",
    })
    overallStatus = "degraded"
  }

  // Check Supabase
  try {
    const dbStart = Date.now()
    const supabase = await createClient()
    await supabase.from("documind_documents").select("id").limit(1)
    components.push({
      name: "database",
      status: "healthy",
      latency_ms: Date.now() - dbStart,
    })
  } catch (error) {
    components.push({
      name: "database",
      status: "unhealthy",
      latency_ms: 0,
      message: error instanceof Error ? error.message : "Connection failed",
    })
    overallStatus = "unhealthy"
  }

  // Check Blob storage
  try {
    const blobStart = Date.now()
    // Simple check - just verify env var exists
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      throw new Error("BLOB_READ_WRITE_TOKEN not configured")
    }
    components.push({
      name: "blob_storage",
      status: "healthy",
      latency_ms: Date.now() - blobStart,
    })
  } catch (error) {
    components.push({
      name: "blob_storage",
      status: "unhealthy",
      latency_ms: 0,
      message: error instanceof Error ? error.message : "Not configured",
    })
    overallStatus = "degraded"
  }

  const response: ApiResponse<HealthStatus> = {
    success: overallStatus !== "unhealthy",
    data: {
      status: overallStatus,
      version: API_VERSION,
      components,
    },
  }

  return NextResponse.json(response, {
    status: overallStatus === "unhealthy" ? 503 : 200,
  })
}
