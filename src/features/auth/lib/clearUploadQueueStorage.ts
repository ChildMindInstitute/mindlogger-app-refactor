import { getDefaultStorageInstanceManager } from '@shared/lib/storages/storageInstanceManagerInstance';

export const clearUploadQueueStorage = () => {
  getDefaultStorageInstanceManager().getUploadQueueStorage().clearAll();
};
