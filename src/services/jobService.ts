import { supabase } from '../lib/supabase';
import type {
  JobOffer,
  JobApplication,
  SavedJob,
  JobOfferFormData,
  JobApplicationFormData,
  JobSearchFilters,
  JobOfferWithCompany,
  JobApplicationWithDetails,
} from '../types/jobs';

export class JobService {
  /**
   * Récupère toutes les offres publiées (pour athlètes)
   */
  static async getPublishedJobs(filters?: JobSearchFilters): Promise<JobOffer[]> {
    let query = supabase
      .from('job_offers')
      .select('*')
      .eq('status', 'published')
      .order('published_at', { ascending: false });

    if (filters) {
      if (filters.contract_type && filters.contract_type.length > 0) {
        query = query.in('contract_type', filters.contract_type);
      }
      if (filters.location) {
        query = query.ilike('location', `%${filters.location}%`);
      }
      if (filters.remote_possible !== undefined) {
        query = query.eq('remote_possible', filters.remote_possible);
      }
      if (filters.experience_level && filters.experience_level.length > 0) {
        query = query.in('experience_level', filters.experience_level);
      }
      if (filters.job_sector && filters.job_sector.length > 0) {
        query = query.in('job_sector', filters.job_sector);
      }
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching jobs:', error);
      throw error;
    }

    return data || [];
  }

  /**
   * Récupère les offres d'une entreprise
   */
  static async getCompanyJobs(companyId: string): Promise<JobOffer[]> {
    const { data, error } = await supabase
      .from('job_offers')
      .select('*')
      .eq('company_id', companyId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching company jobs:', error);
      throw error;
    }

    return data || [];
  }

  /**
   * Récupère une offre par ID
   */
  static async getJobById(jobId: string): Promise<JobOffer | null> {
    const { data, error } = await supabase
      .from('job_offers')
      .select('*')
      .eq('id', jobId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching job:', error);
      throw error;
    }

    return data;
  }

  /**
   * Crée une nouvelle offre d'emploi (entreprise uniquement)
   */
  static async createJob(
    companyId: string,
    jobData: JobOfferFormData
  ): Promise<JobOffer> {
    const { data, error } = await supabase
      .from('job_offers')
      .insert({
        company_id: companyId,
        ...jobData,
        status: 'draft',
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating job:', error);
      throw error;
    }

    return data;
  }

  /**
   * Met à jour une offre d'emploi
   */
  static async updateJob(
    jobId: string,
    updates: Partial<JobOfferFormData>
  ): Promise<JobOffer> {
    const { data, error } = await supabase
      .from('job_offers')
      .update(updates)
      .eq('id', jobId)
      .select()
      .single();

    if (error) {
      console.error('Error updating job:', error);
      throw error;
    }

    return data;
  }

  /**
   * Publie une offre (change status à 'published')
   */
  static async publishJob(jobId: string): Promise<JobOffer> {
    const { data, error } = await supabase
      .from('job_offers')
      .update({
        status: 'published',
        published_at: new Date().toISOString(),
      })
      .eq('id', jobId)
      .select()
      .single();

    if (error) {
      console.error('Error publishing job:', error);
      throw error;
    }

    return data;
  }

  /**
   * Ferme une offre (change status à 'closed')
   */
  static async closeJob(jobId: string): Promise<JobOffer> {
    const { data, error } = await supabase
      .from('job_offers')
      .update({ status: 'closed' })
      .eq('id', jobId)
      .select()
      .single();

    if (error) {
      console.error('Error closing job:', error);
      throw error;
    }

    return data;
  }

  /**
   * Supprime une offre
   */
  static async deleteJob(jobId: string): Promise<void> {
    const { error } = await supabase
      .from('job_offers')
      .delete()
      .eq('id', jobId);

    if (error) {
      console.error('Error deleting job:', error);
      throw error;
    }
  }

  /**
   * Récupère les candidatures d'un athlète
   */
  static async getAthleteApplications(athleteId: string): Promise<JobApplication[]> {
    const { data, error } = await supabase
      .from('job_applications')
      .select('*')
      .eq('athlete_id', athleteId)
      .order('applied_at', { ascending: false });

    if (error) {
      console.error('Error fetching athlete applications:', error);
      throw error;
    }

    return data || [];
  }

  /**
   * Récupère les candidatures pour une offre (entreprise uniquement)
   */
  static async getJobApplications(jobId: string): Promise<JobApplication[]> {
    const { data, error } = await supabase
      .from('job_applications')
      .select('*')
      .eq('job_offer_id', jobId)
      .order('applied_at', { ascending: false });

    if (error) {
      console.error('Error fetching job applications:', error);
      throw error;
    }

    return data || [];
  }

  /**
   * Crée une candidature
   */
  static async applyToJob(
    athleteId: string,
    applicationData: JobApplicationFormData
  ): Promise<JobApplication> {
    const { data, error } = await supabase
      .from('job_applications')
      .insert({
        athlete_id: athleteId,
        ...applicationData,
        status: 'pending',
      })
      .select()
      .single();

    if (error) {
      console.error('Error applying to job:', error);
      throw error;
    }

    return data;
  }

  /**
   * Met à jour le statut d'une candidature (entreprise uniquement)
   */
  static async updateApplicationStatus(
    applicationId: string,
    status: 'pending' | 'reviewed' | 'accepted' | 'rejected'
  ): Promise<JobApplication> {
    const updates: any = { status };

    if (status !== 'pending') {
      updates.reviewed_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from('job_applications')
      .update(updates)
      .eq('id', applicationId)
      .select()
      .single();

    if (error) {
      console.error('Error updating application status:', error);
      throw error;
    }

    return data;
  }

  /**
   * Sauvegarde une offre (athlète uniquement)
   */
  static async saveJob(athleteId: string, jobId: string): Promise<SavedJob> {
    const { data, error } = await supabase
      .from('saved_jobs')
      .insert({
        athlete_id: athleteId,
        job_offer_id: jobId,
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving job:', error);
      throw error;
    }

    return data;
  }

  /**
   * Supprime une offre sauvegardée
   */
  static async unsaveJob(athleteId: string, jobId: string): Promise<void> {
    const { error } = await supabase
      .from('saved_jobs')
      .delete()
      .eq('athlete_id', athleteId)
      .eq('job_offer_id', jobId);

    if (error) {
      console.error('Error unsaving job:', error);
      throw error;
    }
  }

  /**
   * Récupère les offres sauvegardées d'un athlète
   */
  static async getSavedJobs(athleteId: string): Promise<SavedJob[]> {
    const { data, error } = await supabase
      .from('saved_jobs')
      .select('*')
      .eq('athlete_id', athleteId)
      .order('saved_at', { ascending: false });

    if (error) {
      console.error('Error fetching saved jobs:', error);
      throw error;
    }

    return data || [];
  }

  /**
   * Vérifie si un athlète a déjà postulé à une offre
   */
  static async hasApplied(athleteId: string, jobId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('job_applications')
      .select('id')
      .eq('athlete_id', athleteId)
      .eq('job_offer_id', jobId)
      .maybeSingle();

    if (error) {
      console.error('Error checking application:', error);
      return false;
    }

    return !!data;
  }

  /**
   * Vérifie si un athlète a sauvegardé une offre
   */
  static async isSaved(athleteId: string, jobId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('saved_jobs')
      .select('id')
      .eq('athlete_id', athleteId)
      .eq('job_offer_id', jobId)
      .maybeSingle();

    if (error) {
      console.error('Error checking saved job:', error);
      return false;
    }

    return !!data;
  }
}
