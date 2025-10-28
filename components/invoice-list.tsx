"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, ExternalLink, FileText, Loader2 } from "lucide-react"
import { formatPrice } from "@/lib/products"

interface Invoice {
  id: string
  number: string | null
  amount: number
  currency: string
  status: string | null
  created: number
  invoice_pdf: string | null
  hosted_invoice_url: string | null
  period_start: number
  period_end: number
}

export function InvoiceList() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchInvoices() {
      try {
        const response = await fetch("/api/invoices")
        const data = await response.json()
        setInvoices(data.invoices || [])
      } catch (error) {
        console.error("[v0] Failed to fetch invoices:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchInvoices()
  }, [])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Invoices
          </CardTitle>
          <CardDescription>Your billing history and invoices</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Invoices
        </CardTitle>
        <CardDescription>Your billing history and invoices</CardDescription>
      </CardHeader>
      <CardContent>
        {invoices.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No invoices found</p>
        ) : (
          <div className="space-y-4">
            {invoices.map((invoice) => (
              <div
                key={invoice.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{invoice.number || "Invoice"}</span>
                    <Badge
                      variant={
                        invoice.status === "paid" ? "default" : invoice.status === "open" ? "secondary" : "destructive"
                      }
                    >
                      {invoice.status}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(invoice.created * 1000).toLocaleDateString()} •{" "}
                    {formatPrice(invoice.amount, invoice.currency)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Period: {new Date(invoice.period_start * 1000).toLocaleDateString()} -{" "}
                    {new Date(invoice.period_end * 1000).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {invoice.invoice_pdf && (
                    <Button variant="outline" size="sm" asChild className="bg-transparent">
                      <a href={invoice.invoice_pdf} target="_blank" rel="noopener noreferrer">
                        <Download className="h-4 w-4 mr-2" />
                        PDF
                      </a>
                    </Button>
                  )}
                  {invoice.hosted_invoice_url && (
                    <Button variant="outline" size="sm" asChild className="bg-transparent">
                      <a href={invoice.hosted_invoice_url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
