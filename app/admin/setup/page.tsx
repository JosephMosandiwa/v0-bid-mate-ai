import { AdminSetupForm } from "@/components/admin-setup-form"

export default function AdminSetupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Admin Setup</h1>
          <p className="text-muted-foreground">Create your first admin account</p>
        </div>
        <AdminSetupForm />
      </div>
    </div>
  )
}
