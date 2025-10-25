-- Check if scraped_tenders table exists and show its structure
SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'scraped_tenders'
ORDER BY ordinal_position;
