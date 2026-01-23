-- Create user_custom_tender_documents table for storing documents attached to custom tenders
-- This mirrors the tender_documents table but for user-uploaded custom tenders

CREATE TABLE IF NOT EXISTS user_custom_tender_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tender_id UUID NOT NULL REFERENCES user_custom_tenders(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- File metadata
  file_name TEXT NOT NULL,
  file_type TEXT,
  file_size BIGINT,
  
  -- Storage
  blob_url TEXT NOT NULL,
  storage_path TEXT,
  original_url TEXT, -- If downloaded from external source
  
  -- Document classification
  document_type TEXT, -- e.g., 'tender_document', 'specification', 'sbd_form', 'addendum'
  document_category TEXT, -- e.g., 'main', 'supporting', 'reference'
  
  -- Processing status
  documind_document_id UUID REFERENCES documind_documents(id),
  processed_at TIMESTAMP WITH TIME ZONE,
  extraction_status TEXT DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_custom_tender_documents_tender_id 
  ON user_custom_tender_documents(tender_id);
CREATE INDEX IF NOT EXISTS idx_user_custom_tender_documents_user_id 
  ON user_custom_tender_documents(user_id);

-- Enable RLS
ALTER TABLE user_custom_tender_documents ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own custom tender documents"
  ON user_custom_tender_documents FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own custom tender documents"
  ON user_custom_tender_documents FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own custom tender documents"
  ON user_custom_tender_documents FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own custom tender documents"
  ON user_custom_tender_documents FOR DELETE
  USING (auth.uid() = user_id);

-- Also create user_custom_tender_analysis if it doesn't exist
CREATE TABLE IF NOT EXISTS user_custom_tender_analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tender_id UUID NOT NULL REFERENCES user_custom_tenders(id) ON DELETE CASCADE,
  analysis_data JSONB,
  analyzed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_custom_tender_analysis_tender_id 
  ON user_custom_tender_analysis(tender_id);
