import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { advancedMessagingService, Conversation, Message } from '../../services/advancedMessagingService';
import { Send, Search, MoreVertical, Phone, Video, Paperclip, Smile, Circle, X, Plus, Image as ImageIcon, File, Mic, Star, Users, Settings, MessageSquare, Bell, Menu, CircleUser as UserCircle } from 'lucide-react';

const EMOJI_QUICK_REACTIONS = ['👍', '❤️', '😂', '😮', '😢', '🎉'];

type FilterType = 'all' | 'unread' | 'groups' | 'contacts';

interface Contact {
  id: string;
  full_name: string;
  email: string;
  user_type: string;
  avatar_url?: string;
}

export function EnhancedMessagingPage() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [hoveredMessageId, setHoveredMessageId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [showMenu, setShowMenu] = useState(false);
  const [showContacts, setShowContacts] = useState(false);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [contactsSearch, setContactsSearch] = useState('');
  const [loadingContacts, setLoadingContacts] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const contactsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
      if (contactsRef.current && !contactsRef.current.contains(event.target as Node)) {
        setShowContacts(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (user?.id) {
      loadConversations();
      advancedMessagingService.updatePresence(user.id, 'online');

      return () => {
        advancedMessagingService.updatePresence(user.id, 'offline');
      };
    }
  }, [user?.id]);

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.id);

      const channel = advancedMessagingService.subscribeToConversation(
        selectedConversation.id,
        () => {
          loadMessages(selectedConversation.id);
          loadConversations();
        }
      );

      return () => {
        channel.unsubscribe();
      };
    }
  }, [selectedConversation?.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  }, [newMessage]);

  const loadConversations = async () => {
    if (!user?.id) return;
    setLoading(true);
    const data = await advancedMessagingService.getConversations(user.id);
    setConversations(data);
    setLoading(false);
  };

  const loadContacts = async () => {
    if (!user?.id) return;
    setLoadingContacts(true);
    try {
      const { data, error } = await advancedMessagingService['supabase']
        .from('profiles')
        .select('id, full_name, email, user_type, avatar_url')
        .neq('id', user.id)
        .order('full_name');

      if (!error && data) {
        setContacts(data);
      }
    } catch (err) {
      console.error('Error loading contacts:', err);
    }
    setLoadingContacts(false);
  };

  const handleContactClick = async (contact: Contact) => {
    if (!user?.id) return;

    const existingConv = conversations.find(c =>
      c.type === 'direct' && c.participant_ids?.includes(contact.id)
    );

    if (existingConv) {
      setSelectedConversation(existingConv);
    } else {
      const newConv = await advancedMessagingService.createConversation(
        user.id,
        'direct',
        [contact.id],
        `Chat avec ${contact.full_name}`
      );
      if (newConv) {
        await loadConversations();
        setSelectedConversation(newConv);
      }
    }
    setShowContacts(false);
  };

  const filteredContacts = contacts.filter(contact =>
    contact.full_name?.toLowerCase().includes(contactsSearch.toLowerCase()) ||
    contact.email?.toLowerCase().includes(contactsSearch.toLowerCase())
  );

  const loadMessages = async (conversationId: string) => {
    const data = await advancedMessagingService.getMessages(conversationId);
    setMessages(data);

    if (user?.id) {
      await advancedMessagingService.markConversationAsRead(conversationId, user.id);
      await loadConversations();
    }
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if ((!newMessage.trim() && selectedFiles.length === 0) || !selectedConversation || !user?.id) return;

    const message = await advancedMessagingService.sendMessage(
      selectedConversation.id,
      user.id,
      newMessage.trim(),
      []
    );

    if (message && selectedFiles.length > 0) {
      for (const file of selectedFiles) {
        await advancedMessagingService.uploadAttachment(message.id, file);
      }
    }

    if (message) {
      setNewMessage('');
      setSelectedFiles([]);
      await loadMessages(selectedConversation.id);
      await loadConversations();
    }
  };

  const handleReaction = async (messageId: string, emoji: string) => {
    if (!user?.id) return;
    await advancedMessagingService.addReaction(messageId, user.id, emoji);
    if (selectedConversation) {
      await loadMessages(selectedConversation.id);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  const getConversationTitle = (conv: Conversation) => {
    if (conv.type === 'group' || conv.type === 'channel') {
      return conv.name || 'Sans nom';
    }
    return 'Conversation directe';
  };

  const filterConversations = () => {
    let filtered = conversations;

    if (activeFilter === 'unread') {
      filtered = filtered.filter(c => c.unread_count && c.unread_count > 0);
    } else if (activeFilter === 'contacts') {
      if (contacts.length === 0) {
        loadContacts();
      }
      return [];
    } else if (activeFilter === 'groups') {
      filtered = filtered.filter(c => c.type === 'group' || c.type === 'channel');
    }

    if (searchQuery) {
      filtered = filtered.filter(conv =>
        getConversationTitle(conv).toLowerCase().includes(searchQuery.toLowerCase()) ||
        conv.last_message_preview?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  };

  const filteredConversations = filterConversations();

  return (
    <div className="h-screen flex bg-white dark:bg-black">
      {/* Liste des conversations */}
      <div className="w-96 bg-white dark:bg-zinc-950 border-r border-slate-200 dark:border-zinc-800 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-zinc-800">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Messages</h1>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-slate-100 dark:hover:bg-zinc-900 rounded-full transition-colors bg-slate-100 dark:bg-zinc-900">
                <Plus className="w-5 h-5 text-slate-600 dark:text-zinc-400" />
              </button>

              <button
                className="p-2 hover:bg-slate-100 dark:hover:bg-zinc-900 rounded-lg transition-colors"
              >
                <Settings className="w-5 h-5 text-slate-600 dark:text-zinc-400" />
              </button>
            </div>
          </div>

          {/* Barre de recherche */}
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

          {/* Filtres */}
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
              onClick={() => setActiveFilter('unread')}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                activeFilter === 'unread'
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'
                  : 'bg-slate-100 dark:bg-zinc-900 text-slate-600 dark:text-zinc-400 hover:bg-slate-200 dark:hover:bg-zinc-800'
              }`}
            >
              Non lues
            </button>
            <button
              onClick={() => {
                setActiveFilter('contacts');
                if (contacts.length === 0) {
                  loadContacts();
                }
              }}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                activeFilter === 'contacts'
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'
                  : 'bg-slate-100 dark:bg-zinc-900 text-slate-600 dark:text-zinc-400 hover:bg-slate-200 dark:hover:bg-zinc-800'
              }`}
            >
              Favoris
            </button>
            <button
              onClick={() => setActiveFilter('groups')}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                activeFilter === 'groups'
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'
                  : 'bg-slate-100 dark:bg-zinc-900 text-slate-600 dark:text-zinc-400 hover:bg-slate-200 dark:hover:bg-zinc-800'
              }`}
            >
              Groupes
            </button>
          </div>
        </div>

        {/* Liste scrollable */}
        <div className="flex-1 overflow-y-auto">
          {activeFilter === 'contacts' ? (
            <div className="p-4">
              {loadingContacts ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <>
                  <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Rechercher un contact..."
                      value={contactsSearch}
                      onChange={(e) => setContactsSearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-slate-100 dark:bg-zinc-900 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                    />
                  </div>

                  {filteredContacts.length === 0 ? (
                    <div className="py-8 text-center">
                      <p className="text-slate-500 dark:text-zinc-500 text-sm">
                        {contactsSearch ? 'Aucun contact trouvé' : 'Aucun contact disponible'}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {filteredContacts.map((contact) => (
                        <button
                          key={contact.id}
                          onClick={() => handleContactClick(contact)}
                          className="w-full p-3 flex items-center gap-3 hover:bg-slate-100 dark:hover:bg-zinc-900 rounded-lg transition-colors text-left"
                        >
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                            {contact.full_name?.[0]?.toUpperCase() || 'U'}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-slate-900 dark:text-white truncate">
                              {contact.full_name || 'Sans nom'}
                            </div>
                            <div className="text-xs text-slate-500 dark:text-zinc-500 truncate">
                              {contact.user_type || 'Utilisateur'}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          ) : loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-slate-500 dark:text-zinc-500 text-sm">Aucune conversation</p>
            </div>
          ) : (
            filteredConversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setSelectedConversation(conv)}
                className={`w-full p-3 flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-zinc-900/50 transition-colors ${
                  selectedConversation?.id === conv.id ? 'bg-slate-50 dark:bg-zinc-900' : ''
                }`}
              >
                <div className="relative flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {conv.type === 'group' ? <Users className="w-6 h-6" /> : getConversationTitle(conv)[0]}
                  </div>
                  {conv.unread_count && conv.unread_count > 0 && (
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center border-2 border-white dark:border-zinc-950">
                      <span className="text-white text-xs font-bold">{conv.unread_count}</span>
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-0.5">
                    <h3 className={`font-semibold text-sm truncate ${
                      conv.unread_count && conv.unread_count > 0
                        ? 'text-slate-900 dark:text-white'
                        : 'text-slate-700 dark:text-zinc-300'
                    }`}>
                      {getConversationTitle(conv)}
                    </h3>
                    <span className="text-xs text-slate-500 dark:text-zinc-500 ml-2 flex-shrink-0">
                      {formatTime(conv.last_message_at)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <p className={`text-sm truncate flex-1 ${
                      conv.unread_count && conv.unread_count > 0
                        ? 'text-slate-900 dark:text-white font-medium'
                        : 'text-slate-500 dark:text-zinc-500'
                    }`}>
                      {conv.last_message_preview || 'Aucun message'}
                    </p>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Zone de conversation */}
      <div className="flex-1 flex flex-col bg-slate-50 dark:bg-black">
        {selectedConversation ? (
          <>
            {/* Header conversation */}
            <div className="px-6 py-3 bg-slate-100 dark:bg-zinc-950 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {selectedConversation.type === 'group' ? <Users className="w-5 h-5" /> : getConversationTitle(selectedConversation)[0]}
                </div>
                <div>
                  <h2 className="font-semibold text-slate-900 dark:text-white">
                    {getConversationTitle(selectedConversation)}
                  </h2>
                  {selectedConversation.description && (
                    <p className="text-xs text-slate-500 dark:text-zinc-500">
                      {selectedConversation.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button className="p-2 hover:bg-white dark:hover:bg-zinc-900 rounded-full transition-colors">
                  <Video className="w-5 h-5 text-slate-600 dark:text-zinc-400" />
                </button>
                <button className="p-2 hover:bg-white dark:hover:bg-zinc-900 rounded-full transition-colors">
                  <Search className="w-5 h-5 text-slate-600 dark:text-zinc-400" />
                </button>
                <button className="p-2 hover:bg-white dark:hover:bg-zinc-900 rounded-full transition-colors">
                  <MoreVertical className="w-5 h-5 text-slate-600 dark:text-zinc-400" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-2">
              <div className="flex justify-center my-4">
                <span className="px-3 py-1 bg-white dark:bg-zinc-900 text-slate-700 dark:text-zinc-300 text-xs rounded-lg shadow-sm">
                  Aujourd'hui
                </span>
              </div>

              {messages.map((message) => {
                const isOwn = message.sender_id === user?.id;
                const reactions = message.reactions || [];
                const attachments = message.attachments || [];

                return (
                  <div
                    key={message.id}
                    className={`flex ${isOwn ? 'justify-end' : 'justify-start'} group`}
                    onMouseEnter={() => setHoveredMessageId(message.id)}
                    onMouseLeave={() => setHoveredMessageId(null)}
                  >
                    <div className="max-w-[65%] relative">
                      <div
                        className={`rounded-lg px-3 py-2 shadow-sm ${
                          isOwn
                            ? 'bg-blue-600 text-white'
                            : 'bg-white dark:bg-zinc-900 text-slate-900 dark:text-white border border-slate-200 dark:border-zinc-800'
                        }`}
                      >
                        {attachments.length > 0 && (
                          <div className="mb-2 space-y-1">
                            {attachments.map((att) => (
                              <a
                                key={att.id}
                                href={att.file_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`flex items-center gap-2 p-2 rounded text-xs ${
                                  isOwn ? 'bg-blue-700' : 'bg-slate-50 dark:bg-zinc-800'
                                }`}
                              >
                                {att.file_type.startsWith('image/') ? <ImageIcon className="w-4 h-4" /> : <File className="w-4 h-4" />}
                                <span className="truncate">{att.file_name}</span>
                              </a>
                            ))}
                          </div>
                        )}

                        <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>

                        <div className={`flex items-center justify-end gap-1 mt-1 ${
                          isOwn ? 'text-blue-100' : 'text-slate-400 dark:text-zinc-600'
                        }`}>
                          <span className="text-xs">{formatTime(message.created_at)}</span>
                          {isOwn && (
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                              <path d="M12.354 4.354a.5.5 0 0 0-.708-.708L5 10.293 1.854 7.146a.5.5 0 1 0-.708.708l3.5 3.5a.5.5 0 0 0 .708 0l7-7zm-4.208 7-.896-.897.707-.707.543.543 6.646-6.647a.5.5 0 0 1 .708.708l-7 7a.5.5 0 0 1-.708 0z"/>
                              <path d="m5.354 7.146.896.897-.707.707-.897-.896a.5.5 0 1 1 .708-.708z"/>
                            </svg>
                          )}
                        </div>
                      </div>

                      {hoveredMessageId === message.id && (
                        <div className={`absolute -top-8 ${isOwn ? 'right-0' : 'left-0'} flex gap-0.5 bg-white dark:bg-zinc-800 rounded-full px-2 py-1 shadow-lg border border-slate-200 dark:border-zinc-700 opacity-0 group-hover:opacity-100 transition-opacity z-10`}>
                          {EMOJI_QUICK_REACTIONS.map((emoji) => (
                            <button
                              key={emoji}
                              onClick={() => handleReaction(message.id, emoji)}
                              className="hover:scale-125 transition-transform p-1"
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      )}

                      {reactions.length > 0 && (
                        <div className={`flex gap-1 mt-1 ${isOwn ? 'justify-end' : 'justify-start'}`}>
                          {Object.entries(
                            reactions.reduce((acc: any, r) => {
                              acc[r.emoji] = (acc[r.emoji] || 0) + 1;
                              return acc;
                            }, {})
                          ).map(([emoji, count]) => (
                            <button
                              key={emoji}
                              onClick={() => handleReaction(message.id, emoji)}
                              className="flex items-center gap-1 px-2 py-0.5 bg-white dark:bg-zinc-800 rounded-full text-xs border border-slate-200 dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-700"
                            >
                              <span>{emoji}</span>
                              <span className="text-slate-500 dark:text-zinc-400 font-medium">{count as number}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input zone - FIXE EN BAS */}
            <div className="px-4 py-3 bg-slate-100 dark:bg-zinc-950 border-t border-slate-200 dark:border-zinc-800">
              {selectedFiles.length > 0 && (
                <div className="mb-2 flex gap-2 flex-wrap">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-zinc-900 rounded-lg border border-slate-200 dark:border-zinc-800">
                      <File className="w-4 h-4 text-slate-500" />
                      <span className="text-xs text-slate-700 dark:text-zinc-300 truncate max-w-[150px]">{file.name}</span>
                      <button onClick={() => setSelectedFiles(selectedFiles.filter((_, i) => i !== index))}>
                        <X className="w-4 h-4 text-slate-400 hover:text-slate-600" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-end gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => e.target.files && setSelectedFiles(Array.from(e.target.files))}
                  className="hidden"
                  multiple
                />

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2.5 hover:bg-slate-200 dark:hover:bg-zinc-900 rounded-full transition-colors flex-shrink-0"
                >
                  <Plus className="w-5 h-5 text-slate-600 dark:text-zinc-400" />
                </button>

                <div className="flex-1 relative bg-white dark:bg-zinc-900 rounded-lg">
                  <textarea
                    ref={textareaRef}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder="Tapez un message"
                    className="w-full px-4 py-3 pr-12 bg-transparent focus:outline-none text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-600 resize-none text-sm"
                    rows={1}
                    style={{ maxHeight: '120px' }}
                  />
                  <button className="absolute right-3 bottom-3 hover:bg-slate-100 dark:hover:bg-zinc-800 p-1 rounded-full transition-colors">
                    <Smile className="w-5 h-5 text-slate-500 dark:text-zinc-500" />
                  </button>
                </div>

                <button
                  onClick={() => handleSendMessage()}
                  disabled={!newMessage.trim() && selectedFiles.length === 0}
                  className={`p-2.5 rounded-full transition-colors flex-shrink-0 ${
                    newMessage.trim() || selectedFiles.length > 0
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'hover:bg-slate-200 dark:hover:bg-zinc-900 text-slate-400'
                  }`}
                >
                  {newMessage.trim() || selectedFiles.length > 0 ? (
                    <Send className="w-5 h-5" />
                  ) : (
                    <Mic className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col">
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center max-w-md px-8">
                <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
                  <MessageSquare className="w-16 h-16 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                  Messagerie Trophenix
                </h3>
              </div>
            </div>

            {/* Input zone - visible même sans conversation sélectionnée */}
            <div className="px-4 py-3 bg-white dark:bg-zinc-950 border-t border-slate-200 dark:border-zinc-800">
              <div className="flex items-center gap-3">
                <button
                  className="p-2 hover:bg-slate-100 dark:hover:bg-zinc-900 rounded-full transition-colors flex-shrink-0"
                  disabled
                >
                  <Plus className="w-6 h-6 text-slate-500 dark:text-zinc-500" />
                </button>

                <button
                  className="p-2 hover:bg-slate-100 dark:hover:bg-zinc-900 rounded-full transition-colors flex-shrink-0"
                  disabled
                >
                  <Smile className="w-6 h-6 text-slate-500 dark:text-zinc-500" />
                </button>

                <div className="flex-1 relative">
                  <input
                    type="text"
                    value=""
                    placeholder="Entrez un message"
                    disabled
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-zinc-900 rounded-lg focus:outline-none text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-zinc-600 border-0"
                  />
                </div>

                <button
                  className="p-2 hover:bg-slate-100 dark:hover:bg-zinc-900 rounded-full transition-colors flex-shrink-0"
                  disabled
                >
                  <Mic className="w-6 h-6 text-slate-500 dark:text-zinc-500" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
