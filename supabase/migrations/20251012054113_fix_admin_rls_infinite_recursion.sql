/*
  # Fix Infinite Recursion in Admin RLS Policies

  ## Problem
  The RLS policies on `admin_team_members` and `admin_roles` create infinite recursion:
  - To check if user is admin, we query `admin_team_members`
  - But `admin_team_members` RLS policy checks if user is admin
  - This creates an infinite loop

  ## Solution
  Use a security definer function that bypasses RLS to check admin status.
  This breaks the recursion cycle while maintaining security.

  ## Changes
  1. Drop existing problematic policies
  2. Create security definer function to check admin status
  3. Recreate policies using the function
*/

-- Drop existing policies that cause recursion
DROP POLICY IF EXISTS "Admin team members can view roles" ON admin_roles;
DROP POLICY IF EXISTS "Super admins can manage roles" ON admin_roles;
DROP POLICY IF EXISTS "Admin team members can view team" ON admin_team_members;
DROP POLICY IF EXISTS "Super admins can manage team" ON admin_team_members;
DROP POLICY IF EXISTS "Admin team members can view logs" ON admin_activity_logs;
DROP POLICY IF EXISTS "System can insert logs" ON admin_activity_logs;

-- Create security definer function to check admin status (bypasses RLS)
CREATE OR REPLACE FUNCTION is_admin_user()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_team_members
    WHERE user_id = auth.uid()
    AND status = 'active'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create security definer function to check super admin status
CREATE OR REPLACE FUNCTION is_super_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_team_members atm
    JOIN admin_roles ar ON atm.role_id = ar.id
    WHERE atm.user_id = auth.uid()
    AND atm.status = 'active'
    AND ar.name = 'super_admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate policies for admin_roles using security definer functions
CREATE POLICY "Admin team members can view roles"
  ON admin_roles FOR SELECT
  TO authenticated
  USING (is_admin_user());

CREATE POLICY "Super admins can insert roles"
  ON admin_roles FOR INSERT
  TO authenticated
  WITH CHECK (is_super_admin());

CREATE POLICY "Super admins can update roles"
  ON admin_roles FOR UPDATE
  TO authenticated
  USING (is_super_admin())
  WITH CHECK (is_super_admin());

CREATE POLICY "Super admins can delete roles"
  ON admin_roles FOR DELETE
  TO authenticated
  USING (is_super_admin());

-- Recreate policies for admin_team_members using security definer functions
CREATE POLICY "Admin team members can view team"
  ON admin_team_members FOR SELECT
  TO authenticated
  USING (is_admin_user());

CREATE POLICY "Super admins can insert team members"
  ON admin_team_members FOR INSERT
  TO authenticated
  WITH CHECK (is_super_admin());

CREATE POLICY "Super admins can update team members"
  ON admin_team_members FOR UPDATE
  TO authenticated
  USING (is_super_admin())
  WITH CHECK (is_super_admin());

CREATE POLICY "Super admins can delete team members"
  ON admin_team_members FOR DELETE
  TO authenticated
  USING (is_super_admin());

-- Recreate policies for admin_activity_logs
CREATE POLICY "Admin team members can view logs"
  ON admin_activity_logs FOR SELECT
  TO authenticated
  USING (is_admin_user());

CREATE POLICY "Admin team members can insert logs"
  ON admin_activity_logs FOR INSERT
  TO authenticated
  WITH CHECK (is_admin_user());
