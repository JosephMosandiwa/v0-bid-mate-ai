"use client"

import { useState, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, ClipboardList } from "lucide-react"
import { DynamicTenderForm } from "@/components/dynamic-tender-form"

interface ScrapedTender {
  id: string
  title: string
  description: string
  source_name: string
  source_level: string
  source_province?: string
  tender_url: string
  publish_date?: string
  close_date?: string
  estimated_value?: string
  category?: string
  requirements?: string[]
}

interface TenderDocument {
  id: string
  tender_id: string
  document_name: string
  document_type: string
  original_url: string
  blob_url: string
  file_size: number
  created_at: string
}

interface TenderAnalysis {
  summary: string
  keyRequirements: string[]
  deadlines: string[]
  evaluationCriteria: string[]
  recommendations: string[]
  complianceChecklist: string[]
  actionableTasks: {
    task: string
    priority: "high" | "medium" | "low"
    category: string
    deadline: string | null
  }[]
  formFields?: {
    id: string
    label: string
    type: string
    required: boolean
    placeholder?: string
    description?: string
    options?: string[]
    validation?: any
    section?: string
  }[]
}

interface ScrapedTenderDetailClientProps {
  googleMapsApiKey?: string
}

export function ScrapedTenderDetailClient({ googleMapsApiKey }: ScrapedTenderDetailClientProps) {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [tender, setTender] = useState<ScrapedTender | null>(null)
  const [documents, setDocuments] = useState<TenderDocument[]>([])
  const [loading, setLoading] = useState(true)
  const [analyzing, setAnalyzing] = useState<string | null>(null)
  const [analysis, setAnalysis] = useState<TenderAnalysis | null>(null)
  const [analysisLoading, setAnalysisLoading] = useState(false)
  const [analysisError, setAnalysisError] = useState<string | null>(null)
  const [analysisCached, setAnalysisCached] = useState(false)

  const analysisInitiated = useRef(false)

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-4 md:space-y-6">
      <Tabs defaultValue="analysis" className="space-y-4 md:space-y-6">
        <TabsContent value="form" className="space-y-4 md:space-y-6">
          {analysis?.formFields && analysis.formFields.length > 0 ? (
            <>
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  This form was automatically generated from the tender documents. Fill in all required fields and save
                  your progress as you go.
                </AlertDescription>
              </Alert>
              <DynamicTenderForm tenderId={id} formFields={analysis.formFields} googleMapsApiKey={googleMapsApiKey} />
            </>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <ClipboardList className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground">No form fields extracted from documents</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
