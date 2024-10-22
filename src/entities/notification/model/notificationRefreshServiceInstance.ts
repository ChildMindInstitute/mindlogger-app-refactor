import { getDefaultScheduledDateCalculator } from '@app/entities/event/model/operations/scheduledDateCalculatorInstance';
import { getDefaultLogger } from '@app/shared/lib/services/loggerInstance';
import { getMutexDefaultInstanceManager } from '@app/shared/lib/utils/mutexDefaultInstanceManagerInstance';

import { getDefaultNotificationManager } from './notificationManagerInstance';
import { createNotificationRefreshService } from './NotificationRefreshService';
import { getDefaultNotificationsLogger } from '../lib/services/notificationsLoggerInstance';

let instance: ReturnType<typeof createNotificationRefreshService>;
export const getDefaultNotificationRefreshService = () => {
  if (!instance) {
    instance = createNotificationRefreshService(
      getDefaultLogger(),
      getDefaultScheduledDateCalculator(),
      getDefaultNotificationManager(),
      getDefaultNotificationsLogger(),
      getMutexDefaultInstanceManager(),
    );
  }
  return instance;
};
