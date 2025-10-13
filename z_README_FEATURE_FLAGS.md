# Système de Feature Flags - Guide Complet

## 📋 Table des Matières

1. [Vue d'ensemble](#vue-densemble)
2. [Architecture](#architecture)
3. [Utilisation Frontend](#utilisation-frontend)
4. [Administration](#administration)
5. [Toutes les Fonctionnalités](#toutes-les-fonctionnalités)
6. [Beta Testing](#beta-testing)
7. [Rollout Progressif](#rollout-progressif)
8. [Analytics](#analytics)
9. [Cas d'Usage](#cas-dusage)

---

## 🎯 Vue d'ensemble

### Objectif

Gérer la visibilité et l'activation des fonctionnalités par version **sans redéploiement**.

### Avantages

✅ **Contrôle total** : Activer/désactiver une feature en 1 clic
✅ **Versioning** : Gérer V1.0, V2.0, V3.0, etc.
✅ **Beta testing** : Activer pour certains utilisateurs seulement
✅ **Rollout progressif** : Activer pour X% des utilisateurs
✅ **Analytics** : Tracker l'utilisation de chaque feature
✅ **Planification** : Activer automatiquement à une date précise
✅ **Pas de redéploiement** : Tout se fait depuis l'interface admin

---

## 🏗️ Architecture

### Schéma Global

```
┌─────────────────────────────────────────────────────────┐
│           feature_versions (Versions)                   │
│  1.0.0 → MVP (actuelle)                                │
│  2.0.0 → Intelligence (prévue)                          │
│  3.0.0 → Collaboration (future)                         │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│       feature_categories (Catégories)                   │
│  🎯 Core   🔐 Auth   👤 Profils   💼 Jobs              │
│  📨 Candidatures   💬 Messages   🤖 IA   👥 Équipe     │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│        feature_flags (Fonctionnalités)                  │
│  ┌───────────────────────────────────────────────────┐ │
│  │ elea_ai (v2.0)                                    │ │
│  │ ├─ is_enabled: false ❌                          │ │
│  │ ├─ is_beta: false                                │ │
│  │ ├─ rollout_percentage: 0%                        │ │
│  │ └─ component_path: AI/AgentElea                  │ │
│  └───────────────────────────────────────────────────┘ │
│  ┌───────────────────────────────────────────────────┐ │
│  │ team_invitations (v2.0)                           │ │
│  │ ├─ is_enabled: false ❌                          │ │
│  │ ├─ is_beta: true                                 │ │
│  │ └─ dependencies: ['organization_management']     │ │
│  └───────────────────────────────────────────────────┘ │
└────────────────────┬────────────────────────────────────┘
                     │
     ┌───────────────┴───────────────┐
     ▼                               ▼
┌─────────────────────┐  ┌──────────────────────────┐
│ user_feature_access │  │ feature_usage_analytics  │
│ (Beta Testing)      │  │ (Analytics)              │
│                     │  │                          │
│ admin@trophenix.com │  │ User X accessed Elea     │
│ → elea_ai (beta)    │  │ 5 times today            │
└─────────────────────┘  └──────────────────────────┘
```

### Tables Principales

#### 1. `feature_categories` - Catégories

| Catégorie | Icon | Description |
|-----------|------|-------------|
| core | 🎯 | Fonctionnalités essentielles |
| auth | 🔐 | Authentification |
| profiles | 👤 | Profils athlètes et entreprises |
| jobs | 💼 | Offres d'emploi |
| applications | 📨 | Candidatures |
| messages | 💬 | Messagerie |
| directory | 📋 | Annuaires |
| admin | ⚙️ | Administration |
| ai | 🤖 | Intelligence Artificielle |
| team | 👥 | Gestion d'équipe |
| tasks | ✅ | Tâches partagées |
| analytics | 📊 | Analytics |

#### 2. `feature_flags` - Fonctionnalités

```sql
CREATE TABLE feature_flags (
  id uuid PRIMARY KEY,
  category_id uuid REFERENCES feature_categories(id),
  feature_key text UNIQUE NOT NULL,
  display_name text NOT NULL,
  description text,
  target_version text NOT NULL, -- '1.0.0', '2.0.0', '3.0.0'
  is_enabled boolean DEFAULT false,
  is_beta boolean DEFAULT false,
  rollout_percentage int DEFAULT 0, -- 0-100%
  enable_date timestamptz,
  component_path text,
  route_path text,
  dependencies text[],
  metadata jsonb,
  created_at timestamptz,
  updated_at timestamptz
);
```

---

## 💻 Utilisation Frontend

### 1. Hook `useFeature`

Vérifier si une feature est activée :

```typescript
import { useFeature } from '../hooks/useFeature';

function MyComponent() {
  const eleaEnabled = useFeature('elea_ai');

  return (
    <div>
      {eleaEnabled && (
        <button>Parler à Elea</button>
      )}
    </div>
  );
}
```

### 2. Composant `<FeatureGate>`

Afficher conditionnellement des composants :

```typescript
import { FeatureGate } from '../components/Features/FeatureGate';

function Navbar() {
  return (
    <nav>
      {/* Toujours visible */}
      <Link to="/jobs">Offres</Link>

      {/* Visible seulement si activé */}
      <FeatureGate feature="elea_ai">
        <Link to="/elea">💬 Parler à Elea</Link>
      </FeatureGate>

      {/* Avec fallback */}
      <FeatureGate
        feature="team_invitations"
        fallback={<span>🔒 Bientôt disponible</span>}
      >
        <button>Inviter un membre</button>
      </FeatureGate>
    </nav>
  );
}
```

### 3. Hook `useFeatures`

Récupérer toutes les features actives :

```typescript
import { useFeatures } from '../hooks/useFeature';

function Dashboard() {
  const { features, isLoading, isFeatureEnabled, getFeaturesByCategory } = useFeatures();

  if (isLoading) return <div>Chargement...</div>;

  const aiFeatures = getFeaturesByCategory('ai');

  return (
    <div>
      <h2>Fonctionnalités IA disponibles</h2>
      <ul>
        {aiFeatures.map(f => (
          <li key={f.feature_key}>{f.display_name}</li>
        ))}
      </ul>
    </div>
  );
}
```

### 4. Tracking d'Utilisation

Tracker automatiquement l'usage :

```typescript
import { useFeatureTracking } from '../hooks/useFeature';

function EleaChat() {
  const { trackFeature } = useFeatureTracking();

  const handleSendMessage = async (message: string) => {
    // Track l'événement
    await trackFeature('elea_ai', 'message_sent', {
      message_length: message.length,
      timestamp: new Date().toISOString()
    });

    // Envoyer le message...
  };

  return <ChatInterface onSend={handleSendMessage} />;
}
```

### 5. Feature Toggle (Alternative)

```typescript
import { FeatureToggle } from '../components/Features/FeatureGate';

function ProfilePage() {
  return (
    <div>
      <h1>Mon Profil</h1>

      <FeatureToggle
        feature="athlete_delegation"
        enabled={<button>Inviter un délégué</button>}
        disabled={
          <div className="text-gray-500">
            Fonctionnalité disponible en Version 2.0
          </div>
        }
      />
    </div>
  );
}
```

---

## ⚙️ Administration

### Interface Admin

Accès : `/admin/features` (réservé super_admin)

#### 1. Vue d'ensemble

```
┌─────────────────────────────────────────────────────────┐
│  Gestion des Fonctionnalités - Version Actuelle: 1.0.0  │
├─────────────────────────────────────────────────────────┤
│  📊 36 Fonctionnalités totales                          │
│  🟢 18 Activées                                         │
│  🧪 5 En beta                                           │
├─────────────────────────────────────────────────────────┤
│  Filtrer par catégorie: [Toutes ▼]                      │
│  Filtrer par version: [Toutes ▼]                        │
└─────────────────────────────────────────────────────────┘
```

#### 2. Liste des Features

```
┌─────────────────────────────────────────────────────────┐
│  Agent Elea  🔴 Désactivé  🧪 Beta  v2.0.0             │
│  Assistant IA personnalisé context-aware                │
│  🤖 Intelligence Artificielle | 📁 AI/AgentElea         │
│                                                         │
│  [Activer pour v2.0] ← Bouton                          │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  Profil Athlète  🟢 Activé  v1.0.0                     │
│  Gestion du profil athlète                              │
│  👤 Profils | 📁 Profiles/AthleteProfileForm            │
│                                                         │
│  [Désactiver] ← Bouton                                  │
└─────────────────────────────────────────────────────────┘
```

#### 3. Gestion des Versions

```
┌─────────────────────────────────────────────────────────┐
│  Version 1.0.0 - MVP              [Actuelle]           │
│  Version initiale avec fonctionnalités essentielles     │
├─────────────────────────────────────────────────────────┤
│  Version 2.0.0 - Intelligence                           │
│  Ajout d'Elea IA et gestion d'équipe avancée           │
│  [Activer cette version] ← Bouton                       │
├─────────────────────────────────────────────────────────┤
│  Version 3.0.0 - Collaboration                          │
│  Tâches partagées et workflows avancés                  │
│  [Activer cette version] ← Bouton                       │
└─────────────────────────────────────────────────────────┘
```

### Actions Admin Disponibles

#### Activer/Désactiver une feature

```typescript
await FeatureService.updateFeatureStatus(featureId, true);
// → La feature devient visible partout immédiatement
```

#### Rollout progressif

```typescript
await FeatureService.updateFeatureRollout(featureId, 50);
// → Activé pour 50% des utilisateurs aléatoirement
```

#### Changer de version

```typescript
await FeatureService.setCurrentVersion(version2Id);
// → Toutes les features de v2.0 deviennent disponibles
```

---

## 📋 Toutes les Fonctionnalités

### Version 1.0 (Actives)

| Feature Key | Nom | Catégorie | Status |
|-------------|-----|-----------|--------|
| `landing_page` | Page d'Accueil | Core | ✅ Activée |
| `login` | Connexion | Auth | ✅ Activée |
| `signup` | Inscription | Auth | ✅ Activée |
| `forgot_password` | Mot de passe oublié | Auth | ✅ Activée |
| `email_verification` | Vérification Email | Auth | ✅ Activée |
| `athlete_onboarding` | Onboarding Athlète | Auth | ✅ Activée |
| `company_onboarding` | Onboarding Entreprise | Auth | ✅ Activée |
| `athlete_profile` | Profil Athlète | Profils | ✅ Activée |
| `company_profile` | Profil Entreprise | Profils | ✅ Activée |
| `job_offers_list` | Liste Offres | Jobs | ✅ Activée |
| `job_offer_create` | Créer Offre | Jobs | ✅ Activée |
| `job_offers_manage` | Gérer Offres | Jobs | ✅ Activée |
| `my_applications` | Mes Candidatures | Applications | ✅ Activée |
| `view_applications` | Candidatures Reçues | Applications | ✅ Activée |
| `athlete_directory` | Annuaire Athlètes | Directory | ✅ Activée |
| `company_directory` | Annuaire Entreprises | Directory | ✅ Activée |
| `athlete_detail` | Détail Athlète | Directory | ✅ Activée |
| `admin_*` | Outils Admin | Admin | ✅ Activée |

### Version 2.0 (Désactivées par défaut)

| Feature Key | Nom | Catégorie | Status |
|-------------|-----|-----------|--------|
| `elea_ai` | Agent Elea | IA | ❌ Désactivée |
| `context_switcher` | Changement de Contexte | Team | ❌ Désactivée |
| `organization_management` | Gestion Organisation | Team | ❌ Désactivée |
| `team_invitations` | Invitations Équipe | Team | ❌ Désactivée |
| `athlete_delegation` | Délégation Athlète | Team | ❌ Désactivée |
| `context_messages` | Messages Contextuels | Messages | ❌ Désactivée |

### Version 3.0 (Futures)

| Feature Key | Nom | Catégorie | Status |
|-------------|-----|-----------|--------|
| `shared_tasks` | Tâches Partagées | Tasks | ❌ Désactivée |
| `task_comments` | Commentaires Tâches | Tasks | ❌ Désactivée |

---

## 🧪 Beta Testing

### Activer pour des utilisateurs spécifiques

```typescript
// Donner accès beta à Elea pour admin@trophenix.com
await FeatureService.grantBetaAccess(
  'elea_ai',
  'admin-user-id',
  'super-admin-id',
  'beta',
  '2025-12-31T23:59:59Z' // Optionnel: date d'expiration
);
```

### Types d'accès

- **`beta`** : Testeur beta (avant release publique)
- **`early_access`** : Accès anticipé (privilège)
- **`preview`** : Aperçu avant release
- **`blocked`** : Bloqué explicitement (même si activé globalement)

### Révoquer l'accès

```typescript
await FeatureService.revokeBetaAccess('elea_ai', 'user-id');
```

### Voir les accès beta d'un utilisateur

```typescript
const betaAccess = await FeatureService.getUserBetaAccess('user-id');
// Returns: [{ feature_id, access_type, expires_at, ... }]
```

---

## 📊 Rollout Progressif

### Activer pour X% des utilisateurs

```typescript
// Activer Elea pour 10% des utilisateurs
await FeatureService.updateFeatureRollout(eleaFeatureId, 10);

// Augmenter à 50%
await FeatureService.updateFeatureRollout(eleaFeatureId, 50);

// Rollout complet
await FeatureService.updateFeatureRollout(eleaFeatureId, 100);
```

### Fonctionnement

- Distribution **déterministe** : Un utilisateur est toujours dans le même groupe
- Hash basé sur `user_id` pour distribution uniforme
- Rollout progressif idéal pour tester la charge

### Exemple de stratégie

```
Jour 1 : 10% → Tester stabilité
Jour 3 : 25% → Monitoring performances
Jour 7 : 50% → Feedback utilisateurs
Jour 14 : 100% → Release complète
```

---

## 📈 Analytics

### Tracker l'utilisation

Automatique avec `trackFeature` :

```typescript
trackFeature('elea_ai', 'message_sent', {
  message_length: 150,
  language: 'fr'
});
```

### Obtenir les statistiques

```typescript
const stats = await FeatureService.getFeatureStats('elea_ai');

// Returns:
{
  total_users: 1250,          // Utilisateurs uniques total
  total_events: 15000,        // Événements total
  unique_users_today: 85,     // Users uniques aujourd'hui
  events_today: 420,          // Événements aujourd'hui
  avg_events_per_user: 12     // Moyenne par user
}
```

### Dashboard Analytics (à implémenter)

```
┌────────────────────────────────────────────────────┐
│  Analytics: Agent Elea                             │
├────────────────────────────────────────────────────┤
│  👥 1,250 utilisateurs uniques                     │
│  📊 15,000 messages envoyés                        │
│  📈 12 messages / utilisateur en moyenne           │
│  🔥 85 utilisateurs actifs aujourd'hui             │
└────────────────────────────────────────────────────┘
```

---

## 🎓 Cas d'Usage

### Cas 1 : Lancer Elea en Version 2.0

**Situation** : Elea est prête, on veut la lancer en beta d'abord.

```typescript
// Étape 1 : Activer en beta pour l'équipe interne
await FeatureService.grantBetaAccess('elea_ai', 'admin-id', 'super-admin-id', 'beta');
await FeatureService.grantBetaAccess('elea_ai', 'team-member-1-id', 'super-admin-id', 'beta');

// Résultat : Seuls admin et team-member-1 voient Elea
// Les autres users ne la voient pas

// Étape 2 : Rollout progressif
await FeatureService.updateFeatureStatus('elea-feature-id', true);
await FeatureService.updateFeatureRollout('elea-feature-id', 10);

// Résultat : 10% des utilisateurs voient Elea

// Étape 3 : Monitoring
const stats = await FeatureService.getFeatureStats('elea_ai');
console.log(`${stats.unique_users_today} users actifs`);

// Étape 4 : Rollout complet
await FeatureService.updateFeatureRollout('elea-feature-id', 100);

// Résultat : Tous les utilisateurs voient Elea ! 🎉
```

### Cas 2 : Désactiver temporairement une feature bugguée

**Situation** : Bug critique sur les invitations d'équipe.

```typescript
// Désactiver immédiatement
await FeatureService.updateFeatureStatus('team-invitations-feature-id', false);

// Résultat : Le bouton "Inviter" disparaît partout instantanément
// Pas de redéploiement nécessaire
// Bug contenu, users ne peuvent plus déclencher le bug

// Fix le bug...

// Réactiver
await FeatureService.updateFeatureStatus('team-invitations-feature-id', true);
```

### Cas 3 : Planifier une release automatique

**Situation** : On veut activer la V3.0 le 1er janvier 2026.

```typescript
// Planifier l'activation
await FeatureService.scheduleFeatureEnable(
  'shared-tasks-feature-id',
  '2026-01-01T00:00:00Z'
);

// Un cron job va automatiquement activer la feature à cette date
// Pas besoin d'être devant l'ordi à minuit !
```

### Cas 4 : Feature dépendante

**Situation** : Les invitations d'équipe nécessitent la gestion d'organisation.

```sql
-- Définir la dépendance
UPDATE feature_flags
SET dependencies = ARRAY['organization_management']
WHERE feature_key = 'team_invitations';
```

```typescript
// Frontend : Vérifier avant d'afficher
const orgEnabled = useFeature('organization_management');
const inviteEnabled = useFeature('team_invitations');

// Invitations visibles SEULEMENT si les 2 sont activées
{orgEnabled && inviteEnabled && (
  <button>Inviter un membre</button>
)}
```

---

## 🔐 Sécurité

### RLS (Row Level Security)

✅ Tous les users peuvent **voir** les features disponibles
✅ Seuls les **super_admin** peuvent **modifier** les features
✅ Users voient uniquement **leurs propres** accès beta
✅ Analytics accessibles uniquement aux **admins**

### Fonctions SQL

```sql
-- Vérifier si feature activée pour un user
SELECT is_feature_enabled_for_user('elea_ai', 'user-id');

-- Récupérer toutes les features actives pour un user
SELECT * FROM get_enabled_features_for_user('user-id');

-- Stats d'une feature
SELECT * FROM get_feature_stats('elea_ai');
```

---

## 🚀 Workflow Complet

### 1. Développement

```typescript
// Développer la nouvelle feature normalement
function NewFeature() {
  return <div>Ma nouvelle feature</div>;
}
```

### 2. Enregistrer dans la DB

```sql
INSERT INTO feature_flags (
  category_id,
  feature_key,
  display_name,
  description,
  target_version,
  is_enabled, -- FALSE par défaut
  component_path
) VALUES (
  (SELECT id FROM feature_categories WHERE category_key = 'ai'),
  'my_new_feature',
  'Ma Nouvelle Feature',
  'Description de la feature',
  '2.0.0',
  false,
  'NewFeature/Component'
);
```

### 3. Wrapper dans le code

```typescript
import { FeatureGate } from '../components/Features/FeatureGate';

function App() {
  return (
    <div>
      {/* Ancienne feature (toujours visible) */}
      <OldFeature />

      {/* Nouvelle feature (cachée par défaut) */}
      <FeatureGate feature="my_new_feature">
        <NewFeature />
      </FeatureGate>
    </div>
  );
}
```

### 4. Déployer en prod

```bash
npm run build
# Deploy...
```

**Résultat** : NewFeature est en prod mais **invisible** ! ✅

### 5. Activer depuis l'admin

Interface admin → Trouver "Ma Nouvelle Feature" → Clic sur "Activer"

**Résultat** : Feature visible pour tous les users instantanément ! 🎉

---

## ✅ Checklist

### Avant de créer une nouvelle feature

- [ ] Définir dans quelle **version** (1.0, 2.0, 3.0)
- [ ] Choisir la **catégorie**
- [ ] Définir les **dépendances** éventuelles
- [ ] Insérer dans `feature_flags` avec `is_enabled = false`
- [ ] Wrapper le code dans `<FeatureGate>`
- [ ] Tester en local avec feature activée/désactivée
- [ ] Déployer en prod (feature désactivée)
- [ ] Activer depuis l'interface admin quand prêt

### Avant d'activer une feature en prod

- [ ] Tests complets effectués
- [ ] Documentation utilisateur prête
- [ ] Monitoring en place
- [ ] Plan de rollback défini
- [ ] Équipe support informée

---

## 📚 Références

### Fichiers Clés

```
src/
├─ types/
│  └─ features.ts (Types TypeScript)
├─ services/
│  └─ featureService.ts (Service principal)
├─ hooks/
│  └─ useFeature.ts (Hooks React)
├─ components/
│  ├─ Features/
│  │  └─ FeatureGate.tsx (Composant gate)
│  └─ Admin/
│     └─ FeatureFlagsManager.tsx (Interface admin)

supabase/migrations/
└─ 20251012120000_create_feature_flags_system.sql
```

### Commandes SQL Utiles

```sql
-- Voir toutes les features
SELECT * FROM feature_flags ORDER BY target_version, display_name;

-- Features activées
SELECT * FROM feature_flags WHERE is_enabled = true;

-- Features v2.0
SELECT * FROM feature_flags WHERE target_version = '2.0.0';

-- Activer une feature
UPDATE feature_flags SET is_enabled = true WHERE feature_key = 'elea_ai';

-- Stats
SELECT
  target_version,
  COUNT(*) as total,
  COUNT(*) FILTER (WHERE is_enabled) as enabled
FROM feature_flags
GROUP BY target_version;
```

---

## 🎉 Conclusion

Vous avez maintenant un système complet de Feature Flags qui permet :

✅ Gérer 36 fonctionnalités par version
✅ Activer/désactiver sans redéploiement
✅ Beta testing ciblé
✅ Rollout progressif
✅ Analytics détaillés
✅ Interface admin intuitive

**Pour toute question : Consultez cette documentation !**

**Bon lancement de features ! 🚀**
