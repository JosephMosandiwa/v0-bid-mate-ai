export interface ScrapedTender {
  id?: string
  title: string
  description?: string
  reference_number?: string
  closing_date?: string
  published_date?: string
  tender_value?: number
  category?: string
  location?: string
  contact_info?: string
  tender_url?: string
  source_id?: number
  source_name?: string
  source_level?: string
  source_province?: string
  document_urls?: string[] // Added document URLs array
  scraped_at?: string
  created_at?: string
}
