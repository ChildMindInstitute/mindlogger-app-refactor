import { TriggerType } from '@notifee/react-native';

import {
  LocalEventTriggerNotification,
  NotificationDescriber,
} from '../../lib';

function mapIdentifiers(notification: NotificationDescriber) {
  return {
    shortId: notification.shortId,
    appletId: notification.appletId,
    eventId: notification.eventId,
    ...(notification.activityId && {
      activityId: notification.activityId,
    }),
    ...(notification.activityFlowId && {
      activityFlowId: notification.activityFlowId,
    }),
  };
}

export function mapToTriggerNotifications(
  notifications: NotificationDescriber[],
): LocalEventTriggerNotification[] {
  return notifications.map(notification => ({
    notification: {
      title: notification.notificationHeader,
      body: notification.notificationBody,
      notificationId: notification.notificationId,
      data: {
        scheduledAt: notification.scheduledAt,
        scheduledAtString: notification.scheduledAtString,
        isLocal: 'true',
        type: 'schedule-event-alert',
        ...mapIdentifiers(notification),
      },
    },
    trigger: {
      type: TriggerType.TIMESTAMP,
      timestamp: notification.scheduledAt,
      alarmManager: {
        allowWhileIdle: true,
      },
    },
  }));
}
