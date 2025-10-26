import { useState, useEffect } from 'react';
import { MessageSquare, Send, User, Search } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  read: boolean;
  created_at: string;
  sender_profile?: {
    user_type: string;
    athlete_profile?: {
      first_name: string;
      last_name: string;
    };
    company_profile?: {
      company_name: string;
    };
    sponsor_profile?: {
      company_name: string;
    };
  };
  receiver_profile?: {
    user_type: string;
    athlete_profile?: {
      first_name: string;
      last_name: string;
    };
    company_profile?: {
      company_name: string;
    };
    sponsor_profile?: {
      company_name: string;
    };
  };
}

interface Conversation {
  userId: string;
  userName: string;
  userType: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

export function MessagesList() {
  const { user, profile } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (user) {
      loadConversations();
    }
  }, [user]);

  useEffect(() => {
    if (selectedUserId && user) {
      loadMessages(selectedUserId);
    }
  }, [selectedUserId, user]);

  const loadConversations = async () => {
    try {
      setLoading(true);

      const { data: sentMessages, error: sentError } = await supabase
        .from('messages')
        .select(`
          id,
          receiver_id,
          content,
          created_at,
          read,
          receiver_profile:profiles!messages_receiver_id_fkey (
            user_type,
            athlete_profile:athlete_profiles (first_name, last_name),
            company_profile:company_profiles (company_name),
            sponsor_profile:sponsor_profiles (company_name)
          )
        `)
        .eq('sender_id', user!.id)
        .order('created_at', { ascending: false });

      const { data: receivedMessages, error: receivedError } = await supabase
        .from('messages')
        .select(`
          id,
          sender_id,
          content,
          created_at,
          read,
          sender_profile:profiles!messages_sender_id_fkey (
            user_type,
            athlete_profile:athlete_profiles (first_name, last_name),
            company_profile:company_profiles (company_name),
            sponsor_profile:sponsor_profiles (company_name)
          )
        `)
        .eq('receiver_id', user!.id)
        .order('created_at', { ascending: false });

      if (sentError) throw sentError;
      if (receivedError) throw receivedError;

      const conversationsMap = new Map<string, Conversation>();

      sentMessages?.forEach((msg: any) => {
        const otherUserId = msg.receiver_id;
        const profile = msg.receiver_profile;
        const userName = getUserName(profile);

        if (!conversationsMap.has(otherUserId)) {
          conversationsMap.set(otherUserId, {
            userId: otherUserId,
            userName,
            userType: profile?.user_type || 'unknown',
            lastMessage: msg.content,
            lastMessageTime: msg.created_at,
            unreadCount: 0
          });
        }
      });

      receivedMessages?.forEach((msg: any) => {
        const otherUserId = msg.sender_id;
        const profile = msg.sender_profile;
        const userName = getUserName(profile);

        const existing = conversationsMap.get(otherUserId);
        const unreadCount = (existing?.unreadCount || 0) + (!msg.read ? 1 : 0);

        if (!existing || new Date(msg.created_at) > new Date(existing.lastMessageTime)) {
          conversationsMap.set(otherUserId, {
            userId: otherUserId,
            userName,
            userType: profile?.user_type || 'unknown',
            lastMessage: msg.content,
            lastMessageTime: msg.created_at,
            unreadCount
          });
        } else {
          existing.unreadCount = unreadCount;
        }
      });

      const conversationsArray = Array.from(conversationsMap.values()).sort(
        (a, b) => new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime()
      );

      setConversations(conversationsArray);
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (otherUserId: string) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender_profile:profiles!messages_sender_id_fkey (
            user_type,
            athlete_profile:athlete_profiles (first_name, last_name),
            company_profile:company_profiles (company_name),
            sponsor_profile:sponsor_profiles (company_name)
          ),
          receiver_profile:profiles!messages_receiver_id_fkey (
            user_type,
            athlete_profile:athlete_profiles (first_name, last_name),
            company_profile:company_profiles (company_name),
            sponsor_profile:sponsor_profiles (company_name)
          )
        `)
        .or(`and(sender_id.eq.${user!.id},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${user!.id})`)
        .order('created_at', { ascending: true });

      if (error) throw error;

      setMessages(data || []);

      await supabase
        .from('messages')
        .update({ read: true })
        .eq('receiver_id', user!.id)
        .eq('sender_id', otherUserId)
        .eq('read', false);

      loadConversations();
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedUserId || !user) return;

    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          sender_id: user.id,
          receiver_id: selectedUserId,
          content: newMessage.trim()
        });

      if (error) throw error;

      setNewMessage('');
      loadMessages(selectedUserId);
      loadConversations();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const getUserName = (profile: any): string => {
    if (!profile) return 'Utilisateur';

    if (profile.user_type === 'athlete' && profile.athlete_profile) {
      return `${profile.athlete_profile.first_name || ''} ${profile.athlete_profile.last_name || ''}`.trim() || 'Athlète';
    }

    if (profile.user_type === 'company' && profile.company_profile) {
      return profile.company_profile.company_name || 'Entreprise';
    }

    if (profile.user_type === 'sponsor' && profile.sponsor_profile) {
      return profile.sponsor_profile.company_name || 'Sponsor';
    }

    return 'Utilisateur';
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'À l\'instant';
    if (diffMins < 60) return `Il y a ${diffMins}min`;
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    if (diffDays < 7) return `Il y a ${diffDays}j`;
    return date.toLocaleDateString('fr-FR');
  };

  const filteredConversations = conversations.filter(conv =>
    conv.userName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Chargement des messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden" style={{ height: 'calc(100vh - 8rem)' }}>
          <div className="grid grid-cols-3 h-full">
            <div className="col-span-1 border-r border-slate-200 flex flex-col">
              <div className="p-4 border-b border-slate-200">
                <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center">
                  <MessageSquare className="mr-2 text-blue-600" />
                  Messages
                </h2>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Rechercher une conversation..."
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto">
                {filteredConversations.length === 0 ? (
                  <div className="p-4 text-center text-slate-500">
                    <MessageSquare className="h-12 w-12 mx-auto mb-2 text-slate-300" />
                    <p>Aucune conversation</p>
                  </div>
                ) : (
                  filteredConversations.map((conv) => (
                    <button
                      key={conv.userId}
                      onClick={() => setSelectedUserId(conv.userId)}
                      className={`w-full p-4 border-b border-slate-100 hover:bg-slate-50 transition-colors text-left ${
                        selectedUserId === conv.userId ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <User className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-1">
                            <p className="font-semibold text-slate-900 truncate">{conv.userName}</p>
                            {conv.unreadCount > 0 && (
                              <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                                {conv.unreadCount}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-slate-500 truncate">{conv.lastMessage}</p>
                          <p className="text-xs text-slate-400 mt-1">{formatTime(conv.lastMessageTime)}</p>
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>

            <div className="col-span-2 flex flex-col">
              {selectedUserId ? (
                <>
                  <div className="p-4 border-b border-slate-200 bg-slate-50">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">
                          {conversations.find(c => c.userId === selectedUserId)?.userName}
                        </p>
                        <p className="text-sm text-slate-500">
                          {conversations.find(c => c.userId === selectedUserId)?.userType}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((message) => {
                      const isOwnMessage = message.sender_id === user?.id;
                      return (
                        <div
                          key={message.id}
                          className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                              isOwnMessage
                                ? 'bg-blue-600 text-white'
                                : 'bg-slate-100 text-slate-900'
                            }`}
                          >
                            <p className="break-words">{message.content}</p>
                            <p
                              className={`text-xs mt-1 ${
                                isOwnMessage ? 'text-blue-100' : 'text-slate-500'
                              }`}
                            >
                              {formatTime(message.created_at)}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="p-4 border-t border-slate-200 bg-white">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                        placeholder="Écrivez votre message..."
                        className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={sendMessage}
                        disabled={!newMessage.trim()}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                      >
                        <Send className="h-5 w-5" />
                        <span>Envoyer</span>
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-slate-400">
                  <div className="text-center">
                    <MessageSquare className="h-16 w-16 mx-auto mb-4 text-slate-300" />
                    <p className="text-lg">Sélectionnez une conversation</p>
                    <p className="text-sm">pour commencer à échanger</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
