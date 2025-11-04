import { useState, useEffect, useRef } from 'react';
import { Bot, Send, Trash2, Plus, MessageCircle, Sparkles, Archive, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { EleaService } from '../../services/eleaService';
import type { EleaConversation, EleaMessage } from '../../types/database';
import type { AgentContext } from '../../types/agent';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'agent';
  type: 'text' | 'error' | 'suggestion' | 'system';
  timestamp: Date;
}

export function EleaPage() {
  const { user, profile } = useAuth();
  const [conversations, setConversations] = useState<EleaConversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<Array<{ id: string; text: string }>>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const context: AgentContext = {
    page: 'elea_chat',
    step: 0,
    userType: profile?.user_type,
  };

  useEffect(() => {
    if (user) {
      loadConversations();
    }
  }, [user]);

  useEffect(() => {
    if (activeConversationId) {
      loadConversationMessages(activeConversationId);
    }
  }, [activeConversationId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (profile) {
      setSuggestions(EleaService.getSuggestionsForUser(profile, context));
    }
  }, [profile]);

  const loadConversations = async () => {
    if (!user) return;
    try {
      const convs = await EleaService.getUserConversations(user.id);
      setConversations(convs);
      if (convs.length > 0 && !activeConversationId) {
        setActiveConversationId(convs[0].id);
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
    }
  };

  const loadConversationMessages = async (conversationId: string) => {
    try {
      const eleaMessages = await EleaService.getConversationHistory(conversationId);
      const formattedMessages: Message[] = eleaMessages.map((msg) => ({
        id: msg.id,
        content: msg.content,
        sender: msg.sender,
        type: msg.message_type,
        timestamp: new Date(msg.created_at),
      }));
      setMessages(formattedMessages);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const createNewConversation = async () => {
    if (!user) return;
    try {
      const newConvId = await EleaService.getOrCreateActiveConversation(user.id, context);

      const welcomeMsg = EleaService.getWelcomeMessage(profile, context);
      await EleaService.saveMessage(newConvId, 'agent', welcomeMsg, 'text');

      await loadConversations();
      setActiveConversationId(newConvId);
    } catch (error) {
      console.error('Error creating conversation:', error);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !activeConversationId || !user) return;

    const userMessageContent = inputMessage.trim();
    setInputMessage('');
    setIsLoading(true);

    const userMsg: Message = {
      id: Date.now().toString(),
      content: userMessageContent,
      sender: 'user',
      type: 'text',
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);

    try {
      await EleaService.saveMessage(activeConversationId, 'user', userMessageContent);

      const conversationHistory = await EleaService.getConversationHistory(activeConversationId);
      const response = await EleaService.generateResponse(
        userMessageContent,
        profile,
        context,
        conversationHistory
      );

      const agentMsg: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        sender: 'agent',
        type: 'text',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, agentMsg]);

      await EleaService.saveMessage(activeConversationId, 'agent', response);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Désolée, une erreur est survenue. Veuillez réessayer.',
        sender: 'agent',
        type: 'error',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = async (suggestion: { id: string; text: string }) => {
    if (!activeConversationId || !user) return;

    setInputMessage(suggestion.text);
    setIsLoading(true);

    const userMsg: Message = {
      id: Date.now().toString(),
      content: suggestion.text,
      sender: 'user',
      type: 'text',
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);

    try {
      await EleaService.saveMessage(activeConversationId, 'user', suggestion.text);

      const conversationHistory = await EleaService.getConversationHistory(activeConversationId);
      const response = await EleaService.generateResponse(
        suggestion.text,
        profile,
        context,
        conversationHistory
      );

      const agentMsg: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        sender: 'agent',
        type: 'text',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, agentMsg]);

      await EleaService.saveMessage(activeConversationId, 'agent', response);
      setInputMessage('');
    } catch (error) {
      console.error('Error handling suggestion:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleArchiveConversation = async (conversationId: string) => {
    try {
      await EleaService.archiveConversation(conversationId);
      await loadConversations();
      if (activeConversationId === conversationId) {
        setActiveConversationId(null);
        setMessages([]);
      }
    } catch (error) {
      console.error('Error archiving conversation:', error);
    }
  };

  const handleDeleteConversation = async (conversationId: string) => {
    if (!confirm('Voulez-vous vraiment supprimer cette conversation ?')) return;

    try {
      await EleaService.deleteConversation(conversationId);
      await loadConversations();
      if (activeConversationId === conversationId) {
        setActiveConversationId(null);
        setMessages([]);
      }
    } catch (error) {
      console.error('Error deleting conversation:', error);
    }
  };

  return (
    <div className="flex h-full bg-slate-50 dark:bg-black">
      <div className="w-80 bg-white dark:bg-zinc-950 border-r border-slate-200 dark:border-zinc-800 flex flex-col">
        <div className="p-6 border-b border-slate-200 dark:border-zinc-800">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <Bot className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Elea</h2>
                <p className="text-xs text-slate-500 dark:text-zinc-400">Assistant IA</p>
              </div>
            </div>
            <button
              onClick={createNewConversation}
              className="p-2 rounded-lg bg-teal-500 text-white hover:bg-teal-600 transition-colors"
              title="Nouvelle conversation"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          <h3 className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-3">
            Conversations
          </h3>
          {conversations.length === 0 ? (
            <div className="text-center py-8">
              <MessageCircle className="h-12 w-12 text-slate-300 dark:text-zinc-700 mx-auto mb-3" />
              <p className="text-sm text-slate-500 dark:text-zinc-400">Aucune conversation</p>
              <button
                onClick={createNewConversation}
                className="mt-4 text-sm text-teal-500 hover:text-teal-600"
              >
                Créer une conversation
              </button>
            </div>
          ) : (
            conversations.map((conv) => (
              <div
                key={conv.id}
                className={`group relative p-3 rounded-lg cursor-pointer transition-all ${
                  activeConversationId === conv.id
                    ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white'
                    : 'bg-slate-50 dark:bg-zinc-900 text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800'
                }`}
                onClick={() => setActiveConversationId(conv.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium truncate">{conv.title}</h4>
                    <p className="text-xs opacity-70 mt-1">
                      {new Date(conv.last_message_at).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleArchiveConversation(conv.id);
                      }}
                      className="p-1 rounded hover:bg-white/20"
                      title="Archiver"
                    >
                      <Archive className="h-4 w-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteConversation(conv.id);
                      }}
                      className="p-1 rounded hover:bg-white/20"
                      title="Supprimer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        {activeConversationId ? (
          <>
            <div className="bg-white dark:bg-zinc-950 border-b border-slate-200 dark:border-zinc-800 p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-full flex items-center justify-center animate-pulse">
                  <Bot className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                    Conversation avec Elea
                  </h1>
                  <p className="text-sm text-slate-500 dark:text-zinc-400">
                    Assistant intelligent pour vous guider
                  </p>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === 'user' ? 'justify-end' : 'justify-start'
                  } animate-in fade-in slide-in-from-bottom-2 duration-200`}
                >
                  <div
                    className={`max-w-[70%] rounded-2xl px-5 py-3 shadow-sm ${
                      message.sender === 'user'
                        ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white'
                        : message.type === 'error'
                        ? 'bg-red-50 dark:bg-red-950 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800'
                        : 'bg-white dark:bg-zinc-900 text-slate-800 dark:text-zinc-200 border border-slate-200 dark:border-zinc-800'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">
                      {message.content}
                    </p>
                    <p
                      className={`text-xs mt-2 ${
                        message.sender === 'user'
                          ? 'text-teal-100'
                          : 'text-slate-500 dark:text-zinc-500'
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

              {isLoading && (
                <div className="flex justify-start animate-in fade-in slide-in-from-bottom-2">
                  <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl px-5 py-3 shadow-sm">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce delay-100"></div>
                      <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce delay-200"></div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {suggestions.length > 0 && messages.length <= 1 && (
              <div className="px-6 py-4 bg-white dark:bg-zinc-950 border-t border-slate-200 dark:border-zinc-800">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="h-4 w-4 text-teal-500" />
                  <p className="text-sm font-medium text-slate-700 dark:text-zinc-300">
                    Suggestions
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {suggestions.map((suggestion) => (
                    <button
                      key={suggestion.id}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="text-left text-sm px-4 py-3 rounded-xl bg-slate-50 dark:bg-zinc-900 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-zinc-800 hover:border-teal-300 dark:hover:border-teal-700"
                      disabled={isLoading}
                    >
                      {suggestion.text}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="p-6 bg-white dark:bg-zinc-950 border-t border-slate-200 dark:border-zinc-800">
              <form onSubmit={handleSendMessage} className="flex gap-3">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Posez votre question à Elea..."
                  className="flex-1 px-4 py-3 border border-slate-300 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm bg-slate-50 dark:bg-zinc-900 text-slate-900 dark:text-white"
                  disabled={isLoading}
                  autoComplete="off"
                />
                <button
                  type="submit"
                  disabled={isLoading || !inputMessage.trim()}
                  className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-6 py-3 rounded-xl hover:from-teal-600 hover:to-cyan-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md font-medium"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                <Bot className="h-12 w-12 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                Bienvenue sur Elea
              </h2>
              <p className="text-slate-500 dark:text-zinc-400 mb-6">
                Sélectionnez ou créez une conversation pour commencer
              </p>
              <button
                onClick={createNewConversation}
                className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-6 py-3 rounded-xl hover:from-teal-600 hover:to-cyan-600 transition-all shadow-md hover:shadow-lg font-medium"
              >
                Nouvelle conversation
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
