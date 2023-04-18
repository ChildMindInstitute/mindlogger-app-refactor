import {
  AppletNotificationDescribers,
  EventNotificationDescribers,
  NotificationDescriber,
} from '../types';

export const filterNotifications = (
  appletNotifications: AppletNotificationDescribers,
): Array<NotificationDescriber> => {
  let result: Array<NotificationDescriber> = [];

  for (let eventNotifications of appletNotifications.events) {
    for (let notification of eventNotifications.notifications) {
      if (notification.isActive) {
        result.push(notification);
      }
    }
  }

  result = result.sort((a, b) => a.scheduledAt - b.scheduledAt);

  return result;
};

export const filterAppletNotifications = (
  appletNotifications: AppletNotificationDescribers,
): AppletNotificationDescribers => {
  const result: AppletNotificationDescribers = {
    appletId: appletNotifications.appletId,
    appletName: appletNotifications.appletName,
    events: [],
  };

  for (let eventNotifications of appletNotifications.events) {
    const eventsClone: EventNotificationDescribers = {
      ...eventNotifications,
      notifications: [],
    };

    eventsClone.notifications = eventNotifications.notifications.filter(
      x => x.isActive,
    );

    result.events.push(eventsClone);
  }

  return result;
};
