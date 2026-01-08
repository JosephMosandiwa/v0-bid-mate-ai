import { createClient } from "@supabase/supabase-js"
import type { NextRequest } from "next/server"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function GET(request: NextRequest, context: any) {
  try {
    const paramsObj = context?.params ? await context.params : context?.params ?? context
    const { tenderId } = paramsObj as { tenderId?: string }

    console.log("[v0] Fetching documents for tender:", tenderId)

    const { data, error } = await supabase
      .from("tender_documents")
      .select("*")
      .or(`user_tender_id.eq.${tenderId},tender_id.eq.${tenderId}`)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("[v0] Error fetching documents:", error)
      return Response.json({ error: error.message }, { status: 500 })
    }

    return Response.json({ documents: data || [] })
  } catch (error: any) {
    console.error("[v0] Error in GET /api/tenders/documents/[tenderId]:", error)
    return Response.json({ error: error.message }, { status: 500 })
  }
}
