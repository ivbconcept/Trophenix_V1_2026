import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  Home,
  Briefcase,
  Users,
  MessageSquare,
  Bell,
  User,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Building2,
  UserCircle
} from 'lucide-react';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onLogout: () => void;
}

export function Navbar({ currentView, onNavigate, onLogout }: NavbarProps) {
  const { profile } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDirectoryOpen, setIsDirectoryOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const isAthlete = profile?.user_type === 'athlete';
  const isCompany = profile?.user_type === 'company';
  const isAdmin = profile?.user_type === 'admin';

  const handleNavigate = (view: string) => {
    onNavigate(view);
    setIsMenuOpen(false);
    setIsDirectoryOpen(false);
    setIsProfileOpen(false);
  };

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <button
              onClick={() => handleNavigate(isAdmin ? 'admin' : isAthlete ? 'athlete-dashboard' : 'company-dashboard')}
              className="flex items-center space-x-2"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-slate-800 to-slate-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">T</span>
              </div>
              <span className="text-xl font-bold text-slate-900">Trophenix</span>
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {/* Admin Menu */}
            {isAdmin && (
              <>
                <NavButton
                  icon={Home}
                  label="Dashboard"
                  active={currentView === 'admin'}
                  onClick={() => handleNavigate('admin')}
                />
              </>
            )}

            {/* Athlete Menu */}
            {isAthlete && (
              <>
                <NavButton
                  icon={Home}
                  label="Dashboard"
                  active={currentView === 'athlete-dashboard'}
                  onClick={() => handleNavigate('athlete-dashboard')}
                />
                <NavButton
                  icon={Briefcase}
                  label="Offres"
                  active={currentView === 'job-offers'}
                  onClick={() => handleNavigate('job-offers')}
                />
                <NavButton
                  icon={Users}
                  label="Mes Candidatures"
                  active={currentView === 'my-applications'}
                  onClick={() => handleNavigate('my-applications')}
                />
              </>
            )}

            {/* Company Menu */}
            {isCompany && (
              <>
                <NavButton
                  icon={Home}
                  label="Dashboard"
                  active={currentView === 'company-dashboard'}
                  onClick={() => handleNavigate('company-dashboard')}
                />
                <NavButton
                  icon={Briefcase}
                  label="Mes Offres"
                  active={currentView === 'manage-offers'}
                  onClick={() => handleNavigate('manage-offers')}
                />
                <NavButton
                  icon={Users}
                  label="Candidatures"
                  active={currentView === 'received-applications'}
                  onClick={() => handleNavigate('received-applications')}
                />
              </>
            )}

            {/* Common Menu Items */}
            {!isAdmin && (
              <>
                {/* Directory Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsDirectoryOpen(!isDirectoryOpen)}
                    className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      currentView.includes('directory')
                        ? 'bg-slate-100 text-slate-900'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <Users className="w-4 h-4" />
                    <span>Annuaires</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  {isDirectoryOpen && (
                    <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-1">
                      <button
                        onClick={() => handleNavigate('athletes-directory')}
                        className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                      >
                        <UserCircle className="w-4 h-4" />
                        <span>Athlètes</span>
                      </button>
                      <button
                        onClick={() => handleNavigate('companies-directory')}
                        className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                      >
                        <Building2 className="w-4 h-4" />
                        <span>Entreprises</span>
                      </button>
                    </div>
                  )}
                </div>

                <NavButton
                  icon={MessageSquare}
                  label="Messages"
                  active={currentView === 'messages'}
                  onClick={() => handleNavigate('messages')}
                />
              </>
            )}

            <NavButton
              icon={Bell}
              label="Notifications"
              active={currentView === 'notifications'}
              onClick={() => handleNavigate('notifications')}
            />

            {/* Profile Dropdown */}
            <div className="relative ml-2">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
              >
                <User className="w-4 h-4" />
                <ChevronDown className="w-4 h-4" />
              </button>
              {isProfileOpen && (
                <div className="absolute top-full right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-1">
                  <button
                    onClick={() => handleNavigate('profile')}
                    className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                  >
                    <User className="w-4 h-4" />
                    <span>Mon Profil</span>
                  </button>
                  <div className="border-t border-slate-200 my-1"></div>
                  <button
                    onClick={onLogout}
                    className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Déconnexion</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-50"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-200">
            {/* Admin Mobile Menu */}
            {isAdmin && (
              <MobileNavButton
                icon={Home}
                label="Dashboard"
                active={currentView === 'admin'}
                onClick={() => handleNavigate('admin')}
              />
            )}

            {/* Athlete Mobile Menu */}
            {isAthlete && (
              <>
                <MobileNavButton
                  icon={Home}
                  label="Dashboard"
                  active={currentView === 'athlete-dashboard'}
                  onClick={() => handleNavigate('athlete-dashboard')}
                />
                <MobileNavButton
                  icon={Briefcase}
                  label="Offres d'emploi"
                  active={currentView === 'job-offers'}
                  onClick={() => handleNavigate('job-offers')}
                />
                <MobileNavButton
                  icon={Users}
                  label="Mes Candidatures"
                  active={currentView === 'my-applications'}
                  onClick={() => handleNavigate('my-applications')}
                />
              </>
            )}

            {/* Company Mobile Menu */}
            {isCompany && (
              <>
                <MobileNavButton
                  icon={Home}
                  label="Dashboard"
                  active={currentView === 'company-dashboard'}
                  onClick={() => handleNavigate('company-dashboard')}
                />
                <MobileNavButton
                  icon={Briefcase}
                  label="Mes Offres"
                  active={currentView === 'manage-offers'}
                  onClick={() => handleNavigate('manage-offers')}
                />
                <MobileNavButton
                  icon={Users}
                  label="Candidatures Reçues"
                  active={currentView === 'received-applications'}
                  onClick={() => handleNavigate('received-applications')}
                />
              </>
            )}

            {/* Common Mobile Menu Items */}
            {!isAdmin && (
              <>
                <div className="px-4 py-2 text-xs font-semibold text-slate-400 uppercase">
                  Annuaires
                </div>
                <MobileNavButton
                  icon={UserCircle}
                  label="Athlètes"
                  active={currentView === 'athletes-directory'}
                  onClick={() => handleNavigate('athletes-directory')}
                />
                <MobileNavButton
                  icon={Building2}
                  label="Entreprises"
                  active={currentView === 'companies-directory'}
                  onClick={() => handleNavigate('companies-directory')}
                />
                <MobileNavButton
                  icon={MessageSquare}
                  label="Messages"
                  active={currentView === 'messages'}
                  onClick={() => handleNavigate('messages')}
                />
              </>
            )}

            <MobileNavButton
              icon={Bell}
              label="Notifications"
              active={currentView === 'notifications'}
              onClick={() => handleNavigate('notifications')}
            />

            <div className="border-t border-slate-200 my-2"></div>

            <MobileNavButton
              icon={User}
              label="Mon Profil"
              active={currentView === 'profile'}
              onClick={() => handleNavigate('profile')}
            />
            <MobileNavButton
              icon={LogOut}
              label="Déconnexion"
              onClick={onLogout}
              danger
            />
          </div>
        )}
      </div>
    </nav>
  );
}

interface NavButtonProps {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  onClick: () => void;
}

function NavButton({ icon: Icon, label, active, onClick }: NavButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
        active
          ? 'bg-slate-100 text-slate-900'
          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
      }`}
    >
      <Icon className="w-4 h-4" />
      <span>{label}</span>
    </button>
  );
}

interface MobileNavButtonProps {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  onClick: () => void;
  danger?: boolean;
}

function MobileNavButton({ icon: Icon, label, active, onClick, danger }: MobileNavButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center space-x-3 px-4 py-3 text-sm font-medium transition-colors ${
        danger
          ? 'text-red-600 hover:bg-red-50'
          : active
          ? 'bg-slate-100 text-slate-900'
          : 'text-slate-600 hover:bg-slate-50'
      }`}
    >
      <Icon className="w-5 h-5" />
      <span>{label}</span>
    </button>
  );
}
