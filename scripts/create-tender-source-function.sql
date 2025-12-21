-- Create a function to insert tender source and return its ID
CREATE OR REPLACE FUNCTION create_tender_source(
  p_name TEXT,
  p_level TEXT,
  p_province TEXT,
  p_url TEXT,
  p_type TEXT
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_source_id INTEGER;
BEGIN
  INSERT INTO tender_sources (
    name,
    level,
    province,
    tender_page_url,
    scraper_type,
    is_active,
    scraping_enabled,
    notes
  ) VALUES (
    p_name,
    p_level,
    p_province,
    p_url,
    p_type,
    true,
    true,
    'API integration for ' || p_name
  )
  RETURNING id INTO v_source_id;
  
  RETURN v_source_id;
END;
$$;
