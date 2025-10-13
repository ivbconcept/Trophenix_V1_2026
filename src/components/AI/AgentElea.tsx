/**
 * Composant Agent Elea
 *
 * ⚠️ AGENT IA CONVERSATIONNEL ⚠️
 *
 * Assistant IA qui accompagne l'utilisateur tout au long de son parcours.
 *
 * Fonctionnalités :
 * - Chat en temps réel
 * - Suggestions contextuelles
 * - Réponses adaptées à chaque étape
 * - Position personnalisable
 *
 * Stratégie V1/V2 :
 * - V1 : Code présent mais AGENT_ELEA_ENABLED = false (invisible)
 * - V2 : AGENT_ELEA_ENABLED = true (visible)
 *
 * @module components/AI/AgentElea
 */

import { useEffect, useRef } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { useEleaAgent } from '../../hooks/useEleaAgent';
import { isFeatureEnabled } from '../../config/features';
import type { AgentContext } from '../../types/agent';

interface AgentEleaProps {
  /** Contexte de l'agent (page, étape, etc.) */
  context?: AgentContext;
  /** Position sur l'écran */
  position?: 'bottom-right' | 'bottom-left';
}

/**
 * Agent Elea - Assistant IA conversationnel
 *
 * @param context - Contexte actuel (page, step, userType)
 * @param position - Position sur l'écran (défaut: 'bottom-right')
 *
 * @example
 * ```tsx
 * <AgentElea
 *   context={{
 *     page: 'onboarding_athlete',
 *     step: 1,
 *     userType: 'athlete'
 *   }}
 *   position="bottom-right"
 * />
 * ```
 */
export function AgentElea({ context = { page: 'dashboard', step: 0 }, position = 'bottom-right' }: AgentEleaProps) {
  const {
    messages,
    suggestions,
    isLoading,
    isOpen,
    sendMessage,
    toggleAgent,
    sendSuggestion,
  } = useEleaAgent(context);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll automatique vers le bas quand de nouveaux messages arrivent
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Focus sur l'input quand on ouvre le chat
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Si la fonctionnalité n'est pas activée, ne rien afficher
  if (!isFeatureEnabled('AGENT_ELEA_ENABLED')) {
    return null;
  }

  const positionClasses = position === 'bottom-right' ? 'right-6' : 'left-6';

  /**
   * Gestion de l'envoi de message
   */
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const message = formData.get('message') as string;

    if (message?.trim()) {
      sendMessage(message);
      e.currentTarget.reset();
    }
  };

  return (
    <div className={`fixed bottom-6 ${positionClasses} z-50`}>
      {/* Fenêtre de Chat */}
      {isOpen && (
        <div className="mb-4 w-96 bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 animate-in slide-in-from-bottom-8 duration-300">
          {/* En-tête */}
          <div className="bg-gradient-to-r from-teal-500 to-teal-600 p-4 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {/* Avatar de l'agent */}
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center animate-pulse">
                  <span className="text-xl">🤖</span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Elea</h3>
                  <p className="text-xs text-teal-100">Votre assistante Trophenix</p>
                </div>
              </div>
              <button
                onClick={toggleAgent}
                className="hover:bg-white/20 p-2 rounded-full transition-colors"
                aria-label="Fermer l'assistant"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Zone des Messages */}
          <div className="h-96 overflow-y-auto p-4 space-y-4 bg-slate-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === 'user' ? 'justify-end' : 'justify-start'
                } animate-in fade-in slide-in-from-bottom-2 duration-200`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-sm ${
                    message.sender === 'user'
                      ? 'bg-teal-500 text-white'
                      : message.type === 'error'
                      ? 'bg-red-50 text-red-800 border border-red-200'
                      : 'bg-white text-slate-800 border border-slate-200'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">
                    {message.content}
                  </p>
                  <p
                    className={`text-xs mt-1 ${
                      message.sender === 'user'
                        ? 'text-teal-100'
                        : 'text-slate-500'
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString('fr-FR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            ))}

            {/* Indicateur de chargement */}
            {isLoading && (
              <div className="flex justify-start animate-in fade-in slide-in-from-bottom-2">
                <div className="bg-white border border-slate-200 rounded-2xl px-4 py-3 shadow-sm">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}

            {/* Élément de scroll automatique */}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggestions */}
          {suggestions.length > 0 && !isLoading && (
            <div className="px-4 py-3 border-t border-slate-200 bg-white">
              <p className="text-xs text-slate-500 mb-2 font-medium">
                Suggestions :
              </p>
              <div className="space-y-2">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion.id}
                    onClick={() => sendSuggestion(suggestion)}
                    className="w-full text-left text-sm px-3 py-2 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors text-slate-700 border border-slate-200 hover:border-teal-300"
                  >
                    💡 {suggestion.text}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Zone de Saisie */}
          <div className="p-4 border-t border-slate-200 bg-white">
            <form onSubmit={handleSubmit} className="flex space-x-2">
              <input
                ref={inputRef}
                type="text"
                name="message"
                placeholder="Posez votre question..."
                className="flex-1 px-4 py-2 border border-slate-300 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                disabled={isLoading}
                autoComplete="off"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="bg-teal-500 text-white p-2 rounded-full hover:bg-teal-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
                aria-label="Envoyer le message"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Bouton Toggle (toujours visible) */}
      <button
        onClick={toggleAgent}
        className="w-14 h-14 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center group hover:scale-110"
        aria-label={isOpen ? "Fermer l'assistant" : "Ouvrir l'assistant"}
      >
        {isOpen ? (
          <X className="w-6 h-6 transition-transform group-hover:rotate-90" />
        ) : (
          <>
            <MessageCircle className="w-6 h-6 transition-transform group-hover:scale-110" />
            {/* Badge de notification (optionnel pour V2) */}
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
          </>
        )}
      </button>
    </div>
  );
}
