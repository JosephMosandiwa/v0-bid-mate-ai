import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import bcrypt from "bcryptjs"

export async function POST(request: NextRequest) {
  try {
    const { email, password, fullName } = await request.json()

    console.log("[v0] Admin setup attempt for:", email)

    // Validate input
    if (!email || !password || !fullName) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 })
    }

    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    const { data: existingAdmins, error: checkError } = await supabase.from("admin_users").select("*")

    if (checkError) {
      console.error("[v0] Error checking existing admins:", checkError)
      return NextResponse.json(
        { error: "Database error: " + checkError.message + ". Make sure script 018 and 021 have been run." },
        { status: 500 },
      )
    }

    console.log("[v0] Existing admins found:", existingAdmins?.length || 0)
    if (existingAdmins && existingAdmins.length > 0) {
      console.log(
        "[v0] Existing admin details:",
        existingAdmins.map((a) => ({ email: a.email, is_active: a.is_active })),
      )

      console.log("[v0] Deleting existing admins to allow recreation...")
      const { error: deleteError } = await supabase
        .from("admin_users")
        .delete()
        .neq("id", "00000000-0000-0000-0000-000000000000")

      if (deleteError) {
        console.error("[v0] Error deleting existing admins:", deleteError)
        return NextResponse.json({ error: "Failed to reset admin users: " + deleteError.message }, { status: 500 })
      }

      console.log("[v0] Existing admins deleted successfully")
    }

    // Hash password
    console.log("[v0] Hashing password...")
    const passwordHash = await bcrypt.hash(password, 10)

    // Create admin user
    console.log("[v0] Creating admin user...")
    const { data: newAdmin, error: createError } = await supabase
      .from("admin_users")
      .insert({
        email: email.toLowerCase(),
        password_hash: passwordHash,
        full_name: fullName,
        role: "super_admin",
        is_active: true,
      })
      .select()
      .single()

    if (createError) {
      console.error("[v0] Error creating admin:", createError)
      return NextResponse.json({ error: "Failed to create admin user: " + createError.message }, { status: 500 })
    }

    console.log("[v0] Admin user created successfully:", newAdmin.id)

    return NextResponse.json({
      success: true,
      message: "Admin user created successfully",
    })
  } catch (error) {
    console.error("[v0] Admin setup error:", error)
    return NextResponse.json(
      { error: "An unexpected error occurred: " + (error instanceof Error ? error.message : "Unknown") },
      { status: 500 },
    )
  }
}
