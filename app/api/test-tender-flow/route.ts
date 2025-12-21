import { createAdminClient } from "@/lib/supabase/admin"
import { NextResponse } from "next/server"

export async function POST() {
  const results: any = {
    steps: [],
    success: false,
  }

  try {
    const supabase = createAdminClient()

    // Step 1: Check if scraped_tenders table exists and is accessible
    results.steps.push({ step: 1, name: "Check table access", status: "running" })
    const { count: tableCount, error: tableError } = await supabase
      .from("scraped_tenders")
      .select("*", { count: "exact", head: true })

    if (tableError) {
      results.steps[0].status = "failed"
      results.steps[0].error = tableError.message
      return NextResponse.json(results, { status: 500 })
    }

    results.steps[0].status = "passed"
    results.steps[0].currentCount = tableCount

    // Step 2: Insert a test tender
    results.steps.push({ step: 2, name: "Insert test tender", status: "running" })
    const testTender = {
      tender_reference: `TEST-${Date.now()}`,
      title: "TEST: Website Development Services",
      description: "This is a test tender to verify the scraping and display pipeline is working correctly.",
      source_name: "Test Municipality",
      source_level: "municipal",
      source_province: "Gauteng",
      close_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      source_url: "https://test.example.com/tender",
      tender_url: "https://test.example.com/tender",
      category: "IT Services",
      estimated_value: "R 500,000",
      is_active: true,
      scraped_at: new Date().toISOString(),
    }

    const { data: insertedTender, error: insertError } = await supabase
      .from("scraped_tenders")
      .insert(testTender)
      .select()
      .single()

    if (insertError) {
      results.steps[1].status = "failed"
      results.steps[1].error = insertError.message
      results.steps[1].errorCode = insertError.code
      results.steps[1].errorDetails = insertError.details
      return NextResponse.json(results, { status: 500 })
    }

    results.steps[1].status = "passed"
    results.steps[1].tenderId = insertedTender.id

    // Step 3: Verify the tender can be read back
    results.steps.push({ step: 3, name: "Read tender back", status: "running" })
    const { data: readTender, error: readError } = await supabase
      .from("scraped_tenders")
      .select("*")
      .eq("id", insertedTender.id)
      .single()

    if (readError) {
      results.steps[2].status = "failed"
      results.steps[2].error = readError.message
      return NextResponse.json(results, { status: 500 })
    }

    results.steps[2].status = "passed"
    results.steps[2].tender = readTender

    // Step 4: Test the search API
    results.steps.push({ step: 4, name: "Test search API", status: "running" })
    const searchResponse = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/tenders/search?q=TEST&limit=10`,
    )

    if (!searchResponse.ok) {
      results.steps[3].status = "failed"
      results.steps[3].error = "Search API returned error"
      results.steps[3].statusCode = searchResponse.status
      return NextResponse.json(results, { status: 500 })
    }

    const searchData = await searchResponse.json()
    const foundTestTender = searchData.tenders?.find((t: any) => t.id === insertedTender.id)

    results.steps[3].status = foundTestTender ? "passed" : "failed"
    results.steps[3].totalResults = searchData.total
    results.steps[3].foundTestTender = !!foundTestTender

    // Step 5: Count total tenders
    results.steps.push({ step: 5, name: "Count all tenders", status: "running" })
    const { count: finalCount } = await supabase.from("scraped_tenders").select("*", { count: "exact", head: true })

    results.steps[4].status = "passed"
    results.steps[4].totalTenders = finalCount

    // Final result
    results.success = results.steps.every((s: any) => s.status === "passed")
    results.message = results.success
      ? "✅ All tests passed! The tender pipeline is working correctly."
      : "❌ Some tests failed. Check the steps above for details."

    return NextResponse.json(results)
  } catch (error) {
    results.error = error instanceof Error ? error.message : String(error)
    return NextResponse.json(results, { status: 500 })
  }
}
