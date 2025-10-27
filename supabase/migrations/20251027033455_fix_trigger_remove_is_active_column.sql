/*
  # Fix Profile Creation Trigger - Remove is_active Column

  1. Problem
    - Trigger function tries to insert `is_active` column which doesn't exist
    - Causes "Database error updating user" on signup
    
  2. Solution
    - Update trigger function to only use existing columns
    - Remove all references to is_active
    
  3. Columns in profiles table:
    - id (uuid, primary key)
    - email (text)
    - user_type (text)
    - validation_status (text, default 'pending')
    - created_at (timestamptz)
    - updated_at (timestamptz)
*/

-- Drop and recreate the function without is_active
CREATE OR REPLACE FUNCTION public.handle_new_user_confirmed()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  v_user_type text;
BEGIN
  -- Only proceed if email was just confirmed (transition from null to not null)
  IF OLD.email_confirmed_at IS NULL AND NEW.email_confirmed_at IS NOT NULL THEN
    -- Get user type from metadata
    v_user_type := COALESCE(NEW.raw_user_meta_data->>'user_type', 'athlete');
    
    -- Create base profile (WITHOUT is_active)
    INSERT INTO public.profiles (
      id,
      email,
      user_type,
      validation_status
    ) VALUES (
      NEW.id,
      NEW.email,
      v_user_type,
      'pending'
    )
    ON CONFLICT (id) DO NOTHING;
    
    -- Create type-specific profile based on user_type
    IF v_user_type = 'athlete' THEN
      INSERT INTO public.athlete_profiles (
        user_id,
        first_name,
        last_name
      ) VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->'profile_data'->>'first_name', ''),
        COALESCE(NEW.raw_user_meta_data->'profile_data'->>'last_name', '')
      )
      ON CONFLICT (user_id) DO NOTHING;
      
    ELSIF v_user_type = 'company' THEN
      INSERT INTO public.company_profiles (
        user_id,
        company_name
      ) VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->'profile_data'->>'company_name', '')
      )
      ON CONFLICT (user_id) DO NOTHING;
      
    ELSIF v_user_type = 'sponsor' THEN
      INSERT INTO public.sponsor_profiles (
        user_id,
        organization_name
      ) VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->'profile_data'->>'organization_name', '')
      )
      ON CONFLICT (user_id) DO NOTHING;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Verify the trigger is still attached
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'on_auth_user_confirmed'
  ) THEN
    CREATE TRIGGER on_auth_user_confirmed
      AFTER UPDATE ON auth.users
      FOR EACH ROW
      EXECUTE FUNCTION public.handle_new_user_confirmed();
  END IF;
END $$;
