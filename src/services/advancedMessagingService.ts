import { supabase } from '../lib/supabase';

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  read: boolean;
  created_at: string;
  edited_at?: string;
  deleted_at?: string;
  parent_message_id?: string;
  mentions?: string[];
  reactions?: MessageReaction[];
  attachments?: MessageAttachment[];
}

export interface MessageReaction {
  id: string;
  message_id: string;
  user_id: string;
  emoji: string;
  created_at: string;
}

export interface MessageAttachment {
  id: string;
  message_id: string;
  file_name: string;
  file_url: string;
  file_type: string;
  file_size?: number;
  thumbnail_url?: string;
  created_at: string;
}

export interface Conversation {
  id: string;
  type: 'direct' | 'group' | 'channel';
  name?: string;
  description?: string;
  avatar_url?: string;
  created_by?: string;
  is_private: boolean;
  participant1_id: string;
  participant2_id: string;
  last_message_at: string;
  last_message_preview?: string;
  created_at: string;
  members?: ConversationMember[];
  unread_count?: number;
}

export interface ConversationMember {
  id: string;
  conversation_id: string;
  user_id: string;
  role: 'owner' | 'admin' | 'moderator' | 'member';
  can_post: boolean;
  can_invite: boolean;
  joined_at: string;
  last_read_at: string;
  unread_count: number;
  muted: boolean;
  user?: {
    id: string;
    email: string;
    full_name?: string;
  };
}

export interface UserPresence {
  user_id: string;
  status: 'online' | 'away' | 'busy' | 'offline';
  last_seen_at: string;
  updated_at: string;
}

export const advancedMessagingService = {
  async getConversations(userId: string): Promise<Conversation[]> {
    const { data: memberData, error: memberError } = await supabase
      .from('conversation_members')
      .select('conversation_id, unread_count, muted')
      .eq('user_id', userId);

    if (memberError) {
      console.error('Error fetching conversation members:', memberError);
      return [];
    }

    if (!memberData || memberData.length === 0) {
      return [];
    }

    const conversationIds = memberData.map(m => m.conversation_id);

    const { data: conversationsData, error: conversationsError } = await supabase
      .from('conversations')
      .select('*')
      .in('id', conversationIds)
      .order('last_message_at', { ascending: false });

    if (conversationsError) {
      console.error('Error fetching conversations:', conversationsError);
      return [];
    }

    const memberMap = new Map(memberData.map(m => [m.conversation_id, m]));

    const conversations = conversationsData.map(conv => {
      const member = memberMap.get(conv.id);
      return {
        ...conv,
        unread_count: member?.unread_count || 0,
        muted: member?.muted || false
      };
    });

    const enrichedConversations = await Promise.all(
      conversations.map(async (conv) => {
        if (conv.type === 'direct') {
          const otherUserId = conv.participant1_id === userId ? conv.participant2_id : conv.participant1_id;

          const { data: userData } = await supabase.auth.admin.getUserById(otherUserId);

          if (userData?.user) {
            const metadata = userData.user.user_metadata || {};
            const profileData = metadata.profile_data || {};
            const fullName = `${profileData.first_name || ''} ${profileData.last_name || ''}`.trim() || metadata.full_name || 'Utilisateur';

            return {
              ...conv,
              name: fullName,
              avatar_url: metadata.avatar_url || conv.avatar_url,
              other_user_id: otherUserId
            };
          }
        }
        return conv;
      })
    );

    return enrichedConversations;
  },

  async getConversationMembers(conversationId: string): Promise<ConversationMember[]> {
    const { data, error } = await supabase
      .from('conversation_members')
      .select('*')
      .eq('conversation_id', conversationId);

    if (error) {
      console.error('Error fetching conversation members:', error);
      return [];
    }

    return data || [];
  },

  async createGroupConversation(
    name: string,
    type: 'group' | 'channel',
    memberIds: string[],
    description?: string,
    isPrivate: boolean = true
  ): Promise<string | null> {
    const { data, error } = await supabase.rpc('create_group_conversation', {
      p_name: name,
      p_type: type,
      p_description: description,
      p_is_private: isPrivate,
      p_member_ids: memberIds
    });

    if (error) {
      console.error('Error creating group conversation:', error);
      return null;
    }

    return data;
  },

  async getMessages(conversationId: string): Promise<Message[]> {
    const { data: messages, error } = await supabase
      .from('messages')
      .select(`
        *,
        message_reactions(*),
        message_attachments(*)
      `)
      .eq('conversation_id', conversationId)
      .is('deleted_at', null)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching messages:', error);
      return [];
    }

    return messages || [];
  },

  async sendMessage(
    conversationId: string,
    senderId: string,
    content: string,
    mentions?: string[],
    parentMessageId?: string
  ): Promise<Message | null> {
    const { data, error } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        sender_id: senderId,
        content,
        mentions: mentions || [],
        parent_message_id: parentMessageId,
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

  async editMessage(messageId: string, newContent: string): Promise<boolean> {
    const { error } = await supabase
      .from('messages')
      .update({
        content: newContent,
        edited_at: new Date().toISOString()
      })
      .eq('id', messageId);

    if (error) {
      console.error('Error editing message:', error);
      return false;
    }

    return true;
  },

  async deleteMessage(messageId: string): Promise<boolean> {
    const { error } = await supabase
      .from('messages')
      .update({
        deleted_at: new Date().toISOString(),
        content: 'Ce message a été supprimé'
      })
      .eq('id', messageId);

    if (error) {
      console.error('Error deleting message:', error);
      return false;
    }

    return true;
  },

  async addReaction(messageId: string, userId: string, emoji: string): Promise<boolean> {
    const { error } = await supabase
      .from('message_reactions')
      .insert({
        message_id: messageId,
        user_id: userId,
        emoji
      });

    if (error) {
      if (error.code === '23505') {
        await this.removeReaction(messageId, userId, emoji);
        return true;
      }
      console.error('Error adding reaction:', error);
      return false;
    }

    return true;
  },

  async removeReaction(messageId: string, userId: string, emoji: string): Promise<boolean> {
    const { error } = await supabase
      .from('message_reactions')
      .delete()
      .eq('message_id', messageId)
      .eq('user_id', userId)
      .eq('emoji', emoji);

    if (error) {
      console.error('Error removing reaction:', error);
      return false;
    }

    return true;
  },

  async uploadAttachment(
    messageId: string,
    file: File
  ): Promise<MessageAttachment | null> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `message-attachments/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('message-files')
      .upload(filePath, file);

    if (uploadError) {
      console.error('Error uploading file:', uploadError);
      return null;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('message-files')
      .getPublicUrl(filePath);

    const { data, error } = await supabase
      .from('message_attachments')
      .insert({
        message_id: messageId,
        file_name: file.name,
        file_url: publicUrl,
        file_type: file.type,
        file_size: file.size
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving attachment:', error);
      return null;
    }

    return data;
  },

  async markConversationAsRead(conversationId: string, userId: string): Promise<boolean> {
    const { error } = await supabase.rpc('mark_conversation_read', {
      p_conversation_id: conversationId,
      p_user_id: userId
    });

    if (error) {
      console.error('Error marking conversation as read:', error);
      return false;
    }

    return true;
  },

  async getTotalUnreadCount(userId: string): Promise<number> {
    const { data, error } = await supabase.rpc('count_unread_conversations', {
      p_user_id: userId
    });

    if (error) {
      console.error('Error counting unread conversations:', error);
      return 0;
    }

    return data || 0;
  },

  async updatePresence(userId: string, status: 'online' | 'away' | 'busy' | 'offline'): Promise<boolean> {
    const { error } = await supabase
      .from('user_presence')
      .upsert({
        user_id: userId,
        status,
        last_seen_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

    if (error) {
      console.error('Error updating presence:', error);
      return false;
    }

    return true;
  },

  async getUserPresence(userId: string): Promise<UserPresence | null> {
    const { data, error } = await supabase
      .from('user_presence')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching user presence:', error);
      return null;
    }

    return data;
  },

  async addMemberToConversation(conversationId: string, userId: string): Promise<boolean> {
    const { error } = await supabase
      .from('conversation_members')
      .insert({
        conversation_id: conversationId,
        user_id: userId
      });

    if (error) {
      console.error('Error adding member:', error);
      return false;
    }

    return true;
  },

  async removeMemberFromConversation(conversationId: string, userId: string): Promise<boolean> {
    const { error } = await supabase
      .from('conversation_members')
      .delete()
      .eq('conversation_id', conversationId)
      .eq('user_id', userId);

    if (error) {
      console.error('Error removing member:', error);
      return false;
    }

    return true;
  },

  async muteConversation(conversationId: string, userId: string, muted: boolean): Promise<boolean> {
    const { error } = await supabase
      .from('conversation_members')
      .update({ muted })
      .eq('conversation_id', conversationId)
      .eq('user_id', userId);

    if (error) {
      console.error('Error muting conversation:', error);
      return false;
    }

    return true;
  },

  async searchMessages(query: string, conversationId?: string): Promise<Message[]> {
    let queryBuilder = supabase
      .from('messages')
      .select('*')
      .ilike('content', `%${query}%`)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .limit(50);

    if (conversationId) {
      queryBuilder = queryBuilder.eq('conversation_id', conversationId);
    }

    const { data, error } = await queryBuilder;

    if (error) {
      console.error('Error searching messages:', error);
      return [];
    }

    return data || [];
  },

  subscribeToConversation(conversationId: string, callback: (payload: any) => void) {
    const channel = supabase
      .channel(`conversation:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`
        },
        callback
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'message_reactions',
        },
        callback
      )
      .subscribe();

    return channel;
  },

  subscribeToPresence(callback: (payload: any) => void) {
    const channel = supabase
      .channel('user-presence')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_presence'
        },
        callback
      )
      .subscribe();

    return channel;
  }
};
