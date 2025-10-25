import { AdminAuthService } from "@/lib/services/admin-auth-service"
import { redirect } from "next/navigation"
import { AdminLoginForm } from "@/components/admin-login-form"

export const dynamic = "force-dynamic"

export default async function AdminLoginPage() {
  // Check if already logged in
  const admin = await AdminAuthService.getCurrentAdmin()
  if (admin) {
    redirect("/admin/dashboard")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <AdminLoginForm />
    </div>
  )
}
