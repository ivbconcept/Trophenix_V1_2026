import { supabaseDB2 as supabase } from '../lib/supabaseDB2';
import type {
  AdminRole,
  AdminTeamMember,
  AdminTeamMemberWithDetails,
  AdminActivityLog,
  AdminActivityLogWithDetails,
  InviteAdminData,
} from '../types/admin';

export class AdminService {
  static async getRoles(): Promise<AdminRole[]> {
    const { data, error } = await supabase
      .from('admin_roles')
      .select('*')
      .order('name');

    if (error) throw error;
    return data || [];
  }

  static async getTeamMembers(): Promise<AdminTeamMemberWithDetails[]> {
    const { data, error } = await supabase
      .from('admin_team_members')
      .select(`
        *,
        role:admin_roles(*),
        profile:profiles(email, first_name, last_name)
      `)
      .order('invited_at', { ascending: false });

    if (error) throw error;

    return (data || []).map((member: any) => ({
      ...member,
      role: member.role,
      email: member.profile?.email || '',
      first_name: member.profile?.first_name,
      last_name: member.profile?.last_name,
    }));
  }

  static async getTeamMemberByUserId(userId: string): Promise<AdminTeamMemberWithDetails | null> {
    const { data, error } = await supabase
      .from('admin_team_members')
      .select(`
        *,
        role:admin_roles(*),
        profile:profiles(email, first_name, last_name)
      `)
      .eq('user_id', userId)
      .eq('status', 'active')
      .maybeSingle();

    if (error) throw error;
    if (!data) return null;

    return {
      ...data,
      role: data.role,
      email: data.profile?.email || '',
      first_name: data.profile?.first_name,
      last_name: data.profile?.last_name,
    };
  }

  static async inviteAdmin(invitedBy: string, inviteData: InviteAdminData): Promise<void> {
    const { data: existingUser } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', inviteData.email)
      .maybeSingle();

    if (!existingUser) {
      throw new Error('Utilisateur introuvable. L\'utilisateur doit d\'abord créer un compte.');
    }

    const { data: existingMember } = await supabase
      .from('admin_team_members')
      .select('id')
      .eq('user_id', existingUser.id)
      .maybeSingle();

    if (existingMember) {
      throw new Error('Cet utilisateur fait déjà partie de l\'équipe admin.');
    }

    const { error } = await supabase
      .from('admin_team_members')
      .insert({
        user_id: existingUser.id,
        role_id: inviteData.role_id,
        invited_by: invitedBy,
        notes: inviteData.notes,
      });

    if (error) throw error;

    await this.logAction(invitedBy, 'admin_invited', 'admin_team_member', existingUser.id, {
      email: inviteData.email,
      role_id: inviteData.role_id,
    });
  }

  static async updateMemberRole(memberId: string, roleId: string): Promise<void> {
    const { error } = await supabase
      .from('admin_team_members')
      .update({ role_id: roleId })
      .eq('id', memberId);

    if (error) throw error;
  }

  static async updateMemberStatus(memberId: string, status: 'active' | 'suspended'): Promise<void> {
    const { error } = await supabase
      .from('admin_team_members')
      .update({ status })
      .eq('id', memberId);

    if (error) throw error;
  }

  static async removeMember(memberId: string): Promise<void> {
    const { error } = await supabase
      .from('admin_team_members')
      .delete()
      .eq('id', memberId);

    if (error) throw error;
  }

  static async getActivityLogs(limit = 100): Promise<AdminActivityLogWithDetails[]> {
    const { data, error } = await supabase
      .from('admin_activity_logs')
      .select(`
        *,
        admin:admin_team_members(
          profile:profiles(email, first_name, last_name)
        )
      `)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    return (data || []).map((log: any) => ({
      ...log,
      admin: log.admin?.profile ? {
        email: log.admin.profile.email,
        first_name: log.admin.profile.first_name,
        last_name: log.admin.profile.last_name,
      } : null,
    }));
  }

  static async logAction(
    userId: string,
    action: string,
    targetType: string,
    targetId: string | null,
    details: Record<string, any> = {}
  ): Promise<void> {
    const { data: member } = await supabase
      .from('admin_team_members')
      .select('id')
      .eq('user_id', userId)
      .eq('status', 'active')
      .maybeSingle();

    if (!member) return;

    await supabase
      .from('admin_activity_logs')
      .insert({
        admin_id: member.id,
        action,
        target_type: targetType,
        target_id: targetId,
        details,
      });
  }

  static async updateLastLogin(userId: string): Promise<void> {
    const { error } = await supabase
      .from('admin_team_members')
      .update({ last_login: new Date().toISOString() })
      .eq('user_id', userId);

    if (error) console.error('Error updating last login:', error);
  }

  static async checkPermission(
    userId: string,
    permission: keyof AdminRole['permissions']
  ): Promise<boolean> {
    const member = await this.getTeamMemberByUserId(userId);
    if (!member) return false;
    return member.role.permissions[permission] === true;
  }

  static async hasAnyPermission(userId: string): Promise<boolean> {
    const member = await this.getTeamMemberByUserId(userId);
    return member !== null && member.status === 'active';
  }
}
