import { useState, useEffect } from 'react';
import { FileText, Clock, CheckCircle, XCircle, Eye, Handshake } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface SponsoringOffer {
  id: string;
  company_name: string;
  company_logo: string;
  title: string;
  description: string;
  location: string;
  budget_range: string;
  duration: string;
  sport_category: string;
}

interface SponsoringRequest {
  id: string;
  offer_id: string;
  athlete_id: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  presentation_letter: string;
  applied_at: string;
  reviewed_at?: string;
  offer: SponsoringOffer;
}

export function MySponsoringRequests() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<SponsoringRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedRequestId, setExpandedRequestId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadRequests();
    }
  }, [user]);

  const loadRequests = async () => {
    if (!user) return;
    try {
      setLoading(true);

      const mockRequests: SponsoringRequest[] = [
        {
          id: '1',
          offer_id: '1',
          athlete_id: user.id,
          status: 'pending',
          presentation_letter: 'Je suis un athlète passionné avec 5 ans d\'expérience en course à pied...',
          applied_at: new Date('2025-10-28').toISOString(),
          offer: {
            id: '1',
            company_name: 'Nike France',
            company_logo: 'https://images.pexels.com/photos/2526878/pexels-photo-2526878.jpeg',
            title: 'Partenariat Athlète Running',
            description: 'Nike recherche des athlètes passionnés de course à pied pour représenter la marque lors d\'événements sportifs.',
            location: 'Paris, France',
            budget_range: '15000 - 30000€',
            duration: '12 mois',
            sport_category: 'Athlétisme',
          }
        }
      ];

      setRequests(mockRequests);
    } catch (error) {
      console.error('Error loading requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const statusConfig = {
    pending: {
      icon: Clock,
      label: 'En attente',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      borderColor: 'border-yellow-200',
    },
    reviewed: {
      icon: Eye,
      label: 'Examinée',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      borderColor: 'border-blue-200',
    },
    accepted: {
      icon: CheckCircle,
      label: 'Acceptée',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      borderColor: 'border-green-200',
    },
    rejected: {
      icon: XCircle,
      label: 'Refusée',
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      borderColor: 'border-red-200',
    },
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="bg-white sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mes Demandes de Sponsoring</h1>
          <p className="text-gray-600">Suivez l'état de vos demandes de sponsoring</p>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-x-auto">
          <div className="min-w-max h-full p-6">
            <div className="flex gap-4 h-full">
              <KanbanColumn
                title="En attente"
                count={requests.filter(r => r.status === 'pending').length}
                requests={requests.filter(r => r.status === 'pending')}
                config={statusConfig.pending}
                expandedRequestId={expandedRequestId}
                onRequestClick={(id) => setExpandedRequestId(expandedRequestId === id ? null : id)}
              />
              <KanbanColumn
                title="Examinées"
                count={requests.filter(r => r.status === 'reviewed').length}
                requests={requests.filter(r => r.status === 'reviewed')}
                config={statusConfig.reviewed}
                expandedRequestId={expandedRequestId}
                onRequestClick={(id) => setExpandedRequestId(expandedRequestId === id ? null : id)}
              />
              <KanbanColumn
                title="Acceptées"
                count={requests.filter(r => r.status === 'accepted').length}
                requests={requests.filter(r => r.status === 'accepted')}
                config={statusConfig.accepted}
                expandedRequestId={expandedRequestId}
                onRequestClick={(id) => setExpandedRequestId(expandedRequestId === id ? null : id)}
              />
              <KanbanColumn
                title="Refusées"
                count={requests.filter(r => r.status === 'rejected').length}
                requests={requests.filter(r => r.status === 'rejected')}
                config={statusConfig.rejected}
                expandedRequestId={expandedRequestId}
                onRequestClick={(id) => setExpandedRequestId(expandedRequestId === id ? null : id)}
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
  requests: SponsoringRequest[];
  config: {
    icon: any;
    label: string;
    color: string;
    bgColor: string;
    borderColor: string;
  };
  expandedRequestId: string | null;
  onRequestClick: (id: string) => void;
}

function KanbanColumn({ title, count, requests, config, expandedRequestId, onRequestClick }: KanbanColumnProps) {
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
        {title === 'En attente' && (
          <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all cursor-pointer overflow-hidden">
            <div className="p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                  <img src="https://images.pexels.com/photos/2526878/pexels-photo-2526878.jpeg" alt="Nike France" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-gray-900 mb-2">
                    Partenariat Athlète Running
                  </h3>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-7 h-7 rounded-full flex-shrink-0 overflow-hidden">
                      <img src="https://images.pexels.com/photos/2526878/pexels-photo-2526878.jpeg" alt="Nike France" className="w-full h-full object-cover" />
                    </div>
                    <p className="text-xs text-gray-500">
                      Nike France
                    </p>
                  </div>
                  <p className="text-xs text-gray-400 mb-2">
                    Paris, France
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="px-2 py-0.5 bg-purple-50 text-purple-700 rounded text-[10px] font-medium">
                      Athlétisme
                    </span>
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-[10px] font-medium">
                      12 mois
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-gray-500 text-xs mb-6 line-clamp-3 leading-relaxed">
                Nike recherche des athlètes passionnés de course à pied pour représenter la marque lors d'événements sportifs.
              </p>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    15000 - 30000€
                  </p>
                  <p className="text-[10px] text-gray-500">/An</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="bg-yellow-100 rounded-full px-3 py-1.5 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-yellow-600" />
                    <span className="text-xs font-medium text-yellow-600">En attente</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {requests.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className={`w-16 h-16 rounded-full ${config.bgColor} flex items-center justify-center mb-3`}>
              <StatusIcon className={`h-8 w-8 ${config.color}`} />
            </div>
            <p className="text-sm font-medium text-gray-900 mb-1">Aucune demande</p>
            <p className="text-xs text-gray-500">Les demandes apparaîtront ici</p>
          </div>
        ) : (
          requests.map((request) => {
            const isExpanded = expandedRequestId === request.id;

            return (
              <div
                key={request.id}
                className={`bg-white rounded-lg border-2 ${config.borderColor} transition-all cursor-pointer group ${
                  isExpanded ? 'shadow-xl' : 'hover:shadow-lg hover:scale-[1.02]'
                }`}
              >
                <div
                  className="p-4"
                  onClick={() => onRequestClick(request.id)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-semibold text-gray-900 text-sm flex-1 pr-2 group-hover:text-blue-600 transition-colors">
                      {request.offer.title}
                    </h4>
                    <div className={`${config.bgColor} rounded-full p-1.5`}>
                      <StatusIcon className={`h-4 w-4 ${config.color}`} />
                    </div>
                  </div>

                  <div className="text-xs text-gray-600 space-y-1.5 mb-3">
                    <div className="flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="font-medium">{request.offer.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{request.offer.budget_range}</span>
                    </div>
                  </div>

                  <p className="text-xs text-gray-500 line-clamp-2 mb-3 leading-relaxed">
                    {request.offer.description}
                  </p>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {new Date(request.applied_at).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'short',
                      })}
                    </span>
                    {request.reviewed_at && (
                      <span className="text-xs text-blue-600 font-medium flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                        Mise à jour
                      </span>
                    )}
                  </div>

                  {request.status === 'accepted' && !isExpanded && (
                    <div className="mt-3 bg-green-50 border border-green-200 rounded-lg p-2.5">
                      <p className="text-green-800 text-xs font-semibold flex items-center gap-1.5">
                        <CheckCircle className="w-3.5 h-3.5" />
                        Félicitations ! Demande acceptée
                      </p>
                    </div>
                  )}
                </div>

                {isExpanded && (
                  <div className="px-4 pb-4 border-t border-gray-200 pt-4">
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-900 text-sm mb-2">Description de l'offre</h4>
                      <p className="text-xs text-gray-700 whitespace-pre-line leading-relaxed">{request.offer.description}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
                      <div>
                        <h5 className="font-semibold text-gray-900 mb-1">Budget</h5>
                        <p className="text-gray-700">{request.offer.budget_range}</p>
                      </div>
                      <div>
                        <h5 className="font-semibold text-gray-900 mb-1">Durée</h5>
                        <p className="text-gray-700">{request.offer.duration}</p>
                      </div>
                      <div>
                        <h5 className="font-semibold text-gray-900 mb-1">Catégorie</h5>
                        <p className="text-gray-700">{request.offer.sport_category}</p>
                      </div>
                      <div>
                        <h5 className="font-semibold text-gray-900 mb-1">Entreprise</h5>
                        <p className="text-gray-700">{request.offer.company_name}</p>
                      </div>
                    </div>

                    <div className="mb-4 bg-gray-50 rounded-lg p-3">
                      <h4 className="font-semibold text-gray-900 text-sm mb-2">Votre lettre de présentation</h4>
                      <p className="text-xs text-gray-700 whitespace-pre-line leading-relaxed">{request.presentation_letter}</p>
                    </div>

                    <div className="text-[10px] text-gray-600">
                      <p>Demande envoyée le {new Date(request.applied_at).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}</p>
                      {request.reviewed_at && (
                        <p className="mt-1">
                          Dernière mise à jour le {new Date(request.reviewed_at).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      )}
                    </div>

                    {request.status === 'accepted' && (
                      <div className="mt-3 bg-green-50 border border-green-200 rounded-lg p-2.5">
                        <p className="text-green-800 text-xs font-semibold flex items-center gap-1.5">
                          <CheckCircle className="w-3.5 h-3.5" />
                          Félicitations ! Demande acceptée
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
