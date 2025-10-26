import { supabase } from '../lib/supabase';

export interface Sport {
  id: string;
  name: string;
  category: string;
  display_order: number;
}

export interface Club {
  id: string;
  name: string;
  sport_category: string;
  city: string | null;
  display_order: number;
}

export interface ReferenceItem {
  id: string;
  name: string;
  display_order: number;
}

/**
 * Récupère tous les sports depuis Supabase
 * Triés par display_order (Autre sera en dernier avec order=9999)
 */
export async function getAllSports(): Promise<Sport[]> {
  const { data, error } = await supabase
    .from('sports_reference')
    .select('id, name, category, display_order')
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching sports:', error);
    return [];
  }

  return data || [];
}

/**
 * Recherche intelligente de sports avec autocomplete
 * @param query - Texte de recherche
 * @returns Liste des sports triés par pertinence, avec "Autre" toujours en dernier
 */
export async function searchSports(query: string): Promise<string[]> {
  const allSports = await getAllSports();

  if (!query || query.length < 2) {
    // Afficher les 20 premiers + "Autre" en dernier
    const firstTwenty = allSports
      .filter(s => s.name !== 'Autre')
      .slice(0, 20)
      .map(s => s.name);

    return [...firstTwenty, 'Autre'];
  }

  const lowerQuery = query.toLowerCase().trim();
  const words = lowerQuery.split(' ');

  // Recherche avec scoring
  const results = allSports.map(sport => {
    const lowerSport = sport.name.toLowerCase();
    let score = 0;

    // "Autre" doit toujours apparaître en dernier
    if (sport.name === 'Autre') {
      return { sport: sport.name, score: -1000 };
    }

    // Match exact au début (score élevé)
    if (lowerSport.startsWith(lowerQuery)) {
      score += 100;
    }

    // Match exact n'importe où
    if (lowerSport.includes(lowerQuery)) {
      score += 50;
    }

    // Match de tous les mots
    const allWordsMatch = words.every(word => lowerSport.includes(word));
    if (allWordsMatch) {
      score += 30;
    }

    // Match partiel de mots
    words.forEach(word => {
      if (lowerSport.includes(word)) {
        score += 10;
      }
    });

    return { sport: sport.name, score };
  });

  // Filtrer les résultats avec score > 0 et trier par score décroissant
  const filtered = results
    .filter(r => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 30)
    .map(r => r.sport);

  // Toujours ajouter "Autre" à la fin
  if (!filtered.includes('Autre')) {
    filtered.push('Autre');
  }

  return filtered;
}

/**
 * Récupère tous les clubs depuis Supabase
 * Triés par display_order (Autre club sera en dernier avec order=9999)
 */
export async function getAllClubs(): Promise<Club[]> {
  const { data, error } = await supabase
    .from('clubs_reference')
    .select('id, name, sport_category, city, display_order')
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching clubs:', error);
    return [];
  }

  return data || [];
}

/**
 * Recherche intelligente de clubs avec autocomplete
 * @param query - Texte de recherche
 * @param sportFilter - Sport de l'athlète (optionnel pour prioriser)
 * @returns Liste des clubs triés par pertinence, avec "Autre club" toujours en dernier
 */
export async function searchClubs(query: string, sportFilter?: string): Promise<string[]> {
  const allClubs = await getAllClubs();

  if (!query || query.length < 2) {
    // Afficher les 30 premiers + "Autre club" en dernier
    const firstThirty = allClubs
      .filter(c => c.name !== 'Autre club')
      .slice(0, 30)
      .map(c => c.name);

    return [...firstThirty, 'Autre club'];
  }

  const lowerQuery = query.toLowerCase().trim();
  const words = lowerQuery.split(' ');

  // Recherche avec scoring
  const results = allClubs.map(club => {
    const lowerClub = club.name.toLowerCase();
    let score = 0;

    // "Autre club" doit toujours apparaître en dernier
    if (club.name === 'Autre club') {
      return { club: club.name, score: -1000 };
    }

    // Match exact au début (score très élevé)
    if (lowerClub.startsWith(lowerQuery)) {
      score += 100;
    }

    // Match exact n'importe où
    if (lowerClub.includes(lowerQuery)) {
      score += 50;
    }

    // Match de tous les mots
    const allWordsMatch = words.every(word => lowerClub.includes(word));
    if (allWordsMatch) {
      score += 30;
    }

    // Match partiel de mots
    words.forEach(word => {
      if (lowerClub.includes(word)) {
        score += 10;
      }
    });

    // Bonus pour les clubs historiques et populaires
    const popularClubs = [
      'paris saint-germain', 'olympique de marseille', 'olympique lyonnais',
      'as monaco', 'losc lille', 'stade rennais', 'stade toulousain',
      'racing 92', 'montpellier', 'toulouse', 'lyon', 'marseille'
    ];

    popularClubs.forEach(popular => {
      if (lowerClub.includes(popular)) {
        score += 5;
      }
    });

    return { club: club.name, score };
  });

  // Filtrer les résultats avec score > 0 et trier par score décroissant
  const filtered = results
    .filter(r => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 40)
    .map(r => r.club);

  // Toujours ajouter "Autre club" à la fin
  if (!filtered.includes('Autre club')) {
    filtered.push('Autre club');
  }

  return filtered;
}

// ==========================================
// GENERIC FETCH FUNCTIONS
// ==========================================

async function fetchReferenceData(tableName: string): Promise<string[]> {
  const { data, error } = await supabase
    .from(tableName)
    .select('name, display_order')
    .order('display_order', { ascending: true });

  if (error) {
    console.error(`Error fetching ${tableName}:`, error);
    return [];
  }

  return data?.map(item => item.name) || [];
}

// ==========================================
// SECTORS (Secteurs d'activité)
// ==========================================

export async function getAllSectors(): Promise<string[]> {
  return fetchReferenceData('sectors_reference');
}

export async function searchSectors(query: string): Promise<string[]> {
  const allSectors = await getAllSectors();

  if (!query || query.length < 2) {
    return allSectors;
  }

  const lowerQuery = query.toLowerCase().trim();
  return allSectors.filter(sector =>
    sector.toLowerCase().includes(lowerQuery)
  );
}

// ==========================================
// LOCATIONS (Zones géographiques)
// ==========================================

export async function getAllLocations(): Promise<string[]> {
  return fetchReferenceData('locations_reference');
}

export async function searchLocations(query: string): Promise<string[]> {
  const allLocations = await getAllLocations();

  if (!query || query.length < 2) {
    return allLocations;
  }

  const lowerQuery = query.toLowerCase().trim();
  return allLocations.filter(location =>
    location.toLowerCase().includes(lowerQuery)
  );
}

// ==========================================
// CITIES (Villes)
// ==========================================

export async function getAllCities(): Promise<string[]> {
  return fetchReferenceData('cities_reference');
}

export async function searchCities(query: string): Promise<string[]> {
  const allCities = await getAllCities();

  if (!query || query.length < 2) {
    return allCities.slice(0, 30);
  }

  const lowerQuery = query.toLowerCase().trim();
  return allCities.filter(city =>
    city.toLowerCase().includes(lowerQuery)
  );
}

// ==========================================
// SPORT LEVELS (Niveaux sportifs)
// ==========================================

export async function getAllSportLevels(): Promise<string[]> {
  return fetchReferenceData('sport_levels_reference');
}

// ==========================================
// CONTRACT TYPES (Types de contrats)
// ==========================================

export async function getAllContractTypes(): Promise<string[]> {
  return fetchReferenceData('contract_types_reference');
}

// ==========================================
// POSITION TYPES (Types de postes)
// ==========================================

export async function getAllPositionTypes(): Promise<string[]> {
  return fetchReferenceData('position_types_reference');
}

// ==========================================
// AVAILABILITY (Disponibilités)
// ==========================================

export async function getAllAvailability(): Promise<string[]> {
  return fetchReferenceData('availability_reference');
}

// ==========================================
// SITUATIONS (Situations des athlètes)
// ==========================================

export async function getAllSituations(): Promise<string[]> {
  return fetchReferenceData('situations_reference');
}

// ==========================================
// ATHLETE TYPES (Types de sportifs)
// ==========================================

export async function getAllAthleteTypes(): Promise<string[]> {
  return fetchReferenceData('athlete_types_reference');
}

// ==========================================
// COMPANY SIZES (Tailles d'entreprises)
// ==========================================

export async function getAllCompanySizes(): Promise<string[]> {
  return fetchReferenceData('company_sizes_reference');
}

// ==========================================
// SPONSORSHIP TYPES (Types de sponsoring)
// ==========================================

export async function getAllSponsorshipTypes(): Promise<string[]> {
  return fetchReferenceData('sponsorship_types_reference');
}

// ==========================================
// ATHLETE LEVELS for Sponsors
// ==========================================

export async function getAllAthleteLevels(): Promise<string[]> {
  return fetchReferenceData('athlete_levels_reference');
}

// ==========================================
// SPONSORSHIP BUDGETS
// ==========================================

export async function getAllSponsorshipBudgets(): Promise<string[]> {
  return fetchReferenceData('sponsorship_budgets_reference');
}
