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

  console.log("[v0] Tender found:", tender)

  const { data: documents } = await supabase
    .from("user_custom_tender_documents")
    .select("*")
    .eq("tender_id", id)
    .order("created_at", { ascending: false })

  console.log("[v0] Documents found:", documents?.length || 0)
  console.log("[v0] Documents data:", JSON.stringify(documents, null, 2))

  const { data: analysisData } = await supabase
    .from("user_custom_tender_analysis")
    .select("*")
    .eq("tender_id", id)
    .order("created_at", { ascending: false })
    .limit(1)
    .single()

  console.log("[v0] ================================================")
  console.log("[v0] CUSTOM TENDER ANALYSIS DEBUG")
  console.log("[v0] ================================================")
  console.log("[v0] Tender ID:", id)
  console.log("[v0] Query result - analysisData exists:", !!analysisData)
  if (analysisData) {
    console.log("[v0] Analysis ID:", analysisData.id)
    console.log("[v0] Analysis data keys:", Object.keys(analysisData.analysis_data || {}))
    console.log("[v0] Has tender_summary:", !!analysisData.analysis_data?.tender_summary)
    console.log("[v0] Has formFields:", analysisData.analysis_data?.formFields?.length || 0)
    console.log("[v0] Has compliance_summary:", !!analysisData.analysis_data?.compliance_summary)
    console.log("[v0] Full analysis structure:", JSON.stringify(analysisData.analysis_data, null, 2))
  } else {
    console.log("[v0] ❌ NO ANALYSIS DATA FOUND IN DATABASE")
    console.log("[v0] This means the analysis was not saved during tender creation")
  }
  console.log("[v0] ================================================")

  return (
    <CustomTenderDetailClient
      tender={tender}
      documents={documents || []}
      analysis={analysisData?.analysis_data || null}
    />
  )
}
