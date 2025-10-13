import { useState, useEffect } from 'react';
import { UserPlus, Mail, Shield, Trash2, X, Check, Clock } from 'lucide-react';
import { ContextService } from '../../services/contextService';
import type { CompanyRole } from '../../types/contexts';

interface TeamMember {
  id: string;
  user_id: string;
  role: string;
  status: string;
  invited_at: string;
  joined_at: string | null;
  profiles: {
    id: string;
    email: string;
    user_type: string;
  };
}

interface OrganizationTeamManagementProps {
  organizationId: string;
  currentUserId: string;
  canManageTeam: boolean;
}

export function OrganizationTeamManagement({
  organizationId,
  currentUserId,
  canManageTeam
}: OrganizationTeamManagementProps) {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<CompanyRole>('hr_recruiter');
  const [inviting, setInviting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadMembers();
  }, [organizationId]);

  const loadMembers = async () => {
    try {
      setLoading(true);
      const data = await ContextService.getOrganizationMembers(organizationId);
      setMembers(data as TeamMember[]);
    } catch (err) {
      console.error('Failed to load members:', err);
      setError('Échec du chargement des membres');
    } finally {
      setLoading(false);
    }
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;

    try {
      setInviting(true);
      setError(null);
      await ContextService.inviteMemberToOrganization(
        organizationId,
        inviteEmail,
        inviteRole,
        currentUserId
      );
      await loadMembers();
      setShowInviteModal(false);
      setInviteEmail('');
      setInviteRole('hr_recruiter');
    } catch (err: any) {
      setError(err.message || 'Échec de l\'invitation');
    } finally {
      setInviting(false);
    }
  };

  const handleRemoveMember = async (contextId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir retirer ce membre de l\'équipe ?')) return;

    try {
      await ContextService.removeMember(contextId);
      await loadMembers();
    } catch (err) {
      console.error('Failed to remove member:', err);
    }
  };

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      owner: 'Propriétaire',
      hr_manager: 'Manager RH',
      hr_recruiter: 'Recruteur RH',
      technical_lead: 'Lead Technique',
      director: 'Directeur'
    };
    return labels[role] || role;
  };

  const getRoleBadgeColor = (role: string) => {
    const colors: Record<string, string> = {
      owner: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      hr_manager: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      hr_recruiter: 'bg-green-500/20 text-green-400 border-green-500/30',
      technical_lead: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      director: 'bg-red-500/20 text-red-400 border-red-500/30'
    };
    return colors[role] || 'bg-slate-500/20 text-slate-400 border-slate-500/30';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <span className="flex items-center space-x-1 px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full border border-green-500/30">
            <Check className="h-3 w-3" />
            <span>Actif</span>
          </span>
        );
      case 'invited':
        return (
          <span className="flex items-center space-x-1 px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded-full border border-yellow-500/30">
            <Clock className="h-3 w-3" />
            <span>Invité</span>
          </span>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 rounded-lg border border-slate-800 p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">Équipe</h2>
          <p className="text-sm text-slate-400 mt-1">
            {members.length} membre{members.length > 1 ? 's' : ''}
          </p>
        </div>
        {canManageTeam && (
          <button
            onClick={() => setShowInviteModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <UserPlus className="h-4 w-4" />
            <span>Inviter un membre</span>
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="space-y-3">
        {members.map((member) => (
          <div
            key={member.id}
            className="flex items-center justify-between p-4 bg-slate-800 rounded-lg border border-slate-700"
          >
            <div className="flex items-center space-x-4 flex-1">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {member.profiles.email.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="text-white font-medium">{member.profiles.email}</span>
                  {getStatusBadge(member.status)}
                </div>
                <div className="flex items-center space-x-2 mt-1">
                  <span className={`px-2 py-0.5 text-xs rounded-full border ${getRoleBadgeColor(member.role)}`}>
                    {getRoleLabel(member.role)}
                  </span>
                  {member.joined_at && (
                    <span className="text-xs text-slate-500">
                      Membre depuis {new Date(member.joined_at).toLocaleDateString('fr-FR')}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {canManageTeam && member.role !== 'owner' && member.user_id !== currentUserId && (
              <button
                onClick={() => handleRemoveMember(member.id)}
                className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                title="Retirer du membre"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
        ))}
      </div>

      {showInviteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-lg p-6 max-w-md w-full mx-4 border border-slate-700">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-white">Inviter un membre</h3>
              <button
                onClick={() => setShowInviteModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleInvite} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="email@exemple.com"
                    required
                    className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Rôle
                </label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as CompanyRole)}
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="hr_manager">Manager RH</option>
                  <option value="hr_recruiter">Recruteur RH</option>
                  <option value="technical_lead">Lead Technique</option>
                  <option value="director">Directeur</option>
                </select>
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={inviting}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
                >
                  {inviting ? 'Envoi...' : 'Envoyer l\'invitation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
