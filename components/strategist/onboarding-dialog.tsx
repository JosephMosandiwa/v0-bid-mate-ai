"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Sparkles, ChevronRight, ChevronLeft, Check } from "lucide-react"
import { useStrategistPreferences } from "@/hooks/use-strategist"
import { SA_PROVINCES, INDUSTRIES, COMPANY_SIZES, CIDB_GRADINGS, BEE_LEVELS } from "@/lib/engines/strategist/constants"

interface StrategistOnboardingDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function StrategistOnboardingDialog({ open, onOpenChange }: StrategistOnboardingDialogProps) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    experience_level: "",
    industries: [] as string[],
    procurement_categories: [] as string[],
    provinces: [] as string[],
    company_size: "",
    cidb_grading: "",
    bee_level: "",
    has_tax_clearance: false,
    has_coida: false,
    has_csd_registration: false,
    risk_tolerance: "",
  })

  const { updatePreferences, completeOnboarding } = useStrategistPreferences()
  const [saving, setSaving] = useState(false)

  const totalSteps = 4

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1)
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const handleComplete = async () => {
    setSaving(true)
    try {
      await updatePreferences(formData)
      await completeOnboarding()
      onOpenChange(false)
    } catch (error) {
      console.error("Failed to save preferences:", error)
    } finally {
      setSaving(false)
    }
  }

  const toggleArrayValue = (array: string[], value: string): string[] => {
    return array.includes(value) ? array.filter((v) => v !== value) : [...array, value]
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div>
              <DialogTitle>Welcome to AI Strategist</DialogTitle>
              <DialogDescription>Let's personalize your experience</DialogDescription>
            </div>
          </div>
          <Progress value={(step / totalSteps) * 100} className="h-1" />
        </DialogHeader>

        <div className="py-4">
          {/* Step 1: Experience Level */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-foreground mb-2">What's your tendering experience level?</h3>
                <p className="text-sm text-muted-foreground mb-4">This helps us tailor advice to your needs.</p>
              </div>
              <RadioGroup
                value={formData.experience_level}
                onValueChange={(value) => setFormData({ ...formData, experience_level: value })}
                className="space-y-3"
              >
                <div className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer">
                  <RadioGroupItem value="beginner" id="beginner" />
                  <Label htmlFor="beginner" className="flex-1 cursor-pointer">
                    <div className="font-medium">Beginner</div>
                    <div className="text-xs text-muted-foreground">New to tendering, want to learn the basics</div>
                  </Label>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer">
                  <RadioGroupItem value="intermediate" id="intermediate" />
                  <Label htmlFor="intermediate" className="flex-1 cursor-pointer">
                    <div className="font-medium">Intermediate</div>
                    <div className="text-xs text-muted-foreground">
                      Some experience, looking to improve success rate
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer">
                  <RadioGroupItem value="advanced" id="advanced" />
                  <Label htmlFor="advanced" className="flex-1 cursor-pointer">
                    <div className="font-medium">Advanced</div>
                    <div className="text-xs text-muted-foreground">Experienced, seeking strategic optimization</div>
                  </Label>
                </div>
              </RadioGroup>
            </div>
          )}

          {/* Step 2: Industry & Procurement */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-foreground mb-2">Your Focus Areas</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Select industries and procurement categories you're interested in.
                </p>
              </div>

              <div className="space-y-3">
                <Label>Industries (select all that apply)</Label>
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                  {INDUSTRIES.slice(0, 10).map((industry) => (
                    <div key={industry.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={industry.value}
                        checked={formData.industries.includes(industry.value)}
                        onCheckedChange={() =>
                          setFormData({
                            ...formData,
                            industries: toggleArrayValue(formData.industries, industry.value),
                          })
                        }
                      />
                      <Label htmlFor={industry.value} className="text-sm cursor-pointer">
                        {industry.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Label>Provinces (select all that apply)</Label>
                <div className="grid grid-cols-2 gap-2">
                  {SA_PROVINCES.map((province) => (
                    <div key={province.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={province.value}
                        checked={formData.provinces.includes(province.value)}
                        onCheckedChange={() =>
                          setFormData({
                            ...formData,
                            provinces: toggleArrayValue(formData.provinces, province.value),
                          })
                        }
                      />
                      <Label htmlFor={province.value} className="text-sm cursor-pointer">
                        {province.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Company Profile */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-foreground mb-2">Company Profile</h3>
                <p className="text-sm text-muted-foreground mb-4">Help us understand your company's capabilities.</p>
              </div>

              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label>Company Size</Label>
                  <Select
                    value={formData.company_size}
                    onValueChange={(value) => setFormData({ ...formData, company_size: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select company size" />
                    </SelectTrigger>
                    <SelectContent>
                      {COMPANY_SIZES.map((size) => (
                        <SelectItem key={size.value} value={size.value}>
                          {size.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>B-BBEE Level</Label>
                  <Select
                    value={formData.bee_level}
                    onValueChange={(value) => setFormData({ ...formData, bee_level: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select B-BBEE level" />
                    </SelectTrigger>
                    <SelectContent>
                      {BEE_LEVELS.map((level) => (
                        <SelectItem key={level.value} value={level.value}>
                          {level.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>CIDB Grading (if applicable)</Label>
                  <Select
                    value={formData.cidb_grading}
                    onValueChange={(value) => setFormData({ ...formData, cidb_grading: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select CIDB grading" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Not applicable</SelectItem>
                      {CIDB_GRADINGS.map((grade) => (
                        <SelectItem key={grade.value} value={grade.value}>
                          {grade.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Compliance Status */}
          {step === 4 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-foreground mb-2">Compliance Status</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Let us know your current compliance status so we can alert you to gaps.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 rounded-lg border border-border">
                  <Checkbox
                    id="tax_clearance"
                    checked={formData.has_tax_clearance}
                    onCheckedChange={(checked) => setFormData({ ...formData, has_tax_clearance: checked as boolean })}
                  />
                  <Label htmlFor="tax_clearance" className="flex-1 cursor-pointer">
                    <div className="font-medium">Valid Tax Clearance</div>
                    <div className="text-xs text-muted-foreground">SARS Tax Compliance Status (TCS)</div>
                  </Label>
                </div>

                <div className="flex items-center space-x-3 p-3 rounded-lg border border-border">
                  <Checkbox
                    id="csd"
                    checked={formData.has_csd_registration}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, has_csd_registration: checked as boolean })
                    }
                  />
                  <Label htmlFor="csd" className="flex-1 cursor-pointer">
                    <div className="font-medium">CSD Registration</div>
                    <div className="text-xs text-muted-foreground">Central Supplier Database registration</div>
                  </Label>
                </div>

                <div className="flex items-center space-x-3 p-3 rounded-lg border border-border">
                  <Checkbox
                    id="coida"
                    checked={formData.has_coida}
                    onCheckedChange={(checked) => setFormData({ ...formData, has_coida: checked as boolean })}
                  />
                  <Label htmlFor="coida" className="flex-1 cursor-pointer">
                    <div className="font-medium">COIDA Letter</div>
                    <div className="text-xs text-muted-foreground">Letter of Good Standing from Compensation Fund</div>
                  </Label>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                <p className="text-sm text-foreground">
                  Based on your profile, we'll provide personalized alerts for document expiry, compliance gaps, and
                  matching tender opportunities.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <Button variant="ghost" onClick={handleBack} disabled={step === 1}>
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back
          </Button>

          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              Step {step} of {totalSteps}
            </span>
          </div>

          {step < totalSteps ? (
            <Button onClick={handleNext}>
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          ) : (
            <Button onClick={handleComplete} disabled={saving}>
              {saving ? (
                "Saving..."
              ) : (
                <>
                  <Check className="h-4 w-4 mr-1" />
                  Complete
                </>
              )}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
