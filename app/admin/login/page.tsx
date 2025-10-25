import { AdminLoginForm } from "@/components/admin-login-form"

export const dynamic = "force-dynamic"

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <div className="w-full max-w-md">
        <AdminLoginForm />
      </div>
    </div>
  )
}
