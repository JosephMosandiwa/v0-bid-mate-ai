import { createClient } from "@supabase/supabase-js"
import bcrypt from "bcryptjs"

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Missing Supabase credentials")
  console.error("Please ensure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function createFirstAdminUser() {
  try {
    console.log("🔐 Creating first admin user...")

    // Default admin credentials
    const email = "admin@bidmateai.com"
    const password = "Admin@123!" // Strong default password
    const fullName = "System Administrator"

    // Check if admin already exists
    const { data: existingAdmin } = await supabase.from("admin_users").select("id").eq("email", email).single()

    if (existingAdmin) {
      console.log("⚠️  Admin user already exists with email:", email)
      console.log("ℹ️  If you forgot your password, you can reset it in the database")
      return
    }

    // Hash the password
    console.log("🔒 Hashing password...")
    const passwordHash = await bcrypt.hash(password, 10)

    // Insert admin user
    const { data: newAdmin, error } = await supabase
      .from("admin_users")
      .insert({
        email,
        password_hash: passwordHash,
        full_name: fullName,
        role: "super_admin",
        is_active: true,
      })
      .select()
      .single()

    if (error) {
      throw error
    }

    console.log("✅ Admin user created successfully!")
    console.log("")
    console.log("📧 Email:", email)
    console.log("🔑 Password:", password)
    console.log("")
    console.log("⚠️  IMPORTANT: Please change this password after your first login!")
    console.log("🔗 Login at: /admin/login")
  } catch (error) {
    console.error("❌ Error creating admin user:", error.message)
    process.exit(1)
  }
}

createFirstAdminUser()
