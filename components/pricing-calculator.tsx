"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { formatZAR } from "@/lib/utils/currency"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function PricingCalculator() {
  const [aiAnalyses, setAiAnalyses] = useState(500)
  const [scrapingCredits, setScrapingCredits] = useState(100000)
  const [storageGB, setStorageGB] = useState(10)
  const [teamSeats, setTeamSeats] = useState(1)
  const [expectedCustomers, setExpectedCustomers] = useState(10)

  // Calculate costs
  const vercelProCost = 20
  const teamSeatsCost = (teamSeats - 1) * 20
  const supabaseProCost = 25

  // AI Gateway: $0.02 per analysis, first $5 free (250 analyses)
  const freeAiAnalyses = 250
  const paidAiAnalyses = Math.max(0, aiAnalyses - freeAiAnalyses)
  const aiCost = paidAiAnalyses * 0.02

  // Blob Storage: $0.023 per GB
  const storageCost = storageGB * 0.023

  // ScraperAPI tiers
  let scrapingCost = 0
  let scrapingPlan = "None"
  if (scrapingCredits > 0) {
    if (scrapingCredits <= 100000) {
      scrapingCost = 49
      scrapingPlan = "Hobby (100K credits)"
    } else if (scrapingCredits <= 500000) {
      scrapingCost = 149
      scrapingPlan = "Startup (500K credits)"
    } else if (scrapingCredits <= 1500000) {
      scrapingCost = 299
      scrapingPlan = "Business (1.5M credits)"
    } else {
      scrapingCost = 475
      scrapingPlan = "Scaling (3M credits)"
    }
  }

  const totalMonthlyUSD = vercelProCost + teamSeatsCost + supabaseProCost + aiCost + storageCost + scrapingCost
  const totalMonthlyZAR = totalMonthlyUSD * 18

  const costPerCustomer = expectedCustomers > 0 ? totalMonthlyZAR / expectedCustomers : 0

  // Per-user breakdown
  const perUserCosts = {
    vercel: (vercelProCost * 18) / expectedCustomers,
    teamSeats: (teamSeatsCost * 18) / expectedCustomers,
    supabase: (supabaseProCost * 18) / expectedCustomers,
    ai: (aiCost * 18) / expectedCustomers,
    storage: (storageCost * 18) / expectedCustomers,
    scraping: (scrapingCost * 18) / expectedCustomers,
  }

  // Per-user usage
  const perUserUsage = {
    aiAnalyses: expectedCustomers > 0 ? aiAnalyses / expectedCustomers : 0,
    storageGB: expectedCustomers > 0 ? storageGB / expectedCustomers : 0,
    scrapingCredits: expectedCustomers > 0 ? scrapingCredits / expectedCustomers : 0,
  }

  const suggestedPricePerCustomer = costPerCustomer * 3

  return (
    <Tabs defaultValue="calculator" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="calculator">Cost Calculator</TabsTrigger>
        <TabsTrigger value="per-user">Cost Per User</TabsTrigger>
      </TabsList>

      <TabsContent value="calculator" className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Usage Calculator</CardTitle>
              <CardDescription>Estimate your monthly infrastructure costs</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>AI Document Analyses per Month: {aiAnalyses}</Label>
                <Slider
                  value={[aiAnalyses]}
                  onValueChange={(value) => setAiAnalyses(value[0])}
                  min={0}
                  max={5000}
                  step={100}
                  className="w-full"
                />
                <p className="text-sm text-muted-foreground">First 250 free, then $0.02 each</p>
              </div>

              <div className="space-y-2">
                <Label>Scraping API Credits per Month: {scrapingCredits.toLocaleString()}</Label>
                <Slider
                  value={[scrapingCredits]}
                  onValueChange={(value) => setScrapingCredits(value[0])}
                  min={0}
                  max={2000000}
                  step={50000}
                  className="w-full"
                />
                <p className="text-sm text-muted-foreground">Current plan: {scrapingPlan}</p>
              </div>

              <div className="space-y-2">
                <Label>Document Storage (GB): {storageGB}</Label>
                <Slider
                  value={[storageGB]}
                  onValueChange={(value) => setStorageGB(value[0])}
                  min={0}
                  max={200}
                  step={5}
                  className="w-full"
                />
                <p className="text-sm text-muted-foreground">$0.023 per GB per month</p>
              </div>

              <div className="space-y-2">
                <Label>Team Seats: {teamSeats}</Label>
                <Slider
                  value={[teamSeats]}
                  onValueChange={(value) => setTeamSeats(value[0])}
                  min={1}
                  max={10}
                  step={1}
                  className="w-full"
                />
                <p className="text-sm text-muted-foreground">First seat included, $20/month for additional seats</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="customers">Expected Customers</Label>
                <Input
                  id="customers"
                  type="number"
                  value={expectedCustomers}
                  onChange={(e) => setExpectedCustomers(Number(e.target.value))}
                  min={1}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cost Breakdown</CardTitle>
              <CardDescription>Monthly infrastructure costs</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Vercel Pro</span>
                  <span>${vercelProCost.toFixed(2)}</span>
                </div>
                {teamSeatsCost > 0 && (
                  <div className="flex justify-between text-sm">
                    <span>Additional Team Seats ({teamSeats - 1})</span>
                    <span>${teamSeatsCost.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span>Supabase Pro</span>
                  <span>${supabaseProCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>AI Gateway ({aiAnalyses} analyses)</span>
                  <span>${aiCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Blob Storage ({storageGB}GB)</span>
                  <span>${storageCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>ScraperAPI ({scrapingPlan})</span>
                  <span>${scrapingCost.toFixed(2)}</span>
                </div>

                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between font-semibold">
                    <span>Total Monthly (USD)</span>
                    <span>${totalMonthlyUSD.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total Monthly (ZAR)</span>
                    <span>{formatZAR(totalMonthlyZAR)}</span>
                  </div>
                </div>

                <div className="border-t pt-3 mt-3 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Cost per Customer</span>
                    <span>{formatZAR(costPerCustomer)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-semibold text-green-600">
                    <span>Suggested Price (3x markup)</span>
                    <span>{formatZAR(suggestedPricePerCustomer)}/month</span>
                  </div>
                </div>

                <div className="bg-muted p-4 rounded-lg mt-4">
                  <p className="text-sm font-medium mb-2">Pricing Recommendation</p>
                  <p className="text-xs text-muted-foreground">
                    With {expectedCustomers} customers at {formatZAR(suggestedPricePerCustomer)}/month, you would
                    generate {formatZAR(suggestedPricePerCustomer * expectedCustomers)}/month in revenue with{" "}
                    {formatZAR(suggestedPricePerCustomer * expectedCustomers - totalMonthlyZAR)} profit.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="per-user" className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Cost Per User Breakdown</CardTitle>
              <CardDescription>Infrastructure cost per customer ({expectedCustomers} customers)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span>Vercel Hosting</span>
                  <span className="font-medium">{formatZAR(perUserCosts.vercel)}</span>
                </div>
                {perUserCosts.teamSeats > 0 && (
                  <div className="flex justify-between items-center text-sm">
                    <span>Team Seats</span>
                    <span className="font-medium">{formatZAR(perUserCosts.teamSeats)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center text-sm">
                  <span>Database (Supabase)</span>
                  <span className="font-medium">{formatZAR(perUserCosts.supabase)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span>AI Document Analysis</span>
                  <span className="font-medium">{formatZAR(perUserCosts.ai)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span>Document Storage</span>
                  <span className="font-medium">{formatZAR(perUserCosts.storage)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span>Web Scraping</span>
                  <span className="font-medium">{formatZAR(perUserCosts.scraping)}</span>
                </div>

                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between items-center font-semibold text-lg">
                    <span>Total Cost Per User</span>
                    <span className="text-primary">{formatZAR(costPerCustomer)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg mt-4">
                <p className="text-sm font-medium mb-2">Unit Economics</p>
                <div className="space-y-1 text-xs text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Cost per user:</span>
                    <span className="font-medium">{formatZAR(costPerCustomer)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Suggested price (3x):</span>
                    <span className="font-medium text-green-600">{formatZAR(suggestedPricePerCustomer)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Profit per user:</span>
                    <span className="font-medium text-green-600">
                      {formatZAR(suggestedPricePerCustomer - costPerCustomer)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Profit margin:</span>
                    <span className="font-medium">66.7%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Average Usage Per User</CardTitle>
              <CardDescription>Expected resource consumption per customer</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">AI Document Analyses</span>
                    <span className="text-sm text-muted-foreground">{perUserUsage.aiAnalyses.toFixed(1)}/month</span>
                  </div>
                  <div className="text-xs text-muted-foreground">Cost: {formatZAR(perUserCosts.ai)} per user</div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500"
                      style={{ width: `${Math.min((perUserUsage.aiAnalyses / 100) * 100, 100)}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Document Storage</span>
                    <span className="text-sm text-muted-foreground">{perUserUsage.storageGB.toFixed(2)} GB</span>
                  </div>
                  <div className="text-xs text-muted-foreground">Cost: {formatZAR(perUserCosts.storage)} per user</div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500"
                      style={{ width: `${Math.min((perUserUsage.storageGB / 10) * 100, 100)}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Scraping Credits</span>
                    <span className="text-sm text-muted-foreground">
                      {perUserUsage.scrapingCredits.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">Cost: {formatZAR(perUserCosts.scraping)} per user</div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-500"
                      style={{ width: `${Math.min((perUserUsage.scrapingCredits / 10000) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 dark:bg-amber-950 p-4 rounded-lg mt-4">
                <p className="text-sm font-medium mb-2">Pricing Strategy Tips</p>
                <ul className="space-y-1 text-xs text-muted-foreground list-disc list-inside">
                  <li>AI analysis is your biggest variable cost</li>
                  <li>Consider tiered limits (e.g., 10, 50, 100 analyses/month)</li>
                  <li>Storage costs scale linearly with usage</li>
                  <li>Scraping is a fixed cost - spread across all users</li>
                  <li>Aim for 60-70% profit margin for sustainability</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  )
}
