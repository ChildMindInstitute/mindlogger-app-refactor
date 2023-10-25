import messaging from '@react-native-firebase/messaging';

import {
  NotificationRenderer,
  RemoteNotification,
  RemoteNotificationPayload,
} from '@app/entities/notification';
import { createJob, Logger } from '@shared/lib';

async function onMessageReceived(notification: RemoteNotification) {
  if (notification.data) {
    try {
      const payload = JSON.parse(
        notification.data.message,
      ) as RemoteNotificationPayload;

      NotificationRenderer.displayNotification({
        title: payload.title,
        body: payload.body,
        data: payload.data,
      });
    } catch (error) {
      Logger.log(
        '[onMessageReceived]: Failed to render a notification: ' + notification,
      );
      Logger.log('[onMessageReceived]: Error: ' + error);
    }
  }
}

export default createJob(() => {
  messaging().onMessage(onMessageReceived);
  messaging().setBackgroundMessageHandler(onMessageReceived);
});
