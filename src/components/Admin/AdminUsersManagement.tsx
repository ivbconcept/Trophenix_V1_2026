import { useState, useEffect } from 'react';
import { Search, Filter, CheckCircle, XCircle, Eye, Ban, Trash2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { Profile, AthleteProfile, CompanyProfile } from '../../types';

interface UserWithProfile {
  profile: Profile;
  athleteProfile?: AthleteProfile;
  companyProfile?: CompanyProfile;
}

export default function AdminUsersManagement() {
  const [users, setUsers] = useState<UserWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'athlete' | 'company'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [selectedUser, setSelectedUser] = useState<UserWithProfile | null>(null);

  useEffect(() => {
    loadUsers();
  }, [filterType, filterStatus]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (filterType !== 'all') {
        query = query.eq('user_type', filterType);
      }

      if (filterStatus !== 'all') {
        query = query.eq('validation_status', filterStatus);
      }

      const { data: profiles, error } = await query;

      if (error) throw error;

      const usersWithProfiles: UserWithProfile[] = [];

      for (const profile of profiles || []) {
        if (profile.user_type === 'athlete') {
          const { data: athleteProfile } = await supabase
            .from('athlete_profiles')
            .select('*')
            .eq('user_id', profile.id)
            .maybeSingle();

          usersWithProfiles.push({ profile, athleteProfile: athleteProfile || undefined });
        } else if (profile.user_type === 'company') {
          const { data: companyProfile } = await supabase
            .from('company_profiles')
            .select('*')
            .eq('user_id', profile.id)
            .maybeSingle();

          usersWithProfiles.push({ profile, companyProfile: companyProfile || undefined });
        } else {
          usersWithProfiles.push({ profile });
        }
      }

      setUsers(usersWithProfiles);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleValidation = async (profileId: string, status: 'approved' | 'rejected') => {
    if (!confirm(`Confirmer le changement de statut ?`)) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ validation_status: status })
        .eq('id', profileId);

      if (error) throw error;
      await loadUsers();
    } catch (error) {
      alert('Erreur lors de la mise à jour');
    }
  };

  const handleDelete = async (profileId: string) => {
    if (!confirm('ATTENTION : Supprimer définitivement cet utilisateur et toutes ses données ?')) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', profileId);

      if (error) throw error;
      await loadUsers();
    } catch (error) {
      alert('Erreur lors de la suppression');
    }
  };

  const filteredUsers = users.filter(({ profile, athleteProfile, companyProfile }) => {
    const searchLower = searchTerm.toLowerCase();

    const matchesSearch =
      profile.email.toLowerCase().includes(searchLower) ||
      (profile.first_name?.toLowerCase().includes(searchLower)) ||
      (profile.last_name?.toLowerCase().includes(searchLower)) ||
      (athleteProfile?.first_name?.toLowerCase().includes(searchLower)) ||
      (athleteProfile?.last_name?.toLowerCase().includes(searchLower)) ||
      (companyProfile?.company_name?.toLowerCase().includes(searchLower));

    return matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">Approuvé</span>;
      case 'pending':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">En attente</span>;
      case 'rejected':
        return <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">Rejeté</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">{status}</span>;
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
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Gestion des Utilisateurs</h2>
        <p className="text-gray-600 mt-1">
          {filteredUsers.length} utilisateur{filteredUsers.length > 1 ? 's' : ''}
        </p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tous les types</option>
            <option value="athlete">Athlètes</option>
            <option value="company">Entreprises</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tous les statuts</option>
            <option value="pending">En attente</option>
            <option value="approved">Approuvés</option>
            <option value="rejected">Rejetés</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Utilisateur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Inscrit le
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map(({ profile, athleteProfile, companyProfile }) => (
                <tr key={profile.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {athleteProfile
                          ? `${athleteProfile.first_name} ${athleteProfile.last_name}`
                          : companyProfile?.company_name || 'N/A'}
                      </div>
                      <div className="text-sm text-gray-500">{profile.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                      {profile.user_type === 'athlete' ? 'Athlète' : 'Entreprise'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(profile.validation_status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(profile.created_at).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setSelectedUser({ profile, athleteProfile, companyProfile })}
                        className="text-blue-600 hover:text-blue-900"
                        title="Voir détails"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      {profile.validation_status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleValidation(profile.id, 'approved')}
                            className="text-green-600 hover:text-green-900"
                            title="Approuver"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleValidation(profile.id, 'rejected')}
                            className="text-red-600 hover:text-red-900"
                            title="Rejeter"
                          >
                            <XCircle className="h-4 w-4" />
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleDelete(profile.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Supprimer"
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

      {selectedUser && (
        <UserDetailModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onUpdate={loadUsers}
        />
      )}
    </div>
  );
}

function UserDetailModal({
  user,
  onClose,
  onUpdate,
}: {
  user: UserWithProfile;
  onClose: () => void;
  onUpdate: () => void;
}) {
  const { profile, athleteProfile, companyProfile } = user;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                {athleteProfile
                  ? `${athleteProfile.first_name} ${athleteProfile.last_name}`
                  : companyProfile?.company_name}
              </h3>
              <p className="text-sm text-gray-600 mt-1">{profile.email}</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              ×
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-sm text-gray-600">Type:</span>
              <p className="font-medium">{profile.user_type === 'athlete' ? 'Athlète' : 'Entreprise'}</p>
            </div>
            <div>
              <span className="text-sm text-gray-600">Statut:</span>
              <p className="font-medium">{profile.validation_status}</p>
            </div>
            <div>
              <span className="text-sm text-gray-600">Inscrit le:</span>
              <p className="font-medium">{new Date(profile.created_at).toLocaleDateString('fr-FR')}</p>
            </div>
          </div>

          {athleteProfile && (
            <div className="pt-4 border-t">
              <h4 className="font-semibold mb-3">Profil Athlète</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Sport:</span>
                  <p className="font-medium">{athleteProfile.sport}</p>
                </div>
                <div>
                  <span className="text-gray-600">Niveau:</span>
                  <p className="font-medium">{athleteProfile.sport_level}</p>
                </div>
              </div>
            </div>
          )}

          {companyProfile && (
            <div className="pt-4 border-t">
              <h4 className="font-semibold mb-3">Profil Entreprise</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Secteur:</span>
                  <p className="font-medium">{companyProfile.sector}</p>
                </div>
                <div>
                  <span className="text-gray-600">Taille:</span>
                  <p className="font-medium">{companyProfile.company_size}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
