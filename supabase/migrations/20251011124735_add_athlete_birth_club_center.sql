/*
  # Add birth date, club and center fields to athlete profiles

  1. Changes
    - Add `birth_date` (date) to athlete_profiles
    - Add `current_club` (text) to athlete_profiles
    - Add `training_center` (text) to athlete_profiles

  2. Notes
    - These fields are optional during onboarding
    - birth_date helps calculate age for matching
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'athlete_profiles' AND column_name = 'birth_date'
  ) THEN
    ALTER TABLE athlete_profiles ADD COLUMN birth_date date;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'athlete_profiles' AND column_name = 'current_club'
  ) THEN
    ALTER TABLE athlete_profiles ADD COLUMN current_club text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'athlete_profiles' AND column_name = 'training_center'
  ) THEN
    ALTER TABLE athlete_profiles ADD COLUMN training_center text;
  END IF;
END $$;
