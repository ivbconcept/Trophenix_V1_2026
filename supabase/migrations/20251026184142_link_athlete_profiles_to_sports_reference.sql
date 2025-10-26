/*
  # Link athlete_profiles to sports_reference table

  1. Changes to athlete_profiles
    - Add `sport_id` (uuid) column as foreign key to sports_reference
    - Add `current_club_id` (uuid) column as foreign key to clubs_reference
    - Migrate existing data from text to foreign keys
    - Keep `sport` and `current_club` as text for backward compatibility during transition

  2. Changes to clubs_reference
    - First, we need to populate the clubs_reference table with actual clubs

  3. Data Migration
    - Match existing sport names to sports_reference.id
    - Set sport_id based on existing sport text values

  4. Notes
    - We keep both sport (text) and sport_id (uuid) for now
    - Future: Remove sport text column after full migration
    - This allows gradual transition without breaking existing data
*/

-- First, add club entries to clubs_reference (will populate more later)
INSERT INTO clubs_reference (name, sport_category, city, display_order) VALUES
-- Football clubs
('Paris Saint-Germain', 'football', 'Paris', 10),
('Olympique de Marseille', 'football', 'Marseille', 11),
('Olympique Lyonnais', 'football', 'Lyon', 12),
('AS Monaco', 'football', 'Monaco', 13),
('LOSC Lille', 'football', 'Lille', 14),

-- Basketball clubs
('ASVEL Lyon-Villeurbanne', 'basketball', 'Lyon', 20),
('AS Monaco Basket', 'basketball', 'Monaco', 21),
('Paris Basketball', 'basketball', 'Paris', 22),

-- Rugby clubs
('Stade Toulousain', 'rugby', 'Toulouse', 30),
('UBB Bordeaux-Bègles', 'rugby', 'Bordeaux', 31),
('Stade Rochelais', 'rugby', 'La Rochelle', 32),
('Racing 92', 'rugby', 'Paris', 33),

-- Tennis clubs
('Roland-Garros', 'tennis', 'Paris', 40),
('Tennis Club de Paris', 'tennis', 'Paris', 41),

-- Multisports
('ASPTT Paris', 'multisports', 'Paris', 50),
('ASPTT Marseille', 'multisports', 'Marseille', 51),
('ASPTT Lyon', 'multisports', 'Lyon', 52),
('INSEP', 'multisports', 'Paris', 53),
('CREPS Île-de-France', 'multisports', 'Paris', 54)
ON CONFLICT (name) DO NOTHING;

-- Add sport_id column to athlete_profiles (nullable for migration)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'athlete_profiles' AND column_name = 'sport_id'
  ) THEN
    ALTER TABLE athlete_profiles 
    ADD COLUMN sport_id uuid REFERENCES sports_reference(id);
  END IF;
END $$;

-- Add current_club_id column to athlete_profiles (nullable)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'athlete_profiles' AND column_name = 'current_club_id'
  ) THEN
    ALTER TABLE athlete_profiles 
    ADD COLUMN current_club_id uuid REFERENCES clubs_reference(id);
  END IF;
END $$;

-- Add current_club column if it doesn't exist (for backward compatibility)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'athlete_profiles' AND column_name = 'current_club'
  ) THEN
    ALTER TABLE athlete_profiles 
    ADD COLUMN current_club text;
  END IF;
END $$;

-- Migrate existing sport data to sport_id
UPDATE athlete_profiles ap
SET sport_id = sr.id
FROM sports_reference sr
WHERE LOWER(ap.sport) = LOWER(sr.name)
AND ap.sport_id IS NULL;

-- Migrate existing club data to current_club_id (if current_club exists)
UPDATE athlete_profiles ap
SET current_club_id = cr.id
FROM clubs_reference cr
WHERE ap.current_club IS NOT NULL 
AND LOWER(ap.current_club) = LOWER(cr.name)
AND ap.current_club_id IS NULL;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_athlete_profiles_sport_id ON athlete_profiles(sport_id);
CREATE INDEX IF NOT EXISTS idx_athlete_profiles_current_club_id ON athlete_profiles(current_club_id);

-- Create a function to auto-populate sport_id when sport is set
CREATE OR REPLACE FUNCTION sync_athlete_sport_id()
RETURNS TRIGGER AS $$
BEGIN
  -- If sport is set and sport_id is null, try to find matching sport
  IF NEW.sport IS NOT NULL AND (NEW.sport_id IS NULL OR OLD.sport != NEW.sport) THEN
    SELECT id INTO NEW.sport_id
    FROM sports_reference
    WHERE LOWER(name) = LOWER(NEW.sport);
  END IF;
  
  -- If current_club is set and current_club_id is null, try to find matching club
  IF NEW.current_club IS NOT NULL AND (NEW.current_club_id IS NULL OR (OLD.current_club IS NOT NULL AND OLD.current_club != NEW.current_club)) THEN
    SELECT id INTO NEW.current_club_id
    FROM clubs_reference
    WHERE LOWER(name) = LOWER(NEW.current_club);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to sync sport_id automatically
DROP TRIGGER IF EXISTS trigger_sync_athlete_sport_id ON athlete_profiles;
CREATE TRIGGER trigger_sync_athlete_sport_id
  BEFORE INSERT OR UPDATE ON athlete_profiles
  FOR EACH ROW
  EXECUTE FUNCTION sync_athlete_sport_id();

COMMENT ON COLUMN athlete_profiles.sport_id IS 'Foreign key to sports_reference table';
COMMENT ON COLUMN athlete_profiles.current_club_id IS 'Foreign key to clubs_reference table';
COMMENT ON COLUMN athlete_profiles.sport IS 'Legacy text field for sport name (use sport_id instead)';
COMMENT ON COLUMN athlete_profiles.current_club IS 'Legacy text field for club name (use current_club_id instead)';
