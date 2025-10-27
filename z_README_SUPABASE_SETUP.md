# 🗄️ Configuration Supabase - Guide complet

## 📝 Historique du document

| Date | Version | Lignes | Modifications | Auteur |
|------|---------|--------|---------------|--------|
| 2025-01-11 | 1.2 | 881 | Ajout colonnes athlete_profiles (birth_date, birth_place, etc.) | Claude |
| 2025-01-11 | 1.1 | 820 | Mise à jour RLS policies (fix policies) | Claude |
| 2025-01-10 | 1.0 | 780 | Création guide Supabase complet avec migrations | Claude |

---

## 📌 Vue d'ensemble

Ce guide explique la configuration et l'utilisation de Supabase dans le projet Trophenix.

**Supabase** est la base de données PostgreSQL hébergée utilisée pour :
- ✅ Authentification des utilisateurs (email/password)
- ✅ Stockage des profils (athlètes, entreprises, admins)
- ✅ Gestion des permissions (Row Level Security)
- ✅ Storage de fichiers (photos, documents, notes vocales)
- ✅ Temps réel (optionnel pour messagerie future)

---

## 🏗️ Architecture Supabase

### Composants utilisés

```
Supabase Platform
├── Auth                  ← Authentification JWT
│   ├── Users table      ← Comptes utilisateurs
│   └── Sessions         ← Gestion des sessions
│
├── Database (PostgreSQL)
│   ├── profiles         ← Profils utilisateurs de base
│   ├── athlete_profiles ← Profils détaillés athlètes
│   ├── company_profiles ← Profils entreprises
│   └── contacts         ← Tracking des contacts
│
├── Storage (optionnel)
│   ├── avatars/         ← Photos de profil
│   ├── documents/       ← CVs, certifications
│   └── voice-notes/     ← Notes vocales de motivation
│
└── Row Level Security   ← Sécurité au niveau des lignes
    └── Policies         ← Qui peut lire/écrire quoi
```

---

## 🔧 Configuration initiale

### Étape 1 : Obtenir les credentials Supabase

**Instance déjà configurée** ✅

Le projet est déjà connecté à une instance Supabase :

```bash
# .env (déjà configuré)
VITE_SUPABASE_URL=https://fcryxwdpqbnxhymelcbo.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Si vous devez créer une nouvelle instance :**

1. Aller sur [supabase.com](https://supabase.com)
2. Créer un compte (gratuit)
3. Créer un nouveau projet
4. Récupérer :
   - `Project URL` → `VITE_SUPABASE_URL`
   - `anon public` key → `VITE_SUPABASE_ANON_KEY`

### Étape 2 : Variables d'environnement

**Fichier `.env`** (racine du projet) :

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**IMPORTANT** :
- ✅ Le fichier `.env` est dans `.gitignore` (ne jamais commit)
- ✅ Chaque développeur a son propre `.env`
- ✅ En production, configurer via les variables d'env du hosting (Vercel, Netlify, etc.)

### Étape 3 : Client Supabase

**Fichier `src/lib/supabase.ts`** (déjà configuré) :

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

**Utilisation dans le code** :

```typescript
import { supabase } from '@/lib/supabase';

// Exemple : Récupérer un profil
const { data, error } = await supabase
  .from('profiles')
  .select('*')
  .eq('id', userId)
  .maybeSingle();
```

---

## 📊 Structure de la base de données

### Tables principales

#### 1. `profiles` (profils de base)

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT UNIQUE NOT NULL,
  user_type TEXT NOT NULL CHECK (user_type IN ('athlete', 'company', 'admin')),
  validation_status TEXT DEFAULT 'pending' CHECK (validation_status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

**Champs** :
- `id` : UUID lié au compte auth Supabase
- `email` : Email de l'utilisateur
- `user_type` : Type d'utilisateur (athlete, company, admin)
- `validation_status` : Statut de validation du profil
- `created_at`, `updated_at` : Timestamps

#### 2. `athlete_profiles` (profils athlètes)

```sql
CREATE TABLE athlete_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  photo_url TEXT,
  sport TEXT NOT NULL,
  sport_level TEXT NOT NULL,
  birth_date DATE,
  birth_place TEXT,
  last_club TEXT,
  training_center TEXT,
  phone TEXT,
  instagram_handle TEXT,
  tiktok_handle TEXT,
  linkedin_url TEXT,
  achievements TEXT,
  professional_history TEXT,
  geographic_zone TEXT,
  desired_field TEXT,
  position_type TEXT,
  availability TEXT,
  degrees TEXT,
  recommendations TEXT,
  voice_note_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

**Principaux champs** :
- Identité : `first_name`, `last_name`, `birth_date`, `birth_place`
- Sport : `sport`, `sport_level`, `last_club`, `training_center`
- Réseaux : `instagram_handle`, `tiktok_handle`, `linkedin_url`
- Carrière : `achievements`, `professional_history`
- Reconversion : `desired_field`, `position_type`, `availability`
- Documents : `voice_note_url`

#### 3. `company_profiles` (profils entreprises)

```sql
CREATE TABLE company_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  logo_url TEXT,
  sector TEXT NOT NULL,
  company_size TEXT NOT NULL,
  location TEXT NOT NULL,
  hr_contact TEXT,
  description TEXT,
  website TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

**Champs** :
- `company_name` : Nom de l'entreprise
- `sector` : Secteur d'activité
- `company_size` : Taille de l'entreprise
- `location` : Localisation
- `hr_contact` : Contact RH
- `website` : Site web

#### 4. `contacts` (tracking des contacts)

```sql
CREATE TABLE contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  athlete_id UUID REFERENCES athlete_profiles(user_id),
  company_id UUID REFERENCES company_profiles(user_id),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

**Usage** : Quand une entreprise contacte un athlète

---

## 🔒 Row Level Security (RLS)

### Qu'est-ce que RLS ?

**Row Level Security** = Sécurité au niveau des lignes

Au lieu de :
```typescript
// ❌ Filtrer côté application (non sécurisé)
const data = await fetch('/api/profiles')
  .then(res => res.json())
  .then(profiles => profiles.filter(p => p.id === currentUserId));
```

On fait :
```typescript
// ✅ Filtrage côté base de données (sécurisé)
const { data } = await supabase
  .from('profiles')
  .select('*')
  .eq('id', currentUserId); // RLS applique automatiquement les règles
```

### Policies configurées

#### Profiles

**Lecture** :
```sql
-- Les utilisateurs peuvent lire leur propre profil
CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Les admins peuvent tout lire
CREATE POLICY "Admins can read all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND user_type = 'admin'
    )
  );
```

**Création** :
```sql
-- Les utilisateurs authentifiés peuvent créer leur profil
CREATE POLICY "Users can create own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);
```

**Modification** :
```sql
-- Les utilisateurs peuvent modifier leur propre profil
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);
```

#### Athlete Profiles

```sql
-- Lecture : Les athlètes voient leur profil, les entreprises voient tous les profils validés
CREATE POLICY "Athletes can read own profile"
  ON athlete_profiles FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Companies can read validated athlete profiles"
  ON athlete_profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.user_id = athlete_profiles.user_id
        AND profiles.validation_status = 'approved'
    )
    AND EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
        AND profiles.user_type = 'company'
    )
  );
```

#### Company Profiles

```sql
-- Similaire : Les entreprises voient leur profil, les athlètes voient toutes les entreprises
CREATE POLICY "Companies can read own profile"
  ON company_profiles FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Athletes can read all company profiles"
  ON company_profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND user_type = 'athlete'
    )
  );
```

### Tester RLS

**En développement** :

```typescript
// Test 1 : Récupérer son propre profil (doit fonctionner)
const { data: myProfile } = await supabase
  .from('profiles')
  .select('*')
  .eq('id', currentUser.id)
  .maybeSingle();

console.log('My profile:', myProfile); // ✅ Retourne le profil

// Test 2 : Récupérer le profil d'un autre user (doit échouer)
const { data: otherProfile } = await supabase
  .from('profiles')
  .select('*')
  .eq('id', 'another-user-id')
  .maybeSingle();

console.log('Other profile:', otherProfile); // ❌ Retourne null
```

---

## 🗂️ Migrations

### Structure des migrations

```
supabase/
└── migrations/
    ├── 20251011120602_create_trophenix_schema.sql
    ├── 20251011121448_fix_profiles_rls_policies.sql
    ├── 20251011121502_fix_athlete_company_rls_policies.sql
    ├── 20251011124735_add_athlete_birth_club_center.sql
    └── 20251011133836_add_athlete_profile_fields.sql
```

### Format des migrations

Chaque fichier commence par un commentaire détaillé :

```sql
/*
  # Nom de la migration

  1. Description
    - Ce qui est ajouté/modifié/supprimé

  2. Tables affectées
    - Table 1 : description
    - Table 2 : description

  3. Sécurité
    - Policies RLS ajoutées
*/

-- SQL statements here
CREATE TABLE IF NOT EXISTS ...
```

### Appliquer les migrations

**Méthode 1 : Via Supabase Dashboard** (recommandé pour démarrage)

1. Aller sur [app.supabase.com](https://app.supabase.com)
2. Sélectionner votre projet
3. Aller dans `SQL Editor`
4. Copier/coller le contenu des fichiers de migration dans l'ordre
5. Exécuter

**Méthode 2 : Via Supabase CLI** (pour workflow avancé)

```bash
# Installation
npm install -g supabase

# Login
supabase login

# Link au projet
supabase link --project-ref ufitfifaimndezqmczgd

# Appliquer toutes les migrations
supabase db push

# Créer une nouvelle migration
supabase migration new add_new_feature
```

**Méthode 3 : Via MCP Tools** (utilisé dans ce projet)

Les outils `mcp__supabase__*` permettent de gérer les migrations directement :

```typescript
// Créer une migration via l'outil MCP
mcp__supabase__apply_migration({
  filename: "add_new_table",
  content: `
    CREATE TABLE IF NOT EXISTS new_table (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL
    );
  `
});
```

### Ordre d'application des migrations

**IMPORTANT** : Toujours appliquer dans l'ordre chronologique :

1. `20251011120602_create_trophenix_schema.sql` - Création des tables de base
2. `20251011121448_fix_profiles_rls_policies.sql` - Fix policies profiles
3. `20251011121502_fix_athlete_company_rls_policies.sql` - Fix policies athlètes/entreprises
4. `20251011124735_add_athlete_birth_club_center.sql` - Ajout champs athlètes
5. `20251011133836_add_athlete_profile_fields.sql` - Ajout réseaux sociaux

---

## 🔐 Authentification

### Flow d'authentification

```
1. Inscription
   └─> supabase.auth.signUp({ email, password })
       └─> Crée un user dans auth.users
           └─> Trigger : crée automatiquement un profil dans profiles

2. Connexion
   └─> supabase.auth.signInWithPassword({ email, password })
       └─> Retourne session + JWT token
           └─> Token stocké automatiquement dans localStorage

3. Vérification session
   └─> supabase.auth.getSession()
       └─> Retourne la session active ou null

4. Déconnexion
   └─> supabase.auth.signOut()
       └─> Supprime le token et la session
```

### Exemples de code

**Inscription** :

```typescript
import { supabase } from '@/lib/supabase';

const signUp = async (email: string, password: string, userType: string) => {
  // 1. Créer le compte auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError) throw authError;

  // 2. Créer le profil de base
  const { error: profileError } = await supabase
    .from('profiles')
    .insert({
      id: authData.user!.id,
      email,
      user_type: userType,
      validation_status: 'pending'
    });

  if (profileError) throw profileError;

  return authData;
};
```

**Connexion** :

```typescript
const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;

  return data;
};
```

**Récupérer l'utilisateur actuel** :

```typescript
const getCurrentUser = async () => {
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) return null;

  // Récupérer le profil complet
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .maybeSingle();

  return { user: session.user, profile };
};
```

**Écouter les changements d'auth** :

```typescript
useEffect(() => {
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    (event, session) => {
      if (event === 'SIGNED_IN') {
        console.log('User signed in:', session);
      }
      if (event === 'SIGNED_OUT') {
        console.log('User signed out');
      }
    }
  );

  return () => subscription.unsubscribe();
}, []);
```

---

## 📦 Storage (optionnel)

### Configuration du Storage

**Créer des buckets** :

1. Aller dans `Storage` sur Supabase Dashboard
2. Créer les buckets :
   - `avatars` (public)
   - `documents` (private)
   - `voice-notes` (private)

### Upload de fichiers

```typescript
// Upload d'une photo de profil
const uploadAvatar = async (file: File, userId: string) => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}-${Date.now()}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from('avatars')
    .upload(fileName, file);

  if (error) throw error;

  // Récupérer l'URL publique
  const { data: { publicUrl } } = supabase.storage
    .from('avatars')
    .getPublicUrl(fileName);

  return publicUrl;
};
```

### Télécharger un fichier

```typescript
const downloadFile = async (bucket: string, path: string) => {
  const { data, error } = await supabase.storage
    .from(bucket)
    .download(path);

  if (error) throw error;

  return URL.createObjectURL(data);
};
```

### Policies Storage

```sql
-- Lecture : Tout le monde peut voir les avatars
CREATE POLICY "Public avatars are accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

-- Écriture : Seulement son propre avatar
CREATE POLICY "Users can upload own avatar"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
```

---

## 🧪 Tests et debugging

### Tester les requêtes

**Via Supabase Dashboard** :

1. Aller dans `SQL Editor`
2. Exécuter des requêtes :

```sql
-- Voir tous les profils
SELECT * FROM profiles;

-- Voir les athlètes avec leur profil
SELECT
  p.email,
  p.user_type,
  p.validation_status,
  ap.first_name,
  ap.last_name,
  ap.sport
FROM profiles p
LEFT JOIN athlete_profiles ap ON ap.user_id = p.id
WHERE p.user_type = 'athlete';
```

**Via le code** :

```typescript
// Activer le mode debug
const { data, error } = await supabase
  .from('profiles')
  .select('*')
  .eq('id', userId);

console.log('Data:', data);
console.log('Error:', error);
```

### Debugger RLS

Si vous ne voyez pas les données attendues :

```sql
-- Vérifier les policies
SELECT * FROM pg_policies WHERE tablename = 'profiles';

-- Tester une policy manuellement
SELECT * FROM profiles WHERE auth.uid() = id;
```

### Logs et monitoring

**Supabase Dashboard → Logs** :

- `Database Logs` : Voir les requêtes SQL
- `Auth Logs` : Voir les connexions/déconnexions
- `API Logs` : Voir les appels API

---

## 🚀 Environnements

### Développement local

```bash
# .env.development
VITE_SUPABASE_URL=https://fcryxwdpqbnxhymelcbo.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
```

### Staging

```bash
# .env.staging (sur Vercel/Netlify)
VITE_SUPABASE_URL=https://staging-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
```

### Production

```bash
# .env.production (sur Vercel/Netlify)
VITE_SUPABASE_URL=https://prod-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
```

**Bonnes pratiques** :
- ✅ Utiliser des projets Supabase séparés pour dev/staging/prod
- ✅ Ne jamais partager les clés en clair (utiliser les secrets du CI/CD)
- ✅ Utiliser `VITE_SUPABASE_ANON_KEY` (pas la service_role_key côté frontend)

---

## 📋 Checklist de démarrage

### Configuration initiale

- [ ] Créer un projet Supabase (ou utiliser celui existant)
- [ ] Copier les credentials dans `.env`
- [ ] Vérifier que `src/lib/supabase.ts` fonctionne
- [ ] Appliquer toutes les migrations dans l'ordre
- [ ] Activer RLS sur toutes les tables
- [ ] Tester l'inscription d'un utilisateur
- [ ] Tester la connexion
- [ ] Vérifier que les policies RLS fonctionnent

### Vérifications

```typescript
// Test 1 : Connexion au client
import { supabase } from '@/lib/supabase';
console.log('Supabase client:', supabase); // ✅ Doit être défini

// Test 2 : Inscription
const { data, error } = await supabase.auth.signUp({
  email: 'test@example.com',
  password: 'test123456'
});
console.log('SignUp:', data, error); // ✅ data doit contenir l'user

// Test 3 : Lecture du profil
const { data: profile } = await supabase
  .from('profiles')
  .select('*')
  .eq('email', 'test@example.com')
  .maybeSingle();
console.log('Profile:', profile); // ✅ Doit retourner le profil
```

---

## 🆘 Problèmes courants

### Erreur : "Missing Supabase environment variables"

**Cause** : Variables `.env` non définies

**Solution** :
```bash
# Vérifier que .env existe
ls -la .env

# Vérifier le contenu
cat .env

# Si manquant, créer le fichier
echo "VITE_SUPABASE_URL=https://xxx.supabase.co" > .env
echo "VITE_SUPABASE_ANON_KEY=eyJxxx..." >> .env

# Redémarrer le dev server
npm run dev
```

### Erreur : "new row violates row-level security policy"

**Cause** : RLS bloque l'opération

**Solution** :
```sql
-- Vérifier les policies
SELECT * FROM pg_policies WHERE tablename = 'nom_table';

-- Désactiver temporairement RLS (DEV ONLY)
ALTER TABLE nom_table DISABLE ROW LEVEL SECURITY;

-- Réactiver après debug
ALTER TABLE nom_table ENABLE ROW LEVEL SECURITY;
```

### Erreur : "JWT expired"

**Cause** : Session expirée

**Solution** :
```typescript
// Rafraîchir la session
const { data, error } = await supabase.auth.refreshSession();

// Ou se reconnecter
await supabase.auth.signOut();
await supabase.auth.signInWithPassword({ email, password });
```

### Erreur : "relation does not exist"

**Cause** : Table non créée (migration non appliquée)

**Solution** :
1. Aller dans `SQL Editor` sur Supabase Dashboard
2. Vérifier que les tables existent : `SELECT * FROM profiles;`
3. Si non, appliquer les migrations dans l'ordre

---

## 💡 Bonnes pratiques

### ✅ À FAIRE

1. **Toujours utiliser RLS** : Ne jamais désactiver en production
2. **Utiliser `maybeSingle()`** : Au lieu de `single()` pour éviter les erreurs
3. **Gérer les erreurs** : Toujours vérifier `error` dans les réponses
4. **Types TypeScript** : Générer les types depuis le schéma Supabase
5. **Indexes** : Ajouter des index sur les colonnes fréquemment requêtées
6. **Migrations** : Toujours utiliser des migrations (jamais modifier manuellement)

### ❌ À ÉVITER

1. Ne jamais utiliser `service_role_key` côté frontend
2. Ne jamais commit le fichier `.env`
3. Ne jamais désactiver RLS en production
4. Ne pas faire de `DELETE FROM` sans `WHERE`
5. Ne pas stocker de données sensibles en clair (hacher les mots de passe)

---

## 🔗 Ressources

### Documentation officielle

- [Supabase Docs](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Storage](https://supabase.com/docs/guides/storage)

### Guides du projet

- [README.md](./README.md) - Architecture générale
- [README_DEVELOPER_GUIDE.md](./README_DEVELOPER_GUIDE.md) - Migration vers la base de données
- [README_DJANGO_INTEGRATION.md](./README_DJANGO_INTEGRATION.md) - Intégration backend Django

---

## ✅ Résumé

| Aspect | Configuration |
|--------|---------------|
| **Base de données** | PostgreSQL via Supabase |
| **Auth** | Email/password avec JWT |
| **Sécurité** | Row Level Security (RLS) |
| **Migrations** | 5 fichiers SQL dans `supabase/migrations/` |
| **Client** | `@supabase/supabase-js` dans `src/lib/supabase.ts` |
| **Variables env** | `.env` avec URL et ANON_KEY |
| **Tables** | profiles, athlete_profiles, company_profiles, contacts |

**Supabase est prêt à l'emploi !** 🚀

Toutes les tables sont créées, les policies RLS sont configurées, et l'authentification fonctionne.