import { supabase } from '../lib/supabase';

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  read: boolean;
  created_at: string;
}

export interface Conversation {
  id: string;
  participant1_id: string;
  participant2_id: string;
  last_message_at: string;
  last_message_preview?: string;
  created_at: string;
  other_user?: {
    id: string;
    email: string;
    user_type: string;
    full_name?: string;
  };
  unread_count?: number;
}

export const messagingService = {
  async getConversations(userId: string): Promise<Conversation[]> {
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .or(`participant1_id.eq.${userId},participant2_id.eq.${userId}`)
      .order('last_message_at', { ascending: false });

    if (error) {
      console.error('Error fetching conversations:', error);
      return [];
    }

    const conversationsWithUsers = await Promise.all(
      (data || []).map(async (conv) => {
        const otherUserId = conv.participant1_id === userId ? conv.participant2_id : conv.participant1_id;

        const { data: userData } = await supabase
          .from('sponsors')
          .select('user_id, company_name as full_name, contact_email as email')
          .eq('user_id', otherUserId)
          .maybeSingle();

        const unreadCount = await this.getUnreadCountForConversation(conv.id, userId);

        return {
          ...conv,
          other_user: userData ? {
            id: userData.user_id,
            email: userData.email,
            full_name: userData.full_name,
            user_type: 'sponsor'
          } : undefined,
          unread_count: unreadCount
        };
      })
    );

    return conversationsWithUsers;
  },

  async getMessages(conversationId: string): Promise<Message[]> {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching messages:', error);
      return [];
    }

    return data || [];
  },

  async sendMessage(conversationId: string, senderId: string, content: string): Promise<Message | null> {
    const { data, error } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        sender_id: senderId,
        content,
        read: false
      })
      .select()
      .single();

    if (error) {
      console.error('Error sending message:', error);
      return null;
    }

    return data;
  },

  async getOrCreateConversation(userId: string, otherUserId: string): Promise<string | null> {
    const { data, error } = await supabase.rpc('get_or_create_conversation', {
      p_user1_id: userId,
      p_user2_id: otherUserId
    });

    if (error) {
      console.error('Error getting/creating conversation:', error);
      return null;
    }

    return data;
  },

  async markMessagesAsRead(conversationId: string, userId: string): Promise<boolean> {
    const { error } = await supabase
      .from('messages')
      .update({ read: true })
      .eq('conversation_id', conversationId)
      .neq('sender_id', userId)
      .eq('read', false);

    if (error) {
      console.error('Error marking messages as read:', error);
      return false;
    }

    return true;
  },

  async getUnreadCount(userId: string): Promise<number> {
    const { data, error } = await supabase.rpc('count_unread_messages', {
      p_user_id: userId
    });

    if (error) {
      console.error('Error counting unread messages:', error);
      return 0;
    }

    return data || 0;
  },

  async getUnreadCountForConversation(conversationId: string, userId: string): Promise<number> {
    const { count, error } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('conversation_id', conversationId)
      .neq('sender_id', userId)
      .eq('read', false);

    if (error) {
      console.error('Error counting unread messages for conversation:', error);
      return 0;
    }

    return count || 0;
  },

  subscribeToConversation(conversationId: string, callback: (payload: any) => void) {
    const channel = supabase
      .channel(`conversation:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`
        },
        callback
      )
      .subscribe();

    return channel;
  },

  subscribeToConversations(userId: string, callback: (payload: any) => void) {
    const channel = supabase
      .channel('conversations')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'conversations',
          filter: `participant1_id=eq.${userId}`
        },
        callback
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'conversations',
          filter: `participant2_id=eq.${userId}`
        },
        callback
      )
      .subscribe();

    return channel;
  }
};
