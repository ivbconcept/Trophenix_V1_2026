/**
 * Service pour communiquer avec l'IA agentique
 *
 * ⚠️ POINT D'INTÉGRATION IA BACKEND ⚠️
 *
 * Ce service peut être connecté à :
 * - Une API IA interne (Django, Express, etc.)
 * - OpenAI GPT-4
 * - Anthropic Claude
 * - Un modèle local (Ollama, etc.)
 *
 * 🔄 POUR INTÉGRER AVEC VOTRE BACKEND IA :
 *
 * 1. Remplacer AI_API_URL par votre endpoint
 * 2. Adapter le format des requêtes/réponses
 * 3. Les fallbacks fonctionnent sans backend (mode dégradé)
 *
 * @module services/agentService
 */

import type {
  AgentMessage,
  AgentContext,
  AgentSuggestion,
  AgentAPIResponse,
  AgentAPIRequest,
} from '../types/agent';
import { debugLog } from '../config/features';

/**
 * URL de l'API IA
 *
 * À configurer dans .env :
 * VITE_AI_API_URL=http://localhost:8000/api/ai
 */
const AI_API_URL = import.meta.env.VITE_AI_API_URL || 'http://localhost:8000/api/ai';

/**
 * Service de communication avec l'agent IA
 */
export class AgentService {
  /**
   * Envoie un message à l'agent et reçoit une réponse
   *
   * @param message - Message de l'utilisateur
   * @param context - Contexte actuel (page, étape, etc.)
   * @param history - Historique de conversation (optionnel)
   * @returns Réponse de l'agent
   *
   * @example
   * ```typescript
   * const response = await AgentService.sendMessage(
   *   'Comment remplir ce formulaire ?',
   *   { page: 'onboarding_athlete', step: 1 }
   * );
   * ```
   */
  static async sendMessage(
    message: string,
    context: AgentContext,
    history?: AgentMessage[]
  ): Promise<string> {
    debugLog('AgentService.sendMessage', { message, context });

    try {
      const token = localStorage.getItem('jwt_token');

      const requestBody: AgentAPIRequest = {
        message,
        context,
        history,
      };

      const response = await fetch(`${AI_API_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data: AgentAPIResponse = await response.json();
      debugLog('AgentService response', data);

      return data.response;
    } catch (error) {
      console.error('Erreur lors de la communication avec l\'agent:', error);
      debugLog('Falling back to local responses', error);

      // Fallback : réponse locale si l'API ne fonctionne pas
      return this.getFallbackResponse(context);
    }
  }

  /**
   * Obtient des suggestions contextuelles
   *
   * @param context - Contexte actuel
   * @returns Liste de suggestions
   *
   * @example
   * ```typescript
   * const suggestions = await AgentService.getSuggestions({
   *   page: 'onboarding_athlete',
   *   step: 2
   * });
   * ```
   */
  static async getSuggestions(context: AgentContext): Promise<AgentSuggestion[]> {
    debugLog('AgentService.getSuggestions', context);

    try {
      const response = await fetch(`${AI_API_URL}/suggestions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ context }),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      return data.suggestions;
    } catch (error) {
      console.error('Erreur lors de la récupération des suggestions:', error);
      debugLog('Falling back to local suggestions', error);

      // Fallback : suggestions locales
      return this.getFallbackSuggestions(context);
    }
  }

  /**
   * Réponse de secours si l'API ne fonctionne pas
   *
   * Fournit des réponses pré-définies basées sur le contexte.
   *
   * @param context - Contexte actuel
   * @returns Message de réponse
   */
  private static getFallbackResponse(context: AgentContext): string {
    const responses: Record<string, string> = {
      landing: "Bienvenue sur Trophenix ! Je suis Elea, votre assistante virtuelle. Je peux vous aider à découvrir la plateforme, comprendre comment elle fonctionne, ou répondre à vos questions avant de créer votre compte.",
      onboarding_athlete: "Je suis là pour vous aider à créer votre profil ! N'hésitez pas à poser des questions sur les champs du formulaire.",
      onboarding_company: "Bienvenue ! Je vais vous accompagner dans la création de votre profil entreprise. Que puis-je faire pour vous ?",
      admin_dashboard: "Bonjour administrateur ! Je peux vous aider avec la gestion des profils en attente de validation ou répondre à vos questions sur les outils d'administration.",
      pending_validation: "Votre profil est en cours de validation. Je suis là pour répondre à vos questions pendant cette attente !",
      dashboard: "Comment puis-je vous aider aujourd'hui ? Je peux vous guider dans l'utilisation de la plateforme.",
      athletes_list: "Vous consultez la liste des athlètes. Utilisez les filtres pour affiner votre recherche.",
      profile: "Vous êtes sur votre profil. Vous pouvez le modifier à tout moment.",
      default: "Je suis Elea, votre assistante Trophenix. Comment puis-je vous aider ?",
    };

    const key = context.page as keyof typeof responses;
    return responses[key] || responses.default;
  }

  /**
   * Suggestions de secours si l'API ne fonctionne pas
   *
   * Fournit des suggestions pré-définies basées sur le contexte.
   *
   * @param context - Contexte actuel
   * @returns Liste de suggestions
   */
  private static getFallbackSuggestions(context: AgentContext): AgentSuggestion[] {
    // Suggestions pour la page d'accueil (landing page)
    if (context.page === 'landing') {
      return [
        { id: '1', text: 'Comment fonctionne Trophenix ?' },
        { id: '2', text: 'Qui peut créer un compte ?' },
        { id: '3', text: 'Quels sont les avantages de la plateforme ?' },
        { id: '4', text: 'Comment créer mon profil ?' },
        { id: '5', text: 'La plateforme est-elle gratuite ?' },
      ];
    }

    // Suggestions pour le dashboard admin
    if (context.page === 'admin_dashboard') {
      return [
        { id: '1', text: 'Comment valider un profil ?' },
        { id: '2', text: 'Quels critères de validation utiliser ?' },
        { id: '3', text: 'Comment rejeter un profil ?' },
        { id: '4', text: 'Que faire si un profil est incomplet ?' },
      ];
    }

    // Suggestions pour la page d'attente de validation
    if (context.page === 'pending_validation') {
      return [
        { id: '1', text: 'Combien de temps prend la validation ?' },
        { id: '2', text: 'Que faire si mon profil est rejeté ?' },
        { id: '3', text: 'Comment modifier mon profil en attente ?' },
        { id: '4', text: 'Qui peut me contacter pour plus d\'infos ?' },
      ];
    }

    // Suggestions pour l'onboarding athlète
    if (context.page === 'onboarding_athlete') {
      if (context.step === 1) {
        return [
          { id: '1', text: 'Quels sports puis-je choisir ?' },
          { id: '2', text: 'Que signifie "situation sportive" ?' },
          { id: '3', text: 'Aide-moi à remplir cette étape' },
        ];
      }
      if (context.step === 2) {
        return [
          { id: '1', text: 'Qu\'est-ce que la liste ministérielle ?' },
          { id: '2', text: 'Comment décrire mon niveau sportif ?' },
          { id: '3', text: 'Que mettre dans "club de naissance" ?' },
        ];
      }
      if (context.step === 3) {
        return [
          { id: '1', text: 'Quels secteurs professionnels sont disponibles ?' },
          { id: '2', text: 'Comment choisir ma zone géographique ?' },
          { id: '3', text: 'Que signifie "type de poste" ?' },
        ];
      }
      if (context.step === 4) {
        return [
          { id: '1', text: 'Quelles informations sont visibles publiquement ?' },
          { id: '2', text: 'Comment ajouter une photo ?' },
        ];
      }
    }

    // Suggestions pour l'onboarding entreprise
    if (context.page === 'onboarding_company') {
      if (context.step === 1) {
        return [
          { id: '1', text: 'Quels secteurs d\'activité sont disponibles ?' },
          { id: '2', text: 'Comment choisir la taille de mon entreprise ?' },
        ];
      }
      if (context.step === 2) {
        return [
          { id: '1', text: 'Comment rédiger une bonne description ?' },
          { id: '2', text: 'Quelles informations mettre en avant ?' },
        ];
      }
    }

    // Suggestions par défaut
    return [
      { id: '1', text: 'Comment ça marche ?' },
      { id: '2', text: 'J\'ai besoin d\'aide' },
      { id: '3', text: 'Quelles sont les fonctionnalités ?' },
    ];
  }

  /**
   * Obtient le message de bienvenue contextuel
   *
   * Message affiché à l'ouverture de l'agent selon le contexte.
   *
   * @param context - Contexte actuel
   * @returns Message de bienvenue
   */
  static getWelcomeMessage(context: AgentContext): string {
    const welcomeMessages: Record<string, string> = {
      landing:
        "Bonjour ! Je suis Elea 👋\n\nVotre assistante virtuelle Trophenix. Je suis là pour répondre à vos questions sur la plateforme et vous aider à découvrir comment nous pouvons vous accompagner dans votre carrière sportive !",
      onboarding_athlete:
        "Bonjour ! Je suis Elea 👋\n\nJe vais vous accompagner dans votre inscription. Je suis là pour répondre à vos questions et vous guider à chaque étape !",
      onboarding_company:
        "Bienvenue ! Je suis Elea 👋\n\nJe vais vous aider à créer votre profil entreprise. N'hésitez pas à me solliciter si vous avez des questions !",
      admin_dashboard:
        "Bonjour ! Je suis Elea 👋\n\nVotre assistante pour la gestion administrative. Je peux vous aider avec la validation des profils et l'utilisation des outils d'administration.",
      pending_validation:
        "Bonjour ! Je suis Elea 👋\n\nJe suis là pendant que votre profil est en cours de validation. N'hésitez pas à me poser des questions !",
      dashboard:
        "Bonjour ! Je suis Elea 👋\n\nComment puis-je vous aider aujourd'hui ? Je peux vous guider dans l'utilisation de la plateforme.",
      default:
        "Bonjour ! Je suis Elea, votre assistante Trophenix 👋\n\nComment puis-je vous aider aujourd'hui ?",
    };

    const key = context.page as keyof typeof welcomeMessages;
    return welcomeMessages[key] || welcomeMessages.default;
  }

  /**
   * Analyse le sentiment d'un message (optionnel, pour V2)
   *
   * @param message - Message à analyser
   * @returns Score de sentiment (-1 à 1)
   */
  static async analyzeSentiment(message: string): Promise<number> {
    // TODO: Implémenter l'analyse de sentiment si besoin
    return 0;
  }

  /**
   * Obtient des recommandations personnalisées (optionnel, pour V2)
   *
   * @param userId - ID de l'utilisateur
   * @returns Liste de recommandations
   */
  static async getRecommendations(userId: string): Promise<any[]> {
    // TODO: Implémenter les recommandations IA si besoin
    return [];
  }
}
