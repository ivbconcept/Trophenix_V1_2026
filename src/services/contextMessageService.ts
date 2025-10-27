import { supabaseDB2 as supabase } from '../lib/supabaseDB2';
import type {
  ContextMessage,
  ContextMessageRead,
  MessageContextType,
  MessageVisibility
} from '../types/contexts';

export class ContextMessageService {
  static async sendMessage(
    contextType: MessageContextType,
    contextId: string,
    senderId: string,
    senderRole: string | null,
    subject: string,
    content: string,
    visibility: MessageVisibility = 'all',
    visibleToRoles: string[] = []
  ): Promise<ContextMessage> {
    const { data, error } = await supabase
      .from('context_messages')
      .insert({
        context_type: contextType,
        context_id: contextId,
        sender_id: senderId,
        sender_role: senderRole,
        subject,
        content,
        visibility,
        visible_to_roles: visibleToRoles
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getMessagesByContext(
    contextType: MessageContextType,
    contextId: string
  ): Promise<ContextMessage[]> {
    const { data, error } = await supabase
      .from('context_messages')
      .select(`
        *,
        sender:sender_id (
          id,
          email
        )
      `)
      .eq('context_type', contextType)
      .eq('context_id', contextId)
      .order('sent_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async markAsRead(messageId: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from('context_message_reads')
      .insert({
        message_id: messageId,
        user_id: userId
      });

    if (error && !error.message.includes('duplicate')) {
      throw error;
    }
  }

  static async getReadStatus(messageId: string, userId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('context_message_reads')
      .select('id')
      .eq('message_id', messageId)
      .eq('user_id', userId)
      .maybeSingle();

    if (error) throw error;
    return !!data;
  }

  static async getUnreadCount(userId: string, contextType?: MessageContextType): Promise<number> {
    let query = supabase
      .from('context_messages')
      .select('id', { count: 'exact', head: true });

    if (contextType) {
      query = query.eq('context_type', contextType);
    }

    const { count, error } = await query;

    if (error) throw error;

    const { count: readCount, error: readError } = await supabase
      .from('context_message_reads')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId);

    if (readError) throw readError;

    return (count || 0) - (readCount || 0);
  }

  static async getOrganizationMessages(organizationId: string): Promise<ContextMessage[]> {
    return this.getMessagesByContext('organization', organizationId);
  }

  static async getDelegationMessages(delegationId: string): Promise<ContextMessage[]> {
    return this.getMessagesByContext('delegation', delegationId);
  }

  static async getApplicationMessages(applicationId: string): Promise<ContextMessage[]> {
    return this.getMessagesByContext('application', applicationId);
  }

  static async sendInternalNote(
    contextType: MessageContextType,
    contextId: string,
    senderId: string,
    senderRole: string,
    subject: string,
    content: string,
    visibleToRoles: string[]
  ): Promise<ContextMessage> {
    return this.sendMessage(
      contextType,
      contextId,
      senderId,
      senderRole,
      subject,
      content,
      'specific_roles',
      visibleToRoles
    );
  }
}
