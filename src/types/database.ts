// Database types for Trophenix platform

export type ValidationStatus = 'pending' | 'approved' | 'rejected';
export type UserType = 'athlete' | 'company' | 'admin';
export type ContractType = 'CDI' | 'CDD' | 'Stage' | 'Alternance' | 'Freelance';
export type JobOfferStatus = 'draft' | 'published' | 'closed';
export type ApplicationStatus = 'pending' | 'reviewed' | 'accepted' | 'rejected';
export type FavoritableType = 'job_offer' | 'athlete_profile' | 'company_profile';

// Profile
export interface Profile {
  id: string;
  user_type: UserType;
  email: string;
  validation_status: ValidationStatus;
  first_name?: string;
  last_name?: string;
  company_name?: string;
  phone?: string;
  created_at: string;
  updated_at: string;
}

// Athlete Profile
export interface AthleteProfile {
  id: string;
  profile_id: string;
  sport: string;
  level: string;
  birth_date?: string;
  birth_place?: string;
  nationality?: string;
  club?: string;
  training_center?: string;
  achievements?: string[];
  bio?: string;
  avatar_url?: string;
  cover_url?: string;
  social_links?: Record<string, string>;
  created_at: string;
  updated_at: string;
}

// Company Profile
export interface CompanyProfile {
  id: string;
  profile_id: string;
  company_name: string;
  industry: string;
  size: string;
  description?: string;
  website?: string;
  logo_url?: string;
  cover_url?: string;
  address?: string;
  city?: string;
  country?: string;
  created_at: string;
  updated_at: string;
}

// Job Offer
export interface JobOffer {
  id: string;
  company_id: string;
  title: string;
  description: string;
  contract_type: ContractType;
  location: string;
  salary_range?: string;
  required_sports?: string[];
  required_level?: string;
  status: JobOfferStatus;
  published_at?: string;
  expires_at?: string;
  created_at: string;
  updated_at: string;
}

// Application
export interface Application {
  id: string;
  job_offer_id: string;
  athlete_id: string;
  status: ApplicationStatus;
  cover_letter?: string;
  cv_url?: string;
  created_at: string;
  updated_at: string;
}

// Conversation
export interface Conversation {
  id: string;
  participant_1_id: string;
  participant_2_id: string;
  last_message_at: string;
  created_at: string;
}

// Message
export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  read_at?: string;
  created_at: string;
}

// Notification
export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  link?: string;
  read_at?: string;
  created_at: string;
}

// Favorite
export interface Favorite {
  id: string;
  user_id: string;
  favoritable_type: FavoritableType;
  favoritable_id: string;
  created_at: string;
}

// Elea Conversation
export interface EleaConversation {
  id: string;
  user_id: string;
  title: string;
  context: Record<string, unknown>;
  is_active: boolean;
  last_message_at: string;
  created_at: string;
  updated_at: string;
}

// Elea Message
export interface EleaMessage {
  id: string;
  conversation_id: string;
  sender: 'user' | 'agent';
  content: string;
  message_type: 'text' | 'error' | 'suggestion' | 'system';
  metadata: Record<string, unknown>;
  created_at: string;
}

// Extended types with relations
export interface JobOfferWithCompany extends JobOffer {
  company?: Profile & { company_profile?: CompanyProfile };
}

export interface ApplicationWithDetails extends Application {
  job_offer?: JobOfferWithCompany;
  athlete?: Profile & { athlete_profile?: AthleteProfile };
}

export interface ConversationWithParticipants extends Conversation {
  participant_1?: Profile;
  participant_2?: Profile;
  unread_count?: number;
}

export interface MessageWithSender extends Message {
  sender?: Profile;
}

export interface EleaConversationWithMessages extends EleaConversation {
  messages?: EleaMessage[];
}
