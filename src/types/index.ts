/**
 * Type Definitions
 *
 * Ce fichier centralise toutes les définitions de types TypeScript de l'application.
 * Ces types correspondent à la structure de la base de données Supabase.
 *
 * IMPORTANT : Lors de modifications de la structure de la base de données :
 * 1. Créer une migration Supabase
 * 2. Mettre à jour les types correspondants ici
 * 3. Vérifier la compilation TypeScript (npm run typecheck)
 *
 * @module types
 */

/**
 * Types d'utilisateurs disponibles
 * @see constants/userTypes.ts pour la configuration
 */
export type UserType = 'athlete' | 'company' | 'admin';

/**
 * Statuts de validation des profils
 */
export type ValidationStatus = 'pending' | 'approved' | 'rejected';

/**
 * Profil utilisateur principal
 * Correspond à la table 'profiles' dans Supabase
 *
 * 🚀 COLONNES OPTIMISÉES POUR PERFORMANCE :
 * - is_admin : Cache synchronisé automatiquement (évite JOIN avec admin_team_members)
 * - admin_role : Nom du rôle admin si applicable (super_admin, moderator, etc.)
 */
export interface Profile {
  /** UUID de l'utilisateur (référence auth.users) */
  id: string;
  /** Email de l'utilisateur */
  email: string;
  /** Type d'utilisateur */
  user_type: UserType;
  /** Statut de validation par l'admin */
  validation_status: ValidationStatus;
  /** Date de création */
  created_at: string;
  /** Date de dernière modification */
  updated_at: string;
  /** Indicateur si l'utilisateur est membre de l'équipe admin (synchronisé auto) */
  is_admin?: boolean;
  /** Nom du rôle admin si applicable (super_admin, moderator, support, etc.) */
  admin_role?: string | null;
}

/**
 * Profil athlète détaillé
 * Correspond à la table 'athlete_profiles' dans Supabase
 *
 * Structure :
 * - Informations personnelles (first_name, last_name, etc.)
 * - Parcours sportif (sport, sport_level, etc.)
 * - Projet professionnel (desired_field, geographic_zone, etc.)
 */
export interface AthleteProfile {
  /** ID unique du profil */
  id: string;
  /** Référence vers profiles.id */
  user_id: string;

  // Informations personnelles
  first_name: string;
  last_name: string;
  birth_date?: string;
  nationality?: string;
  city_of_residence?: string;
  photo_url?: string;

  // Parcours sportif
  sport: string;
  situation?: string;
  athlete_type?: string;
  current_club?: string;
  birth_club?: string;
  training_center?: string;
  sport_level: string;
  ministerial_list?: string;
  achievements?: string;
  professional_history?: string;

  // Projet professionnel
  desired_field?: string;
  geographic_zone?: string;
  position_type?: string;
  availability?: string;
  degrees?: string;
  recommendations?: string;
  voice_note_url?: string;

  // Métadonnées
  created_at: string;
  updated_at: string;
}

/**
 * Profil entreprise détaillé
 * Correspond à la table 'company_profiles' dans Supabase
 */
export interface CompanyProfile {
  /** ID unique du profil */
  id: string;
  /** Référence vers profiles.id */
  user_id: string;

  // Informations entreprise
  company_name: string;
  logo_url?: string;
  sector: string;
  company_size?: string;
  location?: string;
  hr_contact?: string;
  description?: string;

  // Métadonnées
  created_at: string;
  updated_at: string;
}

/**
 * Événement de contact entre utilisateurs
 * Correspond à la table 'contact_events' dans Supabase
 *
 * Utilisé pour tracer qui a contacté qui et quand
 */
export interface ContactEvent {
  id: string;
  /** ID de l'athlète contacté */
  athlete_id: string;
  /** ID de celui qui contacte */
  contactor_id: string;
  /** Type de celui qui contacte */
  contactor_type: 'athlete' | 'company';
  /** Date du contact */
  contacted_at: string;
}

/**
 * Vue combinée : Profil athlète avec informations utilisateur
 * Utilisé pour afficher les athlètes avec leur statut de validation
 */
export interface AthleteWithProfile extends AthleteProfile {
  profile: Profile;
}

/**
 * Données du formulaire d'inscription athlète
 * Structure temporaire avant insertion en base de données
 */
export interface AthleteFormData {
  // Étape 1 : Qui je suis
  sport: string;
  situation: string;
  athlete_type: string;

  // Étape 2 : Mon parcours
  current_club: string;
  birth_club?: string;
  training_center?: string;
  sport_level: string;
  ministerial_list: string;

  // Étape 3 : Mon projet
  desired_field: string;
  geographic_zone: string;
  position_type: string;
  availability: string;

  // Étape 4 : Informations personnelles
  first_name: string;
  last_name: string;
  birth_date: string;
  nationality: string;
  city_of_residence: string;

  // Étape 5 : Compte
  email: string;
  password: string;
  password_confirm: string;
  terms_accepted: boolean;

  // Métadonnée interne pour la navigation
  _currentStep?: number;
}

/**
 * Données du formulaire d'inscription entreprise
 * Structure temporaire avant insertion en base de données
 */
export interface CompanyFormData {
  // Étape 1 : Informations générales
  company_name: string;
  sector: string;

  // Étape 2 : Détails
  company_size: string;
  location: string;
  hr_contact: string;

  // Étape 3 : Description
  description?: string;

  // Étape 4 : Compte
  email: string;
  password: string;
  password_confirm: string;
  terms_accepted: boolean;

  // Métadonnée interne pour la navigation
  _currentStep?: number;
}

/**
 * Callback pour exposer une fonction au composant parent
 * Utilisé pour la gestion du bouton "Retour" dans les formulaires
 */
export type BackHandlerCallback = (handler: () => void) => void;

// Export des types jobs et messages
export * from './jobs';
export * from './messages';
