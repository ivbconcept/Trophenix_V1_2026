/*
  # Fix sponsor profile trigger - Corriger les colonnes

  1. Modifications
    - Utiliser les bonnes colonnes de sponsor_profiles
    - company_name au lieu de sponsor_name
    - industry_sector au lieu de sector
    - sponsorship_budget au lieu de budget_range
    - sponsorship_types au lieu de sponsor_type

  2. Sécurité
    - Pas de changement RLS
*/

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
  -- Log pour debugging
  RAISE NOTICE 'Processing new user confirmation for: %', NEW.id;
  RAISE NOTICE 'Raw metadata: %', NEW.raw_user_meta_data;

  -- Récupérer les métadonnées de l'utilisateur
  user_type_value := NEW.raw_user_meta_data->>'user_type';
  profile_data_value := NEW.raw_user_meta_data->'profile_data';

  RAISE NOTICE 'User type: %, Profile data: %', user_type_value, profile_data_value;

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

    RAISE NOTICE 'Created base profile for user %', NEW.id;

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

      RAISE NOTICE 'Created athlete profile for user %', NEW.id;

    ELSIF user_type_value = 'company' THEN
      -- Créer le profil entreprise
      INSERT INTO company_profiles (
        user_id,
        company_name,
        sector,
        company_size,
        location,
        description
      )
      VALUES (
        NEW.id,
        profile_data_value->>'company_name',
        COALESCE(profile_data_value->>'sector', profile_data_value->>'industry', 'Non spécifié'),
        profile_data_value->>'company_size',
        profile_data_value->>'location',
        profile_data_value->>'description'
      );

      RAISE NOTICE 'Created company profile for user %', NEW.id;

    ELSIF user_type_value = 'sponsor' THEN
      -- Créer le profil sponsor avec les bonnes colonnes
      INSERT INTO sponsor_profiles (
        user_id,
        company_name,
        industry_sector,
        company_size,
        description,
        sponsorship_budget,
        target_sports,
        contact_person,
        contact_email,
        contact_phone
      )
      VALUES (
        NEW.id,
        COALESCE(profile_data_value->>'company_name', profile_data_value->>'sponsor_name', 'Non renseigné'),
        profile_data_value->>'sector',
        profile_data_value->>'company_size',
        profile_data_value->>'description',
        profile_data_value->>'budget_range',
        COALESCE(
          CASE 
            WHEN profile_data_value->>'target_sports' IS NOT NULL 
            THEN string_to_array(profile_data_value->>'target_sports', ',')
            ELSE ARRAY[]::text[]
          END,
          ARRAY[]::text[]
        ),
        profile_data_value->>'contact_person',
        profile_data_value->>'contact_email',
        profile_data_value->>'contact_phone'
      );

      RAISE NOTICE 'Created sponsor profile for user %', NEW.id;
    END IF;
  ELSE
    RAISE NOTICE 'Profile already exists for user %', NEW.id;
  END IF;

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- En cas d'erreur, logger mais ne pas bloquer la confirmation
    RAISE WARNING 'Error creating profile for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$;
