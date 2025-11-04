import { useState, useEffect } from 'react';
import { User, Trophy, Award, Briefcase, GraduationCap, MapPin, Mail, Download, Edit2, Save, X, CheckCircle, MoreVertical, Pencil } from 'lucide-react';
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
  const [showMenu, setShowMenu] = useState(false);

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
    <div className="min-h-screen bg-white">
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

      <div className="max-w-4xl mx-auto">
        {showSuccessMessage && (
          <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3 no-print">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-green-800 font-medium">CV enregistré avec succès</span>
          </div>
        )}

        <div id="cv-content">
          <div className="bg-white px-8 py-10">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-6">
                <div className="w-28 h-28 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                  {displayProfile.photo_url ? (
                    <img src={displayProfile.photo_url} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-14 h-14 text-slate-400" />
                  )}
                </div>
                <div className="pt-2">
                  <h1 className="text-4xl font-bold text-slate-900 mb-2">
                    {displayProfile.first_name || 'Prénom'} {displayProfile.last_name || 'Nom'}
                  </h1>
                  <p className="text-lg text-slate-600 mb-3">{displayProfile.sport || 'Votre sport'}</p>
                  {profile?.email && (
                    <div className="flex items-center gap-2 text-slate-600">
                      <Mail className="w-4 h-4" />
                      <span className="text-sm">{profile.email}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="relative no-print">
                {isEditing ? (
                  <div className="flex gap-3">
                    <button
                      onClick={handleCancel}
                      className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors font-medium"
                    >
                      <X className="w-4 h-4" />
                      Annuler
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 font-medium"
                    >
                      <Save className="w-4 h-4" />
                      {saving ? 'Enregistrement...' : 'Enregistrer'}
                    </button>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => setShowMenu(!showMenu)}
                      className="p-2.5 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      <MoreVertical className="w-5 h-5 text-slate-700" />
                    </button>

                    {showMenu && (
                      <>
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => setShowMenu(false)}
                        />
                        <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-20">
                          {isCVEmpty && (
                            <button
                              onClick={() => {
                                setShowForm(true);
                                setShowMenu(false);
                              }}
                              className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-50 transition-colors"
                            >
                              <Edit2 className="w-4 h-4 text-green-600" />
                              <span className="font-medium text-slate-900">Compléter mon CV</span>
                            </button>
                          )}
                          <button
                            onClick={() => {
                              setIsEditing(true);
                              setShowMenu(false);
                            }}
                            className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-50 transition-colors"
                          >
                            <Edit2 className="w-4 h-4 text-slate-600" />
                            <span className="font-medium text-slate-900">Modifier</span>
                          </button>
                          <button
                            onClick={() => {
                              handleDownloadPDF();
                              setShowMenu(false);
                            }}
                            className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-50 transition-colors"
                          >
                            <Download className="w-4 h-4 text-blue-600" />
                            <span className="font-medium text-slate-900">Télécharger PDF</span>
                          </button>
                        </div>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>


          <div className="px-8 py-6">
            <div className="flex gap-2 mb-8 border-b border-slate-200 pb-0">
              <button className="px-4 py-2 text-sm font-medium text-slate-900 border-b-2 border-slate-900 -mb-px">
                À propos
              </button>
              <button className="px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-900">
                Travail
              </button>
              <button className="px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-900">
                Expérience
              </button>
              <button className="px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-900">
                Formation
              </button>
            </div>

            <section className="mb-8">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2 group">
                <User className="w-5 h-5 text-blue-600" />
                Situation actuelle
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-slate-100 rounded"
                  >
                    <Pencil className="w-4 h-4 text-slate-400 hover:text-slate-600" />
                  </button>
                )}
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
                <p className="text-slate-600 leading-relaxed">
                  {displayProfile.situation || 'Non renseigné'}
                </p>
              )}
            </section>

            <section className="mb-8">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2 group">
                <Trophy className="w-5 h-5 text-blue-600" />
                Palmarès sportif
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-slate-100 rounded"
                  >
                    <Pencil className="w-4 h-4 text-slate-400 hover:text-slate-600" />
                  </button>
                )}
              </h3>
              {isEditing ? (
                <textarea
                  value={displayProfile.achievements || ''}
                  onChange={(e) => handleFieldChange('achievements', e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-3 text-slate-700 leading-relaxed"
                  rows={4}
                  placeholder="Listez vos principaux résultats et titres..."
                />
              ) : (
                <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                  {displayProfile.achievements || 'Non renseigné'}
                </p>
              )}
            </section>

            <section className="mb-8">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2 group">
                Expérience professionnelle
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-slate-100 rounded"
                  >
                    <Pencil className="w-4 h-4 text-slate-400 hover:text-slate-600" />
                  </button>
                )}
              </h3>
              {isEditing ? (
                <textarea
                  value={displayProfile.professional_history || ''}
                  onChange={(e) => handleFieldChange('professional_history', e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-3 text-slate-700 leading-relaxed"
                  rows={4}
                  placeholder="Décrivez vos expériences professionnelles..."
                />
              ) : displayProfile.professional_history ? (
                <div className="space-y-6">
                  {displayProfile.professional_history.split('\n\n').map((experience, idx) => (
                    <div key={idx} className="flex gap-4">
                      <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                        <Briefcase className="w-6 h-6 text-slate-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-slate-600 whitespace-pre-line">{experience}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-600">Non renseigné</p>
              )}
            </section>

            <section className="mb-8">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2 group">
                Formation
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-slate-100 rounded"
                  >
                    <Pencil className="w-4 h-4 text-slate-400 hover:text-slate-600" />
                  </button>
                )}
              </h3>
              {isEditing ? (
                <textarea
                  value={displayProfile.degrees || ''}
                  onChange={(e) => handleFieldChange('degrees', e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-3 text-slate-700 leading-relaxed"
                  rows={3}
                  placeholder="Listez vos diplômes et formations..."
                />
              ) : displayProfile.degrees ? (
                <div className="space-y-6">
                  {displayProfile.degrees.split('\n\n').map((degree, idx) => (
                    <div key={idx} className="flex gap-4">
                      <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                        <GraduationCap className="w-6 h-6 text-slate-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-slate-600 whitespace-pre-line">{degree}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-600">Non renseigné</p>
              )}
            </section>

            <section className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-blue-600" />
                  Informations sportives
                </h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-slate-500 block mb-1">Club formateur</span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={displayProfile.birth_club || ''}
                        onChange={(e) => handleFieldChange('birth_club', e.target.value)}
                        className="w-full border border-slate-300 rounded-lg p-2 text-slate-900"
                        placeholder="Nom du club..."
                      />
                    ) : (
                      <p className="text-slate-900">{displayProfile.birth_club || 'Non renseigné'}</p>
                    )}
                  </div>
                  <div>
                    <span className="text-sm font-medium text-slate-500 block mb-1">Centre de formation</span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={displayProfile.training_center || ''}
                        onChange={(e) => handleFieldChange('training_center', e.target.value)}
                        className="w-full border border-slate-300 rounded-lg p-2 text-slate-900"
                        placeholder="Nom du centre..."
                      />
                    ) : (
                      <p className="text-slate-900">{displayProfile.training_center || 'Non renseigné'}</p>
                    )}
                  </div>
                  <div>
                    <span className="text-sm font-medium text-slate-500 block mb-1">Liste ministérielle</span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={displayProfile.ministerial_list || ''}
                        onChange={(e) => handleFieldChange('ministerial_list', e.target.value)}
                        className="w-full border border-slate-300 rounded-lg p-2 text-slate-900"
                        placeholder="Elite, Espoir, etc..."
                      />
                    ) : (
                      <p className="text-slate-900">{displayProfile.ministerial_list || 'Non renseigné'}</p>
                    )}
                  </div>
                  <div>
                    <span className="text-sm font-medium text-slate-500 block mb-1">Type d'athlète</span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={displayProfile.athlete_type || ''}
                        onChange={(e) => handleFieldChange('athlete_type', e.target.value)}
                        className="w-full border border-slate-300 rounded-lg p-2 text-slate-900"
                        placeholder="Handisport, Valide..."
                      />
                    ) : (
                      <p className="text-slate-900">{displayProfile.athlete_type || 'Non renseigné'}</p>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-blue-600" />
                  Projet professionnel
                </h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-slate-500 block mb-1">Domaine souhaité</span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={displayProfile.desired_field || ''}
                        onChange={(e) => handleFieldChange('desired_field', e.target.value)}
                        className="w-full border border-slate-300 rounded-lg p-2 text-slate-900"
                        placeholder="Marketing, Commercial, etc..."
                      />
                    ) : (
                      <p className="text-slate-900">{displayProfile.desired_field || 'Non renseigné'}</p>
                    )}
                  </div>
                  <div>
                    <span className="text-sm font-medium text-slate-500 block mb-1">Type de poste</span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={displayProfile.position_type || ''}
                        onChange={(e) => handleFieldChange('position_type', e.target.value)}
                        className="w-full border border-slate-300 rounded-lg p-2 text-slate-900"
                        placeholder="CDI, CDD, Stage..."
                      />
                    ) : (
                      <p className="text-slate-900">{displayProfile.position_type || 'Non renseigné'}</p>
                    )}
                  </div>
                  <div>
                    <span className="text-sm font-medium text-slate-500 block mb-1">Disponibilité</span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={displayProfile.availability || ''}
                        onChange={(e) => handleFieldChange('availability', e.target.value)}
                        className="w-full border border-slate-300 rounded-lg p-2 text-slate-900"
                        placeholder="Immédiate, Dans 3 mois..."
                      />
                    ) : (
                      <p className="text-slate-900">{displayProfile.availability || 'Non renseigné'}</p>
                    )}
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
