import { Platform } from 'react-native';

import notifee, {
  AndroidImportance,
  Notification,
} from 'react-native-notify-kit';

import { IS_IOS } from '@app/shared/lib/constants';
import { ILogger } from '@app/shared/lib/types/logger';

import { INotificationRenderer } from './INotificationRenderer';
import { ANDROID_DEFAULT_CHANNEL_ID } from '../constants';

export function NotificationRenderer(logger: ILogger): INotificationRenderer {
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
      logger.warn(
        `[NotificationRenderer:displayNotification] OS[${Platform.OS}]: error ${error}`,
      );
    }
  }

  return {
    displayNotification,
  };
}
