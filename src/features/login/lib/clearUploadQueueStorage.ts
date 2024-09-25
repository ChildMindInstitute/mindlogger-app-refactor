import { getDefaultStorageInstanceManager } from '@app/shared/lib/storages/storageInstanceManagerInstance';

export const clearUploadQueueStorage = () => {
  getDefaultStorageInstanceManager().getUploadQueueStorage().clearAll();
};
