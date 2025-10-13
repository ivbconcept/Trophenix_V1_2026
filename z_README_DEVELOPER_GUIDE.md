# 🔧 Guide du Développeur - Migration vers Production

## 📝 Historique du document

| Date | Version | Lignes | Modifications | Auteur |
|------|---------|--------|---------------|--------|
| 2025-01-11 | 1.0 | 792 | Création guide migration données en dur vers BDD | Claude |

---

## 📌 Objectif

Ce document explique **précisément** où se trouvent les données "en dur" (mock data) et comment les remplacer par de vraies requêtes à la base de données.

---

## 🎯 Données en Dur vs Base de Données

### État Actuel (V1 - Prototype)

```
Frontend ──> Constantes en dur ──> UI
             (constants/*.ts)
```

### État Futur (Production)

```
Frontend ──> API/Service ──> Base de données ──> UI
             (services/*.ts)
```

---

## 📍 Localisation des Données en Dur

### 1. Options des Formulaires

**Fichier** : `src/constants/onboardingOptions.ts`

#### Données à migrer :

| Constante | Usage | Migration requise |
|-----------|-------|-------------------|
| `ATHLETE_OPTIONS.SPORTS` | Liste des sports | ✅ OUI - Créer table `sports` |
| `ATHLETE_OPTIONS.SECTORS` | Secteurs professionnels | ✅ OUI - Créer table `professional_sectors` |
| `ATHLETE_OPTIONS.LOCATIONS` | Zones géographiques | ✅ OUI - Créer table `locations` |
| `ATHLETE_OPTIONS.CITIES` | Villes françaises | ✅ OUI - Créer table `cities` |
| `ATHLETE_OPTIONS.SITUATIONS` | Situations sportives | ✅ OUI - Créer table `athlete_situations` |
| `ATHLETE_OPTIONS.SPORT_LEVELS` | Niveaux sportifs | ✅ OUI - Créer table `sport_levels` |
| `ATHLETE_OPTIONS.POSITION_TYPES` | Types de postes | ✅ OUI - Créer table `position_types` |
| `COMPANY_OPTIONS.SECTORS` | Secteurs entreprises | ✅ OUI - Créer table `company_sectors` |
| `COMPANY_OPTIONS.COMPANY_SIZES` | Tailles entreprises | ✅ OUI - Créer table `company_sizes` |

---

## 🗄️ Étape 1 : Créer les Tables de Référence

### Migration Supabase

Créer le fichier : `supabase/migrations/YYYYMMDDHHMMSS_create_reference_tables.sql`

```sql
/*
  # Création des tables de référence

  Ce fichier crée toutes les tables pour remplacer les constantes en dur.
  Ces tables stockent les options des formulaires (sports, secteurs, etc.).

  Avantages :
  - Modification des options sans redéploiement du frontend
  - Ajout dynamique de nouvelles options
  - Traductions futures possibles
  - Statistiques sur les choix populaires

  1. Tables créées
    - `sports` : Liste des sports
    - `professional_sectors` : Secteurs professionnels pour athlètes
    - `company_sectors` : Secteurs d'activité des entreprises
    - `locations` : Zones géographiques
    - `cities` : Villes françaises
    - `athlete_situations` : Situations des athlètes
    - `sport_levels` : Niveaux sportifs
    - `position_types` : Types de postes recherchés
    - `company_sizes` : Tailles d'entreprises

  2. Security
    - Enable RLS sur toutes les tables
    - Lecture publique (SELECT)
    - Modification admin uniquement (INSERT/UPDATE/DELETE)
*/

-- ============================================
-- Table : sports
-- ============================================
CREATE TABLE IF NOT EXISTS sports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================
-- Table : professional_sectors
-- ============================================
CREATE TABLE IF NOT EXISTS professional_sectors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================
-- Table : company_sectors
-- ============================================
CREATE TABLE IF NOT EXISTS company_sectors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================
-- Table : locations
-- ============================================
CREATE TABLE IF NOT EXISTS locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================
-- Table : cities
-- ============================================
CREATE TABLE IF NOT EXISTS cities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  postal_code text,
  region text,
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================
-- Table : athlete_situations
-- ============================================
CREATE TABLE IF NOT EXISTS athlete_situations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================
-- Table : sport_levels
-- ============================================
CREATE TABLE IF NOT EXISTS sport_levels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================
-- Table : position_types
-- ============================================
CREATE TABLE IF NOT EXISTS position_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================
-- Table : company_sizes
-- ============================================
CREATE TABLE IF NOT EXISTS company_sizes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================
-- SECURITY : Row Level Security (RLS)
-- ============================================

-- Activer RLS sur toutes les tables
ALTER TABLE sports ENABLE ROW LEVEL SECURITY;
ALTER TABLE professional_sectors ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_sectors ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE athlete_situations ENABLE ROW LEVEL SECURITY;
ALTER TABLE sport_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE position_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_sizes ENABLE ROW LEVEL SECURITY;

-- ============================================
-- POLICIES : Lecture publique, modification admin
-- ============================================

-- Sports
CREATE POLICY "Public can read sports"
  ON sports FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "Only admins can modify sports"
  ON sports FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.user_type = 'admin'
    )
  );

-- Professional Sectors
CREATE POLICY "Public can read professional sectors"
  ON professional_sectors FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "Only admins can modify professional sectors"
  ON professional_sectors FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.user_type = 'admin'
    )
  );

-- Company Sectors
CREATE POLICY "Public can read company sectors"
  ON company_sectors FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "Only admins can modify company sectors"
  ON company_sectors FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.user_type = 'admin'
    )
  );

-- Locations
CREATE POLICY "Public can read locations"
  ON locations FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "Only admins can modify locations"
  ON locations FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.user_type = 'admin'
    )
  );

-- Cities
CREATE POLICY "Public can read cities"
  ON cities FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "Only admins can modify cities"
  ON cities FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.user_type = 'admin'
    )
  );

-- Athlete Situations
CREATE POLICY "Public can read athlete situations"
  ON athlete_situations FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "Only admins can modify athlete situations"
  ON athlete_situations FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.user_type = 'admin'
    )
  );

-- Sport Levels
CREATE POLICY "Public can read sport levels"
  ON sport_levels FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "Only admins can modify sport levels"
  ON sport_levels FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.user_type = 'admin'
    )
  );

-- Position Types
CREATE POLICY "Public can read position types"
  ON position_types FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "Only admins can modify position types"
  ON position_types FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.user_type = 'admin'
    )
  );

-- Company Sizes
CREATE POLICY "Public can read company sizes"
  ON company_sizes FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "Only admins can modify company sizes"
  ON company_sizes FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.user_type = 'admin'
    )
  );

-- ============================================
-- SEED DATA : Peupler les tables initiales
-- ============================================

-- Sports
INSERT INTO sports (name, display_order) VALUES
  ('Football', 1),
  ('Basketball', 2),
  ('Tennis', 3),
  ('Rugby', 4),
  ('Handball', 5),
  ('Volleyball', 6),
  ('Natation', 7),
  ('Athlétisme', 8),
  ('Cyclisme', 9),
  ('Judo', 10),
  ('Karaté', 11),
  ('Boxe', 12),
  ('Ski', 13),
  ('Snowboard', 14),
  ('Surf', 15),
  ('Voile', 16),
  ('Aviron', 17),
  ('Escrime', 18),
  ('Golf', 19),
  ('Équitation', 20),
  ('Gymnastique', 21),
  ('Danse', 22),
  ('Autre', 23)
ON CONFLICT (name) DO NOTHING;

-- Professional Sectors
INSERT INTO professional_sectors (name, display_order) VALUES
  ('Commercial / Vente', 1),
  ('Marketing / Communication', 2),
  ('Management / Direction', 3),
  ('Ressources Humaines', 4),
  ('Finance / Comptabilité', 5),
  ('Logistique / Supply Chain', 6),
  ('Conseil / Stratégie', 7),
  ('Événementiel', 8),
  ('Sport Business', 9),
  ('Éducation / Formation', 10),
  ('Santé / Bien-être', 11),
  ('Digital / Tech', 12),
  ('Entrepreneuriat', 13),
  ('Autre', 14)
ON CONFLICT (name) DO NOTHING;

-- À continuer pour les autres tables...
```

---

## 🔄 Étape 2 : Créer le Service de Référence

**Fichier** : `src/services/referenceDataService.ts`

```typescript
/**
 * Reference Data Service
 *
 * Service pour récupérer les données de référence depuis la base de données.
 * Remplace les constantes en dur de constants/onboardingOptions.ts
 *
 * @module services/referenceDataService
 */

import { supabase } from '../lib/supabase';

/**
 * Interface générique pour les données de référence
 */
interface ReferenceData {
  id: string;
  name: string;
  display_order: number;
  is_active: boolean;
}

/**
 * Service de gestion des données de référence
 */
export class ReferenceDataService {
  /**
   * Cache local pour éviter les requêtes multiples
   */
  private static cache: Map<string, ReferenceData[]> = new Map();

  /**
   * Récupère les données d'une table de référence
   *
   * @param tableName - Nom de la table
   * @param useCache - Utiliser le cache (défaut: true)
   * @returns Liste des données triées par display_order
   */
  private static async fetchReferenceData(
    tableName: string,
    useCache: boolean = true
  ): Promise<string[]> {
    try {
      // Vérifier le cache
      if (useCache && this.cache.has(tableName)) {
        const cached = this.cache.get(tableName)!;
        return cached.map(item => item.name);
      }

      // Requête à la base de données
      const { data, error } = await supabase
        .from(tableName)
        .select('id, name, display_order, is_active')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) {
        console.error(`Erreur lors du chargement de ${tableName}:`, error);
        return [];
      }

      // Mettre en cache
      if (data) {
        this.cache.set(tableName, data);
        return data.map(item => item.name);
      }

      return [];
    } catch (error) {
      console.error(`Erreur lors du chargement de ${tableName}:`, error);
      return [];
    }
  }

  /**
   * Vide le cache (utile après modification des données)
   */
  static clearCache(): void {
    this.cache.clear();
  }

  // ==========================================
  // Méthodes publiques pour chaque type de données
  // ==========================================

  static async getSports(): Promise<string[]> {
    return this.fetchReferenceData('sports');
  }

  static async getProfessionalSectors(): Promise<string[]> {
    return this.fetchReferenceData('professional_sectors');
  }

  static async getCompanySectors(): Promise<string[]> {
    return this.fetchReferenceData('company_sectors');
  }

  static async getLocations(): Promise<string[]> {
    return this.fetchReferenceData('locations');
  }

  static async getCities(): Promise<string[]> {
    return this.fetchReferenceData('cities');
  }

  static async getAthleteSituations(): Promise<string[]> {
    return this.fetchReferenceData('athlete_situations');
  }

  static async getSportLevels(): Promise<string[]> {
    return this.fetchReferenceData('sport_levels');
  }

  static async getPositionTypes(): Promise<string[]> {
    return this.fetchReferenceData('position_types');
  }

  static async getCompanySizes(): Promise<string[]> {
    return this.fetchReferenceData('company_sizes');
  }
}
```

---

## 🔌 Étape 3 : Modifier les Composants

### Avant (données en dur) :

```typescript
import { ATHLETE_OPTIONS } from '../../constants';

const SPORTS = ATHLETE_OPTIONS.SPORTS; // Données en dur
```

### Après (base de données) :

```typescript
import { useState, useEffect } from 'react';
import { ReferenceDataService } from '../../services/referenceDataService';

function AthleteOnboarding() {
  const [sports, setSports] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const sportsData = await ReferenceDataService.getSports();
      setSports(sportsData);
      setLoading(false);
    }
    loadData();
  }, []);

  if (loading) return <div>Chargement...</div>;

  // Utiliser 'sports' au lieu de 'SPORTS'
}
```

---

## 🎯 Étape 4 : Créer un Hook Personnalisé (Optionnel mais Recommandé)

**Fichier** : `src/hooks/useReferenceData.ts`

```typescript
/**
 * Hook pour charger les données de référence
 *
 * Usage :
 * const { sports, loading, error } = useReferenceData('sports');
 */

import { useState, useEffect } from 'react';
import { ReferenceDataService } from '../services/referenceDataService';

export function useReferenceData(dataType: string) {
  const [data, setData] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(null);

        let result: string[] = [];

        switch (dataType) {
          case 'sports':
            result = await ReferenceDataService.getSports();
            break;
          case 'professional_sectors':
            result = await ReferenceDataService.getProfessionalSectors();
            break;
          // ... autres cas
        }

        setData(result);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [dataType]);

  return { data, loading, error };
}
```

### Usage dans un composant :

```typescript
function AthleteOnboarding() {
  const { data: sports, loading } = useReferenceData('sports');

  if (loading) return <div>Chargement...</div>;

  // Utiliser 'sports'
}
```

---

## ✅ Checklist de Migration

### Phase 1 : Préparation
- [ ] Créer les tables de référence (migration SQL)
- [ ] Peupler les tables avec les données initiales
- [ ] Tester les requêtes SQL
- [ ] Vérifier les RLS policies

### Phase 2 : Services
- [ ] Créer `ReferenceDataService`
- [ ] Créer le hook `useReferenceData`
- [ ] Tester le chargement des données

### Phase 3 : Migration des Composants
- [ ] `AthleteOnboarding.tsx` - Remplacer SPORTS, SECTORS, etc.
- [ ] `CompanyOnboarding.tsx` - Remplacer SECTORS, SIZES, etc.
- [ ] Tester chaque formulaire

### Phase 4 : Nettoyage
- [ ] Marquer `constants/onboardingOptions.ts` comme DEPRECATED
- [ ] Ajouter des commentaires de migration
- [ ] Mettre à jour la documentation

---

## 🚨 Points d'Attention

### 1. Gestion du Loading

Toujours afficher un état de chargement pendant la récupération des données :

```typescript
if (loading) {
  return (
    <div className="flex justify-center items-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>
  );
}
```

### 2. Gestion des Erreurs

Prévoir un fallback en cas d'erreur :

```typescript
if (error) {
  return (
    <div className="p-4 bg-red-50 text-red-600 rounded">
      Erreur de chargement. Veuillez réessayer.
    </div>
  );
}
```

### 3. Cache et Performance

Le service utilise un cache pour éviter les requêtes multiples. Penser à le vider lors des modifications :

```typescript
// Après modification des données
ReferenceDataService.clearCache();
```

---

## 📊 Avantages de cette Architecture

| Aspect | Avant | Après |
|--------|-------|-------|
| **Modification** | Redéploiement frontend | Simple UPDATE SQL |
| **Ajout** | Modifier le code | INSERT en base |
| **Maintenance** | Difficile | Facile via admin |
| **Traductions** | Impossible | Possible (ajouter colonnes) |
| **Statistiques** | Non disponibles | Possibles (analytics) |
| **Testabilité** | Difficile | Facile (mock service) |

---

## 🔍 Comment Vérifier

```bash
# 1. Vérifier que les tables existent
# Dans Supabase Dashboard > SQL Editor
SELECT * FROM sports LIMIT 5;

# 2. Vérifier que les données sont là
SELECT COUNT(*) FROM sports;

# 3. Tester le RLS
# Se connecter en tant qu'utilisateur normal et essayer :
SELECT * FROM sports; -- Doit fonctionner
INSERT INTO sports (name) VALUES ('Test'); -- Doit échouer
```

---

## 💡 Conseil Final

**Migrez progressivement !**

1. Commencez par **une seule table** (ex: sports)
2. Testez complètement
3. Continuez table par table
4. Gardez les constantes en dur comme fallback au début

---

## 📞 Questions Fréquentes

### Q: Que faire si la base de données est down ?

**R:** Implémenter un fallback vers les constantes :

```typescript
static async getSports(): Promise<string[]> {
  try {
    const data = await this.fetchReferenceData('sports');
    if (data.length > 0) return data;

    // Fallback vers constantes
    return ATHLETE_OPTIONS.SPORTS;
  } catch {
    return ATHLETE_OPTIONS.SPORTS; // Fallback
  }
}
```

### Q: Comment gérer les traductions à l'avenir ?

**R:** Ajouter des colonnes `name_en`, `name_fr`, etc. aux tables.

### Q: Peut-on modifier l'ordre d'affichage sans toucher au code ?

**R:** Oui ! Modifier simplement `display_order` en base de données.

---

✅ **Ce guide garantit une migration propre et sans risque !**


