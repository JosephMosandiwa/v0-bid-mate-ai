-- Add BEE status and VAT number fields to companies table

ALTER TABLE public.companies
ADD COLUMN IF NOT EXISTS bee_status text,
ADD COLUMN IF NOT EXISTS vat_number text;

-- Add comment to describe the fields
COMMENT ON COLUMN public.companies.bee_status IS 'BEE (Broad-Based Black Economic Empowerment) status level (1-3)';
COMMENT ON COLUMN public.companies.vat_number IS 'VAT (Value Added Tax) registration number';
