import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { messagingService, Conversation, Message } from '../../services/messagingService';
import { Send, Search, MoreVertical, Phone, Video, Paperclip, Smile, ArrowLeft, Circle } from 'lucide-react';

export function MessagingPage() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user?.id) {
      loadConversations();

      const channel = messagingService.subscribeToConversations(user.id, () => {
        loadConversations();
      });

      return () => {
        channel.unsubscribe();
      };
    }
  }, [user?.id]);

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.id);

      const channel = messagingService.subscribeToConversation(selectedConversation.id, () => {
        loadMessages(selectedConversation.id);
      });

      return () => {
        channel.unsubscribe();
      };
    }
  }, [selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadConversations = async () => {
    if (!user?.id) return;
    setLoading(true);
    const data = await messagingService.getConversations(user.id);
    setConversations(data);
    setLoading(false);
  };

  const loadMessages = async (conversationId: string) => {
    const data = await messagingService.getMessages(conversationId);
    setMessages(data);

    if (user?.id) {
      await messagingService.markMessagesAsRead(conversationId, user.id);
      await loadConversations();
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation || !user?.id) return;

    const message = await messagingService.sendMessage(
      selectedConversation.id,
      user.id,
      newMessage.trim()
    );

    if (message) {
      setNewMessage('');
      await loadMessages(selectedConversation.id);
      await loadConversations();
    }
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

  const filteredConversations = conversations.filter(conv =>
    conv.other_user?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.other_user?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.last_message_preview?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-screen flex bg-slate-50 dark:bg-black">
      <div className={`${selectedConversation ? 'hidden md:flex' : 'flex'} w-full md:w-96 flex-col bg-white dark:bg-zinc-950 border-r border-slate-200 dark:border-zinc-800`}>
        <div className="p-4 border-b border-slate-200 dark:border-zinc-800">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Messages</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-zinc-500" />
            <input
              type="text"
              placeholder="Rechercher une conversation..."
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
                    {conv.other_user?.full_name?.[0] || conv.other_user?.email?.[0] || '?'}
                  </div>
                  {conv.unread_count && conv.unread_count > 0 && (
                    <Circle className="absolute -top-1 -right-1 w-4 h-4 text-blue-600 fill-blue-600" />
                  )}
                </div>

                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-slate-900 dark:text-white truncate">
                      {conv.other_user?.full_name || conv.other_user?.email || 'Utilisateur inconnu'}
                    </h3>
                    <span className="text-xs text-slate-500 dark:text-zinc-500 flex-shrink-0 ml-2">
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

      <div className={`${selectedConversation ? 'flex' : 'hidden md:flex'} flex-1 flex-col bg-white dark:bg-zinc-950`}>
        {selectedConversation ? (
          <>
            <div className="p-4 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedConversation(null)}
                  className="md:hidden p-2 hover:bg-slate-100 dark:hover:bg-zinc-900 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-zinc-400" />
                </button>
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold">
                  {selectedConversation.other_user?.full_name?.[0] || selectedConversation.other_user?.email?.[0] || '?'}
                </div>
                <div>
                  <h2 className="font-semibold text-slate-900 dark:text-white">
                    {selectedConversation.other_user?.full_name || selectedConversation.other_user?.email || 'Utilisateur inconnu'}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-zinc-500">
                    {selectedConversation.other_user?.user_type || 'En ligne'}
                  </p>
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

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => {
                const isOwn = message.sender_id === user?.id;
                return (
                  <div
                    key={message.id}
                    className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                        isOwn
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 dark:bg-zinc-900 text-slate-900 dark:text-white'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                      <p className={`text-xs mt-1 ${
                        isOwn ? 'text-blue-100' : 'text-slate-500 dark:text-zinc-500'
                      }`}>
                        {formatTime(message.created_at)}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-200 dark:border-zinc-800">
              <div className="flex items-end gap-2">
                <button
                  type="button"
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
                        handleSendMessage(e);
                      }
                    }}
                    placeholder="Écrivez votre message..."
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
                  disabled={!newMessage.trim()}
                  className="p-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-zinc-800 disabled:cursor-not-allowed rounded-xl transition-colors flex-shrink-0"
                >
                  <Send className="w-5 h-5 text-white" />
                </button>
              </div>
            </form>
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
              <p className="text-slate-600 dark:text-zinc-400">
                Choisissez une conversation pour commencer à échanger
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
