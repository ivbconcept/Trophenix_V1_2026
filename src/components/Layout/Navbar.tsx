import { Bell, LogOut, Trophy, Search, Mail, LayoutDashboard, Award, Handshake as HandshakeIcon, UsersRound, Settings, BookOpen, Briefcase, FileText, GraduationCap, TrendingUp, Users, DollarSign, Image as ImageIcon } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { ReactNode, useState, useEffect } from 'react';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onLogout: () => void;
  children: ReactNode;
}

interface PrimarySection {
  id: string;
  label: string;
  icon: any;
  hasSubmenu?: boolean;
}

interface SubMenuItem {
  id: string;
  label: string;
  icon: any;
}

export function Navbar({ currentView, onNavigate, onLogout, children }: NavbarProps) {
  const { profile } = useAuth();
  const [activeSection, setActiveSection] = useState<string>('dashboard');

  useEffect(() => {
    if (currentView === 'athlete-dashboard' || currentView === 'company-dashboard') {
      setActiveSection('dashboard');
    } else if (['job-offers', 'my-applications'].includes(currentView)) {
      setActiveSection('employability');
    } else if (currentView === 'athletes-directory') {
      setActiveSection('group');
    } else if (currentView === 'manage-offers' || currentView === 'received-applications') {
      setActiveSection('employability');
    }
  }, [currentView]);

  const getPrimarySections = (): PrimarySection[] => {
    if (!profile) return [];

    switch (profile.user_type) {
      case 'athlete':
        return [
          { id: 'dashboard', label: 'Accueil', icon: LayoutDashboard },
          { id: 'employability', label: 'Job', icon: Award, hasSubmenu: true },
          { id: 'sponsoring', label: 'Sponsoring', icon: HandshakeIcon, hasSubmenu: true },
          { id: 'group', label: 'Annuaire', icon: UsersRound },
        ];
      case 'company':
        return [
          { id: 'dashboard', label: 'Accueil', icon: LayoutDashboard },
          { id: 'employability', label: 'Recrutement', icon: Award, hasSubmenu: true },
          { id: 'athletes', label: 'Athlètes', icon: Trophy },
        ];
      case 'sponsor':
        return [
          { id: 'dashboard', label: 'Accueil', icon: LayoutDashboard },
          { id: 'athletes', label: 'Athlètes', icon: Trophy },
        ];
      default:
        return [];
    }
  };

  const getSubMenuItems = (section: string): SubMenuItem[] => {
    if (!profile) return [];

    if (section === 'employability' && profile.user_type === 'athlete') {
      return [
        { id: 'job-offers', label: 'Explorer', icon: BookOpen },
        { id: 'my-applications', label: 'Mes candidatures', icon: Briefcase },
        { id: 'cv-builder', label: 'Mon CV', icon: FileText },
        { id: 'formations', label: 'Formations', icon: GraduationCap },
      ];
    }

    if (section === 'employability' && profile.user_type === 'company') {
      return [
        { id: 'manage-offers', label: 'Mes offres', icon: Briefcase },
        { id: 'received-applications', label: 'Candidatures', icon: Users },
      ];
    }

    if (section === 'sponsoring') {
      return [
        { id: 'explore-sponsors', label: 'Explorer', icon: Search },
        { id: 'my-partnerships', label: 'Mes partenariats', icon: HandshakeIcon },
        { id: 'sponsoring-requests', label: 'Demandes', icon: TrendingUp },
        { id: 'media-kit', label: 'Média Kit', icon: ImageIcon },
        { id: 'revenues', label: 'Revenus', icon: DollarSign },
      ];
    }

    return [];
  };

  const handlePrimaryClick = (sectionId: string) => {
    setActiveSection(sectionId);

    if (sectionId === 'dashboard') {
      onNavigate(profile?.user_type === 'athlete' ? 'athlete-dashboard' : 'company-dashboard');
    } else if (sectionId === 'group') {
      onNavigate('athletes-directory');
    } else if (sectionId === 'athletes') {
      onNavigate('athletes-directory');
    }
  };

  const primarySections = getPrimarySections();
  const subMenuItems = getSubMenuItems(activeSection);
  const showSecondarySidebar = subMenuItems.length > 0;

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-black">
      <aside className={`bg-gradient-to-b from-slate-100 via-slate-50 to-slate-100 dark:from-zinc-950 dark:via-black dark:to-zinc-950 border-r border-slate-200/50 dark:border-zinc-800 flex flex-col transition-all duration-300 ease-in-out ${
        showSecondarySidebar ? 'w-20' : 'w-64'
      }`}>
        <div className={`p-6 border-b border-slate-200/50 dark:border-zinc-800 transition-all duration-300 ${
          showSecondarySidebar ? 'px-4' : 'px-6'
        }`}>
          <div className="flex items-center gap-3 justify-center">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/50">
              <Trophy className="h-6 w-6 text-white" />
            </div>
            {!showSecondarySidebar && (
              <span className="text-xl font-bold text-slate-900 dark:text-white">Trophenix</span>
            )}
          </div>
        </div>

        <div className="flex-1 py-8 px-4 overflow-y-auto">
          <div className="mb-8">
            <nav className="space-y-2">
              {primarySections.map((section) => {
                const Icon = section.icon;
                const isActive = activeSection === section.id;
                return (
                  <button
                    key={section.id}
                    onClick={() => handlePrimaryClick(section.id)}
                    title={showSecondarySidebar ? section.label : undefined}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all relative group ${
                      isActive
                        ? 'bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-slate-300'
                        : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-200/70 dark:hover:bg-zinc-800 hover:text-slate-900 dark:hover:text-white'
                    } ${showSecondarySidebar ? 'justify-center' : ''}`}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    {!showSecondarySidebar && (
                      <>
                        <span className="flex-1 text-left">{section.label}</span>
                        {section.hasSubmenu && (
                          <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                        )}
                      </>
                    )}
                    {showSecondarySidebar && section.hasSubmenu && (
                      <div className="absolute top-1/2 right-1 w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse transform -translate-y-1/2" />
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

        </div>

        <div className={`p-4 border-t border-slate-200/50 dark:border-zinc-800 ${showSecondarySidebar ? 'px-2' : 'px-4'}`}>
          {!showSecondarySidebar && (
            <div className="mb-4 space-y-2">
              <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-zinc-400 hover:bg-slate-200/70 dark:hover:bg-zinc-800 hover:text-slate-900 dark:hover:text-white transition-all">
                <Settings className="h-5 w-5" />
                <span>Settings</span>
              </button>
            </div>
          )}
          {showSecondarySidebar && (
            <div className="mb-2 space-y-2">
              <button
                title="Settings"
                className="w-full flex items-center justify-center px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-zinc-400 hover:bg-slate-200/70 dark:hover:bg-zinc-800 hover:text-slate-900 dark:hover:text-white transition-all"
              >
                <Settings className="h-5 w-5" />
              </button>
            </div>
          )}
          <button
            onClick={onLogout}
            title={showSecondarySidebar ? "Logout" : undefined}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 dark:text-red-400 hover:bg-red-500/10 dark:hover:bg-red-500/20 hover:text-red-300 dark:hover:text-red-300 transition-all ${
              showSecondarySidebar ? 'justify-center' : ''
            }`}
          >
            <LogOut className="h-5 w-5" />
            {!showSecondarySidebar && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {showSecondarySidebar && (
        <aside className="w-64 bg-white/80 dark:bg-zinc-950/95 backdrop-blur-xl border-r border-slate-200/50 dark:border-zinc-800 flex flex-col animate-in slide-in-from-left duration-300">
          <div className="p-6 border-b border-slate-200/50 dark:border-zinc-800">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-1 w-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"></div>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              {primarySections.find(s => s.id === activeSection)?.label}
            </h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">Sélectionnez une option</p>
          </div>

          <div className="flex-1 py-6 px-4 overflow-y-auto">
            <nav className="space-y-2">
              {subMenuItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all group ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/20'
                        : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <div className={`p-2 rounded-lg transition-all ${
                      isActive
                        ? 'bg-white/20'
                        : 'bg-slate-100 dark:bg-zinc-800 group-hover:bg-slate-200 dark:group-hover:bg-zinc-700'
                    }`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="flex-1 text-left">{item.label}</span>
                    {isActive && (
                      <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-auto bg-slate-50 dark:bg-black">
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
    <div className="flex items-center gap-3 px-3 py-2 hover:bg-slate-700/50 rounded-xl transition-all cursor-pointer group">
      <div className="relative">
        <img
          src={avatar}
          alt={name}
          className="w-8 h-8 rounded-full object-cover ring-2 ring-slate-700 group-hover:ring-cyan-500 transition-all"
        />
        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 border-2 border-slate-900 rounded-full" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-200 truncate group-hover:text-white transition-colors">{name}</p>
        <p className="text-xs text-slate-400">{status}</p>
      </div>
    </div>
  );
}
