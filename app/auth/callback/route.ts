import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const origin = requestUrl.origin

  if (code) {
    const supabase = await createClient()
    const {
      data: { session },
    } = await supabase.auth.exchangeCodeForSession(code)

    if (session?.user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("onboarding_completed")
        .eq("id", session.user.id)
        .single()

      // If no profile exists or onboarding not completed, redirect to onboarding
      if (!profile || !profile.onboarding_completed) {
        return NextResponse.redirect(`${origin}/onboarding`)
      }
    }
  }

  // Redirect to dashboard after successful OAuth (only if onboarding completed)
  return NextResponse.redirect(`${origin}/dashboard`)
}
