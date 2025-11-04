import { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Briefcase, Trophy, Award, Calendar, Save, X, Eye, Lock } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { ProfileStats } from './ProfileStats';

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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black p-4 md:p-8 transition-colors">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white dark:bg-zinc-950 rounded-3xl shadow-lg border border-slate-200 dark:border-zinc-800 overflow-hidden">
          <div className="h-48 bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500 relative">
            <div className="absolute inset-0 bg-black/10"></div>
          </div>
          <div className="px-6 md:px-8 -mt-20 pb-8">
            <div className="flex flex-col md:flex-row gap-6 md:gap-8">
              <div className="flex-shrink-0">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full overflow-hidden shadow-xl ring-4 ring-white dark:ring-zinc-950">
                    <img
                      src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=300"
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {editMode && (
                    <button className="absolute bottom-0 right-0 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors shadow-lg">
                      <User className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>

              <div className="flex-1">
                <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-4">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                      {profile?.user_type === 'athlete' && athleteData
                        ? `${athleteData.first_name || 'Prénom'} ${athleteData.last_name || 'Nom'}`
                        : profile?.user_type === 'company' && companyData
                        ? companyData.company_name || 'Entreprise'
                        : profile?.user_type === 'sponsor' && sponsorData
                        ? sponsorData.company_name || 'Sponsor'
                        : 'Utilisateur'}
                    </h1>
                    <div className="flex items-center text-slate-500 mt-2">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span className="text-sm">
                        {profile?.user_type === 'athlete' && athleteData
                          ? athleteData.location || 'Localisation non renseignée'
                          : profile?.user_type === 'company' && companyData
                          ? companyData.location || 'Localisation non renseignée'
                          : profile?.user_type === 'sponsor' && sponsorData
                          ? sponsorData.location || 'Localisation non renseignée'
                          : 'Non renseigné'}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {editMode ? (
                      <>
                        <button
                          onClick={() => setEditMode(false)}
                          className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-sm"
                        >
                          Annuler
                        </button>
                        <button
                          onClick={saveProfile}
                          disabled={saving}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 text-sm"
                        >
                          {saving ? 'Enregistrement...' : 'Enregistrer'}
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => setEditMode(true)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                      >
                        Modifier Profil
                      </button>
                    )}
                  </div>
                </div>

                <p className="text-slate-600 leading-relaxed text-sm md:text-base mb-4">
                  {profile?.user_type === 'athlete' && athleteData?.bio
                    ? athleteData.bio.length > 150
                      ? `${athleteData.bio.substring(0, 150)}...`
                      : athleteData.bio
                    : profile?.user_type === 'company' && companyData?.description
                    ? companyData.description.length > 150
                      ? `${companyData.description.substring(0, 150)}...`
                      : companyData.description
                    : profile?.user_type === 'sponsor' && sponsorData?.description
                    ? sponsorData.description.length > 150
                      ? `${sponsorData.description.substring(0, 150)}...`
                      : sponsorData.description
                    : 'Ajoutez une description pour présenter votre profil.'}
                </p>

                {profile?.user_type === 'athlete' && athleteData && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mt-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Trophy className="w-6 h-6 text-slate-600" />
                      </div>
                      <div>
                        <div className="text-xs text-slate-500">Sport</div>
                        <div className="font-semibold text-slate-900 text-sm">{athleteData.sport || 'Non renseigné'}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Award className="w-6 h-6 text-slate-600" />
                      </div>
                      <div>
                        <div className="text-xs text-slate-500">Niveau</div>
                        <div className="font-semibold text-slate-900 text-sm">{athleteData.sport_level || 'Non renseigné'}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Briefcase className="w-6 h-6 text-slate-600" />
                      </div>
                      <div>
                        <div className="text-xs text-slate-500">Disponibilité</div>
                        <div className="font-semibold text-slate-900 text-sm">{athleteData.availability || 'Non renseigné'}</div>
                      </div>
                    </div>
                  </div>
                )}

                {profile?.user_type === 'company' && companyData && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mt-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Briefcase className="w-6 h-6 text-slate-600" />
                      </div>
                      <div>
                        <div className="text-xs text-slate-500">Secteur</div>
                        <div className="font-semibold text-slate-900 text-sm">{companyData.sector || 'Non renseigné'}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="w-6 h-6 text-slate-600" />
                      </div>
                      <div>
                        <div className="text-xs text-slate-500">Taille</div>
                        <div className="font-semibold text-slate-900 text-sm">{companyData.company_size || 'Non renseigné'}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Phone className="w-6 h-6 text-slate-600" />
                      </div>
                      <div>
                        <div className="text-xs text-slate-500">Contact</div>
                        <div className="font-semibold text-slate-900 text-sm">{companyData.phone || 'Non renseigné'}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200 dark:border-zinc-800">
            <div className="flex gap-8 px-6 md:px-8 overflow-x-auto">
              <button
                onClick={() => setActiveTab('personal')}
                className={`py-4 font-medium transition-all border-b-2 whitespace-nowrap ${
                  activeTab === 'personal'
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-slate-500 dark:text-zinc-400 hover:text-slate-700 dark:hover:text-zinc-300'
                }`}
              >
                Informations
              </button>
              <button
                onClick={() => setActiveTab('public')}
                className={`py-4 font-medium transition-all border-b-2 whitespace-nowrap ${
                  activeTab === 'public'
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-slate-500 dark:text-zinc-400 hover:text-slate-700 dark:hover:text-zinc-300'
                }`}
              >
                Profil Public
              </button>
            </div>
          </div>

          <div className="p-6 md:p-8">
            {activeTab === 'personal' ? (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Informations personnelles</h2>
                  <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-zinc-400">
                    <Lock className="w-4 h-4" />
                    <span>Privé</span>
                  </div>
                </div>

                <div className="mb-6 pb-6 border-b border-slate-200 dark:border-zinc-800 space-y-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-slate-400 dark:text-zinc-500" />
                    <div>
                      <p className="text-sm text-slate-500 dark:text-zinc-400">Email</p>
                      <p className="font-medium text-slate-900 dark:text-white">{user?.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Award className="h-5 w-5 text-slate-400 dark:text-zinc-500" />
                    <div>
                      <p className="text-sm text-slate-500 dark:text-zinc-400">Type de compte</p>
                      <p className="font-medium text-slate-900 dark:text-white capitalize">{profile?.user_type}</p>
                    </div>
                  </div>
                </div>

                {profile?.user_type === 'athlete' && athleteData && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-2">Téléphone</label>
                        <input
                          type="tel"
                          value={athleteData.phone || ''}
                          onChange={(e) => setAthleteData({ ...athleteData, phone: e.target.value })}
                          disabled={!editMode}
                          className="w-full px-4 py-2 border border-slate-300 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50 dark:disabled:bg-zinc-900 bg-white dark:bg-zinc-900 text-slate-900 dark:text-white"
                          placeholder="+33 6 12 34 56 78"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-2">Date de naissance</label>
                        <input
                          type="date"
                          value={athleteData.birth_date || ''}
                          onChange={(e) => setAthleteData({ ...athleteData, birth_date: e.target.value })}
                          disabled={!editMode}
                          className="w-full px-4 py-2 border border-slate-300 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50 dark:disabled:bg-zinc-900 bg-white dark:bg-zinc-900 text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-2">Localisation</label>
                      <input
                        type="text"
                        value={athleteData.location || ''}
                        onChange={(e) => setAthleteData({ ...athleteData, location: e.target.value })}
                        disabled={!editMode}
                        className="w-full px-4 py-2 border border-slate-300 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50 dark:disabled:bg-zinc-900 bg-white dark:bg-zinc-900 text-slate-900 dark:text-white"
                        placeholder="Paris, France"
                      />
                    </div>
                  </div>
                )}

                {profile?.user_type === 'company' && companyData && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900">Profil public</h2>
                    <p className="text-sm text-slate-500 mt-1">Ces informations sont visibles par tous</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Eye className="w-4 h-4" />
                    <span>Public</span>
                  </div>
                </div>

                {profile?.user_type === 'athlete' && athleteData && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
