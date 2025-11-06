/*
  # Add Critical Foreign Key Indexes

  This migration adds indexes for frequently queried foreign keys to improve performance.
  These indexes are essential for join operations and filtering.

  ## Changes
  1. Add index for competition_applications.athlete_user_id
  2. Add index for competition_categories.competition_id
  3. Add index for competitions.organizer_id
  4. Add index for conversations.created_by
  5. Add index for job_offers.company_id
  6. Add index for messages.conversation_id
  7. Add index for messages.parent_message_id
  8. Add index for messages.sender_id
  9. Add index for news.author_id
  10. Add index for notifications.user_id
*/

-- Competition applications - frequently queried by athlete
CREATE INDEX IF NOT EXISTS idx_competition_applications_athlete_user_id 
  ON public.competition_applications(athlete_user_id);

-- Competition categories - always queried by competition
CREATE INDEX IF NOT EXISTS idx_competition_categories_competition_id 
  ON public.competition_categories(competition_id);

-- Competitions - frequently queried by organizer
CREATE INDEX IF NOT EXISTS idx_competitions_organizer_id 
  ON public.competitions(organizer_id);

-- Conversations - queried by creator
CREATE INDEX IF NOT EXISTS idx_conversations_created_by 
  ON public.conversations(created_by);

-- Job offers - frequently queried by company
CREATE INDEX IF NOT EXISTS idx_job_offers_company_id 
  ON public.job_offers(company_id);

-- Messages - always queried by conversation
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id 
  ON public.messages(conversation_id);

-- Messages - queried for threaded replies
CREATE INDEX IF NOT EXISTS idx_messages_parent_message_id 
  ON public.messages(parent_message_id);

-- Messages - queried by sender
CREATE INDEX IF NOT EXISTS idx_messages_sender_id 
  ON public.messages(sender_id);

-- News - queried by author
CREATE INDEX IF NOT EXISTS idx_news_author_id 
  ON public.news(author_id);

-- Notifications - frequently queried by user
CREATE INDEX IF NOT EXISTS idx_notifications_user_id 
  ON public.notifications(user_id);