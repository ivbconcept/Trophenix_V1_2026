/*
  # Fix Missing Profile Creation Function

  1. Problem
    - Trigger exists but function `handle_new_user_confirmed()` is missing
    - Users have confirmed emails but no profiles were created

  2. Solution
    - Create the missing function to handle profile creation
    - Backfill existing users who don't have profiles yet
    
  3. Security
    - Function uses SECURITY DEFINER to bypass RLS
    - Only creates profiles, doesn't expose sensitive data
*/

-- Drop existing trigger to recreate it properly
DROP TRIGGER IF EXISTS on_auth_user_confirmed ON auth.users;

-- Create the function that handles profile creation
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
    
    -- Create base profile
    INSERT INTO public.profiles (
      id,
      email,
      user_type,
      is_active
    ) VALUES (
      NEW.id,
      NEW.email,
      v_user_type,
      true
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
        COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
        COALESCE(NEW.raw_user_meta_data->>'last_name', '')
      )
      ON CONFLICT (user_id) DO NOTHING;
      
    ELSIF v_user_type = 'company' THEN
      INSERT INTO public.company_profiles (
        user_id,
        company_name
      ) VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'company_name', '')
      )
      ON CONFLICT (user_id) DO NOTHING;
      
    ELSIF v_user_type = 'sponsor' THEN
      INSERT INTO public.sponsor_profiles (
        user_id,
        organization_name
      ) VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'organization_name', '')
      )
      ON CONFLICT (user_id) DO NOTHING;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Recreate the trigger
CREATE TRIGGER on_auth_user_confirmed
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user_confirmed();

-- Backfill existing confirmed users who don't have profiles
DO $$
DECLARE
  v_user RECORD;
BEGIN
  FOR v_user IN 
    SELECT 
      u.id,
      u.email,
      u.email_confirmed_at,
      COALESCE(u.raw_user_meta_data->>'user_type', 'athlete') as user_type,
      u.raw_user_meta_data->>'first_name' as first_name,
      u.raw_user_meta_data->>'last_name' as last_name,
      u.raw_user_meta_data->>'company_name' as company_name,
      u.raw_user_meta_data->>'organization_name' as organization_name
    FROM auth.users u
    LEFT JOIN public.profiles p ON u.id = p.id
    WHERE u.email_confirmed_at IS NOT NULL
      AND p.id IS NULL
  LOOP
    -- Create base profile
    INSERT INTO public.profiles (
      id,
      email,
      user_type,
      is_active
    ) VALUES (
      v_user.id,
      v_user.email,
      v_user.user_type,
      true
    )
    ON CONFLICT (id) DO NOTHING;
    
    -- Create type-specific profile
    IF v_user.user_type = 'athlete' THEN
      INSERT INTO public.athlete_profiles (
        user_id,
        first_name,
        last_name
      ) VALUES (
        v_user.id,
        COALESCE(v_user.first_name, ''),
        COALESCE(v_user.last_name, '')
      )
      ON CONFLICT (user_id) DO NOTHING;
      
    ELSIF v_user.user_type = 'company' THEN
      INSERT INTO public.company_profiles (
        user_id,
        company_name
      ) VALUES (
        v_user.id,
        COALESCE(v_user.company_name, '')
      )
      ON CONFLICT (user_id) DO NOTHING;
      
    ELSIF v_user.user_type = 'sponsor' THEN
      INSERT INTO public.sponsor_profiles (
        user_id,
        organization_name
      ) VALUES (
        v_user.id,
        COALESCE(v_user.organization_name, '')
      )
      ON CONFLICT (user_id) DO NOTHING;
    END IF;
    
    RAISE NOTICE 'Created profile for user: % (%)', v_user.email, v_user.user_type;
  END LOOP;
END $$;
