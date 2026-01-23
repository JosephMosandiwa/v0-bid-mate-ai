import { put } from "@vercel/blob"
import { createClient } from "@supabase/supabase-js"

export interface TenderDocument {
  id?: string
  tender_id: string
  document_name: string
  document_type: string
  original_url: string
  blob_url: string
  file_size?: number
  downloaded_at?: string
}

// Rich document metadata from APIs like eTender OCDS
export interface APIDocumentMetadata {
  id?: string
  title?: string
  description?: string
  url: string
  documentType?: string
  format?: string
  datePublished?: string
  dateModified?: string
  language?: string
}

export class DocumentService {
  private supabase

  constructor() {
    this.supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
  }

  /**
   * Download a document from a URL and upload it to Vercel Blob
   * Optionally accepts rich metadata from API sources like eTender OCDS
   */
  async downloadAndStoreDocument(
    url: string,
    tenderId: string,
    scraperApiKey?: string,
    metadata?: APIDocumentMetadata,
  ): Promise<TenderDocument | null> {
    try {
      console.log("[DocumentService] Downloading document:", url)

      // Construct the fetch URL (use ScraperAPI if available)
      const fetchUrl = scraperApiKey
        ? `http://api.scraperapi.com?api_key=${scraperApiKey}&url=${encodeURIComponent(url)}`
        : url

      // Download the document with timeout
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 second timeout

      const response = await fetch(fetchUrl, {
        signal: controller.signal,
        headers: {
          "User-Agent": "BidMateAI-DocumentDownloader/1.0",
        },
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        console.error(`[DocumentService] Failed to download: ${response.status} ${response.statusText}`)
        return null
      }

      const blob = await response.blob()
      const fileSize = blob.size

      // Skip files larger than 50MB
      if (fileSize > 50 * 1024 * 1024) {
        console.warn(`[DocumentService] File too large (${fileSize} bytes), skipping`)
        return null
      }

      // Extract filename from metadata, URL, or generate one
      const urlPath = new URL(url).pathname
      const urlFilename = urlPath.split("/").pop() || `document-${Date.now()}`
      const filename = metadata?.title || urlFilename

      // Determine file type from metadata, extension, or content-type
      const extension = metadata?.format || filename.split(".").pop()?.toLowerCase() || "pdf"
      const contentType = response.headers.get("content-type") || "application/pdf"

      // Create a File object for Vercel Blob
      const file = new File([blob], filename, { type: contentType })

      // Upload to Vercel Blob with organized path
      const blobResult = await put(`tenders/${tenderId}/${filename}`, file, {
        access: "public",
      })

      console.log("[DocumentService] Document uploaded to Blob:", blobResult.url)

      // Save document metadata to database - use rich metadata from API if available
      const document: TenderDocument = {
        tender_id: tenderId,
        document_name: metadata?.title || filename,
        document_type: metadata?.documentType || extension,
        original_url: url,
        blob_url: blobResult.url,
        file_size: fileSize,
        downloaded_at: new Date().toISOString(),
      }

      const { data, error } = await this.supabase.from("tender_documents").insert(document).select().single()

      if (error) {
        console.error("[DocumentService] Error saving to database:", error)
        return null
      }

      console.log("[DocumentService] Document saved:", data.id)
      return data
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        console.error("[DocumentService] Download timed out for:", url)
      } else {
        console.error("[DocumentService] Error downloading/storing document:", error)
      }
      return null
    }
  }

  /**
   * Download multiple documents for a tender
   * Accepts both string[] and rich APIDocumentMetadata[] formats from eTender API
   */
  async downloadTenderDocuments(
    documentUrls: (string | APIDocumentMetadata)[],
    tenderId: string,
    scraperApiKey?: string,
  ): Promise<TenderDocument[]> {
    console.log(`[DocumentService] Downloading ${documentUrls.length} documents for tender ${tenderId}`)

    const documents: TenderDocument[] = []

    // Download documents sequentially to avoid rate limiting
    for (const doc of documentUrls) {
      try {
        const url = typeof doc === "string" ? doc : doc.url
        if (!url) continue
        
        // Check if document already exists
        const exists = await this.documentExists(tenderId, url)
        if (exists) {
          console.log(`[DocumentService] Document already exists, skipping: ${url}`)
          continue
        }
        
        // Extract metadata if available
        const metadata = typeof doc === "string" ? undefined : doc
        
        const document = await this.downloadAndStoreDocument(url, tenderId, scraperApiKey, metadata)
        if (document) {
          documents.push(document)
        }
      } catch (error) {
        const url = typeof doc === "string" ? doc : doc.url
        console.error(`[DocumentService] Failed to download ${url}:`, error)
      }

      // Add a small delay between downloads to be respectful
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }

    console.log(`[DocumentService] Successfully downloaded ${documents.length}/${documentUrls.length} documents`)
    return documents
  }

  /**
   * Get all documents for a tender
   */
  async getTenderDocuments(tenderId: string): Promise<TenderDocument[]> {
    const { data, error } = await this.supabase
      .from("tender_documents")
      .select("*")
      .eq("tender_id", tenderId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("[DocumentService] Error fetching tender documents:", error)
      return []
    }

    return data || []
  }

  /**
   * Check if a document already exists for a tender
   */
  async documentExists(tenderId: string, originalUrl: string): Promise<boolean> {
    const { count } = await this.supabase
      .from("tender_documents")
      .select("*", { count: "exact", head: true })
      .eq("tender_id", tenderId)
      .eq("original_url", originalUrl)

    return (count || 0) > 0
  }
}
