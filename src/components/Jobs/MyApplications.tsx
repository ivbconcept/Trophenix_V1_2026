import { useState, useEffect } from 'react';
import { FileText, Clock, CheckCircle, XCircle, Eye } from 'lucide-react';
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
  const [selectedApplication, setSelectedApplication] = useState<ApplicationWithJob | null>(null);

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
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
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
                onApplicationClick={setSelectedApplication}
              />
              <KanbanColumn
                title="Examinées"
                count={applications.filter(a => a.status === 'reviewed').length}
                applications={applications.filter(a => a.status === 'reviewed')}
                config={statusConfig.reviewed}
                onApplicationClick={setSelectedApplication}
              />
              <KanbanColumn
                title="Acceptées"
                count={applications.filter(a => a.status === 'accepted').length}
                applications={applications.filter(a => a.status === 'accepted')}
                config={statusConfig.accepted}
                onApplicationClick={setSelectedApplication}
              />
              <KanbanColumn
                title="Refusées"
                count={applications.filter(a => a.status === 'rejected').length}
                applications={applications.filter(a => a.status === 'rejected')}
                config={statusConfig.rejected}
                onApplicationClick={setSelectedApplication}
              />
            </div>
          </div>
        </div>
      </div>

      {selectedApplication && (
        <ApplicationDetailModal
          application={selectedApplication}
          onClose={() => setSelectedApplication(null)}
        />
      )}
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
  onApplicationClick: (application: ApplicationWithJob) => void;
}

function KanbanColumn({ title, count, applications, config, onApplicationClick }: KanbanColumnProps) {
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
        {applications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className={`w-16 h-16 rounded-full ${config.bgColor} flex items-center justify-center mb-3`}>
              <StatusIcon className={`h-8 w-8 ${config.color}`} />
            </div>
            <p className="text-sm font-medium text-gray-900 mb-1">Aucune candidature</p>
            <p className="text-xs text-gray-500">Les candidatures apparaîtront ici</p>
          </div>
        ) : (
          applications.map((application) => (
            <div
              key={application.id}
              className={`bg-white rounded-lg border-2 ${config.borderColor} p-4 hover:shadow-lg hover:scale-[1.02] transition-all cursor-pointer group`}
              onClick={() => onApplicationClick(application)}
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

              {application.status === 'accepted' && (
                <div className="mt-3 bg-green-50 border border-green-200 rounded-lg p-2.5">
                  <p className="text-green-800 text-xs font-semibold flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Félicitations ! Candidature acceptée
                  </p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function ApplicationDetailModal({
  application,
  onClose,
}: {
  application: ApplicationWithJob;
  onClose: () => void;
}) {
  const statusConfig = {
    pending: { icon: Clock, label: 'En attente', color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
    reviewed: { icon: Eye, label: 'Examinée', color: 'text-blue-600', bgColor: 'bg-blue-100' },
    accepted: { icon: CheckCircle, label: 'Acceptée', color: 'text-green-600', bgColor: 'bg-green-100' },
    rejected: { icon: XCircle, label: 'Refusée', color: 'text-red-600', bgColor: 'bg-red-100' },
  };

  const config = statusConfig[application.status];
  const StatusIcon = config.icon;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold text-gray-900">{application.job.title}</h2>
                <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${config.bgColor} ${config.color}`}>
                  <StatusIcon className="h-4 w-4" />
                  {config.label}
                </span>
              </div>
              <p className="text-gray-600">
                {application.job.contract_type} • {application.job.location}
              </p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">
              ×
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">Description du poste</h3>
            <p className="text-gray-700 whitespace-pre-line">{application.job.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">Type de contrat</h4>
              <p className="text-gray-700">{application.job.contract_type}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">Expérience</h4>
              <p className="text-gray-700">{application.job.experience_level}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">Secteur</h4>
              <p className="text-gray-700">{application.job.job_sector}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">Télétravail</h4>
              <p className="text-gray-700">{application.job.remote_possible ? 'Possible' : 'Non'}</p>
            </div>
          </div>

          <div className="mb-6 bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Votre lettre de motivation</h3>
            <p className="text-gray-700 whitespace-pre-line">{application.cover_letter}</p>
          </div>

          <div className="text-sm text-gray-600">
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
        </div>
      </div>
    </div>
  );
}
