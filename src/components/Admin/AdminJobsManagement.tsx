import { useState, useEffect } from 'react';
import { Search, Eye, Ban, Trash2, CheckCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { JobService } from '../../services/jobService';
import type { JobOffer } from '../../types/jobs';

export default function AdminJobsManagement() {
  const [jobs, setJobs] = useState<JobOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'draft' | 'published' | 'closed'>('all');
  const [selectedJob, setSelectedJob] = useState<JobOffer | null>(null);

  useEffect(() => {
    loadJobs();
  }, [filterStatus]);

  const loadJobs = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('job_offers')
        .select('*')
        .order('created_at', { ascending: false });

      if (filterStatus !== 'all') {
        query = query.eq('status', filterStatus);
      }

      const { data, error } = await query;

      if (error) throw error;
      setJobs(data || []);
    } catch (error) {
      console.error('Error loading jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (jobId: string, status: 'published' | 'closed') => {
    if (!confirm(`Confirmer le changement de statut ?`)) return;

    try {
      if (status === 'published') {
        await JobService.publishJob(jobId);
      } else {
        await JobService.closeJob(jobId);
      }
      await loadJobs();
    } catch (error) {
      alert('Erreur lors de la mise à jour');
    }
  };

  const handleDelete = async (jobId: string) => {
    if (!confirm('ATTENTION : Supprimer définitivement cette offre ?')) return;

    try {
      await JobService.deleteJob(jobId);
      await loadJobs();
    } catch (error) {
      alert('Erreur lors de la suppression');
    }
  };

  const filteredJobs = jobs.filter((job) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      job.title.toLowerCase().includes(searchLower) ||
      job.description.toLowerCase().includes(searchLower) ||
      job.location.toLowerCase().includes(searchLower)
    );
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">Publiée</span>;
      case 'draft':
        return <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">Brouillon</span>;
      case 'closed':
        return <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">Fermée</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">{status}</span>;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Gestion des Offres d'Emploi</h2>
        <p className="text-gray-600 mt-1">
          {filteredJobs.length} offre{filteredJobs.length > 1 ? 's' : ''}
        </p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tous les statuts</option>
            <option value="draft">Brouillons</option>
            <option value="published">Publiées</option>
            <option value="closed">Fermées</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Offre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Entreprise
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Créée le
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredJobs.map((job) => (
                <tr key={job.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{job.title}</div>
                      <div className="text-sm text-gray-500">{job.location}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {job.company_id.slice(0, 8)}...
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                      {job.contract_type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(job.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(job.created_at).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setSelectedJob(job)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Voir détails"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      {job.status === 'draft' && (
                        <button
                          onClick={() => handleStatusChange(job.id, 'published')}
                          className="text-green-600 hover:text-green-900"
                          title="Publier"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </button>
                      )}
                      {job.status === 'published' && (
                        <button
                          onClick={() => handleStatusChange(job.id, 'closed')}
                          className="text-orange-600 hover:text-orange-900"
                          title="Fermer"
                        >
                          <Ban className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(job.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Supprimer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedJob && (
        <JobDetailModal
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
          onUpdate={loadJobs}
        />
      )}
    </div>
  );
}

function JobDetailModal({
  job,
  onClose,
  onUpdate,
}: {
  job: JobOffer;
  onClose: () => void;
  onUpdate: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{job.location}</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              ×
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <h4 className="font-semibold mb-2">Description</h4>
            <p className="text-gray-700 whitespace-pre-line">{job.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-sm text-gray-600">Type:</span>
              <p className="font-medium">{job.contract_type}</p>
            </div>
            <div>
              <span className="text-sm text-gray-600">Expérience:</span>
              <p className="font-medium">{job.experience_level}</p>
            </div>
            <div>
              <span className="text-sm text-gray-600">Secteur:</span>
              <p className="font-medium">{job.job_sector}</p>
            </div>
            <div>
              <span className="text-sm text-gray-600">Télétravail:</span>
              <p className="font-medium">{job.remote_possible ? 'Oui' : 'Non'}</p>
            </div>
            <div>
              <span className="text-sm text-gray-600">Salaire:</span>
              <p className="font-medium">
                {job.salary_min && job.salary_max
                  ? `${job.salary_min}k - ${job.salary_max}k €`
                  : 'Non spécifié'}
              </p>
            </div>
            <div>
              <span className="text-sm text-gray-600">Statut:</span>
              <p className="font-medium">{job.status}</p>
            </div>
          </div>

          {job.required_skills.length > 0 && (
            <div>
              <h4 className="font-semibold mb-2">Compétences requises</h4>
              <div className="flex flex-wrap gap-2">
                {job.required_skills.map((skill, i) => (
                  <span key={i} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="pt-4 border-t text-sm text-gray-600">
            <p>Créée le {new Date(job.created_at).toLocaleDateString('fr-FR')}</p>
            {job.published_at && (
              <p>Publiée le {new Date(job.published_at).toLocaleDateString('fr-FR')}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
