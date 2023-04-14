import { Platform } from 'react-native';

import notifee, { Notification } from '@notifee/react-native';

import { ANDROID_DEFAULT_CHANNEL_ID } from '../constants';

function NotificationRenderer() {
  async function displayNotification(notification: Notification) {
    try {
      await notifee.requestPermission();

      const channelId = await notifee.createChannel({
        id: ANDROID_DEFAULT_CHANNEL_ID,
        name: 'Default Channel',
      });

      await notifee.displayNotification({
        ...notification,
        android: {
          channelId,
          pressAction: {
            id: 'default',
          },
        },
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn(`FCM[${Platform.OS}]: error `, error);
    }
  }

  return {
    displayNotification,
  };
}

export default NotificationRenderer();
