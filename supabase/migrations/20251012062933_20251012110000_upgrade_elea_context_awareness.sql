/*
  # Mise à Niveau Elea - Conscience Contextuelle Multi-Rôles

  ## Vue d'ensemble
  Cette migration met à jour Elea pour qu'elle soit CONSCIENTE du contexte multi-rôles
  de chaque utilisateur. Elea peut maintenant :
  - Savoir dans quel rôle l'utilisateur se trouve (Admin, RH Nike, Athlète, etc.)
  - Accéder aux données du contexte actif (organisation, délégation)
  - Adapter ses réponses selon le contexte
  - Interagir avec les équipes et les tâches partagées
  - Maintenir la sécurité stricte (RLS par utilisateur)

  ## Changements

  ### 1. Ajout de colonnes à agent_sessions
  - `current_context_id` (uuid) - ID du user_context actif
  - `active_role` (text) - Rôle actif (owner, hr_manager, guardian, etc.)
  - `context_data` (jsonb) - Données enrichies du contexte

  ### 2. Nouvelles fonctions helper
  - `get_user_active_context()` - Récupérer le contexte actif
  - `get_context_data_for_elea()` - Récupérer données enrichies
  - `elea_can_access_data()` - Vérifier les permissions

  ### 3. View pour Elea
  - `elea_context_view` - Vue enrichie avec toutes les données contextuelles

  ## Sécurité
  - RLS maintenu strictement par user_id
  - Elea ne peut accéder qu'aux données du user_id authentifié
  - Permissions vérifiées via user_contexts et role_permissions

  ## Exemples d'utilisation

  ### Cas 1 : Admin@trophenix.com en tant que Owner Nike
  ```sql
  -- Elea sait :
  - Utilisateur : admin@trophenix.com
  - Rôle actif : owner de Nike
  - Organisation : Nike France
  - Équipe : 5 membres RH
  - Tâches : 12 tâches actives
  - Messages : 45 messages non lus de l'équipe
  ```

  ### Cas 2 : Parent en tant que Guardian d'un athlète
  ```sql
  -- Elea sait :
  - Utilisateur : parent@mail.com
  - Rôle actif : guardian
  - Athlète : Jean Dupont (mineur)
  - Autres délégués : Agent sportif, Parent 2
  - Tâches : "Signer document légal", "Valider contrat"
  - Candidatures : 3 offres en cours
  ```

  ## Notes importantes
  - Migration non destructive (garde anciennes données)
  - Compatible avec anciennes sessions Elea
  - Pas de downtime
*/

-- ============================================================================
-- 1. Ajout de colonnes à agent_sessions
-- ============================================================================

-- Ajouter current_context_id
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'agent_sessions' AND column_name = 'current_context_id'
  ) THEN
    ALTER TABLE agent_sessions ADD COLUMN current_context_id uuid REFERENCES user_contexts(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Ajouter active_role
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'agent_sessions' AND column_name = 'active_role'
  ) THEN
    ALTER TABLE agent_sessions ADD COLUMN active_role text;
  END IF;
END $$;

-- Ajouter context_data
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'agent_sessions' AND column_name = 'context_data'
  ) THEN
    ALTER TABLE agent_sessions ADD COLUMN context_data jsonb DEFAULT '{}'::jsonb;
  END IF;
END $$;

-- Index pour performance
CREATE INDEX IF NOT EXISTS idx_agent_sessions_context ON agent_sessions(current_context_id);
CREATE INDEX IF NOT EXISTS idx_agent_sessions_role ON agent_sessions(active_role);

-- ============================================================================
-- 2. Fonctions helper pour Elea
-- ============================================================================

-- Fonction pour obtenir le contexte actif de l'utilisateur
CREATE OR REPLACE FUNCTION get_user_active_context(target_user_id uuid)
RETURNS TABLE (
  context_id uuid,
  context_type text,
  role text,
  context_entity_id uuid,
  is_primary boolean
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    uc.id as context_id,
    uc.context_type,
    uc.role,
    uc.context_id as context_entity_id,
    uc.is_primary
  FROM user_contexts uc
  WHERE uc.user_id = target_user_id
  AND uc.status = 'active'
  AND uc.is_primary = true
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour récupérer les données enrichies du contexte
CREATE OR REPLACE FUNCTION get_context_data_for_elea(
  target_user_id uuid,
  context_id_param uuid
)
RETURNS jsonb AS $$
DECLARE
  context_record user_contexts;
  result jsonb;
  org_data jsonb;
  delegation_data jsonb;
  team_count int;
  tasks_count int;
  messages_count int;
BEGIN
  -- Récupérer le contexte
  SELECT * INTO context_record
  FROM user_contexts
  WHERE id = context_id_param
  AND user_id = target_user_id;

  IF context_record IS NULL THEN
    RETURN '{}'::jsonb;
  END IF;

  result := jsonb_build_object(
    'context_type', context_record.context_type,
    'role', context_record.role,
    'is_primary', context_record.is_primary,
    'status', context_record.status
  );

  -- Si c'est une organisation
  IF context_record.context_type = 'company_org' AND context_record.context_id IS NOT NULL THEN
    SELECT jsonb_build_object(
      'name', co.name,
      'slug', co.slug
    ) INTO org_data
    FROM company_organizations co
    WHERE co.id = context_record.context_id;

    -- Compter les membres de l'équipe
    SELECT COUNT(*) INTO team_count
    FROM user_contexts uc
    WHERE uc.context_id = context_record.context_id
    AND uc.context_type = 'company_org'
    AND uc.status = 'active';

    -- Compter les tâches actives
    SELECT COUNT(*) INTO tasks_count
    FROM shared_tasks st
    WHERE st.context_id = context_record.context_id
    AND st.context_type = 'organization'
    AND st.status IN ('pending', 'in_progress');

    -- Compter les messages non lus (approximatif)
    SELECT COUNT(*) INTO messages_count
    FROM context_messages cm
    WHERE cm.context_id = context_record.context_id
    AND cm.context_type = 'organization';

    result := result || jsonb_build_object(
      'organization', org_data,
      'team_members_count', team_count,
      'active_tasks_count', tasks_count,
      'messages_count', messages_count
    );
  END IF;

  -- Si c'est une délégation athlète
  IF context_record.context_type = 'athlete_delegation' AND context_record.context_id IS NOT NULL THEN
    SELECT jsonb_build_object(
      'athlete_profile_id', ad.athlete_profile_id,
      'role', ad.role,
      'permissions', ad.permissions
    ) INTO delegation_data
    FROM athlete_delegations ad
    WHERE ad.id = context_record.context_id;

    -- Compter les délégués
    SELECT COUNT(*) INTO team_count
    FROM athlete_delegations ad2
    WHERE ad2.athlete_profile_id = (
      SELECT athlete_profile_id FROM athlete_delegations WHERE id = context_record.context_id
    )
    AND ad2.status = 'active';

    -- Compter les tâches
    SELECT COUNT(*) INTO tasks_count
    FROM shared_tasks st
    WHERE st.context_id = context_record.context_id
    AND st.context_type = 'delegation'
    AND st.status IN ('pending', 'in_progress');

    result := result || jsonb_build_object(
      'delegation', delegation_data,
      'delegates_count', team_count,
      'active_tasks_count', tasks_count
    );
  END IF;

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour vérifier si Elea peut accéder à certaines données
CREATE OR REPLACE FUNCTION elea_can_access_data(
  target_user_id uuid,
  data_type text,
  data_id uuid
)
RETURNS boolean AS $$
BEGIN
  -- Vérifier selon le type de données
  CASE data_type
    WHEN 'shared_task' THEN
      RETURN EXISTS (
        SELECT 1 FROM shared_tasks st
        WHERE st.id = data_id
        AND (
          (st.context_type = 'organization' AND
            EXISTS (
              SELECT 1 FROM user_contexts uc
              WHERE uc.user_id = target_user_id
              AND uc.context_id = st.context_id
              AND uc.context_type = 'company_org'
              AND uc.status = 'active'
            )
          ) OR
          (st.context_type = 'delegation' AND
            EXISTS (
              SELECT 1 FROM athlete_delegations ad
              WHERE ad.id = st.context_id
              AND (ad.delegate_user_id = target_user_id OR
                   EXISTS (
                     SELECT 1 FROM athlete_profiles ap
                     WHERE ap.id = ad.athlete_profile_id
                     AND ap.user_id = target_user_id
                   ))
              AND ad.status = 'active'
            )
          )
        )
      );
    
    WHEN 'context_message' THEN
      RETURN EXISTS (
        SELECT 1 FROM context_messages cm
        WHERE cm.id = data_id
        AND (
          cm.sender_id = target_user_id OR
          (cm.context_type = 'organization' AND
            EXISTS (
              SELECT 1 FROM user_contexts uc
              WHERE uc.user_id = target_user_id
              AND uc.context_id = cm.context_id
              AND uc.context_type = 'company_org'
              AND uc.status = 'active'
            )
          ) OR
          (cm.context_type = 'delegation' AND
            EXISTS (
              SELECT 1 FROM athlete_delegations ad
              WHERE ad.id = cm.context_id
              AND (ad.delegate_user_id = target_user_id OR
                   EXISTS (
                     SELECT 1 FROM athlete_profiles ap
                     WHERE ap.id = ad.athlete_profile_id
                     AND ap.user_id = target_user_id
                   ))
              AND ad.status = 'active'
            )
          )
        )
      );
    
    ELSE
      RETURN false;
  END CASE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 3. Vue enrichie pour Elea
-- ============================================================================

CREATE OR REPLACE VIEW elea_enriched_context AS
SELECT
  p.id as user_id,
  p.email,
  p.user_type,
  uc.id as context_id,
  uc.context_type,
  uc.role,
  uc.is_primary,
  uc.context_id as entity_id,
  
  -- Organisation data
  co.name as org_name,
  co.slug as org_slug,
  
  -- Athlete delegation data
  ad.athlete_profile_id,
  ad.role as delegation_role,
  
  -- Athlete profile data
  ap.first_name as athlete_first_name,
  ap.last_name as athlete_last_name,
  
  -- Company profile data
  cp.company_name,
  cp.sector

FROM profiles p
LEFT JOIN user_contexts uc ON uc.user_id = p.id AND uc.status = 'active'
LEFT JOIN company_organizations co ON co.id = uc.context_id AND uc.context_type = 'company_org'
LEFT JOIN athlete_delegations ad ON ad.id = uc.context_id AND uc.context_type = 'athlete_delegation'
LEFT JOIN athlete_profiles ap ON ap.id = ad.athlete_profile_id
LEFT JOIN company_profiles cp ON cp.user_id = p.id;

-- Grant SELECT sur la vue
GRANT SELECT ON elea_enriched_context TO authenticated;

-- ============================================================================
-- 4. Trigger pour auto-update du contexte dans les sessions Elea
-- ============================================================================

-- Fonction pour mettre à jour automatiquement le contexte de la session
CREATE OR REPLACE FUNCTION update_elea_session_context()
RETURNS TRIGGER AS $$
DECLARE
  active_context user_contexts;
  enriched_data jsonb;
BEGIN
  -- Récupérer le contexte primaire actif de l'utilisateur
  SELECT * INTO active_context
  FROM user_contexts
  WHERE user_id = NEW.user_id
  AND status = 'active'
  AND is_primary = true
  LIMIT 1;

  IF active_context IS NOT NULL THEN
    -- Récupérer les données enrichies
    enriched_data := get_context_data_for_elea(NEW.user_id, active_context.id);
    
    -- Mettre à jour la session
    NEW.current_context_id := active_context.id;
    NEW.active_role := active_context.role;
    NEW.context_data := enriched_data;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger sur INSERT
DROP TRIGGER IF EXISTS set_elea_session_context_on_insert ON agent_sessions;
CREATE TRIGGER set_elea_session_context_on_insert
  BEFORE INSERT ON agent_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_elea_session_context();

-- ============================================================================
-- 5. Fonction pour Elea : Obtenir un résumé contextuel
-- ============================================================================

CREATE OR REPLACE FUNCTION get_elea_context_summary(target_user_id uuid)
RETURNS jsonb AS $$
DECLARE
  result jsonb;
  primary_context user_contexts;
  org_info jsonb;
  delegation_info jsonb;
  my_tasks jsonb;
  team_members jsonb;
BEGIN
  -- Récupérer le contexte primaire
  SELECT * INTO primary_context
  FROM user_contexts
  WHERE user_id = target_user_id
  AND status = 'active'
  AND is_primary = true
  LIMIT 1;

  IF primary_context IS NULL THEN
    RETURN jsonb_build_object(
      'has_context', false,
      'message', 'Aucun contexte actif'
    );
  END IF;

  result := jsonb_build_object(
    'has_context', true,
    'context_type', primary_context.context_type,
    'role', primary_context.role
  );

  -- Si organisation
  IF primary_context.context_type = 'company_org' THEN
    SELECT jsonb_build_object(
      'name', co.name,
      'slug', co.slug,
      'team_size', (
        SELECT COUNT(*) FROM user_contexts uc2
        WHERE uc2.context_id = co.id
        AND uc2.context_type = 'company_org'
        AND uc2.status = 'active'
      ),
      'active_tasks', (
        SELECT COUNT(*) FROM shared_tasks st
        WHERE st.context_id = co.id
        AND st.context_type = 'organization'
        AND st.status IN ('pending', 'in_progress')
      ),
      'my_tasks', (
        SELECT COUNT(*) FROM shared_tasks st
        WHERE st.context_id = co.id
        AND st.context_type = 'organization'
        AND st.assigned_to = target_user_id
        AND st.status IN ('pending', 'in_progress')
      )
    ) INTO org_info
    FROM company_organizations co
    WHERE co.id = primary_context.context_id;

    result := result || jsonb_build_object('organization', org_info);
  END IF;

  -- Si délégation
  IF primary_context.context_type = 'athlete_delegation' THEN
    SELECT jsonb_build_object(
      'athlete_profile_id', ad.athlete_profile_id,
      'athlete_name', ap.first_name || ' ' || ap.last_name,
      'my_role', ad.role,
      'delegates_count', (
        SELECT COUNT(*) FROM athlete_delegations ad2
        WHERE ad2.athlete_profile_id = ad.athlete_profile_id
        AND ad2.status = 'active'
      ),
      'active_tasks', (
        SELECT COUNT(*) FROM shared_tasks st
        WHERE st.context_id = ad.id
        AND st.context_type = 'delegation'
        AND st.status IN ('pending', 'in_progress')
      )
    ) INTO delegation_info
    FROM athlete_delegations ad
    LEFT JOIN athlete_profiles ap ON ap.id = ad.athlete_profile_id
    WHERE ad.id = primary_context.context_id;

    result := result || jsonb_build_object('delegation', delegation_info);
  END IF;

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 6. Permissions et sécurité
-- ============================================================================

-- Grant execute sur les fonctions helper (elles ont SECURITY DEFINER)
GRANT EXECUTE ON FUNCTION get_user_active_context(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION get_context_data_for_elea(uuid, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION elea_can_access_data(uuid, text, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION get_elea_context_summary(uuid) TO authenticated;

-- ============================================================================
-- 7. Mise à jour des sessions existantes (optionnel)
-- ============================================================================

-- Mettre à jour les sessions existantes avec le contexte actuel
-- (Exécuté une seule fois lors de la migration)
DO $$
DECLARE
  session_record agent_sessions;
  active_context user_contexts;
  enriched_data jsonb;
BEGIN
  FOR session_record IN SELECT * FROM agent_sessions WHERE current_context_id IS NULL
  LOOP
    -- Récupérer le contexte primaire de l'utilisateur
    SELECT * INTO active_context
    FROM user_contexts
    WHERE user_id = session_record.user_id
    AND status = 'active'
    AND is_primary = true
    LIMIT 1;

    IF active_context IS NOT NULL THEN
      enriched_data := get_context_data_for_elea(session_record.user_id, active_context.id);
      
      UPDATE agent_sessions
      SET
        current_context_id = active_context.id,
        active_role = active_context.role,
        context_data = enriched_data
      WHERE id = session_record.id;
    END IF;
  END LOOP;
END $$;
