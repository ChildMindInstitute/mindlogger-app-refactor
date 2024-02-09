import NotificationsLogger from '@app/entities/notification/lib/services/NotificationsLogger';
import { LogAction, LogTrigger } from '@app/shared/api';
import { NotificationModel } from '@entities/notification';
import { BackgroundWorker, createJob } from '@shared/lib';

const { NotificationManager } = NotificationModel;

export default createJob(() => {
  return BackgroundWorker.setAndroidHeadlessTask(async () => {
    if (NotificationManager.mutex.isBusy()) {
      console.warn('[BackgroundWorker.setAndroidHeadlessTask]: NotificationManagerMutex is busy. Operation rejected');
      return;
    }
    try {
      NotificationManager.mutex.setBusy();

      await NotificationManager.topUpNotificationsFromQueue();

      NotificationsLogger.log({
        trigger: LogTrigger.RunBackgroundProcess,
        action: LogAction.ReStack,
      });
    } catch (err) {
      console.warn('[BackgroundWorker.setAndroidHeadlessTask]: Error occurred. ', err);
    } finally {
      NotificationManager.mutex.release();
    }
  });
});
