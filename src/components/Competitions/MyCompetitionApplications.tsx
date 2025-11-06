import React, { useState } from 'react';
import { Trophy, Calendar, MapPin, Clock, CheckCircle2, XCircle, AlertCircle, Eye, FileText } from 'lucide-react';

type ApplicationStatus = 'pending' | 'accepted' | 'rejected' | 'under_review';

interface CompetitionApplication {
  id: string;
  competitionTitle: string;
  sport: string;
  location: string;
  eventDate: string;
  applicationDate: string;
  status: ApplicationStatus;
  category: string;
  registrationNumber?: string;
  documentsSent: boolean;
  paymentStatus: 'paid' | 'pending' | 'not_required';
  prizePool: string;
  image: string;
  nextAction?: string;
  deadline?: string;
  description?: string;
}

const mockApplications: CompetitionApplication[] = [
  {
    id: '1',
    competitionTitle: 'Marathon de Paris 2028',
    sport: 'Athlétisme',
    location: 'Paris, France',
    eventDate: '2028-04-15',
    applicationDate: '2025-11-01',
    status: 'accepted',
    category: 'Marathon Elite',
    registrationNumber: 'MP2028-45678',
    documentsSent: true,
    paymentStatus: 'paid',
    prizePool: '500 000 €',
    image: 'https://images.pexels.com/photos/2402777/pexels-photo-2402777.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Course emblématique de 42,195 km à travers les plus beaux monuments de Paris.',
  },
  {
    id: '2',
    competitionTitle: 'Tournoi Tennis Roland-Garros Junior',
    sport: 'Tennis',
    location: 'Paris, France',
    eventDate: '2028-05-22',
    applicationDate: '2025-11-03',
    status: 'under_review',
    category: 'Junior -18 ans',
    documentsSent: true,
    paymentStatus: 'pending',
    prizePool: '50 000 €',
    image: 'https://images.pexels.com/photos/1619999/pexels-photo-1619999.jpeg?auto=compress&cs=tinysrgb&w=800',
    nextAction: 'Paiement des frais d\'inscription requis',
    deadline: '2025-11-15',
    description: 'Tournoi junior prestigieux sur terre battue, qualificatif pour les circuits professionnels.',
  },
  {
    id: '3',
    competitionTitle: 'Championnat de France de Natation',
    sport: 'Natation',
    location: 'Marseille, France',
    eventDate: '2028-06-10',
    applicationDate: '2025-11-04',
    status: 'pending',
    category: '100m Nage Libre',
    documentsSent: false,
    paymentStatus: 'not_required',
    prizePool: '100 000 €',
    image: 'https://images.pexels.com/photos/863988/pexels-photo-863988.jpeg?auto=compress&cs=tinysrgb&w=800',
    nextAction: 'Envoyer certificat médical',
    deadline: '2025-11-10',
    description: 'Compétition nationale de natation réunissant les meilleurs nageurs français.',
  },
  {
    id: '4',
    competitionTitle: 'Open de Basketball 3x3',
    sport: 'Basketball',
    location: 'Lyon, France',
    eventDate: '2028-08-15',
    applicationDate: '2025-10-28',
    status: 'rejected',
    category: 'Amateur',
    documentsSent: true,
    paymentStatus: 'not_required',
    prizePool: '25 000 €',
    image: 'https://images.pexels.com/photos/1080882/pexels-photo-1080882.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Tournoi de basketball 3x3 urbain dans le cadre des Jeux Urbains.',
  },
  {
    id: '5',
    competitionTitle: 'Triathlon International Nice',
    sport: 'Triathlon',
    location: 'Nice, France',
    eventDate: '2028-09-10',
    applicationDate: '2025-11-02',
    status: 'pending',
    category: 'Distance Olympique',
    documentsSent: true,
    paymentStatus: 'not_required',
    prizePool: '75 000 €',
    image: 'https://images.pexels.com/photos/221210/pexels-photo-221210.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Triathlon sur distance olympique avec vue sur la Baie des Anges.',
  },
  {
    id: '6',
    competitionTitle: 'Coupe de France Cyclisme',
    sport: 'Cyclisme',
    location: 'Bordeaux, France',
    eventDate: '2028-07-20',
    applicationDate: '2025-11-05',
    status: 'accepted',
    category: 'Elite Hommes',
    registrationNumber: 'CFC2028-89012',
    documentsSent: true,
    paymentStatus: 'paid',
    prizePool: '200 000 €',
    image: 'https://images.pexels.com/photos/169994/pexels-photo-169994.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Course cycliste élite à travers les vignobles bordelais.',
  },
];

export function MyCompetitionApplications() {
  const [expandedApplicationId, setExpandedApplicationId] = useState<string | null>(null);

  const statusConfig = {
    pending: {
      icon: Clock,
      label: 'En attente',
      color: 'text-amber-600',
      bgColor: 'bg-amber-100',
      borderColor: 'border-amber-200',
    },
    under_review: {
      icon: AlertCircle,
      label: 'En examen',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      borderColor: 'border-blue-200',
    },
    accepted: {
      icon: CheckCircle2,
      label: 'Acceptée',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100',
      borderColor: 'border-emerald-200',
    },
    rejected: {
      icon: XCircle,
      label: 'Refusée',
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      borderColor: 'border-red-200',
    },
  };

  const stats = {
    total: mockApplications.length,
    pending: mockApplications.filter(a => a.status === 'pending').length,
    under_review: mockApplications.filter(a => a.status === 'under_review').length,
    accepted: mockApplications.filter(a => a.status === 'accepted').length,
    rejected: mockApplications.filter(a => a.status === 'rejected').length,
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-zinc-950 dark:via-black dark:to-zinc-950">
      <div className="bg-white dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                <FileText className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                Mes Candidatures
              </h1>
            </div>
            <p className="text-lg text-slate-600 dark:text-zinc-400">
              Suivez l'état de vos candidatures aux compétitions
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            <div className="bg-slate-50 dark:bg-zinc-800 rounded-lg p-4 border border-slate-200 dark:border-zinc-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-600 dark:text-zinc-400 mb-1">Total</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.total}</p>
                </div>
                <div className="w-10 h-10 bg-slate-200 dark:bg-zinc-700 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-slate-600 dark:text-zinc-400" />
                </div>
              </div>
            </div>

            <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 border border-amber-200 dark:border-amber-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-amber-700 dark:text-amber-400 mb-1">En attente</p>
                  <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{stats.pending}</p>
                </div>
                <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-blue-700 dark:text-blue-400 mb-1">En examen</p>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.under_review}</p>
                </div>
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </div>

            <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-4 border border-emerald-200 dark:border-emerald-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-emerald-700 dark:text-emerald-400 mb-1">Acceptées</p>
                  <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{stats.accepted}</p>
                </div>
                <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
            </div>

            <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 border border-red-200 dark:border-red-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-red-700 dark:text-red-400 mb-1">Refusées</p>
                  <p className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.rejected}</p>
                </div>
                <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                  <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-x-auto">
          <div className="min-w-max h-full p-6">
            <div className="flex gap-4 h-full">
              <KanbanColumn
                title="En attente"
                count={mockApplications.filter(a => a.status === 'pending').length}
                applications={mockApplications.filter(a => a.status === 'pending')}
                config={statusConfig.pending}
                expandedApplicationId={expandedApplicationId}
                onApplicationClick={(id) => setExpandedApplicationId(expandedApplicationId === id ? null : id)}
              />
              <KanbanColumn
                title="En examen"
                count={mockApplications.filter(a => a.status === 'under_review').length}
                applications={mockApplications.filter(a => a.status === 'under_review')}
                config={statusConfig.under_review}
                expandedApplicationId={expandedApplicationId}
                onApplicationClick={(id) => setExpandedApplicationId(expandedApplicationId === id ? null : id)}
              />
              <KanbanColumn
                title="Acceptées"
                count={mockApplications.filter(a => a.status === 'accepted').length}
                applications={mockApplications.filter(a => a.status === 'accepted')}
                config={statusConfig.accepted}
                expandedApplicationId={expandedApplicationId}
                onApplicationClick={(id) => setExpandedApplicationId(expandedApplicationId === id ? null : id)}
              />
              <KanbanColumn
                title="Refusées"
                count={mockApplications.filter(a => a.status === 'rejected').length}
                applications={mockApplications.filter(a => a.status === 'rejected')}
                config={statusConfig.rejected}
                expandedApplicationId={expandedApplicationId}
                onApplicationClick={(id) => setExpandedApplicationId(expandedApplicationId === id ? null : id)}
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
  applications: CompetitionApplication[];
  config: {
    icon: any;
    label: string;
    color: string;
    bgColor: string;
    borderColor: string;
  };
  expandedApplicationId: string | null;
  onApplicationClick: (id: string) => void;
}

function KanbanColumn({ title, count, applications, config, expandedApplicationId, onApplicationClick }: KanbanColumnProps) {
  const StatusIcon = config.icon;

  const getPaymentStatusConfig = (status: string) => {
    switch (status) {
      case 'paid':
        return { label: 'Payé', color: 'text-emerald-600', bgColor: 'bg-emerald-50' };
      case 'pending':
        return { label: 'En attente', color: 'text-amber-600', bgColor: 'bg-amber-50' };
      case 'not_required':
        return { label: 'Non requis', color: 'text-slate-500', bgColor: 'bg-slate-50' };
    }
  };

  return (
    <div className="flex flex-col w-80 bg-slate-50 dark:bg-zinc-900 rounded-xl shadow-sm">
      <div className="p-4 border-b border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-800 rounded-t-xl">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-slate-900 dark:text-white">{title}</h3>
          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${config.bgColor} ${config.color}`}>
            {count}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {applications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className={`w-16 h-16 rounded-full ${config.bgColor} flex items-center justify-center mb-3`}>
              <StatusIcon className={`h-8 w-8 ${config.color}`} />
            </div>
            <p className="text-sm font-medium text-slate-900 dark:text-white mb-1">Aucune candidature</p>
            <p className="text-xs text-slate-500 dark:text-zinc-500">Les candidatures apparaîtront ici</p>
          </div>
        ) : (
          applications.map((application) => {
            const isExpanded = expandedApplicationId === application.id;
            const paymentConfig = getPaymentStatusConfig(application.paymentStatus);

            return (
              <div
                key={application.id}
                onClick={() => onApplicationClick(application.id)}
                className={`bg-white dark:bg-zinc-800 rounded-2xl shadow-sm hover:shadow-lg transition-all cursor-pointer overflow-hidden border-2 ${config.borderColor} dark:border-opacity-50 group`}
              >
                <div className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-20 h-20 bg-slate-100 dark:bg-zinc-700 rounded-2xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                      <img
                        src={application.image}
                        alt={application.competitionTitle}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-2 line-clamp-2">
                        {application.competitionTitle}
                      </h3>
                      <div className="flex items-center gap-2 mb-1">
                        <Trophy className="w-4 h-4 text-blue-500 flex-shrink-0" />
                        <p className="text-xs text-slate-600 dark:text-zinc-400">
                          {application.sport}
                        </p>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-zinc-500 mb-2 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {application.location}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        <span className="px-2 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded text-[10px] font-medium">
                          {application.category}
                        </span>
                        {application.documentsSent && (
                          <span className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded text-[10px] font-medium">
                            Docs OK
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {isExpanded && application.description && (
                    <p className="text-slate-600 dark:text-zinc-400 text-xs mb-4 leading-relaxed">
                      {application.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-xs text-slate-500 dark:text-zinc-500 mb-0.5">Date événement</p>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(application.eventDate).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                    <div className={`${config.bgColor} rounded-full px-3 py-1.5 flex items-center gap-1.5`}>
                      <StatusIcon className={`w-3.5 h-3.5 ${config.color}`} />
                      <span className={`text-xs font-medium ${config.color}`}>{config.label}</span>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-slate-200 dark:border-zinc-700 space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-xs text-slate-500 dark:text-zinc-500 mb-1">Paiement</p>
                          <span className={`inline-flex items-center px-2 py-1 rounded text-[10px] font-medium ${paymentConfig.bgColor} ${paymentConfig.color}`}>
                            {paymentConfig.label}
                          </span>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 dark:text-zinc-500 mb-1">Prize Pool</p>
                          <p className="text-sm font-semibold text-slate-900 dark:text-white">
                            {application.prizePool}
                          </p>
                        </div>
                      </div>

                      {application.registrationNumber && (
                        <div>
                          <p className="text-xs text-slate-500 dark:text-zinc-500 mb-1">Numéro d'inscription</p>
                          <p className="text-xs font-mono font-medium text-slate-900 dark:text-white bg-slate-100 dark:bg-zinc-700 px-2 py-1 rounded inline-block">
                            {application.registrationNumber}
                          </p>
                        </div>
                      )}

                      {application.nextAction && (
                        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
                          <div className="flex items-start gap-2">
                            <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                              <p className="font-semibold text-amber-900 dark:text-amber-300 text-xs mb-1">
                                Action requise
                              </p>
                              <p className="text-xs text-amber-800 dark:text-amber-400">
                                {application.nextAction}
                              </p>
                              {application.deadline && (
                                <p className="text-[10px] text-amber-600 dark:text-amber-500 mt-1">
                                  Échéance : {new Date(application.deadline).toLocaleDateString('fr-FR')}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-medium rounded-lg transition-all text-sm">
                        <Eye className="w-4 h-4" />
                        Voir tous les détails
                      </button>
                    </div>
                  )}

                  {!isExpanded && (
                    <div className="mt-3 text-center">
                      <button className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
                        Voir plus
                      </button>
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
