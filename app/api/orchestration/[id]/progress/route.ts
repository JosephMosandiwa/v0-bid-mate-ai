import { createClient } from "@/lib/supabase/server"
import { NextRequest } from "next/server"

export const dynamic = 'force-dynamic'

/**
 * GET /api/orchestration/[id]/progress
 * 
 * Returns real-time progress for a tender orchestration
 */
export async function GET(request: NextRequest, context: any) {
    try {
        const paramsObj = context?.params ? await context.params : context?.params ?? context
        const orchestrationId = (paramsObj as { id?: string }).id
        const supabase = await createClient()

        // Get current user
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) {
            return Response.json({ error: "Unauthorized" }, { status: 401 })
        }

        // Get orchestration progress
        const { data: progress, error } = await supabase
            .from('tender_orchestration_progress')
            .select('*')
            .eq('id', orchestrationId)
            .eq('user_id', user.id)
            .single()

        if (error || !progress) {
            return Response.json({ error: "Orchestration not found" }, { status: 404 })
        }

        // Calculate estimated completion time if still processing
        let estimatedCompletion = progress.estimated_completion
        if (progress.status === 'processing' && !estimatedCompletion) {
            const startedAt = new Date(progress.started_at)
            const now = new Date()
            const elapsed = now.getTime() - startedAt.getTime()

            // Estimate based on current progress
            if (progress.overall_progress > 0) {
                const totalEstimated = (elapsed / progress.overall_progress) * 100
                const remaining = totalEstimated - elapsed
                estimatedCompletion = new Date(now.getTime() + remaining).toISOString()
            } else {
                // Default estimate: 60 seconds
                estimatedCompletion = new Date(now.getTime() + 60000).toISOString()
            }
        }

        // Return progress data
        return Response.json({
            orchestrationId: progress.id,
            tenderId: progress.tender_id,
            status: progress.status,
            overallProgress: progress.overall_progress,
            engines: progress.engines,
            phase1Completed: progress.phase1_completed,
            phase2Completed: progress.phase2_completed,
            startedAt: progress.started_at,
            completedAt: progress.completed_at,
            estimatedCompletion,
            updatedAt: progress.updated_at
        })
    } catch (error: any) {
        console.error('[v0] Progress tracking error:', error)
        return Response.json(
            { error: "Failed to fetch progress", details: error.message },
            { status: 500 }
        )
    }
}
