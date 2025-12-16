"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Calculator,
  TrendingUp,
  DollarSign,
  Download,
  RefreshCw,
  FileSpreadsheet,
  AlertCircle,
  CheckCircle2,
  Loader2,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { formatZAR } from "@/lib/utils/currency"

interface BOQItem {
  item_no: string
  description: string
  unit: string
  quantity: number
  unit_rate: number
  amount: number
  notes?: string
  category: string
}

interface BOQData {
  boq_items: BOQItem[]
  subtotal: number
  contingency_percent: number
  contingency_amount: number
  profit_margin_percent: number
  profit_amount: number
  vat_percent: number
  vat_amount: number
  total_amount: number
  pricing_strategy: any
  direct_costs: any
  indirect_costs: any
  break_even_analysis: any
  cash_flow_projection: any
  profitability_analysis: any
}

interface BOQManagerProps {
  tenderId: string
  tenderType: "custom" | "scraped"
  tenderTitle: string
  tenderDescription?: string
  analysisData?: any
  projectPlan?: any
}

export function BOQManager({
  tenderId,
  tenderType,
  tenderTitle,
  tenderDescription,
  analysisData,
  projectPlan,
}: BOQManagerProps) {
  const [boq, setBoq] = useState<BOQData | null>(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    loadBoq()
  }, [tenderId])

  const loadBoq = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/strategist/boq?tenderId=${tenderId}&tenderType=${tenderType}`)
      if (response.ok) {
        const { boq: boqData } = await response.json()
        if (boqData) {
          setBoq(boqData)
        }
      }
    } catch (error) {
      console.error("[BOQManager] Error loading BOQ:", error)
    } finally {
      setLoading(false)
    }
  }

  const generateBoq = async () => {
    try {
      setGenerating(true)
      toast({
        title: "Generating BOQ",
        description: "AI is creating your detailed Bill of Quantities...",
      })

      const response = await fetch("/api/strategist/boq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tenderId,
          tenderType,
          tenderTitle,
          tenderDescription,
          analysisData,
          projectPlan,
        }),
      })

      if (!response.ok) throw new Error("Failed to generate BOQ")

      const { boq: boqData } = await response.json()
      setBoq(boqData)

      toast({
        title: "BOQ Generated",
        description: "Your Bill of Quantities has been created successfully",
      })
    } catch (error) {
      console.error("[BOQManager] Error generating BOQ:", error)
      toast({
        title: "Error",
        description: "Failed to generate BOQ",
        variant: "destructive",
      })
    } finally {
      setGenerating(false)
    }
  }

  const exportToExcel = () => {
    if (!boq) return

    // Create CSV content
    let csv = "Item No,Description,Unit,Quantity,Unit Rate (ZAR),Amount (ZAR),Category,Notes\n"

    boq.boq_items.forEach((item) => {
      csv += `"${item.item_no}","${item.description}","${item.unit}",${item.quantity},${item.unit_rate},${item.amount},"${item.category}","${item.notes || ""}"\n`
    })

    csv += `\n,,,,,,,\n`
    csv += `,,,,Subtotal,${boq.subtotal},,\n`
    csv += `,,,,Contingency (${boq.contingency_percent}%),${boq.contingency_amount},,\n`
    csv += `,,,,Profit Margin (${boq.profit_margin_percent}%),${boq.profit_amount},,\n`
    csv += `,,,,VAT (${boq.vat_percent}%),${boq.vat_amount},,\n`
    csv += `,,,,TOTAL,${boq.total_amount},,\n`

    // Download
    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `boq_${tenderId}.csv`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)

    toast({
      title: "Exported",
      description: "BOQ has been exported to CSV",
    })
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">Loading financial plan...</p>
        </CardContent>
      </Card>
    )
  }

  if (!boq) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Financial Planning & BOQ
          </CardTitle>
          <CardDescription>
            Generate a detailed Bill of Quantities, pricing strategy, and financial analysis
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              No BOQ exists yet. Generate one to get detailed cost breakdowns, pricing strategy, cash flow projections,
              and profitability analysis.
            </AlertDescription>
          </Alert>
          <Button onClick={generateBoq} disabled={generating} className="w-full">
            {generating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Generate BOQ & Financial Plan
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Financial Planning & BOQ
              </CardTitle>
              <CardDescription>Comprehensive cost analysis and pricing strategy</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={exportToExcel}>
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </Button>
              <Button variant="outline" size="sm" onClick={generateBoq} disabled={generating}>
                {generating ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="mr-2 h-4 w-4" />
                )}
                Regenerate
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="boq" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="boq">BOQ</TabsTrigger>
          <TabsTrigger value="pricing">Pricing Strategy</TabsTrigger>
          <TabsTrigger value="costs">Cost Breakdown</TabsTrigger>
          <TabsTrigger value="cashflow">Cash Flow</TabsTrigger>
          <TabsTrigger value="profitability">Profitability</TabsTrigger>
        </TabsList>

        <TabsContent value="boq" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Bill of Quantities</CardTitle>
              <CardDescription>{boq.boq_items.length} line items</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px]">Item No</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-right">Unit</TableHead>
                      <TableHead className="text-right">Qty</TableHead>
                      <TableHead className="text-right">Rate</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {boq.boq_items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{item.item_no}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{item.description}</div>
                            {item.notes && <div className="text-xs text-muted-foreground mt-1">{item.notes}</div>}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{item.category}</Badge>
                        </TableCell>
                        <TableCell className="text-right">{item.unit}</TableCell>
                        <TableCell className="text-right">{item.quantity}</TableCell>
                        <TableCell className="text-right">{formatZAR(item.unit_rate)}</TableCell>
                        <TableCell className="text-right font-medium">{formatZAR(item.amount)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <Separator className="my-6" />

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Subtotal</span>
                  <span className="text-lg font-semibold">{formatZAR(boq.subtotal)}</span>
                </div>
                <div className="flex justify-between items-center text-muted-foreground">
                  <span className="text-sm">Contingency ({boq.contingency_percent}%)</span>
                  <span className="text-sm">{formatZAR(boq.contingency_amount)}</span>
                </div>
                <div className="flex justify-between items-center text-muted-foreground">
                  <span className="text-sm">Profit Margin ({boq.profit_margin_percent}%)</span>
                  <span className="text-sm">{formatZAR(boq.profit_amount)}</span>
                </div>
                <div className="flex justify-between items-center text-muted-foreground">
                  <span className="text-sm">VAT ({boq.vat_percent}%)</span>
                  <span className="text-sm">{formatZAR(boq.vat_amount)}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold">Total Tender Price</span>
                  <span className="text-2xl font-bold text-primary">{formatZAR(boq.total_amount)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pricing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pricing Strategy</CardTitle>
              <CardDescription>Strategic approach to tender pricing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label className="text-muted-foreground">Strategy Type</Label>
                  <p className="text-lg font-semibold capitalize mt-1">
                    {boq.pricing_strategy.strategy_type?.replace("_", " ")}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Risk Premium</Label>
                  <p className="text-lg font-semibold mt-1">{boq.pricing_strategy.risk_premium_percent}%</p>
                </div>
                {boq.pricing_strategy.discount_offered_percent && (
                  <div>
                    <Label className="text-muted-foreground">Discount Offered</Label>
                    <p className="text-lg font-semibold text-green-600 mt-1">
                      {boq.pricing_strategy.discount_offered_percent}%
                    </p>
                  </div>
                )}
                <div>
                  <Label className="text-muted-foreground">Payment Terms</Label>
                  <p className="text-lg font-semibold mt-1">{boq.pricing_strategy.payment_terms}</p>
                </div>
              </div>

              <Separator />

              <div>
                <Label className="text-muted-foreground">Competitive Analysis</Label>
                <p className="mt-2 text-sm leading-relaxed">{boq.pricing_strategy.competitive_analysis}</p>
              </div>

              <div>
                <Label className="text-muted-foreground">Pricing Rationale</Label>
                <p className="mt-2 text-sm leading-relaxed">{boq.pricing_strategy.pricing_rationale}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="costs" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Direct Costs</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Labor</span>
                  <span className="font-medium">{formatZAR(boq.direct_costs.labor)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Materials</span>
                  <span className="font-medium">{formatZAR(boq.direct_costs.materials)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Equipment</span>
                  <span className="font-medium">{formatZAR(boq.direct_costs.equipment)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Subcontractors</span>
                  <span className="font-medium">{formatZAR(boq.direct_costs.subcontractors)}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="font-semibold">Total Direct</span>
                  <span className="font-bold">
                    {formatZAR(
                      boq.direct_costs.labor +
                        boq.direct_costs.materials +
                        boq.direct_costs.equipment +
                        boq.direct_costs.subcontractors,
                    )}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Indirect Costs</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Overhead</span>
                  <span className="font-medium">{formatZAR(boq.indirect_costs.overhead)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Admin</span>
                  <span className="font-medium">{formatZAR(boq.indirect_costs.admin)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Transport</span>
                  <span className="font-medium">{formatZAR(boq.indirect_costs.transport)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Insurance</span>
                  <span className="font-medium">{formatZAR(boq.indirect_costs.insurance)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Certifications</span>
                  <span className="font-medium">{formatZAR(boq.indirect_costs.certifications)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Compliance</span>
                  <span className="font-medium">{formatZAR(boq.indirect_costs.compliance)}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="font-semibold">Total Indirect</span>
                  <span className="font-bold">
                    {formatZAR(
                      boq.indirect_costs.overhead +
                        boq.indirect_costs.admin +
                        boq.indirect_costs.transport +
                        boq.indirect_costs.insurance +
                        boq.indirect_costs.certifications +
                        boq.indirect_costs.compliance,
                    )}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Break-Even Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <Label className="text-muted-foreground">Break-Even Value</Label>
                  <p className="text-2xl font-bold text-amber-600 mt-1">
                    {formatZAR(boq.break_even_analysis.break_even_value)}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Break-Even Timeline</Label>
                  <p className="text-lg font-semibold mt-1">{boq.break_even_analysis.break_even_timeline}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Profitability Threshold</Label>
                  <p className="text-sm mt-1">{boq.break_even_analysis.profitability_threshold}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cashflow" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cash Flow Projection</CardTitle>
              <CardDescription>Monthly cash flow for project duration</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Month</TableHead>
                      <TableHead className="text-right">Inflow</TableHead>
                      <TableHead className="text-right">Outflow</TableHead>
                      <TableHead className="text-right">Net Cash Flow</TableHead>
                      <TableHead className="text-right">Cumulative</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {boq.cash_flow_projection.months.map((month: any) => (
                      <TableRow key={month.month}>
                        <TableCell className="font-medium">Month {month.month}</TableCell>
                        <TableCell className="text-right text-green-600">{formatZAR(month.inflow)}</TableCell>
                        <TableCell className="text-right text-red-600">{formatZAR(month.outflow)}</TableCell>
                        <TableCell
                          className={`text-right font-medium ${month.net_cash_flow >= 0 ? "text-green-600" : "text-red-600"}`}
                        >
                          {formatZAR(month.net_cash_flow)}
                        </TableCell>
                        <TableCell
                          className={`text-right font-semibold ${month.cumulative_cash_flow >= 0 ? "text-green-600" : "text-red-600"}`}
                        >
                          {formatZAR(month.cumulative_cash_flow)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profitability" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Profitability Analysis</CardTitle>
              <CardDescription>Financial performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <div className="flex flex-col items-center justify-center p-6 rounded-lg border bg-muted/50">
                  <TrendingUp className="h-8 w-8 text-green-600 mb-2" />
                  <p className="text-xs text-muted-foreground mb-1">Gross Profit Margin</p>
                  <p className="text-3xl font-bold text-green-600">
                    {boq.profitability_analysis.gross_profit_margin.toFixed(1)}%
                  </p>
                </div>
                <div className="flex flex-col items-center justify-center p-6 rounded-lg border bg-muted/50">
                  <DollarSign className="h-8 w-8 text-blue-600 mb-2" />
                  <p className="text-xs text-muted-foreground mb-1">Net Profit Margin</p>
                  <p className="text-3xl font-bold text-blue-600">
                    {boq.profitability_analysis.net_profit_margin.toFixed(1)}%
                  </p>
                </div>
                <div className="flex flex-col items-center justify-center p-6 rounded-lg border bg-muted/50">
                  <CheckCircle2 className="h-8 w-8 text-purple-600 mb-2" />
                  <p className="text-xs text-muted-foreground mb-1">ROI</p>
                  <p className="text-3xl font-bold text-purple-600">
                    {boq.profitability_analysis.return_on_investment.toFixed(1)}%
                  </p>
                </div>
                <div className="flex flex-col items-center justify-center p-6 rounded-lg border bg-muted/50">
                  <FileSpreadsheet className="h-8 w-8 text-amber-600 mb-2" />
                  <p className="text-xs text-muted-foreground mb-1">Payback Period</p>
                  <p className="text-3xl font-bold text-amber-600">
                    {boq.profitability_analysis.payback_period_months} mo
                  </p>
                </div>
              </div>

              <Alert className="mt-6">
                <CheckCircle2 className="h-4 w-4" />
                <AlertDescription>
                  This tender shows{" "}
                  {boq.profitability_analysis.net_profit_margin >= 15
                    ? "strong"
                    : boq.profitability_analysis.net_profit_margin >= 10
                      ? "moderate"
                      : "low"}{" "}
                  profitability with a {boq.profitability_analysis.return_on_investment.toFixed(1)}% return on
                  investment. Payback period is {boq.profitability_analysis.payback_period_months} months.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
