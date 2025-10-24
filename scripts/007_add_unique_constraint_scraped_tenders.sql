-- Add unique constraint to prevent duplicate tenders from same source
-- This allows upsert operations to work correctly

-- First, remove any existing duplicates (keep the most recent one)
DELETE FROM public.scraped_tenders a
USING public.scraped_tenders b
WHERE a.id < b.id
  AND a.source_id = b.source_id
  AND a.title = b.title;

-- Add unique constraint on source_id + title combination
ALTER TABLE public.scraped_tenders
ADD CONSTRAINT unique_source_tender UNIQUE (source_id, title);

-- Create index for better performance on duplicate checks
CREATE INDEX IF NOT EXISTS idx_scraped_tenders_source_title 
ON public.scraped_tenders(source_id, title);
