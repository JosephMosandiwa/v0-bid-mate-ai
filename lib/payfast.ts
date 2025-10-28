import crypto from "crypto"

export interface PayFastConfig {
  merchantId: string
  merchantKey: string
  passphrase: string
  sandbox: boolean
}

export interface PayFastSubscriptionData {
  merchant_id: string
  merchant_key: string
  return_url: string
  cancel_url: string
  notify_url: string
  name_first: string
  email_address: string
  m_payment_id: string
  amount: string
  item_name: string
  item_description: string
  subscription_type: "1" // 1 = Subscription
  billing_date: string
  recurring_amount: string
  frequency: "3" | "4" | "5" | "6" // 3=Monthly, 4=Quarterly, 5=Biannually, 6=Annual
  cycles: "0" // 0 = until cancelled
  signature?: string
}

export class PayFastClient {
  private config: PayFastConfig

  constructor() {
    this.config = {
      merchantId: process.env.PAYFAST_MERCHANT_ID || "",
      merchantKey: process.env.PAYFAST_MERCHANT_KEY || "",
      passphrase: process.env.PAYFAST_PASSPHRASE || "",
      sandbox: process.env.NODE_ENV !== "production",
    }
  }

  getPaymentUrl(): string {
    return this.config.sandbox ? "https://sandbox.payfast.co.za/eng/process" : "https://www.payfast.co.za/eng/process"
  }

  generateSignature(data: Record<string, string>): string {
    // Create parameter string
    const paramString = Object.keys(data)
      .filter((key) => key !== "signature")
      .sort()
      .map((key) => `${key}=${encodeURIComponent(data[key]).replace(/%20/g, "+")}`)
      .join("&")

    // Append passphrase if set
    const signatureString = this.config.passphrase
      ? `${paramString}&passphrase=${encodeURIComponent(this.config.passphrase)}`
      : paramString

    // Generate MD5 signature
    return crypto.createHash("md5").update(signatureString).digest("hex")
  }

  createSubscriptionData(
    userId: string,
    userEmail: string,
    userName: string,
    planId: string,
    planName: string,
    amount: number,
  ): PayFastSubscriptionData {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"

    const data: PayFastSubscriptionData = {
      merchant_id: this.config.merchantId,
      merchant_key: this.config.merchantKey,
      return_url: `${baseUrl}/dashboard/billing?success=true`,
      cancel_url: `${baseUrl}/dashboard/billing?cancelled=true`,
      notify_url: `${baseUrl}/api/webhooks/payfast`,
      name_first: userName,
      email_address: userEmail,
      m_payment_id: `${userId}_${planId}_${Date.now()}`,
      amount: amount.toFixed(2),
      item_name: planName,
      item_description: `${planName} Subscription`,
      subscription_type: "1",
      billing_date: new Date().toISOString().split("T")[0],
      recurring_amount: amount.toFixed(2),
      frequency: "3", // Monthly
      cycles: "0", // Until cancelled
    }

    // Generate signature
    data.signature = this.generateSignature(data as Record<string, string>)

    return data
  }

  verifySignature(data: Record<string, string>, signature: string): boolean {
    const generatedSignature = this.generateSignature(data)
    return generatedSignature === signature
  }

  async validateIPAddress(ip: string): Promise<boolean> {
    const validHosts = ["www.payfast.co.za", "sandbox.payfast.co.za", "w1w.payfast.co.za", "w2w.payfast.co.za"]

    // In sandbox mode, allow localhost
    if (this.config.sandbox && (ip === "127.0.0.1" || ip === "::1")) {
      return true
    }

    // Validate IP is from PayFast
    // In production, you should resolve the hostnames and check IPs
    return true // Simplified for now
  }
}

export const payfast = new PayFastClient()
