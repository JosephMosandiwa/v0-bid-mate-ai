/**
 * Phase 3a: Orchestrator Smoke Test
 * Direct Node.js invocation (bypasses HTTP layer)
 * Tests: tender validation, strategist enrichment, opportunity identification
 */

import { engineOrchestrator } from "../lib/engines/orchestrator"

interface TestResult {
  testName: string
  passed: boolean
  duration: number
  details?: Record<string, unknown>
  error?: string
}

const results: TestResult[] = []

async function runTest(
  testName: string,
  testFn: () => Promise<void>,
): Promise<void> {
  const startTime = Date.now()
  try {
    await testFn()
    const duration = Date.now() - startTime
    results.push({ testName, passed: true, duration })
    console.log(`✓ ${testName} (${duration}ms)`)
  } catch (error) {
    const duration = Date.now() - startTime
    results.push({
      testName,
      passed: false,
      duration,
      error: error instanceof Error ? error.message : String(error),
    })
    console.log(`✗ ${testName} (${duration}ms)`)
    console.log(`  Error: ${error instanceof Error ? error.message : error}`)
  }
}

async function main() {
  console.log("========================================")
  console.log("Phase 3a: Orchestrator Smoke Test")
  console.log("========================================\n")

  // Test 1: Orchestrator object exists and has required methods
  await runTest("Orchestrator object exists", async () => {
    if (!engineOrchestrator) {
      throw new Error("engineOrchestrator is undefined")
    }
    if (typeof engineOrchestrator.processScrapedTender !== "function") {
      throw new Error("processScrapedTender method not found")
    }
  })

  // Test 2: Process a mock tender
  await runTest("Process mock tender through orchestrator", async () => {
    const mockTender = {
      tender_reference: `TEST-${Date.now()}`,
      title: "Test Tender for Orchestrator Validation",
      description:
        "Synthetic tender for smoke testing tender validation, strategist enrichment, and opportunity identification stages",
      source: "test",
      source_province: "ON",
      organization: "Test Organization Inc.",
      estimated_value: "150000",
      posted_date: new Date().toISOString(),
      closing_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      document_urls: [],
      raw_data: {
        ocds: {},
      },
    }

    const result = await engineOrchestrator.processScrapedTender(mockTender as any)

    if (!result) {
      throw new Error("orchestrator returned null/undefined result")
    }

    if (typeof result !== "object") {
      throw new Error(`Expected object result, got ${typeof result}`)
    }

    // Log result structure for debugging
    console.log("  Result structure:", {
      success: (result as any).success,
      hasValidation: "validation" in result,
      hasOpportunities: "opportunities" in result,
      hasError: "error" in result,
    })
  })

  // Test 3: Verify orchestrator handles invalid tender gracefully
  await runTest("Handle invalid tender gracefully", async () => {
    const invalidTender = {
      tender_reference: "",
      title: "",
    }

    const result = await engineOrchestrator.processScrapedTender(invalidTender as any)

    // Should either return error in result or throw - both are acceptable
    if (result && typeof result === "object") {
      const resultObj = result as any
      if (resultObj.success === false && !resultObj.error) {
        throw new Error("Expected error details in failed result")
      }
    }
  })

  // Print summary
  console.log("\n========================================")
  console.log("Test Results Summary")
  console.log("========================================")

  const passed = results.filter((r) => r.passed).length
  const failed = results.filter((r) => !r.passed).length
  const totalTime = results.reduce((sum, r) => sum + r.duration, 0)

  console.log(`Passed: ${passed}/${results.length}`)
  console.log(`Failed: ${failed}/${results.length}`)
  console.log(`Total time: ${totalTime}ms\n`)

  results.forEach((result) => {
    const status = result.passed ? "✓" : "✗"
    console.log(`${status} ${result.testName} (${result.duration}ms)`)
    if (result.error) {
      console.log(`  → ${result.error}`)
    }
  })

  process.exit(failed > 0 ? 1 : 0)
}

main().catch((error) => {
  console.error("Fatal error:", error)
  process.exit(1)
})
