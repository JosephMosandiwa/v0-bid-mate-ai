-- Align company fields with onboarding data collection
-- Add missing fields to companies table that are collected during onboarding

ALTER TABLE companies ADD COLUMN IF NOT EXISTS contact_phone TEXT;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS cidb_grade TEXT;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS industries JSONB DEFAULT '[]'::jsonb;

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_companies_industries ON companies USING gin(industries);
CREATE INDEX IF NOT EXISTS idx_companies_cidb_grade ON companies(cidb_grade);

COMMENT ON COLUMN companies.contact_phone IS 'Company contact phone number collected during onboarding';
COMMENT ON COLUMN companies.cidb_grade IS 'CIDB grading (1-9 or GB) collected during onboarding';
COMMENT ON COLUMN companies.industries IS 'Array of industries the company operates in';
