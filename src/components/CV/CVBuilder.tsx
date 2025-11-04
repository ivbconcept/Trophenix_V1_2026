import { useState, useEffect } from 'react';
import { User, Trophy, Award, Briefcase, GraduationCap, MapPin, Mail, Download, Edit2, CheckCircle, MoreVertical, Camera } from 'lucide-react';
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
  const [loading, setLoading] = useState(true);
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
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    window.print();
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

  const displayProfile = athleteProfile;

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
          <section className="px-8 py-8 bg-white border-b border-slate-200">
            <h3 className="text-2xl font-bold text-slate-900 mb-3">Mon CV</h3>
            <p className="text-slate-600 text-lg">Suivez l'état de vos candidatures</p>
          </section>

          <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 px-8 py-10">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-6">
                <div className="relative w-28 h-28 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center overflow-hidden flex-shrink-0 border-4 border-white/30 group cursor-pointer hover:border-white/50 transition-all">
                  {displayProfile.photo_url ? (
                    <img src={displayProfile.photo_url} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-14 h-14 text-white/70" />
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Camera className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div className="pt-2">
                  <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-sm">
                    {displayProfile.first_name || 'Prénom'} {displayProfile.last_name || 'Nom'}
                  </h1>
                  <p className="text-lg text-white/90 mb-3 drop-shadow-sm">{displayProfile.sport || 'Votre sport'}</p>
                  {profile?.email && (
                    <div className="flex items-center gap-2 text-white/80">
                      <Mail className="w-4 h-4" />
                      <span className="text-sm">{profile.email}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="relative no-print">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-2.5 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg hover:bg-white/30 transition-colors"
                >
                  <MoreVertical className="w-5 h-5 text-white" />
                </button>

                {showMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowMenu(false)}
                    />
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-20">
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
              </div>
            </div>
          </div>

          <div className="px-8 py-10 space-y-8 bg-gradient-to-br from-slate-50 via-white to-slate-50">
            <section>
              <h3 className="text-xl font-bold text-slate-700 mb-4 flex items-center gap-2 bg-gradient-to-r from-slate-100 to-blue-50 px-4 py-3 rounded-lg shadow-sm border border-slate-200">
                <User className="w-5 h-5 text-blue-600" />
                Situation actuelle
              </h3>
              <p className="text-slate-700 leading-relaxed">
                {displayProfile.situation || 'Non renseigné'}
              </p>
            </section>

            <section>
              <h3 className="text-xl font-bold text-slate-700 mb-4 flex items-center gap-2 bg-gradient-to-r from-slate-100 to-blue-50 px-4 py-3 rounded-lg shadow-sm border border-slate-200">
                <Trophy className="w-5 h-5 text-blue-600" />
                Palmarès sportif
              </h3>
              <p className="text-slate-700 leading-relaxed whitespace-pre-line">
                {displayProfile.achievements || 'Non renseigné'}
              </p>
            </section>

            <section>
              <h3 className="text-xl font-bold text-slate-700 mb-4 flex items-center gap-2 bg-gradient-to-r from-slate-100 to-blue-50 px-4 py-3 rounded-lg shadow-sm border border-slate-200">
                <Award className="w-5 h-5 text-blue-600" />
                Informations sportives
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">Club formateur</p>
                  <p className="text-slate-900">{displayProfile.birth_club || 'Non renseigné'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">Centre de formation</p>
                  <p className="text-slate-900">{displayProfile.training_center || 'Non renseigné'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">Liste ministérielle</p>
                  <p className="text-slate-900">{displayProfile.ministerial_list || 'Non renseigné'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">Type d'athlète</p>
                  <p className="text-slate-900">{displayProfile.athlete_type || 'Non renseigné'}</p>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-xl font-bold text-slate-700 mb-4 flex items-center gap-2 bg-gradient-to-r from-slate-100 to-blue-50 px-4 py-3 rounded-lg shadow-sm border border-slate-200">
                <Briefcase className="w-5 h-5 text-blue-600" />
                Projet professionnel
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">Domaine souhaité</p>
                  <p className="text-slate-900">{displayProfile.desired_field || 'Non renseigné'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">Type de poste</p>
                  <p className="text-slate-900">{displayProfile.position_type || 'Non renseigné'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">Disponibilité</p>
                  <p className="text-slate-900">{displayProfile.availability || 'Non renseigné'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">Zone géographique</p>
                  <p className="text-slate-900">{displayProfile.geographic_zone || 'Non renseigné'}</p>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-xl font-bold text-slate-700 mb-4 flex items-center gap-2 bg-gradient-to-r from-slate-100 to-blue-50 px-4 py-3 rounded-lg shadow-sm border border-slate-200">
                <GraduationCap className="w-5 h-5 text-blue-600" />
                Formation
              </h3>
              <p className="text-slate-700 leading-relaxed whitespace-pre-line">
                {displayProfile.degrees || 'Non renseigné'}
              </p>
            </section>

            <section>
              <h3 className="text-xl font-bold text-slate-700 mb-4 flex items-center gap-2 bg-gradient-to-r from-slate-100 to-blue-50 px-4 py-3 rounded-lg shadow-sm border border-slate-200">
                <Briefcase className="w-5 h-5 text-blue-600" />
                Expérience professionnelle
              </h3>
              <p className="text-slate-700 leading-relaxed whitespace-pre-line">
                {displayProfile.professional_history || 'Non renseigné'}
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
