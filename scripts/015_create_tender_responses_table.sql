-- Create tender_responses table to store user form responses
-- This stores the filled-in form data for each tender

CREATE TABLE IF NOT EXISTS public.tender_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tender_id UUID NOT NULL REFERENCES public.scraped_tenders(id) ON DELETE CASCADE,
  response_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on tender_id for fast lookups
CREATE INDEX IF NOT EXISTS idx_tender_responses_tender_id ON public.tender_responses(tender_id);

-- Create unique constraint to ensure one response per tender
CREATE UNIQUE INDEX IF NOT EXISTS idx_tender_responses_unique_tender ON public.tender_responses(tender_id);

-- Enable Row Level Security
ALTER TABLE public.tender_responses ENABLE ROW LEVEL SECURITY;

-- Create policies for tender_responses
CREATE POLICY "Enable read access for all users" ON public.tender_responses
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for all users" ON public.tender_responses
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for all users" ON public.tender_responses
  FOR UPDATE USING (true);

CREATE POLICY "Enable delete for all users" ON public.tender_responses
  FOR DELETE USING (true);
