import { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Briefcase, Trophy, Award, Calendar, Save, X } from 'lucide-react';
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

  const [athleteData, setAthleteData] = useState<AthleteProfileData | null>(null);
  const [companyData, setCompanyData] = useState<CompanyProfileData | null>(null);
  const [sponsorData, setSponsorData] = useState<SponsorProfileData | null>(null);

  useEffect(() => {
    loadProfileData();
  }, [user, profile]);

  const loadProfileData = async () => {
    if (!user || !profile) return;

    try {
      setLoading(true);

      if (profile.user_type === 'athlete') {
        const { data, error } = await supabase
          .from('athlete_profiles')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) throw error;
        setAthleteData(data);
      } else if (profile.user_type === 'company') {
        const { data, error } = await supabase
          .from('company_profiles')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) throw error;
        setCompanyData(data);
      } else if (profile.user_type === 'sponsor') {
        const { data, error } = await supabase
          .from('sponsor_profiles')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) throw error;
        setSponsorData(data);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async () => {
    if (!user || !profile) return;

    try {
      setSaving(true);

      if (profile.user_type === 'athlete' && athleteData) {
        const { error } = await supabase
          .from('athlete_profiles')
          .update(athleteData)
          .eq('user_id', user.id);

        if (error) throw error;
      } else if (profile.user_type === 'company' && companyData) {
        const { error } = await supabase
          .from('company_profiles')
          .update(companyData)
          .eq('user_id', user.id);

        if (error) throw error;
      } else if (profile.user_type === 'sponsor' && sponsorData) {
        const { error } = await supabase
          .from('sponsor_profiles')
          .update(sponsorData)
          .eq('user_id', user.id);

        if (error) throw error;
      }

      await refreshProfile();
      setEditMode(false);
      alert('Profil mis à jour avec succès !');
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Erreur lors de la mise à jour du profil');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Chargement du profil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-8 py-6">
            <div className="flex justify-between items-center">
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
          </div>

          <div className="p-8">
            <div className="mb-6 pb-6 border-b border-slate-200">
              <div className="flex items-center space-x-3 mb-4">
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

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Téléphone</label>
                    <input
                      type="tel"
                      value={athleteData.phone || ''}
                      onChange={(e) => setAthleteData({ ...athleteData, phone: e.target.value })}
                      disabled={!editMode}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Localisation</label>
                    <input
                      type="text"
                      value={athleteData.location || ''}
                      onChange={(e) => setAthleteData({ ...athleteData, location: e.target.value })}
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
                  />
                </div>

                <div className="pt-6 border-t border-slate-200">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                    <Trophy className="h-5 w-5 mr-2 text-blue-600" />
                    Informations du CV
                  </h3>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Situation actuelle</label>
                      <textarea
                        value={athleteData.situation || ''}
                        onChange={(e) => setAthleteData({ ...athleteData, situation: e.target.value })}
                        disabled={!editMode}
                        rows={3}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50"
                        placeholder="Décrivez votre situation actuelle..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Palmarès sportif</label>
                      <textarea
                        value={athleteData.achievements || ''}
                        onChange={(e) => setAthleteData({ ...athleteData, achievements: e.target.value })}
                        disabled={!editMode}
                        rows={4}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50"
                        placeholder="Listez vos principaux résultats et titres..."
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
                          placeholder="Nom du club..."
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
                          placeholder="INSEP, CREPS..."
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Liste ministérielle</label>
                        <input
                          type="text"
                          value={athleteData.ministerial_list || ''}
                          onChange={(e) => setAthleteData({ ...athleteData, ministerial_list: e.target.value })}
                          disabled={!editMode}
                          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50"
                          placeholder="Elite, Senior, Relève..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Type d'athlète</label>
                        <input
                          type="text"
                          value={athleteData.athlete_type || ''}
                          onChange={(e) => setAthleteData({ ...athleteData, athlete_type: e.target.value })}
                          disabled={!editMode}
                          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50"
                          placeholder="Valide, Handisport..."
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Expérience professionnelle</label>
                      <textarea
                        value={athleteData.professional_history || ''}
                        onChange={(e) => setAthleteData({ ...athleteData, professional_history: e.target.value })}
                        disabled={!editMode}
                        rows={4}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50"
                        placeholder="Décrivez vos expériences professionnelles..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Formation et diplômes</label>
                      <textarea
                        value={athleteData.degrees || ''}
                        onChange={(e) => setAthleteData({ ...athleteData, degrees: e.target.value })}
                        disabled={!editMode}
                        rows={4}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50"
                        placeholder="Listez vos diplômes et formations..."
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Zone géographique</label>
                        <input
                          type="text"
                          value={athleteData.geographic_zone || ''}
                          onChange={(e) => setAthleteData({ ...athleteData, geographic_zone: e.target.value })}
                          disabled={!editMode}
                          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50"
                          placeholder="Île-de-France..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Domaine souhaité</label>
                        <input
                          type="text"
                          value={athleteData.desired_field || ''}
                          onChange={(e) => setAthleteData({ ...athleteData, desired_field: e.target.value })}
                          disabled={!editMode}
                          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50"
                          placeholder="Marketing, Commercial..."
                        />
                      </div>
                    </div>
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
        </div>
      </div>
    </div>
  );
}
