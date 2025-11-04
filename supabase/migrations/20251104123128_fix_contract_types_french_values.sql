/*
  # Fix contract_type to use French values

  1. Changes
    - Drop existing check constraint
    - Update all existing data to French values
    - Add new check constraint with French values
  
  2. Notes
    - Uses transaction-safe approach
    - Maps English values to French equivalents
*/

-- Drop the constraint first
ALTER TABLE job_offers DROP CONSTRAINT IF EXISTS job_offers_contract_type_check;

-- Now update existing data (no constraint blocking)
UPDATE job_offers SET contract_type = 
  CASE 
    WHEN contract_type = 'full_time' THEN 'CDI'
    WHEN contract_type = 'part_time' THEN 'CDI'
    WHEN contract_type = 'contract' THEN 'CDD'
    WHEN contract_type = 'internship' THEN 'Stage'
    WHEN contract_type = 'freelance' THEN 'Freelance'
    ELSE contract_type
  END;

-- Add new constraint with French values
ALTER TABLE job_offers 
ADD CONSTRAINT job_offers_contract_type_check 
CHECK (contract_type IN ('CDI', 'CDD', 'Stage', 'Alternance', 'Freelance'));