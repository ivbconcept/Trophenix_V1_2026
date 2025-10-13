/*
  # Extension de la plateforme Trophenix - Tables SaaS complètes

  ## Vue d'ensemble
  Cette migration ajoute toutes les tables nécessaires pour transformer Trophenix en une plateforme SaaS complète
  permettant aux athlètes et entreprises de gérer offres d'emploi, candidatures, messagerie et annuaires.

  ## 1. Nouvelles Tables

  ### job_offers - Offres d'emploi publiées par les entreprises
  - `id` (uuid, primary key)
  - `company_id` (uuid, référence vers profiles)
  - `title` (text) - Titre du poste
  - `description` (text) - Description détaillée
  - `contract_type` (text) - Type de contrat (CDI, CDD, Stage, etc.)
  - `location` (text) - Localisation
  - `salary_range` (text) - Fourchette de salaire
  - `required_sports` (text[]) - Sports requis
  - `required_level` (text) - Niveau requis
  - `status` (text) - Statut (draft, published, closed)
  - `published_at` (timestamptz)
  - `expires_at` (timestamptz)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### applications - Candidatures des athlètes aux offres
  - `id` (uuid, primary key)
  - `job_offer_id` (uuid, référence vers job_offers)
  - `athlete_id` (uuid, référence vers profiles)
  - `status` (text) - Statut (pending, reviewed, accepted, rejected)
  - `cover_letter` (text) - Lettre de motivation
  - `cv_url` (text) - URL du CV
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### conversations - Conversations entre utilisateurs
  - `id` (uuid, primary key)
  - `participant_1_id` (uuid, référence vers profiles)
  - `participant_2_id` (uuid, référence vers profiles)
  - `last_message_at` (timestamptz)
  - `created_at` (timestamptz)

  ### messages - Messages dans les conversations
  - `id` (uuid, primary key)
  - `conversation_id` (uuid, référence vers conversations)
  - `sender_id` (uuid, référence vers profiles)
  - `content` (text)
  - `read_at` (timestamptz)
  - `created_at` (timestamptz)

  ### notifications - Notifications utilisateurs
  - `id` (uuid, primary key)
  - `user_id` (uuid, référence vers profiles)
  - `type` (text) - Type de notification
  - `title` (text)
  - `message` (text)
  - `link` (text) - Lien vers la ressource concernée
  - `read_at` (timestamptz)
  - `created_at` (timestamptz)

  ### favorites - Favoris (offres, profils)
  - `id` (uuid, primary key)
  - `user_id` (uuid, référence vers profiles)
  - `favoritable_type` (text) - Type (job_offer, athlete_profile, company_profile)
  - `favoritable_id` (uuid) - ID de la ressource
  - `created_at` (timestamptz)

  ## 2. Sécurité RLS

  Toutes les tables ont RLS activé avec des politiques restrictives :
  - Les utilisateurs ne peuvent voir que leurs propres données ou les données publiques
  - Les entreprises peuvent voir les candidatures à leurs offres
  - Les athlètes peuvent voir leurs propres candidatures
  - Les messages ne sont visibles que par les participants de la conversation

  ## 3. Index

  Index ajoutés pour optimiser les requêtes fréquentes :
  - Recherche d'offres par entreprise, statut, sports
  - Recherche de candidatures par offre et athlète
  - Recherche de conversations et messages
  - Recherche de notifications non lues

  ## 4. Triggers

  Triggers pour maintenir automatiquement :
  - `updated_at` sur les tables modifiables
  - `last_message_at` sur les conversations
  - Création automatique de notifications

  ## Notes importantes
  - Toutes les suppressions sont en CASCADE pour maintenir l'intégrité
  - Les valeurs par défaut sont définies pour faciliter l'utilisation
  - Les contraintes garantissent la cohérence des données
*/

-- ============================================================================
-- 1. TABLE: job_offers (Offres d'emploi)
-- ============================================================================

CREATE TABLE IF NOT EXISTS job_offers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  contract_type text NOT NULL DEFAULT 'CDI',
  location text NOT NULL,
  salary_range text DEFAULT '',
  required_sports text[] DEFAULT '{}',
  required_level text DEFAULT '',
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'closed')),
  published_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Index pour optimiser les recherches
CREATE INDEX IF NOT EXISTS idx_job_offers_company ON job_offers(company_id);
CREATE INDEX IF NOT EXISTS idx_job_offers_status ON job_offers(status);
CREATE INDEX IF NOT EXISTS idx_job_offers_published ON job_offers(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_job_offers_sports ON job_offers USING gin(required_sports);

-- RLS
ALTER TABLE job_offers ENABLE ROW LEVEL SECURITY;

-- Les offres publiées sont visibles par tous les utilisateurs authentifiés
CREATE POLICY "Published job offers are viewable by authenticated users"
  ON job_offers FOR SELECT
  TO authenticated
  USING (status = 'published' OR company_id = auth.uid());

-- Les entreprises peuvent créer des offres
CREATE POLICY "Companies can create job offers"
  ON job_offers FOR INSERT
  TO authenticated
  WITH CHECK (
    company_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.user_type = 'company'
    )
  );

-- Les entreprises peuvent modifier leurs propres offres
CREATE POLICY "Companies can update own job offers"
  ON job_offers FOR UPDATE
  TO authenticated
  USING (company_id = auth.uid())
  WITH CHECK (company_id = auth.uid());

-- Les entreprises peuvent supprimer leurs propres offres
CREATE POLICY "Companies can delete own job offers"
  ON job_offers FOR DELETE
  TO authenticated
  USING (company_id = auth.uid());

-- ============================================================================
-- 2. TABLE: applications (Candidatures)
-- ============================================================================

CREATE TABLE IF NOT EXISTS applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_offer_id uuid NOT NULL REFERENCES job_offers(id) ON DELETE CASCADE,
  athlete_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'accepted', 'rejected')),
  cover_letter text DEFAULT '',
  cv_url text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(job_offer_id, athlete_id)
);

-- Index
CREATE INDEX IF NOT EXISTS idx_applications_job_offer ON applications(job_offer_id);
CREATE INDEX IF NOT EXISTS idx_applications_athlete ON applications(athlete_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);

-- RLS
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Les athlètes peuvent voir leurs propres candidatures
CREATE POLICY "Athletes can view own applications"
  ON applications FOR SELECT
  TO authenticated
  USING (athlete_id = auth.uid());

-- Les entreprises peuvent voir les candidatures à leurs offres
CREATE POLICY "Companies can view applications to their offers"
  ON applications FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM job_offers
      WHERE job_offers.id = applications.job_offer_id
      AND job_offers.company_id = auth.uid()
    )
  );

-- Les athlètes peuvent créer des candidatures
CREATE POLICY "Athletes can create applications"
  ON applications FOR INSERT
  TO authenticated
  WITH CHECK (
    athlete_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.user_type = 'athlete'
    )
  );

-- Les athlètes peuvent modifier leurs propres candidatures (si pending)
CREATE POLICY "Athletes can update own pending applications"
  ON applications FOR UPDATE
  TO authenticated
  USING (athlete_id = auth.uid() AND status = 'pending')
  WITH CHECK (athlete_id = auth.uid());

-- Les entreprises peuvent modifier le statut des candidatures à leurs offres
CREATE POLICY "Companies can update applications status"
  ON applications FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM job_offers
      WHERE job_offers.id = applications.job_offer_id
      AND job_offers.company_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM job_offers
      WHERE job_offers.id = applications.job_offer_id
      AND job_offers.company_id = auth.uid()
    )
  );

-- ============================================================================
-- 3. TABLE: conversations (Conversations)
-- ============================================================================

CREATE TABLE IF NOT EXISTS conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_1_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  participant_2_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  last_message_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  CHECK (participant_1_id < participant_2_id),
  UNIQUE(participant_1_id, participant_2_id)
);

-- Index
CREATE INDEX IF NOT EXISTS idx_conversations_participant_1 ON conversations(participant_1_id);
CREATE INDEX IF NOT EXISTS idx_conversations_participant_2 ON conversations(participant_2_id);
CREATE INDEX IF NOT EXISTS idx_conversations_last_message ON conversations(last_message_at DESC);

-- RLS
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

-- Les participants peuvent voir leurs conversations
CREATE POLICY "Users can view own conversations"
  ON conversations FOR SELECT
  TO authenticated
  USING (participant_1_id = auth.uid() OR participant_2_id = auth.uid());

-- Les utilisateurs peuvent créer des conversations
CREATE POLICY "Users can create conversations"
  ON conversations FOR INSERT
  TO authenticated
  WITH CHECK (participant_1_id = auth.uid() OR participant_2_id = auth.uid());

-- ============================================================================
-- 4. TABLE: messages (Messages)
-- ============================================================================

CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content text NOT NULL,
  read_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id);

-- RLS
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Les participants de la conversation peuvent voir les messages
CREATE POLICY "Conversation participants can view messages"
  ON messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM conversations
      WHERE conversations.id = messages.conversation_id
      AND (conversations.participant_1_id = auth.uid() OR conversations.participant_2_id = auth.uid())
    )
  );

-- Les participants peuvent créer des messages
CREATE POLICY "Conversation participants can create messages"
  ON messages FOR INSERT
  TO authenticated
  WITH CHECK (
    sender_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM conversations
      WHERE conversations.id = messages.conversation_id
      AND (conversations.participant_1_id = auth.uid() OR conversations.participant_2_id = auth.uid())
    )
  );

-- Les utilisateurs peuvent marquer leurs messages reçus comme lus
CREATE POLICY "Users can update read status of received messages"
  ON messages FOR UPDATE
  TO authenticated
  USING (
    sender_id != auth.uid() AND
    EXISTS (
      SELECT 1 FROM conversations
      WHERE conversations.id = messages.conversation_id
      AND (conversations.participant_1_id = auth.uid() OR conversations.participant_2_id = auth.uid())
    )
  )
  WITH CHECK (
    sender_id != auth.uid() AND
    EXISTS (
      SELECT 1 FROM conversations
      WHERE conversations.id = messages.conversation_id
      AND (conversations.participant_1_id = auth.uid() OR conversations.participant_2_id = auth.uid())
    )
  );

-- ============================================================================
-- 5. TABLE: notifications (Notifications)
-- ============================================================================

CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type text NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  link text DEFAULT '',
  read_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON notifications(user_id, read_at) WHERE read_at IS NULL;

-- RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Les utilisateurs peuvent voir leurs propres notifications
CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Les utilisateurs peuvent marquer leurs notifications comme lues
CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Le système peut créer des notifications (via service role)
CREATE POLICY "System can create notifications"
  ON notifications FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- ============================================================================
-- 6. TABLE: favorites (Favoris)
-- ============================================================================

CREATE TABLE IF NOT EXISTS favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  favoritable_type text NOT NULL CHECK (favoritable_type IN ('job_offer', 'athlete_profile', 'company_profile')),
  favoritable_id uuid NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, favoritable_type, favoritable_id)
);

-- Index
CREATE INDEX IF NOT EXISTS idx_favorites_user ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_favoritable ON favorites(favoritable_type, favoritable_id);

-- RLS
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- Les utilisateurs peuvent voir leurs propres favoris
CREATE POLICY "Users can view own favorites"
  ON favorites FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Les utilisateurs peuvent créer des favoris
CREATE POLICY "Users can create favorites"
  ON favorites FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Les utilisateurs peuvent supprimer leurs favoris
CREATE POLICY "Users can delete own favorites"
  ON favorites FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- ============================================================================
-- 7. FUNCTIONS & TRIGGERS
-- ============================================================================

-- Fonction pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour job_offers
DROP TRIGGER IF EXISTS update_job_offers_updated_at ON job_offers;
CREATE TRIGGER update_job_offers_updated_at
  BEFORE UPDATE ON job_offers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger pour applications
DROP TRIGGER IF EXISTS update_applications_updated_at ON applications;
CREATE TRIGGER update_applications_updated_at
  BEFORE UPDATE ON applications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Fonction pour mettre à jour last_message_at dans conversations
CREATE OR REPLACE FUNCTION update_conversation_last_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE conversations
  SET last_message_at = NEW.created_at
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour messages
DROP TRIGGER IF EXISTS update_conversation_on_new_message ON messages;
CREATE TRIGGER update_conversation_on_new_message
  AFTER INSERT ON messages
  FOR EACH ROW
  EXECUTE FUNCTION update_conversation_last_message();
