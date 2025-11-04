/*
  # Add work_time field to job_offers table

  1. Changes
    - Add `work_time` column to `job_offers` table
      - Values: 'Temps plein', 'Mi-temps', 'Stage'
      - Default: 'Temps plein'
    
  2. Notes
    - This field will help categorize job offers by work schedule
    - Frontend will display this as a badge alongside contract_type
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'job_offers' AND column_name = 'work_time'
  ) THEN
    ALTER TABLE job_offers ADD COLUMN work_time text DEFAULT 'Temps plein';
  END IF;
END $$;

-- Add check constraint for valid work_time values
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'job_offers_work_time_check'
  ) THEN
    ALTER TABLE job_offers 
    ADD CONSTRAINT job_offers_work_time_check 
    CHECK (work_time IN ('Temps plein', 'Mi-temps', 'Stage'));
  END IF;
END $$;