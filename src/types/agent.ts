/**
 * Types pour l'agent IA Elea
 *
 * Définit les structures de données pour l'agent conversationnel.
 *
 * @module types/agent
 */

/**
 * Message de l'agent ou de l'utilisateur
 */
export interface AgentMessage {
  /** ID unique du message */
  id: string;
  /** Contenu textuel du message */
  content: string;
  /** Expéditeur du message */
  sender: 'user' | 'agent';
  /** Horodatage du message */
  timestamp: Date;
  /** Type de message (optionnel) */
  type?: 'text' | 'suggestion' | 'help' | 'error';
}

/**
 * Contexte de l'agent
 *
 * Informations sur où se trouve l'utilisateur dans l'application.
 * Permet à l'agent de fournir des réponses contextuelles.
 */
export interface AgentContext {
  /** Page actuelle (ex: 'onboarding_athlete', 'dashboard', 'profile') */
  page: string;
  /** Étape actuelle si dans un processus multi-étapes */
  step?: number;
  /** Type d'utilisateur */
  userType?: 'athlete' | 'company' | 'admin';
  /** Données du formulaire en cours (optionnel) */
  formData?: Record<string, any>;
  /** ID de l'utilisateur (optionnel) */
  userId?: string;
}

/**
 * Configuration de l'agent
 *
 * Paramètres pour personnaliser le comportement de l'agent
 */
export interface AgentConfig {
  /** Si l'agent est activé */
  enabled: boolean;
  /** Ouvrir automatiquement au chargement */
  autoOpen?: boolean;
  /** Afficher le message de bienvenue */
  showWelcomeMessage?: boolean;
  /** Position de l'agent sur l'écran */
  position?: 'bottom-right' | 'bottom-left';
  /** Thème de couleur (optionnel pour V2) */
  theme?: 'teal' | 'blue' | 'purple';
}

/**
 * Suggestion de l'agent
 *
 * Question pré-définie que l'utilisateur peut cliquer
 */
export interface AgentSuggestion {
  /** ID unique de la suggestion */
  id: string;
  /** Texte affiché à l'utilisateur */
  text: string;
  /** Action à exécuter au clic (optionnel) */
  action?: () => void;
}

/**
 * Réponse de l'API IA
 */
export interface AgentAPIResponse {
  /** Message de réponse */
  response: string;
  /** Suggestions associées (optionnel) */
  suggestions?: AgentSuggestion[];
  /** Confiance de la réponse (0-1) */
  confidence?: number;
}

/**
 * Requête vers l'API IA
 */
export interface AgentAPIRequest {
  /** Message de l'utilisateur */
  message: string;
  /** Contexte actuel */
  context: AgentContext;
  /** Historique de conversation (optionnel) */
  history?: AgentMessage[];
}
