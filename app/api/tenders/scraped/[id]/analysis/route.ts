import { createClient } from "@supabase/supabase-js"
import { type NextRequest, NextResponse } from "next/server"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function GET(request: NextRequest, context: any) {
  try {
    const paramsObj = context?.params ? await context.params : context?.params ?? context
    const tenderId = (paramsObj as { id?: string }).id

    console.log("[v0] Fetching analysis for tender:", tenderId)

    // Check if analysis already exists
    const { data: existingAnalysis, error: fetchError } = await supabase
      .from("tender_analysis")
      .select("*")
      .eq("tender_id", tenderId)
      .single()

    if (fetchError && fetchError.code !== "PGRST116") {
      console.error("[v0] Error fetching analysis:", fetchError)
      return NextResponse.json({ error: "Failed to fetch analysis" }, { status: 500 })
    }

    if (existingAnalysis) {
      console.log("[v0] Found existing analysis")
      return NextResponse.json({
        success: true,
        analysis: existingAnalysis.analysis_data,
        cached: true,
        analyzedAt: existingAnalysis.analyzed_at,
      })
    }

    console.log("[v0] No existing analysis found")
    return NextResponse.json({
      success: true,
      analysis: null,
      cached: false,
    })
  } catch (error) {
    console.error("[v0] Error in analysis route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, context: any) {
  try {
    const paramsObj = context?.params ? await context.params : context?.params ?? context
    const tenderId = (paramsObj as { id?: string }).id
    const { analysis } = await request.json()

    console.log("[v0] Saving analysis for tender:", tenderId)

    // Save or update analysis
    const { data, error } = await supabase
      .from("tender_analysis")
      .upsert({
        tender_id: tenderId,
        analysis_data: analysis,
        analyzed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error("[v0] Error saving analysis:", error)
      return NextResponse.json({ error: "Failed to save analysis" }, { status: 500 })
    }

    console.log("[v0] Analysis saved successfully")
    return NextResponse.json({
      success: true,
      analysis: data,
    })
  } catch (error) {
    console.error("[v0] Error in analysis save route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
