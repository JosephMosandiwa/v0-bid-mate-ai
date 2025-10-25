import { createClient } from "@supabase/supabase-js"
import type { NextRequest } from "next/server"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    console.log("[v0] Fetching form responses for tender:", id)

    const { data, error } = await supabase.from("tender_responses").select("*").eq("tender_id", id).single()

    if (error && error.code !== "PGRST116") {
      console.error("[v0] Error fetching responses:", error)
      return Response.json({ error: error.message }, { status: 500 })
    }

    return Response.json({ responses: data?.response_data || null })
  } catch (error: any) {
    console.error("[v0] Error in GET /api/tenders/scraped/[id]/responses:", error)
    return Response.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const { responses } = await request.json()

    console.log("[v0] Saving form responses for tender:", id)

    const { data, error } = await supabase
      .from("tender_responses")
      .upsert(
        {
          tender_id: id,
          response_data: responses,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "tender_id",
        },
      )
      .select()
      .single()

    if (error) {
      console.error("[v0] Error saving responses:", error)
      return Response.json({ error: error.message }, { status: 500 })
    }

    console.log("[v0] Responses saved successfully")
    return Response.json({ success: true, data })
  } catch (error: any) {
    console.error("[v0] Error in POST /api/tenders/scraped/[id]/responses:", error)
    return Response.json({ error: error.message }, { status: 500 })
  }
}
