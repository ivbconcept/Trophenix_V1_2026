import React, { useState } from 'react';
import { Trophy, Calendar, MapPin, Medal, Users, Target, Clock, CheckCircle2, Timer, Award } from 'lucide-react';

type ParticipationStatus = 'upcoming' | 'ongoing' | 'completed';

interface CompetitionParticipation {
  id: string;
  competitionTitle: string;
  sport: string;
  location: string;
  startDate: string;
  endDate: string;
  status: ParticipationStatus;
  category: string;
  registrationNumber: string;
  participants: number;
  myRank?: number;
  myScore?: string;
  nextEvent?: string;
  prizePool: string;
  image: string;
  organizer: string;
  schedule?: string[];
}

const mockParticipations: CompetitionParticipation[] = [
  {
    id: '1',
    competitionTitle: 'Marathon de Paris 2028',
    sport: 'Athlétisme',
    location: 'Paris, France',
    startDate: '2028-04-15',
    endDate: '2028-04-15',
    status: 'upcoming',
    category: 'Marathon Elite',
    registrationNumber: 'MP2028-45678',
    participants: 5000,
    prizePool: '500 000 €',
    image: 'https://images.pexels.com/photos/2402777/pexels-photo-2402777.jpeg?auto=compress&cs=tinysrgb&w=800',
    organizer: 'ASO Paris',
    nextEvent: 'Départ : 8h00 - Champs-Élysées',
    schedule: ['07:30 - Échauffement', '08:00 - Départ', '11:30 - Arrivée prévue'],
  },
  {
    id: '2',
    competitionTitle: 'Coupe de France Cyclisme',
    sport: 'Cyclisme',
    location: 'Bordeaux, France',
    startDate: '2028-07-20',
    endDate: '2028-07-20',
    status: 'upcoming',
    category: 'Elite Hommes',
    registrationNumber: 'CFC2028-89012',
    participants: 150,
    prizePool: '200 000 €',
    image: 'https://images.pexels.com/photos/169994/pexels-photo-169994.jpeg?auto=compress&cs=tinysrgb&w=800',
    organizer: 'Fédération Française de Cyclisme',
    nextEvent: '1ère étape : Circuit des vignobles - 120km',
    schedule: ['09:00 - Départ 1ère étape', '13:00 - Arrivée 1ère étape', '15:00 - Départ 2ème étape'],
  },
  {
    id: '3',
    competitionTitle: 'Championnat Open de Tennis',
    sport: 'Tennis',
    location: 'Nice, France',
    startDate: '2025-11-08',
    endDate: '2025-11-10',
    status: 'ongoing',
    category: 'Simple Messieurs',
    registrationNumber: 'TNS2025-34567',
    participants: 64,
    myRank: 8,
    prizePool: '150 000 €',
    image: 'https://images.pexels.com/photos/1619999/pexels-photo-1619999.jpeg?auto=compress&cs=tinysrgb&w=800',
    organizer: 'Tennis Club de Nice',
    nextEvent: 'Quart de finale - Court Central - 14h00',
    schedule: ['14:00 - Quart de finale', '16:00 - Repos', '18:00 - Demi-finale (si qualifié)'],
  },
  {
    id: '4',
    competitionTitle: 'Triathlon International Nice',
    sport: 'Triathlon',
    location: 'Nice, France',
    startDate: '2025-09-10',
    endDate: '2025-09-10',
    status: 'completed',
    category: 'Distance Olympique',
    registrationNumber: 'TRI2025-78901',
    participants: 1200,
    myRank: 45,
    myScore: '2h 15min 34s',
    prizePool: '75 000 €',
    image: 'https://images.pexels.com/photos/221210/pexels-photo-221210.jpeg?auto=compress&cs=tinysrgb&w=800',
    organizer: 'Nice Triathlon',
  },
  {
    id: '5',
    competitionTitle: 'Championnat de France de Natation',
    sport: 'Natation',
    location: 'Marseille, France',
    startDate: '2025-08-12',
    endDate: '2025-08-14',
    status: 'completed',
    category: '100m Nage Libre',
    registrationNumber: 'NAT2025-56789',
    participants: 200,
    myRank: 12,
    myScore: '49.87s',
    prizePool: '100 000 €',
    image: 'https://images.pexels.com/photos/863988/pexels-photo-863988.jpeg?auto=compress&cs=tinysrgb&w=800',
    organizer: 'Fédération Française de Natation',
  },
  {
    id: '6',
    competitionTitle: 'Open de Basketball 3x3',
    sport: 'Basketball',
    location: 'Lyon, France',
    startDate: '2025-07-15',
    endDate: '2025-07-16',
    status: 'completed',
    category: 'Amateur',
    registrationNumber: 'BBL2025-23456',
    participants: 32,
    myRank: 3,
    myScore: 'Médaille de Bronze',
    prizePool: '25 000 €',
    image: 'https://images.pexels.com/photos/1080882/pexels-photo-1080882.jpeg?auto=compress&cs=tinysrgb&w=800',
    organizer: 'Lyon Basketball Association',
  },
];

export function MyParticipations() {
  const [selectedStatus, setSelectedStatus] = useState<ParticipationStatus | 'all'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredParticipations = selectedStatus === 'all'
    ? mockParticipations
    : mockParticipations.filter(p => p.status === selectedStatus);

  const getStatusConfig = (status: ParticipationStatus) => {
    switch (status) {
      case 'upcoming':
        return {
          label: 'À venir',
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          icon: Calendar,
        };
      case 'ongoing':
        return {
          label: 'En cours',
          color: 'text-orange-600',
          bgColor: 'bg-orange-50',
          borderColor: 'border-orange-200',
          icon: Timer,
        };
      case 'completed':
        return {
          label: 'Terminée',
          color: 'text-slate-600',
          bgColor: 'bg-slate-50',
          borderColor: 'border-slate-200',
          icon: CheckCircle2,
        };
    }
  };

  const stats = {
    upcoming: mockParticipations.filter(p => p.status === 'upcoming').length,
    ongoing: mockParticipations.filter(p => p.status === 'ongoing').length,
    completed: mockParticipations.filter(p => p.status === 'completed').length,
    medals: mockParticipations.filter(p => p.myRank && p.myRank <= 3).length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-zinc-950 dark:via-black dark:to-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
              <Medal className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
              Mes Participations
            </h1>
          </div>
          <p className="text-lg text-slate-600 dark:text-zinc-400">
            Toutes vos compétitions passées, en cours et à venir
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 border border-blue-200 dark:border-blue-900 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 dark:text-blue-400 mb-1">À venir</p>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.upcoming}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 border border-orange-200 dark:border-orange-900 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600 dark:text-orange-400 mb-1">En cours</p>
                <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">{stats.ongoing}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                <Timer className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 border border-slate-200 dark:border-zinc-800 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-zinc-400 mb-1">Terminées</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats.completed}</p>
              </div>
              <div className="w-12 h-12 bg-slate-100 dark:bg-zinc-800 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-slate-600 dark:text-zinc-400" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-500 to-yellow-500 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/90 mb-1">Médailles</p>
                <p className="text-3xl font-bold text-white">{stats.medals}</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedStatus('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedStatus === 'all'
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                : 'bg-white dark:bg-zinc-900 text-slate-700 dark:text-zinc-300 border border-slate-300 dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-800'
            }`}
          >
            Toutes
          </button>
          <button
            onClick={() => setSelectedStatus('upcoming')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedStatus === 'upcoming'
                ? 'bg-blue-500 text-white'
                : 'bg-white dark:bg-zinc-900 text-slate-700 dark:text-zinc-300 border border-slate-300 dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-800'
            }`}
          >
            À venir
          </button>
          <button
            onClick={() => setSelectedStatus('ongoing')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedStatus === 'ongoing'
                ? 'bg-orange-500 text-white'
                : 'bg-white dark:bg-zinc-900 text-slate-700 dark:text-zinc-300 border border-slate-300 dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-800'
            }`}
          >
            En cours
          </button>
          <button
            onClick={() => setSelectedStatus('completed')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedStatus === 'completed'
                ? 'bg-slate-700 text-white'
                : 'bg-white dark:bg-zinc-900 text-slate-700 dark:text-zinc-300 border border-slate-300 dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-800'
            }`}
          >
            Terminées
          </button>
        </div>

        <div className="space-y-4">
          {filteredParticipations.map((participation) => {
            const statusConfig = getStatusConfig(participation.status);
            const StatusIcon = statusConfig.icon;
            const isExpanded = expandedId === participation.id;

            return (
              <div
                key={participation.id}
                className={`bg-white dark:bg-zinc-900 rounded-xl shadow-md overflow-hidden border-2 ${statusConfig.borderColor} dark:border-opacity-50 hover:shadow-lg transition-all`}
              >
                <div className="flex flex-col lg:flex-row">
                  <div className="lg:w-80 h-56 lg:h-auto relative">
                    <img
                      src={participation.image}
                      alt={participation.competitionTitle}
                      className="w-full h-full object-cover"
                    />
                    {participation.myRank && participation.myRank <= 3 && (
                      <div className="absolute top-4 right-4 w-16 h-16 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full flex items-center justify-center shadow-lg">
                        <div className="text-center">
                          <Award className="w-6 h-6 text-white mx-auto mb-0.5" />
                          <p className="text-xs font-bold text-white">#{participation.myRank}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-start gap-3 mb-3">
                          <Trophy className="w-6 h-6 text-orange-500 flex-shrink-0 mt-1" />
                          <div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                              {participation.competitionTitle}
                            </h3>
                            <p className="text-sm text-slate-600 dark:text-zinc-400">
                              {participation.sport} • {participation.category}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-zinc-400">
                            <MapPin className="w-4 h-4" />
                            {participation.location}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-zinc-400">
                            <Calendar className="w-4 h-4" />
                            {new Date(participation.startDate).toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-zinc-400">
                            <Users className="w-4 h-4" />
                            {participation.participants} participants
                          </div>
                          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-zinc-400">
                            <Target className="w-4 h-4" />
                            {participation.organizer}
                          </div>
                        </div>
                      </div>

                      <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${statusConfig.bgColor} ${statusConfig.borderColor} border mt-4 lg:mt-0`}>
                        <StatusIcon className={`w-5 h-5 ${statusConfig.color}`} />
                        <span className={`font-semibold ${statusConfig.color}`}>
                          {statusConfig.label}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-4 border-b border-slate-200 dark:border-zinc-800">
                      <div>
                        <p className="text-xs text-slate-500 dark:text-zinc-500 mb-1">Numéro d'inscription</p>
                        <p className="text-sm font-mono font-medium text-slate-900 dark:text-white">
                          {participation.registrationNumber}
                        </p>
                      </div>
                      {participation.myRank && (
                        <div>
                          <p className="text-xs text-slate-500 dark:text-zinc-500 mb-1">Mon classement</p>
                          <p className="text-sm font-bold text-orange-600 dark:text-orange-400">
                            {participation.myRank}ème place
                          </p>
                        </div>
                      )}
                      {participation.myScore && (
                        <div>
                          <p className="text-xs text-slate-500 dark:text-zinc-500 mb-1">Mon temps/score</p>
                          <p className="text-sm font-semibold text-slate-900 dark:text-white">
                            {participation.myScore}
                          </p>
                        </div>
                      )}
                    </div>

                    {participation.nextEvent && (
                      <div className="mt-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <p className="font-semibold text-blue-900 dark:text-blue-300 mb-1">
                              Prochain événement
                            </p>
                            <p className="text-sm text-blue-800 dark:text-blue-400">
                              {participation.nextEvent}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {isExpanded && participation.schedule && (
                      <div className="mt-4 bg-slate-50 dark:bg-zinc-800 rounded-lg p-4">
                        <p className="font-semibold text-slate-900 dark:text-white mb-3">Programme</p>
                        <div className="space-y-2">
                          {participation.schedule.map((item, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm text-slate-600 dark:text-zinc-400">
                              <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                              {item}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <button
                      onClick={() => setExpandedId(isExpanded ? null : participation.id)}
                      className="mt-4 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                    >
                      {isExpanded ? 'Voir moins' : 'Voir plus de détails'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredParticipations.length === 0 && (
          <div className="text-center py-16 bg-white dark:bg-zinc-900 rounded-xl shadow-md border border-slate-200 dark:border-zinc-800">
            <div className="text-slate-400 dark:text-zinc-600 mb-4">
              <Medal className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Aucune participation trouvée
            </h3>
            <p className="text-slate-600 dark:text-zinc-400">
              Essayez de modifier vos filtres
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
