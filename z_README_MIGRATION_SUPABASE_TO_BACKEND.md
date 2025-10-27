# Guide de Migration Supabase vers Backend Custom + Déploiement AWS

## 📋 Table des Matières

1. [Analyse de l'Architecture Actuelle](#analyse-de-larchitecture-actuelle)
2. [Réponse à Vos Questions](#réponse-à-vos-questions)
3. [Option 1 : Migration Complète](#option-1--migration-complète)
4. [Option 2 : Architecture Hybride](#option-2--architecture-hybride)
5. [Contrats API pour l'Équipe Backend](#contrats-api-pour-léquipe-backend)
6. [Guide de Migration Supabase → Backend Custom](#guide-de-migration-supabase--backend-custom)
7. [Déploiement AWS](#déploiement-aws)
8. [Checklist de Migration](#checklist-de-migration)

---

## 🏗️ Analyse de l'Architecture Actuelle

### Ce qui a été construit

```
┌─────────────────────────────────────────────────────────┐
│                    ARCHITECTURE ACTUELLE                 │
│                  (Supabase Full-Stack)                   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  FRONTEND (React + Vite)                                │
│  ├─ Components                                          │
│  ├─ Services (appels directs à Supabase)               │
│  └─ Hooks                                               │
│                    ↓ ↓ ↓                                │
│           Supabase Client SDK                           │
│                    ↓ ↓ ↓                                │
│  SUPABASE (Backend-as-a-Service)                        │
│  ├─ PostgreSQL Database                                │
│  ├─ Auth (JWT)                                          │
│  ├─ Row Level Security (RLS)                           │
│  ├─ Edge Functions                                      │
│  └─ Real-time subscriptions                            │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### ⚠️ Question Clé : Est-ce un Monorepo ?

**NON**, ce n'est PAS un monorepo classique. C'est un **Frontend qui utilise Supabase comme Backend**.

```
Structure actuelle :
trophenix/
├─ src/ (Frontend React)
├─ supabase/ (Migrations SQL uniquement)
└─ package.json (Frontend)

Ce n'est PAS :
trophenix/
├─ packages/
│  ├─ frontend/
│  └─ backend/
```

**Donc vous avez :**
- ✅ Frontend React (ce repo)
- ❌ Pas de backend custom (Supabase = backend)

---

## 💡 Réponse à Vos Questions

### Q1 : "Si nous avons déjà un backend, comment faire ?"

**Réponse** : Vous avez **3 options** :

#### **Option A : Remplacer Supabase par votre backend** ⭐ RECOMMANDÉ

```
AVANT :
Frontend → Supabase

APRÈS :
Frontend → Votre Backend API → Votre DB
```

**Avantages** :
- ✅ Architecture propre et standard
- ✅ Contrôle total
- ✅ Pas de vendor lock-in
- ✅ Intégration avec votre stack existante

**Inconvénients** :
- ⚠️ Nécessite refactoring du frontend (services)
- ⚠️ Perte des fonctionnalités Supabase (RLS auto, Real-time)
- ⚠️ Effort: 3-4 semaines

#### **Option B : Architecture Hybride (Temporaire)**

```
Frontend → Votre Backend API (logique métier)
        → Supabase (auth seulement)
```

**Avantages** :
- ✅ Migration progressive
- ✅ Garde l'auth Supabase (simple)

**Inconvénients** :
- ⚠️ Temporaire, pas idéal long terme
- ⚠️ Dépendance à Supabase reste

#### **Option C : Abandonner ce repo, repartir du backend existant**

```
Frontend dans votre repo backend existant
Backend API → Votre DB
```

**Avantages** :
- ✅ Cohérent avec votre stack

**Inconvénients** :
- ❌ Perte de tout le travail frontend
- ❌ Recommencer à zéro

---

**🎯 RECOMMANDATION : Option A (Migration Complète)**

Pourquoi ?
1. Tout le travail frontend est **réutilisable** (composants, logique, UI)
2. Seuls les **services** doivent être modifiés (layer d'API)
3. Votre backend implémente les mêmes endpoints
4. Architecture standard et maintenable

---

### Q2 : "Comment l'équipe dev va faire avec une logique frontend et backend s'ils ont déjà un backend ?"

**Réponse** : Votre équipe doit :

1. **Garder le frontend (ce repo)** ← Tout est réutilisable !
2. **Implémenter les mêmes API dans leur backend** (voir Contrats API)
3. **Remplacer les appels Supabase par des appels API** (simple refactoring)

**Exemple concret** :

```typescript
// AVANT (avec Supabase)
const { data } = await supabase
  .from('profiles')
  .select('*')
  .eq('id', userId);

// APRÈS (avec votre backend)
const data = await fetch(`https://api.trophenix.com/profiles/${userId}`, {
  headers: { 'Authorization': `Bearer ${token}` }
}).then(res => res.json());
```

C'est juste **remplacer les services** ! Les composants restent identiques.

### Q3 : "Est-ce qu'on peut migrer de Supabase à AWS ?"

**OUI, absolument !** Voir section [Déploiement AWS](#déploiement-aws)

### Q4 : "Le schéma de données est-il réutilisable ?"

**OUI, à 100% !** Toutes les migrations SQL dans `supabase/migrations/` sont compatibles PostgreSQL, MySQL, etc.

```bash
# Copier les migrations
cp -r supabase/migrations/ backend/migrations/

# Exécuter dans votre DB
psql -h your-db.com -U user -d trophenix < migrations/*.sql
```

---

## 🔄 Option 1 : Migration Complète (RECOMMANDÉ)

### Architecture Cible

```
┌─────────────────────────────────────────────────────────┐
│                  ARCHITECTURE CIBLE                      │
│              (Backend Custom sur AWS)                    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  FRONTEND (React + Vite)                                │
│  ├─ Components (✅ inchangé)                           │
│  ├─ Services (🔄 modifiés pour appeler API)           │
│  └─ Hooks (✅ inchangé)                                │
│                    ↓ ↓ ↓                                │
│           Votre Backend API                             │
│  ├─ Node.js / Django / FastAPI / Go / etc.            │
│  ├─ Authentification JWT                               │
│  ├─ Endpoints REST ou GraphQL                          │
│  └─ Business Logic                                     │
│                    ↓ ↓ ↓                                │
│  BASE DE DONNÉES                                        │
│  ├─ PostgreSQL (AWS RDS)                               │
│  ├─ MySQL (AWS RDS)                                    │
│  └─ MongoDB / autre...                                 │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Étapes de Migration

#### Étape 1 : Conserver le schéma de données

Le schéma SQL dans `supabase/migrations/` est **100% réutilisable** !

```bash
# Copier toutes les migrations
cp -r supabase/migrations/ backend/migrations/

# Adapter si nécessaire (enlever les spécificités Supabase)
```

**Ce qui est réutilisable à 100% :**
- ✅ Toutes les tables (profiles, jobs, applications, etc.)
- ✅ Toutes les colonnes
- ✅ Toutes les relations (foreign keys)
- ✅ Tous les index
- ✅ La logique métier (triggers, fonctions SQL)

**Ce qui doit être réimplémenté :**
- ❌ Row Level Security (RLS) → Middleware d'autorisation dans votre backend
- ❌ Supabase Auth → Votre système d'auth (JWT custom)
- ❌ Real-time → WebSockets custom ou service tiers (Socket.io, Pusher)
- ❌ Storage → AWS S3 ou autre

#### Étape 2 : Créer les API Endpoints

Votre backend doit implémenter les mêmes endpoints. Voir section [Contrats API](#contrats-api-pour-léquipe-backend).

#### Étape 3 : Remplacer les Services Frontend

Créer un **nouveau layer d'abstraction** :

```typescript
// src/lib/api.ts (NOUVEAU FICHIER)
const API_BASE_URL = import.meta.env.VITE_API_URL;

export const api = {
  async get(endpoint: string) {
    const token = localStorage.getItem('auth_token');
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  },

  async post(endpoint: string, data: any) {
    const token = localStorage.getItem('auth_token');
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  },

  async put(endpoint: string, data: any) {
    const token = localStorage.getItem('auth_token');
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  },

  async delete(endpoint: string) {
    const token = localStorage.getItem('auth_token');
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  }
};
```

Puis **remplacer progressivement** chaque service :

```typescript
// AVANT
// src/services/profileService.ts
import { supabase } from '../lib/supabase';

export const getProfile = async (userId: string) => {
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  return data;
};

// APRÈS
// src/services/profileService.ts
import { api } from '../lib/api';

export const getProfile = async (userId: string) => {
  return await api.get(`/profiles/${userId}`);
};
```

#### Étape 4 : Adapter l'Authentification

```typescript
// AVANT
// src/contexts/AuthContext.tsx
const { data } = await supabase.auth.signInWithPassword({
  email,
  password
});

// APRÈS
// src/contexts/AuthContext.tsx
const response = await fetch(`${API_URL}/auth/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});

const { token, user } = await response.json();
localStorage.setItem('auth_token', token);
```

---

## 🔀 Option 2 : Architecture Hybride (Temporaire)

Si migration progressive souhaitée :

```
┌─────────────────────────────────────────────────────────┐
│               ARCHITECTURE HYBRIDE                       │
├─────────────────────────────────────────────────────────┤
│  FRONTEND                                               │
│     ↓ ↓ ↓                                               │
│  ┌──────────────────┐  ┌──────────────────┐            │
│  │ Votre Backend API│  │ Supabase (Auth)  │            │
│  │ - Jobs           │  │ - sign_in        │            │
│  │ - Profiles       │  │ - sign_up        │            │
│  │ - Applications   │  │ - JWT tokens     │            │
│  │ - Messages       │  └──────────────────┘            │
│  └──────────────────┘                                   │
│         ↓                                               │
│  Votre Base de Données                                  │
└─────────────────────────────────────────────────────────┘
```

**Avantage** : Garde l'auth Supabase (simple et sécurisé)
**Inconvénient** : Dépendance à Supabase reste

---

## 📝 Contrats API pour l'Équipe Backend

### Endpoints Essentiels à Implémenter

#### 1. **Authentification**

```
POST /auth/register
Body: { email, password, user_type: 'athlete' | 'company' }
Response: { token, user: { id, email, user_type } }

POST /auth/login
Body: { email, password }
Response: { token, user: { id, email, user_type } }

POST /auth/logout
Headers: Authorization: Bearer {token}
Response: { success: true }

GET /auth/me
Headers: Authorization: Bearer {token}
Response: { user: { id, email, user_type, ... } }

POST /auth/forgot-password
Body: { email }
Response: { success: true, message: 'Email sent' }

POST /auth/reset-password
Body: { token, new_password }
Response: { success: true }
```

#### 2. **Profils**

```
GET /profiles/:userId
Response: { id, email, user_type, created_at, ... }

PUT /profiles/:userId
Body: { first_name, last_name, ... }
Response: { updated profile }

GET /profiles/athlete/:userId
Response: { athlete_profile data }

PUT /profiles/athlete/:userId
Body: { sport, position, height, weight, ... }
Response: { updated athlete_profile }

GET /profiles/company/:userId
Response: { company_profile data }

PUT /profiles/company/:userId
Body: { company_name, sector, ... }
Response: { updated company_profile }
```

#### 3. **Offres d'Emploi**

```
GET /jobs
Query: ?sector=sport&location=Paris&limit=20&offset=0
Response: { jobs: [...], total_count, page, limit }

GET /jobs/:jobId
Response: { job details with company info }

POST /jobs
Body: { title, description, requirements, salary_min, salary_max, ... }
Headers: Authorization (company only)
Response: { created job }

PUT /jobs/:jobId
Body: { updated fields }
Headers: Authorization (company owner only)
Response: { updated job }

DELETE /jobs/:jobId
Headers: Authorization (company owner only)
Response: { success: true }

GET /jobs/company/:companyId
Response: { jobs: [...] }
```

#### 4. **Candidatures**

```
GET /applications
Query: ?athlete_id=xxx or ?job_id=xxx
Response: { applications: [...] }

POST /applications
Body: { job_id, cover_letter, resume_url }
Headers: Authorization (athlete only)
Response: { created application }

PUT /applications/:applicationId
Body: { status: 'pending' | 'reviewing' | 'accepted' | 'rejected' }
Headers: Authorization (company or athlete)
Response: { updated application }

GET /applications/:applicationId
Response: { application with job and athlete details }
```

#### 5. **Messages**

```
GET /messages
Query: ?user_id=xxx
Response: { conversations: [...] }

POST /messages
Body: { recipient_id, subject, content }
Headers: Authorization
Response: { created message }

GET /messages/:messageId
Headers: Authorization
Response: { message details }

PUT /messages/:messageId/read
Headers: Authorization
Response: { success: true }

GET /messages/conversation/:userId
Headers: Authorization
Response: { messages between auth user and userId }
```

#### 6. **Feature Flags**

```
GET /features
Response: { categories, versions, flags }

GET /features/user/:userId
Headers: Authorization
Response: { enabled_features: [...] }

PUT /features/:featureId
Body: { is_enabled, rollout_percentage }
Headers: Authorization (admin only)
Response: { updated feature }

POST /features/:featureId/beta-access
Body: { user_id, access_type: 'beta' | 'early_access' | 'preview' }
Headers: Authorization (admin only)
Response: { success: true }
```

#### 7. **Contextes Multi-Rôles**

```
GET /contexts/user/:userId
Headers: Authorization
Response: { contexts: [...] }

GET /contexts/:contextId
Headers: Authorization
Response: { context details with permissions }

POST /organizations
Body: { name, slug, company_profile_id }
Headers: Authorization (company only)
Response: { created organization }

POST /organizations/:orgId/invite
Body: { email, role: 'owner' | 'hr_manager' | 'hr_recruiter' | ... }
Headers: Authorization (owner only)
Response: { invitation sent }

POST /delegations
Body: { athlete_profile_id, delegate_email, role: 'guardian' | 'agent' | 'manager' }
Headers: Authorization (athlete or guardian only)
Response: { delegation created }

GET /organizations/:orgId/members
Headers: Authorization
Response: { members: [...] }

GET /delegations/athlete/:athleteId
Headers: Authorization
Response: { delegates: [...] }
```

#### 8. **Tâches Partagées**

```
GET /tasks
Query: ?context_type=organization&context_id=xxx
Response: { tasks: [...] }

POST /tasks
Body: { context_type, context_id, title, description, assigned_to, priority, due_date }
Headers: Authorization
Response: { created task }

PUT /tasks/:taskId
Body: { status, assigned_to, ... }
Headers: Authorization
Response: { updated task }

POST /tasks/:taskId/comments
Body: { content }
Headers: Authorization
Response: { created comment }

GET /tasks/my
Headers: Authorization
Response: { tasks assigned to auth user }
```

#### 9. **Messages Contextuels**

```
GET /context-messages
Query: ?context_type=organization&context_id=xxx
Response: { messages: [...] }

POST /context-messages
Body: { context_type, context_id, subject, content, visibility }
Headers: Authorization
Response: { created message }

GET /context-messages/unread-count
Headers: Authorization
Response: { count: 5 }
```

#### 10. **Admin**

```
GET /admin/users
Query: ?page=1&limit=50&search=john
Response: { users: [...], total, page, limit }
Headers: Authorization (admin only)

PUT /admin/users/:userId
Body: { status: 'active' | 'suspended', permissions }
Headers: Authorization (super_admin only)
Response: { updated user }

GET /admin/analytics
Response: {
  total_users,
  active_jobs,
  total_applications,
  users_by_type,
  jobs_by_sector,
  ...
}
Headers: Authorization (admin only)

POST /admin/features/:featureId/enable
Headers: Authorization (super_admin only)
Response: { success: true }
```

### Format des Réponses

**Succès** :
```json
{
  "success": true,
  "data": { ... }
}
```

**Erreur** :
```json
{
  "success": false,
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Email ou mot de passe incorrect",
    "details": {} // optionnel
  }
}
```

### Authentification

**JWT Token** dans le header :
```
Authorization: Bearer your-jwt-token-here
```

**Payload JWT recommandé** :
```json
{
  "sub": "user-id",
  "email": "user@example.com",
  "user_type": "athlete",
  "iat": 1234567890,
  "exp": 1234567890
}
```

### Pagination

Format standard :
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "total_pages": 8
  }
}
```

---

## 🔧 Guide de Migration Supabase → Backend Custom

### Fichiers à Modifier

```
trophenix/
├─ src/
│  ├─ lib/
│  │  ├─ supabase.ts → ❌ À SUPPRIMER
│  │  └─ api.ts → ✅ NOUVEAU (client API)
│  │
│  ├─ services/
│  │  ├─ authService.ts → 🔄 MODIFIER (appels API)
│  │  ├─ profileService.ts → 🔄 MODIFIER
│  │  ├─ jobService.ts → 🔄 MODIFIER
│  │  ├─ messageService.ts → 🔄 MODIFIER
│  │  ├─ adminService.ts → 🔄 MODIFIER
│  │  ├─ contextService.ts → 🔄 MODIFIER
│  │  ├─ featureService.ts → 🔄 MODIFIER
│  │  └─ ... (tous les services)
│  │
│  ├─ contexts/
│  │  └─ AuthContext.tsx → 🔄 MODIFIER (nouvelle logique auth)
│  │
│  └─ .env → 🔄 MODIFIER
│     ├─ VITE_API_URL=https://api.trophenix.com
│     └─ (supprimer VITE_SUPABASE_*)
```

### Checklist de Migration par Service

#### ✅ AuthService

**AVANT (Supabase)** :
```typescript
const { data, error } = await supabase.auth.signInWithPassword({
  email,
  password
});
```

**APRÈS (API Backend)** :
```typescript
const response = await api.post('/auth/login', { email, password });
const { token, user } = response.data;
localStorage.setItem('auth_token', token);
```

**Fonctions à migrer** :
- [ ] `signUp()` → `POST /auth/register`
- [ ] `signIn()` → `POST /auth/login`
- [ ] `signOut()` → `POST /auth/logout`
- [ ] `getCurrentUser()` → `GET /auth/me`
- [ ] `resetPassword()` → `POST /auth/reset-password`

#### ✅ ProfileService

**AVANT** :
```typescript
const { data } = await supabase
  .from('profiles')
  .select('*')
  .eq('id', userId)
  .single();
```

**APRÈS** :
```typescript
const data = await api.get(`/profiles/${userId}`);
```

**Fonctions à migrer** :
- [ ] `getProfile()` → `GET /profiles/:id`
- [ ] `updateProfile()` → `PUT /profiles/:id`
- [ ] `getAthleteProfile()` → `GET /profiles/athlete/:id`
- [ ] `updateAthleteProfile()` → `PUT /profiles/athlete/:id`
- [ ] `getCompanyProfile()` → `GET /profiles/company/:id`
- [ ] `updateCompanyProfile()` → `PUT /profiles/company/:id`

#### ✅ JobService

**Fonctions à migrer** :
- [ ] `getAllJobs()` → `GET /jobs`
- [ ] `getJobById()` → `GET /jobs/:id`
- [ ] `createJob()` → `POST /jobs`
- [ ] `updateJob()` → `PUT /jobs/:id`
- [ ] `deleteJob()` → `DELETE /jobs/:id`
- [ ] `getCompanyJobs()` → `GET /jobs/company/:companyId`

#### ✅ MessageService

- [ ] `getMessages()` → `GET /messages`
- [ ] `sendMessage()` → `POST /messages`
- [ ] `markAsRead()` → `PUT /messages/:id/read`
- [ ] `getConversation()` → `GET /messages/conversation/:userId`

#### ✅ FeatureService

- [ ] `getAllFeatures()` → `GET /features`
- [ ] `getEnabledFeaturesForUser()` → `GET /features/user/:userId`
- [ ] `updateFeatureStatus()` → `PUT /features/:id`
- [ ] `grantBetaAccess()` → `POST /features/:id/beta-access`

#### ✅ ContextService

- [ ] `getUserContexts()` → `GET /contexts/user/:userId`
- [ ] `createOrganization()` → `POST /organizations`
- [ ] `inviteMember()` → `POST /organizations/:id/invite`
- [ ] `createDelegation()` → `POST /delegations`

### Script de Migration Semi-Automatique

```bash
#!/bin/bash
# scripts/migrate-services.sh

# Remplacer import supabase par api
find src/services -type f -name "*.ts" -exec sed -i '' 's/from "..\/lib\/supabase"/from "..\/lib\/api"/g' {} +
find src/services -type f -name "*.ts" -exec sed -i '' 's/{ supabase }/{ api }/g' {} +

echo "✅ Imports modifiés"
echo "⚠️  Review manuel nécessaire pour les appels Supabase"
echo "📝 Voir z_README_MIGRATION_SUPABASE_TO_BACKEND.md pour détails"
```

---

## ☁️ Déploiement AWS

### Architecture AWS Recommandée

```
┌─────────────────────────────────────────────────────────┐
│                    AWS ARCHITECTURE                      │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Route 53 (DNS)                                         │
│  ├─ trophenix.com → CloudFront                         │
│  └─ api.trophenix.com → ALB                            │
│                                                         │
│  CloudFront (CDN) ←────────────────┐                   │
│  └─ Cache global du frontend       │                   │
│         ↓                           │                   │
│  S3 Bucket (Frontend Static)       │                   │
│  └─ index.html, assets/            │                   │
│                                    │                   │
│  Application Load Balancer         │                   │
│  ├─ SSL/TLS Termination           │                   │
│  └─ Health checks                  │                   │
│         ↓                           │                   │
│  ECS Fargate (Backend API) ────────┘                   │
│  ├─ Auto-scaling (2-10 tasks)                          │
│  ├─ Docker container                                    │
│  └─ Environment variables (SSM)                         │
│         ↓                                               │
│  RDS PostgreSQL (Multi-AZ)                             │
│  ├─ Automated backups (7 days)                         │
│  ├─ Read replicas                                      │
│  └─ Encryption at rest                                 │
│                                                         │
│  S3 (File Storage)                                     │
│  └─ User uploads, documents                            │
│                                                         │
│  ElastiCache Redis (Optionnel)                         │
│  └─ Sessions, cache                                    │
│                                                         │
│  CloudWatch (Monitoring)                               │
│  ├─ Logs                                               │
│  ├─ Metrics                                            │
│  └─ Alarms                                             │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Étapes de Déploiement

#### 1. Frontend sur S3 + CloudFront

```bash
# Build du frontend
npm run build

# Créer un bucket S3
aws s3 mb s3://trophenix-frontend --region eu-west-1

# Configurer le bucket pour hosting
aws s3 website s3://trophenix-frontend \
  --index-document index.html \
  --error-document index.html

# Configurer les permissions
cat > bucket-policy.json <<EOF
{
  "Version": "2012-10-17",
  "Statement": [{
    "Sid": "PublicReadGetObject",
    "Effect": "Allow",
    "Principal": "*",
    "Action": "s3:GetObject",
    "Resource": "arn:aws:s3:::trophenix-frontend/*"
  }]
}
EOF

aws s3api put-bucket-policy \
  --bucket trophenix-frontend \
  --policy file://bucket-policy.json

# Upload des fichiers
aws s3 sync dist/ s3://trophenix-frontend --delete

# Créer une distribution CloudFront
aws cloudfront create-distribution \
  --origin-domain-name trophenix-frontend.s3.amazonaws.com \
  --default-root-object index.html
```

**Configuration CloudFront recommandée** :
- ✅ HTTPS obligatoire (redirections auto)
- ✅ Compression Gzip/Brotli
- ✅ Cache des assets (31536000 secondes)
- ✅ Cache HTML (0 secondes ou 300)
- ✅ Custom error responses (404 → /index.html)

#### 2. Backend sur ECS Fargate

**Dockerfile exemple (Node.js)** :
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY . .
EXPOSE 3000
CMD ["node", "dist/index.js"]
```

**Déploiement** :
```bash
# Build et push l'image Docker
docker build -t trophenix-api .

# Créer un registry ECR
aws ecr create-repository --repository-name trophenix-api

# Login à ECR
aws ecr get-login-password --region eu-west-1 | \
  docker login --username AWS --password-stdin \
  123456789.dkr.ecr.eu-west-1.amazonaws.com

# Tag et push
docker tag trophenix-api:latest \
  123456789.dkr.ecr.eu-west-1.amazonaws.com/trophenix-api:latest

docker push 123456789.dkr.ecr.eu-west-1.amazonaws.com/trophenix-api:latest

# Créer le cluster ECS
aws ecs create-cluster --cluster-name trophenix-cluster

# Créer la task definition (voir task-def.json)
aws ecs register-task-definition --cli-input-json file://task-def.json

# Créer le service ECS
aws ecs create-service \
  --cluster trophenix-cluster \
  --service-name api \
  --task-definition trophenix-api:1 \
  --desired-count 2 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-xxx],securityGroups=[sg-xxx],assignPublicIp=ENABLED}"
```

#### 3. Base de Données RDS

```bash
# Créer une instance RDS PostgreSQL
aws rds create-db-instance \
  --db-instance-identifier trophenix-db \
  --db-instance-class db.t3.medium \
  --engine postgres \
  --engine-version 15.3 \
  --master-username admin \
  --master-user-password "YourSecurePassword123!" \
  --allocated-storage 100 \
  --storage-type gp3 \
  --multi-az \
  --backup-retention-period 7 \
  --vpc-security-group-ids sg-xxx \
  --db-subnet-group-name trophenix-db-subnet

# Attendre que l'instance soit disponible
aws rds wait db-instance-available --db-instance-identifier trophenix-db

# Récupérer l'endpoint
aws rds describe-db-instances \
  --db-instance-identifier trophenix-db \
  --query 'DBInstances[0].Endpoint.Address'

# Migrer le schéma
# Exporter depuis Supabase :
pg_dump -h xxx.supabase.co -U postgres -d postgres \
  --schema-only --no-owner --no-acl > schema.sql

# Importer dans RDS :
psql -h trophenix-db.xxx.rds.amazonaws.com -U admin -d trophenix < schema.sql

# Migrer les données (si nécessaire)
pg_dump -h xxx.supabase.co -U postgres -d postgres \
  --data-only --no-owner --no-acl > data.sql

psql -h trophenix-db.xxx.rds.amazonaws.com -U admin -d trophenix < data.sql
```

#### 4. Variables d'Environnement

**Frontend (.env.production)** :
```env
VITE_API_URL=https://api.trophenix.com
VITE_ENV=production
```

**Backend (AWS Systems Manager Parameter Store)** :
```bash
# Database URL
aws ssm put-parameter \
  --name /trophenix/DATABASE_URL \
  --value "postgres://admin:pass@trophenix-db.xxx.rds.amazonaws.com:5432/trophenix" \
  --type SecureString

# JWT Secret
aws ssm put-parameter \
  --name /trophenix/JWT_SECRET \
  --value "your-super-secret-jwt-key-min-32-chars" \
  --type SecureString

# AWS S3 Bucket
aws ssm put-parameter \
  --name /trophenix/S3_BUCKET \
  --value "trophenix-uploads" \
  --type String

# Récupérer dans le backend :
# const DB_URL = await getParameter('/trophenix/DATABASE_URL');
```

#### 5. Load Balancer + Route 53

```bash
# Créer un ALB
aws elbv2 create-load-balancer \
  --name trophenix-alb \
  --subnets subnet-xxx subnet-yyy \
  --security-groups sg-xxx

# Créer un target group
aws elbv2 create-target-group \
  --name trophenix-api-tg \
  --protocol HTTP \
  --port 3000 \
  --vpc-id vpc-xxx \
  --health-check-path /health

# Créer un listener HTTPS
aws elbv2 create-listener \
  --load-balancer-arn arn:aws:elasticloadbalancing:... \
  --protocol HTTPS \
  --port 443 \
  --certificates CertificateArn=arn:aws:acm:... \
  --default-actions Type=forward,TargetGroupArn=arn:...

# Configurer Route 53
aws route53 change-resource-record-sets \
  --hosted-zone-id Z123456 \
  --change-batch file://route53-changes.json
```

### Coûts Estimés AWS (Mensuel)

| Service | Configuration | Coût estimé |
|---------|--------------|-------------|
| **S3 + CloudFront** | 10 GB storage, 100k req/mois | ~5€ |
| **ECS Fargate** | 2 tâches 0.5 vCPU, 1GB RAM | ~30€ |
| **RDS PostgreSQL** | db.t3.medium, Multi-AZ, 100GB | ~120€ |
| **Application Load Balancer** | ALB standard | ~20€ |
| **Route 53** | Hosted zone + queries | ~1€ |
| **CloudWatch** | Logs + monitoring | ~5€ |
| **Data Transfer** | 100 GB/mois | ~10€ |
| **TOTAL (Production)** | | **~190€/mois** |

**Alternative moins chère (MVP/Startup)** :
- EC2 t3.medium (~30€) + PostgreSQL sur même instance
- S3 + CloudFront (~5€)
- Route 53 (~1€)
- **Total : ~35-40€/mois**

---

## ✅ Checklist de Migration

### Phase 1 : Préparation (1-2 jours)

- [ ] Lire cette documentation complètement
- [ ] Décider de l'architecture (Option 1 recommandée)
- [ ] Préparer l'environnement AWS (compte, VPC, subnets)
- [ ] Exporter le schéma SQL de Supabase
- [ ] Exporter les données de Supabase (si nécessaire)
- [ ] Définir les contrats API avec l'équipe backend
- [ ] Créer un repo backend (si pas existant)

### Phase 2 : Backend (1-2 semaines)

- [ ] Créer la base de données (RDS PostgreSQL ou autre)
- [ ] Importer le schéma SQL
- [ ] Importer les données (si nécessaire)
- [ ] Implémenter les endpoints API Auth
- [ ] Implémenter les endpoints API Profils
- [ ] Implémenter les endpoints API Jobs
- [ ] Implémenter les endpoints API Applications
- [ ] Implémenter les endpoints API Messages
- [ ] Implémenter les endpoints API Contexts
- [ ] Implémenter les endpoints API Features
- [ ] Implémenter les endpoints API Admin
- [ ] Implémenter l'authentification JWT
- [ ] Implémenter les middlewares d'autorisation (équivalent RLS)
- [ ] Tests unitaires endpoints critiques
- [ ] Tests d'intégration
- [ ] Documentation API (Swagger/OpenAPI)

### Phase 3 : Frontend (3-5 jours)

- [ ] Créer `src/lib/api.ts` (client API)
- [ ] Créer `.env.local` avec VITE_API_URL
- [ ] Migrer `authService.ts`
- [ ] Migrer `AuthContext.tsx`
- [ ] Tester login/logout/register
- [ ] Migrer `profileService.ts`
- [ ] Migrer `jobService.ts`
- [ ] Migrer `messageService.ts`
- [ ] Migrer `contextService.ts`
- [ ] Migrer `featureService.ts`
- [ ] Migrer `adminService.ts`
- [ ] Migrer tous les autres services
- [ ] Supprimer `src/lib/supabase.ts`
- [ ] Tests manuels complets (toutes les features)
- [ ] Tests automatisés (si existants)
- [ ] Fix des bugs trouvés

### Phase 4 : Staging (2-3 jours)

- [ ] Créer environnement de staging AWS
- [ ] Déployer backend sur ECS staging
- [ ] Déployer frontend sur S3 staging
- [ ] Configurer RDS staging (ou DB test)
- [ ] Tests end-to-end en staging
- [ ] Performance testing
- [ ] Security testing
- [ ] Load testing (si nécessaire)
- [ ] Fix des bugs trouvés

### Phase 5 : Production (1-2 jours)

- [ ] Créer bucket S3 production
- [ ] Créer distribution CloudFront
- [ ] Créer RDS PostgreSQL production (Multi-AZ)
- [ ] Créer cluster ECS production
- [ ] Configurer ALB production
- [ ] Configurer Route 53
- [ ] Configurer SSL/TLS (ACM)
- [ ] Configurer CloudWatch alarms
- [ ] Configurer backups automatiques
- [ ] Variables d'environnement production (SSM)
- [ ] Migration des données Supabase → RDS
- [ ] Déployer backend production
- [ ] Build et déployer frontend production
- [ ] Tests smoke en production
- [ ] Monitoring post-déploiement
- [ ] Communiquer aux utilisateurs

### Phase 6 : Post-Migration (ongoing)

- [ ] Monitoring quotidien (CloudWatch, logs)
- [ ] Backups vérifiés
- [ ] Plan de disaster recovery testé
- [ ] Documentation équipe à jour
- [ ] Désactiver Supabase (après période de sécurité)
- [ ] Optimisations performance
- [ ] Optimisations coûts AWS
- [ ] Security audit

---

## 📊 Comparaison : Supabase vs Backend Custom

| Critère | Supabase | Backend Custom (AWS) |
|---------|----------|----------------------|
| **Temps de dev** | ✅ Très rapide (tout inclus) | ⚠️ Plus long (3-4 semaines) |
| **Contrôle** | ⚠️ Limité au framework Supabase | ✅ Total sur toute la stack |
| **Coûts Startup** | ✅ Gratuit jusqu'à 50k users | ⚠️ ~35-40€/mois minimum |
| **Coûts Scale** | ❌ Très cher (>500€/mois vite atteint) | ✅ Optimisable (~190€/mois stable) |
| **Sécurité** | ✅ RLS intégré puissant | ⚠️ À implémenter (middleware auth) |
| **Real-time** | ✅ Natif (PostgreSQL subscriptions) | ❌ À implémenter (WebSockets) |
| **Auth** | ✅ Complet (email, OAuth, MFA) | ⚠️ À implémenter (JWT custom) |
| **Storage** | ✅ Intégré (S3-like) | ✅ AWS S3 natif |
| **Flexibilité** | ⚠️ Limitée au SDK Supabase | ✅ Totale (n'importe quel framework) |
| **Vendor lock-in** | ❌ Fort (migrations difficiles) | ✅ Aucun (infrastructure standard) |
| **Scalabilité** | ✅ Auto (mais coûteuse) | ✅ Manuelle mais optimisable |
| **Latence** | ⚠️ Dépend de la région Supabase | ✅ Contrôlable (régions AWS) |
| **Maintenance** | ✅ Zéro (managé) | ⚠️ À gérer (updates, patches) |
| **Support** | ⚠️ Community (Pro $25/mois) | ✅ AWS Support (si souscrit) |

---

## 🎯 Recommandation Finale

### Vous avez DÉJÀ un backend → **MIGRATION COMPLÈTE**

**Pourquoi ?**
1. ✅ Cohérence avec votre stack existante
2. ✅ Pas de vendor lock-in
3. ✅ Contrôle total (coûts, perf, sécurité)
4. ✅ Tout le frontend est réutilisable (juste services à changer)
5. ✅ Votre équipe connaît déjà le backend

**Effort estimé** :
- Backend API : 1-2 semaines
- Migration frontend : 3-5 jours
- Déploiement AWS : 2-3 jours
- **Total : 3-4 semaines**

### Vous n'avez PAS de backend → **GARDER SUPABASE**

**Pourquoi ?**
1. ✅ Tout fonctionne déjà
2. ✅ Pas d'effort de migration
3. ✅ Focus sur les features business
4. ⚠️ Migrer plus tard si nécessaire (scaling)

---

## 📞 Documents à Partager avec l'Équipe Backend

### 1. Ce document
**`z_README_MIGRATION_SUPABASE_TO_BACKEND.md`**
- Architecture actuelle et cible
- Contrats API détaillés
- Guide de migration

### 2. Le schéma de données
**`supabase/migrations/*.sql`**
- Toutes les tables
- Toutes les relations
- Tous les index
- Fonctions SQL (à adapter)

### 3. Les types TypeScript
**`src/types/*.ts`**
- Types de toutes les entités
- Utile pour générer les modèles backend

### 4. Documentation des fonctionnalités
**`ARCHITECTURE_MULTI_ROLES_ELEA.md`**
- Système multi-rôles expliqué
- Contextes et permissions
- Cas d'usage

**`z_README_FEATURE_FLAGS.md`**
- Système de feature flags
- Comment gérer les versions

---

## 🚀 Conclusion

Cette migration est **totalement faisable** en 3-4 semaines avec une équipe compétente.

**Points clés** :
- ✅ Le frontend est **100% réutilisable**
- ✅ Le schéma SQL est **100% réutilisable**
- ✅ Seuls les **services** doivent être refactorisés
- ✅ L'architecture cible est **standard et scalable**
- ✅ AWS offre **plus de contrôle** et **meilleure scalabilité**

**Prochaines étapes** :
1. Valider l'approche avec l'équipe
2. Planifier le sprint de migration
3. Commencer par le backend (endpoints API)
4. Migrer le frontend progressivement
5. Tester en staging
6. Déployer en production

**Bonne migration ! 🚀**

---

**Questions ? Relire ce document et consulter les migrations SQL !**
