-- Fix the tender_sources table to use auto-incrementing IDs
-- This allows inserting without specifying IDs

-- First, check if we need to convert the id column to SERIAL
DO $$
BEGIN
  -- Drop the existing primary key constraint if it exists
  ALTER TABLE public.tender_sources DROP CONSTRAINT IF EXISTS tender_sources_pkey;
  
  -- Create sequence if it doesn't exist
  CREATE SEQUENCE IF NOT EXISTS tender_sources_id_seq;
  
  -- Set the id column to use the sequence
  ALTER TABLE public.tender_sources ALTER COLUMN id SET DEFAULT nextval('tender_sources_id_seq');
  
  -- Set the sequence to start after the highest existing id
  -- Using PERFORM instead of SELECT in DO block
  PERFORM setval('tender_sources_id_seq', COALESCE((SELECT MAX(id) FROM public.tender_sources), 0) + 1, false);
  
  -- Re-add the primary key constraint
  ALTER TABLE public.tender_sources ADD PRIMARY KEY (id);
  
  -- Add unique constraint on tender_page_url to prevent duplicates
  ALTER TABLE public.tender_sources ADD CONSTRAINT tender_sources_url_unique UNIQUE (tender_page_url);
EXCEPTION
  WHEN duplicate_object THEN
    -- Constraints already exist, ignore
    NULL;
  WHEN others THEN
    RAISE NOTICE 'Error occurred: %', SQLERRM;
END $$;

-- Now the table is ready for inserts without specifying IDs
-- The id will auto-increment, and tender_page_url must be unique
