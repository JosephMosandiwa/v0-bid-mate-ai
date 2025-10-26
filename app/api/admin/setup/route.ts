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

    // Create Supabase client with service role
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

    // Check if any admin users already exist
    const { data: existingAdmins, error: checkError } = await supabase.from("admin_users").select("id").limit(1)

    if (checkError) {
      console.error("[v0] Error checking existing admins:", checkError)
      return NextResponse.json(
        { error: "Database error. Make sure script 018 has been run to create admin tables." },
        { status: 500 },
      )
    }

    if (existingAdmins && existingAdmins.length > 0) {
      return NextResponse.json({ error: "Admin user already exists. Please use the login page." }, { status: 400 })
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
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
