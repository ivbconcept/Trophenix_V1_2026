/*
  # Système de Feature Flags et Gestion de Versions

  ## Vue d'ensemble
  Ce système permet de gérer la visibilité et l'activation des fonctionnalités par version.
  Il permet de :
  - Activer/désactiver des features sans redéploiement
  - Gérer les versions (V1.0, V2.0, V3.0, etc.)
  - Beta testing (activer pour certains utilisateurs seulement)
  - Rollout progressif (activer pour X% des utilisateurs)
  - Analytics sur l'utilisation des features
  - Planification de releases (activation automatique à une date)

  ## Tables Principales

  ### 1. feature_categories - Catégories de fonctionnalités
  Organiseur les features par famille (Auth, Jobs, Profiles, AI, etc.)

  ### 2. feature_flags - Définition des fonctionnalités
  Chaque fonctionnalité de la plateforme avec sa version cible et son statut

  ### 3. feature_versions - Versions de la plateforme
  Définit les versions (1.0, 2.0, 3.0) et leur date de release

  ### 4. user_feature_access - Beta testing
  Permet d'activer une feature pour des utilisateurs spécifiques avant la release publique

  ### 5. feature_usage_analytics - Analytics
  Track l'utilisation des features pour analytics

  ## Exemples

  ### Désactiver Elea jusqu'à V2.0
  ```sql
  UPDATE feature_flags
  SET is_enabled = false, target_version = '2.0.0'
  WHERE feature_key = 'elea_ai';
  ```

  ### Activer pour beta testers
  ```sql
  INSERT INTO user_feature_access (feature_id, user_id, access_type)
  VALUES ('elea-feature-id', 'admin-user-id', 'beta');
  ```

  ### Vérifier si feature active pour un user
  ```sql
  SELECT is_feature_enabled_for_user('elea_ai', 'user-id');
  ```

  ## Sécurité
  - RLS activé sur toutes les tables
  - Seuls les super_admin peuvent modifier les feature_flags
  - Les users peuvent voir les features activées pour eux
  - Analytics accessible uniquement aux admins
*/

-- ============================================================================
-- 1. TABLE: feature_categories (Catégories de fonctionnalités)
-- ============================================================================

CREATE TABLE IF NOT EXISTS feature_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_key text UNIQUE NOT NULL,
  display_name text NOT NULL,
  description text DEFAULT '',
  icon text DEFAULT '',
  display_order int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_feature_categories_order ON feature_categories(display_order);

-- RLS
ALTER TABLE feature_categories ENABLE ROW LEVEL SECURITY;

-- Lecture publique pour authenticated users
CREATE POLICY "Categories are viewable by authenticated users"
  ON feature_categories FOR SELECT
  TO authenticated
  USING (true);

-- Insertion des catégories par défaut
INSERT INTO feature_categories (category_key, display_name, description, icon, display_order) VALUES
('core', 'Fonctionnalités Core', 'Fonctionnalités essentielles de la plateforme', '🎯', 1),
('auth', 'Authentification', 'Inscription, connexion, gestion des comptes', '🔐', 2),
('profiles', 'Profils', 'Profils athlètes et entreprises', '👤', 3),
('jobs', 'Offres d''Emploi', 'Publication et gestion des offres', '💼', 4),
('applications', 'Candidatures', 'Gestion des candidatures', '📨', 5),
('messages', 'Messagerie', 'Messagerie directe et contextuelle', '💬', 6),
('directory', 'Annuaires', 'Annuaires athlètes et entreprises', '📋', 7),
('admin', 'Administration', 'Outils d''administration', '⚙️', 8),
('ai', 'Intelligence Artificielle', 'Agent Elea et fonctionnalités IA', '🤖', 9),
('team', 'Gestion d''Équipe', 'Organisations et délégations', '👥', 10),
('tasks', 'Tâches Partagées', 'Tâches collaboratives', '✅', 11),
('analytics', 'Analytics', 'Statistiques et analytics', '📊', 12)
ON CONFLICT (category_key) DO NOTHING;

-- ============================================================================
-- 2. TABLE: feature_versions (Versions de la plateforme)
-- ============================================================================

CREATE TABLE IF NOT EXISTS feature_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  version_number text UNIQUE NOT NULL,
  display_name text NOT NULL,
  description text DEFAULT '',
  is_current boolean DEFAULT false,
  release_date timestamptz,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_feature_versions_current ON feature_versions(is_current);
CREATE INDEX IF NOT EXISTS idx_feature_versions_release ON feature_versions(release_date);

-- RLS
ALTER TABLE feature_versions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Versions are viewable by authenticated users"
  ON feature_versions FOR SELECT
  TO authenticated
  USING (true);

-- Insertion des versions par défaut
INSERT INTO feature_versions (version_number, display_name, description, is_current, release_date) VALUES
('1.0.0', 'Version 1.0 - MVP', 'Version initiale avec fonctionnalités essentielles', true, now()),
('2.0.0', 'Version 2.0 - Intelligence', 'Ajout d''Elea IA et gestion d''équipe avancée', false, now() + interval '3 months'),
('3.0.0', 'Version 3.0 - Collaboration', 'Tâches partagées et workflows avancés', false, now() + interval '6 months')
ON CONFLICT (version_number) DO NOTHING;

-- ============================================================================
-- 3. TABLE: feature_flags (Fonctionnalités)
-- ============================================================================

CREATE TABLE IF NOT EXISTS feature_flags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES feature_categories(id) ON DELETE SET NULL,
  feature_key text UNIQUE NOT NULL,
  display_name text NOT NULL,
  description text DEFAULT '',
  target_version text NOT NULL,
  is_enabled boolean DEFAULT false,
  is_beta boolean DEFAULT false,
  rollout_percentage int DEFAULT 0 CHECK (rollout_percentage >= 0 AND rollout_percentage <= 100),
  enable_date timestamptz,
  component_path text,
  route_path text,
  dependencies text[] DEFAULT ARRAY[]::text[],
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_feature_flags_category ON feature_flags(category_id);
CREATE INDEX IF NOT EXISTS idx_feature_flags_enabled ON feature_flags(is_enabled);
CREATE INDEX IF NOT EXISTS idx_feature_flags_version ON feature_flags(target_version);
CREATE INDEX IF NOT EXISTS idx_feature_flags_beta ON feature_flags(is_beta);

-- RLS
ALTER TABLE feature_flags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Features are viewable by authenticated users"
  ON feature_flags FOR SELECT
  TO authenticated
  USING (true);

-- Seuls les super_admin peuvent modifier
CREATE POLICY "Only super_admin can modify features"
  ON feature_flags FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_contexts
      WHERE user_contexts.user_id = auth.uid()
      AND user_contexts.context_type = 'platform_admin'
      AND user_contexts.role = 'super_admin'
      AND user_contexts.status = 'active'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_contexts
      WHERE user_contexts.user_id = auth.uid()
      AND user_contexts.context_type = 'platform_admin'
      AND user_contexts.role = 'super_admin'
      AND user_contexts.status = 'active'
    )
  );

-- ============================================================================
-- 4. Insertion des feature flags pour TOUTES les fonctionnalités existantes
-- ============================================================================

-- Récupérer les IDs des catégories
DO $$
DECLARE
  cat_core uuid;
  cat_auth uuid;
  cat_profiles uuid;
  cat_jobs uuid;
  cat_applications uuid;
  cat_messages uuid;
  cat_directory uuid;
  cat_admin uuid;
  cat_ai uuid;
  cat_team uuid;
  cat_tasks uuid;
  cat_analytics uuid;
BEGIN
  SELECT id INTO cat_core FROM feature_categories WHERE category_key = 'core';
  SELECT id INTO cat_auth FROM feature_categories WHERE category_key = 'auth';
  SELECT id INTO cat_profiles FROM feature_categories WHERE category_key = 'profiles';
  SELECT id INTO cat_jobs FROM feature_categories WHERE category_key = 'jobs';
  SELECT id INTO cat_applications FROM feature_categories WHERE category_key = 'applications';
  SELECT id INTO cat_messages FROM feature_categories WHERE category_key = 'messages';
  SELECT id INTO cat_directory FROM feature_categories WHERE category_key = 'directory';
  SELECT id INTO cat_admin FROM feature_categories WHERE category_key = 'admin';
  SELECT id INTO cat_ai FROM feature_categories WHERE category_key = 'ai';
  SELECT id INTO cat_team FROM feature_categories WHERE category_key = 'team';
  SELECT id INTO cat_tasks FROM feature_categories WHERE category_key = 'tasks';
  SELECT id INTO cat_analytics FROM feature_categories WHERE category_key = 'analytics';

  -- Fonctionnalités V1.0 (Actives)
  INSERT INTO feature_flags (category_id, feature_key, display_name, description, target_version, is_enabled, component_path, route_path) VALUES
  (cat_core, 'landing_page', 'Page d''Accueil', 'Page d''accueil publique', '1.0.0', true, 'LandingPage', '/'),
  (cat_auth, 'login', 'Connexion', 'Formulaire de connexion', '1.0.0', true, 'Auth/LoginForm', '/login'),
  (cat_auth, 'signup', 'Inscription', 'Inscription athlète et entreprise', '1.0.0', true, 'Auth/SignUpFlow', '/signup'),
  (cat_auth, 'forgot_password', 'Mot de passe oublié', 'Réinitialisation de mot de passe', '1.0.0', true, 'Auth/ForgotPasswordForm', '/forgot-password'),
  (cat_auth, 'email_verification', 'Vérification Email', 'Vérification d''email', '1.0.0', true, 'Auth/EmailVerification', '/verify-email'),
  (cat_auth, 'athlete_onboarding', 'Onboarding Athlète', 'Processus d''onboarding athlète', '1.0.0', true, 'Auth/AthleteOnboarding', '/onboarding/athlete'),
  (cat_auth, 'company_onboarding', 'Onboarding Entreprise', 'Processus d''onboarding entreprise', '1.0.0', true, 'Auth/CompanyOnboarding', '/onboarding/company'),
  
  (cat_profiles, 'athlete_profile', 'Profil Athlète', 'Gestion du profil athlète', '1.0.0', true, 'Profiles/AthleteProfileForm', '/profile/athlete'),
  (cat_profiles, 'company_profile', 'Profil Entreprise', 'Gestion du profil entreprise', '1.0.0', true, 'Profiles/CompanyProfileForm', '/profile/company'),
  
  (cat_jobs, 'job_offers_list', 'Liste Offres', 'Consultation des offres d''emploi', '1.0.0', true, 'Jobs/JobsList', '/jobs'),
  (cat_jobs, 'job_offer_create', 'Créer Offre', 'Créer une offre d''emploi', '1.0.0', true, 'Jobs/JobForm', '/jobs/create'),
  (cat_jobs, 'job_offers_manage', 'Gérer Offres', 'Gérer mes offres d''emploi', '1.0.0', true, 'Jobs/ManageJobOffers', '/jobs/manage'),
  
  (cat_applications, 'my_applications', 'Mes Candidatures', 'Voir mes candidatures', '1.0.0', true, 'Jobs/MyApplications', '/applications/my'),
  (cat_applications, 'view_applications', 'Candidatures Reçues', 'Voir les candidatures reçues', '1.0.0', true, 'Jobs/ViewApplications', '/applications/received'),
  
  (cat_directory, 'athlete_directory', 'Annuaire Athlètes', 'Rechercher des athlètes', '1.0.0', true, 'Directory/AthleteDirectory', '/directory/athletes'),
  (cat_directory, 'company_directory', 'Annuaire Entreprises', 'Rechercher des entreprises', '1.0.0', true, 'Directory/CompanyDirectory', '/directory/companies'),
  (cat_directory, 'athlete_detail', 'Détail Athlète', 'Voir le détail d''un athlète', '1.0.0', true, 'Athletes/AthleteDetail', '/athletes/:id'),
  
  -- Fonctionnalités V2.0 (Désactivées pour l'instant)
  (cat_ai, 'elea_ai', 'Agent Elea', 'Assistant IA personnalisé context-aware', '2.0.0', false, 'AI/AgentElea', '/elea'),
  (cat_team, 'context_switcher', 'Changement de Contexte', 'Switcher entre différents rôles', '2.0.0', false, 'Contexts/ContextSwitcher', null),
  (cat_team, 'organization_management', 'Gestion Organisation', 'Gérer l''équipe de l''organisation', '2.0.0', false, 'Contexts/OrganizationTeamManagement', '/organization/team'),
  (cat_team, 'team_invitations', 'Invitations Équipe', 'Inviter des membres dans l''organisation', '2.0.0', false, null, null),
  (cat_team, 'athlete_delegation', 'Délégation Athlète', 'Déléguer l''accès à des parents/agents', '2.0.0', false, null, null),
  (cat_messages, 'context_messages', 'Messages Contextuels', 'Messagerie partagée par équipe', '2.0.0', false, 'Messages/MessagesList', '/messages'),
  
  -- Fonctionnalités V3.0 (Désactivées)
  (cat_tasks, 'shared_tasks', 'Tâches Partagées', 'Tâches collaboratives par équipe', '3.0.0', false, null, '/tasks'),
  (cat_tasks, 'task_comments', 'Commentaires Tâches', 'Commenter les tâches', '3.0.0', false, null, null),
  
  -- Admin (Toujours actif mais limité)
  (cat_admin, 'admin_login', 'Connexion Admin', 'Connexion pour administrateurs', '1.0.0', true, 'Auth/AdminLogin', '/admin/login'),
  (cat_admin, 'admin_dashboard', 'Dashboard Admin', 'Dashboard d''administration', '1.0.0', true, 'Admin/AdminDashboard', '/admin'),
  (cat_admin, 'admin_users', 'Gestion Utilisateurs', 'Gérer les utilisateurs', '1.0.0', true, 'Admin/AdminUsersManagement', '/admin/users'),
  (cat_admin, 'admin_jobs', 'Gestion Offres Admin', 'Gérer toutes les offres', '1.0.0', true, 'Admin/AdminJobsManagement', '/admin/jobs'),
  (cat_admin, 'admin_team', 'Équipe Admin', 'Gérer l''équipe d''administration', '1.0.0', true, 'Admin/AdminTeamManagement', '/admin/team'),
  (cat_admin, 'super_admin_console', 'Console Super Admin', 'Console super administrateur', '1.0.0', true, 'Admin/SuperAdminConsole', '/admin/super')
  
  ON CONFLICT (feature_key) DO NOTHING;
END $$;

-- ============================================================================
-- 5. TABLE: user_feature_access (Beta Testing et Accès Spécifique)
-- ============================================================================

CREATE TABLE IF NOT EXISTS user_feature_access (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  feature_id uuid NOT NULL REFERENCES feature_flags(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  access_type text NOT NULL CHECK (access_type IN ('beta', 'early_access', 'preview', 'blocked')),
  granted_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  expires_at timestamptz,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  UNIQUE(feature_id, user_id)
);

-- Index
CREATE INDEX IF NOT EXISTS idx_user_feature_access_user ON user_feature_access(user_id);
CREATE INDEX IF NOT EXISTS idx_user_feature_access_feature ON user_feature_access(feature_id);
CREATE INDEX IF NOT EXISTS idx_user_feature_access_type ON user_feature_access(access_type);

-- RLS
ALTER TABLE user_feature_access ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own feature access"
  ON user_feature_access FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Admins peuvent gérer les accès
CREATE POLICY "Admins can manage feature access"
  ON user_feature_access FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_contexts
      WHERE user_contexts.user_id = auth.uid()
      AND user_contexts.context_type = 'platform_admin'
      AND user_contexts.status = 'active'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_contexts
      WHERE user_contexts.user_id = auth.uid()
      AND user_contexts.context_type = 'platform_admin'
      AND user_contexts.status = 'active'
    )
  );

-- ============================================================================
-- 6. TABLE: feature_usage_analytics (Analytics)
-- ============================================================================

CREATE TABLE IF NOT EXISTS feature_usage_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  feature_id uuid NOT NULL REFERENCES feature_flags(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  event_type text NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_feature_analytics_feature ON feature_usage_analytics(feature_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_feature_analytics_user ON feature_usage_analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_feature_analytics_event ON feature_usage_analytics(event_type);

-- RLS
ALTER TABLE feature_usage_analytics ENABLE ROW LEVEL SECURITY;

-- Admins peuvent voir les analytics
CREATE POLICY "Admins can view analytics"
  ON feature_usage_analytics FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_contexts
      WHERE user_contexts.user_id = auth.uid()
      AND user_contexts.context_type = 'platform_admin'
      AND user_contexts.status = 'active'
    )
  );

-- Tout le monde peut insérer (tracking automatique)
CREATE POLICY "Anyone can insert analytics"
  ON feature_usage_analytics FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- ============================================================================
-- 7. FONCTIONS UTILITAIRES
-- ============================================================================

-- Fonction pour vérifier si une feature est activée pour un utilisateur
CREATE OR REPLACE FUNCTION is_feature_enabled_for_user(
  feature_key_param text,
  user_id_param uuid
)
RETURNS boolean AS $$
DECLARE
  feature_record feature_flags;
  user_access user_feature_access;
  user_hash numeric;
BEGIN
  -- Récupérer la feature
  SELECT * INTO feature_record
  FROM feature_flags
  WHERE feature_key = feature_key_param;

  IF feature_record IS NULL THEN
    RETURN false;
  END IF;

  -- Vérifier si user a un accès spécifique (beta, preview, etc.)
  SELECT * INTO user_access
  FROM user_feature_access
  WHERE feature_id = feature_record.id
  AND user_id = user_id_param
  AND (expires_at IS NULL OR expires_at > now());

  -- Si accès bloqué explicitement
  IF user_access IS NOT NULL AND user_access.access_type = 'blocked' THEN
    RETURN false;
  END IF;

  -- Si accès beta/preview spécifique
  IF user_access IS NOT NULL AND user_access.access_type IN ('beta', 'early_access', 'preview') THEN
    RETURN true;
  END IF;

  -- Si feature pas activée globalement
  IF NOT feature_record.is_enabled THEN
    RETURN false;
  END IF;

  -- Si rollout progressif (0-100%)
  IF feature_record.rollout_percentage < 100 THEN
    -- Hash du user_id pour distribution uniforme
    user_hash := ('x' || substring(user_id_param::text from 1 for 8))::bit(32)::bigint % 100;
    
    IF user_hash >= feature_record.rollout_percentage THEN
      RETURN false;
    END IF;
  END IF;

  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour obtenir toutes les features actives pour un user
CREATE OR REPLACE FUNCTION get_enabled_features_for_user(user_id_param uuid)
RETURNS TABLE (
  feature_key text,
  display_name text,
  category_key text,
  target_version text,
  component_path text,
  route_path text
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    ff.feature_key,
    ff.display_name,
    fc.category_key,
    ff.target_version,
    ff.component_path,
    ff.route_path
  FROM feature_flags ff
  LEFT JOIN feature_categories fc ON fc.id = ff.category_id
  WHERE is_feature_enabled_for_user(ff.feature_key, user_id_param) = true
  ORDER BY fc.display_order, ff.display_name;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour obtenir les statistiques d'une feature
CREATE OR REPLACE FUNCTION get_feature_stats(feature_key_param text)
RETURNS TABLE (
  total_users bigint,
  total_events bigint,
  unique_users_today bigint,
  events_today bigint,
  avg_events_per_user numeric
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(DISTINCT fua.user_id) as total_users,
    COUNT(fua.id) as total_events,
    COUNT(DISTINCT fua.user_id) FILTER (WHERE fua.created_at >= CURRENT_DATE) as unique_users_today,
    COUNT(fua.id) FILTER (WHERE fua.created_at >= CURRENT_DATE) as events_today,
    CASE
      WHEN COUNT(DISTINCT fua.user_id) > 0
      THEN ROUND(COUNT(fua.id)::numeric / COUNT(DISTINCT fua.user_id), 2)
      ELSE 0
    END as avg_events_per_user
  FROM feature_usage_analytics fua
  JOIN feature_flags ff ON ff.id = fua.feature_id
  WHERE ff.feature_key = feature_key_param;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 8. TRIGGERS
-- ============================================================================

-- Trigger pour updated_at
CREATE OR REPLACE FUNCTION update_feature_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_feature_categories_updated_at ON feature_categories;
CREATE TRIGGER update_feature_categories_updated_at
  BEFORE UPDATE ON feature_categories
  FOR EACH ROW
  EXECUTE FUNCTION update_feature_updated_at();

DROP TRIGGER IF EXISTS update_feature_versions_updated_at ON feature_versions;
CREATE TRIGGER update_feature_versions_updated_at
  BEFORE UPDATE ON feature_versions
  FOR EACH ROW
  EXECUTE FUNCTION update_feature_updated_at();

DROP TRIGGER IF EXISTS update_feature_flags_updated_at ON feature_flags;
CREATE TRIGGER update_feature_flags_updated_at
  BEFORE UPDATE ON feature_flags
  FOR EACH ROW
  EXECUTE FUNCTION update_feature_updated_at();

-- ============================================================================
-- 9. PERMISSIONS
-- ============================================================================

GRANT EXECUTE ON FUNCTION is_feature_enabled_for_user(text, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION get_enabled_features_for_user(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION get_feature_stats(text) TO authenticated;
