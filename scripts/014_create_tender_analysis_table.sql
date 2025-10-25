-- Create tender_analysis table to store AI analysis results
-- This prevents re-analyzing documents every time the page loads

CREATE TABLE IF NOT EXISTS public.tender_analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tender_id UUID NOT NULL REFERENCES public.scraped_tenders(id) ON DELETE CASCADE,
  analysis_data JSONB NOT NULL,
  analyzed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on tender_id for fast lookups
CREATE INDEX IF NOT EXISTS idx_tender_analysis_tender_id ON public.tender_analysis(tender_id);

-- Create unique constraint to ensure one analysis per tender
CREATE UNIQUE INDEX IF NOT EXISTS idx_tender_analysis_unique_tender ON public.tender_analysis(tender_id);

-- Enable Row Level Security
ALTER TABLE public.tender_analysis ENABLE ROW LEVEL SECURITY;

-- Create policies for tender_analysis
CREATE POLICY "Enable read access for all users" ON public.tender_analysis
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for all users" ON public.tender_analysis
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for all users" ON public.tender_analysis
  FOR UPDATE USING (true);

CREATE POLICY "Enable delete for all users" ON public.tender_analysis
  FOR DELETE USING (true);
