import { useState, useEffect } from 'react';
import { ChevronRight, Handshake, DollarSign, Target, Mail, CheckCircle } from 'lucide-react';
import { AgentElea } from '../AI/AgentElea';

interface SponsorOnboardingProps {
  onComplete: (data: any) => void;
  onBack?: () => void;
  initialData?: any;
  initialStep?: number;
  onBackHandlerReady?: (handler: () => void) => void;
}

const INDUSTRY_SECTORS = [
  'Équipement sportif', 'Technologie / IT', 'Finance / Banque', 'Retail / E-commerce',
  'Énergie / Environnement', 'Médias / Communication', 'Luxe / Mode',
  'Automobile', 'Agroalimentaire', 'Pharma / Santé', 'Autre'
];

const SPONSORSHIP_TYPES = [
  'Financier', 'Équipement', 'Formation', 'Événements', 'Couverture médiatique', 'Déplacements', 'Autre'
];

const SPORTS_LIST = [
  'Football', 'Basketball', 'Tennis', 'Rugby', 'Handball', 'Volleyball',
  'Athlétisme', 'Natation', 'Cyclisme', 'Arts martiaux', 'Gymnastique',
  'Sports d\'hiver', 'Sports nautiques', 'Sports extrêmes', 'Tous sports'
];

const ATHLETE_LEVELS = [
  'Amateur', 'Régional', 'National', 'Professionnel', 'Élite', 'Olympique'
];

const BUDGET_RANGES = [
  '< 10k EUR', '10k-50k EUR', '50k-100k EUR', '100k-200k EUR', '200k-500k EUR', '500k+ EUR'
];

export function SponsorOnboarding({ onComplete, onBack, initialData, initialStep, onBackHandlerReady }: SponsorOnboardingProps) {
  const [currentStep, setCurrentStep] = useState(initialStep || 1);
  const [formData, setFormData] = useState(initialData || {
    company_name: '',
    industry_sector: '',
    website: '',
    sponsorship_budget: '',
    sponsorship_types: [] as string[],
    target_sports: [] as string[],
    target_athlete_level: [] as string[],
    description: '',
    sponsorship_criteria: '',
    contact_person: '',
    contact_email: '',
    contact_phone: '',
    email: '',
    password: '',
    password_confirm: '',
    terms_accepted: false
  });

  const [sectorInput, setSectorInput] = useState('');
  const [showSectorSuggestions, setShowSectorSuggestions] = useState(false);

  const filteredSectors = INDUSTRY_SECTORS.filter(sector =>
    sector.toLowerCase().includes(sectorInput.toLowerCase())
  );

  const handleChange = (field: string, value: string | boolean | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSectorSelect = (sector: string) => {
    handleChange('industry_sector', sector);
    setSectorInput(sector);
    setShowSectorSuggestions(false);
  };

  const toggleArrayItem = (field: 'sponsorship_types' | 'target_sports' | 'target_athlete_level', item: string) => {
    const currentArray = formData[field] as string[];
    const newArray = currentArray.includes(item)
      ? currentArray.filter(i => i !== item)
      : [...currentArray, item];
    handleChange(field, newArray);
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

  const canProceedStep1 = formData.company_name && formData.industry_sector;
  const canProceedStep2 = formData.sponsorship_budget && formData.sponsorship_types.length > 0 && formData.target_sports.length > 0 && formData.target_athlete_level.length > 0;
  const canProceedStep3 = true;
  const canProceedStep4 = formData.contact_person && formData.contact_email && formData.email && formData.password && formData.password_confirm && formData.password === formData.password_confirm && formData.terms_accepted;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-slate-900">
            Votre profil sponsor
          </h1>
          <span className="text-sm font-medium text-slate-500">
            Étape {currentStep}/4
          </span>
        </div>

        <div className="flex gap-2">
          {[1, 2, 3, 4].map((step) => (
            <div
              key={step}
              className={`h-2 flex-1 rounded-full transition-colors ${
                step <= currentStep ? 'bg-gradient-to-r from-amber-400 to-amber-500' : 'bg-slate-200'
              }`}
            />
          ))}
        </div>
      </div>

      {currentStep === 1 && (
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-slate-100 rounded-lg">
              <Handshake className="h-6 w-6 text-slate-700" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Informations générales</h2>
              <p className="text-sm text-slate-600">Présentez votre organisation</p>
            </div>
          </div>

          <input
            type="text"
            value={formData.company_name}
            onChange={(e) => handleChange('company_name', e.target.value)}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            placeholder="Nom de l'organisation *"
          />

          <div className="relative">
            <input
              type="text"
              value={sectorInput}
              onChange={(e) => {
                setSectorInput(e.target.value);
                handleChange('industry_sector', e.target.value);
                setShowSectorSuggestions(true);
              }}
              onFocus={() => setShowSectorSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSectorSuggestions(false), 200)}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="Secteur d'activité *"
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

          <input
            type="url"
            value={formData.website}
            onChange={(e) => handleChange('website', e.target.value)}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            placeholder="Site web (optionnel)"
          />

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
              <DollarSign className="h-6 w-6 text-slate-700" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Détails du sponsoring</h2>
              <p className="text-sm text-slate-600">Définissez vos critères de sponsoring</p>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-slate-700 mb-3">Budget de sponsoring *</p>
            <div className="grid grid-cols-2 gap-3">
              {BUDGET_RANGES.map((budget) => (
                <button
                  key={budget}
                  type="button"
                  onClick={() => handleChange('sponsorship_budget', budget)}
                  className={`px-4 py-3 border-2 rounded-lg transition-all text-sm ${
                    formData.sponsorship_budget === budget
                      ? 'border-amber-500 bg-amber-500 text-white'
                      : 'border-slate-200 hover:border-amber-300'
                  }`}
                >
                  {budget}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-slate-700 mb-3">Types de sponsoring * (plusieurs choix possibles)</p>
            <div className="grid grid-cols-2 gap-3">
              {SPONSORSHIP_TYPES.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => toggleArrayItem('sponsorship_types', type)}
                  className={`px-4 py-3 border-2 rounded-lg transition-all text-sm ${
                    formData.sponsorship_types.includes(type)
                      ? 'border-amber-500 bg-amber-500 text-white'
                      : 'border-slate-200 hover:border-amber-300'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-slate-700 mb-3">Sports ciblés * (plusieurs choix possibles)</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {SPORTS_LIST.map((sport) => (
                <button
                  key={sport}
                  type="button"
                  onClick={() => toggleArrayItem('target_sports', sport)}
                  className={`px-3 py-2 border-2 rounded-lg transition-all text-sm ${
                    formData.target_sports.includes(sport)
                      ? 'border-amber-500 bg-amber-500 text-white'
                      : 'border-slate-200 hover:border-amber-300'
                  }`}
                >
                  {sport}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-slate-700 mb-3">Niveau des athlètes * (plusieurs choix possibles)</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {ATHLETE_LEVELS.map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => toggleArrayItem('target_athlete_level', level)}
                  className={`px-4 py-3 border-2 rounded-lg transition-all text-sm ${
                    formData.target_athlete_level.includes(level)
                      ? 'border-amber-500 bg-amber-500 text-white'
                      : 'border-slate-200 hover:border-amber-300'
                  }`}
                >
                  {level}
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
              <Target className="h-6 w-6 text-slate-700" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Description et critères</h2>
              <p className="text-sm text-slate-600">Décrivez vos objectifs (optionnel)</p>
            </div>
          </div>

          <div>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="Description de votre organisation et de vos objectifs de sponsoring"
            />
            <p className="mt-2 text-sm text-slate-500">
              Présentez votre organisation, vos valeurs et pourquoi vous souhaitez sponsoriser des athlètes
            </p>
          </div>

          <div>
            <textarea
              value={formData.sponsorship_criteria}
              onChange={(e) => handleChange('sponsorship_criteria', e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="Critères de sélection des athlètes"
            />
            <p className="mt-2 text-sm text-slate-500">
              Quels sont les critères importants pour vous ? (résultats sportifs, valeurs, visibilité médiatique, etc.)
            </p>
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
              <Mail className="h-6 w-6 text-slate-700" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Contact et compte</h2>
              <p className="text-sm text-slate-600">Informations de contact et identifiants</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="contact_person" className="block text-sm font-medium text-slate-700 mb-2">
                Nom du contact *
              </label>
              <input
                id="contact_person"
                type="text"
                value={formData.contact_person}
                onChange={(e) => handleChange('contact_person', e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                placeholder="Jean Dupont"
              />
            </div>

            <div>
              <label htmlFor="contact_phone" className="block text-sm font-medium text-slate-700 mb-2">
                Téléphone
              </label>
              <input
                id="contact_phone"
                type="tel"
                value={formData.contact_phone}
                onChange={(e) => handleChange('contact_phone', e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                placeholder="+33 6 12 34 56 78"
              />
            </div>
          </div>

          <div>
            <label htmlFor="contact_email" className="block text-sm font-medium text-slate-700 mb-2">
              Email de contact *
            </label>
            <input
              id="contact_email"
              type="email"
              value={formData.contact_email}
              onChange={(e) => handleChange('contact_email', e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="contact@entreprise.com"
            />
          </div>

          <div className="border-t border-slate-200 pt-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Identifiants de connexion</h3>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                Email de connexion *
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                placeholder="votre@email.com"
              />
            </div>

            <div className="mt-4">
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                Mot de passe *
              </label>
              <input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                placeholder="••••••••"
              />
            </div>

            <div className="mt-4">
              <label htmlFor="password_confirm" className="block text-sm font-medium text-slate-700 mb-2">
                Confirmation du mot de passe *
              </label>
              <input
                id="password_confirm"
                type="password"
                value={formData.password_confirm}
                onChange={(e) => handleChange('password_confirm', e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                placeholder="••••••••"
              />
              {formData.password_confirm && formData.password !== formData.password_confirm && (
                <p className="text-sm text-red-600 mt-2">Les mots de passe ne correspondent pas</p>
              )}
            </div>
          </div>

          <div className="border-t border-slate-200 pt-6">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.terms_accepted}
                onChange={(e) => handleChange('terms_accepted', e.target.checked)}
                className="mt-1 h-5 w-5 border-slate-300 rounded focus:ring-2 focus:ring-amber-500"
              />
              <span className="text-sm text-slate-600">
                J'accepte les conditions d'utilisation et la politique de confidentialité de Trophenix *
              </span>
            </label>
          </div>

          <button
            onClick={handleSubmit}
            disabled={!canProceedStep4}
            className="w-full py-4 bg-amber-500 text-white rounded-lg hover:bg-amber-600 font-semibold text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            Créer mon compte
            <CheckCircle className="h-5 w-5" />
          </button>
        </div>
      )}

      <AgentElea
        context={{
          page: 'onboarding_sponsor',
          step: currentStep,
          userType: 'sponsor',
          formData: formData,
        }}
        position="bottom-right"
      />
    </div>
  );
}
