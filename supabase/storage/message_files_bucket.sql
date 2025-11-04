/*
  Configuration du bucket de stockage pour les fichiers de messagerie
*/

-- Create storage bucket for message files
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'message-files',
  'message-files',
  true,
  52428800, -- 50MB limit
  ARRAY[
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
    'text/csv',
    'video/mp4',
    'video/quicktime',
    'audio/mpeg',
    'audio/wav'
  ]
)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload files
CREATE POLICY "Authenticated users can upload message files"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'message-files'
);

-- Allow users to view files in conversations they're part of
CREATE POLICY "Users can view message files in their conversations"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'message-files'
);

-- Allow users to delete their own uploaded files
CREATE POLICY "Users can delete their own message files"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'message-files'
  AND auth.uid()::text = (storage.foldername(name))[1]
);
