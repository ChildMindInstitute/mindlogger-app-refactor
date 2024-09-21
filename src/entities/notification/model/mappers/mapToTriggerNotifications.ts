import notifee, { TriggerType, AndroidImportance } from '@notifee/react-native';

import { colors } from '@shared/lib';

import {
  ANDROID_DEFAULT_CHANNEL_ID,
  LocalEventTriggerNotification,
  NotificationDescriber,
} from '../../lib';

export async function mapToTriggerNotifications(
  notifications: NotificationDescriber[],
): Promise<LocalEventTriggerNotification[]> {
  const channelId = await notifee.createChannel({
    id: ANDROID_DEFAULT_CHANNEL_ID,
    name: 'Default Channel',
  });

  return notifications.map(notification => ({
    notification: {
      id: notification.notificationId,
      title: notification.notificationHeader,
      body: notification.notificationBody,
      data: {
        scheduledAt: notification.scheduledAt,
        scheduledAtString: notification.scheduledAtString,
        isLocal: 'true',
        type: 'schedule-event-alert',
        shortId: notification.shortId,
        appletId: notification.appletId,
        eventId: notification.eventId,
        entityName: notification.entityName,
        ...(notification.activityId && {
          activityId: notification.activityId,
        }),
        ...(notification.activityFlowId && {
          activityFlowId: notification.activityFlowId,
        }),
        ...(notification.targetSubjectId && {
          targetSubjectId: notification.targetSubjectId,
        }),
      },
      android: {
        channelId,
        pressAction: {
          id: 'default',
        },
        smallIcon: 'ic_notification',
        color: colors.primary,
        importance: AndroidImportance.HIGH,
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
