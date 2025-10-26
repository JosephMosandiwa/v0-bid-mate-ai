import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Missing Supabase credentials")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkAdminUser() {
  try {
    console.log("🔍 Checking admin users in database...")
    console.log("")

    // Get all admin users
    const { data: admins, error } = await supabase
      .from("admin_users")
      .select("id, email, full_name, role, is_active, created_at, last_login_at")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("❌ Error querying admin_users:", error.message)
      console.log("")
      console.log("💡 This might mean:")
      console.log("   - Script 018 hasn't been run yet")
      console.log("   - The admin_users table doesn't exist")
      console.log("")
      console.log("👉 Run script 018 first: 018_create_admin_users_table.sql")
      return
    }

    if (!admins || admins.length === 0) {
      console.log("⚠️  No admin users found in database")
      console.log("")
      console.log("👉 Run script 019 to create the first admin user:")
      console.log("   019_create_first_admin_user.js")
      return
    }

    console.log(`✅ Found ${admins.length} admin user(s):`)
    console.log("")

    admins.forEach((admin, index) => {
      console.log(`${index + 1}. ${admin.email}`)
      console.log(`   Name: ${admin.full_name}`)
      console.log(`   Role: ${admin.role}`)
      console.log(`   Active: ${admin.is_active ? "✅ Yes" : "❌ No"}`)
      console.log(`   Created: ${new Date(admin.created_at).toLocaleString()}`)
      console.log(`   Last Login: ${admin.last_login_at ? new Date(admin.last_login_at).toLocaleString() : "Never"}`)
      console.log("")
    })

    console.log("🔐 To login, use:")
    console.log("   Email: admin@bidmateai.com")
    console.log("   Password: Admin@123!")
    console.log("")
    console.log("🔗 Login URL: /admin/login")
  } catch (error) {
    console.error("❌ Unexpected error:", error.message)
  }
}

checkAdminUser()
