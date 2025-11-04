import { useState, useEffect } from 'react';
import { Briefcase, MapPin, Clock, Bookmark, BookmarkCheck } from 'lucide-react';
import { JobService } from '../../services/jobService';
import type { JobOffer, JobSearchFilters } from '../../types/jobs';
import { useAuth } from '../../contexts/AuthContext';

export default function JobsList() {
  const { user, profile } = useAuth();
  const [jobs, setJobs] = useState<JobOffer[]>([]);
  const [savedJobs, setSavedJobs] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<JobSearchFilters>({});
  const [selectedJob, setSelectedJob] = useState<JobOffer | null>(null);

  useEffect(() => {
    loadJobs();
    if (profile?.user_type === 'athlete') {
      loadSavedJobs();
    }
  }, [filters]);

  const loadJobs = async () => {
    try {
      setLoading(true);
      const mockJobs: JobOffer[] = [
        {
          id: '1',
          company_id: '9b78d93c-7fc2-413b-b7d6-7e1040862ab9',
          title: 'Junior UI.UX Designer',
          description: 'If you are looking for a highly paid job where the environment will allow you to develop, then this vacancy is for you, send us your resume.',
          location: 'Tbili, Georgia',
          contract_type: 'full_time',
          salary_min: 2500,
          salary_max: 3200,
          required_skills: ['UI Design', 'UX Design', 'Figma', 'Adobe XD'],
          job_sector: 'Design',
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '2',
          company_id: '9b78d93c-7fc2-413b-b7d6-7e1040862ab9',
          title: 'Junior Account Manager',
          description: 'If you are looking for a highly paid job where the environment will allow you to develop, then this vacancy is for you, send us your resume.',
          location: 'Tbili, Georgia',
          contract_type: 'full_time',
          salary_min: 4500,
          salary_max: 5000,
          required_skills: ['Account Management', 'Communication', 'Sales', 'CRM'],
          job_sector: 'Sales',
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '3',
          company_id: '9b78d93c-7fc2-413b-b7d6-7e1040862ab9',
          title: 'Real estate agent',
          description: 'If you are looking for a highly paid job where the environment will allow you to develop, then this vacancy is for you, send us your resume.',
          location: 'Tbili, Georgia',
          contract_type: 'contract',
          salary_min: 1500,
          salary_max: 2500,
          required_skills: ['Real Estate', 'Negotiation', 'Sales', 'Customer Service'],
          job_sector: 'Real Estate',
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '4',
          company_id: '9b78d93c-7fc2-413b-b7d6-7e1040862ab9',
          title: 'Tester',
          description: 'If you are looking for a highly paid job where the environment will allow you to develop, then this vacancy is for you, send us your resume.',
          location: 'Tbili, Georgia',
          contract_type: 'contract',
          salary_min: 2500,
          salary_max: 2900,
          required_skills: ['QA Testing', 'Manual Testing', 'Bug Tracking', 'Jira'],
          job_sector: 'Technology',
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '5',
          company_id: '9b78d93c-7fc2-413b-b7d6-7e1040862ab9',
          title: 'Junior Account Manager',
          description: 'If you are looking for a highly paid job where the environment will allow you to develop, then this vacancy is for you, send us your resume.',
          location: 'Tbili, Georgia',
          contract_type: 'full_time',
          salary_min: 1200,
          salary_max: 1900,
          required_skills: ['Account Management', 'Client Relations', 'Communication'],
          job_sector: 'Sales',
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '6',
          company_id: '9b78d93c-7fc2-413b-b7d6-7e1040862ab9',
          title: 'Registrar',
          description: 'If you are looking for a highly paid job where the environment will allow you to develop, then this vacancy is for you, send us your resume.',
          location: 'Tbili, Georgia',
          contract_type: 'full_time',
          salary_min: 3500,
          salary_max: 3900,
          required_skills: ['Data Entry', 'Organization', 'Administration', 'Documentation'],
          job_sector: 'Administration',
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
      setJobs(mockJobs);
    } catch (error) {
      console.error('Error loading jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSavedJobs = async () => {
    if (!user) return;
    try {
      const saved = await JobService.getSavedJobs(user.id);
      setSavedJobs(new Set(saved.map(s => s.job_offer_id)));
    } catch (error) {
      console.error('Error loading saved jobs:', error);
    }
  };

  const handleSaveJob = async (jobId: string) => {
    if (!user) return;
    try {
      if (savedJobs.has(jobId)) {
        await JobService.unsaveJob(user.id, jobId);
        setSavedJobs(prev => {
          const next = new Set(prev);
          next.delete(jobId);
          return next;
        });
      } else {
        await JobService.saveJob(user.id, jobId);
        setSavedJobs(prev => new Set(prev).add(jobId));
      }
    } catch (error) {
      console.error('Error toggling saved job:', error);
    }
  };

  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return 'Non spécifié';
    if (min && max) return `${min}k - ${max}k €`;
    if (min) return `À partir de ${min}k €`;
    return `Jusqu'à ${max}k €`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Offres d'Emploi</h1>
          <p className="text-gray-600">Trouvez votre prochaine opportunité professionnelle</p>
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-slate-50">
        <div className="max-w-7xl mx-auto px-8 py-8">
          {jobs.length === 0 ? (
        <div className="text-center py-12">
          <Briefcase className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune offre disponible</h3>
          <p className="text-gray-600">Essayez de modifier vos filtres de recherche</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all cursor-pointer overflow-hidden"
              onClick={() => setSelectedJob(job)}
            >
              <div className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Briefcase className="w-10 h-10 text-gray-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">
                      {job.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {job.location}
                    </p>
                  </div>
                </div>

                <p className="text-gray-500 text-sm mb-6 line-clamp-3 leading-relaxed">
                  {job.description}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
                      <span className="text-gray-600 text-sm font-medium">$</span>
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-gray-900">
                        {formatSalary(job.salary_min, job.salary_max)}
                      </p>
                      <p className="text-xs text-gray-500">/Mounth</p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedJob(job);
                    }}
                    className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          ))}
          </div>
        )}

        {selectedJob && (
          <JobDetailModal
            job={selectedJob}
            onClose={() => setSelectedJob(null)}
          />
        )}
        </div>
      </div>
    </div>
  );
}

function JobDetailModal({ job, onClose }: { job: JobOffer; onClose: () => void }) {
  const { user, profile } = useAuth();
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');

  useEffect(() => {
    checkIfApplied();
  }, []);

  const checkIfApplied = async () => {
    if (!user || profile?.user_type !== 'athlete') return;
    const hasApplied = await JobService.hasApplied(user.id, job.id);
    setApplied(hasApplied);
  };

  const handleApply = async () => {
    if (!user || !coverLetter.trim()) return;
    try {
      setApplying(true);
      await JobService.applyToJob(user.id, {
        job_offer_id: job.id,
        cover_letter: coverLetter,
      });
      setApplied(true);
      alert('Candidature envoyée avec succès !');
    } catch (error) {
      console.error('Error applying:', error);
      alert('Erreur lors de l\'envoi de la candidature');
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{job.title}</h2>
              <div className="flex items-center gap-4 text-gray-600">
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {job.location}
                </span>
                {job.remote_possible && (
                  <span className="text-green-600">Télétravail possible</span>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
            <p className="text-gray-700 whitespace-pre-line">{job.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">Type de contrat</h4>
              <p className="text-gray-700">{job.contract_type}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">Expérience</h4>
              <p className="text-gray-700">{job.experience_level}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">Secteur</h4>
              <p className="text-gray-700">{job.job_sector}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">Salaire</h4>
              <p className="text-gray-700">
                {job.salary_min && job.salary_max
                  ? `${job.salary_min}k - ${job.salary_max}k €`
                  : 'Non spécifié'}
              </p>
            </div>
          </div>

          {job.required_skills.length > 0 && (
            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-2">Compétences requises</h4>
              <div className="flex flex-wrap gap-2">
                {job.required_skills.map((skill, i) => (
                  <span key={i} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {profile?.user_type === 'athlete' && !applied && (
            <div className="border-t border-gray-200 pt-6">
              <h4 className="font-semibold text-gray-900 mb-3">Postuler à cette offre</h4>
              <textarea
                placeholder="Lettre de motivation..."
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 mb-4"
                rows={6}
              />
              <button
                onClick={handleApply}
                disabled={applying || !coverLetter.trim()}
                className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {applying ? 'Envoi...' : 'Envoyer ma candidature'}
              </button>
            </div>
          )}

          {applied && (
            <div className="border-t border-gray-200 pt-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                <p className="text-green-800 font-medium">Vous avez déjà postulé à cette offre</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
