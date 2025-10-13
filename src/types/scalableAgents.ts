export type AgentStatus = 'active' | 'paused' | 'archived' | 'deleted';
export type SenderType = 'user' | 'agent' | 'system';
export type ContentType = 'text' | 'voice' | 'image' | 'file' | 'code' | 'system';
export type ReactionType = 'helpful' | 'not_helpful' | 'flag' | 'star';
export type FileType = 'pdf' | 'image' | 'audio' | 'video' | 'document' | 'other';

export interface AgentCapabilities {
  text: boolean;
  voice: boolean;
  files: boolean;
  web: boolean;
  code: boolean;
}

export interface AgentConfig {
  model: string;
  temperature: number;
  max_tokens: number;
  [key: string]: unknown;
}

export interface AgentRegistry {
  id: string;
  name: string;
  display_name: string;
  description: string;
  avatar_url: string;
  capabilities: AgentCapabilities;
  config: AgentConfig;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AgentSession {
  id: string;
  user_id: string;
  agent_id: string;
  title: string;
  status: AgentStatus;
  context: Record<string, unknown>;
  metadata: Record<string, unknown>;
  last_message_at: string;
  created_at: string;
  updated_at: string;
}

export interface AgentMessage {
  id: string;
  session_id: string;
  sender_type: SenderType;
  sender_id: string;
  content: string;
  content_type: ContentType;
  metadata: Record<string, unknown>;
  parent_message_id?: string;
  is_edited: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export interface MessageAttachment {
  id: string;
  message_id: string;
  file_name: string;
  file_type: FileType;
  file_size: number;
  storage_path: string;
  mime_type: string;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface MessageReaction {
  id: string;
  message_id: string;
  user_id: string;
  reaction_type: ReactionType;
  feedback_text?: string;
  created_at: string;
}

export interface AgentKnowledgeBase {
  id: string;
  agent_id: string;
  category: string;
  title: string;
  content: string;
  metadata: Record<string, unknown>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AgentAnalytics {
  id: string;
  session_id?: string;
  agent_id?: string;
  user_id?: string;
  event_type: string;
  event_data: Record<string, unknown>;
  created_at: string;
}

export interface AgentSessionWithDetails extends AgentSession {
  agent?: AgentRegistry;
  messages?: AgentMessage[];
  message_count?: number;
  unread_count?: number;
}

export interface AgentMessageWithDetails extends AgentMessage {
  attachments?: MessageAttachment[];
  reactions?: MessageReaction[];
  parent_message?: AgentMessage;
}

export interface AgentStatistics {
  total_sessions: number;
  active_sessions: number;
  total_messages: number;
  total_users: number;
  avg_messages_per_session: number;
}

export interface FileUploadOptions {
  bucket: 'agent_attachments' | 'agent_voice_messages' | 'agent_generated_files';
  path: string;
  file: File;
  contentType?: string;
  cacheControl?: string;
  upsert?: boolean;
}

export interface FileUploadResult {
  path: string;
  fullPath: string;
  url: string;
}

export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'agent' | 'system';
  timestamp: Date;
  type?: ContentType;
  attachments?: MessageAttachment[];
  isLoading?: boolean;
}

export interface AgentSuggestion {
  id: string;
  text: string;
  action?: () => void;
  metadata?: Record<string, unknown>;
}

export interface AgentContext {
  page?: string;
  step?: number;
  userType?: 'athlete' | 'company' | 'admin';
  data?: Record<string, unknown>;
  [key: string]: unknown;
}
