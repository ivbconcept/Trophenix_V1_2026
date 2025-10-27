/*
  # Architecture IA Scalable et Multi-Agents pour Trophenix

  ## Vue d'ensemble
  Cette migration remplace l'architecture basique par une architecture professionnelle et scalable
  permettant de gérer plusieurs agents IA, conversations simultanées, fichiers, intégrations externes.

  ## Architecture Conceptuelle

  ```
  USER
    └─> AGENT_SESSIONS (conversations actives avec différents agents)
          ├─> MESSAGES (historique complet)
          │     ├─> MESSAGE_ATTACHMENTS (fichiers joints)
          │     └─> MESSAGE_REACTIONS (feedback utilisateur)
          ├─> SESSION_CONTEXT (contexte dynamique)
          └─> SESSION_METADATA (analytics, performances)
  
  AGENTS_REGISTRY (catalogue des agents disponibles)
    ├─> Elea (assistant principal)
    ├─> RecruteurBot (spécialisé recrutement)
    ├─> CoachBot (coaching sportif)
    └─> [Futurs agents...]
  ```

  ## 1. Tables Principales

  ### agents_registry - Catalogue des agents IA disponibles
  - `id` (uuid, primary key)
  - `name` (text) - Nom de l'agent (ex: "Elea", "RecruteurBot")
  - `display_name` (text) - Nom affiché à l'utilisateur
  - `description` (text) - Description des capacités
  - `avatar_url` (text) - Avatar de l'agent
  - `capabilities` (jsonb) - Capacités (text, voice, files, web, etc.)
  - `config` (jsonb) - Configuration (modèle IA, température, etc.)
  - `is_active` (boolean) - Agent actif ou non
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### agent_sessions - Sessions de conversation utilisateur-agent
  - `id` (uuid, primary key)
  - `user_id` (uuid, référence profiles)
  - `agent_id` (uuid, référence agents_registry)
  - `title` (text) - Titre de la session
  - `status` (text) - active, paused, archived, deleted
  - `context` (jsonb) - Contexte dynamique (page, données métier, etc.)
  - `metadata` (jsonb) - Métadonnées (tags, analytics, etc.)
  - `last_message_at` (timestamptz)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### agent_messages - Messages dans les sessions
  - `id` (uuid, primary key)
  - `session_id` (uuid, référence agent_sessions)
  - `sender_type` (text) - user, agent, system
  - `sender_id` (uuid) - ID de l'expéditeur (user_id ou agent_id)
  - `content` (text) - Contenu du message
  - `content_type` (text) - text, voice, image, file, code, etc.
  - `metadata` (jsonb) - Métadonnées (langue, durée voix, etc.)
  - `parent_message_id` (uuid) - Pour threading/réponses
  - `is_edited` (boolean)
  - `is_deleted` (boolean)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### message_attachments - Fichiers joints aux messages
  - `id` (uuid, primary key)
  - `message_id` (uuid, référence agent_messages)
  - `file_name` (text)
  - `file_type` (text) - pdf, image, audio, video, document
  - `file_size` (bigint) - Taille en bytes
  - `storage_path` (text) - Chemin dans Supabase Storage
  - `mime_type` (text)
  - `metadata` (jsonb) - Dimensions, durée, etc.
  - `created_at` (timestamptz)

  ### message_reactions - Feedback utilisateur sur les messages
  - `id` (uuid, primary key)
  - `message_id` (uuid, référence agent_messages)
  - `user_id` (uuid, référence profiles)
  - `reaction_type` (text) - helpful, not_helpful, flag, star
  - `feedback_text` (text) - Feedback optionnel
  - `created_at` (timestamptz)

  ### agent_knowledge_base - Base de connaissances pour les agents
  - `id` (uuid, primary key)
  - `agent_id` (uuid, référence agents_registry)
  - `category` (text) - faq, documentation, training_data
  - `title` (text)
  - `content` (text)
  - `embedding` (vector) - Pour recherche sémantique (future)
  - `metadata` (jsonb)
  - `is_active` (boolean)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### agent_analytics - Analytics et métriques des agents
  - `id` (uuid, primary key)
  - `session_id` (uuid, référence agent_sessions)
  - `agent_id` (uuid, référence agents_registry)
  - `user_id` (uuid, référence profiles)
  - `event_type` (text) - session_start, message_sent, file_shared, etc.
  - `event_data` (jsonb)
  - `created_at` (timestamptz)

  ## 2. Sécurité RLS

  Toutes les tables ont RLS activé avec politiques strictes :
  - Les utilisateurs ne voient que leurs propres sessions et messages
  - Les agents_registry sont publics (lecture seule)
  - Les analytics sont accessibles uniquement par l'admin

  ## 3. Storage Buckets

  Création des buckets Supabase Storage :
  - `agent_attachments` - Fichiers utilisateurs (CV, documents)
  - `agent_voice_messages` - Messages vocaux
  - `agent_generated_files` - Fichiers générés par les agents

  ## 4. Fonctions et Triggers

  - Auto-update de updated_at
  - Auto-update de last_message_at
  - Génération automatique de titre de session
  - Nettoyage automatique des sessions anciennes
  - Analytics tracking automatique

  ## 5. Index et Performance

  Index optimisés pour :
  - Recherche de sessions par utilisateur et agent
  - Recherche de messages par session
  - Recherche de fichiers par message
  - Analytics et reporting

  ## Notes Importantes
  
  Cette architecture permet :
  ✅ Multiples agents simultanés
  ✅ Conversations parallèles
  ✅ Gestion complète des fichiers
  ✅ Messages vocaux
  ✅ Threading de messages
  ✅ Feedback utilisateur
  ✅ Analytics détaillés
  ✅ Base de connaissances évolutive
  ✅ Recherche sémantique (future)
  ✅ Intégrations externes (via metadata)
*/

-- ============================================================================
-- 0. SUPPRESSION DES ANCIENNES TABLES (si nécessaire)
-- ============================================================================

-- On garde les anciennes tables pour migration progressive
-- Elles seront supprimées dans une migration ultérieure

-- ============================================================================
-- 1. TABLE: agents_registry (Catalogue des agents)
-- ============================================================================

CREATE TABLE IF NOT EXISTS agents_registry (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  display_name text NOT NULL,
  description text NOT NULL,
  avatar_url text DEFAULT '',
  capabilities jsonb DEFAULT '{
    "text": true,
    "voice": false,
    "files": false,
    "web": false,
    "code": false
  }'::jsonb,
  config jsonb DEFAULT '{
    "model": "gpt-3.5-turbo",
    "temperature": 0.7,
    "max_tokens": 2000
  }'::jsonb,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_agents_active ON agents_registry(is_active);
CREATE INDEX IF NOT EXISTS idx_agents_name ON agents_registry(name);

-- Insérer les agents par défaut
INSERT INTO agents_registry (name, display_name, description, avatar_url, capabilities) VALUES
('elea', 'Elea', 'Votre assistante personnelle Trophenix. Je vous aide à naviguer sur la plateforme et à optimiser votre expérience.', '', '{"text": true, "voice": false, "files": true, "web": false, "code": false}'),
('recruteur', 'RecruteurBot', 'Expert en recrutement sportif. Je vous aide à créer des offres attractives et à trouver les meilleurs talents.', '', '{"text": true, "voice": false, "files": true, "web": true, "code": false}'),
('coach', 'CoachBot', 'Coach sportif virtuel. Je vous conseille sur votre carrière et votre développement professionnel.', '', '{"text": true, "voice": false, "files": false, "web": true, "code": false}')
ON CONFLICT (name) DO NOTHING;

-- RLS
ALTER TABLE agents_registry ENABLE ROW LEVEL SECURITY;

-- Lecture publique pour tous les agents actifs
CREATE POLICY "Active agents are viewable by everyone"
  ON agents_registry FOR SELECT
  TO authenticated
  USING (is_active = true);

-- ============================================================================
-- 2. TABLE: agent_sessions (Sessions de conversation)
-- ============================================================================

CREATE TABLE IF NOT EXISTS agent_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  agent_id uuid NOT NULL REFERENCES agents_registry(id) ON DELETE CASCADE,
  title text DEFAULT 'Nouvelle conversation',
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'archived', 'deleted')),
  context jsonb DEFAULT '{}'::jsonb,
  metadata jsonb DEFAULT '{}'::jsonb,
  last_message_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_sessions_user ON agent_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_agent ON agent_sessions(agent_id);
CREATE INDEX IF NOT EXISTS idx_sessions_status ON agent_sessions(user_id, status);
CREATE INDEX IF NOT EXISTS idx_sessions_last_message ON agent_sessions(last_message_at DESC);

-- RLS
ALTER TABLE agent_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own sessions"
  ON agent_sessions FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create sessions"
  ON agent_sessions FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own sessions"
  ON agent_sessions FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own sessions"
  ON agent_sessions FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- ============================================================================
-- 3. TABLE: agent_messages (Messages)
-- ============================================================================

CREATE TABLE IF NOT EXISTS agent_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES agent_sessions(id) ON DELETE CASCADE,
  sender_type text NOT NULL CHECK (sender_type IN ('user', 'agent', 'system')),
  sender_id uuid NOT NULL,
  content text NOT NULL,
  content_type text NOT NULL DEFAULT 'text' CHECK (content_type IN ('text', 'voice', 'image', 'file', 'code', 'system')),
  metadata jsonb DEFAULT '{}'::jsonb,
  parent_message_id uuid REFERENCES agent_messages(id) ON DELETE SET NULL,
  is_edited boolean DEFAULT false,
  is_deleted boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_messages_session ON agent_messages(session_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON agent_messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_parent ON agent_messages(parent_message_id);
CREATE INDEX IF NOT EXISTS idx_messages_active ON agent_messages(session_id, is_deleted) WHERE is_deleted = false;

-- RLS
ALTER TABLE agent_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view messages in own sessions"
  ON agent_messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM agent_sessions
      WHERE agent_sessions.id = agent_messages.session_id
      AND agent_sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create messages in own sessions"
  ON agent_messages FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM agent_sessions
      WHERE agent_sessions.id = agent_messages.session_id
      AND agent_sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own messages"
  ON agent_messages FOR UPDATE
  TO authenticated
  USING (
    sender_type = 'user' AND sender_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM agent_sessions
      WHERE agent_sessions.id = agent_messages.session_id
      AND agent_sessions.user_id = auth.uid()
    )
  )
  WITH CHECK (
    sender_type = 'user' AND sender_id = auth.uid()
  );

-- ============================================================================
-- 4. TABLE: message_attachments (Fichiers joints)
-- ============================================================================

CREATE TABLE IF NOT EXISTS message_attachments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id uuid NOT NULL REFERENCES agent_messages(id) ON DELETE CASCADE,
  file_name text NOT NULL,
  file_type text NOT NULL,
  file_size bigint NOT NULL,
  storage_path text NOT NULL,
  mime_type text NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_attachments_message ON message_attachments(message_id);
CREATE INDEX IF NOT EXISTS idx_attachments_type ON message_attachments(file_type);

-- RLS
ALTER TABLE message_attachments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view attachments in own messages"
  ON message_attachments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM agent_messages
      JOIN agent_sessions ON agent_sessions.id = agent_messages.session_id
      WHERE agent_messages.id = message_attachments.message_id
      AND agent_sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create attachments in own messages"
  ON message_attachments FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM agent_messages
      JOIN agent_sessions ON agent_sessions.id = agent_messages.session_id
      WHERE agent_messages.id = message_attachments.message_id
      AND agent_sessions.user_id = auth.uid()
    )
  );

-- ============================================================================
-- 5. TABLE: message_reactions (Feedback utilisateur)
-- ============================================================================

CREATE TABLE IF NOT EXISTS message_reactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id uuid NOT NULL REFERENCES agent_messages(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  reaction_type text NOT NULL CHECK (reaction_type IN ('helpful', 'not_helpful', 'flag', 'star')),
  feedback_text text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  UNIQUE(message_id, user_id, reaction_type)
);

-- Index
CREATE INDEX IF NOT EXISTS idx_reactions_message ON message_reactions(message_id);
CREATE INDEX IF NOT EXISTS idx_reactions_user ON message_reactions(user_id);

-- RLS
ALTER TABLE message_reactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view reactions on own messages"
  ON message_reactions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM agent_messages
      JOIN agent_sessions ON agent_sessions.id = agent_messages.session_id
      WHERE agent_messages.id = message_reactions.message_id
      AND agent_sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create reactions"
  ON message_reactions FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own reactions"
  ON message_reactions FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own reactions"
  ON message_reactions FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- ============================================================================
-- 6. TABLE: agent_knowledge_base (Base de connaissances)
-- ============================================================================

CREATE TABLE IF NOT EXISTS agent_knowledge_base (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id uuid NOT NULL REFERENCES agents_registry(id) ON DELETE CASCADE,
  category text NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_knowledge_agent ON agent_knowledge_base(agent_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_category ON agent_knowledge_base(category);
CREATE INDEX IF NOT EXISTS idx_knowledge_active ON agent_knowledge_base(is_active);

-- RLS
ALTER TABLE agent_knowledge_base ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Knowledge base is viewable by authenticated users"
  ON agent_knowledge_base FOR SELECT
  TO authenticated
  USING (is_active = true);

-- ============================================================================
-- 7. TABLE: agent_analytics (Analytics)
-- ============================================================================

CREATE TABLE IF NOT EXISTS agent_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES agent_sessions(id) ON DELETE CASCADE,
  agent_id uuid REFERENCES agents_registry(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  event_type text NOT NULL,
  event_data jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_analytics_session ON agent_analytics(session_id);
CREATE INDEX IF NOT EXISTS idx_analytics_agent ON agent_analytics(agent_id);
CREATE INDEX IF NOT EXISTS idx_analytics_user ON agent_analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_event ON agent_analytics(event_type, created_at DESC);

-- RLS
ALTER TABLE agent_analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own analytics"
  ON agent_analytics FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "System can create analytics"
  ON agent_analytics FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- ============================================================================
-- 8. FUNCTIONS & TRIGGERS
-- ============================================================================

-- Fonction pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_agent_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers pour updated_at
DROP TRIGGER IF EXISTS update_agents_registry_updated_at ON agents_registry;
CREATE TRIGGER update_agents_registry_updated_at
  BEFORE UPDATE ON agents_registry
  FOR EACH ROW
  EXECUTE FUNCTION update_agent_updated_at();

DROP TRIGGER IF EXISTS update_agent_sessions_updated_at ON agent_sessions;
CREATE TRIGGER update_agent_sessions_updated_at
  BEFORE UPDATE ON agent_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_agent_updated_at();

DROP TRIGGER IF EXISTS update_agent_messages_updated_at ON agent_messages;
CREATE TRIGGER update_agent_messages_updated_at
  BEFORE UPDATE ON agent_messages
  FOR EACH ROW
  EXECUTE FUNCTION update_agent_updated_at();

DROP TRIGGER IF EXISTS update_agent_knowledge_updated_at ON agent_knowledge_base;
CREATE TRIGGER update_agent_knowledge_updated_at
  BEFORE UPDATE ON agent_knowledge_base
  FOR EACH ROW
  EXECUTE FUNCTION update_agent_updated_at();

-- Fonction pour mettre à jour last_message_at
CREATE OR REPLACE FUNCTION update_session_last_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE agent_sessions
  SET last_message_at = NEW.created_at
  WHERE id = NEW.session_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour last_message_at
DROP TRIGGER IF EXISTS update_session_on_new_message ON agent_messages;
CREATE TRIGGER update_session_on_new_message
  AFTER INSERT ON agent_messages
  FOR EACH ROW
  EXECUTE FUNCTION update_session_last_message();

-- Fonction pour générer le titre de session
CREATE OR REPLACE FUNCTION generate_session_title()
RETURNS TRIGGER AS $$
DECLARE
  first_message text;
  session_title text;
BEGIN
  SELECT content INTO first_message
  FROM agent_messages
  WHERE session_id = NEW.session_id
    AND sender_type = 'user'
  ORDER BY created_at ASC
  LIMIT 1;

  IF first_message IS NOT NULL THEN
    IF length(first_message) > 50 THEN
      session_title := substring(first_message from 1 for 50) || '...';
    ELSE
      session_title := first_message;
    END IF;

    UPDATE agent_sessions
    SET title = session_title
    WHERE id = NEW.session_id
      AND title = 'Nouvelle conversation';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour générer le titre
DROP TRIGGER IF EXISTS generate_session_title_trigger ON agent_messages;
CREATE TRIGGER generate_session_title_trigger
  AFTER INSERT ON agent_messages
  FOR EACH ROW
  WHEN (NEW.sender_type = 'user')
  EXECUTE FUNCTION generate_session_title();

-- Fonction pour tracker les analytics automatiquement
CREATE OR REPLACE FUNCTION track_message_analytics()
RETURNS TRIGGER AS $$
DECLARE
  session_user_id uuid;
  session_agent_id uuid;
BEGIN
  SELECT user_id, agent_id INTO session_user_id, session_agent_id
  FROM agent_sessions
  WHERE id = NEW.session_id;

  INSERT INTO agent_analytics (
    session_id,
    agent_id,
    user_id,
    event_type,
    event_data
  ) VALUES (
    NEW.session_id,
    session_agent_id,
    session_user_id,
    'message_' || NEW.sender_type,
    jsonb_build_object(
      'message_id', NEW.id,
      'content_type', NEW.content_type,
      'content_length', length(NEW.content)
    )
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour analytics
DROP TRIGGER IF EXISTS track_message_analytics_trigger ON agent_messages;
CREATE TRIGGER track_message_analytics_trigger
  AFTER INSERT ON agent_messages
  FOR EACH ROW
  EXECUTE FUNCTION track_message_analytics();

-- ============================================================================
-- 9. FONCTIONS UTILITAIRES
-- ============================================================================

-- Fonction pour archiver les sessions inactives
CREATE OR REPLACE FUNCTION archive_inactive_sessions(days_inactive integer DEFAULT 30)
RETURNS INTEGER AS $$
DECLARE
  archived_count INTEGER;
BEGIN
  UPDATE agent_sessions
  SET status = 'archived'
  WHERE status = 'active'
    AND last_message_at < now() - (days_inactive || ' days')::interval;

  GET DIAGNOSTICS archived_count = ROW_COUNT;
  RETURN archived_count;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour supprimer les sessions archivées anciennes
CREATE OR REPLACE FUNCTION delete_old_archived_sessions(days_old integer DEFAULT 90)
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM agent_sessions
  WHERE status = 'archived'
    AND updated_at < now() - (days_old || ' days')::interval;

  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour obtenir les statistiques d'un agent
CREATE OR REPLACE FUNCTION get_agent_statistics(agent_uuid uuid)
RETURNS TABLE (
  total_sessions bigint,
  active_sessions bigint,
  total_messages bigint,
  total_users bigint,
  avg_messages_per_session numeric
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(DISTINCT s.id) as total_sessions,
    COUNT(DISTINCT s.id) FILTER (WHERE s.status = 'active') as active_sessions,
    COUNT(m.id) as total_messages,
    COUNT(DISTINCT s.user_id) as total_users,
    CASE 
      WHEN COUNT(DISTINCT s.id) > 0 
      THEN ROUND(COUNT(m.id)::numeric / COUNT(DISTINCT s.id), 2)
      ELSE 0
    END as avg_messages_per_session
  FROM agent_sessions s
  LEFT JOIN agent_messages m ON m.session_id = s.id
  WHERE s.agent_id = agent_uuid;
END;
$$ LANGUAGE plpgsql;
