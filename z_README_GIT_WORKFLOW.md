# 🔀 Guide de gestion Git - Frontend & Backend

## 📝 Historique du document

| Date | Version | Lignes | Modifications | Auteur |
|------|---------|--------|---------------|--------|
| 2025-01-11 | 1.0 | 628 | Création guide Git workflow (frontend/backend séparés) | Claude |

---

## 📌 Vue d'ensemble

Ce guide explique comment gérer les repos Git pour un projet avec **frontend séparé** et **backend existant**.

---

## 🏗️ Architecture recommandée

### Option A : Repos séparés (RECOMMANDÉ) ⭐

```
Organisation GitHub : trophenix/

├── trophenix-backend/          ← Repo existant Django
│   ├── apps/
│   ├── manage.py
│   ├── requirements.txt
│   └── README.md
│
└── trophenix-frontend/         ← Ce nouveau repo React
    ├── src/
    ├── package.json
    ├── README.md
    └── vite.config.ts
```

**Pourquoi c'est la meilleure solution ?**

| Aspect | Avantage |
|--------|----------|
| **Déploiement** | Frontend (Vercel/Netlify) et Backend (Railway/Heroku) séparés |
| **CI/CD** | Pipelines indépendants = plus rapide |
| **Équipes** | Dev frontend et backend en parallèle sans conflit |
| **Permissions** | Contrôle d'accès granulaire par repo |
| **Historique** | Git history propre pour chaque stack |
| **Build time** | Tests et builds plus rapides |
| **Versions** | Versioning indépendant (frontend v2.1, backend v1.8) |

---

## 📋 Mise en place - Repos séparés

### Étape 1 : Créer le repo frontend

```bash
# 1. Aller dans le dossier du projet frontend actuel
cd /chemin/vers/trophenix-frontend

# 2. Initialiser Git (si pas déjà fait)
git init

# 3. Ajouter tous les fichiers
git add .

# 4. Premier commit
git commit -m "Initial commit - Trophenix Frontend"

# 5. Créer le repo sur GitHub
# Via interface GitHub : https://github.com/new
# Nom du repo : trophenix-frontend
# Description : "Frontend React/TypeScript pour Trophenix"
# Visibilité : Private

# 6. Connecter au repo distant
git remote add origin https://github.com/votre-org/trophenix-frontend.git

# 7. Pousser le code
git branch -M main
git push -u origin main
```

### Étape 2 : Structure des branches

**Frontend** (`trophenix-frontend`) :
```
main                    ← Production
├── develop            ← Développement principal
├── feature/agent-elea ← Fonctionnalité agent IA
├── feature/athlete-dashboard
├── feature/company-dashboard
└── hotfix/login-bug   ← Corrections urgentes
```

**Backend** (`trophenix-backend`) :
```
main                    ← Production
├── develop            ← Développement principal
├── feature/api-athletes
├── feature/api-companies
└── hotfix/auth-fix
```

### Étape 3 : Configuration des environments

#### Frontend `.env.development`
```bash
# Développement local
VITE_API_URL=http://localhost:8000/api

# Pour tester avec backend de staging
# VITE_API_URL=https://staging-api.trophenix.com/api
```

#### Frontend `.env.production`
```bash
# Production
VITE_API_URL=https://api.trophenix.com/api
```

#### Backend `settings.py`
```python
# Development
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",    # Frontend dev
]

# Production (à ajouter via env vars)
if not DEBUG:
    CORS_ALLOWED_ORIGINS = [
        "https://trophenix.com",
        "https://www.trophenix.com",
    ]
```

### Étape 4 : Lien entre les repos

#### Dans le README du Frontend
```markdown
# Trophenix Frontend

## Backend associé
👉 [trophenix-backend](https://github.com/votre-org/trophenix-backend)

## Setup
1. Cloner ce repo
2. `npm install`
3. Configurer `.env` avec l'URL du backend
4. `npm run dev`
```

#### Dans le README du Backend
```markdown
# Trophenix Backend

## Frontend associé
👉 [trophenix-frontend](https://github.com/votre-org/trophenix-frontend)

## Setup
1. Cloner ce repo
2. `pip install -r requirements.txt`
3. Configurer CORS pour le frontend
4. `python manage.py runserver`
```

---

## 🔄 Workflow de développement

### Développement d'une nouvelle fonctionnalité

#### Exemple : Ajouter une page "Messagerie"

**Frontend** :
```bash
# 1. Créer une branche depuis develop
git checkout develop
git pull origin develop
git checkout -b feature/messaging

# 2. Développer la fonctionnalité
# Créer composants, services, etc.

# 3. Commit réguliers
git add .
git commit -m "feat: add messaging UI components"
git commit -m "feat: add messaging service API calls"

# 4. Push et Pull Request
git push origin feature/messaging
# Créer une PR sur GitHub : feature/messaging → develop
```

**Backend** (en parallèle) :
```bash
# 1. Créer une branche depuis develop
git checkout develop
git pull origin develop
git checkout -b feature/api-messaging

# 2. Développer l'API
# Créer modèles, serializers, views, URLs

# 3. Commit réguliers
git add .
git commit -m "feat: add Message model and migrations"
git commit -m "feat: add messaging API endpoints"

# 4. Push et Pull Request
git push origin feature/api-messaging
# Créer une PR sur GitHub : feature/api-messaging → develop
```

### Convention de commits (pour les deux repos)

```bash
# Nouvelle fonctionnalité
git commit -m "feat: add user profile page"

# Correction de bug
git commit -m "fix: resolve login redirect issue"

# Amélioration
git commit -m "refactor: optimize API calls"

# Documentation
git commit -m "docs: update integration guide"

# Style/Format
git commit -m "style: format code with prettier"

# Tests
git commit -m "test: add unit tests for auth service"
```

---

## 🚀 Déploiement

### Frontend (Vercel/Netlify)

**Configuration Vercel** :
```yaml
# vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "env": {
    "VITE_API_URL": "https://api.trophenix.com/api"
  }
}
```

**Déploiement automatique** :
- `main` → Production : `https://trophenix.com`
- `develop` → Staging : `https://dev.trophenix.com`

### Backend (Railway/Heroku)

**Configuration Railway** :
```bash
# Variables d'environnement
DJANGO_SETTINGS_MODULE=config.settings.production
CORS_ALLOWED_ORIGINS=https://trophenix.com,https://www.trophenix.com
```

**Déploiement automatique** :
- `main` → Production : `https://api.trophenix.com`
- `develop` → Staging : `https://staging-api.trophenix.com`

---

## 🔐 Gestion des accès

### Permissions recommandées

**Organisation GitHub : `trophenix`**

| Équipe | Repo Frontend | Repo Backend | Permissions |
|--------|---------------|--------------|-------------|
| **Lead Dev** | ✅ Admin | ✅ Admin | Tout |
| **Dev Frontend** | ✅ Write | 👀 Read | Commits frontend, lecture backend |
| **Dev Backend** | 👀 Read | ✅ Write | Commits backend, lecture frontend |
| **Designer** | 👀 Read | ❌ None | Lecture frontend |
| **Product Owner** | 👀 Read | 👀 Read | Lecture uniquement |

### Configuration
```bash
# Sur GitHub → Settings → Manage access
# Créer des teams :
- frontend-team (write sur frontend, read sur backend)
- backend-team (write sur backend, read sur frontend)
- leads (admin sur tout)
```

---

## 📝 Communication entre équipes

### GitHub Projects (recommandé)

Créer un **Project Board partagé** :

```
https://github.com/orgs/trophenix/projects/1

Colonnes :
├── 📋 Backlog
├── 🎯 To Do
├── 🔨 In Progress (Frontend)
├── ⚙️ In Progress (Backend)
├── 👀 Review
├── ✅ Done
└── 🚀 Deployed
```

**Lier les issues** :
```markdown
# Issue Frontend
Titre : [FRONT] Add messaging page

# Issue Backend liée
Ref : trophenix/trophenix-backend#42
```

### Documentation partagée

**Créer un repo de documentation** :
```
trophenix-docs/
├── README.md
├── API.md              ← Documentation API (backend)
├── COMPONENTS.md       ← Documentation composants (frontend)
├── ARCHITECTURE.md     ← Architecture globale
└── DEPLOYMENT.md       ← Processus de déploiement
```

---

## 🆘 Scénarios courants

### Scénario 1 : Backend change une API

**Backend** :
```bash
# 1. Créer une branche
git checkout -b breaking/api-v2

# 2. Modifier l'API
# IMPORTANT : Versionner l'API
# /api/v1/profiles/ → /api/v2/profiles/

# 3. Commit et PR
git commit -m "breaking: migrate to API v2"
git push origin breaking/api-v2
```

**Frontend** :
```bash
# 1. Créer une branche correspondante
git checkout -b chore/migrate-api-v2

# 2. Adapter les services
# Modifier src/services/*.ts

# 3. Commit et PR
git commit -m "chore: migrate to backend API v2"
git push origin chore/migrate-api-v2
```

**Communication** :
- Backend crée une issue : `[BREAKING] API v2 migration`
- Frontend référence cette issue dans sa PR

### Scénario 2 : Frontend a besoin d'un nouveau endpoint

**Frontend** :
```bash
# 1. Créer une issue dans le repo backend
Titre : [API REQUEST] GET /api/athletes/recommendations

Description :
- Endpoint : GET /api/athletes/recommendations
- Params : ?sport=football&level=elite
- Response : { recommendations: [...] }
- Use case : Page recommandations athlètes
```

**Backend** :
```bash
# 2. Créer une branche
git checkout -b feature/athletes-recommendations

# 3. Implémenter l'endpoint
# 4. Documenter dans API.md
# 5. PR et merge
```

**Frontend** :
```bash
# 3. Une fois le backend mergé
git checkout -b feature/recommendations-page
# Utiliser le nouvel endpoint
```

### Scénario 3 : Bug critique en production

**Hotfix simultané** :

Frontend :
```bash
git checkout main
git checkout -b hotfix/critical-auth-bug
# Fix
git commit -m "fix: resolve critical auth bug"
git push origin hotfix/critical-auth-bug
# PR → main (fast-track review)
```

Backend :
```bash
git checkout main
git checkout -b hotfix/critical-auth-bug
# Fix
git commit -m "fix: resolve critical auth bug"
git push origin hotfix/critical-auth-bug
# PR → main (fast-track review)
```

**Coordonner le déploiement** :
1. Merge backend en premier
2. Déployer backend
3. Merge frontend
4. Déployer frontend

---

## 🧪 Tests et CI/CD

### Frontend - GitHub Actions

**`.github/workflows/ci.yml`** :
```yaml
name: Frontend CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
      - run: npm run build
```

### Backend - GitHub Actions

**`.github/workflows/ci.yml`** :
```yaml
name: Backend CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      - run: pip install -r requirements.txt
      - run: python manage.py test
      - run: flake8 .
```

---

## 📊 Monitoring et synchronisation

### Vérifier la compatibilité

**Script de test d'intégration** :

Créer un repo `trophenix-integration-tests` :
```javascript
// test-api-compatibility.js
// Tests qui vérifient que frontend et backend sont compatibles

describe('API Compatibility', () => {
  test('Auth endpoints work', async () => {
    const response = await fetch('https://api.trophenix.com/api/auth/register/', {
      method: 'POST',
      body: JSON.stringify({ email: 'test@test.com', password: 'test123' })
    });
    expect(response.status).toBe(201);
  });
});
```

### Versions compatibles

Créer un fichier `COMPATIBILITY.md` dans chaque repo :

**Frontend** :
```markdown
# Compatibilité

| Frontend Version | Backend Version Compatible |
|------------------|----------------------------|
| v1.0.0           | v1.0.0 - v1.2.0           |
| v1.1.0           | v1.2.0 - v1.5.0           |
| v2.0.0           | v2.0.0+                    |
```

**Backend** :
```markdown
# Compatibilité

| Backend Version | Frontend Version Compatible |
|-----------------|----------------------------|
| v1.0.0          | v1.0.0 - v1.1.0           |
| v2.0.0          | v2.0.0+                    |
```

---

## 🎯 Checklist de démarrage

### Pour l'équipe Frontend
- [ ] Cloner `trophenix-frontend`
- [ ] `npm install`
- [ ] Configurer `.env.development` avec URL backend local
- [ ] Demander accès au repo backend (read)
- [ ] Lire `DJANGO_INTEGRATION.md` pour comprendre l'API
- [ ] Rejoindre le GitHub Project Board
- [ ] `npm run dev`

### Pour l'équipe Backend
- [ ] Cloner `trophenix-backend`
- [ ] `pip install -r requirements.txt`
- [ ] Configurer CORS pour `http://localhost:5173`
- [ ] Demander accès au repo frontend (read)
- [ ] Lire la documentation frontend
- [ ] Rejoindre le GitHub Project Board
- [ ] `python manage.py runserver`

### Pour le Lead Dev
- [ ] Créer l'organisation GitHub `trophenix`
- [ ] Créer les deux repos
- [ ] Configurer les teams et permissions
- [ ] Créer le GitHub Project Board partagé
- [ ] Configurer les déploiements automatiques
- [ ] Configurer les variables d'environnement
- [ ] Créer le repo de documentation (optionnel)

---

## 💡 Bonnes pratiques

### ✅ À FAIRE
1. **Communiquer** : Prévenir l'autre équipe des breaking changes
2. **Documenter** : API changes, nouveaux endpoints, nouveaux composants
3. **Versionner** : Utiliser semantic versioning (v1.2.3)
4. **Tester** : Tests end-to-end réguliers
5. **Review** : Code review croisée (backend review frontend et vice-versa)
6. **Sync** : Réunions régulières frontend/backend

### ❌ À ÉVITER
1. Changer l'API sans prévenir
2. Merger dans `main` sans review
3. Commit directement sur `main` ou `develop`
4. Coder des fonctionnalités sans coordonner
5. Oublier de mettre à jour la documentation

---

## 📞 En cas de problème

### Conflits de versions
```bash
# Frontend ne peut pas se connecter au backend
# 1. Vérifier les versions dans COMPATIBILITY.md
# 2. Vérifier l'URL dans .env
# 3. Vérifier CORS dans backend settings.py
# 4. Tester l'endpoint avec curl/Postman
```

### Problèmes de CORS
```bash
# Erreur : "CORS policy blocked"
# Backend : Ajouter l'origin frontend dans CORS_ALLOWED_ORIGINS
# Frontend : Vérifier VITE_API_URL dans .env
```

### Désynchronisation
```bash
# Frontend attend un champ que backend ne retourne pas
# 1. Vérifier la documentation API
# 2. Créer une issue sur le repo backend
# 3. Hotfix si critique, sinon plannifier pour prochain sprint
```

---

## ✅ Résumé

**Solution recommandée** : **Repos séparés** avec communication API

| Aspect | Setup |
|--------|-------|
| **Repos** | 2 repos séparés dans la même organisation |
| **Branches** | `main` (prod), `develop` (dev), `feature/*` |
| **Communication** | GitHub Projects + Issues liées |
| **Documentation** | README avec liens croisés |
| **Déploiement** | Automatique via CI/CD |
| **Tests** | CI/CD sur chaque PR |

**Avantage principal** : Équipes autonomes, déploiement indépendant, historique propre !

---

✅ **Prêt pour la collaboration frontend/backend professionnelle !**