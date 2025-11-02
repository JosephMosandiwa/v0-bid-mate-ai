import { createClient } from "@/lib/supabase/server"
import type { NextRequest } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const supabase = await createClient()

    console.log("[v0] Fetching form responses for custom tender:", id)

    const { data, error } = await supabase.from("user_custom_tender_responses").select("*").eq("tender_id", id).single()

    if (error && error.code !== "PGRST116") {
      console.error("[v0] Error fetching responses:", error)
      return Response.json({ error: error.message }, { status: 500 })
    }

    return Response.json({ responses: data?.response_data || null })
  } catch (error: any) {
    console.error("[v0] Error in GET /api/custom-tenders/[id]/responses:", error)
    return Response.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const { responses } = await request.json()
    const supabase = await createClient()

    console.log("[v0] Saving form responses for custom tender:", id)

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data, error } = await supabase
      .from("user_custom_tender_responses")
      .upsert(
        {
          tender_id: id,
          user_id: user.id,
          response_data: responses,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "tender_id,user_id",
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
    console.error("[v0] Error in POST /api/custom-tenders/[id]/responses:", error)
    return Response.json({ error: error.message }, { status: 500 })
  }
}
