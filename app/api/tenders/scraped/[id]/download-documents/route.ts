import { createClient } from "@supabase/supabase-js"
import { type NextRequest, NextResponse } from "next/server"
import { DocumentService } from "@/lib/services/document-service"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

/**
 * Download all documents for a scraped tender from source URLs
 * This is triggered when a user wants to analyze a tender that has document URLs but no local copies
 */
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: tenderId } = await params

    console.log("[v0] ========== DOCUMENT DOWNLOAD ==========")
    console.log("[v0] Tender ID:", tenderId)

    // Get the scraped tender with its document URLs
    const { data: tender, error: tenderError } = await supabase
      .from("scraped_tenders")
      .select("*, document_urls")
      .eq("id", tenderId)
      .single()

    if (tenderError || !tender) {
      console.error("[v0] Tender not found:", tenderError)
      return NextResponse.json({ error: "Tender not found" }, { status: 404 })
    }

    // Check if documents already downloaded
    const { data: existingDocs } = await supabase
      .from("tender_documents")
      .select("id, original_url")
      .eq("tender_id", tenderId)

    const existingUrls = new Set(existingDocs?.map(d => d.original_url) || [])

    // Get document URLs from the tender
    const documentUrls = tender.document_urls || []
    if (!Array.isArray(documentUrls) || documentUrls.length === 0) {
      console.log("[v0] No document URLs found for tender")
      return NextResponse.json({ 
        success: true, 
        message: "No documents to download",
        downloaded: 0,
      })
    }

    console.log("[v0] Found", documentUrls.length, "document URL(s)")

    const documentService = new DocumentService()
    const scraperApiKey = process.env.SCRAPING_API_KEY

    const results = {
      downloaded: 0,
      skipped: 0,
      failed: 0,
      documents: [] as any[],
    }

    for (const docInfo of documentUrls) {
      const url = typeof docInfo === "string" ? docInfo : docInfo.url
      const title = typeof docInfo === "string" ? undefined : docInfo.title
      const docType = typeof docInfo === "string" ? undefined : docInfo.type

      if (!url) continue

      // Skip if already downloaded
      if (existingUrls.has(url)) {
        console.log("[v0] Document already downloaded:", url)
        results.skipped++
        continue
      }

      try {
        console.log("[v0] Downloading:", title || url)
        
        const doc = await documentService.downloadAndStoreDocument(
          url,
          tenderId,
          scraperApiKey,
          {
            title: title,
            url: url,
            documentType: docType,
          }
        )

        if (doc) {
          results.downloaded++
          results.documents.push(doc)
          console.log("[v0] Successfully downloaded:", doc.document_name)
        } else {
          results.failed++
          console.log("[v0] Failed to download:", url)
        }
      } catch (error) {
        console.error("[v0] Error downloading document:", error)
        results.failed++
      }
    }

    console.log("[v0] ========== DOWNLOAD COMPLETE ==========")
    console.log("[v0] Downloaded:", results.downloaded)
    console.log("[v0] Skipped (already exists):", results.skipped)
    console.log("[v0] Failed:", results.failed)

    return NextResponse.json({
      success: true,
      ...results,
    })
  } catch (error) {
    console.error("[v0] Error in download-documents route:", error)
    return NextResponse.json(
      {
        error: "Failed to download documents",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
