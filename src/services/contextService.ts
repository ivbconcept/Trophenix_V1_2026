import { supabase } from '../lib/supabase';
import type {
  UserContext,
  CompanyOrganization,
  AthleteDelegation,
  RolePermissions,
  ActiveContext,
  ContextType
} from '../types/contexts';

export class ContextService {
  static async getUserContexts(userId: string): Promise<UserContext[]> {
    const { data, error } = await supabase
      .from('user_contexts')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .order('is_primary', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async getPrimaryContext(userId: string): Promise<UserContext | null> {
    const { data, error } = await supabase
      .from('user_contexts')
      .select('*')
      .eq('user_id', userId)
      .eq('is_primary', true)
      .eq('status', 'active')
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  static async getContextById(contextId: string): Promise<UserContext | null> {
    const { data, error } = await supabase
      .from('user_contexts')
      .select('*')
      .eq('id', contextId)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  static async getOrganization(orgId: string): Promise<CompanyOrganization | null> {
    const { data, error } = await supabase
      .from('company_organizations')
      .select('*')
      .eq('id', orgId)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  static async getDelegation(delegationId: string): Promise<AthleteDelegation | null> {
    const { data, error } = await supabase
      .from('athlete_delegations')
      .select('*')
      .eq('id', delegationId)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  static async getRolePermissions(roleName: string, contextType: string): Promise<Record<string, boolean>> {
    const { data, error } = await supabase
      .from('role_permissions')
      .select('permissions')
      .eq('role_name', roleName)
      .eq('context_type', contextType)
      .maybeSingle();

    if (error) throw error;
    return data?.permissions || {};
  }

  static async getActiveContextDetails(context: UserContext): Promise<ActiveContext> {
    let organization: CompanyOrganization | undefined;
    let delegation: AthleteDelegation | undefined;

    if (context.context_type === 'company_org' && context.context_id) {
      organization = await this.getOrganization(context.context_id) || undefined;
    }

    if (context.context_type === 'athlete_delegation' && context.context_id) {
      delegation = await this.getDelegation(context.context_id) || undefined;
    }

    const permissions = await this.getRolePermissions(context.role, context.context_type);

    return {
      context,
      organization,
      delegation,
      permissions
    };
  }

  static async createOrganization(
    name: string,
    companyProfileId: string,
    ownerId: string
  ): Promise<CompanyOrganization> {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const { data: org, error: orgError } = await supabase
      .from('company_organizations')
      .insert({
        name,
        slug,
        company_profile_id: companyProfileId,
        owner_id: ownerId
      })
      .select()
      .single();

    if (orgError) throw orgError;

    const { error: contextError } = await supabase
      .from('user_contexts')
      .insert({
        user_id: ownerId,
        context_type: 'company_org',
        context_id: org.id,
        role: 'owner',
        is_primary: false,
        status: 'active',
        joined_at: new Date().toISOString()
      });

    if (contextError) throw contextError;

    return org;
  }

  static async inviteMemberToOrganization(
    organizationId: string,
    userEmail: string,
    role: string,
    invitedBy: string
  ): Promise<void> {
    const { data: user, error: userError } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', userEmail)
      .maybeSingle();

    if (userError) throw userError;
    if (!user) throw new Error('User not found');

    const { error } = await supabase
      .from('user_contexts')
      .insert({
        user_id: user.id,
        context_type: 'company_org',
        context_id: organizationId,
        role,
        is_primary: false,
        status: 'invited',
        invited_by: invitedBy
      });

    if (error) throw error;
  }

  static async acceptOrganizationInvite(contextId: string): Promise<void> {
    const { error } = await supabase
      .from('user_contexts')
      .update({
        status: 'active',
        joined_at: new Date().toISOString()
      })
      .eq('id', contextId)
      .eq('status', 'invited');

    if (error) throw error;
  }

  static async inviteDelegate(
    athleteProfileId: string,
    delegateEmail: string,
    role: 'guardian' | 'agent' | 'manager' | 'coach',
    invitedBy: string
  ): Promise<void> {
    const { data: user, error: userError } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', delegateEmail)
      .maybeSingle();

    if (userError) throw userError;
    if (!user) throw new Error('User not found');

    const { error } = await supabase
      .from('athlete_delegations')
      .insert({
        athlete_profile_id: athleteProfileId,
        delegate_user_id: user.id,
        role,
        status: 'invited',
        invited_by: invitedBy
      });

    if (error) throw error;
  }

  static async acceptDelegationInvite(delegationId: string): Promise<void> {
    const { error } = await supabase
      .from('athlete_delegations')
      .update({
        status: 'active',
        accepted_at: new Date().toISOString()
      })
      .eq('id', delegationId)
      .eq('status', 'invited');

    if (error) throw error;
  }

  static async getOrganizationMembers(organizationId: string) {
    const { data, error } = await supabase
      .from('user_contexts')
      .select(`
        *,
        profiles:user_id (
          id,
          email,
          user_type
        )
      `)
      .eq('context_type', 'company_org')
      .eq('context_id', organizationId)
      .in('status', ['active', 'invited']);

    if (error) throw error;
    return data || [];
  }

  static async getAthleteDelegates(athleteProfileId: string) {
    const { data, error } = await supabase
      .from('athlete_delegations')
      .select(`
        *,
        profiles:delegate_user_id (
          id,
          email,
          user_type
        )
      `)
      .eq('athlete_profile_id', athleteProfileId)
      .in('status', ['active', 'invited']);

    if (error) throw error;
    return data || [];
  }

  static async removeMember(contextId: string): Promise<void> {
    const { error } = await supabase
      .from('user_contexts')
      .update({ status: 'suspended' })
      .eq('id', contextId);

    if (error) throw error;
  }

  static async revokeDelegate(delegationId: string): Promise<void> {
    const { error } = await supabase
      .from('athlete_delegations')
      .update({ status: 'revoked' })
      .eq('id', delegationId);

    if (error) throw error;
  }

  static async setPrimaryContext(userId: string, contextId: string): Promise<void> {
    await supabase
      .from('user_contexts')
      .update({ is_primary: false })
      .eq('user_id', userId);

    const { error } = await supabase
      .from('user_contexts')
      .update({ is_primary: true })
      .eq('id', contextId)
      .eq('user_id', userId);

    if (error) throw error;
  }
}
