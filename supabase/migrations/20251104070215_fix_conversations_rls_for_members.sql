/*
  # Fix Conversations RLS for Member Access

  1. Changes
    - Drop existing restrictive SELECT policy on conversations
    - Add new policy that allows users to view conversations they are members of
    - Uses EXISTS subquery to check conversation_members table
  
  2. Security
    - Users can only view conversations where they are explicitly listed as members
    - More flexible than checking only participant1_id/participant2_id
    - Supports both direct and group conversations
*/

-- Drop old policy
DROP POLICY IF EXISTS "Users can view their own conversations" ON conversations;

-- Create new policy that checks conversation_members
CREATE POLICY "Users can view conversations they are members of"
  ON conversations
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM conversation_members
      WHERE conversation_members.conversation_id = conversations.id
      AND conversation_members.user_id = auth.uid()
    )
  );
