"use server"

import { AdminAuthService } from "@/lib/services/admin-auth-service"
import { redirect } from "next/navigation"

export async function loginAdmin(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!email || !password) {
    return { error: "Email and password are required" }
  }

  const result = await AdminAuthService.login(email, password)

  if (result.success) {
    redirect("/admin/dashboard")
  }

  return { error: result.error || "Login failed" }
}

export async function logoutAdmin() {
  await AdminAuthService.logout()
  redirect("/admin/login")
}
