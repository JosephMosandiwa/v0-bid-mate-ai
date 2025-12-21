-- Update eTender sources to use the official API instead of HTML scraping
-- The National Treasury provides an official OCDS-compliant JSON API

-- First, check what eTender sources exist
DO $$ 
BEGIN
  RAISE NOTICE 'Checking existing eTender sources...';
END $$;

-- Update all eTender-related sources to use API scraping
UPDATE tender_sources
SET 
  scraper_type = 'etender_api',
  notes = COALESCE(notes || E'\n', '') || 'Updated to use official National Treasury OCDS API (https://ocds-api.etenders.gov.za/api/releases)',
  updated_at = NOW()
WHERE 
  (
    LOWER(name) LIKE '%etender%' 
    OR LOWER(tender_page_url) LIKE '%etenders.gov.za%'
    OR LOWER(name) LIKE '%national treasury%'
  )
  AND scraper_type != 'etender_api';

-- Log the change
DO $$ 
DECLARE
  updated_count INTEGER;
BEGIN
  GET DIAGNOSTICS updated_count = ROW_COUNT;
  RAISE NOTICE 'Updated % eTender source(s) to use API scraping', updated_count;
END $$;

-- Show updated sources
SELECT 
  id,
  name,
  scraper_type,
  tender_page_url,
  is_active,
  scraping_enabled
FROM tender_sources
WHERE scraper_type = 'etender_api'
ORDER BY name;

-- Add helpful comment
COMMENT ON COLUMN tender_sources.scraper_type IS 
  'Type of scraper to use: generic, etender_api (OCDS API), etender (HTML), cidb, provincial, municipal, private_sector';
