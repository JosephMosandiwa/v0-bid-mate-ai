// ============================================
// AI STRATEGIST - LEARNING ENDPOINT
// ============================================

import { createClient } from "@/lib/supabase/server"
import { LearningService } from "@/lib/engines/strategist"

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
    const topicId = searchParams.get("topic_id")
    const recommended = searchParams.get("recommended") === "true"
    const stats = searchParams.get("stats") === "true"

    if (stats) {
      const learningStats = await LearningService.getLearningStats(user.id)
      return Response.json({ stats: learningStats })
    }

    if (recommended) {
      const topics = await LearningService.getRecommendedTopics(user.id)
      return Response.json({ topics })
    }

    if (topicId) {
      const progress = await LearningService.getTopicProgress(user.id, topicId)
      const topics = LearningService.getTopics()
      const topic = topics.find((t) => t.id === topicId)
      return Response.json({ topic, progress })
    }

    // Return all topics with progress
    const topics = LearningService.getTopics()
    const progress = await LearningService.getUserProgress(user.id)

    const topicsWithProgress = topics.map((topic) => ({
      ...topic,
      progress: progress.find((p) => p.topic_id === topic.id) || null,
    }))

    return Response.json({ topics: topicsWithProgress })
  } catch (error: any) {
    console.error("[Strategist] Learning GET error:", error)
    return Response.json({ error: "Failed to fetch learning data" }, { status: 500 })
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

    const { topic_id, lesson_completed, quiz_score, time_spent_minutes } = await request.json()

    if (!topic_id) {
      return Response.json({ error: "Topic ID required" }, { status: 400 })
    }

    const progress = await LearningService.updateProgress(user.id, topic_id, {
      lesson_completed,
      quiz_score,
      time_spent_minutes,
    })

    if (!progress) {
      return Response.json({ error: "Failed to update progress" }, { status: 500 })
    }

    return Response.json({
      progress,
      message: "Progress updated",
    })
  } catch (error: any) {
    console.error("[Strategist] Learning POST error:", error)
    return Response.json({ error: "Failed to update learning progress" }, { status: 500 })
  }
}
