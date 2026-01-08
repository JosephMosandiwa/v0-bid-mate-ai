-- Relax MIME type restrictions for tender-documents bucket
-- This allows text files for testing and potential other document types (Word, etc.)
UPDATE storage.buckets
SET allowed_mime_types = NULL
WHERE id = 'tender-documents';
