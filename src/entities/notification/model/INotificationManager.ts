import { IMutex } from '@app/shared/lib/utils/common';

import { NotificationDescriber } from '../lib/types/notificationBuilder';

export type INotificationManager = {
  mutex: IMutex;
  scheduleNotifications: (
    notifications: NotificationDescriber[],
  ) => Promise<void>;
  topUpNotificationsFromQueue: () => Promise<void>;
  clearScheduledNotifications: () => void;
  cancelNotificationsForEventEntityInTimeInterval: (
    eventId: string,
    entityId: string,
    targetSubjectId: string | null,
    timeInterval: { from: number; to: number },
  ) => Promise<void>;
};
