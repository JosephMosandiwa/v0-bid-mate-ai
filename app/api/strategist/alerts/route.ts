// ============================================
// AI STRATEGIST - ALERTS ENDPOINT
// ============================================

import { createClient } from "@/lib/supabase/server"
import { AlertService } from "@/lib/engines/strategist"
import type { AlertPriority } from "@/lib/engines/strategist"

export async function GET(request: Request) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const unreadOnly = searchParams.get("unread") === "true"
    const priority = searchParams.get("priority") as AlertPriority | undefined
    const limit = Number.parseInt(searchParams.get("limit") || "20")

    const alerts = await AlertService.getUserAlerts(user.id, {
      unreadOnly,
      priority,
      limit,
    })

    const unreadCount = await AlertService.getUnreadCount(user.id)

    return Response.json({ alerts, unreadCount })
  } catch (error: any) {
    console.error("[Strategist] Alerts error:", error)
    return Response.json({ error: "Failed to fetch alerts" }, { status: 500 })
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

    const { alert_id, action } = await request.json()

    if (!alert_id || !action) {
      return Response.json({ error: "Alert ID and action required" }, { status: 400 })
    }

    let success = false

    switch (action) {
      case "read":
        success = await AlertService.markAsRead(alert_id)
        break
      case "dismiss":
        success = await AlertService.dismissAlert(alert_id)
        break
      case "action":
        success = await AlertService.markAsActioned(alert_id)
        break
      default:
        return Response.json({ error: "Invalid action" }, { status: 400 })
    }

    if (!success) {
      return Response.json({ error: "Failed to update alert" }, { status: 500 })
    }

    return Response.json({ success: true })
  } catch (error: any) {
    console.error("[Strategist] Alerts PATCH error:", error)
    return Response.json({ error: "Failed to update alert" }, { status: 500 })
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

    const { action } = await request.json()

    if (action === "generate") {
      await AlertService.generateComplianceAlerts(user.id)
      return Response.json({ message: "Alerts generated" })
    }

    return Response.json({ error: "Invalid action" }, { status: 400 })
  } catch (error: any) {
    console.error("[Strategist] Alerts POST error:", error)
    return Response.json({ error: "Failed to generate alerts" }, { status: 500 })
  }
}
