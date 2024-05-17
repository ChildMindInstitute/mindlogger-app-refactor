import { Platform } from 'react-native';

import notifee, {
  AndroidImportance,
  Notification,
} from '@notifee/react-native';

import { IS_IOS, Logger } from '@app/shared/lib';

import { ANDROID_DEFAULT_CHANNEL_ID } from '../constants';

function NotificationRenderer() {
  async function displayNotification(notification: Notification) {
    try {
      if (IS_IOS) {
        await notifee.requestPermission();
      }

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
          importance: AndroidImportance.HIGH,
        },
      });
    } catch (error) {
      Logger.warn(
        `[NotificationRenderer:displayNotification] OS[${Platform.OS}]: error ${error}`,
      );
    }
  }

  return {
    displayNotification,
  };
}

export default NotificationRenderer();
