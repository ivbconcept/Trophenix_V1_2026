/*
  # Système Multi-Rôles et Multi-Contextes - Architecture Scalable

  ## Vue d'ensemble
  Cette migration implémente une architecture avancée permettant :
  - Un utilisateur peut avoir PLUSIEURS rôles actifs (Admin + Recruteur + Athlète)
  - Les entreprises peuvent avoir des ÉQUIPES avec rôles différents
  - Les athlètes peuvent avoir des DÉLÉGUÉS (parents, agents)
  - Messagerie et tâches PARTAGÉES entre membres d'une organisation/délégation
  - Permissions granulaires par rôle

  ## Nouvelles Tables

  ### 1. `user_contexts`
  Table pivot pour gérer les multiples rôles d'un utilisateur
  - `id` (uuid, PK)
  - `user_id` (uuid, FK → profiles) - L'utilisateur
  - `context_type` (text) - Type: 'platform_admin' | 'company_org' | 'athlete_profile' | 'athlete_delegation'
  - `context_id` (uuid) - ID de l'entité (organization_id, athlete_profile_id, etc.)
  - `role` (text) - Rôle dans ce contexte (owner, hr_manager, guardian, agent, etc.)
  - `is_primary` (boolean) - Si c'est le rôle principal de l'utilisateur
  - `status` (text) - active | suspended | invited | pending
  - `invited_by` (uuid, FK → profiles) - Qui a invité cet utilisateur
  - `invited_at` (timestamptz)
  - `joined_at` (timestamptz)
  - `metadata` (jsonb) - Données additionnelles

  ### 2. `company_organizations`
  Organisations d'entreprises avec membres multiples
  - `id` (uuid, PK)
  - `name` (text) - Nom de l'organisation
  - `slug` (text) - URL-friendly identifier
  - `company_profile_id` (uuid, FK → company_profiles) - Lien vers le profil entreprise
  - `owner_id` (uuid, FK → profiles) - Propriétaire/créateur
  - `settings` (jsonb) - Configuration de l'organisation
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 3. `athlete_delegations`
  Délégations pour les athlètes (parents, agents, managers)
  - `id` (uuid, PK)
  - `athlete_profile_id` (uuid, FK → athlete_profiles)
  - `delegate_user_id` (uuid, FK → profiles) - Parent/Agent
  - `role` (text) - guardian | agent | manager | coach
  - `permissions` (jsonb) - Permissions spécifiques
  - `status` (text) - active | suspended | invited | revoked
  - `invited_by` (uuid, FK → profiles)
  - `invited_at` (timestamptz)
  - `accepted_at` (timestamptz)
  - `created_at` (timestamptz)

  ### 4. `role_permissions`
  Définition des permissions par rôle (configuration)
  - `id` (uuid, PK)
  - `role_name` (text) - Nom du rôle (hr_manager, agent, etc.)
  - `context_type` (text) - Type de contexte
  - `permissions` (jsonb) - Liste des permissions
  - `description` (text)
  - `is_system` (boolean) - Rôle système non modifiable

  ### 5. `context_messages`
  Messages avec contexte (remplace l'ancienne table messages)
  - `id` (uuid, PK)
  - `context_type` (text) - direct | organization | delegation | application
  - `context_id` (uuid) - ID du contexte
  - `sender_id` (uuid, FK → profiles)
  - `sender_role` (text) - Rôle de l'expéditeur dans ce contexte
  - `subject` (text)
  - `content` (text)
  - `visibility` (text) - all | internal | specific_roles
  - `visible_to_roles` (text[]) - Array de rôles autorisés à voir
  - `metadata` (jsonb)
  - `sent_at` (timestamptz)
  - `created_at` (timestamptz)

  ### 6. `context_message_reads`
  Statut de lecture par utilisateur
  - `id` (uuid, PK)
  - `message_id` (uuid, FK → context_messages)
  - `user_id` (uuid, FK → profiles)
  - `read_at` (timestamptz)

  ### 7. `shared_tasks`
  Tâches partagées entre membres d'un contexte
  - `id` (uuid, PK)
  - `context_type` (text) - organization | delegation | application
  - `context_id` (uuid)
  - `title` (text)
  - `description` (text)
  - `assigned_to` (uuid, FK → profiles)
  - `assigned_role` (text)
  - `created_by` (uuid, FK → profiles)
  - `status` (text) - pending | in_progress | completed | cancelled
  - `priority` (text) - low | medium | high | urgent
  - `due_date` (timestamptz)
  - `completed_at` (timestamptz)
  - `metadata` (jsonb)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 8. `task_comments`
  Commentaires sur les tâches
  - `id` (uuid, PK)
  - `task_id` (uuid, FK → shared_tasks)
  - `user_id` (uuid, FK → profiles)
  - `content` (text)
  - `created_at` (timestamptz)

  ## Sécurité (RLS)
  Toutes les tables ont RLS activé avec des politiques strictes :
  - user_contexts : L'utilisateur voit ses propres contextes
  - company_organizations : Membres de l'organisation peuvent voir/gérer
  - athlete_delegations : Athlète + délégués peuvent voir
  - context_messages : Basé sur le contexte et les rôles
  - shared_tasks : Visible par tous les membres du contexte

  ## Index
  Index optimisés pour :
  - Recherche de contextes par user_id
  - Recherche de messages par context_id
  - Recherche de tâches par assigné et statut
  - Performance des jointures

  ## Notes importantes
  - Architecture scalable pour futures équipes
  - Support multi-tenancy naturel (isolation par context_id)
  - Audit trail via created_at, invited_by, etc.
  - Extensible via metadata (jsonb)
*/

-- ============================================================================
-- TABLE: user_contexts (Multi-rôles pour utilisateurs)
-- ============================================================================

CREATE TABLE IF NOT EXISTS user_contexts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  context_type text NOT NULL CHECK (context_type IN ('platform_admin', 'company_org', 'athlete_profile', 'athlete_delegation')),
  context_id uuid,
  role text NOT NULL,
  is_primary boolean DEFAULT false,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'invited', 'pending')),
  invited_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  invited_at timestamptz DEFAULT now(),
  joined_at timestamptz,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_user_contexts_user_id ON user_contexts(user_id);
CREATE INDEX IF NOT EXISTS idx_user_contexts_context ON user_contexts(context_type, context_id);
CREATE INDEX IF NOT EXISTS idx_user_contexts_status ON user_contexts(status);
CREATE INDEX IF NOT EXISTS idx_user_contexts_primary ON user_contexts(user_id, is_primary) WHERE is_primary = true;

-- ============================================================================
-- TABLE: company_organizations (Organisations avec équipes)
-- ============================================================================

CREATE TABLE IF NOT EXISTS company_organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  company_profile_id uuid REFERENCES company_profiles(id) ON DELETE CASCADE NOT NULL,
  owner_id uuid REFERENCES profiles(id) ON DELETE RESTRICT NOT NULL,
  settings jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_company_orgs_owner ON company_organizations(owner_id);
CREATE INDEX IF NOT EXISTS idx_company_orgs_profile ON company_organizations(company_profile_id);
CREATE INDEX IF NOT EXISTS idx_company_orgs_slug ON company_organizations(slug);

-- ============================================================================
-- TABLE: athlete_delegations (Délégation athlète)
-- ============================================================================

CREATE TABLE IF NOT EXISTS athlete_delegations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  athlete_profile_id uuid REFERENCES athlete_profiles(id) ON DELETE CASCADE NOT NULL,
  delegate_user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  role text NOT NULL CHECK (role IN ('guardian', 'agent', 'manager', 'coach')),
  permissions jsonb DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'invited' CHECK (status IN ('active', 'suspended', 'invited', 'revoked')),
  invited_by uuid REFERENCES profiles(id) ON DELETE SET NULL NOT NULL,
  invited_at timestamptz DEFAULT now(),
  accepted_at timestamptz,
  created_at timestamptz DEFAULT now(),
  UNIQUE(athlete_profile_id, delegate_user_id)
);

CREATE INDEX IF NOT EXISTS idx_athlete_delegations_athlete ON athlete_delegations(athlete_profile_id);
CREATE INDEX IF NOT EXISTS idx_athlete_delegations_delegate ON athlete_delegations(delegate_user_id);
CREATE INDEX IF NOT EXISTS idx_athlete_delegations_status ON athlete_delegations(status);

-- ============================================================================
-- TABLE: role_permissions (Configuration permissions)
-- ============================================================================

CREATE TABLE IF NOT EXISTS role_permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role_name text UNIQUE NOT NULL,
  context_type text NOT NULL,
  permissions jsonb NOT NULL,
  description text,
  is_system boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_role_permissions_name ON role_permissions(role_name);
CREATE INDEX IF NOT EXISTS idx_role_permissions_context ON role_permissions(context_type);

-- ============================================================================
-- TABLE: context_messages (Messagerie contextuelle)
-- ============================================================================

CREATE TABLE IF NOT EXISTS context_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  context_type text NOT NULL CHECK (context_type IN ('direct', 'organization', 'delegation', 'application')),
  context_id uuid NOT NULL,
  sender_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  sender_role text,
  subject text NOT NULL,
  content text NOT NULL,
  visibility text NOT NULL DEFAULT 'all' CHECK (visibility IN ('all', 'internal', 'specific_roles')),
  visible_to_roles text[] DEFAULT '{}',
  metadata jsonb DEFAULT '{}'::jsonb,
  sent_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_context_messages_context ON context_messages(context_type, context_id);
CREATE INDEX IF NOT EXISTS idx_context_messages_sender ON context_messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_context_messages_sent_at ON context_messages(sent_at DESC);

-- ============================================================================
-- TABLE: context_message_reads (Statuts de lecture)
-- ============================================================================

CREATE TABLE IF NOT EXISTS context_message_reads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id uuid REFERENCES context_messages(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  read_at timestamptz DEFAULT now(),
  UNIQUE(message_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_context_message_reads_message ON context_message_reads(message_id);
CREATE INDEX IF NOT EXISTS idx_context_message_reads_user ON context_message_reads(user_id);

-- ============================================================================
-- TABLE: shared_tasks (Tâches partagées)
-- ============================================================================

CREATE TABLE IF NOT EXISTS shared_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  context_type text NOT NULL CHECK (context_type IN ('organization', 'delegation', 'application')),
  context_id uuid NOT NULL,
  title text NOT NULL,
  description text,
  assigned_to uuid REFERENCES profiles(id) ON DELETE SET NULL,
  assigned_role text,
  created_by uuid REFERENCES profiles(id) ON DELETE SET NULL NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  priority text NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  due_date timestamptz,
  completed_at timestamptz,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_shared_tasks_context ON shared_tasks(context_type, context_id);
CREATE INDEX IF NOT EXISTS idx_shared_tasks_assigned ON shared_tasks(assigned_to, status);
CREATE INDEX IF NOT EXISTS idx_shared_tasks_created_by ON shared_tasks(created_by);
CREATE INDEX IF NOT EXISTS idx_shared_tasks_status ON shared_tasks(status);
CREATE INDEX IF NOT EXISTS idx_shared_tasks_due_date ON shared_tasks(due_date) WHERE status != 'completed';

-- ============================================================================
-- TABLE: task_comments (Commentaires sur tâches)
-- ============================================================================

CREATE TABLE IF NOT EXISTS task_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id uuid REFERENCES shared_tasks(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_task_comments_task ON task_comments(task_id);
CREATE INDEX IF NOT EXISTS idx_task_comments_user ON task_comments(user_id);

-- ============================================================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE user_contexts ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE athlete_delegations ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE context_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE context_message_reads ENABLE ROW LEVEL SECURITY;
ALTER TABLE shared_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_comments ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- RLS POLICIES: user_contexts
-- ============================================================================

CREATE POLICY "Users can view own contexts"
  ON user_contexts FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own contexts"
  ON user_contexts FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Organization owners can invite members"
  ON user_contexts FOR INSERT
  TO authenticated
  WITH CHECK (
    invited_by = auth.uid() AND
    (
      context_type = 'company_org' AND
      EXISTS (
        SELECT 1 FROM user_contexts uc
        WHERE uc.user_id = auth.uid()
        AND uc.context_id = user_contexts.context_id
        AND uc.context_type = 'company_org'
        AND uc.role = 'owner'
        AND uc.status = 'active'
      )
    )
  );

CREATE POLICY "Athletes can invite delegates"
  ON user_contexts FOR INSERT
  TO authenticated
  WITH CHECK (
    invited_by = auth.uid() AND
    context_type = 'athlete_delegation'
  );

-- ============================================================================
-- RLS POLICIES: company_organizations
-- ============================================================================

CREATE POLICY "Users can view organizations they belong to"
  ON company_organizations FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_contexts
      WHERE user_contexts.context_id = company_organizations.id
      AND user_contexts.user_id = auth.uid()
      AND user_contexts.context_type = 'company_org'
      AND user_contexts.status = 'active'
    )
  );

CREATE POLICY "Company profile owners can create organizations"
  ON company_organizations FOR INSERT
  TO authenticated
  WITH CHECK (
    owner_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM company_profiles
      WHERE company_profiles.id = company_profile_id
      AND company_profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Organization owners can update"
  ON company_organizations FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_contexts
      WHERE user_contexts.context_id = company_organizations.id
      AND user_contexts.user_id = auth.uid()
      AND user_contexts.context_type = 'company_org'
      AND user_contexts.role = 'owner'
      AND user_contexts.status = 'active'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_contexts
      WHERE user_contexts.context_id = company_organizations.id
      AND user_contexts.user_id = auth.uid()
      AND user_contexts.context_type = 'company_org'
      AND user_contexts.role = 'owner'
      AND user_contexts.status = 'active'
    )
  );

-- ============================================================================
-- RLS POLICIES: athlete_delegations
-- ============================================================================

CREATE POLICY "Athletes can view own delegations"
  ON athlete_delegations FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM athlete_profiles
      WHERE athlete_profiles.id = athlete_delegations.athlete_profile_id
      AND athlete_profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Delegates can view their delegations"
  ON athlete_delegations FOR SELECT
  TO authenticated
  USING (delegate_user_id = auth.uid());

CREATE POLICY "Athletes can create delegations"
  ON athlete_delegations FOR INSERT
  TO authenticated
  WITH CHECK (
    invited_by = auth.uid() AND
    EXISTS (
      SELECT 1 FROM athlete_profiles
      WHERE athlete_profiles.id = athlete_delegations.athlete_profile_id
      AND athlete_profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Athletes can update delegations"
  ON athlete_delegations FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM athlete_profiles
      WHERE athlete_profiles.id = athlete_delegations.athlete_profile_id
      AND athlete_profiles.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM athlete_profiles
      WHERE athlete_profiles.id = athlete_delegations.athlete_profile_id
      AND athlete_profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Delegates can accept invitations"
  ON athlete_delegations FOR UPDATE
  TO authenticated
  USING (delegate_user_id = auth.uid() AND status = 'invited')
  WITH CHECK (delegate_user_id = auth.uid());

-- ============================================================================
-- RLS POLICIES: role_permissions (Lecture seule pour tous)
-- ============================================================================

CREATE POLICY "Everyone can view role permissions"
  ON role_permissions FOR SELECT
  TO authenticated
  USING (true);

-- ============================================================================
-- RLS POLICIES: context_messages
-- ============================================================================

CREATE POLICY "Users can send messages in their contexts"
  ON context_messages FOR INSERT
  TO authenticated
  WITH CHECK (
    sender_id = auth.uid() AND
    (
      (context_type = 'organization' AND
        EXISTS (
          SELECT 1 FROM user_contexts
          WHERE user_contexts.context_id = context_messages.context_id
          AND user_contexts.user_id = auth.uid()
          AND user_contexts.context_type = 'company_org'
          AND user_contexts.status = 'active'
        )
      ) OR
      (context_type = 'delegation' AND
        EXISTS (
          SELECT 1 FROM athlete_delegations
          WHERE athlete_delegations.id = context_messages.context_id
          AND (athlete_delegations.delegate_user_id = auth.uid() OR
               EXISTS (
                 SELECT 1 FROM athlete_profiles
                 WHERE athlete_profiles.id = athlete_delegations.athlete_profile_id
                 AND athlete_profiles.user_id = auth.uid()
               ))
          AND athlete_delegations.status = 'active'
        )
      ) OR
      (context_type = 'direct')
    )
  );

CREATE POLICY "Users can view messages in their contexts"
  ON context_messages FOR SELECT
  TO authenticated
  USING (
    sender_id = auth.uid() OR
    (
      (context_type = 'organization' AND
        EXISTS (
          SELECT 1 FROM user_contexts
          WHERE user_contexts.context_id = context_messages.context_id
          AND user_contexts.user_id = auth.uid()
          AND user_contexts.context_type = 'company_org'
          AND user_contexts.status = 'active'
        )
      ) OR
      (context_type = 'delegation' AND
        EXISTS (
          SELECT 1 FROM athlete_delegations
          WHERE athlete_delegations.id = context_messages.context_id
          AND (athlete_delegations.delegate_user_id = auth.uid() OR
               EXISTS (
                 SELECT 1 FROM athlete_profiles
                 WHERE athlete_profiles.id = athlete_delegations.athlete_profile_id
                 AND athlete_profiles.user_id = auth.uid()
               ))
          AND athlete_delegations.status = 'active'
        )
      )
    )
  );

-- ============================================================================
-- RLS POLICIES: context_message_reads
-- ============================================================================

CREATE POLICY "Users can create own read status"
  ON context_message_reads FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can view own read status"
  ON context_message_reads FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- ============================================================================
-- RLS POLICIES: shared_tasks
-- ============================================================================

CREATE POLICY "Users can view tasks in their contexts"
  ON shared_tasks FOR SELECT
  TO authenticated
  USING (
    (context_type = 'organization' AND
      EXISTS (
        SELECT 1 FROM user_contexts
        WHERE user_contexts.context_id = shared_tasks.context_id
        AND user_contexts.user_id = auth.uid()
        AND user_contexts.context_type = 'company_org'
        AND user_contexts.status = 'active'
      )
    ) OR
    (context_type = 'delegation' AND
      EXISTS (
        SELECT 1 FROM athlete_delegations
        WHERE athlete_delegations.id = shared_tasks.context_id
        AND (athlete_delegations.delegate_user_id = auth.uid() OR
             EXISTS (
               SELECT 1 FROM athlete_profiles
               WHERE athlete_profiles.id = athlete_delegations.athlete_profile_id
               AND athlete_profiles.user_id = auth.uid()
             ))
        AND athlete_delegations.status = 'active'
      )
    )
  );

CREATE POLICY "Users can create tasks in their contexts"
  ON shared_tasks FOR INSERT
  TO authenticated
  WITH CHECK (
    created_by = auth.uid() AND
    (
      (context_type = 'organization' AND
        EXISTS (
          SELECT 1 FROM user_contexts
          WHERE user_contexts.context_id = shared_tasks.context_id
          AND user_contexts.user_id = auth.uid()
          AND user_contexts.context_type = 'company_org'
          AND user_contexts.status = 'active'
        )
      ) OR
      (context_type = 'delegation' AND
        EXISTS (
          SELECT 1 FROM athlete_delegations
          WHERE athlete_delegations.id = shared_tasks.context_id
          AND (athlete_delegations.delegate_user_id = auth.uid() OR
               EXISTS (
                 SELECT 1 FROM athlete_profiles
                 WHERE athlete_profiles.id = athlete_delegations.athlete_profile_id
                 AND athlete_profiles.user_id = auth.uid()
               ))
          AND athlete_delegations.status = 'active'
        )
      )
    )
  );

CREATE POLICY "Users can update tasks in their contexts"
  ON shared_tasks FOR UPDATE
  TO authenticated
  USING (
    (context_type = 'organization' AND
      EXISTS (
        SELECT 1 FROM user_contexts
        WHERE user_contexts.context_id = shared_tasks.context_id
        AND user_contexts.user_id = auth.uid()
        AND user_contexts.context_type = 'company_org'
        AND user_contexts.status = 'active'
      )
    ) OR
    (context_type = 'delegation' AND
      EXISTS (
        SELECT 1 FROM athlete_delegations
        WHERE athlete_delegations.id = shared_tasks.context_id
        AND (athlete_delegations.delegate_user_id = auth.uid() OR
             EXISTS (
               SELECT 1 FROM athlete_profiles
               WHERE athlete_profiles.id = athlete_delegations.athlete_profile_id
               AND athlete_profiles.user_id = auth.uid()
             ))
        AND athlete_delegations.status = 'active'
      )
    )
  )
  WITH CHECK (
    (context_type = 'organization' AND
      EXISTS (
        SELECT 1 FROM user_contexts
        WHERE user_contexts.context_id = shared_tasks.context_id
        AND user_contexts.user_id = auth.uid()
        AND user_contexts.context_type = 'company_org'
        AND user_contexts.status = 'active'
      )
    ) OR
    (context_type = 'delegation' AND
      EXISTS (
        SELECT 1 FROM athlete_delegations
        WHERE athlete_delegations.id = shared_tasks.context_id
        AND (athlete_delegations.delegate_user_id = auth.uid() OR
             EXISTS (
               SELECT 1 FROM athlete_profiles
               WHERE athlete_profiles.id = athlete_delegations.athlete_profile_id
               AND athlete_profiles.user_id = auth.uid()
             ))
        AND athlete_delegations.status = 'active'
      )
    )
  );

-- ============================================================================
-- RLS POLICIES: task_comments
-- ============================================================================

CREATE POLICY "Users can view comments on tasks they can see"
  ON task_comments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM shared_tasks
      WHERE shared_tasks.id = task_comments.task_id
      AND (
        (shared_tasks.context_type = 'organization' AND
          EXISTS (
            SELECT 1 FROM user_contexts
            WHERE user_contexts.context_id = shared_tasks.context_id
            AND user_contexts.user_id = auth.uid()
            AND user_contexts.context_type = 'company_org'
            AND user_contexts.status = 'active'
          )
        ) OR
        (shared_tasks.context_type = 'delegation' AND
          EXISTS (
            SELECT 1 FROM athlete_delegations
            WHERE athlete_delegations.id = shared_tasks.context_id
            AND (athlete_delegations.delegate_user_id = auth.uid() OR
                 EXISTS (
                   SELECT 1 FROM athlete_profiles
                   WHERE athlete_profiles.id = athlete_delegations.athlete_profile_id
                   AND athlete_profiles.user_id = auth.uid()
                 ))
            AND athlete_delegations.status = 'active'
          )
        )
      )
    )
  );

CREATE POLICY "Users can create comments on tasks they can see"
  ON task_comments FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM shared_tasks
      WHERE shared_tasks.id = task_comments.task_id
      AND (
        (shared_tasks.context_type = 'organization' AND
          EXISTS (
            SELECT 1 FROM user_contexts
            WHERE user_contexts.context_id = shared_tasks.context_id
            AND user_contexts.user_id = auth.uid()
            AND user_contexts.context_type = 'company_org'
            AND user_contexts.status = 'active'
          )
        ) OR
        (shared_tasks.context_type = 'delegation' AND
          EXISTS (
            SELECT 1 FROM athlete_delegations
            WHERE athlete_delegations.id = shared_tasks.context_id
            AND (athlete_delegations.delegate_user_id = auth.uid() OR
                 EXISTS (
                   SELECT 1 FROM athlete_profiles
                   WHERE athlete_profiles.id = athlete_delegations.athlete_profile_id
                   AND athlete_profiles.user_id = auth.uid()
                 ))
            AND athlete_delegations.status = 'active'
          )
        )
      )
    )
  );

-- ============================================================================
-- FUNCTIONS: Helper functions
-- ============================================================================

-- Fonction pour obtenir tous les contextes d'un utilisateur
CREATE OR REPLACE FUNCTION get_user_contexts(target_user_id uuid)
RETURNS TABLE (
  context_id uuid,
  context_type text,
  role text,
  is_primary boolean,
  status text
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    uc.context_id,
    uc.context_type,
    uc.role,
    uc.is_primary,
    uc.status
  FROM user_contexts uc
  WHERE uc.user_id = target_user_id
  AND uc.status = 'active';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour vérifier si un utilisateur a une permission dans un contexte
CREATE OR REPLACE FUNCTION user_has_permission(
  target_user_id uuid,
  target_context_type text,
  target_context_id uuid,
  permission_name text
)
RETURNS boolean AS $$
DECLARE
  user_role text;
  role_perms jsonb;
BEGIN
  -- Obtenir le rôle de l'utilisateur dans ce contexte
  SELECT uc.role INTO user_role
  FROM user_contexts uc
  WHERE uc.user_id = target_user_id
  AND uc.context_type = target_context_type
  AND uc.context_id = target_context_id
  AND uc.status = 'active';

  IF user_role IS NULL THEN
    RETURN false;
  END IF;

  -- Obtenir les permissions pour ce rôle
  SELECT rp.permissions INTO role_perms
  FROM role_permissions rp
  WHERE rp.role_name = user_role
  AND rp.context_type = target_context_type;

  IF role_perms IS NULL THEN
    RETURN false;
  END IF;

  -- Vérifier si la permission existe et est true
  RETURN (role_perms ->> permission_name)::boolean = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- SEED DATA: Default role permissions
-- ============================================================================

INSERT INTO role_permissions (role_name, context_type, permissions, description, is_system) VALUES
  -- Company Organization Roles
  ('owner', 'company_org', '{
    "can_manage_organization": true,
    "can_invite_members": true,
    "can_remove_members": true,
    "can_post_jobs": true,
    "can_edit_jobs": true,
    "can_delete_jobs": true,
    "can_view_applications": true,
    "can_manage_applications": true,
    "can_edit_company_profile": true,
    "can_manage_billing": true,
    "can_view_analytics": true
  }', 'Propriétaire de l''organisation - Tous les droits', true),

  ('hr_manager', 'company_org', '{
    "can_invite_members": true,
    "can_post_jobs": true,
    "can_edit_jobs": true,
    "can_delete_jobs": true,
    "can_view_applications": true,
    "can_manage_applications": true,
    "can_view_analytics": true
  }', 'Responsable RH - Gestion recrutement complète', true),

  ('hr_recruiter', 'company_org', '{
    "can_view_applications": true,
    "can_manage_applications": false,
    "can_post_jobs": false
  }', 'Recruteur RH - Consultation candidatures', true),

  ('technical_lead', 'company_org', '{
    "can_view_applications": true,
    "can_evaluate_technical": true
  }', 'Responsable technique - Évaluation compétences', true),

  ('director', 'company_org', '{
    "can_view_applications": true,
    "can_view_analytics": true,
    "can_final_validation": true
  }', 'Directeur - Validation finale', true),

  -- Athlete Delegation Roles
  ('guardian', 'athlete_delegation', '{
    "can_view_profile": true,
    "can_edit_profile": true,
    "can_manage_applications": true,
    "can_accept_offers": true,
    "can_sign_contracts": true,
    "can_view_messages": true,
    "can_send_messages": true,
    "can_manage_delegates": false
  }', 'Tuteur légal - Parent avec droits complets', true),

  ('agent', 'athlete_delegation', '{
    "can_view_profile": true,
    "can_view_applications": true,
    "can_negotiate": true,
    "can_view_offers": true,
    "can_view_messages": true,
    "can_send_messages": true,
    "can_advise": true
  }', 'Agent sportif - Conseils et négociations', true),

  ('manager', 'athlete_delegation', '{
    "can_view_profile": true,
    "can_manage_career": true,
    "can_view_stats": true,
    "can_view_messages": true
  }', 'Manager - Gestion de carrière', true),

  ('coach', 'athlete_delegation', '{
    "can_view_profile": true,
    "can_view_stats": true,
    "can_provide_feedback": true
  }', 'Coach - Suivi et feedback', true)

ON CONFLICT (role_name) DO NOTHING;
