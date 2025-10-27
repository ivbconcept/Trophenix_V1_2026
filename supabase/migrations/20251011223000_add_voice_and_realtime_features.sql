/*
  # Architecture pour Fonctionnalités Vocales et Temps Réel (Style Comet)

  ## Vue d'ensemble
  Cette migration ajoute les tables nécessaires pour supporter DANS LE FUTUR :
  - Mode vocal complet (Shift + Alt + V style Comet)
  - Contrôle direct des pages web par voix
  - Discussion en temps réel avec contexte
  - Workspaces intelligents (vs onglets traditionnels)
  - Widgets interactifs temps réel
  - Synthèse et citations inline

  ## Nouvelles Capacités Supportées

  1. ✅ Interactions vocales complètes
  2. ✅ Contrôle DOM par commandes vocales
  3. ✅ Workspaces contextuels (vs onglets)
  4. ✅ Widgets temps réel personnalisables
  5. ✅ Transcriptions et historique vocal
  6. ✅ Citations et sources inline
  7. ✅ Contexte conversationnel enrichi
  8. ✅ Feedback temps réel sur actions

  ## Tables Créées

  ### voice_interactions - Historique des interactions vocales
  Stocke toutes les interactions vocales de l'utilisateur
  Permet analyse, amélioration, replay

  ### voice_commands - Commandes vocales exécutées
  Log des commandes vocales et actions associées
  Exemples : "Clique sur Enregistrer", "Remplis le formulaire", "Ouvre profil"

  ### dom_actions - Actions sur le DOM des pages web
  Actions prises par l'agent sur les éléments de page
  Permet audit, replay, apprentissage

  ### workspaces - Espaces de travail intelligents
  Remplace le concept d'onglets par des workspaces contextuels
  Suit l'activité, tâches actives, recommandations

  ### workspace_tabs - Onglets dans un workspace
  Association workspace -> pages web
  Métadonnées riches (temps passé, scrolling, interactions)

  ### widgets - Widgets personnalisables
  Widgets interactifs (météo, bourse, calendrier, etc.)
  Configuration par utilisateur

  ### widget_interactions - Interactions avec widgets
  Tracking des interactions utilisateur avec widgets

  ### inline_citations - Citations et sources
  Liens entre contenu généré et sources originales
  Pour transparence et vérification

  ### realtime_context - Contexte temps réel
  État actuel de la session (page, activité, focus)
  Mis à jour en temps réel pour suggestions proactives

  ## Notes Importantes

  ⚠️ STRUCTURE UNIQUEMENT - PAS D'IMPLÉMENTATION ⚠️

  Cette architecture est prête pour :
  - SDK de reconnaissance vocale (Web Speech API / Deepgram)
  - Manipulation DOM (Puppeteer-like dans le navigateur)
  - WebSockets pour temps réel
  - Widgets React/Vue personnalisables
  - Système de citations avec sources
*/

-- ============================================================================
-- 1. TABLE: voice_interactions (Interactions vocales)
-- ============================================================================

CREATE TABLE IF NOT EXISTS voice_interactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES agent_sessions(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  interaction_type text NOT NULL CHECK (interaction_type IN ('command', 'conversation', 'dictation', 'question')),
  audio_url text,
  transcription text NOT NULL,
  language text DEFAULT 'fr',
  confidence_score numeric(3,2) CHECK (confidence_score BETWEEN 0 AND 1),
  duration_seconds numeric(6,2),
  response_text text,
  response_audio_url text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_voice_session ON voice_interactions(session_id);
CREATE INDEX IF NOT EXISTS idx_voice_user ON voice_interactions(user_id);
CREATE INDEX IF NOT EXISTS idx_voice_type ON voice_interactions(interaction_type);
CREATE INDEX IF NOT EXISTS idx_voice_date ON voice_interactions(created_at DESC);

-- RLS
ALTER TABLE voice_interactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own voice interactions"
  ON voice_interactions FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create voice interactions"
  ON voice_interactions FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- ============================================================================
-- 2. TABLE: voice_commands (Commandes vocales)
-- ============================================================================

CREATE TABLE IF NOT EXISTS voice_commands (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  voice_interaction_id uuid REFERENCES voice_interactions(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  command_type text NOT NULL,
  command_text text NOT NULL,
  target_element text,
  action_performed text NOT NULL,
  success boolean DEFAULT false,
  execution_time_ms integer,
  error_message text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_commands_interaction ON voice_commands(voice_interaction_id);
CREATE INDEX IF NOT EXISTS idx_commands_user ON voice_commands(user_id);
CREATE INDEX IF NOT EXISTS idx_commands_type ON voice_commands(command_type);

-- RLS
ALTER TABLE voice_commands ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own voice commands"
  ON voice_commands FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- ============================================================================
-- 3. TABLE: dom_actions (Actions DOM sur pages web)
-- ============================================================================

CREATE TABLE IF NOT EXISTS dom_actions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id uuid REFERENCES agent_workflows(id) ON DELETE CASCADE,
  voice_command_id uuid REFERENCES voice_commands(id) ON DELETE SET NULL,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  page_url text NOT NULL,
  action_type text NOT NULL CHECK (action_type IN ('click', 'fill', 'scroll', 'navigate', 'submit', 'select', 'hover')),
  target_selector text NOT NULL,
  target_element_type text,
  action_value text,
  success boolean DEFAULT false,
  execution_time_ms integer,
  screenshot_before_url text,
  screenshot_after_url text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_dom_workflow ON dom_actions(workflow_id);
CREATE INDEX IF NOT EXISTS idx_dom_voice ON dom_actions(voice_command_id);
CREATE INDEX IF NOT EXISTS idx_dom_user ON dom_actions(user_id);
CREATE INDEX IF NOT EXISTS idx_dom_type ON dom_actions(action_type);
CREATE INDEX IF NOT EXISTS idx_dom_url ON dom_actions(page_url);

-- RLS
ALTER TABLE dom_actions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own DOM actions"
  ON dom_actions FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- ============================================================================
-- 4. TABLE: workspaces (Espaces de travail intelligents)
-- ============================================================================

CREATE TABLE IF NOT EXISTS workspaces (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  workspace_type text DEFAULT 'general' CHECK (workspace_type IN ('general', 'work', 'research', 'shopping', 'entertainment')),
  icon text DEFAULT '📁',
  color text DEFAULT '#3B82F6',
  is_active boolean DEFAULT false,
  activity_summary jsonb DEFAULT '{}'::jsonb,
  context jsonb DEFAULT '{}'::jsonb,
  last_accessed_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_workspaces_user ON workspaces(user_id);
CREATE INDEX IF NOT EXISTS idx_workspaces_active ON workspaces(user_id, is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_workspaces_type ON workspaces(workspace_type);

-- RLS
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own workspaces"
  ON workspaces FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create workspaces"
  ON workspaces FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own workspaces"
  ON workspaces FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own workspaces"
  ON workspaces FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- ============================================================================
-- 5. TABLE: workspace_tabs (Onglets dans workspace)
-- ============================================================================

CREATE TABLE IF NOT EXISTS workspace_tabs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  url text NOT NULL,
  title text,
  favicon_url text,
  tab_order integer DEFAULT 0,
  is_pinned boolean DEFAULT false,
  time_spent_seconds integer DEFAULT 0,
  scroll_percentage integer DEFAULT 0 CHECK (scroll_percentage BETWEEN 0 AND 100),
  interactions_count integer DEFAULT 0,
  last_interaction_at timestamptz,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_tabs_workspace ON workspace_tabs(workspace_id, tab_order);
CREATE INDEX IF NOT EXISTS idx_tabs_url ON workspace_tabs(url);
CREATE INDEX IF NOT EXISTS idx_tabs_pinned ON workspace_tabs(workspace_id, is_pinned) WHERE is_pinned = true;

-- RLS
ALTER TABLE workspace_tabs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view tabs in own workspaces"
  ON workspace_tabs FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workspaces
      WHERE workspaces.id = workspace_tabs.workspace_id
      AND workspaces.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage tabs in own workspaces"
  ON workspace_tabs FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workspaces
      WHERE workspaces.id = workspace_tabs.workspace_id
      AND workspaces.user_id = auth.uid()
    )
  );

-- ============================================================================
-- 6. TABLE: widgets (Widgets personnalisables)
-- ============================================================================

CREATE TABLE IF NOT EXISTS widgets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  widget_type text NOT NULL,
  title text NOT NULL,
  config jsonb DEFAULT '{}'::jsonb,
  position jsonb DEFAULT '{"x": 0, "y": 0, "width": 2, "height": 2}'::jsonb,
  is_visible boolean DEFAULT true,
  refresh_interval_seconds integer DEFAULT 300,
  last_refreshed_at timestamptz,
  data_cache jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_widgets_user ON widgets(user_id);
CREATE INDEX IF NOT EXISTS idx_widgets_type ON widgets(widget_type);
CREATE INDEX IF NOT EXISTS idx_widgets_visible ON widgets(user_id, is_visible) WHERE is_visible = true;

-- RLS
ALTER TABLE widgets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own widgets"
  ON widgets FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can manage own widgets"
  ON widgets FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- ============================================================================
-- 7. TABLE: widget_interactions (Interactions avec widgets)
-- ============================================================================

CREATE TABLE IF NOT EXISTS widget_interactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  widget_id uuid NOT NULL REFERENCES widgets(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  interaction_type text NOT NULL,
  interaction_data jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_widget_interactions_widget ON widget_interactions(widget_id);
CREATE INDEX IF NOT EXISTS idx_widget_interactions_user ON widget_interactions(user_id);

-- RLS
ALTER TABLE widget_interactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own widget interactions"
  ON widget_interactions FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- ============================================================================
-- 8. TABLE: inline_citations (Citations et sources)
-- ============================================================================

CREATE TABLE IF NOT EXISTS inline_citations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id uuid REFERENCES agent_messages(id) ON DELETE CASCADE,
  briefing_id uuid REFERENCES agent_briefings(id) ON DELETE CASCADE,
  source_url text NOT NULL,
  source_title text,
  citation_text text NOT NULL,
  position_in_content integer,
  relevance_score numeric(3,2) CHECK (relevance_score BETWEEN 0 AND 1),
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_citations_message ON inline_citations(message_id);
CREATE INDEX IF NOT EXISTS idx_citations_briefing ON inline_citations(briefing_id);
CREATE INDEX IF NOT EXISTS idx_citations_url ON inline_citations(source_url);

-- RLS
ALTER TABLE inline_citations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view citations in own content"
  ON inline_citations FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM agent_messages m
      JOIN agent_sessions s ON s.id = m.session_id
      WHERE m.id = inline_citations.message_id
      AND s.user_id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM agent_briefings b
      WHERE b.id = inline_citations.briefing_id
      AND b.user_id = auth.uid()
    )
  );

-- ============================================================================
-- 9. TABLE: realtime_context (Contexte temps réel)
-- ============================================================================

CREATE TABLE IF NOT EXISTS realtime_context (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  session_id uuid REFERENCES agent_sessions(id) ON DELETE SET NULL,
  workspace_id uuid REFERENCES workspaces(id) ON DELETE SET NULL,
  current_page_url text,
  current_page_title text,
  current_activity text,
  focus_time_seconds integer DEFAULT 0,
  recent_interactions jsonb DEFAULT '[]'::jsonb,
  context_data jsonb DEFAULT '{}'::jsonb,
  last_updated_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Index
CREATE INDEX IF NOT EXISTS idx_realtime_user ON realtime_context(user_id);
CREATE INDEX IF NOT EXISTS idx_realtime_session ON realtime_context(session_id);
CREATE INDEX IF NOT EXISTS idx_realtime_workspace ON realtime_context(workspace_id);

-- RLS
ALTER TABLE realtime_context ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own realtime context"
  ON realtime_context FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can upsert own realtime context"
  ON realtime_context FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- ============================================================================
-- 10. FUNCTIONS & TRIGGERS
-- ============================================================================

-- Trigger pour updated_at sur workspaces
DROP TRIGGER IF EXISTS update_workspaces_updated_at ON workspaces;
CREATE TRIGGER update_workspaces_updated_at
  BEFORE UPDATE ON workspaces
  FOR EACH ROW
  EXECUTE FUNCTION update_agent_updated_at();

-- Trigger pour updated_at sur workspace_tabs
DROP TRIGGER IF EXISTS update_tabs_updated_at ON workspace_tabs;
CREATE TRIGGER update_tabs_updated_at
  BEFORE UPDATE ON workspace_tabs
  FOR EACH ROW
  EXECUTE FUNCTION update_agent_updated_at();

-- Trigger pour updated_at sur widgets
DROP TRIGGER IF EXISTS update_widgets_updated_at ON widgets;
CREATE TRIGGER update_widgets_updated_at
  BEFORE UPDATE ON widgets
  FOR EACH ROW
  EXECUTE FUNCTION update_agent_updated_at();

-- Fonction pour mettre à jour last_accessed_at du workspace
CREATE OR REPLACE FUNCTION update_workspace_last_accessed()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE workspaces
  SET last_accessed_at = now()
  WHERE id = NEW.workspace_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour last_accessed_at
DROP TRIGGER IF EXISTS update_workspace_access_on_tab_interaction ON workspace_tabs;
CREATE TRIGGER update_workspace_access_on_tab_interaction
  AFTER UPDATE ON workspace_tabs
  FOR EACH ROW
  WHEN (OLD.last_interaction_at IS DISTINCT FROM NEW.last_interaction_at)
  EXECUTE FUNCTION update_workspace_last_accessed();

-- Fonction pour désactiver les autres workspaces quand un devient actif
CREATE OR REPLACE FUNCTION ensure_single_active_workspace()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_active = true THEN
    UPDATE workspaces
    SET is_active = false
    WHERE user_id = NEW.user_id
      AND id != NEW.id
      AND is_active = true;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour workspace actif unique
DROP TRIGGER IF EXISTS ensure_one_active_workspace ON workspaces;
CREATE TRIGGER ensure_one_active_workspace
  BEFORE UPDATE ON workspaces
  FOR EACH ROW
  WHEN (NEW.is_active = true AND OLD.is_active = false)
  EXECUTE FUNCTION ensure_single_active_workspace();

-- ============================================================================
-- 11. VUES UTILES
-- ============================================================================

-- Vue des workspaces avec statistiques
CREATE OR REPLACE VIEW workspaces_with_stats AS
SELECT
  w.id,
  w.user_id,
  w.title,
  w.workspace_type,
  w.is_active,
  COUNT(t.id) as total_tabs,
  COUNT(t.id) FILTER (WHERE t.is_pinned = true) as pinned_tabs,
  SUM(t.time_spent_seconds) as total_time_spent,
  w.last_accessed_at,
  w.created_at
FROM workspaces w
LEFT JOIN workspace_tabs t ON t.workspace_id = w.id
GROUP BY w.id;

-- Vue des widgets visibles par utilisateur
CREATE OR REPLACE VIEW active_widgets AS
SELECT
  w.*,
  COUNT(wi.id) as total_interactions
FROM widgets w
LEFT JOIN widget_interactions wi ON wi.widget_id = w.id
WHERE w.is_visible = true
GROUP BY w.id;

/*
  DOCUMENTATION POUR DÉVELOPPEMENTS FUTURS

  ## Fonctionnalités Vocales

  ### Implémentation Recommandée
  1. Frontend : Web Speech API pour reconnaissance vocale
  2. Backend : Deepgram / AssemblyAI pour transcription avancée
  3. Stockage audio : Supabase Storage bucket `agent_voice_messages`
  4. Streaming : WebSockets pour feedback temps réel

  ### Commandes Vocales Type Comet
  - "Clique sur Enregistrer"
  - "Remplis le formulaire avec mes infos"
  - "Ouvre mon profil"
  - "Résume cet article"
  - "Trouve des créneaux libres"

  ## Contrôle DOM

  ### Technologies
  - Manipulation DOM : JavaScript natif ou Puppeteer
  - Sélection intelligente : AI pour identifier éléments
  - Screenshots : html2canvas ou Puppeteer
  - Feedback visuel : Highlight d'éléments

  ### Actions Supportées
  - click, fill, scroll, navigate, submit, select, hover
  - Chaque action loggée dans `dom_actions`
  - Screenshots avant/après pour audit

  ## Workspaces Intelligents

  ### Concept
  Remplace onglets traditionnels par workspaces contextuels :
  - Workspace "Recrutement" : Profils + offres + candidatures
  - Workspace "Formation" : Cours + certifications + calendrier
  - Auto-suggestion de contenu pertinent

  ### Tracking
  - Temps passé par onglet
  - Pourcentage de scroll
  - Nombre d'interactions
  - Recommandations basées sur activité

  ## Widgets Temps Réel

  ### Types de Widgets
  - Météo (OpenWeatherMap API)
  - Bourse (Alpha Vantage API)
  - Calendrier (intégration Google Calendar)
  - Notifications
  - Statistiques personnelles
  - Actualités sport

  ### Configuration
  ```json
  {
    "widget_type": "weather",
    "config": {
      "location": "Paris",
      "units": "metric",
      "refresh": 600
    },
    "position": {"x": 0, "y": 0, "width": 2, "height": 2}
  }
  ```

  ## Citations Inline

  ### Format
  Chaque réponse IA avec sources :
  "Le BPJEPS est requis pour coach sportif [1]"

  [1] https://source.com/article - "Article Title"

  ### Stockage
  - Citation liée au message ou briefing
  - URL source + titre + texte extrait
  - Position dans le contenu
  - Score de pertinence

  ## Contexte Temps Réel

  ### Mise à jour
  - WebSocket connection pour updates temps réel
  - Heartbeat toutes les 10 secondes
  - Context inclut :
    - Page actuelle
    - Activité en cours
    - Temps de focus
    - Dernières interactions

  ### Utilisation
  - Suggestions proactives
  - Briefings contextuels
  - Auto-complétion intelligente
  - Handoff entre agents
*/
