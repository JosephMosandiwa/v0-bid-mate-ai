-- Create custom tenders tables for user-uploaded tender documents

-- Main custom tenders table
CREATE TABLE IF NOT EXISTS public.user_custom_tenders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  -- Added fields for auto-filled tender metadata from AI analysis
  organization TEXT,
  deadline TEXT,
  value TEXT,
  location TEXT,
  estimated_value TEXT,
  close_date TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'in-progress', 'submitted')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Custom tender documents table
CREATE TABLE IF NOT EXISTS public.user_custom_tender_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tender_id UUID NOT NULL REFERENCES public.user_custom_tenders(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  blob_url TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Custom tender analysis table
CREATE TABLE IF NOT EXISTS public.user_custom_tender_analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tender_id UUID NOT NULL REFERENCES public.user_custom_tenders(id) ON DELETE CASCADE,
  analysis_data JSONB NOT NULL,
  analyzed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Custom tender responses table
CREATE TABLE IF NOT EXISTS public.user_custom_tender_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tender_id UUID NOT NULL REFERENCES public.user_custom_tenders(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  response_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_custom_tenders_user_id ON public.user_custom_tenders(user_id);
CREATE INDEX IF NOT EXISTS idx_user_custom_tenders_status ON public.user_custom_tenders(status);
CREATE INDEX IF NOT EXISTS idx_user_custom_tender_documents_tender_id ON public.user_custom_tender_documents(tender_id);
CREATE INDEX IF NOT EXISTS idx_user_custom_tender_analysis_tender_id ON public.user_custom_tender_analysis(tender_id);
CREATE INDEX IF NOT EXISTS idx_user_custom_tender_responses_tender_id ON public.user_custom_tender_responses(tender_id);

-- Create unique constraints
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_custom_tender_analysis_unique ON public.user_custom_tender_analysis(tender_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_custom_tender_responses_unique ON public.user_custom_tender_responses(tender_id, user_id);

-- Enable Row Level Security
ALTER TABLE public.user_custom_tenders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_custom_tender_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_custom_tender_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_custom_tender_responses ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_custom_tenders
CREATE POLICY "Users can view their own custom tenders" ON public.user_custom_tenders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own custom tenders" ON public.user_custom_tenders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own custom tenders" ON public.user_custom_tenders
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own custom tenders" ON public.user_custom_tenders
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for user_custom_tender_documents
CREATE POLICY "Users can view documents of their custom tenders" ON public.user_custom_tender_documents
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_custom_tenders
      WHERE id = tender_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert documents for their custom tenders" ON public.user_custom_tender_documents
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_custom_tenders
      WHERE id = tender_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete documents of their custom tenders" ON public.user_custom_tender_documents
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.user_custom_tenders
      WHERE id = tender_id AND user_id = auth.uid()
    )
  );

-- RLS Policies for user_custom_tender_analysis
CREATE POLICY "Users can view analysis of their custom tenders" ON public.user_custom_tender_analysis
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_custom_tenders
      WHERE id = tender_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert analysis for their custom tenders" ON public.user_custom_tender_analysis
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_custom_tenders
      WHERE id = tender_id AND user_id = auth.uid()
    )
  );

-- RLS Policies for user_custom_tender_responses
CREATE POLICY "Users can view their own responses" ON public.user_custom_tender_responses
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own responses" ON public.user_custom_tender_responses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own responses" ON public.user_custom_tender_responses
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own responses" ON public.user_custom_tender_responses
  FOR DELETE USING (auth.uid() = user_id);
