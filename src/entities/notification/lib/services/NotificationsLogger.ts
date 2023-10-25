import { UserInfoRecord } from '@app/entities/identity/lib';
import {
  LogAction,
  LogTrigger,
  NotificationLogsRequest,
  NotificationService,
} from '@app/shared/api';
import { isAppOnline } from '@app/shared/lib';

import NotificationQueue from './NotificationQueue';
import NotificationScheduler from './NotificationScheduler';
import {
  AppletNotificationDescribers,
  LocalEventTriggerNotification,
  NotificationDescriber,
} from '../types';

type LogPayload = {
  trigger: LogTrigger;
  action: LogAction;
  notificationDescriptions?: Array<AppletNotificationDescribers> | null;
};

function NotificationsLogger() {
  const showInConsoleAsJsonString: boolean = false;

  const showInConsoleAsObjects: boolean = false;

  const logInternal = async (payload: LogPayload) => {
    const queued: NotificationDescriber[] = NotificationQueue.get();

    const scheduled: LocalEventTriggerNotification[] =
      await NotificationScheduler.getAllScheduledNotifications();

    const email = UserInfoRecord.getEmail();

    const notificationDescriptions =
      !payload.notificationDescriptions ||
      payload.notificationDescriptions.length === 0
        ? [{}]
        : payload.notificationDescriptions;

    const notificationsInQueue = queued.length === 0 ? [{}] : queued;

    const scheduledNotifications = scheduled.length === 0 ? [{}] : scheduled;

    const request: NotificationLogsRequest = {
      actionType: `${payload.trigger} -> ${payload.action}`,
      userId: email!,
      deviceId: '1',
      notificationDescriptions: JSON.stringify(
        notificationDescriptions,
        null,
        2,
      ),
      notificationInQueue: JSON.stringify(notificationsInQueue, null, 2),
      scheduledNotifications: JSON.stringify(scheduledNotifications, null, 2),
    };

    if (showInConsoleAsJsonString) {
      console.log('notificationDescriptions', request.notificationDescriptions);
      console.log('notificationInQueue', request.notificationInQueue);
      console.log('scheduledNotifications', request.scheduledNotifications);
    }

    if (showInConsoleAsObjects) {
      console.log('notificationDescriptions', notificationDescriptions);
      console.log('notificationsInQueue', notificationsInQueue);
      console.log('scheduledNotifications', scheduledNotifications);
    }

    await NotificationService.sendNotificationLogs(request);
  };

  const log = async (payload: LogPayload) => {
    const isOnline = await isAppOnline();
    if (!isOnline) {
      console.info(
        '[NotificationsLogger.log]: Logs will not be added due to offline',
      );
      return;
    }

    try {
      await logInternal(payload);
      console.info('[NotificationsLogger.log]: Logs sent to server');
    } catch (error) {
      console.warn(
        '[NotificationsLogger.log] Error occurred while sending notification logs:\n\n' +
          error,
      );
    }
  };

  return {
    log,
  };
}

export default NotificationsLogger();
