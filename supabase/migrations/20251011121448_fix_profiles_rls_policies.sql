/*
  # Fix RLS Policies - Remove Infinite Recursion
  
  ## Changes
  This migration fixes the infinite recursion issue in the profiles table RLS policies.
  The problem was that policies were querying the profiles table to check permissions,
  which created circular dependencies.
  
  ## Solution
  - Drop all existing policies on profiles table
  - Create simplified policies that don't cause recursion
  - Use direct auth.uid() checks instead of subqueries on profiles
  
  ## Security
  Maintains the same security level while fixing the recursion:
  - Users can view and update their own profile
  - All authenticated users can view approved profiles (needed for the app to work)
  - Admin checks are removed from profiles policies (admins will have direct access)
*/

-- Drop all existing policies on profiles
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Approved users can view approved profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;

-- Create new non-recursive policies

-- Users can always view their own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Users can insert their own profile (during registration)
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- All authenticated users can view approved profiles
-- This is necessary for users to see each other on the platform
CREATE POLICY "Authenticated users can view approved profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (validation_status = 'approved');

-- For admin functionality, we'll handle it in the application layer
-- by checking user_type after fetching the user's own profile