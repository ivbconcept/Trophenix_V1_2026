/*
  # Create Sponsoring System

  1. New Tables
    - `sponsoring_offers`
      - `id` (uuid, primary key)
      - `company_id` (uuid, foreign key to profiles)
      - `title` (text)
      - `description` (text)
      - `budget_range` (text)
      - `duration` (text)
      - `location` (text)
      - `sport_category` (text)
      - `status` (text: 'active', 'closed', 'draft')
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      - `views` (integer)

    - `sponsoring_requests`
      - `id` (uuid, primary key)
      - `athlete_id` (uuid, foreign key to profiles)
      - `offer_id` (uuid, foreign key to sponsoring_offers)
      - `status` (text: 'pending', 'accepted', 'rejected')
      - `budget_proposed` (text)
      - `message` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `sponsor_kits`
      - `id` (uuid, primary key)
      - `athlete_id` (uuid, foreign key to profiles)
      - `title` (text)
      - `description` (text)
      - `achievements` (text)
      - `audience` (text)
      - `social_media` (jsonb)
      - `statistics` (jsonb)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `presentation_letters`
      - `id` (uuid, primary key)
      - `athlete_id` (uuid, foreign key to profiles)
      - `title` (text)
      - `content` (text)
      - `is_default` (boolean)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `sponsoring_projects`
      - `id` (uuid, primary key)
      - `athlete_id` (uuid, foreign key to profiles)
      - `title` (text)
      - `description` (text)
      - `budget_needed` (text)
      - `duration` (text)
      - `target_audience` (text)
      - `status` (text: 'draft', 'published', 'active', 'completed')
      - `views` (integer)
      - `interested_sponsors` (integer)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for athletes and companies to manage their data
*/

-- Create sponsoring_offers table
CREATE TABLE IF NOT EXISTS sponsoring_offers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  budget_range text NOT NULL,
  duration text NOT NULL,
  location text NOT NULL,
  sport_category text NOT NULL,
  status text DEFAULT 'active' CHECK (status IN ('active', 'closed', 'draft')),
  views integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE sponsoring_offers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Companies can view all active offers"
  ON sponsoring_offers FOR SELECT
  TO authenticated
  USING (status = 'active' OR company_id = auth.uid());

CREATE POLICY "Athletes can view active offers"
  ON sponsoring_offers FOR SELECT
  TO authenticated
  USING (status = 'active');

CREATE POLICY "Companies can create offers"
  ON sponsoring_offers FOR INSERT
  TO authenticated
  WITH CHECK (company_id = auth.uid());

CREATE POLICY "Companies can update own offers"
  ON sponsoring_offers FOR UPDATE
  TO authenticated
  USING (company_id = auth.uid())
  WITH CHECK (company_id = auth.uid());

CREATE POLICY "Companies can delete own offers"
  ON sponsoring_offers FOR DELETE
  TO authenticated
  USING (company_id = auth.uid());

-- Create sponsoring_requests table
CREATE TABLE IF NOT EXISTS sponsoring_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  athlete_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  offer_id uuid REFERENCES sponsoring_offers(id) ON DELETE CASCADE NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  budget_proposed text NOT NULL,
  message text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(athlete_id, offer_id)
);

ALTER TABLE sponsoring_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Athletes can view own requests"
  ON sponsoring_requests FOR SELECT
  TO authenticated
  USING (athlete_id = auth.uid());

CREATE POLICY "Companies can view requests for their offers"
  ON sponsoring_requests FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM sponsoring_offers
      WHERE sponsoring_offers.id = sponsoring_requests.offer_id
      AND sponsoring_offers.company_id = auth.uid()
    )
  );

CREATE POLICY "Athletes can create requests"
  ON sponsoring_requests FOR INSERT
  TO authenticated
  WITH CHECK (athlete_id = auth.uid());

CREATE POLICY "Athletes can update own requests"
  ON sponsoring_requests FOR UPDATE
  TO authenticated
  USING (athlete_id = auth.uid())
  WITH CHECK (athlete_id = auth.uid());

CREATE POLICY "Companies can update requests status"
  ON sponsoring_requests FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM sponsoring_offers
      WHERE sponsoring_offers.id = sponsoring_requests.offer_id
      AND sponsoring_offers.company_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM sponsoring_offers
      WHERE sponsoring_offers.id = sponsoring_requests.offer_id
      AND sponsoring_offers.company_id = auth.uid()
    )
  );

CREATE POLICY "Athletes can delete own requests"
  ON sponsoring_requests FOR DELETE
  TO authenticated
  USING (athlete_id = auth.uid());

-- Create sponsor_kits table
CREATE TABLE IF NOT EXISTS sponsor_kits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  athlete_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
  title text NOT NULL,
  description text,
  achievements text,
  audience text,
  social_media jsonb DEFAULT '{}'::jsonb,
  statistics jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE sponsor_kits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Athletes can view own kit"
  ON sponsor_kits FOR SELECT
  TO authenticated
  USING (athlete_id = auth.uid());

CREATE POLICY "Companies can view all kits"
  ON sponsor_kits FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Athletes can create own kit"
  ON sponsor_kits FOR INSERT
  TO authenticated
  WITH CHECK (athlete_id = auth.uid());

CREATE POLICY "Athletes can update own kit"
  ON sponsor_kits FOR UPDATE
  TO authenticated
  USING (athlete_id = auth.uid())
  WITH CHECK (athlete_id = auth.uid());

CREATE POLICY "Athletes can delete own kit"
  ON sponsor_kits FOR DELETE
  TO authenticated
  USING (athlete_id = auth.uid());

-- Create presentation_letters table
CREATE TABLE IF NOT EXISTS presentation_letters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  athlete_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  is_default boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE presentation_letters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Athletes can view own letters"
  ON presentation_letters FOR SELECT
  TO authenticated
  USING (athlete_id = auth.uid());

CREATE POLICY "Athletes can create own letters"
  ON presentation_letters FOR INSERT
  TO authenticated
  WITH CHECK (athlete_id = auth.uid());

CREATE POLICY "Athletes can update own letters"
  ON presentation_letters FOR UPDATE
  TO authenticated
  USING (athlete_id = auth.uid())
  WITH CHECK (athlete_id = auth.uid());

CREATE POLICY "Athletes can delete own letters"
  ON presentation_letters FOR DELETE
  TO authenticated
  USING (athlete_id = auth.uid());

-- Create sponsoring_projects table
CREATE TABLE IF NOT EXISTS sponsoring_projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  athlete_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  budget_needed text NOT NULL,
  duration text NOT NULL,
  target_audience text NOT NULL,
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'active', 'completed')),
  views integer DEFAULT 0,
  interested_sponsors integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE sponsoring_projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Athletes can view own projects"
  ON sponsoring_projects FOR SELECT
  TO authenticated
  USING (athlete_id = auth.uid());

CREATE POLICY "Companies can view published projects"
  ON sponsoring_projects FOR SELECT
  TO authenticated
  USING (status IN ('published', 'active', 'completed'));

CREATE POLICY "Athletes can create own projects"
  ON sponsoring_projects FOR INSERT
  TO authenticated
  WITH CHECK (athlete_id = auth.uid());

CREATE POLICY "Athletes can update own projects"
  ON sponsoring_projects FOR UPDATE
  TO authenticated
  USING (athlete_id = auth.uid())
  WITH CHECK (athlete_id = auth.uid());

CREATE POLICY "Athletes can delete own projects"
  ON sponsoring_projects FOR DELETE
  TO authenticated
  USING (athlete_id = auth.uid());

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_sponsoring_offers_company_id ON sponsoring_offers(company_id);
CREATE INDEX IF NOT EXISTS idx_sponsoring_offers_status ON sponsoring_offers(status);
CREATE INDEX IF NOT EXISTS idx_sponsoring_requests_athlete_id ON sponsoring_requests(athlete_id);
CREATE INDEX IF NOT EXISTS idx_sponsoring_requests_offer_id ON sponsoring_requests(offer_id);
CREATE INDEX IF NOT EXISTS idx_sponsor_kits_athlete_id ON sponsor_kits(athlete_id);
CREATE INDEX IF NOT EXISTS idx_presentation_letters_athlete_id ON presentation_letters(athlete_id);
CREATE INDEX IF NOT EXISTS idx_sponsoring_projects_athlete_id ON sponsoring_projects(athlete_id);
CREATE INDEX IF NOT EXISTS idx_sponsoring_projects_status ON sponsoring_projects(status);
