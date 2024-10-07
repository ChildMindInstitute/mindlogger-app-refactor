import { getDefaultLogger } from '@app/shared/lib/services/loggerInstance';

import { NotificationManager } from './NotificationManager';
import { getDefaultNotificationQueue } from '../lib/services/notificationQueueInstance';
import { getDefaultNotificationScheduler } from '../lib/services/notificationSchedulerInstance';

let instance: ReturnType<typeof NotificationManager>;
export const getDefaultNotificationManager = () => {
  if (!instance) {
    instance = NotificationManager(
      getDefaultLogger(),
      getDefaultNotificationQueue(),
      getDefaultNotificationScheduler(),
    );
  }
  return instance;
};
