/**
 * Supabase Client Configuration
 *
 * ⚠️ POUR LES DÉVELOPPEURS BACKEND :
 * Ce fichier configure le client Supabase (BaaS - Backend as a Service).
 *
 * Si vous migrez vers Django/autre backend :
 * 1. Vous pouvez REMPLACER ce fichier par un client API REST classique (axios/fetch)
 * 2. Ou GARDER Supabase pour l'authentification et utiliser votre DB pour le reste
 *
 * @example Remplacer par un client API REST personnalisé
 * ```typescript
 * // Créer src/lib/apiClient.ts
 * import axios from 'axios';
 * export const apiClient = axios.create({
 *   baseURL: import.meta.env.VITE_API_BASE_URL,
 *   headers: { 'Content-Type': 'application/json' }
 * });
 * ```
 *
 * Configuration actuelle :
 * - URL de l'instance Supabase (voir .env)
 * - Clé anonyme pour l'accès public (safe côté client car protégée par RLS)
 *
 * @see {@link https://supabase.com/docs/reference/javascript/introduction}
 * @module lib/supabase
 */

import { createClient } from '@supabase/supabase-js';

/**
 * URL de l'instance Supabase
 * Définie dans .env : VITE_SUPABASE_URL
 */
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

/**
 * Clé anonyme Supabase (safe côté client)
 * Définie dans .env : VITE_SUPABASE_ANON_KEY
 *
 * Note : Cette clé est publique et sécurisée par Row Level Security (RLS)
 */
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

/**
 * Validation des variables d'environnement au démarrage
 * Empêche l'app de démarrer si la config est incomplète
 */
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

/**
 * Debug log pour vérifier les variables d'environnement chargées
 * Utile pour diagnostiquer les problèmes de configuration
 */
if (import.meta.env.DEV) {
  console.log('🔧 Supabase Client Configuration:');
  console.log('  URL:', supabaseUrl);
  console.log('  Key (first 20 chars):', supabaseAnonKey?.substring(0, 20) + '...');
  console.log('  Environment:', import.meta.env.MODE);
}

/**
 * Instance singleton du client Supabase
 *
 * Utilisé dans tous les services pour :
 * - Authentification (supabase.auth.*)
 * - Requêtes base de données (supabase.from('table').*)
 * - Storage de fichiers (supabase.storage.*)
 *
 * @example
 * ```typescript
 * import { supabase } from './lib/supabase';
 * const { data } = await supabase.from('profiles').select('*');
 * ```
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
