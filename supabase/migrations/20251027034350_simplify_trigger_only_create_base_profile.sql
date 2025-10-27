/*
  # Simplify Auto-Profile Creation - Only Create Base Profile

  1. Problem
    - Type-specific tables have NOT NULL columns (sport, sector, etc.)
    - Metadata from signup might not have all required fields
    - Causes "Database error updating user"
    
  2. Solution
    - Trigger only creates the base `profiles` entry
    - User completes their profile after first login
    - No more failing inserts into athlete/company/sponsor tables
    
  3. Benefits
    - Signup always succeeds
    - User can log in immediately
    - Profile completion happens in dedicated UI flow
*/

-- Simplified trigger function - only creates base profile
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
    
    -- Create ONLY the base profile
    -- Type-specific profile will be created when user completes onboarding
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
