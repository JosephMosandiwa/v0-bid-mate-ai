import { AdminAuthService } from "@/lib/services/admin-auth-service"
import { redirect } from "next/navigation"
import { AdminLoginForm } from "@/components/admin-login-form"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function AdminLoginPage() {
  let admin = null
  let hasError = false

  try {
    admin = await AdminAuthService.getCurrentAdmin()
  } catch (error) {
    console.error("[AdminLogin] Error checking admin session:", error)
    hasError = true
  }

  if (admin) {
    redirect("/admin/dashboard")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <div className="w-full max-w-md space-y-4">
        {hasError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Database Setup Required</AlertTitle>
            <AlertDescription>
              Please run script 018 to create the admin authentication tables before logging in.
            </AlertDescription>
          </Alert>
        )}
        <AdminLoginForm />
      </div>
    </div>
  )
}
