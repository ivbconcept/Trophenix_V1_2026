import { Bell, MessageSquare, User, LogOut, Briefcase, Users, Trophy, Building } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onLogout: () => void;
}

export function Navbar({ currentView, onNavigate, onLogout }: NavbarProps) {
  const { profile } = useAuth();

  const getNavigationLinks = () => {
    if (!profile) return [];

    switch (profile.user_type) {
      case 'athlete':
        return [
          { id: 'athlete-dashboard', label: 'Tableau de bord', icon: Trophy },
          { id: 'job-offers', label: 'Offres d\'emploi', icon: Briefcase },
          { id: 'my-applications', label: 'Mes candidatures', icon: Users },
          { id: 'companies-directory', label: 'Entreprises', icon: Building },
        ];
      case 'company':
        return [
          { id: 'company-dashboard', label: 'Tableau de bord', icon: Building },
          { id: 'manage-offers', label: 'Mes offres', icon: Briefcase },
          { id: 'received-applications', label: 'Candidatures reçues', icon: Users },
          { id: 'athletes-directory', label: 'Athlètes', icon: Trophy },
        ];
      case 'sponsor':
        return [
          { id: 'company-dashboard', label: 'Tableau de bord', icon: Building },
          { id: 'athletes-directory', label: 'Athlètes', icon: Trophy },
        ];
      default:
        return [];
    }
  };

  const navigationLinks = getNavigationLinks();

  return (
    <nav className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <Trophy className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Trophenix
            </span>
          </div>

          <div className="flex items-center space-x-1">
            {navigationLinks.map((link) => {
              const Icon = link.icon;
              const isActive = currentView === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => onNavigate(link.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center space-x-2 ${
                    isActive
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden md:inline">{link.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => onNavigate('messages')}
              className="p-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors relative"
            >
              <MessageSquare className="h-5 w-5" />
            </button>
            <button
              onClick={() => onNavigate('notifications')}
              className="p-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors relative"
            >
              <Bell className="h-5 w-5" />
            </button>
            <button
              onClick={() => onNavigate('profile')}
              className="p-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
            >
              <User className="h-5 w-5" />
            </button>
            <button
              onClick={onLogout}
              className="p-2 text-slate-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
