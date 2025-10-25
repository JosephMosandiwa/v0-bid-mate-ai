import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import bcrypt from "bcryptjs"
import crypto from "crypto"

export interface AdminUser {
  id: string
  email: string
  full_name: string | null
  role: "admin" | "super_admin"
  is_active: boolean
}

export class AdminAuthService {
  private static async getSupabase() {
    const cookieStore = await cookies()
    return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options)
          })
        },
      },
    })
  }

  static async login(email: string, password: string): Promise<{ success: boolean; error?: string; user?: AdminUser }> {
    try {
      console.log("[v0] Admin login attempt for:", email)
      const supabase = await this.getSupabase()

      // Get admin user by email
      console.log("[v0] Querying admin_users table...")
      const { data: adminUser, error: userError } = await supabase
        .from("admin_users")
        .select("*")
        .eq("email", email)
        .eq("is_active", true)
        .single()

      if (userError) {
        console.log("[v0] User query error:", userError)
        if (userError.message?.includes("relation") || userError.message?.includes("does not exist")) {
          console.log("[AdminAuth] Admin tables not found. Please run script 018 to create admin tables.")
          return {
            success: false,
            error: "Admin system not set up. Please run script 018 to create the admin authentication tables.",
          }
        }
        return { success: false, error: "Invalid credentials" }
      }

      if (!adminUser) {
        console.log("[v0] No admin user found")
        return { success: false, error: "Invalid credentials" }
      }

      console.log("[v0] Admin user found, verifying password...")
      // Verify password
      const passwordMatch = await bcrypt.compare(password, adminUser.password_hash)
      if (!passwordMatch) {
        console.log("[v0] Password mismatch")
        return { success: false, error: "Invalid credentials" }
      }

      console.log("[v0] Password verified, creating session...")
      // Generate session token
      const sessionToken = crypto.randomUUID()
      const expiresAt = new Date()
      expiresAt.setDate(expiresAt.getDate() + 7) // 7 days

      // Create session
      const { error: sessionError } = await supabase.from("admin_sessions").insert({
        admin_user_id: adminUser.id,
        session_token: sessionToken,
        expires_at: expiresAt.toISOString(),
      })

      if (sessionError) {
        console.log("[v0] Session creation error:", sessionError)
        return { success: false, error: "Failed to create session" }
      }

      console.log("[v0] Session created, updating last login...")
      // Update last login
      await supabase.from("admin_users").update({ last_login_at: new Date().toISOString() }).eq("id", adminUser.id)

      console.log("[v0] Setting session cookie...")
      // Set session cookie
      const cookieStore = await cookies()
      cookieStore.set("admin_session", sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        expires: expiresAt,
        path: "/",
      })

      console.log("[v0] Login successful!")
      return {
        success: true,
        user: {
          id: adminUser.id,
          email: adminUser.email,
          full_name: adminUser.full_name,
          role: adminUser.role,
          is_active: adminUser.is_active,
        },
      }
    } catch (error) {
      console.error("[v0] Login error:", error)
      console.error("[AdminAuth] Login error:", error)
      const errorMessage = error instanceof Error ? error.message : String(error)
      if (errorMessage.includes("relation") || errorMessage.includes("does not exist")) {
        return {
          success: false,
          error: "Admin system not set up. Please run script 018 to create the admin authentication tables.",
        }
      }
      return { success: false, error: "An error occurred during login" }
    }
  }

  static async logout(): Promise<void> {
    try {
      const cookieStore = await cookies()
      const sessionToken = cookieStore.get("admin_session")?.value

      if (sessionToken) {
        const supabase = await this.getSupabase()
        await supabase.from("admin_sessions").delete().eq("session_token", sessionToken)
      }

      cookieStore.delete("admin_session")
    } catch (error) {
      console.error("[AdminAuth] Logout error:", error)
    }
  }

  static async getCurrentAdmin(): Promise<AdminUser | null> {
    try {
      const cookieStore = await cookies()
      const sessionToken = cookieStore.get("admin_session")?.value

      if (!sessionToken) {
        return null
      }

      const supabase = await this.getSupabase()

      // Get session and verify it's not expired
      const { data: session, error: sessionError } = await supabase
        .from("admin_sessions")
        .select("*, admin_users(*)")
        .eq("session_token", sessionToken)
        .gt("expires_at", new Date().toISOString())
        .single()

      if (sessionError) {
        // Check if error is due to missing table
        if (sessionError.message?.includes("relation") || sessionError.message?.includes("does not exist")) {
          console.log("[AdminAuth] Admin tables not found. Please run script 018 to create admin tables.")
          return null
        }

        // Clean up invalid session for other errors
        cookieStore.delete("admin_session")
        return null
      }

      if (!session) {
        cookieStore.delete("admin_session")
        return null
      }

      const adminUser = session.admin_users

      if (!adminUser.is_active) {
        return null
      }

      return {
        id: adminUser.id,
        email: adminUser.email,
        full_name: adminUser.full_name,
        role: adminUser.role,
        is_active: adminUser.is_active,
      }
    } catch (error) {
      console.error("[AdminAuth] Get current admin error:", error)
      return null
    }
  }

  static async requireAdmin(): Promise<AdminUser> {
    const admin = await this.getCurrentAdmin()
    if (!admin) {
      throw new Error("Unauthorized")
    }
    return admin
  }
}
