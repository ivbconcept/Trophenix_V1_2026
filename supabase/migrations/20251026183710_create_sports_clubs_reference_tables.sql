/*
  # Create Sports and Clubs Reference Tables

  1. New Tables
    - `sports_reference`
      - `id` (uuid, primary key)
      - `name` (text, unique) - Nom du sport
      - `category` (text) - Catégorie (olympique été/hiver, paralympique, autre)
      - `display_order` (integer) - Ordre d'affichage (9999 pour "Autre")
      - `created_at` (timestamptz)

    - `clubs_reference`
      - `id` (uuid, primary key)
      - `name` (text, unique) - Nom du club
      - `sport_category` (text) - Catégorie de sport
      - `city` (text) - Ville principale
      - `display_order` (integer) - Ordre d'affichage (9999 pour "Autre club")
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Allow public read access (référence data)
    - Only admins can write

  3. Data Population
    - Insert all sports with "Autre" last
    - Insert all clubs with "Autre club" last
*/

-- Create sports_reference table
CREATE TABLE IF NOT EXISTS sports_reference (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  category text NOT NULL DEFAULT 'autre',
  display_order integer NOT NULL DEFAULT 1000,
  created_at timestamptz DEFAULT now()
);

-- Create clubs_reference table
CREATE TABLE IF NOT EXISTS clubs_reference (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  sport_category text DEFAULT 'multisports',
  city text,
  display_order integer NOT NULL DEFAULT 1000,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE sports_reference ENABLE ROW LEVEL SECURITY;
ALTER TABLE clubs_reference ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Public read access
CREATE POLICY "Allow public read access to sports"
  ON sports_reference FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public read access to clubs"
  ON clubs_reference FOR SELECT
  TO public
  USING (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_sports_display_order ON sports_reference(display_order);
CREATE INDEX IF NOT EXISTS idx_sports_category ON sports_reference(category);
CREATE INDEX IF NOT EXISTS idx_clubs_display_order ON clubs_reference(display_order);
CREATE INDEX IF NOT EXISTS idx_clubs_sport_category ON clubs_reference(sport_category);
CREATE INDEX IF NOT EXISTS idx_clubs_name_search ON clubs_reference USING gin(to_tsvector('french', name));

-- Insert sports olympiques été (display_order: 100-199)
INSERT INTO sports_reference (name, category, display_order) VALUES
('Football', 'olympique_ete', 100),
('Basketball', 'olympique_ete', 101),
('Basketball 3x3', 'olympique_ete', 102),
('Volleyball', 'olympique_ete', 103),
('Beach-volley', 'olympique_ete', 104),
('Handball', 'olympique_ete', 105),
('Rugby à 7', 'olympique_ete', 106),
('Hockey sur gazon', 'olympique_ete', 107),
('Water-polo', 'olympique_ete', 108),
('Tennis', 'olympique_ete', 109),
('Tennis de table', 'olympique_ete', 110),
('Badminton', 'olympique_ete', 111),
('Boxe', 'olympique_ete', 112),
('Judo', 'olympique_ete', 113),
('Karaté', 'olympique_ete', 114),
('Taekwondo', 'olympique_ete', 115),
('Lutte libre', 'olympique_ete', 116),
('Lutte gréco-romaine', 'olympique_ete', 117),
('Escrime', 'olympique_ete', 118),
('Athlétisme', 'olympique_ete', 119),
('Marathon', 'olympique_ete', 120),
('Marche athlétique', 'olympique_ete', 121),
('Natation', 'olympique_ete', 122),
('Natation artistique', 'olympique_ete', 123),
('Plongeon', 'olympique_ete', 124),
('Nage en eau libre', 'olympique_ete', 125),
('Aviron', 'olympique_ete', 126),
('Canoë-kayak', 'olympique_ete', 127),
('Voile', 'olympique_ete', 128),
('Surf', 'olympique_ete', 129),
('Cyclisme sur route', 'olympique_ete', 130),
('Cyclisme sur piste', 'olympique_ete', 131),
('VTT', 'olympique_ete', 132),
('BMX freestyle', 'olympique_ete', 133),
('BMX racing', 'olympique_ete', 134),
('Gymnastique artistique', 'olympique_ete', 135),
('Gymnastique rythmique', 'olympique_ete', 136),
('Trampoline', 'olympique_ete', 137),
('Équitation - Dressage', 'olympique_ete', 138),
('Équitation - Saut d''obstacles', 'olympique_ete', 139),
('Équitation - Concours complet', 'olympique_ete', 140),
('Tir à l''arc', 'olympique_ete', 141),
('Tir sportif', 'olympique_ete', 142),
('Golf', 'olympique_ete', 143),
('Breaking', 'olympique_ete', 144),
('Skateboard', 'olympique_ete', 145),
('Escalade sportive', 'olympique_ete', 146),
('Triathlon', 'olympique_ete', 147),
('Pentathlon moderne', 'olympique_ete', 148),
('Haltérophilie', 'olympique_ete', 149)
ON CONFLICT (name) DO NOTHING;

-- Insert sports olympiques hiver (display_order: 200-299)
INSERT INTO sports_reference (name, category, display_order) VALUES
('Patinage artistique', 'olympique_hiver', 200),
('Patinage de vitesse', 'olympique_hiver', 201),
('Short-track', 'olympique_hiver', 202),
('Hockey sur glace', 'olympique_hiver', 203),
('Curling', 'olympique_hiver', 204),
('Ski alpin - Descente', 'olympique_hiver', 205),
('Ski alpin - Slalom', 'olympique_hiver', 206),
('Ski alpin - Slalom géant', 'olympique_hiver', 207),
('Ski alpin - Super-G', 'olympique_hiver', 208),
('Ski alpin - Combiné', 'olympique_hiver', 209),
('Ski de fond', 'olympique_hiver', 210),
('Biathlon', 'olympique_hiver', 211),
('Saut à ski', 'olympique_hiver', 212),
('Combiné nordique', 'olympique_hiver', 213),
('Ski acrobatique', 'olympique_hiver', 214),
('Snowboard', 'olympique_hiver', 215),
('Bobsleigh', 'olympique_hiver', 216),
('Skeleton', 'olympique_hiver', 217),
('Luge', 'olympique_hiver', 218)
ON CONFLICT (name) DO NOTHING;

-- Insert autres sports populaires (display_order: 300-899)
INSERT INTO sports_reference (name, category, display_order) VALUES
('Futsal', 'autre', 300),
('Beach soccer', 'autre', 301),
('Volleyball en salle', 'autre', 302),
('Rugby à XV', 'autre', 303),
('Football américain', 'autre', 304),
('Baseball', 'autre', 305),
('Cricket', 'autre', 306),
('MMA', 'autre', 307),
('Kick-boxing', 'autre', 308),
('Muay Thaï', 'autre', 309),
('Jiu-jitsu brésilien', 'autre', 310),
('Krav maga', 'autre', 311),
('Capoeira', 'autre', 312),
('Aïkido', 'autre', 313),
('Kung-fu', 'autre', 314),
('Sambo', 'autre', 315),
('Planche à voile', 'autre', 316),
('Kitesurf', 'autre', 317),
('Stand-up paddle', 'autre', 318),
('Jet-ski', 'autre', 319),
('Ski nautique', 'autre', 320),
('Wakeboard', 'autre', 321),
('Rafting', 'autre', 322),
('Canyoning', 'autre', 323),
('Kayak de mer', 'autre', 324),
('Plongée sous-marine', 'autre', 325),
('Alpinisme', 'autre', 326),
('Randonnée', 'autre', 327),
('Trail running', 'autre', 328),
('Via ferrata', 'autre', 329),
('Parapente', 'autre', 330),
('Deltaplane', 'autre', 331),
('Karting', 'autre', 332),
('Rallye', 'autre', 333),
('Moto GP', 'autre', 334),
('Motocross', 'autre', 335),
('Parkour', 'autre', 336),
('Roller', 'autre', 337),
('Trottinette freestyle', 'autre', 338),
('Street workout', 'autre', 339),
('Squash', 'autre', 340),
('Padel', 'autre', 341),
('Racquetball', 'autre', 342),
('Pickleball', 'autre', 343),
('Ultimate frisbee', 'autre', 344),
('Tchoukball', 'autre', 345),
('Kin-ball', 'autre', 346),
('Dodgeball', 'autre', 347),
('Danse sportive', 'autre', 348),
('Pole dance', 'autre', 349),
('CrossFit', 'autre', 350),
('Fitness', 'autre', 351),
('Musculation', 'autre', 352),
('Yoga', 'autre', 353),
('Pilates', 'autre', 354),
('Zumba', 'autre', 355),
('Équitation western', 'autre', 356),
('Endurance équestre', 'autre', 357),
('Polo', 'autre', 358),
('Horse-ball', 'autre', 359),
('Tir à la cible', 'autre', 360),
('Ball-trap', 'autre', 361),
('Pétanque', 'autre', 362),
('Bowling', 'autre', 363),
('Billard', 'autre', 364),
('Fléchettes', 'autre', 365),
('E-sport', 'autre', 366),
('Échecs', 'autre', 367),
('Bridge', 'autre', 368)
ON CONFLICT (name) DO NOTHING;

-- Insert "Autre" en dernier (display_order: 9999)
INSERT INTO sports_reference (name, category, display_order) VALUES
('Autre', 'autre', 9999)
ON CONFLICT (name) DO NOTHING;

-- Insert "Autre club" en dernier (display_order: 9999)
INSERT INTO clubs_reference (name, sport_category, display_order) VALUES
('Autre club', 'multisports', 9999)
ON CONFLICT (name) DO NOTHING;
