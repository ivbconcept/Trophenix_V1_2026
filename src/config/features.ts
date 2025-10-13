/**
 * Configuration des fonctionnalités par version
 *
 * ⚠️ STRATÉGIE V1 / V2 ⚠️
 *
 * Ce fichier permet d'activer/désactiver des fonctionnalités sans modifier le code.
 * Utilisé pour préparer des fonctionnalités en V1 (cachées) et les activer en V2.
 *
 * Exemple : Agent Elea
 * - V1 : AGENT_ELEA_ENABLED = false (code présent mais invisible)
 * - V2 : AGENT_ELEA_ENABLED = true (activation par simple toggle)
 *
 * Avantages :
 * - Pas de redéveloppement entre V1 et V2
 * - Testable en V1 en activant temporairement
 * - Activation rapide en production
 *
 * @module config/features
 */

export const FEATURES = {
  /**
   * Agent Elea - Assistant IA
   *
   * V1: false (invisible, mais code présent)
   * V2: true (visible et actif)
   *
   * Fonctionnalités de l'agent :
   * - Guide l'utilisateur lors de l'onboarding
   * - Répond aux questions en temps réel
   * - Propose des suggestions contextuelles
   * - S'adapte à chaque étape du parcours
   */
  AGENT_ELEA_ENABLED: true,

  /**
   * Chat en temps réel entre utilisateurs
   *
   * V1: false
   * V2: true
   */
  REALTIME_CHAT_ENABLED: false,

  /**
   * Recommandations IA personnalisées
   *
   * Suggestions de profils, postes, etc. par IA
   */
  AI_RECOMMENDATIONS_ENABLED: false,

  /**
   * Analytics avancées
   *
   * Tableaux de bord détaillés pour les admins
   */
  ADVANCED_ANALYTICS_ENABLED: false,

  /**
   * Mode debug
   *
   * Affiche des logs supplémentaires en développement
   */
  DEBUG_MODE: import.meta.env.DEV,
} as const;

/**
 * Helper pour vérifier si une fonctionnalité est active
 *
 * @param feature - Nom de la fonctionnalité
 * @returns true si la fonctionnalité est activée
 *
 * @example
 * ```typescript
 * if (isFeatureEnabled('AGENT_ELEA_ENABLED')) {
 *   // Afficher l'agent
 * }
 * ```
 */
export function isFeatureEnabled(feature: keyof typeof FEATURES): boolean {
  return FEATURES[feature] === true;
}

/**
 * Log conditionnel en mode debug
 *
 * @param message - Message à logger
 * @param data - Données optionnelles
 */
export function debugLog(message: string, data?: any): void {
  if (FEATURES.DEBUG_MODE) {
    console.log(`[DEBUG] ${message}`, data || '');
  }
}
