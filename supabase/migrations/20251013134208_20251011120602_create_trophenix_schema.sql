/*
  # Trophenix Platform - Complete Database Schema
  
  ## Overview
  This migration creates the complete database structure for the Trophenix athlete recruitment platform,
  including profile validation workflow, contact tracking, and comprehensive security policies.
  
  ## New Tables
  
  ### 1. `profiles`
  Core user profile table linked to Supabase auth
  - `id` (uuid, primary key) - Links to auth.users
  - `email` (text, unique) - User email
  - `user_type` (text) - Type: 'athlete', 'company', 'admin'
  - `validation_status` (text) - Status: 'pending', 'approved', 'rejected'
  - `created_at` (timestamptz) - Account creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp
  
  ### 2. `athlete_profiles`
  Detailed athlete information for career transition
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key) - Links to profiles
  - `first_name` (text) - Athlete first name
  - `last_name` (text) - Athlete last name
  - `photo_url` (text) - Profile photo URL
  - `sport` (text) - Primary sport practiced
  - `sport_level` (text) - Competition level
  - `achievements` (text) - Notable achievements and awards
  - `professional_history` (text) - Career history
  - `geographic_zone` (text) - Preferred location
  - `desired_field` (text) - Target industry/field
  - `position_type` (text) - Desired position type
  - `availability` (text) - Current availability status
  - `degrees` (text) - Educational qualifications
  - `recommendations` (text) - Professional recommendations
  - `voice_note_url` (text, optional) - Motivation voice recording
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)
  
  ### 3. `company_profiles`
  Company information for recruiting athletes
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key) - Links to profiles
  - `company_name` (text) - Official company name
  - `logo_url` (text, optional) - Company logo
  - `sector` (text) - Industry sector
  - `company_size` (text) - Number of employees
  - `location` (text) - Company headquarters/location
  - `hr_contact` (text) - HR contact email
  - `description` (text) - Company description
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)
  
  ### 4. `contact_events`
  Tracking system for contact interactions (KPI)
  - `id` (uuid, primary key)
  - `athlete_id` (uuid, foreign key) - Referenced athlete
  - `contactor_id` (uuid, foreign key) - User who initiated contact
  - `contactor_type` (text) - Type: 'athlete' or 'company'
  - `contacted_at` (timestamptz) - Contact timestamp
  
  ## Security
  
  ### Row Level Security (RLS)
  All tables have RLS enabled with restrictive policies:
  
  #### profiles table
  - Users can view their own profile
  - Users can update their own profile
  - Authenticated users can view approved profiles
  - Admins can view all profiles
  
  #### athlete_profiles table
  - Athletes can view and update their own profile
  - Approved users can view approved athlete profiles
  - Admins can view all athlete profiles
  
  #### company_profiles table
  - Companies can view and update their own profile
  - Approved users can view approved company profiles
  - Admins can view all company profiles
  
  #### contact_events table
  - Users can view their own contact history
  - Admins can view all contact events
  - All approved users can create contact events
  
  ## Important Notes
  - All profiles require admin validation before becoming visible to others
  - Email uniqueness is enforced at the profiles level
  - Default validation status is 'pending' for all new profiles
  - Contact tracking enables KPI analysis for platform effectiveness
  - All timestamps use timezone-aware format (timestamptz)
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  user_type text NOT NULL CHECK (user_type IN ('athlete', 'company', 'admin')),
  validation_status text NOT NULL DEFAULT 'pending' CHECK (validation_status IN ('pending', 'approved', 'rejected')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create athlete_profiles table
CREATE TABLE IF NOT EXISTS athlete_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  first_name text NOT NULL,
  last_name text NOT NULL,
  photo_url text,
  sport text NOT NULL,
  sport_level text NOT NULL,
  achievements text,
  professional_history text,
  geographic_zone text,
  desired_field text,
  position_type text,
  availability text,
  degrees text,
  recommendations text,
  voice_note_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create company_profiles table
CREATE TABLE IF NOT EXISTS company_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  company_name text NOT NULL,
  logo_url text,
  sector text NOT NULL,
  company_size text,
  location text,
  hr_contact text,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create contact_events table for KPI tracking
CREATE TABLE IF NOT EXISTS contact_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  athlete_id uuid NOT NULL REFERENCES athlete_profiles(id) ON DELETE CASCADE,
  contactor_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  contactor_type text NOT NULL CHECK (contactor_type IN ('athlete', 'company')),
  contacted_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE athlete_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_events ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Approved users can view approved profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    validation_status = 'approved'
    AND EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
      AND p.validation_status = 'approved'
    )
  );

CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND user_type = 'admin'
    )
  );

CREATE POLICY "Admins can update all profiles"
  ON profiles FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND user_type = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND user_type = 'admin'
    )
  );

-- Athlete profiles policies
CREATE POLICY "Athletes can view own profile"
  ON athlete_profiles FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid()
  );

CREATE POLICY "Athletes can insert own profile"
  ON athlete_profiles FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Athletes can update own profile"
  ON athlete_profiles FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Approved users can view approved athlete profiles"
  ON athlete_profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = athlete_profiles.user_id
      AND p.validation_status = 'approved'
    )
    AND EXISTS (
      SELECT 1 FROM profiles cu
      WHERE cu.id = auth.uid()
      AND cu.validation_status = 'approved'
    )
  );

CREATE POLICY "Admins can view all athlete profiles"
  ON athlete_profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND user_type = 'admin'
    )
  );

-- Company profiles policies
CREATE POLICY "Companies can view own profile"
  ON company_profiles FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Companies can insert own profile"
  ON company_profiles FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Companies can update own profile"
  ON company_profiles FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Approved users can view approved company profiles"
  ON company_profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = company_profiles.user_id
      AND p.validation_status = 'approved'
    )
    AND EXISTS (
      SELECT 1 FROM profiles cu
      WHERE cu.id = auth.uid()
      AND cu.validation_status = 'approved'
    )
  );

CREATE POLICY "Admins can view all company profiles"
  ON company_profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND user_type = 'admin'
    )
  );

-- Contact events policies
CREATE POLICY "Users can view own contact history"
  ON contact_events FOR SELECT
  TO authenticated
  USING (contactor_id = auth.uid());

CREATE POLICY "Approved users can create contact events"
  ON contact_events FOR INSERT
  TO authenticated
  WITH CHECK (
    contactor_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND validation_status = 'approved'
    )
  );

CREATE POLICY "Admins can view all contact events"
  ON contact_events FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND user_type = 'admin'
    )
  );

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_profiles_validation_status ON profiles(validation_status);
CREATE INDEX IF NOT EXISTS idx_profiles_user_type ON profiles(user_type);
CREATE INDEX IF NOT EXISTS idx_athlete_profiles_user_id ON athlete_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_company_profiles_user_id ON company_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_contact_events_athlete_id ON contact_events(athlete_id);
CREATE INDEX IF NOT EXISTS idx_contact_events_contactor_id ON contact_events(contactor_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_athlete_profiles_updated_at ON athlete_profiles;
CREATE TRIGGER update_athlete_profiles_updated_at
  BEFORE UPDATE ON athlete_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_company_profiles_updated_at ON company_profiles;
CREATE TRIGGER update_company_profiles_updated_at
  BEFORE UPDATE ON company_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();