import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { JobService } from '../../services/jobService';
import JobForm from './JobForm';
import type { JobOffer } from '../../types/jobs';
import { useAuth } from '../../contexts/AuthContext';

export default function ManageJobOffers() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<JobOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingJob, setEditingJob] = useState<JobOffer | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<'all' | 'draft' | 'published' | 'closed'>('all');

  useEffect(() => {
    if (user) {
      loadJobs();
    }
  }, [user]);

  const loadJobs = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const data = await JobService.getCompanyJobs(user.id);
      setJobs(data);
    } catch (error) {
      console.error('Error loading jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async (jobId: string) => {
    try {
      await JobService.publishJob(jobId);
      await loadJobs();
    } catch (error) {
      console.error('Error publishing job:', error);
      alert('Erreur lors de la publication');
    }
  };

  const handleClose = async (jobId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir fermer cette offre ?')) return;
    try {
      await JobService.closeJob(jobId);
      await loadJobs();
    } catch (error) {
      console.error('Error closing job:', error);
      alert('Erreur lors de la fermeture');
    }
  };

  const handleDelete = async (jobId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette offre ?')) return;
    try {
      await JobService.deleteJob(jobId);
      await loadJobs();
    } catch (error) {
      console.error('Error deleting job:', error);
      alert('Erreur lors de la suppression');
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingJob(null);
    loadJobs();
  };

  const filteredJobs = jobs.filter(job => {
    if (filter === 'all') return true;
    return job.status === filter;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mes Offres d'Emploi</h1>
          <p className="text-gray-600">Gérez vos offres et consultez les candidatures</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
        >
          <Plus className="h-5 w-5" />
          Créer une offre
        </button>
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
          Toutes ({jobs.length})
        </button>
        <button
          onClick={() => setFilter('draft')}
          className={`px-4 py-2 rounded-lg font-medium ${
            filter === 'draft'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Brouillons ({jobs.filter(j => j.status === 'draft').length})
        </button>
        <button
          onClick={() => setFilter('published')}
          className={`px-4 py-2 rounded-lg font-medium ${
            filter === 'published'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Publiées ({jobs.filter(j => j.status === 'published').length})
        </button>
        <button
          onClick={() => setFilter('closed')}
          className={`px-4 py-2 rounded-lg font-medium ${
            filter === 'closed'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Fermées ({jobs.filter(j => j.status === 'closed').length})
        </button>
      </div>

      {filteredJobs.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {filter === 'all' ? 'Aucune offre' : `Aucune offre ${filter === 'draft' ? 'en brouillon' : filter === 'published' ? 'publiée' : 'fermée'}`}
          </h3>
          <p className="text-gray-600 mb-4">Commencez par créer votre première offre d'emploi</p>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
          >
            <Plus className="h-5 w-5" />
            Créer une offre
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredJobs.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-lg border border-gray-200 p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {job.title}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        job.status === 'published'
                          ? 'bg-green-100 text-green-700'
                          : job.status === 'draft'
                          ? 'bg-gray-100 text-gray-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {job.status === 'published' ? 'Publiée' : job.status === 'draft' ? 'Brouillon' : 'Fermée'}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                    <span>{job.contract_type}</span>
                    <span>•</span>
                    <span>{job.location}</span>
                    <span>•</span>
                    <span>{job.experience_level}</span>
                  </div>
                  <p className="text-gray-600 line-clamp-2">{job.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    setEditingJob(job);
                    setShowForm(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Edit className="h-4 w-4" />
                  Modifier
                </button>

                {job.status === 'draft' && (
                  <button
                    onClick={() => handlePublish(job.id)}
                    className="flex items-center gap-2 px-4 py-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  >
                    <Eye className="h-4 w-4" />
                    Publier
                  </button>
                )}

                {job.status === 'published' && (
                  <button
                    onClick={() => handleClose(job.id)}
                    className="flex items-center gap-2 px-4 py-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                  >
                    <EyeOff className="h-4 w-4" />
                    Fermer
                  </button>
                )}

                <button
                  onClick={() => handleDelete(job.id)}
                  className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                  Supprimer
                </button>

                <div className="ml-auto">
                  <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    <CheckCircle className="h-4 w-4" />
                    Voir les candidatures
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && user && (
        <JobForm
          job={editingJob || undefined}
          companyId={user.id}
          onSuccess={handleFormSuccess}
          onCancel={() => {
            setShowForm(false);
            setEditingJob(null);
          }}
        />
      )}
    </div>
  );
}
