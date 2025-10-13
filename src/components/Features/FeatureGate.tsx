import { ReactNode } from 'react';
import { useFeature, useFeatureTracking } from '../../hooks/useFeature';
import type { FeatureKey } from '../../types/features';

interface FeatureGateProps {
  feature: FeatureKey;
  children: ReactNode;
  fallback?: ReactNode;
  trackOnMount?: boolean;
  trackingMetadata?: Record<string, any>;
}

export function FeatureGate({
  feature,
  children,
  fallback = null,
  trackOnMount = false,
  trackingMetadata = {}
}: FeatureGateProps) {
  const isEnabled = useFeature(feature);
  const { trackFeature } = useFeatureTracking();

  if (trackOnMount && isEnabled) {
    trackFeature(feature, 'feature_accessed', trackingMetadata);
  }

  if (!isEnabled) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

interface FeatureToggleProps {
  feature: FeatureKey;
  enabled: ReactNode;
  disabled: ReactNode;
}

export function FeatureToggle({ feature, enabled, disabled }: FeatureToggleProps) {
  const isEnabled = useFeature(feature);
  return <>{isEnabled ? enabled : disabled}</>;
}
