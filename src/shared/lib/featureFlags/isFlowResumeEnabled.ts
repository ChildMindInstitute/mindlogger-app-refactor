import { FeatureFlagsKeys } from './FeatureFlags.types';
import { getDefaultFeatureFlagsService } from './featureFlagsServiceInstance';

/**
 * Check if flow resume (cross-device sync) is enabled for a specific applet.
 * @returns true if the flag contains '*' or the specific applet ID
 */
export const isFlowResumeEnabled = (appletId: string): boolean => {
  const flag = getDefaultFeatureFlagsService().evaluateFlagArray(
    FeatureFlagsKeys.enableCrossDeviceFlowSync,
  );
  return flag.includes('*') || flag.includes(appletId);
};
