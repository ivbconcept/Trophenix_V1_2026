import { useState, useEffect, useCallback } from 'react';
import { FeatureService } from '../services/featureService';
import type { EnabledFeature, FeatureKey } from '../types/features';
import { useAuth } from '../contexts/AuthContext';

/**
 * Check if a single feature is enabled for current user
 *
 * Usage: const eleaEnabled = useFeature('elea_ai');
 *
 * Returns false until loaded (safe for conditional rendering)
 * Re-checks when user changes (automatic)
 *
 * @example
 * const eleaEnabled = useFeature('elea_ai');
 * {eleaEnabled && <EleaButton />}
 */
export function useFeature(featureKey: FeatureKey): boolean {
  const { user } = useAuth();
  const [isEnabled, setIsEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkFeature = async () => {
      if (!user?.id) {
        setIsEnabled(false);
        setIsLoading(false);
        return;
      }

      try {
        const enabled = await FeatureService.isFeatureEnabled(featureKey, user.id);
        setIsEnabled(enabled);
      } catch (error) {
        console.error('Error checking feature:', error);
        setIsEnabled(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkFeature();
  }, [featureKey, user?.id]);

  return isEnabled;
}

/**
 * Get all enabled features for current user (batch)
 *
 * Prefer this over multiple useFeature() calls (1 query vs N queries)
 *
 * Provides:
 * - features: array of all enabled features
 * - isFeatureEnabled(key): quick check from cached list
 * - getFeaturesByCategory(cat): filter by category
 * - refreshFeatures(): force refresh after admin changes
 *
 * @example
 * const { features, isFeatureEnabled } = useFeatures();
 * const aiFeatures = getFeaturesByCategory('ai');
 */
export function useFeatures() {
  const { user } = useAuth();
  const [features, setFeatures] = useState<EnabledFeature[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshFeatures = useCallback(async () => {
    if (!user?.id) {
      setFeatures([]);
      setIsLoading(false);
      return;
    }

    try {
      const enabledFeatures = await FeatureService.getEnabledFeaturesForUser(user.id, true);
      setFeatures(enabledFeatures);
    } catch (error) {
      console.error('Error fetching features:', error);
      setFeatures([]);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    refreshFeatures();
  }, [refreshFeatures]);

  const isFeatureEnabled = useCallback(
    (featureKey: FeatureKey): boolean => {
      return features.some(f => f.feature_key === featureKey);
    },
    [features]
  );

  const getFeaturesByCategory = useCallback(
    (categoryKey: string): EnabledFeature[] => {
      return features.filter(f => f.category_key === categoryKey);
    },
    [features]
  );

  return {
    features,
    isLoading,
    isFeatureEnabled,
    getFeaturesByCategory,
    refreshFeatures
  };
}

export function useFeatureTracking() {
  const { user } = useAuth();

  const trackFeature = useCallback(
    async (featureKey: FeatureKey, eventType: string, metadata: Record<string, any> = {}) => {
      if (!user?.id) {
        return;
      }

      try {
        await FeatureService.trackFeatureUsage(featureKey, user.id, eventType, metadata);
      } catch (error) {
        console.error('Error tracking feature:', error);
      }
    },
    [user?.id]
  );

  return { trackFeature };
}
