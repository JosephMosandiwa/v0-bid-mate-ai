-- Check if there are any scraped tenders in the database
SELECT COUNT(*) as total_tenders FROM scraped_tenders;

-- Show sample tenders if any exist
SELECT 
  id,
  tender_reference,
  title,
  source_name,
  source_level,
  source_province,
  publish_date,
  close_date,
  is_active,
  scraped_at
FROM scraped_tenders
ORDER BY scraped_at DESC
LIMIT 10;

-- Check tender sources
SELECT 
  id,
  name,
  level,
  province,
  scraping_enabled,
  is_active,
  total_tenders_scraped,
  last_scraped_at,
  last_scrape_status
FROM tender_sources
ORDER BY name
LIMIT 20;
