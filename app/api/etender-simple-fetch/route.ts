import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"

export async function GET() {
  try {
    console.log("[v0] Starting simple eTender fetch...")

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

    // Step 2: Parse tenders from releases
    const tenders = data.releases
      .filter((release: any) => release && release.tender)
      .map((release: any) => {
        const tender = release.tender
        return {
          tender_reference: tender.id || release.ocid,
          title: tender.title || "Untitled",
          description: tender.description || "",
          category: tender.category || "Uncategorized",
          published_date: release.date || new Date().toISOString(),
          close_date: tender.tenderPeriod?.endDate || null,
          value: tender.value?.amount || 0,
          province: tender.province || null,
          organization_name: tender.procuringEntity?.name || "Unknown",
          contact_person: tender.contactPerson?.name || null,
          contact_email: tender.contactPerson?.email || null,
          contact_phone: tender.contactPerson?.telephoneNumber || null,
          tender_url: `https://www.etenders.gov.za/`,
          source_name: "National Treasury eTender (OCDS)",
          source_id: 1, // We'll use a fixed source ID
          scraped_at: new Date().toISOString(),
          is_active: true,
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

    // Step 3: Save to database
    const supabase = createAdminClient()

    // First ensure source exists
    const { data: existingSource } = await supabase
      .from("tender_sources")
      .select("id")
      .eq("name", "National Treasury eTender (OCDS)")
      .single()

    let sourceId = existingSource?.id

    if (!sourceId) {
      const { data: newSource, error: sourceError } = await supabase
        .from("tender_sources")
        .insert({
          name: "National Treasury eTender (OCDS)",
          url: "https://ocds-api.etenders.gov.za/",
          is_active: true,
        })
        .select("id")
        .single()

      if (sourceError) {
        console.error("[v0] Source creation error:", sourceError)
        throw new Error(`Failed to create source: ${sourceError.message}`)
      }

      sourceId = newSource.id
    }

    console.log("[v0] Using source ID:", sourceId)

    // Update all tenders with the correct source_id
    const tendersToSave = tenders.map((t) => ({ ...t, source_id: sourceId }))

    // Save tenders using upsert
    const { data: savedTenders, error: saveError } = await supabase
      .from("scraped_tenders")
      .upsert(tendersToSave, {
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
