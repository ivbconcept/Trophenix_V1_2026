/*
  # Create Sponsors Table

  ## Description
  This migration creates a dedicated `sponsors` table for managing sponsor/partner entities.
  This table is separate from `sponsor_profiles` which links to user accounts.
  The `sponsors` table represents actual sponsor companies/organizations as entities.

  ## 1. New Tables
    - `sponsors`
      - `id` (uuid, primary key) - Unique identifier for the sponsor
      - `name` (text, required) - Official name of the sponsor organization
      - `logo_url` (text, optional) - URL to the sponsor's logo
      - `website` (text, optional) - Company website URL
      - `industry` (text, optional) - Industry sector
      - `description` (text, optional) - Description of the sponsor
      - `contact_email` (text, optional) - Main contact email
      - `contact_phone` (text, optional) - Main contact phone
      - `address` (text, optional) - Physical address
      - `city` (text, optional) - City
      - `country` (text, optional) - Country
      - `sponsorship_types` (text[], optional) - Types of sponsorships offered
      - `active` (boolean, default true) - Whether the sponsor is currently active
      - `created_at` (timestamptz) - Timestamp of creation
      - `updated_at` (timestamptz) - Timestamp of last update

  ## 2. Security
    - Enable RLS on `sponsors` table
    - Add policy for all authenticated users to view active sponsors
    - Add policy for authenticated users to propose new sponsors

  ## 3. Performance
    - Add index on `name` for fast lookups
    - Add index on `active` for filtering active sponsors
    - Add index on `industry` for filtering by sector
    - Add GIN index on `sponsorship_types` for array searches

  ## 4. Triggers
    - Add `updated_at` trigger to automatically update timestamp on changes
*/

-- Create sponsors table
CREATE TABLE IF NOT EXISTS sponsors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  logo_url text,
  website text,
  industry text,
  description text,
  contact_email text,
  contact_phone text,
  address text,
  city text,
  country text,
  sponsorship_types text[],
  active boolean DEFAULT true NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE sponsors ENABLE ROW LEVEL SECURITY;

-- Policy: All authenticated users can view active sponsors
CREATE POLICY "Authenticated users can view active sponsors"
  ON sponsors
  FOR SELECT
  TO authenticated
  USING (active = true);

-- Policy: Authenticated users can insert new sponsors
CREATE POLICY "Authenticated users can insert sponsors"
  ON sponsors
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

-- Policy: Users can update sponsors they created (for now, allowing all authenticated users)
CREATE POLICY "Authenticated users can update sponsors"
  ON sponsors
  FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_sponsors_name ON sponsors(name);
CREATE INDEX IF NOT EXISTS idx_sponsors_active ON sponsors(active);
CREATE INDEX IF NOT EXISTS idx_sponsors_industry ON sponsors(industry);
CREATE INDEX IF NOT EXISTS idx_sponsors_sponsorship_types ON sponsors USING GIN(sponsorship_types);
CREATE INDEX IF NOT EXISTS idx_sponsors_created_at ON sponsors(created_at DESC);

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at trigger
CREATE TRIGGER update_sponsors_updated_at
  BEFORE UPDATE ON sponsors
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
