import { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface ForgotPasswordFormProps {
  onBack: () => void;
}

export function ForgotPasswordForm({ onBack }: ForgotPasswordFormProps) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        setError('Une erreur est survenue. Veuillez réessayer.');
      } else {
        setSuccess(true);
      }
    } catch (err) {
      setError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="w-full max-w-lg">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-10">
          {!success ? (
            <>
              <h1 className="text-4xl font-bold text-slate-900 mb-3">
                Mot de passe oublié ?
              </h1>
              <p className="text-slate-900 mb-6 text-lg">
                Pas de problème, ça arrive même aux meilleurs
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
                    Quelle est l'adresse email de votre compte ?
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="marie.curie@nobel.fr"
                    required
                    className="w-full px-5 py-3 bg-white border-2 border-slate-200 rounded-2xl focus:ring-0 focus:border-indigo-500 transition-colors text-base placeholder:text-slate-400"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 font-semibold text-base transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Envoi en cours...' : 'Réinitialiser mon mot de passe'}
                </button>
              </form>

              <div className="mt-8 pt-6">
                <p className="text-slate-900">
                  Pas de compte ?{' '}
                  <button
                    onClick={onBack}
                    className="text-indigo-600 hover:text-indigo-700 font-medium"
                  >
                    Découvrez Trophenix.
                  </button>
                </p>
              </div>
            </>
          ) : (
            <div className="text-center py-4">
              <h1 className="text-4xl font-bold text-slate-900 mb-3">
                Email envoyé !
              </h1>
              <p className="text-slate-600 mb-8 text-lg">
                Consultez votre boîte mail. Nous vous avons envoyé un lien pour réinitialiser votre mot de passe.
              </p>
              <button
                onClick={onBack}
                className="w-full py-4 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 font-semibold text-base transition-colors"
              >
                Retour à la connexion
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
