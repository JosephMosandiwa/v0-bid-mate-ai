-- Create scraped_tenders table to store tenders from various government websites
CREATE TABLE IF NOT EXISTS public.scraped_tenders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Source information
  source_id INTEGER NOT NULL, -- References the ID from the sources list
  source_name TEXT NOT NULL, -- e.g., "Department of Health"
  source_url TEXT NOT NULL, -- The website URL
  source_level TEXT, -- National, Provincial, Metro, Local/Municipal, etc.
  source_province TEXT, -- Province if applicable
  
  -- Tender information
  tender_reference TEXT, -- Official tender reference number
  title TEXT NOT NULL,
  description TEXT,
  category TEXT, -- Tender category/type
  
  -- Dates
  publish_date TIMESTAMP WITH TIME ZONE,
  close_date TIMESTAMP WITH TIME ZONE,
  opening_date TIMESTAMP WITH TIME ZONE,
  
  -- Financial
  estimated_value TEXT, -- Estimated tender value
  
  -- Contact & Links
  contact_person TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  tender_url TEXT, -- Direct link to tender details
  document_urls JSONB, -- Array of document URLs
  
  -- Metadata
  scraped_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE, -- Whether tender is still open
  raw_data JSONB, -- Store original scraped data for reference
  
  -- Search optimization
  search_vector TSVECTOR, -- Full-text search vector
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_scraped_tenders_source_id ON public.scraped_tenders(source_id);
CREATE INDEX IF NOT EXISTS idx_scraped_tenders_source_name ON public.scraped_tenders(source_name);
CREATE INDEX IF NOT EXISTS idx_scraped_tenders_source_level ON public.scraped_tenders(source_level);
CREATE INDEX IF NOT EXISTS idx_scraped_tenders_province ON public.scraped_tenders(source_province);
CREATE INDEX IF NOT EXISTS idx_scraped_tenders_category ON public.scraped_tenders(category);
CREATE INDEX IF NOT EXISTS idx_scraped_tenders_publish_date ON public.scraped_tenders(publish_date DESC);
CREATE INDEX IF NOT EXISTS idx_scraped_tenders_close_date ON public.scraped_tenders(close_date);
CREATE INDEX IF NOT EXISTS idx_scraped_tenders_is_active ON public.scraped_tenders(is_active);
CREATE INDEX IF NOT EXISTS idx_scraped_tenders_scraped_at ON public.scraped_tenders(scraped_at DESC);

-- Create full-text search index
CREATE INDEX IF NOT EXISTS idx_scraped_tenders_search ON public.scraped_tenders USING GIN(search_vector);

-- Create function to update search vector
CREATE OR REPLACE FUNCTION update_scraped_tenders_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector := 
    setweight(to_tsvector('english', COALESCE(NEW.title, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(NEW.description, '')), 'B') ||
    setweight(to_tsvector('english', COALESCE(NEW.tender_reference, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(NEW.source_name, '')), 'C') ||
    setweight(to_tsvector('english', COALESCE(NEW.category, '')), 'C');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update search vector
DROP TRIGGER IF EXISTS trigger_update_scraped_tenders_search_vector ON public.scraped_tenders;
CREATE TRIGGER trigger_update_scraped_tenders_search_vector
  BEFORE INSERT OR UPDATE ON public.scraped_tenders
  FOR EACH ROW
  EXECUTE FUNCTION update_scraped_tenders_search_vector();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_scraped_tenders_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS trigger_update_scraped_tenders_updated_at ON public.scraped_tenders;
CREATE TRIGGER trigger_update_scraped_tenders_updated_at
  BEFORE UPDATE ON public.scraped_tenders
  FOR EACH ROW
  EXECUTE FUNCTION update_scraped_tenders_updated_at();

-- Enable Row Level Security
ALTER TABLE public.scraped_tenders ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all authenticated users to read scraped tenders
CREATE POLICY "Allow authenticated users to read scraped tenders"
  ON public.scraped_tenders
  FOR SELECT
  TO authenticated
  USING (true);

-- Create policy to allow service role to insert/update scraped tenders
CREATE POLICY "Allow service role to manage scraped tenders"
  ON public.scraped_tenders
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
