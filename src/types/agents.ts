/**
 * Types pour le Système Multi-Agents
 *
 * ⚠️ ARCHITECTURE SCALABLE MULTI-AGENTS ⚠️
 *
 * Ce fichier définit l'architecture permettant d'avoir PLUSIEURS agents
 * qui peuvent collaborer entre eux.
 *
 * Scénarios d'usage :
 * - Agent Elea (assistant général)
 * - Agent RecruiterBot (recommandations de profils)
 * - Agent CareerAdvisor (conseils carrière)
 * - Agents qui se passent le relais selon le contexte
 *
 * @module types/agents
 */

/**
 * Types d'agents disponibles dans le système
 *
 * 🔄 POUR AJOUTER UN NOUVEL AGENT :
 * 1. Ajouter son type ici
 * 2. Créer sa config dans src/config/agents.ts
 * 3. Implémenter son service dans src/services/agents/
 * 4. Créer son composant UI si besoin
 */
export type AgentType = 'elea' | 'recruiter' | 'career_advisor' | 'admin_assistant';

/**
 * Rôles qu'un agent peut avoir
 */
export type AgentRole =
  | 'general_assistant'      // Assistant généraliste
  | 'onboarding_guide'       // Guide d'inscription
  | 'recruiter'              // Recruteur IA
  | 'career_advisor'         // Conseiller carrière
  | 'technical_support'      // Support technique
  | 'admin_helper';          // Assistant admin

/**
 * Statut d'un agent
 */
export type AgentStatus = 'idle' | 'listening' | 'thinking' | 'responding' | 'offline';

/**
 * Message dans le système multi-agents
 */
export interface AgentMessage {
  /** ID unique du message */
  id: string;
  /** Contenu du message */
  content: string;
  /** Expéditeur (user ou agent) */
  sender: 'user' | AgentType;
  /** Horodatage */
  timestamp: Date;
  /** Type de message */
  type?: 'text' | 'suggestion' | 'help' | 'error' | 'handoff';
  /** Métadonnées optionnelles */
  metadata?: {
    /** Confiance dans la réponse (0-1) */
    confidence?: number;
    /** Sources utilisées */
    sources?: string[];
    /** Agent suivant à solliciter */
    handoffTo?: AgentType;
    /** Raison du transfert */
    handoffReason?: string;
  };
}

/**
 * Contexte partagé entre tous les agents
 */
export interface AgentContext {
  /** Page actuelle */
  page: string;
  /** Étape actuelle */
  step?: number;
  /** Type d'utilisateur */
  userType?: 'athlete' | 'company' | 'admin';
  /** Données du formulaire */
  formData?: Record<string, any>;
  /** ID de l'utilisateur */
  userId?: string;
  /** Agent actif actuellement */
  activeAgent?: AgentType;
  /** Historique de conversation */
  conversationHistory?: AgentMessage[];
  /** Session ID pour la mémoire conversationnelle */
  sessionId?: string;
}

/**
 * Configuration d'un agent individuel
 */
export interface AgentConfig {
  /** Type de l'agent */
  type: AgentType;
  /** Nom affiché */
  name: string;
  /** Rôle de l'agent */
  role: AgentRole;
  /** Avatar/emoji */
  avatar: string;
  /** Description courte */
  description: string;
  /** Si l'agent est activé */
  enabled: boolean;
  /** Endpoint API spécifique à cet agent */
  apiEndpoint?: string;
  /** Capacités de l'agent */
  capabilities: string[];
  /** Priorité (pour choisir quel agent répond) */
  priority: number;
  /** Peut transférer vers d'autres agents */
  canHandoff: boolean;
  /** Agents vers lesquels il peut transférer */
  handoffTargets?: AgentType[];
}

/**
 * Suggestion proposée par un agent
 */
export interface AgentSuggestion {
  /** ID unique */
  id: string;
  /** Texte de la suggestion */
  text: string;
  /** Agent qui a généré la suggestion */
  sourceAgent: AgentType;
  /** Action à exécuter */
  action?: () => void;
  /** Type de suggestion */
  type?: 'question' | 'action' | 'navigation';
}

/**
 * Réponse de l'API d'un agent
 */
export interface AgentAPIResponse {
  /** Réponse textuelle */
  response: string;
  /** Agent qui a répondu */
  agent: AgentType;
  /** Suggestions associées */
  suggestions?: AgentSuggestion[];
  /** Confiance dans la réponse */
  confidence?: number;
  /** Doit-on transférer à un autre agent ? */
  shouldHandoff?: boolean;
  /** Agent cible du transfert */
  handoffTarget?: AgentType;
  /** Raison du transfert */
  handoffReason?: string;
}

/**
 * Requête vers l'API d'un agent
 */
export interface AgentAPIRequest {
  /** Message de l'utilisateur */
  message: string;
  /** Contexte actuel */
  context: AgentContext;
  /** Agent ciblé (optionnel, sinon routage automatique) */
  targetAgent?: AgentType;
  /** Historique de conversation */
  history?: AgentMessage[];
}

/**
 * Événement dans le système multi-agents
 *
 * Permet aux agents de communiquer entre eux
 */
export interface AgentEvent {
  /** Type d'événement */
  type: 'message' | 'handoff' | 'context_update' | 'agent_status_change';
  /** Agent source */
  sourceAgent: AgentType;
  /** Agent cible (optionnel) */
  targetAgent?: AgentType;
  /** Données de l'événement */
  payload: any;
  /** Timestamp */
  timestamp: Date;
}

/**
 * État du système multi-agents
 */
export interface AgentSystemState {
  /** Agent actuellement actif */
  activeAgent: AgentType;
  /** Agents disponibles */
  availableAgents: AgentType[];
  /** Statut de chaque agent */
  agentStatuses: Record<AgentType, AgentStatus>;
  /** File d'attente d'événements */
  eventQueue: AgentEvent[];
  /** Contexte global */
  context: AgentContext;
}

/**
 * Orchestrateur de transfert entre agents
 */
export interface AgentHandoffDecision {
  /** Doit-on transférer ? */
  shouldHandoff: boolean;
  /** Agent cible */
  targetAgent?: AgentType;
  /** Raison du transfert */
  reason?: string;
  /** Message de transition pour l'utilisateur */
  transitionMessage?: string;
}

/**
 * Métriques d'un agent (pour monitoring)
 */
export interface AgentMetrics {
  /** Agent concerné */
  agent: AgentType;
  /** Nombre de messages traités */
  messagesProcessed: number;
  /** Temps de réponse moyen (ms) */
  averageResponseTime: number;
  /** Score de satisfaction */
  satisfactionScore?: number;
  /** Nombre de transferts effectués */
  handoffsInitiated: number;
  /** Nombre de transferts reçus */
  handoffsReceived: number;
  /** Taux de réussite */
  successRate: number;
}
