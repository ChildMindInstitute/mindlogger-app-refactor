import { AppState } from 'react-native';

import {
  LogAction,
  LogTrigger,
} from '@app/shared/api/services/INotificationService';

import { getDefaultNotificationsLogger } from '../../lib/services/notificationsLoggerInstance';
import { getDefaultNotificationManager } from '../notificationManagerInstance';

export async function topUpNotifications() {
  const isForeground = AppState.currentState === 'active';

  if (isForeground) {
    return;
  }

  if (getDefaultNotificationManager().mutex.isBusy()) {
    console.warn(
      '[AppService.componentDidMount:BackgroundWorker.setTask]: NotificationManagerMutex is busy. Operation rejected',
    );
    return;
  }

  try {
    getDefaultNotificationManager().mutex.setBusy();

    await getDefaultNotificationManager().topUpNotificationsFromQueue();

    getDefaultNotificationsLogger().log({
      trigger: LogTrigger.RunBackgroundProcess,
      action: LogAction.ReStack,
    });
  } finally {
    getDefaultNotificationManager().mutex.release();
  }
}
