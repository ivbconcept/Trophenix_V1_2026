/*
  # Créer le Premier Super Admin Trophenix

  ## Instructions pour créer votre compte Super Admin

  1. Créez d'abord un compte normal sur la plateforme avec l'email que vous voulez utiliser
  2. Une fois le compte créé, exécutez cette commande SQL en remplaçant 'votre-email@trophenix.com' :

  ```sql
  -- Trouver l'ID de votre utilisateur
  SELECT id, email FROM auth.users WHERE email = 'votre-email@trophenix.com';

  -- Copier l'ID et l'utiliser dans cette requête
  INSERT INTO profiles (id, email, user_type, validation_status, created_at)
  VALUES (
    'VOTRE_USER_ID_ICI',
    'votre-email@trophenix.com',
    'admin',
    'approved',
    now()
  )
  ON CONFLICT (id)
  DO UPDATE SET
    user_type = 'admin',
    validation_status = 'approved';

  -- Ajouter à l'équipe admin avec le rôle super_admin
  INSERT INTO admin_team_members (user_id, role_id, status, invited_at)
  SELECT
    'VOTRE_USER_ID_ICI',
    ar.id,
    'active',
    now()
  FROM admin_roles ar
  WHERE ar.name = 'super_admin'
  ON CONFLICT (user_id) DO NOTHING;
  ```

  ## Accès à l'espace admin

  Une fois configuré, connectez-vous avec cet email sur :
  - URL: https://votre-domaine.com/admin
  - L'espace admin s'affichera automatiquement

  ## Important

  - Gardez ces identifiants en sécurité
  - Ce compte a un accès complet à la plateforme
  - Utilisez-le pour inviter d'autres membres de l'équipe Trophenix
*/

-- Fonction helper pour créer un super admin rapidement
CREATE OR REPLACE FUNCTION create_super_admin(admin_email text)
RETURNS void AS $$
DECLARE
  user_id uuid;
  role_id uuid;
BEGIN
  -- Trouver l'utilisateur
  SELECT id INTO user_id
  FROM auth.users
  WHERE email = admin_email;

  IF user_id IS NULL THEN
    RAISE EXCEPTION 'Utilisateur avec email % introuvable. Créez d''abord le compte.', admin_email;
  END IF;

  -- Créer ou mettre à jour le profil
  INSERT INTO profiles (id, email, user_type, validation_status, created_at)
  VALUES (user_id, admin_email, 'admin', 'approved', now())
  ON CONFLICT (id)
  DO UPDATE SET
    user_type = 'admin',
    validation_status = 'approved';

  -- Trouver le rôle super_admin
  SELECT id INTO role_id
  FROM admin_roles
  WHERE name = 'super_admin';

  -- Ajouter à l'équipe admin
  INSERT INTO admin_team_members (user_id, role_id, status, invited_at)
  VALUES (user_id, role_id, 'active', now())
  ON CONFLICT (user_id)
  DO UPDATE SET
    role_id = role_id,
    status = 'active';

  RAISE NOTICE 'Super admin créé avec succès pour %', admin_email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Exemple d'utilisation (décommentez et remplacez l'email) :
-- SELECT create_super_admin('votre-email@trophenix.com');
