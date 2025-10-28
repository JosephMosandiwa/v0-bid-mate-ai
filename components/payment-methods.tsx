"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CreditCard, Loader2, Plus } from "lucide-react"
import { createCustomerPortalSession } from "@/app/actions/stripe"

interface PaymentMethod {
  id: string
  brand?: string
  last4?: string
  exp_month?: number
  exp_year?: number
  is_default: boolean
}

export function PaymentMethods() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [loading, setLoading] = useState(true)
  const [redirecting, setRedirecting] = useState(false)

  useEffect(() => {
    async function fetchPaymentMethods() {
      try {
        const response = await fetch("/api/payment-methods")
        const data = await response.json()
        setPaymentMethods(data.paymentMethods || [])
      } catch (error) {
        console.error("[v0] Failed to fetch payment methods:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchPaymentMethods()
  }, [])

  const handleManagePaymentMethods = async () => {
    setRedirecting(true)
    try {
      const portalUrl = await createCustomerPortalSession()
      window.location.href = portalUrl
    } catch (error) {
      console.error("[v0] Failed to open customer portal:", error)
      setRedirecting(false)
    }
  }

  const getBrandIcon = (brand?: string) => {
    const brandLower = brand?.toLowerCase()
    if (brandLower === "visa") return "💳"
    if (brandLower === "mastercard") return "💳"
    if (brandLower === "amex") return "💳"
    return "💳"
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Methods
          </CardTitle>
          <CardDescription>Manage your payment methods</CardDescription>
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
          <CreditCard className="h-5 w-5" />
          Payment Methods
        </CardTitle>
        <CardDescription>Manage your payment methods and billing information</CardDescription>
      </CardHeader>
      <CardContent>
        {paymentMethods.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">No payment methods on file</p>
            <Button onClick={handleManagePaymentMethods} disabled={redirecting}>
              {redirecting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Redirecting...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Payment Method
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="text-2xl">{getBrandIcon(method.brand)}</div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium capitalize">{method.brand || "Card"}</span>
                      <span className="text-muted-foreground">•••• {method.last4}</span>
                      {method.is_default && <Badge variant="secondary">Default</Badge>}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Expires {method.exp_month}/{method.exp_year}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <Button
              onClick={handleManagePaymentMethods}
              variant="outline"
              className="w-full bg-transparent"
              disabled={redirecting}
            >
              {redirecting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Redirecting...
                </>
              ) : (
                "Manage Payment Methods"
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
