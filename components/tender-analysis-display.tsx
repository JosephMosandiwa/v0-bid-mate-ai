"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import {
  Building2,
  Calendar,
  Clock,
  FileText,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  DollarSign,
  Users,
  Briefcase,
  Scale,
  Truck,
  Award,
  Target,
  ListChecks,
  MapPin,
  Mail,
  Phone,
  FileCheck,
  Gavel,
  Shield,
  TrendingUp,
  ClipboardList,
} from "lucide-react"

interface TenderAnalysisDisplayProps {
  analysis: any
  tender: any
}

export function TenderAnalysisDisplay({ analysis, tender }: TenderAnalysisDisplayProps) {
  if (!analysis) return null

  const {
    tender_summary,
    compliance_summary,
    evaluation,
    action_plan,
    financial_requirements,
    legal_registration,
    labour_employment,
    technical_specs,
    submission_requirements,
    bbbee_requirements,
    risk_assessment,
  } = analysis

  // Calculate days until deadline
  const closingDate = tender_summary?.closing_date || tender?.close_date
  const daysUntilClose = closingDate
    ? Math.ceil((new Date(closingDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null

  return (
    <div className="space-y-6">
      {/* Tender Summary Card */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Tender Summary
              </CardTitle>
              <CardDescription>Key information extracted from tender documents</CardDescription>
            </div>
            {daysUntilClose !== null && (
              <Badge
                variant={daysUntilClose <= 7 ? "destructive" : daysUntilClose <= 14 ? "secondary" : "outline"}
                className="text-sm"
              >
                {daysUntilClose > 0 ? `${daysUntilClose} days left` : daysUntilClose === 0 ? "Closes today" : "Closed"}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {tender_summary?.tender_number && (
              <InfoRow icon={FileCheck} label="Tender Number" value={tender_summary.tender_number} highlight />
            )}
            {tender_summary?.entity && (
              <InfoRow icon={Building2} label="Issuing Entity" value={tender_summary.entity} />
            )}
            {tender_summary?.closing_date && (
              <InfoRow
                icon={Calendar}
                label="Closing Date"
                value={new Date(tender_summary.closing_date).toLocaleDateString("en-ZA", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
                highlight
              />
            )}
            {tender_summary?.submission_method && (
              <InfoRow icon={MapPin} label="Submission Method" value={tender_summary.submission_method} />
            )}
            {tender_summary?.compulsory_briefing && tender_summary.compulsory_briefing !== "Not specified" && (
              <InfoRow
                icon={Users}
                label="Compulsory Briefing"
                value={tender_summary.compulsory_briefing}
                highlight
              />
            )}
            {tender_summary?.validity_period && tender_summary.validity_period !== "Not specified" && (
              <InfoRow icon={Clock} label="Validity Period" value={tender_summary.validity_period} />
            )}
            {tender_summary?.contract_duration && tender_summary.contract_duration !== "Not specified" && (
              <InfoRow icon={Calendar} label="Contract Duration" value={tender_summary.contract_duration} />
            )}
            {tender_summary?.contact_email && tender_summary.contact_email !== "Not specified" && (
              <InfoRow icon={Mail} label="Contact Email" value={tender_summary.contact_email} />
            )}
          </div>
          {tender_summary?.description && (
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm text-muted-foreground leading-relaxed">{tender_summary.description}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Compliance Requirements */}
      {compliance_summary && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-xl flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Compliance Requirements
            </CardTitle>
            <CardDescription>Mandatory requirements, disqualifiers, and strengthening factors</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Requirements */}
            {compliance_summary.requirements?.length > 0 && (
              <div>
                <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  Mandatory Requirements
                </h4>
                <ul className="space-y-2">
                  {compliance_summary.requirements.map((req: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-600 mt-2 shrink-0" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Disqualifiers */}
            {compliance_summary.disqualifiers?.length > 0 && (
              <div>
                <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-red-600" />
                  Disqualification Criteria
                </h4>
                <ul className="space-y-2">
                  {compliance_summary.disqualifiers.map((item: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-red-700 dark:text-red-400">
                      <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Strengtheners */}
            {compliance_summary.strengtheners?.length > 0 && (
              <div>
                <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                  Bid Strengthening Factors
                </h4>
                <ul className="space-y-2">
                  {compliance_summary.strengtheners.map((item: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-blue-700 dark:text-blue-400">
                      <Award className="h-4 w-4 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Evaluation Criteria */}
      {evaluation && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-xl flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Evaluation Criteria
            </CardTitle>
            <CardDescription>How your bid will be scored and evaluated</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {evaluation.criteria?.length > 0 && (
              <div className="space-y-3">
                {evaluation.criteria.map((criterion: any, i: number) => (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{criterion.criterion}</span>
                      <span className="text-muted-foreground">{criterion.weight}%</span>
                    </div>
                    <Progress value={criterion.weight} className="h-2" />
                  </div>
                ))}
              </div>
            )}
            <Separator />
            <div className="grid gap-3 md:grid-cols-2 text-sm">
              {evaluation.threshold && evaluation.threshold !== "Not specified" && (
                <div>
                  <span className="text-muted-foreground">Minimum Threshold:</span>
                  <span className="ml-2 font-medium">{evaluation.threshold}</span>
                </div>
              )}
              {evaluation.pricing_system && evaluation.pricing_system !== "Not specified" && (
                <div>
                  <span className="text-muted-foreground">Pricing System:</span>
                  <span className="ml-2 font-medium">{evaluation.pricing_system}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Financial Requirements */}
      {financial_requirements && hasContent(financial_requirements) && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-xl flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" />
              Financial Requirements
            </CardTitle>
            <CardDescription>Financial capacity and documentation required</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {renderIfSpecified(financial_requirements.financial_turnover, "Annual Turnover", DollarSign)}
              {renderIfSpecified(financial_requirements.bank_guarantee, "Bank Guarantee", Shield)}
              {renderIfSpecified(financial_requirements.performance_bond, "Performance Bond", FileCheck)}
              {renderIfSpecified(financial_requirements.audited_financials, "Audited Financials", FileText)}
              {renderIfSpecified(financial_requirements.payment_terms, "Payment Terms", Clock)}
            </div>
            {financial_requirements.insurance_requirements?.length > 0 && (
              <div className="mt-4 pt-4 border-t">
                <h4 className="font-semibold text-sm mb-2">Insurance Requirements</h4>
                <ul className="space-y-1">
                  {financial_requirements.insurance_requirements.map((item: string, i: number) => (
                    <li key={i} className="text-sm flex items-center gap-2">
                      <Shield className="h-3 w-3 text-muted-foreground" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Legal & Registration */}
      {legal_registration && hasContent(legal_registration) && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-xl flex items-center gap-2">
              <Gavel className="h-5 w-5 text-primary" />
              Legal & Registration Requirements
            </CardTitle>
            <CardDescription>Required registrations and legal compliance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {renderIfSpecified(legal_registration.cidb_grading, "CIDB Grading", Award)}
              {renderIfSpecified(legal_registration.cipc_registration, "CIPC Registration", FileCheck)}
              {renderIfSpecified(legal_registration.joint_venture_requirements, "JV Requirements", Users)}
              {renderIfSpecified(legal_registration.subcontracting_limitations, "Subcontracting Limits", Briefcase)}
            </div>
            {legal_registration.professional_registration?.length > 0 && (
              <div className="mt-4 pt-4 border-t">
                <h4 className="font-semibold text-sm mb-2">Professional Registrations</h4>
                <div className="flex flex-wrap gap-2">
                  {legal_registration.professional_registration.map((reg: string, i: number) => (
                    <Badge key={i} variant="outline">
                      {reg}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* BBBEE Requirements */}
      {bbbee_requirements && hasContent(bbbee_requirements) && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-xl flex items-center gap-2">
              <Scale className="h-5 w-5 text-primary" />
              BBBEE & Transformation Requirements
            </CardTitle>
            <CardDescription>Broad-Based Black Economic Empowerment requirements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {renderIfSpecified(bbbee_requirements.minimum_level, "Minimum BBBEE Level", Award)}
              {renderIfSpecified(bbbee_requirements.points_allocation, "Points Allocation", Target)}
              {renderIfSpecified(bbbee_requirements.local_content, "Local Content", MapPin)}
              {renderIfSpecified(bbbee_requirements.ownership_requirements, "Ownership Requirements", Users)}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Labour & Employment */}
      {labour_employment && hasContent(labour_employment) && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-xl flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Labour & Employment Requirements
            </CardTitle>
            <CardDescription>Staffing, local content, and employment requirements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {renderIfSpecified(labour_employment.local_content, "Local Content", MapPin)}
              {renderIfSpecified(labour_employment.subcontracting_limit, "Subcontracting Limit", Briefcase)}
              {renderIfSpecified(labour_employment.labour_composition, "Labour Composition", Users)}
              {renderIfSpecified(labour_employment.skills_development, "Skills Development", Award)}
              {renderIfSpecified(labour_employment.employment_equity, "Employment Equity", Scale)}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Technical Specifications */}
      {technical_specs && hasContent(technical_specs) && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-xl flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-primary" />
              Technical Requirements
            </CardTitle>
            <CardDescription>Experience, personnel, and capability requirements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {renderIfSpecified(technical_specs.minimum_experience, "Minimum Experience", Clock)}
              {renderIfSpecified(technical_specs.project_references, "Project References", FileText)}
              {renderIfSpecified(technical_specs.methodology_requirements, "Methodology", Target)}
            </div>
            {technical_specs.key_personnel?.length > 0 && (
              <div className="mt-4 pt-4 border-t">
                <h4 className="font-semibold text-sm mb-2">Key Personnel Required</h4>
                <ul className="space-y-1">
                  {technical_specs.key_personnel.map((person: string, i: number) => (
                    <li key={i} className="text-sm flex items-center gap-2">
                      <Users className="h-3 w-3 text-muted-foreground" />
                      {person}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {technical_specs.equipment_resources?.length > 0 && (
              <div className="mt-4 pt-4 border-t">
                <h4 className="font-semibold text-sm mb-2">Equipment & Resources</h4>
                <ul className="space-y-1">
                  {technical_specs.equipment_resources.map((item: string, i: number) => (
                    <li key={i} className="text-sm flex items-center gap-2">
                      <Truck className="h-3 w-3 text-muted-foreground" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Submission Requirements */}
      {submission_requirements && hasContent(submission_requirements) && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-xl flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-primary" />
              Submission Requirements
            </CardTitle>
            <CardDescription>How to submit your bid</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {renderIfSpecified(submission_requirements.number_of_copies, "Number of Copies", FileText)}
              {renderIfSpecified(submission_requirements.formatting_requirements, "Formatting", FileCheck)}
              {renderIfSpecified(submission_requirements.query_deadline, "Query Deadline", Clock)}
              {renderIfSpecified(submission_requirements.late_submission_policy, "Late Submissions", AlertTriangle)}
            </div>
            {submission_requirements.submission_address &&
              submission_requirements.submission_address !== "Not specified" && (
                <div className="mt-4 pt-4 border-t">
                  <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Submission Address
                  </h4>
                  <p className="text-sm text-muted-foreground whitespace-pre-line">
                    {submission_requirements.submission_address}
                  </p>
                </div>
              )}
          </CardContent>
        </Card>
      )}

      {/* Critical Dates Timeline */}
      {action_plan?.critical_dates?.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-xl flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Critical Dates
            </CardTitle>
            <CardDescription>Important dates and deadlines</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {action_plan.critical_dates.map((item: any, i: number) => (
                <div key={i} className="flex items-start gap-4 p-3 rounded-lg bg-muted/50">
                  <div className="shrink-0 w-24">
                    <p className="text-sm font-semibold">
                      {new Date(item.date).toLocaleDateString("en-ZA", { month: "short", day: "numeric" })}
                    </p>
                    {item.time && <p className="text-xs text-muted-foreground">{item.time}</p>}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{item.event}</p>
                    {item.location && <p className="text-xs text-muted-foreground">{item.location}</p>}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Preparation Tasks */}
      {action_plan?.preparation_tasks?.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-xl flex items-center gap-2">
              <ListChecks className="h-5 w-5 text-primary" />
              Preparation Tasks
            </CardTitle>
            <CardDescription>Tasks to complete for your bid submission</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {action_plan.preparation_tasks.map((task: any, i: number) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                >
                  <div
                    className={`shrink-0 w-2 h-2 rounded-full mt-2 ${
                      task.priority === "High"
                        ? "bg-red-500"
                        : task.priority === "Medium"
                          ? "bg-yellow-500"
                          : "bg-green-500"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{task.task}</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      <Badge
                        variant={
                          task.priority === "High"
                            ? "destructive"
                            : task.priority === "Medium"
                              ? "secondary"
                              : "outline"
                        }
                        className="text-xs"
                      >
                        {task.priority}
                      </Badge>
                      {task.category && (
                        <Badge variant="outline" className="text-xs">
                          {task.category}
                        </Badge>
                      )}
                      {task.deadline && <span className="text-xs text-muted-foreground">Due: {task.deadline}</span>}
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

// Helper component for displaying info rows
function InfoRow({
  icon: Icon,
  label,
  value,
  highlight = false,
}: {
  icon: any
  label: string
  value: string
  highlight?: boolean
}) {
  if (!value || value === "Not specified") return null
  return (
    <div className="flex items-start gap-3">
      <Icon className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className={`text-sm ${highlight ? "font-semibold" : ""}`}>{value}</p>
      </div>
    </div>
  )
}

// Helper to render a field only if it has a value
function renderIfSpecified(value: string | undefined, label: string, Icon: any) {
  if (!value || value === "Not specified") return null
  return (
    <div className="flex items-start gap-3">
      <Icon className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm">{value}</p>
      </div>
    </div>
  )
}

// Helper to check if an object has any meaningful content
function hasContent(obj: any): boolean {
  if (!obj) return false
  return Object.values(obj).some((val) => {
    if (Array.isArray(val)) return val.length > 0
    if (typeof val === "string") return val && val !== "Not specified"
    return Boolean(val)
  })
}
