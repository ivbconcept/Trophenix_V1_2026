/**
 * Onboarding Form Options
 *
 * Ce fichier centralise toutes les options des formulaires d'inscription.
 * Pour modifier ou ajouter des options :
 * 1. Modifier les tableaux ci-dessous
 * 2. Les changements seront automatiquement reflétés dans l'UI
 * 3. Aucun changement de code n'est nécessaire dans les composants
 *
 * @module constants/onboardingOptions
 */

/**
 * Options pour le formulaire athlète
 */
export const ATHLETE_OPTIONS = {
  /**
   * Liste des sports disponibles
   * Ajouter de nouveaux sports à la fin de la liste
   */
  SPORTS: [
    'Football',
    'Basketball',
    'Tennis',
    'Rugby',
    'Handball',
    'Volleyball',
    'Natation',
    'Athlétisme',
    'Cyclisme',
    'Judo',
    'Karaté',
    'Boxe',
    'Ski',
    'Snowboard',
    'Surf',
    'Voile',
    'Aviron',
    'Escrime',
    'Golf',
    'Équitation',
    'Gymnastique',
    'Danse',
    'Autre',
  ] as const,

  /**
   * Situations professionnelles des athlètes
   */
  SITUATIONS: [
    'En activité',
    'En blessure',
    'En hésitation',
    'En transition',
    'En reconversion',
    'Déjà reconverti',
  ] as const,

  /**
   * Types d'athlètes
   */
  ATHLETE_TYPES: ['Handisportif', 'Sportif valide'] as const,

  /**
   * Niveaux sportifs
   */
  SPORT_LEVELS: [
    'International',
    'National',
    'Régional',
    'Professionnel',
    'Semi-professionnel',
    'Amateur haut niveau',
  ] as const,

  /**
   * Options pour la liste ministérielle
   */
  MINISTERIAL_LIST_OPTIONS: ['Oui', 'Non'] as const,

  /**
   * Secteurs professionnels recherchés
   */
  SECTORS: [
    'Commercial / Vente',
    'Marketing / Communication',
    'Management / Direction',
    'Ressources Humaines',
    'Finance / Comptabilité',
    'Logistique / Supply Chain',
    'Conseil / Stratégie',
    'Événementiel',
    'Sport Business',
    'Éducation / Formation',
    'Santé / Bien-être',
    'Digital / Tech',
    'Entrepreneuriat',
    'Autre',
  ] as const,

  /**
   * Zones géographiques de recherche
   */
  LOCATIONS: [
    'Paris',
    'Lyon',
    'Marseille',
    'Toulouse',
    'Bordeaux',
    'Lille',
    'Nantes',
    'Strasbourg',
    'Montpellier',
    'Nice',
    'Rennes',
    'Télétravail complet',
    'Flexible / Hybride',
    'Toute la France',
    'Étranger',
  ] as const,

  /**
   * Types de postes recherchés
   */
  POSITION_TYPES: ['CDI', 'CDD', 'Stage', 'Alternance', 'Freelance', 'Création entreprise'] as const,

  /**
   * Disponibilités
   */
  AVAILABILITY: ['Immédiate', '1 mois', '3 mois', '6 mois'] as const,

  /**
   * Villes françaises principales
   */
  CITIES: [
    'Paris',
    'Lyon',
    'Marseille',
    'Toulouse',
    'Bordeaux',
    'Lille',
    'Nantes',
    'Strasbourg',
    'Montpellier',
    'Nice',
    'Rennes',
    'Reims',
    'Saint-Étienne',
    'Toulon',
    'Le Havre',
    'Grenoble',
    'Dijon',
    'Angers',
    'Nîmes',
    'Villeurbanne',
    'Clermont-Ferrand',
    'Le Mans',
    'Aix-en-Provence',
    'Brest',
    'Tours',
    'Amiens',
    'Limoges',
    'Annecy',
    'Perpignan',
    'Metz',
  ] as const,
} as const;

/**
 * Options pour le formulaire entreprise
 */
export const COMPANY_OPTIONS = {
  /**
   * Secteurs d'activité des entreprises
   */
  SECTORS: [
    'Technologie / IT',
    'Finance / Banque',
    'Conseil / Audit',
    'Retail / E-commerce',
    'Industrie / Manufacturing',
    'Santé / Pharma',
    'Énergie / Environnement',
    'Médias / Communication',
    'Tourisme / Hôtellerie',
    'Immobilier / Construction',
    'Transport / Logistique',
    'Éducation / Formation',
    'Sport Business',
    'Luxe / Mode',
    'Agroalimentaire',
    'Automobile',
    'Autre',
  ] as const,

  /**
   * Tailles d'entreprise
   */
  COMPANY_SIZES: ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'] as const,

  /**
   * Localisations des entreprises
   */
  LOCATIONS: [
    'Paris',
    'Lyon',
    'Marseille',
    'Toulouse',
    'Bordeaux',
    'Lille',
    'Nantes',
    'Strasbourg',
    'Montpellier',
    'Nice',
    'Rennes',
    'Plusieurs sites en France',
    'International',
    'Télétravail possible',
  ] as const,
} as const;
