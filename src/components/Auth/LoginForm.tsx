import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { AuthCarousel } from './AuthCarousel';

interface LoginFormProps {
  onBack: () => void;
  onSwitchToSignUp: () => void;
  onForgotPassword: () => void;
}

export function LoginForm({ onBack, onSwitchToSignUp, onForgotPassword }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error } = await signIn(email, password);

    if (error) {
      if (error.message.includes('Invalid login credentials')) {
        setError('Email ou mot de passe incorrect');
      } else {
        setError('Une erreur est survenue. Veuillez réessayer.');
      }
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      <div className="hidden lg:block lg:w-1/2">
        <AuthCarousel />
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center py-12">
        <div className="max-w-xl w-full px-6">
          <button
            onClick={onBack}
            className="flex items-center text-indigo-600 hover:text-indigo-700 transition-colors mb-8 text-lg font-medium"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Retour
          </button>

          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-10">
            <h1 className="text-4xl font-bold text-slate-900 mb-3">
              Content de vous revoir !
            </h1>
            <p className="text-slate-600 mb-8 text-lg">
              Bienvenue chez Trophenix !
            </p>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-base font-bold text-slate-900 mb-2">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-5 py-3 bg-white border-2 border-slate-200 rounded-2xl focus:ring-0 focus:border-indigo-500 transition-colors text-base placeholder:text-slate-400"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-base font-bold text-slate-900 mb-2">
                  Mot de passe
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-5 py-3 bg-white border-2 border-slate-200 rounded-2xl focus:ring-0 focus:border-indigo-500 transition-colors text-base placeholder:text-slate-400"
                />
              </div>

              <div className="text-left">
                <button
                  type="button"
                  onClick={onForgotPassword}
                  className="text-indigo-600 hover:text-indigo-700 font-medium text-base"
                >
                  J'ai oublié mon mot de passe
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 font-bold text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Connexion en cours...
                  </>
                ) : (
                  'Me connecter'
                )}
              </button>
            </form>

            <div className="mt-8 pt-8 border-t border-slate-200">
              <p className="text-slate-900 font-bold text-xl mb-4">
                Pas encore de compte ?
              </p>
              <button
                onClick={onSwitchToSignUp}
                className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl hover:bg-slate-100 hover:border-slate-300 transition-all text-left"
              >
                <p className="text-slate-900 font-medium">
                  Je veux créer un compte
                </p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
