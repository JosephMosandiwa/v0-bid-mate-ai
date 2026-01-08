import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CreditCard, TrendingUp, Calendar, ExternalLink } from "lucide-react"
import { PricingPlans } from "@/components/pricing-plans"
import { InvoiceList } from "@/components/invoice-list"
import { PaymentMethods } from "@/components/payment-methods"
import { createCustomerPortalSession } from "@/app/actions/stripe"

export const dynamic = "force-dynamic"

async function getUserSubscription() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  const { data: subscription } = await supabase.from("subscriptions").select("*").eq("user_id", user.id).single()

  return { user, profile, subscription }
}

export default async function BillingPage() {
  const { profile, subscription } = await getUserSubscription()

  const usagePercentage = profile?.analyses_limit
    ? (profile.analyses_used_this_month / profile.analyses_limit) * 100
    : 0

  const daysUntilRenewal = subscription?.current_period_end
    ? Math.ceil((new Date(subscription.current_period_end).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : 0

  async function handleManageSubscription() {
    "use server"
    const portalUrl = await createCustomerPortalSession()
    redirect(portalUrl)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Billing & Subscription</h1>
        <p className="text-muted-foreground">Manage your subscription and billing information</p>
      </div>

      {/* Current Plan Overview */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-l-4 border-l-primary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Plan</CardTitle>
            <CreditCard className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">{profile?.subscription_plan || "Starter"}</div>
            <p className="text-xs text-muted-foreground mt-1">
              <Badge
                variant={
                  profile?.subscription_status === "active"
                    ? "default"
                    : profile?.subscription_status === "trialing"
                      ? "secondary"
                      : "destructive"
                }
                className="mt-2"
              >
                {profile?.subscription_status || "Active"}
              </Badge>
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usage This Month</CardTitle>
            <TrendingUp className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {profile?.analyses_used_this_month || 0} / {profile?.analyses_limit || 5}
            </div>
            <Progress value={usagePercentage} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">Tender analyses used</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Billing Date</CardTitle>
            <Calendar className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {subscription?.current_period_end
                ? new Date(subscription.current_period_end).toLocaleDateString()
                : "N/A"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {daysUntilRenewal > 0 ? `${daysUntilRenewal} days remaining` : "No active subscription"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Subscription Management */}
      {subscription && (
        <Card>
          <CardHeader>
            <CardTitle>Subscription Management</CardTitle>
            <CardDescription>Manage your payment methods, invoices, and subscription settings</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={handleManageSubscription as any}>
              <Button type="submit" variant="outline" className="bg-transparent">
                <ExternalLink className="h-4 w-4 mr-2" />
                Manage Subscription
              </Button>
            </form>
            <p className="text-sm text-muted-foreground mt-4">
              You'll be redirected to our secure billing portal where you can update payment methods, view invoices, and
              manage your subscription.
            </p>
          </CardContent>
        </Card>
      )}

      <PaymentMethods />

      <InvoiceList />

      {/* Upgrade/Change Plan */}
      <div>
        <h2 className="text-2xl font-bold mb-4">
          {subscription ? "Change Your Plan" : "Choose a Plan to Get Started"}
        </h2>
        <PricingPlans currentPlan={profile?.subscription_plan} showCurrentPlan={true} />
      </div>

      {/* Usage Details */}
      <Card>
        <CardHeader>
          <CardTitle>Usage Details</CardTitle>
          <CardDescription>Detailed breakdown of your current usage</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Tender Analyses</span>
              <span className="text-sm font-medium">
                {profile?.analyses_used_this_month || 0} / {profile?.analyses_limit || 5}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Tender Searches</span>
              <span className="text-sm font-medium">Unlimited</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Team Members</span>
              <span className="text-sm font-medium">
                {profile?.subscription_plan === "professional" ? "5 users" : "1 user"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Support Level</span>
              <span className="text-sm font-medium">
                {profile?.subscription_plan === "professional" ? "Priority" : "Email"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
