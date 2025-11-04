/*
  # Amélioration du Système de Messagerie

  1. Modifications des Tables Existantes
    - Ajout de types de conversations (direct, group, channel)
    - Support des fichiers, réactions, mentions
    - Statuts de présence
    - Historique d'édition et suppression

  2. Nouvelles Tables
    - `message_reactions` - Réactions aux messages
    - `message_attachments` - Fichiers joints
    - `conversation_members` - Membres des groupes/channels
    - `user_presence` - Statut de présence des utilisateurs

  3. Fonctionnalités
    - Conversations de groupe et channels thématiques
    - Partage de fichiers et médias
    - Réactions emoji
    - Mentions et notifications
    - Édition et suppression de messages
    - Statuts de présence
    - Gestion des accès et permissions
*/

-- Add conversation types and metadata
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS type text DEFAULT 'direct' CHECK (type IN ('direct', 'group', 'channel'));
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS name text;
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS description text;
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS avatar_url text;
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS created_by uuid REFERENCES auth.users(id);
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS is_private boolean DEFAULT true;

-- Add message features
ALTER TABLE messages ADD COLUMN IF NOT EXISTS edited_at timestamptz;
ALTER TABLE messages ADD COLUMN IF NOT EXISTS deleted_at timestamptz;
ALTER TABLE messages ADD COLUMN IF NOT EXISTS parent_message_id uuid REFERENCES messages(id);
ALTER TABLE messages ADD COLUMN IF NOT EXISTS mentions jsonb DEFAULT '[]'::jsonb;

-- Create conversation members table (for groups and channels)
CREATE TABLE IF NOT EXISTS conversation_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid REFERENCES conversations(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role text DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'moderator', 'member')),
  can_post boolean DEFAULT true,
  can_invite boolean DEFAULT false,
  joined_at timestamptz DEFAULT now() NOT NULL,
  last_read_at timestamptz DEFAULT now(),
  unread_count integer DEFAULT 0,
  muted boolean DEFAULT false,
  UNIQUE(conversation_id, user_id)
);

-- Create message reactions table
CREATE TABLE IF NOT EXISTS message_reactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id uuid REFERENCES messages(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  emoji text NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(message_id, user_id, emoji)
);

-- Create message attachments table
CREATE TABLE IF NOT EXISTS message_attachments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id uuid REFERENCES messages(id) ON DELETE CASCADE NOT NULL,
  file_name text NOT NULL,
  file_url text NOT NULL,
  file_type text NOT NULL,
  file_size bigint,
  thumbnail_url text,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Create user presence table
CREATE TABLE IF NOT EXISTS user_presence (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  status text DEFAULT 'offline' CHECK (status IN ('online', 'away', 'busy', 'offline')),
  last_seen_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE conversation_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_presence ENABLE ROW LEVEL SECURITY;

-- RLS Policies for conversation_members
CREATE POLICY "Users can view members of their conversations"
  ON conversation_members
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM conversation_members cm
      WHERE cm.conversation_id = conversation_members.conversation_id
      AND cm.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can add members to conversations they own"
  ON conversation_members
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM conversation_members cm
      WHERE cm.conversation_id = conversation_members.conversation_id
      AND cm.user_id = auth.uid()
      AND cm.role IN ('owner', 'admin')
    )
    OR
    EXISTS (
      SELECT 1 FROM conversations c
      WHERE c.id = conversation_members.conversation_id
      AND c.created_by = auth.uid()
    )
  );

CREATE POLICY "Members can leave conversations"
  ON conversation_members
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can remove members"
  ON conversation_members
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM conversation_members cm
      WHERE cm.conversation_id = conversation_members.conversation_id
      AND cm.user_id = auth.uid()
      AND cm.role IN ('owner', 'admin')
    )
  );

-- RLS Policies for message_reactions
CREATE POLICY "Users can view reactions in their conversations"
  ON message_reactions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM messages m
      INNER JOIN conversations c ON c.id = m.conversation_id
      INNER JOIN conversation_members cm ON cm.conversation_id = c.id
      WHERE m.id = message_reactions.message_id
      AND cm.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can add reactions"
  ON message_reactions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove their own reactions"
  ON message_reactions
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for message_attachments
CREATE POLICY "Users can view attachments in their conversations"
  ON message_attachments
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM messages m
      INNER JOIN conversations c ON c.id = m.conversation_id
      INNER JOIN conversation_members cm ON cm.conversation_id = c.id
      WHERE m.id = message_attachments.message_id
      AND cm.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can upload attachments"
  ON message_attachments
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM messages m
      INNER JOIN conversation_members cm ON cm.conversation_id = m.conversation_id
      WHERE m.id = message_attachments.message_id
      AND cm.user_id = auth.uid()
    )
  );

-- RLS Policies for user_presence
CREATE POLICY "Users can view all presence statuses"
  ON user_presence
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update their own presence"
  ON user_presence
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own presence status"
  ON user_presence
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS conversation_members_user_id_idx ON conversation_members(user_id);
CREATE INDEX IF NOT EXISTS conversation_members_conversation_id_idx ON conversation_members(conversation_id);
CREATE INDEX IF NOT EXISTS conversation_members_unread_idx ON conversation_members(unread_count) WHERE unread_count > 0;

CREATE INDEX IF NOT EXISTS message_reactions_message_id_idx ON message_reactions(message_id);
CREATE INDEX IF NOT EXISTS message_reactions_user_id_idx ON message_reactions(user_id);

CREATE INDEX IF NOT EXISTS message_attachments_message_id_idx ON message_attachments(message_id);

CREATE INDEX IF NOT EXISTS user_presence_status_idx ON user_presence(status);
CREATE INDEX IF NOT EXISTS user_presence_last_seen_idx ON user_presence(last_seen_at DESC);

-- Function to create a group conversation
CREATE OR REPLACE FUNCTION create_group_conversation(
  p_name text,
  p_type text,
  p_description text DEFAULT NULL,
  p_creator_id uuid DEFAULT auth.uid(),
  p_is_private boolean DEFAULT true,
  p_member_ids uuid[] DEFAULT ARRAY[]::uuid[]
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_conversation_id uuid;
  v_member_id uuid;
BEGIN
  -- Create conversation
  INSERT INTO conversations (type, name, description, created_by, is_private, participant1_id, participant2_id)
  VALUES (p_type, p_name, p_description, p_creator_id, p_is_private, p_creator_id, p_creator_id)
  RETURNING id INTO v_conversation_id;

  -- Add creator as owner
  INSERT INTO conversation_members (conversation_id, user_id, role, can_invite)
  VALUES (v_conversation_id, p_creator_id, 'owner', true);

  -- Add other members
  FOREACH v_member_id IN ARRAY p_member_ids
  LOOP
    IF v_member_id != p_creator_id THEN
      INSERT INTO conversation_members (conversation_id, user_id)
      VALUES (v_conversation_id, v_member_id);
    END IF;
  END LOOP;

  RETURN v_conversation_id;
END;
$$;

-- Function to update unread count
CREATE OR REPLACE FUNCTION update_unread_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Increment unread count for all members except sender
  UPDATE conversation_members
  SET unread_count = unread_count + 1
  WHERE conversation_id = NEW.conversation_id
    AND user_id != NEW.sender_id
    AND NOT muted;

  RETURN NEW;
END;
$$;

CREATE TRIGGER messages_update_unread_count
  AFTER INSERT ON messages
  FOR EACH ROW
  EXECUTE FUNCTION update_unread_count();

-- Function to mark conversation as read
CREATE OR REPLACE FUNCTION mark_conversation_read(
  p_conversation_id uuid,
  p_user_id uuid DEFAULT auth.uid()
)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
AS $$
  UPDATE conversation_members
  SET unread_count = 0,
      last_read_at = now()
  WHERE conversation_id = p_conversation_id
    AND user_id = p_user_id;
$$;

-- Function to get total unread conversations count
CREATE OR REPLACE FUNCTION count_unread_conversations(p_user_id uuid)
RETURNS bigint
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT COUNT(DISTINCT conversation_id)
  FROM conversation_members
  WHERE user_id = p_user_id
    AND unread_count > 0
    AND NOT muted;
$$;
