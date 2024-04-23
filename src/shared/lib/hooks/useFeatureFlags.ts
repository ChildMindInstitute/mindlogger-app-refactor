import { useCallback, useEffect, useState } from 'react';

import {
  FeatureFlagsKeys,
  FeatureFlags,
} from '../featureFlags/FeatureFlags.types';
import FeatureFlagsService from '../featureFlags/FeatureFlagsService';

export const useFeatureFlags = () => {
  const [flags, setFlags] = useState<Partial<FeatureFlags>>({});

  const onChangeHandler = useCallback(() => updateFeatureFlags(), []);

  useEffect(() => {
    FeatureFlagsService.setChangeHandler(onChangeHandler);
  }, [onChangeHandler]);

  const updateFeatureFlags = () => {
    const keys = Object.keys(
      FeatureFlagsKeys,
    ) as (keyof typeof FeatureFlagsKeys)[];

    const features: FeatureFlags = {};
    keys.forEach(
      key =>
        (features[key] = FeatureFlagsService.evaluateFlag(
          FeatureFlagsKeys[key],
        )),
    );
    setFlags(features);
  };

  return { featureFlags: flags };
};

export default useFeatureFlags;
