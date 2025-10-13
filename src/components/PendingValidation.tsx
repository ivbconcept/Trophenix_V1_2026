import { Clock, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { AgentElea } from './AI/AgentElea';
import { FEATURES } from '../config/features';

export function PendingValidation() {
  const { signOut } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mb-6">
          <Clock className="h-8 w-8 text-amber-600" />
        </div>

        <h1 className="text-2xl font-bold text-slate-900 mb-4">
          Votre profil est en attente de validation
        </h1>

        <p className="text-slate-600 mb-8">
          Un administrateur va vérifier votre profil prochainement.
          Vous recevrez un email une fois votre compte validé et vous pourrez
          alors accéder à la plateforme.
        </p>

        <button
          onClick={() => signOut()}
          className="flex items-center justify-center space-x-2 w-full px-6 py-3 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 font-medium transition-colors"
        >
          <LogOut className="h-5 w-5" />
          <span>Se déconnecter</span>
        </button>
      </div>

      {/* Agent Elea - Accessible pendant l'attente de validation */}
      {FEATURES.AGENT_ELEA_ENABLED && (
        <AgentElea
          context={{
            page: 'pending_validation',
          }}
        />
      )}
    </div>
  );
}
