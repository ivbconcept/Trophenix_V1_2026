/*
  # Système d'Offres d'Emploi - Création des Tables

  1. Nouvelles Tables
    - `job_offers`
      - `id` (uuid, PK) - Identifiant unique
      - `company_id` (uuid, FK) - Référence vers auth.users
      - `title` (text) - Titre du poste
      - `description` (text) - Description détaillée
      - `contract_type` (text) - Type de contrat (CDI, CDD, Stage, etc.)
      - `location` (text) - Lieu de travail
      - `salary_min` (integer) - Salaire minimum
      - `salary_max` (integer) - Salaire maximum
      - `required_skills` (text[]) - Compétences requises
      - `job_sector` (text) - Secteur d'activité
      - `is_active` (boolean) - Offre active ou non
      - `created_at` (timestamptz) - Date de création
      - `updated_at` (timestamptz) - Date de mise à jour

  2. Sécurité
    - RLS activé sur job_offers
    - Les entreprises peuvent créer et gérer leurs offres
    - Tous les utilisateurs authentifiés peuvent voir les offres actives

  3. Index
    - Index sur company_id pour les requêtes par entreprise
    - Index sur is_active pour filtrer les offres actives
    - Index sur created_at pour le tri chronologique
*/

-- Créer la table job_offers
CREATE TABLE IF NOT EXISTS job_offers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  contract_type text NOT NULL CHECK (contract_type IN ('full_time', 'part_time', 'contract', 'internship', 'freelance')),
  location text NOT NULL,
  salary_min integer,
  salary_max integer,
  required_skills text[] DEFAULT '{}',
  job_sector text NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Index pour performance
CREATE INDEX IF NOT EXISTS idx_job_offers_company_id ON job_offers(company_id);
CREATE INDEX IF NOT EXISTS idx_job_offers_is_active ON job_offers(is_active);
CREATE INDEX IF NOT EXISTS idx_job_offers_created_at ON job_offers(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_job_offers_sector ON job_offers(job_sector);

-- Activer RLS
ALTER TABLE job_offers ENABLE ROW LEVEL SECURITY;

-- Politique: Les entreprises peuvent créer des offres
CREATE POLICY "Companies can create job offers"
  ON job_offers FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = company_id);

-- Politique: Les entreprises peuvent voir leurs propres offres
CREATE POLICY "Companies can view own job offers"
  ON job_offers FOR SELECT
  TO authenticated
  USING (auth.uid() = company_id);

-- Politique: Les entreprises peuvent mettre à jour leurs offres
CREATE POLICY "Companies can update own job offers"
  ON job_offers FOR UPDATE
  TO authenticated
  USING (auth.uid() = company_id)
  WITH CHECK (auth.uid() = company_id);

-- Politique: Les entreprises peuvent supprimer leurs offres
CREATE POLICY "Companies can delete own job offers"
  ON job_offers FOR DELETE
  TO authenticated
  USING (auth.uid() = company_id);

-- Politique: Tous les utilisateurs authentifiés peuvent voir les offres actives
CREATE POLICY "Anyone can view active job offers"
  ON job_offers FOR SELECT
  TO authenticated
  USING (is_active = true);

-- Fonction pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_job_offers_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour updated_at
DROP TRIGGER IF EXISTS update_job_offers_updated_at_trigger ON job_offers;
CREATE TRIGGER update_job_offers_updated_at_trigger
  BEFORE UPDATE ON job_offers
  FOR EACH ROW
  EXECUTE FUNCTION update_job_offers_updated_at();
