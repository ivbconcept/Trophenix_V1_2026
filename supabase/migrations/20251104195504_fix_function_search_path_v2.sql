/*
  # Fix Function Search Path Issues

  1. Security Improvements
    - Set search_path to empty string for all functions
    - Prevents search_path manipulation attacks
    - Forces functions to use fully qualified names
  
  2. Functions Fixed
    - All functions with mutable search_path
  
  3. Notes
    - Functions dropped and recreated with proper search_path
*/

-- ============================================
-- NOTIFICATION FUNCTIONS
-- ============================================
DROP FUNCTION IF EXISTS public.count_unread_notifications(uuid);
CREATE FUNCTION public.count_unread_notifications(p_user_id uuid)
RETURNS bigint
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)
    FROM public.notifications
    WHERE user_id = p_user_id AND read = false
  );
END;
$$;

DROP FUNCTION IF EXISTS public.mark_all_notifications_read(uuid);
CREATE FUNCTION public.mark_all_notifications_read(p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  UPDATE public.notifications
  SET read = true, updated_at = now()
  WHERE user_id = p_user_id AND read = false;
END;
$$;

-- ============================================
-- JOB OFFERS FUNCTIONS
-- ============================================
DROP FUNCTION IF EXISTS public.update_job_offers_updated_at() CASCADE;
CREATE FUNCTION public.update_job_offers_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- ============================================
-- COVER LETTER FUNCTIONS
-- ============================================
DROP FUNCTION IF EXISTS public.update_cover_letter_updated_at() CASCADE;
CREATE FUNCTION public.update_cover_letter_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- ============================================
-- MESSAGING FUNCTIONS
-- ============================================
DROP FUNCTION IF EXISTS public.get_or_create_conversation(uuid, uuid);
CREATE FUNCTION public.get_or_create_conversation(p_user1_id uuid, p_user2_id uuid)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_conversation_id uuid;
BEGIN
  SELECT mt.id INTO v_conversation_id
  FROM public.message_threads mt
  WHERE (mt.participant1_id = p_user1_id AND mt.participant2_id = p_user2_id)
     OR (mt.participant1_id = p_user2_id AND mt.participant2_id = p_user1_id)
  LIMIT 1;
  
  IF v_conversation_id IS NULL THEN
    INSERT INTO public.message_threads (participant1_id, participant2_id)
    VALUES (p_user1_id, p_user2_id)
    RETURNING id INTO v_conversation_id;
  END IF;
  
  RETURN v_conversation_id;
END;
$$;

DROP FUNCTION IF EXISTS public.count_unread_messages(uuid);
CREATE FUNCTION public.count_unread_messages(p_user_id uuid)
RETURNS bigint
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  RETURN (
    SELECT COALESCE(SUM(cm.unread_count), 0)
    FROM public.conversation_members cm
    WHERE cm.user_id = p_user_id
  );
END;
$$;

DROP FUNCTION IF EXISTS public.update_conversation_last_message() CASCADE;
CREATE FUNCTION public.update_conversation_last_message()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  UPDATE public.conversations
  SET last_message_at = NEW.created_at,
      updated_at = NEW.created_at
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$;

DROP FUNCTION IF EXISTS public.create_group_conversation(uuid, text, uuid[]);
CREATE FUNCTION public.create_group_conversation(
  p_creator_id uuid,
  p_name text,
  p_member_ids uuid[]
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_conversation_id uuid;
  v_member_id uuid;
BEGIN
  INSERT INTO public.conversations (created_by, name, is_group)
  VALUES (p_creator_id, p_name, true)
  RETURNING id INTO v_conversation_id;
  
  INSERT INTO public.conversation_members (conversation_id, user_id, role, can_post, can_invite)
  VALUES (v_conversation_id, p_creator_id, 'owner', true, true);
  
  FOREACH v_member_id IN ARRAY p_member_ids
  LOOP
    IF v_member_id != p_creator_id THEN
      INSERT INTO public.conversation_members (conversation_id, user_id, role, can_post, can_invite)
      VALUES (v_conversation_id, v_member_id, 'member', true, false);
    END IF;
  END LOOP;
  
  RETURN v_conversation_id;
END;
$$;

DROP FUNCTION IF EXISTS public.update_unread_count() CASCADE;
CREATE FUNCTION public.update_unread_count()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  UPDATE public.conversation_members
  SET unread_count = unread_count + 1
  WHERE conversation_id = NEW.conversation_id
    AND user_id != NEW.sender_id;
  RETURN NEW;
END;
$$;

DROP FUNCTION IF EXISTS public.mark_conversation_read(uuid, uuid);
CREATE FUNCTION public.mark_conversation_read(
  p_conversation_id uuid,
  p_user_id uuid
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  UPDATE public.conversation_members
  SET unread_count = 0,
      last_read_at = now()
  WHERE conversation_id = p_conversation_id
    AND user_id = p_user_id;
END;
$$;

DROP FUNCTION IF EXISTS public.count_unread_conversations(uuid);
CREATE FUNCTION public.count_unread_conversations(p_user_id uuid)
RETURNS bigint
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  RETURN (
    SELECT COUNT(DISTINCT cm.conversation_id)
    FROM public.conversation_members cm
    WHERE cm.user_id = p_user_id AND cm.unread_count > 0
  );
END;
$$;

-- ============================================
-- UTILITY FUNCTIONS
-- ============================================
DROP FUNCTION IF EXISTS public.sync_athlete_sport_id() CASCADE;
CREATE FUNCTION public.sync_athlete_sport_id()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF NEW.sport_name IS NOT NULL THEN
    SELECT id INTO NEW.sport_id
    FROM public.sports
    WHERE name = NEW.sport_name
    LIMIT 1;
  END IF;
  RETURN NEW;
END;
$$;

DROP FUNCTION IF EXISTS public.get_user_display_name(uuid);
CREATE FUNCTION public.get_user_display_name(p_user_id uuid)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_display_name text;
BEGIN
  SELECT COALESCE(p.first_name || ' ' || p.last_name, u.email)
  INTO v_display_name
  FROM auth.users u
  LEFT JOIN public.profiles p ON p.user_id = u.id
  WHERE u.id = p_user_id;
  
  RETURN v_display_name;
END;
$$;

DROP FUNCTION IF EXISTS public.get_distinct_regions();
CREATE FUNCTION public.get_distinct_regions()
RETURNS SETOF text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  RETURN QUERY
  SELECT DISTINCT region
  FROM public.french_communes
  WHERE region IS NOT NULL
  ORDER BY region;
END;
$$;

DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;
CREATE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP FUNCTION IF EXISTS public.update_thread_last_message() CASCADE;
CREATE FUNCTION public.update_thread_last_message()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  UPDATE public.message_threads
  SET last_message_at = NEW.created_at
  WHERE id = NEW.thread_id;
  RETURN NEW;
END;
$$;
