-- Make documents bucket public for viewing uploaded files
UPDATE storage.buckets SET public = true WHERE id = 'documents';

-- Add RLS policy for public read access
CREATE POLICY "Public read access for documents" 
ON storage.objects FOR SELECT
USING (bucket_id = 'documents');