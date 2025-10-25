import type React from "react"
import { AdminAuthService } from "@/lib/services/admin-auth-service"
import { redirect } from "next/navigation"
import { AdminNav } from "@/components/admin-nav"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await AdminAuthService.getCurrentAdmin()

  // Allow access to login page without authentication
  if (!admin && !children.toString().includes("login")) {
    redirect("/admin/login")
  }

  // If on login page and authenticated, redirect to dashboard
  if (admin && children.toString().includes("login")) {
    redirect("/admin/dashboard")
  }

  return (
    <div className="min-h-screen bg-background">
      {admin && <AdminNav admin={admin} />}
      <main>{children}</main>
    </div>
  )
}
