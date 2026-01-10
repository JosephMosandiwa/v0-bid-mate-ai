import fetch from "node-fetch"
import { engineOrchestrator } from "../lib/engines/orchestrator/index.js"

async function runMockUploadFlow() {
  console.log("Test scaffold: mock upload flow - this is a manual scaffold. Replace with your test runner.")

  // Example: call processUploadedDocument with a small sample PDF buffer
  try {
    const sample = new ArrayBuffer(8)
    const res = await engineOrchestrator.processUploadedDocument(sample, "application/pdf", "test-user")
    console.log("Orchestrator result:", { success: res.success, hasDocument: !!res.document })
  } catch (err) {
    console.error("Mock orchestrator test failed:", err)
  }
}

runMockUploadFlow()
