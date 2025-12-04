import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase/server"
import { BOQPageClient } from "./boq-page-client"

export const metadata: Metadata = {
  title: "Bill of Quantities | BidMate AI",
  description: "Create and manage BOQs with AI-powered pricing suggestions",
}

export default async function BOQPage() {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Get user's saved BOQs
  const { data: boqs } = await supabase
    .from("tender_boqs")
    .select("*, tenders(title, reference_number)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(20)

  return <BOQPageClient initialBoqs={boqs || []} userId={user.id} />
}
