import { useLDClient } from '@launchdarkly/react-native-client-sdk';

import { FeatureFlagArrayKeys } from './FeatureFlags.types';
import { getDefaultFeatureFlagsService } from './featureFlagsServiceInstance';
import { isDataTabHidden } from './isDataTabHidden';

export const useDataTabHidden = (appletId: string): boolean => {
  // Subscribing to the LaunchDarkly context re-renders us once flags arrive.
  // Flags load after boot, so a one-shot read on a cold start misses them.
  useLDClient();

  const flag = getDefaultFeatureFlagsService().evaluateStringArrayFlag(
    FeatureFlagArrayKeys.hideDataTabApplets,
  );

  return isDataTabHidden(flag, appletId);
};
