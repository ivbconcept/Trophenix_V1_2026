/*
  # Optimize RLS Policies for Auth Functions - Complete

  1. Performance Improvements
    - Replace `auth.uid()` with `(select auth.uid())` in all RLS policies
    - Prevents re-evaluation of auth functions for each row
    - Significantly improves query performance at scale
  
  2. Tables Optimized
    - All tables with RLS policies using auth.uid()
  
  3. Security
    - No changes to security logic
    - Only performance optimization
*/

-- ============================================
-- JOB OFFERS
-- ============================================
DROP POLICY IF EXISTS "Companies can create job offers" ON job_offers;
CREATE POLICY "Companies can create job offers"
  ON job_offers FOR INSERT
  TO authenticated
  WITH CHECK (company_id = (select auth.uid()));

DROP POLICY IF EXISTS "Companies can view own job offers" ON job_offers;
CREATE POLICY "Companies can view own job offers"
  ON job_offers FOR SELECT
  TO authenticated
  USING (company_id = (select auth.uid()));

DROP POLICY IF EXISTS "Companies can update own job offers" ON job_offers;
CREATE POLICY "Companies can update own job offers"
  ON job_offers FOR UPDATE
  TO authenticated
  USING (company_id = (select auth.uid()))
  WITH CHECK (company_id = (select auth.uid()));

DROP POLICY IF EXISTS "Companies can delete own job offers" ON job_offers;
CREATE POLICY "Companies can delete own job offers"
  ON job_offers FOR DELETE
  TO authenticated
  USING (company_id = (select auth.uid()));

-- ============================================
-- COVER LETTERS
-- ============================================
DROP POLICY IF EXISTS "Users can view own cover letters" ON cover_letters;
CREATE POLICY "Users can view own cover letters"
  ON cover_letters FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can insert own cover letters" ON cover_letters;
CREATE POLICY "Users can insert own cover letters"
  ON cover_letters FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can update own cover letters" ON cover_letters;
CREATE POLICY "Users can update own cover letters"
  ON cover_letters FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can delete own cover letters" ON cover_letters;
CREATE POLICY "Users can delete own cover letters"
  ON cover_letters FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));

-- ============================================
-- CV FILES
-- ============================================
DROP POLICY IF EXISTS "Users can view own CV files" ON cv_files;
CREATE POLICY "Users can view own CV files"
  ON cv_files FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can insert own CV files" ON cv_files;
CREATE POLICY "Users can insert own CV files"
  ON cv_files FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can delete own CV files" ON cv_files;
CREATE POLICY "Users can delete own CV files"
  ON cv_files FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));

-- ============================================
-- COVER LETTER FILES
-- ============================================
DROP POLICY IF EXISTS "Users can view own cover letter files" ON cover_letter_files;
CREATE POLICY "Users can view own cover letter files"
  ON cover_letter_files FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can insert own cover letter files" ON cover_letter_files;
CREATE POLICY "Users can insert own cover letter files"
  ON cover_letter_files FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can delete own cover letter files" ON cover_letter_files;
CREATE POLICY "Users can delete own cover letter files"
  ON cover_letter_files FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));

-- ============================================
-- CONTACT EVENTS
-- ============================================
DROP POLICY IF EXISTS "Users can view own contact history" ON contact_events;
CREATE POLICY "Users can view own contact history"
  ON contact_events FOR SELECT
  TO authenticated
  USING (contactor_id = (select auth.uid()));

-- ============================================
-- MESSAGE ATTACHMENTS
-- ============================================
DROP POLICY IF EXISTS "Users can view attachments in their conversations" ON message_attachments;
CREATE POLICY "Users can view attachments in their conversations"
  ON message_attachments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM messages m
      JOIN conversations c ON c.id = m.conversation_id
      JOIN conversation_members cm ON cm.conversation_id = c.id
      WHERE m.id = message_id AND cm.user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can upload attachments" ON message_attachments;
CREATE POLICY "Users can upload attachments"
  ON message_attachments FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM messages m
      JOIN conversation_members cm ON cm.conversation_id = m.conversation_id
      WHERE m.id = message_id AND cm.user_id = (select auth.uid())
    )
  );

-- ============================================
-- USER PRESENCE
-- ============================================
DROP POLICY IF EXISTS "Users can update their own presence" ON user_presence;
CREATE POLICY "Users can update their own presence"
  ON user_presence FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can update their own presence status" ON user_presence;
CREATE POLICY "Users can update their own presence status"
  ON user_presence FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

-- ============================================
-- PRESENTATION LETTERS
-- ============================================
DROP POLICY IF EXISTS "Users can view own presentation letters" ON presentation_letters;
CREATE POLICY "Users can view own presentation letters"
  ON presentation_letters FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can insert own presentation letters" ON presentation_letters;
CREATE POLICY "Users can insert own presentation letters"
  ON presentation_letters FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can update own presentation letters" ON presentation_letters;
CREATE POLICY "Users can update own presentation letters"
  ON presentation_letters FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can delete own presentation letters" ON presentation_letters;
CREATE POLICY "Users can delete own presentation letters"
  ON presentation_letters FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));

-- ============================================
-- PRESENTATION LETTER FILES
-- ============================================
DROP POLICY IF EXISTS "Users can view own presentation letter files" ON presentation_letter_files;
CREATE POLICY "Users can view own presentation letter files"
  ON presentation_letter_files FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can insert own presentation letter files" ON presentation_letter_files;
CREATE POLICY "Users can insert own presentation letter files"
  ON presentation_letter_files FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can delete own presentation letter files" ON presentation_letter_files;
CREATE POLICY "Users can delete own presentation letter files"
  ON presentation_letter_files FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));

-- ============================================
-- SAVED JOBS
-- ============================================
DROP POLICY IF EXISTS "Athletes can view own saved jobs" ON saved_jobs;
CREATE POLICY "Athletes can view own saved jobs"
  ON saved_jobs FOR SELECT
  TO authenticated
  USING (athlete_id = (select auth.uid()));

DROP POLICY IF EXISTS "Athletes can delete own saved jobs" ON saved_jobs;
CREATE POLICY "Athletes can delete own saved jobs"
  ON saved_jobs FOR DELETE
  TO authenticated
  USING (athlete_id = (select auth.uid()));

-- ============================================
-- MESSAGE THREADS
-- ============================================
DROP POLICY IF EXISTS "Users can create threads" ON message_threads;
CREATE POLICY "Users can create threads"
  ON message_threads FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = participant1_id OR (select auth.uid()) = participant2_id);

DROP POLICY IF EXISTS "Users can view own threads" ON message_threads;
CREATE POLICY "Users can view own threads"
  ON message_threads FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = participant1_id OR (select auth.uid()) = participant2_id);

-- ============================================
-- SPONSORS
-- ============================================
DROP POLICY IF EXISTS "Sponsors can insert own profile" ON sponsors;
CREATE POLICY "Sponsors can insert own profile"
  ON sponsors FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Sponsors can update own profile" ON sponsors;
CREATE POLICY "Sponsors can update own profile"
  ON sponsors FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Sponsors can delete own profile" ON sponsors;
CREATE POLICY "Sponsors can delete own profile"
  ON sponsors FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));

-- ============================================
-- NOTIFICATIONS
-- ============================================
DROP POLICY IF EXISTS "Users can view their own notifications" ON notifications;
CREATE POLICY "Users can view their own notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can update their own notifications" ON notifications;
CREATE POLICY "Users can update their own notifications"
  ON notifications FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can delete their own notifications" ON notifications;
CREATE POLICY "Users can delete their own notifications"
  ON notifications FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));

-- ============================================
-- CONVERSATIONS
-- ============================================
DROP POLICY IF EXISTS "Users can create conversations" ON conversations;
CREATE POLICY "Users can create conversations"
  ON conversations FOR INSERT
  TO authenticated
  WITH CHECK (created_by = (select auth.uid()));

DROP POLICY IF EXISTS "Users can update their own conversations" ON conversations;
CREATE POLICY "Users can update their own conversations"
  ON conversations FOR UPDATE
  TO authenticated
  USING (created_by = (select auth.uid()))
  WITH CHECK (created_by = (select auth.uid()));

DROP POLICY IF EXISTS "Users can view conversations they are members of" ON conversations;
CREATE POLICY "Users can view conversations they are members of"
  ON conversations FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM conversation_members
      WHERE conversation_id = conversations.id
      AND user_id = (select auth.uid())
    )
  );

-- ============================================
-- MESSAGES
-- ============================================
DROP POLICY IF EXISTS "Users can view messages in their conversations" ON messages;
CREATE POLICY "Users can view messages in their conversations"
  ON messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM conversation_members
      WHERE conversation_id = messages.conversation_id
      AND user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can send messages in their conversations" ON messages;
CREATE POLICY "Users can send messages in their conversations"
  ON messages FOR INSERT
  TO authenticated
  WITH CHECK (
    sender_id = (select auth.uid()) AND
    EXISTS (
      SELECT 1 FROM conversation_members
      WHERE conversation_id = messages.conversation_id
      AND user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can update their own messages" ON messages;
CREATE POLICY "Users can update their own messages"
  ON messages FOR UPDATE
  TO authenticated
  USING (sender_id = (select auth.uid()))
  WITH CHECK (sender_id = (select auth.uid()));

-- ============================================
-- CONVERSATION MEMBERS
-- ============================================
DROP POLICY IF EXISTS "Users can view members of their conversations" ON conversation_members;
CREATE POLICY "Users can view members of their conversations"
  ON conversation_members FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM conversation_members cm
      WHERE cm.conversation_id = conversation_members.conversation_id
      AND cm.user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can add members to conversations they own" ON conversation_members;
CREATE POLICY "Users can add members to conversations they own"
  ON conversation_members FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM conversations
      WHERE id = conversation_id
      AND created_by = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Members can leave conversations" ON conversation_members;
CREATE POLICY "Members can leave conversations"
  ON conversation_members FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Admins can remove members" ON conversation_members;
CREATE POLICY "Admins can remove members"
  ON conversation_members FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM conversation_members cm
      WHERE cm.conversation_id = conversation_members.conversation_id
      AND cm.user_id = (select auth.uid())
      AND cm.role = ANY(ARRAY['owner', 'admin'])
    )
  );

-- ============================================
-- MESSAGE REACTIONS
-- ============================================
DROP POLICY IF EXISTS "Users can view reactions in their conversations" ON message_reactions;
CREATE POLICY "Users can view reactions in their conversations"
  ON message_reactions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM messages m
      JOIN conversation_members cm ON cm.conversation_id = m.conversation_id
      WHERE m.id = message_id AND cm.user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can add reactions" ON message_reactions;
CREATE POLICY "Users can add reactions"
  ON message_reactions FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can remove their own reactions" ON message_reactions;
CREATE POLICY "Users can remove their own reactions"
  ON message_reactions FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));
