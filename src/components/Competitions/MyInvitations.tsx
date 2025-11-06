import { useState } from 'react';
import { Mail, Clock, CheckCircle, XCircle, Trophy, MapPin, Calendar, Users, Award, ChevronDown, ChevronUp } from 'lucide-react';

interface CompetitionInvitation {
  id: string;
  competition_title: string;
  sport: string;
  location: string;
  start_date: string;
  end_date: string;
  organizer: string;
  organizer_logo: string;
  status: 'pending' | 'accepted' | 'declined';
  category: string;
  participants_expected: number;
  prize_pool: string;
  image: string;
  invitation_message: string;
  invited_at: string;
  responded_at?: string;
}

const mockInvitations: CompetitionInvitation[] = [
  {
    id: '1',
    competition_title: 'Championnat International de Tennis',
    sport: 'Tennis',
    location: 'Roland-Garros, Paris',
    start_date: '2025-11-25T09:00:00',
    end_date: '2025-11-27T18:00:00',
    organizer: 'Fédération Française de Tennis',
    organizer_logo: 'https://images.pexels.com/photos/209977/pexels-photo-209977.jpeg',
    status: 'pending',
    category: 'Simple Messieurs - Elite',
    participants_expected: 64,
    prize_pool: '250 000 €',
    image: 'https://images.pexels.com/photos/1619999/pexels-photo-1619999.jpeg?auto=compress&cs=tinysrgb&w=800',
    invitation_message: 'Nous avons le plaisir de vous inviter à participer au Championnat International. Votre profil correspond parfaitement aux critères de sélection.',
    invited_at: '2025-11-01T10:00:00',
  },
  {
    id: '2',
    competition_title: 'Marathon de Lyon 2025',
    sport: 'Athlétisme',
    location: 'Lyon, France',
    start_date: '2025-12-10T08:00:00',
    end_date: '2025-12-10T14:00:00',
    organizer: 'Lyon Métropole Athlétisme',
    organizer_logo: 'https://images.pexels.com/photos/2402777/pexels-photo-2402777.jpeg',
    status: 'pending',
    category: 'Marathon Elite',
    participants_expected: 3000,
    prize_pool: '100 000 €',
    image: 'https://images.pexels.com/photos/2402810/pexels-photo-2402810.jpeg?auto=compress&cs=tinysrgb&w=800',
    invitation_message: 'Suite à vos excellentes performances, nous vous invitons à participer à notre marathon élite avec les meilleurs coureurs européens.',
    invited_at: '2025-11-02T14:30:00',
  },
  {
    id: '3',
    competition_title: 'Open de France Cyclisme',
    sport: 'Cyclisme',
    location: 'Bordeaux, France',
    start_date: '2025-11-18T09:00:00',
    end_date: '2025-11-18T17:00:00',
    organizer: 'Fédération Française de Cyclisme',
    organizer_logo: 'https://images.pexels.com/photos/169994/pexels-photo-169994.jpeg',
    status: 'accepted',
    category: 'Course sur route - Pro',
    participants_expected: 150,
    prize_pool: '180 000 €',
    image: '/src/assets/images/cycling-road-unsplash.jpg',
    invitation_message: 'Votre participation serait un honneur pour notre événement. Nous avons préparé un parcours exceptionnel.',
    invited_at: '2025-10-28T09:15:00',
    responded_at: '2025-10-29T11:00:00',
  },
  {
    id: '4',
    competition_title: 'Championnat National de Natation',
    sport: 'Natation',
    location: 'Marseille, France',
    start_date: '2025-12-05T08:00:00',
    end_date: '2025-12-07T19:00:00',
    organizer: 'Fédération Française de Natation',
    organizer_logo: 'https://images.pexels.com/photos/863988/pexels-photo-863988.jpeg',
    status: 'declined',
    category: '100m Nage Libre',
    participants_expected: 200,
    prize_pool: '120 000 €',
    image: 'https://images.pexels.com/photos/863988/pexels-photo-863988.jpeg?auto=compress&cs=tinysrgb&w=800',
    invitation_message: 'Nous serions ravis de vous compter parmi les nageurs d\'élite de cette compétition prestigieuse.',
    invited_at: '2025-10-25T16:00:00',
    responded_at: '2025-10-26T10:30:00',
  },
];

export function MyInvitations() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const statusConfig = {
    pending: {
      icon: Clock,
      label: 'En attente',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      borderColor: 'border-yellow-200',
    },
    accepted: {
      icon: CheckCircle,
      label: 'Acceptée',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      borderColor: 'border-green-200',
    },
    declined: {
      icon: XCircle,
      label: 'Refusée',
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      borderColor: 'border-red-200',
    },
  };

  const handleAccept = (invitationId: string) => {
    console.log('Accepting invitation:', invitationId);
  };

  const handleDecline = (invitationId: string) => {
    console.log('Declining invitation:', invitationId);
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="bg-white sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mes Invitations</h1>
          <p className="text-gray-600">Gérez vos invitations aux compétitions</p>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-x-auto">
          <div className="min-w-max h-full p-6">
            <div className="flex gap-4 h-full">
              <KanbanColumn
                title="En attente"
                count={mockInvitations.filter(i => i.status === 'pending').length}
                invitations={mockInvitations.filter(i => i.status === 'pending')}
                config={statusConfig.pending}
                expandedId={expandedId}
                onInvitationClick={(id) => setExpandedId(expandedId === id ? null : id)}
                onAccept={handleAccept}
                onDecline={handleDecline}
              />
              <KanbanColumn
                title="Acceptées"
                count={mockInvitations.filter(i => i.status === 'accepted').length}
                invitations={mockInvitations.filter(i => i.status === 'accepted')}
                config={statusConfig.accepted}
                expandedId={expandedId}
                onInvitationClick={(id) => setExpandedId(expandedId === id ? null : id)}
                onAccept={handleAccept}
                onDecline={handleDecline}
              />
              <KanbanColumn
                title="Refusées"
                count={mockInvitations.filter(i => i.status === 'declined').length}
                invitations={mockInvitations.filter(i => i.status === 'declined')}
                config={statusConfig.declined}
                expandedId={expandedId}
                onInvitationClick={(id) => setExpandedId(expandedId === id ? null : id)}
                onAccept={handleAccept}
                onDecline={handleDecline}
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
  invitations: CompetitionInvitation[];
  config: {
    icon: any;
    label: string;
    color: string;
    bgColor: string;
    borderColor: string;
  };
  expandedId: string | null;
  onInvitationClick: (id: string) => void;
  onAccept: (id: string) => void;
  onDecline: (id: string) => void;
}

function KanbanColumn({ title, count, invitations, config, expandedId, onInvitationClick, onAccept, onDecline }: KanbanColumnProps) {
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
        {invitations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className={`w-16 h-16 rounded-full ${config.bgColor} flex items-center justify-center mb-3`}>
              <StatusIcon className={`h-8 w-8 ${config.color}`} />
            </div>
            <p className="text-sm font-medium text-gray-900 mb-1">Aucune invitation</p>
            <p className="text-xs text-gray-500">Les invitations apparaîtront ici</p>
          </div>
        ) : (
          invitations.map((invitation) => {
            const isExpanded = expandedId === invitation.id;

            return (
              <div
                key={invitation.id}
                className={`bg-white rounded-2xl shadow-sm transition-all overflow-hidden ${
                  isExpanded ? 'shadow-xl' : 'hover:shadow-lg'
                }`}
              >
                <div className="relative">
                  <div className="h-32 overflow-hidden">
                    <img
                      src={invitation.image}
                      alt={invitation.competition_title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className={`absolute top-2 right-2 ${config.bgColor} rounded-full px-3 py-1.5 flex items-center gap-1.5`}>
                    <StatusIcon className={`w-3.5 h-3.5 ${config.color}`} />
                    <span className={`text-xs font-medium ${config.color}`}>{config.label}</span>
                  </div>
                  <div className="absolute top-2 left-2 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-blue-600" />
                    <span className="text-xs font-medium text-gray-900">Invitation</span>
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                      <img
                        src={invitation.organizer_logo}
                        alt={invitation.organizer}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-semibold text-gray-900 mb-1 line-clamp-2">
                        {invitation.competition_title}
                      </h3>
                      <p className="text-xs text-gray-500">
                        Par {invitation.organizer}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 mb-3 text-xs text-gray-600">
                    <div className="flex items-center gap-1.5">
                      <Trophy className="w-3.5 h-3.5 text-gray-400" />
                      <span className="font-medium">{invitation.sport} • {invitation.category}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-gray-400" />
                      <span>{invitation.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-gray-400" />
                      <span>
                        {new Date(invitation.start_date).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-gray-400" />
                      <span>{invitation.participants_expected} participants</span>
                    </div>
                  </div>

                  {!isExpanded && (
                    <div className="mb-3 bg-blue-50 border border-blue-200 rounded-lg p-2.5">
                      <p className="text-blue-700 text-xs line-clamp-2">
                        {invitation.invitation_message}
                      </p>
                    </div>
                  )}

                  {invitation.status === 'pending' && !isExpanded && (
                    <div className="flex gap-2 mb-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onAccept(invitation.id);
                        }}
                        className="flex-1 px-3 py-2 text-xs font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Accepter
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDecline(invitation.id);
                        }}
                        className="flex-1 px-3 py-2 text-xs font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        Refuser
                      </button>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="text-xs">
                      <p className="text-gray-500 mb-0.5">Invité le</p>
                      <p className="font-medium text-gray-900">
                        {new Date(invitation.invited_at).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'short',
                        })}
                      </p>
                    </div>
                    <button
                      onClick={() => onInvitationClick(invitation.id)}
                      className="text-blue-600 hover:text-blue-700"
                    >
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
                        <h4 className="font-semibold text-gray-900 text-sm mb-2">Message d'invitation</h4>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                          <p className="text-xs text-blue-900 leading-relaxed">
                            {invitation.invitation_message}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <h5 className="font-semibold text-gray-900 mb-1">Date de début</h5>
                          <p className="text-gray-700">
                            {new Date(invitation.start_date).toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                            })}
                          </p>
                        </div>
                        <div>
                          <h5 className="font-semibold text-gray-900 mb-1">Date de fin</h5>
                          <p className="text-gray-700">
                            {new Date(invitation.end_date).toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                            })}
                          </p>
                        </div>
                        <div>
                          <h5 className="font-semibold text-gray-900 mb-1">Dotation</h5>
                          <p className="text-gray-700">{invitation.prize_pool}</p>
                        </div>
                        <div>
                          <h5 className="font-semibold text-gray-900 mb-1">Participants</h5>
                          <p className="text-gray-700">{invitation.participants_expected}</p>
                        </div>
                      </div>

                      {invitation.responded_at && (
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-xs text-gray-600">
                            Répondu le {new Date(invitation.responded_at).toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                      )}

                      {invitation.status === 'pending' && (
                        <div className="flex gap-2 pt-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onAccept(invitation.id);
                            }}
                            className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Accepter l'invitation
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDecline(invitation.id);
                            }}
                            className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                          >
                            <XCircle className="w-4 h-4" />
                            Refuser
                          </button>
                        </div>
                      )}

                      {invitation.status === 'accepted' && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                          <p className="text-green-800 text-xs font-semibold flex items-center gap-1.5">
                            <CheckCircle className="w-3.5 h-3.5" />
                            Invitation acceptée - Vous participez à cette compétition
                          </p>
                        </div>
                      )}

                      {invitation.status === 'declined' && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                          <p className="text-red-800 text-xs font-semibold flex items-center gap-1.5">
                            <XCircle className="w-3.5 h-3.5" />
                            Invitation refusée
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
