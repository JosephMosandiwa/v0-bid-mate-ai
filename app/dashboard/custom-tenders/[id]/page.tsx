import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { CustomTenderDetailClient } from "./custom-tender-detail-client"

export default async function CustomTenderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const cookieStore = await cookies()
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (cookies) => {
        cookies.forEach(({ name, value, options }) => {
          cookieStore.set(name, value, options)
        })
      },
    },
  })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: tender, error: tenderError } = await supabase
    .from("user_custom_tenders")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single()

  if (tenderError || !tender) {
    console.error("[v0] Tender not found:", tenderError)
    redirect("/dashboard/tenders")
  }

  const { data: documents } = await supabase
    .from("user_custom_tender_documents")
    .select("*")
    .eq("tender_id", id)
    .order("created_at", { ascending: false })

  const { data: analysisData } = await supabase
    .from("user_custom_tender_analysis")
    .select("*")
    .eq("tender_id", id)
    .order("created_at", { ascending: false })
    .limit(1)
    .single()

  return (
    <CustomTenderDetailClient
      tender={tender}
      documents={documents || []}
      analysis={analysisData?.analysis_data || null}
    />
  )
}
