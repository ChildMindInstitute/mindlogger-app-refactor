import { AppState } from 'react-native';

import NotificationManager from '../NotificationManager';

export async function topUpNotifications() {
  const isForeground = AppState.currentState === 'active';

  if (isForeground) {
    return;
  }

  if (NotificationManager.mutex.isBusy()) {
    console.warn(
      '[AppService.componentDidMount:BackgroundWorker.setTask]: NotificationManagerMutex is busy. Operation rejected',
    );
    return;
  }

  try {
    NotificationManager.mutex.setBusy();

    await NotificationManager.topUpNotificationsFromQueue();

    // TODO Uncomment and modify when debug api endpoint is integrated
    // await debugScheduledNotifications({
    //   actionType: 'backgroundAddition-AppService-componentDidMount',
    // });
  } finally {
    NotificationManager.mutex.release();
  }
}
