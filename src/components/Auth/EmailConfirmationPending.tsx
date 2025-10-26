import { Mail, ArrowLeft } from 'lucide-react';

interface EmailConfirmationPendingProps {
  email: string;
  onBack: () => void;
}

export function EmailConfirmationPending({ email, onBack }: EmailConfirmationPendingProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 text-center">
          <div className="mx-auto w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mb-6">
            <Mail className="h-8 w-8 text-teal-600" />
          </div>

          <h1 className="text-2xl font-bold text-slate-900 mb-3">
            Vérifiez votre boîte mail
          </h1>

          <p className="text-slate-600 mb-6">
            Un email de confirmation a été envoyé à :
          </p>

          <div className="bg-slate-50 rounded-lg p-3 mb-6">
            <p className="font-medium text-slate-900">{email}</p>
          </div>

          <div className="text-left bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-900 font-medium mb-2">
              📧 Prochaines étapes :
            </p>
            <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
              <li>Ouvrez votre boîte mail</li>
              <li>Cliquez sur le lien de confirmation</li>
              <li>Revenez ici pour vous connecter</li>
            </ol>
          </div>

          <p className="text-xs text-slate-500 mb-6">
            Vous n'avez pas reçu l'email ? Vérifiez vos spams ou attendez quelques minutes.
          </p>

          <button
            onClick={onBack}
            className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Retour à la connexion</span>
          </button>
        </div>
      </div>
    </div>
  );
}
