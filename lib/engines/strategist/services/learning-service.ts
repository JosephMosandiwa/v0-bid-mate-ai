// ============================================
// AI TENDER STRATEGIST - LEARNING SERVICE
// ============================================

import { createClient } from "@/lib/supabase/server"
import { LEARNING_TOPICS } from "../constants"
import type { StrategistLearningProgress } from "../types"

export class LearningService {
  /**
   * Get all learning topics
   */
  static getTopics(): typeof LEARNING_TOPICS {
    return LEARNING_TOPICS
  }

  /**
   * Get learning progress for a user
   */
  static async getUserProgress(userId: string): Promise<StrategistLearningProgress[]> {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("strategist_learning_progress")
      .select("*")
      .eq("user_id", userId)
      .order("last_accessed_at", { ascending: false, nullsFirst: false })

    if (error) {
      console.error("[Learning] Error fetching progress:", error)
      return []
    }

    return data || []
  }

  /**
   * Get progress for a specific topic
   */
  static async getTopicProgress(userId: string, topicId: string): Promise<StrategistLearningProgress | null> {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("strategist_learning_progress")
      .select("*")
      .eq("user_id", userId)
      .eq("topic_id", topicId)
      .single()

    if (error && error.code !== "PGRST116") {
      console.error("[Learning] Error fetching topic progress:", error)
      return null
    }

    return data
  }

  /**
   * Update learning progress
   */
  static async updateProgress(
    userId: string,
    topicId: string,
    updates: {
      progress_percent?: number
      lesson_completed?: string
      quiz_score?: { quiz_id: string; score: number }
      time_spent_minutes?: number
    },
  ): Promise<StrategistLearningProgress | null> {
    const supabase = await createClient()

    // Get current progress
    const { data: current } = await supabase
      .from("strategist_learning_progress")
      .select("*")
      .eq("user_id", userId)
      .eq("topic_id", topicId)
      .single()

    const topic = LEARNING_TOPICS.find((t) => t.id === topicId)
    if (!topic) return null

    const lessonsCompleted = current?.lessons_completed || []
    const quizScores = current?.quiz_scores || []
    let progressPercent = current?.progress_percent || 0
    let timeSpent = current?.time_spent_minutes || 0

    // Update lessons completed
    if (updates.lesson_completed && !lessonsCompleted.includes(updates.lesson_completed)) {
      lessonsCompleted.push(updates.lesson_completed)
      // Calculate progress based on subtopics
      progressPercent = Math.round((lessonsCompleted.length / topic.subtopics.length) * 100)
    }

    // Update quiz scores
    if (updates.quiz_score) {
      const existingIndex = quizScores.findIndex((q: any) => q.quiz_id === updates.quiz_score!.quiz_id)
      if (existingIndex >= 0) {
        quizScores[existingIndex] = { ...updates.quiz_score, completed_at: new Date().toISOString() }
      } else {
        quizScores.push({ ...updates.quiz_score, completed_at: new Date().toISOString() })
      }
    }

    // Update time spent
    if (updates.time_spent_minutes) {
      timeSpent += updates.time_spent_minutes
    }

    // Override progress if explicitly set
    if (updates.progress_percent !== undefined) {
      progressPercent = updates.progress_percent
    }

    const { data, error } = await supabase
      .from("strategist_learning_progress")
      .upsert(
        {
          user_id: userId,
          topic_id: topicId,
          topic_category: topic.category,
          progress_percent: progressPercent,
          lessons_completed: lessonsCompleted,
          quiz_scores: quizScores,
          time_spent_minutes: timeSpent,
          last_accessed_at: new Date().toISOString(),
          completed_at: progressPercent >= 100 ? new Date().toISOString() : null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id, topic_id" },
      )
      .select()
      .single()

    if (error) {
      console.error("[Learning] Error updating progress:", error)
      return null
    }

    return data
  }

  /**
   * Get recommended topics for user
   */
  static async getRecommendedTopics(userId: string): Promise<(typeof LEARNING_TOPICS)[number][]> {
    const supabase = await createClient()

    // Get user's experience level
    const { data: preferences } = await supabase
      .from("strategist_user_preferences")
      .select("experience_level")
      .eq("user_id", userId)
      .single()

    const experienceLevel = preferences?.experience_level || "beginner"

    // Get completed topics
    const progress = await this.getUserProgress(userId)
    const completedTopicIds = progress.filter((p) => p.progress_percent >= 100).map((p) => p.topic_id)

    // Filter and prioritize topics
    const recommendations = LEARNING_TOPICS.filter((topic) => {
      // Exclude completed
      if (completedTopicIds.includes(topic.id)) return false

      // Match difficulty to experience
      if (experienceLevel === "beginner" && topic.difficulty === "advanced") return false
      if (experienceLevel === "intermediate" && topic.difficulty === "advanced") {
        // Only show advanced if basics are done
        const hasBasics = completedTopicIds.some((id) =>
          LEARNING_TOPICS.find((t) => t.id === id && t.category === "basics"),
        )
        if (!hasBasics) return false
      }

      return true
    }).slice(0, 5)

    return recommendations
  }

  /**
   * Get overall learning statistics
   */
  static async getLearningStats(userId: string): Promise<{
    totalTopics: number
    completedTopics: number
    totalTimeMinutes: number
    averageQuizScore: number
    topCategories: string[]
  }> {
    const progress = await this.getUserProgress(userId)

    const completedTopics = progress.filter((p) => p.progress_percent >= 100).length
    const totalTimeMinutes = progress.reduce((sum, p) => sum + p.time_spent_minutes, 0)

    const allQuizScores = progress.flatMap((p) => p.quiz_scores || [])
    const averageQuizScore =
      allQuizScores.length > 0 ? allQuizScores.reduce((sum, q: any) => sum + q.score, 0) / allQuizScores.length : 0

    // Find top categories by progress
    const categoryProgress: Record<string, number> = {}
    progress.forEach((p) => {
      if (!categoryProgress[p.topic_category]) {
        categoryProgress[p.topic_category] = 0
      }
      categoryProgress[p.topic_category] += p.progress_percent
    })

    const topCategories = Object.entries(categoryProgress)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([category]) => category)

    return {
      totalTopics: LEARNING_TOPICS.length,
      completedTopics,
      totalTimeMinutes,
      averageQuizScore,
      topCategories,
    }
  }
}
