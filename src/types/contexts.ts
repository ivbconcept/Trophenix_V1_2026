export type ContextType = 'platform_admin' | 'company_org' | 'athlete_profile' | 'athlete_delegation';
export type ContextStatus = 'active' | 'suspended' | 'invited' | 'pending';

export type CompanyRole = 'owner' | 'hr_manager' | 'hr_recruiter' | 'technical_lead' | 'director';
export type AthleteDelegationRole = 'guardian' | 'agent' | 'manager' | 'coach';

export interface UserContext {
  id: string;
  user_id: string;
  context_type: ContextType;
  context_id: string | null;
  role: string;
  is_primary: boolean;
  status: ContextStatus;
  invited_by: string | null;
  invited_at: string;
  joined_at: string | null;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface CompanyOrganization {
  id: string;
  name: string;
  slug: string;
  company_profile_id: string;
  owner_id: string;
  settings: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface AthleteDelegation {
  id: string;
  athlete_profile_id: string;
  delegate_user_id: string;
  role: AthleteDelegationRole;
  permissions: Record<string, any>;
  status: 'active' | 'suspended' | 'invited' | 'revoked';
  invited_by: string;
  invited_at: string;
  accepted_at: string | null;
  created_at: string;
}

export interface RolePermissions {
  id: string;
  role_name: string;
  context_type: string;
  permissions: Record<string, boolean>;
  description: string | null;
  is_system: boolean;
  created_at: string;
  updated_at: string;
}

export type MessageContextType = 'direct' | 'organization' | 'delegation' | 'application';
export type MessageVisibility = 'all' | 'internal' | 'specific_roles';

export interface ContextMessage {
  id: string;
  context_type: MessageContextType;
  context_id: string;
  sender_id: string;
  sender_role: string | null;
  subject: string;
  content: string;
  visibility: MessageVisibility;
  visible_to_roles: string[];
  metadata: Record<string, any>;
  sent_at: string;
  created_at: string;
}

export interface ContextMessageRead {
  id: string;
  message_id: string;
  user_id: string;
  read_at: string;
}

export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskContextType = 'organization' | 'delegation' | 'application';

export interface SharedTask {
  id: string;
  context_type: TaskContextType;
  context_id: string;
  title: string;
  description: string | null;
  assigned_to: string | null;
  assigned_role: string | null;
  created_by: string;
  status: TaskStatus;
  priority: TaskPriority;
  due_date: string | null;
  completed_at: string | null;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface TaskComment {
  id: string;
  task_id: string;
  user_id: string;
  content: string;
  created_at: string;
}

export interface ActiveContext {
  context: UserContext;
  organization?: CompanyOrganization;
  delegation?: AthleteDelegation;
  permissions: Record<string, boolean>;
}

export interface ContextSwitcherOption {
  id: string;
  label: string;
  type: ContextType;
  role: string;
  icon: string;
  isPrimary: boolean;
}
