import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"

export async function GET() {
  try {
    console.log("[v0] Starting simple eTender fetch...")

    const supabase = createAdminClient()

    const { data: source } = await supabase
      .from("tender_sources")
      .select("id")
      .eq("name", "National Treasury eTender (OCDS)")
      .maybeSingle()

    if (!source) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Please create the 'National Treasury eTender (OCDS)' source first by running the SQL script at /scripts/ensure-etender-source-exists.sql",
        },
        { status: 400 },
      )
    }

    const sourceId = source.id
    console.log("[v0] Using existing source ID:", sourceId)

    // Step 1: Call eTenders API
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    const today = new Date()

    const dateFrom = thirtyDaysAgo.toISOString().split("T")[0]
    const dateTo = today.toISOString().split("T")[0]

    const url = `https://ocds-api.etenders.gov.za/api/OCDSReleases?PageNumber=1&PageSize=50&dateFrom=${dateFrom}&dateTo=${dateTo}`
    console.log("[v0] Fetching from:", url)

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`)
    }

    const data = await response.json()
    console.log("[v0] API response received. Releases count:", data.releases?.length)

    const tenders = data.releases
      .filter((release: any) => release && release.tender)
      .map((release: any) => {
        const tender = release.tender
        return {
          tender_reference: tender.id || release.ocid,
          title: tender.title || "Untitled",
          description: tender.description || "",
          category: tender.category || "Uncategorized",
          publish_date: release.date || new Date().toISOString(),
          close_date: tender.tenderPeriod?.endDate || null,
          estimated_value: tender.value?.amount?.toString() || null,
          source_province: tender.province || null,
          contact_person: tender.contactPerson?.name || null,
          contact_email: tender.contactPerson?.email || null,
          contact_phone: tender.contactPerson?.telephoneNumber || null,
          tender_url: `https://www.etenders.gov.za/`,
          source_name: "National Treasury eTender (OCDS)",
          source_id: sourceId,
          scraped_at: new Date().toISOString(),
          is_active: true,
          raw_data: { release, tender },
        }
      })

    console.log("[v0] Parsed tenders:", tenders.length)

    if (tenders.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No tenders found in API response",
        fetched: 0,
        saved: 0,
      })
    }

    const { data: savedTenders, error: saveError } = await supabase
      .from("scraped_tenders")
      .upsert(tenders, {
        onConflict: "source_id,tender_reference",
        ignoreDuplicates: false,
      })
      .select("id")

    if (saveError) {
      console.error("[v0] Save error:", saveError)
      throw new Error(`Failed to save tenders: ${saveError.message}`)
    }

    console.log("[v0] Saved tenders:", savedTenders?.length || 0)

    return NextResponse.json({
      success: true,
      message: `Fetched ${tenders.length} tenders, saved ${savedTenders?.length || 0}`,
      fetched: tenders.length,
      saved: savedTenders?.length || 0,
      sampleTender: tenders[0],
    })
  } catch (error: any) {
    console.error("[v0] Fetch error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 },
    )
  }
}
