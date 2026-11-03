import { Notification } from 'react-native-notify-kit';

export type INotificationRenderer = {
  displayNotification: (notification: Notification) => Promise<void>;
};
