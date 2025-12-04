import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase/server"
import { OnboardingWizard } from "./onboarding-wizard"

export const metadata = {
  title: "Complete Your Profile | BidMate AI",
  description: "Set up your company profile to get personalized tender recommendations",
}

export default async function OnboardingPage() {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Check if user has already completed onboarding
  const { data: profile } = await supabase.from("profiles").select("onboarding_completed").eq("id", user.id).single()

  if (profile?.onboarding_completed) {
    redirect("/dashboard")
  }

  return <OnboardingWizard userId={user.id} userEmail={user.email || ""} />
}
