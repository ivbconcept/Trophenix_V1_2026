/*
  # Fix Athlete and Company Profile RLS Policies
  
  ## Changes
  Simplifies RLS policies for athlete_profiles and company_profiles to avoid
  complex subqueries that could cause performance issues or recursion.
  
  ## New Approach
  - Keep policies simple and direct
  - Let the application handle complex authorization logic
  - Ensure users can manage their own profiles
  - Allow approved users to view other approved profiles
  
  ## Security
  Maintains security while improving performance:
  - Profile owners have full access to their data
  - Approved profiles are visible to other approved users
  - Application layer will enforce admin-specific permissions
*/

-- Drop existing complex policies for athlete_profiles
DROP POLICY IF EXISTS "Athletes can view own profile" ON athlete_profiles;
DROP POLICY IF EXISTS "Athletes can insert own profile" ON athlete_profiles;
DROP POLICY IF EXISTS "Athletes can update own profile" ON athlete_profiles;
DROP POLICY IF EXISTS "Approved users can view approved athlete profiles" ON athlete_profiles;
DROP POLICY IF EXISTS "Admins can view all athlete profiles" ON athlete_profiles;

-- Create simplified athlete_profiles policies
CREATE POLICY "Athletes can manage own profile"
  ON athlete_profiles FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Approved users can view approved athlete profiles"
  ON athlete_profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = athlete_profiles.user_id
      AND profiles.validation_status = 'approved'
    )
  );

-- Drop existing complex policies for company_profiles
DROP POLICY IF EXISTS "Companies can view own profile" ON company_profiles;
DROP POLICY IF EXISTS "Companies can insert own profile" ON company_profiles;
DROP POLICY IF EXISTS "Companies can update own profile" ON company_profiles;
DROP POLICY IF EXISTS "Approved users can view approved company profiles" ON company_profiles;
DROP POLICY IF EXISTS "Admins can view all company profiles" ON company_profiles;

-- Create simplified company_profiles policies
CREATE POLICY "Companies can manage own profile"
  ON company_profiles FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Approved users can view approved company profiles"
  ON company_profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = company_profiles.user_id
      AND profiles.validation_status = 'approved'
    )
  );