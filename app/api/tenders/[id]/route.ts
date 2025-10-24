import { createClient } from "@/lib/supabase/server"
import type { NextRequest } from "next/server"

function isValidUUID(id: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  return uuidRegex.test(id)
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    if (!isValidUUID(id)) {
      console.log("[v0] Invalid UUID format:", id)
      return Response.json({ error: "Invalid tender ID format" }, { status: 400 })
    }

    const supabase = await createClient()

    const { data: tender, error } = await supabase.from("scraped_tenders").select("*").eq("id", id).single()

    if (error || !tender) {
      return Response.json({ error: "Tender not found" }, { status: 404 })
    }

    return Response.json({ tender })
  } catch (error) {
    console.error("[API] Error fetching tender:", error)
    return Response.json({ error: "Failed to fetch tender" }, { status: 500 })
  }
}
