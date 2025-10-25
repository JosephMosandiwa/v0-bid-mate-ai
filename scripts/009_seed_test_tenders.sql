-- Seed test tender data for development/testing
-- This will insert sample tenders from various South African government departments
-- NOTE: This script requires that tender_sources table is populated first (run scripts 010 & 011)

-- Added source_id column and proper foreign key references
INSERT INTO scraped_tenders (
  id,
  source_id,
  tender_reference,
  title,
  description,
  category,
  source_name,
  source_level,
  source_province,
  source_url,
  tender_url,
  estimated_value,
  publish_date,
  close_date,
  opening_date,
  contact_person,
  contact_email,
  contact_phone,
  is_active,
  scraped_at,
  last_updated,
  document_urls,
  raw_data
) VALUES
-- National Department of Health tender (source_id: 3)
(
  gen_random_uuid(),
  3, -- Department of Health
  'DOH/2024/001',
  'Supply and Delivery of Medical Equipment',
  'The Department of Health requires the supply and delivery of medical equipment including hospital beds, surgical instruments, and diagnostic equipment for various public hospitals across South Africa.',
  'Medical Equipment',
  'Department of Health',
  'National',
  NULL,
  'https://www.health.gov.za/tenders',
  'https://www.health.gov.za/tenders/DOH-2024-001',
  'R 15,000,000',
  NOW() - INTERVAL '5 days',
  NOW() + INTERVAL '25 days',
  NOW() + INTERVAL '35 days',
  'Ms. Sarah Nkosi',
  'sarah.nkosi@health.gov.za',
  '012 395 8000',
  true,
  NOW() - INTERVAL '1 day',
  NOW() - INTERVAL '1 day',
  '["https://www.health.gov.za/docs/tender-001.pdf"]'::jsonb,
  '{}'::jsonb
),
-- City of Cape Town tender (source_id: 37)
(
  gen_random_uuid(),
  37, -- City of Cape Town
  'CCT/2024/045',
  'Construction of Community Centre in Khayelitsha',
  'Construction of a new community centre facility including meeting rooms, sports facilities, and administrative offices. The project includes all civil works, electrical installations, and landscaping.',
  'Construction',
  'City of Cape Town',
  'Municipal',
  'Western Cape',
  'https://www.capetown.gov.za/tenders',
  'https://www.capetown.gov.za/tenders/CCT-2024-045',
  'R 8,500,000',
  NOW() - INTERVAL '3 days',
  NOW() + INTERVAL '20 days',
  NOW() + INTERVAL '30 days',
  'Mr. John Williams',
  'john.williams@capetown.gov.za',
  '021 400 1111',
  true,
  NOW() - INTERVAL '1 day',
  NOW() - INTERVAL '1 day',
  '["https://www.capetown.gov.za/docs/tender-045.pdf", "https://www.capetown.gov.za/docs/tender-045-specs.pdf"]'::jsonb,
  '{}'::jsonb
),
-- Eskom tender (source_id: 28)
(
  gen_random_uuid(),
  28, -- Eskom
  'ESK/2024/089',
  'Maintenance Services for Power Generation Equipment',
  'Provision of maintenance services for power generation equipment at various Eskom power stations. Services include preventative maintenance, repairs, and emergency callouts for turbines, generators, and auxiliary equipment.',
  'Maintenance Services',
  'Eskom',
  'SOE',
  NULL,
  'https://www.eskom.co.za/tenders',
  'https://www.eskom.co.za/tenders/ESK-2024-089',
  'R 25,000,000',
  NOW() - INTERVAL '7 days',
  NOW() + INTERVAL '15 days',
  NOW() + INTERVAL '25 days',
  'Mr. Thabo Mthembu',
  'thabo.mthembu@eskom.co.za',
  '011 800 8111',
  true,
  NOW() - INTERVAL '1 day',
  NOW() - INTERVAL '1 day',
  '["https://www.eskom.co.za/docs/tender-089.pdf"]'::jsonb,
  '{}'::jsonb
),
-- Gauteng Department of Education tender (source_id: 54)
(
  gen_random_uuid(),
  54, -- Gauteng Provincial Government
  'GDE/2024/023',
  'Supply of School Furniture and Equipment',
  'Supply and delivery of school furniture including desks, chairs, filing cabinets, and classroom equipment for primary and secondary schools in Gauteng Province.',
  'Furniture & Equipment',
  'Gauteng Department of Education',
  'Provincial',
  'Gauteng',
  'https://www.education.gpg.gov.za/tenders',
  'https://www.education.gpg.gov.za/tenders/GDE-2024-023',
  'R 12,000,000',
  NOW() - INTERVAL '2 days',
  NOW() + INTERVAL '28 days',
  NOW() + INTERVAL '38 days',
  'Ms. Nomsa Dlamini',
  'nomsa.dlamini@gauteng.gov.za',
  '011 355 0000',
  true,
  NOW() - INTERVAL '1 day',
  NOW() - INTERVAL '1 day',
  '["https://www.education.gpg.gov.za/docs/tender-023.pdf"]'::jsonb,
  '{}'::jsonb
),
-- SANRAL tender (source_id: 27)
(
  gen_random_uuid(),
  27, -- SANRAL
  'SANRAL/2024/112',
  'Road Rehabilitation on N1 Highway',
  'Rehabilitation and resurfacing of the N1 highway between Johannesburg and Pretoria, including road markings, signage, and safety barriers. Project duration: 18 months.',
  'Road Construction',
  'SANRAL',
  'SOE',
  NULL,
  'https://www.nra.co.za/tenders',
  'https://www.nra.co.za/tenders/SANRAL-2024-112',
  'R 45,000,000',
  NOW() - INTERVAL '10 days',
  NOW() + INTERVAL '10 days',
  NOW() + INTERVAL '20 days',
  'Mr. Pieter van der Merwe',
  'pieter.vandermerwe@nra.co.za',
  '012 426 6000',
  true,
  NOW() - INTERVAL '1 day',
  NOW() - INTERVAL '1 day',
  '["https://www.nra.co.za/docs/tender-112.pdf", "https://www.nra.co.za/docs/tender-112-drawings.pdf"]'::jsonb,
  '{}'::jsonb
),
-- City of Johannesburg tender (source_id: 38)
(
  gen_random_uuid(),
  38, -- City of Johannesburg
  'COJ/2024/067',
  'IT Infrastructure Upgrade for Municipal Offices',
  'Upgrade of IT infrastructure including servers, networking equipment, workstations, and software licenses for municipal offices across Johannesburg.',
  'IT Services',
  'City of Johannesburg',
  'Municipal',
  'Gauteng',
  'https://www.joburg.org.za/tenders',
  'https://www.joburg.org.za/tenders/COJ-2024-067',
  'R 18,000,000',
  NOW() - INTERVAL '4 days',
  NOW() + INTERVAL '22 days',
  NOW() + INTERVAL '32 days',
  'Ms. Lerato Mokoena',
  'lerato.mokoena@joburg.org.za',
  '011 407 7000',
  true,
  NOW() - INTERVAL '1 day',
  NOW() - INTERVAL '1 day',
  '["https://www.joburg.org.za/docs/tender-067.pdf"]'::jsonb,
  '{}'::jsonb
),
-- Department of Water and Sanitation tender (source_id: 12)
(
  gen_random_uuid(),
  12, -- Department of Water and Sanitation
  'DWS/2024/034',
  'Water Pipeline Installation in Rural Areas',
  'Installation of water pipelines and infrastructure to provide clean water access to rural communities in Limpopo Province. Includes pumping stations, storage tanks, and distribution networks.',
  'Water Infrastructure',
  'Department of Water and Sanitation',
  'National',
  NULL,
  'https://www.dws.gov.za/tenders',
  'https://www.dws.gov.za/tenders/DWS-2024-034',
  'R 32,000,000',
  NOW() - INTERVAL '6 days',
  NOW() + INTERVAL '18 days',
  NOW() + INTERVAL '28 days',
  'Mr. Sipho Khumalo',
  'sipho.khumalo@dws.gov.za',
  '012 336 7500',
  true,
  NOW() - INTERVAL '1 day',
  NOW() - INTERVAL '1 day',
  '["https://www.dws.gov.za/docs/tender-034.pdf"]'::jsonb,
  '{}'::jsonb
),
-- KwaZulu-Natal Department of Transport tender (source_id: 55)
(
  gen_random_uuid(),
  55, -- KwaZulu-Natal Provincial Government
  'KZNDOT/2024/056',
  'Bus Rapid Transit System Implementation',
  'Implementation of Bus Rapid Transit (BRT) system in Durban including dedicated bus lanes, stations, and supporting infrastructure. Project includes civil works and traffic management systems.',
  'Transport Infrastructure',
  'KZN Department of Transport',
  'Provincial',
  'KwaZulu-Natal',
  'https://www.kzntransport.gov.za/tenders',
  'https://www.kzntransport.gov.za/tenders/KZNDOT-2024-056',
  'R 55,000,000',
  NOW() - INTERVAL '8 days',
  NOW() + INTERVAL '12 days',
  NOW() + INTERVAL '22 days',
  'Ms. Zanele Ngcobo',
  'zanele.ngcobo@kzntransport.gov.za',
  '033 355 8000',
  true,
  NOW() - INTERVAL '1 day',
  NOW() - INTERVAL '1 day',
  '["https://www.kzntransport.gov.za/docs/tender-056.pdf"]'::jsonb,
  '{}'::jsonb
);

-- Update the search vectors for full-text search
UPDATE scraped_tenders
SET search_vector = 
  setweight(to_tsvector('english', COALESCE(title, '')), 'A') ||
  setweight(to_tsvector('english', COALESCE(description, '')), 'B') ||
  setweight(to_tsvector('english', COALESCE(category, '')), 'C') ||
  setweight(to_tsvector('english', COALESCE(source_name, '')), 'C')
WHERE search_vector IS NULL;

-- Verify the data was inserted
SELECT COUNT(*) as inserted_count FROM scraped_tenders;
