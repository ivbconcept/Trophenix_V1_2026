import { useState, useEffect } from 'react';
import { useAuth, AuthProvider } from './contexts/AuthContext';
import { LandingPage } from './components/LandingPage';
import { LoginForm } from './components/Auth/LoginForm';
import { SignUpFlow } from './components/Auth/SignUpFlow';
import { ForgotPasswordForm } from './components/Auth/ForgotPasswordForm';
import { PendingValidation } from './components/PendingValidation';
import { AdminDashboard } from './components/Admin/AdminDashboard';
import { SuperAdminConsole } from './components/Admin/SuperAdminConsole';
import AdminLogin from './components/Auth/AdminLogin';
import { AthletesList } from './components/Athletes/AthletesList';
import { AthleteDetail } from './components/Athletes/AthleteDetail';
import { AthleteDashboard } from './components/Dashboard/AthleteDashboard';
import { CompanyDashboard } from './components/Dashboard/CompanyDashboard';
import { AgentElea } from './components/AI/AgentElea';
import { EleaPage } from './components/AI/EleaPage';
import JobsList from './components/Jobs/JobsList';
import ManageJobOffers from './components/Jobs/ManageJobOffers';
import ViewApplications from './components/Jobs/ViewApplications';
import MyApplications from './components/Jobs/MyApplications';
import AthleteDirectory from './components/Directory/AthleteDirectory';
import CompanyDirectory from './components/Directory/CompanyDirectory';
import { Navbar } from './components/Layout/Navbar';
import { MessagesList } from './components/Messages/MessagesList';
import { MessagingPage } from './components/Messages/MessagingPage';
import { EnhancedMessagingPage } from './components/Messages/EnhancedMessagingPage';
import { UserProfile } from './components/Profile/UserProfile';
import { UserSettings } from './components/Settings/UserSettings';
import { HelpPage } from './components/Help/HelpPage';
import { supabase } from './lib/supabase';
import InvestorsPage from './components/InvestorsPage';
import CVBuilder from './components/CV/CVBuilder';
import CoverLetterBuilder from './components/CV/CoverLetterBuilder';
import { SponsoringOffers } from './components/Sponsoring/SponsoringOffers';
import { MySponsoringRequests } from './components/Sponsoring/MySponsoringRequests';
import { SponsorKit } from './components/Sponsoring/SponsorKit';
import { PresentationLetter } from './components/Sponsoring/PresentationLetter';
import { MyProjects } from './components/Sponsoring/MyProjects';
import { CompetitionsListPage } from './components/Competitions/CompetitionsListPage';

type View =
  | 'landing'
  | 'investors'
  | 'login'
  | 'signup'
  | 'forgot-password'
  | 'pending'
  | 'admin'
  | 'super-admin-console'
  | 'admin-login'
  | 'athlete-dashboard'
  | 'company-dashboard'
  | 'job-offers'
  | 'my-applications'
  | 'cv-builder'
  | 'cover-letter-builder'
  | 'manage-offers'
  | 'create-offer'
  | 'received-applications'
  | 'athletes-directory'
  | 'companies-directory'
  | 'messages'
  | 'elea'
  | 'help'
  | 'notifications'
  | 'profile'
  | 'settings'
  | 'athletes-list'
  | 'athlete-detail'
  | 'sponsoring-offers'
  | 'my-sponsoring-requests'
  | 'sponsor-kit'
  | 'presentation-letter'
  | 'my-projects'
  | 'competitions'
  | 'my-competitions'
  | 'competition-applications';

function AppContent() {
  const { user, profile, loading, isAdmin, refreshProfile, signIn } = useAuth();
  const [view, setView] = useState<View>('landing');
  const [selectedAthleteId, setSelectedAthleteId] = useState<string | null>(null);

  useEffect(() => {
    const path = window.location.pathname;
    if (path === '/admin') {
      setView('admin-login');
    } else if (path === '/super-admin') {
      setView('admin-login');
    } else if (path === '/investors') {
      setView('investors');
    }
  }, []);

  useEffect(() => {
    if (!loading && user && profile) {
      const path = window.location.pathname;
      if (isAdmin && view === 'admin-login') {
        if (path === '/super-admin') {
          setView('super-admin-console');
        } else {
          setView('admin');
        }
      } else if (isAdmin && view !== 'admin' && view !== 'super-admin-console') {
        if (path === '/super-admin') {
          setView('super-admin-console');
        } else {
          setView('admin');
        }
      } else if (profile.user_type === 'athlete' && view === 'landing') {
        setView('athlete-dashboard');
      } else if (profile.user_type === 'company' && view === 'landing') {
        setView('company-dashboard');
      }
    } else if (!loading && !user && view !== 'admin-login' && view !== 'investors') {
      if (window.location.pathname !== '/admin' && window.location.pathname !== '/super-admin' && window.location.pathname !== '/investors') {
        setView('landing');
      }
    }
  }, [user, profile, loading, isAdmin]);

  const handleSignUpSuccess = async (userType: 'athlete' | 'company') => {
    await refreshProfile();
    if (userType === 'athlete') {
      setView('athlete-dashboard');
    } else {
      setView('company-dashboard');
    }
  };

  const handleViewAthleteProfile = (athleteId: string) => {
    setSelectedAthleteId(athleteId);
    setView('athlete-detail');
  };

  const handleBackToAthletesList = () => {
    setSelectedAthleteId(null);
    setView('athletes-list');
  };

  const handleLogout = async () => {
    setView('landing');
  };

  const handleNavigate = (newView: string) => {
    setView(newView as View);
  };

  const isAuthenticated = user && profile;
  const showNavbar = isAuthenticated && view !== 'admin';

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 mx-auto mb-4"></div>
          <p className="text-slate-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (view === 'admin-login') {
    return <AdminLogin onSuccess={() => setView('admin')} />;
  }

  const handleDemoLogin = async () => {
    try {
      console.log('🎯 Demo login starting...');
      const { error } = await signIn('athlete@test.com', 'test123');

      if (error) {
        console.error('❌ Demo login error:', error);
        alert('Erreur lors de la connexion démo. Veuillez réessayer.');
        return;
      }

      console.log('✅ Demo login successful');
      await refreshProfile();
      setView('athlete-dashboard');
    } catch (err) {
      console.error('❌ Demo login exception:', err);
      alert('Erreur lors de la connexion démo. Veuillez réessayer.');
    }
  };

  if (view === 'landing') {
    return (
      <LandingPage
        onSignUp={() => setView('signup')}
        onSignIn={() => setView('login')}
        onNavigateToInvestors={() => setView('investors')}
        onDemoLogin={handleDemoLogin}
      />
    );
  }

  if (view === 'investors') {
    return <InvestorsPage onBack={() => setView('landing')} />;
  }

  if (view === 'login') {
    return (
      <LoginForm
        onBack={() => setView('landing')}
        onSwitchToSignUp={() => setView('signup')}
        onForgotPassword={() => setView('forgot-password')}
      />
    );
  }

  if (view === 'forgot-password') {
    return (
      <ForgotPasswordForm
        onBack={() => setView('login')}
      />
    );
  }

  if (view === 'signup') {
    return (
      <SignUpFlow
        onBack={() => setView('landing')}
        onSuccess={handleSignUpSuccess}
      />
    );
  }

  if (view === 'pending') {
    return <PendingValidation />;
  }

  if (view === 'admin') {
    return <AdminDashboard />;
  }

  if (view === 'super-admin-console') {
    return <SuperAdminConsole />;
  }

  if (showNavbar) {
    return (
      <Navbar
        currentView={view}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
      >
        {view === 'athlete-dashboard' && (
          <AthleteDashboard onNavigate={handleNavigate} />
        )}

        {view === 'company-dashboard' && (
          <CompanyDashboard onNavigate={handleNavigate} />
        )}

        {view === 'job-offers' && <JobsList />}

        {view === 'my-applications' && <MyApplications />}

        {view === 'cv-builder' && <CVBuilder />}

        {view === 'cover-letter-builder' && <CoverLetterBuilder />}

        {view === 'sponsoring-offers' && <SponsoringOffers />}

        {view === 'my-sponsoring-requests' && <MySponsoringRequests />}

        {view === 'sponsor-kit' && <SponsorKit />}

        {view === 'presentation-letter' && <PresentationLetter />}

        {view === 'my-projects' && <MyProjects />}

        {view === 'competitions' && <CompetitionsListPage />}

        {view === 'my-competitions' && (
          <div className="p-8">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-3xl font-bold text-slate-900 mb-4">Mes Participations</h1>
              <p className="text-slate-600">Cette fonctionnalité sera bientôt disponible</p>
            </div>
          </div>
        )}

        {view === 'competition-applications' && (
          <div className="p-8">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-3xl font-bold text-slate-900 mb-4">Mes Candidatures</h1>
              <p className="text-slate-600">Cette fonctionnalité sera bientôt disponible</p>
            </div>
          </div>
        )}

        {view === 'manage-offers' && <ManageJobOffers />}

        {view === 'create-offer' && <ManageJobOffers />}

        {view === 'received-applications' && <ViewApplications />}

        {view === 'athletes-directory' && <AthleteDirectory />}

        {view === 'companies-directory' && <CompanyDirectory />}

        {view === 'messages' && <EnhancedMessagingPage />}

        {view === 'elea' && <EleaPage />}

        {view === 'help' && <HelpPage />}

        {view === 'notifications' && (
          <div className="p-8">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-3xl font-bold text-slate-900 mb-4">Notifications</h1>
              <p className="text-slate-600">Cette fonctionnalité sera bientôt disponible</p>
            </div>
          </div>
        )}

        {view === 'profile' && <UserProfile />}

        {view === 'settings' && <UserSettings />}

        {view === 'athletes-list' && (
          <AthletesList onViewProfile={handleViewAthleteProfile} />
        )}

        {view === 'athlete-detail' && selectedAthleteId && (
          <AthleteDetail
            athleteId={selectedAthleteId}
            onBack={handleBackToAthletesList}
          />
        )}

        {isAuthenticated && view !== 'messages' && view !== 'elea' && view !== 'help' && <AgentElea />}
      </Navbar>
    );
  }

  return null;
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
