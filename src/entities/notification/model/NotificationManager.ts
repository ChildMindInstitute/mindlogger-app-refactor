import { TimestampTrigger } from '@notifee/react-native';
import { differenceInSeconds } from 'date-fns';

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
  return notifications.filter(notification => {
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

    for (let notification of triggerNotifications) {
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

  async function cancelUpcomingNotificationsForInProgressActivity(
    eventId: string,
    entityId: string,
    interval: number,
    isForeground: boolean,
  ) {
    const cancelNotificationForInProgressActivity = (
      notification: LocalEventTriggerNotification,
    ) => {
      const { data, id: notificationId } = notification?.notification;
      const {
        scheduledAt,
        eventId: notificationEventId,
        scheduledAtString,
      } = data;
      const difference = differenceInSeconds(scheduledAt, Date.now());

      if (
        difference <= interval &&
        notificationEventId === eventId &&
        notificationId &&
        isForeground
      ) {
        Logger.log(
          `[NotificationManager.cancelUpcomingNotificationsForInProgressActivity]: Notification ${notificationId}, scheduled at ${scheduledAtString}, was canceled because entity ${entityId} is in progress`,
        );
        NotificationScheduler.cancelNotification(notificationId);
      }
    };

    const triggerNotifications =
      await NotificationScheduler.getAllScheduledNotifications();

    triggerNotifications.map(cancelNotificationForInProgressActivity);
  }

  return {
    mutex: Mutex(),

    scheduleNotifications,
    topUpNotificationsFromQueue,
    clearScheduledNotifications,
    cancelUpcomingNotificationsForInProgressActivity,
  };
}

export default NotificationManager();
