import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import type { NextRequest } from "next/server"

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        cookies: {
          getAll: () => cookieStore.getAll(),
          setAll: (cookies) => {
            cookies.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          },
        },
      }
    )

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { analysis } = await request.json()

    if (!analysis) {
      return Response.json({ error: "Analysis data is required" }, { status: 400 })
    }

    // Check if analysis already exists
    const { data: existing } = await supabase
      .from("tender_analysis")
      .select("id")
      .eq("tender_id", id)
      .maybeSingle()

    if (existing) {
      // Update existing analysis
      const { error: updateError } = await supabase
        .from("tender_analysis")
        .update({
          analysis_data: analysis,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existing.id)

      if (updateError) {
        console.error("[v0] Error updating analysis:", updateError)
        return Response.json({ error: "Failed to update analysis" }, { status: 500 })
      }
    } else {
      // Insert new analysis
      const { error: insertError } = await supabase
        .from("tender_analysis")
        .insert({
          tender_id: id,
          analysis_data: analysis,
        })

      if (insertError) {
        console.error("[v0] Error inserting analysis:", insertError)
        return Response.json({ error: "Failed to save analysis" }, { status: 500 })
      }
    }

    return Response.json({ success: true })
  } catch (error: any) {
    console.error("[v0] Error saving tender analysis:", error)
    return Response.json({ error: "Failed to save analysis" }, { status: 500 })
  }
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        cookies: {
          getAll: () => cookieStore.getAll(),
          setAll: (cookies) => {
            cookies.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          },
        },
      }
    )

    const { data: analysis, error } = await supabase
      .from("tender_analysis")
      .select("*")
      .eq("tender_id", id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle()

    if (error) {
      console.error("[v0] Error fetching analysis:", error)
      return Response.json({ error: "Failed to fetch analysis" }, { status: 500 })
    }

    return Response.json({ analysis: analysis?.analysis_data || null })
  } catch (error: any) {
    console.error("[v0] Error fetching tender analysis:", error)
    return Response.json({ error: "Failed to fetch analysis" }, { status: 500 })
  }
}
