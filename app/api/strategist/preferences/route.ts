// ============================================
// AI STRATEGIST - PREFERENCES ENDPOINT
// ============================================

import { createClient } from "@/lib/supabase/server"
import { StrategistService } from "@/lib/engines/strategist"

export async function GET(request: Request) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const preferences = await StrategistService.getUserPreferences(user.id)

    return Response.json({
      preferences,
      onboarding_completed: preferences?.onboarding_completed || false,
    })
  } catch (error: any) {
    console.error("[Strategist] Preferences GET error:", error)
    return Response.json({ error: "Failed to fetch preferences" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const updates = await request.json()

    const preferences = await StrategistService.updateUserPreferences(user.id, updates)

    if (!preferences) {
      return Response.json({ error: "Failed to update preferences" }, { status: 500 })
    }

    return Response.json({
      preferences,
      message: "Preferences updated successfully",
    })
  } catch (error: any) {
    console.error("[Strategist] Preferences POST error:", error)
    return Response.json({ error: "Failed to update preferences" }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { action } = await request.json()

    if (action === "complete_onboarding") {
      const success = await StrategistService.completeOnboarding(user.id)
      if (!success) {
        return Response.json({ error: "Failed to complete onboarding" }, { status: 500 })
      }
      return Response.json({ message: "Onboarding completed" })
    }

    return Response.json({ error: "Invalid action" }, { status: 400 })
  } catch (error: any) {
    console.error("[Strategist] Preferences PATCH error:", error)
    return Response.json({ error: "Failed to process request" }, { status: 500 })
  }
}
