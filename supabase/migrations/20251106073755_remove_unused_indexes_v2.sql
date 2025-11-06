/*
  # Remove Unused Indexes

  This migration removes indexes that are reported as unused by Supabase.
  These indexes consume storage and slow down write operations without providing query benefits.

  ## Changes
  - Drop unused indexes from message_reactions
  - Drop unused indexes from message_attachments  
  - Drop unused indexes from cover_letters
  - Drop unused indexes from competitions
  - Drop unused indexes from competition_applications
  - Drop unused indexes from competition_documents
  - Drop unused indexes from cv_files
  - Drop unused indexes from cover_letter_files
  - Drop unused indexes from presentation_letters
  - Drop unused indexes from presentation_letter_files
*/

-- Message reactions
DROP INDEX IF EXISTS public.idx_message_reactions_user_id;

-- Message attachments
DROP INDEX IF EXISTS public.idx_message_attachments_message_id;

-- Cover letters
DROP INDEX IF EXISTS public.idx_cover_letters_job_offer_id;
DROP INDEX IF EXISTS public.idx_cover_letters_user_id;

-- Competitions
DROP INDEX IF EXISTS public.idx_competitions_moderated_by;

-- Competition applications
DROP INDEX IF EXISTS public.idx_competition_applications_category_id;
DROP INDEX IF EXISTS public.idx_competition_applications_reviewed_by;

-- Competition documents
DROP INDEX IF EXISTS public.idx_competition_documents_competition_id;
DROP INDEX IF EXISTS public.idx_competition_documents_uploaded_by;

-- CV files
DROP INDEX IF EXISTS public.idx_cv_files_user_id;

-- Cover letter files
DROP INDEX IF EXISTS public.idx_cover_letter_files_user_id;

-- Presentation letters
DROP INDEX IF EXISTS public.idx_presentation_letters_user_id;

-- Presentation letter files
DROP INDEX IF EXISTS public.idx_presentation_letter_files_user_id;