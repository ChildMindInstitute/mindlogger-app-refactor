import { TimestampTrigger } from '@notifee/react-native';

import { ILogger } from '@app/shared/lib/types/logger';
import { splitArray, Mutex } from '@app/shared/lib/utils/common';

import { INotificationManager } from './INotificationManager';
import { mapToTriggerNotifications } from './mappers/mapToTriggerNotifications';
import {
  MAX_SCHEDULED_NOTIFICATIONS_SIZE,
  SYSTEM_NOTIFICATION_DELAY,
} from '../lib/constants';
import { INotificationQueue } from '../lib/services/INotificationQueue';
import { INotificationScheduler } from '../lib/services/INotificationScheduler';
import { NotificationDescriber } from '../lib/types/notificationBuilder';
import { LocalEventTriggerNotification } from '../lib/types/notifications';

function filterNotificationsByDate(
  notifications: NotificationDescriber[],
  date: number,
) {
  return notifications.filter(notification => {
    return notification.scheduledAt > date;
  });
}

export function NotificationManager(
  logger: ILogger,
  notificationQueue: INotificationQueue,
  notificationScheduler: INotificationScheduler,
): INotificationManager {
  async function restackNotifications(
    notifications: NotificationDescriber[],
    amount: number,
  ) {
    const [notificationsToSchedule, notificationsToQueue] = splitArray(
      notifications,
      amount,
    );

    notificationQueue.set(notificationsToQueue);

    const triggerNotifications = await mapToTriggerNotifications(
      notificationsToSchedule,
    );

    for (const notification of triggerNotifications) {
      await notificationScheduler.scheduleLocalNotification(notification);
    }

    const shouldCreateSystemIOSNotification =
      triggerNotifications.length === MAX_SCHEDULED_NOTIFICATIONS_SIZE;

    if (!shouldCreateSystemIOSNotification) {
      return;
    }

    const lastTriggerNotification =
      triggerNotifications[triggerNotifications.length - 1];

    const systemNotificationDate =
      (lastTriggerNotification.trigger as TimestampTrigger).timestamp +
      SYSTEM_NOTIFICATION_DELAY;

    await notificationScheduler.scheduleSystemIOSNotification(
      systemNotificationDate,
    );
  }

  async function scheduleNotifications(notifications: NotificationDescriber[]) {
    await notificationScheduler.cancelNotDisplayedNotifications();
    await restackNotifications(notifications, MAX_SCHEDULED_NOTIFICATIONS_SIZE);
  }

  async function topUpNotificationsFromQueue() {
    const scheduledNotifications =
      await notificationScheduler.getAllScheduledNotifications();

    const freeSlotsCount =
      MAX_SCHEDULED_NOTIFICATIONS_SIZE - scheduledNotifications.length;

    const canScheduleMore = freeSlotsCount > 0;

    if (!canScheduleMore) {
      return;
    }

    const queuedNotifications = notificationQueue.get();
    const filteredQueuedNotifications = filterNotificationsByDate(
      queuedNotifications,
      Date.now(),
    );

    await restackNotifications(filteredQueuedNotifications, freeSlotsCount);
  }

  function clearScheduledNotifications() {
    notificationScheduler.cancelAllNotifications();
    notificationQueue.clear();
  }

  async function getNotificationsByEventId(
    eventId: string,
    targetSubjectId: string | null,
  ): Promise<LocalEventTriggerNotification[]> {
    const triggerNotifications =
      await notificationScheduler.getAllScheduledNotifications();

    return triggerNotifications.filter(notification => {
      return (
        notification.notification.data?.eventId === eventId &&
        notification.notification.data?.targetSubjectId === targetSubjectId
      );
    });
  }

  async function cancelNotificationsForEventEntityInTimeInterval(
    eventId: string,
    entityId: string,
    targetSubjectId: string | null,
    timeInterval: { from: number; to: number },
  ) {
    const notificationsForEventId = await getNotificationsByEventId(
      eventId,
      targetSubjectId,
    );

    const cancelNotificationForEventEntityInTimeInterval = (
      notification: LocalEventTriggerNotification,
    ) => {
      const { data, id: notificationId } = notification?.notification || {};
      const { scheduledAt, scheduledAtString } = data || {};
      const shouldCancel =
        timeInterval.from <= scheduledAt && scheduledAt <= timeInterval.to;

      if (notificationId && shouldCancel) {
        logger.log(
          `[NotificationManager.cancelNotificationForEventEntityInTimeInterval]: Notification ${notificationId}, scheduled at ${scheduledAtString}, was canceled because entity ${entityId} is in progress`,
        );
        notificationScheduler
          .cancelNotification(notificationId)
          .catch(console.error);
      }
    };

    for (const notification of notificationsForEventId) {
      cancelNotificationForEventEntityInTimeInterval(notification);
    }
  }

  return {
    mutex: Mutex(),

    scheduleNotifications,
    topUpNotificationsFromQueue,
    clearScheduledNotifications,
    cancelNotificationsForEventEntityInTimeInterval,
  };
}
