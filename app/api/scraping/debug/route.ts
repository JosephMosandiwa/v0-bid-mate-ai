import { ScraperFactory } from "@/lib/scrapers/scraper-factory"
import { createClient } from "@supabase/supabase-js"

export async function POST() {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

  console.log("[DEBUG] Starting debug scrape with NO validation")

  // Get first active source
  const { data: source } = await supabase
    .from("tender_sources")
    .select("*")
    .eq("is_active", true)
    .eq("scraping_enabled", true)
    .limit(1)
    .single()

  if (!source) {
    return Response.json({ error: "No active sources found" }, { status: 404 })
  }

  console.log(`[DEBUG] Scraping source: ${source.name}`)

  const scraper = ScraperFactory.createScraper(source)
  const result = await scraper.scrape()

  console.log(`[DEBUG] Scraper found ${result.tenders?.length || 0} tenders`)

  if (!result.success || !result.tenders || result.tenders.length === 0) {
    return Response.json({
      success: false,
      message: "Scraper found 0 tenders",
      sourceName: source.name,
      sourceUrl: source.tender_page_url,
    })
  }

  // Save ALL tenders WITHOUT validation
  const tendersToSave = result.tenders.map((tender) => ({
    source_id: source.id,
    source_name: source.name,
    source_url: source.tender_page_url,
    source_level: source.level,
    source_province: source.province,
    title: tender.title || "NO TITLE",
    description: tender.description || null,
    tender_reference: tender.tender_reference || null,
    tender_url: tender.tender_url || source.tender_page_url,
    close_date: tender.close_date || null,
    publish_date: tender.publish_date || null,
    organization: tender.organization || source.name,
    location: tender.location || source.province,
    estimated_value: tender.estimated_value || null,
    category: tender.category || null,
    contact_name: tender.contact_name || null,
    contact_email: tender.contact_email || null,
    contact_phone: tender.contact_phone || null,
    requirements: tender.requirements || null,
    document_urls: tender.document_urls || [],
    is_active: true,
    quality_score: 0,
    quality_grade: "DEBUG",
  }))

  console.log(`[DEBUG] Saving ${tendersToSave.length} tenders WITHOUT validation`)

  const { data: saved, error } = await supabase.from("scraped_tenders").insert(tendersToSave).select()

  if (error) {
    console.error("[DEBUG] Error saving:", error)
    return Response.json(
      {
        success: false,
        error: error.message,
        sampleTender: tendersToSave[0],
      },
      { status: 500 },
    )
  }

  console.log(`[DEBUG] Successfully saved ${saved?.length || 0} tenders`)

  return Response.json({
    success: true,
    message: `Saved ${saved?.length} tenders from ${source.name}`,
    tenders: saved,
  })
}
