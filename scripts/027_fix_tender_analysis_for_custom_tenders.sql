-- Migration to allow tender_analysis to work with both scraped and custom tenders
-- This removes the UUID constraint and foreign key to allow custom tender IDs

-- Using correct constraint name from error message
-- Drop the foreign key constraint if it exists
ALTER TABLE public.tender_analysis
  DROP CONSTRAINT IF EXISTS tender_analysis_tender_id_fkey;

-- Change tender_id from UUID to TEXT to support custom tender IDs
ALTER TABLE public.tender_analysis
  ALTER COLUMN tender_id TYPE TEXT USING tender_id::TEXT;

-- Recreate the index
DROP INDEX IF EXISTS idx_tender_analysis_tender_id;
CREATE INDEX idx_tender_analysis_tender_id ON public.tender_analysis(tender_id);
