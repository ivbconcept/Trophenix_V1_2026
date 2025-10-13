/*
  # Add new fields to athlete profiles

  1. Changes
    - Add `ministerial_list` column (text) - Whether athlete is on ministerial list
    - Add `situation` column (text) - Current situation of the athlete
    - Add `athlete_type` column (text) - Type of athlete (Handysport or regular)
  
  2. Notes
    - All new columns are optional (nullable)
    - Using DO block to safely add columns if they don't exist
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'athlete_profiles' AND column_name = 'ministerial_list'
  ) THEN
    ALTER TABLE athlete_profiles ADD COLUMN ministerial_list text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'athlete_profiles' AND column_name = 'situation'
  ) THEN
    ALTER TABLE athlete_profiles ADD COLUMN situation text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'athlete_profiles' AND column_name = 'athlete_type'
  ) THEN
    ALTER TABLE athlete_profiles ADD COLUMN athlete_type text;
  END IF;
END $$;
