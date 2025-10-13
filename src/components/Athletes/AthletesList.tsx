import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { AthleteProfile, Profile } from '../../types';
import { Search, Filter, Trophy, MapPin, Briefcase, LogOut, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface AthleteWithProfile extends AthleteProfile {
  profile: Profile;
}

interface AthletesListProps {
  onViewProfile: (athleteId: string) => void;
}

export function AthletesList({ onViewProfile }: AthletesListProps) {
  const { signOut } = useAuth();
  const [athletes, setAthletes] = useState<AthleteWithProfile[]>([]);
  const [filteredAthletes, setFilteredAthletes] = useState<AthleteWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    sport: '',
    desired_field: '',
    geographic_zone: '',
    availability: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchAthletes();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, filters, athletes]);

  const fetchAthletes = async () => {
    setLoading(true);

    const { data: athleteProfiles, error } = await supabase
      .from('athlete_profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching athletes:', error);
      setLoading(false);
      return;
    }

    const athletesWithProfiles: AthleteWithProfile[] = [];

    for (const athlete of athleteProfiles) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', athlete.user_id)
        .eq('validation_status', 'approved')
        .maybeSingle();

      if (profile) {
        athletesWithProfiles.push({ ...athlete, profile });
      }
    }

    setAthletes(athletesWithProfiles);
    setLoading(false);
  };

  const applyFilters = () => {
    let filtered = [...athletes];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (athlete) =>
          athlete.first_name.toLowerCase().includes(term) ||
          athlete.last_name.toLowerCase().includes(term) ||
          athlete.sport.toLowerCase().includes(term) ||
          athlete.desired_field?.toLowerCase().includes(term)
      );
    }

    if (filters.sport) {
      filtered = filtered.filter((athlete) =>
        athlete.sport.toLowerCase().includes(filters.sport.toLowerCase())
      );
    }

    if (filters.desired_field) {
      filtered = filtered.filter((athlete) =>
        athlete.desired_field?.toLowerCase().includes(filters.desired_field.toLowerCase())
      );
    }

    if (filters.geographic_zone) {
      filtered = filtered.filter((athlete) =>
        athlete.geographic_zone?.toLowerCase().includes(filters.geographic_zone.toLowerCase())
      );
    }

    if (filters.availability) {
      filtered = filtered.filter((athlete) => athlete.availability === filters.availability);
    }

    setFilteredAthletes(filtered);
  };

  const resetFilters = () => {
    setFilters({
      sport: '',
      desired_field: '',
      geographic_zone: '',
      availability: ''
    });
    setSearchTerm('');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 mx-auto mb-4"></div>
          <p className="text-slate-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Trophy className="h-8 w-8 text-slate-700" />
              <span className="text-2xl font-bold text-slate-900">Trophenix</span>
            </div>
            <button
              onClick={() => signOut()}
              className="flex items-center space-x-2 px-4 py-2 text-slate-700 hover:text-slate-900 transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span>Déconnexion</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Profils Sportifs</h1>
          <p className="text-slate-600">
            Découvrez {filteredAthletes.length} sportif{filteredAthletes.length > 1 ? 's' : ''} en
            reconversion professionnelle
          </p>
        </div>

        <div className="mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Rechercher par nom, sport, domaine..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-6 py-3 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors flex items-center justify-center space-x-2"
            >
              <Filter className="h-5 w-5" />
              <span>Filtres</span>
            </button>
          </div>

          {showFilters && (
            <div className="bg-white p-6 rounded-xl shadow-sm space-y-4">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Sport</label>
                  <input
                    type="text"
                    value={filters.sport}
                    onChange={(e) => setFilters({ ...filters, sport: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                    placeholder="ex: Football"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Domaine souhaité
                  </label>
                  <input
                    type="text"
                    value={filters.desired_field}
                    onChange={(e) => setFilters({ ...filters, desired_field: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                    placeholder="ex: Marketing"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Localisation
                  </label>
                  <input
                    type="text"
                    value={filters.geographic_zone}
                    onChange={(e) => setFilters({ ...filters, geographic_zone: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                    placeholder="ex: Paris"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Disponibilité
                  </label>
                  <select
                    value={filters.availability}
                    onChange={(e) => setFilters({ ...filters, availability: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                  >
                    <option value="">Toutes</option>
                    <option value="Immédiate">Immédiate</option>
                    <option value="1 mois">Dans 1 mois</option>
                    <option value="3 mois">Dans 3 mois</option>
                    <option value="6 mois">Dans 6 mois</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 text-slate-600 hover:text-slate-900 transition-colors"
                >
                  Réinitialiser les filtres
                </button>
              </div>
            </div>
          )}
        </div>

        {filteredAthletes.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <User className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600 text-lg">Aucun profil ne correspond à vos critères</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAthletes.map((athlete) => (
              <div
                key={athlete.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden cursor-pointer"
                onClick={() => onViewProfile(athlete.id)}
              >
                {athlete.photo_url ? (
                  <img
                    src={athlete.photo_url}
                    alt={`${athlete.first_name} ${athlete.last_name}`}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-slate-100 flex items-center justify-center">
                    <User className="h-16 w-16 text-slate-400" />
                  </div>
                )}

                <div className="p-6">
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">
                    {athlete.first_name} {athlete.last_name}
                  </h3>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-slate-600">
                      <Trophy className="h-4 w-4 mr-2" />
                      <span>
                        {athlete.sport} - {athlete.sport_level}
                      </span>
                    </div>
                    {athlete.desired_field && (
                      <div className="flex items-center text-sm text-slate-600">
                        <Briefcase className="h-4 w-4 mr-2" />
                        <span>{athlete.desired_field}</span>
                      </div>
                    )}
                    {athlete.geographic_zone && (
                      <div className="flex items-center text-sm text-slate-600">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span>{athlete.geographic_zone}</span>
                      </div>
                    )}
                  </div>

                  {athlete.availability && (
                    <span className="inline-block px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm">
                      {athlete.availability}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
