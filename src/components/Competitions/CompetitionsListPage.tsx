import React, { useState } from 'react';
import { Search, Filter, X, MapPin, Calendar, Users, Trophy, Clock, Medal, Star } from 'lucide-react';

// Mock data for testing
const mockCompetitions = [
  {
    id: '1',
    title: 'Marathon de Paris 2028',
    sport: 'Athlétisme',
    category: 'Course à pied',
    location: 'Paris, France',
    date: '2028-04-15',
    image: 'https://images.pexels.com/photos/2402777/pexels-photo-2402777.jpeg?auto=compress&cs=tinysrgb&w=800',
    participants: 45000,
    maxParticipants: 50000,
    prizePool: '500 000 €',
    level: 'Tous niveaux',
    featured: true,
  },
  {
    id: '2',
    title: 'Tournoi Tennis Roland-Garros Junior',
    sport: 'Tennis',
    category: 'Junior',
    location: 'Paris, France',
    date: '2028-05-22',
    image: 'https://images.pexels.com/photos/1619999/pexels-photo-1619999.jpeg?auto=compress&cs=tinysrgb&w=800',
    participants: 128,
    maxParticipants: 128,
    prizePool: '50 000 €',
    level: 'Junior Elite',
    featured: true,
  },
  {
    id: '3',
    title: 'Championnat de France de Natation',
    sport: 'Natation',
    category: 'Elite',
    location: 'Marseille, France',
    date: '2028-06-10',
    image: 'https://images.pexels.com/photos/863988/pexels-photo-863988.jpeg?auto=compress&cs=tinysrgb&w=800',
    participants: 350,
    maxParticipants: 500,
    prizePool: '100 000 €',
    level: 'Elite',
    featured: false,
  },
  {
    id: '4',
    title: 'Tour de France Cycliste',
    sport: 'Cyclisme',
    category: 'Route',
    location: 'France',
    date: '2028-07-01',
    image: 'https://images.pexels.com/photos/179912/pexels-photo-179912.jpeg?auto=compress&cs=tinysrgb&w=800',
    participants: 22,
    maxParticipants: 22,
    prizePool: '2 000 000 €',
    level: 'Professionnel',
    featured: true,
  },
  {
    id: '5',
    title: 'Open de Basketball 3x3',
    sport: 'Basketball',
    category: '3x3',
    location: 'Lyon, France',
    date: '2028-08-15',
    image: 'https://images.pexels.com/photos/1080882/pexels-photo-1080882.jpeg?auto=compress&cs=tinysrgb&w=800',
    participants: 64,
    maxParticipants: 128,
    prizePool: '25 000 €',
    level: 'Amateur',
    featured: false,
  },
  {
    id: '6',
    title: 'Compétition de Gymnastique Artistique',
    sport: 'Gymnastique',
    category: 'Artistique',
    location: 'Bercy, Paris',
    date: '2028-09-20',
    image: 'https://images.pexels.com/photos/4039921/pexels-photo-4039921.jpeg?auto=compress&cs=tinysrgb&w=800',
    participants: 150,
    maxParticipants: 200,
    prizePool: '75 000 €',
    level: 'Elite',
    featured: false,
  },
];

export function CompetitionsListPage() {
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSport, setSelectedSport] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');

  const filteredCompetitions = mockCompetitions.filter(comp => {
    const matchesSearch = comp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         comp.sport.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         comp.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSport = selectedSport === 'all' || comp.sport === selectedSport;
    const matchesLevel = selectedLevel === 'all' || comp.level === selectedLevel;
    return matchesSearch && matchesSport && matchesLevel;
  });

  const sports = [...new Set(mockCompetitions.map(c => c.sport))];
  const levels = [...new Set(mockCompetitions.map(c => c.level))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-zinc-950 dark:via-black dark:to-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
              <Trophy className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
              Compétitions Disponibles
            </h1>
          </div>
          <p className="text-lg text-slate-600 dark:text-zinc-400">
            Découvrez et participez aux compétitions sportives de haut niveau
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher une compétition, un sport, une ville..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-6 py-3 bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 rounded-xl hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors flex items-center gap-2 justify-center sm:w-auto w-full text-slate-900 dark:text-white"
          >
            <Filter className="w-5 h-5" />
            Filtres
            {(selectedSport !== 'all' || selectedLevel !== 'all') && (
              <span className="ml-1 w-2 h-2 bg-blue-500 rounded-full"></span>
            )}
          </button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mb-6 bg-white dark:bg-zinc-900 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-zinc-800">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Filtres</h3>
              <button
                onClick={() => setShowFilters(false)}
                className="text-sm text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1"
              >
                <X className="w-4 h-4" />
                Fermer
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Sport Filter */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-2">
                  Sport
                </label>
                <select
                  value={selectedSport}
                  onChange={(e) => setSelectedSport(e.target.value)}
                  className="w-full px-4 py-2 bg-white dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Tous les sports</option>
                  {sports.map(sport => (
                    <option key={sport} value={sport}>{sport}</option>
                  ))}
                </select>
              </div>

              {/* Level Filter */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-2">
                  Niveau
                </label>
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="w-full px-4 py-2 bg-white dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Tous les niveaux</option>
                  {levels.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Reset Filters */}
            {(selectedSport !== 'all' || selectedLevel !== 'all') && (
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => {
                    setSelectedSport('all');
                    setSelectedLevel('all');
                  }}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Réinitialiser les filtres
                </button>
              </div>
            )}
          </div>
        )}

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-sm text-slate-600 dark:text-zinc-400">
            {filteredCompetitions.length} compétition{filteredCompetitions.length > 1 ? 's' : ''} trouvée{filteredCompetitions.length > 1 ? 's' : ''}
          </p>
        </div>

        {/* Competitions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompetitions.map((competition) => (
            <div
              key={competition.id}
              className="group bg-white dark:bg-zinc-900 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-200 dark:border-zinc-800 hover:border-blue-500 dark:hover:border-blue-500"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={competition.image}
                  alt={competition.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {competition.featured && (
                  <div className="absolute top-3 right-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg">
                    <Star className="w-3 h-3" fill="currentColor" />
                    À la une
                  </div>
                )}
                <div className="absolute bottom-3 left-3 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-slate-900 dark:text-white">
                  {competition.sport}
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {competition.title}
                </h3>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-zinc-400">
                    <MapPin className="w-4 h-4 flex-shrink-0" />
                    <span className="line-clamp-1">{competition.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-zinc-400">
                    <Calendar className="w-4 h-4 flex-shrink-0" />
                    <span>{new Date(competition.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-zinc-400">
                    <Users className="w-4 h-4 flex-shrink-0" />
                    <span>{competition.participants.toLocaleString()} / {competition.maxParticipants.toLocaleString()} participants</span>
                  </div>
                </div>

                {/* Prize Pool & Level */}
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-200 dark:border-zinc-800">
                  <div className="flex items-center gap-1.5">
                    <Trophy className="w-4 h-4 text-amber-500" />
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">{competition.prizePool}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Medal className="w-4 h-4 text-blue-500" />
                    <span className="text-sm text-slate-600 dark:text-zinc-400">{competition.level}</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div>
                  <div className="flex justify-between text-xs text-slate-600 dark:text-zinc-400 mb-1">
                    <span>Places restantes</span>
                    <span>{competition.maxParticipants - competition.participants} / {competition.maxParticipants}</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-zinc-800 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-cyan-500 h-full rounded-full transition-all duration-300"
                      style={{ width: `${(competition.participants / competition.maxParticipants) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredCompetitions.length === 0 && (
          <div className="text-center py-16 bg-white dark:bg-zinc-900 rounded-xl shadow-md border border-slate-200 dark:border-zinc-800">
            <div className="text-slate-400 dark:text-zinc-600 mb-4">
              <Search className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Aucune compétition trouvée
            </h3>
            <p className="text-slate-600 dark:text-zinc-400">
              Essayez de modifier vos critères de recherche
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
