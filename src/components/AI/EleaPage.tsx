import { useState, useEffect, useRef } from 'react';
import { Bot, Send, Trash2, Plus, MessageCircle, Sparkles, Archive, Search, Settings, Smile, Paperclip, Mic, X } from 'lucide-react';
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

type FilterType = 'all' | 'archived' | 'favorites';

export function EleaPage() {
  const { user, profile } = useAuth();
  const [conversations, setConversations] = useState<EleaConversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<Array<{ id: string; text: string }>>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  }, [inputMessage]);

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

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
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

  const filterConversations = () => {
    let filtered = conversations;

    if (searchQuery) {
      filtered = filtered.filter(conv =>
        conv.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (activeFilter === 'archived') {
      filtered = filtered.filter(conv => !conv.is_active);
    } else if (activeFilter === 'all') {
      filtered = filtered.filter(conv => conv.is_active);
    }

    return filtered;
  };

  const filteredConversations = filterConversations();
  const activeConversation = conversations.find(c => c.id === activeConversationId);

  return (
    <div className="h-screen flex bg-white dark:bg-black">
      <div className="w-96 bg-white dark:bg-zinc-950 border-r border-slate-200 dark:border-zinc-800 flex flex-col">
        <div className="p-4 border-b border-slate-200 dark:border-zinc-800">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Elea</h1>
            <div className="flex items-center gap-2">
              <button
                onClick={createNewConversation}
                className="p-2 hover:bg-slate-100 dark:hover:bg-zinc-900 rounded-full transition-colors bg-slate-100 dark:bg-zinc-900"
                title="Nouvelle conversation"
              >
                <Plus className="w-5 h-5 text-slate-600 dark:text-zinc-400" />
              </button>
              <button
                className="p-2 hover:bg-slate-100 dark:hover:bg-zinc-900 rounded-lg transition-colors"
                title="Paramètres"
              >
                <Settings className="w-5 h-5 text-slate-600 dark:text-zinc-400" />
              </button>
            </div>
          </div>

          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher ou démarrer une discussion"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-zinc-900 rounded-lg border-0 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm text-slate-900 dark:text-white placeholder-slate-500"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                activeFilter === 'all'
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'
                  : 'bg-slate-100 dark:bg-zinc-900 text-slate-600 dark:text-zinc-400 hover:bg-slate-200 dark:hover:bg-zinc-800'
              }`}
            >
              Toutes
            </button>
            <button
              onClick={() => setActiveFilter('archived')}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                activeFilter === 'archived'
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'
                  : 'bg-slate-100 dark:bg-zinc-900 text-slate-600 dark:text-zinc-400 hover:bg-slate-200 dark:hover:bg-zinc-800'
              }`}
            >
              Archivées
            </button>
            <button
              onClick={() => setActiveFilter('favorites')}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                activeFilter === 'favorites'
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'
                  : 'bg-slate-100 dark:bg-zinc-900 text-slate-600 dark:text-zinc-400 hover:bg-slate-200 dark:hover:bg-zinc-800'
              }`}
            >
              Favoris
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredConversations.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center py-8 px-4">
                <MessageCircle className="h-12 w-12 text-slate-300 dark:text-zinc-700 mx-auto mb-3" />
                <p className="text-sm text-slate-500 dark:text-zinc-400 mb-2">Aucune conversation</p>
                <button
                  onClick={createNewConversation}
                  className="text-sm text-blue-500 hover:text-blue-600 font-medium"
                >
                  Créer une conversation
                </button>
              </div>
            </div>
          ) : (
            filteredConversations.map((conv) => {
              const isActive = activeConversationId === conv.id;
              return (
                <div
                  key={conv.id}
                  onClick={() => setActiveConversationId(conv.id)}
                  className={`group p-4 cursor-pointer border-b border-slate-100 dark:border-zinc-900 transition-colors ${
                    isActive
                      ? 'bg-blue-50 dark:bg-blue-900/20'
                      : 'hover:bg-slate-50 dark:hover:bg-zinc-900'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                      <Bot className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-slate-900 dark:text-white text-sm truncate">
                          {conv.title}
                        </h3>
                        <span className="text-xs text-slate-500 dark:text-zinc-500 flex-shrink-0 ml-2">
                          {new Date(conv.last_message_at).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'short',
                          })}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-slate-600 dark:text-zinc-400 truncate">
                          Conversation avec Elea
                        </p>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleArchiveConversation(conv.id);
                            }}
                            className="p-1 rounded hover:bg-white/50 dark:hover:bg-zinc-800"
                            title="Archiver"
                          >
                            <Archive className="h-4 w-4 text-slate-500 dark:text-zinc-400" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteConversation(conv.id);
                            }}
                            className="p-1 rounded hover:bg-white/50 dark:hover:bg-zinc-800"
                            title="Supprimer"
                          >
                            <Trash2 className="h-4 w-4 text-slate-500 dark:text-zinc-400" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        {activeConversation ? (
          <>
            <div className="bg-white dark:bg-zinc-950 border-b border-slate-200 dark:border-zinc-800 px-6 py-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center">
                    <Bot className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-slate-900 dark:text-white">Elea</h2>
                    <p className="text-xs text-green-600 dark:text-green-400">En ligne</p>
                  </div>
                </div>
              </div>

              {messages.length === 0 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {suggestions.slice(0, 4).map((suggestion) => (
                    <button
                      key={suggestion.id}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="flex-shrink-0 text-sm px-4 py-2 rounded-full bg-slate-100 dark:bg-zinc-900 hover:bg-slate-200 dark:hover:bg-zinc-800 transition-colors text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-zinc-800 hover:border-blue-300 dark:hover:border-blue-700 whitespace-nowrap"
                      disabled={isLoading}
                    >
                      {suggestion.text}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50 dark:bg-black">
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
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
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
                          ? 'text-blue-100'
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
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-100"></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-200"></div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>


            <div className="p-4 bg-white dark:bg-zinc-950 border-t border-slate-200 dark:border-zinc-800">
              {selectedFile && (
                <div className="mb-3 flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <Paperclip className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm text-blue-800 dark:text-blue-300 flex-1 truncate">
                    {selectedFile.name}
                  </span>
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="p-1 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded transition-colors"
                  >
                    <X className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </button>
                </div>
              )}

              <form onSubmit={handleSendMessage} className="flex items-end gap-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileSelect}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2.5 hover:bg-slate-100 dark:hover:bg-zinc-900 rounded-lg transition-colors text-slate-600 dark:text-zinc-400"
                  title="Ajouter un fichier"
                >
                  <Paperclip className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={toggleRecording}
                  className={`p-2.5 rounded-lg transition-colors ${
                    isRecording
                      ? 'bg-red-500 hover:bg-red-600 text-white'
                      : 'hover:bg-slate-100 dark:hover:bg-zinc-900 text-slate-600 dark:text-zinc-400'
                  }`}
                  title={isRecording ? 'Arrêter l\'enregistrement' : 'Enregistrer un message vocal'}
                >
                  <Mic className="w-5 h-5" />
                </button>
                <textarea
                  ref={textareaRef}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage(e);
                    }
                  }}
                  placeholder="Entrez un message"
                  rows={1}
                  className="flex-1 px-4 py-2.5 bg-slate-100 dark:bg-zinc-900 rounded-lg resize-none focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm text-slate-900 dark:text-white placeholder-slate-500 max-h-[120px]"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading || !inputMessage.trim()}
                  className="p-2.5 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-white"
                  title="Envoyer"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <MessageCircle className="h-16 w-16 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                Assistant IA Elea
              </h2>
              <p className="text-slate-500 dark:text-zinc-400">
                Sélectionnez ou créez une conversation pour commencer
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
