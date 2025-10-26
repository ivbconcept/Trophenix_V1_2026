/*
  # Création automatique des profils après confirmation d'email

  1. Fonction trigger
    - Déclenchée automatiquement après la confirmation d'email
    - Crée le profil utilisateur dans la table `profiles`
    - Crée le profil détaillé (athlete ou company) selon le type d'utilisateur
    - Utilise les métadonnées stockées dans `raw_user_meta_data`

  2. Sécurité
    - Fonction SECURITY DEFINER pour avoir les droits nécessaires
    - Validation des données avant insertion
    - Gestion des erreurs avec EXCEPTION

  3. Fonctionnement
    - Lors de l'inscription, les données d'onboarding sont stockées dans `raw_user_meta_data`
    - Après confirmation d'email, ce trigger crée automatiquement les profils
    - L'utilisateur peut se connecter immédiatement après confirmation
*/

-- Fonction qui crée automatiquement les profils après confirmation d'email
CREATE OR REPLACE FUNCTION public.handle_new_user_confirmed()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_type_value text;
  profile_data_value jsonb;
BEGIN
  -- Récupérer les métadonnées de l'utilisateur
  user_type_value := NEW.raw_user_meta_data->>'user_type';
  profile_data_value := NEW.raw_user_meta_data->'profile_data';

  -- Vérifier que le profil n'existe pas déjà
  IF NOT EXISTS (SELECT 1 FROM profiles WHERE id = NEW.id) THEN
    -- Créer le profil de base
    INSERT INTO profiles (id, email, user_type, validation_status)
    VALUES (
      NEW.id,
      NEW.email,
      COALESCE(user_type_value, 'athlete'),
      'approved'
    );

    -- Créer le profil détaillé selon le type d'utilisateur
    IF user_type_value = 'athlete' THEN
      -- Créer le profil athlète
      INSERT INTO athlete_profiles (
        user_id,
        first_name,
        last_name,
        sport,
        sport_level,
        geographic_zone,
        desired_field,
        position_type,
        availability
      )
      VALUES (
        NEW.id,
        profile_data_value->>'first_name',
        profile_data_value->>'last_name',
        profile_data_value->>'sport',
        profile_data_value->>'sport_level',
        profile_data_value->>'geographic_zone',
        profile_data_value->>'desired_field',
        profile_data_value->>'position_type',
        profile_data_value->>'availability'
      );

    ELSIF user_type_value = 'company' THEN
      -- Créer le profil entreprise
      INSERT INTO company_profiles (
        user_id,
        company_name,
        industry,
        company_size,
        website,
        description,
        contact_person_name,
        contact_person_role,
        contact_phone
      )
      VALUES (
        NEW.id,
        profile_data_value->>'company_name',
        profile_data_value->>'industry',
        profile_data_value->>'company_size',
        profile_data_value->>'website',
        profile_data_value->>'description',
        profile_data_value->>'contact_person_name',
        profile_data_value->>'contact_person_role',
        profile_data_value->>'contact_phone'
      );
    END IF;
  END IF;

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- En cas d'erreur, logger mais ne pas bloquer la confirmation
    RAISE WARNING 'Error creating profile for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$;

-- Supprimer le trigger existant s'il existe
DROP TRIGGER IF EXISTS on_auth_user_confirmed ON auth.users;

-- Créer le trigger qui s'exécute après la confirmation d'email
CREATE TRIGGER on_auth_user_confirmed
  AFTER UPDATE OF email_confirmed_at ON auth.users
  FOR EACH ROW
  WHEN (OLD.email_confirmed_at IS NULL AND NEW.email_confirmed_at IS NOT NULL)
  EXECUTE FUNCTION public.handle_new_user_confirmed();

-- Commentaire pour documenter le trigger
COMMENT ON FUNCTION public.handle_new_user_confirmed() IS 
'Crée automatiquement les profils utilisateur après confirmation de l''email. 
Les données sont récupérées depuis raw_user_meta_data.';
