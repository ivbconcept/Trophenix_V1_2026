import { useState, useEffect } from 'react';
import { ChevronDown, Shield, Briefcase, Trophy, Users, Check } from 'lucide-react';
import { ContextService } from '../../services/contextService';
import type { UserContext, ActiveContext } from '../../types/contexts';

interface ContextSwitcherProps {
  userId: string;
  currentContext: ActiveContext | null;
  onContextChange: (context: ActiveContext) => void;
}

export function ContextSwitcher({ userId, currentContext, onContextChange }: ContextSwitcherProps) {
  const [contexts, setContexts] = useState<UserContext[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadContexts();
  }, [userId]);

  const loadContexts = async () => {
    try {
      const userContexts = await ContextService.getUserContexts(userId);
      setContexts(userContexts);
    } catch (error) {
      console.error('Failed to load contexts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleContextSwitch = async (context: UserContext) => {
    try {
      const activeContext = await ContextService.getActiveContextDetails(context);
      onContextChange(activeContext);
      setIsOpen(false);
    } catch (error) {
      console.error('Failed to switch context:', error);
    }
  };

  const getContextIcon = (contextType: string) => {
    switch (contextType) {
      case 'platform_admin':
        return Shield;
      case 'company_org':
        return Briefcase;
      case 'athlete_profile':
        return Trophy;
      case 'athlete_delegation':
        return Users;
      default:
        return Shield;
    }
  };

  const getContextLabel = (context: UserContext) => {
    switch (context.context_type) {
      case 'platform_admin':
        return 'Admin Platform';
      case 'company_org':
        return context.metadata?.org_name || 'Organisation';
      case 'athlete_profile':
        return 'Profil Athlète';
      case 'athlete_delegation':
        return `Délégation ${context.metadata?.athlete_name || ''}`;
      default:
        return 'Contexte';
    }
  };

  const getRoleLabel = (role: string) => {
    const roleLabels: Record<string, string> = {
      owner: 'Propriétaire',
      hr_manager: 'Manager RH',
      hr_recruiter: 'Recruteur RH',
      technical_lead: 'Lead Technique',
      director: 'Directeur',
      guardian: 'Tuteur',
      agent: 'Agent',
      manager: 'Manager',
      coach: 'Coach'
    };
    return roleLabels[role] || role;
  };

  if (loading) {
    return (
      <div className="flex items-center space-x-2 px-4 py-2 bg-slate-800 rounded-lg">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
        <span className="text-slate-400 text-sm">Chargement...</span>
      </div>
    );
  }

  if (!currentContext) {
    return null;
  }

  const Icon = getContextIcon(currentContext.context.context_type);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700"
      >
        <div className="p-1.5 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
          <Icon className="h-4 w-4 text-white" />
        </div>
        <div className="flex flex-col items-start">
          <span className="text-sm font-medium text-white">
            {getContextLabel(currentContext.context)}
          </span>
          <span className="text-xs text-slate-400">
            {getRoleLabel(currentContext.context.role)}
          </span>
        </div>
        {contexts.length > 1 && (
          <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        )}
      </button>

      {isOpen && contexts.length > 1 && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full mt-2 right-0 w-80 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50 overflow-hidden">
            <div className="p-3 border-b border-slate-700">
              <h3 className="text-sm font-semibold text-white">Changer de rôle</h3>
              <p className="text-xs text-slate-400 mt-1">
                Vous avez {contexts.length} rôle{contexts.length > 1 ? 's' : ''} actif{contexts.length > 1 ? 's' : ''}
              </p>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {contexts.map((context) => {
                const CtxIcon = getContextIcon(context.context_type);
                const isActive = currentContext.context.id === context.id;

                return (
                  <button
                    key={context.id}
                    onClick={() => handleContextSwitch(context)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 hover:bg-slate-700/50 transition-colors ${
                      isActive ? 'bg-slate-700/30' : ''
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${
                      isActive
                        ? 'bg-gradient-to-br from-blue-500 to-blue-600'
                        : 'bg-slate-700'
                    }`}>
                      <CtxIcon className={`h-4 w-4 ${
                        isActive ? 'text-white' : 'text-slate-400'
                      }`} />
                    </div>
                    <div className="flex-1 flex flex-col items-start">
                      <span className="text-sm font-medium text-white">
                        {getContextLabel(context)}
                      </span>
                      <span className="text-xs text-slate-400">
                        {getRoleLabel(context.role)}
                      </span>
                      {context.is_primary && (
                        <span className="text-xs text-blue-400 mt-1">
                          Rôle principal
                        </span>
                      )}
                    </div>
                    {isActive && (
                      <Check className="h-5 w-5 text-blue-500" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="p-3 border-t border-slate-700 bg-slate-900/50">
              <p className="text-xs text-slate-400 text-center">
                Les permissions changent selon le rôle actif
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
