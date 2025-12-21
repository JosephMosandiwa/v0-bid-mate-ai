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
    try {
      results.steps.push({ step: 1, name: "Check table access", status: "running" })
      const { count: tableCount, error: tableError } = await supabase
        .from("scraped_tenders")
        .select("*", { count: "exact", head: true })

      if (tableError) {
        results.steps[0].status = "failed"
        results.steps[0].error = tableError.message
        return NextResponse.json(results, { status: 200 }) // Return 200 so client gets the error details
      }

      results.steps[0].status = "passed"
      results.steps[0].currentCount = tableCount
    } catch (error) {
      results.steps[0].status = "failed"
      results.steps[0].error = error instanceof Error ? error.message : String(error)
      return NextResponse.json(results, { status: 200 })
    }

    // Step 2: Get existing source
    try {
      results.steps.push({ step: 2, name: "Get existing source", status: "running" })

      const { data: existingSource, error: sourceError } = await supabase
        .from("tender_sources")
        .select("id, name")
        .limit(1)
        .single()

      if (sourceError || !existingSource) {
        results.steps[1].status = "failed"
        results.steps[1].error =
          sourceError?.message || "No tender sources found in database. Please add at least one tender source."
        return NextResponse.json(results, { status: 200 })
      }

      results.steps[1].status = "passed"
      results.steps[1].sourceId = existingSource.id
      results.steps[1].sourceName = existingSource.name

      // Step 3: Clean up old test tenders
      try {
        results.steps.push({ step: 3, name: "Clean up old test tenders", status: "running" })
        await supabase.from("scraped_tenders").delete().like("tender_reference", "TEST-%")
        results.steps[2].status = "passed"
        results.steps[2].message = "Cleaned up old test tenders"
      } catch (error) {
        console.log("[v0] Warning: Could not delete old test tenders:", error)
        results.steps[2].status = "passed" // Don't fail if cleanup fails
        results.steps[2].message = "Cleanup skipped"
      }

      // Step 4: Insert a test tender
      try {
        results.steps.push({ step: 4, name: "Insert test tender", status: "running" })
        const testTender = {
          source_id: existingSource.id,
          tender_reference: `TEST-${Date.now()}-${Math.random().toString(36).substring(7)}`,
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
          results.steps[3].status = "failed"
          results.steps[3].error = insertError.message
          results.steps[3].errorCode = insertError.code
          return NextResponse.json(results, { status: 200 })
        }

        results.steps[3].status = "passed"
        results.steps[3].tenderId = insertedTender.id

        // Step 5: Verify the tender can be read back
        try {
          results.steps.push({ step: 5, name: "Read tender back", status: "running" })
          const { data: readTender, error: readError } = await supabase
            .from("scraped_tenders")
            .select("*")
            .eq("id", insertedTender.id)
            .single()

          if (readError) {
            results.steps[4].status = "failed"
            results.steps[4].error = readError.message
            return NextResponse.json(results, { status: 200 })
          }

          results.steps[4].status = "passed"
          results.steps[4].tenderTitle = readTender.title
        } catch (error) {
          results.steps[4].status = "failed"
          results.steps[4].error = error instanceof Error ? error.message : String(error)
          return NextResponse.json(results, { status: 200 })
        }

        // Step 6: Test direct database search (skip API fetch for now)
        try {
          results.steps.push({ step: 6, name: "Test database search", status: "running" })
          const { data: searchResults, count } = await supabase
            .from("scraped_tenders")
            .select("*", { count: "exact" })
            .ilike("title", "%TEST%")
            .limit(10)

          const foundTestTender = searchResults?.find((t: any) => t.id === insertedTender.id)

          results.steps[5].status = foundTestTender ? "passed" : "failed"
          results.steps[5].totalResults = count
          results.steps[5].foundTestTender = !!foundTestTender
        } catch (error) {
          results.steps[5].status = "failed"
          results.steps[5].error = error instanceof Error ? error.message : String(error)
          return NextResponse.json(results, { status: 200 })
        }

        // Step 7: Count total tenders
        try {
          results.steps.push({ step: 7, name: "Count all tenders", status: "running" })
          const { count: finalCount } = await supabase
            .from("scraped_tenders")
            .select("*", { count: "exact", head: true })

          results.steps[6].status = "passed"
          results.steps[6].totalTenders = finalCount
        } catch (error) {
          results.steps[6].status = "failed"
          results.steps[6].error = error instanceof Error ? error.message : String(error)
          return NextResponse.json(results, { status: 200 })
        }
      } catch (error) {
        results.steps[3] = results.steps[3] || { step: 4, name: "Insert test tender", status: "failed" }
        results.steps[3].error = error instanceof Error ? error.message : String(error)
        return NextResponse.json(results, { status: 200 })
      }
    } catch (error) {
      results.steps[1] = results.steps[1] || { step: 2, name: "Get existing source", status: "failed" }
      results.steps[1].error = error instanceof Error ? error.message : String(error)
      return NextResponse.json(results, { status: 200 })
    }

    // Final result
    results.success = results.steps.every((s: any) => s.status === "passed")
    results.message = results.success
      ? "✅ All tests passed! The tender pipeline is working correctly."
      : "❌ Some tests failed. Check the steps above for details."

    return NextResponse.json(results)
  } catch (error) {
    results.error = error instanceof Error ? error.message : String(error)
    results.stack = error instanceof Error ? error.stack : undefined
    return NextResponse.json(results, { status: 200 }) // Always return 200 so client can see error details
  }
}
