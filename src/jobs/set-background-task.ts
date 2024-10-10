import { getDefaultNotificationsLogger } from '@app/entities/notification/lib/services/notificationsLoggerInstance';
import { getDefaultNotificationManager } from '@app/entities/notification/model/notificationManagerInstance';
import {
  LogAction,
  LogTrigger,
} from '@app/shared/api/services/INotificationService';
import { getDefaultBackgroundWorker } from '@app/shared/lib/services/backgroundWorkerBuilderInstance';
import { createJob } from '@app/shared/lib/services/jobManagement';

export default createJob(() => {
  const NotificationManager = getDefaultNotificationManager();

  const handleAndroidHeadlessTask = async () => {
    if (NotificationManager.mutex.isBusy()) {
      console.warn(
        '[BackgroundWorker.setAndroidHeadlessTask]: NotificationManagerMutex is busy. Operation rejected',
      );
      return;
    }
    try {
      NotificationManager.mutex.setBusy();

      await NotificationManager.topUpNotificationsFromQueue();

      getDefaultNotificationsLogger()
        .log({
          trigger: LogTrigger.RunBackgroundProcess,
          action: LogAction.ReStack,
        })
        .catch(console.error);
    } catch (err) {
      console.warn(
        '[BackgroundWorker.setAndroidHeadlessTask]: Error occurred. ',
        err,
      );
    } finally {
      NotificationManager.mutex.release();
    }
  };

  return getDefaultBackgroundWorker().setAndroidHeadlessTask(() => {
    handleAndroidHeadlessTask().catch(console.error);
  });
});
