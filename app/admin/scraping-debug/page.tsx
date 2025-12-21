"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"

export default function ScrapingDebugPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [dbStats, setDbStats] = useState<any>(null)

  const runDebugScrape = async () => {
    setLoading(true)
    setResult(null)

    try {
      console.log("[v0] Starting debug scrape...")
      const response = await fetch("/api/scraping/debug", {
        method: "POST",
      })

      const data = await response.json()
      console.log("[v0] Debug scrape result:", data)
      setResult(data)
    } catch (error) {
      console.error("[v0] Debug scrape error:", error)
      setResult({ error: String(error) })
    } finally {
      setLoading(false)
    }
  }

  const checkDatabase = async () => {
    setLoading(true)
    setDbStats(null)

    try {
      console.log("[v0] Checking database...")
      const response = await fetch("/api/scraping/check-db")
      const data = await response.json()
      console.log("[v0] Database stats:", data)
      setDbStats(data)
    } catch (error) {
      console.error("[v0] Database check error:", error)
      setDbStats({ error: String(error) })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Scraping Debug Tools</h1>
        <p className="text-muted-foreground">Test and diagnose scraping issues without validation</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Debug Scrape (No Validation)</CardTitle>
            <CardDescription>
              Scrapes the first active source and saves ALL tenders directly to database, bypassing all validation
              checks.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={runDebugScrape} disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Scraping...
                </>
              ) : (
                "Run Debug Scrape"
              )}
            </Button>

            {result && (
              <Alert>
                <AlertDescription>
                  <pre className="text-xs overflow-auto max-h-96">{JSON.stringify(result, null, 2)}</pre>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Check Database</CardTitle>
            <CardDescription>View current tender count and most recent tenders in the database.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={checkDatabase} disabled={loading} variant="outline" className="w-full bg-transparent">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Checking...
                </>
              ) : (
                "Check Database"
              )}
            </Button>

            {dbStats && (
              <Alert>
                <AlertDescription>
                  <pre className="text-xs overflow-auto max-h-96">{JSON.stringify(dbStats, null, 2)}</pre>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Instructions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            <strong>1. Check Database:</strong> See how many tenders are currently in scraped_tenders table
          </p>
          <p>
            <strong>2. Run Debug Scrape:</strong> Scrape one source and save ALL tenders (no quality checks)
          </p>
          <p>
            <strong>3. Check Database Again:</strong> Verify new tenders were saved
          </p>
          <p className="text-muted-foreground mt-4">
            All results appear in the cards above. Check browser console for detailed logs.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
