"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Sparkles, Upload, FileText, Loader2 } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface AnalysisResult {
  summary: string
  keyRequirements: string[]
  deadlines: string[]
  evaluationCriteria: string[]
  recommendations: string[]
  complianceChecklist: string[]
}

export default function AnalyzePage() {
  const [documentText, setDocumentText] = useState("")
  const [analyzing, setAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState("")

  const handleAnalyze = async () => {
    if (!documentText.trim()) {
      setError("Please enter or upload a tender document")
      return
    }

    setAnalyzing(true)
    setError("")
    setAnalysis(null)

    try {
      const response = await fetch("/api/analyze-tender", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentText }),
      })

      if (!response.ok) {
        throw new Error("Failed to analyze document")
      }

      const result = await response.json()
      setAnalysis(result)
    } catch (err) {
      setError("Failed to analyze document. Please try again.")
      console.error("[v0] Analysis error:", err)
    } finally {
      setAnalyzing(false)
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const text = event.target?.result as string
        setDocumentText(text)
      }
      reader.readAsText(file)
    }
  }

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">AI Document Analyzer</h1>
        <p className="text-muted-foreground">
          Upload or paste your tender document for intelligent analysis and recommendations
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-6">
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Tender Document</CardTitle>
              <CardDescription>Upload a file or paste the tender document text</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="file-upload">Upload Document</Label>
                <div className="flex items-center gap-2">
                  <Button variant="outline" className="w-full bg-transparent" asChild>
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <Upload className="h-4 w-4 mr-2" />
                      Choose File
                    </label>
                  </Button>
                  <input
                    id="file-upload"
                    type="file"
                    accept=".txt,.pdf,.doc,.docx"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Or</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="document-text">Paste Document Text</Label>
                <Textarea
                  id="document-text"
                  placeholder="Paste your tender document text here..."
                  value={documentText}
                  onChange={(e) => setDocumentText(e.target.value)}
                  rows={12}
                  className="font-mono text-sm"
                />
              </div>

              {error && <p className="text-sm text-destructive">{error}</p>}

              <Button onClick={handleAnalyze} disabled={analyzing || !documentText.trim()} className="w-full">
                {analyzing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Analyze Document
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border bg-primary/5">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <CardTitle className="text-base">What We Analyze</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5" />
                  <span>Key requirements and eligibility criteria</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5" />
                  <span>Important deadlines and submission dates</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5" />
                  <span>Evaluation criteria and scoring methodology</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5" />
                  <span>Compliance requirements and mandatory documents</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5" />
                  <span>Strategic recommendations for your submission</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Results Section */}
        <div>
          {analysis ? (
            <Card className="border-border">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <CardTitle>Analysis Results</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="summary" className="space-y-4">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="summary">Summary</TabsTrigger>
                    <TabsTrigger value="requirements">Requirements</TabsTrigger>
                    <TabsTrigger value="recommendations">Tips</TabsTrigger>
                  </TabsList>

                  <TabsContent value="summary" className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Executive Summary</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{analysis.summary}</p>
                    </div>

                    {analysis.deadlines.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-foreground mb-2">Key Deadlines</h3>
                        <ul className="space-y-2">
                          {analysis.deadlines.map((deadline, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm">
                              <div className="h-1.5 w-1.5 rounded-full bg-destructive mt-1.5" />
                              <span className="text-muted-foreground">{deadline}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {analysis.evaluationCriteria.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-foreground mb-2">Evaluation Criteria</h3>
                        <ul className="space-y-2">
                          {analysis.evaluationCriteria.map((criteria, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm">
                              <div className="h-1.5 w-1.5 rounded-full bg-accent mt-1.5" />
                              <span className="text-muted-foreground">{criteria}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="requirements" className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Key Requirements</h3>
                      <ul className="space-y-2">
                        {analysis.keyRequirements.map((req, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5" />
                            <span className="text-muted-foreground">{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {analysis.complianceChecklist.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-foreground mb-2">Compliance Checklist</h3>
                        <ul className="space-y-2">
                          {analysis.complianceChecklist.map((item, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm">
                              <div className="h-1.5 w-1.5 rounded-full bg-secondary mt-1.5" />
                              <span className="text-muted-foreground">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="recommendations" className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Strategic Recommendations</h3>
                      <ul className="space-y-3">
                        {analysis.recommendations.map((rec, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <div className="h-1.5 w-1.5 rounded-full bg-secondary mt-1.5" />
                            <span className="text-muted-foreground">{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="mt-6 pt-6 border-t border-border">
                  <Button className="w-full bg-transparent" variant="outline">
                    <FileText className="h-4 w-4 mr-2" />
                    Save to My Tenders
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-border border-dashed">
              <CardContent className="p-12 text-center">
                <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Ready to Analyze</h3>
                <p className="text-muted-foreground">
                  Upload or paste your tender document to get AI-powered insights and recommendations
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
