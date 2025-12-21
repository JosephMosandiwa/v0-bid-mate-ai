"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Download, CheckCircle, XCircle, TestTube } from "lucide-react"

export default function ETenderFetchPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [testLoading, setTestLoading] = useState(false)
  const [testResult, setTestResult] = useState<any>(null)

  const handleFetch = async () => {
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      console.log("[v0] Calling new API tenders fetch...")
      const response = await fetch("/api/fetch-api-tenders", {
        method: "POST",
      })

      const data = await response.json()
      console.log("[v0] Response:", data)

      if (!response.ok || !data.success) {
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

  const handleTest = async () => {
    setTestLoading(true)
    setTestResult(null)

    try {
      console.log("[v0] Running pipeline test...")
      const response = await fetch("/api/test-tender-flow", {
        method: "POST",
      })

      const data = await response.json()
      console.log("[v0] Test result:", data)

      setTestResult(data)
    } catch (err) {
      console.error("[v0] Test error:", err)
      setTestResult({
        success: false,
        error: err instanceof Error ? err.message : "Unknown error",
      })
    } finally {
      setTestLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">eTender API Direct Fetch</h1>
        <p className="text-muted-foreground mt-2">
          Fetch tenders directly from the South African National Treasury eTender API (OCDS Format)
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Pipeline Diagnostic Test</CardTitle>
          <CardDescription>
            Test the entire tender pipeline to identify any issues before fetching real data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={handleTest}
            disabled={testLoading}
            size="lg"
            className="w-full bg-transparent"
            variant="outline"
          >
            {testLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Running Tests...
              </>
            ) : (
              <>
                <TestTube className="mr-2 h-4 w-4" />
                Run Full Pipeline Test
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {testResult && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {testResult.success ? (
                <>
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  All Tests Passed
                </>
              ) : (
                <>
                  <XCircle className="h-5 w-5 text-red-500" />
                  Tests Failed
                </>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {testResult.steps?.map((step: any) => (
                <div key={step.step} className="flex items-start gap-3 p-3 border rounded-lg">
                  {step.status === "passed" ? (
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  ) : step.status === "failed" ? (
                    <XCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                  ) : (
                    <Loader2 className="h-5 w-5 text-blue-500 animate-spin flex-shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <div className="font-semibold">
                      Step {step.step}: {step.name}
                    </div>
                    {step.error && <div className="text-sm text-red-500 mt-1">{step.error}</div>}
                    {step.currentCount !== undefined && (
                      <div className="text-sm text-muted-foreground mt-1">Current count: {step.currentCount}</div>
                    )}
                    {step.tenderId && (
                      <div className="text-sm text-muted-foreground mt-1">Created tender ID: {step.tenderId}</div>
                    )}
                    {step.totalTenders !== undefined && (
                      <div className="text-sm text-muted-foreground mt-1">Total tenders: {step.totalTenders}</div>
                    )}
                  </div>
                </div>
              ))}
              {testResult.message && (
                <Alert className={testResult.success ? "border-green-500" : "border-red-500"}>
                  <AlertDescription>{testResult.message}</AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>
      )}

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
            <CardDescription>
              Source: {result.source} | Date Range: {result.dateRange?.from} to {result.dateRange?.to}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Summary</h3>
                <ul className="space-y-1 text-sm">
                  <li>
                    Tenders Found in API: <strong>{result.tendersFound || 0}</strong>
                  </li>
                  <li>
                    Tenders Processed: <strong>{result.tendersProcessed || 0}</strong>
                  </li>
                  <li>
                    Tenders Saved: <strong>{result.tendersSaved || 0}</strong>
                  </li>
                </ul>
              </div>

              {result.sampleTender && (
                <div>
                  <h3 className="font-semibold mb-2">Sample Tender</h3>
                  <div className="bg-muted p-4 rounded-lg text-sm space-y-2">
                    <div>
                      <strong>Title:</strong> {result.sampleTender.title}
                    </div>
                    <div>
                      <strong>Organization:</strong> {result.sampleTender.source_name}
                    </div>
                    <div>
                      <strong>Reference:</strong> {result.sampleTender.tender_reference}
                    </div>
                    <div>
                      <strong>Close Date:</strong> {result.sampleTender.close_date || "N/A"}
                    </div>
                    <div>
                      <strong>Value:</strong> {result.sampleTender.estimated_value || "N/A"}
                    </div>
                    <div>
                      <strong>Category:</strong> {result.sampleTender.category || "N/A"}
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
