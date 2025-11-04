"use client"

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
import { Loader2, Save, CheckCircle2, Download, Eye } from "lucide-react"
import { GoogleAddressAutocomplete } from "@/components/google-address-autocomplete"
import { formatZAR } from "@/lib/utils/currency"
import { saveScrapedTenderToUser } from "@/app/actions/tender-actions"
import { useToast } from "@/hooks/use-toast"

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
}

export function DynamicTenderForm({
  tenderId,
  formFields,
  googleMapsApiKey,
  documents = [],
  tenderData,
}: DynamicTenderFormProps) {
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [fillingPdf, setFillingPdf] = useState(false)
  const [hasAutoSaved, setHasAutoSaved] = useState(false)
  const { toast } = useToast()

  const isCustomTender = tenderId.length === 36 && tenderId.includes("-")
  const apiBasePath = isCustomTender ? `/api/custom-tenders/${tenderId}` : `/api/tenders/scraped/${tenderId}`

  const availableDocuments = documents.filter(
    (doc: any) => doc.document_type === "application/pdf" || doc.file_type === "application/pdf",
  )

  useEffect(() => {
    loadSavedResponses()
  }, [tenderId])

  const loadSavedResponses = async () => {
    try {
      const response = await fetch(`${apiBasePath}/responses`)
      if (response.ok) {
        const { responses } = await response.json()
        if (responses) {
          setFormData(responses)
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
    if (field.required && !value) {
      return `${field.label} is required`
    }

    if (field.validation) {
      if (field.type === "number" && value) {
        const num = Number(value)
        if (field.validation.min !== undefined && num < field.validation.min) {
          return `Minimum value is ${field.validation.min}`
        }
        if (field.validation.max !== undefined && num > field.validation.max) {
          return `Maximum value is ${field.validation.max}`
        }
      }

      if ((field.type === "text" || field.type === "textarea") && value) {
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

    formFields.forEach((field) => {
      const error = validateField(field, formData[field.id])
      if (error) {
        newErrors[field.id] = error
      }
    })

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
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
        setTimeout(() => setSaved(false), 3000)
        toast({
          title: "Saved",
          description: "Your responses have been saved successfully",
        })
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
      console.log("[v0] ========================================")

      const response = await fetch(fullUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
      console.log("[v0] ========================================")

      const response = await fetch(fullUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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

    if (isAddressField(field) && field.type === "text" && googleMapsApiKey) {
      return (
        <GoogleAddressAutocomplete
          value={value}
          onChange={(address) => handleChange(field.id, address)}
          placeholder={field.placeholder || "Start typing an address..."}
          apiKey={googleMapsApiKey}
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
            className={error ? "border-red-500" : ""}
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
            className={error ? "border-red-500" : ""}
            rows={4}
          />
        )

      case "select":
        return (
          <Select value={value} onValueChange={(val) => handleChange(field.id, val)}>
            <SelectTrigger className={error ? "border-red-500" : ""}>
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
            className={error ? "border-red-500" : ""}
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
            className={error ? "border-red-500" : ""}
            min={field.validation?.min}
            max={field.validation?.max}
            maxLength={field.validation?.maxLength}
          />
        )
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
        </CardContent>
      </Card>
    )
  }

  const sections = Array.from(new Set(formFields.map((f) => f.section || "General Information")))

  return (
    <div className="space-y-6">
      {availableDocuments.length > 0 && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-lg">Document Options</CardTitle>
            <CardDescription>Choose how you want to work with your tender document</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert className="bg-blue-500/10 border-blue-500/20">
              <AlertDescription className="text-sm">
                <strong>Recommended:</strong> Use "Make PDF Editable" to create a version of the original document with
                fillable form fields at the detected positions.
              </AlertDescription>
            </Alert>

            <div className="space-y-3">
              <div className="flex items-center gap-3 flex-wrap">
                <Button
                  onClick={handleMakePdfEditable}
                  disabled={fillingPdf || Object.keys(formData).length === 0}
                  size="lg"
                  variant="default"
                >
                  {fillingPdf ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4 mr-2" />
                      Make PDF Editable & Preview
                    </>
                  )}
                </Button>

                <Button
                  onClick={handleDownloadEditablePdf}
                  disabled={fillingPdf || Object.keys(formData).length === 0}
                  size="lg"
                  variant="outline"
                >
                  {fillingPdf ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      Download Editable PDF
                    </>
                  )}
                </Button>
              </div>

              <div className="flex items-center gap-3 flex-wrap pt-2 border-t">
                <Button
                  onClick={() => handlePreviewFilledPdf(availableDocuments[0].id)}
                  disabled={fillingPdf}
                  size="sm"
                  variant="secondary"
                >
                  {fillingPdf ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4 mr-2" />
                      Try Original PDF
                    </>
                  )}
                </Button>

                <Button
                  onClick={handleGenerateResponsePdf}
                  disabled={fillingPdf || Object.keys(formData).length === 0}
                  size="sm"
                  variant="secondary"
                >
                  {fillingPdf ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4 mr-2" />
                      Generate Response PDF
                    </>
                  )}
                </Button>
              </div>

              <p className="text-sm text-muted-foreground">
                {Object.keys(formData).length > 0
                  ? `${Object.keys(formData).length} field${Object.keys(formData).length === 1 ? "" : "s"} filled`
                  : "No fields filled yet"}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {sections.map((section) => {
        const sectionFields = formFields.filter((f) => (f.section || "General Information") === section)

        return (
          <Card key={section}>
            <CardHeader>
              <CardTitle>{section}</CardTitle>
              <CardDescription>Fill in the required information for this section</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {sectionFields.map((field) => (
                <div key={field.id} className="space-y-2">
                  <Label htmlFor={field.id}>
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </Label>
                  {field.description && <p className="text-sm text-muted-foreground">{field.description}</p>}
                  {renderField(field)}
                  {errors[field.id] && <p className="text-sm text-red-500">{errors[field.id]}</p>}
                </div>
              ))}
            </CardContent>
          </Card>
        )
      })}

      <div className="flex items-center gap-4 flex-wrap">
        <Button onClick={handleSave} disabled={saving} size="lg">
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Progress
            </>
          )}
        </Button>

        {saved && (
          <Alert className="flex-1 bg-green-500/10 border-green-500/20">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <AlertDescription className="text-green-500">Form saved successfully!</AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  )
}
