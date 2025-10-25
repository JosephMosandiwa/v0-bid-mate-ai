-- First, verify scraped_tenders table exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'scraped_tenders'
  ) THEN
    RAISE EXCEPTION 'scraped_tenders table does not exist. Please run script 005 first.';
  END IF;
END $$;

-- Drop existing table and policies
DROP TABLE IF EXISTS public.tender_documents CASCADE;

-- Create tender_documents table to store downloaded tender documents
CREATE TABLE public.tender_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tender_id UUID NOT NULL,
  document_name TEXT NOT NULL,
  document_type TEXT,
  original_url TEXT NOT NULL,
  blob_url TEXT NOT NULL,
  file_size INTEGER,
  downloaded_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add foreign key constraint separately
ALTER TABLE public.tender_documents
  ADD CONSTRAINT fk_tender_documents_tender_id 
  FOREIGN KEY (tender_id) 
  REFERENCES public.scraped_tenders(id) 
  ON DELETE CASCADE;

-- Add unique constraint
ALTER TABLE public.tender_documents
  ADD CONSTRAINT unique_tender_document 
  UNIQUE(tender_id, original_url);

-- Create indexes for faster lookups
CREATE INDEX idx_tender_documents_tender_id ON public.tender_documents(tender_id);
CREATE INDEX idx_tender_documents_downloaded_at ON public.tender_documents(downloaded_at DESC);

-- Enable RLS
ALTER TABLE public.tender_documents ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read documents
CREATE POLICY "Allow authenticated read access" ON public.tender_documents
  FOR SELECT 
  TO authenticated
  USING (true);

-- Allow service role full access
CREATE POLICY "Allow service role full access" ON public.tender_documents
  FOR ALL 
  TO service_role
  USING (true)
  WITH CHECK (true);
