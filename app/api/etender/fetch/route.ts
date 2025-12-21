import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST() {
  try {
    console.log("[v0] Starting direct eTender data fetch")

    const supabase = await createClient()

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
          source_id: "sample-001",
          source_name: "Sample - Municipal Services",
          tender_reference: `TND-${Date.now()}-001`,
          title: "Supply and Delivery of Office Furniture",
          description:
            "The municipality invites qualified suppliers to bid for the supply and delivery of office furniture including desks, chairs, filing cabinets, and storage units for the new municipal building.",
          organization: "City of Cape Town Municipality",
          category: "goods",
          close_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          published_date: new Date().toISOString(),
          value: 500000,
          currency: "ZAR",
          location: "Cape Town, Western Cape",
          contact_person: "John Smith",
          contact_email: "procurement@capetown.gov.za",
          contact_phone: "+27 21 400 1234",
          requirements: "Valid Tax Clearance Certificate, BBBEE Level 1-4 certification required",
          source_url: "https://etenders.gov.za/sample/001",
          document_urls: [],
          last_scraped_at: new Date().toISOString(),
        },
        {
          source_id: "sample-002",
          source_name: "Sample - Construction Services",
          tender_reference: `TND-${Date.now()}-002`,
          title: "Road Maintenance and Repair Services",
          description:
            "Appointment of a service provider for road maintenance and repair services for provincial roads in the Gauteng Province for a period of 24 months.",
          organization: "Gauteng Department of Roads and Transport",
          category: "works",
          close_date: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
          published_date: new Date().toISOString(),
          value: 2500000,
          currency: "ZAR",
          location: "Johannesburg, Gauteng",
          contact_person: "Sarah Johnson",
          contact_email: "tenders@gauteng.gov.za",
          contact_phone: "+27 11 355 7777",
          requirements: "CIDB Grade 6 or higher, Valid registration with CIDB",
          source_url: "https://etenders.gov.za/sample/002",
          document_urls: [],
          last_scraped_at: new Date().toISOString(),
        },
        {
          source_id: "sample-003",
          source_name: "Sample - IT Services",
          tender_reference: `TND-${Date.now()}-003`,
          title: "Development of Web-Based Management Information System",
          description:
            "The Department requires a service provider to develop a comprehensive web-based management information system to track and manage departmental operations, reporting, and analytics.",
          organization: "Department of Health - Eastern Cape",
          category: "services",
          close_date: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
          published_date: new Date().toISOString(),
          value: 3500000,
          currency: "ZAR",
          location: "East London, Eastern Cape",
          contact_person: "Michael Brown",
          contact_email: "it.procurement@health.ec.gov.za",
          contact_phone: "+27 43 726 5000",
          requirements: "Proven track record in government IT projects, ISO 27001 certification preferred",
          source_url: "https://etenders.gov.za/sample/003",
          document_urls: [],
          last_scraped_at: new Date().toISOString(),
        },
      ]

      console.log("[v0] Saving sample tenders to database...")
      const { data: savedTenders, error: saveError } = await supabase
        .from("scraped_tenders")
        .upsert(sampleTenders, {
          onConflict: "tender_reference",
          ignoreDuplicates: false,
        })
        .select()

      if (saveError) {
        console.log("[v0] Database error:", saveError)
        return NextResponse.json(
          {
            error: "Failed to save sample tenders",
            details: saveError,
          },
          { status: 500 },
        )
      }

      console.log("[v0] Successfully saved", savedTenders?.length || sampleTenders.length, "sample tenders")

      return NextResponse.json({
        success: true,
        mode: "sample",
        message: "API endpoints unavailable, created sample tenders for testing",
        tendersProcessed: sampleTenders.length,
        tendersSaved: savedTenders?.length || sampleTenders.length,
        samples: sampleTenders.map((t) => ({ reference: t.tender_reference, title: t.title })),
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
        const organization = buyer?.name || "Unknown Organization"
        const closeDate = tender.tenderPeriod?.endDate || null
        const publishDate = release.date || new Date().toISOString()
        const value = tender.value?.amount || null
        const currency = tender.value?.currency || "ZAR"
        const location = tender.deliveryLocations?.[0]?.description || tender.deliveryAddresses?.[0]?.locality || null
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
      },
      { status: 500 },
    )
  }
}
