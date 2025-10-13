import { useState, useEffect } from 'react';
import { Search, MapPin, Trophy, Send } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { AthleteProfile, Profile } from '../../types';

interface AthleteWithProfile extends AthleteProfile {
  profiles: Profile;
}

export default function AthleteDirectory() {
  const [athletes, setAthletes] = useState<AthleteWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sportFilter, setSportFilter] = useState('');
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

  const filteredAthletes = athletes.filter((athlete) => {
    const matchesSearch =
      !searchTerm ||
      athlete.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      athlete.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      athlete.sport?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSport = !sportFilter || athlete.sport === sportFilter;

    return matchesSearch && matchesSport;
  });

  const uniqueSports = Array.from(new Set(athletes.map(a => a.sport).filter(Boolean)));

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Annuaire des Athlètes</h1>
        <p className="text-gray-600">Découvrez les talents sportifs en reconversion</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher par nom ou sport..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <select
          value={sportFilter}
          onChange={(e) => setSportFilter(e.target.value)}
          className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Tous les sports</option>
          {uniqueSports.map((sport) => (
            <option key={sport} value={sport}>
              {sport}
            </option>
          ))}
        </select>
      </div>

      {filteredAthletes.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Trophy className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun athlète trouvé</h3>
          <p className="text-gray-600">Essayez de modifier vos critères de recherche</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAthletes.map((athlete) => (
            <div
              key={athlete.id}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setSelectedAthlete(athlete)}
            >
              <div className="h-32 bg-gradient-to-br from-blue-500 to-blue-600"></div>
              <div className="relative px-6 pb-6">
                <div className="absolute -top-12 left-6">
                  {athlete.photo_url ? (
                    <img
                      src={athlete.photo_url}
                      alt={`${athlete.first_name} ${athlete.last_name}`}
                      className="w-24 h-24 rounded-full border-4 border-white object-cover"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full border-4 border-white bg-gray-200 flex items-center justify-center">
                      <span className="text-2xl font-bold text-gray-500">
                        {athlete.first_name?.[0]}{athlete.last_name?.[0]}
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-14">
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">
                    {athlete.first_name} {athlete.last_name}
                  </h3>

                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                    <Trophy className="h-4 w-4 text-blue-600" />
                    <span className="font-medium">{athlete.sport}</span>
                    <span>•</span>
                    <span>{athlete.sport_level}</span>
                  </div>

                  {athlete.city_of_residence && (
                    <div className="flex items-center gap-1 text-sm text-gray-500 mb-3">
                      <MapPin className="h-4 w-4" />
                      {athlete.city_of_residence}
                    </div>
                  )}

                  {athlete.desired_field && (
                    <div className="mb-3">
                      <span className="text-sm text-gray-600">Recherche en:</span>
                      <p className="text-sm font-medium text-gray-900">{athlete.desired_field}</p>
                    </div>
                  )}

                  {athlete.achievements && (
                    <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                      {athlete.achievements}
                    </p>
                  )}

                  <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <Send className="h-4 w-4" />
                    Contacter
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedAthlete && (
        <AthleteDetailModal
          athlete={selectedAthlete}
          onClose={() => setSelectedAthlete(null)}
        />
      )}
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
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="relative h-40 bg-gradient-to-br from-blue-500 to-blue-600">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-200 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="relative px-8 pb-8">
          <div className="absolute -top-16 left-8">
            {athlete.photo_url ? (
              <img
                src={athlete.photo_url}
                alt={`${athlete.first_name} ${athlete.last_name}`}
                className="w-32 h-32 rounded-full border-4 border-white object-cover"
              />
            ) : (
              <div className="w-32 h-32 rounded-full border-4 border-white bg-gray-200 flex items-center justify-center">
                <span className="text-4xl font-bold text-gray-500">
                  {athlete.first_name?.[0]}{athlete.last_name?.[0]}
                </span>
              </div>
            )}
          </div>

          <div className="pt-20">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {athlete.first_name} {athlete.last_name}
            </h2>

            <div className="flex items-center gap-2 text-gray-600 mb-6">
              <Trophy className="h-5 w-5 text-blue-600" />
              <span className="font-semibold">{athlete.sport}</span>
              <span>•</span>
              <span>{athlete.sport_level}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {athlete.city_of_residence && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Localisation</h3>
                  <p className="text-gray-700">{athlete.city_of_residence}</p>
                </div>
              )}

              {athlete.nationality && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Nationalité</h3>
                  <p className="text-gray-700">{athlete.nationality}</p>
                </div>
              )}

              {athlete.current_club && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Club actuel</h3>
                  <p className="text-gray-700">{athlete.current_club}</p>
                </div>
              )}

              {athlete.desired_field && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Domaine recherché</h3>
                  <p className="text-gray-700">{athlete.desired_field}</p>
                </div>
              )}

              {athlete.availability && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Disponibilité</h3>
                  <p className="text-gray-700">{athlete.availability}</p>
                </div>
              )}

              {athlete.degrees && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Formation</h3>
                  <p className="text-gray-700">{athlete.degrees}</p>
                </div>
              )}
            </div>

            {athlete.achievements && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">Palmarès</h3>
                <p className="text-gray-700 whitespace-pre-line">{athlete.achievements}</p>
              </div>
            )}

            {athlete.professional_history && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">Parcours professionnel</h3>
                <p className="text-gray-700 whitespace-pre-line">{athlete.professional_history}</p>
              </div>
            )}

            <button className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
              <Send className="h-5 w-5" />
              Envoyer un message
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
