import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"

export async function GET() {
  const logs: string[] = []

  try {
    logs.push("Starting direct eTender API test...")

    // Calculate date range (last 30 days)
    const dateTo = new Date()
    const dateFrom = new Date()
    dateFrom.setDate(dateFrom.getDate() - 30)

    const dateToStr = dateTo.toISOString().split("T")[0]
    const dateFromStr = dateFrom.toISOString().split("T")[0]

    const url = `https://ocds-api.etenders.gov.za/api/OCDSReleases?PageNumber=1&PageSize=10&dateFrom=${dateFromStr}&dateTo=${dateToStr}`

    logs.push(`Fetching from: ${url}`)

    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
        "User-Agent": "BidMateAI/1.0",
      },
      signal: AbortSignal.timeout(30000),
    })

    logs.push(`Response status: ${response.status}`)
    logs.push(`Response headers: ${JSON.stringify(Object.fromEntries(response.headers.entries()))}`)

    if (!response.ok) {
      const errorText = await response.text()
      logs.push(`Error response: ${errorText.substring(0, 1000)}`)

      return NextResponse.json({
        success: false,
        error: `API returned ${response.status}`,
        logs,
        url,
      })
    }

    const data = await response.json()

    logs.push(`Response type: ${typeof data}`)
    logs.push(`Is array: ${Array.isArray(data)}`)
    logs.push(`Response keys: ${typeof data === "object" ? Object.keys(data).join(", ") : "N/A"}`)

    if (Array.isArray(data)) {
      logs.push(`Array length: ${data.length}`)
      if (data.length > 0) {
        logs.push(`First item keys: ${Object.keys(data[0]).join(", ")}`)
        logs.push(`First item sample: ${JSON.stringify(data[0]).substring(0, 500)}`)

        // Try to save one tender to database
        const supabase = createAdminClient()

        // Get or create source
        const { data: source, error: sourceError } = await supabase
          .from("tender_sources")
          .select("id")
          .eq("name", "National Treasury eTender (OCDS)")
          .maybeSingle()

        let sourceId = source?.id

        if (!sourceId) {
          const { data: newSource, error: insertError } = await supabase
            .from("tender_sources")
            .insert({
              name: "National Treasury eTender (OCDS)",
              level: "National",
              province: "All Provinces",
              tender_page_url: "https://ocds-api.etenders.gov.za",
              scraper_type: "api",
              is_active: true,
              scraping_enabled: true,
            })
            .select("id")
            .single()

          if (insertError) {
            logs.push(`Failed to create source: ${insertError.message}`)
            return NextResponse.json({
              success: false,
              error: "Failed to create source",
              logs,
              sourceError: insertError,
            })
          }

          sourceId = newSource.id
          logs.push(`Created new source with ID: ${sourceId}`)
        } else {
          logs.push(`Using existing source ID: ${sourceId}`)
        }

        // Try to save first tender
        const release = data[0]
        const tender = release.tender || {}
        const buyer = release.buyer || release.parties?.find((p: any) => p.roles?.includes("buyer")) || {}

        const tenderData = {
          source_id: sourceId,
          tender_reference: release.ocid || release.id || `ETENDER-${Date.now()}`,
          title: tender.title || release.title || "Untitled Tender",
          description: tender.description || release.description || "No description",
          source_name: buyer.name || "National Treasury",
          category: tender.mainProcurementCategory || "General",
          estimated_value: tender.value?.amount ? `R ${tender.value.amount}` : null,
          close_date: tender.tenderPeriod?.endDate || null,
          publish_date: release.date || new Date().toISOString(),
          source_url: `https://www.etenders.gov.za/tender/${release.ocid}`,
          tender_url: `https://www.etenders.gov.za/tender/${release.ocid}`,
          raw_data: release,
          source_level: "National",
          source_province: "All",
          is_active: true,
          scraped_at: new Date().toISOString(),
        }

        logs.push(`Attempting to save tender: ${tenderData.tender_reference}`)

        const { error: saveError } = await supabase
          .from("scraped_tenders")
          .upsert(tenderData, { onConflict: "source_id,tender_reference" })

        if (saveError) {
          logs.push(`Failed to save tender: ${saveError.message}`)
          return NextResponse.json({ success: false, error: "Failed to save tender", logs, saveError, tenderData })
        }

        logs.push(`Successfully saved tender!`)

        return NextResponse.json({
          success: true,
          tendersFound: data.length,
          sampleTender: data[0],
          logs,
          savedTender: tenderData,
        })
      }
    }

    logs.push("No tenders found in response")

    return NextResponse.json({
      success: false,
      error: "No tenders in response",
      logs,
      response: data,
    })
  } catch (error: any) {
    logs.push(`Exception: ${error.message}`)
    logs.push(`Stack: ${error.stack}`)

    return NextResponse.json({
      success: false,
      error: error.message,
      logs,
      stack: error.stack,
    })
  }
}
