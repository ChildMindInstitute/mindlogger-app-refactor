import { NotificationDescriber } from '../types/notificationBuilder';

export type INotificationQueue = {
  get: () => NotificationDescriber[];
  set: (value: NotificationDescriber[]) => void;
  clear: () => void;
};
