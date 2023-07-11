import messaging from '@react-native-firebase/messaging';

import {
  NotificationRenderer,
  RemoteNotification,
} from '@app/entities/notification';
import { createJob, isEmptyObject } from '@shared/lib';

async function onMessageReceived(notification: RemoteNotification) {
  if (notification.data && isEmptyObject(notification.data)) {
    NotificationRenderer.displayNotification({
      id: notification.messageId,
      title: notification.data.title,
      body: notification.data.title,
      data: JSON.parse(notification.data.data),
    });
  }
}

export default createJob(() => {
  messaging().onMessage(onMessageReceived);
  messaging().setBackgroundMessageHandler(onMessageReceived);
});
