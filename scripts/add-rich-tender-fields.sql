-- Add rich tender fields to support all data from eTender API
-- These fields store comprehensive tender information for better user experience

-- Add new columns if they don't exist
DO $$ 
BEGIN
  -- Location/Province fields
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'scraped_tenders' AND column_name = 'province') THEN
    ALTER TABLE scraped_tenders ADD COLUMN province TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'scraped_tenders' AND column_name = 'location') THEN
    ALTER TABLE scraped_tenders ADD COLUMN location TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'scraped_tenders' AND column_name = 'delivery_location') THEN
    ALTER TABLE scraped_tenders ADD COLUMN delivery_location TEXT;
  END IF;
  
  -- Procurement details
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'scraped_tenders' AND column_name = 'procurement_method') THEN
    ALTER TABLE scraped_tenders ADD COLUMN procurement_method TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'scraped_tenders' AND column_name = 'procurement_category') THEN
    ALTER TABLE scraped_tenders ADD COLUMN procurement_category TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'scraped_tenders' AND column_name = 'tender_type') THEN
    ALTER TABLE scraped_tenders ADD COLUMN tender_type TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'scraped_tenders' AND column_name = 'status') THEN
    ALTER TABLE scraped_tenders ADD COLUMN status TEXT;
  END IF;
  
  -- Special conditions and requirements
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'scraped_tenders' AND column_name = 'special_conditions') THEN
    ALTER TABLE scraped_tenders ADD COLUMN special_conditions TEXT;
  END IF;
  
  -- Organization details
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'scraped_tenders' AND column_name = 'organization') THEN
    ALTER TABLE scraped_tenders ADD COLUMN organization TEXT;
  END IF;
  
  -- Quality tracking
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'scraped_tenders' AND column_name = 'quality_score') THEN
    ALTER TABLE scraped_tenders ADD COLUMN quality_score NUMERIC;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'scraped_tenders' AND column_name = 'quality_grade') THEN
    ALTER TABLE scraped_tenders ADD COLUMN quality_grade TEXT;
  END IF;
END $$;

-- Create index on province for faster filtering
CREATE INDEX IF NOT EXISTS idx_scraped_tenders_province ON scraped_tenders(province);
CREATE INDEX IF NOT EXISTS idx_scraped_tenders_category ON scraped_tenders(category);
CREATE INDEX IF NOT EXISTS idx_scraped_tenders_status ON scraped_tenders(status);
CREATE INDEX IF NOT EXISTS idx_scraped_tenders_close_date ON scraped_tenders(close_date);

-- Add unique constraint for tender_reference + source_id to properly handle duplicates
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'scraped_tenders_source_reference_unique'
  ) THEN
    ALTER TABLE scraped_tenders 
    ADD CONSTRAINT scraped_tenders_source_reference_unique 
    UNIQUE (source_id, tender_reference);
  END IF;
EXCEPTION WHEN others THEN
  -- Constraint might already exist or data violates it
  RAISE NOTICE 'Could not add unique constraint: %', SQLERRM;
END $$;

COMMENT ON COLUMN scraped_tenders.province IS 'Province/region where tender applies (e.g., Gauteng, Western Cape)';
COMMENT ON COLUMN scraped_tenders.location IS 'General location or address for tender delivery';
COMMENT ON COLUMN scraped_tenders.delivery_location IS 'Specific delivery location from eTender API';
COMMENT ON COLUMN scraped_tenders.procurement_method IS 'Open, Restricted, Negotiated, etc.';
COMMENT ON COLUMN scraped_tenders.procurement_category IS 'Main procurement category (goods, services, works)';
COMMENT ON COLUMN scraped_tenders.tender_type IS 'Type of tender (RFQ, RFP, EOI, etc.)';
COMMENT ON COLUMN scraped_tenders.status IS 'Current tender status (active, closed, awarded)';
COMMENT ON COLUMN scraped_tenders.special_conditions IS 'Special conditions or notes from tender';
COMMENT ON COLUMN scraped_tenders.organization IS 'Procuring organization/entity name';
COMMENT ON COLUMN scraped_tenders.quality_score IS 'Data quality score (0-100)';
COMMENT ON COLUMN scraped_tenders.quality_grade IS 'Data quality grade (A, B, C, D, F)';
