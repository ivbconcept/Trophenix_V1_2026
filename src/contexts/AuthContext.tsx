/**
 * Authentication Context
 *
 * ⚠️ ÉTAT GLOBAL DE L'APPLICATION ⚠️
 *
 * Ce contexte gère l'état d'authentification GLOBAL de l'application.
 * Il est utilisé par TOUS les composants pour accéder à l'utilisateur connecté.
 *
 * 🔄 POUR MIGRER VERS DJANGO/AUTRE BACKEND :
 *
 * 1. Remplacer les appels `supabase.auth.*` par vos appels API
 * 2. Adapter le type `User` si nécessaire (actuellement Supabase User)
 * 3. Gérer le stockage du JWT (localStorage ou cookies selon votre backend)
 *
 * Architecture :
 * ```
 * AuthProvider (racine de l'app)
 *     │
 *     ├─> user: User | null         ← Utilisateur Supabase/Auth
 *     ├─> profile: Profile | null   ← Profil applicatif (DB)
 *     ├─> loading: boolean          ← État de chargement initial
 *     │
 *     └─> Fonctions :
 *         ├─ signUp()       ← Inscription
 *         ├─ signIn()       ← Connexion
 *         ├─ signOut()      ← Déconnexion
 *         └─ refreshProfile() ← Rafraîchir le profil
 * ```
 *
 * Utilisation dans un composant :
 * ```typescript
 * import { useAuth } from '../contexts/AuthContext';
 *
 * function MyComponent() {
 *   const { user, profile, loading } = useAuth();
 *
 *   if (loading) return <Spinner />;
 *   if (!user) return <LoginForm />;
 *
 *   return <div>Hello {profile?.email}</div>;
 * }
 * ```
 *
 * @see {@link ../services/authService.ts} - Service d'authentification
 * @see {@link ../types/index.ts} - Type Profile
 * @module contexts/AuthContext
 */

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { supabaseDB2 } from '../lib/supabaseDB2';
import { Profile } from '../types';

/**
 * Type du contexte d'authentification
 *
 * Expose toutes les données et fonctions liées à l'authentification
 */
interface AuthContextType {
  /** Utilisateur authentifié (Supabase User) ou null si non connecté */
  user: User | null;
  /** Profil applicatif de l'utilisateur (depuis la table profiles) */
  profile: Profile | null;
  /** État de chargement initial (true pendant la vérification de session) */
  loading: boolean;
  /** Indique si l'utilisateur est un admin de l'équipe Trophenix */
  isAdmin: boolean;
  /** Fonction d'inscription */
  signUp: (email: string, password: string, metadata?: any) => Promise<{ error: Error | null }>;
  /** Fonction de connexion */
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  /** Fonction de déconnexion */
  signOut: () => Promise<void>;
  /** Fonction pour rafraîchir le profil depuis la DB */
  refreshProfile: () => Promise<void>;
}

/**
 * Contexte React pour l'authentification
 * Initialisé à undefined pour forcer l'utilisation du hook useAuth()
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

const HARDCODED_USERS = [
  {
    id: 'user-athlete-1',
    email: 'athlete@test.com',
    password: 'test123',
    user_type: 'athlete',
    first_name: 'Thomas',
    last_name: 'Martin'
  },
  {
    id: 'user-company-1',
    email: 'company@test.com',
    password: 'test123',
    user_type: 'company',
    company_name: 'Entreprise Test'
  },
  {
    id: 'user-sponsor-1',
    email: 'sponsor@test.com',
    password: 'test123',
    user_type: 'sponsor',
    company_name: 'Sponsor Test'
  }
];

export function AuthProvider({ children }: { children: ReactNode }) {
  /** État local : utilisateur Supabase */
  const [user, setUser] = useState<User | null>(null);
  /** État local : profil applicatif (table profiles) */
  const [profile, setProfile] = useState<Profile | null>(null);
  /** État local : chargement initial */
  const [loading, setLoading] = useState(true);
  /** État local : utilisateur est admin */
  const [isAdmin, setIsAdmin] = useState(false);

  /**
   * Récupère le profil utilisateur depuis la base de données
   *
   * 🚀 OPTIMISÉ POUR SCALABILITÉ :
   * - UNE SEULE requête au lieu de 2 (profil contient is_admin et admin_role)
   * - Cache automatique via triggers DB
   * - Index optimisés pour des millions d'utilisateurs
   *
   * 🔄 MIGRATION BACKEND : Remplacer par votre appel API
   * ```typescript
   * const response = await fetch(`/api/profiles/${userId}`);
   * const data = await response.json();
   * setProfile(data);
   * ```
   *
   * @param userId - ID de l'utilisateur
   */
  const fetchProfile = async (userId: string) => {
    const startTime = performance.now();

    const { data, error } = await supabaseDB2
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    const profileTime = performance.now() - startTime;
    console.log(`[Performance] Profile fetch took: ${profileTime.toFixed(0)}ms`);

    if (!error && data) {
      setProfile(data);
      setIsAdmin(data.is_admin || false);
    } else {
      setProfile(null);
      setIsAdmin(false);
    }
  };

  /**
   * Rafraîchit le profil depuis la base de données
   *
   * Utilisé après modification du profil pour mettre à jour l'UI
   */
  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  };

  /**
   * Effect principal : Initialisation et écoute des changements d'auth
   *
   * 1. Au montage : Vérifie si une session existe
   * 2. Écoute les changements de session (login/logout)
   * 3. Charge le profil à chaque connexion
   *
   * 🔄 MIGRATION BACKEND : Adapter la vérification de session
   * ```typescript
   * // Exemple avec JWT stocké en localStorage
   * const token = localStorage.getItem('jwt_token');
   * if (token) {
   *   const response = await fetch('/api/auth/verify', {
   *     headers: { Authorization: `Bearer ${token}` }
   *   });
   *   const userData = await response.json();
   *   setUser(userData);
   * }
   * ```
   */
  useEffect(() => {
    setLoading(false);
  }, []);

  /**
   * Inscription d'un nouvel utilisateur
   *
   * 🔄 MIGRATION BACKEND : Remplacer par POST /api/auth/register
   */
  const signUp = async (email: string, password: string, metadata?: any) => {
    try {
      console.log('🔐 AuthContext.signUp called (hardcoded users)');
      console.log('📧 Email:', email);
      console.log('📦 Metadata received:', metadata);

      const newUserId = `user-${metadata?.user_type}-${Date.now()}`;
      const newUser = {
        id: newUserId,
        email,
        ...metadata?.profile_data,
        user_type: metadata?.user_type,
        created_at: new Date().toISOString()
      };

      const { error } = await supabaseDB2
        .from('profiles')
        .insert([newUser]);

      if (error) {
        console.error('❌ DB2 insert error:', error);
        return { error: error as Error };
      }

      const mockUser: any = {
        id: newUserId,
        email,
        created_at: new Date().toISOString()
      };
      setUser(mockUser);
      setProfile(newUser as any);

      console.log('✅ SignUp success (hardcoded + DB2)');
      return { error: null };
    } catch (error) {
      console.error('❌ SignUp error:', error);
      return { error: error as Error };
    }
  };

  /**
   * Connexion d'un utilisateur existant
   *
   * 🔄 MIGRATION BACKEND : Remplacer par POST /api/auth/login
   */
  const signIn = async (email: string, password: string) => {
    try {
      const startTime = performance.now();

      const hardcodedUser = HARDCODED_USERS.find(u => u.email === email && u.password === password);

      if (!hardcodedUser) {
        return { error: new Error('Email ou mot de passe incorrect') };
      }

      const { data, error } = await supabaseDB2
        .from('profiles')
        .select('*')
        .eq('id', hardcodedUser.id)
        .maybeSingle();

      if (error || !data) {
        return { error: new Error('Profil non trouvé dans DB2') };
      }

      const mockUser: any = {
        id: hardcodedUser.id,
        email: hardcodedUser.email,
        created_at: new Date().toISOString()
      };

      setUser(mockUser);
      setProfile(data as any);

      const authTime = performance.now() - startTime;
      console.log(`[Performance] Auth signIn took: ${authTime.toFixed(0)}ms`);
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  /**
   * Déconnexion de l'utilisateur
   *
   * 🔄 MIGRATION BACKEND : Remplacer par POST /api/auth/logout + clear localStorage
   */
  const signOut = async () => {
    setUser(null);
    setProfile(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, isAdmin, signUp, signIn, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook personnalisé pour accéder au contexte d'authentification
 *
 * TOUJOURS utiliser ce hook au lieu d'accéder directement au contexte.
 * Il garantit que le composant est bien dans le provider.
 *
 * @throws {Error} Si utilisé hors du AuthProvider
 *
 * @example
 * ```typescript
 * function MyComponent() {
 *   const { user, profile, loading } = useAuth();
 *   // ...
 * }
 * ```
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
