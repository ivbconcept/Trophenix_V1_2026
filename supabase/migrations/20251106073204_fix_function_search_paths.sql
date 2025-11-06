/*
  # Fix Function Search Paths

  This migration fixes the search_path for functions to prevent security vulnerabilities.
  Setting an immutable search_path ensures functions operate predictably and securely.

  ## Changes
  - Set search_path for update_updated_at_column function
  - Set search_path for update_competition_spots function
  - Set search_path for update_organizer_stats function
*/

-- Fix update_updated_at_column function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Fix update_competition_spots function
CREATE OR REPLACE FUNCTION public.update_competition_spots()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  IF (TG_OP = 'INSERT' OR TG_OP = 'UPDATE') AND NEW.status = 'approved' THEN
    UPDATE public.competitions
    SET available_spots = available_spots - 1
    WHERE id = NEW.competition_id
    AND available_spots > 0;
  ELSIF TG_OP = 'DELETE' AND OLD.status = 'approved' THEN
    UPDATE public.competitions
    SET available_spots = available_spots + 1
    WHERE id = OLD.competition_id;
  ELSIF TG_OP = 'UPDATE' AND OLD.status = 'approved' AND NEW.status != 'approved' THEN
    UPDATE public.competitions
    SET available_spots = available_spots + 1
    WHERE id = NEW.competition_id;
  END IF;
  
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$;

-- Fix update_organizer_stats function
CREATE OR REPLACE FUNCTION public.update_organizer_stats()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.organizers
    SET 
      competitions_count = competitions_count + 1
    WHERE id = NEW.organizer_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.organizers
    SET 
      competitions_count = GREATEST(0, competitions_count - 1)
    WHERE id = OLD.organizer_id;
  END IF;
  
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$;