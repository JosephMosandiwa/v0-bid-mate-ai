import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = await params

    console.log("[v0] Fetching scraped tender:", id)

    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

    // Fetch the tender
    const { data: tender, error: tenderError } = await supabase
      .from("scraped_tenders")
      .select("*")
      .eq("id", id)
      .single()

    if (tenderError) {
      console.error("[v0] Error fetching tender:", tenderError)
      return NextResponse.json({ error: "Tender not found", details: tenderError.message }, { status: 404 })
    }

    if (!tender) {
      console.error("[v0] No tender found for id:", id)
      return NextResponse.json({ error: "Tender not found" }, { status: 404 })
    }

    const { data: documents, error: docsError } = await supabase
      .from("tender_documents")
      .select("*")
      .eq("tender_id", id.toString())
      .order("created_at", { ascending: false })

    if (docsError) {
      console.error("[v0] Error fetching documents:", docsError)
    }

    const { data: analysisData, error: analysisError } = await supabase
      .from("tender_analysis")
      .select("*")
      .eq("tender_id", id.toString())
      .order("created_at", { ascending: false })
      .limit(1)
      .single()

    if (analysisError && analysisError.code !== "PGRST116") {
      console.error("[v0] Error fetching analysis:", analysisError)
    }

    console.log("[v0] Found tender with", documents?.length || 0, "documents", analysisData ? "and analysis" : "")

    return NextResponse.json({
      tender,
      documents: documents || [],
      analysis: analysisData?.analysis_data || null, // Include analysis in response
    })
  } catch (error) {
    console.error("[v0] Error in scraped tender API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
