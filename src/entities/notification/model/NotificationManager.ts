import { TimestampTrigger } from '@notifee/react-native';

import { Logger, Mutex, splitArray } from '@shared/lib';

import { mapToTriggerNotifications } from './mappers';
import {
  NotificationScheduler,
  NotificationQueue,
  NotificationDescriber,
  MAX_SCHEDULED_NOTIFICATIONS_SIZE,
  SYSTEM_NOTIFICATION_DELAY,
  LocalEventTriggerNotification,
} from '../lib';

function filterNotificationsByDate(
  notifications: NotificationDescriber[],
  date: number,
) {
  return notifications.filter((notification) => {
    return notification.scheduledAt > date;
  });
}

function NotificationManager() {
  async function restackNotifications(
    notifications: NotificationDescriber[],
    amount: number,
  ) {
    const [notificationsToSchedule, notificationsToQueue] = splitArray(
      notifications,
      amount,
    );

    NotificationQueue.set(notificationsToQueue);

    const triggerNotifications = await mapToTriggerNotifications(
      notificationsToSchedule,
    );

    for (const notification of triggerNotifications) {
      await NotificationScheduler.scheduleLocalNotification(notification);
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

    await NotificationScheduler.scheduleSystemIOSNotification(
      systemNotificationDate,
    );
  }

  async function scheduleNotifications(notifications: NotificationDescriber[]) {
    await NotificationScheduler.cancelNotDisplayedNotifications();
    await restackNotifications(notifications, MAX_SCHEDULED_NOTIFICATIONS_SIZE);
  }

  async function topUpNotificationsFromQueue() {
    const scheduledNotifications =
      await NotificationScheduler.getAllScheduledNotifications();

    const freeSlotsCount =
      MAX_SCHEDULED_NOTIFICATIONS_SIZE - scheduledNotifications.length;

    const canScheduleMore = freeSlotsCount > 0;

    if (!canScheduleMore) {
      return;
    }

    const queuedNotifications = NotificationQueue.get();
    const filteredQueuedNotifications = filterNotificationsByDate(
      queuedNotifications,
      Date.now(),
    );

    await restackNotifications(filteredQueuedNotifications, freeSlotsCount);
  }

  function clearScheduledNotifications() {
    NotificationScheduler.cancelAllNotifications();
    NotificationQueue.clear();
  }

  async function getNotificationsByEventId(
    eventId: string,
  ): Promise<LocalEventTriggerNotification[]> {
    const triggerNotifications =
      await NotificationScheduler.getAllScheduledNotifications();

    return triggerNotifications.filter(
      (notification) => notification.notification.data?.eventId === eventId,
    );
  }

  async function cancelNotificationsForEventEntityInTimeInterval(
    eventId: string,
    entityId: string,
    timeInterval: { from: number; to: number },
  ) {
    const notificationsForEventId = await getNotificationsByEventId(eventId);

    const cancelNotificationForEventEntityInTimeInterval = (
      notification: LocalEventTriggerNotification,
    ) => {
      const { data, id: notificationId } = notification?.notification;
      const { scheduledAt, scheduledAtString } = data;
      const shouldCancel =
        timeInterval.from <= scheduledAt && scheduledAt <= timeInterval.to;

      if (notificationId && shouldCancel) {
        Logger.log(
          `[NotificationManager.cancelNotificationForEventEntityInTimeInterval]: Notification ${notificationId}, scheduled at ${scheduledAtString}, was canceled because entity ${entityId} is in progress`,
        );
        NotificationScheduler.cancelNotification(notificationId);
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

export default NotificationManager();
