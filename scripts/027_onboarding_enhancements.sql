-- Create compliance documents table for onboarding uploads
CREATE TABLE IF NOT EXISTS onboarding_compliance_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL, -- 'tax_clearance', 'coida', 'cidb', 'bbbee', 'company_profile', 'bank_details', 'insurance', 'other'
  document_name TEXT NOT NULL,
  blob_url TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  file_type TEXT NOT NULL,
  expiry_date DATE, -- For documents that expire
  processed_at TIMESTAMP WITH TIME ZONE,
  extracted_data JSONB, -- Data extracted by Documind
  documind_document_id UUID REFERENCES documind_documents(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create company knowledge base table
CREATE TABLE IF NOT EXISTS company_knowledge_base (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category TEXT NOT NULL, -- 'company_info', 'certifications', 'experience', 'capabilities', 'team', 'projects'
  field_name TEXT NOT NULL, -- e.g., 'company_registration', 'tax_number', 'years_in_business'
  field_value TEXT,
  field_data JSONB, -- For complex/structured data
  source TEXT, -- 'onboarding', 'manual', 'document_extraction', 'tender_submission'
  source_document_id UUID REFERENCES onboarding_compliance_documents(id),
  confidence_score NUMERIC(3,2), -- 0.00 to 1.00
  verified BOOLEAN DEFAULT FALSE,
  last_used_at TIMESTAMP WITH TIME ZONE,
  use_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, category, field_name)
);

-- Create autofill templates table
CREATE TABLE IF NOT EXISTS autofill_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  template_name TEXT NOT NULL,
  template_type TEXT NOT NULL, -- 'sbd1', 'sbd2', 'sbd3', 'mbd1', 'company_profile', 'custom'
  field_mappings JSONB NOT NULL, -- Maps tender form fields to knowledge base fields
  last_used_at TIMESTAMP WITH TIME ZONE,
  use_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE onboarding_compliance_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_knowledge_base ENABLE ROW LEVEL SECURITY;
ALTER TABLE autofill_templates ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage their own compliance documents"
  ON onboarding_compliance_documents
  FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own knowledge base"
  ON company_knowledge_base
  FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own autofill templates"
  ON autofill_templates
  FOR ALL
  USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX idx_onboarding_docs_user ON onboarding_compliance_documents(user_id);
CREATE INDEX idx_onboarding_docs_type ON onboarding_compliance_documents(document_type);
CREATE INDEX idx_knowledge_base_user ON company_knowledge_base(user_id);
CREATE INDEX idx_knowledge_base_category ON company_knowledge_base(category);
CREATE INDEX idx_autofill_templates_user ON autofill_templates(user_id);

-- Add onboarding progress tracking to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS onboarding_step INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS onboarding_progress JSONB DEFAULT '{"step": 0, "completed_steps": []}'::JSONB;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS onboarding_completed_at TIMESTAMP WITH TIME ZONE;
