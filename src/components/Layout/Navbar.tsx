import { Bell, MessageSquare, User, LogOut, Briefcase, Users, Trophy, Building, Search, Mail, LayoutDashboard, BookOpen, UsersRound, Settings } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { ReactNode } from 'react';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onLogout: () => void;
  children: ReactNode;
}

export function Navbar({ currentView, onNavigate, onLogout, children }: NavbarProps) {
  const { profile } = useAuth();

  const getSidebarLinks = () => {
    if (!profile) return [];

    switch (profile.user_type) {
      case 'athlete':
        return [
          { id: 'athlete-dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
          { id: 'messages', label: 'Messages', icon: Mail },
          { id: 'job-offers', label: 'Opportunités', icon: BookOpen },
          { id: 'my-applications', label: 'Candidatures', icon: Briefcase },
          { id: 'athletes-directory', label: 'Réseau', icon: UsersRound },
        ];
      case 'company':
        return [
          { id: 'company-dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
          { id: 'manage-offers', label: 'Mes offres', icon: Briefcase },
          { id: 'received-applications', label: 'Candidatures reçues', icon: Users },
          { id: 'athletes-directory', label: 'Annuaire athlètes', icon: Trophy },
        ];
      case 'sponsor':
        return [
          { id: 'company-dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
          { id: 'athletes-directory', label: 'Annuaire athlètes', icon: Trophy },
        ];
      default:
        return [];
    }
  };

  const sidebarLinks = getSidebarLinks();

  return (
    <div className="flex h-screen bg-slate-50">
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
              <Trophy className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">Trophenix</span>
          </div>
        </div>

        <div className="flex-1 py-8 px-4">
          <div className="mb-8">
            <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              OVERVIEW
            </p>
            <nav className="space-y-1">
              {sidebarLinks.map((link) => {
                const Icon = link.icon;
                const isActive = currentView === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => onNavigate(link.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-indigo-50 text-indigo-600'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{link.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="mb-8">
            <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              CONTACTS
            </p>
            <div className="space-y-3">
              <FriendItem
                name="Marie Dubois"
                status="Athlète"
                avatar="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=faces"
              />
              <FriendItem
                name="Thomas Martin"
                status="Coach"
                avatar="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=faces"
              />
              <FriendItem
                name="Sophie Bernard"
                status="Mentor"
                avatar="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop&crop=faces"
              />
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-slate-200">
          <div className="mb-4">
            <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              PARAMÈTRES
            </p>
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-all">
              <Settings className="h-5 w-5" />
              <span>Paramètres</span>
            </button>
          </div>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-all"
          >
            <LogOut className="h-5 w-5" />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-slate-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 max-w-xl">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 ml-6">
              <button className="p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors">
                <Mail className="h-5 w-5 text-slate-600" />
              </button>
              <button className="p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors relative">
                <Bell className="h-5 w-5 text-slate-600" />
              </button>
              <div className="h-8 w-px bg-slate-200 mx-2" />
              <button
                onClick={() => onNavigate('profile')}
                className="flex items-center gap-3 hover:bg-slate-50 rounded-xl p-2 transition-colors"
              >
                <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=faces"
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <span className="font-semibold text-slate-900">
                  {profile?.first_name || profile?.company_name || 'User'}
                </span>
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

interface FriendItemProps {
  name: string;
  status: string;
  avatar: string;
}

function FriendItem({ name, status, avatar }: FriendItemProps) {
  return (
    <div className="flex items-center gap-3 px-3 py-2 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer">
      <div className="relative">
        <img
          src={avatar}
          alt={name}
          className="w-8 h-8 rounded-full object-cover"
        />
        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-900 truncate">{name}</p>
        <p className="text-xs text-slate-500">{status}</p>
      </div>
    </div>
  );
}
