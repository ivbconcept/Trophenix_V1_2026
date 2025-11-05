import { useState, useEffect } from 'react';
import { FileText, Clock, CheckCircle, XCircle, Eye, Briefcase, Bookmark } from 'lucide-react';
import { JobService } from '../../services/jobService';
import { supabase } from '../../lib/supabase';
import type { JobApplication, JobOffer } from '../../types/jobs';
import { useAuth } from '../../contexts/AuthContext';

interface ApplicationWithJob extends JobApplication {
  job: JobOffer;
}

export default function MyApplications() {
  const { user } = useAuth();
  const [applications, setApplications] = useState<ApplicationWithJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'reviewed' | 'accepted' | 'rejected'>('all');
  const [expandedApplicationId, setExpandedApplicationId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadApplications();
    }
  }, [user]);

  const loadApplications = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const data = await JobService.getAthleteApplications(user.id);

      const applicationsWithJobs: ApplicationWithJob[] = [];

      for (const app of data) {
        const job = await JobService.getJobById(app.job_offer_id);
        if (job) {
          applicationsWithJobs.push({
            ...app,
            job,
          });
        }
      }

      setApplications(applicationsWithJobs);
    } catch (error) {
      console.error('Error loading applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredApplications = applications.filter(app => {
    if (filter === 'all') return true;
    return app.status === filter;
  });

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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mes Candidatures</h1>
          <p className="text-gray-600">Suivez l'état de vos candidatures</p>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-x-auto">
          <div className="min-w-max h-full p-6">
            <div className="flex gap-4 h-full">
              <KanbanColumn
                title="En attente"
                count={applications.filter(a => a.status === 'pending').length}
                applications={applications.filter(a => a.status === 'pending')}
                config={statusConfig.pending}
                expandedApplicationId={expandedApplicationId}
                onApplicationClick={(id) => setExpandedApplicationId(expandedApplicationId === id ? null : id)}
              />
              <KanbanColumn
                title="Examinées"
                count={applications.filter(a => a.status === 'reviewed').length}
                applications={applications.filter(a => a.status === 'reviewed')}
                config={statusConfig.reviewed}
                expandedApplicationId={expandedApplicationId}
                onApplicationClick={(id) => setExpandedApplicationId(expandedApplicationId === id ? null : id)}
              />
              <KanbanColumn
                title="Acceptées"
                count={applications.filter(a => a.status === 'accepted').length}
                applications={applications.filter(a => a.status === 'accepted')}
                config={statusConfig.accepted}
                expandedApplicationId={expandedApplicationId}
                onApplicationClick={(id) => setExpandedApplicationId(expandedApplicationId === id ? null : id)}
              />
              <KanbanColumn
                title="Refusées"
                count={applications.filter(a => a.status === 'rejected').length}
                applications={applications.filter(a => a.status === 'rejected')}
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
  applications: ApplicationWithJob[];
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
                  <img src="https://images.pexels.com/photos/270085/pexels-photo-270085.jpeg" alt="Paris Saint-Germain" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-gray-900 mb-2">
                    Entraîneur de Football
                  </h3>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-7 h-7 rounded-full flex-shrink-0 overflow-hidden">
                      <img src="https://images.pexels.com/photos/270085/pexels-photo-270085.jpeg" alt="Paris Saint-Germain" className="w-full h-full object-cover" />
                    </div>
                    <p className="text-xs text-gray-500">
                      Paris Saint-Germain
                    </p>
                  </div>
                  <p className="text-xs text-gray-400 mb-2">
                    Paris, France
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-[10px] font-medium">
                      CDI
                    </span>
                    <span className="px-2 py-0.5 bg-green-50 text-green-700 rounded text-[10px] font-medium">
                      Temps plein
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-gray-500 text-xs mb-6 line-clamp-3 leading-relaxed">
                Club de football professionnel recherche un entraîneur passionné pour développer les talents de notre équipe.
              </p>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    3500 - 4500€
                  </p>
                  <p className="text-[10px] text-gray-500">/Mois</p>
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

        {applications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className={`w-16 h-16 rounded-full ${config.bgColor} flex items-center justify-center mb-3`}>
              <StatusIcon className={`h-8 w-8 ${config.color}`} />
            </div>
            <p className="text-sm font-medium text-gray-900 mb-1">Aucune candidature</p>
            <p className="text-xs text-gray-500">Les candidatures apparaîtront ici</p>
          </div>
        ) : (
          applications.map((application) => {
            const isExpanded = expandedApplicationId === application.id;

            return (
              <div
                key={application.id}
                className={`bg-white rounded-lg border-2 ${config.borderColor} transition-all cursor-pointer group ${
                  isExpanded ? 'shadow-xl' : 'hover:shadow-lg hover:scale-[1.02]'
                }`}
              >
                <div
                  className="p-4"
                  onClick={() => onApplicationClick(application.id)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-semibold text-gray-900 text-sm flex-1 pr-2 group-hover:text-blue-600 transition-colors">
                      {application.job.title}
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
                      <span className="font-medium">{application.job.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span>{application.job.contract_type}</span>
                    </div>
                  </div>

                  <p className="text-xs text-gray-500 line-clamp-2 mb-3 leading-relaxed">
                    {application.job.description}
                  </p>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {new Date(application.applied_at).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'short',
                      })}
                    </span>
                    {application.reviewed_at && (
                      <span className="text-xs text-blue-600 font-medium flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                        Mise à jour
                      </span>
                    )}
                  </div>

                  {application.status === 'accepted' && !isExpanded && (
                    <div className="mt-3 bg-green-50 border border-green-200 rounded-lg p-2.5">
                      <p className="text-green-800 text-xs font-semibold flex items-center gap-1.5">
                        <CheckCircle className="w-3.5 h-3.5" />
                        Félicitations ! Candidature acceptée
                      </p>
                    </div>
                  )}
                </div>

                {isExpanded && (
                  <div className="px-4 pb-4 border-t border-gray-200 pt-4">
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-900 text-sm mb-2">Description du poste</h4>
                      <p className="text-xs text-gray-700 whitespace-pre-line leading-relaxed">{application.job.description}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
                      <div>
                        <h5 className="font-semibold text-gray-900 mb-1">Type de contrat</h5>
                        <p className="text-gray-700">{application.job.contract_type}</p>
                      </div>
                      <div>
                        <h5 className="font-semibold text-gray-900 mb-1">Expérience</h5>
                        <p className="text-gray-700">{application.job.experience_level}</p>
                      </div>
                      <div>
                        <h5 className="font-semibold text-gray-900 mb-1">Secteur</h5>
                        <p className="text-gray-700">{application.job.job_sector}</p>
                      </div>
                      <div>
                        <h5 className="font-semibold text-gray-900 mb-1">Télétravail</h5>
                        <p className="text-gray-700">{application.job.remote_possible ? 'Possible' : 'Non'}</p>
                      </div>
                    </div>

                    <div className="mb-4 bg-gray-50 rounded-lg p-3">
                      <h4 className="font-semibold text-gray-900 text-sm mb-2">Votre lettre de motivation</h4>
                      <p className="text-xs text-gray-700 whitespace-pre-line leading-relaxed">{application.cover_letter}</p>
                    </div>

                    <div className="text-[10px] text-gray-600">
                      <p>Candidature envoyée le {new Date(application.applied_at).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}</p>
                      {application.reviewed_at && (
                        <p className="mt-1">
                          Dernière mise à jour le {new Date(application.reviewed_at).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      )}
                    </div>

                    {application.status === 'accepted' && (
                      <div className="mt-3 bg-green-50 border border-green-200 rounded-lg p-2.5">
                        <p className="text-green-800 text-xs font-semibold flex items-center gap-1.5">
                          <CheckCircle className="w-3.5 h-3.5" />
                          Félicitations ! Candidature acceptée
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

