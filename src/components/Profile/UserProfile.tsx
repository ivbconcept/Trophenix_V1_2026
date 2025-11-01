import { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Briefcase, Trophy, Award, Calendar, Save, X, Eye, Lock } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

interface AthleteProfileData {
  first_name: string;
  last_name: string;
  sport: string;
  sport_level: string;
  birth_date: string | null;
  phone: string | null;
  location: string | null;
  professional_domain: string | null;
  position_type: string | null;
  availability: string | null;
  bio: string | null;
  achievements: string | null;
  professional_history: string | null;
  degrees: string | null;
  situation: string | null;
  birth_club: string | null;
  training_center: string | null;
  ministerial_list: string | null;
  athlete_type: string | null;
  geographic_zone: string | null;
  desired_field: string | null;
}

interface CompanyProfileData {
  company_name: string;
  sector: string;
  company_size: string;
  phone: string | null;
  location: string | null;
  website: string | null;
  description: string | null;
}

interface SponsorProfileData {
  company_name: string;
  industry_sector: string;
  sponsorship_budget: string;
  phone: string | null;
  location: string | null;
  website: string | null;
  description: string | null;
}

export function UserProfile() {
  const { user, profile, refreshProfile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState<'personal' | 'public'>('personal');

  const [athleteData, setAthleteData] = useState<AthleteProfileData | null>(null);
  const [companyData, setCompanyData] = useState<CompanyProfileData | null>(null);
  const [sponsorData, setSponsorData] = useState<SponsorProfileData | null>(null);

  useEffect(() => {
    loadProfileData();
  }, [user, profile]);

  const loadProfileData = async () => {
    try {
      setLoading(true);
      if (profile?.user_type === 'athlete') {
        const { data, error } = await supabase
          .from('athlete_profiles')
          .select('*')
          .eq('user_id', user?.id)
          .maybeSingle();

        if (error) throw error;
        if (data) {
          setAthleteData(data);
        }
      } else if (profile?.user_type === 'company') {
        const { data, error } = await supabase
          .from('company_profiles')
          .select('*')
          .eq('user_id', user?.id)
          .maybeSingle();

        if (error) throw error;
        if (data) {
          setCompanyData(data);
        }
      } else if (profile?.user_type === 'sponsor') {
        const { data, error } = await supabase
          .from('sponsor_profiles')
          .select('*')
          .eq('user_id', user?.id)
          .maybeSingle();

        if (error) throw error;
        if (data) {
          setSponsorData(data);
        }
      }
    } catch (error) {
      console.error('Error loading profile data:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async () => {
    try {
      setSaving(true);
      if (profile?.user_type === 'athlete' && athleteData) {
        await supabase
          .from('athlete_profiles')
          .upsert({ user_id: user?.id, ...athleteData });
      } else if (profile?.user_type === 'company' && companyData) {
        await supabase
          .from('company_profiles')
          .upsert({ user_id: user?.id, ...companyData });
      } else if (profile?.user_type === 'sponsor' && sponsorData) {
        await supabase
          .from('sponsor_profiles')
          .upsert({ user_id: user?.id, ...sponsorData });
      }
      await refreshProfile();
      setEditMode(false);
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-8 py-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-white flex items-center">
                <User className="mr-3" />
                Mon Profil
              </h1>
              <div className="flex space-x-2">
                {editMode ? (
                  <>
                    <button
                      onClick={() => setEditMode(false)}
                      className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors flex items-center space-x-2"
                    >
                      <X className="h-4 w-4" />
                      <span>Annuler</span>
                    </button>
                    <button
                      onClick={saveProfile}
                      disabled={saving}
                      className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-slate-50 transition-colors flex items-center space-x-2 disabled:opacity-50"
                    >
                      <Save className="h-4 w-4" />
                      <span>{saving ? 'Enregistrement...' : 'Enregistrer'}</span>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setEditMode(true)}
                    className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    Modifier
                  </button>
                )}
              </div>
            </div>

            <div className="flex space-x-1 bg-white/10 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('personal')}
                className={`flex-1 px-4 py-2 rounded-md transition-all font-medium flex items-center justify-center gap-2 ${
                  activeTab === 'personal'
                    ? 'bg-white text-blue-600 shadow-md'
                    : 'text-white hover:bg-white/20'
                }`}
              >
                <Lock className="w-4 h-4" />
                Profil Personnel
              </button>
              <button
                onClick={() => setActiveTab('public')}
                className={`flex-1 px-4 py-2 rounded-md transition-all font-medium flex items-center justify-center gap-2 ${
                  activeTab === 'public'
                    ? 'bg-white text-blue-600 shadow-md'
                    : 'text-white hover:bg-white/20'
                }`}
              >
                <Eye className="w-4 h-4" />
                Profil Public
              </button>
            </div>
          </div>

          <div className="p-8">
            {activeTab === 'personal' ? (
              <div>
                <h2 className="text-xl font-semibold text-slate-900 mb-6">Informations personnelles</h2>
                <div className="mb-6 pb-6 border-b border-slate-200 space-y-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-slate-400" />
                    <div>
                      <p className="text-sm text-slate-500">Email</p>
                      <p className="font-medium text-slate-900">{user?.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Award className="h-5 w-5 text-slate-400" />
                    <div>
                      <p className="text-sm text-slate-500">Type de compte</p>
                      <p className="font-medium text-slate-900 capitalize">{profile?.user_type}</p>
                    </div>
                  </div>
                </div>

                {profile?.user_type === 'athlete' && athleteData && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Téléphone</label>
                        <input
                          type="tel"
                          value={athleteData.phone || ''}
                          onChange={(e) => setAthleteData({ ...athleteData, phone: e.target.value })}
                          disabled={!editMode}
                          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50"
                          placeholder="+33 6 12 34 56 78"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Date de naissance</label>
                        <input
                          type="date"
                          value={athleteData.birth_date || ''}
                          onChange={(e) => setAthleteData({ ...athleteData, birth_date: e.target.value })}
                          disabled={!editMode}
                          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Localisation</label>
                      <input
                        type="text"
                        value={athleteData.location || ''}
                        onChange={(e) => setAthleteData({ ...athleteData, location: e.target.value })}
                        disabled={!editMode}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50"
                        placeholder="Paris, France"
                      />
                    </div>
                  </div>
                )}

                {profile?.user_type === 'company' && companyData && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Téléphone</label>
                        <input
                          type="tel"
                          value={companyData.phone || ''}
                          onChange={(e) => setCompanyData({ ...companyData, phone: e.target.value })}
                          disabled={!editMode}
                          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Localisation</label>
                        <input
                          type="text"
                          value={companyData.location || ''}
                          onChange={(e) => setCompanyData({ ...companyData, location: e.target.value })}
                          disabled={!editMode}
                          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {profile?.user_type === 'sponsor' && sponsorData && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Téléphone</label>
                        <input
                          type="tel"
                          value={sponsorData.phone || ''}
                          onChange={(e) => setSponsorData({ ...sponsorData, phone: e.target.value })}
                          disabled={!editMode}
                          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Localisation</label>
                        <input
                          type="text"
                          value={sponsorData.location || ''}
                          onChange={(e) => setSponsorData({ ...sponsorData, location: e.target.value })}
                          disabled={!editMode}
                          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <h2 className="text-xl font-semibold text-slate-900 mb-2">Profil public</h2>
                <p className="text-sm text-slate-500 mb-6">Ces informations sont visibles par tous les utilisateurs de la plateforme</p>

                {profile?.user_type === 'athlete' && athleteData && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Prénom</label>
                        <input
                          type="text"
                          value={athleteData.first_name || ''}
                          onChange={(e) => setAthleteData({ ...athleteData, first_name: e.target.value })}
                          disabled={!editMode}
                          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Nom</label>
                        <input
                          type="text"
                          value={athleteData.last_name || ''}
                          onChange={(e) => setAthleteData({ ...athleteData, last_name: e.target.value })}
                          disabled={!editMode}
                          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Sport</label>
                        <input
                          type="text"
                          value={athleteData.sport || ''}
                          onChange={(e) => setAthleteData({ ...athleteData, sport: e.target.value })}
                          disabled={!editMode}
                          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Niveau</label>
                        <input
                          type="text"
                          value={athleteData.sport_level || ''}
                          onChange={(e) => setAthleteData({ ...athleteData, sport_level: e.target.value })}
                          disabled={!editMode}
                          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Biographie</label>
                      <textarea
                        value={athleteData.bio || ''}
                        onChange={(e) => setAthleteData({ ...athleteData, bio: e.target.value })}
                        disabled={!editMode}
                        rows={4}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50"
                        placeholder="Présentez-vous en quelques lignes..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Palmarès</label>
                      <textarea
                        value={athleteData.achievements || ''}
                        onChange={(e) => setAthleteData({ ...athleteData, achievements: e.target.value })}
                        disabled={!editMode}
                        rows={4}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50"
                        placeholder="Vos principaux résultats sportifs..."
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Club formateur</label>
                        <input
                          type="text"
                          value={athleteData.birth_club || ''}
                          onChange={(e) => setAthleteData({ ...athleteData, birth_club: e.target.value })}
                          disabled={!editMode}
                          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Centre de formation</label>
                        <input
                          type="text"
                          value={athleteData.training_center || ''}
                          onChange={(e) => setAthleteData({ ...athleteData, training_center: e.target.value })}
                          disabled={!editMode}
                          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {profile?.user_type === 'company' && companyData && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Nom de l'entreprise</label>
                      <input
                        type="text"
                        value={companyData.company_name || ''}
                        onChange={(e) => setCompanyData({ ...companyData, company_name: e.target.value })}
                        disabled={!editMode}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Secteur</label>
                        <input
                          type="text"
                          value={companyData.sector || ''}
                          onChange={(e) => setCompanyData({ ...companyData, sector: e.target.value })}
                          disabled={!editMode}
                          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Taille</label>
                        <input
                          type="text"
                          value={companyData.company_size || ''}
                          onChange={(e) => setCompanyData({ ...companyData, company_size: e.target.value })}
                          disabled={!editMode}
                          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Site web</label>
                      <input
                        type="url"
                        value={companyData.website || ''}
                        onChange={(e) => setCompanyData({ ...companyData, website: e.target.value })}
                        disabled={!editMode}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                      <textarea
                        value={companyData.description || ''}
                        onChange={(e) => setCompanyData({ ...companyData, description: e.target.value })}
                        disabled={!editMode}
                        rows={4}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50"
                      />
                    </div>
                  </div>
                )}

                {profile?.user_type === 'sponsor' && sponsorData && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Nom de l'entreprise</label>
                      <input
                        type="text"
                        value={sponsorData.company_name || ''}
                        onChange={(e) => setSponsorData({ ...sponsorData, company_name: e.target.value })}
                        disabled={!editMode}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Secteur d'activité</label>
                        <input
                          type="text"
                          value={sponsorData.industry_sector || ''}
                          onChange={(e) => setSponsorData({ ...sponsorData, industry_sector: e.target.value })}
                          disabled={!editMode}
                          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Budget sponsoring</label>
                        <input
                          type="text"
                          value={sponsorData.sponsorship_budget || ''}
                          onChange={(e) => setSponsorData({ ...sponsorData, sponsorship_budget: e.target.value })}
                          disabled={!editMode}
                          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Site web</label>
                      <input
                        type="url"
                        value={sponsorData.website || ''}
                        onChange={(e) => setSponsorData({ ...sponsorData, website: e.target.value })}
                        disabled={!editMode}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                      <textarea
                        value={sponsorData.description || ''}
                        onChange={(e) => setSponsorData({ ...sponsorData, description: e.target.value })}
                        disabled={!editMode}
                        rows={4}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
