import { Bell, LogOut, Trophy, Search, Mail, LayoutDashboard, Award, HandshakeIcon, UsersRound, Settings, BookOpen, Briefcase, FileText, GraduationCap, TrendingUp, Users, DollarSign, Image as ImageIcon } from 'lucide-react';
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
    } else if (currentView === 'messages') {
      setActiveSection('messages');
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
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'employability', label: 'Employabilité', icon: Award, hasSubmenu: true },
          { id: 'sponsoring', label: 'Sponsoring', icon: HandshakeIcon, hasSubmenu: true },
          { id: 'messages', label: 'Messages', icon: Mail },
          { id: 'group', label: 'Group', icon: UsersRound },
        ];
      case 'company':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'employability', label: 'Recrutement', icon: Award, hasSubmenu: true },
          { id: 'athletes', label: 'Athlètes', icon: Trophy },
        ];
      case 'sponsor':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
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
    } else if (sectionId === 'messages') {
      onNavigate('messages');
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
    <div className="flex h-screen bg-slate-50">
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
              <Trophy className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">Trophenix</span>
          </div>
        </div>

        <div className="flex-1 py-8 px-4 overflow-y-auto">
          <div className="mb-8">
            <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              NAVIGATION
            </p>
            <nav className="space-y-1">
              {primarySections.map((section) => {
                const Icon = section.icon;
                const isActive = activeSection === section.id;
                return (
                  <button
                    key={section.id}
                    onClick={() => handlePrimaryClick(section.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-600 shadow-sm'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{section.label}</span>
                    {section.hasSubmenu && (
                      <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400" />
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="mb-8">
            <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              FRIENDS
            </p>
            <div className="space-y-3">
              <FriendItem
                name="Bagas Mahpie"
                status="Friend"
                avatar="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=faces"
              />
              <FriendItem
                name="Sir Dandy"
                status="Old Friend"
                avatar="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=faces"
              />
              <FriendItem
                name="Jhon Tosan"
                status="Friend"
                avatar="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=faces"
              />
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-slate-200">
          <div className="mb-4">
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-all">
              <Settings className="h-5 w-5" />
              <span>Settings</span>
            </button>
          </div>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-all"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {showSecondarySidebar && (
        <aside className="w-56 bg-slate-50 border-r border-slate-200 flex flex-col">
          <div className="p-6 border-b border-slate-200">
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wide">
              {primarySections.find(s => s.id === activeSection)?.label}
            </h3>
          </div>

          <div className="flex-1 py-6 px-3 overflow-y-auto">
            <nav className="space-y-1">
              {subMenuItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-slate-600 hover:bg-white hover:shadow-sm'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-slate-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 max-w-xl">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
