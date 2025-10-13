/**
 * Types pour le système de messagerie
 * Correspond aux tables messages, message_threads
 */

/**
 * Message entre deux utilisateurs
 * Correspond à la table 'messages'
 */
export interface Message {
  id: string;
  sender_id: string;
  recipient_id: string;
  subject: string;
  content: string;
  read: boolean;
  read_at?: string;
  sent_at: string;
  created_at: string;
}

/**
 * Thread de conversation entre deux participants
 * Correspond à la table 'message_threads'
 */
export interface MessageThread {
  id: string;
  participant1_id: string;
  participant2_id: string;
  last_message_at: string;
  created_at: string;
}

/**
 * Vue enrichie : Message avec infos expéditeur et destinataire
 */
export interface MessageWithParticipants extends Message {
  sender_name: string;
  sender_photo?: string;
  sender_type: 'athlete' | 'company';
  recipient_name: string;
  recipient_photo?: string;
  recipient_type: 'athlete' | 'company';
}

/**
 * Vue enrichie : Thread avec dernier message et infos participants
 */
export interface MessageThreadWithDetails extends MessageThread {
  other_participant_id: string;
  other_participant_name: string;
  other_participant_photo?: string;
  other_participant_type: 'athlete' | 'company';
  last_message_content: string;
  last_message_sender_id: string;
  unread_count: number;
}

/**
 * Données du formulaire d'envoi de message
 */
export interface SendMessageFormData {
  recipient_id: string;
  subject: string;
  content: string;
}

/**
 * Résultat de l'envoi d'un message
 */
export interface SendMessageResult {
  success: boolean;
  message?: Message;
  error?: string;
}
