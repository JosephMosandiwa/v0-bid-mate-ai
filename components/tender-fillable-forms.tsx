"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  FileText,
  Save,
  Download,
  Wand2,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Building2,
  DollarSign,
  Briefcase,
  Shield,
  ClipboardList,
} from "lucide-react"

interface FillableField {
  id: string
  document_source: string
  page_number?: number
  field_label: string
  field_type: "text" | "number" | "date" | "currency" | "checkbox" | "signature" | "dropdown" | "textarea"
  is_required: boolean
  validation_hint?: string
  example_value?: string
  section: string
  auto_fill_source?: string
  options?: string[]
}

interface FormsSummary {
  total_fields: number
  required_fields: number
  by_document: Record<string, number>
}

interface TenderFillableFormsProps {
  fillableFields: FillableField[]
  formsSummary?: FormsSummary
  documentsIdentified?: {
    document_name: string
    document_type: string
    is_returnable: boolean
    has_fillable_fields: boolean
  }[]
  tenderId: string
  companyProfile?: Record<string, any>
  onSave?: (formData: Record<string, any>) => void
  initialData?: Record<string, any>
}

const sectionIcons: Record<string, any> = {
  "Company Information": Building2,
  Financial: DollarSign,
  Technical: Briefcase,
  Declaration: FileCheck,
  Pricing: DollarSign,
  Compliance: Shield,
  default: ClipboardList,
}

export function TenderFillableForms({
  fillableFields,
  formsSummary,
  documentsIdentified,
  tenderId,
  companyProfile,
  onSave,
  initialData = {},
}: TenderFillableFormsProps) {
  const [formData, setFormData] = useState<Record<string, any>>(initialData)
  const [hasChanges, setHasChanges] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const completionPercent = fillableFields?.length 
        ? Math.round((Object.keys(formData).filter(k => formData[k]).length / fillableFields.length) * 100)
        : 0
      
      const response = await fetch(`/api/tenders/${tenderId}/save-data`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dataType: "form_responses",
          data: {
            responses: formData,
            completion_percent: completionPercent,
            is_complete: completionPercent === 100,
          },
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to save form responses")
      }

      setHasChanges(false)
      onSave?.(formData)
    } catch (error) {
      console.error("Error saving form responses:", error)
    } finally {
      setIsSaving(false)
    }
  }

  // Group fields by section
  const fieldsBySection = useMemo(() => {
    if (!fillableFields) return {}
    return fillableFields.reduce(
      (acc, field) => {
        const section = field.section || "Other"
        if (!acc[section]) acc[section] = []
        acc[section].push(field)
        return acc
      },
      {} as Record<string, FillableField[]>
    )
  }, [fillableFields])

  // Group fields by document
  const fieldsByDocument = useMemo(() => {
    if (!fillableFields) return {}
    return fillableFields.reduce(
      (acc, field) => {
        const doc = field.document_source || "Other"
        if (!acc[doc]) acc[doc] = []
        acc[doc].push(field)
        return acc
      },
      {} as Record<string, FillableField[]>
    )
  }, [fillableFields])

  // Calculate completion stats
  const completionStats = useMemo(() => {
    if (!fillableFields) return { total: 0, filled: 0, required: 0, requiredFilled: 0 }
    
    const total = fillableFields.length
    const filled = fillableFields.filter((f) => formData[f.id] !== undefined && formData[f.id] !== "").length
    const required = fillableFields.filter((f) => f.is_required).length
    const requiredFilled = fillableFields.filter(
      (f) => f.is_required && formData[f.id] !== undefined && formData[f.id] !== ""
    ).length

    return { total, filled, required, requiredFilled }
  }, [fillableFields, formData])

  const handleFieldChange = (fieldId: string, value: any) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }))
    setHasChanges(true)
  }

  const handleAutoFill = () => {
    if (!companyProfile || !fillableFields) return

    const autoFilledData = { ...formData }
    fillableFields.forEach((field) => {
      if (field.auto_fill_source && companyProfile[field.auto_fill_source]) {
        autoFilledData[field.id] = companyProfile[field.auto_fill_source]
      }
    })
    setFormData(autoFilledData)
    setHasChanges(true)
  }

  const renderField = (field: FillableField) => {
    const value = formData[field.id] || ""
    const isFilled = value !== undefined && value !== ""

    switch (field.field_type) {
      case "textarea":
        return (
          <Textarea
            id={field.id}
            value={value}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            placeholder={field.example_value || `Enter ${field.field_label.toLowerCase()}`}
            className="min-h-[80px]"
          />
        )

      case "checkbox":
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              id={field.id}
              checked={value === true}
              onCheckedChange={(checked) => handleFieldChange(field.id, checked)}
            />
            <Label htmlFor={field.id} className="text-sm text-muted-foreground">
              {field.validation_hint || "Check if applicable"}
            </Label>
          </div>
        )

      case "dropdown":
        return (
          <Select value={value} onValueChange={(val) => handleFieldChange(field.id, val)}>
            <SelectTrigger>
              <SelectValue placeholder={`Select ${field.field_label.toLowerCase()}`} />
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

      case "date":
        return (
          <Input
            id={field.id}
            type="date"
            value={value}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
          />
        )

      case "number":
      case "currency":
        return (
          <Input
            id={field.id}
            type="number"
            step={field.field_type === "currency" ? "0.01" : "1"}
            value={value}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            placeholder={field.example_value || "0"}
            className="font-mono"
          />
        )

      case "signature":
        return (
          <div className="border-2 border-dashed rounded-lg p-4 text-center">
            <p className="text-sm text-muted-foreground">Signature field - will be added to final document</p>
            <Button variant="outline" size="sm" className="mt-2 bg-transparent">
              Add Signature
            </Button>
          </div>
        )

      default:
        return (
          <Input
            id={field.id}
            type="text"
            value={value}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            placeholder={field.example_value || `Enter ${field.field_label.toLowerCase()}`}
          />
        )
    }
  }

  if (!fillableFields || fillableFields.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-muted-foreground" />
            Fillable Forms
          </CardTitle>
          <CardDescription>No fillable fields detected</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <AlertCircle className="h-4 w-4" />
            <span>
              The analysis did not detect any fillable form fields in the tender documents.
              This may be because the documents are primarily informational or the fields require manual identification.
            </span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Fillable Forms
              </CardTitle>
              <CardDescription>
                Complete these fields to prepare your bid documents
              </CardDescription>
            </div>
            <div className="flex gap-2">
              {companyProfile && (
                <Button variant="outline" size="sm" onClick={handleAutoFill}>
                  <Wand2 className="h-4 w-4 mr-2" />
                  Auto-Fill from Profile
                </Button>
              )}
              {hasChanges && (
                <Button size="sm" onClick={handleSave}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Progress
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Progress Stats */}
          <div className="grid gap-4 md:grid-cols-4">
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <p className="text-2xl font-bold text-primary">{completionStats.total}</p>
              <p className="text-xs text-muted-foreground">Total Fields</p>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <p className="text-2xl font-bold text-primary">{completionStats.required}</p>
              <p className="text-xs text-muted-foreground">Required</p>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">{completionStats.filled}</p>
              <p className="text-xs text-muted-foreground">Completed</p>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <p className="text-2xl font-bold text-amber-600">
                {completionStats.required - completionStats.requiredFilled}
              </p>
              <p className="text-xs text-muted-foreground">Required Remaining</p>
            </div>
          </div>

          {/* Overall Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Overall Completion</span>
              <span>{Math.round((completionStats.filled / completionStats.total) * 100)}%</span>
            </div>
            <Progress value={(completionStats.filled / completionStats.total) * 100} className="h-2" />
          </div>

          {/* Documents Summary */}
          {formsSummary?.by_document && Object.keys(formsSummary.by_document).length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2">Fields by Document</h4>
              <div className="flex flex-wrap gap-2">
                {Object.entries(formsSummary.by_document).map(([doc, count]) => (
                  <Badge key={doc} variant="outline">
                    {doc}: {count} fields
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Forms by Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Form Fields by Section</CardTitle>
          <CardDescription>Complete each section of the required forms</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="multiple" defaultValue={Object.keys(fieldsBySection).slice(0, 2)} className="w-full">
            {Object.entries(fieldsBySection).map(([section, fields]) => {
              const SectionIcon = sectionIcons[section] || sectionIcons.default
              const sectionFilled = fields.filter(
                (f) => formData[f.id] !== undefined && formData[f.id] !== ""
              ).length
              const sectionRequired = fields.filter((f) => f.is_required).length

              return (
                <AccordionItem key={section} value={section}>
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-4 w-full pr-4">
                      <SectionIcon className="h-4 w-4 text-primary shrink-0" />
                      <span className="font-medium flex-1 text-left">{section}</span>
                      <div className="flex items-center gap-2">
                        <Badge variant={sectionFilled === fields.length ? "default" : "outline"}>
                          {sectionFilled}/{fields.length}
                        </Badge>
                        {sectionRequired > 0 && (
                          <Badge variant="secondary" className="text-xs">
                            {sectionRequired} required
                          </Badge>
                        )}
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-4">
                    <div className="space-y-4">
                      {fields.map((field) => {
                        const isFilled = formData[field.id] !== undefined && formData[field.id] !== ""
                        return (
                          <div key={field.id} className="space-y-2">
                            <div className="flex items-center gap-2">
                              {isFilled ? (
                                <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
                              ) : field.is_required ? (
                                <AlertCircle className="h-4 w-4 text-amber-500 shrink-0" />
                              ) : (
                                <div className="h-4 w-4 rounded-full border shrink-0" />
                              )}
                              <Label htmlFor={field.id} className="text-sm font-medium">
                                {field.field_label}
                                {field.is_required && <span className="text-red-500 ml-1">*</span>}
                              </Label>
                              {field.document_source && (
                                <Badge variant="outline" className="text-xs ml-auto">
                                  {field.document_source}
                                </Badge>
                              )}
                            </div>
                            {renderField(field)}
                            {field.validation_hint && field.field_type !== "checkbox" && (
                              <p className="text-xs text-muted-foreground">{field.validation_hint}</p>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )
            })}
          </Accordion>
        </CardContent>
      </Card>

      {/* Documents Checklist */}
      {documentsIdentified && documentsIdentified.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileCheck className="h-5 w-5 text-primary" />
              Documents Checklist
            </CardTitle>
            <CardDescription>Documents identified in the tender pack</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {documentsIdentified.map((doc, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{doc.document_name}</p>
                      <p className="text-xs text-muted-foreground">{doc.document_type}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {doc.is_returnable && (
                      <Badge variant="secondary" className="text-xs">
                        Returnable
                      </Badge>
                    )}
                    {doc.has_fillable_fields && (
                      <Badge className="text-xs">Has Fields</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Export Button */}
      <div className="flex justify-end gap-2">
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Form Data
        </Button>
        {hasChanges && (
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save All Changes
          </Button>
        )}
      </div>
    </div>
  )
}
