-- Migration 036
-- Add field history table for user custom tenders and extraction confidences column

-- Add extraction_confidences column to store per-field confidence scores (JSONB)
ALTER TABLE IF EXISTS public.user_custom_tenders
  ADD COLUMN IF NOT EXISTS extraction_confidences JSONB;

-- Create field history table to record user corrections to extracted fields
CREATE TABLE IF NOT EXISTS public.user_custom_tender_field_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tender_id UUID NOT NULL REFERENCES public.user_custom_tenders(id) ON DELETE CASCADE,
  user_id UUID NULL REFERENCES auth.users(id) ON DELETE SET NULL,
  field_key TEXT NOT NULL,
  old_value TEXT,
  new_value TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for quick lookups
CREATE INDEX IF NOT EXISTS idx_user_custom_tender_field_history_tender_id ON public.user_custom_tender_field_history(tender_id);
CREATE INDEX IF NOT EXISTS idx_user_custom_tender_field_history_user_id ON public.user_custom_tender_field_history(user_id);

-- Row Level Security: allow select only for owners via join to user_custom_tenders
ALTER TABLE public.user_custom_tender_field_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their custom tender field history" ON public.user_custom_tender_field_history;
CREATE POLICY "Users can view their custom tender field history" ON public.user_custom_tender_field_history
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_custom_tenders t WHERE t.id = tender_id AND t.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can insert their custom tender field history" ON public.user_custom_tender_field_history;
CREATE POLICY "Users can insert their custom tender field history" ON public.user_custom_tender_field_history
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_custom_tenders t WHERE t.id = tender_id AND t.user_id = auth.uid()
    )
  );
