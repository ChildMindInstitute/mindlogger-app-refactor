import { Notification } from '@notifee/react-native';

export type INotificationRenderer = {
  displayNotification: (notification: Notification) => Promise<void>;
};
