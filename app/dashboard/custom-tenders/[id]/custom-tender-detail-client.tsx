"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Save, FileText, Sparkles } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { DynamicTenderForm } from "@/components/dynamic-tender-form"

interface CustomTenderDetailClientProps {
  tender: any
  documents: any[]
  analysis: any
}

export function CustomTenderDetailClient({ tender, documents, analysis }: CustomTenderDetailClientProps) {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    title: tender.title || "",
    organization: tender.organization || "",
    deadline: tender.deadline || "",
    value: tender.value || "",
    description: tender.description || "",
    location: tender.location || "",
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    console.log("[v0] Custom tender data received:", {
      tender,
      documents,
      analysis,
      formData,
    })
  }, [tender, documents, analysis, formData])

  const handleSave = async () => {
    setSaving(true)
    try {
      console.log("[v0] Saving tender details:", formData)
      const response = await fetch(`/api/custom-tenders/${tender.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error("Failed to save")

      console.log("[v0] Tender details saved successfully")
      toast({
        title: "Saved",
        description: "Tender details updated successfully",
      })
    } catch (error) {
      console.error("[v0] Error saving tender details:", error)
      toast({
        title: "Error",
        description: "Failed to save tender details",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/tenders">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Custom Tender</h1>
            <p className="text-muted-foreground">Review and edit tender details</p>
          </div>
        </div>
        <Badge variant="secondary" className="flex items-center gap-1">
          <Sparkles className="h-3 w-3" />
          AI Analyzed
        </Badge>
      </div>

      {/* Tender Details Form - Auto-filled from AI analysis */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle>Tender Details</CardTitle>
          <CardDescription>
            These fields were automatically filled from your uploaded document. Review and edit as needed.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Tender Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="organization">Organization</Label>
            <Input
              id="organization"
              placeholder="e.g., Department of Health"
              value={formData.organization}
              onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="deadline">Deadline</Label>
              <Input
                id="deadline"
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="value">Tender Value</Label>
              <Input
                id="value"
                placeholder="e.g., R 2,500,000"
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              placeholder="e.g., Gauteng, South Africa"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <Button onClick={handleSave} disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? "Saving..." : "Save Details"}
          </Button>
        </CardContent>
      </Card>

      {/* Documents */}
      {documents.length > 0 && (
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Documents</CardTitle>
            <CardDescription>Uploaded tender documents</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {documents.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{doc.file_name}</p>
                      <p className="text-sm text-muted-foreground">{(doc.file_size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" asChild className="bg-transparent">
                    <a href={doc.blob_url} target="_blank" rel="noopener noreferrer">
                      View
                    </a>
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dynamic Form */}
      {analysis && (
        <DynamicTenderForm tenderId={tender.id} tenderTitle={tender.title} analysis={analysis} documents={documents} />
      )}
    </div>
  )
}
