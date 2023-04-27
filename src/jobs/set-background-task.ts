import { NotificationModel } from '@entities/notification';
import { BackgroundWorker, createJob } from '@shared/lib';

const { NotificationManager } = NotificationModel;

export default createJob(() => {
  return BackgroundWorker.setAndroidHeadlessTask(async () => {
    if (NotificationManager.mutex.isBusy()) {
      console.warn(
        '[BackgroundWorker.setAndroidHeadlessTask]: NotificationManagerMutex is busy. Operation rejected',
      );
      return;
    }
    try {
      NotificationManager.mutex.setBusy();

      await NotificationManager.topUpNotificationsFromQueue();

      // TODO Uncomment and modify when debug api endpoint is integrated
      // await debugScheduledNotifications({
      //   actionType: 'backgroundAddition-runBackgroundProcess',
      // });
    } catch (err) {
      console.warn(
        '[BackgroundWorker.setAndroidHeadlessTask]: Error occured. ',
        err,
      );
    } finally {
      NotificationManager.mutex.release();
    }
  });
});
