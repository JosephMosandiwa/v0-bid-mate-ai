import { Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PricingCalculator } from "@/components/pricing-calculator"
import { Skeleton } from "@/components/ui/skeleton"

async function UsageStats() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/usage/stats`, {
    cache: "no-store",
  })

  if (!response.ok) {
    return <div className="text-destructive">Failed to load usage stats</div>
  }

  const stats = await response.json()

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="pb-3">
          <CardDescription>AI Analyses This Month</CardDescription>
          <CardTitle className="text-3xl">{stats.aiAnalyses.count}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">Total cost: ${stats.aiAnalyses.totalCost.toFixed(2)}</div>
          <div className="text-sm text-muted-foreground">
            Avg: ${stats.aiAnalyses.avgCostPerAnalysis.toFixed(4)} per analysis
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardDescription>Scraping Requests</CardDescription>
          <CardTitle className="text-3xl">{stats.scraping.count}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            Credits used: {stats.scraping.creditsUsed.toLocaleString()}
          </div>
          <div className="text-sm text-muted-foreground">Success rate: {stats.scraping.successRate.toFixed(1)}%</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardDescription>Document Storage</CardDescription>
          <CardTitle className="text-3xl">{stats.storage.totalFiles}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">Size: {stats.storage.totalSizeGB.toFixed(2)} GB</div>
          <div className="text-sm text-muted-foreground">Cost: ${stats.storage.estimatedCost.toFixed(2)}/month</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardDescription>Total Monthly Cost</CardDescription>
          <CardTitle className="text-3xl">${stats.monthlyTotal.toFixed(2)}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">Approximately R{(stats.monthlyTotal * 18).toFixed(2)}</div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function UsageMonitoringPage() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Usage Monitoring</h1>
        <p className="text-muted-foreground">Track your infrastructure costs and plan your pricing</p>
      </div>

      <Suspense
        fallback={
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-16" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-32" />
                </CardContent>
              </Card>
            ))}
          </div>
        }
      >
        <UsageStats />
      </Suspense>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Pricing Calculator</h2>
        <PricingCalculator />
      </div>
    </div>
  )
}
