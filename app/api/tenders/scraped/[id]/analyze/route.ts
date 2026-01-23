import { createClient } from "@supabase/supabase-js"
import { type NextRequest, NextResponse } from "next/server"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

/**
 * Analyze a scraped tender using the same OCR + AI pipeline as custom tenders.
 * Uses Gemini 2.5 Pro for OCR and Grok 3 for analysis.
 */
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: tenderId } = await params
    const { force = false } = await request.json().catch(() => ({}))

    console.log("[v0] ========== SCRAPED TENDER ANALYSIS ==========")
    console.log("[v0] Tender ID:", tenderId)
    console.log("[v0] Force re-analyze:", force)

    // Check if analysis already exists (unless force is true)
    if (!force) {
      const { data: existingAnalysis } = await supabase
        .from("tender_analysis")
        .select("*")
        .eq("tender_id", tenderId)
        .single()

      if (existingAnalysis?.analysis_data) {
        console.log("[v0] Analysis already exists, returning cached version")
        return NextResponse.json({
          success: true,
          analysis: existingAnalysis.analysis_data,
          cached: true,
        })
      }
    }

    // Fetch tender documents
    const { data: documents, error: docsError } = await supabase
      .from("tender_documents")
      .select("*")
      .eq("tender_id", tenderId)
      .order("created_at", { ascending: true })

    if (docsError) {
      console.error("[v0] Error fetching documents:", docsError)
    }

    // Also fetch the scraped tender to get any source document URLs
    const { data: scrapedTender } = await supabase
      .from("scraped_tenders")
      .select("*, document_urls")
      .eq("id", tenderId)
      .single()

    // Collect all document URLs to analyze
    const documentUrls: string[] = []

    // Add blob URLs from tender_documents table
    if (documents && documents.length > 0) {
      for (const doc of documents) {
        if (doc.blob_url) {
          documentUrls.push(doc.blob_url)
          console.log("[v0] Added blob document:", doc.document_name)
        }
      }
    }

    // Add document URLs from scraped tender if no local documents
    if (documentUrls.length === 0 && scrapedTender?.document_urls) {
      const sourceDocUrls = Array.isArray(scrapedTender.document_urls) 
        ? scrapedTender.document_urls 
        : []
      
      for (const doc of sourceDocUrls) {
        const url = typeof doc === "string" ? doc : doc.url
        if (url) {
          documentUrls.push(url)
          console.log("[v0] Added source document URL:", url)
        }
      }
    }

    if (documentUrls.length === 0) {
      console.log("[v0] No documents found - creating analysis from metadata only")
      
      // Create analysis from scraped metadata
      const metadataAnalysis = createMetadataAnalysis(scrapedTender)
      
      // Save to database
      await supabase
        .from("tender_analysis")
        .upsert({
          tender_id: tenderId,
          analysis_data: metadataAnalysis,
          analyzed_at: new Date().toISOString(),
        }, { onConflict: "tender_id" })

      return NextResponse.json({
        success: true,
        analysis: metadataAnalysis,
        cached: false,
        fromMetadata: true,
      })
    }

    console.log("[v0] Found", documentUrls.length, "document(s) to analyze")

    // Use the main analyze-tender API which has Gemini OCR + Grok analysis
    const primaryDocUrl = documentUrls[0]
    console.log("[v0] Analyzing primary document:", primaryDocUrl)

    const analyzeResponse = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/analyze-tender`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          documentUrl: primaryDocUrl,
          additionalDocumentUrls: documentUrls.slice(1),
          tenderMetadata: scrapedTender ? {
            title: scrapedTender.title,
            organization: scrapedTender.organization,
            tender_reference: scrapedTender.tender_reference,
            close_date: scrapedTender.close_date,
            estimated_value: scrapedTender.estimated_value,
            category: scrapedTender.category,
            province: scrapedTender.province,
          } : undefined,
        }),
      },
    )

    if (!analyzeResponse.ok) {
      const error = await analyzeResponse.json()
      console.error("[v0] Analysis API error:", error)
      throw new Error(error.error || "Failed to analyze tender documents")
    }

    const analysis = await analyzeResponse.json()
    console.log("[v0] Analysis completed successfully")

    // Save analysis to database
    const { error: saveError } = await supabase
      .from("tender_analysis")
      .upsert({
        tender_id: tenderId,
        analysis_data: analysis,
        analyzed_at: new Date().toISOString(),
      }, { onConflict: "tender_id" })

    if (saveError) {
      console.error("[v0] Error saving analysis:", saveError)
    } else {
      console.log("[v0] Analysis saved to database")
    }

    return NextResponse.json({
      success: true,
      analysis,
      cached: false,
    })
  } catch (error) {
    console.error("[v0] Error in scraped tender analyze route:", error)
    return NextResponse.json(
      {
        error: "Failed to analyze tender",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

/**
 * Create basic analysis structure from tender metadata when no documents available
 */
function createMetadataAnalysis(tender: any) {
  return {
    tender_summary: {
      tender_number: tender?.tender_reference,
      title: tender?.title,
      description: tender?.description,
      organization: tender?.organization,
      closing_date: tender?.close_date,
      estimated_value: tender?.estimated_value,
      province: tender?.province,
      category: tender?.category,
      procurement_method: tender?.procurement_method,
      tender_type: tender?.tender_type,
      status: tender?.status,
    },
    compliance_summary: {
      mandatory_requirements: [],
      disqualifying_factors: [],
      strengthening_factors: [],
      note: "Full compliance analysis requires tender documents. This is a preview based on metadata.",
    },
    evaluation: {
      method: tender?.procurement_method || "Unknown",
      criteria: [],
      note: "Evaluation criteria will be extracted when tender documents are analyzed.",
    },
    documents_identified: tender?.document_urls?.map((d: any) => ({
      name: typeof d === "string" ? d : d.title,
      type: typeof d === "string" ? "Document" : d.type,
      url: typeof d === "string" ? d : d.url,
    })) || [],
    metadata_only: true,
    analysis_note: "This tender has not been fully analyzed. Click 'Analyze Documents' to perform full AI analysis with OCR.",
  }
}
