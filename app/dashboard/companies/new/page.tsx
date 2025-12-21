import { OnboardingWizard } from "@/app/onboarding/onboarding-wizard"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function NewCompanyPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  return <OnboardingWizard userId={user.id} userEmail={user.email || ""} mode="add-company" />
}
