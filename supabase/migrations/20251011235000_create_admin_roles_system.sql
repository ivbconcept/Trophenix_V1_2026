/*
  # Système de Rôles Administrateurs Trophenix

  ## Nouvelles Tables

  ### `admin_roles`
  Table des rôles administrateurs disponibles
  - `id` (uuid, PK)
  - `name` (text, unique) - Nom du rôle
  - `description` (text) - Description du rôle
  - `permissions` (jsonb) - Permissions détaillées
  - `created_at` (timestamptz)

  ### `admin_team_members`
  Table des membres de l'équipe administrative Trophenix
  - `id` (uuid, PK)
  - `user_id` (uuid, FK -> profiles.id)
  - `role_id` (uuid, FK -> admin_roles.id)
  - `invited_by` (uuid, FK -> profiles.id)
  - `invited_at` (timestamptz)
  - `status` (text) - pending, active, suspended
  - `last_login` (timestamptz)
  - `notes` (text) - Notes internes

  ### `admin_activity_logs`
  Logs de toutes les actions administratives
  - `id` (uuid, PK)
  - `admin_id` (uuid, FK -> admin_team_members.id)
  - `action` (text) - Type d'action
  - `target_type` (text) - user, job, message, etc.
  - `target_id` (uuid) - ID de la cible
  - `details` (jsonb) - Détails de l'action
  - `created_at` (timestamptz)

  ## Rôles par Défaut
  - super_admin: Accès total à tout
  - moderator: Modération contenu (offres, messages, profils)
  - support: Service client (gestion tickets, messages)
  - communication: Gestion communications et contenus
  - analyst: Consultation stats et rapports (lecture seule)

  ## Sécurité
  - RLS activé sur toutes les tables
  - Seuls les super_admins peuvent gérer l'équipe
  - Tous les admins peuvent consulter les logs
  - Audit trail complet de toutes les actions
*/

-- Créer la table des rôles administrateurs
CREATE TABLE IF NOT EXISTS admin_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text NOT NULL,
  permissions jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Créer la table des membres de l'équipe admin
CREATE TABLE IF NOT EXISTS admin_team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  role_id uuid REFERENCES admin_roles(id) ON DELETE RESTRICT NOT NULL,
  invited_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  invited_at timestamptz DEFAULT now(),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('pending', 'active', 'suspended')),
  last_login timestamptz,
  notes text,
  UNIQUE(user_id)
);

-- Créer la table des logs d'activité admin
CREATE TABLE IF NOT EXISTS admin_activity_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id uuid REFERENCES admin_team_members(id) ON DELETE SET NULL,
  action text NOT NULL,
  target_type text NOT NULL,
  target_id uuid,
  details jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Créer les index pour performance
CREATE INDEX IF NOT EXISTS idx_admin_team_members_user_id ON admin_team_members(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_team_members_role_id ON admin_team_members(role_id);
CREATE INDEX IF NOT EXISTS idx_admin_team_members_status ON admin_team_members(status);
CREATE INDEX IF NOT EXISTS idx_admin_activity_logs_admin_id ON admin_activity_logs(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_activity_logs_created_at ON admin_activity_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_activity_logs_target ON admin_activity_logs(target_type, target_id);

-- Activer RLS sur toutes les tables
ALTER TABLE admin_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_activity_logs ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour admin_roles
CREATE POLICY "Admin team members can view roles"
  ON admin_roles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_team_members
      WHERE user_id = auth.uid()
      AND status = 'active'
    )
  );

CREATE POLICY "Super admins can manage roles"
  ON admin_roles FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_team_members atm
      JOIN admin_roles ar ON atm.role_id = ar.id
      WHERE atm.user_id = auth.uid()
      AND atm.status = 'active'
      AND ar.name = 'super_admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_team_members atm
      JOIN admin_roles ar ON atm.role_id = ar.id
      WHERE atm.user_id = auth.uid()
      AND atm.status = 'active'
      AND ar.name = 'super_admin'
    )
  );

-- Politiques RLS pour admin_team_members
CREATE POLICY "Admin team members can view team"
  ON admin_team_members FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_team_members
      WHERE user_id = auth.uid()
      AND status = 'active'
    )
  );

CREATE POLICY "Super admins can manage team"
  ON admin_team_members FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_team_members atm
      JOIN admin_roles ar ON atm.role_id = ar.id
      WHERE atm.user_id = auth.uid()
      AND atm.status = 'active'
      AND ar.name = 'super_admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_team_members atm
      JOIN admin_roles ar ON atm.role_id = ar.id
      WHERE atm.user_id = auth.uid()
      AND atm.status = 'active'
      AND ar.name = 'super_admin'
    )
  );

-- Politiques RLS pour admin_activity_logs
CREATE POLICY "Admin team members can view logs"
  ON admin_activity_logs FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_team_members
      WHERE user_id = auth.uid()
      AND status = 'active'
    )
  );

CREATE POLICY "System can insert logs"
  ON admin_activity_logs FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_team_members
      WHERE user_id = auth.uid()
      AND status = 'active'
    )
  );

-- Insérer les rôles par défaut
INSERT INTO admin_roles (name, description, permissions) VALUES
  (
    'super_admin',
    'Administrateur principal avec accès complet à toutes les fonctionnalités',
    '{
      "manage_team": true,
      "manage_roles": true,
      "manage_users": true,
      "manage_jobs": true,
      "manage_messages": true,
      "view_stats": true,
      "moderate_content": true,
      "handle_support": true,
      "manage_communications": true,
      "view_logs": true,
      "delete_content": true
    }'::jsonb
  ),
  (
    'moderator',
    'Modérateur de contenu - Gestion des profils, offres et messages',
    '{
      "manage_team": false,
      "manage_roles": false,
      "manage_users": true,
      "manage_jobs": true,
      "manage_messages": true,
      "view_stats": true,
      "moderate_content": true,
      "handle_support": false,
      "manage_communications": false,
      "view_logs": true,
      "delete_content": true
    }'::jsonb
  ),
  (
    'support',
    'Service client - Gestion du support utilisateur et assistance',
    '{
      "manage_team": false,
      "manage_roles": false,
      "manage_users": false,
      "manage_jobs": false,
      "manage_messages": true,
      "view_stats": false,
      "moderate_content": false,
      "handle_support": true,
      "manage_communications": false,
      "view_logs": false,
      "delete_content": false
    }'::jsonb
  ),
  (
    'communication',
    'Responsable communication - Gestion des communications et contenus marketing',
    '{
      "manage_team": false,
      "manage_roles": false,
      "manage_users": false,
      "manage_jobs": false,
      "manage_messages": false,
      "view_stats": true,
      "moderate_content": false,
      "handle_support": false,
      "manage_communications": true,
      "view_logs": false,
      "delete_content": false
    }'::jsonb
  ),
  (
    'analyst',
    'Analyste - Consultation des statistiques et rapports (lecture seule)',
    '{
      "manage_team": false,
      "manage_roles": false,
      "manage_users": false,
      "manage_jobs": false,
      "manage_messages": false,
      "view_stats": true,
      "moderate_content": false,
      "handle_support": false,
      "manage_communications": false,
      "view_logs": true,
      "delete_content": false
    }'::jsonb
  )
ON CONFLICT (name) DO NOTHING;

-- Fonction pour logger automatiquement les actions admin
CREATE OR REPLACE FUNCTION log_admin_action()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO admin_activity_logs (
    admin_id,
    action,
    target_type,
    target_id,
    details
  )
  SELECT
    atm.id,
    TG_ARGV[0],
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    jsonb_build_object(
      'old', to_jsonb(OLD),
      'new', to_jsonb(NEW)
    )
  FROM admin_team_members atm
  WHERE atm.user_id = auth.uid()
  AND atm.status = 'active';

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ajouter des triggers pour logger les actions critiques
CREATE TRIGGER log_profile_updates
  AFTER UPDATE ON profiles
  FOR EACH ROW
  WHEN (OLD.validation_status IS DISTINCT FROM NEW.validation_status)
  EXECUTE FUNCTION log_admin_action('profile_validation_changed');

CREATE TRIGGER log_job_moderation
  AFTER UPDATE ON job_offers
  FOR EACH ROW
  WHEN (OLD.status IS DISTINCT FROM NEW.status)
  EXECUTE FUNCTION log_admin_action('job_status_changed');
