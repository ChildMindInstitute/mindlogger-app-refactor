import { AppState } from 'react-native';

import { LogAction, LogTrigger } from '@app/shared/api';

import NotificationsLogger from '../../lib/services/NotificationsLogger';
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

    NotificationsLogger.log({
      trigger: LogTrigger.RunBackgroundProcess,
      action: LogAction.ReStack,
    });
  } finally {
    NotificationManager.mutex.release();
  }
}
