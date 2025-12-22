-- Create eTender source if it doesn't exist
INSERT INTO tender_sources (name, level, tender_page_url, is_active, scraper_type)
VALUES ('National Treasury eTender (OCDS)', 'National', 'https://ocds-api.etenders.gov.za', true, 'api')
ON CONFLICT (name) DO NOTHING;
