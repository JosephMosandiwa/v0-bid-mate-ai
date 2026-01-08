import { createClient } from "@/lib/supabase/server"
import type { NextRequest } from "next/server"

export async function GET(request: NextRequest, context: any) {
  try {
    const paramsObj = context?.params ? await context.params : context?.params ?? context
    const { id } = paramsObj as { id?: string }
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      console.log("[v0] GET responses - No user found")
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log("[v0] Fetching form responses for custom tender:", id, "user:", user.id)

    const { data, error } = await supabase
      .from("user_custom_tender_responses")
      .select("*")
      .eq("tender_id", id)
      .eq("user_id", user.id)
      .single()

    console.log("[v0] Query result - data:", data, "error:", error)

    if (error && error.code !== "PGRST116") {
      console.error("[v0] Error fetching responses:", error)
      return Response.json({ error: error.message }, { status: 500 })
    }

    console.log("[v0] Returning", Object.keys(data?.response_data || {}).length, "saved responses")
    return Response.json({ responses: data?.response_data || null })
  } catch (error: any) {
    console.error("[v0] Error in GET /api/custom-tenders/[id]/responses:", error)
    return Response.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest, context: any) {
  try {
    const paramsObj = context?.params ? await context.params : context?.params ?? context
    const { id } = paramsObj as { id?: string }
    const { responses } = await request.json()
    const supabase = await createClient()

    console.log("[v0] Saving form responses for custom tender:", id)
    console.log("[v0] Number of fields to save:", Object.keys(responses).length)
    console.log("[v0] Response data:", responses)

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      console.log("[v0] POST responses - No user found")
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log("[v0] User ID:", user.id)

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

    console.log("[v0] Responses saved successfully - record ID:", data?.id)
    return Response.json({ success: true, data })
  } catch (error: any) {
    console.error("[v0] Error in POST /api/custom-tenders/[id]/responses:", error)
    return Response.json({ error: error.message }, { status: 500 })
  }
}
