import { useState } from 'react';
import { Mail, ArrowRight, AlertCircle } from 'lucide-react';

interface EmailVerificationProps {
  email: string;
  onVerified: () => void;
  onResend: () => void;
}

export function EmailVerification({ email, onVerified, onResend }: EmailVerificationProps) {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const verificationCode = code.join('');
    if (verificationCode.length !== 6) {
      setError('Veuillez entrer le code complet');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      onVerified();
    }, 1500);
  };

  const handleResend = async () => {
    setResendLoading(true);
    await onResend();
    setResendLoading(false);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md mx-auto">
      <div className="flex flex-col items-center mb-8">
        <div className="p-4 bg-indigo-100 rounded-full mb-4">
          <Mail className="h-8 w-8 text-indigo-600" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Vérifiez votre email
        </h1>
        <p className="text-slate-600 text-center">
          Un code de vérification a été envoyé à
        </p>
        <p className="text-slate-900 font-semibold mt-1">
          {email}
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-3 text-center">
            Entrez le code à 6 chiffres
          </label>
          <div className="flex gap-2 justify-center">
            {code.map((digit, index) => (
              <input
                key={index}
                id={`code-${index}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleCodeChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-14 text-center text-2xl font-bold border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || code.some(d => !d)}
          className="w-full py-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? 'Vérification...' : 'Vérifier'}
          {!loading && <ArrowRight className="h-5 w-5" />}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-slate-600 mb-2">
          Vous n'avez pas reçu le code ?
        </p>
        <button
          onClick={handleResend}
          disabled={resendLoading}
          className="text-indigo-600 hover:text-indigo-700 font-medium text-sm disabled:opacity-50"
        >
          {resendLoading ? 'Envoi...' : 'Renvoyer le code'}
        </button>
      </div>
    </div>
  );
}
