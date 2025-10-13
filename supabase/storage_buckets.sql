/*
  Configuration des buckets Supabase Storage pour l'architecture IA

  Ces buckets doivent être créés manuellement via l'interface Supabase
  ou via le CLI Supabase.

  BUCKETS À CRÉER :

  1. agent_attachments
     - Description: Fichiers joints par les utilisateurs (CV, documents, images)
     - Public: Non
     - File size limit: 10MB
     - Allowed MIME types: application/pdf, image/*, application/msword, application/vnd.openxmlformats-officedocument.*

  2. agent_voice_messages
     - Description: Messages vocaux enregistrés par les utilisateurs
     - Public: Non
     - File size limit: 5MB
     - Allowed MIME types: audio/*

  3. agent_generated_files
     - Description: Fichiers générés par les agents IA (rapports, analyses, etc.)
     - Public: Non
     - File size limit: 10MB
     - Allowed MIME types: application/pdf, text/*, application/json

  POLITIQUES RLS POUR LES BUCKETS :

  Pour tous les buckets :
  - Les utilisateurs authentifiés peuvent uploader des fichiers
  - Les utilisateurs peuvent lire leurs propres fichiers
  - Les utilisateurs peuvent supprimer leurs propres fichiers
  - La structure des chemins : user_id/session_id/filename
*/

-- Politique de sécurité pour agent_attachments
-- SELECT
CREATE POLICY "Users can view own attachments"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'agent_attachments' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- INSERT
CREATE POLICY "Users can upload attachments"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'agent_attachments' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- UPDATE
CREATE POLICY "Users can update own attachments"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'agent_attachments' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- DELETE
CREATE POLICY "Users can delete own attachments"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'agent_attachments' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Politique de sécurité pour agent_voice_messages
-- SELECT
CREATE POLICY "Users can view own voice messages"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'agent_voice_messages' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- INSERT
CREATE POLICY "Users can upload voice messages"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'agent_voice_messages' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- DELETE
CREATE POLICY "Users can delete own voice messages"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'agent_voice_messages' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Politique de sécurité pour agent_generated_files
-- SELECT
CREATE POLICY "Users can view own generated files"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'agent_generated_files' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- INSERT (pour les agents/système)
CREATE POLICY "System can upload generated files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'agent_generated_files'
);

-- DELETE
CREATE POLICY "Users can delete own generated files"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'agent_generated_files' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

/*
  INSTRUCTIONS DE CRÉATION VIA INTERFACE SUPABASE :

  1. Aller dans Storage > Create a new bucket
  2. Créer chaque bucket avec les configurations ci-dessus
  3. Appliquer les politiques RLS en allant dans Policies pour chaque bucket

  OU VIA CODE (dans le dashboard SQL editor) :

  -- Créer les buckets
  INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
  VALUES
    ('agent_attachments', 'agent_attachments', false, 10485760, ARRAY['application/pdf', 'image/*', 'application/msword', 'application/vnd.openxmlformats-officedocument.*']),
    ('agent_voice_messages', 'agent_voice_messages', false, 5242880, ARRAY['audio/*']),
    ('agent_generated_files', 'agent_generated_files', false, 10485760, ARRAY['application/pdf', 'text/*', 'application/json']);
*/
