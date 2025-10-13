export interface FeatureCategory {
  id: string;
  category_key: string;
  display_name: string;
  description: string;
  icon: string;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface FeatureVersion {
  id: string;
  version_number: string;
  display_name: string;
  description: string;
  is_current: boolean;
  release_date: string | null;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface FeatureFlag {
  id: string;
  category_id: string | null;
  feature_key: string;
  display_name: string;
  description: string;
  target_version: string;
  is_enabled: boolean;
  is_beta: boolean;
  rollout_percentage: number;
  enable_date: string | null;
  component_path: string | null;
  route_path: string | null;
  dependencies: string[];
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface UserFeatureAccess {
  id: string;
  feature_id: string;
  user_id: string;
  access_type: 'beta' | 'early_access' | 'preview' | 'blocked';
  granted_by: string | null;
  expires_at: string | null;
  metadata: Record<string, any>;
  created_at: string;
}

export interface FeatureUsageAnalytics {
  id: string;
  feature_id: string;
  user_id: string | null;
  event_type: string;
  metadata: Record<string, any>;
  created_at: string;
}

export interface EnabledFeature {
  feature_key: string;
  display_name: string;
  category_key: string;
  target_version: string;
  component_path: string | null;
  route_path: string | null;
}

export interface FeatureStats {
  total_users: number;
  total_events: number;
  unique_users_today: number;
  events_today: number;
  avg_events_per_user: number;
}

export type FeatureKey =
  | 'landing_page'
  | 'login'
  | 'signup'
  | 'forgot_password'
  | 'email_verification'
  | 'athlete_onboarding'
  | 'company_onboarding'
  | 'athlete_profile'
  | 'company_profile'
  | 'job_offers_list'
  | 'job_offer_create'
  | 'job_offers_manage'
  | 'my_applications'
  | 'view_applications'
  | 'athlete_directory'
  | 'company_directory'
  | 'athlete_detail'
  | 'elea_ai'
  | 'context_switcher'
  | 'organization_management'
  | 'team_invitations'
  | 'athlete_delegation'
  | 'context_messages'
  | 'shared_tasks'
  | 'task_comments'
  | 'admin_login'
  | 'admin_dashboard'
  | 'admin_users'
  | 'admin_jobs'
  | 'admin_team'
  | 'super_admin_console';
