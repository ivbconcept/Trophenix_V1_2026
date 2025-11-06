import { useState } from 'react';
import { Trophy, Calendar, MapPin, Medal, Users, Target, Clock, CheckCircle2, Timer, Award, ChevronDown, ChevronUp } from 'lucide-react';

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
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const getStatusConfig = (status: ParticipationStatus) => {
    switch (status) {
      case 'upcoming':
        return {
          label: 'À venir',
          color: 'text-blue-600',
          bgColor: 'bg-blue-100',
          borderColor: 'border-blue-200',
          icon: Calendar,
        };
      case 'ongoing':
        return {
          label: 'En cours',
          color: 'text-orange-600',
          bgColor: 'bg-orange-100',
          borderColor: 'border-orange-200',
          icon: Timer,
        };
      case 'completed':
        return {
          label: 'Terminée',
          color: 'text-green-600',
          bgColor: 'bg-green-100',
          borderColor: 'border-green-200',
          icon: CheckCircle2,
        };
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="bg-white sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mes Participations</h1>
          <p className="text-gray-600">Suivez vos compétitions passées, en cours et à venir</p>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-x-auto">
          <div className="min-w-max h-full p-6">
            <div className="flex gap-4 h-full">
              <KanbanColumn
                title="À venir"
                count={mockParticipations.filter(p => p.status === 'upcoming').length}
                participations={mockParticipations.filter(p => p.status === 'upcoming')}
                config={getStatusConfig('upcoming')}
                expandedId={expandedId}
                onParticipationClick={(id) => setExpandedId(expandedId === id ? null : id)}
              />
              <KanbanColumn
                title="En cours"
                count={mockParticipations.filter(p => p.status === 'ongoing').length}
                participations={mockParticipations.filter(p => p.status === 'ongoing')}
                config={getStatusConfig('ongoing')}
                expandedId={expandedId}
                onParticipationClick={(id) => setExpandedId(expandedId === id ? null : id)}
              />
              <KanbanColumn
                title="Terminées"
                count={mockParticipations.filter(p => p.status === 'completed').length}
                participations={mockParticipations.filter(p => p.status === 'completed')}
                config={getStatusConfig('completed')}
                expandedId={expandedId}
                onParticipationClick={(id) => setExpandedId(expandedId === id ? null : id)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface KanbanColumnProps {
  title: string;
  count: number;
  participations: CompetitionParticipation[];
  config: {
    icon: any;
    label: string;
    color: string;
    bgColor: string;
    borderColor: string;
  };
  expandedId: string | null;
  onParticipationClick: (id: string) => void;
}

function KanbanColumn({ title, count, participations, config, expandedId, onParticipationClick }: KanbanColumnProps) {
  const StatusIcon = config.icon;

  return (
    <div className="flex flex-col w-80 bg-gray-50 rounded-xl">
      <div className="p-4 border-b border-gray-200 bg-white rounded-t-xl">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">{title}</h3>
          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${config.bgColor} ${config.color}`}>
            {count}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {participations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className={`w-16 h-16 rounded-full ${config.bgColor} flex items-center justify-center mb-3`}>
              <StatusIcon className={`h-8 w-8 ${config.color}`} />
            </div>
            <p className="text-sm font-medium text-gray-900 mb-1">Aucune participation</p>
            <p className="text-xs text-gray-500">Les participations apparaîtront ici</p>
          </div>
        ) : (
          participations.map((participation) => {
            const isExpanded = expandedId === participation.id;

            return (
              <div
                key={participation.id}
                className={`bg-white rounded-2xl shadow-sm transition-all cursor-pointer overflow-hidden ${
                  isExpanded ? 'shadow-xl' : 'hover:shadow-lg'
                }`}
                onClick={() => onParticipationClick(participation.id)}
              >
                <div className="relative">
                  <div className="h-32 overflow-hidden">
                    <img
                      src={participation.image}
                      alt={participation.competitionTitle}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {participation.myRank && participation.myRank <= 3 && (
                    <div className="absolute top-2 right-2 w-12 h-12 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full flex items-center justify-center shadow-lg">
                      <div className="text-center">
                        <Award className="w-5 h-5 text-white mx-auto" />
                        <p className="text-[8px] font-bold text-white">#{participation.myRank}</p>
                      </div>
                    </div>
                  )}
                  <div className={`absolute bottom-2 right-2 ${config.bgColor} rounded-full px-3 py-1.5 flex items-center gap-1.5`}>
                    <StatusIcon className={`w-3.5 h-3.5 ${config.color}`} />
                    <span className={`text-xs font-medium ${config.color}`}>{config.label}</span>
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex items-start gap-2 mb-3">
                    <Trophy className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-semibold text-gray-900 mb-1 line-clamp-2">
                        {participation.competitionTitle}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {participation.sport} • {participation.category}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 mb-3 text-xs text-gray-600">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-gray-400" />
                      <span className="font-medium">{participation.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-gray-400" />
                      <span>
                        {new Date(participation.startDate).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-gray-400" />
                      <span>{participation.participants} participants</span>
                    </div>
                  </div>

                  {participation.myRank && (
                    <div className="mb-3 bg-orange-50 border border-orange-200 rounded-lg p-2.5">
                      <p className="text-orange-800 text-xs font-semibold flex items-center gap-1.5">
                        <Medal className="w-3.5 h-3.5" />
                        Classement: {participation.myRank}ème place
                      </p>
                      {participation.myScore && (
                        <p className="text-orange-700 text-xs mt-1">
                          Score: {participation.myScore}
                        </p>
                      )}
                    </div>
                  )}

                  {participation.nextEvent && !isExpanded && (
                    <div className="mb-3 bg-blue-50 border border-blue-200 rounded-lg p-2.5">
                      <p className="text-blue-800 text-xs font-semibold flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        Prochain événement
                      </p>
                      <p className="text-blue-700 text-xs mt-1 line-clamp-2">
                        {participation.nextEvent}
                      </p>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="text-xs">
                      <p className="text-gray-500 mb-0.5">N° inscription</p>
                      <p className="font-mono font-medium text-gray-900 text-[10px]">
                        {participation.registrationNumber}
                      </p>
                    </div>
                    <button className="text-blue-600 hover:text-blue-700">
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
                      <div>
                        <h4 className="font-semibold text-gray-900 text-sm mb-2">Organisateur</h4>
                        <div className="flex items-center gap-2">
                          <Target className="w-4 h-4 text-gray-400" />
                          <p className="text-xs text-gray-700">{participation.organizer}</p>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-900 text-sm mb-2">Dotation</h4>
                        <p className="text-xs text-gray-700">{participation.prizePool}</p>
                      </div>

                      {participation.schedule && (
                        <div>
                          <h4 className="font-semibold text-gray-900 text-sm mb-2">Programme</h4>
                          <div className="space-y-1.5">
                            {participation.schedule.map((item, index) => (
                              <div key={index} className="flex items-center gap-2 text-xs text-gray-600">
                                <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                                {item}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {participation.nextEvent && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                          <p className="text-blue-800 text-xs font-semibold flex items-center gap-1.5 mb-1">
                            <Clock className="w-3.5 h-3.5" />
                            Prochain événement
                          </p>
                          <p className="text-blue-700 text-xs">
                            {participation.nextEvent}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
