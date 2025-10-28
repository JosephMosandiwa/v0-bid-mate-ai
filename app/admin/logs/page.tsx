import { AdminNav } from "@/components/admin-nav"
import { AdminAuthService } from "@/lib/services/admin-auth-service"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function AdminLogsPage() {
  const admin = await AdminAuthService.getCurrentAdmin()
  if (!admin) {
    redirect("/admin/login")
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AdminNav />
      <div className="flex-1 p-6 lg:ml-64 space-y-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Activity Logs</h1>
          <p className="text-muted-foreground text-lg">Monitor system activity and user actions</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>System and user activity logs</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground py-8">
              Activity logging coming soon. This will track user actions, system events, and administrative changes.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
