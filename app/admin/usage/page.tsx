import { Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PricingCalculator } from "@/components/pricing-calculator"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, DollarSign, FileText, Database, TrendingUp } from "lucide-react"
import { AdminNav } from "@/components/admin-nav"

export const dynamic = "force-dynamic"

async function UsageStats() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
    const response = await fetch(`${baseUrl}/api/usage/stats`, {
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error("Failed to fetch usage stats")
    }

    const stats = await response.json()

    const tablesNotSetup =
      stats.aiAnalyses.count === 0 &&
      stats.scraping.count === 0 &&
      stats.storage.totalFiles === 0 &&
      stats.monthlyTotal === 0

    return (
      <>
        {tablesNotSetup && (
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Usage Tracking Not Set Up</AlertTitle>
            <AlertDescription>
              Run script 017 to create the usage tracking tables. Once set up, this dashboard will display your
              infrastructure costs and usage metrics.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription>AI Analyses This Month</CardDescription>
                <FileText className="h-4 w-4 text-blue-500" />
              </div>
              <CardTitle className="text-3xl font-bold">{stats.aiAnalyses.count}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">Total cost: ${stats.aiAnalyses.totalCost.toFixed(2)}</div>
              <div className="text-xs text-muted-foreground mt-1">
                Avg: ${stats.aiAnalyses.avgCostPerAnalysis.toFixed(4)} per analysis
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription>Scraping Requests</CardDescription>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </div>
              <CardTitle className="text-3xl font-bold">{stats.scraping.count}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                Credits used: {stats.scraping.creditsUsed.toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Success rate: {stats.scraping.successRate.toFixed(1)}%
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription>Document Storage</CardDescription>
                <Database className="h-4 w-4 text-purple-500" />
              </div>
              <CardTitle className="text-3xl font-bold">{stats.storage.totalFiles}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">Size: {stats.storage.totalSizeGB.toFixed(2)} GB</div>
              <div className="text-xs text-muted-foreground mt-1">
                Cost: ${stats.storage.estimatedCost.toFixed(2)}/month
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription>Total Monthly Cost</CardDescription>
                <DollarSign className="h-4 w-4 text-orange-500" />
              </div>
              <CardTitle className="text-3xl font-bold">${stats.monthlyTotal.toFixed(2)}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">Approximately R{(stats.monthlyTotal * 18).toFixed(2)}</div>
            </CardContent>
          </Card>
        </div>
      </>
    )
  } catch (error) {
    console.error("[v0] Error in UsageStats component:", error)
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error Loading Usage Stats</AlertTitle>
        <AlertDescription>
          Failed to load usage statistics. Please ensure script 017 has been run to create the necessary database
          tables.
        </AlertDescription>
      </Alert>
    )
  }
}

export default function UsageMonitoringPage() {
  return (
    <div className="min-h-screen bg-background">
      <AdminNav />
      <div className="container mx-auto px-4 py-8 space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Usage Monitoring</h1>
          <p className="text-lg text-muted-foreground">
            Track your infrastructure costs and plan your pricing strategy
          </p>
        </div>

        <Suspense
          fallback={
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-4 w-32 mb-2" />
                    <Skeleton className="h-10 w-20" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-40 mb-2" />
                    <Skeleton className="h-3 w-36" />
                  </CardContent>
                </Card>
              ))}
            </div>
          }
        >
          <UsageStats />
        </Suspense>

        <div className="space-y-4">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Pricing Calculator</h2>
            <p className="text-muted-foreground">
              Calculate your costs and determine optimal pricing for your customers
            </p>
          </div>
          <PricingCalculator />
        </div>
      </div>
    </div>
  )
}
