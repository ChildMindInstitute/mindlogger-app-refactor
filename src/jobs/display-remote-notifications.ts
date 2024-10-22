import messaging from '@react-native-firebase/messaging';

import { getDefaultNotificationRenderer } from '@app/entities/notification/lib/services/notificationRendererInstance';
import {
  RemoteNotification,
  RemoteNotificationPayload,
} from '@app/entities/notification/lib/types/notifications';
import { createJob } from '@app/shared/lib/services/jobManagement';
import { getDefaultLogger } from '@app/shared/lib/services/loggerInstance';

async function onMessageReceived(notification: RemoteNotification) {
  if (notification.data) {
    try {
      const payload = JSON.parse(
        notification.data.message as string,
      ) as RemoteNotificationPayload;

      getDefaultNotificationRenderer().displayNotification({
        title: payload.title,
        body: payload.body,
        data: payload.data,
      });
    } catch (error) {
      getDefaultLogger().log(
        '[onMessageReceived]: Failed to render a notification: ' + notification,
      );
      getDefaultLogger().log('[onMessageReceived]: Error: ' + error);
    }
  }
}

export default createJob(() => {
  messaging().onMessage(onMessageReceived);
  messaging().setBackgroundMessageHandler(onMessageReceived);
});
