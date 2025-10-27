/*
  # Système de Messagerie - V1

  1. Tables Créées
    - `messages`
      - `id` (uuid, PK)
      - `sender_id` (uuid, FK → profiles) - Expéditeur
      - `recipient_id` (uuid, FK → profiles) - Destinataire
      - `subject` (text) - Sujet du message
      - `content` (text) - Contenu du message
      - `read` (boolean) - Message lu ou non
      - `read_at` (timestamptz) - Date de lecture
      - `sent_at` (timestamptz) - Date d'envoi
      - `created_at` (timestamptz)

    - `message_threads`
      - `id` (uuid, PK)
      - `participant1_id` (uuid, FK → profiles)
      - `participant2_id` (uuid, FK → profiles)
      - `last_message_at` (timestamptz)
      - `created_at` (timestamptz)

  2. Sécurité (RLS)
    - Enable RLS sur toutes les tables
    - messages :
      - Les utilisateurs peuvent envoyer des messages
      - Les utilisateurs voient les messages qu'ils ont envoyés ou reçus
      - Les utilisateurs peuvent marquer leurs messages reçus comme lus
    - message_threads :
      - Les participants voient leur conversation
      - Les threads sont créés automatiquement

  3. Index
    - Index sur sender_id et recipient_id pour performance
    - Index sur read pour filtrer messages non lus
    - Index sur sent_at pour tri chronologique
*/

-- Table: messages
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  recipient_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  subject text NOT NULL,
  content text NOT NULL,
  read boolean DEFAULT false,
  read_at timestamptz,
  sent_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Table: message_threads (pour grouper conversations)
CREATE TABLE IF NOT EXISTS message_threads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  participant1_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  participant2_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  last_message_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  UNIQUE(participant1_id, participant2_id),
  CHECK (participant1_id < participant2_id)
);

-- Index pour performance
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_recipient_id ON messages(recipient_id);
CREATE INDEX IF NOT EXISTS idx_messages_read ON messages(read);
CREATE INDEX IF NOT EXISTS idx_messages_sent_at ON messages(sent_at DESC);
CREATE INDEX IF NOT EXISTS idx_message_threads_participant1 ON message_threads(participant1_id);
CREATE INDEX IF NOT EXISTS idx_message_threads_participant2 ON message_threads(participant2_id);

-- Enable RLS
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_threads ENABLE ROW LEVEL SECURITY;

-- RLS Policies: messages
CREATE POLICY "Users can send messages"
  ON messages FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = sender_id
  );

CREATE POLICY "Users can view sent messages"
  ON messages FOR SELECT
  TO authenticated
  USING (
    sender_id = auth.uid()
  );

CREATE POLICY "Users can view received messages"
  ON messages FOR SELECT
  TO authenticated
  USING (
    recipient_id = auth.uid()
  );

CREATE POLICY "Users can mark received messages as read"
  ON messages FOR UPDATE
  TO authenticated
  USING (
    recipient_id = auth.uid()
  )
  WITH CHECK (
    recipient_id = auth.uid()
  );

-- RLS Policies: message_threads
CREATE POLICY "Users can create threads"
  ON message_threads FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() IN (participant1_id, participant2_id)
  );

CREATE POLICY "Users can view own threads"
  ON message_threads FOR SELECT
  TO authenticated
  USING (
    auth.uid() IN (participant1_id, participant2_id)
  );

-- Fonction pour mettre à jour last_message_at automatiquement
CREATE OR REPLACE FUNCTION update_thread_last_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE message_threads
  SET last_message_at = NEW.sent_at
  WHERE (participant1_id = LEAST(NEW.sender_id, NEW.recipient_id)
    AND participant2_id = GREATEST(NEW.sender_id, NEW.recipient_id));

  IF NOT FOUND THEN
    INSERT INTO message_threads (participant1_id, participant2_id, last_message_at)
    VALUES (
      LEAST(NEW.sender_id, NEW.recipient_id),
      GREATEST(NEW.sender_id, NEW.recipient_id),
      NEW.sent_at
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour mettre à jour les threads automatiquement
DROP TRIGGER IF EXISTS update_message_thread ON messages;
CREATE TRIGGER update_message_thread
  AFTER INSERT ON messages
  FOR EACH ROW
  EXECUTE FUNCTION update_thread_last_message();
