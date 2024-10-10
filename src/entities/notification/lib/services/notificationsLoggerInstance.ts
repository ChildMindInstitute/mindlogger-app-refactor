import { getDefaultLogger } from '@app/shared/lib/services/loggerInstance';

import { getDefaultNotificationQueue } from './notificationQueueInstance';
import { getDefaultNotificationScheduler } from './notificationSchedulerInstance';
import { NotificationsLogger } from './NotificationsLogger';

let instance: ReturnType<typeof NotificationsLogger>;
export const getDefaultNotificationsLogger = () => {
  if (!instance) {
    instance = NotificationsLogger(
      getDefaultLogger(),
      getDefaultNotificationQueue(),
      getDefaultNotificationScheduler(),
    );
  }
  return instance;
};
