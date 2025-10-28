import { AdminNav } from "@/components/admin-nav"
import { AdminAuthService } from "@/lib/services/admin-auth-service"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createAdminClient } from "@/lib/supabase/admin"
import { Users, Mail, Calendar } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export const dynamic = "force-dynamic"

async function getUsers() {
  try {
    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50)

    if (error) throw error
    return data || []
  } catch (error) {
    console.error("[v0] Error fetching users:", error)
    return []
  }
}

export default async function AdminUsersPage() {
  const admin = await AdminAuthService.getCurrentAdmin()
  if (!admin) {
    redirect("/admin/login")
  }

  const users = await getUsers()

  return (
    <div className="flex min-h-screen bg-background">
      <AdminNav />
      <div className="flex-1 p-6 lg:ml-64 space-y-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground text-lg">Manage user accounts and permissions</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              All Users ({users.length})
            </CardTitle>
            <CardDescription>View and manage registered users</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {users.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No users found</p>
              ) : (
                users.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{user.full_name || "Unnamed User"}</span>
                        {user.company_name && <Badge variant="secondary">{user.company_name}</Badge>}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {user.email || "No email"}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(user.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
