import "server-only"

import Stripe from "stripe"

let stripeInstance: Stripe | null = null

export const stripe = new Proxy({} as Stripe, {
  get(target, prop) {
    // Initialize Stripe only when actually accessed
    if (!stripeInstance) {
      if (!process.env.STRIPE_SECRET_KEY) {
        throw new Error("STRIPE_SECRET_KEY is not set in environment variables")
      }
      stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: "2025-09-30.clover",
        typescript: true,
      })
    }
    return stripeInstance[prop as keyof Stripe]
  },
})
