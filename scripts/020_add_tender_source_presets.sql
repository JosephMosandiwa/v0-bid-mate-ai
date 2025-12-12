-- Add major South African tender sources to the database

-- National Treasury eTenders Portal
INSERT INTO tender_sources (name, tender_page_url, scraper_type, is_active)
VALUES 
  ('National Treasury eTenders', 'https://www.etenders.gov.za/Home/opportunities', 'etender', true),
  ('CIDB Construction Tenders', 'https://www.cidb.org.za/cidb-tenders/current-tenders/', 'cidb', true)
ON CONFLICT (name) DO UPDATE 
SET 
  tender_page_url = EXCLUDED.tender_page_url,
  scraper_type = EXCLUDED.scraper_type,
  is_active = EXCLUDED.is_active;

-- Provincial Government Portals
INSERT INTO tender_sources (name, tender_page_url, scraper_type, scraper_config, is_active)
VALUES 
  ('Gauteng Provincial Government', 'https://www.gauteng.gov.za/tenders', 'provincial', '{"province": "Gauteng"}'::jsonb, true),
  ('Western Cape Provincial Government', 'https://www.westerncape.gov.za/site-page/tenders', 'provincial', '{"province": "Western Cape"}'::jsonb, true),
  ('KwaZulu-Natal Provincial Government', 'https://www.kznonline.gov.za/tenders', 'provincial', '{"province": "KwaZulu-Natal"}'::jsonb, true),
  ('Eastern Cape Provincial Government', 'https://www.ecprov.gov.za/tenders', 'provincial', '{"province": "Eastern Cape"}'::jsonb, true),
  ('Limpopo Provincial Government', 'https://www.limpopo.gov.za/tenders', 'provincial', '{"province": "Limpopo"}'::jsonb, true),
  ('Mpumalanga Provincial Government', 'https://www.mpumalanga.gov.za/tenders', 'provincial', '{"province": "Mpumalanga"}'::jsonb, true),
  ('North West Provincial Government', 'https://www.nwpg.gov.za/tenders', 'provincial', '{"province": "North West"}'::jsonb, true),
  ('Northern Cape Provincial Government', 'https://www.northern-cape.gov.za/tenders', 'provincial', '{"province": "Northern Cape"}'::jsonb, true),
  ('Free State Provincial Government', 'https://www.fsprovince.gov.za/tenders', 'provincial', '{"province": "Free State"}'::jsonb, true)
ON CONFLICT (name) DO UPDATE 
SET 
  tender_page_url = EXCLUDED.tender_page_url,
  scraper_type = EXCLUDED.scraper_type,
  scraper_config = EXCLUDED.scraper_config,
  is_active = EXCLUDED.is_active;

-- Major Municipalities
INSERT INTO tender_sources (name, tender_page_url, scraper_type, scraper_config, is_active)
VALUES 
  ('City of Johannesburg', 'https://www.joburg.org.za/business_/Pages/Tenders%20and%20Quotations/Tenders-and-Quotations.aspx', 'municipal', '{"municipality": "City of Johannesburg"}'::jsonb, true),
  ('City of Cape Town', 'https://www.capetown.gov.za/Work%20and%20business/Tender-and-supplier-information', 'municipal', '{"municipality": "City of Cape Town"}'::jsonb, true),
  ('eThekwini Municipality', 'https://www.durban.gov.za/City_Services/ethekwini_municipality_tenders/Pages/Tenders.aspx', 'municipal', '{"municipality": "eThekwini Municipality"}'::jsonb, true),
  ('City of Tshwane', 'https://www.tshwane.gov.za/sites/business/Tenders-and-Quotations/Pages/Tenders.aspx', 'municipal', '{"municipality": "City of Tshwane"}'::jsonb, true),
  ('City of Ekurhuleni', 'https://www.ekurhuleni.gov.za/business-opportunities/tenders', 'municipal', '{"municipality": "City of Ekurhuleni"}'::jsonb, true),
  ('Nelson Mandela Bay Municipality', 'https://www.nelsonmandelabay.gov.za/page/tenders', 'municipal', '{"municipality": "Nelson Mandela Bay"}'::jsonb, true)
ON CONFLICT (name) DO UPDATE 
SET 
  tender_page_url = EXCLUDED.tender_page_url,
  scraper_type = EXCLUDED.scraper_type,
  scraper_config = EXCLUDED.scraper_config,
  is_active = EXCLUDED.is_active;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_tender_sources_scraper_type ON tender_sources(scraper_type);
CREATE INDEX IF NOT EXISTS idx_tender_sources_active ON tender_sources(is_active) WHERE is_active = true;
