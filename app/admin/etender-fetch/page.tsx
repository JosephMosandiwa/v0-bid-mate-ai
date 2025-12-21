"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Download, CheckCircle, XCircle } from "lucide-react"

export default function ETenderFetchPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFetch = async () => {
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      console.log("[v0] Calling eTender API fetch...")
      const response = await fetch("/api/etender/fetch", {
        method: "POST",
      })

      const data = await response.json()
      console.log("[v0] Response:", data)

      if (!response.ok) {
        setError(data.error || "Failed to fetch tenders")
        return
      }

      setResult(data)
    } catch (err) {
      console.error("[v0] Error:", err)
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">eTender API Direct Fetch</h1>
        <p className="text-muted-foreground mt-2">
          Fetch tenders directly from the South African National Treasury eTender API
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Fetch Latest Tenders</CardTitle>
          <CardDescription>
            This will fetch tenders from the last 30 days and save them directly to the database
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleFetch} disabled={loading} size="lg" className="w-full">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Fetching Tenders...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Fetch from eTender API
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive" className="mt-6">
          <XCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Error:</strong> {error}
          </AlertDescription>
        </Alert>
      )}

      {result && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Success!
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Summary</h3>
                <ul className="space-y-1 text-sm">
                  <li>
                    Tenders Processed: <strong>{result.tendersProcessed}</strong>
                  </li>
                  <li>
                    Tenders Saved: <strong>{result.tendersSaved}</strong>
                  </li>
                </ul>
              </div>

              {result.sample && (
                <div>
                  <h3 className="font-semibold mb-2">Sample Tender</h3>
                  <div className="bg-muted p-4 rounded-lg text-sm">
                    <div>
                      <strong>Title:</strong> {result.sample.title}
                    </div>
                    <div>
                      <strong>Organization:</strong> {result.sample.organization}
                    </div>
                    <div>
                      <strong>Reference:</strong> {result.sample.tender_reference}
                    </div>
                    <div>
                      <strong>Close Date:</strong> {result.sample.close_date || "N/A"}
                    </div>
                    <div>
                      <strong>Value:</strong>{" "}
                      {result.sample.value ? `${result.sample.currency} ${result.sample.value}` : "N/A"}
                    </div>
                  </div>
                </div>
              )}

              <Alert>
                <AlertDescription>
                  Go to <strong>/dashboard/search</strong> to view the newly fetched tenders
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
