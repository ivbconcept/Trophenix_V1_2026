/*
  # Create Presentation Letters System for Sponsors

  1. New Tables
    - `presentation_letters` - Lettres créées
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `title` (text)
      - `content` (text)
      - `is_default` (boolean)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `presentation_letter_files` - Lettres téléchargées
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `file_name` (text)
      - `file_path` (text)
      - `file_size` (bigint)
      - `file_type` (text)
      - `uploaded_at` (timestamptz)
  
  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage their own data
*/

-- Create presentation_letters table
CREATE TABLE IF NOT EXISTS presentation_letters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL DEFAULT 'Ma lettre de présentation',
  content text NOT NULL DEFAULT '',
  is_default boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create presentation_letter_files table
CREATE TABLE IF NOT EXISTS presentation_letter_files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  file_name text NOT NULL,
  file_path text NOT NULL,
  file_size bigint NOT NULL,
  file_type text NOT NULL,
  uploaded_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE presentation_letters ENABLE ROW LEVEL SECURITY;
ALTER TABLE presentation_letter_files ENABLE ROW LEVEL SECURITY;

-- Policies for presentation_letters
CREATE POLICY "Users can view own presentation letters"
  ON presentation_letters FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own presentation letters"
  ON presentation_letters FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own presentation letters"
  ON presentation_letters FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own presentation letters"
  ON presentation_letters FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for presentation_letter_files
CREATE POLICY "Users can view own presentation letter files"
  ON presentation_letter_files FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own presentation letter files"
  ON presentation_letter_files FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own presentation letter files"
  ON presentation_letter_files FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_presentation_letters_user_id ON presentation_letters(user_id);
CREATE INDEX IF NOT EXISTS idx_presentation_letter_files_user_id ON presentation_letter_files(user_id);
