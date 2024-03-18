import { createSecureStorage } from '@app/shared/lib';

const storage = createSecureStorage('upload_queue-storage');

export const clearUploadQueueStorage = () => {
  storage.clearAll();
};
