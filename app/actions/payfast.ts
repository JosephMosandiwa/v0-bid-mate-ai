"use server"

import { payfast } from "@/lib/payfast"
import { createClient } from "@/lib/supabase/server"

export async function createPayFastSubscription(planId: string) {
  const supabase = await createClient()

  // Get current user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    throw new Error("Not authenticated")
  }

  // Get user profile
  const { data: profile } = await supabase.from("profiles").select("full_name").eq("id", user.id).single()

  // Get plan details
  const plans = {
    starter: { name: "Starter Plan", amount: 499 },
    professional: { name: "Professional Plan", amount: 1499 },
    enterprise: { name: "Enterprise Plan", amount: 4999 },
  }

  const plan = plans[planId as keyof typeof plans]
  if (!plan) {
    throw new Error("Invalid plan")
  }

  // Create subscription data
  const subscriptionData = payfast.createSubscriptionData(
    user.id,
    user.email!,
    profile?.full_name || "User",
    planId,
    plan.name,
    plan.amount,
  )

  // Store pending subscription in database
  await supabase.from("subscriptions").insert({
    user_id: user.id,
    plan_id: planId,
    status: "pending",
    payment_gateway: "payfast",
    gateway_subscription_id: subscriptionData.m_payment_id,
  })

  // Return subscription data for form submission
  return subscriptionData
}
