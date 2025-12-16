"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  DollarSign,
  Calendar,
  Users,
  AlertTriangle,
  Award,
  Shield,
  CheckCircle2,
  FileText,
  Briefcase,
  Building,
  Clock,
  TrendingUp,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface ComprehensivePlanViewProps {
  plan: any
  className?: string
}

export function ComprehensivePlanView({ plan, className }: ComprehensivePlanViewProps) {
  if (!plan) {
    return (
      <Alert>
        <AlertDescription>
          No project plan generated yet. Generate a plan to see comprehensive requirements.
        </AlertDescription>
      </Alert>
    )
  }

  const totalBudget = plan.estimated_budget?.total || 0
  const totalWeeks = plan.estimated_timeline?.total_weeks || 0

  return (
    <div className={cn("space-y-6", className)}>
      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R {totalBudget.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Including all costs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Timeline</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalWeeks} weeks</div>
            <p className="text-xs text-muted-foreground mt-1">{plan.estimated_timeline?.phases?.length || 0} phases</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Certifications</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{plan.certifications_required?.length || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Required certificates</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Insurance</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{plan.insurance_requirements?.length || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Policies needed</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Plan Tabs */}
      <Tabs defaultValue="budget" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
          <TabsTrigger value="budget">Budget</TabsTrigger>
          <TabsTrigger value="certifications">Certifications</TabsTrigger>
          <TabsTrigger value="insurance">Insurance</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="capacity">Capacity</TabsTrigger>
        </TabsList>

        {/* Budget Tab */}
        <TabsContent value="budget" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Budget Breakdown</CardTitle>
              <CardDescription>Detailed cost analysis for the project</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {plan.estimated_budget?.breakdown && (
                <div className="space-y-3">
                  {Object.entries(plan.estimated_budget.breakdown).map(([category, amount]: [string, any]) => {
                    const percentage = (amount / totalBudget) * 100
                    return (
                      <div key={category} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="capitalize font-medium">{category.replace("_", " ")}</span>
                          <span className="font-bold">R {amount.toLocaleString()}</span>
                        </div>
                        <Progress value={percentage} className="h-2" />
                        <span className="text-xs text-muted-foreground">{percentage.toFixed(1)}% of total</span>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Certifications Tab */}
        <TabsContent value="certifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Required Certifications</CardTitle>
              <CardDescription>All certificates and licenses needed for this tender</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {plan.certifications_required?.map((cert: any, index: number) => (
                  <div key={index} className="border rounded-lg p-4 space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h4 className="font-semibold flex items-center gap-2">
                          {cert.name}
                          <Badge variant={cert.priority === "critical" ? "destructive" : "secondary"}>
                            {cert.priority}
                          </Badge>
                        </h4>
                        <p className="text-sm text-muted-foreground">Issued by: {cert.issuer}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">R {cert.cost.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">{cert.processing_time}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>Valid for: {cert.validity_period}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Insurance Tab */}
        <TabsContent value="insurance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Insurance Requirements</CardTitle>
              <CardDescription>Policies needed to bid and execute this project</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {plan.insurance_requirements?.map((insurance: any, index: number) => (
                  <div key={index} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h4 className="font-semibold flex items-center gap-2">
                          {insurance.type}
                          <Badge variant={insurance.priority === "critical" ? "destructive" : "secondary"}>
                            {insurance.priority}
                          </Badge>
                        </h4>
                        <p className="text-sm">Coverage: R {insurance.coverage_amount.toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">R {insurance.annual_cost.toLocaleString()}/year</p>
                      </div>
                    </div>
                    {insurance.provider_suggestions && insurance.provider_suggestions.length > 0 && (
                      <div>
                        <p className="text-xs font-medium mb-1">Recommended Providers:</p>
                        <div className="flex flex-wrap gap-1">
                          {insurance.provider_suggestions.map((provider: string, i: number) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {provider}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Compliance Tab */}
        <TabsContent value="compliance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Checklist</CardTitle>
              <CardDescription>Track regulatory and compliance requirements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {plan.compliance_checklist?.map((item: any, index: number) => (
                  <div key={index} className="border rounded-lg p-4 space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <CheckCircle2
                            className={cn("h-4 w-4", item.status === "completed" ? "text-green-500" : "text-gray-300")}
                          />
                          <h4 className="font-medium">{item.requirement}</h4>
                        </div>
                        <p className="text-sm text-muted-foreground pl-6">{item.notes}</p>
                      </div>
                      <Badge
                        variant={
                          item.status === "completed"
                            ? "default"
                            : item.status === "in_progress"
                              ? "secondary"
                              : item.status === "not_required"
                                ? "outline"
                                : "destructive"
                        }
                      >
                        {item.status.replace("_", " ")}
                      </Badge>
                    </div>
                    <div className="pl-6 space-y-1">
                      <p className="text-xs">
                        <span className="font-medium">Deadline:</span> {item.deadline}
                      </p>
                      <p className="text-xs">
                        <span className="font-medium">Evidence:</span> {item.evidence_needed}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {plan.regulatory_requirements && plan.regulatory_requirements.length > 0 && (
                <div className="mt-6 space-y-3">
                  <h3 className="font-semibold text-sm">Regulatory Requirements</h3>
                  {plan.regulatory_requirements.map((reg: any, index: number) => (
                    <Alert key={index}>
                      <FileText className="h-4 w-4" />
                      <AlertDescription>
                        <p className="font-medium">{reg.regulation}</p>
                        <p className="text-sm mt-1">{reg.description}</p>
                        <div className="text-xs text-muted-foreground mt-2 space-y-1">
                          <p>Authority: {reg.authority}</p>
                          <p>Deadline: {reg.deadline}</p>
                          {reg.penalties && <p className="text-red-600">Penalties: {reg.penalties}</p>}
                        </div>
                      </AlertDescription>
                    </Alert>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Financial Tab */}
        <TabsContent value="financial" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Financial Requirements</CardTitle>
              <CardDescription>Financial capacity and readiness assessment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {plan.financial_requirements && (
                <>
                  {plan.financial_requirements.bank_guarantee && (
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Building className="h-5 w-5 text-muted-foreground" />
                          <span className="font-medium">Bank Guarantee</span>
                        </div>
                        <span className="text-xl font-bold">
                          R {plan.financial_requirements.bank_guarantee.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="border rounded-lg p-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-muted-foreground" />
                      <span className="font-medium">Working Capital</span>
                    </div>
                    <p className="text-2xl font-bold">
                      R {plan.financial_requirements.working_capital?.toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {plan.financial_requirements.cash_flow_requirements}
                    </p>
                  </div>

                  {plan.financial_requirements.credit_facilities && (
                    <div className="border rounded-lg p-4 space-y-2">
                      <span className="font-medium">Credit Facilities</span>
                      <p className="text-sm text-muted-foreground">{plan.financial_requirements.credit_facilities}</p>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Capacity Tab */}
        <TabsContent value="capacity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Capacity Requirements</CardTitle>
              <CardDescription>Demonstrate your ability to deliver the project</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {plan.capacity_requirements && (
                <>
                  <div className="border rounded-lg p-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-5 w-5 text-muted-foreground" />
                      <span className="font-medium">Past Projects Required</span>
                    </div>
                    <p className="text-sm">{plan.capacity_requirements.past_projects}</p>
                  </div>

                  <div className="border rounded-lg p-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-muted-foreground" />
                      <span className="font-medium">References Needed</span>
                    </div>
                    <p className="text-2xl font-bold">{plan.capacity_requirements.references} contactable references</p>
                  </div>

                  {plan.capacity_requirements.equipment_owned &&
                    plan.capacity_requirements.equipment_owned.length > 0 && (
                      <div className="border rounded-lg p-4 space-y-2">
                        <span className="font-medium">Equipment to Own</span>
                        <ul className="space-y-1">
                          {plan.capacity_requirements.equipment_owned.map((item: string, i: number) => (
                            <li key={i} className="text-sm flex items-center gap-2">
                              <CheckCircle2 className="h-3 w-3 text-green-500" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                  {plan.capacity_requirements.personnel_qualifications &&
                    plan.capacity_requirements.personnel_qualifications.length > 0 && (
                      <div className="border rounded-lg p-4 space-y-2">
                        <span className="font-medium">Personnel Qualifications Required</span>
                        <ul className="space-y-1">
                          {plan.capacity_requirements.personnel_qualifications.map((qual: string, i: number) => (
                            <li key={i} className="text-sm flex items-center gap-2">
                              <Award className="h-3 w-3 text-blue-500" />
                              {qual}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Risks */}
      {plan.risk_assessment?.risks && plan.risk_assessment.risks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Risk Assessment</CardTitle>
            <CardDescription>Identified risks and mitigation strategies</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {plan.risk_assessment.risks.map((risk: any, index: number) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle
                      className={cn(
                        "h-5 w-5 mt-0.5",
                        risk.impact === "high"
                          ? "text-red-500"
                          : risk.impact === "medium"
                            ? "text-orange-500"
                            : "text-yellow-500",
                      )}
                    />
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <h4 className="font-medium">{risk.risk}</h4>
                        <div className="flex gap-2">
                          <Badge variant="outline" className="text-xs">
                            Impact: {risk.impact}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            Likelihood: {risk.likelihood}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium">Mitigation:</span> {risk.mitigation}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
