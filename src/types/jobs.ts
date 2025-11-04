/**
 * Types pour le système d'offres d'emploi et candidatures
 * Correspond aux tables job_offers, job_applications, saved_jobs
 */

export type ContractType = 'CDI' | 'CDD' | 'Stage' | 'Alternance' | 'Freelance';
export type WorkTime = 'Temps plein' | 'Mi-temps' | 'Stage';
export type ExperienceLevel = 'Junior' | 'Mid' | 'Senior' | 'Expert';
export type JobStatus = 'draft' | 'published' | 'closed';
export type ApplicationStatus = 'pending' | 'reviewed' | 'accepted' | 'rejected';

/**
 * Offre d'emploi créée par une entreprise
 * Correspond à la table 'job_offers'
 */
export interface JobOffer {
  id: string;
  company_id: string;
  title: string;
  description: string;
  contract_type: ContractType;
  work_time: WorkTime;
  location: string;
  remote_possible: boolean;
  salary_min?: number;
  salary_max?: number;
  required_skills: string[];
  experience_level: ExperienceLevel;
  job_sector: string;
  status: JobStatus;
  published_at?: string;
  expires_at?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Candidature d'un athlète à une offre d'emploi
 * Correspond à la table 'job_applications'
 */
export interface JobApplication {
  id: string;
  job_offer_id: string;
  athlete_id: string;
  cover_letter: string;
  status: ApplicationStatus;
  applied_at: string;
  reviewed_at?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Offre d'emploi sauvegardée par un athlète
 * Correspond à la table 'saved_jobs'
 */
export interface SavedJob {
  id: string;
  athlete_id: string;
  job_offer_id: string;
  saved_at: string;
}

/**
 * Vue enrichie : Offre avec info entreprise
 */
export interface JobOfferWithCompany extends JobOffer {
  company_name: string;
  company_logo?: string;
  company_sector: string;
}

/**
 * Vue enrichie : Candidature avec info offre et athlète
 */
export interface JobApplicationWithDetails extends JobApplication {
  job_offer: JobOffer;
  athlete_name: string;
  athlete_sport: string;
  athlete_photo?: string;
}

/**
 * Filtres de recherche d'offres d'emploi
 */
export interface JobSearchFilters {
  contract_type?: ContractType[];
  location?: string;
  remote_possible?: boolean;
  experience_level?: ExperienceLevel[];
  job_sector?: string[];
  salary_min?: number;
  salary_max?: number;
  required_skills?: string[];
}

/**
 * Données du formulaire de création d'offre
 */
export interface JobOfferFormData {
  title: string;
  description: string;
  contract_type: ContractType;
  work_time: WorkTime;
  location: string;
  remote_possible: boolean;
  salary_min?: number;
  salary_max?: number;
  required_skills: string[];
  experience_level: ExperienceLevel;
  job_sector: string;
  expires_at?: string;
}

/**
 * Données du formulaire de candidature
 */
export interface JobApplicationFormData {
  job_offer_id: string;
  cover_letter: string;
}
