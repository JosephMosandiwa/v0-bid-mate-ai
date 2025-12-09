import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// This route is called by Vercel Cron
export const maxDuration = 60

export async function GET(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get("authorization")
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

    // Get users subscribed to weekly digest
    const { data: subscriptions, error: subError } = await supabase
      .from("strategist_digest_subscriptions")
      .select("*")
      .eq("is_subscribed", true)
      .eq("frequency", "weekly")

    if (subError) {
      console.error("Error fetching subscriptions:", subError)
      return NextResponse.json({ error: "Failed to fetch subscriptions" }, { status: 500 })
    }

    const results = []

    for (const subscription of subscriptions || []) {
      try {
        // Get user's preferences
        const { data: preferences } = await supabase
          .from("strategist_user_preferences")
          .select("*")
          .eq("user_id", subscription.user_id)
          .single()

        const { data: opportunities } = await supabase
          .from("strategist_opportunities")
          .select("*")
          .eq("user_id", subscription.user_id)
          .eq("is_dismissed", false)
          .order("match_score", { ascending: false })
          .limit(5)

        // Fetch tender data for opportunities
        let opportunitiesWithTenders: any[] = []
        if (opportunities && opportunities.length > 0) {
          const tenderIds = opportunities.map((o) => o.scraped_tender_id).filter((id): id is string => id !== null)

          if (tenderIds.length > 0) {
            const { data: tenders } = await supabase
              .from("scraped_tenders")
              .select("id, title, source_name, close_date")
              .in("id", tenderIds)

            const tendersMap = (tenders || []).reduce(
              (acc, t) => {
                acc[t.id] = t
                return acc
              },
              {} as Record<string, any>,
            )

            opportunitiesWithTenders = opportunities.map((opp) => ({
              ...opp,
              scraped_tender: opp.scraped_tender_id ? tendersMap[opp.scraped_tender_id] : null,
            }))
          }
        }

        // Get unread alerts
        const { data: alerts } = await supabase
          .from("strategist_alerts")
          .select("*")
          .eq("user_id", subscription.user_id)
          .eq("is_read", false)
          .order("created_at", { ascending: false })
          .limit(3)

        // Get learning suggestions
        const { data: learningProgress } = await supabase
          .from("strategist_learning_progress")
          .select("*")
          .eq("user_id", subscription.user_id)
          .lt("progress_percent", 100)
          .order("progress_percent", { ascending: true })
          .limit(2)

        // Build digest content
        const digestContent = {
          user_id: subscription.user_id,
          opportunities: opportunitiesWithTenders,
          alerts: alerts || [],
          learning: learningProgress || [],
          tips: generateWeeklyTips(preferences),
        }

        console.log(`Digest prepared for user ${subscription.user_id}:`, digestContent)

        // Update last_sent_at
        await supabase
          .from("strategist_digest_subscriptions")
          .update({ last_sent_at: new Date().toISOString() })
          .eq("id", subscription.id)

        results.push({ user_id: subscription.user_id, status: "success" })
      } catch (error) {
        console.error(`Error processing digest for user ${subscription.user_id}:`, error)
        results.push({ user_id: subscription.user_id, status: "error", error: String(error) })
      }
    }

    return NextResponse.json({
      success: true,
      processed: results.length,
      results,
    })
  } catch (error) {
    console.error("Cron job error:", error)
    return NextResponse.json({ error: "Cron job failed" }, { status: 500 })
  }
}

function generateWeeklyTips(preferences: any): string[] {
  const tips: string[] = [
    "Always submit your tender documents at least 24 hours before the deadline to avoid last-minute issues.",
    "Keep digital copies of all your compliance documents in one folder for quick access.",
    "Review the evaluation criteria carefully - functionality often counts more than price.",
  ]

  if (preferences?.experience_level === "beginner") {
    tips.push("Start with smaller tenders (under R500,000) to build your track record.")
    tips.push("Consider partnering with experienced companies through joint ventures.")
  }

  if (preferences?.industries?.includes("construction")) {
    tips.push("Ensure your CIDB grading is current and matches the tender requirements.")
  }

  return tips.slice(0, 3)
}
