/**
 * Authentication Service
 *
 * ⚠️ POINT D'INTÉGRATION BACKEND CRITIQUE ⚠️
 *
 * Ce service centralise TOUTE la logique métier liée à l'authentification.
 * Il agit comme une couche d'abstraction entre l'UI et le backend (actuellement Supabase).
 *
 * 🔄 POUR MIGRER VERS DJANGO/AUTRE BACKEND :
 *
 * 1. GARDER cette classe (ne pas la supprimer)
 * 2. REMPLACER uniquement les appels `supabase.*` par des appels API REST
 * 3. L'UI continuera de fonctionner sans modification
 *
 * Exemple de migration vers Django :
 * ```typescript
 * // Avant (Supabase)
 * const { data, error } = await supabase.auth.signUp({ email, password });
 *
 * // Après (Django REST)
 * const response = await fetch('/api/auth/register/', {
 *   method: 'POST',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify({ email, password })
 * });
 * const data = await response.json();
 * ```
 *
 * Avantages de cette architecture :
 * - ✅ Séparation complète UI <-> Backend
 * - ✅ Facilite les tests unitaires (mock du service)
 * - ✅ Changement de backend sans toucher aux composants
 * - ✅ Gestion centralisée des erreurs
 * - ✅ Typage fort TypeScript
 *
 * @see {@link ../lib/supabase.ts} - Client Supabase actuel
 * @see {@link z_README_DJANGO_INTEGRATION.md} - Guide migration Django
 * @module services/authService
 */

import { supabase } from '../lib/supabase';
import type { UserType, Profile, AthleteProfile, CompanyProfile } from '../types';

/**
 * Résultat d'une opération d'authentification
 */
interface AuthResult {
  success: boolean;
  error?: string;
  data?: any;
}

/**
 * Service d'authentification
 * Toutes les méthodes sont statiques pour faciliter l'utilisation
 */
export class AuthService {
  /**
   * Inscription d'un nouvel utilisateur
   *
   * @param email - Email de l'utilisateur
   * @param password - Mot de passe
   * @returns Résultat de l'opération
   */
  static async signUp(email: string, password: string): Promise<AuthResult> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      return {
        success: true,
        data,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Erreur lors de l\'inscription',
      };
    }
  }

  /**
   * Connexion d'un utilisateur existant
   *
   * @param email - Email de l'utilisateur
   * @param password - Mot de passe
   * @returns Résultat de l'opération
   */
  static async signIn(email: string, password: string): Promise<AuthResult> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      return {
        success: true,
        data,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Erreur lors de la connexion',
      };
    }
  }

  /**
   * Déconnexion de l'utilisateur courant
   *
   * @returns Résultat de l'opération
   */
  static async signOut(): Promise<AuthResult> {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Erreur lors de la déconnexion',
      };
    }
  }

  /**
   * Réinitialisation du mot de passe
   *
   * @param email - Email de l'utilisateur
   * @returns Résultat de l'opération
   */
  static async resetPassword(email: string): Promise<AuthResult> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Erreur lors de la réinitialisation',
      };
    }
  }

  /**
   * Récupération de l'utilisateur connecté
   *
   * @returns Utilisateur connecté ou null
   */
  static async getCurrentUser() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur:', error);
      return null;
    }
  }

  /**
   * Récupération du profil complet d'un utilisateur
   *
   * @param userId - ID de l'utilisateur
   * @returns Profil de l'utilisateur ou null
   */
  static async getUserProfile(userId: string): Promise<Profile | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('Erreur lors de la récupération du profil:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Erreur lors de la récupération du profil:', error);
      return null;
    }
  }

  /**
   * Création d'un profil utilisateur
   *
   * @param userId - ID de l'utilisateur
   * @param email - Email de l'utilisateur
   * @param userType - Type d'utilisateur (athlete, company, admin)
   * @returns Résultat de l'opération
   */
  static async createProfile(
    userId: string,
    email: string,
    userType: UserType
  ): Promise<AuthResult> {
    try {
      const { error } = await supabase.from('profiles').insert({
        id: userId,
        email,
        user_type: userType,
        validation_status: 'pending',
      });

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Erreur lors de la création du profil',
      };
    }
  }

  /**
   * Création d'un profil athlète détaillé
   *
   * @param userId - ID de l'utilisateur
   * @param profileData - Données du profil athlète
   * @returns Résultat de l'opération
   */
  static async createAthleteProfile(
    userId: string,
    profileData: Partial<AthleteProfile>
  ): Promise<AuthResult> {
    try {
      const { error } = await supabase.from('athlete_profiles').insert({
        user_id: userId,
        ...profileData,
      });

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Erreur lors de la création du profil athlète',
      };
    }
  }

  /**
   * Création d'un profil entreprise détaillé
   *
   * @param userId - ID de l'utilisateur
   * @param profileData - Données du profil entreprise
   * @returns Résultat de l'opération
   */
  static async createCompanyProfile(
    userId: string,
    profileData: Partial<CompanyProfile>
  ): Promise<AuthResult> {
    try {
      const { error } = await supabase.from('company_profiles').insert({
        user_id: userId,
        ...profileData,
      });

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Erreur lors de la création du profil entreprise',
      };
    }
  }
}
