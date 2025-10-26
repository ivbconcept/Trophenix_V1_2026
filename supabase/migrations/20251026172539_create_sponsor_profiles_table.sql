/*
  # Create Sponsor Profiles Table

  ## Description
  This migration creates the `sponsor_profiles` table to support a new type of professional user: SPONSORS.
  Sponsors are organizations or individuals who want to sponsor athletes or sports events.

  ## 1. New Tables
    - `sponsor_profiles`
      - `id` (uuid, primary key) - Unique identifier for the sponsor profile
      - `user_id` (uuid, foreign key to profiles) - Links to the main profile
      - `company_name` (text, required) - Official name of the sponsoring company/organization
      - `logo_url` (text, optional) - URL to the sponsor's logo
      - `website` (text, optional) - Company website
      - `industry_sector` (text, optional) - Industry sector (e.g., "Technology", "Finance", "Sports Equipment")
      - `company_size` (text, optional) - Size of the company (e.g., "1-10", "11-50", "51-200", "201-500", "500+")
      - `description` (text, optional) - Description of the company and sponsorship goals
      - `sponsorship_budget` (text, optional) - Budget range for sponsorships
      - `sponsorship_types` (text[], optional) - Types of sponsorships offered (e.g., "Equipment", "Financial", "Training", "Events")
      - `target_sports` (text[], optional) - Sports they want to sponsor
      - `target_athlete_level` (text[], optional) - Athlete levels they target (e.g., "Amateur", "Professional", "Elite")
      - `previous_sponsorships` (text, optional) - Description of previous sponsorship experiences
      - `contact_person` (text, optional) - Name of the contact person
      - `contact_email` (text, optional) - Contact email for sponsorship inquiries
      - `contact_phone` (text, optional) - Contact phone number
      - `linkedin_url` (text, optional) - LinkedIn company page
      - `social_media` (jsonb, optional) - Other social media links
      - `sponsorship_criteria` (text, optional) - Criteria for selecting athletes/events to sponsor
      - `created_at` (timestamptz) - Timestamp of profile creation
      - `updated_at` (timestamptz) - Timestamp of last update

  ## 2. Security
    - Enable RLS on `sponsor_profiles` table
    - Add policies for sponsors to manage their own profiles
    - Add policies for approved users to view approved sponsor profiles

  ## 3. Performance
    - Add index on `user_id` for fast lookups
    - Add index on `industry_sector` for filtering
    - Add index on `target_sports` for matching with athletes
    - Add GIN index on `sponsorship_types` for array searches

  ## 4. Triggers
    - Add `updated_at` trigger to automatically update timestamp on changes

  ## 5. Profile Type Update
    - Update profiles table constraint to include 'sponsor' as a valid user_type
*/

-- Create sponsor_profiles table
CREATE TABLE IF NOT EXISTS sponsor_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
  company_name text NOT NULL,
  logo_url text,
  website text,
  industry_sector text,
  company_size text,
  description text,
  sponsorship_budget text,
  sponsorship_types text[],
  target_sports text[],
  target_athlete_level text[],
  previous_sponsorships text,
  contact_person text,
  contact_email text,
  contact_phone text,
  linkedin_url text,
  social_media jsonb DEFAULT '{}'::jsonb,
  sponsorship_criteria text,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE sponsor_profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Sponsors can view their own profile
CREATE POLICY "Sponsors can view own profile"
  ON sponsor_profiles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = sponsor_profiles.user_id
      AND profiles.id = auth.uid()
      AND profiles.user_type = 'sponsor'
    )
  );

-- Policy: Sponsors can insert their own profile
CREATE POLICY "Sponsors can insert own profile"
  ON sponsor_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = user_id
      AND profiles.id = auth.uid()
      AND profiles.user_type = 'sponsor'
    )
  );

-- Policy: Sponsors can update their own profile
CREATE POLICY "Sponsors can update own profile"
  ON sponsor_profiles
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = sponsor_profiles.user_id
      AND profiles.id = auth.uid()
      AND profiles.user_type = 'sponsor'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = sponsor_profiles.user_id
      AND profiles.id = auth.uid()
      AND profiles.user_type = 'sponsor'
    )
  );

-- Policy: Approved users can view approved sponsor profiles
CREATE POLICY "Approved users can view approved sponsor profiles"
  ON sponsor_profiles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = sponsor_profiles.user_id
      AND profiles.validation_status = 'approved'
    )
    AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.validation_status = 'approved'
    )
  );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_sponsor_profiles_user_id ON sponsor_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_sponsor_profiles_industry_sector ON sponsor_profiles(industry_sector);
CREATE INDEX IF NOT EXISTS idx_sponsor_profiles_target_sports ON sponsor_profiles USING GIN(target_sports);
CREATE INDEX IF NOT EXISTS idx_sponsor_profiles_sponsorship_types ON sponsor_profiles USING GIN(sponsorship_types);
CREATE INDEX IF NOT EXISTS idx_sponsor_profiles_created_at ON sponsor_profiles(created_at DESC);

-- Add updated_at trigger
CREATE TRIGGER update_sponsor_profiles_updated_at
  BEFORE UPDATE ON sponsor_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Update the profiles table to support 'sponsor' user_type
DO $$
BEGIN
  -- Try to drop the existing check constraint if it exists
  IF EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'profiles_user_type_check'
  ) THEN
    ALTER TABLE profiles DROP CONSTRAINT profiles_user_type_check;
  END IF;

  -- Add the new constraint with 'sponsor' included
  ALTER TABLE profiles ADD CONSTRAINT profiles_user_type_check 
    CHECK (user_type IN ('athlete', 'company', 'sponsor'));
END $$;