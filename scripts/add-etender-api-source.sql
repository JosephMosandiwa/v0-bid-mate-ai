-- ============================================
-- ADD eTENDER API SOURCE TO TENDER_SOURCES
-- ============================================
-- This adds the National Treasury eTender OCDS API as a data source
-- Run this ONCE to add the API source to your system

DO $$ 
DECLARE
  v_source_exists BOOLEAN;
  v_max_id INTEGER;
BEGIN
  -- Check if eTender API source already exists
  SELECT EXISTS(
    SELECT 1 FROM tender_sources 
    WHERE scraper_type = 'etender_api' 
    OR name ILIKE '%eTender%API%'
  ) INTO v_source_exists;
  
  IF v_source_exists THEN
    RAISE NOTICE '✓ eTender API source already exists';
  ELSE
    -- Get next available ID
    SELECT COALESCE(MAX(id), 0) + 1 INTO v_max_id FROM tender_sources;
    
    -- Insert new API source
    INSERT INTO tender_sources (
      id,
      name,
      level,
      province,
      tender_page_url,
      scraper_type,
      scraper_config,
      is_active,
      scraping_enabled,
      scraping_frequency_hours,
      notes,
      created_at,
      updated_at
    ) VALUES (
      v_max_id,
      'National Treasury eTender (OCDS API)',
      'National',
      'All Provinces',
      'https://ocds-api.etenders.gov.za',
      'etender_api',
      jsonb_build_object(
        'api_type', 'ocds',
        'api_version', 'v1',
        'page_size', 100,
        'fetch_days', 30,
        'endpoint', '/api/OCDSReleases',
        'description', 'Official South African National Treasury OCDS API'
      ),
      true,
      true,
      24, -- Scrape once per day
      'Official OCDS-compliant API for South African government tenders. Provides structured, validated tender data in Open Contracting Data Standard format.',
      NOW(),
      NOW()
    );
    
    RAISE NOTICE '✓ eTender API source created with ID % - Ready to scrape!', v_max_id;
  END IF;
END $$;

-- Show the created source
SELECT id, name, scraper_type, is_active, scraping_enabled, tender_page_url
FROM tender_sources
WHERE scraper_type = 'etender_api';
