import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"

export async function GET() {
  try {
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      auth: {
        persistSession: false,
      },
    })

    const cookieStore = await cookies()
    const sessionToken = cookieStore.get("admin_session")?.value

    if (!sessionToken) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    // Get session and admin user
    const { data: session, error: sessionError } = await supabase
      .from("admin_sessions")
      .select("admin_user_id, expires_at")
      .eq("session_token", sessionToken)
      .single()

    if (sessionError || !session) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 })
    }

    // Check if session is expired
    if (new Date(session.expires_at) < new Date()) {
      return NextResponse.json({ error: "Session expired" }, { status: 401 })
    }

    // Get admin user
    const { data: admin, error: adminError } = await supabase
      .from("admin_users")
      .select("email, full_name, role")
      .eq("id", session.admin_user_id)
      .eq("is_active", true)
      .single()

    if (adminError || !admin) {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 })
    }

    return NextResponse.json(admin)
  } catch (error) {
    console.error("[v0] Error fetching admin data:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
