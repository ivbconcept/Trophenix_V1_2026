/*
  # Create Cover Letter Files System

  1. New Tables
    - `cover_letter_files`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `file_name` (text)
      - `file_path` (text)
      - `file_size` (bigint)
      - `file_type` (text)
      - `uploaded_at` (timestamptz)
  
  2. Security
    - Enable RLS on `cover_letter_files` table
    - Add policies for authenticated users to manage their own files
    - Files stored in existing cv-files bucket
*/

-- Create cover_letter_files table
CREATE TABLE IF NOT EXISTS cover_letter_files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  file_name text NOT NULL,
  file_path text NOT NULL,
  file_size bigint NOT NULL,
  file_type text NOT NULL,
  uploaded_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE cover_letter_files ENABLE ROW LEVEL SECURITY;

-- Policies for cover_letter_files
CREATE POLICY "Users can view own cover letter files"
  ON cover_letter_files FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own cover letter files"
  ON cover_letter_files FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own cover letter files"
  ON cover_letter_files FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_cover_letter_files_user_id ON cover_letter_files(user_id);
