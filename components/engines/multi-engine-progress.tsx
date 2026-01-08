/**
 * Multi-Engine Progress Tracker Component
 * 
 * Displays real-time progress of tender orchestration across multiple AI engines.
 * Polls the progress API and shows status for each engine.
 */

'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import {
    FileText,
    CheckCircle,
    DollarSign,
    Target,
    Shield,
    AlertTriangle,
    Clock,
    Loader2,
    XCircle
} from 'lucide-react'

interface EngineProgress {
    status: 'queued' | 'processing' | 'completed' | 'failed'
    progress: number
    duration?: number
}

interface OrchestrationProgress {
    orchestrationId: string
    tenderId: string
    status: 'processing' | 'completed' | 'partial_failure' | 'failed'
    overallProgress: number
    engines: {
        document?: EngineProgress
        tender_analysis?: EngineProgress
        boq?: EngineProgress
        strategy?: EngineProgress
        readiness?: EngineProgress
        risk?: EngineProgress
        compliance?: EngineProgress
    }
    phase1Completed: boolean
    phase2Completed: boolean
    estimatedCompletion?: string
}

const ENGINE_CONFIGS = {
    document: {
        name: 'Document Analysis',
        icon: FileText,
        description: 'Extracting text and form fields',
        phase: 1
    },
    tender_analysis: {
        name: 'Tender Requirements',
        icon: CheckCircle,
        description: 'Analyzing requirements and criteria',
        phase: 1
    },
    boq: {
        name: 'BOQ Generation',
        icon: DollarSign,
        description: 'Creating bill of quantities',
        phase: 2
    },
    strategy: {
        name: 'Strategy Development',
        icon: Target,
        description: 'Generating bid strategy',
        phase: 2
    },
    readiness: {
        name: 'Readiness Assessment',
        icon: Shield,
        description: 'Evaluating bid readiness',
        phase: 2
    },
    risk: {
        name: 'Risk Assessment',
        icon: AlertTriangle,
        description: 'Identifying potential risks',
        phase: 2
    },
    compliance: {
        name: 'Compliance Check',
        icon: CheckCircle,
        description: 'Validating compliance requirements',
        phase: 2
    }
}

interface MultiEngineProgressProps {
    orchestrationId: string
    onComplete?: () => void
    pollInterval?: number // milliseconds
}

export function MultiEngineProgress({
    orchestrationId,
    onComplete,
    pollInterval = 2000
}: MultiEngineProgressProps) {
    const [progress, setProgress] = useState<OrchestrationProgress | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [isPolling, setIsPolling] = useState(true)

    useEffect(() => {
        if (!orchestrationId || !isPolling) return

        let intervalId: NodeJS.Timeout

        const fetchProgress = async () => {
            try {
                const res = await fetch(`/api/orchestration/${orchestrationId}/progress`)

                if (!res.ok) {
                    throw new Error('Failed to fetch progress')
                }

                const data = await res.json()
                setProgress(data)
                setError(null)

                // Stop polling if orchestration is complete or failed
                if (data.status === 'completed' || data.status === 'failed') {
                    setIsPolling(false)
                    onComplete?.()
                }
            } catch (err: any) {
                console.error('Progress fetch error:', err)
                setError(err.message)
            }
        }

        // Initial fetch
        fetchProgress()

        // Start polling
        intervalId = setInterval(fetchProgress, pollInterval)

        return () => {
            if (intervalId) clearInterval(intervalId)
        }
    }, [orchestrationId, isPolling, pollInterval, onComplete])

    if (error) {
        return (
            <Card className="border-destructive">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-destructive">
                        <XCircle className="h-5 w-5" />
                        Error Tracking Progress
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">{error}</p>
                </CardContent>
            </Card>
        )
    }

    if (!progress) {
        return (
            <Card>
                <CardContent className="py-8">
                    <div className="flex items-center justify-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <p className="text-sm text-muted-foreground">Loading progress...</p>
                    </div>
                </CardContent>
            </Card>
        )
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return 'text-green-600'
            case 'processing': return 'text-blue-600'
            case 'failed': return 'text-destructive'
            case 'partial_failure': return 'text-orange-600'
            default: return 'text-muted-foreground'
        }
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'completed': return <Badge className="bg-green-600">Complete</Badge>
            case 'processing': return <Badge className="bg-blue-600">Processing...</Badge>
            case 'failed': return <Badge variant="destructive">Failed</Badge>
            case 'partial_failure': return <Badge className="bg-orange-600">Partial Success</Badge>
            default: return <Badge variant="outline">Unknown</Badge>
        }
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>AI Analysis Progress</CardTitle>
                        <CardDescription>
                            {progress.phase1Completed
                                ? 'Phase 1 complete - Deep analysis in progress'
                                : 'Analyzing tender document...'}
                        </CardDescription>
                    </div>
                    {getStatusBadge(progress.status)}
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Overall Progress */}
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Overall Progress</span>
                        <span className="text-sm text-muted-foreground">{progress.overallProgress}%</span>
                    </div>
                    <Progress value={progress.overallProgress} className="h-2" />
                    {progress.estimatedCompletion && progress.status === 'processing' && (
                        <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Estimated completion: {new Date(progress.estimatedCompletion).toLocaleTimeString()}
                        </p>
                    )}
                </div>

                {/* Phase 1 Engines */}
                <div>
                    <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                        Phase 1: Critical Analysis
                        {progress.phase1Completed && <CheckCircle className="h-4 w-4 text-green-600" />}
                    </h4>
                    <div className="space-y-3">
                        {Object.entries(ENGINE_CONFIGS)
                            .filter(([_, config]) => config.phase === 1)
                            .map(([key, config]) => {
                                const engineProgress = progress.engines[key as keyof typeof progress.engines]
                                if (!engineProgress) return null

                                return (
                                    <EngineStatusItem
                                        key={key}
                                        name={config.name}
                                        description={config.description}
                                        icon={config.icon}
                                        progress={engineProgress}
                                    />
                                )
                            })}
                    </div>
                </div>

                {/* Phase 2 Engines */}
                {progress.phase1Completed && (
                    <div>
                        <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                            Phase 2: Deep Analysis
                            {progress.phase2Completed && <CheckCircle className="h-4 w-4 text-green-600" />}
                        </h4>
                        <div className="space-y-3">
                            {Object.entries(ENGINE_CONFIGS)
                                .filter(([_, config]) => config.phase === 2)
                                .map(([key, config]) => {
                                    const engineProgress = progress.engines[key as keyof typeof progress.engines]
                                    if (!engineProgress) return null

                                    return (
                                        <EngineStatusItem
                                            key={key}
                                            name={config.name}
                                            description={config.description}
                                            icon={config.icon}
                                            progress={engineProgress}
                                        />
                                    )
                                })}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

interface EngineStatusItemProps {
    name: string
    description: string
    icon: React.ComponentType<{ className?: string }>
    progress: EngineProgress
}

function EngineStatusItem({ name, description, icon: Icon, progress }: EngineStatusItemProps) {
    const getStatusIcon = () => {
        switch (progress.status) {
            case 'completed':
                return <CheckCircle className="h-5 w-5 text-green-600" />
            case 'processing':
                return <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
            case 'failed':
                return <XCircle className="h-5 w-5 text-destructive" />
            default:
                return <Clock className="h-5 w-5 text-muted-foreground" />
        }
    }

    return (
        <div className="flex items-start gap-3">
            <div className="mt-0.5">
                {getStatusIcon()}
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                        <Icon className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                        <p className="text-sm font-medium truncate">{name}</p>
                    </div>
                    {progress.duration && (
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {progress.duration.toFixed(1)}s
                        </span>
                    )}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
                {progress.status === 'processing' && (
                    <Progress value={progress.progress} className="h-1 mt-2" />
                )}
            </div>
        </div>
    )
}
