import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { ArrowLeft, AlertCircle, Trophy, Briefcase } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { UserType } from '../../types';
import { AthleteOnboarding } from './AthleteOnboarding';
import { CompanyOnboarding } from './CompanyOnboarding';
import { AuthCarousel } from './AuthCarousel';
import { EmailVerification } from './EmailVerification';

interface SignUpFlowProps {
  onBack: () => void;
  onSuccess: (userType: 'athlete' | 'company') => void;
}

export function SignUpFlow({ onBack, onSuccess }: SignUpFlowProps) {
  const [step, setStep] = useState<'profile-type' | 'onboarding' | 'verification'>('profile-type');
  const [selectedUserType, setSelectedUserType] = useState<UserType | null>(null);
  const [onboardingData, setOnboardingData] = useState<any>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp, signIn } = useAuth();

  const handleProfileTypeSelect = (userType: UserType) => {
    setSelectedUserType(userType);
    setStep('onboarding');
  };

  const handleOnboardingComplete = (data: any) => {
    setOnboardingData(data);
    setStep('verification');
  };

  const handleEmailVerified = async () => {
    setError('');
    setLoading(true);

    try {
      const { email, password, password_confirm, terms_accepted, ...profileData } = onboardingData;

      const { error: signUpError } = await signUp(email, password);

      if (signUpError) {
        if (signUpError.message.includes('already registered')) {
          setError('Cet email est déjà utilisé');
        } else {
          setError('Une erreur est survenue lors de la création du compte');
        }
        setLoading(false);
        return;
      }

      await signIn(email, password);

      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setError('Erreur d\'authentification');
        setLoading(false);
        return;
      }

      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          email: user.email!,
          user_type: selectedUserType!,
          validation_status: 'approved'
        });

      if (profileError) {
        setError('Erreur lors de la création du profil');
        setLoading(false);
        return;
      }

      if (selectedUserType === 'athlete') {
        const { error: athleteError } = await supabase
          .from('athlete_profiles')
          .insert({
            user_id: user.id,
            first_name: profileData.first_name,
            last_name: profileData.last_name,
            sport: profileData.sport,
            sport_level: profileData.sport_level,
            geographic_zone: profileData.geographic_zone,
            desired_field: profileData.desired_field,
            position_type: profileData.position_type,
            availability: profileData.availability
          });

        if (athleteError) {
          console.error('Athlete profile error:', athleteError);
          setError('Erreur lors de la sauvegarde du profil sportif');
          setLoading(false);
          return;
        }
      } else if (selectedUserType === 'company') {
        const { error: companyError } = await supabase
          .from('company_profiles')
          .insert({
            user_id: user.id,
            ...profileData
          });

        if (companyError) {
          setError('Erreur lors de la sauvegarde du profil professionnel');
          setLoading(false);
          return;
        }
      }

      setLoading(false);
      onSuccess(selectedUserType as 'athlete' | 'company');
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
                  <div className="p-3 bg-gradient-to-br from-pink-400 to-pink-500 rounded-xl">
                    <Briefcase className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-1">
                      Professionnel
                    </h3>
                    <p className="text-slate-600 text-sm">
                      Je représente une structure ou une entreprise
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

        {step === 'verification' && onboardingData && (
          <EmailVerification
            email={onboardingData.email}
            onVerified={handleEmailVerified}
            onResend={handleResendCode}
          />
        )}

        {error && (
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
