import { getDefaultStorageInstanceManager } from '@shared/lib/storages/storageInstanceManagerInstance.ts';

export const clearUploadQueueStorage = () => {
  getDefaultStorageInstanceManager().getUploadQueueStorage().clearAll();
};
