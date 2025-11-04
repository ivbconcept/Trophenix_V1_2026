import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { advancedMessagingService, Conversation, Message } from '../../services/advancedMessagingService';
import {
  Send, Search, MoreVertical, Phone, Video, Paperclip, Smile, ArrowLeft, Circle,
  Edit2, Trash2, Reply, Users, Hash, Lock, Bell, BellOff, X, Plus, AtSign, Image as ImageIcon, File
} from 'lucide-react';

const EMOJI_QUICK_REACTIONS = ['👍', '❤️', '😂', '😮', '😢', '🎉', '🔥', '👏'];

export function EnhancedMessagingPage() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingMessage, setEditingMessage] = useState<Message | null>(null);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [hoveredMessageId, setHoveredMessageId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user?.id) {
      loadConversations();
      advancedMessagingService.updatePresence(user.id, 'online');

      const channel = advancedMessagingService.subscribeToConversation(
        selectedConversation?.id || '',
        () => {
          loadConversations();
          if (selectedConversation) loadMessages(selectedConversation.id);
        }
      );

      return () => {
        advancedMessagingService.updatePresence(user.id, 'offline');
        channel.unsubscribe();
      };
    }
  }, [user?.id, selectedConversation?.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadConversations = async () => {
    if (!user?.id) return;
    setLoading(true);
    const data = await advancedMessagingService.getConversations(user.id);
    setConversations(data);
    setLoading(false);
  };

  const loadMessages = async (conversationId: string) => {
    const data = await advancedMessagingService.getMessages(conversationId);
    setMessages(data);

    if (user?.id) {
      await advancedMessagingService.markConversationAsRead(conversationId, user.id);
      await loadConversations();
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!newMessage.trim() && selectedFiles.length === 0) || !selectedConversation || !user?.id) return;

    const mentions = extractMentions(newMessage);

    const message = await advancedMessagingService.sendMessage(
      selectedConversation.id,
      user.id,
      newMessage.trim(),
      mentions,
      replyingTo?.id
    );

    if (message && selectedFiles.length > 0) {
      for (const file of selectedFiles) {
        await advancedMessagingService.uploadAttachment(message.id, file);
      }
    }

    if (message) {
      setNewMessage('');
      setSelectedFiles([]);
      setReplyingTo(null);
      await loadMessages(selectedConversation.id);
      await loadConversations();
    }
  };

  const handleEditMessage = async () => {
    if (!editingMessage || !newMessage.trim()) return;

    const success = await advancedMessagingService.editMessage(editingMessage.id, newMessage.trim());
    if (success && selectedConversation) {
      setNewMessage('');
      setEditingMessage(null);
      await loadMessages(selectedConversation.id);
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce message ?')) return;

    const success = await advancedMessagingService.deleteMessage(messageId);
    if (success && selectedConversation) {
      await loadMessages(selectedConversation.id);
    }
  };

  const handleReaction = async (messageId: string, emoji: string) => {
    if (!user?.id) return;
    await advancedMessagingService.addReaction(messageId, user.id, emoji);
    if (selectedConversation) {
      await loadMessages(selectedConversation.id);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const extractMentions = (text: string): string[] => {
    const mentionRegex = /@(\w+)/g;
    const mentions: string[] = [];
    let match;
    while ((match = mentionRegex.exec(text)) !== null) {
      mentions.push(match[1]);
    }
    return mentions;
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'À l\'instant';
    if (diffMins < 60) return `${diffMins} min`;
    if (diffHours < 24) return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    if (diffDays === 1) return 'Hier';
    if (diffDays < 7) return `Il y a ${diffDays}j`;
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  };

  const getConversationTitle = (conv: Conversation) => {
    if (conv.type === 'group' || conv.type === 'channel') {
      return conv.name || 'Sans nom';
    }
    return 'Conversation directe';
  };

  const getConversationIcon = (conv: Conversation) => {
    if (conv.type === 'channel') return <Hash className="w-4 h-4" />;
    if (conv.type === 'group') return <Users className="w-4 h-4" />;
    return null;
  };

  const filteredConversations = conversations.filter(conv =>
    getConversationTitle(conv).toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.last_message_preview?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-screen flex bg-slate-50 dark:bg-black">
      {/* Sidebar - Liste des conversations */}
      <div className={`${selectedConversation ? 'hidden md:flex' : 'flex'} w-full md:w-96 flex-col bg-white dark:bg-zinc-950 border-r border-slate-200 dark:border-zinc-800`}>
        <div className="p-4 border-b border-slate-200 dark:border-zinc-800">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Messages</h1>
            <button
              onClick={() => setShowCreateGroup(true)}
              className="p-2 hover:bg-slate-100 dark:hover:bg-zinc-900 rounded-lg transition-colors"
              title="Créer un groupe ou channel"
            >
              <Plus className="w-5 h-5 text-slate-600 dark:text-zinc-400" />
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-zinc-500" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800 focus:outline-none focus:border-slate-300 dark:focus:border-zinc-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-slate-600 dark:text-zinc-400">Aucune conversation</p>
            </div>
          ) : (
            filteredConversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setSelectedConversation(conv)}
                className={`w-full p-4 flex items-start gap-3 hover:bg-slate-50 dark:hover:bg-zinc-900 transition-colors ${
                  selectedConversation?.id === conv.id ? 'bg-slate-50 dark:bg-zinc-900' : ''
                }`}
              >
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                    {getConversationIcon(conv) || getConversationTitle(conv)[0]}
                  </div>
                  {conv.unread_count && conv.unread_count > 0 && (
                    <Circle className="absolute -top-1 -right-1 w-4 h-4 text-blue-600 fill-blue-600" />
                  )}
                </div>

                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center gap-2 mb-1">
                    {conv.type === 'channel' && <Hash className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />}
                    {conv.type === 'group' && <Users className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />}
                    {conv.is_private && <Lock className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />}
                    <h3 className="font-semibold text-slate-900 dark:text-white truncate flex-1">
                      {getConversationTitle(conv)}
                    </h3>
                    <span className="text-xs text-slate-500 dark:text-zinc-500 flex-shrink-0">
                      {formatTime(conv.last_message_at)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className={`text-sm truncate ${
                      conv.unread_count && conv.unread_count > 0
                        ? 'text-slate-900 dark:text-white font-medium'
                        : 'text-slate-600 dark:text-zinc-400'
                    }`}>
                      {conv.last_message_preview || 'Aucun message'}
                    </p>
                    {conv.unread_count && conv.unread_count > 0 && (
                      <span className="ml-2 flex-shrink-0 bg-blue-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {conv.unread_count}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Zone de conversation */}
      <div className={`${selectedConversation ? 'flex' : 'hidden md:flex'} flex-1 flex-col bg-white dark:bg-zinc-950`}>
        {selectedConversation ? (
          <>
            {/* Header */}
            <div className="p-4 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedConversation(null)}
                  className="md:hidden p-2 hover:bg-slate-100 dark:hover:bg-zinc-900 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-zinc-400" />
                </button>
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold">
                  {getConversationIcon(selectedConversation) || getConversationTitle(selectedConversation)[0]}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-semibold text-slate-900 dark:text-white">
                      {getConversationTitle(selectedConversation)}
                    </h2>
                    {selectedConversation.is_private && <Lock className="w-4 h-4 text-slate-500" />}
                  </div>
                  {selectedConversation.description && (
                    <p className="text-xs text-slate-500 dark:text-zinc-500">
                      {selectedConversation.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-slate-100 dark:hover:bg-zinc-900 rounded-lg transition-colors">
                  <Phone className="w-5 h-5 text-slate-600 dark:text-zinc-400" />
                </button>
                <button className="p-2 hover:bg-slate-100 dark:hover:bg-zinc-900 rounded-lg transition-colors">
                  <Video className="w-5 h-5 text-slate-600 dark:text-zinc-400" />
                </button>
                <button className="p-2 hover:bg-slate-100 dark:hover:bg-zinc-900 rounded-lg transition-colors">
                  <MoreVertical className="w-5 h-5 text-slate-600 dark:text-zinc-400" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
                    <div className="max-w-[70%] space-y-1">
                      {message.parent_message_id && (
                        <div className="text-xs text-slate-500 dark:text-zinc-500 flex items-center gap-1 mb-1">
                          <Reply className="w-3 h-3" />
                          Réponse à un message
                        </div>
                      )}

                      <div className="relative">
                        <div
                          className={`rounded-2xl px-4 py-2 ${
                            isOwn
                              ? 'bg-blue-600 text-white'
                              : 'bg-slate-100 dark:bg-zinc-900 text-slate-900 dark:text-white'
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>

                          {/* Attachments */}
                          {attachments.length > 0 && (
                            <div className="mt-2 space-y-2">
                              {attachments.map((att) => (
                                <a
                                  key={att.id}
                                  href={att.file_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                                >
                                  {att.file_type.startsWith('image/') ? (
                                    <ImageIcon className="w-4 h-4" />
                                  ) : (
                                    <File className="w-4 h-4" />
                                  )}
                                  <span className="text-xs truncate">{att.file_name}</span>
                                </a>
                              ))}
                            </div>
                          )}

                          <div className="flex items-center gap-2 mt-1">
                            <p className={`text-xs ${
                              isOwn ? 'text-blue-100' : 'text-slate-500 dark:text-zinc-500'
                            }`}>
                              {formatTime(message.created_at)}
                            </p>
                            {message.edited_at && (
                              <span className={`text-xs ${
                                isOwn ? 'text-blue-100' : 'text-slate-500 dark:text-zinc-500'
                              }`}>
                                (modifié)
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Quick reactions on hover */}
                        {hoveredMessageId === message.id && (
                          <div className={`absolute -top-3 ${isOwn ? 'right-0' : 'left-0'} flex gap-1 bg-white dark:bg-zinc-800 rounded-full px-2 py-1 shadow-lg border border-slate-200 dark:border-zinc-700`}>
                            {EMOJI_QUICK_REACTIONS.map((emoji) => (
                              <button
                                key={emoji}
                                onClick={() => handleReaction(message.id, emoji)}
                                className="hover:scale-125 transition-transform"
                              >
                                {emoji}
                              </button>
                            ))}
                            {isOwn && (
                              <>
                                <button
                                  onClick={() => {
                                    setEditingMessage(message);
                                    setNewMessage(message.content);
                                  }}
                                  className="p-1 hover:bg-slate-100 dark:hover:bg-zinc-700 rounded"
                                >
                                  <Edit2 className="w-3 h-3 text-slate-600 dark:text-zinc-400" />
                                </button>
                                <button
                                  onClick={() => handleDeleteMessage(message.id)}
                                  className="p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded"
                                >
                                  <Trash2 className="w-3 h-3 text-red-600 dark:text-red-400" />
                                </button>
                              </>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Reactions display */}
                      {reactions.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {Object.entries(
                            reactions.reduce((acc: any, r) => {
                              acc[r.emoji] = (acc[r.emoji] || 0) + 1;
                              return acc;
                            }, {})
                          ).map(([emoji, count]) => (
                            <button
                              key={emoji}
                              onClick={() => handleReaction(message.id, emoji)}
                              className="flex items-center gap-1 px-2 py-0.5 bg-slate-100 dark:bg-zinc-800 rounded-full text-xs hover:bg-slate-200 dark:hover:bg-zinc-700 transition-colors"
                            >
                              <span>{emoji}</span>
                              <span className="text-slate-600 dark:text-zinc-400">{count as number}</span>
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

            {/* Input area */}
            <div className="p-4 border-t border-slate-200 dark:border-zinc-800">
              {replyingTo && (
                <div className="mb-2 p-2 bg-slate-50 dark:bg-zinc-900 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-zinc-400">
                    <Reply className="w-4 h-4" />
                    <span>Réponse à: {replyingTo.content.substring(0, 50)}...</span>
                  </div>
                  <button onClick={() => setReplyingTo(null)} className="p-1 hover:bg-slate-200 dark:hover:bg-zinc-800 rounded">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {editingMessage && (
                <div className="mb-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
                    <Edit2 className="w-4 h-4" />
                    <span>Modification en cours</span>
                  </div>
                  <button onClick={() => { setEditingMessage(null); setNewMessage(''); }} className="p-1 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {selectedFiles.length > 0 && (
                <div className="mb-2 flex flex-wrap gap-2">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="flex items-center gap-2 px-3 py-2 bg-slate-100 dark:bg-zinc-900 rounded-lg">
                      <File className="w-4 h-4 text-slate-600 dark:text-zinc-400" />
                      <span className="text-sm text-slate-900 dark:text-white truncate max-w-[150px]">{file.name}</span>
                      <button onClick={() => setSelectedFiles(selectedFiles.filter((_, i) => i !== index))} className="p-0.5 hover:bg-slate-200 dark:hover:bg-zinc-800 rounded">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <form onSubmit={editingMessage ? handleEditMessage : handleSendMessage} className="flex items-end gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  className="hidden"
                  multiple
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2.5 hover:bg-slate-100 dark:hover:bg-zinc-900 rounded-lg transition-colors flex-shrink-0"
                >
                  <Paperclip className="w-5 h-5 text-slate-600 dark:text-zinc-400" />
                </button>

                <div className="flex-1 relative">
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        editingMessage ? handleEditMessage() : handleSendMessage(e);
                      }
                    }}
                    placeholder="Écrivez votre message... (@mention, #hashtag)"
                    className="w-full px-4 py-3 pr-12 bg-slate-50 dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800 focus:outline-none focus:border-slate-300 dark:focus:border-zinc-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 resize-none max-h-32"
                    rows={1}
                  />
                  <button
                    type="button"
                    className="absolute right-3 bottom-3 p-1 hover:bg-slate-200 dark:hover:bg-zinc-800 rounded transition-colors"
                  >
                    <Smile className="w-5 h-5 text-slate-600 dark:text-zinc-400" />
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={!newMessage.trim() && selectedFiles.length === 0}
                  className="p-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-zinc-800 disabled:cursor-not-allowed rounded-xl transition-colors flex-shrink-0"
                >
                  <Send className="w-5 h-5 text-white" />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-24 h-24 bg-slate-100 dark:bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="w-12 h-12 text-slate-400 dark:text-zinc-500" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                Sélectionnez une conversation
              </h3>
              <p className="text-slate-600 dark:text-zinc-400 mb-4">
                Choisissez une conversation pour commencer à échanger
              </p>
              <button
                onClick={() => setShowCreateGroup(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Créer un groupe ou channel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
