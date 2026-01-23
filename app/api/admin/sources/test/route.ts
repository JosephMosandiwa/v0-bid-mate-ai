import { createClient } from "@supabase/supabase-js"
import { type NextRequest, NextResponse } from "next/server"
import { ScraperFactory } from "@/lib/scrapers/scraper-factory"
import { getSourceConfig, getAllSourceConfigs } from "@/lib/scrapers/source-configs"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

/**
 * Test a specific tender source scraper
 * POST /api/admin/sources/test
 */
export async function POST(request: NextRequest) {
  try {
    const { sourceId, scraperType, sourceUrl, limit = 5 } = await request.json()

    console.log("[v0] Testing scraper:", { sourceId, scraperType, sourceUrl })

    // Create scraper
    const scraper = ScraperFactory.createScraper({
      id: sourceId || 0,
      name: `Test - ${scraperType}`,
      tender_page_url: sourceUrl,
      scraper_type: scraperType
    })

    // Run scrape with timing
    const startTime = Date.now()
    const result = await scraper.scrape()
    const duration = Date.now() - startTime

    // Get source config info
    const config = getSourceConfig(scraperType)

    // Limit results for testing
    const limitedTenders = result.tenders.slice(0, limit)

    // Calculate data completeness metrics
    const completenessMetrics = limitedTenders.map(tender => {
      const fields = [
        'title', 'tender_reference', 'description', 'organization', 'category',
        'close_date', 'publish_date', 'estimated_value', 'contact_person',
        'contact_email', 'contact_phone', 'province', 'location', 'tender_url',
        'document_urls'
      ]
      
      const populated = fields.filter(f => {
        const value = (tender as any)[f]
        return value && (Array.isArray(value) ? value.length > 0 : true)
      })

      return {
        title: tender.title?.substring(0, 60),
        reference: tender.tender_reference,
        fieldsPopulated: populated.length,
        totalFields: fields.length,
        completeness: Math.round((populated.length / fields.length) * 100),
        hasDocuments: (tender.document_urls?.length || 0) > 0,
        documentCount: tender.document_urls?.length || 0,
        populatedFields: populated,
        missingFields: fields.filter(f => !populated.includes(f))
      }
    })

    return NextResponse.json({
      success: result.success,
      scraperType,
      sourceConfig: config ? {
        id: config.id,
        name: config.name,
        type: config.type,
        level: config.level,
        province: config.province
      } : null,
      stats: {
        totalFound: result.tenders.length,
        returned: limitedTenders.length,
        durationMs: duration,
        avgCompleteness: completenessMetrics.length > 0 
          ? Math.round(completenessMetrics.reduce((a, b) => a + b.completeness, 0) / completenessMetrics.length)
          : 0,
        tendersWithDocuments: completenessMetrics.filter(m => m.hasDocuments).length,
        totalDocuments: completenessMetrics.reduce((a, b) => a + b.documentCount, 0)
      },
      tenders: limitedTenders,
      completenessMetrics,
      error: result.error
    })
  } catch (error) {
    console.error("[v0] Scraper test error:", error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}

/**
 * Get all available source configurations
 * GET /api/admin/sources/test
 */
export async function GET() {
  try {
    const configs = getAllSourceConfigs()
    
    // Get current sources from database
    const { data: dbSources } = await supabase
      .from("tender_sources")
      .select("*")
      .order("name")

    return NextResponse.json({
      availableConfigs: configs.map(c => ({
        id: c.id,
        name: c.name,
        type: c.type,
        level: c.level,
        province: c.province,
        website: c.website,
        description: c.description
      })),
      currentSources: dbSources || [],
      supportedTypes: ScraperFactory.getSupportedTypes()
    })
  } catch (error) {
    console.error("[v0] Error fetching configs:", error)
    return NextResponse.json({
      error: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}
