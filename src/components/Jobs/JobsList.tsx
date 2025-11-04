import { useState, useEffect } from 'react';
import { Briefcase, MapPin, Clock, Bookmark, BookmarkCheck, Search, Filter } from 'lucide-react';
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
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'sportif' | 'entreprise'>('sportif');

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
          title: 'Entraîneur de Football',
          description: 'Club de football professionnel recherche un entraîneur passionné pour développer les talents de notre équipe. Excellente opportunité de carrière dans un environnement sportif dynamique.',
          location: 'Paris, France',
          contract_type: 'full_time',
          salary_min: 3500,
          salary_max: 4500,
          required_skills: ['Coaching', 'Tactique', 'Management', 'Formation'],
          job_sector: 'Sport',
          image_url: '/src/assets/images/stadium-rugby-unsplash.jpg',
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '2',
          company_id: '9b78d93c-7fc2-413b-b7d6-7e1040862ab9',
          title: 'Préparateur Physique',
          description: 'Rejoignez notre centre sportif de haut niveau. Accompagnez des athlètes professionnels dans leur préparation physique et optimisez leurs performances.',
          location: 'Lyon, France',
          contract_type: 'full_time',
          salary_min: 2800,
          salary_max: 3500,
          required_skills: ['Préparation physique', 'Nutrition sportive', 'Suivi athlètes'],
          job_sector: 'Sport',
          image_url: '/src/assets/images/zachary-kadolph-CmwNM-XHM48-unsplash.jpg',
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '3',
          company_id: '9b78d93c-7fc2-413b-b7d6-7e1040862ab9',
          title: 'Responsable Marketing Sportif',
          description: 'Marque sportive internationale cherche un expert marketing pour développer sa visibilité et ses partenariats. Travaillez avec des athlètes de renommée mondiale.',
          location: 'Marseille, France',
          contract_type: 'full_time',
          salary_min: 3200,
          salary_max: 4000,
          required_skills: ['Marketing digital', 'Sponsoring', 'Communication', 'Réseaux sociaux'],
          job_sector: 'Sport',
          image_url: '/src/assets/images/venti-views-cHRDevKFDBw-unsplash.jpg',
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '4',
          company_id: '9b78d93c-7fc2-413b-b7d6-7e1040862ab9',
          title: 'Kinésithérapeute Sportif',
          description: 'Centre de rééducation sportive recherche un kinésithérapeute spécialisé. Accompagnez des athlètes professionnels dans leur récupération et prévention des blessures.',
          location: 'Bordeaux, France',
          contract_type: 'contract',
          salary_min: 2500,
          salary_max: 3200,
          required_skills: ['Kinésithérapie', 'Sport santé', 'Rééducation', 'Prévention'],
          job_sector: 'Sport',
          image_url: '/src/assets/images/susan-flynn-h4d4m2IkBxA-unsplash.jpg',
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '5',
          company_id: '9b78d93c-7fc2-413b-b7d6-7e1040862ab9',
          title: 'Analyste Performance Sportive',
          description: 'Utilisez les données pour améliorer les performances de nos équipes. Poste stratégique au sein d\'un club professionnel ambitieux.',
          location: 'Toulouse, France',
          contract_type: 'full_time',
          salary_min: 3000,
          salary_max: 3800,
          required_skills: ['Analyse de données', 'Statistiques', 'Video analyse', 'Reporting'],
          job_sector: 'Sport',
          image_url: '/src/assets/images/cycling-road-unsplash.jpg',
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '6',
          company_id: '9b78d93c-7fc2-413b-b7d6-7e1040862ab9',
          title: 'Directeur de Centre Sportif',
          description: 'Management d\'un complexe sportif moderne. Développez les activités, gérez les équipes et créez des partenariats stratégiques pour notre centre d\'excellence.',
          location: 'Nice, France',
          contract_type: 'full_time',
          salary_min: 4000,
          salary_max: 5000,
          required_skills: ['Management', 'Gestion', 'Développement commercial', 'Leadership'],
          job_sector: 'Sport',
          image_url: '/src/assets/images/mariah-hewines-2JMd-1IlIZI-unsplash.jpg',
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
    if (min && max) return `${min} - ${max}€`;
    if (min) return `À partir de ${min}€`;
    return `Jusqu'à ${max}€`;
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

          {/* Search and Filter Section */}
          <div className="mt-8">
            <div className="flex items-center gap-4">

              {/* Search Bar */}
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-full text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
              </div>

              {/* Second Search Bar */}
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-full text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
              </div>

              {/* Filter Button */}
              <button className="px-8 py-3 bg-white border border-gray-200 rounded-full flex items-center gap-2 text-gray-900 font-semibold hover:bg-gray-50 transition-all">
                <Filter className="w-5 h-5" />
                Filter
              </button>
            </div>
          </div>
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
                  <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {job.image_url ? (
                      <img src={job.image_url} alt={job.title} className="w-full h-full object-cover" />
                    ) : (
                      <Briefcase className="w-10 h-10 text-gray-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold text-gray-900 mb-1">
                      {job.title}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {job.location}
                    </p>
                  </div>
                </div>

                <p className="text-gray-500 text-xs mb-6 line-clamp-3 leading-relaxed">
                  {job.description}
                </p>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {formatSalary(job.salary_min, job.salary_max)}
                    </p>
                    <p className="text-[10px] text-gray-500">/Mois</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (profile?.user_type === 'athlete') {
                          toggleSaveJob(job.id);
                        }
                      }}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      disabled={profile?.user_type !== 'athlete'}
                    >
                      {savedJobs.has(job.id) ? (
                        <BookmarkCheck className="w-5 h-5 text-green-500" />
                      ) : (
                        <Bookmark className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedJob(job);
                      }}
                      className="px-5 py-2 bg-green-400 text-white rounded-xl text-xs font-medium hover:bg-green-500 transition-colors"
                    >
                      Postuler
                    </button>
                  </div>
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
