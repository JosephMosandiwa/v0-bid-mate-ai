-- Add major South African tender sources to the database
-- Uses explicit integer IDs starting from 101 to avoid conflicts with existing 1-100 entries

-- Delete potentially duplicate entries first
DELETE FROM tender_sources WHERE name IN (
  'National Treasury eTenders',
  'CIDB Construction Tenders',
  'Gauteng Provincial Government',
  'Western Cape Provincial Government',
  'KwaZulu-Natal Provincial Government',
  'Eastern Cape Provincial Government',
  'Limpopo Provincial Government',
  'Mpumalanga Provincial Government',
  'North West Provincial Government',
  'Northern Cape Provincial Government',
  'Free State Provincial Government',
  'City of Johannesburg',
  'City of Cape Town',
  'eThekwini Municipality',
  'City of Tshwane',
  'City of Ekurhuleni',
  'Nelson Mandela Bay Municipality'
);

-- National tender portals with explicit integer IDs
INSERT INTO tender_sources (id, name, tender_page_url, scraper_type, is_active, level)
VALUES 
  (101, 'National Treasury eTenders', 'https://www.etenders.gov.za/Home/opportunities', 'etender', true, 'national'),
  (102, 'CIDB Construction Tenders', 'https://www.cidb.org.za/cidb-tenders/current-tenders/', 'cidb', true, 'national');

-- Provincial Government Portals with explicit integer IDs
INSERT INTO tender_sources (id, name, tender_page_url, scraper_type, scraper_config, is_active, level, province)
VALUES 
  (103, 'Gauteng Provincial Government', 'https://www.gauteng.gov.za/tenders', 'provincial', '{"province": "Gauteng"}'::jsonb, true, 'provincial', 'Gauteng'),
  (104, 'Western Cape Provincial Government', 'https://www.westerncape.gov.za/site-page/tenders', 'provincial', '{"province": "Western Cape"}'::jsonb, true, 'provincial', 'Western Cape'),
  (105, 'KwaZulu-Natal Provincial Government', 'https://www.kznonline.gov.za/tenders', 'provincial', '{"province": "KwaZulu-Natal"}'::jsonb, true, 'provincial', 'KwaZulu-Natal'),
  (106, 'Eastern Cape Provincial Government', 'https://www.ecprov.gov.za/tenders', 'provincial', '{"province": "Eastern Cape"}'::jsonb, true, 'provincial', 'Eastern Cape'),
  (107, 'Limpopo Provincial Government', 'https://www.limpopo.gov.za/tenders', 'provincial', '{"province": "Limpopo"}'::jsonb, true, 'provincial', 'Limpopo'),
  (108, 'Mpumalanga Provincial Government', 'https://www.mpumalanga.gov.za/tenders', 'provincial', '{"province": "Mpumalanga"}'::jsonb, true, 'provincial', 'Mpumalanga'),
  (109, 'North West Provincial Government', 'https://www.nwpg.gov.za/tenders', 'provincial', '{"province": "North West"}'::jsonb, true, 'provincial', 'North West'),
  (110, 'Northern Cape Provincial Government', 'https://www.northern-cape.gov.za/tenders', 'provincial', '{"province": "Northern Cape"}'::jsonb, true, 'provincial', 'Northern Cape'),
  (111, 'Free State Provincial Government', 'https://www.fsprovince.gov.za/tenders', 'provincial', '{"province": "Free State"}'::jsonb, true, 'provincial', 'Free State');

-- Major Municipalities with explicit integer IDs
INSERT INTO tender_sources (id, name, tender_page_url, scraper_type, scraper_config, is_active, level, province)
VALUES 
  (112, 'City of Johannesburg', 'https://www.joburg.org.za/business_/Pages/Tenders%20and%20Quotations/Tenders-and-Quotations.aspx', 'municipal', '{"municipality": "City of Johannesburg"}'::jsonb, true, 'municipal', 'Gauteng'),
  (113, 'City of Cape Town', 'https://www.capetown.gov.za/Work%20and%20business/Tender-and-supplier-information', 'municipal', '{"municipality": "City of Cape Town"}'::jsonb, true, 'municipal', 'Western Cape'),
  (114, 'eThekwini Municipality', 'https://www.durban.gov.za/City_Services/ethekwini_municipality_tenders/Pages/Tenders.aspx', 'municipal', '{"municipality": "eThekwini Municipality"}'::jsonb, true, 'municipal', 'KwaZulu-Natal'),
  (115, 'City of Tshwane', 'https://www.tshwane.gov.za/sites/business/Tenders-and-Quotations/Pages/Tenders.aspx', 'municipal', '{"municipality": "City of Tshwane"}'::jsonb, true, 'municipal', 'Gauteng'),
  (116, 'City of Ekurhuleni', 'https://www.ekurhuleni.gov.za/business-opportunities/tenders', 'municipal', '{"municipality": "City of Ekurhuleni"}'::jsonb, true, 'municipal', 'Gauteng'),
  (117, 'Nelson Mandela Bay Municipality', 'https://www.nelsonmandelabay.gov.za/page/tenders', 'municipal', '{"municipality": "Nelson Mandela Bay"}'::jsonb, true, 'municipal', 'Eastern Cape');

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_tender_sources_scraper_type ON tender_sources(scraper_type);
CREATE INDEX IF NOT EXISTS idx_tender_sources_active ON tender_sources(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_tender_sources_level ON tender_sources(level);
CREATE INDEX IF NOT EXISTS idx_tender_sources_province ON tender_sources(province);
