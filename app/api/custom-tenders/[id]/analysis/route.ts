import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { analysis } = await request.json()

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
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if analysis already exists
    const { data: existing } = await supabase
      .from("user_custom_tender_analysis")
      .select("id")
      .eq("tender_id", id)
      .single()

    if (existing) {
      // Update existing analysis
      const { error } = await supabase
        .from("user_custom_tender_analysis")
        .update({
          analysis_data: analysis,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existing.id)

      if (error) throw error
    } else {
      // Create new analysis
      const { error } = await supabase.from("user_custom_tender_analysis").insert({
        tender_id: id,
        analysis_data: analysis,
      })

      if (error) throw error
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error saving analysis:", error)
    return NextResponse.json({ error: "Failed to save analysis" }, { status: 500 })
  }
}
