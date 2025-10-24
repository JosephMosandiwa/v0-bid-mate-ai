-- Create tender_sources table to store information about scraping sources
CREATE TABLE IF NOT EXISTS public.tender_sources (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  level TEXT, -- National, Provincial, Metro, etc.
  province TEXT,
  tender_page_url TEXT NOT NULL,
  notes TEXT,
  
  -- Scraping configuration
  is_active BOOLEAN DEFAULT TRUE, -- Whether to scrape this source
  scraping_enabled BOOLEAN DEFAULT FALSE, -- Whether scraping is configured
  last_scraped_at TIMESTAMP WITH TIME ZONE,
  scraping_frequency_hours INTEGER DEFAULT 24, -- How often to scrape
  scraper_type TEXT, -- Type of scraper to use (generic, custom, etc.)
  scraper_config JSONB, -- Configuration for the scraper
  
  -- Statistics
  total_tenders_scraped INTEGER DEFAULT 0,
  last_scrape_status TEXT, -- success, failed, partial
  last_scrape_error TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert the 100 sources from the provided list
INSERT INTO public.tender_sources (id, name, level, province, tender_page_url, notes) VALUES
(1, 'eTenders (National eTender portal)', 'National', 'All', 'https://www.etenders.gov.za/', 'Primary national tender portal'),
(2, 'South African Government - Tenders (gov.za)', 'National', 'All', 'https://www.gov.za/tenders', 'Portal index / links'),
(3, 'Department of Health', 'National', NULL, 'https://www.health.gov.za/index.php/2014-03-17-09-09-38/tenders', 'National dept tenders'),
(4, 'Department of Basic Education', 'National', NULL, 'https://www.education.gov.za/Resources/Tenders.aspx', NULL),
(5, 'National Treasury', 'National', NULL, 'http://www.treasury.gov.za/', 'Treasury procurement notices & guidance; many tenders via eTenders'),
(6, 'Department of Public Works & Infrastructure', 'National', NULL, 'https://www.publicworks.gov.za/tenders.html', 'Public Works tenders'),
(7, 'Department of Defence', 'National', NULL, 'https://www.defence.gov.za/Procurement/', 'Procurement notices'),
(8, 'Department of Home Affairs', 'National', NULL, 'http://www.dha.gov.za/index.php/tenders', NULL),
(9, 'Department of Justice & Constitutional Development', 'National', NULL, 'https://www.justice.gov.za/', NULL),
(10, 'SAPS (South African Police Service)', 'National', NULL, 'https://www.saps.gov.za/', 'Police procurement notices'),
(11, 'Department of Trade, Industry and Competition (DTIC)', 'National', NULL, 'https://www.thedtic.gov.za/category/tenders/', 'DTIC tenders & opportunities'),
(12, 'Department of Water and Sanitation', 'National', NULL, 'https://www.dws.gov.za/Pages/Procurement.aspx', NULL),
(13, 'Department of Transport', 'National', NULL, 'http://www.transport.gov.za/', NULL),
(14, 'Department of Labour', 'National', NULL, 'http://www.labour.gov.za/', NULL),
(15, 'Department of Agriculture, Land Reform & Rural Development', 'National', NULL, 'https://www.dalrrd.gov.za/', NULL),
(16, 'Department of Mineral Resources & Energy', 'National', NULL, 'http://www.energy.gov.za/', NULL),
(17, 'Department of Forestry, Fisheries & the Environment', 'National', NULL, 'https://www.environment.gov.za/', NULL),
(18, 'Department of Social Development', 'National', NULL, 'https://www.gov.za/about-government/contact-directory/social-development', NULL),
(19, 'Department of Human Settlements', 'National', NULL, 'https://www.dhs.gov.za/', NULL),
(20, 'Department of Communications and Digital Technologies', 'National', NULL, 'https://www.cdt.gov.za/', NULL),
(21, 'Department of Science and Innovation', 'National', NULL, 'https://www.dst.gov.za/', NULL),
(22, 'Department of Sport, Arts and Culture', 'National', NULL, 'https://www.dac.gov.za/', NULL),
(23, 'SARS (South African Revenue Service)', 'National', NULL, 'https://www.sars.gov.za/Pages/Default.aspx', 'Some procurement notices'),
(24, 'CSIR (Council for Scientific and Industrial Research)', 'Public Entity', 'Gauteng', 'https://www.csir.co.za/tenders', 'Public entity tenders'),
(25, 'SABS (South African Bureau of Standards)', 'Public Entity', 'Gauteng', 'https://www.sabs.co.za/en/News/Pages/Tenders.aspx', NULL),
(26, 'NHLS (National Health Laboratory Service)', 'Public Entity', 'Gauteng', 'https://www.nhls.ac.za/', 'Procurement / tender notices'),
(27, 'SANRAL (South African National Roads Agency)', 'SOE', 'National', 'https://www.nra.co.za/tenders/', 'Major infrastructure tenders'),
(28, 'Eskom', 'SOE', 'National', 'https://www.eskom.co.za/OurCompany/Procurement/Pages/CurrentTenders.aspx', 'Major energy sector tenders'),
(29, 'Transnet', 'SOE', 'National', 'https://www.transnet.net/Pages/Tenders.aspx', 'Rail and port tenders'),
(30, 'ACSA (Airports Company South Africa)', 'SOE', 'National', 'https://www.airports.co.za/News/Pages/Tenders.aspx', 'Airport contracts'),
(31, 'PRASA (Passenger Rail Agency of South Africa)', 'SOE', 'National', 'https://www.prasa.com/', 'Check procurement section'),
(32, 'SANParks (South African National Parks)', 'Public Entity', 'National', 'https://www.sanparks.org/', 'Procurement & tenders'),
(33, 'NSFAS (National Student Financial Aid Scheme)', 'Public Entity', 'National', 'https://www.nsfas.org.za/', 'Procurement notices'),
(34, 'Council for Geoscience', 'Public Entity', 'Gauteng', 'https://www.geoscience.org.za/', 'Tenders / procurement'),
(35, 'SAPO (South African Post Office)', 'SOE', 'National', 'https://www.postoffice.co.za/', 'Procurement notifications'),
(36, 'Denel', 'SOE', 'Gauteng', 'https://www.denel.co.za/', 'Defence industry tenders'),
(37, 'City of Cape Town', 'Metro', 'Western Cape', 'https://web1.capetown.gov.za/web1/tenderportal/Tender', 'Cape Town Tender Portal'),
(38, 'City of Johannesburg', 'Metro', 'Gauteng', 'https://www.joburg.org.za/work_/Pages/Work%20in%20Joburg/Tenders%20and%20Quotations/Tenders-and-Quotations.aspx', 'Joburg tenders page'),
(39, 'eThekwini Metropolitan Municipality (Durban)', 'Metro', 'KwaZulu-Natal', 'https://ethekwinisupplierportal.durban.gov.za/', 'Supplier portal & tenders'),
(40, 'City of Tshwane', 'Metro', 'Gauteng', 'https://www.tshwane.gov.za/Pages/Procurement-and-Tenders.aspx', 'Tshwane tenders'),
(41, 'City of Ekurhuleni', 'Metro', 'Gauteng', 'https://www.ekurhuleni.gov.za/Pages/Procurement.aspx', 'Ekurhuleni procurement'),
(42, 'Nelson Mandela Bay Municipality', 'Metro', 'Eastern Cape', 'https://www.nelsonmandelabay.gov.za/', 'Procurement / tenders section'),
(43, 'Buffalo City Metropolitan Municipality', 'Metro', 'Eastern Cape', 'https://www.buffalocity.gov.za/', 'Tenders / procurement'),
(44, 'Mangaung Metropolitan Municipality', 'Metro', 'Free State', 'https://www.mangaung.co.za/', 'Tenders / procurement'),
(45, 'City of Polokwane', 'Local/Municipal', 'Limpopo', 'https://www.polokwane.gov.za/', 'Procurement notices'),
(46, 'City of Mbombela (Nelspruit)', 'Local/Municipal', 'Mpumalanga', 'https://www.mbombela.gov.za/', 'Tenders / procurement'),
(47, 'Msunduzi Local Municipality (Pietermaritzburg)', 'Local/Municipal', 'KwaZulu-Natal', 'https://www.msunduzi.gov.za/', 'Procurement'),
(48, 'Stellenbosch Municipality', 'Local/Municipal', 'Western Cape', 'https://www.stellenbosch.gov.za/', 'Tenders / procurement'),
(49, 'Drakenstein Municipality', 'Local/Municipal', 'Western Cape', 'https://www.drakenstein.gov.za/', 'Tenders / procurement'),
(50, 'Nelson Mandela University (NMU) - Tenders', 'Public Entity', 'Eastern Cape', 'https://www.mandela.ac.za/', 'University tenders')
ON CONFLICT (id) DO NOTHING;

-- Continue with remaining sources (51-100)
INSERT INTO public.tender_sources (id, name, level, province, tender_page_url, notes) VALUES
(51, 'University of Cape Town (UCT) - Procurement', 'Public Entity', 'Western Cape', 'https://www.uct.ac.za/', 'Tenders / procurement'),
(52, 'University of the Witwatersrand (Wits) - Tenders', 'Public Entity', 'Gauteng', 'https://www.wits.ac.za/', 'Procurement notices'),
(53, 'Western Cape Government - Tenders', 'Provincial', 'Western Cape', 'https://www.westerncape.gov.za/treasury/article/tenders', 'Provincial tenders'),
(54, 'Gauteng Provincial Government - Website', 'Provincial', 'Gauteng', 'https://www.gauteng.gov.za/Pages/default.aspx', 'Search tenders on site'),
(55, 'KwaZulu-Natal Provincial Government - Procurement', 'Provincial', 'KwaZulu-Natal', 'https://www.kzn.gov.za/', 'Procurement / tenders'),
(56, 'Eastern Cape Provincial Government - Tenders', 'Provincial', 'Eastern Cape', 'https://www.ecprov.gov.za/', 'Search procurement'),
(57, 'Free State Provincial Government - Tenders', 'Provincial', 'Free State', 'https://www.freestateonline.fs.gov.za/', 'Search tenders'),
(58, 'Limpopo Provincial Government - Tenders', 'Provincial', 'Limpopo', 'https://www.limpopo.gov.za/', 'Search tenders'),
(59, 'Mpumalanga Provincial Government - Tenders', 'Provincial', 'Mpumalanga', 'https://www.mpumalanga.gov.za/', 'Search tenders'),
(60, 'Northern Cape Provincial Government - Tenders', 'Provincial', 'Northern Cape', 'https://www.northern-cape.gov.za/', 'Search tenders'),
(61, 'North West Provincial Government - Tenders', 'Provincial', 'North West', 'https://www.gov.za/about-government/contact-directory/north-west', 'Search tenders'),
(62, 'Sol Plaatje Municipality (Kimberley)', 'Local/Municipal', 'Northern Cape', 'https://www.solplaattie.gov.za/', 'Tenders / procurement'),
(63, 'Mossel Bay Municipality', 'Local/Municipal', 'Western Cape', 'https://www.mosselbay.gov.za/', 'Tenders'),
(64, 'Overstrand Municipality', 'Local/Municipal', 'Western Cape', 'https://www.overstrand.gov.za/', 'Tenders / procurement'),
(65, 'George Municipality', 'Local/Municipal', 'Western Cape', 'https://www.george.gov.za/', 'Procurement notices'),
(66, 'Bitou Municipality (Plettenberg Bay)', 'Local/Municipal', 'Western Cape', 'https://www.bitou.gov.za/', 'Tenders / procurement'),
(67, 'Knysna Municipality', 'Local/Municipal', 'Western Cape', 'https://www.knysna.gov.za/', 'Tenders'),
(68, 'Cape Winelands District Municipality', 'District', 'Western Cape', 'https://www.capewinelands.gov.za/', 'Tenders / procurement'),
(69, 'Overberg District Municipality', 'District', 'Western Cape', 'https://www.overberg.gov.za/', 'Tenders'),
(70, 'Garden Route District Municipality', 'District', 'Western Cape', 'https://www.gardenroute.gov.za/', 'Tenders'),
(71, 'West Coast District Municipality', 'District', 'Western Cape', 'https://www.westcoast.gov.za/', 'Tenders'),
(72, 'Nelson Mandela Bay Municipality - Supplier Portal', 'Metro', 'Eastern Cape', 'https://www.nelsonmandelabay.gov.za/', 'Supplier portal / tenders'),
(73, 'Sedibeng District Municipality', 'District', 'Gauteng', 'https://www.sedibeng.gov.za/', 'Tenders / procurement'),
(74, 'Mopani District Municipality', 'District', 'Limpopo', 'https://www.mopani.gov.za/', 'Tenders / procurement'),
(75, 'Vhembe District Municipality', 'District', 'Limpopo', 'https://www.vhembe.gov.za/', 'Tenders'),
(76, 'Capricorn District Municipality', 'District', 'Limpopo', 'https://www.capricorn.gov.za/', 'Tenders'),
(77, 'City Power Johannesburg - Procurement', 'Municipal Entity', 'Gauteng', 'https://www.citypower.co.za/Pages/Procurement.aspx', 'Electricity services tenders'),
(78, 'Johannesburg Roads Agency (JRA) - Procurement', 'Municipal Entity', 'Gauteng', 'https://www.jra.org.za/procurement-tenders/', 'Roads agency tenders'),
(79, 'TendersInfo (aggregator)', 'Aggregator', 'All', 'https://www.tendersinfo.com/global-south-africa-tenders.php', 'Commercial aggregator'),
(80, 'TenderBulletins (aggregator)', 'Aggregator', 'All', 'https://tenderbulletins.co.za/', 'Local aggregator'),
(81, 'National Lotteries Commission (NLC) - Tenders', 'Public Entity', 'Gauteng', 'https://www.nlcsa.org.za/', 'Procurement / tenders'),
(82, 'SANAS - Tenders', 'Public Entity', 'Gauteng', 'https://www.sanas.co.za/', 'Procurement notices'),
(83, 'City of Matlosana Municipality', 'Local/Municipal', 'North West', 'https://www.matlosana.gov.za/', 'Tenders'),
(84, 'City of Rustenburg Municipality', 'Local/Municipal', 'North West', 'https://www.rustenburg.gov.za/', 'Tenders / procurement'),
(85, 'Madibeng Local Municipality', 'Local/Municipal', 'North West', 'https://www.madibeng.gov.za/', 'Tenders'),
(86, 'Sasol Procurement - Suppliers', 'Private Corp', 'Gauteng', 'https://www.sasol.com/suppliers', 'Major corporate procurement'),
(87, 'Eastern Cape Dept of Health - Tenders', 'Provincial', 'Eastern Cape', 'https://www.ecdoh.gov.za/', 'Provincial health tenders'),
(88, 'KwaZulu-Natal Dept of Health - Tenders', 'Provincial', 'KwaZulu-Natal', 'https://www.kznhealth.gov.za/', 'Provincial health tenders'),
(89, 'Polokwane Local Municipality - procurement', 'Local/Municipal', 'Limpopo', 'https://www.polokwane.gov.za/', 'Procurement notices'),
(90, 'SANRAL - Tender Notices (alternate)', 'SOE', 'National', 'https://www.nra.co.za/tenders/', 'Alternate SANRAL link'),
(91, 'Eskom Tender / Supplier Portal (alt)', 'SOE', 'National', 'https://www.eskom.co.za/', 'Alternate Eskom procurement'),
(92, 'Transnet Supplier Portal (alt)', 'SOE', 'National', 'https://www.transnet.net/', 'Alternate Transnet page'),
(93, 'ACSA Supplier / Procurement', 'SOE', 'National', 'https://www.airports.co.za/Pages/Suppliers.aspx', 'Supplier info'),
(94, 'PRASA Procurement', 'SOE', 'National', 'https://www.prasa.com/', 'PRASA procurement'),
(95, 'SANParks Supplier Notices', 'Public Entity', 'National', 'https://www.sanparks.org/', 'Procurement'),
(96, 'NHLS Tender Notices (alt)', 'Public Entity', 'Gauteng', 'https://www.nhls.ac.za/', 'NHLS procurement'),
(97, 'Denel Supplier / Tenders (alt)', 'SOE', 'Gauteng', 'https://www.denel.co.za/', 'Denel procurement'),
(98, 'Sappi Procurement - Suppliers', 'Private Corp', 'Gauteng', 'https://www.sappi.com/suppliers', 'Commercial procurement'),
(99, 'Municipal Demarcation Board - Links (for municipalities)', 'National', 'All', 'http://www.demarcation.org.za/', 'Useful for municipality list'),
(100, 'National Department & Provincial Index (general)', 'National', 'All', 'https://www.gov.za/', 'Use gov.za to find departmental tender pages')
ON CONFLICT (id) DO NOTHING;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_tender_sources_level ON public.tender_sources(level);
CREATE INDEX IF NOT EXISTS idx_tender_sources_province ON public.tender_sources(province);
CREATE INDEX IF NOT EXISTS idx_tender_sources_is_active ON public.tender_sources(is_active);
CREATE INDEX IF NOT EXISTS idx_tender_sources_scraping_enabled ON public.tender_sources(scraping_enabled);

-- Enable Row Level Security
ALTER TABLE public.tender_sources ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all authenticated users to read sources
CREATE POLICY "Allow authenticated users to read tender sources"
  ON public.tender_sources
  FOR SELECT
  TO authenticated
  USING (true);

-- Create policy to allow service role to manage sources
CREATE POLICY "Allow service role to manage tender sources"
  ON public.tender_sources
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
