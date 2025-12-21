import { createAdminClient } from "@/lib/supabase/admin"
import { NextResponse } from "next/server"

export async function POST() {
  try {
    console.log("[v0] Starting API tender fetch from eTender portal")

    const supabase = createAdminClient()

    const apiUrl = "https://ocds-api.etenders.gov.za/api/releases"

    // Calculate date range for last 30 days
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - 30)

    const dateFrom = startDate.toISOString().split("T")[0]
    const dateTo = endDate.toISOString().split("T")[0]

    const fullUrl = `${apiUrl}?dateFrom=${dateFrom}&dateTo=${dateTo}&limit=50`

    console.log("[v0] Fetching from:", fullUrl)

    const response = await fetch(fullUrl, {
      headers: {
        Accept: "application/json",
        "User-Agent": "BidMateAI/1.0",
      },
    })

    if (!response.ok) {
      console.log("[v0] API request failed:", response.status, response.statusText)
      throw new Error(`API returned ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()
    console.log("[v0] API response received, parsing releases...")

    // OCDS format has releases array
    const releases = data.releases || []
    console.log("[v0] Found", releases.length, "releases in API response")

    if (releases.length === 0) {
      return NextResponse.json({
        success: false,
        message: "No tenders found in API response for the specified date range",
        dateRange: { from: dateFrom, to: dateTo },
      })
    }

    // Get or create an eTender source
    const { data: existingSources } = await supabase
      .from("tender_sources")
      .select("id")
      .eq("source_name", "National Treasury eTender Portal")
      .limit(1)

    let sourceId = existingSources?.[0]?.id

    if (!sourceId) {
      const { data: newSource } = await supabase
        .from("tender_sources")
        .insert({
          source_name: "National Treasury eTender Portal",
          source_url: "https://etenders.gov.za",
          source_level: "national",
          is_active: true,
          scraping_enabled: true,
          scraper_type: "api",
        })
        .select("id")
        .single()

      sourceId = newSource?.id
    }

    if (!sourceId) {
      throw new Error("Failed to get or create tender source")
    }

    console.log("[v0] Using source_id:", sourceId)

    const tenders = releases
      .map((release: any) => {
        const tender = release.tender || {}
        const buyer = release.buyer || release.parties?.find((p: any) => p.roles?.includes("buyer"))
        const contact = buyer?.contactPoint || release.parties?.find((p: any) => p.contactPoint)?.contactPoint

        return {
          source_id: sourceId,
          tender_reference:
            tender.id || release.ocid || `OCDS-${Date.now()}-${Math.random().toString(36).substring(7)}`,
          title: (tender.title || "Untitled Tender").substring(0, 500),
          description: (tender.description || tender.title || "").substring(0, 5000),
          source_name: buyer?.name || "National Treasury",
          organization: buyer?.name || "Unknown Organization",
          category: tender.mainProcurementCategory || "General",
          close_date: tender.tenderPeriod?.endDate || null,
          publish_date: release.date || tender.tenderPeriod?.startDate || new Date().toISOString(),
          estimated_value: tender.value ? `R ${tender.value.amount.toLocaleString()}` : null,
          contact_person: contact?.name || null,
          contact_email: contact?.email || null,
          contact_phone: contact?.telephone || null,
          source_url: `https://etenders.gov.za/tender/${tender.id || release.ocid}`,
          tender_url: `https://etenders.gov.za/tender/${tender.id || release.ocid}`,
          source_level: "national",
          source_province: "National",
          document_urls: (tender.documents || []).map((doc: any) => doc.url).filter(Boolean),
          is_active: true,
          scraped_at: new Date().toISOString(),
          raw_data: release,
        }
      })
      .filter((t: any) => t.title && t.tender_reference)

    console.log("[v0] Prepared", tenders.length, "tenders for insertion")
    console.log("[v0] Sample tender:", JSON.stringify(tenders[0], null, 2))

    const { data: savedTenders, error: saveError } = await supabase
      .from("scraped_tenders")
      .upsert(tenders, {
        onConflict: "tender_reference",
        ignoreDuplicates: false,
      })
      .select()

    if (saveError) {
      console.error("[v0] Database save error:", saveError)
      throw new Error(`Database error: ${saveError.message}`)
    }

    console.log("[v0] Successfully saved", savedTenders?.length || tenders.length, "tenders")

    return NextResponse.json({
      success: true,
      source: "eTender OCDS API",
      apiUrl: fullUrl,
      dateRange: { from: dateFrom, to: dateTo },
      tendersFound: releases.length,
      tendersProcessed: tenders.length,
      tendersSaved: savedTenders?.length || tenders.length,
      sampleTender: savedTenders?.[0] || tenders[0],
    })
  } catch (error) {
    console.error("[v0] Fatal error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}
