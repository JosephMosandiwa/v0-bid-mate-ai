import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import type { NextRequest } from "next/server"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const cookieStore = await cookies()
    const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookies) => {
          cookies.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options)
          })
        },
      },
    })

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: tender, error: tenderError } = await supabase
      .from("user_custom_tenders")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single()

    if (tenderError || !tender) {
      console.error("[v0] Tender not found:", tenderError)
      return Response.json({ error: "Tender not found" }, { status: 404 })
    }

    const { data: documents } = await supabase
      .from("user_custom_tender_documents")
      .select("*")
      .eq("tender_id", id)
      .order("created_at", { ascending: false })

    const { data: analysisData } = await supabase
      .from("user_custom_tender_analysis")
      .select("*")
      .eq("tender_id", id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single()

    return Response.json({
      tender,
      documents: documents || [],
      analysis: analysisData?.analysis_data || null,
    })
  } catch (error: any) {
    console.error("[v0] Error fetching custom tender:", error)
    return Response.json({ error: "Failed to fetch tender" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const cookieStore = await cookies()
    const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookies) => {
          cookies.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options)
          })
        },
      },
    })

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { title, organization, close_date, value, description } = body

    const { data: tender, error: updateError } = await supabase
      .from("user_custom_tenders")
      .update({
        title,
        organization,
        close_date,
        value,
        description,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single()

    if (updateError) {
      console.error("[v0] Error updating tender:", updateError)
      return Response.json({ error: "Failed to update tender" }, { status: 500 })
    }

    return Response.json({ success: true, tender })
  } catch (error: any) {
    console.error("[v0] Error updating custom tender:", error)
    return Response.json({ error: "Failed to update tender" }, { status: 500 })
  }
}
