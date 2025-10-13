/**
 * Hook pour utiliser l'agent Elea dans les composants
 *
 * Ce hook encapsule toute la logique de gestion de l'agent :
 * - Gestion des messages
 * - Chargement des suggestions
 * - État d'ouverture/fermeture
 * - Communication avec le service
 *
 * @module hooks/useAgent
 */

import { useState, useCallback, useEffect } from 'react';
import { AgentService } from '../services/agentService';
import type { AgentMessage, AgentContext, AgentSuggestion } from '../types/agent';
import { debugLog } from '../config/features';

/**
 * Hook personnalisé pour gérer l'agent IA
 *
 * @param context - Contexte actuel de l'agent
 * @returns Objet avec état et fonctions de l'agent
 *
 * @example
 * ```typescript
 * function MyComponent() {
 *   const { messages, sendMessage, isOpen, toggleAgent } = useAgent({
 *     page: 'onboarding_athlete',
 *     step: 1
 *   });
 *
 *   return (
 *     <div>
 *       <button onClick={toggleAgent}>Ouvrir l'assistant</button>
 *       {isOpen && <ChatInterface messages={messages} onSend={sendMessage} />}
 *     </div>
 *   );
 * }
 * ```
 */
export function useAgent(context: AgentContext) {
  /** Liste des messages de la conversation */
  const [messages, setMessages] = useState<AgentMessage[]>([]);

  /** Suggestions contextuelles */
  const [suggestions, setSuggestions] = useState<AgentSuggestion[]>([]);

  /** État de chargement (envoi de message) */
  const [isLoading, setIsLoading] = useState(false);

  /** État d'ouverture de la fenêtre de chat */
  const [isOpen, setIsOpen] = useState(false);

  /** État d'initialisation */
  const [isInitialized, setIsInitialized] = useState(false);

  /**
   * Envoie un message à l'agent
   *
   * @param content - Contenu du message
   */
  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim()) return;

      debugLog('useAgent.sendMessage', { content, context });

      // Ajouter le message de l'utilisateur immédiatement
      const userMessage: AgentMessage = {
        id: `user-${Date.now()}`,
        content: content.trim(),
        sender: 'user',
        timestamp: new Date(),
        type: 'text',
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);

      try {
        // Obtenir la réponse de l'agent
        const response = await AgentService.sendMessage(content, context, messages);

        const agentMessage: AgentMessage = {
          id: `agent-${Date.now()}`,
          content: response,
          sender: 'agent',
          timestamp: new Date(),
          type: 'text',
        };

        setMessages((prev) => [...prev, agentMessage]);
      } catch (error) {
        console.error('Erreur lors de l\'envoi du message:', error);

        // Message d'erreur
        const errorMessage: AgentMessage = {
          id: `error-${Date.now()}`,
          content: "Désolé, je rencontre un problème technique. Veuillez réessayer dans quelques instants.",
          sender: 'agent',
          timestamp: new Date(),
          type: 'error',
        };

        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    },
    [context, messages]
  );

  /**
   * Charge les suggestions contextuelles
   */
  const loadSuggestions = useCallback(async () => {
    debugLog('useAgent.loadSuggestions', context);

    try {
      const newSuggestions = await AgentService.getSuggestions(context);
      setSuggestions(newSuggestions);
    } catch (error) {
      console.error('Erreur lors du chargement des suggestions:', error);
      // En cas d'erreur, garder les suggestions actuelles ou vider
      setSuggestions([]);
    }
  }, [context]);

  /**
   * Initialise l'agent avec un message de bienvenue
   */
  const initialize = useCallback(() => {
    if (isInitialized) return;

    debugLog('useAgent.initialize', context);

    const welcomeMessage: AgentMessage = {
      id: 'welcome',
      content: AgentService.getWelcomeMessage(context),
      sender: 'agent',
      timestamp: new Date(),
      type: 'text',
    };

    setMessages([welcomeMessage]);
    loadSuggestions();
    setIsInitialized(true);
  }, [context, loadSuggestions, isInitialized]);

  /**
   * Réinitialise l'agent (efface l'historique)
   */
  const reset = useCallback(() => {
    debugLog('useAgent.reset');
    setMessages([]);
    setSuggestions([]);
    setIsInitialized(false);
    initialize();
  }, [initialize]);

  /**
   * Ouvre/ferme l'agent
   */
  const toggleAgent = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  /**
   * Ouvre l'agent
   */
  const openAgent = useCallback(() => {
    setIsOpen(true);
  }, []);

  /**
   * Ferme l'agent
   */
  const closeAgent = useCallback(() => {
    setIsOpen(false);
  }, []);

  /**
   * Envoie une suggestion (clic sur un bouton de suggestion)
   *
   * @param suggestion - Suggestion cliquée
   */
  const sendSuggestion = useCallback(
    (suggestion: AgentSuggestion) => {
      debugLog('useAgent.sendSuggestion', suggestion);

      // Si la suggestion a une action custom, l'exécuter
      if (suggestion.action) {
        suggestion.action();
      }

      // Envoyer le texte de la suggestion comme message
      sendMessage(suggestion.text);
    },
    [sendMessage]
  );

  // Initialiser automatiquement au montage
  useEffect(() => {
    initialize();
  }, [initialize]);

  // Recharger les suggestions quand le contexte change
  useEffect(() => {
    if (isInitialized) {
      loadSuggestions();
    }
  }, [context.page, context.step, isInitialized, loadSuggestions]);

  return {
    /** Liste des messages */
    messages,
    /** Suggestions contextuelles */
    suggestions,
    /** État de chargement */
    isLoading,
    /** État d'ouverture */
    isOpen,
    /** État d'initialisation */
    isInitialized,
    /** Envoyer un message */
    sendMessage,
    /** Charger les suggestions */
    loadSuggestions,
    /** Initialiser l'agent */
    initialize,
    /** Réinitialiser l'agent */
    reset,
    /** Ouvrir/fermer l'agent */
    toggleAgent,
    /** Ouvrir l'agent */
    openAgent,
    /** Fermer l'agent */
    closeAgent,
    /** Envoyer une suggestion */
    sendSuggestion,
  };
}
