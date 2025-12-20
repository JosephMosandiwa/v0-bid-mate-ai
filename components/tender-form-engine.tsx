"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Save, AlertCircle, FileText, Sparkles, ChevronDown, ChevronUp } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

interface FormField {
  id: string
  label: string
  type: string
  required: boolean
  placeholder?: string
  description?: string
  options?: string[]
  validation?: any
  section?: string
}

interface TenderFormEngineProps {
  tenderId: string
  tenderType: "custom" | "scraped"
  documents: any[]
  onProgressChange?: (percent: number, status: string) => void
}

export function TenderFormEngine({ tenderId, tenderType, documents, onProgressChange }: TenderFormEngineProps) {
  const [formFields, setFormFields] = useState<FormField[]>([])
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(true)
  const [extracting, setExtracting] = useState(false)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set())
  const [completionPercent, setCompletionPercent] = useState(0)
  const { toast } = useToast()

  const apiBasePath = tenderType === "custom" ? `/api/custom-tenders/${tenderId}` : `/api/tenders/scraped/${tenderId}`

  // Load saved responses and form structure
  useEffect(() => {
    loadFormData()
  }, [tenderId])

  // Calculate completion whenever form data changes
  useEffect(() => {
    calculateCompletion()
  }, [formData, formFields])

  const loadFormData = async () => {
    try {
      setLoading(true)

      // Load saved responses
      const responsesRes = await fetch(`${apiBasePath}/responses`)
      if (responsesRes.ok) {
        const { responses } = await responsesRes.json()
        setFormData(responses || {})
      }

      // Load or extract form fields
      await loadFormFields()
    } catch (error) {
      console.error("[v0] Error loading form data:", error)
    } finally {
      setLoading(false)
    }
  }

  const loadFormFields = async () => {
    try {
      // Try to load existing analysis with form fields
      const analysisRes = await fetch(`${apiBasePath}/analysis`)
      if (analysisRes.ok) {
        const { analysis } = await analysisRes.json()
        if (analysis?.formFields?.length > 0) {
          setFormFields(analysis.formFields)
          return
        }
      }

      // If no form fields exist and we have documents, extract them
      if (documents.length > 0) {
        await extractFormFieldsFromDocuments()
      }
    } catch (error) {
      console.error("[v0] Error loading form fields:", error)
    }
  }

  const extractFormFieldsFromDocuments = async () => {
    try {
      setExtracting(true)
      console.log("[v0] Extracting form fields from documents using Documind...")

      const pdfDocuments = documents.filter(
        (doc) => doc.document_type === "application/pdf" || doc.file_type === "application/pdf",
      )

      if (pdfDocuments.length === 0) {
        console.log("[v0] No PDF documents to extract from")
        return
      }

      const response = await fetch("/api/v1/documind/extract-form-fields", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentUrl: pdfDocuments[0].blob_url || pdfDocuments[0].storage_path,
          tenderId,
          tenderType,
        }),
      })

      if (response.ok) {
        const { formFields, metadata } = await response.json()

        setFormFields(formFields)

        // Save extracted fields to analysis
        await fetch(`${apiBasePath}/analysis`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            analysis: {
              formFields,
              extractedAt: new Date().toISOString(),
              metadata,
            },
          }),
        })

        toast({
          title: "Form Fields Extracted",
          description: `Found ${formFields.length} form fields (${metadata.nativeFields} native, ${metadata.detectedFields} detected)`,
        })
      } else {
        throw new Error("Failed to extract form fields")
      }
    } catch (error) {
      console.error("[v0] Error extracting form fields:", error)
      toast({
        title: "Extraction Failed",
        description: "Could not extract form fields from documents",
        variant: "destructive",
      })
    } finally {
      setExtracting(false)
    }
  }

  const mapFieldType = (fieldType?: string, inputType?: string): string => {
    if (inputType === "checkbox") return "checkbox"
    if (inputType === "radio") return "radio"
    if (fieldType === "select" || fieldType === "dropdown") return "select"
    if (fieldType === "textarea" || fieldType === "multiline") return "textarea"
    if (fieldType === "date") return "date"
    if (fieldType === "email") return "email"
    if (fieldType === "number") return "number"
    return "text"
  }

  const calculateCompletion = () => {
    if (formFields.length === 0) {
      setCompletionPercent(0)
      return
    }

    const requiredFields = formFields.filter((f) => f.required)
    const fieldsToCheck = requiredFields.length > 0 ? requiredFields : formFields
    const filledCount = fieldsToCheck.filter((f) => formData[f.id] && formData[f.id] !== "").length

    const percent = Math.round((filledCount / fieldsToCheck.length) * 100)
    setCompletionPercent(percent)

    // Determine status based on completion
    let status = "reviewing"
    if (percent >= 100) status = "ready"
    else if (percent >= 75) status = "preparing"
    else if (percent >= 50) status = "planning"
    else if (percent >= 25) status = "analyzing"

    if (onProgressChange && percent > 0) {
      onProgressChange(Math.min(percent, 95), status)
    }
  }

  const handleChange = (fieldId: string, value: any) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }))
    setErrors((prev) => ({ ...prev, [fieldId]: "" }))
  }

  const validateField = (field: FormField, value: any): string | null => {
    if (field.required && (!value || value === "")) {
      return "This field is required"
    }
    // Add more validation logic as needed
    return null
  }

  const handleSave = async () => {
    try {
      setSaving(true)

      // Validate required fields
      const newErrors: Record<string, string> = {}
      formFields.forEach((field) => {
        const error = validateField(field, formData[field.id])
        if (error) newErrors[field.id] = error
      })

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors)
        toast({
          title: "Validation Error",
          description: `${Object.keys(newErrors).length} field(s) need attention`,
          variant: "destructive",
        })
        return
      }

      // Save responses
      const response = await fetch(`${apiBasePath}/responses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ responses: formData }),
      })

      if (!response.ok) throw new Error("Failed to save")

      toast({
        title: "Saved",
        description: "Your responses have been saved successfully",
      })

      // Log progress
      await fetch("/api/strategist/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tenderId,
          tenderType,
          status: completionPercent >= 100 ? "ready" : "preparing",
          progressPercent: Math.min(completionPercent, 95),
          milestone: `Form ${completionPercent}% complete`,
          notes: `${Object.keys(formData).length} fields filled`,
        }),
      })
    } catch (error) {
      console.error("[v0] Error saving:", error)
      toast({
        title: "Error",
        description: "Failed to save responses",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const renderField = (field: FormField) => {
    const value = formData[field.id] || ""
    const error = errors[field.id]

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

      default:
        return (
          <Input
            id={field.id}
            type={field.type}
            value={value}
            onChange={(e) => handleChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            className={error ? "border-destructive" : ""}
          />
        )
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="text-sm text-muted-foreground mt-4">Loading form...</p>
        </CardContent>
      </Card>
    )
  }

  if (extracting) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <Sparkles className="h-8 w-8 text-primary mx-auto mb-4 animate-pulse" />
          <p className="font-medium mb-2">Extracting Form Fields</p>
          <p className="text-sm text-muted-foreground">Analyzing documents with AI...</p>
        </CardContent>
      </Card>
    )
  }

  if (formFields.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
          <p className="font-medium mb-2">No Form Fields Available</p>
          <p className="text-sm text-muted-foreground mb-4">
            Upload a tender document to automatically extract form fields
          </p>
          {documents.length > 0 && (
            <Button onClick={extractFormFieldsFromDocuments} disabled={extracting}>
              <Sparkles className="h-4 w-4 mr-2" />
              Extract Fields from Documents
            </Button>
          )}
        </CardContent>
      </Card>
    )
  }

  // Group fields by section
  const sections = Array.from(new Set(formFields.map((f) => f.section || "General")))

  return (
    <div className="space-y-6">
      {/* Progress Card */}
      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Response Progress</CardTitle>
              <CardDescription className="mt-1">
                {Object.keys(formData).length} of {formFields.length} fields filled
              </CardDescription>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-primary">{completionPercent}%</div>
              <p className="text-xs text-muted-foreground">Complete</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Progress value={completionPercent} className="h-3" />
        </CardContent>
      </Card>

      {/* Form Sections */}
      {sections.map((section) => {
        const sectionFields = formFields.filter((f) => (f.section || "General") === section)
        const isCollapsed = collapsedSections.has(section)
        const completion = {
          filled: sectionFields.filter((f) => formData[f.id] && formData[f.id] !== "").length,
          total: sectionFields.length,
          percent: Math.round(
            (sectionFields.filter((f) => formData[f.id] && formData[f.id] !== "").length / sectionFields.length) * 100,
          ),
        }

        return (
          <Card key={section}>
            <CardHeader
              className="cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() =>
                setCollapsedSections((prev) => {
                  const next = new Set(prev)
                  if (next.has(section)) next.delete(section)
                  else next.add(section)
                  return next
                })
              }
            >
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">{section}</CardTitle>
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

      {/* Save Button */}
      <Card className="sticky bottom-4 shadow-lg border-primary/20">
        <CardContent className="py-4">
          <div className="flex items-center gap-4">
            <Button onClick={handleSave} disabled={saving} size="lg" className="flex-1">
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Progress ({completionPercent}% Complete)
                </>
              )}
            </Button>

            {Object.keys(errors).length > 0 && (
              <Alert variant="destructive" className="flex-1 py-2">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{Object.keys(errors).length} validation error(s)</AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
