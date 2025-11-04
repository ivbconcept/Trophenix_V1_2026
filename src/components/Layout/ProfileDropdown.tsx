import { useState, useEffect, useRef } from 'react';
import { User, Settings, LogOut, Shield, ChevronDown, Mail, Phone, MapPin, Calendar, Briefcase } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface ProfileDropdownProps {
  onNavigateToProfile: () => void;
  onNavigateToSettings: () => void;
  onLogout: () => void;
}

export function ProfileDropdown({ onNavigateToProfile, onNavigateToSettings, onLogout }: ProfileDropdownProps) {
  const { user, profile } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const getInitials = () => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name[0]}${profile.last_name[0]}`.toUpperCase();
    }
    if (profile?.company_name) {
      return profile.company_name.substring(0, 2).toUpperCase();
    }
    if (user?.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    return 'U';
  };

  const getDisplayName = () => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name} ${profile.last_name}`;
    }
    if (profile?.company_name) {
      return profile.company_name;
    }
    return user?.email || 'Utilisateur';
  };

  const getUserTypeLabel = () => {
    switch (profile?.user_type) {
      case 'athlete':
        return 'Athlète';
      case 'company':
        return 'Entreprise';
      case 'sponsor':
        return 'Sponsor';
      default:
        return 'Utilisateur';
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 md:gap-3 pl-2 md:pl-3 pr-3 md:pr-4 py-1.5 md:py-2 hover:bg-slate-100 dark:hover:bg-zinc-900 rounded-full transition-colors"
      >
        <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-sm md:text-base shadow-lg">
          {getInitials()}
        </div>
        <div className="hidden md:flex flex-col items-start">
          <span className="text-sm font-semibold text-slate-900 dark:text-white">
            {getDisplayName().length > 20
              ? `${getDisplayName().substring(0, 20)}...`
              : getDisplayName()
            }
          </span>
          <span className="text-xs text-slate-500 dark:text-zinc-400">
            {getUserTypeLabel()}
          </span>
        </div>
        <ChevronDown className={`w-4 h-4 text-slate-500 dark:text-zinc-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-slate-200 dark:border-zinc-800 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-4 border-b border-slate-200 dark:border-zinc-800 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-zinc-800 dark:to-zinc-900">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                {getInitials()}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-bold text-slate-900 dark:text-white truncate">
                  {getDisplayName()}
                </h3>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-full">
                    {getUserTypeLabel()}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-1.5 text-xs text-slate-600 dark:text-zinc-400">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="truncate">{user?.email}</span>
              </div>
              {profile?.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{profile.phone}</span>
                </div>
              )}
            </div>
          </div>

          <div className="py-2">
            <button
              onClick={() => {
                setIsOpen(false);
                onNavigateToProfile();
              }}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors text-left group"
            >
              <div className="w-9 h-9 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-colors">
                <User className="w-4.5 h-4.5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-slate-900 dark:text-white">
                  Mon Profil
                </div>
                <div className="text-xs text-slate-500 dark:text-zinc-400">
                  Gérer vos informations
                </div>
              </div>
            </button>

            <button
              onClick={() => {
                setIsOpen(false);
                onNavigateToSettings();
              }}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors text-left group"
            >
              <div className="w-9 h-9 bg-slate-50 dark:bg-zinc-800 rounded-lg flex items-center justify-center group-hover:bg-slate-100 dark:group-hover:bg-zinc-700 transition-colors">
                <Settings className="w-4.5 h-4.5 text-slate-600 dark:text-zinc-400" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-slate-900 dark:text-white">
                  Paramètres
                </div>
                <div className="text-xs text-slate-500 dark:text-zinc-400">
                  Préférences et confidentialité
                </div>
              </div>
            </button>
          </div>

          <div className="border-t border-slate-200 dark:border-zinc-800 py-2">
            <button
              onClick={() => {
                setIsOpen(false);
                onLogout();
              }}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-left group"
            >
              <div className="w-9 h-9 bg-red-50 dark:bg-red-900/20 rounded-lg flex items-center justify-center group-hover:bg-red-100 dark:group-hover:bg-red-900/30 transition-colors">
                <LogOut className="w-4.5 h-4.5 text-red-600 dark:text-red-400" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-red-600 dark:text-red-400">
                  Déconnexion
                </div>
                <div className="text-xs text-red-500 dark:text-red-400/70">
                  Se déconnecter du compte
                </div>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
