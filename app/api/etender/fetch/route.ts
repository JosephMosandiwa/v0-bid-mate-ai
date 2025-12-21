import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST() {
  try {
    console.log("[v0] Starting direct eTender API fetch")

    const supabase = await createClient()

    // Fetch from eTender API - get releases from the last 30 days
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    console.log("[v0] Fetching from eTender API...")
    const response = await fetch(
      `https://ocds-api.etenders.gov.za/api/releases?fromDate=${thirtyDaysAgo.toISOString().split("T")[0]}`,
      {
        headers: {
          Accept: "application/json",
        },
      },
    )

    if (!response.ok) {
      console.log("[v0] eTender API error:", response.status, response.statusText)
      return NextResponse.json(
        {
          error: "Failed to fetch from eTender API",
          status: response.status,
        },
        { status: 500 },
      )
    }

    const data = await response.json()
    console.log("[v0] Received data from API:", data?.length || 0, "releases")

    const tenders = []
    const releases = Array.isArray(data) ? data : data.releases || []

    for (const release of releases) {
      try {
        const tender = release.tender || {}
        const ocid = release.ocid || `AUTO-${Date.now()}-${Math.random()}`

        // Extract basic info
        const title = tender.title || tender.description || "Untitled Tender"
        const description = tender.description || tender.title || ""

        // Extract organization
        const buyer = release.buyer || release.parties?.find((p: any) => p.roles?.includes("buyer"))
        const organization = buyer?.name || "Unknown Organization"

        // Extract dates
        const closeDate = tender.tenderPeriod?.endDate || null
        const publishDate = release.date || new Date().toISOString()

        // Extract value
        const value = tender.value?.amount || null
        const currency = tender.value?.currency || "ZAR"

        // Extract location
        const location = tender.deliveryLocations?.[0]?.description || tender.deliveryAddresses?.[0]?.locality || null

        // Extract documents
        const documents = (tender.documents || []).map((doc: any) => doc.url).filter(Boolean)

        const tenderData = {
          source_id: "etender-api",
          source_name: "National Treasury eTender Portal",
          tender_reference: ocid,
          title: title.substring(0, 500),
          description: description.substring(0, 5000),
          organization: organization.substring(0, 255),
          category: tender.mainProcurementCategory || null,
          close_date: closeDate,
          published_date: publishDate,
          value: value,
          currency: currency,
          location: location,
          contact_person: null,
          contact_email: null,
          contact_phone: null,
          requirements: tender.eligibilityCriteria || null,
          source_url: `https://etenders.gov.za/tender/${ocid}`,
          document_urls: documents,
          raw_data: release,
          last_scraped_at: new Date().toISOString(),
        }

        tenders.push(tenderData)
      } catch (error) {
        console.log("[v0] Error processing release:", error)
      }
    }

    console.log("[v0] Processed", tenders.length, "tenders")

    if (tenders.length === 0) {
      return NextResponse.json({
        message: "No tenders found in API response",
        rawData: data,
      })
    }

    // Save to database with upsert
    console.log("[v0] Saving tenders to database...")
    const { data: savedTenders, error: saveError } = await supabase
      .from("scraped_tenders")
      .upsert(tenders, {
        onConflict: "tender_reference",
        ignoreDuplicates: false,
      })
      .select()

    if (saveError) {
      console.log("[v0] Database error:", saveError)
      return NextResponse.json(
        {
          error: "Failed to save tenders",
          details: saveError,
          tendersSample: tenders[0],
        },
        { status: 500 },
      )
    }

    console.log("[v0] Successfully saved", savedTenders?.length || tenders.length, "tenders")

    return NextResponse.json({
      success: true,
      tendersProcessed: tenders.length,
      tendersSaved: savedTenders?.length || tenders.length,
      sample: tenders[0],
    })
  } catch (error) {
    console.error("[v0] Fatal error:", error)
    return NextResponse.json(
      {
        error: "Fatal error during fetch",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
