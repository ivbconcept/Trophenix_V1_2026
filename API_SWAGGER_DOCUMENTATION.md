# 📚 Documentation API Swagger - Trophenix

## 🎯 Vue d'ensemble

La documentation API interactive Swagger est maintenant disponible pour Trophenix ! Elle offre :

- ✅ **Documentation complète** de tous les endpoints
- ✅ **Interface interactive** pour tester les API directement
- ✅ **Exemples de requêtes/réponses** pour chaque endpoint
- ✅ **Schémas de données** détaillés
- ✅ **Authentification intégrée** (JWT + API Key)

---

## 🚀 Accéder à la documentation

### **En développement local :**

1. Lance le serveur de dev :
   ```bash
   npm run dev
   ```

2. Ouvre ton navigateur :
   ```
   http://localhost:5173/swagger.html
   ```

### **Depuis l'interface Admin :**

Connecte-toi en tant qu'Admin et clique sur le bouton **"API Docs"** dans la barre de navigation.

---

## 🔐 Authentification dans Swagger

### **Méthode 1 : Utiliser l'API Key (pour les requêtes publiques)**

1. Clique sur le bouton **"Authorize"** 🔓 en haut à droite
2. Dans **ApiKey** (apikey), colle ta clé anon Supabase :
   ```
   your-anon-key-here
   ```
3. Clique sur **Authorize**

### **Méthode 2 : Utiliser un JWT Token (pour les requêtes authentifiées)**

1. **Obtenir un token JWT :**
   - Dans Swagger, va à **Auth** → **POST /auth/v1/token**
   - Clique sur **"Try it out"**
   - Remplis avec tes identifiants :
     ```json
     {
       "email": "ton-email@example.com",
       "password": "ton-mot-de-passe"
     }
     ```
   - Clique sur **Execute**
   - **Copie** le `access_token` de la réponse

2. **Configurer l'authentification :**
   - Clique sur **"Authorize"** 🔓
   - Dans **BearerAuth**, colle le token JWT
   - Clique sur **Authorize**

✅ **Tu es maintenant authentifié !** Toutes les requêtes incluront automatiquement ton token.

---

## 📡 Endpoints disponibles

### **🔐 Auth (Authentification)**

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/auth/v1/signup` | Créer un compte |
| POST | `/auth/v1/token` | Se connecter (obtenir JWT) |
| GET | `/auth/v1/user` | Infos utilisateur courant |
| POST | `/auth/v1/logout` | Se déconnecter |

### **👤 Profiles**

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/rest/v1/profiles` | Lister tous les profils |
| POST | `/rest/v1/profiles` | Créer un profil |
| GET | `/rest/v1/profiles/{id}` | Obtenir un profil |
| PATCH | `/rest/v1/profiles/{id}` | Modifier un profil |
| DELETE | `/rest/v1/profiles/{id}` | Supprimer un profil |

### **🏆 Athletes**

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/rest/v1/athlete_profiles` | Lister les athlètes |
| POST | `/rest/v1/athlete_profiles` | Créer profil athlète |

### **🏢 Companies**

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/rest/v1/company_profiles` | Lister les entreprises |
| POST | `/rest/v1/company_profiles` | Créer profil entreprise |

### **💼 Jobs (Offres d'emploi)**

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/rest/v1/jobs` | Lister les offres |
| POST | `/rest/v1/jobs` | Créer une offre |
| GET | `/rest/v1/jobs/{id}` | Obtenir une offre |
| PATCH | `/rest/v1/jobs/{id}` | Modifier une offre |
| DELETE | `/rest/v1/jobs/{id}` | Supprimer une offre |

### **📝 Applications (Candidatures)**

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/rest/v1/applications` | Lister les candidatures |
| POST | `/rest/v1/applications` | Créer une candidature |
| PATCH | `/rest/v1/applications/{id}` | Modifier le statut |

---

## 🧪 Tester un endpoint

### **Exemple : Lister les athlètes**

1. **Configure l'auth** (voir ci-dessus)

2. **Va à** `Athletes` → `GET /rest/v1/athlete_profiles`

3. **Clique sur** "Try it out"

4. **Configure les paramètres :**
   - `select` : `*` (pour tout récupérer)
   - `sport` : `Football` (optionnel, pour filtrer)
   - `limit` : `10`

5. **Clique sur** "Execute"

6. **Résultat :**
   ```json
   [
     {
       "id": "uuid",
       "first_name": "John",
       "last_name": "Doe",
       "sport": "Football",
       "sport_level": "international",
       "current_club": "PSG",
       ...
     }
   ]
   ```

---

## 📋 Filtres et paramètres

### **Filtres Supabase (dans l'URL)**

```bash
# Filtrer par sport
/rest/v1/athlete_profiles?sport=eq.Football

# Filtrer par niveau
/rest/v1/athlete_profiles?sport_level=eq.international

# Combiner plusieurs filtres
/rest/v1/athlete_profiles?sport=eq.Football&sport_level=eq.international

# Limiter les résultats
/rest/v1/athlete_profiles?limit=20&offset=0

# Trier
/rest/v1/athlete_profiles?order=created_at.desc
```

### **Opérateurs disponibles**

| Opérateur | Description | Exemple |
|-----------|-------------|---------|
| `eq` | Égal | `sport=eq.Football` |
| `neq` | Différent | `sport=neq.Rugby` |
| `gt` | Supérieur | `age=gt.18` |
| `gte` | Supérieur ou égal | `age=gte.18` |
| `lt` | Inférieur | `age=lt.30` |
| `lte` | Inférieur ou égal | `age=lte.30` |
| `like` | Contient (LIKE) | `name=like.*John*` |
| `ilike` | Contient (insensible casse) | `name=ilike.*john*` |
| `in` | Dans liste | `sport=in.(Football,Rugby)` |
| `is` | Null check | `phone=is.null` |

---

## 🔒 Sécurité et RLS

### **Row Level Security (RLS)**

Toutes les tables sont protégées par RLS :

- ✅ Les utilisateurs ne peuvent voir QUE leurs propres données
- ✅ Les admins ont accès complet
- ✅ Les entreprises voient les profils athlètes publics
- ✅ Les athlètes voient les offres d'emploi publiées

### **Permissions par rôle**

| Rôle | Permissions |
|------|-------------|
| **Anonyme** | Inscription, connexion uniquement |
| **Athlète** | Voir offres, postuler, voir son profil |
| **Entreprise** | Créer offres, voir candidatures, voir athlètes |
| **Admin** | Accès complet à tout |

---

## 📦 Schémas de données

Tous les schémas sont documentés dans Swagger sous **"Schemas"** :

- **User** : Utilisateur Supabase Auth
- **Profile** : Profil de base
- **AthleteProfile** : Profil athlète complet
- **CompanyProfile** : Profil entreprise complet
- **Job** : Offre d'emploi
- **Application** : Candidature

---

## 💡 Astuces

### **1. Télécharger la spec OpenAPI**

Clique sur **"📄 OpenAPI Spec (YAML)"** en haut pour télécharger le fichier `openapi.yaml`.

### **2. Importer dans Postman**

1. Ouvre Postman
2. **Import** → **Link** → Colle : `http://localhost:5173/openapi.yaml`
3. Toutes les requêtes sont importées automatiquement !

### **3. Générer du code client**

Utilise [OpenAPI Generator](https://openapi-generator.tech/) :

```bash
# Générer un client TypeScript
openapi-generator-cli generate \
  -i http://localhost:5173/openapi.yaml \
  -g typescript-fetch \
  -o ./src/api-client
```

### **4. Tester avec cURL**

Swagger génère automatiquement la commande cURL pour chaque requête. Clique sur **"Copy"** à côté de la commande cURL.

---

## 🐛 Dépannage

### **Erreur 401 Unauthorized**

- ✅ Vérifie que tu as configuré l'authentification (bouton Authorize)
- ✅ Vérifie que ton token JWT n'est pas expiré (durée : 1h)
- ✅ Reconnecte-toi via `/auth/v1/token` pour obtenir un nouveau token

### **Erreur 403 Forbidden**

- ✅ RLS est actif : tu n'as pas les permissions
- ✅ Vérifie que tu es authentifié en tant que bon utilisateur
- ✅ Les admins doivent utiliser leur compte admin

### **Erreur CORS**

Si tu accèdes depuis un autre domaine, assure-toi que les CORS sont configurés dans Supabase.

---

## 📚 Ressources

- [Documentation Supabase REST API](https://supabase.com/docs/guides/api)
- [Spécification OpenAPI 3.0](https://swagger.io/specification/)
- [Swagger UI Documentation](https://swagger.io/tools/swagger-ui/)

---

## 🎉 Félicitations !

Tu as maintenant une documentation API complète et interactive !

**Accès rapide :**
- 🌐 Interface Swagger : http://localhost:5173/swagger.html
- 📄 Spec OpenAPI : http://localhost:5173/openapi.yaml

Bon dev ! 🚀
