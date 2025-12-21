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
  const [progress, setProgress] = useState<string[]>([])

  const handleFetch = async () => {
    setLoading(true)
    setError(null)
    setResult(null)
    setProgress(["🚀 Starting API fetch..."])

    try {
      setProgress((prev) => [...prev, "📡 Calling /api/fetch-all-api-tenders..."])

      const response = await fetch("/api/fetch-all-api-tenders", {
        method: "POST",
      })

      setProgress((prev) => [...prev, `✅ API responded with status: ${response.status}`])

      const data = await response.json()
      setProgress((prev) => [...prev, `📦 Received data: ${JSON.stringify(data).substring(0, 200)}...`])

      if (!response.ok || (!data.success && data.totalSaved === 0)) {
        setError(data.error || "Failed to fetch tenders")
        if (data.sources && data.sources.length > 0) {
          setResult(data)
        }
        setProgress((prev) => [...prev, `❌ Fetch failed: ${data.error}`])
        return
      }

      setProgress((prev) => [...prev, `✅ Success! Fetched ${data.totalFetched}, Saved ${data.totalSaved}`])
      setResult(data)
    } catch (err) {
      console.error("[v0] Error:", err)
      const errorMsg = err instanceof Error ? err.message : "Unknown error"
      setError(errorMsg)
      setProgress((prev) => [...prev, `❌ Exception: ${errorMsg}`])
    } finally {
      setLoading(false)
      setProgress((prev) => [...prev, "🏁 Fetch complete"])
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
        <h1 className="text-3xl font-bold">API Tender Fetcher</h1>
        <p className="text-muted-foreground mt-2">
          Fetch tenders from all available South African tender APIs (eTender, EasyTenders, and more)
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
          <CardTitle>Fetch Latest Tenders from All API Sources</CardTitle>
          <CardDescription>
            This will fetch tenders from all available APIs (eTender OCDS, EasyTenders) from the last 30 days
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleFetch} disabled={loading} size="lg" className="w-full">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Fetching from All API Sources...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Fetch from All APIs
              </>
            )}
          </Button>

          {progress.length > 0 && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
              <h4 className="font-semibold mb-2 text-sm">Live Progress:</h4>
              <div className="space-y-1 text-sm font-mono max-h-60 overflow-y-auto">
                {progress.map((msg, i) => (
                  <div key={i} className="text-gray-700">
                    {msg}
                  </div>
                ))}
              </div>
            </div>
          )}
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
              {result.success ? (
                <>
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  Success!
                </>
              ) : (
                <>
                  <XCircle className="h-5 w-5 text-yellow-500" />
                  Partial Success
                </>
              )}
            </CardTitle>
            <CardDescription>
              Database had {result.beforeCount} tenders before fetch. After fetching {result.totalFetched} tenders from
              APIs and saving {result.totalSaved}, database now has {result.afterCount} tenders ({result.newTenders}{" "}
              new, {result.totalSaved - result.newTenders} updated).
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {result.newTenders === 0 && result.totalSaved > 0 && (
                <Alert className="border-blue-500 bg-blue-50">
                  <AlertDescription className="text-blue-900">
                    <strong>Note:</strong> All {result.totalSaved} tenders from the API already existed in the database
                    and were updated. No genuinely new tenders were added. This means the system is working correctly
                    and preventing duplicates.
                  </AlertDescription>
                </Alert>
              )}

              <div>
                <h3 className="font-semibold mb-3">Results by Source</h3>
                <div className="space-y-3">
                  {result.sources?.map((source: any, index: number) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border ${
                        source.error
                          ? "border-red-200 bg-red-50"
                          : source.saved > 0
                            ? "border-green-200 bg-green-50"
                            : "border-gray-200 bg-gray-50"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="font-semibold flex items-center gap-2">
                            {source.error ? (
                              <XCircle className="h-4 w-4 text-red-500" />
                            ) : source.saved > 0 ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <XCircle className="h-4 w-4 text-gray-400" />
                            )}
                            {source.name}
                          </div>
                          {source.error ? (
                            <div className="text-sm text-red-600 mt-1">{source.error}</div>
                          ) : (
                            <div className="text-sm text-muted-foreground mt-1">
                              Fetched: {source.fetched} | Saved: {source.saved}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

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
