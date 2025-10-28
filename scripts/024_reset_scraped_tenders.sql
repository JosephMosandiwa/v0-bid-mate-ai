-- Script to reset all scraped tenders and their associated data
-- This will allow a fresh rescrape while maintaining the source configuration

-- Delete all tender documents first (due to foreign key constraint)
DELETE FROM public.tender_documents;

-- Delete all scraped tenders
DELETE FROM public.scraped_tenders;

-- Reset the scraping statistics on tender sources
UPDATE public.tender_sources
SET 
  total_tenders_scraped = 0,
  last_scraped_at = NULL,
  last_scrape_status = NULL,
  last_scrape_error = NULL;

-- Verify the reset
SELECT 
  'Scraped Tenders' as table_name, 
  COUNT(*) as record_count 
FROM public.scraped_tenders
UNION ALL
SELECT 
  'Tender Documents' as table_name, 
  COUNT(*) as record_count 
FROM public.tender_documents
UNION ALL
SELECT 
  'Tender Sources (Active)' as table_name, 
  COUNT(*) as record_count 
FROM public.tender_sources 
WHERE is_active = true AND scraping_enabled = true;
