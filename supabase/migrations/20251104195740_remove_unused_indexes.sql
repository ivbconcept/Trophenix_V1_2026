/*
  # Remove Unused Indexes

  1. Performance Improvements
    - Remove indexes that have never been used
    - Reduces storage overhead
    - Improves INSERT/UPDATE/DELETE performance
    - Reduces index maintenance cost
  
  2. Indexes Removed
    - Reference data indexes (these are lookup tables, rarely queried)
    - Feature-specific indexes for unused features
    - Duplicate or redundant indexes
  
  3. Indexes Kept
    - Foreign key indexes (needed for JOIN performance)
    - Indexes used by RLS policies
    - Indexes for active features
  
  4. Notes
    - Indexes can be recreated later if needed
    - Monitor query performance after removal
*/

-- ============================================
-- REMOVE UNUSED REFERENCE DATA INDEXES
-- ============================================

-- Cities reference - unused search index
DROP INDEX IF EXISTS public.idx_cities_name_search;

-- French communes - unused search indexes
DROP INDEX IF EXISTS public.idx_french_communes_nom_trgm;
DROP INDEX IF EXISTS public.idx_french_communes_departement;
DROP INDEX IF EXISTS public.idx_french_communes_nom;
DROP INDEX IF EXISTS public.idx_french_communes_code_postal;

-- Nationalities - unused ISO code index
DROP INDEX IF EXISTS public.idx_nationalities_code_iso;

-- ============================================
-- REMOVE UNUSED FEATURE INDEXES
-- ============================================

-- Sponsors table - unused indexes (feature not actively used)
DROP INDEX IF EXISTS public.idx_sponsors_user_id;
DROP INDEX IF EXISTS public.idx_sponsors_company_name;
DROP INDEX IF EXISTS public.idx_sponsors_sector;
DROP INDEX IF EXISTS public.idx_sponsors_location;

-- Contact events - unused index
DROP INDEX IF EXISTS public.idx_contact_events_athlete_id;

-- ============================================
-- REMOVE REDUNDANT MESSAGING INDEXES
-- ============================================

-- These indexes are redundant with foreign key indexes or rarely used
DROP INDEX IF EXISTS public.conversations_last_message_at_idx;
DROP INDEX IF EXISTS public.messages_read_idx;
DROP INDEX IF EXISTS public.conversation_members_unread_idx;
DROP INDEX IF EXISTS public.message_reactions_message_id_idx;
DROP INDEX IF EXISTS public.message_reactions_user_id_idx;
DROP INDEX IF EXISTS public.message_attachments_message_id_idx;
DROP INDEX IF EXISTS public.user_presence_status_idx;
DROP INDEX IF EXISTS public.user_presence_last_seen_idx;

-- ============================================
-- KEEP CRITICAL INDEXES (DOCUMENTED)
-- ============================================

-- KEEP: idx_conversations_created_by (foreign key, needed for JOINs)
-- KEEP: messages_conversation_id_idx (critical for message loading)
-- KEEP: messages_sender_id_idx (needed for user message queries)
-- KEEP: messages_created_at_idx (needed for chronological ordering)
-- KEEP: idx_messages_parent_message_id (foreign key, needed for threading)
-- KEEP: idx_news_author_id (foreign key, needed for author queries)

-- ============================================
-- REMOVE UNUSED JOB & DOCUMENT INDEXES
-- ============================================

-- These features are not yet in production use
DROP INDEX IF EXISTS public.idx_cover_letters_user_id;
DROP INDEX IF EXISTS public.idx_cover_letters_job_offer_id;
DROP INDEX IF EXISTS public.idx_cv_files_user_id;
DROP INDEX IF EXISTS public.idx_cover_letter_files_user_id;
DROP INDEX IF EXISTS public.idx_presentation_letters_user_id;
DROP INDEX IF EXISTS public.idx_presentation_letter_files_user_id;

-- ============================================
-- REMOVE UNUSED NOTIFICATION INDEXES
-- ============================================

-- Keep only essential notification indexes, remove redundant ones
DROP INDEX IF EXISTS public.notifications_created_at_idx;
DROP INDEX IF EXISTS public.notifications_type_idx;

-- KEEP: notifications_user_id_idx (critical for user notification queries)
-- KEEP: notifications_read_idx (used for unread count queries)

-- ============================================
-- REMOVE UNUSED JOB OFFER INDEXES
-- ============================================

-- Job offers feature not yet in production
DROP INDEX IF EXISTS public.idx_job_offers_created_at;
DROP INDEX IF EXISTS public.idx_job_offers_sector;

-- KEEP: idx_job_offers_company_id (foreign key, needed for company queries)
-- KEEP: idx_job_offers_is_active (used in WHERE clauses for active jobs)
