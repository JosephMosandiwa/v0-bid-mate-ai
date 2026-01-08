import { createClient } from "@/lib/supabase/server"
import type { NextRequest } from "next/server"

function isValidUUID(id: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  return uuidRegex.test(id)
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    if (!isValidUUID(id)) {
      console.log("[v0] Invalid UUID format:", id)
      return Response.json({ error: "Invalid tender ID format" }, { status: 400 })
    }

    const supabase = await createClient()

    // 1. Try to fetch from user_tenders (Unified entry point for saved tenders)
    const { data: userTender, error: userError } = await supabase
      .from("user_tenders")
      .select("*")
      .eq("id", id)
      .single()

    if (userTender && !userError) {
      // It is a saved tender (Custom or Scraped)

      if (userTender.tender_type === 'custom') {
        // Fetch custom analysis and docs
        const { data: analysis } = await supabase
          .from('user_tender_analysis')
          .select('analysis_data')
          .eq('tender_id', id)
          .single()

        const { data: documents } = await supabase
          .from('user_tender_documents')
          .select('*')
          .eq('tender_id', id)

        return Response.json({
          tender: userTender,
          analysis: analysis?.analysis_data || null,
          documents: documents || []
        })

      } else {
        // It is a saved scraped tender
        // Fetch original scraped data for extra details
        // userTender.tender_id points to scraped_tenders.id

        const { data: scrapedTender } = await supabase
          .from('scraped_tenders')
          .select('*')
          .eq('id', userTender.tender_id)
          .single()

        // Fetch original documents
        const { data: documents } = await supabase
          .from('tender_documents')
          .select('*')
          .eq('tender_id', userTender.tender_id)

        // Fetch user-uploaded documents for this tender
        const { data: userDocuments } = await supabase
          .from('user_tender_documents')
          .select('*')
          .eq('tender_id', id) // id is the user_tenders(id)

        // Fetch original analysis
        const { data: analysis } = await supabase
          .from('tender_analysis')
          .select('analysis_data')
          .eq('tender_id', userTender.tender_id)
          .single()

        // Fetch user analysis overrides?
        const { data: userAnalysis } = await supabase
          .from('user_tender_analysis')
          .select('analysis_data')
          .eq('tender_id', id)
          .single()

        // Merge data: userTender takes precedence for status/metadata, scrapedTender for content
        const mergedTender = {
          ...scrapedTender,
          ...userTender, // Overwrite with user-specifics (id, status, etc.)
          // Ensure we keep the correct titles/desc if user modified them (future proofing)
        }

        return Response.json({
          tender: mergedTender,
          analysis: userAnalysis?.analysis_data || analysis?.analysis_data || null,
          documents: [...(documents || []), ...(userDocuments || [])]
        })
      }
    }

    // 2. Fallback: Check scraped_tenders directly
    // This supports viewing details of a tender that hasn't been saved to "My Tenders" yet
    const { data: scrapedTenderRaw, error: scrapedError } = await supabase
      .from("scraped_tenders")
      .select("*")
      .eq("id", id)
      .single()

    if (scrapedTenderRaw && !scrapedError) {
      const { data: documents } = await supabase
        .from('tender_documents')
        .select('*')
        .eq('tender_id', id)

      const { data: analysis } = await supabase
        .from('tender_analysis')
        .select('analysis_data')
        .eq('tender_id', id)
        .single()

      return Response.json({
        tender: scrapedTenderRaw,
        analysis: analysis?.analysis_data || null,
        documents: documents || []
      })
    }

    return Response.json({ error: "Tender not found" }, { status: 404 })
  } catch (error) {
    console.error("[API] Error fetching tender:", error)
    return Response.json({ error: "Failed to fetch tender" }, { status: 500 })
  }
}
