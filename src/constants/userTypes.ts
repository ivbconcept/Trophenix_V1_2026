/**
 * User Types Configuration
 *
 * ⚠️ CONFIGURATION MÉTIER CENTRALE ⚠️
 *
 * Ce fichier centralise les types d'utilisateurs supportés par l'application.
 * C'est un point d'entrée critique pour comprendre l'architecture de l'app.
 *
 * 🔄 POUR AJOUTER UN NOUVEAU TYPE D'UTILISATEUR (ex: "Coach", "Parent") :
 *
 * Étape 1 : Ajouter dans USER_TYPES
 * ```typescript
 * export const USER_TYPES = {
 *   ATHLETE: 'athlete',
 *   COMPANY: 'company',
 *   COACH: 'coach', // ← Nouveau type
 * } as const;
 * ```
 *
 * Étape 2 : Créer la migration database
 * ```sql
 * -- supabase/migrations/YYYYMMDDHHMMSS_add_coach_profiles.sql
 * CREATE TABLE IF NOT EXISTS coach_profiles (
 *   id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 *   user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
 *   -- ... colonnes spécifiques
 * );
 * ```
 *
 * Étape 3 : Ajouter dans USER_TYPE_CONFIG
 * ```typescript
 * [USER_TYPES.COACH]: {
 *   label: 'Coach',
 *   description: 'Je suis un coach sportif',
 *   iconType: 'whistle',
 *   gradientFrom: 'blue-400',
 *   gradientTo: 'blue-500',
 *   onboardingSteps: 4,
 *   databaseTable: 'coach_profiles',
 * },
 * ```
 *
 * Étape 4 : Créer le composant d'onboarding
 * - Fichier : src/components/Auth/CoachOnboarding.tsx
 *
 * Étape 5 : Mettre à jour src/types/index.ts
 * ```typescript
 * export type UserType = 'athlete' | 'company' | 'admin' | 'coach';
 * ```
 *
 * 💡 Cette architecture permet d'ajouter des types sans toucher à la logique métier !
 *
 * @see {@link ../types/index.ts} - Types TypeScript correspondants
 * @see {@link z_README_DEVELOPER_GUIDE.md} - Guide ajout de features
 * @module constants/userTypes
 */

/**
 * Types d'utilisateurs disponibles dans l'application
 * @readonly
 */
export const USER_TYPES = {
  ATHLETE: 'athlete',
  COMPANY: 'company',
  SPONSOR: 'sponsor',
} as const;

/**
 * Type dérivé pour la validation TypeScript
 */
export type UserType = typeof USER_TYPES[keyof typeof USER_TYPES];

/**
 * Configuration des métadonnées pour chaque type d'utilisateur
 * Cette configuration permet d'ajouter facilement de nouveaux types d'utilisateurs
 * sans modifier la logique métier
 */
export const USER_TYPE_CONFIG = {
  [USER_TYPES.ATHLETE]: {
    label: 'Sportif',
    description: 'Je suis un athlète en activité ou en reconversion professionnelle',
    iconType: 'trophy',
    gradientFrom: 'teal-400',
    gradientTo: 'teal-500',
    onboardingSteps: 5,
    databaseTable: 'athlete_profiles',
  },
  [USER_TYPES.COMPANY]: {
    label: 'Employeur',
    description: 'Je recrute des athlètes pour mon entreprise',
    iconType: 'briefcase',
    gradientFrom: 'blue-400',
    gradientTo: 'blue-500',
    onboardingSteps: 4,
    databaseTable: 'company_profiles',
  },
  [USER_TYPES.SPONSOR]: {
    label: 'Sponsor',
    description: 'Je cherche à sponsoriser des athlètes',
    iconType: 'handshake',
    gradientFrom: 'amber-400',
    gradientTo: 'amber-500',
    onboardingSteps: 4,
    databaseTable: 'sponsor_profiles',
  },
} as const;

/**
 * Statuts de validation des profils utilisateurs
 * @readonly
 */
export const VALIDATION_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
} as const;

export type ValidationStatus = typeof VALIDATION_STATUS[keyof typeof VALIDATION_STATUS];
