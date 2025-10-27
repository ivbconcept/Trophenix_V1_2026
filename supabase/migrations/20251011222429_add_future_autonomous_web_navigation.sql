/*
  # Architecture Future pour Navigation Web Autonome (Style Comet)

  ## Vue d'ensemble
  Cette migration prépare l'architecture pour accueillir DANS LE FUTUR un système de navigation
  web autonome avec agents capables d'effectuer des workflows complexes, analyser du contenu,
  prendre des actions, et maintenir un contexte multi-modal.

  ## Vision Future (à implémenter progressivement)

  L'architecture supportera :
  1. ✅ Agents autonomes naviguant sur le web
  2. ✅ Workflows multi-étapes avec checkpoints
  3. ✅ Actions asynchrones (emails, achats, réservations)
  4. ✅ Contexte de navigation enrichi
  5. ✅ Analyse de contenu multi-sources
  6. ✅ Trafic multi-modal (humain, indexé, agents)
  7. ✅ Briefings personnalisés
  8. ✅ Recherches approfondies avec synthèse

  ## Tables pour le Futur

  ### agent_workflows - Workflows autonomes multi-étapes
  Permet aux agents d'exécuter des séquences d'actions complexes
  Exemples :
  - "Trouver et comparer 5 offres d'emploi similaires"
  - "Analyser les profils de 10 athlètes et créer un rapport"
  - "Préparer mon briefing quotidien avec actualités sport"

  ### workflow_steps - Étapes individuelles d'un workflow
  Chaque étape = une action atomique (recherche web, lecture page, analyse, etc.)
  Permet de suivre la progression, mettre en pause, reprendre

  ### agent_actions - Actions prises par les agents
  Log de toutes les actions autonomes pour audit et apprentissage
  Exemples : email envoyé, lien parcouru, document téléchargé, etc.

  ### web_navigation_sessions - Sessions de navigation web
  Contexte complet d'une session de navigation autonome
  Historique des pages visitées, contenu analysé, décisions prises

  ### content_cache - Cache de contenu web analysé
  Évite de re-télécharger/analyser le même contenu
  Stocke les embeddings pour recherche sémantique future

  ### agent_briefings - Briefings personnalisés générés
  Rapports quotidiens/hebdomadaires générés automatiquement
  Basés sur calendrier, préférences, actualités, etc.

  ## Architecture de Queue Asynchrone

  Pour gérer les tâches longues (recherches approfondies, analyses multi-sources) :
  - Queue de tâches avec priorités
  - Workers asynchrones
  - Gestion des timeouts et retries
  - Notifications de progression

  ## Sécurité et Contrôle

  - Approbation utilisateur pour actions sensibles
  - Budget/limites par utilisateur
  - Audit trail complet
  - Possibilité d'annuler workflows en cours

  ## Notes Importantes

  ⚠️ CETTE MIGRATION CRÉE LA STRUCTURE SEULEMENT ⚠️
  L'implémentation réelle des fonctionnalités viendra progressivement.
  
  L'objectif est d'avoir une architecture PRÊTE pour :
  - Navigation web autonome
  - Workflows complexes
  - Actions asynchrones
  - Analyse de contenu
  - Génération de briefings
*/

-- ============================================================================
-- 1. TABLE: agent_workflows (Workflows autonomes)
-- ============================================================================

CREATE TABLE IF NOT EXISTS agent_workflows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES agent_sessions(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  workflow_type text NOT NULL,
  title text NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'paused', 'completed', 'failed', 'cancelled')),
  priority integer DEFAULT 5 CHECK (priority BETWEEN 1 AND 10),
  input_data jsonb DEFAULT '{}'::jsonb,
  output_data jsonb DEFAULT '{}'::jsonb,
  config jsonb DEFAULT '{}'::jsonb,
  progress_percentage integer DEFAULT 0 CHECK (progress_percentage BETWEEN 0 AND 100),
  started_at timestamptz,
  completed_at timestamptz,
  error_message text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_workflows_session ON agent_workflows(session_id);
CREATE INDEX IF NOT EXISTS idx_workflows_user ON agent_workflows(user_id);
CREATE INDEX IF NOT EXISTS idx_workflows_status ON agent_workflows(status, priority DESC);
CREATE INDEX IF NOT EXISTS idx_workflows_type ON agent_workflows(workflow_type);

-- RLS
ALTER TABLE agent_workflows ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own workflows"
  ON agent_workflows FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create workflows"
  ON agent_workflows FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own workflows"
  ON agent_workflows FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- ============================================================================
-- 2. TABLE: workflow_steps (Étapes de workflow)
-- ============================================================================

CREATE TABLE IF NOT EXISTS workflow_steps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id uuid NOT NULL REFERENCES agent_workflows(id) ON DELETE CASCADE,
  step_number integer NOT NULL,
  step_type text NOT NULL,
  title text NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed', 'skipped')),
  input_data jsonb DEFAULT '{}'::jsonb,
  output_data jsonb DEFAULT '{}'::jsonb,
  metadata jsonb DEFAULT '{}'::jsonb,
  started_at timestamptz,
  completed_at timestamptz,
  error_message text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(workflow_id, step_number)
);

-- Index
CREATE INDEX IF NOT EXISTS idx_steps_workflow ON workflow_steps(workflow_id, step_number);
CREATE INDEX IF NOT EXISTS idx_steps_status ON workflow_steps(workflow_id, status);

-- RLS
ALTER TABLE workflow_steps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view steps of own workflows"
  ON workflow_steps FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM agent_workflows
      WHERE agent_workflows.id = workflow_steps.workflow_id
      AND agent_workflows.user_id = auth.uid()
    )
  );

-- ============================================================================
-- 3. TABLE: agent_actions (Actions autonomes)
-- ============================================================================

CREATE TABLE IF NOT EXISTS agent_actions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id uuid REFERENCES agent_workflows(id) ON DELETE CASCADE,
  session_id uuid REFERENCES agent_sessions(id) ON DELETE CASCADE,
  agent_id uuid REFERENCES agents_registry(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  action_type text NOT NULL,
  action_category text NOT NULL CHECK (action_category IN ('navigation', 'communication', 'data', 'analysis', 'system')),
  description text NOT NULL,
  input_data jsonb DEFAULT '{}'::jsonb,
  output_data jsonb DEFAULT '{}'::jsonb,
  requires_approval boolean DEFAULT false,
  approved_at timestamptz,
  executed_at timestamptz,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'executed', 'failed', 'cancelled')),
  error_message text,
  created_at timestamptz DEFAULT now()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_actions_workflow ON agent_actions(workflow_id);
CREATE INDEX IF NOT EXISTS idx_actions_user ON agent_actions(user_id);
CREATE INDEX IF NOT EXISTS idx_actions_status ON agent_actions(status);
CREATE INDEX IF NOT EXISTS idx_actions_type ON agent_actions(action_type);
CREATE INDEX IF NOT EXISTS idx_actions_approval ON agent_actions(requires_approval, status) WHERE requires_approval = true;

-- RLS
ALTER TABLE agent_actions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own actions"
  ON agent_actions FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own actions"
  ON agent_actions FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- ============================================================================
-- 4. TABLE: web_navigation_sessions (Sessions de navigation web)
-- ============================================================================

CREATE TABLE IF NOT EXISTS web_navigation_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id uuid REFERENCES agent_workflows(id) ON DELETE CASCADE,
  session_id uuid REFERENCES agent_sessions(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  purpose text NOT NULL,
  pages_visited integer DEFAULT 0,
  content_analyzed integer DEFAULT 0,
  navigation_tree jsonb DEFAULT '[]'::jsonb,
  insights jsonb DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'failed')),
  started_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_nav_sessions_workflow ON web_navigation_sessions(workflow_id);
CREATE INDEX IF NOT EXISTS idx_nav_sessions_user ON web_navigation_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_nav_sessions_status ON web_navigation_sessions(status);

-- RLS
ALTER TABLE web_navigation_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own navigation sessions"
  ON web_navigation_sessions FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- ============================================================================
-- 5. TABLE: content_cache (Cache de contenu web)
-- ============================================================================

CREATE TABLE IF NOT EXISTS content_cache (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  url text NOT NULL,
  url_hash text GENERATED ALWAYS AS (md5(url)) STORED,
  title text,
  content text,
  content_type text,
  metadata jsonb DEFAULT '{}'::jsonb,
  summary text,
  keywords text[],
  fetched_at timestamptz DEFAULT now(),
  expires_at timestamptz,
  created_at timestamptz DEFAULT now(),
  UNIQUE(url_hash)
);

-- Index
CREATE INDEX IF NOT EXISTS idx_content_url_hash ON content_cache(url_hash);
CREATE INDEX IF NOT EXISTS idx_content_keywords ON content_cache USING gin(keywords);
CREATE INDEX IF NOT EXISTS idx_content_expires ON content_cache(expires_at) WHERE expires_at IS NOT NULL;

-- RLS (public read pour cache partagé)
ALTER TABLE content_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view cached content"
  ON content_cache FOR SELECT
  TO authenticated
  USING (true);

-- ============================================================================
-- 6. TABLE: agent_briefings (Briefings personnalisés)
-- ============================================================================

CREATE TABLE IF NOT EXISTS agent_briefings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  agent_id uuid REFERENCES agents_registry(id) ON DELETE SET NULL,
  briefing_type text NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  content_format text DEFAULT 'markdown' CHECK (content_format IN ('markdown', 'html', 'plain')),
  sources jsonb DEFAULT '[]'::jsonb,
  metadata jsonb DEFAULT '{}'::jsonb,
  priority integer DEFAULT 5 CHECK (priority BETWEEN 1 AND 10),
  is_read boolean DEFAULT false,
  read_at timestamptz,
  scheduled_for timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_briefings_user ON agent_briefings(user_id);
CREATE INDEX IF NOT EXISTS idx_briefings_type ON agent_briefings(briefing_type);
CREATE INDEX IF NOT EXISTS idx_briefings_unread ON agent_briefings(user_id, is_read) WHERE is_read = false;
CREATE INDEX IF NOT EXISTS idx_briefings_scheduled ON agent_briefings(scheduled_for) WHERE scheduled_for IS NOT NULL;

-- RLS
ALTER TABLE agent_briefings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own briefings"
  ON agent_briefings FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own briefings"
  ON agent_briefings FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- ============================================================================
-- 7. TABLE: user_preferences_ai (Préférences IA utilisateur)
-- ============================================================================

CREATE TABLE IF NOT EXISTS user_preferences_ai (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  autonomous_actions_enabled boolean DEFAULT false,
  auto_approve_actions text[] DEFAULT ARRAY[]::text[],
  require_approval_actions text[] DEFAULT ARRAY['email', 'purchase', 'booking']::text[],
  daily_briefing_enabled boolean DEFAULT false,
  daily_briefing_time time DEFAULT '08:00:00',
  weekly_briefing_enabled boolean DEFAULT false,
  topics_of_interest text[] DEFAULT ARRAY[]::text[],
  budget_limits jsonb DEFAULT '{
    "max_searches_per_day": 50,
    "max_actions_per_day": 20,
    "max_workflow_duration_minutes": 30
  }'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Index
CREATE INDEX IF NOT EXISTS idx_preferences_user ON user_preferences_ai(user_id);

-- RLS
ALTER TABLE user_preferences_ai ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own AI preferences"
  ON user_preferences_ai FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own AI preferences"
  ON user_preferences_ai FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own AI preferences"
  ON user_preferences_ai FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- ============================================================================
-- 8. FUNCTIONS & TRIGGERS
-- ============================================================================

-- Trigger pour updated_at sur workflows
DROP TRIGGER IF EXISTS update_workflows_updated_at ON agent_workflows;
CREATE TRIGGER update_workflows_updated_at
  BEFORE UPDATE ON agent_workflows
  FOR EACH ROW
  EXECUTE FUNCTION update_agent_updated_at();

-- Trigger pour updated_at sur workflow_steps
DROP TRIGGER IF EXISTS update_steps_updated_at ON workflow_steps;
CREATE TRIGGER update_steps_updated_at
  BEFORE UPDATE ON workflow_steps
  FOR EACH ROW
  EXECUTE FUNCTION update_agent_updated_at();

-- Trigger pour updated_at sur preferences
DROP TRIGGER IF EXISTS update_preferences_updated_at ON user_preferences_ai;
CREATE TRIGGER update_preferences_updated_at
  BEFORE UPDATE ON user_preferences_ai
  FOR EACH ROW
  EXECUTE FUNCTION update_agent_updated_at();

-- Fonction pour mettre à jour le progrès du workflow
CREATE OR REPLACE FUNCTION update_workflow_progress()
RETURNS TRIGGER AS $$
DECLARE
  total_steps integer;
  completed_steps integer;
  new_progress integer;
BEGIN
  SELECT COUNT(*) INTO total_steps
  FROM workflow_steps
  WHERE workflow_id = NEW.workflow_id;

  SELECT COUNT(*) INTO completed_steps
  FROM workflow_steps
  WHERE workflow_id = NEW.workflow_id
    AND status = 'completed';

  IF total_steps > 0 THEN
    new_progress := (completed_steps * 100) / total_steps;
    
    UPDATE agent_workflows
    SET progress_percentage = new_progress,
        status = CASE
          WHEN completed_steps = total_steps THEN 'completed'
          WHEN completed_steps > 0 THEN 'running'
          ELSE status
        END
    WHERE id = NEW.workflow_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour mettre à jour le progrès
DROP TRIGGER IF EXISTS update_workflow_progress_trigger ON workflow_steps;
CREATE TRIGGER update_workflow_progress_trigger
  AFTER UPDATE ON workflow_steps
  FOR EACH ROW
  WHEN (OLD.status IS DISTINCT FROM NEW.status)
  EXECUTE FUNCTION update_workflow_progress();

-- Fonction pour nettoyer le cache expiré
CREATE OR REPLACE FUNCTION clean_expired_cache()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM content_cache
  WHERE expires_at IS NOT NULL
    AND expires_at < now();

  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour obtenir les workflows en attente
CREATE OR REPLACE FUNCTION get_pending_workflows(limit_count integer DEFAULT 10)
RETURNS TABLE (
  workflow_id uuid,
  user_id uuid,
  workflow_type text,
  priority integer,
  created_at timestamptz
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    id as workflow_id,
    agent_workflows.user_id,
    agent_workflows.workflow_type,
    agent_workflows.priority,
    agent_workflows.created_at
  FROM agent_workflows
  WHERE status = 'pending'
  ORDER BY priority DESC, created_at ASC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 9. VUES UTILES
-- ============================================================================

-- Vue des workflows actifs avec détails
CREATE OR REPLACE VIEW active_workflows_summary AS
SELECT
  w.id,
  w.user_id,
  w.session_id,
  w.workflow_type,
  w.title,
  w.status,
  w.priority,
  w.progress_percentage,
  COUNT(ws.id) as total_steps,
  COUNT(ws.id) FILTER (WHERE ws.status = 'completed') as completed_steps,
  COUNT(ws.id) FILTER (WHERE ws.status = 'failed') as failed_steps,
  w.started_at,
  w.created_at
FROM agent_workflows w
LEFT JOIN workflow_steps ws ON ws.workflow_id = w.id
WHERE w.status IN ('pending', 'running', 'paused')
GROUP BY w.id;

-- Vue des actions nécessitant approbation
CREATE OR REPLACE VIEW pending_approvals AS
SELECT
  a.id,
  a.user_id,
  a.workflow_id,
  a.action_type,
  a.description,
  a.input_data,
  a.created_at,
  w.title as workflow_title
FROM agent_actions a
LEFT JOIN agent_workflows w ON w.id = a.workflow_id
WHERE a.requires_approval = true
  AND a.status = 'pending'
ORDER BY a.created_at ASC;

/*
  DOCUMENTATION POUR DÉVELOPPEMENTS FUTURS

  ## Comment implémenter un nouveau type de workflow

  1. Créer un entry dans agent_workflows avec workflow_type = 'mon_type'
  2. Créer les workflow_steps correspondants
  3. Implémenter un worker qui traite ce type de workflow
  4. Logger toutes les actions via agent_actions
  5. Mettre à jour le progrès automatiquement

  ## Comment ajouter une capacité de navigation web

  1. Créer une web_navigation_session
  2. Pour chaque page visitée, ajouter dans navigation_tree
  3. Mettre en cache le contenu dans content_cache
  4. Extraire insights et les stocker dans insights
  5. Logger les actions de navigation

  ## Comment générer un briefing automatique

  1. Vérifier user_preferences_ai pour les préférences
  2. Analyser le calendrier et activités récentes
  3. Récupérer contenu pertinent du cache
  4. Générer le briefing avec l'IA
  5. Insérer dans agent_briefings
  6. Notifier l'utilisateur

  ## Limites et Budgets

  Les budgets sont définis dans user_preferences_ai :
  - max_searches_per_day : nombre de recherches web
  - max_actions_per_day : nombre d'actions autonomes
  - max_workflow_duration_minutes : durée max d'un workflow

  ## Sécurité

  Toutes les actions sensibles DOIVENT avoir requires_approval = true
  L'utilisateur peut configurer auto_approve_actions pour certains types

  ## Performance

  - content_cache évite de refetch le même contenu
  - Index optimisés pour queries fréquentes
  - Expiration automatique du cache
*/
