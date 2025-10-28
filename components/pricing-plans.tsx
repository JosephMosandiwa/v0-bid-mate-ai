"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Loader2 } from "lucide-react"
import { PRODUCTS, formatPrice } from "@/lib/products"
import { createCheckoutSession } from "@/app/actions/stripe"
import { useRouter } from "next/navigation"

interface PricingPlansProps {
  currentPlan?: string
  showCurrentPlan?: boolean
}

export function PricingPlans({ currentPlan, showCurrentPlan = false }: PricingPlansProps) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)

  const handleSubscribe = async (productId: string) => {
    if (productId === "enterprise") {
      router.push("/contact")
      return
    }

    setLoading(productId)
    try {
      const checkoutUrl = await createCheckoutSession(productId)
      window.location.href = checkoutUrl
    } catch (error) {
      console.error("[v0] Failed to create checkout session:", error)
      alert("Failed to start checkout. Please try again.")
      setLoading(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-6">
        {PRODUCTS.map((product) => {
          const isCurrentPlan = showCurrentPlan && currentPlan === product.id
          const isEnterprise = product.id === "enterprise"

          return (
            <Card
              key={product.id}
              className={`relative ${product.popular ? "border-primary border-2" : "border-border"}`}
            >
              {product.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                  Most Popular
                </div>
              )}
              {isCurrentPlan && (
                <div className="absolute -top-3 right-4 px-3 py-1 bg-green-500 text-white text-xs font-medium rounded-full">
                  Current Plan
                </div>
              )}
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {product.name}
                  {product.popular && <Badge variant="secondary">Popular</Badge>}
                </CardTitle>
                <CardDescription>{product.description}</CardDescription>
                <div className="mt-4">
                  {isEnterprise ? (
                    <span className="text-4xl font-bold text-foreground">Custom</span>
                  ) : (
                    <>
                      <span className="text-4xl font-bold text-foreground">{formatPrice(product.priceInCents)}</span>
                      <span className="text-muted-foreground">/month</span>
                    </>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className={`w-full ${product.popular ? "" : "bg-transparent"}`}
                  variant={product.popular ? "default" : "outline"}
                  onClick={() => handleSubscribe(product.id)}
                  disabled={loading === product.id || isCurrentPlan}
                >
                  {loading === product.id ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Loading...
                    </>
                  ) : isCurrentPlan ? (
                    "Current Plan"
                  ) : isEnterprise ? (
                    "Contact Sales"
                  ) : (
                    "Subscribe with Stripe"
                  )}
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
