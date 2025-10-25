import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import bcrypt from "bcryptjs"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    console.log("[v0] API: Admin login attempt for:", email)

    // Create Supabase client with service role
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    // Query admin user
    console.log("[v0] API: Querying admin_users table...")
    const { data: admin, error: queryError } = await supabase
      .from("admin_users")
      .select("*")
      .eq("email", email)
      .eq("is_active", true)
      .single()

    if (queryError || !admin) {
      console.log("[v0] API: Admin not found or query error:", queryError)
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    console.log("[v0] API: Admin found, verifying password...")

    // Verify password
    const isValidPassword = await bcrypt.compare(password, admin.password_hash)

    if (!isValidPassword) {
      console.log("[v0] API: Invalid password")
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    console.log("[v0] API: Password valid, creating session...")

    // Create session
    const sessionToken = crypto.randomUUID()
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7) // 7 days

    const { error: sessionError } = await supabase.from("admin_sessions").insert({
      session_token: sessionToken,
      admin_user_id: admin.id,
      expires_at: expiresAt.toISOString(),
    })

    if (sessionError) {
      console.error("[v0] API: Session creation error:", sessionError)
      return NextResponse.json({ error: "Failed to create session" }, { status: 500 })
    }

    // Update last login
    await supabase.from("admin_users").update({ last_login_at: new Date().toISOString() }).eq("id", admin.id)

    console.log("[v0] API: Session created, setting cookie...")

    // Set cookie
    const cookieStore = await cookies()
    cookieStore.set("admin_session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    })

    console.log("[v0] API: Login successful!")

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] API: Login error:", error)
    return NextResponse.json(
      { error: "An error occurred during login. Please ensure script 018 has been run." },
      { status: 500 },
    )
  }
}
