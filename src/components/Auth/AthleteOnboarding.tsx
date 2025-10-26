import { useState, useEffect } from 'react';
import { ChevronRight, User, Trophy, Briefcase, CheckCircle, Mail } from 'lucide-react';
import { AgentElea } from '../AI/AgentElea';
import { searchSports } from '../../constants/olympicSports';
import { searchClubs } from '../../constants/frenchSportsClubs';

interface AthleteOnboardingProps {
  onComplete: (data: any) => void;
  onBack?: () => void;
  initialData?: any;
  initialStep?: number;
  onBackHandlerReady?: (handler: () => void) => void;
}


const SECTORS = [
  'Commercial / Vente', 'Marketing / Communication', 'Management / Direction',
  'Ressources Humaines', 'Finance / Comptabilité', 'Logistique / Supply Chain',
  'Conseil / Stratégie', 'Événementiel', 'Sport Business',
  'Éducation / Formation', 'Santé / Bien-être', 'Digital / Tech',
  'Entrepreneuriat', 'Autre'
];

const LOCATIONS = [
  'Paris', 'Lyon', 'Marseille', 'Toulouse', 'Bordeaux', 'Lille',
  'Nantes', 'Strasbourg', 'Montpellier', 'Nice', 'Rennes',
  'Télétravail complet', 'Flexible / Hybride', 'Toute la France', 'Étranger'
];

const CITIES = [
  'Paris', 'Lyon', 'Marseille', 'Toulouse', 'Bordeaux', 'Lille',
  'Nantes', 'Strasbourg', 'Montpellier', 'Nice', 'Rennes', 'Reims',
  'Saint-Étienne', 'Toulon', 'Le Havre', 'Grenoble', 'Dijon', 'Angers',
  'Nîmes', 'Villeurbanne', 'Clermont-Ferrand', 'Le Mans', 'Aix-en-Provence',
  'Brest', 'Tours', 'Amiens', 'Limoges', 'Annecy', 'Perpignan', 'Metz'
];

export function AthleteOnboarding({ onComplete, onBack, initialData, initialStep, onBackHandlerReady }: AthleteOnboardingProps) {
  console.log('AthleteOnboarding mounted - initialStep:', initialStep, 'initialData:', initialData);
  const [currentStep, setCurrentStep] = useState(initialStep || 1);
  const [formData, setFormData] = useState(initialData || {
    sport: '',
    situation: '',
    athlete_type: '',
    current_club: '',
    sport_level: '',
    ministerial_list: '',
    desired_field: '',
    geographic_zone: '',
    position_type: '',
    availability: '',
    first_name: '',
    last_name: '',
    birth_date: '',
    nationality: '',
    city_of_residence: '',
    email: '',
    password: '',
    password_confirm: '',
    terms_accepted: false
  });

  const [sportInput, setSportInput] = useState('');
  const [showSportSuggestions, setShowSportSuggestions] = useState(false);
  const [clubInput, setClubInput] = useState('');
  const [showClubSuggestions, setShowClubSuggestions] = useState(false);
  const [locationInput, setLocationInput] = useState('');
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [sectorInput, setSectorInput] = useState('');
  const [showSectorSuggestions, setShowSectorSuggestions] = useState(false);
  const [cityInput, setCityInput] = useState('');
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);

  const filteredSports = searchSports(sportInput);

  const filteredLocations = LOCATIONS.filter(loc =>
    loc.toLowerCase().includes(locationInput.toLowerCase())
  );

  const filteredSectors = SECTORS.filter(sector =>
    sector.toLowerCase().includes(sectorInput.toLowerCase())
  );

  const filteredCities = CITIES.filter(city =>
    city.toLowerCase().includes(cityInput.toLowerCase())
  );

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSportSelect = (sport: string) => {
    handleChange('sport', sport);
    setSportInput(sport);
    setShowSportSuggestions(false);
  };

  const filteredClubs = searchClubs(clubInput, formData.sport);

  const handleClubSelect = (club: string) => {
    handleChange('current_club', club);
    setClubInput(club);
    setShowClubSuggestions(false);
  };

  const handleLocationSelect = (location: string) => {
    handleChange('geographic_zone', location);
    setLocationInput(location);
    setShowLocationSuggestions(false);
  };

  const handleSectorSelect = (sector: string) => {
    handleChange('desired_field', sector);
    setSectorInput(sector);
    setShowSectorSuggestions(false);
  };

  const handleCitySelect = (city: string) => {
    handleChange('city_of_residence', city);
    setCityInput(city);
    setShowCitySuggestions(false);
  };

  const handleNext = () => {
    setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    if (currentStep === 1 && onBack) {
      onBack();
    } else {
      setCurrentStep(prev => prev - 1);
    }
  };

  useEffect(() => {
    if (onBackHandlerReady) {
      onBackHandlerReady(handleBack);
    }
  }, [currentStep, onBackHandlerReady]);

  const handleSubmit = () => {
    onComplete({ ...formData, _currentStep: currentStep });
  };

  const canProceedStep1 = formData.sport && formData.situation && formData.athlete_type;
  const canProceedStep2 = formData.current_club && formData.sport_level && formData.ministerial_list;
  const canProceedStep3 = formData.desired_field && formData.geographic_zone && formData.position_type && formData.availability;
  const canProceedStep4 = formData.first_name && formData.last_name && formData.birth_date && formData.nationality && formData.city_of_residence;
  const canProceedStep5 = formData.email && formData.password && formData.password_confirm && formData.password === formData.password_confirm && formData.terms_accepted;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-slate-900">
            Votre profil sportif
          </h1>
          <span className="text-sm font-medium text-slate-500">
            Étape {currentStep}/5
          </span>
        </div>

        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((step) => (
            <div
              key={step}
              className={`h-2 flex-1 rounded-full transition-colors ${
                step <= currentStep ? 'bg-gradient-to-r from-indigo-500 to-indigo-600' : 'bg-slate-200'
              }`}
            />
          ))}
        </div>
      </div>

      {currentStep === 1 && (
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-slate-100 rounded-lg">
              <Trophy className="h-6 w-6 text-slate-700" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Qui je suis comme sportif</h2>
              <p className="text-sm text-slate-600">Votre pratique sportive</p>
            </div>
          </div>

          <div className="relative">
            <input
              type="text"
              value={sportInput}
              onChange={(e) => {
                setSportInput(e.target.value);
                handleChange('sport', e.target.value);
                setShowSportSuggestions(true);
              }}
              onFocus={() => setShowSportSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSportSuggestions(false), 200)}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Sport pratiqué *"
            />
            {showSportSuggestions && filteredSports.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {filteredSports.map((sport) => (
                  <button
                    key={sport}
                    type="button"
                    onClick={() => handleSportSelect(sport)}
                    className="w-full px-4 py-2 text-left hover:bg-slate-50 transition-colors"
                  >
                    {sport}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <p className="text-sm font-medium text-slate-700 mb-3">Situation *</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                'En activité',
                'En blessure',
                'En hésitation',
                'En transition',
                'En reconversion',
                'Déjà reconverti'
              ].map((situation) => (
                <button
                  key={situation}
                  type="button"
                  onClick={() => handleChange('situation', situation)}
                  className={`px-4 py-3 border-2 rounded-lg transition-all text-sm ${
                    formData.situation === situation
                      ? 'border-indigo-600 bg-indigo-600 text-white'
                      : 'border-slate-200 hover:border-indigo-300'
                  }`}
                >
                  {situation}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-slate-700 mb-3">Type de sportif *</p>
            <div className="grid grid-cols-2 gap-3">
              {['Handisportif', 'Sportif valide'].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleChange('athlete_type', type)}
                  className={`px-4 py-3 border-2 rounded-lg transition-all ${
                    formData.athlete_type === type
                      ? 'border-indigo-600 bg-indigo-600 text-white'
                      : 'border-slate-200 hover:border-indigo-300'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleNext}
            disabled={!canProceedStep1}
            className="w-full py-4 bg-slate-900 text-white rounded-lg hover:bg-slate-800 font-semibold text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            Continuer
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}

      {currentStep === 2 && (
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-slate-100 rounded-lg">
              <Trophy className="h-6 w-6 text-slate-700" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Mon parcours</h2>
              <p className="text-sm text-slate-600">Votre expérience sportive</p>
            </div>
          </div>

          <div className="relative">
            <input
              type="text"
              value={clubInput}
              onChange={(e) => {
                setClubInput(e.target.value);
                handleChange('current_club', e.target.value);
                setShowClubSuggestions(true);
              }}
              onFocus={() => setShowClubSuggestions(true)}
              onBlur={() => setTimeout(() => setShowClubSuggestions(false), 200)}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Club actuel ou dernier *"
            />
            {showClubSuggestions && filteredClubs.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {filteredClubs.map((club) => (
                  <button
                    key={club}
                    type="button"
                    onClick={() => handleClubSelect(club)}
                    className="w-full px-4 py-2 text-left hover:bg-slate-50 transition-colors text-sm"
                  >
                    {club}
                  </button>
                ))}
              </div>
            )}
          </div>
          <p className="text-sm text-slate-500 mt-2">
            {formData.sport
              ? `Recherche intelligente parmi les clubs de ${formData.sport} en France`
              : 'Plus de 500 clubs professionnels et amateurs en France'}
          </p>

          <div>
            <p className="text-sm font-medium text-slate-700 mb-3">Niveau *</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {['International', 'National', 'Régional', 'Professionnel', 'Semi-professionnel', 'Amateur haut niveau'].map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => handleChange('sport_level', level)}
                  className={`px-4 py-3 border-2 rounded-lg transition-all text-sm ${
                    formData.sport_level === level
                      ? 'border-indigo-600 bg-indigo-600 text-white'
                      : 'border-slate-200 hover:border-indigo-300'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-slate-700 mb-3">Liste ministérielle *</p>
            <div className="grid grid-cols-2 gap-3">
              {['Oui', 'Non'].map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => handleChange('ministerial_list', option)}
                  className={`px-4 py-3 border-2 rounded-lg transition-all ${
                    formData.ministerial_list === option
                      ? 'border-indigo-600 bg-indigo-600 text-white'
                      : 'border-slate-200 hover:border-indigo-300'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleNext}
            disabled={!canProceedStep2}
            className="w-full py-4 bg-slate-900 text-white rounded-lg hover:bg-slate-800 font-semibold text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            Continuer
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}

      {currentStep === 3 && (
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-slate-100 rounded-lg">
              <Briefcase className="h-6 w-6 text-slate-700" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Mon projet professionnel</h2>
              <p className="text-sm text-slate-600">Définissez vos objectifs</p>
            </div>
          </div>

          <div className="relative">
            <input
              type="text"
              value={sectorInput}
              onChange={(e) => {
                setSectorInput(e.target.value);
                handleChange('desired_field', e.target.value);
                setShowSectorSuggestions(true);
              }}
              onFocus={() => setShowSectorSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSectorSuggestions(false), 200)}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Domaine professionnel souhaité *"
            />
            {showSectorSuggestions && filteredSectors.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {filteredSectors.map((sector) => (
                  <button
                    key={sector}
                    type="button"
                    onClick={() => handleSectorSelect(sector)}
                    className="w-full px-4 py-2 text-left hover:bg-slate-50 transition-colors"
                  >
                    {sector}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="relative">
            <input
              type="text"
              value={locationInput}
              onChange={(e) => {
                setLocationInput(e.target.value);
                handleChange('geographic_zone', e.target.value);
                setShowLocationSuggestions(true);
              }}
              onFocus={() => setShowLocationSuggestions(true)}
              onBlur={() => setTimeout(() => setShowLocationSuggestions(false), 200)}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Zone géographique souhaitée *"
            />
            {showLocationSuggestions && filteredLocations.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {filteredLocations.map((location) => (
                  <button
                    key={location}
                    type="button"
                    onClick={() => handleLocationSelect(location)}
                    className="w-full px-4 py-2 text-left hover:bg-slate-50 transition-colors"
                  >
                    {location}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <p className="text-sm font-medium text-slate-700 mb-3">Type de poste recherché *</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {['CDI', 'CDD', 'Stage', 'Alternance', 'Freelance', 'Création entreprise'].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleChange('position_type', type)}
                  className={`px-4 py-3 border-2 rounded-lg transition-all text-sm ${
                    formData.position_type === type
                      ? 'border-indigo-600 bg-indigo-600 text-white'
                      : 'border-slate-200 hover:border-indigo-300'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-slate-700 mb-3">Disponibilité *</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {['Immédiate', '1 mois', '3 mois', '6 mois'].map((avail) => (
                <button
                  key={avail}
                  type="button"
                  onClick={() => handleChange('availability', avail)}
                  className={`px-4 py-3 border-2 rounded-lg transition-all ${
                    formData.availability === avail
                      ? 'border-indigo-600 bg-indigo-600 text-white'
                      : 'border-slate-200 hover:border-indigo-300'
                  }`}
                >
                  {avail}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleNext}
            disabled={!canProceedStep3}
            className="w-full py-4 bg-slate-900 text-white rounded-lg hover:bg-slate-800 font-semibold text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            Continuer
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}

      {currentStep === 4 && (
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-slate-100 rounded-lg">
              <User className="h-6 w-6 text-slate-700" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Mon éligibilité</h2>
              <p className="text-sm text-slate-600">Informations personnelles</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <input
              type="text"
              value={formData.first_name}
              onChange={(e) => handleChange('first_name', e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Prénom *"
            />

            <input
              type="text"
              value={formData.last_name}
              onChange={(e) => handleChange('last_name', e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Nom *"
            />
          </div>

          <div>
            <label htmlFor="birth_date" className="block text-sm font-medium text-slate-700 mb-2">
              Date de naissance *
            </label>
            <input
              id="birth_date"
              type="date"
              value={formData.birth_date}
              onChange={(e) => handleChange('birth_date', e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="nationality" className="block text-sm font-medium text-slate-700 mb-2">
              Nationalité *
            </label>
            <input
              id="nationality"
              type="text"
              value={formData.nationality}
              onChange={(e) => handleChange('nationality', e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Ex: Française"
            />
          </div>

          <div>
            <label htmlFor="city_of_residence" className="block text-sm font-medium text-slate-700 mb-2">
              Ville de résidence *
            </label>
            <div className="relative">
              <input
                id="city_of_residence"
                type="text"
                value={cityInput}
                onChange={(e) => {
                  setCityInput(e.target.value);
                  handleChange('city_of_residence', e.target.value);
                  setShowCitySuggestions(true);
                }}
                onFocus={() => setShowCitySuggestions(true)}
                onBlur={() => setTimeout(() => setShowCitySuggestions(false), 200)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Ex: Paris"
              />
              {showCitySuggestions && filteredCities.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {filteredCities.map((city) => (
                    <button
                      key={city}
                      type="button"
                      onClick={() => handleCitySelect(city)}
                      className="w-full px-4 py-2 text-left hover:bg-slate-50 transition-colors"
                    >
                      {city}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <button
            onClick={handleNext}
            disabled={!canProceedStep4}
            className="w-full py-4 bg-slate-900 text-white rounded-lg hover:bg-slate-800 font-semibold text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            Continuer
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}

      {currentStep === 5 && (
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-slate-100 rounded-lg">
              <Mail className="h-6 w-6 text-slate-700" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Mon compte</h2>
              <p className="text-sm text-slate-600">Créez vos identifiants</p>
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
              Email *
            </label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="votre@email.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
              Mot de passe *
            </label>
            <input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label htmlFor="password_confirm" className="block text-sm font-medium text-slate-700 mb-2">
              Confirmation du mot de passe *
            </label>
            <input
              id="password_confirm"
              type="password"
              value={formData.password_confirm}
              onChange={(e) => handleChange('password_confirm', e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="••••••••"
            />
            {formData.password_confirm && formData.password !== formData.password_confirm && (
              <p className="text-sm text-red-600 mt-2">Les mots de passe ne correspondent pas</p>
            )}
          </div>

          <div className="border-t border-slate-200 pt-6">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.terms_accepted}
                onChange={(e) => handleChange('terms_accepted', e.target.checked)}
                className="mt-1 h-5 w-5 border-slate-300 rounded focus:ring-2 focus:ring-indigo-500"
              />
              <span className="text-sm text-slate-600">
                J'accepte les conditions d'utilisation et la politique de confidentialité de Trophenix *
              </span>
            </label>
          </div>

          <button
            onClick={handleSubmit}
            disabled={!canProceedStep5}
            className="w-full py-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            Créer mon compte
            <CheckCircle className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Agent Elea - Assistant IA contextuel */}
      <AgentElea
        context={{
          page: 'onboarding_athlete',
          step: currentStep,
          userType: 'athlete',
          formData: formData,
        }}
        position="bottom-right"
      />
    </div>
  );
}
