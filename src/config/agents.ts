/**
 * Configuration du Système Multi-Agents
 *
 * ⚠️ CONFIGURATION CENTRALE DES AGENTS ⚠️
 *
 * Ce fichier centralise la configuration de TOUS les agents du système.
 *
 * Architecture multi-agents :
 * - Plusieurs agents spécialisés
 * - Transfert intelligent entre agents
 * - Routage automatique selon le contexte
 * - Collaboration entre agents
 *
 * 🔄 POUR AJOUTER UN NOUVEL AGENT :
 *
 * 1. Définir sa config ici
 * 2. Créer son service dans src/services/agents/[nom]Service.ts
 * 3. L'ajouter dans AGENTS_CONFIG
 * 4. Optionnel : créer un composant UI dédié
 *
 * @module config/agents
 */

import type { AgentConfig, AgentType } from '../types/agents';

/**
 * Configuration de tous les agents disponibles
 *
 * Chaque agent a :
 * - Un rôle spécifique
 * - Des capacités définies
 * - Une priorité (pour le routage)
 * - Des agents cibles pour le transfert
 */
export const AGENTS_CONFIG: Record<AgentType, AgentConfig> = {
  /**
   * Elea - Assistant Général
   *
   * Agent principal, généraliste, gère l'onboarding et les questions de base
   */
  elea: {
    type: 'elea',
    name: 'Elea',
    role: 'general_assistant',
    avatar: '🤖',
    description: 'Votre assistante personnelle Trophenix',
    enabled: true,
    apiEndpoint: '/api/ai/agents/elea/chat',
    capabilities: [
      'onboarding_assistance',
      'general_questions',
      'form_help',
      'navigation_guide',
      'faq_response',
    ],
    priority: 1, // Agent par défaut
    canHandoff: true,
    handoffTargets: ['recruiter', 'career_advisor', 'admin_assistant'],
  },

  /**
   * RecruiterBot - Agent Recruteur
   *
   * Spécialisé dans le matching athlètes/entreprises et recommandations
   */
  recruiter: {
    type: 'recruiter',
    name: 'RecruiterBot',
    role: 'recruiter',
    avatar: '🎯',
    description: 'Expert en matching et recommandations de profils',
    enabled: false, // V2 feature
    apiEndpoint: '/api/ai/agents/recruiter/chat',
    capabilities: [
      'profile_matching',
      'candidate_recommendation',
      'job_suggestion',
      'skills_analysis',
      'market_insights',
    ],
    priority: 2,
    canHandoff: true,
    handoffTargets: ['elea', 'career_advisor'],
  },

  /**
   * CareerAdvisor - Conseiller Carrière
   *
   * Spécialisé dans les conseils de reconversion et développement professionnel
   */
  career_advisor: {
    type: 'career_advisor',
    name: 'CareerAdvisor',
    role: 'career_advisor',
    avatar: '📈',
    description: 'Conseiller en reconversion et développement de carrière',
    enabled: false, // V2 feature
    apiEndpoint: '/api/ai/agents/career/chat',
    capabilities: [
      'career_advice',
      'skills_assessment',
      'training_recommendations',
      'transition_planning',
      'goal_setting',
    ],
    priority: 2,
    canHandoff: true,
    handoffTargets: ['elea', 'recruiter'],
  },

  /**
   * AdminAssistant - Assistant Admin
   *
   * Spécialisé dans l'aide aux administrateurs de la plateforme
   */
  admin_assistant: {
    type: 'admin_assistant',
    name: 'AdminBot',
    role: 'admin_helper',
    avatar: '⚙️',
    description: 'Assistant pour les administrateurs',
    enabled: false, // V2 feature
    apiEndpoint: '/api/ai/agents/admin/chat',
    capabilities: [
      'user_management',
      'validation_workflow',
      'platform_analytics',
      'moderation_support',
      'technical_guidance',
    ],
    priority: 3,
    canHandoff: true,
    handoffTargets: ['elea'],
  },
};

/**
 * Obtenir la configuration d'un agent
 *
 * @param agentType - Type de l'agent
 * @returns Configuration de l'agent
 */
export function getAgentConfig(agentType: AgentType): AgentConfig {
  return AGENTS_CONFIG[agentType];
}

/**
 * Obtenir tous les agents activés
 *
 * @returns Liste des agents activés
 */
export function getEnabledAgents(): AgentConfig[] {
  return Object.values(AGENTS_CONFIG).filter((agent) => agent.enabled);
}

/**
 * Vérifier si un agent est activé
 *
 * @param agentType - Type de l'agent
 * @returns true si l'agent est activé
 */
export function isAgentEnabled(agentType: AgentType): boolean {
  return AGENTS_CONFIG[agentType]?.enabled ?? false;
}

/**
 * Routage intelligent : choisir le meilleur agent selon le contexte
 *
 * Logique de routage :
 * 1. Si contexte spécifique → agent spécialisé
 * 2. Sinon → agent par défaut (Elea)
 *
 * @param message - Message de l'utilisateur
 * @param context - Contexte actuel
 * @returns Type de l'agent à utiliser
 */
export function routeToAgent(message: string, context: any): AgentType {
  const messageLower = message.toLowerCase();

  // Keywords pour le RecruiterBot
  const recruiterKeywords = [
    'profil',
    'candidat',
    'recrutement',
    'matching',
    'recommandation',
    'poste',
    'offre',
    'cherche un athlète',
  ];
  if (
    isAgentEnabled('recruiter') &&
    recruiterKeywords.some((keyword) => messageLower.includes(keyword))
  ) {
    return 'recruiter';
  }

  // Keywords pour le CareerAdvisor
  const careerKeywords = [
    'reconversion',
    'carrière',
    'formation',
    'compétence',
    'conseil',
    'objectif',
    'projet professionnel',
    'transition',
  ];
  if (
    isAgentEnabled('career_advisor') &&
    careerKeywords.some((keyword) => messageLower.includes(keyword))
  ) {
    return 'career_advisor';
  }

  // Keywords pour l'AdminAssistant
  const adminKeywords = [
    'validation',
    'modération',
    'admin',
    'gestion utilisateur',
    'statistique',
  ];
  if (
    isAgentEnabled('admin_assistant') &&
    context.userType === 'admin' &&
    adminKeywords.some((keyword) => messageLower.includes(keyword))
  ) {
    return 'admin_assistant';
  }

  // Par défaut : Elea
  return 'elea';
}

/**
 * Décider si un agent doit transférer vers un autre
 *
 * Logique de handoff :
 * - Si l'agent ne peut pas répondre → transfert
 * - Si question hors de son domaine → transfert
 * - Si confiance faible → transfert
 *
 * @param currentAgent - Agent actuel
 * @param message - Message de l'utilisateur
 * @param confidence - Confiance dans la réponse (0-1)
 * @returns Décision de transfert
 */
export function shouldHandoff(
  currentAgent: AgentType,
  message: string,
  confidence: number
): { shouldHandoff: boolean; targetAgent?: AgentType; reason?: string } {
  // Si confiance très faible, transférer à Elea (généraliste)
  if (confidence < 0.3 && currentAgent !== 'elea') {
    return {
      shouldHandoff: true,
      targetAgent: 'elea',
      reason: 'Je ne suis pas sûr de pouvoir bien répondre. Je vous transfère à Elea.',
    };
  }

  // Détecter si la question nécessite un autre agent
  const routedAgent = routeToAgent(message, {});
  if (routedAgent !== currentAgent) {
    const targetConfig = getAgentConfig(routedAgent);
    return {
      shouldHandoff: true,
      targetAgent: routedAgent,
      reason: `Cette question est mieux traitée par ${targetConfig.name}. Je vous transfère !`,
    };
  }

  return { shouldHandoff: false };
}

/**
 * Messages de transition lors du transfert entre agents
 */
export const HANDOFF_MESSAGES: Record<string, string> = {
  elea_to_recruiter:
    "Je vous mets en contact avec RecruiterBot, notre expert en matching et recommandations ! 🎯",
  elea_to_career:
    "Je vous transfère à CareerAdvisor, notre conseiller en reconversion professionnelle ! 📈",
  elea_to_admin:
    "Je vous connecte avec AdminBot pour vous aider avec les outils d'administration ! ⚙️",
  recruiter_to_elea:
    "Je vous redonne à Elea pour les questions générales ! 🤖",
  career_to_elea:
    "Je vous repasse à Elea, notre assistante principale ! 🤖",
  admin_to_elea:
    "Je vous redirige vers Elea pour la suite ! 🤖",
};

/**
 * Obtenir le message de transition entre deux agents
 *
 * @param from - Agent source
 * @param to - Agent cible
 * @returns Message de transition
 */
export function getHandoffMessage(from: AgentType, to: AgentType): string {
  const key = `${from}_to_${to}`;
  return HANDOFF_MESSAGES[key] || `Je vous transfère à ${getAgentConfig(to).name} !`;
}
