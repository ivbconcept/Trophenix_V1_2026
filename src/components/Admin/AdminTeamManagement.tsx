import { useState, useEffect } from 'react';
import { UserPlus, Shield, Eye, Ban, Trash2, Check, X } from 'lucide-react';
import { AdminService } from '../../services/adminService';
import type { AdminRole, AdminTeamMemberWithDetails, InviteAdminData } from '../../types/admin';
import { useAuth } from '../../contexts/AuthContext';

export default function AdminTeamManagement() {
  const { user } = useAuth();
  const [members, setMembers] = useState<AdminTeamMemberWithDetails[]>([]);
  const [roles, setRoles] = useState<AdminRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [inviteData, setInviteData] = useState<InviteAdminData>({
    email: '',
    role_id: '',
    notes: '',
  });
  const [inviting, setInviting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [membersData, rolesData] = await Promise.all([
        AdminService.getTeamMembers(),
        AdminService.getRoles(),
      ]);
      setMembers(membersData);
      setRoles(rolesData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !inviteData.email || !inviteData.role_id) return;

    try {
      setInviting(true);
      await AdminService.inviteAdmin(user.id, inviteData);
      setShowInviteForm(false);
      setInviteData({ email: '', role_id: '', notes: '' });
      await loadData();
      alert('Membre invité avec succès !');
    } catch (error: any) {
      alert(error.message || 'Erreur lors de l\'invitation');
    } finally {
      setInviting(false);
    }
  };

  const handleUpdateStatus = async (memberId: string, status: 'active' | 'suspended') => {
    if (!confirm(`Êtes-vous sûr de vouloir ${status === 'suspended' ? 'suspendre' : 'activer'} ce membre ?`)) return;

    try {
      await AdminService.updateMemberStatus(memberId, status);
      await loadData();
    } catch (error) {
      alert('Erreur lors de la mise à jour du statut');
    }
  };

  const handleRemove = async (memberId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir retirer définitivement ce membre de l\'équipe ?')) return;

    try {
      await AdminService.removeMember(memberId);
      await loadData();
    } catch (error) {
      alert('Erreur lors de la suppression');
    }
  };

  const getRoleBadgeColor = (roleName: string) => {
    switch (roleName) {
      case 'super_admin': return 'bg-red-100 text-red-700';
      case 'moderator': return 'bg-blue-100 text-blue-700';
      case 'support': return 'bg-green-100 text-green-700';
      case 'communication': return 'bg-purple-100 text-purple-700';
      case 'analyst': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'suspended': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Équipe Administrative</h2>
          <p className="text-gray-600 mt-1">
            Gérez les membres de l'équipe Trophenix et leurs permissions
          </p>
        </div>
        <button
          onClick={() => setShowInviteForm(true)}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
        >
          <UserPlus className="h-5 w-5" />
          Inviter un membre
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {roles.map(role => {
          const count = members.filter(m => m.role.name === role.name && m.status === 'active').length;
          return (
            <div key={role.id} className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-2">
                <Shield className={`h-5 w-5 ${getRoleBadgeColor(role.name).split(' ')[1]}`} />
                <span className="text-2xl font-bold text-gray-900">{count}</span>
              </div>
              <h3 className="font-medium text-gray-900 capitalize">
                {role.name.replace('_', ' ')}
              </h3>
              <p className="text-xs text-gray-600 mt-1">{role.description}</p>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Membre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rôle
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Invité le
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dernière connexion
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {members.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {member.first_name && member.last_name
                          ? `${member.first_name} ${member.last_name}`
                          : member.email}
                      </div>
                      <div className="text-sm text-gray-500">{member.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleBadgeColor(member.role.name)}`}>
                      {member.role.name.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeColor(member.status)}`}>
                      {member.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(member.invited_at).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {member.last_login
                      ? new Date(member.last_login).toLocaleDateString('fr-FR')
                      : 'Jamais'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      {member.status === 'active' ? (
                        <button
                          onClick={() => handleUpdateStatus(member.id, 'suspended')}
                          className="text-orange-600 hover:text-orange-900"
                          title="Suspendre"
                        >
                          <Ban className="h-4 w-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUpdateStatus(member.id, 'active')}
                          className="text-green-600 hover:text-green-900"
                          title="Activer"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleRemove(member.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Retirer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showInviteForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Inviter un membre</h3>
              <button onClick={() => setShowInviteForm(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleInvite} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={inviteData.email}
                  onChange={(e) => setInviteData({ ...inviteData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="email@exemple.com"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  L'utilisateur doit déjà avoir un compte sur la plateforme
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rôle *
                </label>
                <select
                  value={inviteData.role_id}
                  onChange={(e) => setInviteData({ ...inviteData, role_id: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Sélectionner un rôle</option>
                  {roles.map(role => (
                    <option key={role.id} value={role.id}>
                      {role.name.replace('_', ' ')} - {role.description}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (optionnel)
                </label>
                <textarea
                  value={inviteData.notes}
                  onChange={(e) => setInviteData({ ...inviteData, notes: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Notes internes sur ce membre..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowInviteForm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={inviting}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {inviting ? 'Invitation...' : 'Inviter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
