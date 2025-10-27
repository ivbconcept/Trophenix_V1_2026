# 🚀 Guide de Déploiement - Trophenix

## 📝 Historique du document

| Date | Version | Lignes | Modifications | Auteur |
|------|---------|--------|---------------|--------|
| 2025-01-11 | 1.0 | 1024 | Création du guide de déploiement complet | Claude |

---

## 📌 Vue d'ensemble

Ce guide couvre le déploiement complet de l'application Trophenix en production, du setup initial au monitoring post-déploiement.

**Stack de déploiement recommandé** :
- **Frontend** : Vercel (ou Netlify)
- **Backend** : Render / Railway / Heroku (ou VPS)
- **Base de données** : Supabase (déjà configuré)
- **CDN** : Intégré dans Vercel/Netlify
- **Monitoring** : Sentry + Vercel Analytics

---

## 🏗️ Architecture de déploiement

```
┌─────────────────────────────────────────────────────────────┐
│                         UTILISATEURS                        │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                    CDN / Edge Network                       │
│                 (Vercel Edge / Cloudflare)                  │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (React/Vite)                    │
│                         Vercel                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  • index.html + assets statiques                    │   │
│  │  • Routing côté client (React Router)              │   │
│  │  • Build optimisé (minifié, tree-shaking)          │   │
│  └─────────────────────────────────────────────────────┘   │
└───────┬─────────────────────────────────────┬───────────────┘
        │                                     │
        │                                     │
        ▼                                     ▼
┌───────────────────────┐         ┌─────────────────────────┐
│  SUPABASE (Database)  │         │  BACKEND (Django)       │
│  • PostgreSQL         │         │  • REST API             │
│  • Auth (JWT)         │         │  • Business logic       │
│  • Storage            │         │  • Admin panel          │
│  • Row Level Security │         │  Render / Railway       │
└───────────────────────┘         └─────────────────────────┘
```

---

## 📋 Prérequis avant déploiement

### Comptes nécessaires

- [ ] Compte GitHub (code source)
- [ ] Compte Vercel (frontend)
- [ ] Compte Supabase (base de données - déjà configuré)
- [ ] Compte Render/Railway (backend Django - optionnel)
- [ ] Compte Sentry (monitoring erreurs - recommandé)
- [ ] Nom de domaine (optionnel mais recommandé)

### Vérifications code

```bash
# 1. Tests passent
npm run test # Si vous avez des tests

# 2. Build fonctionne
npm run build

# 3. Pas d'erreurs TypeScript
npm run typecheck

# 4. Pas de vulnérabilités critiques
npm audit --audit-level=high

# 5. Pas de secrets dans le code
grep -r "password\|secret\|api_key" src/
```

---

## 🌐 Déploiement Frontend (Vercel)

### Option 1 : Via GitHub (Recommandé)

#### Étape 1 : Préparer le repository

```bash
# Si pas encore fait, initialiser git
git init
git add .
git commit -m "Initial commit"

# Créer un repo sur GitHub
# Puis pousser le code
git remote add origin https://github.com/VOTRE_USERNAME/trophenix-frontend.git
git push -u origin main
```

#### Étape 2 : Connecter à Vercel

1. Aller sur [vercel.com](https://vercel.com)
2. Cliquer "New Project"
3. Importer le repository GitHub
4. Vercel détecte automatiquement Vite
5. Configuration automatique :
   ```
   Framework Preset: Vite
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

#### Étape 3 : Variables d'environnement

Dans Vercel Dashboard → Settings → Environment Variables :

```bash
# Production
VITE_SUPABASE_URL=https://ufitfifaimndezqmczgd.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Si backend Django séparé
VITE_API_URL=https://api.trophenix.com

# Si agent IA
VITE_AI_API_URL=https://ai.trophenix.com
```

**IMPORTANT** :
- ✅ Ajouter pour : Production, Preview, Development
- ✅ Utiliser des valeurs différentes pour chaque environnement si possible
- ❌ NE JAMAIS mettre la `service_role_key` de Supabase

#### Étape 4 : Déployer

```bash
# Vercel déploie automatiquement à chaque push sur main
git push origin main

# Ou déployer manuellement
npx vercel --prod
```

#### Étape 5 : Configurer le domaine

Dans Vercel Dashboard → Settings → Domains :

```
1. Ajouter votre domaine : trophenix.com
2. Configurer DNS :
   - Type: A
   - Name: @
   - Value: 76.76.21.21 (IP Vercel)

   - Type: CNAME
   - Name: www
   - Value: cname.vercel-dns.com
```

---

### Option 2 : Via Netlify

#### Étape 1 : Préparer netlify.toml

```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "18"
```

#### Étape 2 : Déployer

```bash
# Installation Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Initialiser
netlify init

# Déployer
netlify deploy --prod
```

#### Étape 3 : Variables d'environnement

Site Settings → Build & Deploy → Environment :

```bash
VITE_SUPABASE_URL=https://ufitfifaimndezqmczgd.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
VITE_API_URL=https://api.trophenix.com
```

---

## 🔧 Configuration post-déploiement

### Headers de sécurité

**Vercel** : Créer `vercel.json`

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        },
        {
          "key": "Permissions-Policy",
          "value": "geolocation=(), microphone=(), camera=()"
        },
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https: blob:; font-src 'self' data:; connect-src 'self' https://*.supabase.co; frame-ancestors 'none'; base-uri 'self'; form-action 'self';"
        }
      ]
    }
  ]
}
```

**Netlify** : Créer `public/_headers`

```
/*
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  X-XSS-Protection: 1; mode=block
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: geolocation=(), microphone=(), camera=()
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https: blob:; connect-src 'self' https://*.supabase.co;
```

---

## 🐍 Déploiement Backend Django (Optionnel)

### Option 1 : Render

#### Étape 1 : Créer render.yaml

```yaml
# render.yaml
services:
  - type: web
    name: trophenix-api
    env: python
    buildCommand: "pip install -r requirements.txt && python manage.py migrate"
    startCommand: "gunicorn backend.wsgi:application"
    envVars:
      - key: PYTHON_VERSION
        value: 3.11
      - key: DATABASE_URL
        fromDatabase:
          name: trophenix-db
          property: connectionString
      - key: SECRET_KEY
        generateValue: true
      - key: DJANGO_SETTINGS_MODULE
        value: backend.settings.production

databases:
  - name: trophenix-db
    plan: starter
```

#### Étape 2 : Déployer

```bash
# Commit render.yaml
git add render.yaml
git commit -m "Add Render configuration"
git push

# Sur Render Dashboard
# 1. New → Blueprint
# 2. Connecter le repo GitHub
# 3. Render détecte render.yaml
# 4. Deploy
```

---

### Option 2 : Railway

```bash
# Installation Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialiser
railway init

# Déployer
railway up
```

---

## 🔐 Configuration Supabase Production

### Vérifications sécurité

```sql
-- 1. Vérifier que RLS est activé sur TOUTES les tables
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND rowsecurity = false;

-- Résultat attendu : 0 lignes (toutes les tables ont RLS)

-- 2. Vérifier les policies
SELECT schemaname, tablename, policyname
FROM pg_policies
WHERE schemaname = 'public';

-- 3. Lister les utilisateurs avec permissions élevées
SELECT usename, usesuper, usecreatedb
FROM pg_user;
```

### Configuration Auth Production

Dans Supabase Dashboard → Authentication → Settings :

```yaml
Site URL: https://trophenix.com
Redirect URLs:
  - https://trophenix.com/auth/callback
  - https://www.trophenix.com/auth/callback

Email Templates:
  Confirmation: [Personnaliser avec votre branding]
  Reset Password: [Personnaliser avec votre branding]

Security:
  - Enable Captcha: ✅ (recommandé)
  - JWT Expiry: 3600 (1 heure)
  - Refresh Token Rotation: ✅
```

### Configuration Storage

```bash
# Créer les buckets si pas encore fait
# Dashboard → Storage → New bucket

Buckets:
  - avatars (public)
  - documents (private)
  - voice-notes (private)

Policies:
  avatars:
    - Public read
    - Authenticated write (own files only)

  documents:
    - Owner read/write only

  voice-notes:
    - Owner read/write only
```

---

## 🔄 CI/CD Pipeline

### GitHub Actions pour Vercel

Créer `.github/workflows/deploy.yml` :

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test
        continue-on-error: true

      - name: Type check
        run: npm run typecheck

      - name: Build
        run: npm run build
        env:
          VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

---

## 📊 Monitoring et Analytics

### Sentry (Monitoring erreurs)

#### Installation

```bash
npm install @sentry/react @sentry/vite-plugin
```

#### Configuration

```typescript
// src/main.tsx
import * as Sentry from "@sentry/react";

if (import.meta.env.PROD) {
  Sentry.init({
    dsn: "https://YOUR_DSN@sentry.io/PROJECT_ID",
    integrations: [
      new Sentry.BrowserTracing(),
      new Sentry.Replay(),
    ],
    tracesSampleRate: 0.1,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
  });
}
```

#### vite.config.ts

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { sentryVitePlugin } from "@sentry/vite-plugin";

export default defineConfig({
  plugins: [
    react(),
    sentryVitePlugin({
      org: "your-org",
      project: "trophenix-frontend",
      authToken: process.env.SENTRY_AUTH_TOKEN,
    }),
  ],
  build: {
    sourcemap: true, // Pour Sentry
  },
});
```

---

### Vercel Analytics

```bash
npm install @vercel/analytics
```

```typescript
// src/main.tsx
import { Analytics } from '@vercel/analytics/react';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
    <Analytics />
  </React.StrictMode>,
);
```

---

### Google Analytics (Optionnel)

```typescript
// src/utils/analytics.ts
export const initGA = () => {
  if (import.meta.env.PROD) {
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag(...args: any[]) {
      window.dataLayer.push(args);
    }
    gtag('js', new Date());
    gtag('config', 'GA_MEASUREMENT_ID');
  }
};
```

---

## 🧪 Tests de déploiement

### Checklist avant mise en production

```bash
# 1. Performance
npm run build
ls -lh dist/assets/*.js # Vérifier la taille des bundles

# 2. Lighthouse audit
npx lighthouse https://trophenix.com --view

# Scores attendus :
# Performance: > 90
# Accessibility: > 90
# Best Practices: > 90
# SEO: > 90

# 3. Sécurité headers
curl -I https://trophenix.com | grep -E "X-|Content-Security"

# 4. SSL/TLS
curl https://www.ssllabs.com/ssltest/analyze.html?d=trophenix.com

# 5. Vérifier les endpoints
curl https://trophenix.com/health
curl https://api.trophenix.com/health
```

### Tests fonctionnels

```bash
# Scénario 1 : Inscription
1. Aller sur https://trophenix.com
2. Cliquer "Créer un compte"
3. Remplir le formulaire
4. Vérifier email de confirmation
5. Compléter le profil

# Scénario 2 : Connexion
1. Se connecter avec les credentials
2. Vérifier la session
3. Naviguer dans l'app
4. Se déconnecter

# Scénario 3 : API
1. Faire des requêtes vers Supabase
2. Vérifier RLS
3. Tester CRUD operations
```

---

## 🔄 Stratégie de déploiement

### Environnements

```
┌──────────────┐
│ Development  │  → Localhost (npm run dev)
└──────┬───────┘
       │
       ▼
┌──────────────┐
│   Preview    │  → Vercel Preview (PR branches)
└──────┬───────┘
       │
       ▼
┌──────────────┐
│   Staging    │  → staging.trophenix.com
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Production   │  → trophenix.com
└──────────────┘
```

### Variables par environnement

```bash
# .env.development
VITE_SUPABASE_URL=http://localhost:54321
VITE_API_URL=http://localhost:8000

# .env.staging
VITE_SUPABASE_URL=https://staging-xxx.supabase.co
VITE_API_URL=https://staging-api.trophenix.com

# .env.production
VITE_SUPABASE_URL=https://ufitfifaimndezqmczgd.supabase.co
VITE_API_URL=https://api.trophenix.com
```

---

## 🚨 Rollback strategy

### Rollback Vercel

```bash
# Lister les déploiements
vercel list

# Rollback vers un déploiement précédent
vercel rollback DEPLOYMENT_URL
```

### Rollback via Git

```bash
# Revenir à un commit précédent
git revert HEAD
git push origin main

# Vercel déploie automatiquement
```

### Rollback Supabase (Migrations)

```sql
-- Supabase ne supporte pas le rollback automatique
-- Il faut créer une migration inverse

-- Exemple : Si vous avez ajouté une colonne
ALTER TABLE athlete_profiles DROP COLUMN new_column;
```

---

## 📈 Performance Optimization

### Bundle Size

```bash
# Analyser le bundle
npm run build -- --mode=production
npx vite-bundle-visualizer

# Optimisations :
# 1. Code splitting
# 2. Lazy loading
# 3. Tree shaking
# 4. Compression (Brotli/Gzip)
```

### Caching Strategy

**Vercel** (automatique) :
```
Static assets: Cache-Control: public, max-age=31536000, immutable
HTML: Cache-Control: public, max-age=0, must-revalidate
```

### Image Optimization

```typescript
// Utiliser des formats modernes
<img src="photo.webp" alt="..." loading="lazy" />

// Ou via Vercel Image Optimization
import Image from 'next/image'; // Si Next.js
```

---

## 🔒 Sécurité Production

### Checklist finale

- [ ] HTTPS uniquement (HSTS activé)
- [ ] Headers de sécurité configurés
- [ ] CSP strict
- [ ] RLS activé sur toutes les tables
- [ ] Pas de clés secrètes dans le code
- [ ] Rate limiting configuré
- [ ] Logs ne contiennent pas de données sensibles
- [ ] CORS configuré correctement
- [ ] Dependencies à jour (npm audit)
- [ ] Backup base de données configuré

### Monitoring Sécurité

```bash
# Scan de vulnérabilités
npm audit

# Scanner Snyk (recommandé)
npx snyk test

# OWASP ZAP (tests de pénétration)
docker run -t owasp/zap2docker-stable zap-baseline.py -t https://trophenix.com
```

---

## 📧 Notifications

### Webhooks Vercel

```javascript
// Configurer dans Vercel → Settings → Webhooks
// Endpoint: https://api.trophenix.com/webhooks/vercel

POST /webhooks/vercel
{
  "type": "deployment.succeeded",
  "payload": {
    "url": "https://trophenix.com",
    "deploymentId": "...",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

### Slack Notifications

```bash
# Via Vercel Integrations
# Ou webhook custom :

curl -X POST https://hooks.slack.com/services/YOUR/WEBHOOK/URL \
  -H 'Content-Type: application/json' \
  -d '{
    "text": "🚀 Nouveau déploiement Trophenix réussi!"
  }'
```

---

## 🐛 Debugging Production

### Logs Vercel

```bash
# CLI
vercel logs trophenix-frontend

# Dashboard
# Vercel → Deployments → Select deployment → Logs
```

### Logs Supabase

```bash
# Dashboard
# Supabase → Logs → Database / Auth / API
```

### Remote Debugging

```typescript
// src/utils/logger.ts (en production)
export const logger = {
  error: (message: string, error: Error) => {
    // Envoyer à Sentry
    Sentry.captureException(error, {
      contexts: {
        custom: { message }
      }
    });
  }
};
```

---

## 📊 Métriques clés à surveiller

### Performance

| Métrique | Cible | Outil |
|----------|-------|-------|
| **FCP** (First Contentful Paint) | < 1.8s | Lighthouse |
| **LCP** (Largest Contentful Paint) | < 2.5s | Lighthouse |
| **TTI** (Time to Interactive) | < 3.8s | Lighthouse |
| **CLS** (Cumulative Layout Shift) | < 0.1 | Lighthouse |
| **Bundle Size** | < 500 KB | Vite Bundle Analyzer |

### Disponibilité

| Métrique | Cible |
|----------|-------|
| **Uptime** | > 99.9% |
| **Error Rate** | < 0.1% |
| **Response Time** | < 200ms |

### Business

| Métrique | Outil |
|----------|-------|
| **Sign-ups** | Google Analytics |
| **Active Users** | Supabase Dashboard |
| **Conversion Rate** | Analytics |

---

## 🔄 Workflow de déploiement recommandé

### Développement

```bash
# 1. Créer une branche feature
git checkout -b feature/nouvelle-fonctionnalite

# 2. Développer localement
npm run dev

# 3. Tester
npm run typecheck
npm run build

# 4. Commit
git add .
git commit -m "feat: nouvelle fonctionnalité"

# 5. Push
git push origin feature/nouvelle-fonctionnalite
```

### Review

```bash
# 6. Créer une Pull Request sur GitHub
# Vercel déploie automatiquement un Preview

# 7. Review du code
# Tester sur le Preview: https://trophenix-pr-123.vercel.app

# 8. Merge dans main
git checkout main
git merge feature/nouvelle-fonctionnalite
git push origin main
```

### Production

```bash
# 9. Vercel déploie automatiquement en production
# URL: https://trophenix.com

# 10. Vérifier le déploiement
curl -I https://trophenix.com

# 11. Monitoring
# Vercel Dashboard + Sentry
```

---

## 📋 Checklist de déploiement complète

### Avant le déploiement

- [ ] Tests passent
- [ ] Build réussit
- [ ] TypeCheck OK
- [ ] Pas de console.log en production
- [ ] Variables d'environnement configurées
- [ ] Secrets Git non exposés
- [ ] Dependencies à jour
- [ ] npm audit sans HIGH/CRITICAL

### Configuration

- [ ] Vercel/Netlify configuré
- [ ] Domaine configuré
- [ ] SSL/HTTPS actif
- [ ] Headers de sécurité
- [ ] CSP configuré
- [ ] CORS configuré
- [ ] Supabase RLS vérifié

### Monitoring

- [ ] Sentry configuré
- [ ] Analytics configuré
- [ ] Logs accessibles
- [ ] Alertes configurées
- [ ] Backup configuré

### Post-déploiement

- [ ] Lighthouse score > 90
- [ ] Tests fonctionnels OK
- [ ] Security headers OK
- [ ] SSL A+ rating
- [ ] Monitoring actif

---

## 🆘 Problèmes courants

### Erreur : "Failed to fetch"

**Cause** : CORS mal configuré

**Solution** :
```typescript
// Vérifier VITE_API_URL dans .env
// Configurer CORS sur le backend Django

# Django settings.py
CORS_ALLOWED_ORIGINS = [
    "https://trophenix.com",
    "https://www.trophenix.com",
]
```

### Erreur : "Environment variables not defined"

**Cause** : Variables non configurées dans Vercel

**Solution** :
1. Vercel Dashboard → Settings → Environment Variables
2. Ajouter toutes les variables `VITE_*`
3. Redéployer

### Erreur : Build échoue

**Cause** : TypeScript errors ou missing dependencies

**Solution** :
```bash
# Local
npm run typecheck
npm ci

# Vérifier package.json
# Commit package-lock.json
```

---

## 🔗 Ressources

### Documentation

- [Vercel Docs](https://vercel.com/docs)
- [Netlify Docs](https://docs.netlify.com)
- [Supabase Production Checklist](https://supabase.com/docs/guides/platform/going-into-prod)
- [Vite Production Build](https://vitejs.dev/guide/build.html)

### Outils

- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [SSL Labs](https://www.ssllabs.com/ssltest/)
- [Security Headers](https://securityheaders.com/)
- [WebPageTest](https://www.webpagetest.org/)

---

## ✅ Résumé

| Étape | Temps | Priorité |
|-------|-------|----------|
| Setup Vercel | 30 min | 🔴 Critique |
| Variables d'environnement | 15 min | 🔴 Critique |
| Headers de sécurité | 30 min | 🔴 Critique |
| Monitoring (Sentry) | 1 heure | 🟠 Haute |
| CI/CD Pipeline | 2 heures | 🟡 Moyenne |
| Domaine custom | 30 min | 🟢 Basse |

**Temps total pour déploiement basique : 1h15**
**Temps total pour déploiement complet : 5h**

---

**Votre application est prête pour la production !** 🚀

Suivez ce guide étape par étape pour un déploiement sécurisé et optimisé.


