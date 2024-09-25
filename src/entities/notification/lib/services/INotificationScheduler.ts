import { LocalEventTriggerNotification } from '../types/notifications';

export type INotificationScheduler = {
  scheduleLocalNotification: (
    triggerNotification: LocalEventTriggerNotification,
  ) => Promise<string>;
  scheduleSystemIOSNotification: (
    fireDate: number,
  ) => Promise<string | undefined>;

  getScheduledNotification: (
    notificationId: string,
  ) => Promise<LocalEventTriggerNotification | undefined>;
  getAllScheduledNotifications: () => Promise<LocalEventTriggerNotification[]>;

  cancelNotification: (notificationId: string) => Promise<void>;
  cancelAllNotifications: () => Promise<void>;
  cancelNotDisplayedNotifications: () => Promise<void>;
};
