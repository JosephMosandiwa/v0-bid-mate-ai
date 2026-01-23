"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Calculator, FileSpreadsheet, Save, Download, AlertCircle } from "lucide-react"

interface BOQItem {
  item_number: string
  description: string
  unit: string
  quantity: number
  rate: number | null
  amount: number | null
  notes?: string
}

interface BOQSection {
  section_number: string
  section_name: string
  items: BOQItem[]
  section_subtotal: number | null
}

interface BOQData {
  found: boolean
  document_name?: string
  page_location?: string
  structure?: string
  currency?: string
  vat_treatment?: string
  sections?: BOQSection[]
  summary?: {
    subtotal: number | null
    contingency_percent: number
    contingency_amount: number | null
    vat_percent: number
    vat_amount: number | null
    total_inclusive: number | null
  }
  pricing_instructions?: string
}

interface TenderBOQDisplayProps {
  boq: BOQData
  tenderId: string
  onSave?: (boqData: any) => void
}

export function TenderBOQDisplay({ boq, tenderId, onSave }: TenderBOQDisplayProps) {
  const [editableBoq, setEditableBoq] = useState<BOQData>(boq)
  const [hasChanges, setHasChanges] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const response = await fetch(`/api/tenders/${tenderId}/save-data`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dataType: "boq",
          data: editableBoq,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to save BOQ")
      }

      setHasChanges(false)
      onSave?.(editableBoq)
    } catch (error) {
      console.error("Error saving BOQ:", error)
    } finally {
      setIsSaving(false)
    }
  }

  if (!boq?.found) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-muted-foreground" />
            Bill of Quantities
          </CardTitle>
          <CardDescription>No BOQ found in tender documents</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <AlertCircle className="h-4 w-4" />
            <span>
              The tender documents do not appear to contain a Bill of Quantities, Pricing Schedule, or similar pricing document.
            </span>
          </div>
        </CardContent>
      </Card>
    )
  }

  const handleRateChange = (sectionIndex: number, itemIndex: number, newRate: string) => {
    const rate = parseFloat(newRate) || 0
    const updatedBoq = { ...editableBoq }
    if (updatedBoq.sections) {
      const item = updatedBoq.sections[sectionIndex].items[itemIndex]
      item.rate = rate
      item.amount = rate * item.quantity
      
      // Recalculate section subtotal
      updatedBoq.sections[sectionIndex].section_subtotal = 
        updatedBoq.sections[sectionIndex].items.reduce((sum, i) => sum + (i.amount || 0), 0)
      
      // Recalculate summary
      if (updatedBoq.summary) {
        const subtotal = updatedBoq.sections.reduce((sum, s) => sum + (s.section_subtotal || 0), 0)
        updatedBoq.summary.subtotal = subtotal
        updatedBoq.summary.contingency_amount = subtotal * (updatedBoq.summary.contingency_percent / 100)
        const beforeVat = subtotal + (updatedBoq.summary.contingency_amount || 0)
        updatedBoq.summary.vat_amount = beforeVat * (updatedBoq.summary.vat_percent / 100)
        updatedBoq.summary.total_inclusive = beforeVat + (updatedBoq.summary.vat_amount || 0)
      }
    }
    setEditableBoq(updatedBoq)
    setHasChanges(true)
  }

  const formatCurrency = (amount: number | null) => {
    if (amount === null || amount === undefined) return "-"
    return new Intl.NumberFormat("en-ZA", {
      style: "currency",
      currency: boq.currency || "ZAR",
    }).format(amount)
  }

  return (
    <Card>
      <CardHeader className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <FileSpreadsheet className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              Bill of Quantities
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              {boq.document_name && <span>{boq.document_name}</span>}
              {boq.page_location && <span className="ml-2 text-xs">({boq.page_location})</span>}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            {hasChanges && (
              <Button size="sm" onClick={handleSave} disabled={isSaving} className="text-xs sm:text-sm">
                <Save className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                {isSaving ? "Saving..." : "Save"}
              </Button>
            )}
            <Button size="sm" variant="outline" className="text-xs sm:text-sm bg-transparent">
              <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden xs:inline">Export</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6 pt-0 sm:pt-0">
        {/* BOQ Info */}
        <div className="flex flex-wrap gap-2">
          {boq.structure && (
            <Badge variant="outline">{boq.structure.replace(/_/g, " ")}</Badge>
          )}
          {boq.currency && (
            <Badge variant="outline">{boq.currency}</Badge>
          )}
          {boq.vat_treatment && (
            <Badge variant="outline">VAT {boq.vat_treatment}</Badge>
          )}
        </div>

        {/* Pricing Instructions */}
        {boq.pricing_instructions && (
          <div className="p-3 bg-muted/50 rounded-lg text-sm">
            <p className="font-medium mb-1">Pricing Instructions:</p>
            <p className="text-muted-foreground">{boq.pricing_instructions}</p>
          </div>
        )}

        {/* BOQ Sections */}
        {editableBoq.sections && editableBoq.sections.length > 0 && (
          <Accordion type="multiple" defaultValue={["section-0"]} className="w-full">
            {editableBoq.sections.map((section, sectionIndex) => (
              <AccordionItem key={sectionIndex} value={`section-${sectionIndex}`}>
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center justify-between w-full pr-4">
                    <span className="font-medium">
                      {section.section_number}. {section.section_name}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {section.section_subtotal !== null ? formatCurrency(section.section_subtotal) : "-"}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="overflow-x-auto -mx-4 sm:mx-0">
                    <Table className="min-w-[600px] sm:min-w-0">
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-12 sm:w-16 text-xs sm:text-sm">Item</TableHead>
                          <TableHead className="text-xs sm:text-sm">Description</TableHead>
                          <TableHead className="w-16 sm:w-20 text-xs sm:text-sm">Unit</TableHead>
                          <TableHead className="w-16 sm:w-20 text-right text-xs sm:text-sm">Qty</TableHead>
                          <TableHead className="w-24 sm:w-32 text-right text-xs sm:text-sm">Rate</TableHead>
                          <TableHead className="w-24 sm:w-32 text-right text-xs sm:text-sm">Amount</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {section.items.map((item, itemIndex) => (
                          <TableRow key={itemIndex}>
                            <TableCell className="font-mono text-xs">{item.item_number}</TableCell>
                            <TableCell>
                              <div>
                                <span className="text-sm">{item.description}</span>
                                {item.notes && (
                                  <p className="text-xs text-muted-foreground mt-1">{item.notes}</p>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="text-xs">{item.unit}</TableCell>
                            <TableCell className="text-right font-mono">{item.quantity}</TableCell>
                            <TableCell className="text-right">
                              <Input
                                type="number"
                                step="0.01"
                                value={item.rate || ""}
                                onChange={(e) => handleRateChange(sectionIndex, itemIndex, e.target.value)}
                                className="w-28 text-right font-mono h-8"
                                placeholder="0.00"
                              />
                            </TableCell>
                            <TableCell className="text-right font-mono">
                              {formatCurrency(item.amount)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}

        {/* Summary */}
        {editableBoq.summary && (
          <div className="border rounded-lg p-4 space-y-2">
            <h4 className="font-semibold flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              Summary
            </h4>
            <Separator />
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono">{formatCurrency(editableBoq.summary.subtotal)}</span>
              </div>
              {editableBoq.summary.contingency_percent > 0 && (
                <div className="flex justify-between text-muted-foreground">
                  <span>Contingency ({editableBoq.summary.contingency_percent}%)</span>
                  <span className="font-mono">{formatCurrency(editableBoq.summary.contingency_amount)}</span>
                </div>
              )}
              <div className="flex justify-between text-muted-foreground">
                <span>VAT ({editableBoq.summary.vat_percent}%)</span>
                <span className="font-mono">{formatCurrency(editableBoq.summary.vat_amount)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold text-lg">
                <span>Total (Incl. VAT)</span>
                <span className="font-mono text-primary">{formatCurrency(editableBoq.summary.total_inclusive)}</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
