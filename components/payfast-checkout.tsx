"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { createPayFastSubscription } from "@/app/actions/payfast"
import { Loader2 } from "lucide-react"

interface PayFastCheckoutProps {
  planId: string
  planName: string
  amount: number
}

export function PayFastCheckout({ planId, planName, amount }: PayFastCheckoutProps) {
  const [loading, setLoading] = useState(false)

  const handleCheckout = async () => {
    try {
      setLoading(true)
      const subscriptionData = await createPayFastSubscription(planId)

      // Create a form and submit it to PayFast
      const form = document.createElement("form")
      form.method = "POST"
      form.action = "https://sandbox.payfast.co.za/eng/process"

      Object.entries(subscriptionData).forEach(([key, value]) => {
        const input = document.createElement("input")
        input.type = "hidden"
        input.name = key
        input.value = value
        form.appendChild(input)
      })

      document.body.appendChild(form)
      form.submit()
    } catch (error) {
      console.error("PayFast checkout error:", error)
      setLoading(false)
    }
  }

  return (
    <Button onClick={handleCheckout} disabled={loading} className="w-full">
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : (
        `Pay with PayFast (R${amount})`
      )}
    </Button>
  )
}
