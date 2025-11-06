import React, { useState } from 'react';
import { Trophy, Calendar, MapPin, Clock, CheckCircle2, XCircle, AlertCircle, FileText, Download, Eye } from 'lucide-react';

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
  },
];

export function MyCompetitionApplications() {
  const [filter, setFilter] = useState<ApplicationStatus | 'all'>('all');

  const filteredApplications = filter === 'all'
    ? mockApplications
    : mockApplications.filter(app => app.status === filter);

  const getStatusConfig = (status: ApplicationStatus) => {
    switch (status) {
      case 'accepted':
        return {
          label: 'Acceptée',
          icon: CheckCircle2,
          color: 'text-emerald-600',
          bgColor: 'bg-emerald-50',
          borderColor: 'border-emerald-200',
        };
      case 'rejected':
        return {
          label: 'Refusée',
          icon: XCircle,
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
        };
      case 'under_review':
        return {
          label: 'En cours d\'examen',
          icon: AlertCircle,
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
        };
      case 'pending':
        return {
          label: 'En attente',
          icon: Clock,
          color: 'text-amber-600',
          bgColor: 'bg-amber-50',
          borderColor: 'border-amber-200',
        };
    }
  };

  const getPaymentStatusConfig = (status: string) => {
    switch (status) {
      case 'paid':
        return { label: 'Payé', color: 'text-emerald-600' };
      case 'pending':
        return { label: 'En attente', color: 'text-amber-600' };
      case 'not_required':
        return { label: 'Non requis', color: 'text-slate-500' };
    }
  };

  const stats = {
    total: mockApplications.length,
    accepted: mockApplications.filter(a => a.status === 'accepted').length,
    pending: mockApplications.filter(a => a.status === 'pending' || a.status === 'under_review').length,
    rejected: mockApplications.filter(a => a.status === 'rejected').length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-zinc-950 dark:via-black dark:to-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 border border-slate-200 dark:border-zinc-800 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-zinc-400 mb-1">Total</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-slate-100 dark:bg-zinc-800 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-slate-600 dark:text-zinc-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 border border-emerald-200 dark:border-emerald-900 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-emerald-600 dark:text-emerald-400 mb-1">Acceptées</p>
                <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{stats.accepted}</p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 border border-amber-200 dark:border-amber-900 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-amber-600 dark:text-amber-400 mb-1">En attente</p>
                <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">{stats.pending}</p>
              </div>
              <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 border border-red-200 dark:border-red-900 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-600 dark:text-red-400 mb-1">Refusées</p>
                <p className="text-3xl font-bold text-red-600 dark:text-red-400">{stats.rejected}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'all'
                ? 'bg-blue-500 text-white'
                : 'bg-white dark:bg-zinc-900 text-slate-700 dark:text-zinc-300 border border-slate-300 dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-800'
            }`}
          >
            Toutes
          </button>
          <button
            onClick={() => setFilter('accepted')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'accepted'
                ? 'bg-emerald-500 text-white'
                : 'bg-white dark:bg-zinc-900 text-slate-700 dark:text-zinc-300 border border-slate-300 dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-800'
            }`}
          >
            Acceptées
          </button>
          <button
            onClick={() => setFilter('under_review')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'under_review'
                ? 'bg-blue-500 text-white'
                : 'bg-white dark:bg-zinc-900 text-slate-700 dark:text-zinc-300 border border-slate-300 dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-800'
            }`}
          >
            En examen
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'pending'
                ? 'bg-amber-500 text-white'
                : 'bg-white dark:bg-zinc-900 text-slate-700 dark:text-zinc-300 border border-slate-300 dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-800'
            }`}
          >
            En attente
          </button>
          <button
            onClick={() => setFilter('rejected')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'rejected'
                ? 'bg-red-500 text-white'
                : 'bg-white dark:bg-zinc-900 text-slate-700 dark:text-zinc-300 border border-slate-300 dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-800'
            }`}
          >
            Refusées
          </button>
        </div>

        {/* Applications List */}
        <div className="space-y-4">
          {filteredApplications.map((application) => {
            const statusConfig = getStatusConfig(application.status);
            const paymentConfig = getPaymentStatusConfig(application.paymentStatus);
            const StatusIcon = statusConfig.icon;

            return (
              <div
                key={application.id}
                className={`bg-white dark:bg-zinc-900 rounded-xl shadow-md overflow-hidden border-2 ${statusConfig.borderColor} dark:border-opacity-50 hover:shadow-lg transition-shadow`}
              >
                <div className="flex flex-col lg:flex-row">
                  {/* Image */}
                  <div className="lg:w-64 h-48 lg:h-auto">
                    <img
                      src={application.image}
                      alt={application.competitionTitle}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-start gap-3 mb-3">
                          <Trophy className="w-6 h-6 text-blue-500 flex-shrink-0 mt-1" />
                          <div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                              {application.competitionTitle}
                            </h3>
                            <p className="text-sm text-slate-600 dark:text-zinc-400">
                              {application.sport} • {application.category}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-zinc-400">
                            <MapPin className="w-4 h-4" />
                            {application.location}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-zinc-400">
                            <Calendar className="w-4 h-4" />
                            {new Date(application.eventDate).toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </div>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${statusConfig.bgColor} ${statusConfig.borderColor} border mt-4 lg:mt-0`}>
                        <StatusIcon className={`w-5 h-5 ${statusConfig.color}`} />
                        <span className={`font-semibold ${statusConfig.color}`}>
                          {statusConfig.label}
                        </span>
                      </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4 pb-4 border-b border-slate-200 dark:border-zinc-800">
                      <div>
                        <p className="text-xs text-slate-500 dark:text-zinc-500 mb-1">Date de candidature</p>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">
                          {new Date(application.applicationDate).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 dark:text-zinc-500 mb-1">Documents</p>
                        <p className={`text-sm font-medium ${application.documentsSent ? 'text-emerald-600' : 'text-amber-600'}`}>
                          {application.documentsSent ? '✓ Envoyés' : '⚠ Manquants'}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 dark:text-zinc-500 mb-1">Paiement</p>
                        <p className={`text-sm font-medium ${paymentConfig.color}`}>
                          {paymentConfig.label}
                        </p>
                      </div>
                    </div>

                    {/* Next Action */}
                    {application.nextAction && (
                      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-4">
                        <div className="flex items-start gap-3">
                          <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <p className="font-semibold text-amber-900 dark:text-amber-300 mb-1">
                              Action requise
                            </p>
                            <p className="text-sm text-amber-800 dark:text-amber-400">
                              {application.nextAction}
                            </p>
                            {application.deadline && (
                              <p className="text-xs text-amber-600 dark:text-amber-500 mt-1">
                                Échéance : {new Date(application.deadline).toLocaleDateString('fr-FR')}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Registration Number */}
                    {application.registrationNumber && (
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-slate-500 dark:text-zinc-500 mb-1">Numéro d'inscription</p>
                          <p className="text-sm font-mono font-medium text-slate-900 dark:text-white">
                            {application.registrationNumber}
                          </p>
                        </div>
                        <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                          <Eye className="w-4 h-4" />
                          Voir détails
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredApplications.length === 0 && (
          <div className="text-center py-16 bg-white dark:bg-zinc-900 rounded-xl shadow-md border border-slate-200 dark:border-zinc-800">
            <div className="text-slate-400 dark:text-zinc-600 mb-4">
              <FileText className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Aucune candidature trouvée
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
