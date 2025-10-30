-- Migration to allow tender_documents to work with both scraped and custom tenders
-- This removes the UUID constraint and foreign key to allow custom tender IDs

-- Drop the foreign key constraint
ALTER TABLE public.tender_documents
  DROP CONSTRAINT IF EXISTS fk_tender_documents_tender_id;

-- Change tender_id from UUID to TEXT to support custom tender IDs
ALTER TABLE public.tender_documents
  ALTER COLUMN tender_id TYPE TEXT USING tender_id::TEXT;

-- Recreate the index
DROP INDEX IF EXISTS idx_tender_documents_tender_id;
CREATE INDEX idx_tender_documents_tender_id ON public.tender_documents(tender_id);

-- Update the unique constraint
ALTER TABLE public.tender_documents
  DROP CONSTRAINT IF EXISTS unique_tender_document;
ALTER TABLE public.tender_documents
  ADD CONSTRAINT unique_tender_document 
  UNIQUE(tender_id, original_url);
