"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Calendar,
  Target,
  Users,
  Truck,
  AlertTriangle,
  CheckCircle2,
  Clock,
  DollarSign,
  Shield,
  FileText,
  Briefcase,
  TrendingUp,
} from "lucide-react"

interface ProjectPhase {
  phase_number: number
  phase_name: string
  duration_weeks: number
  key_activities: string[]
  deliverables: string[]
  milestones: {
    name: string
    target_date: string
    payment_linked: boolean
    payment_percent?: number
  }[]
  resources_required: string[]
  risks: {
    risk: string
    mitigation: string
  }[]
}

interface ProjectPlanData {
  project_overview: {
    title: string
    objective: string
    scope_summary: string
    contract_type: string
    contract_duration_months: number
    start_date_anticipated?: string
    end_date_anticipated?: string
  }
  phases: ProjectPhase[]
  resource_requirements: {
    key_personnel: {
      role: string
      qualifications_required: string
      quantity: number
      duration: string
      estimated_monthly_cost?: number
    }[]
    equipment: {
      item: string
      quantity: number
      owned_or_hired: string
      duration_needed: string
    }[]
    materials: {
      category: string
      description: string
      estimated_value?: number
    }[]
    subcontractors: {
      scope: string
      requirements: string
      estimated_value_percent?: number
    }[]
  }
  budget_breakdown: {
    labour_percent: number
    materials_percent: number
    equipment_percent: number
    overheads_percent: number
    profit_percent: number
  }
  quality_management: {
    standards_applicable: string[]
    inspections: string[]
    testing_requirements: string[]
    documentation_required: string[]
  }
  health_safety_environment: {
    hse_plan_required: boolean
    certifications_required: string[]
    specific_hazards: string[]
    environmental_requirements: string[]
  }
  reporting_requirements: {
    progress_reports: string
    meeting_frequency: string
    documentation: string[]
  }
}

interface TenderProjectPlanDisplayProps {
  projectPlan: ProjectPlanData | null
}

export function TenderProjectPlanDisplay({ projectPlan }: TenderProjectPlanDisplayProps) {
  if (!projectPlan) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-muted-foreground" />
            Project Plan
          </CardTitle>
          <CardDescription>No project plan available</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            A project plan will be generated after analyzing the tender documents.
          </p>
        </CardContent>
      </Card>
    )
  }

  const totalWeeks = projectPlan.phases?.reduce((sum, p) => sum + (p.duration_weeks || 0), 0) || 0
  const totalMilestones = projectPlan.phases?.reduce((sum, p) => sum + (p.milestones?.length || 0), 0) || 0

  return (
    <div className="space-y-6">
      {/* Project Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Project Overview
          </CardTitle>
          <CardDescription>{projectPlan.project_overview?.title}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {projectPlan.project_overview?.objective && (
            <div>
              <h4 className="text-sm font-medium mb-1">Objective</h4>
              <p className="text-sm text-muted-foreground">{projectPlan.project_overview.objective}</p>
            </div>
          )}
          {projectPlan.project_overview?.scope_summary && (
            <div>
              <h4 className="text-sm font-medium mb-1">Scope Summary</h4>
              <p className="text-sm text-muted-foreground">{projectPlan.project_overview.scope_summary}</p>
            </div>
          )}
          <Separator />
          <div className="grid gap-4 md:grid-cols-4">
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <p className="text-2xl font-bold text-primary">{projectPlan.project_overview?.contract_duration_months || 0}</p>
              <p className="text-xs text-muted-foreground">Months Duration</p>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <p className="text-2xl font-bold text-primary">{projectPlan.phases?.length || 0}</p>
              <p className="text-xs text-muted-foreground">Project Phases</p>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <p className="text-2xl font-bold text-primary">{totalWeeks}</p>
              <p className="text-xs text-muted-foreground">Total Weeks</p>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <p className="text-2xl font-bold text-primary">{totalMilestones}</p>
              <p className="text-xs text-muted-foreground">Key Milestones</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {projectPlan.project_overview?.contract_type && (
              <Badge variant="outline">{projectPlan.project_overview.contract_type}</Badge>
            )}
            {projectPlan.project_overview?.start_date_anticipated && (
              <Badge variant="outline">
                <Calendar className="h-3 w-3 mr-1" />
                Start: {projectPlan.project_overview.start_date_anticipated}
              </Badge>
            )}
            {projectPlan.project_overview?.end_date_anticipated && (
              <Badge variant="outline">
                <Calendar className="h-3 w-3 mr-1" />
                End: {projectPlan.project_overview.end_date_anticipated}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Project Phases */}
      {projectPlan.phases && projectPlan.phases.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Project Phases & Timeline
            </CardTitle>
            <CardDescription>Detailed breakdown of project execution</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="multiple" defaultValue={["phase-0"]} className="w-full">
              {projectPlan.phases.map((phase, index) => (
                <AccordionItem key={index} value={`phase-${index}`}>
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-4 w-full pr-4">
                      <Badge variant="outline" className="shrink-0">Phase {phase.phase_number}</Badge>
                      <span className="font-medium flex-1 text-left">{phase.phase_name}</span>
                      <span className="text-sm text-muted-foreground">{phase.duration_weeks} weeks</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-4">
                    {/* Key Activities */}
                    {phase.key_activities && phase.key_activities.length > 0 && (
                      <div>
                        <h5 className="text-sm font-medium mb-2 flex items-center gap-2">
                          <Briefcase className="h-4 w-4" />
                          Key Activities
                        </h5>
                        <ul className="space-y-1">
                          {phase.key_activities.map((activity, i) => (
                            <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                              <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 shrink-0" />
                              {activity}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Deliverables */}
                    {phase.deliverables && phase.deliverables.length > 0 && (
                      <div>
                        <h5 className="text-sm font-medium mb-2 flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          Deliverables
                        </h5>
                        <div className="flex flex-wrap gap-2">
                          {phase.deliverables.map((deliverable, i) => (
                            <Badge key={i} variant="secondary">{deliverable}</Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Milestones */}
                    {phase.milestones && phase.milestones.length > 0 && (
                      <div>
                        <h5 className="text-sm font-medium mb-2 flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4" />
                          Milestones
                        </h5>
                        <div className="space-y-2">
                          {phase.milestones.map((milestone, i) => (
                            <div key={i} className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                              <div className="flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 text-green-600" />
                                <span className="text-sm">{milestone.name}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground">{milestone.target_date}</span>
                                {milestone.payment_linked && milestone.payment_percent && (
                                  <Badge variant="outline" className="text-xs">
                                    <DollarSign className="h-3 w-3 mr-1" />
                                    {milestone.payment_percent}%
                                  </Badge>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Risks */}
                    {phase.risks && phase.risks.length > 0 && (
                      <div>
                        <h5 className="text-sm font-medium mb-2 flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-amber-500" />
                          Phase Risks & Mitigations
                        </h5>
                        <div className="space-y-2">
                          {phase.risks.map((risk, i) => (
                            <div key={i} className="p-2 bg-amber-50 dark:bg-amber-950/20 rounded-lg">
                              <p className="text-sm font-medium text-amber-700 dark:text-amber-400">{risk.risk}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                <span className="font-medium">Mitigation:</span> {risk.mitigation}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      )}

      {/* Resource Requirements */}
      {projectPlan.resource_requirements && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Resource Requirements
            </CardTitle>
            <CardDescription>Personnel, equipment, and materials needed</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Key Personnel */}
            {projectPlan.resource_requirements.key_personnel && projectPlan.resource_requirements.key_personnel.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Key Personnel
                </h4>
                <div className="grid gap-3 md:grid-cols-2">
                  {projectPlan.resource_requirements.key_personnel.map((person, i) => (
                    <div key={i} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm">{person.role}</span>
                        <Badge variant="outline">x{person.quantity}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{person.qualifications_required}</p>
                      <p className="text-xs text-muted-foreground mt-1">Duration: {person.duration}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Equipment */}
            {projectPlan.resource_requirements.equipment && projectPlan.resource_requirements.equipment.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                  <Truck className="h-4 w-4" />
                  Equipment
                </h4>
                <div className="grid gap-2">
                  {projectPlan.resource_requirements.equipment.map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-2 bg-muted/50 rounded-lg text-sm">
                      <span>{item.item}</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">x{item.quantity}</Badge>
                        <Badge variant={item.owned_or_hired === "owned" ? "default" : "secondary"}>
                          {item.owned_or_hired}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Subcontractors */}
            {projectPlan.resource_requirements.subcontractors && projectPlan.resource_requirements.subcontractors.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  Subcontractors
                </h4>
                <div className="space-y-2">
                  {projectPlan.resource_requirements.subcontractors.map((sub, i) => (
                    <div key={i} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm">{sub.scope}</span>
                        {sub.estimated_value_percent && (
                          <Badge variant="outline">{sub.estimated_value_percent}% of value</Badge>
                        )}
                      </div>
                      {sub.requirements && (
                        <p className="text-xs text-muted-foreground">{sub.requirements}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Budget Breakdown */}
      {projectPlan.budget_breakdown && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" />
              Budget Breakdown
            </CardTitle>
            <CardDescription>Estimated cost distribution</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(projectPlan.budget_breakdown).map(([key, value]) => (
              <div key={key} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="capitalize">{key.replace(/_/g, " ").replace(" percent", "")}</span>
                  <span className="text-muted-foreground">{value}%</span>
                </div>
                <Progress value={value as number} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Quality & HSE */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Quality Management */}
        {projectPlan.quality_management && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Quality Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {projectPlan.quality_management.standards_applicable && projectPlan.quality_management.standards_applicable.length > 0 && (
                <div>
                  <h5 className="text-xs font-medium text-muted-foreground mb-1">Standards</h5>
                  <div className="flex flex-wrap gap-1">
                    {projectPlan.quality_management.standards_applicable.map((std, i) => (
                      <Badge key={i} variant="outline" className="text-xs">{std}</Badge>
                    ))}
                  </div>
                </div>
              )}
              {projectPlan.quality_management.inspections && projectPlan.quality_management.inspections.length > 0 && (
                <div>
                  <h5 className="text-xs font-medium text-muted-foreground mb-1">Inspections</h5>
                  <ul className="text-xs space-y-1">
                    {projectPlan.quality_management.inspections.map((item, i) => (
                      <li key={i} className="flex items-start gap-1">
                        <CheckCircle2 className="h-3 w-3 mt-0.5 text-green-600 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Health, Safety & Environment */}
        {projectPlan.health_safety_environment && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Health, Safety & Environment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {projectPlan.health_safety_environment.hse_plan_required && (
                <Badge variant="destructive" className="text-xs">HSE Plan Required</Badge>
              )}
              {projectPlan.health_safety_environment.certifications_required && projectPlan.health_safety_environment.certifications_required.length > 0 && (
                <div>
                  <h5 className="text-xs font-medium text-muted-foreground mb-1">Certifications</h5>
                  <div className="flex flex-wrap gap-1">
                    {projectPlan.health_safety_environment.certifications_required.map((cert, i) => (
                      <Badge key={i} variant="outline" className="text-xs">{cert}</Badge>
                    ))}
                  </div>
                </div>
              )}
              {projectPlan.health_safety_environment.specific_hazards && projectPlan.health_safety_environment.specific_hazards.length > 0 && (
                <div>
                  <h5 className="text-xs font-medium text-muted-foreground mb-1">Hazards</h5>
                  <ul className="text-xs space-y-1">
                    {projectPlan.health_safety_environment.specific_hazards.map((hazard, i) => (
                      <li key={i} className="flex items-start gap-1">
                        <AlertTriangle className="h-3 w-3 mt-0.5 text-amber-500 shrink-0" />
                        {hazard}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
