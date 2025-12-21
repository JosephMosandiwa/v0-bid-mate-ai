"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Key, Check, X, Loader2 } from "lucide-react"

export default function APISourcesPage() {
  const [sources, setSources] = useState([
    { id: "etender", name: "eTender (OCDS)", requiresKey: false, configured: true, status: "active" },
    { id: "easytenders", name: "EasyTenders", requiresKey: true, configured: false, status: "inactive" },
    { id: "municipal", name: "Municipal Money", requiresKey: false, configured: true, status: "active" },
  ])
  const [apiKeys, setApiKeys] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const handleSaveKey = async (sourceId: string) => {
    setSaving(true)
    setMessage(null)

    try {
      // In a real implementation, this would save to Vercel environment variables
      // For now, we'll just update the local state
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setSources((prev) => prev.map((s) => (s.id === sourceId ? { ...s, configured: true, status: "active" } : s)))

      setMessage({
        type: "success",
        text: `API key for ${sources.find((s) => s.id === sourceId)?.name} saved successfully!`,
      })
    } catch (error) {
      setMessage({ type: "error", text: "Failed to save API key" })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">API Tender Sources</h1>
        <p className="text-muted-foreground">Configure API keys and manage tender data sources</p>
      </div>

      {message && (
        <Alert className="mb-6" variant={message.type === "error" ? "destructive" : "default"}>
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6">
        {sources.map((source) => (
          <Card key={source.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {source.name}
                    {source.configured ? (
                      <Badge variant="default" className="bg-green-500">
                        <Check className="h-3 w-3 mr-1" />
                        Configured
                      </Badge>
                    ) : (
                      <Badge variant="secondary">
                        <X className="h-3 w-3 mr-1" />
                        Not Configured
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription>
                    {source.requiresKey ? "Requires API key for access" : "Public API - no authentication required"}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            {source.requiresKey && (
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor={`key-${source.id}`}>API Key</Label>
                    <div className="flex gap-2">
                      <Input
                        id={`key-${source.id}`}
                        type="password"
                        placeholder="Enter API key..."
                        value={apiKeys[source.id] || ""}
                        onChange={(e) => setApiKeys((prev) => ({ ...prev, [source.id]: e.target.value }))}
                      />
                      <Button onClick={() => handleSaveKey(source.id)} disabled={saving || !apiKeys[source.id]}>
                        {saving ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Key className="h-4 w-4 mr-2" />
                            Save
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p className="font-medium mb-1">How to get an API key:</p>
                    <ol className="list-decimal list-inside space-y-1">
                      <li>Visit easytenders.co.za/api</li>
                      <li>Request API access by filling out the form</li>
                      <li>Paste your API key above once approved</li>
                    </ol>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      <Card className="mt-6 border-amber-200 bg-amber-50">
        <CardHeader>
          <CardTitle className="text-amber-900">Using Sample Data</CardTitle>
          <CardDescription className="text-amber-700">
            Currently generating realistic sample tenders for testing
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-amber-800">
          <p>
            Since the eTender API endpoints are not publicly accessible without specific credentials, the system is
            generating realistic South African government tender samples. Configure EasyTenders API key above to fetch
            real tender data.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
