import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import type { NextRequest } from "next/server"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        cookies: {
          getAll: () => cookieStore.getAll(),
          setAll: (cookies) => {
            cookies.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          },
        },
      }
    )

    // Try to get documents from tender_documents table (for scraped tenders)
    const { data: scrapedDocs, error: scrapedError } = await supabase
      .from("tender_documents")
      .select("*")
      .eq("tender_id", id)
      .order("created_at", { ascending: false })

    if (!scrapedError && scrapedDocs && scrapedDocs.length > 0) {
      return Response.json({ documents: scrapedDocs })
    }

    // Also try user_tender_documents for user-uploaded documents
    const { data: userDocs, error: userError } = await supabase
      .from("user_tender_documents")
      .select("*")
      .eq("tender_id", id)
      .order("created_at", { ascending: false })

    if (!userError && userDocs) {
      return Response.json({ documents: userDocs })
    }

    return Response.json({ documents: [] })
  } catch (error: any) {
    console.error("[v0] Error fetching tender documents:", error)
    return Response.json({ error: "Failed to fetch documents" }, { status: 500 })
  }
}
