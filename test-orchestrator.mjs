#!/usr/bin/env node

/**
 * Direct orchestrator smoke test (bypasses HTTP)
 * Tests the engineOrchestrator.processScrapedTender() function
 */

import { engineOrchestrator } from "./lib/engines/orchestrator/index.ts"

async function runTest() {
  console.log("[v0] Orchestrator Smoke Test: Starting...\n")

  const mockTender = {
    tender_reference: `TEST-${Date.now()}`,
    title: "Test Tender for Orchestrator",
    description: "This is a synthetic tender used for smoke testing the orchestrator. It validates the tender validation, strategist enrichment, and opportunity identification stages.",
    source: "test",
    source_province: "ON",
    organization: "Test Organization Inc.",
    estimated_value: "150000",
    posted_date: new Date().toISOString(),
    closing_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    document_urls: [],
    raw_data: {
      ocds: {},
    }
  }

  try {
    console.log("Input tender:", JSON.stringify(mockTender, null, 2))
    console.log("\n--- Processing Tender ---\n")

    const result = await engineOrchestrator.processScrapedTender(mockTender)

    console.log("Result:", JSON.stringify(result, null, 2))
    console.log("\n[v0] Orchestrator Smoke Test: PASSED")
    process.exit(0)
  } catch (error) {
    console.error("[v0] Orchestrator Smoke Test: FAILED")
    console.error("Error:", error)
    process.exit(1)
  }
}

runTest()
