/*
  # Historique des conversations avec Elea

  ## Vue d'ensemble
  Cette migration ajoute les tables nécessaires pour stocker l'historique des conversations
  entre les utilisateurs et l'agent IA Elea, permettant une personnalisation complète par utilisateur.

  ## 1. Nouvelle Table

  ### elea_conversations - Sessions de conversation avec Elea
  - `id` (uuid, primary key)
  - `user_id` (uuid, référence vers profiles) - Utilisateur propriétaire
  - `title` (text) - Titre de la conversation (généré automatiquement)
  - `context` (jsonb) - Contexte de la conversation (page, étape, userType, etc.)
  - `is_active` (boolean) - Conversation active ou archivée
  - `last_message_at` (timestamptz) - Date du dernier message
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### elea_messages - Messages dans les conversations avec Elea
  - `id` (uuid, primary key)
  - `conversation_id` (uuid, référence vers elea_conversations)
  - `sender` (text) - 'user' ou 'agent'
  - `content` (text) - Contenu du message
  - `message_type` (text) - Type de message (text, error, suggestion)
  - `metadata` (jsonb) - Métadonnées additionnelles
  - `created_at` (timestamptz)

  ## 2. Sécurité RLS

  Politiques restrictives :
  - Les utilisateurs ne peuvent voir que leurs propres conversations
  - Les utilisateurs ne peuvent créer/modifier que leurs propres conversations
  - Les messages ne sont visibles que par le propriétaire de la conversation

  ## 3. Index

  Index pour optimiser :
  - Recherche de conversations par utilisateur et activité
  - Recherche de messages par conversation
  - Tri par date de dernier message

  ## 4. Fonctions

  Fonction pour nettoyer automatiquement les anciennes conversations inactives (optionnel)

  ## Notes importantes
  - Les conversations sont liées à l'utilisateur pour personnalisation
  - Le contexte est stocké en JSON pour flexibilité
  - Les métadonnées permettent d'ajouter des infos sans changer le schéma
  - Historique conservé pour améliorer les réponses futures
*/

-- ============================================================================
-- 1. TABLE: elea_conversations (Conversations avec Elea)
-- ============================================================================

CREATE TABLE IF NOT EXISTS elea_conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title text DEFAULT 'Nouvelle conversation',
  context jsonb DEFAULT '{}'::jsonb,
  is_active boolean DEFAULT true,
  last_message_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_elea_conversations_user ON elea_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_elea_conversations_active ON elea_conversations(user_id, is_active);
CREATE INDEX IF NOT EXISTS idx_elea_conversations_last_message ON elea_conversations(last_message_at DESC);

-- RLS
ALTER TABLE elea_conversations ENABLE ROW LEVEL SECURITY;

-- Les utilisateurs peuvent voir leurs propres conversations
CREATE POLICY "Users can view own conversations with Elea"
  ON elea_conversations FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Les utilisateurs peuvent créer leurs conversations
CREATE POLICY "Users can create conversations with Elea"
  ON elea_conversations FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Les utilisateurs peuvent modifier leurs propres conversations
CREATE POLICY "Users can update own conversations with Elea"
  ON elea_conversations FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Les utilisateurs peuvent supprimer leurs propres conversations
CREATE POLICY "Users can delete own conversations with Elea"
  ON elea_conversations FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- ============================================================================
-- 2. TABLE: elea_messages (Messages avec Elea)
-- ============================================================================

CREATE TABLE IF NOT EXISTS elea_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES elea_conversations(id) ON DELETE CASCADE,
  sender text NOT NULL CHECK (sender IN ('user', 'agent')),
  content text NOT NULL,
  message_type text NOT NULL DEFAULT 'text' CHECK (message_type IN ('text', 'error', 'suggestion', 'system')),
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_elea_messages_conversation ON elea_messages(conversation_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_elea_messages_sender ON elea_messages(sender);

-- RLS
ALTER TABLE elea_messages ENABLE ROW LEVEL SECURITY;

-- Les utilisateurs peuvent voir les messages de leurs conversations
CREATE POLICY "Users can view messages in own conversations"
  ON elea_messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM elea_conversations
      WHERE elea_conversations.id = elea_messages.conversation_id
      AND elea_conversations.user_id = auth.uid()
    )
  );

-- Les utilisateurs peuvent créer des messages dans leurs conversations
CREATE POLICY "Users can create messages in own conversations"
  ON elea_messages FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM elea_conversations
      WHERE elea_conversations.id = elea_messages.conversation_id
      AND elea_conversations.user_id = auth.uid()
    )
  );

-- ============================================================================
-- 3. FUNCTIONS & TRIGGERS
-- ============================================================================

-- Fonction pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_elea_conversation_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour elea_conversations
DROP TRIGGER IF EXISTS update_elea_conversations_updated_at ON elea_conversations;
CREATE TRIGGER update_elea_conversations_updated_at
  BEFORE UPDATE ON elea_conversations
  FOR EACH ROW
  EXECUTE FUNCTION update_elea_conversation_updated_at();

-- Fonction pour mettre à jour last_message_at
CREATE OR REPLACE FUNCTION update_elea_conversation_last_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE elea_conversations
  SET last_message_at = NEW.created_at
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour elea_messages
DROP TRIGGER IF EXISTS update_elea_conversation_on_new_message ON elea_messages;
CREATE TRIGGER update_elea_conversation_on_new_message
  AFTER INSERT ON elea_messages
  FOR EACH ROW
  EXECUTE FUNCTION update_elea_conversation_last_message();

-- Fonction pour générer automatiquement un titre basé sur le premier message
CREATE OR REPLACE FUNCTION generate_elea_conversation_title()
RETURNS TRIGGER AS $$
DECLARE
  first_message text;
  conv_title text;
BEGIN
  -- Récupérer le premier message utilisateur de la conversation
  SELECT content INTO first_message
  FROM elea_messages
  WHERE conversation_id = NEW.conversation_id
    AND sender = 'user'
  ORDER BY created_at ASC
  LIMIT 1;

  -- Générer un titre (50 premiers caractères + ...)
  IF first_message IS NOT NULL THEN
    IF length(first_message) > 50 THEN
      conv_title := substring(first_message from 1 for 50) || '...';
    ELSE
      conv_title := first_message;
    END IF;

    -- Mettre à jour le titre de la conversation
    UPDATE elea_conversations
    SET title = conv_title
    WHERE id = NEW.conversation_id
      AND title = 'Nouvelle conversation';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour générer le titre automatiquement
DROP TRIGGER IF EXISTS generate_conversation_title ON elea_messages;
CREATE TRIGGER generate_conversation_title
  AFTER INSERT ON elea_messages
  FOR EACH ROW
  WHEN (NEW.sender = 'user')
  EXECUTE FUNCTION generate_elea_conversation_title();

-- ============================================================================
-- 4. FONCTION DE NETTOYAGE (Optionnel - à exécuter manuellement ou via cron)
-- ============================================================================

-- Fonction pour archiver les conversations inactives depuis plus de 30 jours
CREATE OR REPLACE FUNCTION archive_old_elea_conversations()
RETURNS INTEGER AS $$
DECLARE
  archived_count INTEGER;
BEGIN
  UPDATE elea_conversations
  SET is_active = false
  WHERE is_active = true
    AND last_message_at < now() - interval '30 days';

  GET DIAGNOSTICS archived_count = ROW_COUNT;
  RETURN archived_count;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour supprimer les conversations archivées depuis plus de 90 jours
CREATE OR REPLACE FUNCTION delete_old_elea_conversations()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM elea_conversations
  WHERE is_active = false
    AND updated_at < now() - interval '90 days';

  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;
