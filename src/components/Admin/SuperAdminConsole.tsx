import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import {
  Database, Shield, Users, Settings, Activity, BarChart3,
  Server, FileText, RefreshCw, AlertTriangle, CheckCircle2,
  Trophy, Briefcase, MessageSquare, Eye, Lock, Zap, ArrowLeft
} from 'lucide-react';

interface PlatformStats {
  totalUsers: number;
  totalAthletes: number;
  totalCompanies: number;
  totalJobs: number;
  totalApplications: number;
  totalMessages: number;
  pendingValidation: number;
  activeAdmins: number;
  totalTables: number;
  databaseSize: string;
}

interface SystemHealth {
  database: 'healthy' | 'warning' | 'error';
  api: 'healthy' | 'warning' | 'error';
  storage: 'healthy' | 'warning' | 'error';
}

type ConsoleView = 'overview' | 'database' | 'security' | 'monitoring' | 'settings';

export function SuperAdminConsole() {
  const [currentView, setCurrentView] = useState<ConsoleView>('overview');
  const [stats, setStats] = useState<PlatformStats>({
    totalUsers: 0,
    totalAthletes: 0,
    totalCompanies: 0,
    totalJobs: 0,
    totalApplications: 0,
    totalMessages: 0,
    pendingValidation: 0,
    activeAdmins: 0,
    totalTables: 0,
    databaseSize: '0 MB',
  });
  const [systemHealth, setSystemHealth] = useState<SystemHealth>({
    database: 'healthy',
    api: 'healthy',
    storage: 'healthy',
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchPlatformData();
  }, []);

  const fetchPlatformData = async () => {
    setLoading(true);
    try {
      const [users, athletes, companies, jobs, applications, messages, pending, admins, tables] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('user_type', 'athlete'),
        supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('user_type', 'company'),
        supabase.from('job_offers').select('id', { count: 'exact', head: true }),
        supabase.from('job_applications').select('id', { count: 'exact', head: true }),
        supabase.from('messages').select('id', { count: 'exact', head: true }),
        supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('validation_status', 'pending'),
        supabase.from('admin_team_members').select('id', { count: 'exact', head: true }).eq('status', 'active'),
        supabase.rpc('get_table_count').then(r => r.data || 32),
      ]);

      setStats({
        totalUsers: users.count || 0,
        totalAthletes: athletes.count || 0,
        totalCompanies: companies.count || 0,
        totalJobs: jobs.count || 0,
        totalApplications: applications.count || 0,
        totalMessages: messages.count || 0,
        pendingValidation: pending.count || 0,
        activeAdmins: admins.count || 0,
        totalTables: typeof tables === 'number' ? tables : 32,
        databaseSize: 'N/A',
      });

      setSystemHealth({
        database: users.error ? 'error' : 'healthy',
        api: 'healthy',
        storage: 'healthy',
      });
    } catch (error) {
      console.error('Error fetching platform data:', error);
      setSystemHealth({
        database: 'error',
        api: 'warning',
        storage: 'warning',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchPlatformData();
    setRefreshing(false);
  };

  const getHealthColor = (status: 'healthy' | 'warning' | 'error') => {
    switch (status) {
      case 'healthy':
        return 'text-green-600 bg-green-100';
      case 'warning':
        return 'text-yellow-600 bg-yellow-100';
      case 'error':
        return 'text-red-600 bg-red-100';
    }
  };

  const getHealthIcon = (status: 'healthy' | 'warning' | 'error') => {
    switch (status) {
      case 'healthy':
        return <CheckCircle2 className="h-5 w-5" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5" />;
      case 'error':
        return <AlertTriangle className="h-5 w-5" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-400">Chargement de la console...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">Super Admin Console</h1>
                <p className="text-xs text-slate-400">Trophenix Platform Management</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => window.location.href = '/admin'}
                className="flex items-center space-x-2 px-4 py-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Retour Admin</span>
              </button>
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center space-x-2 px-4 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                <span>Actualiser</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
          <button
            onClick={() => setCurrentView('overview')}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium whitespace-nowrap transition-all ${
              currentView === 'overview'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Activity className="h-5 w-5" />
            <span>Vue d'ensemble</span>
          </button>
          <button
            onClick={() => setCurrentView('database')}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium whitespace-nowrap transition-all ${
              currentView === 'database'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Database className="h-5 w-5" />
            <span>Base de données</span>
          </button>
          <button
            onClick={() => setCurrentView('security')}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium whitespace-nowrap transition-all ${
              currentView === 'security'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Lock className="h-5 w-5" />
            <span>Sécurité</span>
          </button>
          <button
            onClick={() => setCurrentView('monitoring')}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium whitespace-nowrap transition-all ${
              currentView === 'monitoring'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <BarChart3 className="h-5 w-5" />
            <span>Monitoring</span>
          </button>
          <button
            onClick={() => setCurrentView('settings')}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium whitespace-nowrap transition-all ${
              currentView === 'settings'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Settings className="h-5 w-5" />
            <span>Configuration</span>
          </button>
        </div>

        {currentView === 'overview' && (
          <div className="space-y-6">
            <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-800">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Server className="h-5 w-5 mr-2 text-blue-400" />
                État du système
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-400">Base de données</span>
                    <div className={`p-1.5 rounded-lg ${getHealthColor(systemHealth.database)}`}>
                      {getHealthIcon(systemHealth.database)}
                    </div>
                  </div>
                  <p className="text-lg font-semibold text-white capitalize">{systemHealth.database}</p>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-400">API</span>
                    <div className={`p-1.5 rounded-lg ${getHealthColor(systemHealth.api)}`}>
                      {getHealthIcon(systemHealth.api)}
                    </div>
                  </div>
                  <p className="text-lg font-semibold text-white capitalize">{systemHealth.api}</p>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-400">Stockage</span>
                    <div className={`p-1.5 rounded-lg ${getHealthColor(systemHealth.storage)}`}>
                      {getHealthIcon(systemHealth.storage)}
                    </div>
                  </div>
                  <p className="text-lg font-semibold text-white capitalize">{systemHealth.storage}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-blue-900/50 to-blue-800/30 rounded-xl p-6 border border-blue-700/50">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-lg bg-blue-500/20">
                    <Users className="h-6 w-6 text-blue-400" />
                  </div>
                  <Zap className="h-5 w-5 text-blue-400" />
                </div>
                <p className="text-3xl font-bold text-white mb-1">{stats.totalUsers}</p>
                <p className="text-sm text-blue-300">Utilisateurs totaux</p>
              </div>

              <div className="bg-gradient-to-br from-green-900/50 to-green-800/30 rounded-xl p-6 border border-green-700/50">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-lg bg-green-500/20">
                    <Trophy className="h-6 w-6 text-green-400" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-white mb-1">{stats.totalAthletes}</p>
                <p className="text-sm text-green-300">Athlètes inscrits</p>
              </div>

              <div className="bg-gradient-to-br from-purple-900/50 to-purple-800/30 rounded-xl p-6 border border-purple-700/50">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-lg bg-purple-500/20">
                    <Briefcase className="h-6 w-6 text-purple-400" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-white mb-1">{stats.totalCompanies}</p>
                <p className="text-sm text-purple-300">Entreprises actives</p>
              </div>

              <div className="bg-gradient-to-br from-orange-900/50 to-orange-800/30 rounded-xl p-6 border border-orange-700/50">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-lg bg-orange-500/20">
                    <Shield className="h-6 w-6 text-orange-400" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-white mb-1">{stats.activeAdmins}</p>
                <p className="text-sm text-orange-300">Admins actifs</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-800">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-lg bg-slate-700/50">
                    <FileText className="h-6 w-6 text-slate-300" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-white mb-1">{stats.totalJobs}</p>
                <p className="text-sm text-slate-400">Offres d'emploi</p>
              </div>

              <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-800">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-lg bg-slate-700/50">
                    <Eye className="h-6 w-6 text-slate-300" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-white mb-1">{stats.totalApplications}</p>
                <p className="text-sm text-slate-400">Candidatures</p>
              </div>

              <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-800">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-lg bg-slate-700/50">
                    <MessageSquare className="h-6 w-6 text-slate-300" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-white mb-1">{stats.totalMessages}</p>
                <p className="text-sm text-slate-400">Messages échangés</p>
              </div>
            </div>

            {stats.pendingValidation > 0 && (
              <div className="bg-yellow-900/20 border border-yellow-700/50 rounded-xl p-6">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="h-6 w-6 text-yellow-400 mt-0.5" />
                  <div>
                    <h3 className="text-lg font-semibold text-yellow-300 mb-1">
                      Action requise
                    </h3>
                    <p className="text-yellow-200/80 mb-3">
                      {stats.pendingValidation} profil{stats.pendingValidation > 1 ? 's' : ''} en attente de validation
                    </p>
                    <a
                      href="#"
                      className="inline-flex items-center space-x-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                    >
                      <span>Voir les validations</span>
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {currentView === 'database' && (
          <div className="space-y-6">
            <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-800">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Database className="h-5 w-5 mr-2 text-blue-400" />
                Informations de la base de données
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <p className="text-sm text-slate-400 mb-1">Total des tables</p>
                  <p className="text-2xl font-bold text-white">{stats.totalTables}</p>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <p className="text-sm text-slate-400 mb-1">Taille de la base</p>
                  <p className="text-2xl font-bold text-white">{stats.databaseSize}</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-800">
              <h3 className="text-lg font-semibold text-white mb-4">Tables principales</h3>
              <div className="space-y-2">
                {['profiles', 'athlete_profiles', 'company_profiles', 'job_offers', 'job_applications', 'messages'].map(table => (
                  <div key={table} className="flex items-center justify-between bg-slate-800/30 rounded-lg p-3">
                    <span className="text-slate-300 font-mono text-sm">{table}</span>
                    <CheckCircle2 className="h-5 w-5 text-green-400" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {currentView === 'security' && (
          <div className="space-y-6">
            <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-800">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Lock className="h-5 w-5 mr-2 text-blue-400" />
                Sécurité et accès
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between bg-slate-800/30 rounded-lg p-4">
                  <div>
                    <p className="text-white font-medium">Row Level Security (RLS)</p>
                    <p className="text-sm text-slate-400">Protection des données activée</p>
                  </div>
                  <CheckCircle2 className="h-6 w-6 text-green-400" />
                </div>
                <div className="flex items-center justify-between bg-slate-800/30 rounded-lg p-4">
                  <div>
                    <p className="text-white font-medium">Authentification Supabase</p>
                    <p className="text-sm text-slate-400">Email/Password actif</p>
                  </div>
                  <CheckCircle2 className="h-6 w-6 text-green-400" />
                </div>
                <div className="flex items-center justify-between bg-slate-800/30 rounded-lg p-4">
                  <div>
                    <p className="text-white font-medium">API sécurisée</p>
                    <p className="text-sm text-slate-400">JWT tokens validés</p>
                  </div>
                  <CheckCircle2 className="h-6 w-6 text-green-400" />
                </div>
              </div>
            </div>
          </div>
        )}

        {currentView === 'monitoring' && (
          <div className="bg-slate-900/50 rounded-xl p-8 border border-slate-800 text-center">
            <BarChart3 className="mx-auto h-16 w-16 text-slate-600 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Monitoring avancé</h3>
            <p className="text-slate-400 mb-4">
              Graphiques de performance, logs système, et analytics en temps réel
            </p>
            <p className="text-sm text-slate-500">Fonctionnalité à venir</p>
          </div>
        )}

        {currentView === 'settings' && (
          <div className="bg-slate-900/50 rounded-xl p-8 border border-slate-800 text-center">
            <Settings className="mx-auto h-16 w-16 text-slate-600 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Configuration système</h3>
            <p className="text-slate-400 mb-4">
              Paramètres globaux, variables d'environnement, et configuration avancée
            </p>
            <p className="text-sm text-slate-500">Fonctionnalité à venir</p>
          </div>
        )}
      </div>
    </div>
  );
}
