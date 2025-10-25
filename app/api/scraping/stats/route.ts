import { createClient } from "@supabase/supabase-js"

export async function GET() {
  try {
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

    // Get overall statistics
    const [
      { count: totalSources },
      { count: activeSources },
      { count: totalTenders },
      { count: activeTenders },
      { data: recentScrapes },
    ] = await Promise.all([
      supabase.from("tender_sources").select("*", { count: "exact", head: true }),
      supabase.from("tender_sources").select("*", { count: "exact", head: true }).eq("scraping_enabled", true),
      supabase.from("scraped_tenders").select("*", { count: "exact", head: true }),
      supabase.from("scraped_tenders").select("*", { count: "exact", head: true }).eq("is_active", true),
      supabase
        .from("tender_sources")
        .select("id, name, last_scraped_at, last_scrape_status, total_tenders_scraped")
        .not("last_scraped_at", "is", null)
        .order("last_scraped_at", { ascending: false })
        .limit(10),
    ])

    // Get tenders by level
    const { data: tendersByLevel } = await supabase.from("scraped_tenders").select("source_level").eq("is_active", true)

    const levelCounts = tendersByLevel?.reduce((acc: any, t: any) => {
      acc[t.source_level] = (acc[t.source_level] || 0) + 1
      return acc
    }, {})

    return Response.json({
      totalSources: totalSources || 0,
      activeSources: activeSources || 0,
      totalTenders: totalTenders || 0,
      activeTenders: activeTenders || 0,
      tendersByLevel: levelCounts || {},
      recentScrapes: recentScrapes || [],
    })
  } catch (error) {
    console.error("[API] Stats fetch error:", error)
    return Response.json({ error: "Failed to fetch stats" }, { status: 500 })
  }
}
