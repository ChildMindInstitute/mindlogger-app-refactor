import { createSecureStorage } from '@app/shared/lib';

export const storage = createSecureStorage('activity_progress-storage');

export const clearActivityStorageRecord = {
  byEventId: (eventId: string) => {
    const recordKeys = storage
      .getAllKeys()
      .filter(keys => keys.includes(eventId));

    recordKeys.forEach(key => storage.delete(key));
  },
};
