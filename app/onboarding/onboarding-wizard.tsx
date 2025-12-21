"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  Building2,
  MapPin,
  FileText,
  Settings,
  Check,
  ChevronRight,
  ChevronLeft,
  Loader2,
  Upload,
  X,
  CheckCircle2,
  AlertCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createBrowserClient } from "@/lib/supabase/client"
import { toast } from "sonner"

const STEPS = [
  { id: 1, title: "Company Info", icon: Building2, description: "Basic company details" },
  { id: 2, title: "Location & Industry", icon: MapPin, description: "Where you operate" },
  { id: 3, title: "Compliance Docs", icon: FileText, description: "Upload certifications" },
  { id: 4, title: "Preferences", icon: Settings, description: "Tender preferences" },
]

const SA_PROVINCES = [
  "Eastern Cape",
  "Free State",
  "Gauteng",
  "KwaZulu-Natal",
  "Limpopo",
  "Mpumalanga",
  "North West",
  "Northern Cape",
  "Western Cape",
]

const INDUSTRIES = [
  "Construction",
  "IT & Technology",
  "Healthcare",
  "Education",
  "Transport & Logistics",
  "Manufacturing",
  "Professional Services",
  "Cleaning & Facilities",
  "Security Services",
  "Catering & Hospitality",
  "Agriculture",
  "Mining",
  "Energy",
  "Other",
]

const CIDB_GRADES = ["1", "2", "3", "4", "5", "6", "7", "8", "9"]
const BBBEE_LEVELS = ["1", "2", "3", "4", "5", "6", "7", "8", "Non-Compliant", "EME", "QSE"]

const DOCUMENT_TYPES = [
  { value: "tax_clearance", label: "Tax Clearance Certificate" },
  { value: "coida", label: "COIDA / Letter of Good Standing" },
  { value: "cidb", label: "CIDB Certificate" },
  { value: "bbbee", label: "B-BBEE Certificate" },
  { value: "company_profile", label: "Company Profile" },
  { value: "bank_details", label: "Banking Details" },
  { value: "insurance", label: "Insurance Certificate" },
  { value: "company_registration", label: "Company Registration (CK/CIPC)" },
  { value: "other", label: "Other" },
]

interface OnboardingWizardProps {
  userId: string
  userEmail: string
}

interface UploadedDocument {
  id: string
  name: string
  type: string
  size: number
  documentType: string
  uploading: boolean
  uploaded: boolean
  blobUrl?: string
}

export function OnboardingWizard({ userId, userEmail }: OnboardingWizardProps) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadedDocuments, setUploadedDocuments] = useState<UploadedDocument[]>([])
  const [processingDocs, setProcessingDocs] = useState(false)

  // Step 1: Company Info
  const [companyName, setCompanyName] = useState("")
  const [registrationNumber, setRegistrationNumber] = useState("")
  const [vatNumber, setVatNumber] = useState("")
  const [contactPhone, setContactPhone] = useState("")

  // Step 2: Location & Industry
  const [province, setProvince] = useState("")
  const [city, setCity] = useState("")
  const [industries, setIndustries] = useState<string[]>([])

  // Step 3: Compliance
  const [cidbGrade, setCidbGrade] = useState("")
  const [bbbeeLevel, setBbbeeLevel] = useState("")
  const [hasTaxClearance, setHasTaxClearance] = useState(false)
  const [hasCoida, setHasCoida] = useState(false)
  const [hasCsd, setHasCsd] = useState(false)

  // Step 4: Preferences
  const [minValue, setMinValue] = useState("")
  const [maxValue, setMaxValue] = useState("")
  const [preferredProvinces, setPreferredProvinces] = useState<string[]>([])
  const [emailAlerts, setEmailAlerts] = useState(true)
  const [weeklyDigest, setWeeklyDigest] = useState(true)

  const toggleIndustry = (industry: string) => {
    setIndustries((prev) => (prev.includes(industry) ? prev.filter((i) => i !== industry) : [...prev, industry]))
  }

  const toggleProvince = (prov: string) => {
    setPreferredProvinces((prev) => (prev.includes(prov) ? prev.filter((p) => p !== prov) : [...prev, prov]))
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return companyName.trim().length > 0
      case 2:
        return province && industries.length > 0
      case 3:
        return true // Compliance is optional
      case 4:
        return true
      default:
        return false
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, documentType: string) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const file = files[0]

    // Add to uploaded documents with uploading state
    const tempId = `temp-${Date.now()}`
    const newDoc: UploadedDocument = {
      id: tempId,
      name: file.name,
      type: file.type,
      size: file.size,
      documentType,
      uploading: true,
      uploaded: false,
    }

    setUploadedDocuments((prev) => [...prev, newDoc])

    try {
      // Upload to Vercel Blob
      const formData = new FormData()
      formData.append("file", file)

      const uploadResponse = await fetch("/api/upload-to-blob", {
        method: "POST",
        body: formData,
      })

      if (!uploadResponse.ok) throw new Error("Failed to upload file")

      const { url } = await uploadResponse.json()

      // Save to onboarding_compliance_documents table
      const supabase = createBrowserClient()
      const { data, error } = await supabase
        .from("onboarding_compliance_documents")
        .insert({
          user_id: userId,
          document_type: documentType,
          document_name: file.name,
          blob_url: url,
          storage_path: url,
          file_size: file.size,
          file_type: file.type,
        })
        .select()
        .single()

      if (error) throw error

      // Update document state
      setUploadedDocuments((prev) =>
        prev.map((doc) =>
          doc.id === tempId ? { ...doc, id: data.id, uploading: false, uploaded: true, blobUrl: url } : doc,
        ),
      )

      toast.success(`${file.name} uploaded successfully`)
    } catch (error) {
      console.error("Upload error:", error)
      toast.error(`Failed to upload ${file.name}`)
      setUploadedDocuments((prev) => prev.filter((doc) => doc.id !== tempId))
    }
  }

  const removeDocument = async (docId: string) => {
    try {
      const supabase = createBrowserClient()
      const { error } = await supabase.from("onboarding_compliance_documents").delete().eq("id", docId)

      if (error) throw error

      setUploadedDocuments((prev) => prev.filter((doc) => doc.id !== docId))
      toast.success("Document removed")
    } catch (error) {
      console.error("Remove error:", error)
      toast.error("Failed to remove document")
    }
  }

  const processDocuments = async () => {
    if (uploadedDocuments.length === 0) return

    setProcessingDocs(true)
    toast.info("Processing documents with AI...")

    try {
      // Process each document through Documind for data extraction
      for (const doc of uploadedDocuments.filter((d) => d.uploaded)) {
        await fetch("/api/v1/documind/process-upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fileUrl: doc.blobUrl,
            fileName: doc.name,
            userId,
            documentType: doc.documentType,
          }),
        })
      }

      toast.success("Documents processed and added to your knowledge base")
    } catch (error) {
      console.error("Processing error:", error)
      toast.error("Some documents failed to process")
    } finally {
      setProcessingDocs(false)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    const supabase = createBrowserClient()

    try {
      // Process documents before finalizing
      await processDocuments()

      // 1. Update profile with basic info (only fields that exist in profiles table)
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          phone: contactPhone || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId)

      if (profileError) {
        console.error("Profile update error:", profileError)
        throw profileError
      }

      // 2. Upsert company info to companies table
      const { error: companyError } = await supabase.from("companies").upsert(
        {
          user_id: userId,
          company_name: companyName,
          registration_number: registrationNumber || null,
          vat_number: vatNumber || null,
          contact_phone: contactPhone || null, // Added phone mapping
          province,
          city: city || null,
          industry: industries[0] || null, // Primary industry
          industries: industries, // Store full array
          bee_status: bbbeeLevel || null,
          cidb_grade: cidbGrade && cidbGrade !== "none" ? cidbGrade : null, // Added CIDB mapping
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "user_id",
        },
      )

      if (companyError) {
        console.error("Company upsert error:", companyError)
        throw companyError
      }

      // 3. Upsert strategist preferences (this table has all the detailed fields)
      const { error: prefsError } = await supabase.from("strategist_user_preferences").upsert(
        {
          user_id: userId,
          industries,
          provinces: preferredProvinces.length > 0 ? preferredProvinces : [province],
          cidb_grading: cidbGrade && cidbGrade !== "none" ? cidbGrade : null,
          bee_level: bbbeeLevel || null,
          has_tax_clearance: hasTaxClearance,
          has_coida: hasCoida,
          has_csd_registration: hasCsd,
          notification_preferences: {
            email_alerts: emailAlerts,
            weekly_digest: weeklyDigest,
            min_value: minValue ? Number.parseInt(minValue) : null,
            max_value: maxValue ? Number.parseInt(maxValue) : null,
          },
          onboarding_completed: true,
          onboarding_completed_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "user_id",
        },
      )

      if (prefsError) {
        console.error("Preferences upsert error:", prefsError)
        throw prefsError
      }

      const knowledgeBaseEntries = [
        { category: "company_info", field_name: "company_name", field_value: companyName, source: "onboarding" },
        {
          category: "company_info",
          field_name: "registration_number",
          field_value: registrationNumber,
          source: "onboarding",
        },
        { category: "company_info", field_name: "vat_number", field_value: vatNumber, source: "onboarding" },
        { category: "company_info", field_name: "contact_phone", field_value: contactPhone, source: "onboarding" },
        { category: "company_info", field_name: "province", field_value: province, source: "onboarding" },
        { category: "company_info", field_name: "city", field_value: city, source: "onboarding" },
        { category: "certifications", field_name: "cidb_grade", field_value: cidbGrade, source: "onboarding" },
        { category: "certifications", field_name: "bbbee_level", field_value: bbbeeLevel, source: "onboarding" },
        {
          category: "certifications",
          field_name: "has_tax_clearance",
          field_value: hasTaxClearance ? "yes" : "no",
          source: "onboarding",
        },
        {
          category: "certifications",
          field_name: "has_coida",
          field_value: hasCoida ? "yes" : "no",
          source: "onboarding",
        },
        { category: "certifications", field_name: "has_csd", field_value: hasCsd ? "yes" : "no", source: "onboarding" },
        { category: "capabilities", field_name: "industries", field_data: { industries }, source: "onboarding" },
        {
          category: "capabilities",
          field_name: "preferred_provinces",
          field_data: { provinces: preferredProvinces },
          source: "onboarding",
        },
      ].filter((entry) => entry.field_value || entry.field_data)

      // Insert into knowledge base
      for (const entry of knowledgeBaseEntries) {
        await supabase.from("company_knowledge_base").upsert(
          {
            user_id: userId,
            ...entry,
            confidence_score: 1.0,
            verified: true,
          },
          {
            onConflict: "user_id,category,field_name",
          },
        )
      }

      await supabase
        .from("profiles")
        .update({
          onboarding_completed: true,
          onboarding_completed_at: new Date().toISOString(),
          onboarding_progress: {
            step: 4,
            completed_steps: [1, 2, 3, 4],
            documents_uploaded: uploadedDocuments.length,
          },
        })
        .eq("id", userId)

      toast.success("Profile setup complete! Your knowledge base is ready.")
      router.push("/dashboard")
    } catch (error) {
      console.error("Onboarding error:", error)
      toast.error("Failed to save profile. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 flex flex-col">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">B</span>
            </div>
            <span className="font-semibold text-lg">BidMate AI</span>
          </div>
          <span className="text-sm text-muted-foreground">{userEmail}</span>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        {/* Stepper */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                      currentStep > step.id
                        ? "bg-primary text-primary-foreground"
                        : currentStep === step.id
                          ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                          : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {currentStep > step.id ? <Check className="w-5 h-5" /> : <step.icon className="w-5 h-5" />}
                  </div>
                  <span
                    className={`text-xs mt-2 font-medium ${
                      currentStep >= step.id ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
                {index < STEPS.length - 1 && (
                  <div
                    className={`h-0.5 w-16 sm:w-24 mx-2 transition-colors ${
                      currentStep > step.id ? "bg-primary" : "bg-muted"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <Card className="rounded-2xl shadow-lg">
          <CardHeader>
            <CardTitle className="font-heading text-2xl">{STEPS[currentStep - 1].title}</CardTitle>
            <CardDescription>{STEPS[currentStep - 1].description}</CardDescription>
          </CardHeader>
          <CardContent>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {currentStep === 1 && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="companyName">Company Name *</Label>
                      <Input
                        id="companyName"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="Your company name"
                        className="mt-1"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="regNumber">Registration Number</Label>
                        <Input
                          id="regNumber"
                          value={registrationNumber}
                          onChange={(e) => setRegistrationNumber(e.target.value)}
                          placeholder="e.g., 2020/123456/07"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="vatNumber">VAT Number</Label>
                        <Input
                          id="vatNumber"
                          value={vatNumber}
                          onChange={(e) => setVatNumber(e.target.value)}
                          placeholder="e.g., 4123456789"
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="phone">Contact Phone</Label>
                      <Input
                        id="phone"
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                        placeholder="+27 12 345 6789"
                        className="mt-1"
                      />
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label>Province *</Label>
                        <Select value={province} onValueChange={setProvince}>
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select province" />
                          </SelectTrigger>
                          <SelectContent>
                            {SA_PROVINCES.map((p) => (
                              <SelectItem key={p} value={p}>
                                {p}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="city">City/Town</Label>
                        <Input
                          id="city"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          placeholder="e.g., Johannesburg"
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Industries * (select all that apply)</Label>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {INDUSTRIES.map((ind) => (
                          <button
                            key={ind}
                            type="button"
                            onClick={() => toggleIndustry(ind)}
                            className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                              industries.includes(ind)
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted hover:bg-muted/80 text-muted-foreground"
                            }`}
                          >
                            {ind}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label>CIDB Grade (if applicable)</Label>
                        <Select value={cidbGrade} onValueChange={setCidbGrade}>
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select grade" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">Not Applicable</SelectItem>
                            {CIDB_GRADES.map((g) => (
                              <SelectItem key={g} value={g}>
                                Grade {g}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>B-BBEE Level</Label>
                        <Select value={bbbeeLevel} onValueChange={setBbbeeLevel}>
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select level" />
                          </SelectTrigger>
                          <SelectContent>
                            {BBBEE_LEVELS.map((l) => (
                              <SelectItem key={l} value={l}>
                                Level {l}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label className="mb-3 block">Compliance Checkboxes</Label>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <Checkbox
                            id="taxClearance"
                            checked={hasTaxClearance}
                            onCheckedChange={(c) => setHasTaxClearance(c === true)}
                          />
                          <Label htmlFor="taxClearance" className="font-normal cursor-pointer">
                            Valid Tax Clearance Certificate
                          </Label>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Checkbox id="coida" checked={hasCoida} onCheckedChange={(c) => setHasCoida(c === true)} />
                          <Label htmlFor="coida" className="font-normal cursor-pointer">
                            COIDA Letter of Good Standing
                          </Label>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Checkbox id="csd" checked={hasCsd} onCheckedChange={(c) => setHasCsd(c === true)} />
                          <Label htmlFor="csd" className="font-normal cursor-pointer">
                            Central Supplier Database (CSD) Registration
                          </Label>
                        </div>
                      </div>
                    </div>

                    <div className="border-t pt-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <Label className="text-base font-semibold">Upload Compliance Documents</Label>
                          <p className="text-sm text-muted-foreground mt-1">
                            Upload your certificates for AI-powered autofill
                          </p>
                        </div>
                        <Upload className="h-5 w-5 text-muted-foreground" />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {DOCUMENT_TYPES.map((docType) => (
                          <div key={docType.value} className="space-y-2">
                            <Label htmlFor={`upload-${docType.value}`} className="text-sm">
                              {docType.label}
                            </Label>
                            <div className="relative">
                              <Input
                                id={`upload-${docType.value}`}
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={(e) => handleFileUpload(e, docType.value)}
                                className="cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                              />
                            </div>
                          </div>
                        ))}
                      </div>

                      {uploadedDocuments.length > 0 && (
                        <div className="mt-6 space-y-3">
                          <Label className="text-sm font-semibold">Uploaded Documents</Label>
                          {uploadedDocuments.map((doc) => (
                            <div key={doc.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                              <div className="flex items-center gap-3 flex-1 min-w-0">
                                {doc.uploading ? (
                                  <Loader2 className="h-4 w-4 animate-spin flex-shrink-0" />
                                ) : doc.uploaded ? (
                                  <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                                ) : (
                                  <AlertCircle className="h-4 w-4 text-destructive flex-shrink-0" />
                                )}
                                <div className="min-w-0 flex-1">
                                  <p className="text-sm font-medium truncate">{doc.name}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {DOCUMENT_TYPES.find((t) => t.value === doc.documentType)?.label}
                                  </p>
                                </div>
                              </div>
                              {doc.uploaded && !doc.uploading && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeDocument(doc.id)}
                                  className="flex-shrink-0"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {currentStep === 4 && (
                  <div className="space-y-6">
                    <div>
                      <Label>Tender Value Range (ZAR)</Label>
                      <div className="grid grid-cols-2 gap-4 mt-2">
                        <div>
                          <Input
                            type="number"
                            value={minValue}
                            onChange={(e) => setMinValue(e.target.value)}
                            placeholder="Min (e.g., 50000)"
                          />
                        </div>
                        <div>
                          <Input
                            type="number"
                            value={maxValue}
                            onChange={(e) => setMaxValue(e.target.value)}
                            placeholder="Max (e.g., 5000000)"
                          />
                        </div>
                      </div>
                    </div>
                    <div>
                      <Label>Preferred Provinces (leave empty for all)</Label>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {SA_PROVINCES.map((p) => (
                          <button
                            key={p}
                            type="button"
                            onClick={() => toggleProvince(p)}
                            className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                              preferredProvinces.includes(p)
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted hover:bg-muted/80 text-muted-foreground"
                            }`}
                          >
                            {p}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          id="emailAlerts"
                          checked={emailAlerts}
                          onCheckedChange={(c) => setEmailAlerts(c === true)}
                        />
                        <Label htmlFor="emailAlerts" className="font-normal cursor-pointer">
                          Email me when new matching tenders are found
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          id="weeklyDigest"
                          checked={weeklyDigest}
                          onCheckedChange={(c) => setWeeklyDigest(c === true)}
                        />
                        <Label htmlFor="weeklyDigest" className="font-normal cursor-pointer">
                          Send me a weekly digest of opportunities
                        </Label>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex justify-between mt-8 pt-6 border-t">
              <Button
                variant="outline"
                onClick={() => setCurrentStep((s) => s - 1)}
                disabled={currentStep === 1}
                className="gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </Button>

              {currentStep < 4 ? (
                <Button onClick={() => setCurrentStep((s) => s + 1)} disabled={!canProceed()} className="gap-2">
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button onClick={handleSubmit} disabled={isSubmitting} className="gap-2">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      Complete Setup
                      <Check className="w-4 h-4" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
