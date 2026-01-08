-- Create storage bucket for tender documents
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'tender-documents',
  'tender-documents',
  false, -- Private bucket, requires signed URLs
  52428800, -- 50MB limit
  ARRAY['application/pdf']
)
ON CONFLICT (id) DO UPDATE SET
  public = false,
  file_size_limit = 52428800,
  allowed_mime_types = ARRAY['application/pdf'];

-- Enable RLS on objects - SKIPPED (Requires superuser, usually already enabled)
-- ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Authenticated users can upload tender documents" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update tender documents" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can read tender documents" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete tender documents" ON storage.objects;

-- Create policies

-- 1. Upload
CREATE POLICY "Authenticated users can upload tender documents"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'tender-documents' 
  AND auth.role() = 'authenticated'
);

-- 2. Read (Owner only - assuming path starts with user_id or is temp/user_id)
-- For simplicity in this fix, we allow authenticated users to read any file in this bucket 
-- if they have a signed URL (which is handled by the private bucket setting + server generation).
-- But RLS still applies for direct access via client SDK.
-- Let's check path ownership for better security.
-- Paths are: "user_id/..." or "temp/user_id/..."
CREATE POLICY "Authenticated users can read tender documents"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'tender-documents'
  AND auth.role() = 'authenticated'
  AND (
    (storage.foldername(name))[1] = auth.uid()::text
    OR
    (storage.foldername(name))[1] = 'temp' AND (storage.foldername(name))[2] = auth.uid()::text
  )
);

-- 3. Update (if needed)
CREATE POLICY "Authenticated users can update tender documents"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'tender-documents'
  AND auth.role() = 'authenticated'
  AND (
    (storage.foldername(name))[1] = auth.uid()::text
    OR
    (storage.foldername(name))[1] = 'temp' AND (storage.foldername(name))[2] = auth.uid()::text
  )
);

-- 4. Delete
CREATE POLICY "Authenticated users can delete tender documents"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'tender-documents'
  AND auth.role() = 'authenticated'
  AND (
    (storage.foldername(name))[1] = auth.uid()::text
    OR
    (storage.foldername(name))[1] = 'temp' AND (storage.foldername(name))[2] = auth.uid()::text
  )
);
