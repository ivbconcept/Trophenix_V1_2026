import { useState, useCallback, useEffect } from 'react';
import { EleaService } from '../services/eleaService';
import { useAuth } from '../contexts/AuthContext';
import type { AgentMessage, AgentContext, AgentSuggestion } from '../types/agent';
import type { EleaMessage } from '../types/database';

export function useEleaAgent(context: AgentContext) {
  const { user, profile } = useAuth();
  const [messages, setMessages] = useState<AgentMessage[]>([]);
  const [suggestions, setSuggestions] = useState<AgentSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const convertEleaMessageToAgentMessage = (eleaMsg: EleaMessage): AgentMessage => ({
    id: eleaMsg.id,
    content: eleaMsg.content,
    sender: eleaMsg.sender,
    timestamp: new Date(eleaMsg.created_at),
    type: eleaMsg.message_type,
  });

  const initialize = useCallback(async () => {
    if (!user || !profile || isInitialized) return;

    try {
      const convId = await EleaService.getOrCreateActiveConversation(user.id, context);
      setConversationId(convId);

      const history = await EleaService.getConversationHistory(convId);

      if (history.length === 0) {
        const welcomeMsg = EleaService.getWelcomeMessage(profile, context);
        await EleaService.saveMessage(convId, 'agent', welcomeMsg, 'system');

        setMessages([{
          id: 'welcome',
          content: welcomeMsg,
          sender: 'agent',
          timestamp: new Date(),
          type: 'text',
        }]);
      } else {
        setMessages(history.map(convertEleaMessageToAgentMessage));
      }

      const userSuggestions = EleaService.getSuggestionsForUser(profile, context);
      setSuggestions(userSuggestions.map((s, idx) => ({
        id: s.id,
        text: s.text,
        action: undefined,
      })));

      setIsInitialized(true);
    } catch (error) {
      console.error('Error initializing Elea:', error);
    }
  }, [user, profile, context, isInitialized]);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || !conversationId || !user || !profile) return;

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
      await EleaService.saveMessage(conversationId, 'user', content.trim());

      const history = await EleaService.getConversationHistory(conversationId);
      const response = await EleaService.generateResponse(
        content.trim(),
        profile,
        context,
        history
      );

      await EleaService.saveMessage(conversationId, 'agent', response);

      const agentMessage: AgentMessage = {
        id: `agent-${Date.now()}`,
        content: response,
        sender: 'agent',
        timestamp: new Date(),
        type: 'text',
      };

      setMessages((prev) => [...prev, agentMessage]);
    } catch (error) {
      console.error('Error sending message:', error);

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
  }, [conversationId, user, profile, context]);

  const toggleAgent = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const sendSuggestion = useCallback((suggestion: AgentSuggestion) => {
    if (suggestion.action) {
      suggestion.action();
    }
    sendMessage(suggestion.text);
  }, [sendMessage]);

  useEffect(() => {
    if (user && profile && !isInitialized) {
      initialize();
    }
  }, [user, profile, initialize, isInitialized]);

  useEffect(() => {
    if (isInitialized && profile) {
      const userSuggestions = EleaService.getSuggestionsForUser(profile, context);
      setSuggestions(userSuggestions.map(s => ({
        id: s.id,
        text: s.text,
        action: undefined,
      })));
    }
  }, [context.page, isInitialized, profile]);

  return {
    messages,
    suggestions,
    isLoading,
    isOpen,
    isInitialized,
    sendMessage,
    toggleAgent,
    sendSuggestion,
  };
}
