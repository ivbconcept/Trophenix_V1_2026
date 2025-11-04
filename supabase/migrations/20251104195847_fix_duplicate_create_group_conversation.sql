/*
  # Fix Duplicate create_group_conversation Functions

  1. Security Improvements
    - Remove duplicate function with mutable search_path
    - Keep only the version with proper security settings
  
  2. Changes
    - Drop the old function signature
    - Ensure only the secure version remains
  
  3. Notes
    - The function with search_path = '' is the correct one
*/

-- Drop the old function signature without search_path protection
DROP FUNCTION IF EXISTS public.create_group_conversation(
  p_name text,
  p_type text, 
  p_description text,
  p_creator_id uuid,
  p_is_private boolean,
  p_member_ids uuid[]
);

-- The correct function with proper search_path already exists:
-- public.create_group_conversation(p_creator_id uuid, p_name text, p_member_ids uuid[])
-- with SET search_path = ''
