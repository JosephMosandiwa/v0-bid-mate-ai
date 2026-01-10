-- 035_create_analysis_feedback.sql
-- Creates a table to capture user feedback/corrections to analyzer output

CREATE TABLE IF NOT EXISTS public.analysis_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tender_id UUID NOT NULL REFERENCES public.user_tenders(id) ON DELETE CASCADE,
  -- Reference Supabase auth users table to match existing migrations
  user_id UUID REFERENCES auth.users(id),
  field_key TEXT NOT NULL,
  old_value JSONB,
  new_value JSONB,
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Helpful indexes for querying feedback by tender and chronology
CREATE INDEX IF NOT EXISTS idx_analysis_feedback_tender_field ON public.analysis_feedback (tender_id, field_key);
CREATE INDEX IF NOT EXISTS idx_analysis_feedback_created_at ON public.analysis_feedback (created_at);
