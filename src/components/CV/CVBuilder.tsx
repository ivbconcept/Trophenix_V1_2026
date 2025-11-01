import { useState, useEffect } from 'react';
import { User, Trophy, Award, Briefcase, GraduationCap, MapPin, Calendar, Phone, Mail, Download, Edit2, Save } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

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
  const [isEditing, setIsEditing] = useState(false);

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
      setAthleteProfile(data);
    } catch (err) {
      console.error('Error loading athlete profile:', err);
    } finally {
      setLoading(false);
    }
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

  if (!athleteProfile) {
    return (
      <div className="min-h-screen bg-slate-50 py-8">
        <div className="max-w-5xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <User className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-slate-900 mb-2">Profil incomplet</h2>
            <p className="text-slate-600">Veuillez compléter votre profil pour générer votre CV</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-slate-900">Mon CV</h1>
          <div className="flex gap-3">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              {isEditing ? (
                <>
                  <Save className="w-4 h-4" />
                  Enregistrer
                </>
              ) : (
                <>
                  <Edit2 className="w-4 h-4" />
                  Modifier
                </>
              )}
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Download className="w-4 h-4" />
              Télécharger PDF
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-12">
            <div className="flex items-start gap-6">
              <div className="w-32 h-32 rounded-full bg-white flex items-center justify-center overflow-hidden">
                {athleteProfile.photo_url ? (
                  <img src={athleteProfile.photo_url} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-16 h-16 text-slate-400" />
                )}
              </div>
              <div className="flex-1 text-white">
                <h2 className="text-4xl font-bold mb-2">
                  {athleteProfile.first_name} {athleteProfile.last_name}
                </h2>
                <p className="text-xl text-blue-100 mb-4">{athleteProfile.sport}</p>
                <div className="flex flex-wrap gap-4 text-sm">
                  {athleteProfile.sport_level && (
                    <div className="flex items-center gap-2">
                      <Trophy className="w-4 h-4" />
                      <span>{athleteProfile.sport_level}</span>
                    </div>
                  )}
                  {athleteProfile.geographic_zone && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{athleteProfile.geographic_zone}</span>
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
            {athleteProfile.situation && (
              <section>
                <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  Situation actuelle
                </h3>
                <p className="text-slate-700 leading-relaxed">{athleteProfile.situation}</p>
              </section>
            )}

            {athleteProfile.achievements && (
              <section>
                <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-blue-600" />
                  Palmarès sportif
                </h3>
                <p className="text-slate-700 leading-relaxed whitespace-pre-line">{athleteProfile.achievements}</p>
              </section>
            )}

            <section className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-blue-600" />
                  Informations sportives
                </h3>
                <div className="space-y-3">
                  {athleteProfile.birth_club && (
                    <div>
                      <span className="text-sm font-medium text-slate-500">Club formateur</span>
                      <p className="text-slate-900">{athleteProfile.birth_club}</p>
                    </div>
                  )}
                  {athleteProfile.training_center && (
                    <div>
                      <span className="text-sm font-medium text-slate-500">Centre de formation</span>
                      <p className="text-slate-900">{athleteProfile.training_center}</p>
                    </div>
                  )}
                  {athleteProfile.ministerial_list && (
                    <div>
                      <span className="text-sm font-medium text-slate-500">Liste ministérielle</span>
                      <p className="text-slate-900">{athleteProfile.ministerial_list}</p>
                    </div>
                  )}
                  {athleteProfile.athlete_type && (
                    <div>
                      <span className="text-sm font-medium text-slate-500">Type d'athlète</span>
                      <p className="text-slate-900">{athleteProfile.athlete_type}</p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-blue-600" />
                  Projet professionnel
                </h3>
                <div className="space-y-3">
                  {athleteProfile.desired_field && (
                    <div>
                      <span className="text-sm font-medium text-slate-500">Domaine souhaité</span>
                      <p className="text-slate-900">{athleteProfile.desired_field}</p>
                    </div>
                  )}
                  {athleteProfile.position_type && (
                    <div>
                      <span className="text-sm font-medium text-slate-500">Type de poste</span>
                      <p className="text-slate-900">{athleteProfile.position_type}</p>
                    </div>
                  )}
                  {athleteProfile.availability && (
                    <div>
                      <span className="text-sm font-medium text-slate-500">Disponibilité</span>
                      <p className="text-slate-900">{athleteProfile.availability}</p>
                    </div>
                  )}
                </div>
              </div>
            </section>

            {athleteProfile.professional_history && (
              <section>
                <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-blue-600" />
                  Expérience professionnelle
                </h3>
                <p className="text-slate-700 leading-relaxed whitespace-pre-line">{athleteProfile.professional_history}</p>
              </section>
            )}

            {athleteProfile.degrees && (
              <section>
                <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-blue-600" />
                  Formation
                </h3>
                <p className="text-slate-700 leading-relaxed whitespace-pre-line">{athleteProfile.degrees}</p>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
