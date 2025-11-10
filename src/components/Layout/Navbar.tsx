import { Bell, LogOut, Trophy, Search, Mail, LayoutDashboard, Award, Handshake as HandshakeIcon, UsersRound, Settings, BookOpen, Briefcase, FileText, GraduationCap, TrendingUp, Users, DollarSign, Image as ImageIcon, MessageSquare, Bot, HelpCircle, Sparkles, Calendar, ListChecks } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { ReactNode, useState, useEffect } from 'react';
import { ProfileDropdown } from './ProfileDropdown';

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
    } else if (['job-offers', 'my-applications', 'cv-builder', 'cover-letter-builder'].includes(currentView)) {
      setActiveSection('employability');
    } else if (currentView === 'athletes-directory') {
      setActiveSection('group');
    } else if (currentView === 'manage-offers' || currentView === 'received-applications') {
      setActiveSection('employability');
    } else if (['sponsoring-offers', 'my-sponsoring-requests', 'sponsor-kit', 'presentation-letter', 'my-projects'].includes(currentView)) {
      setActiveSection('sponsoring');
    } else if (['competitions', 'my-competitions', 'competition-applications', 'competition-agenda', 'competition-invitations'].includes(currentView)) {
      setActiveSection('competitions');
    }
  }, [currentView]);

  const getPrimarySections = (): PrimarySection[] => {
    if (!profile) return [];

    switch (profile.user_type) {
      case 'athlete':
        return [
          { id: 'dashboard', label: 'Accueil', icon: LayoutDashboard },
          { id: 'employability', label: 'Emploi', icon: Award, hasSubmenu: true },
          { id: 'sponsoring', label: 'Sponsoring', icon: HandshakeIcon, hasSubmenu: true },
          { id: 'group', label: 'Annuaire', icon: UsersRound },
          { id: 'competitions', label: 'Compétitions', icon: Trophy, hasSubmenu: true },
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
        { id: 'job-offers', label: "Offres d'emploi", icon: BookOpen },
        { id: 'my-applications', label: 'Mes candidatures', icon: Briefcase },
        { id: 'cv-builder', label: 'Mon CV', icon: FileText },
        { id: 'cover-letter-builder', label: 'Lettre de Motivation', icon: GraduationCap },
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
        { id: 'sponsoring-offers', label: 'Offres de sponsoring', icon: BookOpen },
        { id: 'my-sponsoring-requests', label: 'Mes demandes', icon: Briefcase },
        { id: 'sponsor-kit', label: 'Mon kit sponsor', icon: FileText },
        { id: 'presentation-letter', label: 'Lettre de présentation', icon: GraduationCap },
        { id: 'my-projects', label: 'Mes projets', icon: TrendingUp },
      ];
    }

    if (section === 'competitions') {
      return [
        { id: 'competitions', label: 'Toutes les compétitions', icon: Trophy },
        { id: 'competition-applications', label: 'Mes candidatures', icon: ListChecks },
        { id: 'competition-invitations', label: 'Mes invitations', icon: Mail },
        { id: 'my-competitions', label: 'Mes participations', icon: Award },
        { id: 'competition-agenda', label: 'Agenda', icon: Calendar },
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
    } else {
      const subItems = getSubMenuItems(sectionId);
      if (subItems.length > 0) {
        onNavigate(subItems[0].id);
      }
    }
  };

  const primarySections = getPrimarySections();
  const subMenuItems = getSubMenuItems(activeSection);
  const showSecondarySidebar = subMenuItems.length > 0;

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-black">
      <aside className={`bg-gradient-to-b from-slate-100 via-slate-50 to-slate-100 dark:from-zinc-950 dark:via-black dark:to-zinc-950 border-r border-slate-200/50 dark:border-zinc-800 flex flex-col transition-all duration-300 ease-in-out ${
        showSecondarySidebar ? 'w-20' : 'w-64'
      } md:w-20`}>
        <div className={`p-6 border-b border-slate-200/50 dark:border-zinc-800 transition-all duration-300 ${
          showSecondarySidebar ? 'px-4' : 'px-6'
        } md:px-4`}>
          <div className="flex items-center gap-3 justify-center">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/50">
              <Trophy className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900 dark:text-white md:hidden">
              {!showSecondarySidebar && 'Trophenix'}
            </span>
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
                        ? 'bg-blue-500/10 dark:bg-blue-500/15 text-slate-900 dark:text-white shadow-sm'
                        : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-200/70 dark:hover:bg-zinc-800 hover:text-slate-900 dark:hover:text-white'
                    } ${showSecondarySidebar ? 'justify-center' : ''} md:justify-center`}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    {!showSecondarySidebar && (
                      <>
                        <span className="flex-1 text-left md:hidden">{section.label}</span>
                        {section.hasSubmenu && (
                          <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse md:absolute md:top-1/2 md:right-1 md:transform md:-translate-y-1/2" />
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

        <div className={`p-4 border-t border-slate-200/50 dark:border-zinc-800 ${showSecondarySidebar ? 'px-2' : 'px-4'} md:px-2`}>
          {!showSecondarySidebar && (
            <div className="mb-4 space-y-2 md:hidden">
              <button
                onClick={() => onNavigate('messages')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  currentView === 'messages'
                    ? 'bg-blue-500/10 dark:bg-blue-500/15 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-200/70 dark:hover:bg-zinc-800 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <MessageSquare className="h-5 w-5" />
                <span>Messagerie</span>
              </button>
              <button
                onClick={() => onNavigate('elea')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  currentView === 'elea'
                    ? 'bg-blue-500/10 dark:bg-blue-500/15 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-200/70 dark:hover:bg-zinc-800 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Sparkles className="h-5 w-5" />
                <span>Elea</span>
              </button>
              <div className="border-t border-slate-200/50 dark:border-zinc-700 my-2"></div>
              <button
                onClick={() => onNavigate('help')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  currentView === 'help'
                    ? 'bg-blue-500/10 dark:bg-blue-500/15 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-200/70 dark:hover:bg-zinc-800 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <HelpCircle className="h-5 w-5" />
                <span>Aide</span>
              </button>
              <button
                onClick={() => onNavigate('settings')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  currentView === 'settings'
                    ? 'bg-blue-500/10 dark:bg-blue-500/15 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-200/70 dark:hover:bg-zinc-800 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Settings className="h-5 w-5" />
                <span>Paramètres</span>
              </button>
            </div>
          )}
          <div className="mb-2 space-y-2 hidden md:block">
            <button
              onClick={() => onNavigate('messages')}
              title="Messagerie"
              className={`w-full flex items-center justify-center px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                currentView === 'messages'
                  ? 'bg-blue-500/10 dark:bg-blue-500/15 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-200/70 dark:hover:bg-zinc-800 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <MessageSquare className="h-5 w-5" />
            </button>
            <button
              onClick={() => onNavigate('elea')}
              title="Elea"
              className={`w-full flex items-center justify-center px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                currentView === 'elea'
                  ? 'bg-blue-500/10 dark:bg-blue-500/15 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-200/70 dark:hover:bg-zinc-800 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Sparkles className="h-5 w-5" />
            </button>
            <div className="border-t border-slate-200/50 dark:border-zinc-700 my-2"></div>
            <button
              onClick={() => onNavigate('help')}
              title="Aide"
              className={`w-full flex items-center justify-center px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                currentView === 'help'
                  ? 'bg-blue-500/10 dark:bg-blue-500/15 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-200/70 dark:hover:bg-zinc-800 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <HelpCircle className="h-5 w-5" />
            </button>
            <button
              onClick={() => onNavigate('settings')}
              title="Paramètres"
              className={`w-full flex items-center justify-center px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                currentView === 'settings'
                  ? 'bg-blue-500/10 dark:bg-blue-500/15 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-200/70 dark:hover:bg-zinc-800 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Settings className="h-5 w-5" />
            </button>
          </div>
          {showSecondarySidebar && (
            <div className="mb-2 space-y-2">
              <button
                onClick={() => onNavigate('messages')}
                title="Messagerie"
                className={`w-full flex items-center justify-center px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  currentView === 'messages'
                    ? 'bg-blue-500/10 dark:bg-blue-500/15 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-200/70 dark:hover:bg-zinc-800 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <MessageSquare className="h-5 w-5" />
              </button>
              <button
                onClick={() => onNavigate('elea')}
                title="Elea"
                className={`w-full flex items-center justify-center px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  currentView === 'elea'
                    ? 'bg-blue-500/10 dark:bg-blue-500/15 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-200/70 dark:hover:bg-zinc-800 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Sparkles className="h-5 w-5" />
              </button>
              <div className="border-t border-slate-200/50 dark:border-zinc-700 my-2"></div>
              <button
                onClick={() => onNavigate('help')}
                title="Aide"
                className={`w-full flex items-center justify-center px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  currentView === 'help'
                    ? 'bg-blue-500/10 dark:bg-blue-500/15 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-200/70 dark:hover:bg-zinc-800 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <HelpCircle className="h-5 w-5" />
              </button>
              <button
                onClick={() => onNavigate('settings')}
                title="Paramètres"
                className={`w-full flex items-center justify-center px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  currentView === 'settings'
                    ? 'bg-blue-500/10 dark:bg-blue-500/15 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-200/70 dark:hover:bg-zinc-800 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Settings className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </aside>

      {showSecondarySidebar && (
        <aside className="w-64 bg-white/80 dark:bg-zinc-950/95 backdrop-blur-xl border-r border-slate-200/50 dark:border-zinc-800 flex flex-col animate-in slide-in-from-left duration-300 lg:flex md:hidden">
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
                        ? 'bg-blue-500/10 dark:bg-blue-500/15 text-slate-900 dark:text-white shadow-sm'
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
