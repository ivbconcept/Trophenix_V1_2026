/*
  # Remove Unused Indexes

  This migration removes indexes that are not being used by any queries.
  Removing unused indexes reduces storage overhead and improves write performance.

  ## Changes
  - Drop unused indexes from notifications table
  - Drop unused indexes from news table
  - Drop unused indexes from conversations table
  - Drop unused indexes from messages table
  - Drop unused indexes from job_offers table
  - Drop unused indexes from organizers table
  - Drop unused indexes from competitions table
  - Drop unused indexes from competition_categories table
  - Drop unused indexes from competition_applications table
*/

-- Notifications indexes
DROP INDEX IF EXISTS public.notifications_user_id_idx;
DROP INDEX IF EXISTS public.notifications_read_idx;

-- News indexes
DROP INDEX IF EXISTS public.idx_news_author_id;

-- Conversations indexes
DROP INDEX IF EXISTS public.idx_conversations_created_by;

-- Messages indexes
DROP INDEX IF EXISTS public.messages_conversation_id_idx;
DROP INDEX IF EXISTS public.messages_sender_id_idx;
DROP INDEX IF EXISTS public.messages_created_at_idx;
DROP INDEX IF EXISTS public.idx_messages_parent_message_id;

-- Job offers indexes
DROP INDEX IF EXISTS public.idx_job_offers_company_id;
DROP INDEX IF EXISTS public.idx_job_offers_is_active;

-- Organizers indexes
DROP INDEX IF EXISTS public.idx_organizers_user;

-- Competitions indexes
DROP INDEX IF EXISTS public.idx_competitions_sport;
DROP INDEX IF EXISTS public.idx_competitions_start_date;
DROP INDEX IF EXISTS public.idx_competitions_location_city;
DROP INDEX IF EXISTS public.idx_competitions_status;
DROP INDEX IF EXISTS public.idx_competitions_organizer;

-- Competition categories indexes
DROP INDEX IF EXISTS public.idx_competition_categories_competition;

-- Competition applications indexes
DROP INDEX IF EXISTS public.idx_competition_applications_athlete;
DROP INDEX IF EXISTS public.idx_competition_applications_competition;
DROP INDEX IF EXISTS public.idx_competition_applications_status;