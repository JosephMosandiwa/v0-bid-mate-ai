import { type NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { createAdminClient } from "@/lib/supabase/admin"
import type Stripe from "stripe"

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get("stripe-signature")!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err: any) {
    console.error(`[v0] Webhook signature verification failed:`, err.message)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  const supabase = createAdminClient()

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.metadata?.user_id
        const planId = session.metadata?.plan_id

        if (!userId || !planId) {
          console.error("[v0] Missing metadata in checkout session")
          break
        }

        // Get subscription details
        const subscription = await stripe.subscriptions.retrieve(session.subscription as string)

        // Create or update subscription record
        await supabase.from("subscriptions").upsert({
          user_id: userId,
          stripe_customer_id: session.customer as string,
          stripe_subscription_id: subscription.id,
          stripe_price_id: (subscription as any).items?.data?.[0]?.price?.id,
          plan_id: planId,
          status: subscription.status,
          current_period_start: new Date((subscription as any).current_period_start * 1000).toISOString(),
          current_period_end: new Date((subscription as any).current_period_end * 1000).toISOString(),
          cancel_at_period_end: subscription.cancel_at_period_end,
        })

        // Update user profile
        const analysesLimit = planId === "starter" ? 5 : planId === "professional" ? 25 : 999999
        await supabase
          .from("profiles")
          .update({
            subscription_plan: planId,
            subscription_status: subscription.status,
            analyses_limit: analysesLimit,
          })
          .eq("id", userId)

        console.log(`[v0] Subscription created for user ${userId}`)
        break
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription
        const userId = subscription.metadata?.user_id

        await supabase
          .from("subscriptions")
          .update({
            status: subscription.status,
            current_period_start: new Date((subscription as any).current_period_start * 1000).toISOString(),
            current_period_end: new Date((subscription as any).current_period_end * 1000).toISOString(),
            cancel_at_period_end: subscription.cancel_at_period_end,
          })
          .eq("stripe_subscription_id", subscription.id)

        if (userId) {
          await supabase
            .from("profiles")
            .update({
              subscription_status: subscription.status,
            })
            .eq("id", userId)
        }

        console.log(`[v0] Subscription updated: ${subscription.id}`)
        break
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription
        const userId = subscription.metadata?.user_id

        await supabase
          .from("subscriptions")
          .update({
            status: "canceled",
          })
          .eq("stripe_subscription_id", subscription.id)

        if (userId) {
          await supabase
            .from("profiles")
            .update({
              subscription_status: "canceled",
              subscription_plan: "starter",
              analyses_limit: 5,
            })
            .eq("id", userId)
        }

        console.log(`[v0] Subscription canceled: ${subscription.id}`)
        break
      }

      default:
        console.log(`[v0] Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("[v0] Error processing webhook:", error)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}
