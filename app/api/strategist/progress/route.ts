import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const tenderId = searchParams.get("tenderId")
    const tenderType = searchParams.get("tenderType") || "custom"

    if (!tenderId) {
      return NextResponse.json({ error: "Tender ID required" }, { status: 400 })
    }

    // Get progress logs
    const { data: logs, error: logsError } = await supabase
      .from("tender_progress_logs")
      .select("*")
      .eq("tender_id", tenderId)
      .eq("tender_type", tenderType)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (logsError) throw logsError

    // Get current tender status
    let currentStatus = null
    if (tenderType === "custom") {
      const { data } = await supabase
        .from("user_custom_tenders")
        .select("progress_status, progress_percent, last_progress_update, submission_date, outcome")
        .eq("id", tenderId)
        .eq("user_id", user.id)
        .single()
      currentStatus = data
    }

    return NextResponse.json({
      logs: logs || [],
      current: currentStatus,
    })
  } catch (error) {
    console.error("[Strategist] Progress fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { tenderId, tenderType = "custom", status, progressPercent, milestone, notes } = body

    if (!tenderId || !status) {
      return NextResponse.json({ error: "Tender ID and status required" }, { status: 400 })
    }

    // Log progress
    const { data: log, error: logError } = await supabase
      .from("tender_progress_logs")
      .insert({
        tender_id: tenderId,
        tender_type: tenderType,
        user_id: user.id,
        status,
        progress_percent: progressPercent || 0,
        milestone,
        notes,
      })
      .select()
      .single()

    if (logError) throw logError

    // Update tender status
    if (tenderType === "custom") {
      const { error: updateError } = await supabase
        .from("user_custom_tenders")
        .update({
          progress_status: status,
          progress_percent: progressPercent || 0,
          last_progress_update: new Date().toISOString(),
        })
        .eq("id", tenderId)
        .eq("user_id", user.id)

      if (updateError) throw updateError
    }

    return NextResponse.json({ log })
  } catch (error) {
    console.error("[Strategist] Progress update error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
