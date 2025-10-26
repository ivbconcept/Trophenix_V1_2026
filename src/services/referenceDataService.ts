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
