import { useCallback, useEffect, useState } from 'react';

import {
  FeatureFlagsKeys,
  FeatureFlags,
} from '../featureFlags/FeatureFlags.types';
import { getDefaultFeatureFlagsService } from '../featureFlags/featureFlagsServiceInstance';

export const useFeatureFlags = () => {
  const [flags, setFlags] = useState<Partial<FeatureFlags>>({});

  const onChangeHandler = useCallback(() => updateFeatureFlags(), []);

  useEffect(() => {
    getDefaultFeatureFlagsService().setChangeHandler(onChangeHandler);
    return () => {
      getDefaultFeatureFlagsService().removeChangeHandler(onChangeHandler);
    };
  }, [onChangeHandler]);

  const updateFeatureFlags = () => {
    const keys = Object.keys(
      FeatureFlagsKeys,
    ) as (keyof typeof FeatureFlagsKeys)[];

    const features: FeatureFlags = {};
    keys.forEach(
      key =>
        (features[key] = getDefaultFeatureFlagsService().evaluateFlag(
          FeatureFlagsKeys[key],
        )),
    );
    setFlags(features);
  };

  useEffect(() => {
    updateFeatureFlags();
  }, []);

  return { featureFlags: flags };
};
