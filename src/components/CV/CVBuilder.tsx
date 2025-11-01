import { useState, useEffect } from 'react';
import { User, Trophy, Award, Briefcase, GraduationCap, MapPin, Mail, Download, Edit2, Save, X, CheckCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import CVForm from './CVForm';

interface AthleteProfile {
  first_name: string;
  last_name: string;
  photo_url: string | null;
  sport: string;
  sport_level: string;
  achievements: string | null;
  professional_history: string | null;
  geographic_zone: string | null;
  desired_field: string | null;
  position_type: string | null;
  availability: string | null;
  degrees: string | null;
  birth_date: string | null;
  birth_club: string | null;
  training_center: string | null;
  ministerial_list: string | null;
  situation: string | null;
  athlete_type: string | null;
}

export default function CVBuilder() {
  const { user, profile } = useAuth();
  const [athleteProfile, setAthleteProfile] = useState<AthleteProfile | null>(null);
  const [editedProfile, setEditedProfile] = useState<AthleteProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (user) {
      loadAthleteProfile();
    }
  }, [user]);

  const loadAthleteProfile = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('athlete_profiles')
        .select('*')
        .eq('user_id', user?.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setAthleteProfile(data);
        setEditedProfile(data);
      } else {
        const emptyProfile: AthleteProfile = {
          first_name: '',
          last_name: '',
          sport: '',
          sport_level: '',
          birth_date: null,
          situation: null,
          achievements: null,
          professional_history: null,
          degrees: null,
          birth_club: null,
          training_center: null,
          ministerial_list: null,
          athlete_type: null,
          geographic_zone: null,
          desired_field: null,
          photo_url: null,
          position_type: null,
          availability: null
        };
        setAthleteProfile(emptyProfile);
        setEditedProfile(emptyProfile);
      }
    } catch (err) {
      console.error('Error loading athlete profile:', err);
      const emptyProfile: AthleteProfile = {
        first_name: '',
        last_name: '',
        sport: '',
        sport_level: '',
        birth_date: null,
        situation: null,
        achievements: null,
        professional_history: null,
        degrees: null,
        birth_club: null,
        training_center: null,
        ministerial_list: null,
        athlete_type: null,
        geographic_zone: null,
        desired_field: null,
        photo_url: null,
        position_type: null,
        availability: null
      };
      setAthleteProfile(emptyProfile);
      setEditedProfile(emptyProfile);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!editedProfile || !user) return;

    try {
      setSaving(true);
      const { error } = await supabase
        .from('athlete_profiles')
        .upsert({
          user_id: user.id,
          situation: editedProfile.situation,
          achievements: editedProfile.achievements,
          birth_club: editedProfile.birth_club,
          training_center: editedProfile.training_center,
          ministerial_list: editedProfile.ministerial_list,
          athlete_type: editedProfile.athlete_type,
          desired_field: editedProfile.desired_field,
          position_type: editedProfile.position_type,
          availability: editedProfile.availability,
          professional_history: editedProfile.professional_history,
          degrees: editedProfile.degrees,
          geographic_zone: editedProfile.geographic_zone,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });

      if (error) throw error;

      await loadAthleteProfile();
      setIsEditing(false);
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    } catch (err) {
      console.error('Error saving profile:', err);
      alert('Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedProfile(athleteProfile);
    setIsEditing(false);
  };

  const handleDownloadPDF = () => {
    window.print();
  };

  const handleFieldChange = (field: keyof AthleteProfile, value: string) => {
    if (!editedProfile) return;
    setEditedProfile({
      ...editedProfile,
      [field]: value
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 py-8">
        <div className="max-w-5xl mx-auto px-4">
          <div className="animate-pulse space-y-6">
            <div className="h-48 bg-white rounded-lg"></div>
            <div className="h-96 bg-white rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  const handleFormSave = async (formData: any) => {
    if (!user) return;

    const { error } = await supabase
      .from('athlete_profiles')
      .upsert({
        user_id: user.id,
        situation: formData.situation,
        achievements: formData.achievements,
        birth_club: formData.birth_club,
        training_center: formData.training_center,
        ministerial_list: formData.ministerial_list,
        athlete_type: formData.athlete_type,
        desired_field: formData.desired_field,
        position_type: formData.position_type,
        availability: formData.availability,
        professional_history: formData.professional_history,
        degrees: formData.degrees,
        geographic_zone: formData.geographic_zone,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      });

    if (error) throw error;

    await loadAthleteProfile();
    setShowForm(false);
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  const isCVEmpty = athleteProfile && !(
    athleteProfile.situation ||
    athleteProfile.achievements ||
    athleteProfile.professional_history ||
    athleteProfile.degrees ||
    athleteProfile.birth_club ||
    athleteProfile.training_center
  );

  if (showForm) {
    return (
      <CVForm
        initialData={athleteProfile || {}}
        onSave={handleFormSave}
        onCancel={() => setShowForm(false)}
      />
    );
  }


  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 py-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!athleteProfile) {
    return (
      <div className="min-h-screen bg-slate-50 py-8 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600">Erreur lors du chargement du profil</p>
        </div>
      </div>
    );
  }

  const displayProfile = isEditing ? (editedProfile || athleteProfile) : athleteProfile;

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #cv-content, #cv-content * {
            visibility: visible;
          }
          #cv-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div className="max-w-5xl mx-auto px-4">
        {showSuccessMessage && (
          <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-green-800 font-medium">CV enregistré avec succès</span>
          </div>
        )}

        <div className="mb-6 flex justify-between items-center no-print">
          <h1 className="text-3xl font-bold text-slate-900">Mon CV</h1>
          <div className="flex gap-3">
            {isEditing ? (
              <>
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <X className="w-4 h-4" />
                  Annuler
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'Enregistrement...' : 'Enregistrer'}
                </button>
              </>
            ) : (
              <>
                {isCVEmpty && (
                  <button
                    onClick={() => setShowForm(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                    Compléter mon CV
                  </button>
                )}
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                  Modifier
                </button>
                <button
                  onClick={handleDownloadPDF}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Télécharger PDF
                </button>
              </>
            )}
          </div>
        </div>

        {isCVEmpty && !isEditing && (
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-6 no-print">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Trophy className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">
                  Votre CV est presque prêt !
                </h3>
                <p className="text-blue-700 mb-4">
                  Complétez vos informations (palmarès, expériences, formations) pour créer un CV complet et attractif pour les recruteurs.
                </p>
                <button
                  onClick={() => setShowForm(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Compléter maintenant
                </button>
              </div>
            </div>
          </div>
        )}

        <div id="cv-content" className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-12">
            <div className="flex items-start gap-6">
              <div className="w-32 h-32 rounded-full bg-white flex items-center justify-center overflow-hidden flex-shrink-0">
                {displayProfile.photo_url ? (
                  <img src={displayProfile.photo_url} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-16 h-16 text-slate-400" />
                )}
              </div>
              <div className="flex-1 text-white">
                <h2 className="text-4xl font-bold mb-2">
                  {displayProfile.first_name || 'Prénom'} {displayProfile.last_name || 'Nom'}
                </h2>
                <p className="text-xl text-blue-100 mb-4">{displayProfile.sport || 'Votre sport'}</p>
                <div className="flex flex-wrap gap-4 text-sm">
                  {displayProfile.sport_level && (
                    <div className="flex items-center gap-2">
                      <Trophy className="w-4 h-4" />
                      <span>{displayProfile.sport_level}</span>
                    </div>
                  )}
                  {displayProfile.geographic_zone && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {isEditing ? (
                        <input
                          type="text"
                          value={displayProfile.geographic_zone}
                          onChange={(e) => handleFieldChange('geographic_zone', e.target.value)}
                          className="bg-white/20 border border-white/30 rounded px-2 py-1 text-white placeholder-white/70"
                        />
                      ) : (
                        <span>{displayProfile.geographic_zone}</span>
                      )}
                    </div>
                  )}
                  {profile?.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <span>{profile.email}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 space-y-8">
            <section>
              <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                Situation actuelle
              </h3>
              {isEditing ? (
                <textarea
                  value={displayProfile.situation || ''}
                  onChange={(e) => handleFieldChange('situation', e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-3 text-slate-700 leading-relaxed"
                  rows={3}
                  placeholder="Décrivez votre situation actuelle..."
                />
              ) : (
                <p className="text-slate-700 leading-relaxed">
                  {displayProfile.situation || 'Non renseigné'}
                </p>
              )}
            </section>

            <section>
              <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-blue-600" />
                Palmarès sportif
              </h3>
              {isEditing ? (
                <textarea
                  value={displayProfile.achievements || ''}
                  onChange={(e) => handleFieldChange('achievements', e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-3 text-slate-700 leading-relaxed"
                  rows={5}
                  placeholder="Listez vos principaux résultats et titres..."
                />
              ) : (
                <p className="text-slate-700 leading-relaxed whitespace-pre-line">
                  {displayProfile.achievements || 'Non renseigné'}
                </p>
              )}
            </section>

            <section className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-blue-600" />
                  Informations sportives
                </h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-slate-500">Club formateur</span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={displayProfile.birth_club || ''}
                        onChange={(e) => handleFieldChange('birth_club', e.target.value)}
                        className="w-full border border-slate-300 rounded-lg p-2 text-slate-900 mt-1"
                        placeholder="Nom du club..."
                      />
                    ) : (
                      <p className="text-slate-900">{displayProfile.birth_club || 'Non renseigné'}</p>
                    )}
                  </div>
                  <div>
                    <span className="text-sm font-medium text-slate-500">Centre de formation</span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={displayProfile.training_center || ''}
                        onChange={(e) => handleFieldChange('training_center', e.target.value)}
                        className="w-full border border-slate-300 rounded-lg p-2 text-slate-900 mt-1"
                        placeholder="Nom du centre..."
                      />
                    ) : (
                      <p className="text-slate-900">{displayProfile.training_center || 'Non renseigné'}</p>
                    )}
                  </div>
                  <div>
                    <span className="text-sm font-medium text-slate-500">Liste ministérielle</span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={displayProfile.ministerial_list || ''}
                        onChange={(e) => handleFieldChange('ministerial_list', e.target.value)}
                        className="w-full border border-slate-300 rounded-lg p-2 text-slate-900 mt-1"
                        placeholder="Elite, Espoir, etc..."
                      />
                    ) : (
                      <p className="text-slate-900">{displayProfile.ministerial_list || 'Non renseigné'}</p>
                    )}
                  </div>
                  <div>
                    <span className="text-sm font-medium text-slate-500">Type d'athlète</span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={displayProfile.athlete_type || ''}
                        onChange={(e) => handleFieldChange('athlete_type', e.target.value)}
                        className="w-full border border-slate-300 rounded-lg p-2 text-slate-900 mt-1"
                        placeholder="Handisport, Valide..."
                      />
                    ) : (
                      <p className="text-slate-900">{displayProfile.athlete_type || 'Non renseigné'}</p>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-blue-600" />
                  Projet professionnel
                </h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-slate-500">Domaine souhaité</span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={displayProfile.desired_field || ''}
                        onChange={(e) => handleFieldChange('desired_field', e.target.value)}
                        className="w-full border border-slate-300 rounded-lg p-2 text-slate-900 mt-1"
                        placeholder="Marketing, Commercial, etc..."
                      />
                    ) : (
                      <p className="text-slate-900">{displayProfile.desired_field || 'Non renseigné'}</p>
                    )}
                  </div>
                  <div>
                    <span className="text-sm font-medium text-slate-500">Type de poste</span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={displayProfile.position_type || ''}
                        onChange={(e) => handleFieldChange('position_type', e.target.value)}
                        className="w-full border border-slate-300 rounded-lg p-2 text-slate-900 mt-1"
                        placeholder="CDI, CDD, Stage..."
                      />
                    ) : (
                      <p className="text-slate-900">{displayProfile.position_type || 'Non renseigné'}</p>
                    )}
                  </div>
                  <div>
                    <span className="text-sm font-medium text-slate-500">Disponibilité</span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={displayProfile.availability || ''}
                        onChange={(e) => handleFieldChange('availability', e.target.value)}
                        className="w-full border border-slate-300 rounded-lg p-2 text-slate-900 mt-1"
                        placeholder="Immédiate, Dans 3 mois..."
                      />
                    ) : (
                      <p className="text-slate-900">{displayProfile.availability || 'Non renseigné'}</p>
                    )}
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-blue-600" />
                Expérience professionnelle
              </h3>
              {isEditing ? (
                <textarea
                  value={displayProfile.professional_history || ''}
                  onChange={(e) => handleFieldChange('professional_history', e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-3 text-slate-700 leading-relaxed"
                  rows={5}
                  placeholder="Décrivez vos expériences professionnelles..."
                />
              ) : (
                <p className="text-slate-700 leading-relaxed whitespace-pre-line">
                  {displayProfile.professional_history || 'Non renseigné'}
                </p>
              )}
            </section>

            <section>
              <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-blue-600" />
                Formation
              </h3>
              {isEditing ? (
                <textarea
                  value={displayProfile.degrees || ''}
                  onChange={(e) => handleFieldChange('degrees', e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-3 text-slate-700 leading-relaxed"
                  rows={4}
                  placeholder="Listez vos diplômes et formations..."
                />
              ) : (
                <p className="text-slate-700 leading-relaxed whitespace-pre-line">
                  {displayProfile.degrees || 'Non renseigné'}
                </p>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
