# 🔌 Documentation API - Trophenix

## 📝 Historique du document

| Date | Version | Lignes | Modifications | Auteur |
|------|---------|--------|---------------|--------|
| 2025-01-11 | 1.0 | 971 | Création documentation API complète (Supabase + Django + IA) | Claude |

---

## 📌 Vue d'ensemble

Ce document décrit l'architecture API complète du projet Trophenix, incluant les endpoints Supabase, les endpoints Django prévus, et l'intégration de l'agent IA Elea.

**Stack API** :
- **Supabase REST API** : CRUD sur la base de données (PostgreSQL)
- **Supabase Auth API** : Authentification et gestion des utilisateurs
- **Django REST API** (à venir) : Logique métier complexe et workflows
- **IA Agent API** (à venir) : Service d'agent conversationnel Elea

---

## 🏗️ Architecture API

```
┌─────────────────────────────────────────────────────────────┐
│                      FRONTEND (React)                       │
└───────────┬─────────────────────────────────┬───────────────┘
            │                                 │
            │                                 │
            ▼                                 ▼
┌───────────────────────┐         ┌─────────────────────────┐
│   SUPABASE REST API   │         │   DJANGO REST API       │
│   (Auto-généré)       │         │   (Custom endpoints)    │
│                       │         │                         │
│  ┌─────────────────┐ │         │  ┌──────────────────┐   │
│  │ /rest/v1/       │ │         │  │ /api/v1/         │   │
│  │ - profiles      │ │         │  │ - analytics      │   │
│  │ - athletes      │ │         │  │ - matching       │   │
│  │ - companies     │ │         │  │ - notifications  │   │
│  │ - contacts      │ │         │  │ - reports        │   │
│  └─────────────────┘ │         │  └──────────────────┘   │
│                       │         │                         │
│  ┌─────────────────┐ │         │  ┌──────────────────┐   │
│  │ /auth/v1/       │ │         │  │ /api/ai/         │   │
│  │ - signup        │ │         │  │ - chat           │   │
│  │ - token         │ │         │  │ - suggestions    │   │
│  │ - user          │ │         │  │ - context        │   │
│  └─────────────────┘ │         │  └──────────────────┘   │
└───────────────────────┘         └─────────────────────────┘
            │                                 │
            └─────────────┬───────────────────┘
                          │
                          ▼
                ┌──────────────────┐
                │  POSTGRESQL DB   │
                │    (Supabase)    │
                └──────────────────┘
```

---

## 🔐 Authentification

### Base URL

```bash
# Supabase Auth
https://your-project.supabase.co/auth/v1

# Supabase REST
https://your-project.supabase.co/rest/v1

# Django (à venir)
https://api.trophenix.com/api/v1
```

### Headers requis

```bash
# Supabase
apikey: your-anon-key-here
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json

# Django
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json
```

---

## 📡 Supabase Auth API

### POST /auth/v1/signup

Créer un nouveau compte utilisateur.

**Request**

```bash
POST https://your-project.supabase.co/auth/v1/signup
Content-Type: application/json
apikey: {SUPABASE_ANON_KEY}

{
  "email": "athlete@example.com",
  "password": "SecurePassword123!"
}
```

**Response**

```json
{
  "access_token": "your-jwt-token-here",
  "token_type": "bearer",
  "expires_in": 3600,
  "refresh_token": "v1.MRjcaLWzk...",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "athlete@example.com",
    "created_at": "2024-01-01T12:00:00.000Z"
  }
}
```

**Codes d'erreur**

| Code | Description |
|------|-------------|
| 400 | Email déjà utilisé |
| 422 | Validation échouée (format email, mot de passe faible) |
| 500 | Erreur serveur |

---

### POST /auth/v1/token?grant_type=password

Se connecter avec email et mot de passe.

**Request**

```bash
POST https://your-project.supabase.co/auth/v1/token?grant_type=password
Content-Type: application/json
apikey: {SUPABASE_ANON_KEY}

{
  "email": "athlete@example.com",
  "password": "SecurePassword123!"
}
```

**Response**

```json
{
  "access_token": "your-jwt-token-here",
  "token_type": "bearer",
  "expires_in": 3600,
  "refresh_token": "v1.MRjcaLWzk...",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "athlete@example.com",
    "user_metadata": {},
    "app_metadata": {}
  }
}
```

---

### GET /auth/v1/user

Récupérer l'utilisateur connecté.

**Request**

```bash
GET https://your-project.supabase.co/auth/v1/user
Authorization: Bearer {JWT_TOKEN}
apikey: {SUPABASE_ANON_KEY}
```

**Response**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "athlete@example.com",
  "created_at": "2024-01-01T12:00:00.000Z",
  "updated_at": "2024-01-01T12:00:00.000Z"
}
```

---

### POST /auth/v1/logout

Déconnecter l'utilisateur.

**Request**

```bash
POST https://your-project.supabase.co/auth/v1/logout
Authorization: Bearer {JWT_TOKEN}
apikey: {SUPABASE_ANON_KEY}
```

**Response**

```
204 No Content
```

---

## 📊 Supabase REST API

### Convention de nommage

```
GET    /rest/v1/{table}                  # Liste
GET    /rest/v1/{table}?id=eq.{id}       # Détail
POST   /rest/v1/{table}                  # Créer
PATCH  /rest/v1/{table}?id=eq.{id}       # Modifier
DELETE /rest/v1/{table}?id=eq.{id}       # Supprimer
```

---

### GET /rest/v1/profiles

Récupérer les profils.

**Request**

```bash
GET https://your-project.supabase.co/rest/v1/profiles
Authorization: Bearer {JWT_TOKEN}
apikey: {SUPABASE_ANON_KEY}

# Filtres disponibles
?id=eq.{uuid}                    # Par ID
?email=eq.athlete@example.com    # Par email
?user_type=eq.athlete            # Par type
?validation_status=eq.approved   # Par statut

# Sélection de colonnes
?select=id,email,user_type

# Pagination
?limit=10&offset=0

# Tri
?order=created_at.desc
```

**Response**

```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "athlete@example.com",
    "user_type": "athlete",
    "validation_status": "pending",
    "created_at": "2024-01-01T12:00:00.000Z",
    "updated_at": "2024-01-01T12:00:00.000Z"
  }
]
```

---

### POST /rest/v1/profiles

Créer un profil.

**Request**

```bash
POST https://your-project.supabase.co/rest/v1/profiles
Authorization: Bearer {JWT_TOKEN}
apikey: {SUPABASE_ANON_KEY}
Content-Type: application/json
Prefer: return=representation

{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "athlete@example.com",
  "user_type": "athlete",
  "validation_status": "pending"
}
```

**Response**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "athlete@example.com",
  "user_type": "athlete",
  "validation_status": "pending",
  "created_at": "2024-01-01T12:00:00.000Z",
  "updated_at": "2024-01-01T12:00:00.000Z"
}
```

---

### GET /rest/v1/athlete_profiles

Récupérer les profils athlètes.

**Request**

```bash
GET https://your-project.supabase.co/rest/v1/athlete_profiles
Authorization: Bearer {JWT_TOKEN}
apikey: {SUPABASE_ANON_KEY}

# Filtres
?user_id=eq.{uuid}
?sport=eq.Football
?sport_level=ilike.%international%
?geographic_zone=eq.Paris

# Join avec profiles
?select=*,profiles(email,validation_status)
```

**Response**

```json
[
  {
    "id": "660e8400-e29b-41d4-a716-446655440000",
    "user_id": "550e8400-e29b-41d4-a716-446655440000",
    "first_name": "Jean",
    "last_name": "Dupont",
    "photo_url": "https://example.com/photo.jpg",
    "sport": "Football",
    "sport_level": "Professionnel international",
    "birth_date": "1995-03-15",
    "birth_place": "Paris",
    "last_club": "PSG",
    "training_center": "INF Clairefontaine",
    "phone": "+33612345678",
    "instagram_handle": "@jeandupont",
    "tiktok_handle": "@jeandupont",
    "linkedin_url": "https://linkedin.com/in/jeandupont",
    "achievements": "Champion de France 2022, Équipe de France",
    "professional_history": "PSG (2018-2023), Monaco (2015-2018)",
    "geographic_zone": "Île-de-France",
    "desired_field": "Marketing sportif",
    "position_type": "CDI",
    "availability": "Immédiate",
    "degrees": "Master Management du Sport",
    "recommendations": "Recommandé par...",
    "voice_note_url": null,
    "created_at": "2024-01-01T12:00:00.000Z",
    "updated_at": "2024-01-01T12:00:00.000Z",
    "profiles": {
      "email": "athlete@example.com",
      "validation_status": "approved"
    }
  }
]
```

---

### POST /rest/v1/athlete_profiles

Créer un profil athlète.

**Request**

```bash
POST https://your-project.supabase.co/rest/v1/athlete_profiles
Authorization: Bearer {JWT_TOKEN}
apikey: {SUPABASE_ANON_KEY}
Content-Type: application/json

{
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "first_name": "Jean",
  "last_name": "Dupont",
  "sport": "Football",
  "sport_level": "Professionnel",
  "birth_date": "1995-03-15",
  "birth_place": "Paris",
  "last_club": "PSG",
  "training_center": "INF Clairefontaine",
  "geographic_zone": "Île-de-France",
  "desired_field": "Marketing sportif",
  "position_type": "CDI",
  "availability": "Immédiate",
  "degrees": "Master Management du Sport"
}
```

---

### GET /rest/v1/company_profiles

Récupérer les profils entreprises.

**Request**

```bash
GET https://your-project.supabase.co/rest/v1/company_profiles
Authorization: Bearer {JWT_TOKEN}
apikey: {SUPABASE_ANON_KEY}

?sector=eq.Tech
?company_size=eq.50-200
?location=ilike.%Paris%
```

**Response**

```json
[
  {
    "id": "770e8400-e29b-41d4-a716-446655440000",
    "user_id": "880e8400-e29b-41d4-a716-446655440000",
    "company_name": "TechCorp",
    "logo_url": "https://example.com/logo.png",
    "sector": "Tech",
    "company_size": "50-200",
    "location": "Paris",
    "hr_contact": "rh@techcorp.com",
    "description": "Entreprise innovante dans le digital",
    "website": "https://techcorp.com",
    "created_at": "2024-01-01T12:00:00.000Z",
    "updated_at": "2024-01-01T12:00:00.000Z"
  }
]
```

---

### GET /rest/v1/contacts

Récupérer les contacts (matching athlète-entreprise).

**Request**

```bash
GET https://your-project.supabase.co/rest/v1/contacts
Authorization: Bearer {JWT_TOKEN}
apikey: {SUPABASE_ANON_KEY}

?athlete_id=eq.{uuid}
?company_id=eq.{uuid}
?status=eq.pending

# Join avec profils athlètes et entreprises
?select=*,athlete_profiles(*),company_profiles(*)
```

**Response**

```json
[
  {
    "id": "990e8400-e29b-41d4-a716-446655440000",
    "athlete_id": "550e8400-e29b-41d4-a716-446655440000",
    "company_id": "880e8400-e29b-41d4-a716-446655440000",
    "status": "pending",
    "message": "Bonjour, nous serions ravis d'échanger avec vous...",
    "created_at": "2024-01-01T12:00:00.000Z",
    "athlete_profiles": {
      "first_name": "Jean",
      "last_name": "Dupont",
      "sport": "Football"
    },
    "company_profiles": {
      "company_name": "TechCorp",
      "sector": "Tech"
    }
  }
]
```

---

## 🤖 IA Agent API (Django - à venir)

### POST /api/ai/chat

Envoyer un message à l'agent Elea.

**Request**

```bash
POST https://api.trophenix.com/api/ai/chat
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json

{
  "message": "Comment puis-je remplir mon profil ?",
  "context": {
    "page": "onboarding_athlete",
    "step": 1,
    "userType": "athlete",
    "userId": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

**Response**

```json
{
  "response": "Pour remplir votre profil athlète, commencez par indiquer votre sport principal et votre niveau. Ensuite, décrivez votre parcours sportif et vos aspirations professionnelles. N'oubliez pas de mentionner vos diplômes et vos recommandations si vous en avez.",
  "suggestions": [
    {
      "id": "1",
      "text": "Quels sports sont disponibles ?"
    },
    {
      "id": "2",
      "text": "Comment décrire ma situation actuelle ?"
    }
  ]
}
```

---

### POST /api/ai/suggestions

Obtenir des suggestions contextuelles.

**Request**

```bash
POST https://api.trophenix.com/api/ai/suggestions
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json

{
  "context": {
    "page": "onboarding_athlete",
    "step": 2,
    "userType": "athlete"
  }
}
```

**Response**

```json
{
  "suggestions": [
    {
      "id": "1",
      "text": "Qu'est-ce que la liste ministérielle ?"
    },
    {
      "id": "2",
      "text": "Comment définir mon niveau sportif ?"
    },
    {
      "id": "3",
      "text": "Dois-je renseigner tous les clubs ?"
    }
  ]
}
```

---

## 📊 Django REST API (Endpoints métier)

### GET /api/v1/analytics/dashboard

Obtenir les statistiques du dashboard.

**Request**

```bash
GET https://api.trophenix.com/api/v1/analytics/dashboard
Authorization: Bearer {JWT_TOKEN}
```

**Response**

```json
{
  "total_athletes": 1250,
  "total_companies": 345,
  "pending_validations": 23,
  "active_matches": 89,
  "stats_by_sport": {
    "Football": 450,
    "Basketball": 230,
    "Tennis": 180
  },
  "stats_by_sector": {
    "Tech": 120,
    "Finance": 85,
    "Marketing": 70
  }
}
```

---

### POST /api/v1/matching/suggest

Obtenir des suggestions de matching.

**Request**

```bash
POST https://api.trophenix.com/api/v1/matching/suggest
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json

{
  "athlete_id": "550e8400-e29b-41d4-a716-446655440000",
  "filters": {
    "sectors": ["Tech", "Marketing"],
    "locations": ["Paris", "Lyon"],
    "company_sizes": ["50-200", "200-500"]
  }
}
```

**Response**

```json
{
  "matches": [
    {
      "company_id": "880e8400-e29b-41d4-a716-446655440000",
      "company_name": "TechCorp",
      "score": 95,
      "reasons": [
        "Secteur correspondant (Tech)",
        "Localisation proche (Paris)",
        "Taille d'entreprise adaptée"
      ]
    },
    {
      "company_id": "990e8400-e29b-41d4-a716-446655440000",
      "company_name": "MarketingPro",
      "score": 88,
      "reasons": [
        "Recherche profil sportif",
        "Localisation correspondante"
      ]
    }
  ]
}
```

---

### POST /api/v1/admin/validate-profile

Valider un profil (admin uniquement).

**Request**

```bash
POST https://api.trophenix.com/api/v1/admin/validate-profile
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json

{
  "profile_id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "approved",
  "comment": "Profil vérifié et validé"
}
```

**Response**

```json
{
  "success": true,
  "profile": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "validation_status": "approved",
    "updated_at": "2024-01-01T12:00:00.000Z"
  }
}
```

---

## 🔍 Filtrage et recherche

### Opérateurs Supabase

| Opérateur | Description | Exemple |
|-----------|-------------|---------|
| `eq` | Égal | `?sport=eq.Football` |
| `neq` | Différent | `?status=neq.rejected` |
| `gt` | Plus grand | `?age=gt.25` |
| `gte` | Plus grand ou égal | `?age=gte.18` |
| `lt` | Plus petit | `?age=lt.40` |
| `lte` | Plus petit ou égal | `?age=lte.35` |
| `like` | LIKE (sensible à la casse) | `?name=like.*Dupont*` |
| `ilike` | LIKE (insensible à la casse) | `?name=ilike.*dupont*` |
| `is` | IS NULL | `?voice_note_url=is.null` |
| `in` | IN | `?sport=in.(Football,Basketball)` |

### Exemples de requêtes complexes

```bash
# Athlètes professionnels à Paris
GET /rest/v1/athlete_profiles?sport_level=ilike.%professionnel%&geographic_zone=eq.Paris

# Entreprises Tech de taille moyenne
GET /rest/v1/company_profiles?sector=eq.Tech&company_size=in.(50-200,200-500)

# Contacts en attente avec détails
GET /rest/v1/contacts?status=eq.pending&select=*,athlete_profiles(*),company_profiles(*)

# Profils validés créés cette semaine
GET /rest/v1/profiles?validation_status=eq.approved&created_at=gte.2024-01-01

# Recherche plein texte sur nom/prénom
GET /rest/v1/athlete_profiles?or=(first_name.ilike.*jean*,last_name.ilike.*jean*)
```

---

## 📄 Pagination

### Standard

```bash
# Page 1 (10 premiers résultats)
GET /rest/v1/athlete_profiles?limit=10&offset=0

# Page 2 (résultats 11-20)
GET /rest/v1/athlete_profiles?limit=10&offset=10

# Page 3 (résultats 21-30)
GET /rest/v1/athlete_profiles?limit=10&offset=20
```

### Avec count

```bash
GET /rest/v1/athlete_profiles?limit=10&offset=0
Prefer: count=exact

# Response headers
Content-Range: 0-9/125
```

---

## 🔒 Sécurité

### Row Level Security (RLS)

Toutes les tables ont RLS activé. Les requêtes sont automatiquement filtrées :

```sql
-- Un athlète peut seulement voir/modifier son profil
SELECT * FROM athlete_profiles WHERE user_id = auth.uid();

-- Une entreprise peut voir tous les profils validés
SELECT * FROM athlete_profiles
WHERE EXISTS (
  SELECT 1 FROM profiles
  WHERE id = athlete_profiles.user_id
  AND validation_status = 'approved'
);

-- Un admin peut tout voir
SELECT * FROM profiles; -- Autorisé si user_type = 'admin'
```

### Rate Limiting

| Endpoint | Limite |
|----------|--------|
| Auth (signup/login) | 10 req/min |
| REST API (lecture) | 100 req/min |
| REST API (écriture) | 50 req/min |
| IA Agent | 20 req/min |

---

## 🐛 Codes d'erreur

### HTTP Status Codes

| Code | Description | Action |
|------|-------------|--------|
| 200 | Succès | - |
| 201 | Créé | Ressource créée avec succès |
| 204 | Pas de contenu | Opération réussie sans retour |
| 400 | Requête invalide | Vérifier les paramètres |
| 401 | Non authentifié | Fournir un token valide |
| 403 | Non autorisé | Vérifier les permissions |
| 404 | Non trouvé | Ressource inexistante |
| 409 | Conflit | Email déjà utilisé, etc. |
| 422 | Validation échouée | Vérifier les données |
| 429 | Trop de requêtes | Rate limit atteint |
| 500 | Erreur serveur | Réessayer plus tard |

### Erreurs Supabase

```json
{
  "code": "23505",
  "details": "Key (email)=(test@example.com) already exists.",
  "hint": null,
  "message": "duplicate key value violates unique constraint"
}
```

### Erreurs Django

```json
{
  "error": "ValidationError",
  "message": "Invalid email format",
  "field": "email",
  "code": "invalid_format"
}
```

---

## 🧪 Tests API

### Avec curl

```bash
# Signup
curl -X POST https://your-project.supabase.co/auth/v1/signup \
  -H "apikey: {ANON_KEY}" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!"}'

# Login
curl -X POST https://your-project.supabase.co/auth/v1/token?grant_type=password \
  -H "apikey: {ANON_KEY}" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!"}'

# Get profiles
curl -X GET https://your-project.supabase.co/rest/v1/profiles \
  -H "apikey: {ANON_KEY}" \
  -H "Authorization: Bearer {JWT_TOKEN}"
```

### Avec JavaScript

```typescript
import { supabase } from './lib/supabase';

// Signup
const { data, error } = await supabase.auth.signUp({
  email: 'test@example.com',
  password: 'Test123!',
});

// Get profiles
const { data: profiles } = await supabase
  .from('profiles')
  .select('*')
  .eq('user_type', 'athlete');

// Create athlete profile
const { data: athlete } = await supabase
  .from('athlete_profiles')
  .insert({
    user_id: userId,
    first_name: 'Jean',
    last_name: 'Dupont',
    sport: 'Football',
  })
  .select()
  .single();
```

---

## 📊 Exemples de workflows

### Workflow 1 : Inscription athlète

```typescript
// 1. Signup
const { data: authData } = await supabase.auth.signUp({
  email: 'athlete@example.com',
  password: 'SecurePass123!',
});

// 2. Créer le profil de base
await supabase.from('profiles').insert({
  id: authData.user.id,
  email: 'athlete@example.com',
  user_type: 'athlete',
  validation_status: 'pending',
});

// 3. Créer le profil athlète détaillé
await supabase.from('athlete_profiles').insert({
  user_id: authData.user.id,
  first_name: 'Jean',
  last_name: 'Dupont',
  sport: 'Football',
  sport_level: 'Professionnel',
  geographic_zone: 'Paris',
  desired_field: 'Marketing',
  position_type: 'CDI',
  availability: 'Immédiate',
});

// 4. En attente de validation admin
```

### Workflow 2 : Matching entreprise-athlète

```typescript
// 1. Entreprise recherche des athlètes
const { data: athletes } = await supabase
  .from('athlete_profiles')
  .select('*, profiles(*)')
  .eq('profiles.validation_status', 'approved')
  .eq('desired_field', 'Marketing')
  .eq('geographic_zone', 'Paris')
  .limit(10);

// 2. Entreprise contacte un athlète
await supabase.from('contacts').insert({
  athlete_id: athleteId,
  company_id: companyId,
  status: 'pending',
  message: 'Bonjour, nous serions ravis d\'échanger avec vous...',
});

// 3. Notifier l'athlète (via email/push)
```

---

## 🔗 Ressources

### Documentation

- [Supabase REST API](https://supabase.com/docs/reference/javascript/select)
- [Supabase Auth API](https://supabase.com/docs/reference/javascript/auth-signup)
- [PostgREST](https://postgrest.org/en/stable/) - API auto-générée
- [Django REST Framework](https://www.django-rest-framework.org/)

### Outils

- [Postman Collection](https://www.postman.com/) - Importer et tester les endpoints
- [Supabase Studio](https://supabase.com/dashboard) - Interface graphique
- [curl](https://curl.se/) - Tests en ligne de commande

---

## ✅ Résumé

| API | Base URL | Utilisation |
|-----|----------|-------------|
| **Supabase Auth** | `/auth/v1/` | Authentification (signup, login, logout) |
| **Supabase REST** | `/rest/v1/` | CRUD sur tables (profiles, athletes, companies) |
| **Django REST** | `/api/v1/` | Logique métier (analytics, matching, admin) |
| **IA Agent** | `/api/ai/` | Chat avec agent Elea (suggestions, contexte) |

**Documentation API complète et prête pour l'intégration !**
