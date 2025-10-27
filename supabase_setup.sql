-- ============================================
-- SCRIPT DE CRÉATION DE TOUTES LES TABLES
-- À EXÉCUTER DANS VOTRE SUPABASE SQL EDITOR
-- Projet: bcocnhtxmzjlhjtzyltq
-- ============================================

-- 1. TABLE PROFILES (utilisateurs principaux)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text,
  user_type text NOT NULL CHECK (user_type IN ('athlete', 'company', 'sponsor', 'admin')),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'suspended')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

-- 2. TABLE ATHLETES
CREATE TABLE IF NOT EXISTS athletes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  sport text,
  level text,
  achievements text,
  available_for_work boolean DEFAULT true,
  bio text,
  location text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE athletes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Athletes can view own data" ON athletes FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Athletes can update own data" ON athletes FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Athletes can insert own data" ON athletes FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Public can view active athletes" ON athletes FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = athletes.user_id AND profiles.status = 'active')
);

-- 3. TABLE COMPANIES
CREATE TABLE IF NOT EXISTS companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  company_name text NOT NULL,
  industry text,
  size text,
  description text,
  website text,
  location text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE companies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Companies can view own data" ON companies FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Companies can update own data" ON companies FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Companies can insert own data" ON companies FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Public can view active companies" ON companies FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = companies.user_id AND profiles.status = 'active')
);

-- 4. TABLE SPONSORS
CREATE TABLE IF NOT EXISTS sponsors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  organization_name text NOT NULL,
  sponsorship_budget text,
  interests text,
  description text,
  website text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE sponsors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Sponsors can view own data" ON sponsors FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Sponsors can update own data" ON sponsors FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Sponsors can insert own data" ON sponsors FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- 5. TABLE JOBS (offres d'emploi)
CREATE TABLE IF NOT EXISTS jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES companies(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  location text,
  job_type text,
  salary_range text,
  requirements text,
  status text DEFAULT 'open' CHECK (status IN ('open', 'closed', 'filled')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view open jobs" ON jobs FOR SELECT TO authenticated USING (status = 'open');
CREATE POLICY "Company can manage own jobs" ON jobs FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM companies WHERE companies.id = jobs.company_id AND companies.user_id = auth.uid())
);

-- 6. TABLE APPLICATIONS (candidatures)
CREATE TABLE IF NOT EXISTS applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid REFERENCES jobs(id) ON DELETE CASCADE,
  athlete_id uuid REFERENCES athletes(id) ON DELETE CASCADE,
  cover_letter text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'accepted', 'rejected')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(job_id, athlete_id)
);

ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Athletes can view own applications" ON applications FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM athletes WHERE athletes.id = applications.athlete_id AND athletes.user_id = auth.uid())
);
CREATE POLICY "Athletes can create applications" ON applications FOR INSERT TO authenticated WITH CHECK (
  EXISTS (SELECT 1 FROM athletes WHERE athletes.id = applications.athlete_id AND athletes.user_id = auth.uid())
);
CREATE POLICY "Companies can view applications for their jobs" ON applications FOR SELECT TO authenticated USING (
  EXISTS (
    SELECT 1 FROM jobs
    JOIN companies ON companies.id = jobs.company_id
    WHERE jobs.id = applications.job_id AND companies.user_id = auth.uid()
  )
);
CREATE POLICY "Companies can update applications" ON applications FOR UPDATE TO authenticated USING (
  EXISTS (
    SELECT 1 FROM jobs
    JOIN companies ON companies.id = jobs.company_id
    WHERE jobs.id = applications.job_id AND companies.user_id = auth.uid()
  )
) WITH CHECK (
  EXISTS (
    SELECT 1 FROM jobs
    JOIN companies ON companies.id = jobs.company_id
    WHERE jobs.id = applications.job_id AND companies.user_id = auth.uid()
  )
);

-- 7. TABLE CONVERSATIONS (messages entre utilisateurs)
CREATE TABLE IF NOT EXISTS conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  participant1_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  participant2_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(participant1_id, participant2_id)
);

ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own conversations" ON conversations FOR SELECT TO authenticated USING (
  auth.uid() = participant1_id OR auth.uid() = participant2_id
);
CREATE POLICY "Users can create conversations" ON conversations FOR INSERT TO authenticated WITH CHECK (
  auth.uid() = participant1_id OR auth.uid() = participant2_id
);

-- 8. TABLE MESSAGES
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  content text NOT NULL,
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view messages in their conversations" ON messages FOR SELECT TO authenticated USING (
  EXISTS (
    SELECT 1 FROM conversations
    WHERE conversations.id = messages.conversation_id
    AND (conversations.participant1_id = auth.uid() OR conversations.participant2_id = auth.uid())
  )
);
CREATE POLICY "Users can send messages in their conversations" ON messages FOR INSERT TO authenticated WITH CHECK (
  EXISTS (
    SELECT 1 FROM conversations
    WHERE conversations.id = messages.conversation_id
    AND (conversations.participant1_id = auth.uid() OR conversations.participant2_id = auth.uid())
  ) AND sender_id = auth.uid()
);
CREATE POLICY "Users can update own messages" ON messages FOR UPDATE TO authenticated USING (sender_id = auth.uid()) WITH CHECK (sender_id = auth.uid());

-- 9. TABLE CONTEXTS (organisations/équipes)
CREATE TABLE IF NOT EXISTS contexts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('personal', 'organization', 'team')),
  description text,
  owner_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  settings jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE contexts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view contexts they are members of" ON contexts FOR SELECT TO authenticated USING (
  owner_id = auth.uid() OR
  EXISTS (SELECT 1 FROM context_members WHERE context_members.context_id = contexts.id AND context_members.user_id = auth.uid())
);
CREATE POLICY "Owners can update own contexts" ON contexts FOR UPDATE TO authenticated USING (owner_id = auth.uid()) WITH CHECK (owner_id = auth.uid());
CREATE POLICY "Users can create contexts" ON contexts FOR INSERT TO authenticated WITH CHECK (owner_id = auth.uid());

-- 10. TABLE CONTEXT_MEMBERS
CREATE TABLE IF NOT EXISTS context_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  context_id uuid REFERENCES contexts(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  role text DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
  joined_at timestamptz DEFAULT now(),
  UNIQUE(context_id, user_id)
);

ALTER TABLE context_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view members of their contexts" ON context_members FOR SELECT TO authenticated USING (
  user_id = auth.uid() OR
  EXISTS (SELECT 1 FROM context_members cm WHERE cm.context_id = context_members.context_id AND cm.user_id = auth.uid())
);
CREATE POLICY "Context owners can manage members" ON context_members FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM contexts WHERE contexts.id = context_members.context_id AND contexts.owner_id = auth.uid())
);

-- 11. TABLE CONTEXT_MESSAGES
CREATE TABLE IF NOT EXISTS context_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  context_id uuid REFERENCES contexts(id) ON DELETE CASCADE,
  sender_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE context_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Context members can view messages" ON context_messages FOR SELECT TO authenticated USING (
  EXISTS (
    SELECT 1 FROM context_members
    WHERE context_members.context_id = context_messages.context_id
    AND context_members.user_id = auth.uid()
  )
);
CREATE POLICY "Context members can send messages" ON context_messages FOR INSERT TO authenticated WITH CHECK (
  EXISTS (
    SELECT 1 FROM context_members
    WHERE context_members.context_id = context_messages.context_id
    AND context_members.user_id = auth.uid()
  ) AND sender_id = auth.uid()
);

-- 12. TABLE AGENTS (agents IA)
CREATE TABLE IF NOT EXISTS agents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL,
  description text,
  capabilities jsonb DEFAULT '[]',
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'maintenance')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE agents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active agents" ON agents FOR SELECT TO authenticated USING (status = 'active');

-- 13. TABLE AGENT_CONFIGS
CREATE TABLE IF NOT EXISTS agent_configs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id uuid REFERENCES agents(id) ON DELETE CASCADE,
  context_id uuid REFERENCES contexts(id) ON DELETE CASCADE,
  config jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(agent_id, context_id)
);

ALTER TABLE agent_configs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Context members can view agent configs" ON agent_configs FOR SELECT TO authenticated USING (
  EXISTS (
    SELECT 1 FROM context_members
    WHERE context_members.context_id = agent_configs.context_id
    AND context_members.user_id = auth.uid()
  )
);

-- 14. TABLE AGENT_CONVERSATIONS
CREATE TABLE IF NOT EXISTS agent_conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id uuid REFERENCES agents(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  context_id uuid REFERENCES contexts(id) ON DELETE SET NULL,
  started_at timestamptz DEFAULT now(),
  ended_at timestamptz,
  metadata jsonb DEFAULT '{}'
);

ALTER TABLE agent_conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own agent conversations" ON agent_conversations FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can create agent conversations" ON agent_conversations FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

-- 15. TABLE AGENT_MESSAGES
CREATE TABLE IF NOT EXISTS agent_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid REFERENCES agent_conversations(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content text NOT NULL,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE agent_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view messages in own conversations" ON agent_messages FOR SELECT TO authenticated USING (
  EXISTS (
    SELECT 1 FROM agent_conversations
    WHERE agent_conversations.id = agent_messages.conversation_id
    AND agent_conversations.user_id = auth.uid()
  )
);
CREATE POLICY "Users can create messages in own conversations" ON agent_messages FOR INSERT TO authenticated WITH CHECK (
  EXISTS (
    SELECT 1 FROM agent_conversations
    WHERE agent_conversations.id = agent_messages.conversation_id
    AND agent_conversations.user_id = auth.uid()
  )
);

-- 16. TABLE AGENT_TASKS
CREATE TABLE IF NOT EXISTS agent_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id uuid REFERENCES agents(id) ON DELETE CASCADE,
  conversation_id uuid REFERENCES agent_conversations(id) ON DELETE CASCADE,
  task_type text NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'failed')),
  input jsonb DEFAULT '{}',
  output jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

ALTER TABLE agent_tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view tasks in own conversations" ON agent_tasks FOR SELECT TO authenticated USING (
  EXISTS (
    SELECT 1 FROM agent_conversations
    WHERE agent_conversations.id = agent_tasks.conversation_id
    AND agent_conversations.user_id = auth.uid()
  )
);

-- 17. TABLE AGENT_ANALYTICS
CREATE TABLE IF NOT EXISTS agent_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id uuid REFERENCES agents(id) ON DELETE CASCADE,
  metric_type text NOT NULL,
  metric_value numeric NOT NULL,
  metadata jsonb DEFAULT '{}',
  recorded_at timestamptz DEFAULT now()
);

ALTER TABLE agent_analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view agent analytics" ON agent_analytics FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.user_type = 'admin')
);

-- 18. TABLE FEATURE_FLAGS
CREATE TABLE IF NOT EXISTS feature_flags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text,
  enabled boolean DEFAULT false,
  rollout_percentage integer DEFAULT 0 CHECK (rollout_percentage >= 0 AND rollout_percentage <= 100),
  conditions jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE feature_flags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view feature flags" ON feature_flags FOR SELECT TO authenticated USING (true);

-- 19. TABLE FEATURE_FLAG_OVERRIDES
CREATE TABLE IF NOT EXISTS feature_flag_overrides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  feature_flag_id uuid REFERENCES feature_flags(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  enabled boolean NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(feature_flag_id, user_id)
);

ALTER TABLE feature_flag_overrides ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own overrides" ON feature_flag_overrides FOR SELECT TO authenticated USING (user_id = auth.uid());

-- 20. TABLE FEATURE_FLAG_ANALYTICS
CREATE TABLE IF NOT EXISTS feature_flag_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  feature_flag_id uuid REFERENCES feature_flags(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  event_type text NOT NULL,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE feature_flag_analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view flag analytics" ON feature_flag_analytics FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.user_type = 'admin')
);

-- 21. TABLE SHARED_TASKS
CREATE TABLE IF NOT EXISTS shared_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  context_id uuid REFERENCES contexts(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  assigned_to uuid REFERENCES profiles(id) ON DELETE SET NULL,
  created_by uuid REFERENCES profiles(id) ON DELETE CASCADE,
  due_date timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE shared_tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Context members can view tasks" ON shared_tasks FOR SELECT TO authenticated USING (
  EXISTS (
    SELECT 1 FROM context_members
    WHERE context_members.context_id = shared_tasks.context_id
    AND context_members.user_id = auth.uid()
  )
);
CREATE POLICY "Context members can create tasks" ON shared_tasks FOR INSERT TO authenticated WITH CHECK (
  EXISTS (
    SELECT 1 FROM context_members
    WHERE context_members.context_id = shared_tasks.context_id
    AND context_members.user_id = auth.uid()
  ) AND created_by = auth.uid()
);
CREATE POLICY "Assigned users can update tasks" ON shared_tasks FOR UPDATE TO authenticated USING (
  assigned_to = auth.uid() OR created_by = auth.uid()
) WITH CHECK (
  assigned_to = auth.uid() OR created_by = auth.uid()
);

-- FIN DU SCRIPT
