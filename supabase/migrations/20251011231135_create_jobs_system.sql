/*
  # Système d'Offres d'Emploi et Candidatures - V1

  1. Tables Créées
    - `job_offers`
      - `id` (uuid, PK)
      - `company_id` (uuid, FK → profiles)
      - `title` (text) - Titre du poste
      - `description` (text) - Description détaillée
      - `contract_type` (text) - CDI, CDD, Stage, Alternance, Freelance
      - `location` (text) - Lieu de travail
      - `remote_possible` (boolean) - Télétravail possible
      - `salary_min` (integer) - Salaire min (optionnel)
      - `salary_max` (integer) - Salaire max (optionnel)
      - `required_skills` (text[]) - Compétences requises
      - `experience_level` (text) - Junior, Mid, Senior
      - `job_sector` (text) - Secteur d'activité
      - `status` (text) - draft, published, closed
      - `published_at` (timestamptz)
      - `expires_at` (timestamptz)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `job_applications`
      - `id` (uuid, PK)
      - `job_offer_id` (uuid, FK → job_offers)
      - `athlete_id` (uuid, FK → profiles)
      - `cover_letter` (text) - Lettre de motivation
      - `status` (text) - pending, reviewed, accepted, rejected
      - `applied_at` (timestamptz)
      - `reviewed_at` (timestamptz)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `saved_jobs`
      - `id` (uuid, PK)
      - `athlete_id` (uuid, FK → profiles)
      - `job_offer_id` (uuid, FK → job_offers)
      - `saved_at` (timestamptz)

  2. Sécurité (RLS)
    - Enable RLS sur toutes les tables
    - job_offers :
      - Companies peuvent créer/modifier leurs propres offres
      - Athletes et public peuvent lire les offres publiées
    - job_applications :
      - Athletes peuvent créer leurs candidatures
      - Athletes voient leurs propres candidatures
      - Companies voient les candidatures pour leurs offres
    - saved_jobs :
      - Athletes gèrent leurs propres sauvegardes

  3. Index
    - Index sur company_id pour performance
    - Index sur status pour filtrage
    - Index sur published_at pour tri
    - Index sur athlete_id pour les candidatures
*/

-- Table: job_offers
CREATE TABLE IF NOT EXISTS job_offers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  contract_type text NOT NULL CHECK (contract_type IN ('CDI', 'CDD', 'Stage', 'Alternance', 'Freelance')),
  location text NOT NULL,
  remote_possible boolean DEFAULT false,
  salary_min integer,
  salary_max integer,
  required_skills text[] DEFAULT '{}',
  experience_level text CHECK (experience_level IN ('Junior', 'Mid', 'Senior', 'Expert')) DEFAULT 'Mid',
  job_sector text NOT NULL,
  status text NOT NULL CHECK (status IN ('draft', 'published', 'closed')) DEFAULT 'draft',
  published_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT fk_company
    FOREIGN KEY (company_id)
    REFERENCES profiles(id)
    ON DELETE CASCADE
);

-- Table: job_applications
CREATE TABLE IF NOT EXISTS job_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_offer_id uuid REFERENCES job_offers(id) ON DELETE CASCADE NOT NULL,
  athlete_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  cover_letter text NOT NULL,
  status text NOT NULL CHECK (status IN ('pending', 'reviewed', 'accepted', 'rejected')) DEFAULT 'pending',
  applied_at timestamptz DEFAULT now(),
  reviewed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(job_offer_id, athlete_id)
);

-- Table: saved_jobs
CREATE TABLE IF NOT EXISTS saved_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  athlete_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  job_offer_id uuid REFERENCES job_offers(id) ON DELETE CASCADE NOT NULL,
  saved_at timestamptz DEFAULT now(),
  UNIQUE(athlete_id, job_offer_id)
);

-- Index pour performance
CREATE INDEX IF NOT EXISTS idx_job_offers_company_id ON job_offers(company_id);
CREATE INDEX IF NOT EXISTS idx_job_offers_status ON job_offers(status);
CREATE INDEX IF NOT EXISTS idx_job_offers_published_at ON job_offers(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_job_offers_sector ON job_offers(job_sector);
CREATE INDEX IF NOT EXISTS idx_job_applications_athlete_id ON job_applications(athlete_id);
CREATE INDEX IF NOT EXISTS idx_job_applications_job_offer_id ON job_applications(job_offer_id);
CREATE INDEX IF NOT EXISTS idx_job_applications_status ON job_applications(status);
CREATE INDEX IF NOT EXISTS idx_saved_jobs_athlete_id ON saved_jobs(athlete_id);

-- Enable RLS
ALTER TABLE job_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_jobs ENABLE ROW LEVEL SECURITY;

-- RLS Policies: job_offers
CREATE POLICY "Companies can create job offers"
  ON job_offers FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.user_type = 'company'
      AND profiles.id = job_offers.company_id
    )
  );

CREATE POLICY "Companies can view own job offers"
  ON job_offers FOR SELECT
  TO authenticated
  USING (
    company_id = auth.uid()
  );

CREATE POLICY "Companies can update own job offers"
  ON job_offers FOR UPDATE
  TO authenticated
  USING (company_id = auth.uid())
  WITH CHECK (company_id = auth.uid());

CREATE POLICY "Companies can delete own job offers"
  ON job_offers FOR DELETE
  TO authenticated
  USING (company_id = auth.uid());

CREATE POLICY "Athletes can view published job offers"
  ON job_offers FOR SELECT
  TO authenticated
  USING (
    status = 'published'
    AND EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.user_type = 'athlete'
    )
  );

CREATE POLICY "Admins can view all job offers"
  ON job_offers FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.user_type = 'admin'
    )
  );

-- RLS Policies: job_applications
CREATE POLICY "Athletes can create applications"
  ON job_applications FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.user_type = 'athlete'
      AND profiles.id = job_applications.athlete_id
    )
  );

CREATE POLICY "Athletes can view own applications"
  ON job_applications FOR SELECT
  TO authenticated
  USING (athlete_id = auth.uid());

CREATE POLICY "Athletes can update own pending applications"
  ON job_applications FOR UPDATE
  TO authenticated
  USING (
    athlete_id = auth.uid()
    AND status = 'pending'
  )
  WITH CHECK (
    athlete_id = auth.uid()
    AND status = 'pending'
  );

CREATE POLICY "Companies can view applications for their offers"
  ON job_applications FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM job_offers
      WHERE job_offers.id = job_applications.job_offer_id
      AND job_offers.company_id = auth.uid()
    )
  );

CREATE POLICY "Companies can update application status"
  ON job_applications FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM job_offers
      WHERE job_offers.id = job_applications.job_offer_id
      AND job_offers.company_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM job_offers
      WHERE job_offers.id = job_applications.job_offer_id
      AND job_offers.company_id = auth.uid()
    )
  );

-- RLS Policies: saved_jobs
CREATE POLICY "Athletes can save jobs"
  ON saved_jobs FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.user_type = 'athlete'
      AND profiles.id = saved_jobs.athlete_id
    )
  );

CREATE POLICY "Athletes can view own saved jobs"
  ON saved_jobs FOR SELECT
  TO authenticated
  USING (athlete_id = auth.uid());

CREATE POLICY "Athletes can delete own saved jobs"
  ON saved_jobs FOR DELETE
  TO authenticated
  USING (athlete_id = auth.uid());

-- Fonction pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers pour updated_at
DROP TRIGGER IF EXISTS update_job_offers_updated_at ON job_offers;
CREATE TRIGGER update_job_offers_updated_at
  BEFORE UPDATE ON job_offers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_job_applications_updated_at ON job_applications;
CREATE TRIGGER update_job_applications_updated_at
  BEFORE UPDATE ON job_applications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
