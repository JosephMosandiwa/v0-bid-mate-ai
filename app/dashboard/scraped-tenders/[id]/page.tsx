"use client"
import { ScrapedTenderDetailClient } from "./scraped-tender-detail-client"
import { useEffect, useState } from "react"
import { getGoogleMapsApiKey } from "@/lib/actions/get-google-maps-key"

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

export default function ScrapedTenderDetailPage() {
  const [googleMapsApiKey, setGoogleMapsApiKey] = useState<string>()

  useEffect(() => {
    getGoogleMapsApiKey().then(setGoogleMapsApiKey)
  }, [])

  return <ScrapedTenderDetailClient googleMapsApiKey={googleMapsApiKey} />
}
