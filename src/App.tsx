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
import JobsList from './components/Jobs/JobsList';
import ManageJobOffers from './components/Jobs/ManageJobOffers';
import ViewApplications from './components/Jobs/ViewApplications';
import MyApplications from './components/Jobs/MyApplications';
import AthleteDirectory from './components/Directory/AthleteDirectory';
import CompanyDirectory from './components/Directory/CompanyDirectory';
import { supabase } from './lib/supabase';
import InvestorsPage from './components/InvestorsPage';

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
  | 'manage-offers'
  | 'create-offer'
  | 'received-applications'
  | 'athletes-directory'
  | 'companies-directory'
  | 'messages'
  | 'notifications'
  | 'profile'
  | 'athletes-list'
  | 'athlete-detail';

function AppContent() {
  const { user, profile, loading, isAdmin, refreshProfile } = useAuth();
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
    await supabase.auth.signOut();
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

  if (view === 'landing') {
    return (
      <LandingPage
        onSignUp={() => setView('signup')}
        onSignIn={() => setView('login')}
        onNavigateToInvestors={() => setView('investors')}
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

  return (
    <>
      {showNavbar && (
        <Navbar
          currentView={view}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
        />
      )}

      {view === 'athlete-dashboard' && (
        <AthleteDashboard onNavigate={handleNavigate} />
      )}

      {view === 'company-dashboard' && (
        <CompanyDashboard onNavigate={handleNavigate} />
      )}

      {view === 'job-offers' && (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
          <JobsList />
        </div>
      )}

      {view === 'my-applications' && (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
          <MyApplications />
        </div>
      )}

      {view === 'manage-offers' && (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
          <ManageJobOffers />
        </div>
      )}

      {view === 'create-offer' && (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
          <ManageJobOffers />
        </div>
      )}

      {view === 'received-applications' && (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
          <ViewApplications />
        </div>
      )}

      {view === 'athletes-directory' && (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
          <AthleteDirectory />
        </div>
      )}

      {view === 'companies-directory' && (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
          <CompanyDirectory />
        </div>
      )}

      {view === 'messages' && (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
          <MessagesList />
        </div>
      )}

      {view === 'notifications' && (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-slate-900 mb-4">Notifications</h1>
            <p className="text-slate-600">Cette fonctionnalité sera bientôt disponible</p>
          </div>
        </div>
      )}

      {view === 'profile' && (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-slate-900 mb-4">Mon Profil</h1>
            <p className="text-slate-600">Cette fonctionnalité sera bientôt disponible</p>
          </div>
        </div>
      )}

      {view === 'athletes-list' && (
        <AthletesList onViewProfile={handleViewAthleteProfile} />
      )}

      {view === 'athlete-detail' && selectedAthleteId && (
        <AthleteDetail
          athleteId={selectedAthleteId}
          onBack={handleBackToAthletesList}
        />
      )}

      {isAuthenticated && <AgentElea />}
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
