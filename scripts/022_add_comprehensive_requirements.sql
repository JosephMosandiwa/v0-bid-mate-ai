-- Add comprehensive requirements tracking to project plans
ALTER TABLE tender_project_plans 
ADD COLUMN IF NOT EXISTS certifications_required jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS insurance_requirements jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS compliance_checklist jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS regulatory_requirements jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS financial_requirements jsonb DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS capacity_requirements jsonb DEFAULT '{}'::jsonb;

-- Add RLS policies for the new columns
-- (No changes needed - existing RLS policies cover all columns)

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_tender_project_plans_tender_lookup 
ON tender_project_plans(tender_id, tender_type, user_id);

COMMENT ON COLUMN tender_project_plans.certifications_required IS 'Array of required certifications: [{name, issuer, validity_period, cost, processing_time, priority}]';
COMMENT ON COLUMN tender_project_plans.insurance_requirements IS 'Array of insurance policies needed: [{type, coverage_amount, provider_suggestions, annual_cost, priority}]';
COMMENT ON COLUMN tender_project_plans.compliance_checklist IS 'Compliance items: [{requirement, status, deadline, evidence_needed, notes}]';
COMMENT ON COLUMN tender_project_plans.regulatory_requirements IS 'Regulatory compliance: [{regulation, description, authority, deadline, penalties}]';
COMMENT ON COLUMN tender_project_plans.financial_requirements IS 'Financial readiness: {bank_guarantee, cash_flow_requirements, working_capital, credit_facilities}';
COMMENT ON COLUMN tender_project_plans.capacity_requirements IS 'Capacity demonstration: {past_projects, references, equipment_owned, personnel_qualifications}';
