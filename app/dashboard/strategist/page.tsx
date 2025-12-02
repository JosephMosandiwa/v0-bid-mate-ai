import { StrategistPageClient } from "./strategist-page-client"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export const metadata = {
  title: "AI Tender Strategist | BidMate",
  description: "Your personal AI assistant for tendering strategy, pricing guidance, and opportunity planning.",
}

export default async function StrategistPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Get user preferences to check onboarding
  const { data: preferences } = await supabase
    .from("strategist_user_preferences")
    .select("onboarding_completed")
    .eq("user_id", user.id)
    .single()

  return <StrategistPageClient showOnboarding={!preferences?.onboarding_completed} />
}
