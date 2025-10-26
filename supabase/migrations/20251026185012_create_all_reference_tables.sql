/*
  # Create All Reference Tables for Platform Data

  1. New Tables
    - `sectors_reference` - Secteurs d'activité professionnels
    - `locations_reference` - Zones géographiques
    - `cities_reference` - Villes de France
    - `sport_levels_reference` - Niveaux sportifs
    - `contract_types_reference` - Types de contrats
    - `position_types_reference` - Types de postes
    - `availability_reference` - Disponibilités
    - `situations_reference` - Situations des athlètes
    - `athlete_types_reference` - Types de sportifs
    - `company_sizes_reference` - Tailles d'entreprises
    - `sponsorship_types_reference` - Types de sponsoring
    - `athlete_levels_reference` - Niveaux d'athlètes pour sponsors
    - `sponsorship_budgets_reference` - Budgets de sponsoring

  2. Security
    - Enable RLS on all tables
    - Allow public read access (reference data)
    - Only admins can write

  3. Data Population
    - Insert all data with "Autre" last (display_order: 9999)
*/

-- ==========================================
-- SECTORS (Secteurs d'activité)
-- ==========================================
CREATE TABLE IF NOT EXISTS sectors_reference (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  category text DEFAULT 'general',
  display_order integer NOT NULL DEFAULT 1000,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE sectors_reference ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to sectors"
  ON sectors_reference FOR SELECT TO public USING (true);

CREATE INDEX IF NOT EXISTS idx_sectors_display_order ON sectors_reference(display_order);

INSERT INTO sectors_reference (name, display_order) VALUES
('Commercial / Vente', 10),
('Marketing / Communication', 20),
('Management / Direction', 30),
('Ressources Humaines', 40),
('Finance / Comptabilité', 50),
('Logistique / Supply Chain', 60),
('Conseil / Stratégie', 70),
('Événementiel', 80),
('Sport Business', 90),
('Éducation / Formation', 100),
('Santé / Bien-être', 110),
('Digital / Tech', 120),
('Entrepreneuriat', 130),
('Autre', 9999)
ON CONFLICT (name) DO NOTHING;

-- ==========================================
-- LOCATIONS (Zones géographiques)
-- ==========================================
CREATE TABLE IF NOT EXISTS locations_reference (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  category text DEFAULT 'city',
  display_order integer NOT NULL DEFAULT 1000,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE locations_reference ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to locations"
  ON locations_reference FOR SELECT TO public USING (true);

CREATE INDEX IF NOT EXISTS idx_locations_display_order ON locations_reference(display_order);

INSERT INTO locations_reference (name, category, display_order) VALUES
('Paris', 'city', 10),
('Lyon', 'city', 20),
('Marseille', 'city', 30),
('Toulouse', 'city', 40),
('Bordeaux', 'city', 50),
('Lille', 'city', 60),
('Nantes', 'city', 70),
('Strasbourg', 'city', 80),
('Montpellier', 'city', 90),
('Nice', 'city', 100),
('Rennes', 'city', 110),
('Télétravail complet', 'remote', 200),
('Flexible / Hybride', 'remote', 210),
('Toute la France', 'region', 220),
('Étranger', 'international', 230)
ON CONFLICT (name) DO NOTHING;

-- ==========================================
-- CITIES (Villes de France)
-- ==========================================
CREATE TABLE IF NOT EXISTS cities_reference (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  region text,
  display_order integer NOT NULL DEFAULT 1000,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE cities_reference ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to cities"
  ON cities_reference FOR SELECT TO public USING (true);

CREATE INDEX IF NOT EXISTS idx_cities_display_order ON cities_reference(display_order);
CREATE INDEX IF NOT EXISTS idx_cities_name_search ON cities_reference USING gin(to_tsvector('french', name));

INSERT INTO cities_reference (name, region, display_order) VALUES
('Paris', 'Île-de-France', 10),
('Lyon', 'Auvergne-Rhône-Alpes', 20),
('Marseille', 'Provence-Alpes-Côte d''Azur', 30),
('Toulouse', 'Occitanie', 40),
('Bordeaux', 'Nouvelle-Aquitaine', 50),
('Lille', 'Hauts-de-France', 60),
('Nantes', 'Pays de la Loire', 70),
('Strasbourg', 'Grand Est', 80),
('Montpellier', 'Occitanie', 90),
('Nice', 'Provence-Alpes-Côte d''Azur', 100),
('Rennes', 'Bretagne', 110),
('Reims', 'Grand Est', 120),
('Saint-Étienne', 'Auvergne-Rhône-Alpes', 130),
('Toulon', 'Provence-Alpes-Côte d''Azur', 140),
('Le Havre', 'Normandie', 150),
('Grenoble', 'Auvergne-Rhône-Alpes', 160),
('Dijon', 'Bourgogne-Franche-Comté', 170),
('Angers', 'Pays de la Loire', 180),
('Nîmes', 'Occitanie', 190),
('Villeurbanne', 'Auvergne-Rhône-Alpes', 200),
('Clermont-Ferrand', 'Auvergne-Rhône-Alpes', 210),
('Le Mans', 'Pays de la Loire', 220),
('Aix-en-Provence', 'Provence-Alpes-Côte d''Azur', 230),
('Brest', 'Bretagne', 240),
('Tours', 'Centre-Val de Loire', 250),
('Amiens', 'Hauts-de-France', 260),
('Limoges', 'Nouvelle-Aquitaine', 270),
('Annecy', 'Auvergne-Rhône-Alpes', 280),
('Perpignan', 'Occitanie', 290),
('Metz', 'Grand Est', 300)
ON CONFLICT (name) DO NOTHING;

-- ==========================================
-- SPORT LEVELS (Niveaux sportifs)
-- ==========================================
CREATE TABLE IF NOT EXISTS sport_levels_reference (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  display_order integer NOT NULL DEFAULT 1000,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE sport_levels_reference ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to sport levels"
  ON sport_levels_reference FOR SELECT TO public USING (true);

INSERT INTO sport_levels_reference (name, display_order) VALUES
('International', 10),
('National', 20),
('Régional', 30),
('Professionnel', 40),
('Semi-professionnel', 50),
('Amateur haut niveau', 60)
ON CONFLICT (name) DO NOTHING;

-- ==========================================
-- CONTRACT TYPES (Types de contrats)
-- ==========================================
CREATE TABLE IF NOT EXISTS contract_types_reference (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  display_order integer NOT NULL DEFAULT 1000,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE contract_types_reference ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to contract types"
  ON contract_types_reference FOR SELECT TO public USING (true);

INSERT INTO contract_types_reference (name, display_order) VALUES
('CDI', 10),
('CDD', 20),
('Stage', 30),
('Alternance', 40),
('Freelance', 50)
ON CONFLICT (name) DO NOTHING;

-- ==========================================
-- POSITION TYPES (Types de postes)
-- ==========================================
CREATE TABLE IF NOT EXISTS position_types_reference (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  display_order integer NOT NULL DEFAULT 1000,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE position_types_reference ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to position types"
  ON position_types_reference FOR SELECT TO public USING (true);

INSERT INTO position_types_reference (name, display_order) VALUES
('Temps plein', 10),
('Temps partiel', 20),
('Freelance', 30),
('Stage', 40),
('Alternance', 50)
ON CONFLICT (name) DO NOTHING;

-- ==========================================
-- AVAILABILITY (Disponibilités)
-- ==========================================
CREATE TABLE IF NOT EXISTS availability_reference (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  display_order integer NOT NULL DEFAULT 1000,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE availability_reference ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to availability"
  ON availability_reference FOR SELECT TO public USING (true);

INSERT INTO availability_reference (name, display_order) VALUES
('Immédiate', 10),
('1 mois', 20),
('2-3 mois', 30),
('6 mois', 40),
('1 an', 50),
('En réflexion', 60)
ON CONFLICT (name) DO NOTHING;

-- ==========================================
-- SITUATIONS (Situations des athlètes)
-- ==========================================
CREATE TABLE IF NOT EXISTS situations_reference (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  display_order integer NOT NULL DEFAULT 1000,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE situations_reference ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to situations"
  ON situations_reference FOR SELECT TO public USING (true);

INSERT INTO situations_reference (name, display_order) VALUES
('En activité', 10),
('En blessure', 20),
('En hésitation', 30),
('En transition', 40),
('En reconversion', 50),
('Déjà reconverti', 60)
ON CONFLICT (name) DO NOTHING;

-- ==========================================
-- ATHLETE TYPES (Types de sportifs)
-- ==========================================
CREATE TABLE IF NOT EXISTS athlete_types_reference (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  display_order integer NOT NULL DEFAULT 1000,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE athlete_types_reference ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to athlete types"
  ON athlete_types_reference FOR SELECT TO public USING (true);

INSERT INTO athlete_types_reference (name, display_order) VALUES
('Handisportif', 10),
('Sportif valide', 20)
ON CONFLICT (name) DO NOTHING;

-- ==========================================
-- COMPANY SIZES (Tailles d'entreprises)
-- ==========================================
CREATE TABLE IF NOT EXISTS company_sizes_reference (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  display_order integer NOT NULL DEFAULT 1000,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE company_sizes_reference ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to company sizes"
  ON company_sizes_reference FOR SELECT TO public USING (true);

INSERT INTO company_sizes_reference (name, display_order) VALUES
('1-10 employés', 10),
('11-50 employés', 20),
('51-200 employés', 30),
('201-500 employés', 40),
('501-1000 employés', 50),
('1000+ employés', 60)
ON CONFLICT (name) DO NOTHING;

-- ==========================================
-- SPONSORSHIP TYPES (Types de sponsoring)
-- ==========================================
CREATE TABLE IF NOT EXISTS sponsorship_types_reference (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  display_order integer NOT NULL DEFAULT 1000,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE sponsorship_types_reference ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to sponsorship types"
  ON sponsorship_types_reference FOR SELECT TO public USING (true);

INSERT INTO sponsorship_types_reference (name, display_order) VALUES
('Sponsoring financier', 10),
('Sponsoring matériel', 20),
('Sponsoring technique', 30),
('Visibilité / Communication', 40),
('Événementiel', 50),
('Partenariat à long terme', 60)
ON CONFLICT (name) DO NOTHING;

-- ==========================================
-- ATHLETE LEVELS for Sponsors (Niveaux d'athlètes)
-- ==========================================
CREATE TABLE IF NOT EXISTS athlete_levels_reference (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  display_order integer NOT NULL DEFAULT 1000,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE athlete_levels_reference ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to athlete levels"
  ON athlete_levels_reference FOR SELECT TO public USING (true);

INSERT INTO athlete_levels_reference (name, display_order) VALUES
('International / Olympique', 10),
('National', 20),
('Régional', 30),
('Professionnel', 40),
('Amateur haut niveau', 50),
('Espoir / Jeune talent', 60)
ON CONFLICT (name) DO NOTHING;

-- ==========================================
-- SPONSORSHIP BUDGETS (Budgets de sponsoring)
-- ==========================================
CREATE TABLE IF NOT EXISTS sponsorship_budgets_reference (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  display_order integer NOT NULL DEFAULT 1000,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE sponsorship_budgets_reference ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to sponsorship budgets"
  ON sponsorship_budgets_reference FOR SELECT TO public USING (true);

INSERT INTO sponsorship_budgets_reference (name, display_order) VALUES
('Moins de 10 000€', 10),
('10 000€ - 50 000€', 20),
('50 000€ - 100 000€', 30),
('100 000€ - 500 000€', 40),
('500 000€ - 1M€', 50),
('Plus de 1M€', 60),
('Budget variable', 70)
ON CONFLICT (name) DO NOTHING;
