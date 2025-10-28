import Link from "next/link"
import { redirect } from "next/navigation"
import { AdminAuthService } from "@/lib/services/admin-auth-service"
import { AdminNav } from "@/components/admin-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Users, Database, TrendingUp, Activity, FileText } from "lucide-react"
import { createAdminClient } from "@/lib/supabase/admin"

export const dynamic = "force-dynamic"

async function getAdminStats() {
  try {
    const supabase = createAdminClient()

    const [usersResult, tendersResult, scrapedResult] = await Promise.all([
      supabase.from("profiles").select("id", { count: "exact", head: true }),
      supabase.from("tenders").select("id", { count: "exact", head: true }),
      supabase.from("scraped_tenders").select("id", { count: "exact", head: true }),
    ])

    return {
      totalUsers: usersResult.count || 0,
      totalTenders: tendersResult.count || 0,
      scrapedTenders: scrapedResult.count || 0,
    }
  } catch (error) {
    console.error("[v0] Error fetching admin stats:", error)
    return {
      totalUsers: 0,
      totalTenders: 0,
      scrapedTenders: 0,
    }
  }
}

export default async function AdminDashboardPage() {
  const admin = await AdminAuthService.getCurrentAdmin()

  if (!admin) {
    redirect("/admin/login")
  }

  const stats = await getAdminStats()

  return (
    <div className="flex min-h-screen bg-background">
      <AdminNav />
      <div className="flex-1 p-6 lg:ml-64 space-y-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground text-lg">Welcome back, {admin.full_name || admin.email}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System Status</CardTitle>
              <Shield className="h-5 w-5 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">Operational</div>
              <p className="text-xs text-muted-foreground mt-1">All systems running</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-5 w-5 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground mt-1">Registered accounts</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tenders</CardTitle>
              <FileText className="h-5 w-5 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalTenders}</div>
              <p className="text-xs text-muted-foreground mt-1">Total in database</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Scraped Tenders</CardTitle>
              <Database className="h-5 w-5 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.scrapedTenders}</div>
              <p className="text-xs text-muted-foreground mt-1">From scraping</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Quick Actions
              </CardTitle>
              <CardDescription>Common administrative tasks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/admin/scraping" className="block p-3 rounded-lg border hover:bg-muted transition-colors">
                <div className="font-medium">Manage Scraping</div>
                <div className="text-sm text-muted-foreground">Configure and monitor tender scraping</div>
              </Link>
              <Link href="/admin/usage" className="block p-3 rounded-lg border hover:bg-muted transition-colors">
                <div className="font-medium">View Usage</div>
                <div className="text-sm text-muted-foreground">Monitor costs and usage statistics</div>
              </Link>
              <Link href="/admin/users" className="block p-3 rounded-lg border hover:bg-muted transition-colors">
                <div className="font-medium">Manage Users</div>
                <div className="text-sm text-muted-foreground">View and manage user accounts</div>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                System Health
              </CardTitle>
              <CardDescription>Current system status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Database</span>
                <span className="text-sm font-medium text-green-600">Connected</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Storage</span>
                <span className="text-sm font-medium text-green-600">Operational</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">API Services</span>
                <span className="text-sm font-medium text-green-600">Running</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Scraping Jobs</span>
                <span className="text-sm font-medium text-blue-600">Active</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
