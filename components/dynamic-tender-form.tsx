"use client"

import { AlertTitle } from "@/components/ui/alert"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Loader2,
  Save,
  CheckCircle2,
  Download,
  FileText,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  Percent,
} from "lucide-react"
import { formatZAR } from "@/lib/utils/currency"
import { saveScrapedTenderToUser } from "@/app/actions/tender-actions"
import { useToast } from "@/hooks/use-toast"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface FormField {
  id: string
  label: string
  type: string
  required: boolean
  placeholder?: string
  description?: string
  options?: string[]
  validation?: {
    min?: number
    max?: number
    pattern?: string
    maxLength?: number
  }
  section?: string
}

interface DynamicTenderFormProps {
  tenderId: string
  formFields: FormField[]
  googleMapsApiKey?: string
  documents?: any[]
  tenderData?: {
    id: string
    title: string
    source_name: string
    description?: string
    publish_date?: string
    close_date?: string
    estimated_value?: string
    category?: string
    tender_url?: string
  }
  onProgressChange?: (progressPercent: number, status: string) => void
}

export function DynamicTenderForm({
  tenderId,
  formFields,
  googleMapsApiKey,
  documents = [],
  tenderData,
  onProgressChange,
}: DynamicTenderFormProps) {
  console.log("[v0] 🔵 DynamicTenderForm COMPONENT RENDERING")
  console.log("[v0] Tender ID:", tenderId)
  console.log("[v0] FormFields received:", formFields?.length || 0, "fields")
  console.log("[v0] FormFields:", formFields)
  console.log("[v0] Documents:", documents?.length || 0)

  const [formData, setFormData] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [fillingPdf, setFillingPdf] = useState(false)
  const [hasAutoSaved, setHasAutoSaved] = useState(false)
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set())
  const [lastSaveTime, setLastSaveTime] = useState<Date | null>(null)
  const [formCompletionPercent, setFormCompletionPercent] = useState(0)
  const { toast } = useToast()

  const isCustomTender = tenderId.length === 36 && tenderId.includes("-")
  const apiBasePath = isCustomTender ? `/api/custom-tenders/${tenderId}` : `/api/tenders/scraped/${tenderId}`

  const availableDocuments = documents.filter(
    (doc: any) => doc.document_type === "application/pdf" || doc.file_type === "application/pdf",
  )

  useEffect(() => {
    loadSavedResponses()
  }, [tenderId])

  useEffect(() => {
    calculateFormCompletion()
  }, [formData, formFields])

  const calculateFormCompletion = () => {
    if (formFields.length === 0) {
      setFormCompletionPercent(0)
      return
    }

    const requiredFields = formFields.filter((f) => f.required)
    const totalFields = requiredFields.length > 0 ? requiredFields.length : formFields.length
    const filledFields =
      requiredFields.length > 0
        ? requiredFields.filter((f) => formData[f.id] && formData[f.id] !== "").length
        : Object.keys(formData).filter((key) => formData[key] && formData[key] !== "").length

    const percent = Math.round((filledFields / totalFields) * 100)
    setFormCompletionPercent(percent)

    // Update tender progress status based on form completion
    let status = "reviewing"
    if (percent >= 100) {
      status = "ready"
    } else if (percent >= 75) {
      status = "preparing"
    } else if (percent >= 50) {
      status = "planning"
    } else if (percent >= 25) {
      status = "analyzing"
    }

    if (onProgressChange && percent > 0) {
      onProgressChange(Math.min(percent, 95), status) // Cap at 95% until submitted
    }
  }

  const loadSavedResponses = async () => {
    try {
      const response = await fetch(`${apiBasePath}/responses`)
      if (response.ok) {
        const { responses } = await response.json()
        if (responses) {
          setFormData(responses)
          setLastSaveTime(new Date())
        }
      }
    } catch (error) {
      console.error("[v0] Error loading saved responses:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAutoSave = async () => {
    if (!tenderData || hasAutoSaved) return

    try {
      const result = await saveScrapedTenderToUser(tenderData)
      if (result.success) {
        setHasAutoSaved(true)
        if (result.isNew) {
          toast({
            title: "Tender Saved",
            description: "This tender has been added to 'My Tenders' with status 'In Progress'",
          })
        }
      }
    } catch (error) {
      console.error("[v0] Error auto-saving tender:", error)
    }
  }

  const handleChange = (fieldId: string, value: any) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }))
    setErrors((prev) => ({ ...prev, [fieldId]: "" }))
    setSaved(false)

    if (Object.keys(formData).length === 0 && !hasAutoSaved) {
      handleAutoSave()
    }
  }

  const validateField = (field: FormField, value: any): string | null => {
    if (field.required && (!value || value === "")) {
      return "This field is required"
    }

    if (field.validation && value) {
      if (field.type === "number") {
        const num = Number(value)
        if (field.validation.min !== undefined && num < field.validation.min) {
          return `Minimum value is ${field.validation.min}`
        }
        if (field.validation.max !== undefined && num > field.validation.max) {
          return `Maximum value is ${field.validation.max}`
        }
      }

      if (field.type === "text" || field.type === "textarea") {
        if (field.validation.maxLength && value.length > field.validation.maxLength) {
          return `Maximum length is ${field.validation.maxLength} characters`
        }
        if (field.validation.pattern && !new RegExp(field.validation.pattern).test(value)) {
          return `Invalid format`
        }
      }
    }

    return null
  }

  const handleSave = async () => {
    const newErrors: Record<string, string> = {}

    // Validate all required fields
    formFields.forEach((field) => {
      const error = validateField(field, formData[field.id])
      if (error) {
        newErrors[field.id] = error
      }
    })

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      toast({
        title: "Validation Error",
        description: `Please fix ${Object.keys(newErrors).length} error(s) before saving`,
        variant: "destructive",
      })
      return
    }

    setSaving(true)
    try {
      const response = await fetch(`${apiBasePath}/responses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ responses: formData }),
      })

      if (response.ok) {
        setSaved(true)
        setLastSaveTime(new Date())
        setTimeout(() => setSaved(false), 3000)
        toast({
          title: "Saved",
          description: "Your responses have been saved successfully",
        })

        // Update progress log
        if (isCustomTender) {
          await fetch(`/api/strategist/progress`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              tenderId,
              tenderType: "custom",
              status: formCompletionPercent >= 100 ? "ready" : "preparing",
              progressPercent: Math.min(formCompletionPercent, 95),
              milestone: `Form ${formCompletionPercent}% complete`,
              notes: `User saved form responses - ${Object.keys(formData).length} fields filled`,
            }),
          })
        }
      }
    } catch (error) {
      console.error("[v0] Error saving responses:", error)
      toast({
        title: "Error",
        description: "Failed to save responses",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handlePreviewFilledPdf = async (documentId: string) => {
    console.log("[v0] 🔵 PREVIEW BUTTON CLICKED - Function starting...")
    console.log("[v0] Current timestamp:", new Date().toISOString())

    setFillingPdf(true)
    try {
      console.log("[v0] ========================================")
      console.log("[v0] PREVIEW FILLED PDF REQUEST")
      console.log("[v0] ========================================")
      console.log("[v0] Document ID:", documentId)
      console.log("[v0] Form data being sent:", formData)
      console.log("[v0] Number of filled fields:", Object.keys(formData).length)
      console.log("[v0] Field IDs:", Object.keys(formData))

      if (Object.keys(formData).length === 0) {
        console.log("[v0] ⚠⚠⚠ WARNING: No form data to fill! ⚠⚠⚠")
        console.log("[v0] You haven't filled any fields yet. The PDF will open but will be empty.")
      }

      console.log("[v0] Making fetch request to:", `${apiBasePath}/fill-pdf`)
      const response = await fetch(`${apiBasePath}/fill-pdf`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentId }),
      })

      console.log("[v0] ✓ Fetch completed")
      console.log("[v0] Response status:", response.status)
      console.log("[v0] Response OK:", response.ok)
      console.log("[v0] Response headers:")
      console.log("[v0]   - PDF Fields Total:", response.headers.get("X-PDF-Fields-Total"))
      console.log("[v0]   - Fields Filled:", response.headers.get("X-Fields-Filled"))
      console.log("[v0]   - Responses Total:", response.headers.get("X-Responses-Total"))
      console.log("[v0]   - Fill Success Rate:", response.headers.get("X-Fill-Success-Rate") + "%")

      const pdfFieldsTotal = Number.parseInt(response.headers.get("X-PDF-Fields-Total") || "0")
      const fieldsFilled = Number.parseInt(response.headers.get("X-Fields-Filled") || "0")
      const responsesTotal = Number.parseInt(response.headers.get("X-Responses-Total") || "0")
      const successRate = Number.parseFloat(response.headers.get("X-Fill-Success-Rate") || "0")

      console.log("[v0] ========================================")
      console.log("[v0] FILL RESULTS:")
      console.log("[v0] ========================================")
      console.log("[v0] PDF has", pdfFieldsTotal, "interactive form fields")
      console.log("[v0] You filled", responsesTotal, "form fields")
      console.log("[v0] Successfully matched and filled", fieldsFilled, "fields")
      console.log("[v0] Success rate:", successRate.toFixed(1) + "%")
      console.log("[v0] ========================================")

      if (pdfFieldsTotal === 0) {
        console.log("[v0] ⚠⚠⚠ WARNING: This PDF has NO interactive form fields! ⚠⚠⚠")
        console.log("[v0] This is a static PDF document. The fields cannot be filled automatically.")
        console.log("[v0] You may need to manually fill this PDF or use a different document.")
        toast({
          title: "Static PDF Detected",
          description:
            "This PDF has no fillable fields. Click 'Generate Response PDF' below to create a new document with your responses.",
          variant: "destructive",
        })
      } else if (fieldsFilled === 0 && responsesTotal > 0) {
        console.log("[v0] ⚠⚠⚠ WARNING: No fields were filled! ⚠⚠⚠")
        console.log("[v0] The form field names don't match the PDF field names.")
        console.log("[v0] Check the server logs for detailed field matching information.")
        toast({
          title: "No Fields Matched",
          description:
            "The form field names don't match the PDF field names. The document will open, but your responses couldn't be filled in automatically.",
          variant: "destructive",
        })
      } else if (successRate < 50) {
        console.log("[v0] ⚠ Low success rate - many fields didn't match")
        toast({
          title: "Partial Fill",
          description: `Only ${fieldsFilled} out of ${responsesTotal} fields were filled (${successRate.toFixed(1)}%). Some field names may not match.`,
        })
      } else if (fieldsFilled > 0) {
        toast({
          title: "PDF Filled Successfully",
          description: `${fieldsFilled} field${fieldsFilled === 1 ? "" : "s"} filled in the PDF`,
        })
      }

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to fill PDF")
      }

      console.log("[v0] Converting response to blob...")
      const blob = await response.blob()
      console.log("[v0] Blob size:", blob.size, "bytes")
      console.log("[v0] Blob type:", blob.type)

      const url = window.URL.createObjectURL(blob)
      console.log("[v0] Opening PDF in new window...")
      window.open(url, "_blank")

      setTimeout(() => window.URL.revokeObjectURL(url), 1000)
      console.log("[v0] ✓ Preview completed successfully")
    } catch (error: any) {
      console.error("[v0] ❌ ERROR in handlePreviewFilledPdf:")
      console.error("[v0] Error type:", error?.constructor?.name)
      console.error("[v0] Error message:", error?.message)
      console.error("[v0] Full error:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to preview filled PDF",
        variant: "destructive",
      })
    } finally {
      console.log("[v0] 🔵 PREVIEW FUNCTION ENDING")
      setFillingPdf(false)
    }
  }

  const handleDownloadFilledPdf = async (documentId: string) => {
    setFillingPdf(true)
    try {
      console.log("[v0] ========================================")
      console.log("[v0] DOWNLOAD FILLED PDF REQUEST")
      console.log("[v0] ========================================")
      console.log("[v0] Document ID:", documentId)
      console.log("[v0] Form data being sent:", formData)
      console.log("[v0] Number of filled fields:", Object.keys(formData).length)

      const response = await fetch(`${apiBasePath}/fill-pdf`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentId }),
      })

      const pdfFieldsTotal = Number.parseInt(response.headers.get("X-PDF-Fields-Total") || "0")
      const fieldsFilled = Number.parseInt(response.headers.get("X-Fields-Filled") || "0")
      const responsesTotal = Number.parseInt(response.headers.get("X-Responses-Total") || "0")
      const successRate = Number.parseFloat(response.headers.get("X-Fill-Success-Rate") || "0")

      console.log("[v0] ========================================")
      console.log("[v0] FILL RESULTS:")
      console.log("[v0] ========================================")
      console.log("[v0] PDF Fields:", pdfFieldsTotal)
      console.log("[v0] Responses:", responsesTotal)
      console.log("[v0] Filled:", fieldsFilled)
      console.log("[v0] Success Rate:", successRate.toFixed(1) + "%")
      console.log("[v0] ========================================")

      if (pdfFieldsTotal === 0) {
        toast({
          title: "PDF Has No Form Fields",
          description:
            "This PDF doesn't have interactive form fields. The document will download, but your responses cannot be automatically filled in.",
          variant: "destructive",
        })
      } else if (fieldsFilled === 0 && responsesTotal > 0) {
        toast({
          title: "No Fields Matched",
          description: "The form field names don't match the PDF field names. Check the console for details.",
          variant: "destructive",
        })
      } else if (fieldsFilled > 0) {
        toast({
          title: "Success",
          description: `Filled PDF downloaded with ${fieldsFilled} field${fieldsFilled === 1 ? "" : "s"} filled`,
        })
      }

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to fill PDF")
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `filled_tender_${tenderId}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error: any) {
      console.error("[v0] Error downloading filled PDF:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to download filled PDF",
        variant: "destructive",
      })
    } finally {
      setFillingPdf(false)
    }
  }

  const handleGenerateResponsePdf = async () => {
    if (Object.keys(formData).length === 0) {
      toast({
        title: "No Responses",
        description: "Please fill in some form fields before generating a response PDF.",
        variant: "destructive",
      })
      return
    }

    setFillingPdf(true)
    try {
      const response = await fetch(`${apiBasePath}/generate-response-pdf`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to generate PDF")
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      window.open(url, "_blank")
      setTimeout(() => window.URL.revokeObjectURL(url), 1000)

      toast({
        title: "Success",
        description: "Response PDF generated successfully",
      })
    } catch (error: any) {
      console.error("[v0] Error generating response PDF:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to generate response PDF",
        variant: "destructive",
      })
    } finally {
      setFillingPdf(false)
    }
  }

  const handleDownloadResponsePdf = async () => {
    if (Object.keys(formData).length === 0) {
      toast({
        title: "No Responses",
        description: "Please fill in some form fields before downloading a response PDF.",
        variant: "destructive",
      })
      return
    }

    setFillingPdf(true)
    try {
      const response = await fetch(`${apiBasePath}/generate-response-pdf`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to generate PDF")
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `tender_response_${tenderId}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast({
        title: "Success",
        description: "Response PDF downloaded successfully",
      })
    } catch (error: any) {
      console.error("[v0] Error downloading response PDF:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to download response PDF",
        variant: "destructive",
      })
    } finally {
      setFillingPdf(false)
    }
  }

  const handleMakePdfEditable = async () => {
    if (availableDocuments.length === 0) {
      toast({
        title: "No Document",
        description: "Please upload a PDF document first.",
        variant: "destructive",
      })
      return
    }

    if (Object.keys(formData).length === 0) {
      toast({
        title: "No Responses",
        description: "Please fill in some form fields first.",
        variant: "destructive",
      })
      return
    }

    setFillingPdf(true)
    try {
      console.log("[v0] ========================================")
      console.log("[v0] MAKE PDF EDITABLE - URL CONSTRUCTION")
      console.log("[v0] ========================================")
      console.log("[v0] tenderId:", tenderId)
      console.log("[v0] isCustomTender:", isCustomTender)
      console.log("[v0] apiBasePath:", apiBasePath)
      const fullUrl = `${apiBasePath}/make-pdf-editable`
      console.log("[v0] Full URL being fetched:", fullUrl)
      console.log("[v0] URL length:", fullUrl.length)
      console.log("[v0] URL contains duplicate?:", fullUrl.includes("/make-pdf-editable/"))
      console.log("[v0] Document ID:", availableDocuments[0].id)
      console.log("[v0] ========================================")

      const response = await fetch(fullUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentId: availableDocuments[0].id }),
      })

      console.log("[v0] Response status:", response.status)
      console.log("[v0] Response OK:", response.ok)

      if (!response.ok) {
        const error = await response.json()
        console.error("[v0] API error response:", error)
        throw new Error(error.error || "Failed to make PDF editable")
      }

      const fieldsAdded = response.headers.get("X-Fields-Added")
      const fieldsFilled = response.headers.get("X-Fields-Filled")

      console.log("[v0] Fields added:", fieldsAdded)
      console.log("[v0] Fields filled:", fieldsFilled)

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      window.open(url, "_blank")
      setTimeout(() => window.URL.revokeObjectURL(url), 1000)

      toast({
        title: "Success",
        description: `Created editable PDF with ${fieldsAdded} form fields (${fieldsFilled} filled)`,
      })
    } catch (error: any) {
      console.error("[v0] Error making PDF editable:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to make PDF editable",
        variant: "destructive",
      })
    } finally {
      setFillingPdf(false)
    }
  }

  const handleDownloadEditablePdf = async () => {
    if (availableDocuments.length === 0) {
      toast({
        title: "No Document",
        description: "Please upload a PDF document first.",
        variant: "destructive",
      })
      return
    }

    if (Object.keys(formData).length === 0) {
      toast({
        title: "No Responses",
        description: "Please fill in some form fields first.",
        variant: "destructive",
      })
      return
    }

    setFillingPdf(true)
    try {
      console.log("[v0] ========================================")
      console.log("[v0] DOWNLOAD EDITABLE PDF - URL CONSTRUCTION")
      console.log("[v0] ========================================")
      console.log("[v0] tenderId:", tenderId)
      console.log("[v0] isCustomTender:", isCustomTender)
      console.log("[v0] apiBasePath:", apiBasePath)
      const fullUrl = `${apiBasePath}/make-pdf-editable`
      console.log("[v0] Full URL being fetched:", fullUrl)
      console.log("[v0] Document ID:", availableDocuments[0].id)
      console.log("[v0] ========================================")

      const response = await fetch(fullUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentId: availableDocuments[0].id }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to make PDF editable")
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `editable_tender_${tenderId}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast({
        title: "Success",
        description: "Editable PDF downloaded successfully",
      })
    } catch (error: any) {
      console.error("[v0] Error downloading editable PDF:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to download editable PDF",
        variant: "destructive",
      })
    } finally {
      setFillingPdf(false)
    }
  }

  const handleGenerateFilledEditable = async () => {
    if (availableDocuments.length === 0) {
      toast({
        title: "No Document",
        description: "Please upload a PDF document first.",
        variant: "destructive",
      })
      return
    }

    if (Object.keys(formData).length === 0) {
      toast({
        title: "No Responses",
        description: "Please fill in some form fields first.",
        variant: "destructive",
      })
      return
    }

    setFillingPdf(true)
    try {
      console.log("[v0] ========================================")
      console.log("[v0] GENERATE FILLED EDITABLE PDF")
      console.log("[v0] ========================================")
      console.log("[v0] Tender ID:", tenderId)
      console.log("[v0] Document ID:", availableDocuments[0].id)
      console.log("[v0] Form responses:", Object.keys(formData).length)

      const response = await fetch(`${apiBasePath}/generate-filled-editable`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentId: availableDocuments[0].id,
          saveToBlob: true,
        }),
      })

      console.log("[v0] Response status:", response.status)

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to generate filled editable PDF")
      }

      const fieldsCreated = response.headers.get("X-Fields-Created")
      const fieldsFilled = response.headers.get("X-Fields-Filled")
      const totalPages = response.headers.get("X-Total-Pages")
      const isReadOnly = response.headers.get("X-Is-Read-Only")
      const savedBlobUrl = response.headers.get("X-Saved-Blob-Url")

      console.log("[v0] Fields created:", fieldsCreated)
      console.log("[v0] Fields filled:", fieldsFilled)
      console.log("[v0] Total pages:", totalPages)
      console.log("[v0] Was read-only:", isReadOnly)
      console.log("[v0] Saved to blob:", savedBlobUrl)

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)

      // Download the file
      const a = document.createElement("a")
      a.href = url
      a.download = `filled_tender_${tenderId}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast({
        title: "Success!",
        description: `Generated editable PDF with ${fieldsFilled} fields filled. ${savedBlobUrl ? "Saved to your documents." : ""}`,
      })
    } catch (error: any) {
      console.error("[v0] Error generating filled editable PDF:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to generate filled editable PDF",
        variant: "destructive",
      })
    } finally {
      setFillingPdf(false)
    }
  }

  const isAddressField = (field: FormField): boolean => {
    const addressKeywords = ["address", "street", "location", "physical address", "postal address"]
    const label = field.label.toLowerCase()
    return addressKeywords.some((keyword) => label.includes(keyword))
  }

  const isCurrencyField = (field: FormField): boolean => {
    const currencyKeywords = ["price", "cost", "amount", "value", "budget", "fee", "payment", "tender value"]
    const label = field.label.toLowerCase()
    return currencyKeywords.some((keyword) => label.includes(keyword)) || field.type === "currency"
  }

  const renderField = (field: FormField) => {
    const value = formData[field.id] || ""
    const error = errors[field.id]

    // Address fields now use regular text input
    if (isAddressField(field) && field.type === "text") {
      return (
        <Input
          type="text"
          id={field.id}
          value={value}
          onChange={(e) => handleChange(field.id, e.target.value)}
          placeholder={field.placeholder || "Enter address..."}
          required={field.required}
          className={error ? "border-destructive" : ""}
        />
      )
    }

    if (isCurrencyField(field) && (field.type === "text" || field.type === "number")) {
      return (
        <div className="relative">
          <Input
            id={field.id}
            type="text"
            value={value}
            onChange={(e) => handleChange(field.id, e.target.value)}
            placeholder={field.placeholder || "e.g., R 1,000,000 or 1000000"}
            className={error ? "border-destructive" : ""}
          />
          {value && !isNaN(Number(value.toString().replace(/[^0-9.-]/g, ""))) && (
            <p className="text-xs text-muted-foreground mt-1">
              Formatted: {formatZAR(value.toString().replace(/[^0-9.-]/g, ""))}
            </p>
          )}
        </div>
      )
    }

    switch (field.type) {
      case "textarea":
        return (
          <Textarea
            id={field.id}
            value={value}
            onChange={(e) => handleChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            className={error ? "border-destructive" : ""}
            rows={4}
          />
        )

      case "select":
        return (
          <Select value={value} onValueChange={(val) => handleChange(field.id, val)}>
            <SelectTrigger className={error ? "border-destructive" : ""}>
              <SelectValue placeholder={field.placeholder || "Select an option"} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )

      case "checkbox":
        return (
          <div className="space-y-2">
            {field.options?.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <Checkbox
                  id={`${field.id}-${option}`}
                  checked={Array.isArray(value) && value.includes(option)}
                  onCheckedChange={(checked) => {
                    const currentValues = Array.isArray(value) ? value : []
                    const newValues = checked ? [...currentValues, option] : currentValues.filter((v) => v !== option)
                    handleChange(field.id, newValues)
                  }}
                />
                <label htmlFor={`${field.id}-${option}`} className="text-sm">
                  {option}
                </label>
              </div>
            ))}
          </div>
        )

      case "radio":
        return (
          <RadioGroup value={value} onValueChange={(val) => handleChange(field.id, val)}>
            {field.options?.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`${field.id}-${option}`} />
                <label htmlFor={`${field.id}-${option}`} className="text-sm">
                  {option}
                </label>
              </div>
            ))}
          </RadioGroup>
        )

      case "file":
        return (
          <Input
            id={field.id}
            type="file"
            onChange={(e) => handleChange(field.id, e.target.files?.[0]?.name || "")}
            className={error ? "border-destructive" : ""}
          />
        )

      default:
        return (
          <Input
            id={field.id}
            type={field.type}
            value={value}
            onChange={(e) => handleChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            className={error ? "border-destructive" : ""}
            min={field.validation?.min}
            max={field.validation?.max}
            maxLength={field.validation?.maxLength}
          />
        )
    }
  }

  if (loading) {
    console.log("[v0] 🟡 Form is in LOADING state")
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
        </CardContent>
      </Card>
    )
  }

  const sections = Array.from(new Set(formFields.map((f) => f.section || "General Information")))

  console.log("[v0] 🟢 Form LOADED - Rendering sections:", sections)
  console.log("[v0] Total sections:", sections.length)

  const toggleSection = (section: string) => {
    const newCollapsed = new Set(collapsedSections)
    if (newCollapsed.has(section)) {
      newCollapsed.delete(section)
    } else {
      newCollapsed.add(section)
    }
    setCollapsedSections(newCollapsed)
  }

  const getSectionCompletion = (section: string): { filled: number; total: number; percent: number } => {
    const sectionFields = formFields.filter((f) => (f.section || "General Information") === section)
    const requiredFields = sectionFields.filter((f) => f.required)
    const fieldsToCheck = requiredFields.length > 0 ? requiredFields : sectionFields

    const filled = fieldsToCheck.filter((f) => formData[f.id] && formData[f.id] !== "").length
    const total = fieldsToCheck.length
    const percent = total > 0 ? Math.round((filled / total) * 100) : 0

    return { filled, total, percent }
  }

  const requiredFieldsCount = formFields.filter((f) => f.required).length
  const totalFilledCount = Object.keys(formData).filter((key) => formData[key] && formData[key] !== "").length

  return (
    <div className="space-y-6">

      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Response Form Progress</CardTitle>
              <CardDescription className="mt-1">
                {requiredFieldsCount > 0
                  ? `${requiredFieldsCount} required fields • ${totalFilledCount} of ${formFields.length} total fields filled`
                  : `${totalFilledCount} of ${formFields.length} fields filled`}
              </CardDescription>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-primary">{formCompletionPercent}%</div>
              <p className="text-xs text-muted-foreground">Complete</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <Progress value={formCompletionPercent} className="h-3" />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <Clock className="h-3 w-3" />
              {lastSaveTime ? `Last saved ${lastSaveTime.toLocaleTimeString()}` : "Not saved yet"}
            </div>
            <Badge variant={formCompletionPercent >= 100 ? "default" : "secondary"} className="gap-1">
              <Percent className="h-3 w-3" />
              {formCompletionPercent >= 100 ? "Ready to Submit" : "In Progress"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* PDF Actions Section */}
      {availableDocuments.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Generate Filled Document
            </CardTitle>
            <CardDescription>
              Download an editable copy of your tender document with all form fields filled in. Your responses will be
              overlaid directly onto the original document pages.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.keys(formData).length === 0 ? (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Fill in the form first</AlertTitle>
                <AlertDescription>
                  Complete the form fields above before generating your filled document.
                </AlertDescription>
              </Alert>
            ) : (
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-800">Ready to generate</AlertTitle>
                <AlertDescription className="text-green-700">
                  You have filled {Object.keys(formData).length} field(s). Click below to generate your filled document.
                </AlertDescription>
              </Alert>
            )}

            <div className="flex flex-wrap gap-3">
              <Button
                onClick={handleGenerateFilledEditable}
                disabled={fillingPdf || Object.keys(formData).length === 0}
                size="lg"
                className="bg-primary"
              >
                {fillingPdf ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating Filled Document...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Generate & Download Filled PDF
                  </>
                )}
              </Button>
            </div>

            <p className="text-xs text-muted-foreground">
              The filled PDF will be saved to your documents. Your responses are overlaid directly on the original
              tender document.
            </p>
          </CardContent>
        </Card>
      )}

      {sections.map((section) => {
        const sectionFields = formFields.filter((f) => (f.section || "General Information") === section)
        const completion = getSectionCompletion(section)
        const isCollapsed = collapsedSections.has(section)
        const requiredFieldsInSection = sectionFields.filter((f) => f.required).length

        return (
          <Card
            key={section}
            className={cn("transition-all", completion.percent === 100 && "border-green-500/50 bg-green-50/50")}
          >
            <CardHeader
              className="cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => toggleSection(section)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <CardTitle className="text-base">{section}</CardTitle>
                    {requiredFieldsInSection > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        {requiredFieldsInSection} Required
                      </Badge>
                    )}
                  </div>
                  <CardDescription className="mt-1">
                    {completion.filled} of {completion.total} fields completed
                  </CardDescription>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Progress value={completion.percent} className="h-2 w-20" />
                    <span
                      className={cn(
                        "text-sm font-medium w-12 text-right",
                        completion.percent === 100 ? "text-green-600" : "text-muted-foreground",
                      )}
                    >
                      {completion.percent}%
                    </span>
                  </div>
                  {isCollapsed ? (
                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <ChevronUp className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
              </div>
            </CardHeader>
            {!isCollapsed && (
              <CardContent className="space-y-4 pt-0">
                {sectionFields.map((field) => (
                  <div key={field.id} className="space-y-2">
                    <Label htmlFor={field.id} className="flex items-center gap-2">
                      {field.label}
                      {field.required && (
                        <Badge variant="destructive" className="text-xs px-1.5 py-0">
                          Required
                        </Badge>
                      )}
                    </Label>
                    {field.description && <p className="text-sm text-muted-foreground">{field.description}</p>}
                    {renderField(field)}
                    {errors[field.id] && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors[field.id]}
                      </p>
                    )}
                  </div>
                ))}
              </CardContent>
            )}
          </Card>
        )
      })}

      <Card className="sticky bottom-4 shadow-lg border-primary/20">
        <CardContent className="py-4">
          <div className="flex items-center gap-4 flex-wrap">
            <Button onClick={handleSave} disabled={saving} size="lg" className="flex-1 min-w-[200px]">
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Progress ({formCompletionPercent}% Complete)
                </>
              )}
            </Button>

            {saved && (
              <Alert className="flex-1 bg-green-500/10 border-green-500/20 py-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <AlertDescription className="text-green-500">Saved successfully!</AlertDescription>
              </Alert>
            )}

            {Object.keys(errors).length > 0 && (
              <Alert variant="destructive" className="flex-1 py-2">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {Object.keys(errors).length} validation error(s) - check required fields
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
