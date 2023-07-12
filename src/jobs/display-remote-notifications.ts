import messaging from '@react-native-firebase/messaging';

import {
  NotificationRenderer,
  RemoteNotification,
  RemoteNotificationPayload,
} from '@app/entities/notification';
import { createJob } from '@shared/lib';

async function onMessageReceived(notification: RemoteNotification) {
  if (notification.data) {
    try {
      const payload = JSON.parse(
        notification.data.message,
      ) as RemoteNotificationPayload;

      NotificationRenderer.displayNotification({
        id: notification.messageId,
        title: payload.title,
        body: payload.body,
        data: payload.data,
      });
    } catch (error) {
      console.log(
        '[onMessageReceived]: Failed to render a notification: ' + notification,
        'Error: ' + error,
      );
    }
  }
}

export default createJob(() => {
  messaging().onMessage(onMessageReceived);
  messaging().setBackgroundMessageHandler(onMessageReceived);
});
