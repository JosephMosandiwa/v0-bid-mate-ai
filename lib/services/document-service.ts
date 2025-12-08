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
}

export class DocumentService {
  private supabase

  constructor() {
    this.supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
  }

  /**
   * Download a document from a URL and upload it to Vercel Blob
   */
  async downloadAndStoreDocument(
    url: string,
    tenderId: string,
    scraperApiKey?: string,
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

      // Extract filename from URL or generate one
      const urlPath = new URL(url).pathname
      const filename = urlPath.split("/").pop() || `document-${Date.now()}`

      // Determine file type from extension or content-type
      const extension = filename.split(".").pop()?.toLowerCase() || "pdf"
      const contentType = response.headers.get("content-type") || "application/pdf"

      // Create a File object for Vercel Blob
      const file = new File([blob], filename, { type: contentType })

      // Upload to Vercel Blob with organized path
      const blobResult = await put(`tenders/${tenderId}/${filename}`, file, {
        access: "public",
      })

      console.log("[DocumentService] Document uploaded to Blob:", blobResult.url)

      // Save document metadata to database
      const document: TenderDocument = {
        tender_id: tenderId,
        document_name: filename,
        document_type: extension,
        original_url: url,
        blob_url: blobResult.url,
        file_size: fileSize,
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
   * Accepts both string[] and {title: string, url: string}[] formats
   */
  async downloadTenderDocuments(
    documentUrls: (string | { title?: string; url: string })[],
    tenderId: string,
    scraperApiKey?: string,
  ): Promise<TenderDocument[]> {
    console.log(`[DocumentService] Downloading ${documentUrls.length} documents for tender ${tenderId}`)

    const documents: TenderDocument[] = []

    // Normalize URLs to strings
    const urls = documentUrls
      .map((doc) => (typeof doc === "string" ? doc : doc.url))
      .filter((url): url is string => Boolean(url))

    // Download documents sequentially to avoid rate limiting
    for (const url of urls) {
      try {
        const document = await this.downloadAndStoreDocument(url, tenderId, scraperApiKey)
        if (document) {
          documents.push(document)
        }
      } catch (error) {
        console.error(`[DocumentService] Failed to download ${url}:`, error)
      }

      // Add a small delay between downloads to be respectful
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }

    console.log(`[DocumentService] Successfully downloaded ${documents.length}/${urls.length} documents`)
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
