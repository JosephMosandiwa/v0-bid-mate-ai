import { createAdminClient } from "@/lib/supabase/admin"
import { NextResponse } from "next/server"

export async function POST() {
  try {
    console.log("[v0] Starting direct eTender data fetch")

    const supabase = createAdminClient()

    // Try multiple eTender API endpoints
    const endpoints = [
      "https://ocds-api.etenders.gov.za/api/releases",
      "https://ocds-api.etenders.gov.za/api/v1/releases",
      "https://data.etenders.gov.za/api/releases",
    ]

    let data: any = null
    let successUrl = ""

    // Try each endpoint
    for (const endpoint of endpoints) {
      try {
        console.log("[v0] Trying endpoint:", endpoint)
        const response = await fetch(endpoint, {
          headers: {
            Accept: "application/json",
            "User-Agent": "BidMateAI/1.0",
          },
        })

        if (response.ok) {
          data = await response.json()
          successUrl = endpoint
          console.log("[v0] Success with endpoint:", endpoint)
          break
        } else {
          console.log("[v0] Endpoint failed:", endpoint, response.status)
        }
      } catch (error) {
        console.log("[v0] Endpoint error:", endpoint, error)
      }
    }

    // If all API endpoints fail, create sample tenders for testing
    if (!data) {
      console.log("[v0] All API endpoints failed, creating sample tenders for testing")

      const sampleTenders = [
        {
          tender_reference: `SAMPLE-TND-${Date.now()}-001`,
          title: "Supply and Delivery of Office Furniture",
          description:
            "The municipality invites qualified suppliers to bid for the supply and delivery of office furniture including desks, chairs, filing cabinets, and storage units for the new municipal building. Issued by: City of Cape Town Municipality",
          source_name: "City of Cape Town Municipality",
          source_level: "municipal",
          source_province: "Western Cape",
          close_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          source_url: "https://etenders.gov.za/sample/001",
          tender_url: "https://etenders.gov.za/sample/001",
          category: "Goods",
          estimated_value: "R 500,000",
          is_active: true,
          scraped_at: new Date().toISOString(),
        },
        {
          tender_reference: `SAMPLE-TND-${Date.now()}-002`,
          title: "Road Maintenance and Repair Services",
          description:
            "Appointment of a service provider for road maintenance and repair services for provincial roads in the Gauteng Province for a period of 24 months. Issued by: Gauteng Department of Roads and Transport",
          source_name: "Gauteng Department of Roads and Transport",
          source_level: "provincial",
          source_province: "Gauteng",
          close_date: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
          source_url: "https://etenders.gov.za/sample/002",
          tender_url: "https://etenders.gov.za/sample/002",
          category: "Construction",
          estimated_value: "R 2,500,000",
          is_active: true,
          scraped_at: new Date().toISOString(),
        },
        {
          tender_reference: `SAMPLE-TND-${Date.now()}-003`,
          title: "Development of Web-Based Management Information System",
          description:
            "The Department requires a service provider to develop a comprehensive web-based management information system to track and manage departmental operations, reporting, and analytics. Issued by: Eastern Cape Department of Health",
          source_name: "Eastern Cape Department of Health",
          source_level: "provincial",
          source_province: "Eastern Cape",
          close_date: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
          source_url: "https://etenders.gov.za/sample/003",
          tender_url: "https://etenders.gov.za/sample/003",
          category: "IT Services",
          estimated_value: "R 1,200,000",
          is_active: true,
          scraped_at: new Date().toISOString(),
        },
      ]

      console.log("[v0] Sample tenders created:", JSON.stringify(sampleTenders, null, 2))
      console.log("[v0] Attempting to save to scraped_tenders table...")

      const { data: savedTenders, error: saveError } = await supabase
        .from("scraped_tenders")
        .insert(sampleTenders)
        .select()

      if (saveError) {
        console.log("[v0] Database error:", JSON.stringify(saveError, null, 2))
        console.log("[v0] Error code:", saveError.code)
        console.log("[v0] Error message:", saveError.message)
        console.log("[v0] Error details:", saveError.details)

        return NextResponse.json(
          {
            error: "Failed to save sample tenders",
            code: saveError.code,
            message: saveError.message,
            details: saveError.details,
            hint: saveError.hint,
            fullError: saveError,
          },
          { status: 500 },
        )
      }

      console.log("[v0] Successfully saved", savedTenders?.length || 0, "sample tenders")
      console.log(
        "[v0] Saved tender IDs:",
        savedTenders?.map((t: any) => t.id),
      )

      return NextResponse.json({
        success: true,
        message: "Sample tenders created successfully",
        tendersSaved: savedTenders?.length || 0,
        tenders: savedTenders,
      })
    }

    // Process real API data
    const releases = Array.isArray(data) ? data : data.releases || data.data || []
    console.log("[v0] Processing", releases.length, "releases from API")

    const tenders = []

    for (const release of releases.slice(0, 50)) {
      // Limit to first 50 for testing
      try {
        const tender = release.tender || {}
        const ocid = release.ocid || `AUTO-${Date.now()}-${Math.random()}`

        const title = tender.title || tender.description || "Untitled Tender"
        const description = tender.description || tender.title || ""
        const buyer = release.buyer || release.parties?.find((p: any) => p.roles?.includes("buyer"))
        const buyerName = buyer?.name || "Unknown Organization"
        const closeDate = tender.tenderPeriod?.endDate || null
        const publishDate = release.date || new Date().toISOString()
        const value = tender.value?.amount || null
        const documents = (tender.documents || []).map((doc: any) => doc.url).filter(Boolean)

        const tenderData = {
          source_id: 1, // Integer for eTender API source
          source_name: "National Treasury eTender Portal",
          source_level: "national",
          tender_reference: ocid,
          title: title.substring(0, 500),
          description: description.substring(0, 5000),
          category: tender.mainProcurementCategory || null,
          close_date: closeDate,
          publish_date: publishDate,
          estimated_value: value ? `R ${value.toLocaleString()}` : null,
          contact_person: null,
          contact_email: null,
          contact_phone: null,
          source_url: `https://etenders.gov.za/tender/${ocid}`,
          tender_url: `https://etenders.gov.za/tender/${ocid}`,
          document_urls: documents,
          is_active: true,
          scraped_at: new Date().toISOString(),
          raw_data: release, // Store full OCDS data for reference
        }

        tenders.push(tenderData)
      } catch (error) {
        console.log("[v0] Error processing release:", error)
      }
    }

    console.log("[v0] Processed", tenders.length, "tenders")

    if (tenders.length === 0) {
      return NextResponse.json({
        success: false,
        message: "No valid tenders found in API response",
      })
    }

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
          fieldError: saveError.message,
        },
        { status: 500 },
      )
    }

    console.log("[v0] Successfully saved", savedTenders?.length || tenders.length, "tenders")

    return NextResponse.json({
      success: true,
      mode: "api",
      apiEndpoint: successUrl,
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
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}
