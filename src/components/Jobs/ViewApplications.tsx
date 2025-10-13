import { useState, useEffect } from 'react';
import { FileText, CheckCircle, XCircle, Clock, User } from 'lucide-react';
import { JobService } from '../../services/jobService';
import { supabase } from '../../lib/supabase';
import type { JobApplication, JobOffer } from '../../types/jobs';
import type { AthleteProfile } from '../../types';
import { useAuth } from '../../contexts/AuthContext';

interface ApplicationWithDetails extends JobApplication {
  athlete: AthleteProfile;
  job: JobOffer;
}

export default function ViewApplications() {
  const { user } = useAuth();
  const [applications, setApplications] = useState<ApplicationWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'reviewed' | 'accepted' | 'rejected'>('all');
  const [selectedApplication, setSelectedApplication] = useState<ApplicationWithDetails | null>(null);

  useEffect(() => {
    if (user) {
      loadApplications();
    }
  }, [user]);

  const loadApplications = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const jobs = await JobService.getCompanyJobs(user.id);

      const allApplications: ApplicationWithDetails[] = [];

      for (const job of jobs) {
        const jobApplications = await JobService.getJobApplications(job.id);

        for (const app of jobApplications) {
          const { data: athleteData } = await supabase
            .from('athlete_profiles')
            .select('*')
            .eq('user_id', app.athlete_id)
            .single();

          if (athleteData) {
            allApplications.push({
              ...app,
              athlete: athleteData,
              job: job,
            });
          }
        }
      }

      setApplications(allApplications);
    } catch (error) {
      console.error('Error loading applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (
    applicationId: string,
    status: 'pending' | 'reviewed' | 'accepted' | 'rejected'
  ) => {
    try {
      await JobService.updateApplicationStatus(applicationId, status);
      await loadApplications();
    } catch (error) {
      console.error('Error updating application status:', error);
      alert('Erreur lors de la mise à jour du statut');
    }
  };

  const filteredApplications = applications.filter(app => {
    if (filter === 'all') return true;
    return app.status === filter;
  });

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-700',
    reviewed: 'bg-blue-100 text-blue-700',
    accepted: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
  };

  const statusLabels = {
    pending: 'En attente',
    reviewed: 'Examinée',
    accepted: 'Acceptée',
    rejected: 'Refusée',
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Candidatures Reçues</h1>
        <p className="text-gray-600">Gérez les candidatures à vos offres d'emploi</p>
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
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune candidature</h3>
          <p className="text-gray-600">
            {filter === 'all'
              ? 'Vous n\'avez encore reçu aucune candidature'
              : `Aucune candidature ${statusLabels[filter].toLowerCase()}`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredApplications.map((application) => (
            <div
              key={application.id}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedApplication(application)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4 flex-1">
                  {application.athlete.photo_url ? (
                    <img
                      src={application.athlete.photo_url}
                      alt={`${application.athlete.first_name} ${application.athlete.last_name}`}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                      <User className="h-8 w-8 text-blue-600" />
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {application.athlete.first_name} {application.athlete.last_name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {application.athlete.sport} • {application.athlete.sport_level}
                    </p>
                    <p className="text-sm font-medium text-gray-900 mb-2">
                      Pour: {application.job.title}
                    </p>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {application.cover_letter}
                    </p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[application.status]}`}>
                  {statusLabels[application.status]}
                </span>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <span className="text-sm text-gray-500">
                  Postulé le {new Date(application.applied_at).toLocaleDateString('fr-FR')}
                </span>
                <div className="flex gap-2">
                  {application.status === 'pending' && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUpdateStatus(application.id, 'reviewed');
                        }}
                        className="flex items-center gap-1 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg"
                      >
                        <Clock className="h-4 w-4" />
                        Examiner
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUpdateStatus(application.id, 'accepted');
                        }}
                        className="flex items-center gap-1 px-3 py-1.5 text-sm text-green-600 hover:bg-green-50 rounded-lg"
                      >
                        <CheckCircle className="h-4 w-4" />
                        Accepter
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUpdateStatus(application.id, 'rejected');
                        }}
                        className="flex items-center gap-1 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <XCircle className="h-4 w-4" />
                        Refuser
                      </button>
                    </>
                  )}
                  {application.status === 'reviewed' && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUpdateStatus(application.id, 'accepted');
                        }}
                        className="flex items-center gap-1 px-3 py-1.5 text-sm text-green-600 hover:bg-green-50 rounded-lg"
                      >
                        <CheckCircle className="h-4 w-4" />
                        Accepter
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUpdateStatus(application.id, 'rejected');
                        }}
                        className="flex items-center gap-1 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <XCircle className="h-4 w-4" />
                        Refuser
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedApplication && (
        <ApplicationDetailModal
          application={selectedApplication}
          onClose={() => setSelectedApplication(null)}
          onUpdateStatus={handleUpdateStatus}
        />
      )}
    </div>
  );
}

function ApplicationDetailModal({
  application,
  onClose,
  onUpdateStatus,
}: {
  application: ApplicationWithDetails;
  onClose: () => void;
  onUpdateStatus: (id: string, status: 'pending' | 'reviewed' | 'accepted' | 'rejected') => void;
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              {application.athlete.photo_url ? (
                <img
                  src={application.athlete.photo_url}
                  alt={`${application.athlete.first_name} ${application.athlete.last_name}`}
                  className="w-20 h-20 rounded-full object-cover"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center">
                  <User className="h-10 w-10 text-blue-600" />
                </div>
              )}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                  {application.athlete.first_name} {application.athlete.last_name}
                </h2>
                <p className="text-gray-600 mb-2">
                  {application.athlete.sport} • {application.athlete.sport_level}
                </p>
                <p className="text-sm text-gray-500">
                  Candidature pour: <span className="font-medium">{application.job.title}</span>
                </p>
              </div>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">
              ×
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">Lettre de motivation</h3>
            <p className="text-gray-700 whitespace-pre-line bg-gray-50 p-4 rounded-lg">
              {application.cover_letter}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            {application.athlete.city_of_residence && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Localisation</h4>
                <p className="text-gray-700">{application.athlete.city_of_residence}</p>
              </div>
            )}
            {application.athlete.availability && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Disponibilité</h4>
                <p className="text-gray-700">{application.athlete.availability}</p>
              </div>
            )}
            {application.athlete.desired_field && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Domaine recherché</h4>
                <p className="text-gray-700">{application.athlete.desired_field}</p>
              </div>
            )}
            {application.athlete.degrees && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Formation</h4>
                <p className="text-gray-700">{application.athlete.degrees}</p>
              </div>
            )}
          </div>

          {application.athlete.achievements && (
            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-2">Palmarès</h4>
              <p className="text-gray-700 whitespace-pre-line">{application.athlete.achievements}</p>
            </div>
          )}

          <div className="flex gap-3 pt-6 border-t border-gray-200">
            {application.status === 'pending' && (
              <>
                <button
                  onClick={() => {
                    onUpdateStatus(application.id, 'reviewed');
                    onClose();
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50"
                >
                  <Clock className="h-5 w-5" />
                  Marquer comme examinée
                </button>
                <button
                  onClick={() => {
                    onUpdateStatus(application.id, 'accepted');
                    onClose();
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  <CheckCircle className="h-5 w-5" />
                  Accepter
                </button>
                <button
                  onClick={() => {
                    onUpdateStatus(application.id, 'rejected');
                    onClose();
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  <XCircle className="h-5 w-5" />
                  Refuser
                </button>
              </>
            )}
            {application.status === 'reviewed' && (
              <>
                <button
                  onClick={() => {
                    onUpdateStatus(application.id, 'accepted');
                    onClose();
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  <CheckCircle className="h-5 w-5" />
                  Accepter
                </button>
                <button
                  onClick={() => {
                    onUpdateStatus(application.id, 'rejected');
                    onClose();
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  <XCircle className="h-5 w-5" />
                  Refuser
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
