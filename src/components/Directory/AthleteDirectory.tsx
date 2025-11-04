import { useState } from 'react';
import { Search, MapPin, Filter, GraduationCap, Target, Building2 } from 'lucide-react';

type TabType = 'sportifs' | 'experts';
type SportFilterType = 'top' | 'football' | 'basketball' | 'tennis';
type StatusType = 'En Blessure' | 'En activité' | 'En reconversion' | 'En Réflexion';

interface MockAthlete {
  id: string;
  name: string;
  sport: string;
  status: StatusType;
  location: string;
  club: string;
  currently: string;
  seeking: string;
  image: string;
  avatar: string;
}

const mockAthletes: MockAthlete[] = [
  {
    id: '1',
    name: 'Alexandre Martin',
    sport: 'Athlétisme',
    status: 'En Blessure',
    location: 'Lyon',
    club: 'Lyon Athlétisme',
    currently: 'En rééducation',
    seeking: 'Formation à distance',
    image: 'https://images.pexels.com/photos/2526878/pexels-photo-2526878.jpeg?auto=compress&cs=tinysrgb&w=800',
    avatar: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=200'
  },
  {
    id: '2',
    name: 'Antoine Dupont',
    sport: 'Rugby',
    status: 'En activité',
    location: 'Toulouse',
    club: 'Stade Toulousain',
    currently: 'Formation Management',
    seeking: 'Stage en gestion sportive',
    image: 'https://images.pexels.com/photos/3628912/pexels-photo-3628912.jpeg?auto=compress&cs=tinysrgb&w=800',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=200'
  },
  {
    id: '3',
    name: 'Emma Petit',
    sport: 'Judo',
    status: 'En activité',
    location: 'Bordeaux',
    club: 'Dojo Bordelais',
    currently: 'Formation continue',
    seeking: 'Mentorat sportif',
    image: 'https://images.pexels.com/photos/7045702/pexels-photo-7045702.jpeg?auto=compress&cs=tinysrgb&w=800',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200'
  },
  {
    id: '4',
    name: 'Julie Dubois',
    sport: 'Gymnastique',
    status: 'En reconversion',
    location: 'Paris',
    club: 'Paris Gym Club',
    currently: 'Master en Marketing',
    seeking: 'Poste en communication',
    image: 'https://images.pexels.com/photos/3775593/pexels-photo-3775593.jpeg?auto=compress&cs=tinysrgb&w=800',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200'
  },
  {
    id: '5',
    name: 'Lucas Martin',
    sport: 'Basketball',
    status: 'En Blessure',
    location: 'Marseille',
    club: 'OM Basket',
    currently: 'Récupération',
    seeking: 'Coaching sportif',
    image: 'https://images.pexels.com/photos/1080882/pexels-photo-1080882.jpeg?auto=compress&cs=tinysrgb&w=800',
    avatar: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=200'
  },
  {
    id: '6',
    name: 'Lucas Roux',
    sport: 'Handball',
    status: 'En Réflexion',
    location: 'Montpellier',
    club: 'Montpellier HB',
    currently: 'Bilan de compétences',
    seeking: 'Opportunités variées',
    image: 'https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg?auto=compress&cs=tinysrgb&w=800',
    avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=200'
  }
];

const statusConfig: Record<StatusType, { color: string; dotColor: string }> = {
  'En activité': { color: 'text-green-600 dark:text-green-500', dotColor: 'bg-green-500' },
  'En reconversion': { color: 'text-blue-600 dark:text-blue-500', dotColor: 'bg-blue-500' },
  'En Blessure': { color: 'text-red-600 dark:text-red-500', dotColor: 'bg-red-500' },
  'En Réflexion': { color: 'text-yellow-600 dark:text-yellow-500', dotColor: 'bg-yellow-500' }
};

export default function AthleteDirectory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('sportifs');
  const [sportFilter, setSportFilter] = useState<SportFilterType>('top');
  const [showFilters, setShowFilters] = useState(false);

  const filteredAthletes = mockAthletes.filter((athlete) => {
    const matchesSearch =
      !searchTerm ||
      athlete.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      athlete.sport.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black">
      <div className="max-w-[1400px] mx-auto px-6 py-8">

        <div className="flex items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4 flex-1">
            <div className="inline-flex items-center gap-0 bg-slate-100 dark:bg-zinc-800 rounded-full p-1.5 shadow-sm">
          <button
            onClick={() => setSportFilter('top')}
            className={`px-8 py-3 rounded-2xl font-semibold text-base transition-all ${
              sportFilter === 'top'
                ? 'bg-white dark:bg-black text-slate-900 dark:text-white shadow-md'
                : 'bg-transparent text-slate-500 dark:text-zinc-400 hover:text-slate-700 dark:hover:text-zinc-300'
            }`}
          >
            Sportif
          </button>
          <button
            onClick={() => setSportFilter('football')}
            className={`px-8 py-3 rounded-2xl font-semibold text-base transition-all ${
              sportFilter === 'football'
                ? 'bg-white dark:bg-black text-slate-900 dark:text-white shadow-md'
                : 'bg-transparent text-slate-500 dark:text-zinc-400 hover:text-slate-700 dark:hover:text-zinc-300'
            }`}
          >
            Football
          </button>
            </div>

            <div className="relative flex-1 max-w-2xl">
              <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-zinc-500" size={24} />
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-16 pr-6 py-4 rounded-full bg-white dark:bg-zinc-900 border-2 border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 text-lg focus:outline-none focus:border-slate-300 dark:focus:border-zinc-700 transition-all"
              />
            </div>
          </div>

          <button className="inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-slate-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 text-slate-900 dark:text-white font-semibold text-base hover:border-slate-400 dark:hover:border-zinc-500 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 7h10v10"></path>
              <path d="M7 17 17 7"></path>
            </svg>
            Tout
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredAthletes.map((athlete) => {
            const statusStyle = statusConfig[athlete.status];

            return (
              <div
                key={athlete.id}
                className="bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden hover:shadow-2xl transition-all cursor-pointer"
              >
                <div className="relative h-40 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-10"></div>
                  <img
                    src={athlete.image}
                    alt={athlete.name}
                    className="w-full h-full object-cover"
                  />

                  <div className="absolute bottom-3 left-3 flex items-center gap-2 z-20">
                    <div className="w-12 h-12 rounded-full border-3 border-white overflow-hidden bg-white shadow-lg">
                      <img
                        src={athlete.avatar}
                        alt={athlete.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-white drop-shadow-lg">
                        {athlete.name}
                      </h3>
                      <p className="text-sm text-white/95 font-medium drop-shadow-md">
                        {athlete.sport}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${statusStyle.dotColor}`}></div>
                    <span className={`text-sm font-semibold ${statusStyle.color}`}>
                      {athlete.status}
                    </span>
                  </div>

                  <div className="flex items-start gap-2 text-slate-700 dark:text-zinc-300">
                    <MapPin className="h-4 w-4 text-purple-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{athlete.location}</span>
                  </div>

                  <div className="flex items-start gap-2 text-slate-700 dark:text-zinc-300">
                    <Building2 className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Club : {athlete.club}</span>
                  </div>

                  <div className="flex items-start gap-2 text-slate-700 dark:text-zinc-300">
                    <GraduationCap className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Actuellement : {athlete.currently}</span>
                  </div>

                  <div className="flex items-start gap-2 text-slate-700 dark:text-zinc-300">
                    <Target className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Recherche : {athlete.seeking}</span>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
