import { type NextRequest, NextResponse } from "next/server"
import { payfast } from "@/lib/payfast"
import { createAdminClient } from "@/lib/supabase/admin"

export const dynamic = "force-dynamic"

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const params = new URLSearchParams(body)
    const data: Record<string, string> = {}

    params.forEach((value, key) => {
      data[key] = value
    })

    console.log("[v0] PayFast webhook received:", data)

    // Verify signature
    const signature = data.signature
    delete data.signature

    if (!payfast.verifySignature(data, signature)) {
      console.error("[v0] Invalid PayFast signature")
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    // Validate IP address
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || ""
    const isValidIP = await payfast.validateIPAddress(ip)

    if (!isValidIP) {
      console.error("[v0] Invalid PayFast IP address:", ip)
      return NextResponse.json({ error: "Invalid IP" }, { status: 400 })
    }

    // Process the payment
    const supabase = createAdminClient()
    const paymentId = data.m_payment_id
    const paymentStatus = data.payment_status
    const token = data.token

    // Extract user_id and plan_id from m_payment_id
    const [userId, planId] = paymentId.split("_")

    if (paymentStatus === "COMPLETE") {
      // Update subscription status
      const { error } = await supabase
        .from("subscriptions")
        .update({
          status: "active",
          gateway_subscription_id: token,
          current_period_start: new Date().toISOString(),
          current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        })
        .eq("gateway_subscription_id", paymentId)

      if (error) {
        console.error("[v0] Error updating subscription:", error)
        return NextResponse.json({ error: "Database error" }, { status: 500 })
      }

      console.log("[v0] Subscription activated for user:", userId)
    } else if (paymentStatus === "CANCELLED") {
      // Cancel subscription
      await supabase.from("subscriptions").update({ status: "cancelled" }).eq("gateway_subscription_id", paymentId)

      console.log("[v0] Subscription cancelled for user:", userId)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] PayFast webhook error:", error)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}
