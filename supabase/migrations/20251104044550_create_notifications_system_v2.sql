/*
  # Système de Notifications

  1. Nouvelle Table
    - `notifications`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key vers auth.users)
      - `type` (text) - Type de notification (job, message, like, connection, achievement, system)
      - `title` (text) - Titre de la notification
      - `description` (text) - Description de la notification
      - `read` (boolean) - Statut lu/non lu
      - `action_url` (text, nullable) - URL d'action optionnelle
      - `metadata` (jsonb, nullable) - Métadonnées supplémentaires
      - `created_at` (timestamptz)

  2. Sécurité
    - Enable RLS sur `notifications`
    - Les utilisateurs peuvent seulement voir leurs propres notifications
    - Les utilisateurs peuvent marquer leurs notifications comme lues
    - Les utilisateurs peuvent supprimer leurs propres notifications

  3. Index
    - Index sur user_id pour performances
    - Index sur created_at pour tri
    - Index sur read pour filtrer les non lues
*/

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL CHECK (type IN ('job', 'message', 'like', 'connection', 'achievement', 'system')),
  title text NOT NULL,
  description text NOT NULL,
  read boolean DEFAULT false NOT NULL,
  action_url text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own notifications"
  ON notifications
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
  ON notifications
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notifications"
  ON notifications
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "System can create notifications"
  ON notifications
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS notifications_user_id_idx ON notifications(user_id);
CREATE INDEX IF NOT EXISTS notifications_created_at_idx ON notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS notifications_read_idx ON notifications(read) WHERE read = false;
CREATE INDEX IF NOT EXISTS notifications_type_idx ON notifications(type);

-- Create function to count unread notifications
CREATE OR REPLACE FUNCTION count_unread_notifications(p_user_id uuid)
RETURNS bigint
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT COUNT(*)
  FROM notifications
  WHERE user_id = p_user_id
  AND read = false;
$$;

-- Create function to mark all notifications as read
CREATE OR REPLACE FUNCTION mark_all_notifications_read(p_user_id uuid)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
AS $$
  UPDATE notifications
  SET read = true
  WHERE user_id = p_user_id
  AND read = false;
$$;
