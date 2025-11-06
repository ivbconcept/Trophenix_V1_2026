/*
  # Add Missing Foreign Key Indexes

  This migration adds indexes for foreign keys that were missing covering indexes,
  which improves query performance when joining tables or filtering by foreign keys.

  ## Changes
  1. Add indexes for competition_applications table foreign keys
  2. Add indexes for competition_documents table foreign keys
  3. Add indexes for competitions table foreign keys
  4. Add indexes for cover_letter_files table foreign keys
  5. Add indexes for cover_letters table foreign keys
  6. Add indexes for cv_files table foreign keys
  7. Add indexes for message_attachments table foreign keys
  8. Add indexes for message_reactions table foreign keys
  9. Add indexes for presentation_letter_files table foreign keys
  10. Add indexes for presentation_letters table foreign keys
*/

-- Competition applications indexes
CREATE INDEX IF NOT EXISTS idx_competition_applications_category_id 
  ON public.competition_applications(category_id);

CREATE INDEX IF NOT EXISTS idx_competition_applications_reviewed_by 
  ON public.competition_applications(reviewed_by);

-- Competition documents indexes
CREATE INDEX IF NOT EXISTS idx_competition_documents_competition_id 
  ON public.competition_documents(competition_id);

CREATE INDEX IF NOT EXISTS idx_competition_documents_uploaded_by 
  ON public.competition_documents(uploaded_by);

-- Competitions indexes
CREATE INDEX IF NOT EXISTS idx_competitions_moderated_by 
  ON public.competitions(moderated_by);

-- Cover letter files indexes
CREATE INDEX IF NOT EXISTS idx_cover_letter_files_user_id 
  ON public.cover_letter_files(user_id);

-- Cover letters indexes
CREATE INDEX IF NOT EXISTS idx_cover_letters_job_offer_id 
  ON public.cover_letters(job_offer_id);

CREATE INDEX IF NOT EXISTS idx_cover_letters_user_id 
  ON public.cover_letters(user_id);

-- CV files indexes
CREATE INDEX IF NOT EXISTS idx_cv_files_user_id 
  ON public.cv_files(user_id);

-- Message attachments indexes
CREATE INDEX IF NOT EXISTS idx_message_attachments_message_id 
  ON public.message_attachments(message_id);

-- Message reactions indexes
CREATE INDEX IF NOT EXISTS idx_message_reactions_user_id 
  ON public.message_reactions(user_id);

-- Presentation letter files indexes
CREATE INDEX IF NOT EXISTS idx_presentation_letter_files_user_id 
  ON public.presentation_letter_files(user_id);

-- Presentation letters indexes
CREATE INDEX IF NOT EXISTS idx_presentation_letters_user_id 
  ON public.presentation_letters(user_id);