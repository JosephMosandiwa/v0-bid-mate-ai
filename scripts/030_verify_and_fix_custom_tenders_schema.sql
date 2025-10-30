-- Verify and fix user_custom_tenders schema
-- This script adds any missing columns to the user_custom_tenders table

-- Add deadline column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'user_custom_tenders' 
        AND column_name = 'deadline'
    ) THEN
        ALTER TABLE user_custom_tenders ADD COLUMN deadline TEXT;
        RAISE NOTICE 'Added deadline column';
    ELSE
        RAISE NOTICE 'deadline column already exists';
    END IF;
END $$;

-- Add estimated_value column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'user_custom_tenders' 
        AND column_name = 'estimated_value'
    ) THEN
        ALTER TABLE user_custom_tenders ADD COLUMN estimated_value TEXT;
        RAISE NOTICE 'Added estimated_value column';
    ELSE
        RAISE NOTICE 'estimated_value column already exists';
    END IF;
END $$;

-- Add close_date column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'user_custom_tenders' 
        AND column_name = 'close_date'
    ) THEN
        ALTER TABLE user_custom_tenders ADD COLUMN close_date TIMESTAMPTZ;
        RAISE NOTICE 'Added close_date column';
    ELSE
        RAISE NOTICE 'close_date column already exists';
    END IF;
END $$;

-- Verify all columns exist
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'user_custom_tenders'
ORDER BY ordinal_position;
