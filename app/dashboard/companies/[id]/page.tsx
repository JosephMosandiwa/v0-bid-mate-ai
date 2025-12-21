"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"
import { ArrowLeft, Building2, Save, Loader2, Upload, FileText } from "lucide-react"
import { useRouter, useParams } from "next/navigation"
import { getGoogleMapsApiKey } from "@/lib/actions/get-google-maps-key"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function CompanyDetailPage() {
  const supabase = createClient()
  const router = useRouter()
  const params = useParams()
  const companyId = params.id as string
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [googleMapsApiKey, setGoogleMapsApiKey] = useState("")
  const [company, setCompany] = useState({
    company_name: "",
    registration_number: "",
    tax_number: "",
    bee_status: "",
    vat_number: "",
    contact_phone: "", // Added phone field
    cidb_grade: "", // Added CIDB field
    industry: "",
    industries: [] as string[], // Added industries array
    company_size: "",
    address_line1: "",
    address_line2: "",
    city: "",
    province: "",
    postal_code: "",
    country: "South Africa",
    website: "",
  })
  const [documents, setDocuments] = useState<any[]>([])

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/login")
      } else {
        loadCompanyData()
        loadGoogleMapsKey()
        loadDocuments()
      }
    }

    checkUser()
  }, [companyId])

  const loadGoogleMapsKey = async () => {
    const key = await getGoogleMapsApiKey()
    setGoogleMapsApiKey(key)
  }

  const loadCompanyData = async () => {
    try {
      const { data, error } = await supabase.from("companies").select("*").eq("id", companyId).single()

      if (error) throw error
      if (data) {
        setCompany({
          company_name: data.company_name || "",
          registration_number: data.registration_number || "",
          tax_number: data.tax_number || "",
          bee_status: data.bee_status || "",
          vat_number: data.vat_number || "",
          contact_phone: data.contact_phone || "", // Map phone
          cidb_grade: data.cidb_grade || "", // Map CIDB
          industry: data.industry || "",
          industries: data.industries || [], // Map industries array
          company_size: data.company_size || "",
          address_line1: data.address_line1 || "",
          address_line2: data.address_line2 || "",
          city: data.city || "",
          province: data.province || "",
          postal_code: data.postal_code || "",
          country: data.country || "South Africa",
          website: data.website || "",
        })
      }
    } catch (error) {
      console.error("Error loading company:", error)
      alert("Failed to load company data")
      router.push("/dashboard/companies")
    } finally {
      setLoading(false)
    }
  }

  const loadDocuments = async () => {
    try {
      const { data } = await supabase
        .from("onboarding_compliance_documents")
        .select("*")
        .eq("company_id", companyId)
        .order("created_at", { ascending: false })

      setDocuments(data || [])
    } catch (error) {
      console.error("Error loading documents:", error)
    }
  }

  const saveCompany = async () => {
    setSaving(true)
    try {
      const { error } = await supabase
        .from("companies")
        .update({
          ...company,
          updated_at: new Date().toISOString(),
        })
        .eq("id", companyId)

      if (error) throw error
      alert("Company information updated successfully!")
    } catch (error) {
      console.error("Error saving company:", error)
      alert("Failed to save company information. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  const handleAddressChange = (address: string, placeDetails?: any) => {
    setCompany({ ...company, address_line1: address })

    if (placeDetails?.address_components) {
      const components = placeDetails.address_components
      const city = components.find((c: any) => c.types.includes("locality"))?.long_name
      const province = components.find((c: any) => c.types.includes("administrative_area_level_1"))?.long_name
      const postalCode = components.find((c: any) => c.types.includes("postal_code"))?.long_name

      setCompany((prev) => ({
        ...prev,
        address_line1: address,
        ...(city && { city }),
        ...(province && { province: province.toLowerCase().replace(/\s+/g, "-") }),
        ...(postalCode && { postal_code: postalCode }),
      }))
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="container max-w-5xl py-8">
      <div className="mb-8">
        <Button variant="ghost" onClick={() => router.push("/dashboard/companies")} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Companies
        </Button>
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-lg bg-primary/10">
            <Building2 className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{company.company_name || "Company Details"}</h1>
            <p className="text-muted-foreground mt-1">Manage company information and compliance documents</p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="details" className="space-y-6">
        <TabsList>
          <TabsTrigger value="details">Company Details</TabsTrigger>
          <TabsTrigger value="documents">Compliance Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
              <CardDescription>Update company details and registration information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="company_name">Company Name *</Label>
                  <Input
                    id="company_name"
                    value={company.company_name}
                    onChange={(e) => setCompany({ ...company, company_name: e.target.value })}
                    placeholder="Acme Corporation"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="registration_number">Registration Number</Label>
                  <Input
                    id="registration_number"
                    value={company.registration_number}
                    onChange={(e) => setCompany({ ...company, registration_number: e.target.value })}
                    placeholder="2021/123456/07"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="vat_number">VAT Number</Label>
                  <Input
                    id="vat_number"
                    value={company.vat_number}
                    onChange={(e) => setCompany({ ...company, vat_number: e.target.value })}
                    placeholder="4123456789"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact_phone">Contact Phone</Label>
                  <Input
                    id="contact_phone"
                    value={company.contact_phone}
                    onChange={(e) => setCompany({ ...company, contact_phone: e.target.value })}
                    placeholder="+27 12 345 6789"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="bee_status">B-BBEE Level</Label>
                  <Input
                    id="bee_status"
                    value={company.bee_status}
                    onChange={(e) => setCompany({ ...company, bee_status: e.target.value })}
                    placeholder="Level 1-8 or EME"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cidb_grade">CIDB Grade</Label>
                  <Input
                    id="cidb_grade"
                    value={company.cidb_grade}
                    onChange={(e) => setCompany({ ...company, cidb_grade: e.target.value })}
                    placeholder="1-9 or GB"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="industry">Primary Industry</Label>
                  <Input
                    id="industry"
                    value={company.industry}
                    onChange={(e) => setCompany({ ...company, industry: e.target.value })}
                    placeholder="Construction, IT Services, etc."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company_size">Company Size</Label>
                  <Input
                    id="company_size"
                    value={company.company_size}
                    onChange={(e) => setCompany({ ...company, company_size: e.target.value })}
                    placeholder="1-10, 11-50, 51-200, etc."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address_line1">Address Line 1</Label>
                <Input
                  id="address_line1"
                  value={company.address_line1}
                  onChange={(e) => setCompany({ ...company, address_line1: e.target.value })}
                  placeholder="123 Main Street"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address_line2">Address Line 2</Label>
                <Input
                  id="address_line2"
                  value={company.address_line2}
                  onChange={(e) => setCompany({ ...company, address_line2: e.target.value })}
                  placeholder="Suite 456"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={company.city}
                    onChange={(e) => setCompany({ ...company, city: e.target.value })}
                    placeholder="Johannesburg"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="province">Province</Label>
                  <Input
                    id="province"
                    value={company.province}
                    onChange={(e) => setCompany({ ...company, province: e.target.value })}
                    placeholder="Gauteng"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postal_code">Postal Code</Label>
                  <Input
                    id="postal_code"
                    value={company.postal_code}
                    onChange={(e) => setCompany({ ...company, postal_code: e.target.value })}
                    placeholder="2000"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={company.website}
                  onChange={(e) => setCompany({ ...company, website: e.target.value })}
                  placeholder="https://www.example.com"
                />
              </div>

              <div className="flex justify-end pt-4">
                <Button onClick={saveCompany} disabled={saving || !company.company_name}>
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Documents</CardTitle>
              <CardDescription>Upload and manage company compliance certificates</CardDescription>
            </CardHeader>
            <CardContent>
              {documents.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-4">No compliance documents uploaded yet</p>
                  <Button>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Documents
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {documents.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium">{doc.document_name}</p>
                          <p className="text-sm text-muted-foreground">{doc.document_type}</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
