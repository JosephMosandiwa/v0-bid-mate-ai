import { createClient } from "@supabase/supabase-js"

export async function GET() {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

  // Count scraped tenders
  const { count: scrapedCount } = await supabase.from("scraped_tenders").select("*", { count: "exact", head: true })

  // Get recent tenders
  const { data: recentTenders } = await supabase
    .from("scraped_tenders")
    .select("id, title, source_name, created_at, quality_score, quality_grade")
    .order("created_at", { ascending: false })
    .limit(10)

  // Count active sources
  const { count: activeSourcesCount } = await supabase
    .from("tender_sources")
    .select("*", { count: "exact", head: true })
    .eq("is_active", true)
    .eq("scraping_enabled", true)

  return Response.json({
    scrapedTendersCount: scrapedCount,
    activeSourcesCount,
    recentTenders,
    message: `Found ${scrapedCount} scraped tenders and ${activeSourcesCount} active sources`,
  })
}
