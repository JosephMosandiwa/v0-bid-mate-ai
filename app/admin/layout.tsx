import type React from "react"
import { AdminAuthService } from "@/lib/services/admin-auth-service"
import { redirect } from "next/navigation"
import { AdminNav } from "@/components/admin-nav"

export const dynamic = "force-dynamic"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await AdminAuthService.getCurrentAdmin()

  // The login page itself will handle the redirect if already authenticated
  if (!admin && !window.location.pathname.includes("/admin/login")) {
    redirect("/admin/login")
  }

  return (
    <div className="min-h-screen bg-background">
      {admin && <AdminNav admin={admin} />}
      <main className="w-full">{children}</main>
    </div>
  )
}
