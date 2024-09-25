import { getDefaultUserInfoRecord } from '@app/entities/identity/lib/userInfoRecord';
import { NotificationLogsRequest } from '@app/shared/api/services/INotificationService';
import { getDefaultNotificationService } from '@app/shared/api/services/notificationServiceInstance';
import { getDefaultSystemRecord } from '@app/shared/lib/records/systemRecordInstance';
import { ILogger } from '@app/shared/lib/types/logger';
import { getStringHashCode } from '@app/shared/lib/utils/common';
import { isAppOnline } from '@app/shared/lib/utils/networkHelpers';

import { INotificationQueue } from './INotificationQueue';
import { INotificationScheduler } from './INotificationScheduler';
import { INotificationsLogger, LogPayload } from './INotificationsLogger';
import { NotificationDescriber } from '../types/notificationBuilder';
import { LocalEventTriggerNotification } from '../types/notifications';

export function NotificationsLogger(
  logger: ILogger,
  notificationQueue: INotificationQueue,
  notificationScheduler: INotificationScheduler,
): INotificationsLogger {
  const logInternal = async (payload: LogPayload) => {
    const queued: NotificationDescriber[] = notificationQueue.get();

    const scheduled: LocalEventTriggerNotification[] =
      await notificationScheduler.getAllScheduledNotifications();

    const email = getDefaultUserInfoRecord().getEmail();

    const notificationDescriptions = payload.notificationDescriptions || null;

    const notificationInQueue = queued;

    const scheduledNotifications = scheduled;

    const deviceId = getDefaultSystemRecord().getDeviceId();

    const request: NotificationLogsRequest = {
      actionType: `${payload.trigger} -> ${payload.action}`,
      userId: email!,
      deviceId: !deviceId
        ? 'undefined'
        : getStringHashCode(deviceId).toString(),
      notificationDescriptions,
      notificationInQueue,
      scheduledNotifications,
    };

    await getDefaultNotificationService().sendNotificationLogs(request);
  };

  const log = async (payload: LogPayload) => {
    const isOnline = await isAppOnline();
    if (!isOnline) {
      logger.info(
        '[NotificationsLogger.log]: Logs will not be added due to offline',
      );
      return;
    }

    try {
      await logInternal(payload);
      logger.info('[NotificationsLogger.log]: Logs sent to server');
    } catch (error) {
      logger.warn(
        '[NotificationsLogger.log] Error occurred while sending notification logs:\n\n' +
          error,
      );
    }
  };

  return {
    log,
  };
}
