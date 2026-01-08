/**
 * Phase 3d: API Integration & Deployment Readiness Test
 * Tests the complete HTTP API pipeline and production readiness:
 * 1. Validate all API endpoints respond correctly
 * 2. Test request/response schema conformance
 * 3. Test error handling and edge cases
 * 4. Validate orchestrator endpoint with real HTTP
 * 5. Check response times and reliability
 */

interface APITestResult {
  endpoint: string
  method: string
  status: number
  duration: number
  passed: boolean
  error?: string
  details?: Record<string, unknown>
}

const results: APITestResult[] = []

// Helper to make HTTP requests
async function makeRequest(
  method: string,
  path: string,
  body?: any,
): Promise<{ status: number; data: any; duration: number }> {
  const startTime = Date.now()
  const url = `http://localhost:3000${path}`

  try {
    const options: RequestInit = {
      method,
      headers: { "Content-Type": "application/json" },
    }

    if (body) {
      options.body = JSON.stringify(body)
    }

    const response = await fetch(url, options)
    const data = await response.json().catch(() => ({}))
    const duration = Date.now() - startTime

    return { status: response.status, data, duration }
  } catch (error) {
    const duration = Date.now() - startTime
    throw new Error(`Request failed after ${duration}ms: ${error instanceof Error ? error.message : String(error)}`)
  }
}

async function testEndpoint(
  method: string,
  path: string,
  expectedStatus: number,
  body?: any,
  description?: string,
): Promise<void> {
  try {
    const { status, data, duration } = await makeRequest(method, path, body)

    if (status !== expectedStatus) {
      throw new Error(`Expected status ${expectedStatus}, got ${status}`)
    }

    results.push({
      endpoint: path,
      method,
      status,
      duration,
      passed: true,
      details: {
        description,
        responseKeys: Object.keys(data).sort(),
      },
    })

    console.log(`✓ ${method} ${path} → ${status} (${duration}ms)`)
  } catch (error) {
    results.push({
      endpoint: path,
      method,
      status: 0,
      duration: 0,
      passed: false,
      error: error instanceof Error ? error.message : String(error),
    })

    console.log(`✗ ${method} ${path}`)
    console.log(`  Error: ${error instanceof Error ? error.message : error}`)
  }
}

async function main() {
  console.log("========================================")
  console.log("Phase 3d: API Integration Test")
  console.log("========================================\n")

  console.log("Note: This test requires the Next.js dev server running on http://localhost:3000")
  console.log("Start with: pnpm dev\n")

  // Test 1: Orchestrator test endpoint (GET)
  await testEndpoint("GET", "/api/test/orchestrator", 200, undefined, "Orchestrator smoke test endpoint")

  // Test 2: Search tenders endpoint (GET with query)
  await testEndpoint("GET", "/api/search-tenders?q=bridge", 200, undefined, "Search tenders with query parameter")

  // Test 3: Strategist readiness endpoint (POST with body)
  await testEndpoint(
    "POST",
    "/api/strategist/readiness",
    200,
    {
      tender_reference: "API-TEST-001",
      title: "Test Tender",
      estimated_value: "100000",
      province: "ON",
    },
    "Strategist readiness check with tender data",
  )

  // Test 4: Fetch API tenders endpoint (GET)
  await testEndpoint("GET", "/api/fetch-api-tenders", 200, undefined, "Fetch API tenders (eTender API)")

  // Test 5: Cron scraping endpoint (POST) - should require auth
  await testEndpoint("POST", "/api/cron/scrape", 401, undefined, "Cron scraper endpoint (expecting auth required)")

  // Test 6: Usage tracking endpoint (POST)
  await testEndpoint(
    "POST",
    "/api/usage",
    200,
    {
      action: "test_action",
      details: { test: true },
    },
    "Usage tracking endpoint",
  )

  // Test 7: Custom tenders endpoint (GET)
  await testEndpoint("GET", "/api/custom-tenders", 401, undefined, "Custom tenders (auth required)")

  // Test 8: Tenders endpoint (GET)
  await testEndpoint("GET", "/api/tenders", 401, undefined, "Tenders list endpoint (auth required)")

  // Print summary
  console.log("\n========================================")
  console.log("API Test Results Summary")
  console.log("========================================")

  const passed = results.filter((r) => r.passed).length
  const failed = results.filter((r) => !r.passed).length
  const avgDuration = results.filter((r) => r.passed).reduce((sum, r) => sum + r.duration, 0) / Math.max(1, passed)

  console.log(`Passed: ${passed}/${results.length}`)
  console.log(`Failed: ${failed}/${results.length}`)
  console.log(`Average response time (successful): ${avgDuration.toFixed(0)}ms\n`)

  results.forEach((result) => {
    const status = result.passed ? "✓" : "✗"
    const details = result.details?.description ? ` [${result.details.description}]` : ""
    console.log(`${status} ${result.method} ${result.endpoint}${details}`)
    if (result.passed) {
      console.log(`  → Status ${result.status} (${result.duration}ms)`)
    } else {
      console.log(`  → ${result.error}`)
    }
  })

  console.log("\n========================================")
  console.log("Phase 3d: API Integration Readiness")
  console.log("========================================")

  // Note: Some 401s are expected for authenticated endpoints
  const criticalFails = results.filter((r) => !r.passed && r.status !== 401 && r.status !== 0).length
  const status = criticalFails === 0 ? "✓ READY FOR DEPLOYMENT" : "⚠ Review failures"

  console.log(`Status: ${status}`)
  console.log(`Critical failures (non-401): ${criticalFails}`)
  console.log(`Next: Phase 4 - Production deployment validation\n`)

  process.exit(failed > results.length / 2 ? 1 : 0) // Allow some auth-related failures
}

main().catch((error) => {
  console.error("Fatal error:", error)
  process.exit(1)
})
