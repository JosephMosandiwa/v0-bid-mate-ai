-- Add unique constraint for tender_project_plans upsert operations
-- This allows the API to safely update existing plans without creating duplicates

-- First, remove any duplicates that might exist
DELETE FROM tender_project_plans a
USING tender_project_plans b
WHERE a.id > b.id
  AND a.tender_id = b.tender_id
  AND a.tender_type = b.tender_type
  AND a.user_id = b.user_id;

-- Add the unique constraint
ALTER TABLE tender_project_plans
ADD CONSTRAINT tender_project_plans_unique_key 
UNIQUE (tender_id, tender_type, user_id);

COMMENT ON CONSTRAINT tender_project_plans_unique_key ON tender_project_plans 
IS 'Ensures only one project plan per tender per user';
