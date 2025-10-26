import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { ArrowLeft, AlertCircle, Trophy, Briefcase, Handshake } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { UserType } from '../../types';
import { AthleteOnboarding } from './AthleteOnboarding';
import { CompanyOnboarding } from './CompanyOnboarding';
import { SponsorOnboarding } from './SponsorOnboarding';
import { AuthCarousel } from './AuthCarousel';
import { EmailVerification } from './EmailVerification';
import { EmailConfirmationPending } from './EmailConfirmationPending';

interface SignUpFlowProps {
  onBack: () => void;
  onSuccess: (userType: 'athlete' | 'company' | 'sponsor') => void;
}

export function SignUpFlow({ onBack, onSuccess }: SignUpFlowProps) {
  const [step, setStep] = useState<'profile-type' | 'onboarding' | 'verification' | 'confirmation-pending'>('profile-type');
  const [selectedUserType, setSelectedUserType] = useState<UserType | null>(null);
  const [onboardingData, setOnboardingData] = useState<any>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp, signIn } = useAuth();

  const handleProfileTypeSelect = (userType: UserType) => {
    setSelectedUserType(userType);
    setStep('onboarding');
  };

  const handleOnboardingComplete = async (data: any) => {
    setOnboardingData(data);
    setError('');
    setLoading(true);

    try {
      const { email, password, password_confirm, terms_accepted, _currentStep, ...profileData } = data;

      // Préparer les métadonnées qui seront stockées et utilisées après confirmation
      const metadata = {
        user_type: selectedUserType,
        profile_data: profileData,
      };

      console.log('🚀 SignUp - User type:', selectedUserType);
      console.log('📦 SignUp - Metadata to send:', metadata);
      console.log('👤 SignUp - Profile data:', profileData);

      // Créer le compte avec les métadonnées
      const { error: signUpError } = await signUp(email, password, metadata);

      if (signUpError) {
        if (signUpError.message && signUpError.message.includes('already registered')) {
          setError('Cet email est déjà utilisé');
        } else {
          setError('Une erreur est survenue lors de la création du compte');
        }
        setLoading(false);
        return;
      }

      // Afficher l'écran de confirmation (ou rediriger si auto-confirm)
      setLoading(false);
      setStep('confirmation-pending');
    } catch (err: any) {
      console.error('Error during sign up:', err);
      setError(err.message || 'Une erreur est survenue');
      setLoading(false);
    }
  };

  const handleEmailVerified = async () => {
    setError('');
    setLoading(true);

    try {
      const { email, password, password_confirm, terms_accepted, _currentStep, ...profileData } = onboardingData;

      // Préparer les métadonnées qui seront stockées et utilisées après confirmation
      const metadata = {
        user_type: selectedUserType,
        profile_data: profileData,
      };

      // L'inscription envoie automatiquement un email de confirmation
      // Les métadonnées seront accessibles dans le webhook après confirmation
      const { error: signUpError } = await signUp(email, password, metadata);

      if (signUpError) {
        if (signUpError.message.includes('already registered')) {
          setError('Cet email est déjà utilisé');
        } else {
          setError('Une erreur est survenue lors de la création du compte');
        }
        setLoading(false);
        return;
      }

      // Afficher l'écran de confirmation
      setLoading(false);
      setStep('confirmation-pending');
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue');
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    console.log('Resending verification code...');
  };

  const [onboardingBackHandler, setOnboardingBackHandler] = useState<(() => void) | null>(null);

  const handleBack = () => {
    console.log('handleBack called - current step:', step, 'onboardingData:', onboardingData);
    if (step === 'onboarding' && onboardingBackHandler) {
      onboardingBackHandler();
    } else if (step === 'verification') {
      console.log('Going back from verification to onboarding');
      setStep('onboarding');
    } else {
      onBack();
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      <div className="hidden lg:block lg:w-1/2">
        <AuthCarousel />
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center py-12">
        <div className="max-w-2xl w-full px-6">
          <div className="flex items-center mb-8">
            <button
              onClick={handleBack}
              className="flex items-center text-indigo-600 hover:text-indigo-700 transition-colors text-lg font-medium"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Retour
            </button>
          </div>

        {step === 'profile-type' && (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-10 max-w-xl mx-auto">
            <h1 className="text-4xl font-bold text-slate-900 mb-3">
              Bienvenue chez Trophenix !
            </h1>
            <p className="text-slate-600 mb-8 text-lg">
              Étape 1/3 : Choisissez votre type de compte
            </p>

            <div className="space-y-4">
              <button
                onClick={() => handleProfileTypeSelect('athlete')}
                className="w-full p-6 bg-slate-50 border border-slate-200 rounded-2xl hover:bg-slate-100 hover:border-slate-300 transition-all text-left"
              >
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-gradient-to-br from-teal-400 to-teal-500 rounded-xl">
                    <Trophy className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-1">
                      Sportif
                    </h3>
                    <p className="text-slate-600 text-sm">
                      Je suis un athlète en activité ou en reconversion professionnelle
                    </p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => handleProfileTypeSelect('company')}
                className="w-full p-6 bg-slate-50 border border-slate-200 rounded-2xl hover:bg-slate-100 hover:border-slate-300 transition-all text-left"
              >
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-gradient-to-br from-blue-400 to-blue-500 rounded-xl">
                    <Briefcase className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-1">
                      Employeur
                    </h3>
                    <p className="text-slate-600 text-sm">
                      Je recrute des athlètes pour mon entreprise
                    </p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => handleProfileTypeSelect('sponsor')}
                className="w-full p-6 bg-slate-50 border border-slate-200 rounded-2xl hover:bg-slate-100 hover:border-slate-300 transition-all text-left"
              >
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-gradient-to-br from-amber-400 to-amber-500 rounded-xl">
                    <Handshake className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-1">
                      Sponsor
                    </h3>
                    <p className="text-slate-600 text-sm">
                      Je cherche à sponsoriser des athlètes
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        )}

        {step === 'onboarding' && selectedUserType === 'athlete' && (
          <AthleteOnboarding
            key={onboardingData ? 'restore' : 'new'}
            onComplete={handleOnboardingComplete}
            onBack={() => {
              setStep('profile-type');
              setSelectedUserType(null);
              setOnboardingData(null);
            }}
            initialData={onboardingData}
            initialStep={onboardingData?._currentStep}
            onBackHandlerReady={(handler) => setOnboardingBackHandler(() => handler)}
          />
        )}

        {step === 'onboarding' && selectedUserType === 'company' && (
          <CompanyOnboarding
            key={onboardingData ? 'restore' : 'new'}
            onComplete={handleOnboardingComplete}
            onBack={() => {
              setStep('profile-type');
              setSelectedUserType(null);
              setOnboardingData(null);
            }}
            initialData={onboardingData}
            initialStep={onboardingData?._currentStep}
            onBackHandlerReady={(handler) => setOnboardingBackHandler(() => handler)}
          />
        )}

        {step === 'onboarding' && selectedUserType === 'sponsor' && (
          <SponsorOnboarding
            key={onboardingData ? 'restore' : 'new'}
            onComplete={handleOnboardingComplete}
            onBack={() => {
              setStep('profile-type');
              setSelectedUserType(null);
              setOnboardingData(null);
            }}
            initialData={onboardingData}
            initialStep={onboardingData?._currentStep}
            onBackHandlerReady={(handler) => setOnboardingBackHandler(() => handler)}
          />
        )}

        {step === 'verification' && onboardingData && (
          <EmailVerification
            email={onboardingData.email}
            onVerified={handleEmailVerified}
            onResend={handleResendCode}
          />
        )}

        {step === 'confirmation-pending' && onboardingData && (
          <EmailConfirmationPending
            email={onboardingData.email}
            onBack={onBack}
          />
        )}

        {error && step !== 'confirmation-pending' && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {loading && step === 'verification' && (
          <div className="mt-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="text-sm text-slate-600 mt-2">Création de votre compte...</p>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}
