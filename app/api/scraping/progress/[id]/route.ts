import { createClient } from "@supabase/supabase-js"
import type { NextRequest } from "next/server"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

    const { data, error } = await supabase.from("scraping_progress").select("*").eq("id", id).single()

    if (error) {
      return Response.json({ error: "Progress not found" }, { status: 404 })
    }

    return Response.json(data)
  } catch (error) {
    console.error("[v0] Error fetching progress:", error)
    return Response.json({ error: "Failed to fetch progress" }, { status: 500 })
  }
}
