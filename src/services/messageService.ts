import { supabaseDB2 as supabase } from '../lib/supabaseDB2';
import type {
  Message,
  MessageThread,
  SendMessageFormData,
  SendMessageResult,
} from '../types/messages';

export class MessageService {
  /**
   * Envoie un message
   */
  static async sendMessage(
    senderId: string,
    messageData: SendMessageFormData
  ): Promise<SendMessageResult> {
    const { data, error } = await supabase
      .from('messages')
      .insert({
        sender_id: senderId,
        recipient_id: messageData.recipient_id,
        subject: messageData.subject,
        content: messageData.content,
      })
      .select()
      .single();

    if (error) {
      console.error('Error sending message:', error);
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
      message: data,
    };
  }

  /**
   * Récupère tous les messages d'un utilisateur (envoyés et reçus)
   */
  static async getUserMessages(userId: string): Promise<Message[]> {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
      .order('sent_at', { ascending: false });

    if (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }

    return data || [];
  }

  /**
   * Récupère les messages reçus par un utilisateur
   */
  static async getReceivedMessages(userId: string): Promise<Message[]> {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('recipient_id', userId)
      .order('sent_at', { ascending: false });

    if (error) {
      console.error('Error fetching received messages:', error);
      throw error;
    }

    return data || [];
  }

  /**
   * Récupère les messages envoyés par un utilisateur
   */
  static async getSentMessages(userId: string): Promise<Message[]> {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('sender_id', userId)
      .order('sent_at', { ascending: false });

    if (error) {
      console.error('Error fetching sent messages:', error);
      throw error;
    }

    return data || [];
  }

  /**
   * Récupère les messages non lus d'un utilisateur
   */
  static async getUnreadMessages(userId: string): Promise<Message[]> {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('recipient_id', userId)
      .eq('read', false)
      .order('sent_at', { ascending: false });

    if (error) {
      console.error('Error fetching unread messages:', error);
      throw error;
    }

    return data || [];
  }

  /**
   * Compte les messages non lus d'un utilisateur
   */
  static async getUnreadCount(userId: string): Promise<number> {
    const { count, error } = await supabase
      .from('messages')
      .select('id', { count: 'exact', head: true })
      .eq('recipient_id', userId)
      .eq('read', false);

    if (error) {
      console.error('Error counting unread messages:', error);
      return 0;
    }

    return count || 0;
  }

  /**
   * Marque un message comme lu
   */
  static async markAsRead(messageId: string): Promise<Message> {
    const { data, error } = await supabase
      .from('messages')
      .update({
        read: true,
        read_at: new Date().toISOString(),
      })
      .eq('id', messageId)
      .select()
      .single();

    if (error) {
      console.error('Error marking message as read:', error);
      throw error;
    }

    return data;
  }

  /**
   * Marque plusieurs messages comme lus
   */
  static async markMultipleAsRead(messageIds: string[]): Promise<void> {
    const { error } = await supabase
      .from('messages')
      .update({
        read: true,
        read_at: new Date().toISOString(),
      })
      .in('id', messageIds);

    if (error) {
      console.error('Error marking messages as read:', error);
      throw error;
    }
  }

  /**
   * Récupère les threads de conversation d'un utilisateur
   */
  static async getUserThreads(userId: string): Promise<MessageThread[]> {
    const { data, error } = await supabase
      .from('message_threads')
      .select('*')
      .or(`participant1_id.eq.${userId},participant2_id.eq.${userId}`)
      .order('last_message_at', { ascending: false });

    if (error) {
      console.error('Error fetching threads:', error);
      throw error;
    }

    return data || [];
  }

  /**
   * Récupère les messages d'une conversation entre deux utilisateurs
   */
  static async getConversation(
    user1Id: string,
    user2Id: string
  ): Promise<Message[]> {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .or(
        `and(sender_id.eq.${user1Id},recipient_id.eq.${user2Id}),and(sender_id.eq.${user2Id},recipient_id.eq.${user1Id})`
      )
      .order('sent_at', { ascending: true });

    if (error) {
      console.error('Error fetching conversation:', error);
      throw error;
    }

    return data || [];
  }

  /**
   * Supprime un message (soft delete - marque comme supprimé côté expéditeur)
   */
  static async deleteMessage(messageId: string): Promise<void> {
    const { error } = await supabase
      .from('messages')
      .delete()
      .eq('id', messageId);

    if (error) {
      console.error('Error deleting message:', error);
      throw error;
    }
  }

  /**
   * Récupère un message par ID
   */
  static async getMessageById(messageId: string): Promise<Message | null> {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('id', messageId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching message:', error);
      throw error;
    }

    return data;
  }
}
