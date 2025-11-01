/*
  # Create News System

  1. New Tables
    - `news`
      - `id` (uuid, primary key)
      - `title` (text, required)
      - `content` (text, required)
      - `category` (text, optional)
      - `published_at` (timestamptz)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      - `author_id` (uuid, foreign key to auth.users)
      - `is_published` (boolean, default true)

  2. Security
    - Enable RLS on `news` table
    - Add policy for all authenticated users to read published news
*/

CREATE TABLE IF NOT EXISTS news (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  category text DEFAULT 'general',
  published_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  author_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  is_published boolean DEFAULT true
);

ALTER TABLE news ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read published news"
  ON news
  FOR SELECT
  TO authenticated
  USING (is_published = true);

-- Insert some sample news
INSERT INTO news (title, content, category, is_published) VALUES
  ('Bienvenue sur Trophenix !', 'Nous sommes ravis de vous accueillir sur notre plateforme de mise en relation entre athlètes et entreprises.', 'annonce', true),
  ('Nouveau partenariat avec Nike', 'Trophenix annonce un partenariat stratégique avec Nike pour accompagner les athlètes dans leur reconversion.', 'partenariat', true),
  ('Mise à jour de la plateforme', 'De nouvelles fonctionnalités ont été ajoutées pour améliorer votre expérience utilisateur.', 'technique', true),
  ('Atelier de formation', 'Inscrivez-vous à nos prochains ateliers de formation pour optimiser votre profil et vos candidatures.', 'événement', true),
  ('Success Story', 'Découvrez comment Marie, ancienne athlète de haut niveau, a trouvé sa voie dans le marketing digital grâce à Trophenix.', 'success', true);
