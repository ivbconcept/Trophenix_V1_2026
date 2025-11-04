/*
  # Create CV Files System

  1. New Tables
    - `cv_files`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `file_name` (text)
      - `file_path` (text)
      - `file_size` (bigint)
      - `file_type` (text)
      - `uploaded_at` (timestamptz)
  
  2. Storage
    - Create `cv-files` bucket for storing CV documents
  
  3. Security
    - Enable RLS on `cv_files` table
    - Add policies for authenticated users to manage their own files
    - Set bucket policies for authenticated users
*/

-- Create cv_files table
CREATE TABLE IF NOT EXISTS cv_files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  file_name text NOT NULL,
  file_path text NOT NULL,
  file_size bigint NOT NULL,
  file_type text NOT NULL,
  uploaded_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE cv_files ENABLE ROW LEVEL SECURITY;

-- Policies for cv_files
CREATE POLICY "Users can view own CV files"
  ON cv_files FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own CV files"
  ON cv_files FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own CV files"
  ON cv_files FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create storage bucket for CV files
INSERT INTO storage.buckets (id, name, public)
VALUES ('cv-files', 'cv-files', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for cv-files bucket
CREATE POLICY "Users can upload their own CV files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'cv-files' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can view their own CV files"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'cv-files' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can delete their own CV files"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'cv-files' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_cv_files_user_id ON cv_files(user_id);
