export interface Product {
  id: string
  name: string
  description: string
  priceInCents: number
  currency: string
  features: string[]
  stripePriceId?: string
  popular?: boolean
}

// Product catalog - source of truth for all subscription plans
export const PRODUCTS: Product[] = [
  {
    id: "starter",
    name: "Starter",
    description: "Perfect for small businesses",
    priceInCents: 49900, // R499.00
    currency: "zar",
    features: ["5 tender analyses per month", "Basic AI assistance", "Tender search access", "Email support"],
  },
  {
    id: "professional",
    name: "Professional",
    description: "For growing businesses",
    priceInCents: 149900, // R1,499.00
    currency: "zar",
    popular: true,
    features: [
      "25 tender analyses per month",
      "Advanced AI assistance",
      "Unlimited tender searches",
      "Team collaboration (5 users)",
      "Priority support",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "For large organizations",
    priceInCents: 0, // Custom pricing
    currency: "zar",
    features: [
      "Unlimited tender analyses",
      "Custom AI training",
      "Unlimited users",
      "Dedicated account manager",
      "24/7 phone support",
    ],
  },
]

export function getProduct(productId: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === productId)
}

export function formatPrice(priceInCents: number, currency = "zar"): string {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(priceInCents / 100)
}
