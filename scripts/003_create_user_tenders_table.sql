-- Create user_tenders table to store tenders saved by users
CREATE TABLE IF NOT EXISTS public.user_tenders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Tender information from eTenders API
  tender_id TEXT NOT NULL,
  title TEXT NOT NULL,
  organization TEXT NOT NULL,
  publish_date TIMESTAMP WITH TIME ZONE,
  close_date TIMESTAMP WITH TIME ZONE,
  value TEXT,
  category TEXT,
  description TEXT,
  url TEXT,
  
  -- User-specific metadata
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'in-progress', 'submitted')),
  is_pinned BOOLEAN DEFAULT FALSE,
  is_favourited BOOLEAN DEFAULT FALSE,
  is_wishlisted BOOLEAN DEFAULT FALSE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure user can't add same tender twice
  UNIQUE(user_id, tender_id)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_user_tenders_user_id ON public.user_tenders(user_id);
CREATE INDEX IF NOT EXISTS idx_user_tenders_status ON public.user_tenders(status);
CREATE INDEX IF NOT EXISTS idx_user_tenders_pinned ON public.user_tenders(is_pinned);
CREATE INDEX IF NOT EXISTS idx_user_tenders_favourited ON public.user_tenders(is_favourited);
CREATE INDEX IF NOT EXISTS idx_user_tenders_wishlisted ON public.user_tenders(is_wishlisted);

-- Enable Row Level Security
ALTER TABLE public.user_tenders ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own tenders"
  ON public.user_tenders
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own tenders"
  ON public.user_tenders
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tenders"
  ON public.user_tenders
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tenders"
  ON public.user_tenders
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_user_tenders_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_user_tenders_updated_at
  BEFORE UPDATE ON public.user_tenders
  FOR EACH ROW
  EXECUTE FUNCTION update_user_tenders_updated_at();
