import { getDefaultScheduledDateCalculator } from '@app/entities/event/model/operations/scheduledDateCalculatorInstance';
import { getDefaultFeatureFlagsService } from '@app/shared/lib/featureFlags/featureFlagsServiceInstance';
import { getDefaultLogger } from '@app/shared/lib/services/loggerInstance';

import { createActivityGroupsBuildManager } from './ActivityGroupsBuildManager';

let instance: ReturnType<typeof createActivityGroupsBuildManager>;
export const getDefaultActivityGroupsBuildManager = () => {
  if (!instance) {
    instance = createActivityGroupsBuildManager(
      getDefaultLogger(),
      getDefaultScheduledDateCalculator(),
      getDefaultFeatureFlagsService(),
    );
  }
  return instance;
};
