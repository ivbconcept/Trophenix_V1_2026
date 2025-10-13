/*
  # Fix Admin RLS - Drop Cascade and Bypass Completely

  ## Problem
  Functions are used by policies, need to drop CASCADE and recreate everything

  ## Solution
  1. Drop functions CASCADE (removes policies too)
  2. Recreate functions with SQL language (bypasses RLS automatically)
  3. Recreate policies using the new functions
*/

-- Drop functions CASCADE to remove dependent policies
DROP FUNCTION IF EXISTS is_admin_user() CASCADE;
DROP FUNCTION IF EXISTS is_super_admin() CASCADE;

-- Create function with SQL language - this bypasses RLS automatically
CREATE OR REPLACE FUNCTION is_admin_user()
RETURNS boolean 
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM admin_team_members
    WHERE user_id = auth.uid()
    AND status = 'active'
  );
$$;

-- Create super admin check function
CREATE OR REPLACE FUNCTION is_super_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM admin_team_members atm
    JOIN admin_roles ar ON atm.role_id = ar.id
    WHERE atm.user_id = auth.uid()
    AND atm.status = 'active'
    AND ar.name = 'super_admin'
  );
$$;

-- Recreate policies for admin_roles
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

-- Recreate policies for admin_team_members
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
