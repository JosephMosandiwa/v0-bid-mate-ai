-- Add support for multiple companies per user
-- Drop the user_id unique constraint from companies table
ALTER TABLE companies DROP CONSTRAINT IF EXISTS companies_user_id_key;

-- Add new fields to companies table
ALTER TABLE companies ADD COLUMN IF NOT EXISTS is_primary BOOLEAN DEFAULT false;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS is_archived BOOLEAN DEFAULT false;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS knowledge_base_id UUID;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_companies_user_id ON companies(user_id);
CREATE INDEX IF NOT EXISTS idx_companies_is_primary ON companies(user_id, is_primary) WHERE is_primary = true;

-- Update RLS policies to support multiple companies
DROP POLICY IF EXISTS "Users can view their own company" ON companies;
DROP POLICY IF EXISTS "Users can update their own company" ON companies;
DROP POLICY IF EXISTS "Users can insert their own company" ON companies;
DROP POLICY IF EXISTS "Users can delete their own company" ON companies;

CREATE POLICY "Users can manage their own companies"
  ON companies FOR ALL
  USING (auth.uid() = user_id);

-- Add company_id to knowledge base for multi-company support
ALTER TABLE company_knowledge_base ADD COLUMN IF NOT EXISTS company_id UUID REFERENCES companies(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_knowledge_base_company ON company_knowledge_base(company_id);

-- Add company_id to compliance documents
ALTER TABLE onboarding_compliance_documents ADD COLUMN IF NOT EXISTS company_id UUID REFERENCES companies(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_compliance_docs_company ON onboarding_compliance_documents(company_id);

-- Function to ensure at least one primary company
CREATE OR REPLACE FUNCTION ensure_primary_company()
RETURNS TRIGGER AS $$
BEGIN
  -- If this is being set as primary, unset others for this user
  IF NEW.is_primary = true THEN
    UPDATE companies 
    SET is_primary = false 
    WHERE user_id = NEW.user_id 
      AND id != NEW.id 
      AND is_primary = true;
  END IF;
  
  -- If this is the only company for the user, make it primary
  IF NOT EXISTS (
    SELECT 1 FROM companies 
    WHERE user_id = NEW.user_id 
      AND is_primary = true 
      AND id != NEW.id
  ) THEN
    NEW.is_primary = true;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS ensure_primary_company_trigger ON companies;
CREATE TRIGGER ensure_primary_company_trigger
  BEFORE INSERT OR UPDATE ON companies
  FOR EACH ROW
  EXECUTE FUNCTION ensure_primary_company();
