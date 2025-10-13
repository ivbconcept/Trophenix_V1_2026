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
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Mes Candidatures</h1>
        <p className="text-gray-600">Suivez l'état de vos candidatures</p>
      </div>

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg font-medium ${
            filter === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Toutes ({applications.length})
        </button>
        <button
          onClick={() => setFilter('pending')}
          className={`px-4 py-2 rounded-lg font-medium ${
            filter === 'pending'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          En attente ({applications.filter(a => a.status === 'pending').length})
        </button>
        <button
          onClick={() => setFilter('reviewed')}
          className={`px-4 py-2 rounded-lg font-medium ${
            filter === 'reviewed'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Examinées ({applications.filter(a => a.status === 'reviewed').length})
        </button>
        <button
          onClick={() => setFilter('accepted')}
          className={`px-4 py-2 rounded-lg font-medium ${
            filter === 'accepted'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Acceptées ({applications.filter(a => a.status === 'accepted').length})
        </button>
        <button
          onClick={() => setFilter('rejected')}
          className={`px-4 py-2 rounded-lg font-medium ${
            filter === 'rejected'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Refusées ({applications.filter(a => a.status === 'rejected').length})
        </button>
      </div>

      {filteredApplications.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {filter === 'all' ? 'Aucune candidature' : `Aucune candidature ${statusConfig[filter].label.toLowerCase()}`}
          </h3>
          <p className="text-gray-600">
            {filter === 'all'
              ? 'Vous n\'avez pas encore postulé à d\'offres'
              : 'Aucune candidature dans cette catégorie'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredApplications.map((application) => {
            const config = statusConfig[application.status];
            const StatusIcon = config.icon;

            return (
              <div
                key={application.id}
                className={`bg-white rounded-lg border-2 ${config.borderColor} p-6 hover:shadow-md transition-shadow cursor-pointer`}
                onClick={() => setSelectedApplication(application)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {application.job.title}
                      </h3>
                      <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${config.bgColor} ${config.color}`}>
                        <StatusIcon className="h-3.5 w-3.5" />
                        {config.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      <span>{application.job.contract_type}</span>
                      <span>•</span>
                      <span>{application.job.location}</span>
                      <span>•</span>
                      <span>{application.job.experience_level}</span>
                    </div>
                    <p className="text-gray-600 line-clamp-2 mb-3">
                      {application.job.description}
                    </p>
                    <div className="text-sm text-gray-500">
                      Postulé le {new Date(application.applied_at).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                      {application.reviewed_at && (
                        <span className="ml-3">
                          • Mise à jour le {new Date(application.reviewed_at).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {application.status === 'accepted' && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
                    <p className="text-green-800 font-medium">
                      Félicitations ! Votre candidature a été acceptée.
                    </p>
                    <p className="text-green-700 text-sm mt-1">
                      L'entreprise devrait vous contacter prochainement.
                    </p>
                  </div>
                )}

                {application.status === 'rejected' && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-4">
                    <p className="text-gray-700">
                      Votre candidature n'a pas été retenue pour ce poste.
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {selectedApplication && (
        <ApplicationDetailModal
          application={selectedApplication}
          onClose={() => setSelectedApplication(null)}
        />
      )}
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
