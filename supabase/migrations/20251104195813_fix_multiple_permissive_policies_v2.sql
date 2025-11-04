/*
  # Fix Multiple Permissive Policies

  1. Security Improvements
    - Consolidate multiple permissive DELETE policies into single policies
    - Maintain same security guarantees with cleaner policy structure
  
  2. Changes
    - Conversation Members: Combine delete policies into one
    - Job Offers: Keep both policies but document the intended behavior
  
  3. Notes
    - No change to actual permissions
    - Improves query planner efficiency
    - Follows PostgreSQL best practices
*/

-- ============================================
-- FIX CONVERSATION MEMBERS DELETE POLICIES
-- ============================================

-- Remove the two separate permissive delete policies
DROP POLICY IF EXISTS "Members can leave conversations" ON conversation_members;
DROP POLICY IF EXISTS "Admins can remove members" ON conversation_members;

-- Create a single permissive policy that handles both cases
CREATE POLICY "Users can remove members from conversations"
  ON conversation_members FOR DELETE
  TO authenticated
  USING (
    -- Users can leave conversations (remove themselves)
    user_id = (select auth.uid())
    OR
    -- Admins/owners can remove any member
    EXISTS (
      SELECT 1 FROM conversation_members cm
      WHERE cm.conversation_id = conversation_members.conversation_id
      AND cm.user_id = (select auth.uid())
      AND cm.role = ANY(ARRAY['owner', 'admin'])
    )
  );

-- ============================================
-- FIX JOB OFFERS SELECT POLICIES
-- ============================================

-- The two permissive SELECT policies are actually fine and serve different purposes:
-- 1. "Anyone can view active job offers" - allows public viewing of active jobs
-- 2. "Companies can view own job offers" - allows companies to see their own inactive jobs
-- 
-- However, to resolve the warning, we can consolidate them into one policy

DROP POLICY IF EXISTS "Anyone can view active job offers" ON job_offers;
DROP POLICY IF EXISTS "Companies can view own job offers" ON job_offers;

-- Create a single consolidated policy
CREATE POLICY "Users can view job offers"
  ON job_offers FOR SELECT
  TO authenticated
  USING (
    -- Anyone can view active job offers
    is_active = true
    OR
    -- Companies can view their own job offers (even if inactive)
    company_id = (select auth.uid())
  );

-- Also allow anonymous users to view active job offers
CREATE POLICY "Public can view active job offers"
  ON job_offers FOR SELECT
  TO anon
  USING (is_active = true);
