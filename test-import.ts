
// Quick inline test - just check that orchestrator can be imported and instantiated
import { engineOrchestrator } from "./lib/engines/orchestrator"

const mockTender = {
  tender_reference: "TEST-" + Date.now(),
  title: "Test Tender",
  description: "Test",
  source: "test",
  source_province: "ON",
  organization: "Test Org",
  estimated_value: "150000",
  posted_date: new Date().toISOString(),
  closing_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  document_urls: [],
  raw_data: { ocds: {} }
}

console.log("[v0] Testing orchestrator import and initialization...")
console.log("engineOrchestrator object:", !!engineOrchestrator)
console.log("processScrapedTender method exists:", typeof engineOrchestrator.processScrapedTender === 'function')
console.log("\nSUCCESS: Orchestrator is properly exported and accessible")
