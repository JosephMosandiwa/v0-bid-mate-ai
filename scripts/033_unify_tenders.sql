-- Unify tenders migration script
-- Merges user_custom_tenders into user_tenders and updates related tables

-- 1. Update user_tenders table to support custom tenders
ALTER TABLE public.user_tenders
  ADD COLUMN IF NOT EXISTS tender_type TEXT DEFAULT 'scraped' CHECK (tender_type IN ('scraped', 'custom')),
  ADD COLUMN IF NOT EXISTS location TEXT,
  ADD COLUMN IF NOT EXISTS deadline TEXT;

-- Make tender_id nullable (it's NOT NULL currently) to support custom tenders which might not have an external ID
ALTER TABLE public.user_tenders ALTER COLUMN tender_id DROP NOT NULL;

-- 2. Migrate custom tenders to user_tenders
-- We preserve the ID to make re-linking easier
INSERT INTO public.user_tenders (
  id,
  user_id,
  title,
  organization,
  close_date,
  deadline,
  value,
  category,
  description,
  location,
  status,
  created_at,
  updated_at,
  tender_type,
  tender_id
)
SELECT
  id,
  user_id,
  title,
  organization,
  close_date,
  deadline,
  value,
  category,
  description,
  location,
  status,
  created_at,
  updated_at,
  'custom',
  NULL -- Custom tenders don't have an external scraping ID
FROM public.user_custom_tenders;

-- 3. Handle document attachments
-- Rename table to user_tender_documents (more generic)
ALTER TABLE public.user_custom_tender_documents RENAME TO user_tender_documents;

-- Drop old FK
ALTER TABLE public.user_tender_documents DROP CONSTRAINT IF EXISTS user_custom_tender_documents_tender_id_fkey;

-- Add new FK to user_tenders
ALTER TABLE public.user_tender_documents
  ADD CONSTRAINT user_tender_documents_tender_id_fkey
  FOREIGN KEY (tender_id)
  REFERENCES public.user_tenders(id)
  ON DELETE CASCADE;

-- Update RLS policies for documents
DROP POLICY IF EXISTS "Users can view documents of their custom tenders" ON public.user_tender_documents;
DROP POLICY IF EXISTS "Users can insert documents for their custom tenders" ON public.user_tender_documents;
DROP POLICY IF EXISTS "Users can delete documents of their custom tenders" ON public.user_tender_documents;
DROP POLICY IF EXISTS "Users can view own tender documents" ON public.user_tender_documents;

CREATE POLICY "Users can view own tender documents" ON public.user_tender_documents
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_tenders
      WHERE user_tenders.id = user_tender_documents.tender_id AND user_tenders.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own tender documents" ON public.user_tender_documents
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_tenders
      WHERE user_tenders.id = user_tender_documents.tender_id AND user_tenders.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own tender documents" ON public.user_tender_documents
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.user_tenders
      WHERE user_tenders.id = user_tender_documents.tender_id AND user_tenders.user_id = auth.uid()
    )
  );

-- Enable RLS just in case (was already enabled)
ALTER TABLE public.user_tender_documents ENABLE ROW LEVEL SECURITY;

-- 4. Handle Analysis
-- Rename table
ALTER TABLE public.user_custom_tender_analysis RENAME TO user_tender_analysis;

-- Drop old FK
ALTER TABLE public.user_tender_analysis DROP CONSTRAINT IF EXISTS user_custom_tender_analysis_tender_id_fkey;

-- Add new FK
ALTER TABLE public.user_tender_analysis
  ADD CONSTRAINT user_tender_analysis_tender_id_fkey
  FOREIGN KEY (tender_id)
  REFERENCES public.user_tenders(id)
  ON DELETE CASCADE;

-- RLS for analysis
DROP POLICY IF EXISTS "Users can view analysis of their custom tenders" ON public.user_tender_analysis;
DROP POLICY IF EXISTS "Users can insert analysis for their custom tenders" ON public.user_tender_analysis;
DROP POLICY IF EXISTS "Users can view own tender analysis" ON public.user_tender_analysis;

CREATE POLICY "Users can view own tender analysis" ON public.user_tender_analysis
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_tenders
      WHERE user_tenders.id = user_tender_analysis.tender_id AND user_tenders.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own tender analysis" ON public.user_tender_analysis
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_tenders
      WHERE user_tenders.id = user_tender_analysis.tender_id AND user_tenders.user_id = auth.uid()
    )
  );

ALTER TABLE public.user_tender_analysis ENABLE ROW LEVEL SECURITY;

-- 5. Handle Responses
-- Rename table
ALTER TABLE public.user_custom_tender_responses RENAME TO user_tender_responses;

-- Drop old FK
ALTER TABLE public.user_tender_responses DROP CONSTRAINT IF EXISTS user_custom_tender_responses_tender_id_fkey;

-- Add new FK
ALTER TABLE public.user_tender_responses
  ADD CONSTRAINT user_tender_responses_tender_id_fkey
  FOREIGN KEY (tender_id)
  REFERENCES public.user_tenders(id)
  ON DELETE CASCADE;

-- RLS for responses
DROP POLICY IF EXISTS "Users can view their own responses" ON public.user_tender_responses;
DROP POLICY IF EXISTS "Users can insert their own responses" ON public.user_tender_responses;
DROP POLICY IF EXISTS "Users can update their own responses" ON public.user_tender_responses;
DROP POLICY IF EXISTS "Users can delete their own responses" ON public.user_tender_responses;

CREATE POLICY "Users can view own tender responses" ON public.user_tender_responses
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own tender responses" ON public.user_tender_responses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tender responses" ON public.user_tender_responses
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own tender responses" ON public.user_tender_responses
  FOR DELETE USING (auth.uid() = user_id);

ALTER TABLE public.user_tender_responses ENABLE ROW LEVEL SECURITY;

-- 6. Cleanup
DROP TABLE IF EXISTS public.user_custom_tenders CASCADE;
