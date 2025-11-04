import { useState, useEffect } from 'react';
import { Search, MapPin, Trophy, Send, Filter, Mail, GraduationCap, Target, Building2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { AthleteProfile, Profile } from '../../types';

interface AthleteWithProfile extends AthleteProfile {
  profiles: Profile;
}

type TabType = 'sportifs' | 'experts';
type StatusType = 'En activité' | 'En reconversion' | 'En Blessure' | 'En Réflexion';

const statusConfig: Record<StatusType, { color: string; dotColor: string }> = {
  'En activité': { color: 'text-green-600', dotColor: 'bg-green-500' },
  'En reconversion': { color: 'text-blue-600', dotColor: 'bg-blue-500' },
  'En Blessure': { color: 'text-red-600', dotColor: 'bg-red-500' },
  'En Réflexion': { color: 'text-yellow-600', dotColor: 'bg-yellow-500' }
};

export default function AthleteDirectory() {
  const [athletes, setAthletes] = useState<AthleteWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('sportifs');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedAthlete, setSelectedAthlete] = useState<AthleteWithProfile | null>(null);

  useEffect(() => {
    loadAthletes();
  }, []);

  const loadAthletes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('athlete_profiles')
        .select(`
          *,
          profiles:user_id (*)
        `)
        .eq('profiles.validation_status', 'approved')
        .eq('profiles.user_type', 'athlete');

      if (error) throw error;
      setAthletes(data || []);
    } catch (error) {
      console.error('Error loading athletes:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAthleteStatus = (athlete: AthleteWithProfile): StatusType => {
    if (athlete.availability === 'En blessure') return 'En Blessure';
    if (athlete.availability === 'En reconversion') return 'En reconversion';
    if (athlete.availability === 'En réflexion') return 'En Réflexion';
    return 'En activité';
  };

  const filteredAthletes = athletes.filter((athlete) => {
    const matchesSearch =
      !searchTerm ||
      athlete.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      athlete.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      athlete.sport?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-black dark:via-zinc-950 dark:to-blue-950/20">
      <div className="max-w-[1600px] mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-6">
            <button
              onClick={() => setActiveTab('sportifs')}
              className={`px-6 py-3 rounded-xl font-semibold text-base transition-all ${
                activeTab === 'sportifs'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                  : 'bg-white dark:bg-zinc-900 text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800'
              }`}
            >
              Sportifs
            </button>
            <button
              onClick={() => setActiveTab('experts')}
              className={`px-6 py-3 rounded-xl font-semibold text-base transition-all ${
                activeTab === 'experts'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                  : 'bg-white dark:bg-zinc-900 text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800'
              }`}
            >
              Experts
            </button>

            <div className="relative ml-4">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher un athlète..."
                className="pl-12 pr-6 py-3 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 w-80"
              />
            </div>
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg"
          >
            <Filter className="h-6 w-6" />
          </button>
        </div>

        {filteredAthletes.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800">
            <Trophy className="mx-auto h-12 w-12 text-slate-400 mb-4" />
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">Aucun athlète trouvé</h3>
            <p className="text-slate-600 dark:text-zinc-400">Essayez de modifier vos critères de recherche</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredAthletes.map((athlete) => {
              const status = getAthleteStatus(athlete);
              const statusStyle = statusConfig[status];

              return (
                <div
                  key={athlete.id}
                  className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 overflow-hidden hover:shadow-2xl hover:border-blue-500 dark:hover:border-blue-500 transition-all cursor-pointer group"
                  onClick={() => setSelectedAthlete(athlete)}
                >
                  <div className="relative h-56 overflow-hidden">
                    {athlete.photo_url ? (
                      <img
                        src={athlete.photo_url}
                        alt={`${athlete.first_name} ${athlete.last_name}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-500 to-cyan-500"></div>
                    )}

                    <div className="absolute bottom-4 left-4">
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-16 rounded-full border-4 border-white overflow-hidden bg-white">
                          {athlete.photo_url ? (
                            <img
                              src={athlete.photo_url}
                              alt={`${athlete.first_name} ${athlete.last_name}`}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                              <span className="text-lg font-bold text-white">
                                {athlete.first_name?.[0]}{athlete.last_name?.[0]}
                              </span>
                            </div>
                          )}
                        </div>

                        <div>
                          <h3 className="text-xl font-bold text-white drop-shadow-lg">
                            {athlete.first_name} {athlete.last_name}
                          </h3>
                          <p className="text-white/90 font-medium drop-shadow">
                            {athlete.sport}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${statusStyle.dotColor}`}></div>
                      <span className={`text-sm font-semibold ${statusStyle.color}`}>
                        {status}
                      </span>
                    </div>

                    {athlete.city_of_residence && (
                      <div className="flex items-center gap-2 text-slate-600 dark:text-zinc-400">
                        <MapPin className="h-4 w-4 text-purple-500" />
                        <span className="text-sm">{athlete.city_of_residence}</span>
                      </div>
                    )}

                    {athlete.current_club && (
                      <div className="flex items-center gap-2 text-slate-600 dark:text-zinc-400">
                        <Building2 className="h-4 w-4 text-orange-500" />
                        <span className="text-sm">Club : {athlete.current_club}</span>
                      </div>
                    )}

                    {athlete.degrees && (
                      <div className="flex items-center gap-2 text-slate-600 dark:text-zinc-400">
                        <GraduationCap className="h-4 w-4 text-blue-500" />
                        <span className="text-sm">Actuellement : {athlete.degrees}</span>
                      </div>
                    )}

                    {athlete.desired_field && (
                      <div className="flex items-center gap-2 text-slate-600 dark:text-zinc-400">
                        <Target className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Recherche : {athlete.desired_field}</span>
                      </div>
                    )}

                    <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-semibold mt-4">
                      <Mail className="h-5 w-5" />
                      Contacter
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {selectedAthlete && (
          <AthleteDetailModal
            athlete={selectedAthlete}
            onClose={() => setSelectedAthlete(null)}
          />
        )}
      </div>
    </div>
  );
}

function AthleteDetailModal({
  athlete,
  onClose,
}: {
  athlete: AthleteWithProfile;
  onClose: () => void;
}) {
  const status = athlete.availability || 'En activité';
  const statusStyle = statusConfig[status as StatusType] || statusConfig['En activité'];

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-zinc-800">
        <div className="relative h-48 overflow-hidden">
          {athlete.photo_url ? (
            <img
              src={athlete.photo_url}
              alt={`${athlete.first_name} ${athlete.last_name}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-500 to-cyan-500"></div>
          )}

          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-200 text-3xl font-bold bg-black/30 hover:bg-black/50 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm transition-all"
          >
            ×
          </button>
        </div>

        <div className="relative px-8 pb-8">
          <div className="absolute -top-16 left-8">
            <div className="w-32 h-32 rounded-full border-4 border-white dark:border-zinc-900 overflow-hidden bg-white">
              {athlete.photo_url ? (
                <img
                  src={athlete.photo_url}
                  alt={`${athlete.first_name} ${athlete.last_name}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <span className="text-4xl font-bold text-white">
                    {athlete.first_name?.[0]}{athlete.last_name?.[0]}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="pt-20">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                  {athlete.first_name} {athlete.last_name}
                </h2>

                <div className="flex items-center gap-2 mb-3">
                  <Trophy className="h-5 w-5 text-blue-600" />
                  <span className="font-semibold text-slate-900 dark:text-white">{athlete.sport}</span>
                  {athlete.sport_level && (
                    <>
                      <span className="text-slate-400">•</span>
                      <span className="text-slate-600 dark:text-zinc-400">{athlete.sport_level}</span>
                    </>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${statusStyle.dotColor}`}></div>
                  <span className={`text-sm font-semibold ${statusStyle.color}`}>
                    {status}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {athlete.city_of_residence && (
                <div className="bg-slate-50 dark:bg-zinc-800 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin className="h-4 w-4 text-purple-500" />
                    <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Localisation</h3>
                  </div>
                  <p className="text-slate-700 dark:text-zinc-300">{athlete.city_of_residence}</p>
                </div>
              )}

              {athlete.nationality && (
                <div className="bg-slate-50 dark:bg-zinc-800 rounded-xl p-4">
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-1 text-sm">Nationalité</h3>
                  <p className="text-slate-700 dark:text-zinc-300">{athlete.nationality}</p>
                </div>
              )}

              {athlete.current_club && (
                <div className="bg-slate-50 dark:bg-zinc-800 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Building2 className="h-4 w-4 text-orange-500" />
                    <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Club actuel</h3>
                  </div>
                  <p className="text-slate-700 dark:text-zinc-300">{athlete.current_club}</p>
                </div>
              )}

              {athlete.desired_field && (
                <div className="bg-slate-50 dark:bg-zinc-800 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Target className="h-4 w-4 text-green-500" />
                    <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Domaine recherché</h3>
                  </div>
                  <p className="text-slate-700 dark:text-zinc-300">{athlete.desired_field}</p>
                </div>
              )}

              {athlete.availability && (
                <div className="bg-slate-50 dark:bg-zinc-800 rounded-xl p-4">
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-1 text-sm">Disponibilité</h3>
                  <p className="text-slate-700 dark:text-zinc-300">{athlete.availability}</p>
                </div>
              )}

              {athlete.degrees && (
                <div className="bg-slate-50 dark:bg-zinc-800 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <GraduationCap className="h-4 w-4 text-blue-500" />
                    <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Formation</h3>
                  </div>
                  <p className="text-slate-700 dark:text-zinc-300">{athlete.degrees}</p>
                </div>
              )}
            </div>

            {athlete.achievements && (
              <div className="mb-6 bg-slate-50 dark:bg-zinc-800 rounded-xl p-4">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Palmarès</h3>
                <p className="text-slate-700 dark:text-zinc-300 whitespace-pre-line leading-relaxed">{athlete.achievements}</p>
              </div>
            )}

            {athlete.professional_history && (
              <div className="mb-6 bg-slate-50 dark:bg-zinc-800 rounded-xl p-4">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Parcours professionnel</h3>
                <p className="text-slate-700 dark:text-zinc-300 whitespace-pre-line leading-relaxed">{athlete.professional_history}</p>
              </div>
            )}

            <button className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-semibold text-lg transition-all shadow-lg hover:shadow-xl">
              <Send className="h-5 w-5" />
              Envoyer un message
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
