import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { advancedMessagingService, Conversation, Message } from '../../services/advancedMessagingService';
import {
  Send, Search, MoreVertical, Phone, Video, Paperclip, Smile, ArrowLeft, Circle,
  Edit2, Trash2, Reply, Users, Hash, Lock, X, Plus, Image as ImageIcon, File, Mic
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
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [hoveredMessageId, setHoveredMessageId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
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
    <div className="h-screen flex bg-slate-50 dark:bg-black overflow-hidden">
      <div className={`${selectedConversation ? 'hidden md:flex' : 'flex'} w-full md:w-96 flex-col bg-white dark:bg-zinc-950 border-r border-slate-200 dark:border-zinc-800`}>
        <div className="p-4 border-b border-slate-200 dark:border-zinc-800 flex-shrink-0">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Messages</h1>
            <button
              className="p-2 hover:bg-slate-100 dark:hover:bg-zinc-900 rounded-lg transition-colors"
              title="Nouvelle conversation"
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
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800 focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500"
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
                className={`w-full p-4 flex items-start gap-3 hover:bg-slate-50 dark:hover:bg-zinc-900 transition-colors border-b border-slate-100 dark:border-zinc-900 ${
                  selectedConversation?.id === conv.id ? 'bg-slate-100 dark:bg-zinc-900' : ''
                }`}
              >
                <div className="relative flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {getConversationIcon(conv) || getConversationTitle(conv)[0]}
                  </div>
                  {conv.unread_count && conv.unread_count > 0 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">{conv.unread_count}</span>
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-slate-900 dark:text-white truncate">
                      {getConversationTitle(conv)}
                    </h3>
                    <span className="text-xs text-slate-500 dark:text-zinc-500 flex-shrink-0 ml-2">
                      {formatTime(conv.last_message_at)}
                    </span>
                  </div>
                  <p className={`text-sm truncate ${
                    conv.unread_count && conv.unread_count > 0
                      ? 'text-slate-900 dark:text-white font-medium'
                      : 'text-slate-600 dark:text-zinc-400'
                  }`}>
                    {conv.last_message_preview || 'Aucun message'}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      <div className={`${selectedConversation ? 'flex' : 'hidden md:flex'} flex-1 flex-col bg-white dark:bg-zinc-950`}>
        {selectedConversation ? (
          <>
            <div className="p-4 border-b border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedConversation(null)}
                  className="md:hidden p-2 hover:bg-slate-200 dark:hover:bg-zinc-800 rounded-lg transition-colors"
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
                <button className="p-2 hover:bg-slate-200 dark:hover:bg-zinc-800 rounded-lg transition-colors">
                  <Video className="w-5 h-5 text-slate-600 dark:text-zinc-400" />
                </button>
                <button className="p-2 hover:bg-slate-200 dark:hover:bg-zinc-800 rounded-lg transition-colors">
                  <Phone className="w-5 h-5 text-slate-600 dark:text-zinc-400" />
                </button>
                <button className="p-2 hover:bg-slate-200 dark:hover:bg-zinc-800 rounded-lg transition-colors">
                  <MoreVertical className="w-5 h-5 text-slate-600 dark:text-zinc-400" />
                </button>
              </div>
            </div>

            <div
              className="flex-1 overflow-y-auto p-4 space-y-3"
              style={{
                backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23e2e8f0\' fill-opacity=\'0.1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
              }}
            >
              <div className="text-center my-4">
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs rounded-full">
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
                    <div className="max-w-[75%] md:max-w-[60%]">
                      <div className="relative">
                        <div
                          className={`rounded-lg px-3 py-2 shadow-sm ${
                            isOwn
                              ? 'bg-blue-600 text-white rounded-br-none'
                              : 'bg-white dark:bg-zinc-800 text-slate-900 dark:text-white rounded-bl-none border border-slate-200 dark:border-zinc-700'
                          }`}
                        >
                          {attachments.length > 0 && (
                            <div className="mb-2 space-y-2">
                              {attachments.map((att) => (
                                <a
                                  key={att.id}
                                  href={att.file_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={`flex items-center gap-2 p-2 rounded ${
                                    isOwn ? 'bg-blue-700' : 'bg-slate-100 dark:bg-zinc-700'
                                  }`}
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

                          <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>

                          <div className={`flex items-center justify-end gap-1 mt-1 ${
                            isOwn ? 'text-blue-100' : 'text-slate-500 dark:text-zinc-500'
                          }`}>
                            <span className="text-xs">{formatTime(message.created_at)}</span>
                            {isOwn && message.read && (
                              <svg className="w-4 h-4 text-blue-200" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                              </svg>
                            )}
                          </div>
                        </div>

                        {hoveredMessageId === message.id && (
                          <div className={`absolute -top-8 ${isOwn ? 'right-0' : 'left-0'} flex gap-1 bg-white dark:bg-zinc-800 rounded-full px-2 py-1 shadow-lg border border-slate-200 dark:border-zinc-700 opacity-0 group-hover:opacity-100 transition-opacity`}>
                            {EMOJI_QUICK_REACTIONS.slice(0, 5).map((emoji) => (
                              <button
                                key={emoji}
                                onClick={() => handleReaction(message.id, emoji)}
                                className="hover:scale-125 transition-transform text-base"
                              >
                                {emoji}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      {reactions.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1 px-2">
                          {Object.entries(
                            reactions.reduce((acc: any, r) => {
                              acc[r.emoji] = (acc[r.emoji] || 0) + 1;
                              return acc;
                            }, {})
                          ).map(([emoji, count]) => (
                            <button
                              key={emoji}
                              onClick={() => handleReaction(message.id, emoji)}
                              className="flex items-center gap-1 px-2 py-0.5 bg-slate-100 dark:bg-zinc-800 rounded-full text-xs hover:bg-slate-200 dark:hover:bg-zinc-700 transition-colors border border-slate-200 dark:border-zinc-700"
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

            <div className="p-3 bg-slate-50 dark:bg-zinc-900 border-t border-slate-200 dark:border-zinc-800 flex-shrink-0">
              {replyingTo && (
                <div className="mb-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
                    <Reply className="w-4 h-4" />
                    <span className="truncate">Réponse à: {replyingTo.content.substring(0, 50)}...</span>
                  </div>
                  <button onClick={() => setReplyingTo(null)} className="p-1 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {selectedFiles.length > 0 && (
                <div className="mb-2 flex flex-wrap gap-2">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-zinc-800 rounded-lg border border-slate-200 dark:border-zinc-700">
                      <File className="w-4 h-4 text-slate-600 dark:text-zinc-400" />
                      <span className="text-sm text-slate-900 dark:text-white truncate max-w-[150px]">{file.name}</span>
                      <button onClick={() => setSelectedFiles(selectedFiles.filter((_, i) => i !== index))}>
                        <X className="w-4 h-4 text-slate-500" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-end gap-2">
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
                  className="p-2.5 hover:bg-slate-200 dark:hover:bg-zinc-800 rounded-full transition-colors flex-shrink-0"
                  title="Joindre un fichier"
                >
                  <Paperclip className="w-5 h-5 text-slate-600 dark:text-zinc-400" />
                </button>

                <div className="flex-1 relative bg-white dark:bg-zinc-800 rounded-full border border-slate-200 dark:border-zinc-700 focus-within:border-blue-500 dark:focus-within:border-blue-500 transition-colors">
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
                    placeholder="Tapez un message..."
                    className="w-full px-4 py-3 pr-12 bg-transparent focus:outline-none text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 resize-none"
                    rows={1}
                    style={{ maxHeight: '120px' }}
                  />
                  <button
                    type="button"
                    className="absolute right-3 bottom-3 p-1 hover:bg-slate-100 dark:hover:bg-zinc-700 rounded-full transition-colors"
                  >
                    <Smile className="w-5 h-5 text-slate-500 dark:text-zinc-400" />
                  </button>
                </div>

                <button
                  onClick={() => handleSendMessage()}
                  disabled={!newMessage.trim() && selectedFiles.length === 0}
                  className={`p-3 rounded-full transition-colors flex-shrink-0 ${
                    newMessage.trim() || selectedFiles.length > 0
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-slate-200 dark:bg-zinc-800 text-slate-400 dark:text-zinc-600 cursor-not-allowed'
                  }`}
                  title="Envoyer"
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
          <div className="flex-1 flex items-center justify-center bg-slate-50 dark:bg-zinc-950">
            <div className="text-center max-w-md px-8">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
                <Send className="w-16 h-16 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                Bienvenue dans votre messagerie
              </h3>
              <p className="text-slate-600 dark:text-zinc-400 mb-6">
                Sélectionnez une conversation pour commencer à échanger avec vos contacts
              </p>
              <button
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors shadow-lg hover:shadow-xl inline-flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Nouvelle conversation
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
