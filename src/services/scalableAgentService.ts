import { supabase } from '../lib/supabase';
import type {
  AgentRegistry,
  AgentSession,
  AgentMessage,
  MessageAttachment,
  MessageReaction,
  AgentSessionWithDetails,
  AgentMessageWithDetails,
  AgentStatistics,
  FileUploadOptions,
  FileUploadResult,
  AgentContext,
} from '../types/scalableAgents';

export class ScalableAgentService {
  static async getAvailableAgents(): Promise<AgentRegistry[]> {
    const { data, error } = await supabase
      .from('agents_registry')
      .select('*')
      .eq('is_active', true)
      .order('display_name');

    if (error) {
      console.error('Error fetching agents:', error);
      throw error;
    }

    return data || [];
  }

  static async getAgentByName(name: string): Promise<AgentRegistry | null> {
    const { data, error } = await supabase
      .from('agents_registry')
      .select('*')
      .eq('name', name)
      .eq('is_active', true)
      .maybeSingle();

    if (error) {
      console.error('Error fetching agent:', error);
      throw error;
    }

    return data;
  }

  static async createSession(
    userId: string,
    agentId: string,
    context: AgentContext = {}
  ): Promise<AgentSession> {
    const { data, error } = await supabase
      .from('agent_sessions')
      .insert({
        user_id: userId,
        agent_id: agentId,
        title: 'Nouvelle conversation',
        status: 'active',
        context,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating session:', error);
      throw error;
    }

    return data;
  }

  static async getOrCreateActiveSession(
    userId: string,
    agentName: string,
    context: AgentContext = {}
  ): Promise<string> {
    const agent = await this.getAgentByName(agentName);
    if (!agent) {
      throw new Error(`Agent ${agentName} not found`);
    }

    const { data: existingSession, error: fetchError } = await supabase
      .from('agent_sessions')
      .select('id')
      .eq('user_id', userId)
      .eq('agent_id', agent.id)
      .eq('status', 'active')
      .order('last_message_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (fetchError) {
      console.error('Error fetching session:', fetchError);
      throw fetchError;
    }

    if (existingSession) {
      await supabase
        .from('agent_sessions')
        .update({ context, last_message_at: new Date().toISOString() })
        .eq('id', existingSession.id);

      return existingSession.id;
    }

    const newSession = await this.createSession(userId, agent.id, context);
    return newSession.id;
  }

  static async getUserSessions(
    userId: string,
    agentName?: string,
    status: 'active' | 'archived' | 'all' = 'active'
  ): Promise<AgentSessionWithDetails[]> {
    let query = supabase
      .from('agent_sessions')
      .select(`
        *,
        agent:agents_registry(*)
      `)
      .eq('user_id', userId)
      .order('last_message_at', { ascending: false });

    if (status !== 'all') {
      query = query.eq('status', status);
    }

    if (agentName) {
      const agent = await this.getAgentByName(agentName);
      if (agent) {
        query = query.eq('agent_id', agent.id);
      }
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching sessions:', error);
      throw error;
    }

    return (data || []) as AgentSessionWithDetails[];
  }

  static async getSessionMessages(sessionId: string): Promise<AgentMessage[]> {
    const { data, error } = await supabase
      .from('agent_messages')
      .select('*')
      .eq('session_id', sessionId)
      .eq('is_deleted', false)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }

    return data || [];
  }

  static async sendMessage(
    sessionId: string,
    senderId: string,
    senderType: 'user' | 'agent' | 'system',
    content: string,
    contentType: 'text' | 'voice' | 'image' | 'file' | 'code' | 'system' = 'text',
    metadata: Record<string, unknown> = {}
  ): Promise<AgentMessage> {
    const { data, error } = await supabase
      .from('agent_messages')
      .insert({
        session_id: sessionId,
        sender_id: senderId,
        sender_type: senderType,
        content,
        content_type: contentType,
        metadata,
      })
      .select()
      .single();

    if (error) {
      console.error('Error sending message:', error);
      throw error;
    }

    return data;
  }

  static async uploadFile(options: FileUploadOptions): Promise<FileUploadResult> {
    const { bucket, path, file, contentType, cacheControl, upsert } = options;

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        contentType: contentType || file.type,
        cacheControl: cacheControl || '3600',
        upsert: upsert || false,
      });

    if (error) {
      console.error('Error uploading file:', error);
      throw error;
    }

    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return {
      path: data.path,
      fullPath: data.fullPath,
      url: urlData.publicUrl,
    };
  }

  static async attachFileToMessage(
    messageId: string,
    fileName: string,
    fileType: string,
    fileSize: number,
    storagePath: string,
    mimeType: string,
    metadata: Record<string, unknown> = {}
  ): Promise<MessageAttachment> {
    const { data, error } = await supabase
      .from('message_attachments')
      .insert({
        message_id: messageId,
        file_name: fileName,
        file_type: fileType,
        file_size: fileSize,
        storage_path: storagePath,
        mime_type: mimeType,
        metadata,
      })
      .select()
      .single();

    if (error) {
      console.error('Error attaching file:', error);
      throw error;
    }

    return data;
  }

  static async addReaction(
    messageId: string,
    userId: string,
    reactionType: 'helpful' | 'not_helpful' | 'flag' | 'star',
    feedbackText?: string
  ): Promise<MessageReaction> {
    const { data, error } = await supabase
      .from('message_reactions')
      .insert({
        message_id: messageId,
        user_id: userId,
        reaction_type: reactionType,
        feedback_text: feedbackText || '',
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding reaction:', error);
      throw error;
    }

    return data;
  }

  static async updateSessionStatus(
    sessionId: string,
    status: 'active' | 'paused' | 'archived' | 'deleted'
  ): Promise<void> {
    const { error } = await supabase
      .from('agent_sessions')
      .update({ status })
      .eq('id', sessionId);

    if (error) {
      console.error('Error updating session status:', error);
      throw error;
    }
  }

  static async getAgentStatistics(agentName: string): Promise<AgentStatistics | null> {
    const agent = await this.getAgentByName(agentName);
    if (!agent) return null;

    const { data, error } = await supabase
      .rpc('get_agent_statistics', { agent_uuid: agent.id });

    if (error) {
      console.error('Error fetching statistics:', error);
      throw error;
    }

    return data?.[0] || null;
  }

  static async archiveInactiveSessions(daysInactive: number = 30): Promise<number> {
    const { data, error } = await supabase
      .rpc('archive_inactive_sessions', { days_inactive: daysInactive });

    if (error) {
      console.error('Error archiving sessions:', error);
      throw error;
    }

    return data || 0;
  }

  static async deleteOldArchivedSessions(daysOld: number = 90): Promise<number> {
    const { data, error } = await supabase
      .rpc('delete_old_archived_sessions', { days_old: daysOld });

    if (error) {
      console.error('Error deleting sessions:', error);
      throw error;
    }

    return data || 0;
  }

  static async trackAnalytics(
    sessionId: string,
    agentId: string,
    userId: string,
    eventType: string,
    eventData: Record<string, unknown> = {}
  ): Promise<void> {
    const { error } = await supabase
      .from('agent_analytics')
      .insert({
        session_id: sessionId,
        agent_id: agentId,
        user_id: userId,
        event_type: eventType,
        event_data: eventData,
      });

    if (error) {
      console.error('Error tracking analytics:', error);
    }
  }

  static async generateAgentResponse(
    agentName: string,
    userMessage: string,
    context: AgentContext,
    history: AgentMessage[]
  ): Promise<string> {
    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes('profil')) {
      return "Je peux vous aider à optimiser votre profil. Voulez-vous que je vous guide étape par étape ?";
    }

    if (lowerMessage.includes('offre') || lowerMessage.includes('emploi')) {
      return "Je peux vous aider avec les offres d'emploi. Que souhaitez-vous faire ? Créer une offre, consulter les offres disponibles, ou gérer vos candidatures ?";
    }

    if (lowerMessage.includes('aide') || lowerMessage.includes('help')) {
      return "Je suis là pour vous aider ! Voici ce que je peux faire :\n\n✅ Répondre à vos questions\n✅ Vous guider dans l'utilisation de la plateforme\n✅ Vous aider à optimiser votre expérience\n\nN'hésitez pas à me poser vos questions !";
    }

    return "Je comprends votre message. Comment puis-je vous aider davantage ?";
  }
}
