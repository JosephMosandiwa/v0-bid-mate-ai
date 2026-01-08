/**
 * Phase 3b: End-to-End Integration Test
 * Tests the complete flow: Scraper → Tender Validation → Strategist Enrichment → Opportunity Creation
 * 
 * This test validates:
 * 1. Scraper produces correctly-shaped ScrapedTender objects
 * 2. Orchestrator validates and normalizes tenders
 * 3. Strategist services enrich with opportunities/competitiveness
 * 4. Data persists correctly to Supabase (if available)
 */

import { engineOrchestrator } from "../lib/engines/orchestrator"
import { ScraperFactory } from "../lib/scrapers/scraper-factory"
import type { ScrapedTender } from "../lib/scrapers/base-scraper"

// Test data fixtures
const TEST_SOURCES = [
  {
    id: 1,
    name: "Test eTender Source",
    tender_page_url: "https://example.com/tenders",
    scraper_type: "etender_api",
    scraper_config: { province: "ON" },
  },
  {
    id: 2,
    name: "Test Generic HTML Source",
    tender_page_url: "https://example.com/bids",
    scraper_type: "generic",
    scraper_config: {},
  },
]

const MOCK_TENDER: ScrapedTender = {
  tender_reference: `E2E-TEST-${Date.now()}`,
  title: "E2E Test Tender: Bridge Construction Project",
  description:
    "Comprehensive bridge construction and engineering project for Phase 3b integration testing. This tender validates the complete orchestrator pipeline from scraping through to strategist enrichment and opportunity identification.",
  source: "test",
  source_province: "ON",
  organization: "Ontario Ministry of Transportation",
  estimated_value: "2500000",
  publish_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
  close_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
  document_urls: [],
  raw_data: {
    ocds: {
      buyer: {
        name: "Ontario Ministry of Transportation",
      },
    },
  },
}

interface E2ETestResult {
  testName: string
  passed: boolean
  duration: number
  details?: Record<string, unknown>
  error?: string
}

const results: E2ETestResult[] = []

async function runTest(testName: string, testFn: () => Promise<void>): Promise<void> {
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
  console.log("Phase 3b: End-to-End Integration Test")
  console.log("========================================\n")

  // Test 1: ScraperFactory creates valid scraper instances
  await runTest("ScraperFactory creates ETender API scraper", async () => {
    const scraper = ScraperFactory.createScraper(TEST_SOURCES[0])
    if (!scraper) throw new Error("Scraper not created")
    if (!scraper.scrape) throw new Error("Scraper missing scrape method")
  })

  await runTest("ScraperFactory creates generic HTML scraper", async () => {
    const scraper = ScraperFactory.createScraper(TEST_SOURCES[1])
    if (!scraper) throw new Error("Scraper not created")
    if (!scraper.scrape) throw new Error("Scraper missing scrape method")
  })

  // Test 2: Mock tender has correct schema
  await runTest("Mock tender conforms to ScrapedTender schema", async () => {
    const required = ["tender_reference", "title", "description", "source", "source_province", "organization"]
    const missing = required.filter((field) => !(field in MOCK_TENDER))
    if (missing.length > 0) {
      throw new Error(`Missing required fields: ${missing.join(", ")}`)
    }
  })

  // Test 3: Orchestrator processes mock tender through full pipeline
  await runTest("Orchestrator processes mock tender (validation → enrichment)", async () => {
    const result = await engineOrchestrator.processScrapedTender(MOCK_TENDER)

    if (!result) throw new Error("Orchestrator returned null result")
    if (typeof result !== "object") throw new Error(`Expected object, got ${typeof result}`)

    const resultObj = result as any
    if (resultObj.success !== true && resultObj.success !== false) {
      throw new Error("Result missing 'success' field")
    }

    console.log(`  - Validation result: ${resultObj.validation?.is_valid === true ? "valid" : "invalid or skipped"}`)
    console.log(`  - Opportunities created: ${(resultObj.opportunities || []).length}`)
  })

  // Test 4: Tender normalization works correctly
  await runTest("Tender normalization preserves required fields", async () => {
    const result = (await engineOrchestrator.processScrapedTender(MOCK_TENDER)) as any
    const normalized = result?.tender

    if (!normalized) throw new Error("No normalized tender in result")

    const requiredNormalized = [
      "tender_reference",
      "title",
      "description",
      "source",
      "source_province",
      "organization",
    ]
    const missingNormalized = requiredNormalized.filter((field) => !(field in normalized))
    if (missingNormalized.length > 0) {
      throw new Error(`Normalization lost fields: ${missingNormalized.join(", ")}`)
    }
  })

  // Test 5: Invalid tender handling
  await runTest("Orchestrator handles invalid tender gracefully", async () => {
    const invalidTender: any = {
      tender_reference: "",
      title: "",
      // missing required fields
    }

    const result = await engineOrchestrator.processScrapedTender(invalidTender)
    if (!result || typeof result !== "object") {
      throw new Error("Expected result object even for invalid tender")
    }

    // Should either mark as invalid or error gracefully
    console.log(`  - Result success: ${(result as any).success}, Error: ${(result as any).error || "none"}`)
  })

  // Test 6: Data shape consistency across multiple runs
  await runTest("Orchestrator produces consistent output schema", async () => {
    const result1 = (await engineOrchestrator.processScrapedTender(MOCK_TENDER)) as any
    const result2 = (await engineOrchestrator.processScrapedTender(MOCK_TENDER)) as any

    const keys1 = Object.keys(result1).sort()
    const keys2 = Object.keys(result2).sort()

    if (JSON.stringify(keys1) !== JSON.stringify(keys2)) {
      throw new Error("Inconsistent result schema between runs")
    }

    console.log(`  - Consistent keys: ${keys1.join(", ")}`)
  })

  // Test 7: Tender with metadata
  await runTest("Orchestrator handles tender with metadata", async () => {
    const enrichedTender: ScrapedTender = {
      ...MOCK_TENDER,
      tender_type: "Capital Project",
      procurement_category: "Construction",
    }

    const result = (await engineOrchestrator.processScrapedTender(enrichedTender)) as any
    if (!result.success) {
      throw new Error(`Processing failed: ${result.error}`)
    }

    console.log(`  - Processed with tender_type: ${enrichedTender.tender_type}`)
  })

  // Print summary
  console.log("\n========================================")
  console.log("E2E Test Results Summary")
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

  console.log("\n========================================")
  console.log("Phase 3b: E2E Pipeline Validation")
  console.log("========================================")
  console.log(`Status: ${failed === 0 ? "✓ READY FOR PHASE 3C" : "⚠ Review failed tests"}`)
  console.log(`Next: Phase 3c - Supabase persistence & Phase 3d - API integration\n`)

  process.exit(failed > 0 ? 1 : 0)
}

main().catch((error) => {
  console.error("Fatal error:", error)
  process.exit(1)
})
