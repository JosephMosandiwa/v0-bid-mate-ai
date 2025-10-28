import { AdminNav } from "@/components/admin-nav"
import { AdminAuthService } from "@/lib/services/admin-auth-service"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Settings } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function AdminSettingsPage() {
  const admin = await AdminAuthService.getCurrentAdmin()
  if (!admin) {
    redirect("/admin/login")
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AdminNav />
      <div className="flex-1 p-6 lg:ml-64 space-y-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground text-lg">Configure system settings and preferences</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              System Configuration
            </CardTitle>
            <CardDescription>Manage application settings</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground py-8">
              Settings configuration coming soon. This will include API keys, scraping schedules, notification
              preferences, and more.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
