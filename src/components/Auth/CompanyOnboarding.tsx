import { useState, useEffect } from 'react';
import { ChevronRight, Building2, MapPin, FileText, Mail, CheckCircle } from 'lucide-react';
import { AgentElea } from '../AI/AgentElea';
import { searchSectors, searchLocations, getAllCompanySizes } from '../../services/referenceDataService';

interface CompanyOnboardingProps {
  onComplete: (data: any) => void;
  onBack?: () => void;
  initialData?: any;
  initialStep?: number;
  onBackHandlerReady?: (handler: () => void) => void;
}


export function CompanyOnboarding({ onComplete, onBack, initialData, initialStep, onBackHandlerReady }: CompanyOnboardingProps) {
  const [currentStep, setCurrentStep] = useState(initialStep || 1);
  const [formData, setFormData] = useState(initialData || {
    company_name: '',
    logo_url: '',
    sector: '',
    company_size: '',
    location: '',
    hr_contact: '',
    description: '',
    email: '',
    password: '',
    password_confirm: '',
    terms_accepted: false
  });

  const [sectorInput, setSectorInput] = useState('');
  const [showSectorSuggestions, setShowSectorSuggestions] = useState(false);
  const [locationInput, setLocationInput] = useState('');
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [filteredSectors, setFilteredSectors] = useState<string[]>([]);
  const [filteredLocations, setFilteredLocations] = useState<string[]>([]);
  const [companySizes, setCompanySizes] = useState<string[]>([]);

  // Charger les secteurs
  useEffect(() => {
    const loadSectors = async () => {
      const sectors = await searchSectors(sectorInput);
      setFilteredSectors(sectors);
    };
    loadSectors();
  }, [sectorInput]);

  // Charger les locations
  useEffect(() => {
    const loadLocations = async () => {
      const locations = await searchLocations(locationInput);
      setFilteredLocations(locations);
    };
    loadLocations();
  }, [locationInput]);

  // Charger les tailles d'entreprise au montage
  useEffect(() => {
    const loadCompanySizes = async () => {
      const sizes = await getAllCompanySizes();
      setCompanySizes(sizes);
    };
    loadCompanySizes();
  }, []);

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSectorSelect = (sector: string) => {
    handleChange('sector', sector);
    setSectorInput(sector);
    setShowSectorSuggestions(false);
  };

  const handleLocationSelect = (location: string) => {
    handleChange('location', location);
    setLocationInput(location);
    setShowLocationSuggestions(false);
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

  const canProceedStep1 = formData.company_name && formData.sector;
  const canProceedStep2 = formData.company_size && formData.location && formData.hr_contact;
  const canProceedStep3 = true;
  const canProceedStep4 = formData.email && formData.password && formData.password_confirm && formData.password === formData.password_confirm && formData.terms_accepted;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-slate-900">
            Votre profil professionnel
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
              <Building2 className="h-6 w-6 text-slate-700" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Informations générales</h2>
              <p className="text-sm text-slate-600">Présentez votre structure</p>
            </div>
          </div>

          <input
            type="text"
            value={formData.company_name}
            onChange={(e) => handleChange('company_name', e.target.value)}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
            placeholder="Nom de la structure *"
          />

          <div className="relative">
            <input
              type="text"
              value={sectorInput}
              onChange={(e) => {
                setSectorInput(e.target.value);
                handleChange('sector', e.target.value);
                setShowSectorSuggestions(true);
              }}
              onFocus={() => setShowSectorSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSectorSuggestions(false), 200)}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
              <MapPin className="h-6 w-6 text-slate-700" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Localisation et taille</h2>
              <p className="text-sm text-slate-600">Détails de votre structure</p>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-slate-700 mb-3">Taille de la structure *</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {companySizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => handleChange('company_size', size)}
                  className={`px-4 py-3 border-2 rounded-lg transition-all ${
                    formData.company_size === size
                      ? 'border-indigo-600 bg-indigo-600 text-white'
                      : 'border-slate-200 hover:border-indigo-300'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="relative">
            <input
              type="text"
              value={locationInput}
              onChange={(e) => {
                setLocationInput(e.target.value);
                handleChange('location', e.target.value);
                setShowLocationSuggestions(true);
              }}
              onFocus={() => setShowLocationSuggestions(true)}
              onBlur={() => setTimeout(() => setShowLocationSuggestions(false), 200)}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Localisation *"
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

          <input
            type="email"
            value={formData.hr_contact}
            onChange={(e) => handleChange('hr_contact', e.target.value)}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
            placeholder="Email contact RH *"
          />

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
              <FileText className="h-6 w-6 text-slate-700" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Description</h2>
              <p className="text-sm text-slate-600">Décrivez votre structure (optionnel)</p>
            </div>
          </div>

          <div>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={6}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Présentation de votre structure (optionnel)"
            />
            <p className="mt-2 text-sm text-slate-500">
              Décrivez votre activité, vos valeurs et ce qui vous différencie
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
            disabled={!canProceedStep4}
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
          page: 'onboarding_company',
          step: currentStep,
          userType: 'company',
          formData: formData,
        }}
        position="bottom-right"
      />
    </div>
  );
}
