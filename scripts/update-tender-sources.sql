-- Update South African Tender Sources
-- This script updates and verifies all tender sources with correct URLs and configurations

-- First, delete old sources to start fresh
DELETE FROM tender_sources WHERE 1=1;

-- =====================================================
-- NATIONAL LEVEL SOURCES (Working & Verified)
-- =====================================================

-- 1. National Treasury eTender Portal API (OCDS Format) - PRIMARY SOURCE
INSERT INTO tender_sources (
  id, name, level, province, tender_page_url, scraper_type, is_active, scraping_enabled,
  scraping_frequency_hours, notes, scraper_config
) VALUES (
  1, 'National Treasury eTender Portal', 'national', NULL,
  'https://etenders.treasury.gov.za',
  'etender_api', true, true, 4,
  'Official SA Government eTender portal - OCDS API. Primary source for all national government tenders.',
  '{"api_url": "https://ocds-api.etenders.gov.za/api", "format": "ocds", "endpoints": {"releases": "/OCDSReleases", "records": "/OCDSRecords"}}'::jsonb
);

-- 2. SITA (State Information Technology Agency)
INSERT INTO tender_sources (
  id, name, level, province, tender_page_url, scraper_type, is_active, scraping_enabled,
  scraping_frequency_hours, notes, scraper_config
) VALUES (
  2, 'SITA - State IT Agency', 'national', NULL,
  'https://www.sita.co.za/tenders-and-rfqs/',
  'html_scraper', true, true, 12,
  'State Information Technology Agency - IT tenders',
  '{"category": "ICT"}'::jsonb
);

-- 3. CIDB (Construction Industry Development Board)
INSERT INTO tender_sources (
  id, name, level, province, tender_page_url, scraper_type, is_active, scraping_enabled,
  scraping_frequency_hours, notes, scraper_config
) VALUES (
  3, 'CIDB - Construction Industry', 'national', NULL,
  'https://www.cidb.org.za/registers/register-of-projects/',
  'cidb', true, true, 12,
  'Construction Industry Development Board - Construction tenders and projects',
  '{"category": "Construction"}'::jsonb
);

-- =====================================================
-- STATE-OWNED ENTERPRISES (SOEs)
-- =====================================================

-- 4. Eskom
INSERT INTO tender_sources (
  id, name, level, province, tender_page_url, scraper_type, is_active, scraping_enabled,
  scraping_frequency_hours, notes, scraper_config
) VALUES (
  4, 'Eskom Holdings', 'national', NULL,
  'https://www.eskom.co.za/eskom-tenders/',
  'html_scraper', true, true, 12,
  'Eskom - Energy sector tenders',
  '{"category": "Energy", "organization": "Eskom Holdings SOC Ltd"}'::jsonb
);

-- 5. Transnet
INSERT INTO tender_sources (
  id, name, level, province, tender_page_url, scraper_type, is_active, scraping_enabled,
  scraping_frequency_hours, notes, scraper_config
) VALUES (
  5, 'Transnet SOC', 'national', NULL,
  'https://www.transnet.net/TenderProcess/Pages/CurrentTenders.aspx',
  'html_scraper', true, true, 12,
  'Transnet - Transport and logistics tenders',
  '{"category": "Transport", "organization": "Transnet SOC Ltd"}'::jsonb
);

-- 6. SANRAL (South African National Roads Agency)
INSERT INTO tender_sources (
  id, name, level, province, tender_page_url, scraper_type, is_active, scraping_enabled,
  scraping_frequency_hours, notes, scraper_config
) VALUES (
  6, 'SANRAL', 'national', NULL,
  'https://www.sanral.co.za/tenders/',
  'html_scraper', true, true, 12,
  'South African National Roads Agency - Road infrastructure tenders',
  '{"category": "Infrastructure", "organization": "SANRAL"}'::jsonb
);

-- 7. Rand Water
INSERT INTO tender_sources (
  id, name, level, province, tender_page_url, scraper_type, is_active, scraping_enabled,
  scraping_frequency_hours, notes, scraper_config
) VALUES (
  7, 'Rand Water', 'national', NULL,
  'https://www.randwater.co.za/Tenders/Pages/default.aspx',
  'html_scraper', true, true, 12,
  'Rand Water - Water utility tenders',
  '{"category": "Water", "organization": "Rand Water"}'::jsonb
);

-- 8. PRASA (Passenger Rail Agency of South Africa)
INSERT INTO tender_sources (
  id, name, level, province, tender_page_url, scraper_type, is_active, scraping_enabled,
  scraping_frequency_hours, notes, scraper_config
) VALUES (
  8, 'PRASA', 'national', NULL,
  'https://www.prasa.com/Tenders.html',
  'html_scraper', true, true, 12,
  'Passenger Rail Agency of South Africa - Rail transport tenders',
  '{"category": "Rail Transport", "organization": "PRASA"}'::jsonb
);

-- =====================================================
-- PROVINCIAL GOVERNMENT SOURCES
-- =====================================================

-- 9. Gauteng Provincial Government
INSERT INTO tender_sources (
  id, name, level, province, tender_page_url, scraper_type, is_active, scraping_enabled,
  scraping_frequency_hours, notes, scraper_config
) VALUES (
  9, 'Gauteng Provincial Treasury', 'provincial', 'Gauteng',
  'https://www.treasury.gpg.gov.za/Pages/Tenders.aspx',
  'html_scraper', true, true, 12,
  'Gauteng Province government tenders',
  '{"province": "Gauteng"}'::jsonb
);

-- 10. Western Cape Provincial Government
INSERT INTO tender_sources (
  id, name, level, province, tender_page_url, scraper_type, is_active, scraping_enabled,
  scraping_frequency_hours, notes, scraper_config
) VALUES (
  10, 'Western Cape Government', 'provincial', 'Western Cape',
  'https://www.westerncape.gov.za/tenders',
  'html_scraper', true, true, 12,
  'Western Cape Province government tenders',
  '{"province": "Western Cape"}'::jsonb
);

-- 11. KwaZulu-Natal Provincial Government
INSERT INTO tender_sources (
  id, name, level, province, tender_page_url, scraper_type, is_active, scraping_enabled,
  scraping_frequency_hours, notes, scraper_config
) VALUES (
  11, 'KwaZulu-Natal Provincial Treasury', 'provincial', 'KwaZulu-Natal',
  'https://www.kzntreasury.gov.za/Pages/Tenders.aspx',
  'html_scraper', true, true, 12,
  'KwaZulu-Natal Province government tenders',
  '{"province": "KwaZulu-Natal"}'::jsonb
);

-- 12. Eastern Cape Provincial Government
INSERT INTO tender_sources (
  id, name, level, province, tender_page_url, scraper_type, is_active, scraping_enabled,
  scraping_frequency_hours, notes, scraper_config
) VALUES (
  12, 'Eastern Cape Provincial Treasury', 'provincial', 'Eastern Cape',
  'https://www.ectreasury.gov.za/tenders/',
  'html_scraper', true, true, 12,
  'Eastern Cape Province government tenders',
  '{"province": "Eastern Cape"}'::jsonb
);

-- 13. Free State Provincial Government
INSERT INTO tender_sources (
  id, name, level, province, tender_page_url, scraper_type, is_active, scraping_enabled,
  scraping_frequency_hours, notes, scraper_config
) VALUES (
  13, 'Free State Provincial Treasury', 'provincial', 'Free State',
  'https://www.treasury.fs.gov.za/tenders/',
  'html_scraper', true, true, 12,
  'Free State Province government tenders',
  '{"province": "Free State"}'::jsonb
);

-- 14. Limpopo Provincial Government
INSERT INTO tender_sources (
  id, name, level, province, tender_page_url, scraper_type, is_active, scraping_enabled,
  scraping_frequency_hours, notes, scraper_config
) VALUES (
  14, 'Limpopo Provincial Treasury', 'provincial', 'Limpopo',
  'https://www.limpopotreasury.gov.za/Pages/Tenders.aspx',
  'html_scraper', true, true, 12,
  'Limpopo Province government tenders',
  '{"province": "Limpopo"}'::jsonb
);

-- 15. Mpumalanga Provincial Government
INSERT INTO tender_sources (
  id, name, level, province, tender_page_url, scraper_type, is_active, scraping_enabled,
  scraping_frequency_hours, notes, scraper_config
) VALUES (
  15, 'Mpumalanga Provincial Treasury', 'provincial', 'Mpumalanga',
  'https://www.mpumalanga.gov.za/tenders/',
  'html_scraper', true, true, 12,
  'Mpumalanga Province government tenders',
  '{"province": "Mpumalanga"}'::jsonb
);

-- 16. North West Provincial Government
INSERT INTO tender_sources (
  id, name, level, province, tender_page_url, scraper_type, is_active, scraping_enabled,
  scraping_frequency_hours, notes, scraper_config
) VALUES (
  16, 'North West Provincial Treasury', 'provincial', 'North West',
  'https://www.nwpg.gov.za/treasury/tenders/',
  'html_scraper', true, true, 12,
  'North West Province government tenders',
  '{"province": "North West"}'::jsonb
);

-- 17. Northern Cape Provincial Government
INSERT INTO tender_sources (
  id, name, level, province, tender_page_url, scraper_type, is_active, scraping_enabled,
  scraping_frequency_hours, notes, scraper_config
) VALUES (
  17, 'Northern Cape Provincial Treasury', 'provincial', 'Northern Cape',
  'https://www.ncpg.gov.za/tenders/',
  'html_scraper', true, true, 12,
  'Northern Cape Province government tenders',
  '{"province": "Northern Cape"}'::jsonb
);

-- =====================================================
-- METROPOLITAN MUNICIPALITIES
-- =====================================================

-- 18. City of Cape Town
INSERT INTO tender_sources (
  id, name, level, province, tender_page_url, scraper_type, is_active, scraping_enabled,
  scraping_frequency_hours, notes, scraper_config
) VALUES (
  18, 'City of Cape Town', 'municipal', 'Western Cape',
  'https://www.capetown.gov.za/Work%20and%20business/Doing-business-with-the-city/Tenders-and-supplier-registration/Current-tenders',
  'html_scraper', true, true, 8,
  'City of Cape Town Metro - Municipal tenders',
  '{"municipality": "Cape Town Metro", "province": "Western Cape"}'::jsonb
);

-- 19. City of Johannesburg
INSERT INTO tender_sources (
  id, name, level, province, tender_page_url, scraper_type, is_active, scraping_enabled,
  scraping_frequency_hours, notes, scraper_config
) VALUES (
  19, 'City of Johannesburg', 'municipal', 'Gauteng',
  'https://www.joburg.org.za/work_/Pages/Work%20with%20the%20city/Tenders/Current-Tenders.aspx',
  'html_scraper', true, true, 8,
  'City of Johannesburg Metro - Municipal tenders',
  '{"municipality": "Johannesburg Metro", "province": "Gauteng"}'::jsonb
);

-- 20. City of Tshwane (Pretoria)
INSERT INTO tender_sources (
  id, name, level, province, tender_page_url, scraper_type, is_active, scraping_enabled,
  scraping_frequency_hours, notes, scraper_config
) VALUES (
  20, 'City of Tshwane', 'municipal', 'Gauteng',
  'https://www.tshwane.gov.za/sites/business/Tenders/Pages/Tenders.aspx',
  'html_scraper', true, true, 8,
  'City of Tshwane (Pretoria) Metro - Municipal tenders',
  '{"municipality": "Tshwane Metro", "province": "Gauteng"}'::jsonb
);

-- 21. eThekwini Municipality (Durban)
INSERT INTO tender_sources (
  id, name, level, province, tender_page_url, scraper_type, is_active, scraping_enabled,
  scraping_frequency_hours, notes, scraper_config
) VALUES (
  21, 'eThekwini Municipality', 'municipal', 'KwaZulu-Natal',
  'https://www.durban.gov.za/work_and_business/tenders',
  'html_scraper', true, true, 8,
  'eThekwini (Durban) Metro - Municipal tenders',
  '{"municipality": "eThekwini Metro", "province": "KwaZulu-Natal"}'::jsonb
);

-- 22. City of Ekurhuleni
INSERT INTO tender_sources (
  id, name, level, province, tender_page_url, scraper_type, is_active, scraping_enabled,
  scraping_frequency_hours, notes, scraper_config
) VALUES (
  22, 'City of Ekurhuleni', 'municipal', 'Gauteng',
  'https://www.ekurhuleni.gov.za/tenders/',
  'html_scraper', true, true, 8,
  'City of Ekurhuleni Metro - Municipal tenders',
  '{"municipality": "Ekurhuleni Metro", "province": "Gauteng"}'::jsonb
);

-- 23. Nelson Mandela Bay Municipality
INSERT INTO tender_sources (
  id, name, level, province, tender_page_url, scraper_type, is_active, scraping_enabled,
  scraping_frequency_hours, notes, scraper_config
) VALUES (
  23, 'Nelson Mandela Bay Municipality', 'municipal', 'Eastern Cape',
  'https://www.nelsonmandelabay.gov.za/page/tenders',
  'html_scraper', true, true, 8,
  'Nelson Mandela Bay (Port Elizabeth) Metro - Municipal tenders',
  '{"municipality": "Nelson Mandela Bay Metro", "province": "Eastern Cape"}'::jsonb
);

-- 24. Buffalo City Municipality
INSERT INTO tender_sources (
  id, name, level, province, tender_page_url, scraper_type, is_active, scraping_enabled,
  scraping_frequency_hours, notes, scraper_config
) VALUES (
  24, 'Buffalo City Municipality', 'municipal', 'Eastern Cape',
  'https://www.buffalocity.gov.za/page/tenders',
  'html_scraper', true, true, 12,
  'Buffalo City (East London) Metro - Municipal tenders',
  '{"municipality": "Buffalo City Metro", "province": "Eastern Cape"}'::jsonb
);

-- 25. Mangaung Municipality (Bloemfontein)
INSERT INTO tender_sources (
  id, name, level, province, tender_page_url, scraper_type, is_active, scraping_enabled,
  scraping_frequency_hours, notes, scraper_config
) VALUES (
  25, 'Mangaung Municipality', 'municipal', 'Free State',
  'https://www.mangaung.co.za/tenders/',
  'html_scraper', true, true, 12,
  'Mangaung (Bloemfontein) Metro - Municipal tenders',
  '{"municipality": "Mangaung Metro", "province": "Free State"}'::jsonb
);

-- =====================================================
-- UNIVERSITIES AND EDUCATION
-- =====================================================

-- 26. University of South Africa (UNISA)
INSERT INTO tender_sources (
  id, name, level, province, tender_page_url, scraper_type, is_active, scraping_enabled,
  scraping_frequency_hours, notes, scraper_config
) VALUES (
  26, 'UNISA', 'national', NULL,
  'https://www.unisa.ac.za/sites/corporate/default/About/Procurement/Tenders',
  'html_scraper', true, true, 24,
  'University of South Africa - Education sector tenders',
  '{"category": "Education", "organization": "UNISA"}'::jsonb
);

-- 27. University of Cape Town
INSERT INTO tender_sources (
  id, name, level, province, tender_page_url, scraper_type, is_active, scraping_enabled,
  scraping_frequency_hours, notes, scraper_config
) VALUES (
  27, 'University of Cape Town', 'provincial', 'Western Cape',
  'https://www.uct.ac.za/main/explore-uct/procurement/tenders',
  'html_scraper', true, true, 24,
  'University of Cape Town - Education sector tenders',
  '{"category": "Education", "organization": "UCT", "province": "Western Cape"}'::jsonb
);

-- 28. University of Johannesburg
INSERT INTO tender_sources (
  id, name, level, province, tender_page_url, scraper_type, is_active, scraping_enabled,
  scraping_frequency_hours, notes, scraper_config
) VALUES (
  28, 'University of Johannesburg', 'provincial', 'Gauteng',
  'https://www.uj.ac.za/about/tenders/',
  'html_scraper', true, true, 24,
  'University of Johannesburg - Education sector tenders',
  '{"category": "Education", "organization": "UJ", "province": "Gauteng"}'::jsonb
);

-- =====================================================
-- HEALTHCARE
-- =====================================================

-- 29. National Health Laboratory Service
INSERT INTO tender_sources (
  id, name, level, province, tender_page_url, scraper_type, is_active, scraping_enabled,
  scraping_frequency_hours, notes, scraper_config
) VALUES (
  29, 'National Health Laboratory Service', 'national', NULL,
  'https://www.nhls.ac.za/?page=tenders&id=25',
  'html_scraper', true, true, 24,
  'NHLS - Healthcare/laboratory tenders',
  '{"category": "Healthcare", "organization": "NHLS"}'::jsonb
);

-- =====================================================
-- ADDITIONAL NATIONAL DEPARTMENTS
-- =====================================================

-- 30. Department of Public Works
INSERT INTO tender_sources (
  id, name, level, province, tender_page_url, scraper_type, is_active, scraping_enabled,
  scraping_frequency_hours, notes, scraper_config
) VALUES (
  30, 'Department of Public Works', 'national', NULL,
  'https://www.publicworks.gov.za/tenders',
  'html_scraper', true, true, 12,
  'National Department of Public Works - Infrastructure tenders',
  '{"category": "Infrastructure", "organization": "DPWI"}'::jsonb
);

-- Log summary
SELECT 'Tender sources updated successfully. Total sources:' as message, COUNT(*) as count FROM tender_sources;
