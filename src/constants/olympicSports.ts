/**
 * Liste exhaustive des sports olympiques
 * Basée sur les Jeux Olympiques d'été et d'hiver (Paris 2024 et Milano-Cortina 2026)
 *
 * Organisation par catégories pour l'autocomplete intelligent
 */

export const OLYMPIC_SPORTS_SUMMER = [
  // Sports collectifs
  'Football',
  'Basketball',
  'Basketball 3x3',
  'Volleyball',
  'Beach-volley',
  'Handball',
  'Rugby à 7',
  'Hockey sur gazon',
  'Water-polo',

  // Sports de raquette
  'Tennis',
  'Tennis de table',
  'Badminton',

  // Sports de combat
  'Boxe',
  'Judo',
  'Karaté',
  'Taekwondo',
  'Lutte libre',
  'Lutte gréco-romaine',
  'Escrime',

  // Athlétisme et courses
  'Athlétisme',
  'Marathon',
  'Marche athlétique',

  // Sports aquatiques
  'Natation',
  'Natation artistique',
  'Plongeon',
  'Water-polo',
  'Nage en eau libre',

  // Sports nautiques
  'Aviron',
  'Canoë-kayak',
  'Voile',
  'Surf',

  // Cyclisme
  'Cyclisme sur route',
  'Cyclisme sur piste',
  'VTT',
  'BMX freestyle',
  'BMX racing',

  // Gymnastique
  'Gymnastique artistique',
  'Gymnastique rythmique',
  'Trampoline',

  // Sports équestres
  'Équitation - Dressage',
  'Équitation - Saut d\'obstacles',
  'Équitation - Concours complet',

  // Sports de précision
  'Tir à l\'arc',
  'Tir sportif',
  'Golf',

  // Sports modernes
  'Breaking',
  'Skateboard',
  'Escalade sportive',
  'Triathlon',
  'Pentathlon moderne',

  // Haltérophilie
  'Haltérophilie',
];

export const OLYMPIC_SPORTS_WINTER = [
  // Sports de glace
  'Patinage artistique',
  'Patinage de vitesse',
  'Short-track',
  'Hockey sur glace',
  'Curling',

  // Ski alpin
  'Ski alpin - Descente',
  'Ski alpin - Slalom',
  'Ski alpin - Slalom géant',
  'Ski alpin - Super-G',
  'Ski alpin - Combiné',

  // Ski nordique
  'Ski de fond',
  'Biathlon',
  'Combiné nordique',
  'Saut à ski',

  // Ski freestyle et snowboard
  'Ski freestyle',
  'Ski halfpipe',
  'Snowboard',
  'Snowboard cross',
  'Snowboard halfpipe',

  // Sports de glisse
  'Bobsleigh',
  'Skeleton',
  'Luge',
];

export const PARALYMPIC_SPORTS = [
  'Athlétisme handisport',
  'Natation handisport',
  'Basketball fauteuil',
  'Rugby fauteuil',
  'Tennis fauteuil',
  'Tennis de table handisport',
  'Escrime fauteuil',
  'Para-athlétisme',
  'Para-cyclisme',
  'Para-équitation',
  'Para-aviron',
  'Para-canoë',
  'Para-judo',
  'Para-powerlifting',
  'Para-taekwondo',
  'Para-tir à l\'arc',
  'Para-triathlon',
  'Boccia',
  'Goalball',
  'Cécifoot',
  'Torball',
  'Handbike',
  'Para-ski alpin',
  'Para-ski nordique',
  'Para-snowboard',
  'Para-hockey sur glace',
  'Curling fauteuil',
];

export const OTHER_POPULAR_SPORTS = [
  // Sports non-olympiques populaires
  'Futsal',
  'Beach soccer',
  'Volleyball en salle',
  'Handball de plage',
  'Rugby à XV',
  'Football américain',
  'Baseball',
  'Softball',
  'Cricket',

  // Sports de combat
  'MMA',
  'Kick-boxing',
  'Muay Thaï',
  'Jiu-jitsu brésilien',
  'Krav maga',
  'Capoeira',
  'Aïkido',
  'Kung-fu',
  'Sambo',

  // Sports nautiques
  'Planche à voile',
  'Kitesurf',
  'Stand-up paddle',
  'Jet-ski',
  'Ski nautique',
  'Wakeboard',
  'Rafting',
  'Canyoning',
  'Kayak de mer',
  'Plongée sous-marine',
  'Apnée',

  // Sports de montagne
  'Alpinisme',
  'Randonnée',
  'Trail running',
  'Via ferrata',
  'Parapente',
  'Deltaplane',

  // Sports mécaniques
  'Karting',
  'Formule 1',
  'Rallye',
  'Moto GP',
  'Motocross',
  'Enduro',
  'Trial',

  // Sports urbains
  'Parkour',
  'Roller',
  'Trottinette freestyle',
  'Street workout',

  // Sports de raquette
  'Squash',
  'Padel',
  'Racquetball',
  'Pickleball',

  // Sports collectifs
  'Ultimate frisbee',
  'Tchoukball',
  'Kin-ball',
  'Dodgeball',

  // Danse et fitness
  'Danse sportive',
  'Pole dance',
  'CrossFit',
  'Fitness',
  'Musculation',
  'Yoga',
  'Pilates',
  'Zumba',

  // Sports équestres
  'Équitation western',
  'Endurance équestre',
  'Polo',
  'Horse-ball',

  // Tir
  'Tir à la cible',
  'Ball-trap',
  'Biathlon d\'été',

  // Sports divers
  'Pétanque',
  'Bowling',
  'Billard',
  'Fléchettes',
  'E-sport',
  'Échecs',
  'Bridge',
];

// Liste complète pour l'autocomplete
export const ALL_SPORTS = [
  ...OLYMPIC_SPORTS_SUMMER,
  ...OLYMPIC_SPORTS_WINTER,
  ...PARALYMPIC_SPORTS,
  ...OTHER_POPULAR_SPORTS,
].sort((a, b) => a.localeCompare(b, 'fr'));

// Catégories pour l'affichage organisé
export const SPORTS_CATEGORIES = {
  'Sports olympiques d\'été': OLYMPIC_SPORTS_SUMMER,
  'Sports olympiques d\'hiver': OLYMPIC_SPORTS_WINTER,
  'Handisport / Paralympiques': PARALYMPIC_SPORTS,
  'Autres sports': OTHER_POPULAR_SPORTS,
};

// Recherche intelligente avec correspondances multiples
export function searchSports(query: string): string[] {
  if (!query || query.length < 2) {
    return ALL_SPORTS.slice(0, 20); // Afficher les 20 premiers par défaut
  }

  const lowerQuery = query.toLowerCase().trim();
  const words = lowerQuery.split(' ');

  // Recherche avec scoring
  const results = ALL_SPORTS.map(sport => {
    const lowerSport = sport.toLowerCase();
    let score = 0;

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

    return { sport, score };
  });

  // Filtrer les résultats avec score > 0 et trier par score décroissant
  return results
    .filter(r => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 30) // Limiter à 30 résultats
    .map(r => r.sport);
}
