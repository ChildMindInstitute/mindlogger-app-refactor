import { getDefaultScheduledDateCalculator } from '@app/entities/event/model/operations/scheduledDateCalculatorInstance';
import { getDefaultLogger } from '@app/shared/lib/services/loggerInstance';

import { createActivityGroupsBuildManager } from './ActivityGroupsBuildManager';

let instance: ReturnType<typeof createActivityGroupsBuildManager>;
export const getDefaultActivityGroupsBuildManager = () => {
  if (!instance) {
    instance = createActivityGroupsBuildManager(
      getDefaultLogger(),
      getDefaultScheduledDateCalculator(),
    );
  }
  return instance;
};
