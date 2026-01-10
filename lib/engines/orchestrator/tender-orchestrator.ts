/**
 * Tender Orchestrator Service
 * 
 * Coordinates multi-engine analysis for tender documents.
 * Manages parallel/sequential execution of engines and tracks progress.
 */

import { createClient } from "@/lib/supabase/server"
import { StrategistService, CompetitivenessService } from "@/lib/engines/strategist"

export interface OrchestrationOptions {
    tenderId: string
    documentUrl?: string
    userId: string
    skipEngines?: string[] // Allow skipping specific engines
}

export interface EngineResult {
    engine: string
    status: 'completed' | 'failed' | 'skipped'
    duration?: number
    error?: string
    data?: any
}

export interface OrchestrationResult {
    orchestrationId: string
    status: 'processing' | 'completed' | 'partial_failure' | 'failed'
    phase1Results: EngineResult[]
    phase2Results: EngineResult[]
    errors: string[]
}

export class TenderOrchestrator {
    private supabase: any
    private orchestrationId: string
    private tenderId: string
    private userId: string

    constructor(options: OrchestrationOptions) {
        this.tenderId = options.tenderId
        this.userId = options.userId
        this.orchestrationId = crypto.randomUUID()
    }

    /**
     * Main entry point - orchestrates all tender analysis engines
     */
    async orchestrateTenderAnalysis(documentUrl?: string): Promise<OrchestrationResult> {
        console.log(`[Orchestrator] Starting orchestration ${this.orchestrationId} for tender ${this.tenderId}`)

        try {
            this.supabase = await createClient()

            // Initialize progress tracking
            await this.initializeProgress()

            // Phase 1: Critical path (sequential)
            console.log(`[Orchestrator] Starting Phase 1 - Critical Analysis`)
            const phase1Results = await this.executePhase1(documentUrl)

            // Check if Phase 1 had critical failures
            const phase1Failed = phase1Results.some(r => r.status === 'failed' && r.engine === 'tender_analysis')
            if (phase1Failed) {
                await this.updateOverallProgress('failed', 50)
                return {
                    orchestrationId: this.orchestrationId,
                    status: 'failed',
                    phase1Results,
                    phase2Results: [],
                    errors: ['Critical analysis failed - cannot proceed to Phase 2']
                }
            }

            // Mark Phase 1 complete
            await this.updatePhaseProgress(1, true)

            // Phase 2: Deep analysis (parallel - non-blocking)
            console.log(`[Orchestrator] Starting Phase 2 - Deep Analysis (parallel)`)

            // Get analysis data for Phase 2 engines
            const analysisData = phase1Results.find(r => r.engine === 'tender_analysis')?.data

            // Fire and don't wait - these run in background
            this.executePhase2Async(analysisData).catch(error => {
                console.error(`[Orchestrator] Phase 2 background execution error:`, error)
            })

            // Return immediately with Phase 1 complete
            return {
                orchestrationId: this.orchestrationId,
                status: 'processing',
                phase1Results,
                phase2Results: [],
                errors: []
            }
        } catch (error: any) {
            console.error(`[Orchestrator] Fatal error:`, error)
            await this.updateOverallProgress('failed', 0)
            throw error
        }
    }

    /**
     * Phase 1: Critical path - must complete before user can proceed
     * - Document analysis (if URL provided)
     * - Tender requirements analysis
     */
    private async executePhase1(documentUrl?: string): Promise<EngineResult[]> {
        const results: EngineResult[] = []

        // Document Analysis (optional)
        if (documentUrl) {
            const docResult = await this.runEngine('document', async () => {
                // Document engine would go here
                // For now, just mark as completed
                return { extracted: true }
            })
            results.push(docResult)
        }

        // Tender Analysis (critical)
        const analysisResult = await this.runEngine('tender_analysis', async () => {
            // Get existing analysis from database
            const { data } = await this.supabase
                .from('user_tender_analysis')
                .select('analysis_data')
                .eq('tender_id', this.tenderId)
                .single()

            return data?.analysis_data
        })
        results.push(analysisResult)

        return results
    }

    /**
     * Phase 2: Deep analysis - runs in parallel, non-blocking
     * - BOQ generation
     * - Strategy generation
     * - Readiness assessment
     * - Risk assessment (future)
     * - Compliance check (future)
     */
    private async executePhase2Async(analysisData: any): Promise<void> {
        console.log(`[Orchestrator] Phase 2 execution started in background`)

        const engines = [
            { name: 'boq', fn: () => this.generateBOQ(analysisData) },
            { name: 'strategy', fn: () => this.generateStrategy(analysisData) },
            { name: 'readiness', fn: () => this.assessReadiness() },
        ]
        try {
            // Run all engines in parallel and collect EngineResult objects
            const results: EngineResult[] = await Promise.all(
                engines.map(async (engine) => {
                    return await this.runEngine(engine.name, engine.fn)
                })
            )

            // Classify results
            const succeeded = results.filter(r => r.status === 'completed')
            const failed = results.filter(r => r.status === 'failed')

            // Ensure engines map in DB reflects final statuses/durations
            const { data: current } = await this.supabase
                .from('tender_orchestration_progress')
                .select('engines, errors')
                .eq('id', this.orchestrationId)
                .single()

            const enginesObj = current?.engines || {}
            results.forEach(r => {
                enginesObj[r.engine] = {
                    status: r.status,
                    progress: r.status === 'completed' ? 100 : 0,
                    duration: r.duration
                }
            })

            const newErrors: string[] = failed.map(f => `${f.engine}: ${f.error || 'unknown'}`)

            await this.supabase
                .from('tender_orchestration_progress')
                .update({
                    engines: enginesObj,
                    phase2_completed: failed.length === 0,
                    phase2_results: results,
                    errors: (current?.errors || []).concat(newErrors),
                    overall_progress: 100,
                    status: failed.length === 0 ? 'completed' : succeeded.length > 0 ? 'partial_failure' : 'failed',
                    updated_at: new Date().toISOString(),
                    completed_at: new Date().toISOString()
                })
                .eq('id', this.orchestrationId)

            console.log(`[Orchestrator] Phase 2 complete - succeeded=${succeeded.length} failed=${failed.length}`)
        } catch (error: any) {
            console.error(`[Orchestrator] Phase 2 background execution error:`, error)

            // Attempt to persist the fatal error to DB
            try {
                const { data: current } = await this.supabase
                    .from('tender_orchestration_progress')
                    .select('errors')
                    .eq('id', this.orchestrationId)
                    .single()

                const updatedErrors = (current?.errors || []).concat([error?.message || String(error)])

                await this.supabase
                    .from('tender_orchestration_progress')
                    .update({
                        status: 'failed',
                        errors: updatedErrors,
                        overall_progress: 100,
                        phase2_completed: false,
                        updated_at: new Date().toISOString(),
                        completed_at: new Date().toISOString()
                    })
                    .eq('id', this.orchestrationId)
            } catch (persistErr) {
                console.error('[Orchestrator] Failed to persist Phase 2 error:', persistErr)
            }
        }
    }

    /**
     * Generic engine runner with error handling and progress tracking
     */
    private async runEngine(
        engineName: string,
        engineFn: () => Promise<any>,
        maxRetries: number = 2
    ): Promise<EngineResult> {
        const startTime = Date.now()

        await this.updateEngineProgress(engineName, 'processing', 0)

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                console.log(`[Orchestrator] Running ${engineName} (attempt ${attempt}/${maxRetries})`)

                const result = await engineFn()
                const duration = (Date.now() - startTime) / 1000

                await this.updateEngineProgress(engineName, 'completed', 100, duration)

                return {
                    engine: engineName,
                    status: 'completed',
                    duration,
                    data: result
                }
            } catch (error: any) {
                console.error(`[Orchestrator] ${engineName} failed (attempt ${attempt}):`, error.message)

                if (attempt === maxRetries) {
                    await this.updateEngineProgress(engineName, 'failed', 0)

                    return {
                        engine: engineName,
                        status: 'failed',
                        error: error.message
                    }
                }

                // Exponential backoff
                await this.sleep(Math.pow(2, attempt) * 1000)
            }
        }

        // Should never reach here
        return {
            engine: engineName,
            status: 'failed',
            error: 'Max retries exceeded'
        }
    }

    /**
     * Engine-specific implementations
     */

    private async generateBOQ(analysisData: any): Promise<any> {
        // Use StrategistService context to produce a lightweight BOQ placeholder
        // (Full BOQ generation via LLM remains in /api/strategist/boq)
        const context = await StrategistService.buildContext(this.userId, this.tenderId, "boq")
        const competitiveness = await CompetitivenessService.getScore(this.userId, this.tenderId)

        // Basic BOQ structure built from context and competitiveness insights
        const boq = {
            boq_items: [],
            pricing_strategy: {
                strategy_type: competitiveness?.win_probability && competitiveness.win_probability > 0.6 ? 'competitive' : 'value_based',
                competitive_analysis: (competitiveness && JSON.stringify(competitiveness.score_breakdown || {})) || '',
                risk_premium_percent: 5,
                discount_offered_percent: 0,
                payment_terms: '30/60 days',
                pricing_rationale: 'Generated from strategist context'
            },
            direct_costs: {},
            indirect_costs: {},
            contingency_percent: 10,
            profit_margin_percent: 15,
            vat_percent: 15,
            generated_from_context: context,
            competitiveness: competitiveness,
        }

        return boq
    }

    private async generateStrategy(analysisData: any): Promise<any> {
        // Generate competitiveness and recommendations via StrategistService
        const competitiveness = await CompetitivenessService.getScore(this.userId, this.tenderId)
        const recommendations = await StrategistService.generateRecommendations({
            userId: this.userId,
            tenderId: this.tenderId,
            tenderType: 'custom',
            competitiveness
        })

        return {
            competitiveness,
            recommendations
        }
    }

    private async assessReadiness(): Promise<any> {
        // Build readiness assessment from strategist context and competitiveness
        const context = await StrategistService.buildContext(this.userId, this.tenderId, 'readiness')
        const competitiveness = await CompetitivenessService.getScore(this.userId, this.tenderId)

        const readiness = {
            context,
            competitiveness,
            recommendations: await StrategistService.generateRecommendations({
                userId: this.userId,
                tenderId: this.tenderId,
                tenderType: 'custom',
                competitiveness
            }),
        }

        return readiness
    }

    /**
     * Progress tracking helpers
     */

    private async initializeProgress(): Promise<void> {
        const engines = {
            document: { status: 'queued', progress: 0 },
            tender_analysis: { status: 'queued', progress: 0 },
            boq: { status: 'queued', progress: 0 },
            strategy: { status: 'queued', progress: 0 },
            readiness: { status: 'queued', progress: 0 },
        }

        await this.supabase.from('tender_orchestration_progress').insert({
            id: this.orchestrationId,
            tender_id: this.tenderId,
            user_id: this.userId,
            status: 'processing',
            overall_progress: 0,
            engines,
            phase1_completed: false,
            phase2_completed: false,
            started_at: new Date().toISOString(),
        })
    }

    private async updateEngineProgress(
        engine: string,
        status: string,
        progress: number,
        duration?: number
    ): Promise<void> {
        const { data: current } = await this.supabase
            .from('tender_orchestration_progress')
            .select('engines')
            .eq('id', this.orchestrationId)
            .single()

        const engines = current?.engines || {}
        engines[engine] = { status, progress, duration }

        await this.supabase
            .from('tender_orchestration_progress')
            .update({
                engines,
                updated_at: new Date().toISOString()
            })
            .eq('id', this.orchestrationId)
    }

    private async updatePhaseProgress(phase: number, completed: boolean): Promise<void> {
        const field = phase === 1 ? 'phase1_completed' : 'phase2_completed'

        await this.supabase
            .from('tender_orchestration_progress')
            .update({
                [field]: completed,
                updated_at: new Date().toISOString()
            })
            .eq('id', this.orchestrationId)
    }

    private async updateOverallProgress(status: string, progress: number): Promise<void> {
        const update: any = {
            status,
            overall_progress: progress,
            updated_at: new Date().toISOString()
        }

        if (status === 'completed' || status === 'failed') {
            update.completed_at = new Date().toISOString()
        }

        await this.supabase
            .from('tender_orchestration_progress')
            .update(update)
            .eq('id', this.orchestrationId)
    }

    private sleep(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms))
    }
}

/**
 * Helper function to start orchestration
 */
export async function orchestrateTenderAnalysis(
    tenderId: string,
    userId: string,
    documentUrl?: string
): Promise<OrchestrationResult> {
    const orchestrator = new TenderOrchestrator({
        tenderId,
        userId,
        documentUrl
    })

    return await orchestrator.orchestrateTenderAnalysis(documentUrl)
}
