/*
  # Move pg_trgm Extension to Extensions Schema

  1. Security Improvements
    - Move pg_trgm extension from public schema to extensions schema
    - Follows PostgreSQL security best practices
    - Prevents pollution of public schema
  
  2. Changes
    - Drop dependent indexes
    - Drop extension from public schema
    - Create extension in extensions schema
    - Recreate dependent indexes
  
  3. Notes
    - Extension will be available system-wide
    - All dependent objects recreated
*/

-- Drop dependent index first
DROP INDEX IF EXISTS public.idx_french_communes_nom_trgm;

-- Drop extension from public schema
DROP EXTENSION IF EXISTS pg_trgm CASCADE;

-- Create extensions schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS extensions;

-- Create pg_trgm extension in extensions schema
CREATE EXTENSION IF NOT EXISTS pg_trgm SCHEMA extensions;

-- Grant usage on extensions schema
GRANT USAGE ON SCHEMA extensions TO authenticated;
GRANT USAGE ON SCHEMA extensions TO anon;

-- Recreate the index using the extension from extensions schema
CREATE INDEX IF NOT EXISTS idx_french_communes_nom_trgm 
ON public.french_communes 
USING gin (nom extensions.gin_trgm_ops);
