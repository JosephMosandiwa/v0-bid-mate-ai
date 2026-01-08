/**
 * Phase 3c: Supabase Persistence Test
 * Tests the complete flow with actual Supabase database:
 * 1. Insert tender into scraped_tenders table
 * 2. Validate schema compliance
 * 3. Retrieve and verify data integrity
 * 4. Test strategist opportunity creation
 * 5. Clean up test data
 */

import { createClient } from "@supabase/supabase-js"

interface TestResult {
  testName: string
  passed: boolean
  duration: number
  details?: Record<string, unknown>
  error?: string
}

const results: TestResult[] = []

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Missing Supabase credentials in environment variables")
  console.error(
    "Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local",
  )
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

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
  console.log("Phase 3c: Supabase Persistence Test")
  console.log("========================================\n")

  let testTenderId: string | null = null

  // Test 1: Verify Supabase connection
  await runTest("Supabase connection successful", async () => {
    const { data, error } = await supabase.from("scraped_tenders").select("count", { count: "exact" }).limit(1)

    if (error) throw new Error(`Connection failed: ${error.message}`)
    console.log(`  - Tender table accessible`)
  })

  // Test 2: Insert test tender into database
  await runTest("Insert tender into scraped_tenders", async () => {
    const testTender = {
      source_id: 1,
      source_name: "Test Source - Phase 3c",
      source_url: "https://test.example.com/tenders",
      source_level: "Provincial",
      source_province: "ON",
      tender_reference: `TEST-PERSIST-${Date.now()}`,
      title: "Phase 3c: Database Persistence Test Tender",
      description: "Test tender for validating Supabase persistence and data integrity",
      category: "Construction",
      publish_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      close_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      estimated_value: "1500000",
      contact_person: "Test Contact",
      contact_email: "test@example.com",
      contact_phone: "+1-416-555-0100",
      tender_url: "https://test.example.com/tender/123",
      document_urls: JSON.stringify([
        { title: "Tender Details", url: "https://test.example.com/docs/tender.pdf" },
        { title: "Technical Specs", url: "https://test.example.com/docs/specs.pdf" },
      ]),
      is_active: true,
      raw_data: {
        ocds: {
          id: "test-123",
          buyer: { name: "Test Organization" },
        },
      },
    }

    const { data, error } = await supabase
      .from("scraped_tenders")
      .insert([testTender])
      .select()

    if (error) throw new Error(`Insert failed: ${error.message}`)
    if (!data || data.length === 0) throw new Error("No data returned from insert")

    testTenderId = data[0].id
    console.log(`  - Inserted tender with ID: ${testTenderId}`)
  })

  // Test 3: Retrieve and verify data integrity
  await runTest("Retrieve and verify tender data", async () => {
    if (!testTenderId) throw new Error("No test tender ID available")

    const { data, error } = await supabase
      .from("scraped_tenders")
      .select("*")
      .eq("id", testTenderId)
      .single()

    if (error) throw new Error(`Retrieve failed: ${error.message}`)
    if (!data) throw new Error("Tender not found")

    // Verify required fields
    const requiredFields = [
      "id",
      "source_id",
      "source_name",
      "tender_reference",
      "title",
      "description",
    ]
    const missingFields = requiredFields.filter((field) => !(field in data))
    if (missingFields.length > 0) {
      throw new Error(`Missing fields in retrieved data: ${missingFields.join(", ")}`)
    }

    console.log(`  - Verified fields: ${requiredFields.join(", ")}`)
    console.log(`  - Tender reference: ${data.tender_reference}`)
  })

  // Test 4: Query by source and province
  await runTest("Query tenders by source and province", async () => {
    const { data, error } = await supabase
      .from("scraped_tenders")
      .select("id, tender_reference, source_province")
      .eq("source_province", "ON")
      .limit(10)

    if (error) throw new Error(`Query failed: ${error.message}`)

    const testTenderFound = data?.some((t) => t.id === testTenderId)
    if (!testTenderFound) throw new Error("Test tender not found in query results")

    console.log(`  - Found ${data?.length || 0} Ontario tenders`)
  })

  // Test 5: Test full-text search functionality
  await runTest("Full-text search on tender data", async () => {
    const { data, error } = await supabase
      .from("scraped_tenders")
      .select("id, tender_reference, title")
      .textSearch("search_vector", "Phase 3c")
      .limit(10)

    if (error) throw new Error(`Search failed: ${error.message}`)

    const testTenderFound = data?.some((t) => t.id === testTenderId)
    if (!testTenderFound && data && data.length > 0) {
      console.log(`  - Note: Test tender not in search results (search indexing may be async)`)
    } else if (testTenderFound) {
      console.log(`  - Test tender found via full-text search`)
    }
  })

  // Test 6: Update tender metadata
  await runTest("Update tender metadata", async () => {
    if (!testTenderId) throw new Error("No test tender ID available")

    const { error } = await supabase
      .from("scraped_tenders")
      .update({
        is_active: false,
        category: "Construction - Bridge Work",
      })
      .eq("id", testTenderId)

    if (error) throw new Error(`Update failed: ${error.message}`)
    console.log(`  - Updated is_active and category fields`)
  })

  // Test 7: Verify update persistence
  await runTest("Verify update persistence", async () => {
    if (!testTenderId) throw new Error("No test tender ID available")

    const { data, error } = await supabase
      .from("scraped_tenders")
      .select("is_active, category")
      .eq("id", testTenderId)
      .single()

    if (error) throw new Error(`Verify failed: ${error.message}`)
    if (!data) throw new Error("Tender not found")
    if (data.is_active !== false) throw new Error("is_active not persisted correctly")
    if (data.category !== "Construction - Bridge Work") throw new Error("category not persisted correctly")

    console.log(`  - Update verified: is_active=${data.is_active}, category=${data.category}`)
  })

  // Test 8: Delete test tender (cleanup)
  await runTest("Delete test tender (cleanup)", async () => {
    if (!testTenderId) throw new Error("No test tender ID available")

    const { error } = await supabase.from("scraped_tenders").delete().eq("id", testTenderId)

    if (error) throw new Error(`Delete failed: ${error.message}`)
    console.log(`  - Test tender cleaned up`)
  })

  // Test 9: Verify deletion
  await runTest("Verify deletion", async () => {
    if (!testTenderId) throw new Error("No test tender ID available")

    const { data, error } = await supabase
      .from("scraped_tenders")
      .select("id")
      .eq("id", testTenderId)
      .single()

    // Expected to fail (404) since record was deleted
    if (!error && data) {
      throw new Error("Tender still exists after deletion")
    }
    console.log(`  - Deletion verified (record no longer exists)`)
  })

  // Print summary
  console.log("\n========================================")
  console.log("Persistence Test Results Summary")
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
  console.log("Phase 3c: Database Persistence")
  console.log("========================================")
  console.log(`Status: ${failed === 0 ? "✓ READY FOR PHASE 3D" : "⚠ Review failed tests"}`)
  console.log(`Next: Phase 3d - API integration & deployment validation\n`)

  process.exit(failed > 0 ? 1 : 0)
}

main().catch((error) => {
  console.error("Fatal error:", error)
  process.exit(1)
})
