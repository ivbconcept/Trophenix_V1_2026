# Architecture Multi-Rôles et Elea Context-Aware - Guide Complet

## 📋 Table des Matières

1. [Vue d'ensemble](#vue-densemble)
2. [Architecture Base de Données](#architecture-base-de-données)
3. [Système Multi-Rôles](#système-multi-rôles)
4. [Elea Context-Aware](#elea-context-aware)
5. [Sécurité et RLS](#sécurité-et-rls)
6. [Services et API](#services-et-api)
7. [Cas d'Usage](#cas-dusage)
8. [Scalabilité et Futur](#scalabilité-et-futur)

---

## 🎯 Vue d'ensemble

### Objectif

Créer une plateforme où :
- **Un utilisateur peut avoir plusieurs rôles simultanément** (Admin + RH Nike + Athlète)
- **Les entreprises ont des équipes** avec permissions granulaires
- **Les athlètes ont des délégués** (parents, agents) avec accès partagé
- **Elea (IA) s'adapte au contexte** de l'utilisateur en temps réel
- **Messagerie et tâches sont partagées** entre membres d'une équipe
- **Sécurité stricte** : Chaque utilisateur ne voit QUE ses données

### Schéma Global

```
┌─────────────────────────────────────────────────────────────────┐
│                      UTILISATEUR (auth.users)                   │
│                  email unique = UNE identité                    │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    USER_CONTEXTS (Multi-Rôles)                  │
│  Un utilisateur peut avoir PLUSIEURS rôles actifs               │
│                                                                 │
│  admin@trophenix.com :                                          │
│  ├─ Super Admin Platform (primary)                             │
│  ├─ Owner Nike                                                  │
│  └─ Profil Athlète personnel                                   │
└────────────────────────────┬────────────────────────────────────┘
                             │
                ┌────────────┴────────────┐
                ▼                         ▼
┌─────────────────────────┐  ┌──────────────────────────┐
│  COMPANY_ORGANIZATIONS  │  │  ATHLETE_DELEGATIONS     │
│  (Équipes entreprise)   │  │  (Parents/Agents)        │
│                         │  │                          │
│  Nike France:           │  │  Athlète Jean:           │
│  ├─ Owner              │  │  ├─ Parent 1 (guardian)  │
│  ├─ HR Manager         │  │  ├─ Parent 2 (guardian)  │
│  ├─ HR Recruiter       │  │  └─ Agent (agent)        │
│  └─ Technical Lead     │  │                          │
└─────────────────────────┘  └──────────────────────────┘
                             │
                ┌────────────┴────────────┐
                ▼                         ▼
┌─────────────────────────┐  ┌──────────────────────────┐
│  CONTEXT_MESSAGES       │  │  SHARED_TASKS            │
│  (Messagerie partagée)  │  │  (Tâches collaboratives) │
│                         │  │                          │
│  Tous les membres RH    │  │  Assignées à des         │
│  voient les échanges    │  │  membres de l'équipe     │
│  avec candidats         │  │                          │
└─────────────────────────┘  └──────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    ELEA (IA Context-Aware)                      │
│                                                                 │
│  Elea SAIT :                                                    │
│  ✅ Qui vous êtes (user_id)                                     │
│  ✅ Dans quel contexte vous êtes (company_org, delegation)      │
│  ✅ Votre rôle actif (owner, guardian, agent, etc.)             │
│  ✅ Vos permissions (via role_permissions)                      │
│  ✅ Votre équipe/délégation                                     │
│  ✅ Vos tâches assignées                                        │
│  ✅ Les messages de votre contexte                              │
│                                                                 │
│  Elea ADAPTE ses réponses selon votre contexte !               │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🗄️ Architecture Base de Données

### Tables Principales

#### 1. `user_contexts` - Multi-Rôles

**Objectif** : Permettre à un utilisateur d'avoir plusieurs rôles actifs.

```sql
CREATE TABLE user_contexts (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES profiles(id),
  context_type text, -- 'platform_admin' | 'company_org' | 'athlete_profile' | 'athlete_delegation'
  context_id uuid, -- ID de l'entité (org, delegation)
  role text, -- 'owner', 'hr_manager', 'guardian', 'agent', etc.
  is_primary boolean, -- Contexte principal de l'utilisateur
  status text, -- 'active' | 'suspended' | 'invited' | 'pending'
  invited_by uuid,
  invited_at timestamptz,
  joined_at timestamptz,
  metadata jsonb,
  created_at timestamptz,
  updated_at timestamptz
);
```

**Cas d'usage** :
```typescript
// admin@trophenix.com a 3 contextes :
[
  {
    context_type: 'platform_admin',
    role: 'super_admin',
    is_primary: true // Rôle principal
  },
  {
    context_type: 'company_org',
    context_id: 'nike_org_id',
    role: 'owner',
    is_primary: false
  },
  {
    context_type: 'athlete_profile',
    role: 'athlete',
    is_primary: false
  }
]
```

#### 2. `company_organizations` - Organisations avec Équipes

**Objectif** : Une entreprise peut avoir plusieurs collaborateurs avec différents rôles.

```sql
CREATE TABLE company_organizations (
  id uuid PRIMARY KEY,
  name text, -- "Nike France"
  slug text UNIQUE, -- "nike-france"
  company_profile_id uuid REFERENCES company_profiles(id),
  owner_id uuid REFERENCES profiles(id),
  settings jsonb,
  created_at timestamptz,
  updated_at timestamptz
);
```

**Exemple** :
```
Nike France (organization)
├─ owner@nike.com (owner) → Tous droits
├─ rh1@nike.com (hr_manager) → Gestion recrutement
├─ rh2@nike.com (hr_recruiter) → Consultation uniquement
└─ tech@nike.com (technical_lead) → Évaluation technique
```

#### 3. `athlete_delegations` - Délégation Athlète

**Objectif** : Un athlète peut déléguer l'accès à des parents/agents.

```sql
CREATE TABLE athlete_delegations (
  id uuid PRIMARY KEY,
  athlete_profile_id uuid REFERENCES athlete_profiles(id),
  delegate_user_id uuid REFERENCES profiles(id),
  role text, -- 'guardian' | 'agent' | 'manager' | 'coach'
  permissions jsonb,
  status text, -- 'active' | 'suspended' | 'invited' | 'revoked'
  invited_by uuid,
  invited_at timestamptz,
  accepted_at timestamptz,
  created_at timestamptz
);
```

**Exemple** :
```
Athlète Jean Dupont (mineur)
├─ parent1@mail.com (guardian) → Droits légaux complets
├─ parent2@mail.com (guardian) → Idem
└─ agent@sports.com (agent) → Négociations, conseils
```

#### 4. `role_permissions` - Permissions par Rôle

**Objectif** : Définir les permissions granulaires pour chaque rôle.

```sql
CREATE TABLE role_permissions (
  id uuid PRIMARY KEY,
  role_name text UNIQUE,
  context_type text,
  permissions jsonb,
  description text,
  is_system boolean
);
```

**Exemple de permissions** :
```json
{
  "role_name": "hr_manager",
  "context_type": "company_org",
  "permissions": {
    "can_invite_members": true,
    "can_post_jobs": true,
    "can_edit_jobs": true,
    "can_delete_jobs": true,
    "can_view_applications": true,
    "can_manage_applications": true,
    "can_view_analytics": true
  }
}
```

#### 5. `context_messages` - Messagerie Contextuelle

**Objectif** : Messages partagés entre membres d'un contexte.

```sql
CREATE TABLE context_messages (
  id uuid PRIMARY KEY,
  context_type text, -- 'direct' | 'organization' | 'delegation' | 'application'
  context_id uuid,
  sender_id uuid REFERENCES profiles(id),
  sender_role text,
  subject text,
  content text,
  visibility text, -- 'all' | 'internal' | 'specific_roles'
  visible_to_roles text[],
  metadata jsonb,
  sent_at timestamptz,
  created_at timestamptz
);
```

**Avantages** :
- ✅ Toute l'équipe RH Nike voit les échanges avec les candidats
- ✅ Pas de perte d'info si un RH change de poste
- ✅ Parents et agents voient tous les échanges de l'athlète
- ✅ Transparence totale

#### 6. `shared_tasks` - Tâches Partagées

**Objectif** : Tâches collaboratives visibles par tous les membres du contexte.

```sql
CREATE TABLE shared_tasks (
  id uuid PRIMARY KEY,
  context_type text, -- 'organization' | 'delegation' | 'application'
  context_id uuid,
  title text,
  description text,
  assigned_to uuid REFERENCES profiles(id),
  assigned_role text,
  created_by uuid,
  status text, -- 'pending' | 'in_progress' | 'completed' | 'cancelled'
  priority text, -- 'low' | 'medium' | 'high' | 'urgent'
  due_date timestamptz,
  completed_at timestamptz,
  metadata jsonb,
  created_at timestamptz,
  updated_at timestamptz
);
```

**Cas d'usage** :
```
Organisation Nike :
- "Répondre à candidat Jean" (assigné: rh1@nike.com)
- "Valider dossier technique" (assigné: tech@nike.com)
→ Toute l'équipe voit l'avancement

Athlète + Parents :
- "Signer document légal" (assigné: parent1, validateur: parent2)
- "Négocier salaire Nike" (assigné: agent)
→ Chacun voit qui fait quoi
```

---

## 🔐 Sécurité et RLS (Row Level Security)

### Principe Fondamental

**CHAQUE TABLE A RLS ACTIVÉ** avec des politiques STRICTES basées sur `auth.uid()`.

### Exemples de Politiques RLS

#### user_contexts

```sql
-- L'utilisateur voit UNIQUEMENT ses propres contextes
CREATE POLICY "Users can view own contexts"
  ON user_contexts FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- L'owner d'une org peut inviter des membres
CREATE POLICY "Organization owners can invite members"
  ON user_contexts FOR INSERT
  TO authenticated
  WITH CHECK (
    invited_by = auth.uid() AND
    context_type = 'company_org' AND
    EXISTS (
      SELECT 1 FROM user_contexts uc
      WHERE uc.user_id = auth.uid()
      AND uc.context_id = user_contexts.context_id
      AND uc.role = 'owner'
      AND uc.status = 'active'
    )
  );
```

#### agent_sessions (Elea)

```sql
-- Elea ne peut accéder qu'aux conversations de l'utilisateur authentifié
CREATE POLICY "Users can view own sessions"
  ON agent_sessions FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Isolation stricte : user A ne peut JAMAIS voir les conversations de user B
```

#### context_messages

```sql
-- Voir les messages UNIQUEMENT si on fait partie du contexte
CREATE POLICY "Users can view messages in their contexts"
  ON context_messages FOR SELECT
  TO authenticated
  USING (
    sender_id = auth.uid() OR
    (
      (context_type = 'organization' AND
        EXISTS (
          SELECT 1 FROM user_contexts
          WHERE user_contexts.context_id = context_messages.context_id
          AND user_contexts.user_id = auth.uid()
          AND user_contexts.context_type = 'company_org'
          AND user_contexts.status = 'active'
        )
      ) OR
      (context_type = 'delegation' AND
        EXISTS (
          SELECT 1 FROM athlete_delegations
          WHERE athlete_delegations.id = context_messages.context_id
          AND (athlete_delegations.delegate_user_id = auth.uid() OR
               EXISTS (
                 SELECT 1 FROM athlete_profiles
                 WHERE athlete_profiles.id = athlete_delegations.athlete_profile_id
                 AND athlete_profiles.user_id = auth.uid()
               ))
          AND athlete_delegations.status = 'active'
        )
      )
    )
  );
```

### Garanties de Sécurité

✅ **Isolation utilisateur** : Un user ne voit JAMAIS les données d'un autre
✅ **Contexte isolé** : Les messages Nike ne sont visibles que par l'équipe Nike
✅ **Permissions vérifiées** : Chaque action vérifie le rôle et les permissions
✅ **Audit trail** : `created_by`, `invited_by` pour traçabilité

---

## 🤖 Elea Context-Aware

### Fonctionnement

Elea est maintenant **CONSCIENTE DU CONTEXTE** de l'utilisateur :

#### 1. Récupération du Contexte

```sql
-- Fonction SQL appelée par Elea
CREATE FUNCTION get_elea_context_summary(target_user_id uuid)
RETURNS jsonb AS $$
  -- Retourne :
  -- - Contexte actif (company_org, athlete_delegation, etc.)
  -- - Rôle actif (owner, guardian, etc.)
  -- - Équipe (nombre de membres)
  -- - Tâches (nombre actif, assignées à moi)
  -- - Messages (nombre non lus)
$$;
```

#### 2. Sessions Context-Aware

```typescript
// agent_sessions stocke maintenant :
{
  user_id: 'admin-id',
  agent_id: 'elea-id',
  current_context_id: 'nike-org-context-id', // Nouveau !
  active_role: 'owner', // Nouveau !
  context_data: { // Nouveau !
    context_type: 'company_org',
    role: 'owner',
    organization: {
      name: 'Nike France',
      team_size: 5,
      active_tasks: 12,
      my_tasks: 3
    },
    permissions: {
      can_manage_organization: true,
      can_post_jobs: true,
      // ...
    }
  }
}
```

#### 3. Réponses Adaptées

```typescript
// AVANT (basique) :
Elea : "Bonjour ! Comment puis-je vous aider ?"

// MAINTENANT (context-aware) :
Elea : "Bonjour admin !

Je vois que vous êtes **Propriétaire** chez **Nike France**.

📊 Contexte actuel :
- Équipe : 5 membres
- Tâches actives : 12
- Vos tâches : 3

Je peux vous aider à :
✅ Gérer les tâches de l'équipe
✅ Consulter les candidatures
✅ Poster des offres d'emploi

Comment puis-je vous assister ?"
```

### Services Elea

#### ContextAwareEleaService.ts

```typescript
export class ContextAwareEleaService {
  // Récupère le résumé du contexte actif
  static async getContextSummary(userId: string): Promise<EleaContextSummary>;

  // Crée une session Elea avec contexte enrichi
  static async getOrCreateContextAwareSession(
    userId: string,
    agentId: string,
    currentContext: ActiveContext | null
  ): Promise<string>;

  // Message de bienvenue adapté au contexte
  static getContextAwareWelcome(
    userId: string,
    contextSummary: EleaContextSummary,
    userEmail?: string
  ): string;

  // Suggestions selon le contexte
  static getContextAwareSuggestions(
    contextSummary: EleaContextSummary
  ): Array<{ id: string; text: string }>;

  // Réponse contextuelle
  static async generateContextAwareResponse(
    userMessage: string,
    userId: string,
    contextSummary: EleaContextSummary,
    conversationHistory: any[]
  ): Promise<string>;
}
```

### Exemples de Réponses Contextuelles

#### Cas 1 : Owner Nike demande "Mes tâches"

```
Elea : 📋 Tâches dans votre organisation

Vous avez **3 tâches** qui vous sont assignées.
L'équipe a **12 tâches** actives au total.

Que souhaitez-vous faire ?
- Voir vos tâches assignées
- Créer une nouvelle tâche
- Consulter toutes les tâches de l'équipe
```

#### Cas 2 : Parent (guardian) demande "Équipe"

```
Elea : 👥 Délégués de Jean Dupont

Il y a **3 délégués** actifs (parents, agents, managers).

Tous les délégués peuvent :
- Voir les candidatures et offres
- Consulter les messages avec les recruteurs
- Collaborer sur les décisions importantes

La transparence totale est garantie !

Souhaitez-vous voir la liste des délégués ?
```

---

## 📦 Services et API

### ContextService

```typescript
export class ContextService {
  // Récupérer tous les contextes d'un utilisateur
  static async getUserContexts(userId: string): Promise<UserContext[]>;

  // Récupérer le contexte primaire
  static async getPrimaryContext(userId: string): Promise<UserContext | null>;

  // Obtenir les détails complets d'un contexte (org, permissions)
  static async getActiveContextDetails(context: UserContext): Promise<ActiveContext>;

  // Créer une organisation
  static async createOrganization(
    name: string,
    companyProfileId: string,
    ownerId: string
  ): Promise<CompanyOrganization>;

  // Inviter un membre dans une organisation
  static async inviteMemberToOrganization(
    organizationId: string,
    userEmail: string,
    role: string,
    invitedBy: string
  ): Promise<void>;

  // Inviter un délégué pour un athlète
  static async inviteDelegate(
    athleteProfileId: string,
    delegateEmail: string,
    role: 'guardian' | 'agent' | 'manager' | 'coach',
    invitedBy: string
  ): Promise<void>;

  // Récupérer les membres d'une organisation
  static async getOrganizationMembers(organizationId: string);

  // Récupérer les délégués d'un athlète
  static async getAthleteDelegates(athleteProfileId: string);
}
```

### SharedTaskService

```typescript
export class SharedTaskService {
  // Créer une tâche
  static async createTask(
    contextType: TaskContextType,
    contextId: string,
    createdBy: string,
    title: string,
    description: string | null,
    assignedTo: string | null,
    assignedRole: string | null,
    priority: TaskPriority,
    dueDate: string | null
  ): Promise<SharedTask>;

  // Récupérer les tâches d'un contexte
  static async getTasksByContext(
    contextType: TaskContextType,
    contextId: string
  ): Promise<SharedTask[]>;

  // Mes tâches
  static async getMyTasks(userId: string, status?: TaskStatus): Promise<SharedTask[]>;

  // Changer le statut d'une tâche
  static async updateTaskStatus(taskId: string, status: TaskStatus): Promise<SharedTask>;

  // Ajouter un commentaire
  static async addComment(taskId: string, userId: string, content: string): Promise<TaskComment>;

  // Statistiques
  static async getTaskStats(contextType: TaskContextType, contextId: string);
}
```

### ContextMessageService

```typescript
export class ContextMessageService {
  // Envoyer un message
  static async sendMessage(
    contextType: MessageContextType,
    contextId: string,
    senderId: string,
    senderRole: string | null,
    subject: string,
    content: string,
    visibility: MessageVisibility,
    visibleToRoles: string[]
  ): Promise<ContextMessage>;

  // Récupérer les messages d'un contexte
  static async getMessagesByContext(
    contextType: MessageContextType,
    contextId: string
  ): Promise<ContextMessage[]>;

  // Marquer comme lu
  static async markAsRead(messageId: string, userId: string): Promise<void>;

  // Compter les non lus
  static async getUnreadCount(userId: string, contextType?: MessageContextType): Promise<number>;

  // Note interne (visible seulement par certains rôles)
  static async sendInternalNote(
    contextType: MessageContextType,
    contextId: string,
    senderId: string,
    senderRole: string,
    subject: string,
    content: string,
    visibleToRoles: string[]
  ): Promise<ContextMessage>;
}
```

---

## 🎓 Cas d'Usage Concrets

### Cas 1 : RH Manager Nike poste une offre

```typescript
// 1. Récupérer le contexte actif
const contexts = await ContextService.getUserContexts(userId);
const nikeContext = contexts.find(c => c.context_type === 'company_org');

// 2. Vérifier les permissions
const activeContext = await ContextService.getActiveContextDetails(nikeContext);
if (!activeContext.permissions.can_post_jobs) {
  throw new Error('Vous n\'avez pas la permission de poster des offres');
}

// 3. Poster l'offre
await JobService.createJob({...});

// 4. Créer une tâche pour l'équipe
await SharedTaskService.createTask(
  'organization',
  nikeContext.context_id!,
  userId,
  'Reviewer la nouvelle offre',
  null,
  techLeadUserId,
  'technical_lead',
  'high',
  null
);

// 5. Notifier l'équipe via message contextuel
await ContextMessageService.sendMessage(
  'organization',
  nikeContext.context_id!,
  userId,
  'hr_manager',
  'Nouvelle offre postée',
  'J\'ai posté une nouvelle offre pour poste X. Merci de review.',
  'all',
  []
);
```

### Cas 2 : Parent valide un document pour son fils athlète

```typescript
// 1. Récupérer la délégation
const delegations = await ContextService.getAthleteDelegates(athleteProfileId);
const myDelegation = delegations.find(d => d.delegate_user_id === userId);

// 2. Vérifier que je suis guardian
if (myDelegation.role !== 'guardian') {
  throw new Error('Seul un tuteur peut valider ce document');
}

// 3. Valider le document
await DocumentService.validateDocument(documentId, userId);

// 4. Marquer la tâche comme complétée
await SharedTaskService.updateTaskStatus(taskId, 'completed');

// 5. Notifier les autres délégués
await ContextMessageService.sendMessage(
  'delegation',
  myDelegation.id,
  userId,
  'guardian',
  'Document validé',
  'J\'ai validé le document légal. Nous pouvons procéder.',
  'all',
  []
);

// Résultat : Agent et Parent2 voient le message instantanément
```

### Cas 3 : Admin@trophenix.com switch de contexte

```typescript
// admin@trophenix.com a 3 rôles :
// 1. Super Admin Platform (primary)
// 2. Owner Nike
// 3. Athlète

// Switch vers Owner Nike
const nikeContext = contexts.find(c =>
  c.context_type === 'company_org' &&
  c.metadata.org_name === 'Nike'
);

// Définir comme contexte principal
await ContextService.setPrimaryContext(userId, nikeContext.id);

// Elea s'adapte automatiquement :
const contextSummary = await ContextAwareEleaService.getContextSummary(userId);
const welcome = ContextAwareEleaService.getContextAwareWelcome(
  userId,
  contextSummary,
  'admin@trophenix.com'
);

// Résultat :
// "Bonjour admin ! Je vois que vous êtes Propriétaire chez Nike France..."
```

---

## 🚀 Scalabilité et Futur

### Points Forts de l'Architecture

#### 1. Multi-Tenancy Naturel

Chaque organisation/délégation est isolée via `context_id`. Pas de données partagées entre contextes.

#### 2. Permissions Flexibles

Le système `role_permissions` permet d'ajouter de nouveaux rôles facilement :

```sql
INSERT INTO role_permissions (role_name, context_type, permissions) VALUES
('hr_intern', 'company_org', '{
  "can_view_applications": true,
  "can_post_jobs": false
}');
```

#### 3. Extensibilité Metadata

Chaque table a un champ `metadata` (jsonb) pour stocker des données custom sans migration :

```json
{
  "custom_field_1": "value",
  "integration_id": "123",
  "tags": ["important", "urgent"]
}
```

#### 4. Analytics et Reporting

Grâce à `agent_analytics`, on peut tracker :
- Utilisation d'Elea par contexte
- Tâches les plus fréquentes
- Temps de réponse moyen
- Messages les plus utiles

#### 5. Intégrations Futures

Architecture prête pour :
- **Webhooks** : Notifications externes via metadata
- **API externes** : Intégration CRM, ATS
- **IA avancée** : Elea peut apprendre via `agent_knowledge_base`
- **Recherche sémantique** : Colonne `embedding` prête pour pgvector

### Évolutions Possibles

#### Court Terme (3-6 mois)

1. **UI Complète**
   - Composant ContextSwitcher dans la navbar
   - Dashboard par contexte (Owner Nike vs Athlète)
   - Kanban board pour shared_tasks
   - Chat UI pour context_messages

2. **Notifications Real-Time**
   - Supabase Realtime sur context_messages
   - Alertes push pour nouvelles tâches
   - Notifications email pour invitations

3. **Mobile App**
   - React Native avec même architecture
   - Notifications push natives
   - Scan documents (pour tuteurs/parents)

#### Moyen Terme (6-12 mois)

1. **Elea V2 - IA Avancée**
   - Connexion OpenAI / Anthropic via Edge Functions
   - RAG (Retrieval Augmented Generation) sur `agent_knowledge_base`
   - Suggestions proactives basées sur contexte
   - Analyse de CV automatique

2. **Workflows Automatisés**
   - Pipelines de recrutement (screening → interview → offer)
   - Validation multi-niveaux (parent1 → parent2 → agent)
   - Escalade automatique si tâche non traitée

3. **Analytics Avancés**
   - Dashboard temps réel par organisation
   - Prédictions (candidats susceptibles d'accepter)
   - Benchmarking entre entreprises

#### Long Terme (12+ mois)

1. **Marketplace d'Agents IA**
   - Agents spécialisés par sport
   - Agents pour juridique, médical, etc.
   - Agents custom par organisation

2. **Intégration Complète**
   - ATS (Applicant Tracking Systems)
   - CRM (Customer Relationship Management)
   - LMS (Learning Management Systems)
   - Calendriers partagés

3. **Compliance et Certifications**
   - RGPD audit logs automatiques
   - Certifications ISO 27001
   - Exports données sur demande
   - Right to be forgotten automatisé

---

## 📚 Documentation Technique

### Fichiers Clés

```
trophenix/
├─ supabase/
│  └─ migrations/
│     ├─ 20251012100000_create_multi_role_context_system.sql
│     └─ 20251012110000_upgrade_elea_context_awareness.sql
│
├─ src/
│  ├─ types/
│  │  └─ contexts.ts (Types TypeScript)
│  │
│  ├─ services/
│  │  ├─ contextService.ts (Gestion contextes)
│  │  ├─ contextMessageService.ts (Messagerie)
│  │  ├─ sharedTaskService.ts (Tâches)
│  │  └─ contextAwareEleaService.ts (Elea IA)
│  │
│  └─ components/
│     └─ Contexts/
│        ├─ ContextSwitcher.tsx (Switch de rôles)
│        └─ OrganizationTeamManagement.tsx (Gestion équipe)
│
└─ ARCHITECTURE_MULTI_ROLES_ELEA.md (Ce document)
```

### Commandes Utiles

```bash
# Vérifier les contextes d'un utilisateur
SELECT * FROM user_contexts WHERE user_id = 'user-id';

# Obtenir le résumé Elea
SELECT get_elea_context_summary('user-id');

# Voir les tâches d'une org
SELECT * FROM shared_tasks
WHERE context_type = 'organization'
AND context_id = 'org-id';

# Statistiques globales
SELECT
  COUNT(DISTINCT user_id) as total_users,
  COUNT(DISTINCT context_id) as total_orgs,
  COUNT(*) as total_contexts
FROM user_contexts
WHERE status = 'active';
```

### Tests de Sécurité RLS

```sql
-- Test 1 : User A ne peut pas voir les contextes de User B
SET request.jwt.claims.sub = 'user-a-id';
SELECT * FROM user_contexts WHERE user_id = 'user-b-id';
-- Résultat attendu : 0 rows

-- Test 2 : User A ne peut pas voir les messages de l'org Nike s'il n'en fait pas partie
SET request.jwt.claims.sub = 'user-outside-nike';
SELECT * FROM context_messages
WHERE context_type = 'organization'
AND context_id = 'nike-org-id';
-- Résultat attendu : 0 rows

-- Test 3 : Owner Nike peut inviter des membres
SET request.jwt.claims.sub = 'nike-owner-id';
INSERT INTO user_contexts (user_id, context_type, context_id, role, invited_by)
VALUES ('new-user-id', 'company_org', 'nike-org-id', 'hr_manager', 'nike-owner-id');
-- Résultat attendu : Success
```

---

## ✅ Checklist pour les Futures Équipes

### Avant d'ajouter une fonctionnalité

- [ ] Est-ce que la fonctionnalité doit être context-aware ?
- [ ] Quelles permissions sont nécessaires ?
- [ ] RLS est-il configuré correctement ?
- [ ] Elea doit-elle être au courant de cette feature ?
- [ ] Les metadata JSONB suffisent ou faut-il une colonne dédiée ?

### Avant de modifier une table existante

- [ ] La migration est-elle non destructive ?
- [ ] Les politiques RLS sont-elles mises à jour ?
- [ ] Les services TypeScript sont-ils à jour ?
- [ ] La documentation est-elle mise à jour ?

### Avant de déployer en production

- [ ] Tests RLS validés (users A/B/C)
- [ ] Tests de charge (10k users)
- [ ] Index optimisés (EXPLAIN ANALYZE)
- [ ] Backup de la DB
- [ ] Plan de rollback prêt

---

## 🎉 Conclusion

Cette architecture garantit :

✅ **Sécurité maximale** : RLS strict, isolation complète
✅ **Scalabilité** : Multi-tenancy naturel, metadata extensible
✅ **Flexibilité** : Multi-rôles, permissions granulaires
✅ **Intelligence** : Elea context-aware, analytics avancés
✅ **Collaboration** : Messagerie et tâches partagées
✅ **Maintenabilité** : Code clean, documentation complète
✅ **Futur-proof** : Prêt pour IA, intégrations, mobile

**Pour toute question : Consultez ce document et les migrations SQL.**

**Bonne chance aux futures équipes ! 🚀**
