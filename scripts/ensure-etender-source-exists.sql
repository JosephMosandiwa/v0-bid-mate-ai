-- Calculate next ID explicitly since auto-increment isn't working
DO $$
DECLARE
  next_id INTEGER;
BEGIN
  -- Get the next available ID
  SELECT COALESCE(MAX(id), 0) + 1 INTO next_id FROM tender_sources;
  
  -- Check if source already exists
  IF NOT EXISTS (
    SELECT 1 FROM tender_sources WHERE name = 'National Treasury eTender (OCDS)'
  ) THEN
    INSERT INTO tender_sources (id, name, level, tender_page_url, is_active, scraper_type)
    VALUES (next_id, 'National Treasury eTender (OCDS)', 'National', 'https://ocds-api.etenders.gov.za', true, 'api');
  END IF;
END $$;
