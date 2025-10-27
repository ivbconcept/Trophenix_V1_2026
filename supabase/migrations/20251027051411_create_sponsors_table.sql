/*
  # Create sponsors table

  1. New Tables
    - `sponsors`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `company_name` (text, required)
      - `company_type` (text, required) - Type d'entreprise (sponsor, partenaire, etc.)
      - `sector` (text) - Secteur d'activité
      - `company_size` (text) - Taille de l'entreprise
      - `location` (text) - Localisation
      - `website` (text) - Site web
      - `description` (text) - Description de l'entreprise
      - `logo_url` (text) - URL du logo
      - `contact_email` (text, required)
      - `contact_phone` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
  
  2. Security
    - Enable RLS on `sponsors` table
    - Add policy for authenticated users to read all sponsor profiles
    - Add policy for sponsors to read their own profile
    - Add policy for sponsors to update their own profile
    - Add policy for sponsors to insert their own profile
*/

CREATE TABLE IF NOT EXISTS sponsors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  company_name text NOT NULL,
  company_type text NOT NULL DEFAULT 'sponsor',
  sector text,
  company_size text,
  location text,
  website text,
  description text,
  logo_url text,
  contact_email text NOT NULL,
  contact_phone text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE sponsors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone authenticated can view sponsor profiles"
  ON sponsors
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Sponsors can insert own profile"
  ON sponsors
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Sponsors can update own profile"
  ON sponsors
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Sponsors can delete own profile"
  ON sponsors
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_sponsors_user_id ON sponsors(user_id);
CREATE INDEX IF NOT EXISTS idx_sponsors_company_name ON sponsors(company_name);
CREATE INDEX IF NOT EXISTS idx_sponsors_sector ON sponsors(sector);
CREATE INDEX IF NOT EXISTS idx_sponsors_location ON sponsors(location);