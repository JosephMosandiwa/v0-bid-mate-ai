import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

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
      return NextResponse.json({ error: "Tender not found" }, { status: 404 })
    }

    // Fetch associated documents
    const { data: documents, error: docsError } = await supabase
      .from("tender_documents")
      .select("*")
      .eq("tender_id", id)
      .order("created_at", { ascending: false })

    if (docsError) {
      console.error("[v0] Error fetching documents:", docsError)
    }

    console.log("[v0] Found tender with", documents?.length || 0, "documents")

    return NextResponse.json({
      tender,
      documents: documents || [],
    })
  } catch (error) {
    console.error("[v0] Error in scraped tender API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
