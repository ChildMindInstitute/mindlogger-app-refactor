import { getDefaultStorageInstanceManager } from '@app/shared/lib/storages/storageInstanceManagerInstance';

import { NotificationQueue } from './NotificationQueue';

let instance: ReturnType<typeof NotificationQueue>;
export const getDefaultNotificationQueue = () => {
  if (!instance) {
    instance = NotificationQueue(
      getDefaultStorageInstanceManager().getNotificationQueueStorage(),
    );
  }
  return instance;
};
