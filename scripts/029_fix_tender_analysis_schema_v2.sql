-- Fix tender_analysis table to support both scraped and custom tenders
-- This script is idempotent and can be run multiple times safely

-- Step 1: Drop foreign key constraint if it exists
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'tender_analysis_tender_id_fkey'
        AND table_name = 'tender_analysis'
    ) THEN
        ALTER TABLE tender_analysis DROP CONSTRAINT tender_analysis_tender_id_fkey;
        RAISE NOTICE 'Dropped foreign key constraint tender_analysis_tender_id_fkey';
    ELSE
        RAISE NOTICE 'Foreign key constraint tender_analysis_tender_id_fkey does not exist, skipping';
    END IF;
END $$;

-- Step 2: Check current column type and convert if needed
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'tender_analysis' 
        AND column_name = 'tender_id' 
        AND data_type = 'uuid'
    ) THEN
        -- Convert UUID to TEXT
        ALTER TABLE tender_analysis ALTER COLUMN tender_id TYPE TEXT USING tender_id::TEXT;
        RAISE NOTICE 'Converted tender_id from UUID to TEXT';
    ELSE
        RAISE NOTICE 'tender_id is already TEXT or does not exist, skipping conversion';
    END IF;
END $$;

-- Step 3: Recreate index if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_indexes 
        WHERE indexname = 'idx_tender_analysis_tender_id'
    ) THEN
        CREATE INDEX idx_tender_analysis_tender_id ON tender_analysis(tender_id);
        RAISE NOTICE 'Created index idx_tender_analysis_tender_id';
    ELSE
        RAISE NOTICE 'Index idx_tender_analysis_tender_id already exists, skipping';
    END IF;
END $$;
