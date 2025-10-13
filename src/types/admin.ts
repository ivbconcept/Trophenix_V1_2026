export interface AdminPermissions {
  manage_team: boolean;
  manage_roles: boolean;
  manage_users: boolean;
  manage_jobs: boolean;
  manage_messages: boolean;
  view_stats: boolean;
  moderate_content: boolean;
  handle_support: boolean;
  manage_communications: boolean;
  view_logs: boolean;
  delete_content: boolean;
}

export interface AdminRole {
  id: string;
  name: string;
  description: string;
  permissions: AdminPermissions;
  created_at: string;
}

export type AdminStatus = 'pending' | 'active' | 'suspended';

export interface AdminTeamMember {
  id: string;
  user_id: string;
  role_id: string;
  invited_by: string | null;
  invited_at: string;
  status: AdminStatus;
  last_login: string | null;
  notes: string | null;
}

export interface AdminTeamMemberWithDetails extends AdminTeamMember {
  role: AdminRole;
  email: string;
  first_name?: string;
  last_name?: string;
}

export interface AdminActivityLog {
  id: string;
  admin_id: string | null;
  action: string;
  target_type: string;
  target_id: string | null;
  details: Record<string, any>;
  created_at: string;
}

export interface AdminActivityLogWithDetails extends AdminActivityLog {
  admin: {
    email: string;
    first_name?: string;
    last_name?: string;
  } | null;
}

export interface InviteAdminData {
  email: string;
  role_id: string;
  notes?: string;
}

export const ADMIN_ROLE_NAMES = {
  SUPER_ADMIN: 'super_admin',
  MODERATOR: 'moderator',
  SUPPORT: 'support',
  COMMUNICATION: 'communication',
  ANALYST: 'analyst',
} as const;
