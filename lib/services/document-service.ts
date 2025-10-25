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
      console.log("[v0] Downloading document:", url)

      // Construct the fetch URL (use ScraperAPI if available)
      const fetchUrl = scraperApiKey
        ? `http://api.scraperapi.com?api_key=${scraperApiKey}&url=${encodeURIComponent(url)}`
        : url

      // Download the document
      const response = await fetch(fetchUrl)

      if (!response.ok) {
        console.error(`[v0] Failed to download document: ${response.status} ${response.statusText}`)
        return null
      }

      // Get the file as a blob
      const blob = await response.blob()
      const fileSize = blob.size

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

      console.log("[v0] Document uploaded to Blob:", blobResult.url)

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
        console.error("[v0] Error saving document to database:", error)
        return null
      }

      console.log("[v0] Document saved to database:", data.id)
      return data
    } catch (error) {
      console.error("[v0] Error downloading/storing document:", error)
      return null
    }
  }

  /**
   * Download multiple documents for a tender
   */
  async downloadTenderDocuments(
    documentUrls: string[],
    tenderId: string,
    scraperApiKey?: string,
  ): Promise<TenderDocument[]> {
    console.log(`[v0] Downloading ${documentUrls.length} documents for tender ${tenderId}`)

    const documents: TenderDocument[] = []

    // Download documents sequentially to avoid rate limiting
    for (const url of documentUrls) {
      const document = await this.downloadAndStoreDocument(url, tenderId, scraperApiKey)
      if (document) {
        documents.push(document)
      }

      // Add a small delay between downloads to be respectful
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }

    console.log(`[v0] Successfully downloaded ${documents.length}/${documentUrls.length} documents`)
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
      console.error("[v0] Error fetching tender documents:", error)
      return []
    }

    return data || []
  }
}
