# Trophenix - Plateforme de Gestion de Carrière des Sportifs de Haut Niveau

Version 2026-V1.0

## 📝 Historique du document

| Date | Version | Lignes | Modifications | Auteur |
|------|---------|--------|---------------|--------|
| 2025-10-11 | 2.2 | 598 | Ajout documentation architecture scalable future + mise à jour liens z_README | Claude |
| 2025-10-11 | 2.1 | 595 | Activation Agent Elea sur toutes les pages (Landing, Admin, Pending) | Claude |
| 2025-10-11 | 2.0 | 578 | Implémentation complète Agent IA Elea + Architecture Multi-Agents | Claude |
| 2025-10-11 | 1.6 | 560 | Ajout documentation déploiement et sécurité agents IA | Claude |
| 2025-10-11 | 1.5 | 560 | Ajout section expliquant la logique des z_README_* | Claude |
| 2025-01-11 | 1.4 | 520 | Renommage README secondaires avec préfixe z_ pour organisation | Claude |
| 2025-01-11 | 1.3 | 517 | Ajout liens vers README_DEPLOYMENT, README_API, README_DESIGN_UX_UI | Claude |
| 2025-01-11 | 1.2 | 490 | Mise à jour section documentation complémentaire | Claude |
| 2025-01-11 | 1.1 | 480 | Ajout guide sécurité et développeur | Claude |
| 2025-01-10 | 1.0 | 450 | Version initiale - Architecture et setup | Claude |

---

## 🌟 Vision Stratégique

**Trophenix ambitionne de devenir l'infrastructure mondiale du sport - Le Google/AWS du sport.**

De plateforme de recrutement à écosystème complet incluant : réseau social sportif, sponsoring, tournois, e-commerce, formation, et bien plus.

📖 **[Lire la vision complète sur 10 ans](./z_README_ULTIMATE_VISION.md)** - Roadmap détaillée, architecture multi-tenant, cas d'usage (Comité Olympique, Armée, Sponsors), modèle économique (1Mds€ projeté).

---

## 📋 Table des matières

- [🚀 Démarrage Rapide](#-démarrage-rapide-pour-nouveaux-développeurs)
- [Architecture](#architecture)
- [Structure du projet](#structure-du-projet)
- [Technologies](#technologies)
- [Installation](#installation)
- [Guide de développement](#guide-de-développement)
- [Base de données](#base-de-données)
- [Ajout de nouvelles fonctionnalités](#ajout-de-nouvelles-fonctionnalités)
- [📚 Documentation Complète](#-documentation-complète)

---

## 🚀 Démarrage Rapide (pour Nouveaux Développeurs)

### 👋 Bienvenue !

Ce projet est un **frontend React/TypeScript** architecturé pour une intégration facile avec n'importe quel backend (Django, Express, FastAPI, etc.).

### ⚡ Installation en 5 minutes

```bash
# 1. Cloner le repo
git clone <url>
cd trophenix-frontend

# 2. Installer les dépendances
npm install

# 3. Configurer les variables d'environnement
# Copier .env.example (ou créer .env) et remplir :
# VITE_SUPABASE_URL=... ou VITE_API_BASE_URL=...

# 4. Lancer le dev server
npm run dev
```

### 🎯 Vous êtes développeur Backend ?

**Lisez d'abord** : [`z_README_INTEGRATION_GUIDE.md`](./z_README_INTEGRATION_GUIDE.md)

Ce guide explique :
- ✅ Comment remplacer Supabase par votre API
- ✅ Quels fichiers modifier (et ne PAS modifier)
- ✅ Structure des données attendues
- ✅ Exemples d'intégration Django/Express
- ✅ Checklist complète d'intégration

### 📁 Fichiers Clés à Connaître

| Fichier | Rôle | Quand le consulter |
|---------|------|-------------------|
| [`z_README_INTEGRATION_GUIDE.md`](./z_README_INTEGRATION_GUIDE.md) | Guide intégration backend | **LIRE EN PREMIER** si vous intégrez ce frontend |
| [`src/lib/supabase.ts`](./src/lib/supabase.ts) | Client API actuel | À remplacer par votre client API |
| [`src/services/authService.ts`](./src/services/authService.ts) | Logique d'authentification | À adapter pour vos endpoints |
| [`src/contexts/AuthContext.tsx`](./src/contexts/AuthContext.tsx) | État global auth | À adapter pour JWT/session |
| [`src/types/index.ts`](./src/types/index.ts) | Structure des données | Définit le contrat API |
| [`src/constants/userTypes.ts`](./src/constants/userTypes.ts) | Configuration métier | Pour ajouter des types d'utilisateurs |

### 🗺️ Architecture Simplifiée

```
Frontend React
    │
    ├─ UI (Components)          ← Ne pas modifier
    │  └─ src/components/
    │
    ├─ Logique (Services)       ← À adapter pour votre backend
    │  └─ src/services/
    │
    └─ API Client               ← À remplacer
       └─ src/lib/supabase.ts   → Remplacer par votre client (axios, fetch, etc.)
```

**Principe** : Les composants UI appellent les services, les services appellent l'API.
Remplacez uniquement la couche API, le reste fonctionne tel quel ! ✨

---

## 🏗️ Architecture

Le projet suit les principes du **Clean Code** et respecte l'**architecture en couches** pour garantir :
- ✅ La séparation des responsabilités
- ✅ La maintenabilité du code
- ✅ La testabilité
- ✅ La scalabilité
- ✅ La facilité d'intégration backend

### Principes SOLID appliqués

| Principe | Application |
|----------|-------------|
| **Single Responsibility** | Chaque module a une responsabilité unique et bien définie |
| **Open/Closed** | Le code est ouvert à l'extension mais fermé à la modification |
| **Liskov Substitution** | Les interfaces sont respectées et substituables |
| **Interface Segregation** | Interfaces spécifiques plutôt que générales |
| **Dependency Inversion** | Les composants UI dépendent des abstractions (services, hooks) |

### Séparation des couches

```
┌─────────────────────────────────────────┐
│           UI Layer (Components)          │  ← Présentation uniquement
├─────────────────────────────────────────┤
│      Business Logic (Services/Hooks)     │  ← Logique métier
├─────────────────────────────────────────┤
│      Data Layer (Supabase Client)        │  ← Accès aux données
└─────────────────────────────────────────┘
```

---

## 📁 Structure du projet

```
src/
├── components/              # Composants React (UI uniquement)
│   ├── Admin/              # Interface administrateur
│   ├── Athletes/           # Gestion des athlètes
│   ├── Auth/               # Authentification et onboarding
│   └── Profiles/           # Profils utilisateurs
│
├── constants/              # ⚡ Configuration et options
│   ├── index.ts           # Point d'entrée
│   ├── userTypes.ts       # Types d'utilisateurs et configuration
│   └── onboardingOptions.ts # Options des formulaires (sports, secteurs, etc.)
│
├── contexts/               # Contextes React (état global)
│   └── AuthContext.tsx    # Gestion de l'authentification
│
├── hooks/                  # Hooks React personnalisés
│   └── (À venir)          # useForm, useDebounce, etc.
│
├── lib/                    # Configuration des bibliothèques externes
│   └── supabase.ts        # Client Supabase
│
├── services/               # 🎯 Logique métier (Business Logic)
│   └── authService.ts     # Service d'authentification
│
├── types/                  # 📝 Définitions TypeScript
│   └── index.ts           # Types de données (correspond à la DB)
│
├── utils/                  # Fonctions utilitaires
│   └── validation.ts      # Fonctions de validation
│
├── App.tsx                 # Composant racine
├── main.tsx               # Point d'entrée
└── index.css              # Styles globaux
```

### 🔑 Fichiers clés

| Fichier | Rôle | Quand le modifier |
|---------|------|-------------------|
| `constants/userTypes.ts` | Configuration des types d'utilisateurs | Ajout d'un nouveau type (coach, parent, etc.) |
| `constants/onboardingOptions.ts` | Options des formulaires | Ajout de sports, secteurs, villes, etc. |
| `types/index.ts` | Structure des données | Modification de la base de données |
| `services/authService.ts` | Logique d'authentification | Ajout de nouvelles méthodes d'auth |

---

## 🛠️ Technologies

### Frontend
- **React 18** - Framework UI
- **TypeScript** - Typage statique
- **Vite** - Build tool et dev server
- **TailwindCSS** - Framework CSS utility-first
- **Lucide React** - Icônes

### Backend (Supabase)
- **PostgreSQL** - Base de données relationnelle
- **Supabase Auth** - Authentification
- **Row Level Security (RLS)** - Sécurité au niveau des lignes
- **Supabase Client** - SDK JavaScript

---

## 📦 Installation

### Prérequis
- Node.js 18+
- npm ou yarn

### Étapes

```bash
# 1. Installer les dépendances
npm install

# 2. Configurer les variables d'environnement
# Copier .env et remplir avec vos clés Supabase
# VITE_SUPABASE_URL=votre_url
# VITE_SUPABASE_ANON_KEY=votre_cle

# 3. Lancer le serveur de développement
npm run dev

# 4. Build pour la production
npm run build

# 5. Vérifier les types TypeScript
npm run typecheck
```

---

## 💻 Guide de développement

### Conventions de code

#### 1. Nommage

```typescript
// Composants : PascalCase
export function AthleteProfile() {}

// Fonctions : camelCase
function validateEmail() {}

// Constantes : UPPER_SNAKE_CASE
const USER_TYPES = {}

// Types : PascalCase
type UserProfile = {}
```

#### 2. Organisation des imports

```typescript
// 1. Imports externes
import { useState } from 'react';
import { Trophy } from 'lucide-react';

// 2. Imports internes (services, utils)
import { AuthService } from '../services/authService';
import { isValidEmail } from '../utils/validation';

// 3. Imports de types
import type { UserType, Profile } from '../types';

// 4. Imports de constantes
import { USER_TYPES, ATHLETE_OPTIONS } from '../constants';
```

#### 3. Documentation JSDoc

```typescript
/**
 * Crée un nouveau profil utilisateur
 *
 * @param userId - ID de l'utilisateur
 * @param userType - Type d'utilisateur (athlete, company)
 * @returns Résultat de l'opération
 */
async function createProfile(userId: string, userType: UserType) {
  // ...
}
```

### Gestion d'état

```
Context (AuthContext)      ← État global (user, profile)
     ↓
Components                 ← État local (UI, forms)
     ↓
Services                   ← Logique métier
     ↓
Supabase                   ← Base de données
```

---

## 🗄️ Base de données

### Structure des tables

```sql
profiles                    # Profils utilisateurs principaux
├── id (uuid, PK)
├── email (text)
├── user_type (text)       # 'athlete' | 'company' | 'admin'
├── validation_status      # 'pending' | 'approved' | 'rejected'
└── created_at, updated_at

athlete_profiles           # Profils détaillés des athlètes
├── id (uuid, PK)
├── user_id (uuid, FK)
├── first_name, last_name
├── sport, sport_level
├── desired_field
└── ... (voir types/index.ts)

company_profiles           # Profils détaillés des entreprises
├── id (uuid, PK)
├── user_id (uuid, FK)
├── company_name
├── sector
└── ... (voir types/index.ts)

contact_events             # Historique des contacts
├── id (uuid, PK)
├── athlete_id (uuid)
├── contactor_id (uuid)
└── contacted_at
```

### Migrations

Les migrations sont dans `supabase/migrations/`. Chaque migration :
1. ✅ Est documentée avec un commentaire explicatif
2. ✅ Utilise `IF NOT EXISTS` pour l'idempotence
3. ✅ Configure le RLS (Row Level Security)
4. ✅ Définit les policies d'accès

**Exemple** :
```sql
/*
  # Nom de la migration

  1. Tables créées
    - `table_name` : description

  2. Security
    - Enable RLS
    - Add policies
*/

CREATE TABLE IF NOT EXISTS table_name (...);
ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;
CREATE POLICY "policy_name" ON table_name ...;
```

---

## ➕ Ajout de nouvelles fonctionnalités

### 📝 Ajouter un nouveau type d'utilisateur (ex: Coach)

#### 1. Constantes (`constants/userTypes.ts`)
```typescript
export const USER_TYPES = {
  ATHLETE: 'athlete',
  COMPANY: 'company',
  COACH: 'coach', // ← NOUVEAU
} as const;

export const USER_TYPE_CONFIG = {
  // ...
  [USER_TYPES.COACH]: {
    label: 'Coach',
    description: 'Je suis un coach sportif',
    iconType: 'whistle',
    gradientFrom: 'blue-400',
    gradientTo: 'blue-500',
    onboardingSteps: 4,
    databaseTable: 'coach_profiles',
  },
};
```

#### 2. Types (`types/index.ts`)
```typescript
export type UserType = 'athlete' | 'company' | 'admin' | 'coach'; // ← Ajouter 'coach'

export interface CoachProfile {
  id: string;
  user_id: string;
  // ... champs spécifiques
}
```

#### 3. Migration Supabase
```sql
-- supabase/migrations/YYYYMMDDHHMMSS_add_coach_profiles.sql
CREATE TABLE IF NOT EXISTS coach_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  -- ... champs
);

ALTER TABLE coach_profiles ENABLE ROW LEVEL SECURITY;
```

#### 4. Composant Onboarding (`components/Auth/CoachOnboarding.tsx`)
```typescript
export function CoachOnboarding({ onComplete, onBack }: Props) {
  // Formulaire spécifique aux coaches
}
```

#### 5. Service (`services/authService.ts`)
```typescript
static async createCoachProfile(
  userId: string,
  profileData: Partial<CoachProfile>
): Promise<AuthResult> {
  // ...
}
```

### 🎯 Ajouter une nouvelle option de formulaire

Modifier uniquement `constants/onboardingOptions.ts` :

```typescript
export const ATHLETE_OPTIONS = {
  SPORTS: [
    // ... sports existants
    'Padel', // ← Nouveau sport
  ],
};
```

**Aucun changement de code nécessaire** - l'UI se met à jour automatiquement ! ✨

### 🔒 Ajouter une nouvelle règle de validation

Dans `utils/validation.ts` :

```typescript
/**
 * Valide un numéro de téléphone français
 */
export function isValidPhoneNumber(phone: string): boolean {
  const phoneRegex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;
  return phoneRegex.test(phone);
}
```

---

## 🔐 Sécurité

### Row Level Security (RLS)

Toutes les tables utilisent RLS pour garantir :
- ✅ Les utilisateurs ne voient que leurs propres données
- ✅ Les admins ont accès à tout
- ✅ Les données sensibles sont protégées

### Bonnes pratiques

1. **Jamais de secrets côté client** - Utiliser les variables d'environnement
2. **Toujours valider côté serveur** - Ne jamais faire confiance au client
3. **Utiliser les policies RLS** - Ne jamais désactiver RLS en production
4. **Logger les erreurs** - Mais jamais les données sensibles

---

## 📊 Tests

### Tests unitaires (À venir)

```bash
# Tests des services
npm test services/authService.test.ts

# Tests des utils
npm test utils/validation.test.ts
```

### Tests d'intégration (À venir)

```bash
# Tests des flows complets
npm test e2e/signup.test.ts
```

---

## 🚀 Déploiement

### Build de production

```bash
npm run build
```

Les fichiers sont générés dans `dist/`.

### Variables d'environnement

```bash
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxx...
```

---

## 👥 Contribution

### Workflow

1. Créer une branche feature : `git checkout -b feature/nom-feature`
2. Coder en suivant les conventions
3. Commiter : `git commit -m "feat: description"`
4. Push : `git push origin feature/nom-feature`
5. Créer une Pull Request

### Standards de commit

- `feat:` - Nouvelle fonctionnalité
- `fix:` - Correction de bug
- `docs:` - Documentation
- `refactor:` - Refactoring
- `style:` - Formatage
- `test:` - Tests

---

## 📞 Support

Pour toute question sur l'architecture ou le code, référez-vous à :
- `types/index.ts` - Structure des données
- `constants/` - Configuration
- `services/` - Logique métier
- Ce README

---

---

## 📚 Documentation Complète

Ce README couvre l'essentiel. Pour des guides approfondis, consultez :

### 🔌 Intégration & API

| Document | Description |
|----------|-------------|
| [`z_README_INTEGRATION_GUIDE.md`](./z_README_INTEGRATION_GUIDE.md) | **Guide d'intégration backend** (Django, Express, etc.) |
| [`z_README_API.md`](./z_README_API.md) | Documentation API exhaustive (endpoints, filtres, exemples) |
| [`z_README_DJANGO_INTEGRATION.md`](./z_README_DJANGO_INTEGRATION.md) | Guide spécifique Django REST Framework |

### 🗄️ Base de Données & Backend

| Document | Description |
|----------|-------------|
| [`z_README_SUPABASE_SETUP.md`](./z_README_SUPABASE_SETUP.md) | Configuration Supabase (migrations, RLS, storage) |
| [`z_README_DEVELOPER_GUIDE.md`](./z_README_DEVELOPER_GUIDE.md) | Migration données en dur → Base de données |

### 🎨 Design & UX

| Document | Description |
|----------|-------------|
| [`z_README_DESIGN_UX_UI.md`](./z_README_DESIGN_UX_UI.md) | Système de design complet (couleurs, typo, composants, WCAG) |

### 🤖 Intelligence Artificielle

| Document | Description |
|----------|-------------|
| [`z_README_AI_AGENT_INTEGRATION.md`](./z_README_AI_AGENT_INTEGRATION.md) | Agent conversationnel Elea (architecture, stratégie V1/V2, multi-agents) |
| [`z_README_AI_DEPLOYMENT_SECURITY.md`](./z_README_AI_DEPLOYMENT_SECURITY.md) | **Déploiement & Sécurité Agents IA** (architecture, auth, monitoring, RGPD) |
| [`z_README_MULTI_AGENT_ARCHITECTURE.md`](./z_README_MULTI_AGENT_ARCHITECTURE.md) | **Guide développeur multi-agents** (ajouter un agent en 5 étapes) |
| [`z_README_SCALABLE_ARCHITECTURE_FUTURE.md`](./z_README_SCALABLE_ARCHITECTURE_FUTURE.md) | **Architecture scalable future** (workflows autonomes, navigation web, agents avancés) |

### 🚀 Déploiement & DevOps

| Document | Description |
|----------|-------------|
| [`z_README_DEPLOYMENT.md`](./z_README_DEPLOYMENT.md) | Guide déploiement production (Vercel, CDN, monitoring) |
| [`z_README_GIT_WORKFLOW.md`](./z_README_GIT_WORKFLOW.md) | Workflow Git avancé (multi-repos, branching, CI/CD) |

### 🔐 Sécurité

| Document | Description |
|----------|-------------|
| [`z_README_SECURITY.md`](./z_README_SECURITY.md) | Audit sécurité & défenses (RLS, OWASP, pentest) |

---

## 📄 Licence

Propriétaire - Trophenix © 2026
