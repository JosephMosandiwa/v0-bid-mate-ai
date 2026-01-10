/**
 * Phase 3a: Orchestrator Smoke Test
 * Direct Node.js invocation (bypasses HTTP layer)
 * Tests: tender validation, strategist enrichment, opportunity identification
 */

(async () => {
  try {
    // Import the orchestrator directly
    const { engineOrchestrator } = await import("../lib/engines/orchestrator/index.mjs");

    const results = [];

    function logTest(name, passed, duration, error = null) {
      const status = passed ? "✓" : "✗";
      console.log(`${status} ${name} (${duration}ms)`);
      if (error) {
        console.log(`  Error: ${error}`);
      }
      results.push({ name, passed, duration, error });
    }

    console.log("========================================");
    console.log("Phase 3a: Orchestrator Smoke Test");
    console.log("========================================\n");

    // Test 1: Orchestrator object exists
    let start = Date.now();
    try {
      if (!engineOrchestrator) {
        throw new Error("engineOrchestrator is undefined");
      }
      if (typeof engineOrchestrator.processScrapedTender !== "function") {
        throw new Error("processScrapedTender method not found");
      }
      logTest("Orchestrator object exists", true, Date.now() - start);
    } catch (error) {
      logTest("Orchestrator object exists", false, Date.now() - start, error.message);
    }

    // Test 2: Process a mock tender
    start = Date.now();
    try {
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
      };

      const result = await engineOrchestrator.processScrapedTender(mockTender);

      if (!result) {
        throw new Error("orchestrator returned null/undefined result");
      }

      if (typeof result !== "object") {
        throw new Error(`Expected object result, got ${typeof result}`);
      }

      console.log("  Result keys:", Object.keys(result).join(", "));
      logTest("Process mock tender through orchestrator", true, Date.now() - start);
    } catch (error) {
      logTest("Process mock tender through orchestrator", false, Date.now() - start, error.message);
    }

    // Test 3: Handle invalid tender gracefully
    start = Date.now();
    try {
      const invalidTender = {
        tender_reference: "",
        title: "",
      };

      const result = await engineOrchestrator.processScrapedTender(invalidTender);

      if (!result || typeof result !== "object") {
        throw new Error("Expected result object");
      }

      logTest("Handle invalid tender gracefully", true, Date.now() - start);
    } catch (error) {
      logTest("Handle invalid tender gracefully", false, Date.now() - start, error.message);
    }

    // Print summary
    console.log("\n========================================");
    console.log("Test Results Summary");
    console.log("========================================");

    const passed = results.filter((r) => r.passed).length;
    const failed = results.filter((r) => !r.passed).length;
    const totalTime = results.reduce((sum, r) => sum + r.duration, 0);

    console.log(`Passed: ${passed}/${results.length}`);
    console.log(`Failed: ${failed}/${results.length}`);
    console.log(`Total time: ${totalTime}ms\n`);

    process.exit(failed > 0 ? 1 : 0);
  } catch (error) {
    console.error("Fatal error:", error);
    process.exit(1);
  }
})();
