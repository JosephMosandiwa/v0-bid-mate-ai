"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"
import { Building2, Plus, Loader2, Star, Archive, Edit, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { OnboardingWizard } from "@/app/onboarding/onboarding-wizard"

export default function CompaniesPage() {
  const supabase = createClient()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [companies, setCompanies] = useState<any[]>([])
  const [user, setUser] = useState<any>(null)
  const [showAddCompanyDialog, setShowAddCompanyDialog] = useState(false)

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser()

      if (!currentUser) {
        router.push("/login")
      } else {
        setUser(currentUser)
        loadCompanies(currentUser)
      }
    }

    checkUser()
  }, [router])

  const loadCompanies = async (currentUser: any) => {
    try {
      const { data, error } = await supabase
        .from("companies")
        .select("*")
        .eq("user_id", currentUser.id)
        .eq("is_archived", false)
        .order("is_primary", { ascending: false })
        .order("created_at", { ascending: false })

      if (error) throw error
      setCompanies(data || [])
    } catch (error) {
      console.error("Error loading companies:", error)
    } finally {
      setLoading(false)
    }
  }

  const setPrimaryCompany = async (companyId: string) => {
    try {
      const { error } = await supabase.from("companies").update({ is_primary: true }).eq("id", companyId)

      if (error) throw error
      if (user) loadCompanies(user)
      alert("Primary company updated!")
    } catch (error) {
      console.error("Error setting primary company:", error)
      alert("Failed to update primary company")
    }
  }

  const archiveCompany = async (companyId: string) => {
    if (!confirm("Are you sure you want to archive this company?")) return

    try {
      const { error } = await supabase.from("companies").update({ is_archived: true }).eq("id", companyId)

      if (error) throw error
      if (user) loadCompanies(user)
      alert("Company archived successfully!")
    } catch (error) {
      console.error("Error archiving company:", error)
      alert("Failed to archive company")
    }
  }

  const handleCompanyAdded = () => {
    setShowAddCompanyDialog(false)
    if (user) loadCompanies(user)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="container max-w-6xl py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Company Profiles</h1>
          <p className="text-muted-foreground mt-2">Manage multiple companies and their compliance information</p>
        </div>
        <Button onClick={() => setShowAddCompanyDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Company
        </Button>
      </div>

      {companies.length === 0 ? (
        <Alert>
          <Building2 className="h-4 w-4" />
          <AlertDescription>No companies added yet. Add your first company to start managing tenders.</AlertDescription>
        </Alert>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {companies.map((company) => (
            <Card key={company.id} className="relative">
              {company.is_primary && (
                <div className="absolute top-4 right-4">
                  <Badge variant="default" className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-current" />
                    Primary
                  </Badge>
                </div>
              )}
              <CardHeader>
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Building2 className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{company.company_name}</CardTitle>
                    <CardDescription className="mt-1">
                      {company.industry
                        ? company.industry.charAt(0).toUpperCase() + company.industry.slice(1)
                        : "No industry"}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {company.registration_number && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Registration:</span>
                    <span className="font-medium">{company.registration_number}</span>
                  </div>
                )}
                {company.bee_status && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">BEE Level:</span>
                    <span className="font-medium">{company.bee_status}</span>
                  </div>
                )}
                {company.province && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Province:</span>
                    <span className="font-medium capitalize">{company.province.replace(/-/g, " ")}</span>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 bg-transparent"
                  onClick={() => router.push(`/dashboard/companies/${company.id}`)}
                >
                  <Edit className="h-3 w-3 mr-1" />
                  Edit
                </Button>
                {!company.is_primary && (
                  <Button variant="outline" size="sm" onClick={() => setPrimaryCompany(company.id)}>
                    <Star className="h-3 w-3" />
                  </Button>
                )}
                <Button variant="outline" size="sm" onClick={() => archiveCompany(company.id)}>
                  <Archive className="h-3 w-3" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={showAddCompanyDialog} onOpenChange={setShowAddCompanyDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Company</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-4"
              onClick={() => setShowAddCompanyDialog(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogHeader>
          {user && (
            <OnboardingWizard
              userId={user.id}
              userEmail={user.email || ""}
              mode="add-company"
              onComplete={handleCompanyAdded}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
