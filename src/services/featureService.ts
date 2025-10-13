import { supabase } from '../lib/supabase';
import type {
  FeatureCategory,
  FeatureVersion,
  FeatureFlag,
  EnabledFeature,
  FeatureStats,
  UserFeatureAccess,
  FeatureKey
} from '../types/features';

/**
 * FeatureFlagsService - Core service for feature flag management
 *
 * Responsibilities:
 * - Manage feature flags, categories, and versions
 * - Control feature rollout (0-100%) and beta testing
 * - Track feature usage analytics
 * - Cache enabled features per user (5min TTL)
 *
 * Architecture decisions:
 * - Singleton pattern for shared cache across app
 * - Per-user cache to minimize DB queries
 * - SQL functions in DB for complex logic (performance)
 *
 * Performance notes:
 * - Cache reduces DB load significantly (5min TTL)
 * - isFeatureEnabled() returns false on error (fail-safe)
 * - trackFeatureUsage() is fire-and-forget (non-blocking)
 *
 * Migration notes:
 * - When migrating to custom backend, replace supabase.rpc() with API calls
 * - Keep cache logic intact (backend-agnostic)
 *
 * @singleton
 */
class FeatureFlagsService {
  private enabledFeaturesCache: Map<string, EnabledFeature[]> = new Map();
  private cacheExpiry: Map<string, number> = new Map();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes - balance between freshness and performance

  async getAllCategories(): Promise<FeatureCategory[]> {
    const { data, error } = await supabase
      .from('feature_categories')
      .select('*')
      .order('display_order');

    if (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }

    return data || [];
  }

  async getAllVersions(): Promise<FeatureVersion[]> {
    const { data, error } = await supabase
      .from('feature_versions')
      .select('*')
      .order('version_number');

    if (error) {
      console.error('Error fetching versions:', error);
      throw error;
    }

    return data || [];
  }

  async getCurrentVersion(): Promise<FeatureVersion | null> {
    const { data, error } = await supabase
      .from('feature_versions')
      .select('*')
      .eq('is_current', true)
      .maybeSingle();

    if (error) {
      console.error('Error fetching current version:', error);
      throw error;
    }

    return data;
  }

  async getAllFeatures(): Promise<FeatureFlag[]> {
    const { data, error } = await supabase
      .from('feature_flags')
      .select('*')
      .order('display_name');

    if (error) {
      console.error('Error fetching features:', error);
      throw error;
    }

    return data || [];
  }

  async getFeaturesByCategory(categoryId: string): Promise<FeatureFlag[]> {
    const { data, error } = await supabase
      .from('feature_flags')
      .select('*')
      .eq('category_id', categoryId)
      .order('display_name');

    if (error) {
      console.error('Error fetching features by category:', error);
      throw error;
    }

    return data || [];
  }

  async getFeaturesByVersion(version: string): Promise<FeatureFlag[]> {
    const { data, error } = await supabase
      .from('feature_flags')
      .select('*')
      .eq('target_version', version)
      .order('display_name');

    if (error) {
      console.error('Error fetching features by version:', error);
      throw error;
    }

    return data || [];
  }

  /**
   * Check if a feature is enabled for a specific user
   *
   * Handles:
   * - Global enable/disable flag
   * - Rollout percentage (deterministic hash-based)
   * - Beta access grants
   * - Explicit blocks
   *
   * @returns false on error (fail-safe: hide features if unsure)
   */
  async isFeatureEnabled(featureKey: FeatureKey, userId: string): Promise<boolean> {
    const { data, error } = await supabase.rpc('is_feature_enabled_for_user', {
      feature_key_param: featureKey,
      user_id_param: userId
    });

    if (error) {
      console.error('Error checking feature status:', error);
      return false; // Fail-safe: hide feature if DB error
    }

    return data === true;
  }

  /**
   * Get all enabled features for a user (with cache)
   *
   * Cache strategy:
   * - Per-user in-memory cache (5min TTL)
   * - Reduces DB load from O(n_requests) to O(1) per 5min
   * - Use forceRefresh after admin changes
   *
   * Performance impact:
   * - Typical app: 1 DB query per user per 5min instead of per page load
   * - 10k active users: 2k queries/min → 33 queries/min (60x reduction)
   *
   * @param forceRefresh - Bypass cache (use after feature flag changes)
   */
  async getEnabledFeaturesForUser(userId: string, forceRefresh = false): Promise<EnabledFeature[]> {
    const now = Date.now();
    const cachedExpiry = this.cacheExpiry.get(userId);

    if (!forceRefresh && cachedExpiry && now < cachedExpiry) {
      const cached = this.enabledFeaturesCache.get(userId);
      if (cached) {
        return cached;
      }
    }

    const { data, error } = await supabase.rpc('get_enabled_features_for_user', {
      user_id_param: userId
    });

    if (error) {
      console.error('Error fetching enabled features:', error);
      throw error;
    }

    const features = data || [];
    this.enabledFeaturesCache.set(userId, features);
    this.cacheExpiry.set(userId, now + this.CACHE_DURATION);

    return features;
  }

  /**
   * Track feature usage for analytics (fire-and-forget)
   *
   * Note: Errors are silently ignored to not block user experience
   * Use for: click events, feature access, engagement metrics
   *
   * @example trackFeatureUsage('elea_ai', userId, 'message_sent', { length: 150 })
   */
  async trackFeatureUsage(
    featureKey: FeatureKey,
    userId: string,
    eventType: string,
    metadata: Record<string, any> = {}
  ): Promise<void> {
    const { data: feature } = await supabase
      .from('feature_flags')
      .select('id')
      .eq('feature_key', featureKey)
      .maybeSingle();

    if (!feature) {
      return; // Silently fail if feature doesn't exist (avoid blocking UX)
    }

    await supabase.from('feature_usage_analytics').insert({
      feature_id: feature.id,
      user_id: userId,
      event_type: eventType,
      metadata
    });
  }

  async getFeatureStats(featureKey: FeatureKey): Promise<FeatureStats | null> {
    const { data, error } = await supabase.rpc('get_feature_stats', {
      feature_key_param: featureKey
    });

    if (error) {
      console.error('Error fetching feature stats:', error);
      return null;
    }

    return data?.[0] || null;
  }

  async updateFeatureStatus(featureId: string, isEnabled: boolean): Promise<void> {
    const { error } = await supabase
      .from('feature_flags')
      .update({ is_enabled: isEnabled })
      .eq('id', featureId);

    if (error) {
      console.error('Error updating feature status:', error);
      throw error;
    }

    this.clearCache();
  }

  async updateFeatureRollout(featureId: string, rolloutPercentage: number): Promise<void> {
    const { error } = await supabase
      .from('feature_flags')
      .update({ rollout_percentage: rolloutPercentage })
      .eq('id', featureId);

    if (error) {
      console.error('Error updating rollout:', error);
      throw error;
    }

    this.clearCache();
  }

  async grantBetaAccess(
    featureKey: FeatureKey,
    userId: string,
    grantedBy: string,
    accessType: 'beta' | 'early_access' | 'preview' = 'beta',
    expiresAt?: string
  ): Promise<void> {
    const { data: feature } = await supabase
      .from('feature_flags')
      .select('id')
      .eq('feature_key', featureKey)
      .maybeSingle();

    if (!feature) {
      throw new Error('Feature not found');
    }

    const { error } = await supabase.from('user_feature_access').upsert({
      feature_id: feature.id,
      user_id: userId,
      access_type: accessType,
      granted_by: grantedBy,
      expires_at: expiresAt || null
    });

    if (error) {
      console.error('Error granting beta access:', error);
      throw error;
    }

    this.clearCacheForUser(userId);
  }

  async revokeBetaAccess(featureKey: FeatureKey, userId: string): Promise<void> {
    const { data: feature } = await supabase
      .from('feature_flags')
      .select('id')
      .eq('feature_key', featureKey)
      .maybeSingle();

    if (!feature) {
      throw new Error('Feature not found');
    }

    const { error } = await supabase
      .from('user_feature_access')
      .delete()
      .eq('feature_id', feature.id)
      .eq('user_id', userId);

    if (error) {
      console.error('Error revoking beta access:', error);
      throw error;
    }

    this.clearCacheForUser(userId);
  }

  async getUserBetaAccess(userId: string): Promise<UserFeatureAccess[]> {
    const { data, error } = await supabase
      .from('user_feature_access')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching user beta access:', error);
      throw error;
    }

    return data || [];
  }

  clearCache(): void {
    this.enabledFeaturesCache.clear();
    this.cacheExpiry.clear();
  }

  clearCacheForUser(userId: string): void {
    this.enabledFeaturesCache.delete(userId);
    this.cacheExpiry.delete(userId);
  }

  async scheduleFeatureEnable(
    featureId: string,
    enableDate: string
  ): Promise<void> {
    const { error } = await supabase
      .from('feature_flags')
      .update({ enable_date: enableDate })
      .eq('id', featureId);

    if (error) {
      console.error('Error scheduling feature:', error);
      throw error;
    }
  }

  async getFeatureWithDetails(featureKey: FeatureKey): Promise<FeatureFlag | null> {
    const { data, error } = await supabase
      .from('feature_flags')
      .select('*')
      .eq('feature_key', featureKey)
      .maybeSingle();

    if (error) {
      console.error('Error fetching feature details:', error);
      return null;
    }

    return data;
  }

  async setCurrentVersion(versionId: string): Promise<void> {
    await supabase
      .from('feature_versions')
      .update({ is_current: false })
      .neq('id', versionId);

    const { error } = await supabase
      .from('feature_versions')
      .update({ is_current: true })
      .eq('id', versionId);

    if (error) {
      console.error('Error setting current version:', error);
      throw error;
    }

    this.clearCache();
  }
}

export const FeatureService = new FeatureFlagsService();
